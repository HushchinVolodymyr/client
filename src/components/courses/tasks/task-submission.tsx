"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ITaskFile } from "@/types/coursesTypes/tasksTypes/i-task-file"
import { getTaskByIdAsync, submmitTaskAsync } from "@/services/task-service"
import { FileText, Loader2Icon, Upload, File, Trash2 } from "lucide-react"
import { ITask } from "@/types/coursesTypes/tasksTypes/i-task"
import { handleDownload } from "@/lib/download-file"
import { Badge } from "@/components/ui/badge"


// Function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

interface CreateTaskPageProps {
  courseCode: string,
  taskId: number

}

export default function CreateTaskPage({ courseCode, taskId }: CreateTaskPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<ITaskFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [task, setTask] = useState<ITask | null>(null);

  const fetchTask = async () => {
    const taskData = await getTaskByIdAsync(taskId);
    if (taskData)
      setTask(taskData);

    console.log(taskData);
  }

  useEffect(() => {


    fetchTask()
  }, [])


  async function onSubmit() {
    setIsSubmitting(true)

    submmitTaskAsync(taskId, courseCode, files.map(file => file.file))

    setTimeout(() => {
      fetchTask()
    }, 1000)

    setIsSubmitting(false)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return

    const allowedExtensions = ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'mp3', "mp4", 'jpg', 'jpeg', 'png']
    const newFiles: ITaskFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()?.toLowerCase()

      if (!ext || !allowedExtensions.includes(ext)) {
        toast.error(`File "${file.name}" have unaccepted format. Allowed only: PDF, DOCX, XLSX, PPTX.`)
        continue
      }

      newFiles.push({
        id: crypto.randomUUID(),
        file: file,
        name: file.name,
        size: formatFileSize(file.size),
      })
    }

    setFiles(prev => [...prev, ...newFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function removeMaterial(id: string) {
    setFiles(files.filter((material) => material.id !== id))
  }

  function updateMaterialName(id: string, name: string) {
    setFiles(files.map((material) => (material.id === id ? { ...material, name } : material)))
  }

  function triggerFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }


  return (
    <Card className="col-span-1 md:col-span-2 mt-4" >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex flex-col gap-2">
            <CardTitle>Submission files</CardTitle>
            <CardDescription>Attach files and resources for this task.</CardDescription>
          </div>
          {task?.submissions && task.submissions.length > 0 ? (
            <div className="space-y-3 mt-4 pt-2">

            </div>
          ) : (
            <Button onClick={onSubmit} disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting && (
                <>
                  <Loader2Icon className="animate-spin h-4 w-4" />
                  Submitting...
                </>
              )}
              Submit Task
            </Button>)}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
      </CardHeader>
      <CardContent>
        {task?.submissions && task.submissions.length > 0 ? (
          <div className="space-y-3">
              <h1 className="text-lg font-semibold">Submitted</h1>

            {task.submissions.map((submission, index) => (
              <div key={submission.id} className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Submitted at: {new Date(submission.created).toLocaleString()}
                </div>
                <div>
                  {submission.points && (
                    <Badge className="text-sm">{submission.points} / {task.maxPoints}</Badge>
                  )}
                  {submission.comment && (
                    <h1>Comment: {submission.comment}</h1>
                  )}
                </div>
                {submission.submissionsFiles?.map((file, fileIndex) => (
                  <div
                    key={fileIndex}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(file.fileUrl, file.name)}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            {/* оригинальный пустой блок */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-2 text-sm font-medium">No files attached</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload files for completing this task.
            </p>
            <div className="mt-4 flex flex-col items-center">
              <Button type="button" variant="secondary" size="sm" onClick={triggerFileInput}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Supports documents, images, videos, and audio files
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* отрисовка выбранных пользователем файлов */}
            {files.map((material) => (
              <div key={material.id} className="flex items-center gap-4 rounded-md border p-4">
                <div className="flex items-center gap-3 flex-1">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Input
                      value={material.name}
                      onChange={(e) => updateMaterialName(material.id, e.target.value)}
                      className="border-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{material.size}</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeMaterial(material.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
            <div className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                <Upload className="mr-2 h-4 w-4" />
                Add More Files
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card >
  )
}