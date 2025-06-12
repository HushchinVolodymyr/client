"use client";

import UploadCourseBannerBlock from "@/components/blocks/upload-course-banner-ing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface EditCourseBannerTabProps {
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
}

function EditCourseBannerTab({ selectedFile, setSelectedFile }: EditCourseBannerTabProps) {

    return (
        <Card className="w-full p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold">Course Banner</h2>
                    <p className="text-muted-foreground">It`s will be desplayd on course card</p>
                </div>
                <Button variant={"destructive"} onClick={() => setSelectedFile(null)}>
                    <Trash2 className="mr-2" />
                    Reset
                </Button>
            </div>
            <UploadCourseBannerBlock
                selectedFile={selectedFile}
                onImageSelect={setSelectedFile}
            />
        </Card>
    );
}

export default EditCourseBannerTab;
