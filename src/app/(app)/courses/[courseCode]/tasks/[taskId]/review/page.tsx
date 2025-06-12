"use client"

import { useState, useEffect, useRef, use } from "react"
import IUser from "@/types/i-user"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { getTasksSubmissionsByIdAsync, reviewTasks } from "@/services/task-service"
import ReviewBlock from "@/components/courses/tasks/review/review-block"
import ReviewHeader from "@/components/courses/tasks/review/review-header"
import { ITask } from "@/types/coursesTypes/tasksTypes/i-task"
import { ICourse } from "@/types/coursesTypes/i-course"
import { getCourseByCode } from "@/services/courses-service"


export default function AssignmentGradingPage({ params }: { params: Promise<{ courseCode: string, taskId: string }> }) {
    const userState: IUser | null = useSelector((state: RootState) => state.user.user);
    const unwrappedParams = use(params)
    const [submissions, setSubmissions] = useState<ITask | null>(null)
    const [course, setCourse] = useState<ICourse | null>(null);
    const [pointsMap, setPointsMap] = useState<Record<string, number | null>>({});
    const [commentsMap, setCommentsMap] = useState<Record<string, string>>({});

    const hasFetched = useRef(false);

    async function fetchAssignmentData(taskId: number) {
        const submissionsData = await getTasksSubmissionsByIdAsync(taskId);
        if (submissionsData) {
            console.log("Fetched submissions:", submissionsData);
            setSubmissions(submissionsData);
        }

        const courseData = await getCourseByCode(unwrappedParams.courseCode);
        if (courseData) {
            setCourse(courseData);
        }
    }

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchAssignmentData(unwrappedParams.taskId ? parseInt(unwrappedParams.taskId) : 0);
    }, [unwrappedParams]);

    async function handleSaveAllChanges() {
        const submissionsToSave = Object.keys(pointsMap).map(id => {
            const points = pointsMap[id];
            const comment = commentsMap[id] || null;

            return {
                submissionId: parseInt(id),
                points: points !== null ? points : null,
                comment: comment, 
            };
        });

        await reviewTasks(parseInt(unwrappedParams.taskId), submissionsToSave);
    }

    const handleUpdatePoints = (submissionId: number, points: number | null) => {
        setPointsMap((prev) => ({
            ...prev,
            [submissionId]: points,
        }));
    };

    const handleUpdateComment = (submissionId: number, comment: string | null) => {
        setCommentsMap((prev) => ({
            ...prev,
            [submissionId]: comment ?? '',
        }));
    };


    return (
        <div className="flex flex-1 flex-col">
            <ReviewHeader />

            <div className="@container/main flex flex-1 flex-col p-6">
                {course && submissions && userState?.userRoles.some(role => role === "Admin" || role === "Teacher") ? (
                    <ReviewBlock
                        course={course}
                        task={submissions}
                        pointsMap={pointsMap}
                        setPointsMap={setPointsMap}
                        handleUpdatePoints={handleUpdatePoints}
                        handleSaveAllChanges={handleSaveAllChanges}
                        commentsMap={commentsMap}
                        setCommentsMap={setCommentsMap}
                        handleUpdateComment={handleUpdateComment}
                    />
                ) : null}
            </div>
        </div>
    )
}
