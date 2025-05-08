import { ResourceType } from "@/components/tool-comp/search-papers-comp/SubComponents/Filtering/FilterBox";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { Topic } from "./fetchTopics";
import { PaperData, QueryResult, isCitationNormalizedPercentile, isOpenAccessPdf, OpenAccessPdf, isTldr, CitationNormalizedPercentile, safeJsonParse, safeJsonParseAndCheck, Tldr } from "../searchengine/fetchResponse";

export interface FilterData {
  query: string;
  // selectedTopics: Topic[];
  publishedSince: string;
  openAccess: boolean;
  citations: string;
  // selectedSourceTypes: ResourceType[];
}

export const fetchAnswerAdvanced = async (data: FilterData): Promise<QueryResult | null> => {
  try {
    const response = await axios.post<QueryResult>(
      `${BACKEND_URL}/searchpapers-advanced/get-results`, // Replace with your backend URL
      data,
      { withCredentials: true }
    );
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
