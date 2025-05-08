from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel
from api.repository.advanced_search_engine.main import load_embeddings_from_csv, fine_tune_with_llm, filter_with_semantic_search
from api.repository.advanced_search_engine.schema import *
from api.repository.advanced_search_engine.utils import get_papers
from api.repository.advanced_search_engine import get_result
from api.routers.schemas import advanced_search_engine_schema
from api.deps import user_dependency
import os

# Redis function imports
from api.repository.redis_operations import redis_operations

import asyncio

router = APIRouter(
    prefix='/searchpapers-advanced',
    tags=['search_features']
)

class QueryModel(BaseModel):
    query: str

@router.post("/get-topics-from-query")
async def get_topics_from_query(query: QueryModel, user: user_dependency):
    try:
        # Wrap synchronous function in asyncio.to_thread
        loaded_options, loaded_embeddings = await asyncio.to_thread(load_embeddings_from_csv, "./api/repository/advanced_search_engine/options_with_embeddings.csv")
        # Use semantic search to pre-filter options
        top_options = await asyncio.to_thread(filter_with_semantic_search, query.query, loaded_options, loaded_embeddings, top_k=20)
        # Use LLM for final selection
        final_options = await asyncio.to_thread(fine_tune_with_llm, query.query, top_options, deployment_name=os.getenv("DEPLOYMENT_NAME"))

        # Store the data in cache (ensure this is also async-compatible)
        await asyncio.to_thread(redis_operations.store_json, f"query-topics:{user['id']}", final_options)

        # print("Event after redis store operation")

        return final_options

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-topics-from-query-cache")
async def get_topics_from_query_cache(user: user_dependency):
    try:
        # Fetch the data from cache
        result = await asyncio.to_thread(redis_operations.fetch_json, f"query-topics:{user['id']}")

        if "error" in result:
            print(f"Cache fetch error: {result['error']}")
            raise HTTPException(status_code=404, detail=result["error"])

        return result["data"]

    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.post("/get-results")
async def get_advanced_query_result_endpoint(data: advanced_search_engine_schema.FilterData, user: user_dependency):
    print("Get advanced results endpoint called")
    if data.citations == "":
        data.citations = "0"

    if data.publishedSince == "All":
        data.publishedSince = "1000"

    try: 
        result = await asyncio.to_thread(get_result.get_query_result, data.query, data)

        # Store the data in cache (ensure this is also async-compatible)
        await asyncio.to_thread(redis_operations.store_json, f"search-result:{user['id']}", result)

        print("Event after redis store operation")

        return result

    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")