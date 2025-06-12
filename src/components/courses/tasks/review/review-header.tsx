"use client";

import { Button } from "@/components/ui/button";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";



function ReviewHeader() {
    const router = useRouter();

    return (
        <div className="border-b">
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-1" 
                    onClick={() => router.back()}>
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to task
                    </Button>

                </div>
            </div>
        </div>
    );
}

export default ReviewHeader;