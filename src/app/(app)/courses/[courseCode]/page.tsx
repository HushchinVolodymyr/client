"use client"

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseByCode } from "@/services/courses-service";
import { ICourse } from "@/types/coursesTypes/i-course";
import { CourseHeader } from "@/components/courses/course/course-header";
import { CourseMain } from "@/components/courses/course/course-main";
import { Separator } from "@/components/ui/separator";
import CourseNavigation from "@/components/courses/course/course-navigation";
import LoadingScreen from "@/components/loading/loading-sreen";


export default function CoursePage({ params }: { params: Promise<{ courseCode: string }> }) {
  const router = useRouter()
  const unwrappedParams = use(params);
  const [course, setCourse] = useState<ICourse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCourses = async () => {
      const coursesData: ICourse | null = await getCourseByCode(unwrappedParams.courseCode);
      if (coursesData) setCourse(coursesData);
      console.log(coursesData);
      setIsLoading(false);
    };

    fetchCourses();
  }, [])

  if (!course && !isLoading) {
    router.push("/courses");
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      {!course ? <LoadingScreen /> : (
                <div>
                    <CourseHeader course={course} />
                    <Separator className="my-4" />
                    <CourseNavigation courseCode={course.courseCode} />
                    <div className="@container/main flex flex-1 flex-col mt-4">
                        <CourseMain course={course} />
                    </div>
                </div>
            )}
    </div>
  )
}