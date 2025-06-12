"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCourseInfoTab from "@/components/courses/create/info-tab";
import { createCourseSchduleFormSchema, createCourseStudentFormSchema, createCourseTeacherFormSchema, cretaeCourseFormSchema } from "@/forms/courses/create-course-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CreateCourseBannerTab from "@/components/courses/create/banner-tab";
import CreateCourseScheduleTab from "@/components/courses/create/schedule-tab";
import { CreateTeacherCourseTab } from "@/components/courses/create/teachers-tab";
import { CreateStudentCourseTab } from "@/components/courses/create/students-tab";
import { ICreateCourseDTO } from "@/DTOs/CoursesDTOs/create-course-dto";
import { createCourseAsync } from "@/services/courses-service";


function CreateCoursePage() {
    const [selectedTab, setSelectedTab] = useState<string>("info");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const createCourseInfoFrom = useForm<z.infer<typeof cretaeCourseFormSchema>>({
        resolver: zodResolver(cretaeCourseFormSchema),
    });
    const createCourseScheduleForm = useForm<z.infer<typeof createCourseSchduleFormSchema>>({
        resolver: zodResolver(createCourseSchduleFormSchema),
    });
    const createCourseTeacherForm = useForm<z.infer<typeof createCourseTeacherFormSchema>>({
        resolver: zodResolver(createCourseTeacherFormSchema),
    });
    const createCourseStudentForm = useForm<z.infer<typeof createCourseStudentFormSchema>>({
        resolver: zodResolver(createCourseStudentFormSchema),
    });


    const handleNextTab = (value: string) => {
        if (selectedTab == "info") setSelectedTab("coursebanner");
        if (selectedTab == "coursebanner") setSelectedTab("schedule");
        if (selectedTab == "schedule") setSelectedTab("teachers");
        if (selectedTab == "teachers") setSelectedTab("students");

    };

    const handlePreviousTab = (value: string) => {
        if (selectedTab == "students") setSelectedTab("teachers");
        if (selectedTab == "teachers") setSelectedTab("schedule");
        if (selectedTab == "schedule") setSelectedTab("coursebanner");
        if (selectedTab == "coursebanner") setSelectedTab("info");
    };

    const handleSubmit = async () => {
        console.log(createCourseInfoFrom.getValues());
        console.log(selectedFile);
        console.log(createCourseScheduleForm.getValues());
        console.log(createCourseTeacherForm.getValues());
        console.log(createCourseStudentForm.getValues());

        const createCourseDto: ICreateCourseDTO =  {
            title: createCourseInfoFrom.getValues().title,
            description: createCourseInfoFrom.getValues().description,
            category: createCourseInfoFrom.getValues().category,
            bannerImg: selectedFile,
            startDate: createCourseInfoFrom.getValues().startDate,
            endDate: createCourseInfoFrom.getValues().endDate,
            credits: createCourseInfoFrom.getValues().credits,
            schedule: createCourseScheduleForm.getValues().schedule,
            teachers: createCourseTeacherForm.getValues().teachers.map((teacher) => teacher.email),
            students: createCourseStudentForm.getValues().students.map((student) => student.email),
        }

        await createCourseAsync(createCourseDto)
    };

    return (
        <div className="flex flex-col p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Create Course</h1>
                    <p className="text-muted-foreground">Fill in the details below to create a new course.</p>
                </div>
            </div>
            <Select
                value={selectedTab}
                onValueChange={(value: string) => setSelectedTab(value)}
            >
                <SelectTrigger className="w-full md:hidden mt-4">
                    <SelectValue placeholder="Tab" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"info"}>Inforamtion</SelectItem>
                    <SelectItem value={"coursebanner"}>Course Banner</SelectItem>
                    <SelectItem value={"schedule"}>Schedule</SelectItem>
                    <SelectItem value={"teachers"}>Teachers</SelectItem>
                    <SelectItem value={"students"}>Students</SelectItem>
                </SelectContent>
            </Select>
            <Tabs className="mt-4 w-full md:flex items-center" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="hidden md:flex mb-4">
                    <TabsTrigger value={"info"}>Inforamtion</TabsTrigger>
                    <TabsTrigger value={"coursebanner"}>Course Banner</TabsTrigger>
                    <TabsTrigger value={"schedule"}>Schedule</TabsTrigger>
                    <TabsTrigger value={"teachers"}>Teachers</TabsTrigger>
                    <TabsTrigger value={"students"}>Students</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="w-full">
                    <CreateCourseInfoTab
                        createCourseInfoFrom={createCourseInfoFrom}
                    />
                </TabsContent>
                <TabsContent value="coursebanner" className="w-full">
                    <CreateCourseBannerTab
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
                </TabsContent>
                <TabsContent value="schedule" className="w-full">
                    <CreateCourseScheduleTab
                        createCourseScheduleForm={createCourseScheduleForm}
                    />
                </TabsContent>
                <TabsContent value="teachers" className="w-full">
                    <CreateTeacherCourseTab
                        selcetedTab={selectedTab}
                        createCourseTeacherForm={createCourseTeacherForm}
                    />
                </TabsContent>
                <TabsContent value="students" className="w-full">
                    <CreateStudentCourseTab
                        selcetedTab={selectedTab}
                        createCourseStudentForm={createCourseStudentForm}
                    />
                </TabsContent>
            </Tabs>
            <div className="f-dull flex items-center justify-between mt-4">
                <Button className="mt-4" onClick={() => handlePreviousTab(selectedTab)} disabled={selectedTab == "info"}>
                    <ChevronLeft />
                    Previous
                </Button>

                {selectedTab == "students" ? (
                    <Button className="mt-4" onClick={handleSubmit}>
                        Submit
                    </Button>
                ) : (
                    <Button className="mt-4 ml-2" onClick={() => handleNextTab(selectedTab)} disabled={selectedTab == "students"}>
                        Next
                        <ChevronRight />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default CreateCoursePage;