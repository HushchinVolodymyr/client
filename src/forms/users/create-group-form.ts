import { z } from "zod";

export const createStudentItemFormSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    fatherName: z.string().optional(),
    dateOfBirth: z.date({
        required_error: "End date is required",
    }),
    email: z.string().email({ message: 'Invalid email address' }),
});

export const createStudentFormSchema = z.object({
    groupName: z.string().min(1, { message: 'Group name is required' }),
    students: z.array(createStudentItemFormSchema).min(1, { message: 'At least one student is required' }),
})