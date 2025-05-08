import sys
import os

# Adjust the path to point to the project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

import openai
import pandas as pd
import api.repository.advanced_search_engine.utils as utils_advanced
import api.repository.search_engine.utils as utils
import api.repository.search_engine.test_data as test_data
import nltk
from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

from fastapi.encoders import jsonable_encoder

def get_query_result(query, filterData):
    # df = pd.DataFrame(test_data.dummy_papers)
    print("Entered get papers function")
    '''temporarily commented for testing'''
    df = utils_advanced.get_papers(query, filterData=filterData)

    if df is None:
        return {'data': jsonable_encoder([{}]), 'final_answer': "Sorry, no result found"}
    
    df, query = utils.rerank(df, query, column_name='fos_abs')

    prompt = utils.answer_question_chatgpt(df[:7], query) # prompt designing can be design in declaration location itself cuz already some default have been set
    gpt_response = utils.answer_question(df=df[:7],prompt=prompt, question=query, debug=False)

    # alternate for testing
    # gpt_response = {"gpt_answer": "This is a sample output for testing", "followup_questions":["followup one", "followup two", "followup three"]}

    df = df.drop(columns=['fos_abs', 'n_tokens', 'specter_embeddings'])
    
    # Ensure data is JSON serializable
    df_list = df.astype(str).to_dict(orient='records')

    # Chunk the list into groups of 10
    chunked_data = [df_list[i:i + 7] for i in range(0, len(df_list), 7)]

    response = {
        'data': jsonable_encoder(chunked_data),
        'query': query,
        'final_answer': str(gpt_response["gpt_answer"]),
        'followup_questions': jsonable_encoder(gpt_response["followup_questions"])
    }

    return response

# print(get_query_result(query="what is a retrieval augmented generation ?"))