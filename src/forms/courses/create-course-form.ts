import { z } from "zod";

export const cretaeCourseFormSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }).optional(),
    category: z.number().min(0, {
        message: "Category is required",
    }),
    startDate: z.date({
        required_error: "Start date is required",
    }),
    endDate: z.date({
        required_error: "End date is required",
    }),
    credits: z.number().min(0.5, {
        message: "Credits is required",
    }),
});

export const courseScheduleItemSchema = z.object({
    day: z.number().min(1, {
        message: "Day is required",
    }),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Time must be in HH:MM format" }),
    location: z.string().min(1, {
        message: "Location is required",
    }),
});

export const createCourseSchduleFormSchema = z.object({
    schedule: z.array(courseScheduleItemSchema),
});

export const createCourseTeacherItemFormSchema = z.object({
    userName: z.string().min(1, {
        message: "Username is required",
    }),
    email: z.string().email({
        message: "Email is required",
    }),
    firstName: z.string().min(1, {
        message: "First name is required",
    }),
    lastName: z.string().min(1, {
        message: "Last name is required",
    }),
    fatherName: z.string().min(1, {
        message: "Father name is required",
    }),
    photoUrl: z.string().optional(),
})

export const createCourseTeacherFormSchema = z.object({
    teachers: z.array(createCourseTeacherItemFormSchema),
});

export const createCourseStudentItemFormSchema = z.object({
    userName: z.string().min(1, {
        message: "Username is required",
    }),
    email: z.string().email({
        message: "Email is required",
    }),
    firstName: z.string().min(1, {
        message: "First name is required",
    }),
    lastName: z.string().min(1, {
        message: "Last name is required",
    }),
    fatherName: z.string().min(1, {
        message: "Father name is required",
    }),
    photoUrl: z.string().optional(),
})
export const createCourseStudentFormSchema = z.object({
    students: z.array(createCourseStudentItemFormSchema),
});