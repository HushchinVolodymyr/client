import { z } from "zod";

export const taskFormSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    description: z.string(),
    type: z.number({
        required_error: "Please select a task type.",
    }),
    points: z.coerce.number().min(0).max(100).optional(),
    dueDate: z.date({
        required_error: "A due date is required.",
    }),
})