from fastapi import HTTPException, APIRouter
from api.deps import user_dependency
from api.mongodb_setup import search_results_collection
from datetime import datetime, timezone
import api.repository.search_engine.schema as search_engine_schema
from bson import ObjectId
from fastapi import HTTPException, Path
import json


router = APIRouter(
    prefix='/save-search-results',
    tags=['saving-search-results']
)

@router.post("/add-item", response_description="search results")
async def add_search_result(searchData: search_engine_schema.searchDataResponse, user: user_dependency):
    """
    Save search result for a user with timestamp.
    """

    # Convert Pydantic model (including nested models) to a dictionary
    search_data_dict = searchData.searchData.model_dump(by_alias=True, exclude_unset=True)
    data = {
        "user_id": user["id"],
        "category": "search-result",
        "data": search_data_dict,
        "time": datetime.now(timezone.utc)  # Use UTC for consistent timestamps
    }
    search_results_collection.insert_one(data)
    return {"message": "Saved the search-result successfully"}


@router.get("/get-all-items", response_description="search results")
async def get_search_results(user: user_dependency):
    """
    Retrieve all search results for the user, sorted by time (latest first).
    """
    results = search_results_collection.find(
        {"user_id": user["id"]}  # Filter by user ID
    ).sort("time", -1)  # Sort by time in descending order

    # Convert results to a list and process `_id` to string
    results_list = []
    for result in results:
        result["_id"] = str(result["_id"])  # Convert ObjectId to string
        results_list.append(result)

    if not results_list:
        raise HTTPException(status_code=404, detail="No search results found for this user")
    
    return results_list

@router.get("/get-item/{item_id}", response_description="Retrieve a single search results")
async def get_single_result(item_id: str, user: user_dependency):
    """
    Retrieve a single search result for the user by item ID.
    """
    print(item_id)
    # item_id = json.loads(item_id)
    # print(item_id["resultId"])
    try:
        # Convert item_id to ObjectId
        object_id = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")
    result = search_results_collection.find_one(
        {"user_id": user["id"], "_id": object_id}  # Match user ID and item ID
    )

    if not result:
        raise HTTPException(status_code=404, detail="Search result not found")
    # result.pop("_id")  # Optional: Remove the MongoDB `_id` field from the response
    # Convert the ObjectId `_id` to a string if necessary
    result["_id"] = str(result["_id"])
    
    return result


@router.delete("/delete-item/{item_id}", response_description="Delete a single search result")
async def delete_single_result(item_id: str, user: user_dependency):
    """
    Delete a single search result for the user by item ID.
    """
    try:
        # Convert item_id to ObjectId
        object_id = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")
    
    delete_result = search_results_collection.delete_one(
        {"user_id": user["id"], "_id": object_id}  # Match user ID and item ID
    )
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Search result not found")
    return {"message": "Search result deleted successfully"}


@router.delete("/delete-all", response_description="Delete all search results for a user")
async def delete_all_results(user: user_dependency):
    """
    Delete all search results for the user.
    """
    delete_result = search_results_collection.delete_many({"user_id": user["id"]})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No search results found for this user")
    return {"message": f"Deleted {delete_result.deleted_count} search results successfully"}
