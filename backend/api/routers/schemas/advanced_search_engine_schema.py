from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


class ResourceType(BaseModel):
    display_name: str
    description: str

class Topic(BaseModel):
    display_name: str
    only_id: str

class FilterData(BaseModel):
    query: str
    # selectedTopics: List[Topic]
    publishedSince: str
    openAccess: bool
    citations: str
    # selectedSourceTypes: List[ResourceType]