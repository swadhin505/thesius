import requests
import nltk
from transformers import AutoTokenizer, AutoModel
from openai import AzureOpenAI
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import langchain
from langchain.prompts import PromptTemplate
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain_community.llms import OpenAI
from IPython.display import display, Markdown
import re
from dotenv import load_dotenv
import os
from api.repository.search_engine import open_alex_lib
import torch

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
S2_KEY = os.getenv("S2_KEY")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT_NAME = os.getenv("DEPLOYMENT_NAME")
ENDPOINT_URL = os.getenv("ENDPOINT_URL")
DEPLOYMENT_NAME_MINI = os.getenv("DEPLOYMENT_NAME_MINI")
ENDPOINT_URL_MINI = os.getenv("ENDPOINT_URL_MINI")

tokenizer = AutoTokenizer.from_pretrained("allenai/specter2_base")
model = AutoModel.from_pretrained("allenai/specter2_base")

# Set up tokenizer and model, and ensure they run on GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained("allenai/specter2_base")
model = AutoModel.from_pretrained("allenai/specter2_base").to(device)  # Move model to GPU if available


def search(
    query,
    limit=20,
    fields=[
        "title",
        "abstract",
        "tldr",
        "venue",
        "year",
        "fieldsOfStudy",
        "citationCount",
        "influentialCitationCount",
        "isOpenAccess",
        "openAccessPdf",
    ],
):
    query = query.replace(" ", "+")
    url = f'https://api.semanticscholar.org/graph/v1/paper/search?query={query}&limit={limit}&fields={",".join(fields)}'
    headers = {"Accept": "*/*", "x-api-key": S2_KEY}
    response = requests.get(url, headers=headers)
    return response.json()

def get_papers(query):
    # extracted_topics = utils_continued.extract_topics(query)

    search_results = []
    search_results += open_alex_lib.fetch_openalex_data(query, 50)
    search_results = open_alex_lib.convert_api_to_first_format(search_results)
    
    if len(search_results) == 0:
        print("No results found - Try another query")
    else:
        df = pd.DataFrame(search_results).dropna()
        return df

def get_doc_objects_from_df(df):
    doc_objects = []
    for i, row in df.iterrows():
        doc_object = langchain.docstore.document.Document(
            page_content=row["abstract"],
            metadata={"source": row["paperId"]},
            lookup_index=i,
        )
        doc_objects.append(doc_object)
    return doc_objects


def rerank(df, query, column_name="title_abs"):
    if column_name == "title_abs": 
      df["title_abs"] = [d["title"] + tokenizer.sep_token + d["abstract"] for d in df.to_dict("records")]
      df["n_tokens"] = df.title_abs.apply(lambda x: len(tokenizer.encode(x)))
    elif column_name == "title":
      df["n_tokens"] = df.title.apply(lambda x: len(tokenizer.encode(x)))
    
    # Move embeddings generation to GPU
    doc_embeddings = get_specter_embeddings(list(df[column_name]))
    query_embeddings = get_specter_embeddings(query)
    
    df["specter_embeddings"] = list(doc_embeddings)
    df["similarity"] = cosine_similarity(query_embeddings, doc_embeddings).flatten()
    df.sort_values(by="similarity", ascending=False, inplace=True)
    return df, query


def preprocess_query(query):
    query = query.lower()
    stopwords = set(nltk.corpus.stopwords.words("english"))
    query = " ".join([word for word in query.split() if word not in stopwords])
    return query


def advanced_preprocess_query(query):
    query = query.lower()
    client = AzureOpenAI(
        azure_endpoint=ENDPOINT_URL,
        api_key=AZURE_OPENAI_API_KEY,
        api_version="2024-10-01-preview",
    )

    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        temperature=0,
        messages=[{
            "role": "system",
            "content": "Analyze the input query, and distill the core objective into a concise 10-word summary, demonstrating an understanding of complex, interdisciplinary research topics."
        },
        {"role": "user", "content": f"Query to be expanded: {query}"}],
    )
    expanded_query = response.choices[0].message.content
    stopwords = set(nltk.corpus.stopwords.words("english"))
    query = " ".join([word for word in expanded_query.split() if word not in stopwords])
    query = re.sub(r"[^a-zA-Z0-9\s]", "", query)
    print("[+] processed query: ", query)
    return query


def get_specter_embeddings(text):
    # Move tokenization and embedding generation to GPU
    tokens = tokenizer(text, padding=True, truncation=True, return_tensors="pt", max_length=512).to(device)
    embeddings = model(**tokens).pooler_output
    return embeddings.detach().cpu().numpy()  # Ensure the embeddings are moved to CPU after computation


def create_context(question, df, max_len=3800, size="davinci"):
    returns = []
    cur_len = 0
    for i, row in df.iterrows():
        cur_len += row["n_tokens"] + 4
        if cur_len > max_len:
            break
        returns.append(row["fos_abs"])
    return "\n\n###\n\n".join(returns)


def get_langchain_response(docs, query, k=5):
    question_prompt_template = """Use the following portion of a long document to see if any of the text is relevant to answer the question. 

    {context}
    Question: {question}
    Relevant text, if any:"""
    QUESTION_PROMPT = PromptTemplate(
        template=question_prompt_template, input_variables=["context", "question"]
    )

    combine_prompt_template = """Given the following extracted parts of a scientific paper and a question.  
    If you don't know the answer, just say that you don't know. Don't try to make up an answer.
    Create a final answer with references ("SOURCES")
    ALWAYS return a "SOURCES" part at the end of your answer. Return sources as a list of strings, e.g. ["source1", "source2", ...]

    QUESTION: {question}
    =========
    {summaries}
    =========
    FINAL ANSWER:"""
    COMBINE_PROMPT = PromptTemplate(
        template=combine_prompt_template, input_variables=["summaries", "question"]
    )

    chain = load_qa_with_sources_chain(
        OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY),
        chain_type="map_reduce",
        return_intermediate_steps=True,
        question_prompt=QUESTION_PROMPT,
        combine_prompt=COMBINE_PROMPT,
    )
    chain_out = chain(
        {"input_documents": docs[:k], "question": query}, return_only_outputs=True
    )
    return chain_out


def return_answer_markdown(chain_out, df, query):
    output_text = chain_out["output_text"].split("\n\nSOURCES: ")[0].strip()
    sources = eval(chain_out["output_text"].split("SOURCES:")[1].strip())
    output_text = {"output_text": output_text, "sources": sources}

    display(Markdown(f"## Question\n\n"))
    display(Markdown(f"### {query}\n\n"))
    display(Markdown(f"## Answer\n\n"))
    display(Markdown(f"### {output_text['output_text']}\n\n"))
    display(Markdown(f"## Sources: \n\n"))
    
    for source in output_text["sources"]:
        try:
            title = df[df["paperId"] == source]["title"].values[0]
            link = f"https://www.openalex.org/{source}"
            year = df[df["paperId"] == source]["year"].values[0]
            display(Markdown(f"* #### [{title}]({link}) - {year}"))
        except:
            display(Markdown(f"Source not found: {source}"))


def print_papers(df, k=10):
    if len(df) < k: 
        k = len(df)
    content = ""
    for i in range(k):
        count = i + 1
        title = df.iloc[i]["title"]
        link = f"https://openalex.org/works/{df.iloc[i]['paperId']}"
        year = df.iloc[i]["year"]
        markdown_content = f"#### [{count}] [{title}]({link}) - {year}\n"
        display(Markdown(markdown_content))
        content += markdown_content
    return content


def answer_question_chatgpt(df, question="What is the impact of creatine on cognition?", k=5, instructions="Instructions: Using the provided web search results, write a comprehensive reply to the given query. If you find a result relevant definitely make sure to cite the result using [[number](URL)] notation after the reference. End your answer with a summary. A\nQuery:", max_len=3000, debug=False):
    context = create_context_chatgpt(question, df, k=k)
    prompt = f"""{context} \n\n{instructions} {question}\nAnswer:"""
    return prompt


def create_context_chatgpt(question, df, k=8):
    returns = []
    count = 1
    for i, row in df[:k].iterrows():
        returns.append(
            "[" + str(count) + "] " + row["abstract"] + "\nURL: " + "https://openalex.org/" + row["paperId"]
        )
        count += 1
    return "\n\n".join(returns)

def answer_question(
    df,
    prompt,
    model=DEPLOYMENT_NAME,
    question="What is the impact of creatine on cognition?",
    max_len=3800,
    size="ada",
    debug=False,
    max_tokens=1000,
    stop_sequence=None,
):
    """
    Answer a question based on the most similar context from the dataframe texts.
    """

    try:
        # Create a completion using the question and context
        main_client = AzureOpenAI(
            azure_endpoint=ENDPOINT_URL,
            api_key=AZURE_OPENAI_API_KEY,
            api_version="2024-10-01-preview",
        )
        response = main_client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful research assistant who answers based on the provided context.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            stop=stop_sequence,
            temperature=0.7,
        )

        # Follow-up questions
        from pydantic import BaseModel

        followup_client = AzureOpenAI(
            azure_endpoint=ENDPOINT_URL_MINI,
            api_key=AZURE_OPENAI_API_KEY,
            api_version="2024-10-01-preview",
        )

        class Followups(BaseModel):
            followup_questions: list[str]

        response_followup = followup_client.beta.chat.completions.parse(
            model=DEPLOYMENT_NAME_MINI,
            messages=[
                {
                    "role": "system",
                    "content": "You are a research expert. You will be given a research question, generate a list of 3 most suitable follow-up or related questions in the format provided.",
                },
                {"role": "user", "content": f"Research Question: {question}"},
            ],
            response_format=Followups,
        )

        gpt_response = response.choices[0].message.content
        printed_papers = print_papers(df, k=8)
        gpt_response += f"\n\n ### Sources: \n {printed_papers}"
        followup_response = response_followup.choices[0].message.parsed

        return {
            "gpt_answer": gpt_response,
            "followup_questions": followup_response.followup_questions,
        }

    except Exception as e:
        print(e)
        return {"gpt_answer": "", "followup_questions": []}
