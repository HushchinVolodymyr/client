"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2Icon, UserIcon } from "lucide-react";
import { z } from "zod";
import { createCourseStudentFormSchema, createCourseTeacherFormSchema } from "@/forms/courses/create-course-form";
import { findUserLiveAsync } from "@/services/user-service";
import IUser from "@/types/i-user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { liveSearchGroup } from "@/services/group-service";
import { IGroup } from "@/types/groupTypes/i-group";
import { Badge } from "@/components/ui/badge";

interface CreateStudentCourseTabProps {
    selcetedTab: string;
    createCourseStudentForm: UseFormReturn<z.infer<typeof createCourseStudentFormSchema>>;
}

export function CreateStudentCourseTab({ createCourseStudentForm, selcetedTab }: CreateStudentCourseTabProps) {
    const { control, watch } = createCourseStudentForm;
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [groupSerachResults, setGroupSearchResults] = useState<IGroup[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectedStudent = watch("students") || [];

    const { fields, append, remove } = useFieldArray({
        control,
        name: "students",
    });

    useEffect(() => {
        if (selcetedTab === "students") {
            const timeout = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            return () => clearTimeout(timeout);
        }
    }, [selcetedTab]);

    const handleSearchChange = (query: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        const newTimeoutId = setTimeout(async () => {
            if (query.length > 2) {
                let users = await findUserLiveAsync(query)
                let groups = await liveSearchGroup(query)

                if (users && users.length > 0) {
                    users = users.filter((user: IUser) => user.userRoles.includes("Student"))
                    setSearchResults(users)
                }

                if (groups && groups.length > 0) {
                    setGroupSearchResults(groups)
                }
                console.log("Search results:", users, groups);
            } else {
                setSearchResults([])
                setGroupSearchResults([]);
            }
        }, 500)

        setTimeoutId(newTimeoutId)
    }

    const addStudent = (user: IUser) => {
        if (
            selectedStudent.some(
                (t: any) =>
                    t.username === user.userName || t.email.toLowerCase() === user.email.toLowerCase()
            )
        ) {
            toast.error("Student already added");
            return;
        }

        append({
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fatherName: user.fatherName,
            photoUrl: user.photoUrl,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Search and Add Student</CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...createCourseStudentForm}>
                    <div className="flex gap-2 mb-4">
                        <Input
                            ref={inputRef}
                            placeholder="Search student by name"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                handleSearchChange(e.target.value)
                            }}

                        />
                    </div>

                    {(searchResults.length > 0 || groupSerachResults.length > 0) ? (
                        <div className="border rounded p-3 mb-4 max-h-48 overflow-auto space-y-4">
                            {searchResults.length > 0 && searchResults.map((user) => (
                                <div
                                    key={user.userName}
                                    className="flex flex-col gap-2 md:flex-row justify-between md:items-center p-1 cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={process.env.NEXT_PUBLIC_BASE_API_URL + user.photoUrl} alt={user.userName} />
                                            <AvatarFallback>
                                                <UserIcon className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{user.firstName} {user.lastName} {user.fatherName}</p>
                                                <Badge className="text-xs bg-green-500">Student</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => addStudent(user)}>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                            ))}

                            {groupSerachResults.length > 0 && groupSerachResults.map((group) => (
                                <div
                                    key={group.name}
                                    className="flex flex-col gap-2 md:flex-row justify-between md:items-center p-1 cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{group.name}</p>
                                                <Badge className="text-xs bg-blue-500">Group</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{group.students.length} students</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => group.students.forEach(addStudent)}>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Add All Students
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border rounded p-3 mb-4 max-h-48 overflow-auto">
                            <p className="text-muted-foreground text-center">No results found</p>
                        </div>
                    )}




                    <div>
                        <h3 className="text-lg font-medium mb-2">Added Students</h3>
                        {fields.length === 0 && <p className="text-muted-foreground text-center">No teachers added</p>}
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex justify-between items-center border rounded p-3 mb-2"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        {field.photoUrl &&
                                            <AvatarImage src={process.env.NEXT_PUBLIC_BASE_API_URL + field.photoUrl} alt={field.userName} />
                                        }
                                        <AvatarFallback>
                                            <UserIcon className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{field.firstName + " " + field.lastName + " " + field?.fatherName}</p>
                                        <p className="text-sm text-muted-foreground">{field.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="text-destructive"
                                >
                                    <Trash2Icon className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </FormProvider>
            </CardContent>
        </Card >
    );
}
