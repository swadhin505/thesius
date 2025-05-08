from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from typing import List
import asyncio
import httpx
from api.routers.schemas.paper_details import PaperResponse
from api.repository.scrapeRelated.scrape_related_pdfs import search_bing_for_pdf
from api.deps import user_dependency
from api.repository.redis_operations import redis_operations
from api.repository.paper_details import fetch_paper_details

SEMANTIC_SCHOLAR_API_URL = "https://api.semanticscholar.org/v1/paper"

router = APIRouter(
    prefix='/paper-details',
    tags=['paper-details']
)

@router.get("/{paper_id}", response_description="Paper details")
async def get_paper_details(paper_id: str, user: user_dependency):
    # Fetch cache data in a non-blocking way
    result = await asyncio.to_thread(redis_operations.fetch_json, key=f"paper_details:{user['id']}")
    
    if "error" not in result:
        if paper_id == result["data"]["paperId"]:
            print("Cache is already present")
            return result["data"]
    else:
        print(f"Cache fetch error: {result['error']}")

    try:
        print("Cache is absent")
        
        # Wrap potentially blocking fetch calls
        paper_details = await asyncio.to_thread(fetch_paper_details.fetch_openalex_work_details, paper_id)

        citation_data = await asyncio.to_thread(
            fetch_paper_details.fetch_cites_reference_cards, paper_id, "citation"
        )
        citation_data = await asyncio.to_thread(fetch_paper_details.convert_cited_reference_data, citation_data[:20])

        reference_data = await asyncio.to_thread(
            fetch_paper_details.fetch_cites_reference_cards, paper_id, "reference"
        )
        reference_data = await asyncio.to_thread(fetch_paper_details.convert_cited_reference_data, reference_data)

        paper_details = await asyncio.to_thread(
            fetch_paper_details.convert_api_to_first_format, paper_details, citation_data, reference_data
        )

        # Store in cache
        await asyncio.to_thread(redis_operations.store_json, key=f"paper_details:{user['id']}", json_data=paper_details)

        return paper_details

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Paper not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while fetching the paper details")

@router.get("/related-pdfs/{query}", response_description="Paper details")
async def get_related_pdf_links(query: str, user: user_dependency):
    # Fetch cache data in a non-blocking way
    cache_data = await asyncio.to_thread(redis_operations.fetch_json, key=f"web_results:{user['id']}")

    if "error" not in cache_data:
        if cache_data["data"] and cache_data["data"]["query"] == query:
            # print("returning cached web_results")
            return {"results": cache_data["data"]["web_results"]}
    else:
        print(f"Cache fetch error: {cache_data['error']}")

    try:
        # Non-blocking call to search_bing_for_pdf (ensure it's async-compatible)
        web_results = await search_bing_for_pdf(query)

        cache_parcel = {"query": query, "web_results": web_results}

        # Store in cache
        await asyncio.to_thread(redis_operations.store_json, key=f"web_results:{user['id']}", json_data=cache_parcel)

        return {"results": web_results}
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="No results from web")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while searching for pdfs")
