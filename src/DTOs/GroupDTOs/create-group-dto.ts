export interface CreateGroupDTO {
    groupName: string;
    students: {
        username: string;
        firstName: string;
        lastName: string;
        fatherName?: string;
        email: string;
    }[];
}