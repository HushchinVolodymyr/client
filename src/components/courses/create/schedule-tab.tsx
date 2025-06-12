"use client";

import { z } from "zod";
import { FormProvider, UseFormReturn, useFieldArray } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Trash2Icon, PlusIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createCourseSchduleFormSchema } from "@/forms/courses/create-course-form";
import { DayOfWeekEnum } from "@/types/enums/day-of-week-enum";
import { TimePicker } from "@/components/ui/time-picker";

interface CreateCourseScheduleProps {
    createCourseScheduleForm: UseFormReturn<z.infer<typeof createCourseSchduleFormSchema>>;
}


function CreateCourseScheduleTab({ createCourseScheduleForm }: CreateCourseScheduleProps) {
    const { control } = createCourseScheduleForm;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedule",
    });

    const addScheduleItem = () => {
        append({ day: 0, startTime: "08:30", location: "" });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Schedule</CardTitle>
                <CardDescription>Define sessions (day, time, location)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormProvider {...createCourseScheduleForm}>
                    {fields.length === 0 ? (
                        <div className="text-center border border-dashed p-6 rounded-lg">
                            <p className="mb-4">No schedule items yet</p>
                            <Button onClick={addScheduleItem}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Schedule Item
                            </Button>
                        </div>
                    ) : (
                        fields.map((field, index) => (
                            <div key={field.id} className="border p-4 rounded-md space-y-4">
                                <div className="flex justify-between">
                                    <h4>Session {index + 1}</h4>
                                    <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
                                        <Trash2Icon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name={`schedule.${index}.day`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Day</FormLabel>
                                                <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select day" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.keys(DayOfWeekEnum)
                                                            .filter((key) => isNaN(Number(key)))
                                                            .map((key) => {
                                                                const value = DayOfWeekEnum[key as keyof typeof DayOfWeekEnum].toString();
                                                                const label = key === "PE" ? key : key.split(/(?=[A-Z])/).join(" ");

                                                                return (
                                                                    <SelectItem key={value} value={value}>
                                                                        {label}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name={`schedule.${index}.startTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time</FormLabel>
                                                <FormControl>
                                                    <TimePicker
                                                        value={field.value || "08:30"}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name={`schedule.${index}.location`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="e.g. Room 101" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </FormProvider>
            </CardContent>
            <CardFooter>
                <Button type="button" variant="outline" onClick={addScheduleItem}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Another Session
                </Button>
            </CardFooter>
        </Card>
    );
}

export default CreateCourseScheduleTab;
