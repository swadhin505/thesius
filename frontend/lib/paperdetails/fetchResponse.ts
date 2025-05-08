import axios from "axios";
import { AllRelatedPapersLinks, PaperResponse } from "./schema";
import { BACKEND_URL } from "../constants";

export async function fetchPaperDetails(paperId: string): Promise<PaperResponse> {
    try {
        const response = await axios.get(`${BACKEND_URL}/paper-details/${paperId}`, {
            withCredentials: true
        });
        return response.data as PaperResponse;
    } catch (error) {
        console.error("Error fetching paper details:", error);
        throw error;
    }
}

export async function SearchRelatedPaperPdfLinks(query: string): Promise<AllRelatedPapersLinks> {
    try {
        const response = await axios.get(`${BACKEND_URL}/paper-details/related-pdfs/${query}`, {
            withCredentials: true
        });
        return response.data as AllRelatedPapersLinks;
    } catch (error) {
        console.error("Error fetching related paper PDF links:", error);
        throw error;
    }
}
