"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingScreen from "@/components/loading/loading-sreen";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const user  = useSelector((state: RootState) => state.user);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!user.token || !user.user) {
            router.replace("/login");
        } else {
            setChecked(true);
        }
    }, [user, router]);

    if (!checked) return <LoadingScreen/>;

    return (

        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>

    );
}
