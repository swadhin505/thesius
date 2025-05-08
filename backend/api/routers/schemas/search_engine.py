import api.repository.search_engine.schema as sr_schema
from pydantic import BaseModel
from typing import List, Optional

class PaperList(BaseModel):
    query: str;
    paper_data: List[sr_schema.PaperData]
    
