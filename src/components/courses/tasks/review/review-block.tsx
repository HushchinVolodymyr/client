'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    Download,
    UserIcon,
    Clock,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { ICourse } from '@/types/coursesTypes/i-course';
import { ITask } from '@/types/coursesTypes/tasksTypes/i-task';
import { handleDownload } from '@/lib/download-file';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';


interface ReviewBlockProps {
    course: ICourse;
    task: ITask;
    handleSaveAllChanges: () => Promise<void>;
    pointsMap: Record<number, number | null>;
    handleUpdatePoints: (submissionId: number, points: number | null) => void;
    setPointsMap: React.Dispatch<React.SetStateAction<Record<number, number | null>>>;
    commentsMap: Record<number, string>;
    handleUpdateComment: (submissionId: number, comment: string | null) => void;
    setCommentsMap: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

type SubmissionStatus = 'not_submitted' | 'submitted' | 'graded' | 'all';

function ReviewBlock({
    course,
    task,
    pointsMap,
    handleUpdatePoints,
    handleSaveAllChanges,
    setPointsMap,
    commentsMap,
    handleUpdateComment,
    setCommentsMap,
}: ReviewBlockProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<SubmissionStatus>('all');

    // Инициализация pointsMap и commentsMap для каждой работы по её ID
    useEffect(() => {
        const initialPoints: Record<number, number | null> = {};
        const initialComments: Record<number, string> = {};

        task.submissions.forEach((s) => {
            console.log('Processing submission:', s);
            if (s.id) {
                initialPoints[s.id] = s.points ?? null;
                initialComments[s.id] = s.comment ?? '';
            }
        });

        setPointsMap(initialPoints);
        setCommentsMap(initialComments);
    }, [task.submissions, setPointsMap, setCommentsMap]);

    const getSubmission = (userName: string) =>
        task.submissions.filter((s) => s.student.userName === userName);

    const getStatus = (submission?: ITask['submissions'][0]): Exclude<SubmissionStatus, 'all'> => {
        if (!submission) return 'not_submitted';
        return submission.points === null ? 'submitted' : 'graded';
    };

    const getStatusBadge = (status: Exclude<SubmissionStatus, 'all'>) => {
        switch (status) {
            case 'graded':
                return <Badge className="bg-green-500">Graded</Badge>;
            case 'submitted':
                return <Badge className="bg-blue-500">Submitted</Badge>;
            case 'not_submitted':
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Not Submitted
                    </Badge>
                );
        }
    };

    const getStatusIcon = (status: Exclude<SubmissionStatus, 'all'>) => {
        switch (status) {
            case 'graded':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'submitted':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'not_submitted':
                return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const filteredStudents = useMemo(() => {
        return course.students.filter((student) => {
            const submissions = getSubmission(student.userName);
            const status = submissions.length > 0 ? getStatus(submissions[0]) : 'not_submitted';

            const matchesSearch =
                student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.userName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [course.students, searchQuery, statusFilter]);

    const handleCommentChange = (submissionId: number, comment: string) => {
        handleUpdateComment(submissionId, comment);
    };

    const handleDownloadCSV = () => {
        const rows = course.students.map((student) => {
            const submission = task.submissions.find((s) => s.student.userName === student.userName);
            const status = submission ? (submission.points === null ? 'submitted' : 'graded') : 'not_submitted';
            const points = submission ? submission.points : 'N/A';
            return [
                student.firstName,
                student.lastName,
                status,
                points
            ];
        });

        const headers = ['First Name', 'Last Name', 'Status', 'Grade'];

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')), 
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'student_submissions.csv';
        link.click();
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription className='flex items-center justify-between'>
                    <div>
                        {task.submissions.filter((s) => s.student !== null && s.student !== undefined).length} of{' '}
                        {course.students.length} students have submitted
                    </div>
                    <Button
                        variant="outline"
                        onClick={ handleDownloadCSV }
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export grades
                    </Button>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                    <Input
                        placeholder="Search by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SubmissionStatus)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="graded">Graded</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="not_submitted">Not Submitted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted Files</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => {
                                const submissions = getSubmission(student.userName);
                                const status = submissions.length > 0 ? getStatus(submissions[0]) : 'not_submitted';
                                return (
                                    <React.Fragment key={student.userName}>
                                        <TableRow>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={student.photoUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${student.photoUrl}` : ''}
                                                            alt={student.userName}
                                                        />
                                                        <AvatarFallback>
                                                            <UserIcon className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {student.firstName} {student.lastName}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{student.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="w-[120px]">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(status)}
                                                    {getStatusBadge(status)}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {submissions.length > 0 ? (
                                                    <Accordion type="multiple">
                                                        {submissions.map((submission, index) => (
                                                            <AccordionItem key={submission.id} value={`item-${submission.id}`}>
                                                                <AccordionTrigger>
                                                                    {`Submission #${index + 1}`}
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    <div>
                                                                        {submission.submissionsFiles?.map((file, fileIndex) => (
                                                                            <div key={fileIndex} className="flex items-center gap-2">
                                                                                <FileText className="h-6 w-6 text-muted-foreground" />
                                                                                <span className="text-sm">{file.name}</span>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-6 px-2 ml-auto"
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size={'icon'}
                                                                                        onClick={() => handleDownload(file.fileUrl, file.name)}
                                                                                    >
                                                                                        <Download className="h-3 w-3" />
                                                                                        <span className="sr-only">Download</span>
                                                                                    </Button>
                                                                                </Button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <Input
                                                                            type="number"
                                                                            className="h-8 w-24"
                                                                            min={0}
                                                                            max={task.maxPoints}
                                                                            value={pointsMap[submission.id] ?? ''}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value === '' ? null : parseInt(e.target.value);
                                                                                handleUpdatePoints(submission.id, value);
                                                                            }}
                                                                        />
                                                                        <span className="text-sm text-muted-foreground">/ {task.maxPoints}</span>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Add comment"
                                                                            className="h-8 w-full"
                                                                            value={commentsMap[submission.id] || ''}
                                                                            onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                                                                        />
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No submissions</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-2">
                    <Button onClick={handleSaveAllChanges}>Save All Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ReviewBlock;
