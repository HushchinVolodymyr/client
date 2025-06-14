import { ICreateCourseDTO } from "@/DTOs/CoursesDTOs/create-course-dto";
import { IEditCourseDTO } from "@/DTOs/CoursesDTOs/edit-course-dto";
import api from "@/interceptors/api-interceptor"
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const getAllCourses = async () => {
    try {
        const response = await api.get("/courses");

        if (response.status === 200) {
            return response.data;
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error))
            toast.error("Unexpected error occurred.");
    }
}

export const createCourseAsync = async (createCourseDto: ICreateCourseDTO, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        console.log("startDate", formatDate(createCourseDto.startDate));
        console.log("endDate", formatDate(createCourseDto.endDate));

        formData.append("Title", createCourseDto.title);
        formData.append("Description", createCourseDto.description || "");
        formData.append("Category", createCourseDto.category.toString());
        if (createCourseDto.bannerImg) {
            formData.append("BannerImg", createCourseDto.bannerImg as any);
        }
        formData.append("StartDate", formatDate(createCourseDto.startDate));
        formData.append("EndDate", formatDate(createCourseDto.endDate));
        formData.append("Credits", createCourseDto.credits.toString());

        // Расписание
        if (createCourseDto.schedule) {
            createCourseDto.schedule.forEach((entry, index) => {
                formData.append(`Schedule[${index}].DayOfWeek`, entry.day.toString());
                formData.append(`Schedule[${index}].Time`, `${entry.startTime}:00`);
                formData.append(`Schedule[${index}].Location`, entry.location);
            });
        }

        if (createCourseDto.teachers) {
            for (const email of createCourseDto.teachers) {
                formData.append("InstructorsEmails", email);
            }
        }

        if (createCourseDto.students) {
            for (const email of createCourseDto.students || []) {
                formData.append("StudentsEmails", email);
            }
        }

        const response = await api.post("/courses", formData);

        if (response.status === 201) {
            toast.success("Course created successfully.");
            router.push("/courses");
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const editCourseAsync = async (editCourseDto: IEditCourseDTO, courseCode: string, router: AppRouterInstance) => {
    try {
        const formData = new FormData();

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        console.log("startDate", formatDate(editCourseDto.startDate));
        console.log("endDate", formatDate(editCourseDto.endDate));

        formData.append("Title", editCourseDto.title);
        formData.append("Description", editCourseDto.description || "");
        formData.append("Category", editCourseDto.category.toString());
        if (editCourseDto.bannerImg) {
            formData.append("BannerImg", editCourseDto.bannerImg as any);
        }
        formData.append("StartDate", formatDate(editCourseDto.startDate));
        formData.append("EndDate", formatDate(editCourseDto.endDate));
        formData.append("Credits", editCourseDto.credits.toString());

        // Расписание
        if (editCourseDto.schedule) {
            editCourseDto.schedule.forEach((entry, index) => {
                formData.append(`Schedule[${index}].DayOfWeek`, entry.day.toString());
                formData.append(`Schedule[${index}].Time`, `${entry.startTime}`);
                formData.append(`Schedule[${index}].Location`, entry.location);
            });
        }

        const response = await api.put(`/courses/${courseCode}`, formData);

        if (response.status === 204) {
            toast.success("Course updated successfully.");
            router.push(`/courses/${courseCode}`);
            return response.data;
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const getCourseByCode = async (courseCode: string) => {
    try {
        const response = await api.get(`/courses/code/${courseCode}`);

        if (response.status === 200) {
            return response.data;
        }
        
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }
}

export const deleteCourseAsync = async (courseCode: string, router: AppRouterInstance) => {
    try {
        const response = await api.delete(`/courses/${courseCode}`);

        if (response.status === 204) {
            toast.success("Course deleted successfully.");
            router.push("/courses");
            return true;
        }
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            toast.error("Unexpected error occurred.");
        }
    }

    return false;
}
