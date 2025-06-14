"use client";

import CreateGroupHeader from "@/components/group/create-group/create-group-header";
import { useState } from "react";
import CraeteGroup from "@/components/group/create-group/create-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStudentFormSchema } from "@/forms/users/create-group-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGroupDTO } from "@/DTOs/GroupDTOs/create-group-dto";
import { create } from "domain";
import { createGroup } from "@/services/group-service";


function CreateGroupPage() {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const createGroupStudentsForm = useForm<z.infer<typeof createStudentFormSchema>>({
        resolver: zodResolver(createStudentFormSchema),
    });

    const handleCreateGroup = createGroupStudentsForm.handleSubmit(async () => {
        setIsCreating(true);
        const formData = createGroupStudentsForm.getValues();

        const createGroupDto: CreateGroupDTO = {
            groupName: formData.groupName,
            students: formData.students.map((student) => ({
                username: student.firstName[0] + student.lastName[0] + Math.floor(Math.random() * 1000) + student.email.split("@")[0],
                firstName: student.firstName,
                lastName: student.lastName,
                fatherName: student.fatherName,
                email: student.email,
            })),
        }

        console.log("Create group DTO:", createGroupDto);

        await createGroup(createGroupDto);

        setIsCreating(false);
    });

    return (
        <div className="flex flex-col">
            <CreateGroupHeader />
            <CraeteGroup
                handleCreateGroup={handleCreateGroup}
                isCreating={isCreating}
                createGroupStudentsForm={createGroupStudentsForm}
            />

        </div>
    );
}

export default CreateGroupPage;