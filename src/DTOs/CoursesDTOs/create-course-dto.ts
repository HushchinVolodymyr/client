export interface ICreateCourseDTO {
    title: string;
    description?: string;
    category: number;
    bannerImg: File | null;
    startDate: Date;
    endDate: Date;
    credits: number;
    schedule: {
        day: number;
        startTime: string;
        location: string;
    }[];
    teachers: string[];
    students: string[];
}