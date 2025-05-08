from pydantic import BaseModel, Field
from typing import Union
from datetime import datetime
import api.repository.search_engine.schema as search_engine_schema
from api.routers.schemas import paper_details

class SaveSearchResult(BaseModel):
    _id: str
    user_id: Union[str, int] = Field(..., description="ID of the user saving the result")
    category: str = Field(..., description="Category of the data being saved")
    data: search_engine_schema.QueryResult = Field(..., description="The actual search data to save")
    time: datetime = Field(..., description="Timestamp of when the data was saved")

class SavePaperData(BaseModel):
    _id: str
    user_id: Union[str, int] = Field(..., description="ID of the user saving the result")
    category: str = Field(..., description="Category of the data being saved")
    data: paper_details.PaperResponse = Field(..., description="The actual paper data to save")
    time: datetime = Field(..., description="Timestamp of when the data was saved")