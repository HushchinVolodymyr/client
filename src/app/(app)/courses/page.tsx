"use client";
import { CourseDetails } from "@/components/courses/list/course-details";
import CourseList from "@/components/courses/list/course-list";
import CoursesHeader from "@/components/courses/list/courses-header";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllCourses } from "@/services/courses-service";
import { ICourse } from "@/types/coursesTypes/i-course";
import { useEffect, useState } from "react";

function CoursePage() {
    const isMobile = useIsMobile();
    const [courses, setCourses] = useState<ICourse[] | null>(null);
    const [sortedCourses, setSortedCourses] = useState<ICourse[] | null>([]);
    const [searchCourseQuery, setSearchCourseQuery] = useState("");
    const [selectedCourseType, setSelectedCourseType] = useState("All");
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

    const resetFilters = () => {
        setSelectedCourseType("All");
        setSearchCourseQuery("");
    };

    const getCourses = async () => {
        const courses: ICourse[] | null = await getAllCourses();
        if (courses) {
            setCourses(courses);
            console.log("Courses: ", courses);
        }
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="flex flex-col">
            <CoursesHeader
                courses={courses}
                sortedCourses={sortedCourses}
                searchCourseQuery={searchCourseQuery}
                setSearchCourseQuery={setSearchCourseQuery}
                selectedCourseType={selectedCourseType}
                setSelectedCourseType={setSelectedCourseType}
                setSortedCourses={setSortedCourses}
            />
            <Separator />

            {sortedCourses && (
                <div className="flex flex-1 overflow-hidden">
                    <div className={`flex-1 p-4 ${isMobile && selectedCourse ? "hidden" : "block"}`}>
                        <CourseList
                            sortedCourses={sortedCourses}
                            onResetFilters={resetFilters}
                            setSelectedCourse={setSelectedCourse}
                            selectedCourse={selectedCourse}
                        />
                    </div>

                    {selectedCourse && (
                        <CourseDetails course={selectedCourse} onClose={() => setSelectedCourse(null)} isMobile={isMobile} />
                    )}
                </div>)}
        </div >
    );
}

export default CoursePage;