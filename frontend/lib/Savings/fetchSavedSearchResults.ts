import axios from "axios";
import { BACKEND_URL } from "../constants";
import { PaperData, QueryResult } from "../tools/searchengine/fetchResponse";
import { SavedSearchResult } from "./schema";


/**
 * Fetch all saved search results for the logged-in user.
 * @returns {Promise<any>} - A promise resolving to the list of saved search results.
 */
export async function fetchAllSavedResults(): Promise<SavedSearchResult[]> {
  try {
    const response = await axios.get<SavedSearchResult[]>(`${BACKEND_URL}/save-search-results/get-all-items`, {
      withCredentials: true, // Include cookies for authentication if needed
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching saved search results:", error.message);
    throw new Error(error.response?.data?.detail || "Failed to fetch saved results.");
  }
}

/**
 * Fetch a single saved search result by item ID.
 * @param {string} itemId - The ID of the search result to fetch.
 * @returns {Promise<any>} - A promise resolving to the fetched search result.
 */
export async function fetchSavedResultById(itemId: string): Promise<SavedSearchResult> {
  try {
    const response = await axios.get<SavedSearchResult>(`${BACKEND_URL}/save-search-results/get-item/${itemId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching search result:", error.message);
    throw new Error(error.response?.data?.detail || "Failed to fetch search result.");
  }
}

/**
 * Add a new search result to the database.
 * @param {any} searchData - The search result data to save.
 * @returns {Promise<void>} - A promise resolving when the data is successfully saved.
 */
export async function addSearchResult(searchData: QueryResult): Promise<void> {
  try {
    await axios.post(`${BACKEND_URL}/save-search-results/add-item`,
      { searchData }, // Send search data as query parameters
      {withCredentials: true});
    console.log("Search result saved successfully.");
  } catch (error: any) {
    console.error("Error saving search result:", error.message);
    throw new Error(error.response?.data?.detail || "Failed to save search result.");
  }
}

/**
 * Delete a single search result by item ID.
 * @param {string} itemId - The ID of the search result to delete.
 * @returns {Promise<void>} - A promise resolving when the item is successfully deleted.
 */
export async function deleteSearchResultById(itemId: string): Promise<void> {
  try {
    await axios.delete(`${BACKEND_URL}/save-search-results/delete-item/${itemId}`, {
      withCredentials: true,
    });
    console.log("Search result deleted successfully.");
  } catch (error: any) {
    console.error("Error deleting search result:", error.message);
    throw new Error(error.response?.data?.detail || "Failed to delete search result.");
  }
}

/**
 * Delete all search results for the logged-in user.
 * @returns {Promise<void>} - A promise resolving when all search results are deleted.
 */
export async function deleteAllSearchResults(): Promise<void> {
  try {
    const response = await axios.delete(`${BACKEND_URL}/save-search-results/delete-all`, {
      withCredentials: true,
    });
    console.log(response.data);
  } catch (error: any) {
    console.error("Error deleting all search results:", error.message);
    throw new Error(error.response?.data?.detail || "Failed to delete all search results.");
  }
}
