"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createStudentFormSchema } from "@/forms/users/create-group-form";
import { create } from "domain";
import { Circle, CirclePlus, Loader2Icon, Trash2 } from "lucide-react";
import { FormProvider, useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface CreateGroupProps {
    handleCreateGroup: () => void;
    isCreating: boolean;
    createGroupStudentsForm: UseFormReturn<z.infer<typeof createStudentFormSchema>>;
}

function CraeteGroup({ handleCreateGroup, isCreating, createGroupStudentsForm }: CreateGroupProps) {
    const { control, register, watch, formState: { errors } } = createGroupStudentsForm;
    const selectedStudents = watch("students") || [];

    const { fields, append, remove } = useFieldArray({
        control,
        name: "students",
    });



    return (
        <Card className="mx-4 md:mx-6">
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <FormProvider {...createGroupStudentsForm}>
                        <div>
                            <h1 className="text-sm font-medium mb-2">Enter group name</h1>
                            <FormField
                                control={control}
                                name="groupName"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input
                                            placeholder="Group name"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <h1>New student</h1>
                            <Button
                                onClick={() =>
                                    append({ firstName: "", lastName: "", fatherName: "", email: "", dateOfBirth: new Date() })
                                }
                            >
                                <CirclePlus className="mr-2" />
                                Add student
                            </Button>
                        </div>

                        {fields.length === 0 && (
                            <div>
                                <p className="text-center border border-dashed p-6 rounded-lg">
                                    No students yet
                                </p>
                            </div>
                        )}
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col items-start gap-2 justify-between border p-4 rounded-md space-x-4">
                                <h1>Student: {index + 1}</h1>

                                <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-4 w-full">
                                        <FormField
                                            control={control}
                                            name={`students.${index}.firstName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input
                                                        placeholder="First name"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`students.${index}.lastName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input
                                                        placeholder="Last name"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name={`students.${index}.fatherName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input
                                                        placeholder="Father name"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name={`students.${index}.email`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input
                                                        placeholder="Email"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>)}
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between w-full">
                            <div />
                            <Button onClick={handleCreateGroup} disabled={isCreating} >
                                {isCreating ? <Loader2Icon className="animate-spin" size={16} /> : null}
                                Create group
                            </Button>
                        </div>
                    </FormProvider>
                </div>
            </CardContent>
        </Card >
    );
}

export default CraeteGroup;