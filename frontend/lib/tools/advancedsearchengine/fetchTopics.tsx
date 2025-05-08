import { BACKEND_URL } from '@/lib/constants';


export interface Topic {
    display_name: string;
    only_id: string;
}

import axios from 'axios';

// Axios Post Request
export const fetchTopics = async (query:string): Promise<Topic[]> => {
    try {
        const response = await axios.post<Topic[]>(
            `${BACKEND_URL}/searchpapers-advanced/get-topics-from-query`, // Replace with the actual endpoint
            {query},
            {
                withCredentials: true, // Ensures cookies or credentials are sent with the request
            }
        );

        return response.data; // Response of type Topic[]
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw error; // Rethrow the error to handle it in the caller
    }
};


export const fetchTopicsCache = async (): Promise<Topic[]> => {
    try {
        const response = await axios.get<Topic[]>(
            `${BACKEND_URL}/searchpapers-advanced/get-topics-from-query-cache`, // Replace with the actual endpoint
            {
                withCredentials: true, // Ensures cookies or credentials are sent with the request
            }
        );

        return response.data; // Response of type Topic[]
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw error; // Rethrow the error to handle it in the caller
    }
};

// Example Usage
/*
const queryProp = { query: 'machine learning' };

fetchTopics(queryProp.query)
    .then((topics) => {
        console.log('Fetched Topics:', topics);
    })
    .catch((error) => {
        console.error('Failed to fetch topics:', error);
    });
*/