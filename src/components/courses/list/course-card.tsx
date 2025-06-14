"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getCategoryName } from "@/lib/get-category-by-code";
import { getCourseStatus, getStatusBadgeColor } from "@/lib/get-course-status";
import { ICourse } from "@/types/coursesTypes/i-course";
import { ITeacher } from "@/types/coursesTypes/i-teacher";
import { parse } from "date-fns";
import { ClockIcon, GraduationCapIcon, Image, UsersIcon } from "lucide-react";

interface CourseCardProps {
    course: ICourse;
    setSelectedCourse: (course: ICourse | null) => void;
}

function CourseCard({ course, setSelectedCourse }: CourseCardProps) {
    return (
        <Card className="pt-0 gap-2 cursor-pointer overflow-hidden transition-all hover:shadow-md" onClick={() => { setSelectedCourse(course) }}>
            <div className="aspect-video w-full overflow-hidden bg-muted">
                {course.bannerUrl ?
                    <img src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${course.bannerUrl}` || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
                    :
                    <div className="h-full w-full bg-muted flex items-center justify-center" >
                        <Image />
                    </div>
                }
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <Badge className={`${getStatusBadgeColor(getCourseStatus(course.startDate, course.endDate))} text-white`}>
                        {getCourseStatus(course.startDate, course.endDate)}
                    </Badge>
                    <Badge className="bg-muted text-muted-foreground">
                        {course.courseCode}
                    </Badge>
                </div>
                <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCapIcon className="h-4 w-4" />
                    <span>{getCategoryName(course.category)}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span>{course.teachers.map((teacher) => teacher.firstName + " " + teacher.lastName).join(", ")}</span>
                </div>
            </CardContent>

            <CardFooter className="flex items-end justify-between gap-2 p-4 pt-0 text-sm text-muted-foreground w-full">
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>Starts on {parse(course.startDate, "M/d/yyyy, h:mm:ss a", new Date()).toLocaleDateString("en-US")}</span>
                </div>
                <div className="flex  items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>Ends on {parse(course.endDate, "M/d/yyyy, h:mm:ss a", new Date()).toLocaleDateString("en-US")}</span>
                </div>
            </CardFooter>

        </Card>
    );
}

export default CourseCard;