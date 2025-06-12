"use client"

import { useState } from "react"
import { SearchIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ICourse } from "@/types/coursesTypes/i-course"
import { IStudent } from "@/types/coursesTypes/i-student"
import { ITeacher } from "@/types/coursesTypes/i-teacher"

interface CourseUsersProps {
    course: ICourse
}

type CourseUser = (IStudent | ITeacher) & {
    userRoles: string[];
}

export function CourseUsers({ course }: CourseUsersProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [sortBy, setSortBy] = useState("name")

    const teachers: CourseUser[] = (course.teachers || []).map(t => ({ ...t, userRoles: ["Teacher"] }))
    const students: CourseUser[] = (course.students || []).map(s => ({ ...s, userRoles: ["Student"] }))

    const users: CourseUser[] = [...teachers, ...students]

    const filteredUsers = users.filter((user) => {
        const fullName = (user.firstName + " " + user.lastName + " " + user.fatherName).toLowerCase()
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole =
            roleFilter === "all" || user.userRoles.includes(roleFilter)

        return matchesSearch && matchesRole
    })

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortBy === "name") {
            return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
        }
        if (sortBy === "role") {
            const aRole = a.userRoles.join(", ")
            const bRole = b.userRoles.join(", ")
            return aRole.localeCompare(bRole)
        }
        return 0
    })

    const studentCount = students.length
    const instructorCount = teachers.length

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Course Users</CardTitle>
                            <CardDescription>View and manage users enrolled in this course</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="Student">Students</SelectItem>
                                    <SelectItem value="Teacher">Instructors</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Sort by Name</SelectItem>
                                    <SelectItem value="role">Sort by Role</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Tabs value={roleFilter} onValueChange={setRoleFilter}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">
                                All <Badge variant={"outline"} className="ml-2 text-xs">{users.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="Student">
                                Students <Badge variant={"outline"} className="ml-2 text-xs">{studentCount}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="Teacher">
                                Instructors <Badge variant={"outline"} className="ml-2 text-xs">{instructorCount}</Badge>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="space-y-4">
                        {sortedUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                                <h3 className="mb-2 text-lg font-medium">No users found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search or filter criteria to find what you're looking for.
                                </p>
                            </div>
                        ) : (
                            sortedUsers.map((user) => (
                                <div key={user.userName} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={user.photoUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${user.photoUrl}` : ""}
                                                alt={user.userName}
                                            />
                                            <AvatarFallback>
                                                <UserIcon className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {user.firstName} {user.lastName} {user.fatherName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Badge variant={user.userRoles.includes("Teacher") ? "default" : "outline"}>
                                            {user.userRoles.includes("Teacher") ? "Instructor" : "Student"}
                                        </Badge>

                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
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
