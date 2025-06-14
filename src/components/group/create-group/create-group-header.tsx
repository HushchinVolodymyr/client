"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function CreateGroupHeader() {
    const router = useRouter();

    return ( 
        <div className="p-4 md:p-6">
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Groups
            </Button>
            <h1 className="text-2xl font-bold">Craete student group</h1>
            <p className="text-muted-foreground">Fill in the details below to create a new group.</p>
        </div>
     );
}

export default CreateGroupHeader;