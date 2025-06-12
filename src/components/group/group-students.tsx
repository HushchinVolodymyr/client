"use client";

import { IGroup } from "@/types/groupTypes/i-group";
import { Card } from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Download, MoreHorizontal, PlusCircle, Trash, UserCog, UserIcon } from "lucide-react"; import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import IUser from "@/types/i-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { findUserLiveAsync } from "@/services/user-service";


interface GroupStudentsProps {
    groups: IGroup[];
    userState: IUser;
    dialogDleleteOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    dialogAddStudentOpen: boolean;
    setAddStudentDialogOpen: (open: boolean) => void;
    handleDeleteGroup: (groupName: string) => () => void;
    handleAddStudent: (groupName: string, userName: string) => void;
    handleDelteStudentFromGroup: (groupName: string, userName: string) => void;
}

function GroupStudents({ groups, userState, dialogDleleteOpen, setDeleteDialogOpen,
    handleDeleteGroup, dialogAddStudentOpen, setAddStudentDialogOpen, handleAddStudent, handleDelteStudentFromGroup }: GroupStudentsProps) {
    const [searchQuery, setSerachQuery] = useState<string>("");
    const [newStudents, setNewStudents] = useState<IUser[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const handleSearchChange = (query: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        const newTimeoutId = setTimeout(async () => {
            if (query.length > 2) {
                let users = await findUserLiveAsync(query)
                users = users.filter((user: IUser) => user.userRoles.includes("Student"))
                setNewStudents(users)
            } else {
                setNewStudents([])
            }
        }, 500)

        setTimeoutId(newTimeoutId)
    }

    const addStudentToGroup = (groupName: string, userName: string) => {
        handleAddStudent(groupName, userName)
    }

    const handleDeleteStudent = (groupName: string, userName: string) => {
        handleDelteStudentFromGroup(groupName, userName);
    }

    const handleDownloadCSV = (group: IGroup) => {
        const headers = ['First Name', 'Last Name', 'Father Name', 'Email', 'Username'];

        const rows = group.students.map((student) => [
            student.firstName,
            student.lastName,
            student.fatherName,
            student.email,
            student.userName,
        ]);

        const csvContent = [
            headers.join(','),                 // заголовок CSV
            ...rows.map(row => row.join(',')) // строки данных
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `students_${group.name}.csv`;
        link.click();
    };

    return (
        <Card className="p-4 md:p-6">
            {groups.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-muted-foreground">Groups not created or you not exist in any group</h1>
                </div>
            )}
            {groups.map((group, index) => (
                <div key={index}>
                    <div className="flex items-center justify-between">
                        <h1>Group  name: {group.name}</h1>


                        {group && userState && userState.userRoles.includes("Teacher") && userState.userName == group.curator.userName && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="flex flex-col items-center">
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadCSV(group)}>
                                        <Download className="h-4 w-4" />
                                        Students Data
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => setAddStudentDialogOpen(true)}>
                                        <PlusCircle className="h-4 w-4" />
                                        <h1>
                                            Add Student
                                        </h1>
                                    </DropdownMenuItem>
                                    <Separator className="my-1 mx-4" />
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => setDeleteDialogOpen(true)}>
                                        <Trash className="h-4 w-4" />
                                        <h1 className="hidden md:flex">
                                            Delete Group
                                        </h1>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        )}
                        <AlertDialog open={dialogDleleteOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this
                                        group and users data from servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex items-center justify-between">
                                    <AlertDialogCancel className="w-full md:w-auto">Cancel</AlertDialogCancel>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteGroup(group.name)}

                                        className="w-full md:w-auto"
                                    >
                                        <Trash className="h-4 w-4" />
                                        <h1>
                                            Delete Group
                                        </h1>
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={dialogAddStudentOpen} onOpenChange={setAddStudentDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Add new student to group</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Type and select student username to add to group
                                    </AlertDialogDescription>
                                    <div>
                                        <Input
                                            placeholder="Search student by Name"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSerachQuery(e.target.value)
                                                handleSearchChange(e.target.value)
                                            }}
                                            className="mt-2"
                                        />
                                    </div>
                                    {(newStudents && newStudents.length > 0) ? (
                                        <div className="border rounded p-3 mb-4 max-h-48 overflow-auto">
                                            {newStudents.map((user) => (
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
                                                    <Button onClick={() => addStudentToGroup(group.name, user.userName)} >
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

                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex items-center justify-between">
                                    <AlertDialogCancel className="w-full md:w-auto">Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                    </div>
                    {group.curator && (
                        <div className="mt-4 flex flex-col gap-2">
                            <h1>Curator:</h1>
                            <div className="border-1 p-2 rounded-md flex items-center justify-between">
                                <div className="flex items-center gap-3 ">
                                    <Avatar>
                                        <AvatarImage src={process.env.NEXT_PUBLIC_BASE_API_URL + group.curator.photoUrl || ""} alt={group.curator.userName} />
                                        <AvatarFallback>{group.curator.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{group.curator.firstName} {group.curator.lastName} {group.curator.fatherName}</div>
                                        <div className="text-sm text-muted-foreground">{group.curator.email}</div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <Link href={`/profile/${group.curator.userName}`}>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <UserCog className="h-4 w-4 mr-2" />
                                                View Profile
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )}
                    <div className="mt-4 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {group.students.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${student.photoUrl}` || ""} alt={student.userName} />
                                                    <AvatarFallback>{student.userName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{student.firstName} {student.lastName} {student.fatherName}</div>
                                                    <div className="text-sm text-muted-foreground">{student.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link href={`/profile/${student.userName}`} >
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <UserCog className="h-4 w-4 mr-2" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    {group && userState && userState.userRoles.includes("Teacher") && userState.userName == group.curator.userName && (
                                                        <div className="flex flex-col w-full items-center">
                                                            <Separator className="my-1 mx-4" />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => handleDeleteStudent(group.name, student.userName)}
                                                            >
                                                                <Trash className="h-4 w-4 mr-2" />
                                                                Remove from Group
                                                            </DropdownMenuItem>
                                                        </div>
                                                    )}

                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ))}
        </Card >
    );
}

export default GroupStudents;