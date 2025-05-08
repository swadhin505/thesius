from typing import List, Optional
from pydantic import BaseModel

class CitationNormalizedPercentileSchema(BaseModel):
    value: float
    is_in_top_1_percent: bool
    is_in_top_10_percent: bool

class OpenAccessPdfSchema(BaseModel):
    url: str
    status: str

class AuthorSchema(BaseModel):
    authorId: str
    name: str
    url: str

class CitationOrReference(BaseModel):
    paperId: str
    url: str
    title: str
    abstract: Optional[str]
    venue: Optional[str]
    year: int
    referenceCount: int
    citationCount: int
    citation_normalized_percentile: CitationNormalizedPercentileSchema
    isOpenAccess: bool
    openAccessPdf: OpenAccessPdfSchema
    fieldsOfStudy: List[str]
    tldr: Optional[str]
    type: str

class PaperResponse(BaseModel):
    paperId: str
    url: str
    title: str
    abstract: Optional[str]
    venue: Optional[str]
    year: int
    referenceCount: int
    citationCount: int
    citation_normalized_percentile: CitationNormalizedPercentileSchema
    isOpenAccess: bool
    openAccessPdf: OpenAccessPdfSchema
    fieldsOfStudy: List[str]
    tldr: Optional[str]
    authors: List[AuthorSchema]
    citations: List[CitationOrReference]
    references: List[CitationOrReference]
    type: str

class RelatedPapersLink(BaseModel):
    title: str
    description: str
    url: str

class AllRelatedPapersLinks(BaseModel):
    results: List[RelatedPapersLink]

class paperDataResponse(BaseModel):
    paperData: PaperResponse