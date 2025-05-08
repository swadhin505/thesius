import requests
import nltk
from transformers import AutoTokenizer, AutoModel
import openai
from openai import AzureOpenAI
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import langchain
from langchain.prompts import PromptTemplate
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain_community.llms import OpenAI
from IPython.display import display, Markdown
import streamlit as st
import re
from dotenv import load_dotenv
import os
import open_alex_lib
# from api.repository.search_engine import utils_continued

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
    # space between the  query to be removed and replaced with +
    query = query.replace(" ", "+")
    url = f'https://api.semanticscholar.org/graph/v1/paper/search?query={query}&limit={limit}&fields={",".join(fields)}'
    headers = {"Accept": "*/*", "x-api-key": S2_KEY}

    response = requests.get(url, headers=headers)
    return response.json()


# def get_papers(query):
#     try:
#         extracted_topics = utils_continued.extract_topics(query)

#         search_results = []
#         for topic in extracted_topics:
#             search_results += open_alex_lib.fetch_openalex_data(topic, 10)

#         # Deduplicate by unique id
#         search_results = list(
#             {result["id"]: result for result in search_results}.values()
#         )

#         search_results = open_alex_lib.convert_api_to_first_format(search_results)
#         if len(search_results) == 0:
#             print("No results found - Try another query")
#         else:
#             df = pd.DataFrame(search_results).dropna()
#             return df
#     except Exception as e:
#         print(f"An error occurred while searching papers: {e}")


def get_doc_objects_from_df(df):
    """
    Get a list of Document objects from a dataframe
    """
    doc_objects = []
    for i, row in df.iterrows():
        doc_object = langchain.docstore.document.Document(
            page_content=row["abstract"],
            metadata={"source": row["paperId"]},
            lookup_index=i,
        )
        doc_objects.append(doc_object)
    return doc_objects


def rerank(df, query, column_name="fos_abs"):
    # merge columns title and abstract into a string separated by tokenizer.sep_token and store it in a list
    df["fos_abs"] = [
        d["title"]
        for d in df.to_dict("records")
    ]
    df["n_tokens"] = df.fos_abs.apply(lambda x: len(tokenizer.encode(x)))
    doc_embeddings = get_specter_embeddings(list(df[column_name]))
    query_embeddings = get_specter_embeddings(advanced_preprocess_query(query))
    df["specter_embeddings"] = list(doc_embeddings)
    df["similarity"] = cosine_similarity(query_embeddings, doc_embeddings).flatten()

    # sort the dataframe by similarity
    df.sort_values(by="similarity", ascending=False, inplace=True)
    return df, query


# function to preprocess the query and remove the stopwords before passing it to the search function
def preprocess_query(query):
    query = query.lower()
    # remove stopwords from the query
    stopwords = set(nltk.corpus.stopwords.words("english"))
    query = " ".join([word for word in query.split() if word not in stopwords])
    return query


# function to preprocess the query and remove the stopwords before passing it to the search function
def advanced_preprocess_query(query):
    query = query.lower()
    client = AzureOpenAI(
        azure_endpoint=ENDPOINT_URL,
        api_key=AZURE_OPENAI_API_KEY,
        api_version="2024-10-01-preview",
    )
    # Improving the query to make it more detailed
    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {
                "role": "system",
                "content": "You are a skilled assistant who can expand queries without changing the fundamental meaning to make them more descriptive. Your main focus is to look for abbreviations and try expanding them, also don't remove them and vice-versa in the context of the query.",
            },
            {"role": "user", "content": f"Query to be expanded: {query}"},
        ],
    )

    # Extract and return the descriptive response from the assistant
    expanded_query = response.choices[0].message.content

    # remove stopwords from the query
    stopwords = set(nltk.corpus.stopwords.words("english"))
    query = " ".join([word for word in expanded_query.split() if word not in stopwords])
    query = re.sub(r"[^a-zA-Z0-9\s]", "", query)
    print("[+] processed query: ", query)
    return query


def get_specter_embeddings(text):
    # tokenize the text
    tokens = tokenizer(
        text, padding=True, truncation=True, return_tensors="pt", max_length=512
    )
    # get the embeddings
    embeddings = model(**tokens).pooler_output
    # return the embeddings
    return embeddings.detach().numpy()


def create_context(question, df, max_len=3800, size="davinci"):
    """
    Create a context for a question by finding the most similar context from the dataframe
    """

    returns = []
    cur_len = 0

    # Sort by distance and add the text to the context until the context is too long
    for i, row in df.iterrows():

        # Add the length of the text to the current length
        cur_len += row["n_tokens"] + 4

        # If the context is too long, break
        if cur_len > max_len:
            break

        # Else add it to the text that is being returned
        returns.append(row["fos_abs"])

    # Return the context
    return "\n\n###\n\n".join(returns)


def get_langchain_response(docs, query, k=5):
    """
    Get the langchain response for a query. Here we are using the langchain mapreduce function to get the response.
    Prompts here should be played around with. These are the prompts that worked best for us.
    """
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
    """
    Parse the output_text and sources from the chain_out JSON and return a markdown string
    """
    output_text = chain_out["output_text"].split("\n\nSOURCES: ")[0].strip()
    if chain_out["output_text"].endswith("]"):
        sources = eval(chain_out["output_text"].split("SOURCES:")[1].strip())
    else:
        sources = eval(chain_out["output_text"].split("SOURCES:")[1].strip() + '"]')

    # Creating a new JSON with the extracted output_text and sources
    output_text = {"output_text": output_text, "sources": sources}

    # Printing the new JSON
    display(Markdown(f"## Question\n\n"))

    display(Markdown(f"### {query}\n\n"))

    display(Markdown(f"## Answer\n\n"))

    display(Markdown(f"### {output_text['output_text']}\n\n"))

    display(Markdown(f"## Sources: \n\n"))

    # markdown headings for each source
    for source in output_text["sources"]:
        try:
            title = df[df["paperId"] == source]["title"].values[0]
            link = f"https://www.openalex.org/{source}"
            year = df[df["paperId"] == source]["year"].values[0]
            display(Markdown(f"* #### [{title}]({link}) - {year}"))
        except:
            display(Markdown(f"Source not found: {source}"))


def print_papers(df, k=8):
    if len(df) < k:  # Check if the DataFrame has fewer rows than k
        k = len(df)

    content = ""  # Initialize an empty string to accumulate content
    for i in range(k):
        count = i + 1  # Calculate count directly from the loop index
        title = df.iloc[i]["title"]
        link = f"https://openalex.org/works/{df.iloc[i]['paperId']}"
        year = df.iloc[i]["year"]
        markdown_content = f"#### [{count}] [{title}]({link}) - {year}\n"
        display(Markdown(markdown_content))  # Display each paper in Markdown format
        content += markdown_content  # Accumulate the Markdown content

    return content  # Return the accumulated Markdown content


def answer_question_chatgpt(
    df,
    question="What is the impact of creatine on cognition?",
    k=5,
    instructions="Instructions: Using the provided web search results, write a comprehensive reply to the given query. If you find a result relevant definitely make sure to cite the result using [[number](URL)] notation after the reference. End your answer with a summary. A\nQuery:",
    max_len=3000,
    debug=False,
):
    """
    Answer a question based on the most similar context from the dataframe texts
    """
    context = create_context_chatgpt(question, df, k=k)

    try:
        # Create a completions using the question and context
        # prompt = f'''{context} \n\n Instructions: Using the provided literature with sources, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. You can skip a citation which you dont find relevant to the query. \nQuery:{question}\nAnswer:'''
        prompt = f"""{context} \n\n{instructions} {question}\nAnswer:"""
        return prompt
    except Exception as e:
        print(e)
        return ""


def create_context_chatgpt(question, df, k=8):
    """
    Create a context for a question by finding the most similar context from the dataframe
    """

    returns = []
    count = 1
    # Sort by distance and add the text to the context until the context is too long
    for i, row in df[:k].iterrows():

        # Else add it to the text that is being returned
        returns.append(
            "["
            + str(count)
            + "] "
            + row["abstract"]
            + "\nURL: "
            + "https://openalex.org/"
            + row["paperId"]
        )
        count += 1
    # Return the context
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
