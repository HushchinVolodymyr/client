import IUser from "../i-user";
import { IScheduleItem } from "./i-schedule-item";
import { IStudent } from "./i-student";
import { ITeacher } from "./i-teacher";
import { ITask } from "./tasksTypes/i-task";

export interface ICourse {
  title: string;
  description: string;
  bannerUrl: string;
  startDate: string;  
  endDate: string;
  courseCode: string;
  category: number;
  credits: number;
  teachers: ITeacher[];
  students: IStudent[];
  schedule: IScheduleItem[];
  tasks: ITask[];
  createdBy?: IUser;
}