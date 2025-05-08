import sys
import os

# Adjust the path to point to the project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

import openai
import pandas as pd
import api.repository.search_engine.utils as utils
import api.repository.search_engine.test_data as test_data
import nltk
from dotenv import load_dotenv
import os

nltk.download("stopwords")
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

from fastapi.encoders import jsonable_encoder

def get_query_result(query, paper_data=None):
    # Concising the query
    query_for_search = utils.advanced_preprocess_query(query)

    if paper_data is None:
        df1 = utils.get_papers(query)
        df2 = utils.get_papers(query_for_search)

        df = pd.concat([pd.DataFrame(df1), pd.DataFrame(df2)]).drop_duplicates(subset=["title"]).reset_index(drop=True)
    else:
        paper_data = [paper.dict() for paper in paper_data]
        df = pd.DataFrame(paper_data).dropna()

    if df is None or df.empty:
        return {'data': jsonable_encoder([{}]), 'final_answer': "Sorry, no result found"}
    else:
        df, query = utils.rerank(df, query, column_name="title")
        ans_df, query = utils.rerank(df[:10], query)

        prompt = utils.answer_question_chatgpt(ans_df, query) # prompt designing can be design in declaration location itself cuz already some default have been set
        gpt_response = utils.answer_question(df=ans_df,prompt=prompt, question=query, debug=False)

        df = df.drop(columns=['n_tokens', 'specter_embeddings'])

    # Ensure data is JSON serializable
    df_list = df.astype(str).to_dict(orient='records')

    # Chunk the list into groups of 10
    chunked_data = [df_list[i:i + 10] for i in range(0, len(df_list), 10)]

    response = {
        'data': jsonable_encoder(chunked_data),
        'query': query,
        'final_answer': str(gpt_response["gpt_answer"]),
        'followup_questions': jsonable_encoder(gpt_response["followup_questions"])
    }

    return response

# print(get_query_result(query="what is a retrieval augmented generation ?"))