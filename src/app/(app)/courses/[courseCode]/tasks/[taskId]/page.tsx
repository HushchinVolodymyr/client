"use client"

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseByCode } from "@/services/courses-service";
import { ICourse } from "@/types/coursesTypes/i-course";
import { CourseHeader } from "@/components/courses/course/course-header";
import LoadingScreen from "@/components/loading/loading-sreen";
import { ITask } from "@/types/coursesTypes/tasksTypes/i-task";
import TaskMaterials from "@/components/courses/tasks/task-materials";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TaskSubmission from "@/components/courses/tasks/task-submission";
import TaskHeader from "@/components/courses/tasks/task-header";


export default function TaskIdPage({ params }: { params: Promise<{ courseCode: string, taskId: string }> }) {
    const userState = useSelector((state: RootState) => state.user.user);
    const router = useRouter()
    const unwrappedParams = use(params);
    const [course, setCourse] = useState<ICourse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const hasFetched = useRef(false);
    const [task, setTask] = useState<ITask | null>(null);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCourse = async () => {
            const coursesData: ICourse | null = await getCourseByCode(unwrappedParams.courseCode);
            if (coursesData) setCourse(coursesData);
            setTask(coursesData?.tasks.find(t => t.id === parseInt(unwrappedParams.taskId)) || null);

            console.log(coursesData);

            setIsLoading(false);
        };

        fetchCourse();


    }, [])

    if (!course && !isLoading) {
        router.push("/courses");
    }

    return (
        <div className="flex flex-1 flex-col p-4 md:p-6">
            {!course ? <LoadingScreen /> : (
                <div>
                    {task && (<TaskHeader task={task} course={course} />)}
                    <div className="@container/main flex flex-1 flex-col mt-4">
                        {task && <TaskMaterials task={task} />}

                        {task && userState?.userRoles.includes("Student") ? (
                            <TaskSubmission courseCode={course.courseCode} taskId={task.id}/>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}