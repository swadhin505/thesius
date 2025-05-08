// TypeScript File: sendRequest.ts
import { BACKEND_URL } from '@/lib/constants';
import axios from 'axios';
import { PaperData } from './fetchResponse';

export interface RagDataProps {
  renderedPapers: PaperData[];
  create_new_chat_instance: boolean;
}

export interface QueryModel {
  query: string;
}

export interface RagResponse {
  rag_response: string;
}

// Function to send POST request for rendered papers
export const sendRenderedPapers = async (data: RagDataProps): Promise<void> => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/searchpapers/send-rag-data`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('Response from FastAPI:', response.data);
  } catch (error) {
    console.error('Error sending rendered papers:', error);
  }
};

// Function to send POST request to query selected papers
export const askQuestionAboutSelectedPapers = async (query: QueryModel): Promise<RagResponse | undefined> => {
  try {
    const response = await axios.post<RagResponse>(
      `${BACKEND_URL}/searchpapers/multiabstract-chat/query`,
      query,
      {
        withCredentials: true,
      }
    );
    console.log('Response from FastAPI:', response.data);
    return response.data
  } catch (error) {
    console.error('Error querying selected papers:', error);
  }
};

// Function to send GET request to delete chat session
export const deleteChatSession = async (): Promise<void> => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/searchpapers/multiabstract-chat/delete-session`,
      {
        withCredentials: true,
      }
    );
    console.log('Response from FastAPI:', response.data);
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};
