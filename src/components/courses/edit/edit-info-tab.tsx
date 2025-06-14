"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cretaeCourseFormSchema } from "@/forms/courses/create-course-form";
import { cn } from "@/lib/utils";
import { CourseCategoryEnum } from "@/types/enums/course-category-enum";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Form, FormProvider, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface EditCourseInfoTabProps {
    createCourseInfoFrom: UseFormReturn<z.infer<typeof cretaeCourseFormSchema>>;
}

function EditCourseInfoTab({ createCourseInfoFrom }: EditCourseInfoTabProps) {


    return (
        <Card className="w-full p-4">
            <FormProvider {...createCourseInfoFrom}>
                <FormField
                    control={createCourseInfoFrom.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Course Title"
                                    className="w-full p-2 border rounded-md"
                                />
                            </FormControl>
                            <FormDescription>
                                This is the title of the course that will be displayed to students.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={createCourseInfoFrom.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Course Description"
                                    className="w-full p-2 border rounded-md h-60"
                                />
                            </FormControl>
                            <FormDescription>
                                This is the description of the course that will be displayed to students.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={createCourseInfoFrom.control}
                        name="credits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Course Credits</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        step={0.5}
                                        placeholder="Course Credits"
                                        className="w-full p-2 border rounded-md"
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is the number of credits of the course.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={createCourseInfoFrom.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(CourseCategoryEnum)
                                                .filter((key) => isNaN(Number(key)))
                                                .map((key) => {
                                                    const value = CourseCategoryEnum[key as keyof typeof CourseCategoryEnum].toString();
                                                    const label = key === "PE" ? key : key.split(/(?=[A-Z])/).join(" ");

                                                    return (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    );
                                                })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Choose the category that best fits your course.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={createCourseInfoFrom.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={createCourseInfoFrom.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </FormProvider>
        </Card>
    );
}

export default EditCourseInfoTab;