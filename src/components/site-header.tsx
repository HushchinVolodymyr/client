"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme-mode-toggle";

export function SiteHeader() {

    return (
        <header
            className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 pl-4 pr-2 lg:gap-2 lg:pl-6 lg:pr4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <div className="flex items-center justify-between w-full">
                    <div/>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}
