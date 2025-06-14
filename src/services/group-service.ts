import { CreateGroupDTO } from "@/DTOs/GroupDTOs/create-group-dto";
import { SearchGroupDTO } from "@/DTOs/GroupDTOs/search-group-dto";
import api from "@/interceptors/api-interceptor";
import axios from "axios";
import { toast } from "sonner";


export const createGroup = async (registerGroupDto: CreateGroupDTO) => {
    try {
        const response = await api.post("/group/register-group", registerGroupDto);

        if (response.status === 201) {
            toast.success("Group created successfully");
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getGroup = async (groupName: string) => {
    try {
        const response = await api.get(`/group/${groupName}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
    return null;
}

export const deleteGroup = async (groupName: string) => {
    try {
        const response = await api.delete(`/group/${groupName}`);

        if (response.status === 204) {
            toast.success("Group deleted successfully");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getAllGroups = async () => {
    try {
        const response = await api.get("/group/all-groups");

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
    return [];
}

export const addStudentToGroup = async (groupName: string, userName: string) => {
    try {
        const response = await api.post(`/group/add-student-to-group/${userName}/${groupName}`);

        if (response.status === 204) {
            toast.success("Student added to group successfully");
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const removeStudentFromGroup = async (groupName: string, userName: string) => {
    try {
        const response = await api.patch(`/group/remove_student-from-group/${userName}/${groupName}`);

        if (response.status === 204) {
            toast.success("Student removed from group successfully");
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const liveSearchGroup = async (query: string) => {
    try {
        const searchGroupDTO: SearchGroupDTO = {
            query: query
        }; 

        const response = await api.post("/group/search", searchGroupDTO);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
    return [];
}