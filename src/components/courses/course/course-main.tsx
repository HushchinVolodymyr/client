"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpenIcon, CalendarIcon, ClockIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import Link from "next/link"
import { ITeacher } from "@/types/coursesTypes/i-teacher"
import { IScheduleItem } from "@/types/coursesTypes/i-schedule-item"
import { getDayOfWeek } from "@/lib/get-day-of-wheek-by-code"
import { ICourse } from "@/types/coursesTypes/i-course"

interface CourseMainTabProps {
    course: ICourse
}

export function CourseMain({ course }: CourseMainTabProps) {
    const [tasks, setTasks] = useState<any[] | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        // const fetchCourses = async () => {
        //     const taskData = await getTasksAsync(course.code);
        //     if (taskData) setTasks(taskData);
        //     console.log(taskData);
        // };

        //fetchCourses();

    }, [])

    const getStartAndEndOfWeek = (date: Date) => {
        const start = new Date(date);
        const end = new Date(date);

        start.setDate(date.getDate() - date.getDay());
        start.setHours(0, 0, 0, 0);

        end.setDate(date.getDate() + (6 - date.getDay()));
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };

    const { start, end } = getStartAndEndOfWeek(new Date());

    const upcomingTasks = tasks
        ?.filter((task) => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= start && taskDate <= end;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5) || [];

    // const getTaskIcon = (type: ["materialType"]) => {
    //     switch (type) {
    //         case 0:
    //             return <BookOpenIcon className="h-4 w-4 text-green-500" />
    //         case 1:
    //             return <BookOpenIcon className="h-4 w-4 text-blue-500" />
    //         default:
    //             return <BookOpenIcon className="h-4 w-4" />
    //     }
    // }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardContent className="space-y-6">
                    <h3 className="mb-2 text-lg font-medium">Description</h3>
                    <p className="text-muted-foreground">{course.description}</p>
                    <div>
                        <h3 className="mb-2 text-lg font-medium">Schedule</h3>
                        <div className="grid gap-2">
                            {course.schedule.length !== 0 ? (
                                <div>
                                    {course.schedule.map((item: IScheduleItem, index: number) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <ClockIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">{getDayOfWeek(item.dayOfWeek)}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {item.time} • {item.location}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">No schedule available for this course.</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-medium">Instructors</h3>
                        <div className="flex flex-col gap-3">
                            {course.teachers.map((teacher: ITeacher, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${teacher.photoUrl}` || ""} alt={teacher.userName} />
                                        <AvatarFallback>{teacher.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{teacher.firstName} {teacher.lastName} {teacher.fatherName}</div>
                                        <div className="text-sm text-muted-foreground">{teacher.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Upcoming Deadlines</CardTitle>
                        <CardDescription>Tasks due soon</CardDescription>
                    </div>
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {upcomingTasks.length === 0 ? (
                        <p className="text-muted-foreground">No tasks due this week</p>
                    ) : (
                        upcomingTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    {/* {getTaskIcon(task.materialType)} */}
                                    <div>
                                        <div className="font-medium">{task.title}</div>
                                        <div className="text-xs text-muted-foreground">Due: {format(task.dueDate, "dd.MM.yyyy")}</div>
                                    </div>
                                </div>
                                <Link href={`/courses/${course.courseCode}/tasks/${task.id}`}>
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        View
                                    </Button>
                                </Link>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}