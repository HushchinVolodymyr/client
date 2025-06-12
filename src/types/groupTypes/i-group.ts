import IUser from "../i-user";

export interface IGroup {
    name: string;
    curator: IUser;
    students: IUser[];
}