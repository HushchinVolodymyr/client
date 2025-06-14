import api from "@/interceptors/api-interceptor";
import axios from "axios";
import { toast } from "sonner";



export const createChat = async (senderId: number, recieverId: number) => {
    try {
        const response = await api.post(`/chat`, { participantIds: [senderId, recieverId] });
        
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getChats = async () => {
    try {
        const response = await api.get(`/chat`);

        if (response.status === 200) {
            return response.data;
        }
        
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}