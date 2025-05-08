# Pydantic Model
from pydantic import BaseModel
from typing import List

class Topic(BaseModel):
    display_name: str
    only_id: str