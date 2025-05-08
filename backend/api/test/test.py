import nltk
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
import json
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

# function to preprocess the query and remove the stopwords before passing it to the search function
# def preprocess_query(query):
#     query = query.lower()
#     # remove stopwords from the query
#     stopwords = set(nltk.corpus.stopwords.words("english"))
#     query = " ".join([word for word in query.split() if word not in stopwords])
#     return query

def get_papers(query):
    try:
        # extracted_topics = utils_continued.extract_topics(query)

        search_results = []
        search_results += open_alex_lib.fetch_openalex_data(query, 200)

        # Deduplicate by unique id
        search_results = list(
            {result["id"]: result for result in search_results}.values()
        )

        search_results = open_alex_lib.convert_api_to_first_format(search_results)
        if len(search_results) == 0:
            print("No results found - Try another query")
        else:
            df = pd.DataFrame(search_results).dropna()
            return df
    except Exception as e:
        print(f"An error occurred while searching papers: {e}")


import sys
import os

# Adjust the path to point to the project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

import openai
import pandas as pd
import utils
# import api.repository.search_engine.test_data as test_data
import nltk
from dotenv import load_dotenv
import os

nltk.download("stopwords")
load_dotenv()


from fastapi.encoders import jsonable_encoder

def get_query_result(query, paper_data=None):
    # df = pd.DataFrame(test_data.dummy_papers)

    '''temporarily commented for testing'''
    if paper_data == None:
        df = get_papers(query)
    else:
        paper_data = [paper.dict() for paper in paper_data]
        df = pd.DataFrame(paper_data).dropna()

    if df is None:
        return {'data': jsonable_encoder([{}]), 'final_answer': "Sorry, no result found"}
    
    
    # df, query = utils.rerank(df, query, column_name='fos_abs')

    # alternate for testing
    # gpt_response = {"gpt_answer": "This is a sample output for testing", "followup_questions":["followup one", "followup two", "followup three"]}

    # df = df.drop(columns=['fos_abs', 'n_tokens', 'specter_embeddings'])

    return df

def save_query_result(query, paper_data=None, file_path='query_result.json'):
    if paper_data is None:
        df = get_papers(query)
    else:
        paper_data = [paper.dict() for paper in paper_data]
        df = pd.DataFrame(paper_data).dropna()
    
    if df is None or df.empty:
        result = {'data': jsonable_encoder([{}]), 'final_answer': "Sorry, no result found"}
    else:
        df, query = utils.rerank(df, query, column_name='fos_abs')
        df = df.drop(columns=['fos_abs', 'n_tokens', 'specter_embeddings'])
        result = df.to_dict(orient='records')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)
    
    return file_path

query = "How can machine learning algorithms improve the accuracy of software bug detection?"

print(save_query_result(query))