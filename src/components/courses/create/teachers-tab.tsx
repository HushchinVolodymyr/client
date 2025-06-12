"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2Icon, UserIcon } from "lucide-react";
import { z } from "zod";
import { createCourseTeacherFormSchema } from "@/forms/courses/create-course-form";
import { findUserLiveAsync } from "@/services/user-service";
import IUser from "@/types/i-user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateTeacherCourseTabProps {
    selcetedTab: string;
    createCourseTeacherForm: UseFormReturn<z.infer<typeof createCourseTeacherFormSchema>>;
}

export function CreateTeacherCourseTab({ createCourseTeacherForm, selcetedTab }: CreateTeacherCourseTabProps) {
    const { control, watch } = createCourseTeacherForm;
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectedTeachers = watch("teachers") || [];

    const { fields, append, remove } = useFieldArray({
        control,
        name: "teachers",
    });

    useEffect(() => {
        if (selcetedTab === "teachers") {
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
                users = users.filter((user: IUser) => user.userRoles.includes("Teacher"))
                setSearchResults(users)
            } else {
                setSearchResults([])
            }
        }, 500)

        setTimeoutId(newTimeoutId)
    }

    const addTeacher = (user: IUser) => {
        if (
            selectedTeachers.some(
                (t: any) =>
                    t.username === user.userName || t.email.toLowerCase() === user.email.toLowerCase()
            )
        ) {
            toast.error("Teacher already added");
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
                <CardTitle>Search and Add Teachers</CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...createCourseTeacherForm}>
                    <div className="flex gap-2 mb-4">
                        <Input
                            ref={inputRef}
                            placeholder="Search teachers by name or email"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                handleSearchChange(e.target.value)
                            }}

                        />
                    </div>

                    {(searchResults && searchResults.length > 0) ? (
                        <div className="border rounded p-3 mb-4 max-h-48 overflow-auto">
                            {searchResults.map((user) => (
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
                                            <p className="font-medium">{user.firstName + " " + user.lastName + " " + user?.fatherName}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => addTeacher(user)}>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Add
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
                        <h3 className="text-lg font-medium mb-2">Added Teachers</h3>
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
