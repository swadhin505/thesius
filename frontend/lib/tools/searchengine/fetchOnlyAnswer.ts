import axios from 'axios';
import { BACKEND_URL } from '@/lib/constants';

// Assuming a dummy file import for the schema
import { PaperData } from './fetchResponse';

export interface PaperList {
    query: string;
    paper_data: PaperData[] | undefined;
}

export interface OnlyAnswer {
    query: string;
    final_answer: string;
    followup_questions: string[];
}

const getOnlyAnswer = async (parcel: PaperList): Promise<OnlyAnswer> => {
  try {
    const response = await axios.post<OnlyAnswer>(`${BACKEND_URL}/searchpapers/get-only-answer`, parcel, {
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    throw error;
  }
};

export default getOnlyAnswer;
