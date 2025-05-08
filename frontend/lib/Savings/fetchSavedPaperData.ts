import axios from "axios";
import { BACKEND_URL } from "../constants";
import { PaperResponse } from "../paperdetails/schema";
import { SavedPaperDataResponse } from "./schema";

export const fetchAllSavedPapers = async (): Promise<SavedPaperDataResponse[]> => {
  try {
    const response = await axios.get<SavedPaperDataResponse[]>(`${BACKEND_URL}/save-paper-details/get-all-items`, {
      withCredentials: true, // Include cookies for authentication if needed
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all saved paper details:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch saved paper details.');
  }
};

export const fetchPaperDetailById = async (itemId: string): Promise<SavedPaperDataResponse> => {
  try {
    const response = await axios.post<SavedPaperDataResponse>(`${BACKEND_URL}/save-paper-details/get-item/${itemId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching paper detail with ID ${itemId}:`, error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch paper detail.');
  }
};

export const deletePaperDetailById = async (itemId: string): Promise<void> => {
  try {
    await axios.delete(`${BACKEND_URL}/save-paper-details/delete-item/${itemId}`, {
      withCredentials: true,
    });
    console.log("paper deleted successfully.");
  } catch (error: any) {
    console.error(`Error deleting paper detail with ID ${itemId}:`, error);
    throw new Error(error.response?.data?.detail || 'Failed to delete paper detail.');
  }
};

export const deleteAllSavedPapers = async (): Promise<void> => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/save-paper-details/delete-all`, {
      withCredentials: true,
    });
    console.log(response.data);
  } catch (error: any) {
    console.error('Error deleting all saved paper details:', error);
    throw new Error(error.response?.data?.detail || 'Failed to delete all saved paper details.');
  }
};

export const savePaperDetails = async (paperData: PaperResponse): Promise<void> => {
  try {
    await axios.post(`${BACKEND_URL}/save-paper-details/add-item`, 
      {paperData},
      {withCredentials: true});
  } catch (error: any) {
    console.error('Error saving paper details:', error);
    throw new Error(error.response?.data?.detail || 'Failed to save paper details.');
  }
};
