import { PaperResponse } from "../paperdetails/schema";
import { QueryResult } from "../tools/searchengine/fetchResponse";

export interface SavedSearchResult {
    _id: string;
    user_id: string | number; // ID of the user saving the result
    category: string; // Category of the data being saved
    data: QueryResult; // The actual search data (can be nested/complex)
    time: string; // ISO 8601 formatted timestamp
  }

export interface SavedPaperDataResponse {
    _id: string;
    user_id: string | number; // ID of the user saving the result
    category: string; // Category of the data being saved
    data: PaperResponse; // The actual paper data (can be nested/complex)
    time: string; // ISO 8601 formatted timestamp
  }
  