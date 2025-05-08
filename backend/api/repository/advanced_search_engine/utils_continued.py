import nltk
import openai
import re
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()


# function to preprocess the query and remove the stopwords before passing it to the search function
def advanced_preprocess_query(query):
    query = query.lower()

    # Improving the query to make it more detailed
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
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

def extract_topics(query):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    class ListOfResearchTopics(BaseModel):
        list_of_topic_keyword_domain: list[str]

    sys_prompt = """You are a research expert specializing in identifying and extracting the most relevant research keywords, topics, and domains from complex user queries.
    Examples:

    Query:
    How can hybrid quantum-classical algorithms be integrated with topological data analysis to optimize protein-ligand interaction predictions in drug discovery, leveraging advances in cryo-EM and molecular dynamics simulations?
    Extraction:
    python
    [
        "Hybrid quantum-classical algorithms",
        "Topological data analysis (TDA)",
        "Protein-ligand interaction",
        "Cryo-electron microscopy (cryo-EM)",
        "Molecular dynamics simulations"
    ]

    Query:
    How can generative adversarial networks (GANs) be combined with differential geometry to improve the resolution of satellite imagery for geospatial analysis in climate modeling?
    Extraction:
    python
    [
        "Generative adversarial networks (GANs)",
        "Differential geometry",
        "Satellite imagery",
        "Geospatial analysis",
        "Climate modeling"
    ]

    Query:
    What role do multi-modal transformers play in integrating neuroimaging, genomics, and cognitive modeling for early detection of neurodegenerative diseases?
    Extraction:
    python
    [
        "Multi-modal transformers",
        "Neuroimaging",
        "Genomics",
        "Cognitive modeling",
        "Neurodegenerative diseases"
    ]

    Query:
    How can swarm intelligence techniques be adapted for the control of autonomous drone fleets in disaster management scenarios using real-time sensor fusion and reinforcement learning?
    Extraction:
    python
    [
        "Swarm intelligence",
        "Autonomous drone fleets",
        "Disaster management",
        "Real-time sensor fusion",
        "Reinforcement learning"
    ]

    Query:
    How can bioinformatics pipelines utilizing graph neural networks (GNNs) and CRISPR-based data integrate cellular lineage tracing for precision gene therapy development?
    Extraction:
    python
    [
        "Graph neural networks (GNNs)",
        "CRISPR-based data",
        "Cellular lineage tracing",
        "Bioinformatics pipelines",
        "Precision gene therapy"
    ]
    """

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": sys_prompt},
            {
                "role": "user",
                "content": query,
            },
        ],
        response_format=ListOfResearchTopics,
    )

    event = completion.choices[0].message.parsed

    print(event)

    return event.list_of_topic_keyword_domain