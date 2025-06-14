"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store/store";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React from "react";
import Link from "next/link";

const categoryMap: Record<string, number> = {
    All: -1,
    ComputerScience: 0,
    Mathematics: 1,
    Physics: 2,
    Chemistry: 3,
    PE: 4,
    Languages: 5,
};

interface CoursesHeaderProps {
    courses: ICourse[] | null;
    sortedCourses: ICourse[] | null;
    searchCourseQuery: string;
    setSearchCourseQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedCourseType: string;
    setSelectedCourseType: React.Dispatch<React.SetStateAction<string>>;
    setSortedCourses: React.Dispatch<React.SetStateAction<ICourse[] | null>>;
}

function CoursesHeader({ courses, sortedCourses, searchCourseQuery, setSearchCourseQuery,
    selectedCourseType, setSelectedCourseType, setSortedCourses }: CoursesHeaderProps) {
    const userState = useSelector((state: RootState) => state.user.user);


    useEffect(() => {
        if (!courses) {
            setSortedCourses(null);
            return;
        }

        let filtered = [...courses];

        const selectedCategoryNumber = categoryMap[selectedCourseType];
        if (selectedCategoryNumber !== -1) {
            filtered = filtered.filter(c => c.category === selectedCategoryNumber);
        }

        if (searchCourseQuery.trim() !== "") {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchCourseQuery.toLowerCase())
            );
        }

        filtered.sort((a, b) => a.title.localeCompare(b.title));

        setSortedCourses(filtered);

    }, [courses, selectedCourseType, searchCourseQuery, setSortedCourses]);

    return (
        <div className="p-4 flex flex-col gap-4 md:p-6 md:flex-row md:items-center md:justify-between">
            <div>
                <Select
                    value={selectedCourseType}
                    onValueChange={(value) => setSelectedCourseType(value)}
                >
                    <SelectTrigger className="w-full md:w-[180px] cursor-pointer">
                        <SelectValue placeholder="Course Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem className="cursor-pointer" value="All">All</SelectItem>
                        <SelectItem className="cursor-pointer" value="ComputerScience">Computer science</SelectItem>
                        <SelectItem className="cursor-pointer" value="Mathematics">Mathematics</SelectItem>
                        <SelectItem className="cursor-pointer" value="Physics">Physics</SelectItem>
                        <SelectItem className="cursor-pointer" value="Chemistry">Chemistry</SelectItem>
                        <SelectItem className="cursor-pointer" value="PE">PE</SelectItem>
                        <SelectItem className="cursor-pointer" value="Languages">Languages</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Input
                    className={"w-full md:w-[300px]"}
                    value={searchCourseQuery}
                    onChange={(e) => { setSearchCourseQuery(e.target.value) }}
                    placeholder="Search for a course"
                />
            </div>
            {userState && userState.userRoles.includes("Teacher") ? (
                <Link href={"/courses/create"} className="w-full md:w-auto">
                    <Button className="w-full md:w-auto">
                        <PlusCircleIcon />
                        Create course
                    </Button>
                </Link>
            ) : null}
        </div>
    );
}

export default CoursesHeader;