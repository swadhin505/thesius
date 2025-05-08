from pydantic import BaseModel
from typing import List, Optional

# Define Pydantic models for OpenAccessPdf and Tldr
class OpenAccessPdf(BaseModel):
    url: str
    status: str

class Tldr(BaseModel):
    model: str
    text: str

class CitationNormalizedPercentile(BaseModel):
    value: float
    is_in_top_1_percent: bool
    is_in_top_10_percent: bool

# Updated PaperData model
class PaperData(BaseModel):
    paperId: str
    title: str
    abstract: str
    venue: str
    year: str
    citationCount: int
    citation_normalized_percentile: Optional[CitationNormalizedPercentile]
    isOpenAccess: bool
    openAccessPdf: Optional[OpenAccessPdf]  # Nullable field
    fieldsOfStudy: List[str]
    tldr: Optional[Tldr]  # Nullable field
    similarity: float
    type: str

# QueryResult
class QueryResult(BaseModel):
    data: List[List[PaperData]]
    query: str
    final_answer: str
    followup_questions: List[str]

class searchDataResponse(BaseModel):
    searchData: QueryResult

# Updated RagDataProps model
class RagDataProps(BaseModel):
    renderedPapers: List[PaperData]
    create_new_chat_instance: bool

