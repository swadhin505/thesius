import { BACKEND_URL } from '@/lib/constants';
import axios from 'axios';

export interface OpenAccessPdf {
  url: string;
  status: string;
}

export interface Tldr {
  model: string;
  text: string;
}

export interface CitationNormalizedPercentile {
  value: number,
  is_in_top_1_percent: boolean,
  is_in_top_10_percent: boolean
}


export const isOpenAccessPdf = (variable: any): variable is OpenAccessPdf =>
  typeof variable?.url === "string" && typeof variable?.status === "string";

export const isTldr = (variable: any): variable is Tldr =>
  typeof variable?.model === "string" && typeof variable?.text === "string";

export const isCitationNormalizedPercentile = (variable: any): variable is CitationNormalizedPercentile =>
  typeof variable?.value === "number" &&
  typeof variable?.is_in_top_1_percent === "boolean" &&
  typeof variable?.is_in_top_10_percent === "boolean";
  
export interface PaperData {
  paperId: string;
  title: string;
  abstract: string;
  venue: string;
  year: string;
  citationCount: number;
  citation_normalized_percentile: CitationNormalizedPercentile | null;
  isOpenAccess: boolean | string;
  openAccessPdf: OpenAccessPdf | null;
  fieldsOfStudy: string[];
  tldr: Tldr | null;
  similarity: number;
  type: string;
}

export interface QueryResult {
  data: PaperData[][];
  query: string
  final_answer: string;
  followup_questions: string[]
}

export const fetchQueryResult = async (query: string): Promise<QueryResult | null> => {
  try {
    const response = await axios.post<QueryResult>(`${BACKEND_URL}/searchpapers/get-results`, { query }, { withCredentials: true });
    console.log(response.data);

    if (response.data) {
      const queryData: QueryResult = {
        ...response.data,
        data: response.data.data.map((paperDataList) =>
          paperDataList.map((paper) => ({
            paperId: paper.paperId,
            title: paper.title,
            abstract: paper.abstract,
            venue: paper.venue,
            year: paper.year,
            citationCount: Number(paper.citationCount),
            citation_normalized_percentile: typeof paper.citation_normalized_percentile === 'string'
              ? safeJsonParseAndCheck<CitationNormalizedPercentile>(paper.citation_normalized_percentile, isCitationNormalizedPercentile)
              : paper.citation_normalized_percentile,
            isOpenAccess: paper.isOpenAccess === 'True' || paper.isOpenAccess === true,
            openAccessPdf: typeof paper.openAccessPdf === 'string'
              ? safeJsonParseAndCheck<OpenAccessPdf>(paper.openAccessPdf, isOpenAccessPdf)
              : paper.openAccessPdf,
            fieldsOfStudy: Array.isArray(paper.fieldsOfStudy) ? paper.fieldsOfStudy : safeJsonParse(paper.fieldsOfStudy) ?? [],
            tldr: typeof paper.tldr === 'string'
              ? safeJsonParseAndCheck<Tldr>(paper.tldr, isTldr)
              : paper.tldr,
            similarity: Number(paper.similarity),
            type: paper.type,
          }))
        ),
      };

      return queryData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching query result:", error);
    return null;
  }
};


export const fetchQueryResultCache = async (): Promise<QueryResult | null> => {
  try {
    const response = await axios.get<QueryResult>(`${BACKEND_URL}/searchpapers/get-results-cache`, {withCredentials: true});

    if (response.data) {
      const queryData: QueryResult = {
        ...response.data,
        data: response.data.data.map((paperDataList) =>
          paperDataList.map((paper) => ({
            paperId: paper.paperId,
            title: paper.title,
            abstract: paper.abstract,
            venue: paper.venue,
            year: paper.year,
            citationCount: Number(paper.citationCount),
            citation_normalized_percentile: typeof paper.citation_normalized_percentile === 'string'
              ? safeJsonParseAndCheck<CitationNormalizedPercentile>(paper.citation_normalized_percentile, isCitationNormalizedPercentile)
              : paper.citation_normalized_percentile,
            isOpenAccess: paper.isOpenAccess === 'True' || paper.isOpenAccess === true,
            openAccessPdf: typeof paper.openAccessPdf === 'string'
              ? safeJsonParseAndCheck<OpenAccessPdf>(paper.openAccessPdf, isOpenAccessPdf)
              : paper.openAccessPdf,
            fieldsOfStudy: Array.isArray(paper.fieldsOfStudy) ? paper.fieldsOfStudy : safeJsonParse(paper.fieldsOfStudy) ?? [],
            tldr: typeof paper.tldr === 'string'
              ? safeJsonParseAndCheck<Tldr>(paper.tldr, isTldr)
              : paper.tldr,
            similarity: Number(paper.similarity),
            type: paper.type,
          }))
        ),
      };

      return queryData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching query result:", error);
    return null;
  }
};

// Enhanced helper function to safely parse Python-like JSON strings
export function safeJsonParse(value: string) {
  try {
    // Replace single quotes with double quotes and handle common Python-style notations
    const jsonCompatible = value
      .replace(/'/g, '"')  // Convert single quotes to double quotes
      .replace(/True/g, 'true')  // Convert Python booleans to JavaScript booleans
      .replace(/False/g, 'false');  // Convert Python booleans to JavaScript booleans

    return JSON.parse(jsonCompatible);
  } catch (error) {
    console.warn("Failed to parse JSON:", value, error);
    return null;
  }
}

// Generic helper function for parsing and validating with type guards
export function safeJsonParseAndCheck<T>(value: string, typeGuard: (variable: any) => variable is T): T | null {
  const parsedValue = safeJsonParse(value);
  return parsedValue && typeGuard(parsedValue) ? parsedValue : null;
}
