"use client"

import { useState } from "react"
import { BookOpenIcon, FilterIcon, InfoIcon, PlusCircle, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { format, isAfter } from "date-fns"
import { ITask } from "@/types/coursesTypes/tasksTypes/i-task"
import { getTaskIconColor } from "@/lib/get-task-icon"
import { ICourse } from "@/types/coursesTypes/i-course"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"


interface TasksProps {
  course: ICourse,
  courseTasks: ITask[],
  courseCode: string
}

export function Tasks({ course, courseTasks, courseCode }: TasksProps) {
  const userState = useSelector((state: RootState) => state.user.user);
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredTasks = courseTasks.filter((courseTasks) => {
    const matchesSearch =
      courseTasks.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseTasks.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const materialTypeMap: { [key: string]: string } = {
      "0": "task",
      "1": "lecture",
    };

    const matchesType = typeFilter === "all" || materialTypeMap[String(courseTasks.type)] === typeFilter;

    return matchesSearch && matchesType
  })


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Course Tasks</CardTitle>
            <CardDescription>View and manage all tasks for this course</CardDescription>
          </div>
          {userState?.userRoles.includes("Teacher") && (
            <Button asChild>
              <Link href={`/courses/${courseCode}/tasks/create`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Task
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lecture">Lectures</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => {
                setSearchQuery("")
                setTypeFilter("all")
              }}>
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Reset filters</span>
              </Button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpenIcon className={`h-4 w-4 ${getTaskIconColor(task.type)}`} />
                      <h3 className="font-medium">{task.title}</h3>
                      {task.maxPoints && (
                        <Badge variant="outline" className="text-xs">
                          {task.maxPoints} Points
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isAfter(new Date(), new Date(task.deadline)) ? "destructive" : "outline"}
                      >
                        Due: {format(task.deadline, "dd.MM.yyyy")}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-md  text-muted-foreground line-clamp-2">{task.description}</p>
                  <div className="mt-4 w-full flex items-end justify-between">
                    {task.taskFiles && task.taskFiles.length && task.taskFiles.length > 0 ? (
                      <Badge variant="outline">
                        <InfoIcon className="mr-2 h-2 w-2" />
                        <p className="mr-2 text-sm">
                          {task.taskFiles?.length} {task.taskFiles.length > 1 ? "Files" : "File"}
                        </p>
                      </Badge>
                    ) : <div />}

                    <Link href={`/courses/${courseCode}/tasks/${task.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}