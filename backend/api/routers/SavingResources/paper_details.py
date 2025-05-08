from fastapi import HTTPException, APIRouter
from api.deps import user_dependency
from api.mongodb_setup import paper_details_collection
from datetime import datetime, timezone
from api.routers.schemas import paper_details
from bson import ObjectId
from fastapi import HTTPException, Path
import json


router = APIRouter(
    prefix='/save-paper-details',
    tags=['saving-paper-details']
)

@router.post("/add-item", response_description="Paper details")
async def add_paper_result(paperData: dict, user: user_dependency):
    """
    Save paper details for a user with timestamp.
    """
    print(paperData)
    data = {
        "user_id": user["id"],
        "category": "paper-details",
        "data": paperData["paperData"],
        "time": datetime.now(timezone.utc)  # Use UTC for consistent timestamps
    }
    paper_details_collection.insert_one(data)
    return {"message": "Saved the paper-details successfully"}

@router.get("/get-all-items", response_description="Paper details")
async def get_paper_results(user: user_dependency):
    """
    Retrieve all paper details for the user, sorted by time (latest first).
    """
    results = list(
        paper_details_collection.find(
            {"user_id": user["id"]},  # Filter by user ID
        ).sort("time", -1)  # Sort by time in descending order
    )

    # Convert results to a list and process `_id` to string
    results_list = []
    for result in results:
        result["_id"] = str(result["_id"])  # Convert ObjectId to string
        results_list.append(result)
    
    if not results:
        raise HTTPException(status_code=404, detail="No paper details found for this user")
    return results_list

@router.get("/get-item/{item_id}", response_description="Retrieve a single paper detail")
async def get_single_result(item_id: str, user: user_dependency):
    """
    Retrieve a single paper details for the user by item ID.
    """
    try:
        # Convert item_id to ObjectId
        object_id = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")
    result = paper_details_collection.find_one(
        {"user_id": user["id"], "_id": object_id}  # Match user ID and item ID
    )
    if not result:
        raise HTTPException(status_code=404, detail="paper details not found")
    # Convert the ObjectId `_id` to a string if necessary
    result["_id"] = str(result["_id"])

    return result


@router.delete("/delete-item/{item_id}", response_description="Delete a single paper detail")
async def delete_single_result(item_id: str, user: user_dependency):
    """
    Delete a single paper details for the user by item ID.
    """
    try:
        # Convert item_id to ObjectId
        object_id = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")
    
    delete_result = paper_details_collection.delete_one(
        {"user_id": user["id"], "_id": object_id}  # Match user ID and item ID
    )
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="paper details not found")
    return {"message": "paper details deleted successfully"}


@router.delete("/delete-all", response_description="Delete all paper details for a user")
async def delete_all_results(user: user_dependency):
    """
    Delete all paper detailss for the user.
    """
    delete_result = paper_details_collection.delete_many({"user_id": user["id"]})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No paper details found for this user")
    return {"message": f"Deleted {delete_result.deleted_count} paper details successfully"}
