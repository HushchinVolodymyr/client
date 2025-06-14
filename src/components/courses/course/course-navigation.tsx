"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CourseNavigationProps {
    courseCode: string;
}


function CourseNavigation({ courseCode }: CourseNavigationProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Main", href: `/courses/${courseCode}` },
        { label: "Tasks", href: `/courses/${courseCode}/tasks` },
        { label: "Users", href: `/courses/${courseCode}/users` },
    ];


    return (
        <div className="w-full md:w-fit self-start">
            <NavigationMenu className="w-full">
                <NavigationMenuList className="flex w-full flex-row gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <NavigationMenuItem
                                key={item.label}
                                className="flex-1 md:flex-none md:w-32"
                            >
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "block text-center w-full px-3 py-2 rounded-md transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        {
                                            "bg-muted font-medium": isActive,
                                        }
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </NavigationMenuItem>
                        );
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

export default CourseNavigation;