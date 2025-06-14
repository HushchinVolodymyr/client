import { TaskTypeEnum } from "@/types/enums/task-type-enum";

export const taskTypeNames: Record<number, string> = {
    [TaskTypeEnum.Task]: "Task",
    [TaskTypeEnum.Lecture]: "Lecture"
};

export function getTaskName(type: number): string {
  return taskTypeNames[type] ?? "Unknown";
}

export function getTaskIconColor(type: number): string {
  switch (type) {
    case TaskTypeEnum.Lecture:
      return "text-green-500";
    case TaskTypeEnum.Task:
      return "text-blue-500"; 
    default:
      return ""; 
  }
}


