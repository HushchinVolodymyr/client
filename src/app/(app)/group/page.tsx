"use client";


import GroupHeader from "@/components/group/group-header";
import GroupStudents from "@/components/group/group-students";
import { addStudentToGroup, deleteGroup, getAllGroups, removeStudentFromGroup } from "@/services/group-service";
import { RootState } from "@/store/store";
import { IGroup } from "@/types/groupTypes/i-group";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function GroupPage() {
    const userState = useSelector((state: RootState) => state.user.user);
    const [dialogDeleteOpen, setDeleteDialogOpen] = useState(false);
    const [dialogAddStudentOpen, setAddStudentDialogOpen] = useState(false);
    const [group, setGroup] = useState<IGroup[] | null>(null);


    const fetchGroup = async () => {
        const response = await getAllGroups();

        if (response) {
            setGroup(response);
        }
    }

    useEffect(() => {
        fetchGroup();
    }, []);

    const handleDeleteGroup = (groupName: string) => async () => {
        await deleteGroup(groupName);
        setDeleteDialogOpen(false);
        fetchGroup();
    }



    const handleAddStudent = async (groupName: string, userName: string) => {
        await addStudentToGroup(groupName, userName);
        fetchGroup();
    }

    const handleDelteStudentFromGroup = async (groupName: string, userName: string) => {
        await removeStudentFromGroup(groupName, userName);
        fetchGroup();
    }

    return (
        <div className="flex flex-col p-4 md:p-6 gap-4">
            {userState && (
                <GroupHeader userState={userState} />
            )}

            {group && userState ? (
                <GroupStudents
                    groups={group}
                    userState={userState}
                    dialogDleleteOpen={dialogDeleteOpen}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    handleDeleteGroup={handleDeleteGroup}
                    dialogAddStudentOpen={dialogAddStudentOpen}
                    setAddStudentDialogOpen={setAddStudentDialogOpen}
                    handleAddStudent={handleAddStudent}
                    handleDelteStudentFromGroup={handleDelteStudentFromGroup}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-bold">Group not created or not found</p>
                </div>
            )}


        </div>
    );
}

export default GroupPage;