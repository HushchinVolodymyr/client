import IUser from "@/types/i-user";

export interface ISubmission {
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
}