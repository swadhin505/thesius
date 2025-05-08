from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel
from api.repository.search_engine.main import get_query_result
from api.repository.search_engine.schema import *
from api.routers.schemas import search_engine as sr_schema_router
from api.deps import user_dependency

from api.repository.abstract_rag.utils.markdown_generator import organize_papers_to_markdown
from api.repository.abstract_rag.utils.markdown_splitter import split_markdown_by_headers
from api.repository.abstract_rag.utils.conv_rag_paper_data import convert_paper_data_to_dict
from api.repository.abstract_rag.utils.vectorstore_operations import upload_to_pinecone_vectorstore, delete_namespace_from_index

# Redis function imports
from api.repository.redis_operations import redis_operations

# Do all the RAG setup
from api.repository.abstract_rag import rag_setup
from api.repository.abstract_rag.utils.Chatbot import MultiTenantRetrievalChainManager
import asyncio

CHAIN_MANAGER = MultiTenantRetrievalChainManager()

router = APIRouter(
    prefix='/searchpapers',
    tags=['search_features']
)

class QueryModel(BaseModel):
    query: str

@router.post("/get-results")
async def get_query_result_endpoint(query: QueryModel, user: user_dependency):
    try:
        # Wrap synchronous function in asyncio.to_thread
        result = await asyncio.to_thread(get_query_result, query.query)

        # Store the data in cache (ensure this is also async-compatible)
        await asyncio.to_thread(redis_operations.store_json, f"search-result:{user['id']}", result)

        print("Event after redis store operation")

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-results-cache")
async def get_search_result_cache(user: user_dependency):
    try:
        # Fetch the data from cache
        result = await asyncio.to_thread(redis_operations.fetch_json, f"search-result:{user['id']}")

        if "error" in result:
            print(f"Cache fetch error: {result['error']}")
            raise HTTPException(status_code=404, detail=result["error"])

        return result["data"]

    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.post("/get-only-answer")
async def get_only_answer_endpoint(parcel: sr_schema_router.PaperList , user: user_dependency):
    try:
        # Wrap synchronous function in asyncio.to_thread
        result = await asyncio.to_thread(get_query_result, parcel.query, parcel.paper_data)

        return {
            "query": result["query"], # string
            "final_answer": result["final_answer"], # string
            "followup_questions": result["followup_questions"] # List
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-rag-data")
async def send_rag_data_endpoint(data: RagDataProps, user: user_dependency):
    try:
        converted_papers = convert_paper_data_to_dict(data.renderedPapers)
        markdown_document = organize_papers_to_markdown(converted_papers)
        md_header_splits = split_markdown_by_headers(markdown_document)

        # Ensure upload_to_pinecone_vectorstore is non-blocking
        docsearch = await asyncio.to_thread(
            upload_to_pinecone_vectorstore,
            md_header_splits,
            rag_setup.index_name,
            rag_setup.embeddings,
            f"{user['id']}"
        )

        # CHAIN_MANAGER methods should be async-safe
        await asyncio.to_thread(
            CHAIN_MANAGER.get_or_create_chain,
            user_id=f"{user['id']}",
            docsearch=docsearch,
            create_new_chain=True
        )

        return {"message": "Data received successfully"}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multiabstract-chat/query")
async def ask_question_about_selected_papers(query: QueryModel, user: user_dependency):
    try:
        print(query.query)
        retriever = CHAIN_MANAGER.user_chains.get(f"{user['id']}")
        if not retriever:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        # Ensure retriever.invoke is non-blocking
        answer = await asyncio.to_thread(retriever.invoke, {"input": query.query})
        return {"rag_response": answer['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/multiabstract-chat/delete-session")
async def delete_chat_session(user: user_dependency):
    try:
        # Ensure delete_user_chain and delete_namespace_from_index are non-blocking
        await asyncio.to_thread(CHAIN_MANAGER.delete_user_chain, f"{user['id']}")
        await asyncio.to_thread(delete_namespace_from_index, rag_setup.index_name, f"{user['id']}")

        return {"message": "Chat session closed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
