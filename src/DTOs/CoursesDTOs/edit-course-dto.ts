export interface IEditCourseDTO {
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
}