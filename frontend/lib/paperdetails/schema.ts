// interfaces.ts

export interface citationNormalizedPercentileSchema {
    value: number;
    is_in_top_1_percent: boolean;
    is_in_top_10_percent: boolean;
};

export interface openAccessPdfSchema {
    url: string | undefined;
    status: string;
};

export interface authorSchema {
    authorId: string;
    name: string;
    url: string;
};

export interface CitationorReference {
    paperId: string;
    url: string;
    title: string;
    abstract: string | null;
    venue: string | null;
    year: number;
    referenceCount: number;
    citationCount: number;
    citation_normalized_percentile: citationNormalizedPercentileSchema;
    isOpenAccess: boolean;
    openAccessPdf: openAccessPdfSchema;
    fieldsOfStudy: [string];
    tldr: string | null;
    similarity: number | null;
    type: string
};

export interface PaperResponse {
    paperId: string;
    url: string;
    title: string;
    abstract: string | null;
    venue: string | null;
    year: number;
    referenceCount: number;
    citationCount: number;
    citation_normalized_percentile: citationNormalizedPercentileSchema;
    isOpenAccess: boolean;
    openAccessPdf: openAccessPdfSchema;
    fieldsOfStudy: [string];
    tldr: string | null;
    authors: authorSchema[];
    citations: CitationorReference[];
    references: CitationorReference[];
    type: string
}

export interface RelatedPapersLink {
    title: string;
    description: string;
    url: string
}

export interface AllRelatedPapersLinks {
    results: RelatedPapersLink[]
}