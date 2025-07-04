"use client"

import * as React from "react"
import {
    BarChartIcon, BookOpenCheck,
    Group,
    LayoutDashboardIcon,
    MessageCircle,
    SettingsIcon,
    Users,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

const data = {
    navMain: [
        {
            title: "Courses",
            url: "/courses",
            icon: BookOpenCheck,
        },
        // {
        //     title: "Schedule",
        //     url: "/schedule",
        //     icon: BarChartIcon,
        // },
        // {
        //     title: "Chats",
        //     url: "/chats",
        //     icon: MessageCircle,
        // },
        {
            title: "Users",
            url: "/users",
            icon: Users
        },
        {
            title: "Group",
            url: "/group",
            icon: Group,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props} className={"border-none"} >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                        >
                            <Link href="/courses">
                                <svg
                                    id="Component_41_1"
                                    data-name="Component 41 – 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 112.769 108.171"
                                    className="h-20 w-20 text-black dark:text-white"
                                    fill="currentColor"
                                >
                                    <g id="Group_9">
                                        <g id="Group_1" data-name="Group 1" transform="translate(33.819 42.25)">
                                            <circle id="Ellipse_1" data-name="Ellipse 1" cx="13.179" cy="13.179" r="13.179" transform="translate(2.531 2.53)"/>
                                            <path id="Path_1" data-name="Path 1" d="M181.757,205.964a15.709,15.709,0,1,1,15.71-15.709A15.727,15.727,0,0,1,181.757,205.964Zm0-26.358a10.649,10.649,0,1,0,10.649,10.649A10.661,10.661,0,0,0,181.757,179.606Z" transform="translate(-166.047 -174.545)"/>
                                        </g>
                                        <g id="Group_2" data-name="Group 2" transform="translate(0 10.782)">
                                            <path id="Path_2" data-name="Path 2" d="M102.354,194.692c-5.521,0-10.011-1.572-12.982-4.881-10.381-11.56,2.3-39.3,28.863-63.163s55.511-33.494,65.892-21.934c5.241,5.836,4.869,15.8-1.049,28.062-5.562,11.522-15.441,23.987-27.816,35.1C136.3,184.908,116.123,194.692,102.354,194.692Zm68.664-89.573c-11.4,0-30.079,8.353-49.2,25.523-25.95,23.305-35.664,47.556-28.455,55.583s32.357.967,58.31-22.342c11.867-10.658,21.3-22.534,26.568-33.441,4.837-10.022,5.526-18.092,1.889-22.142C178.235,106.187,175.091,105.12,171.018,105.12Z" transform="translate(-85.754 -99.833)"/>
                                        </g>
                                        <g id="Group_3" data-name="Group 3" transform="translate(58.193 32.85)">
                                            <line id="Line_1" data-name="Line 1" y1="14.782" x2="19.1" transform="translate(1.549 2.001)" fill="#f4c816"/>
                                            <rect id="Rectangle_3" data-name="Rectangle 3" width="24.153" height="5.062" transform="translate(0 14.781) rotate(-37.734)"/>
                                        </g>
                                        <g id="Group_4" data-name="Group 4" transform="translate(23.69 32.694)">
                                            <line id="Line_2" data-name="Line 2" x1="11.931" y1="14.244" transform="translate(3.276 3.248)" fill="#f4c816"/>
                                            <rect id="Rectangle_4" data-name="Rectangle 4" width="5.061" height="20.684" transform="translate(0 3.246) rotate(-39.894)"/>
                                        </g>
                                        <g id="Group_5" data-name="Group 5" transform="translate(36.504 69.04)">
                                            <line id="Line_3" data-name="Line 3" x1="4.97" y2="14.464" transform="translate(2.393 0.823)" fill="#f4c816"/>
                                            <rect id="Rectangle_5" data-name="Rectangle 5" width="15.293" height="5.061" transform="translate(0 14.463) rotate(-71.034)"/>
                                        </g>
                                        <g id="Group_6" data-name="Group 6" transform="translate(70.37)">
                                            <circle id="Ellipse_2" data-name="Ellipse 2" cx="18.669" cy="18.669" r="18.669" transform="translate(2.531 2.53)"/>
                                            <path id="Path_3" data-name="Path 3" d="M274.027,116.632a21.2,21.2,0,1,1,21.2-21.2A21.223,21.223,0,0,1,274.027,116.632Zm0-37.337a16.138,16.138,0,1,0,16.139,16.139A16.157,16.157,0,0,0,274.027,79.295Z" transform="translate(-252.828 -74.234)"/>
                                        </g>
                                        <g id="Group_7" data-name="Group 7" transform="translate(8.625 16.296)">
                                            <circle id="Ellipse_3" data-name="Ellipse 3" cx="8.423" cy="8.423" r="8.423" transform="translate(2.53 2.53)"/>
                                            <path id="Path_4" data-name="Path 4" d="M117.185,134.831a10.953,10.953,0,1,1,10.954-10.952A10.965,10.965,0,0,1,117.185,134.831Zm0-16.845a5.892,5.892,0,1,0,5.893,5.893A5.9,5.9,0,0,0,117.185,117.986Z" transform="translate(-106.231 -112.925)"/>
                                        </g>
                                        <g id="Group_8" data-name="Group 8" transform="translate(23.552 81.598)">
                                            <circle id="Ellipse_4" data-name="Ellipse 4" cx="10.757" cy="10.757" r="10.757" transform="translate(2.531 2.53)"/>
                                            <path id="Path_5" data-name="Path 5" d="M154.959,294.538a13.287,13.287,0,1,1,13.287-13.286A13.3,13.3,0,0,1,154.959,294.538Zm0-21.512a8.226,8.226,0,1,0,8.226,8.226A8.236,8.236,0,0,0,154.959,273.026Z" transform="translate(-141.672 -267.965)"/>
                                        </g>
                                    </g>
                                </svg>
                                <span className="text-base font-semibold">IPZE Edu. Sys.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
