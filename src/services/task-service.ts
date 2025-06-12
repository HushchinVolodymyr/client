import CreateTaskDTO from "@/DTOs/CoursesDTOs/create-task-dto";
import api from "@/interceptors/api-interceptor";
import { ITask } from "@/types/coursesTypes/tasksTypes/i-task";
import axios from "axios";
import { toast } from "sonner";



export const createTaskAsync = async (createTaskDto: CreateTaskDTO, courseCode: string) => {
    try {
        const formData = new FormData();

        const dateOnly = createTaskDto.deadLine.toDateString();

        formData.append("Title", createTaskDto.title);
        formData.append("Description", createTaskDto.description);
        formData.append("Type", createTaskDto.type.toString());
        formData.append("Deadline", dateOnly);
        formData.append("DueTime", "23:59");
        if (createTaskDto.maxPoints) {
            formData.append("MaxPoints", createTaskDto.maxPoints.toString());
        }

        if (createTaskDto.materials) {
            createTaskDto.materials.forEach((material) => {
                formData.append("TaskFiles", material.file);
            });
        }

        const response = await api.post(`/tasks/${courseCode}`, formData);

        if (response.status === 201) {
            toast.success("Task created successfully");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getTaskByIdAsync = async (taskId: number) => {
    try {
        const response = await api.get(`/tasks/${taskId}`);

        if (response.status === 200) {
            return response.data;
        }
    }
    catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        } else {
            toast.error(error.response?.data?.message || "Failed to fetch task.");
        }
    }
    return null;
}

export const submmitTaskAsync = async (taskId: number, courseCode: string, files: File[]) => {
    try {
        const formData = new FormData();

        formData.append("TaskId", taskId.toString());
        formData.append("CourseCode", courseCode);

        files.forEach((file) => {
            formData.append("Files", file);
        });

        const response = await api.post(`/tasks/submit`, formData);

        if (response.status === 201) {
            toast.success("Task submitted successfully");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        } else {
            toast.error(error.response?.data?.message || "Failed to submit task.");
        }
    }
}

export const getTasksSubmissionsByIdAsync = async (taskId: number) => {
    try {
        const response = await api.get(`/tasks/all/${taskId}`);

        if (response.status === 200) {
            return response.data;
        }
    }
    catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        } else {
            toast.error(error.response?.data?.message || "Failed to fetch task.");
        }
    }
    return null;
}

export const reviewTasks = async (
    taskId: number,
    submissionsToSave: GradeSubmissionDto[],
) => {
    try {
        const payload = {
            submissions: submissionsToSave.map((submission) => ({
                submissionId: submission.submissionId,
                points: submission.points,
                comment: submission.comment,
            })),
        };

        const response = await api.post(`/tasks/grade/${taskId}`, payload);

        if (response.status === 204) {
            toast.success("Tasks reviewed successfully.");
            return response.data;
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        } else {
            toast.error(error.response?.data?.message || "Failed to fetch tasks.");
        }
    }

    return null;
};
