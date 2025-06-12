import IUser from "@/types/i-user";

export interface ITask {
    id: number;
    title: string;
    description: string | null;
    deadline: Date;
    maxPoints: number;
    type: number;
    submissions: {
        id: number;
        created: Date;
        points: number | null;
        comment: string | null;
        student: IUser;
        submissionsFiles?: {
            name: string;
            fileUrl: string;
        }[]
    }[]
    taskFiles?: {
        name: string;
        fileUrl: string;
    }[]
}