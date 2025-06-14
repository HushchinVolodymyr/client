"use client";

import CourseCard from "./course-card";
import { EmptyCourseState } from "./empty-course-list";


interface CourseListProps {
    sortedCourses: ICourse[] ;
    onResetFilters: () => void;
    setSelectedCourse: (course: ICourse | null) => void;
    selectedCourse?: ICourse | null;
}

function CourseList({ sortedCourses, onResetFilters, setSelectedCourse, selectedCourse }: CourseListProps) {
    if (sortedCourses.length === 0) {
        return <EmptyCourseState onResetFilters={onResetFilters} />
    }

    return (
        <div className={`grid gap-4  ${selectedCourse ? "smd:grid-cols-1 lmd:grid-cols-1 ld:grid-cols-2 xld:grid-cols-3" : "smd:grid-cols-2 lmd:grid-cols-3 lg:grid-cols-4"}`}>
            {sortedCourses.map((course, index) => (
                <CourseCard key={index} course={course} setSelectedCourse={setSelectedCourse}/>
            ))}
        </div>
    );
}

export default CourseList;