"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useEffect, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCourseSchduleFormSchema, cretaeCourseFormSchema } from "@/forms/courses/create-course-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteCourseAsync, editCourseAsync, getCourseByCode } from "@/services/courses-service";
import { ICourse } from "@/types/coursesTypes/i-course";
import { useRouter } from "next/navigation";
import EditCourseBannerTab from "@/components/courses/edit/edit-banner-tab";
import EditCourseInfoTab from "@/components/courses/edit/edit-info-tab";
import EditCourseScheduleTab from "@/components/courses/edit/edit-schedule-tab";
import { IEditCourseDTO } from "@/DTOs/CoursesDTOs/edit-course-dto";
import LoadingScreen from "@/components/loading/loading-sreen";


function CreateCoursePage({ params }: { params: Promise<{ courseCode: string }> }) {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState<string>("info");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const unwrappedParams = use(params);
    const [isLoading, setIsLoading] = useState(true)
    const [course, setCourse] = useState<ICourse | null>(null)

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCourses = async () => {
            const coursesData: ICourse | null = await getCourseByCode(unwrappedParams.courseCode);
            if (coursesData) setCourse(coursesData);
            console.log(coursesData);

            if (coursesData) {
                setCourse(coursesData);
                createCourseInfoFrom.reset({
                    title: coursesData.title,
                    description: coursesData.description,
                    category: coursesData.category,
                    startDate: new Date(coursesData.startDate),
                    endDate: new Date(coursesData.endDate),
                    credits: coursesData.credits,
                });
            }

            if (coursesData?.schedule && coursesData.schedule.length > 0) {
                createCourseScheduleForm.reset({
                    schedule: coursesData.schedule.map(item => ({
                        day: item.dayOfWeek,
                        startTime: item.time,
                        location: item.location,
                    })),
                });
            }

            setIsLoading(false);
        };

        fetchCourses();


    }, [])

    const createCourseInfoFrom = useForm<z.infer<typeof cretaeCourseFormSchema>>({
        resolver: zodResolver(cretaeCourseFormSchema),
        defaultValues: {
            title: "",
            description: "",
            category: 0,
            startDate: new Date(),
            endDate: new Date(),
            credits: 0,
        },
    });
    const createCourseScheduleForm = useForm<z.infer<typeof createCourseSchduleFormSchema>>({
        resolver: zodResolver(createCourseSchduleFormSchema),
        defaultValues: {
            schedule: [],
        },
    });


    const handleNextTab = () => {
        if (selectedTab == "info") setSelectedTab("coursebanner");
        if (selectedTab == "coursebanner") setSelectedTab("schedule");
    };

    const handlePreviousTab = () => {
        if (selectedTab == "schedule") setSelectedTab("coursebanner");
        if (selectedTab == "coursebanner") setSelectedTab("info");
    };

    const handleSubmit = async () => {
        const editCourseDto: IEditCourseDTO = {
            title: createCourseInfoFrom.getValues().title,
            description: createCourseInfoFrom.getValues().description,
            category: createCourseInfoFrom.getValues().category,
            bannerImg: selectedFile,
            startDate: createCourseInfoFrom.getValues().startDate,
            endDate: createCourseInfoFrom.getValues().endDate,
            credits: createCourseInfoFrom.getValues().credits,
            schedule: createCourseScheduleForm.getValues().schedule,
        }

        await editCourseAsync(editCourseDto, unwrappedParams.courseCode, router);
    };

    if (!course && !isLoading) {
        router.push("/courses");
    }

    return (
        <div className="flex flex-col p-4 md:p-6">
            {isLoading && <LoadingScreen/>}
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <div className="flex items-center w-full justify-between">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ChevronLeft className="mr-2" />
                            <h1>
                                Back to Course {course ? course.courseCode : ""}
                            </h1>
                        </Button>
                        <Button variant={"destructive"} onClick={() => {
                            deleteCourseAsync(unwrappedParams.courseCode, router)
                        }}>
                            <Trash2 className="mr-2" />
                            <h1 className="hidden md:inline">
                                Delete Course
                            </h1>
                        </Button>
                    </div>

                    <h1 className="text-2xl font-bold mt-2">Edit Course</h1>
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
                </SelectContent>
            </Select>
            <Tabs className="mt-4 w-full md:flex items-center" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="hidden md:flex mb-4">
                    <TabsTrigger value={"info"}>Inforamtion</TabsTrigger>
                    <TabsTrigger value={"coursebanner"}>Course Banner</TabsTrigger>
                    <TabsTrigger value={"schedule"}>Schedule</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="w-full">
                    <EditCourseInfoTab
                        createCourseInfoFrom={createCourseInfoFrom}
                    />
                </TabsContent>
                <TabsContent value="coursebanner" className="w-full">
                    <EditCourseBannerTab
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
                </TabsContent>
                <TabsContent value="schedule" className="w-full">
                    <EditCourseScheduleTab
                        createCourseScheduleForm={createCourseScheduleForm}
                    />
                </TabsContent>
            </Tabs>
            <div className="f-dull flex items-center justify-between mt-4">
                <Button className="mt-4" onClick={() => handlePreviousTab()} disabled={selectedTab == "info"}>
                    <ChevronLeft />
                    Previous
                </Button>

                {selectedTab == "schedule" ? (
                    <Button className="mt-4" onClick={handleSubmit}>

                        Submit
                    </Button>
                ) : (
                    <Button className="mt-4 ml-2" onClick={() => handleNextTab()} disabled={selectedTab == "students"}>
                        Next
                        <ChevronRight />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default CreateCoursePage;