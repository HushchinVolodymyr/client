"use client"

import Link from "next/link"
import { ArrowLeftIcon, MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ICourse } from "@/types/coursesTypes/i-course"
import { getCourseStatus, getStatusBadgeColor } from "@/lib/get-course-status"
import { useRouter } from "next/navigation"
import { getCategoryName } from "@/lib/get-category-by-code"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"


interface CourseHeaderProps {
  course: ICourse
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const userState = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => router.push("/courses")}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Courses
          </Button>

          {course.teachers.some(teacher => teacher.email === userState?.email) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">

                <Link href={`/courses/${course.courseCode}/edit`} >
                  <DropdownMenuItem className="cursor-pointer">
                    Edit Course
                  </DropdownMenuItem>
                </Link>

              </DropdownMenuContent>
            </DropdownMenu>)}



        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <Badge variant="outline">{course.courseCode}</Badge>
              <Badge className={`${getStatusBadgeColor(getCourseStatus(course.startDate, course.endDate))} text-white`}>
                {getCourseStatus(course.startDate, course.endDate)}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {getCategoryName(course.category)} • {course.credits} credits
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}