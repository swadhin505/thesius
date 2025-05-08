import { BACKEND_URL } from "@/lib/constants";

export interface MessagesInterface {
    role: "user" | "bot";
    content: string;
}

export async function SetCachePaperChatMessage(): Promise<MessagesInterface[]> {
    try {
        const response = await axios.post(`${BACKEND_URL}/paper-chat/set-cache`, {}, {
            withCredentials: true
        });
        return response.data as MessagesInterface[];
    } catch (error) {
        console.error("Error fetching messages history:", error);
        throw error;
    }
}



// work in progress