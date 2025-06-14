"use client";

import { Download, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ITask } from '@/types/coursesTypes/tasksTypes/i-task';
import { toast } from 'sonner';
import { handleDownload } from '@/lib/download-file';

interface TaskMaterialProps {
    task: ITask;
}

function TaskMaterials({ task }: TaskMaterialProps) {

    

    return (
        <Card className="shadow-sm">
            <CardContent>
                <h1 className='text-lg'>Description</h1>
                {task.description && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-md text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                    </div>
                )}


                {task.taskFiles && task.taskFiles.length > 0 ? (

                    <div className="space-y-3 mt-4 pt-2">
                        <h1>Materials</h1>
                        {task.taskFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-3 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{file.name}</span>
                                </div>
                                <Button variant={"outline"} onClick={() => handleDownload(file.fileUrl, file.name)}>
                                    Download
                                </Button>

                            </div>
                        ))}
                    </div>
                ) : null}
            </CardContent>
        </Card >
    );
}

export default TaskMaterials;