"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTaskIconColor } from "@/lib/get-task-icon";
import { RootState } from "@/store/store";
import { ICourse } from "@/types/coursesTypes/i-course";
import { ITask } from "@/types/coursesTypes/tasksTypes/i-task";
import IUser from "@/types/i-user";
import { format, isAfter } from "date-fns";
import { ArrowLeftIcon, BookOpenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface TaskHeaderProps {
    course: ICourse
    task: ITask
}

function TaskHeader({ course, task }: TaskHeaderProps) {
    const user: IUser | null = useSelector((state: RootState) => state.user.user);
    const router = useRouter();

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => {
                        router.back();
                    }}>
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Course
                    </Button>

                    {user?.userRoles.includes( "Teacher") && (
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => {
                            router.push(`/courses/${course.courseCode}/tasks/${task.id}/review`);
                        }}>
                            <BookOpenIcon className="h-4 w-4" />
                            Review Submissions
                        </Button>)}
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl flex gap-2 font-bold items-center">
                            <BookOpenIcon className={`h-8 w-8 ${getTaskIconColor(task.type)}`} />
                            {task.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {task.maxPoints !== null && (
                            <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                Max points: {task.maxPoints}
                            </span>
                        )}
                        {task.deadline && (
                            <Badge
                                variant={isAfter(new Date(), new Date(task.deadline)) ? "destructive" : "outline"}
                            >
                                Due: {format(task.deadline, "dd.MM.yyyy")}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskHeader;