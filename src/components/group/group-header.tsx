import Link from "next/link";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import IUser from "@/types/i-user";

interface GroupHeaderProps {
    userState: IUser;
}

function GroupHeader({ userState }: GroupHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl text-bold">Group page</h1>
                <p className="text-muted-foreground">Group page managment or preview</p>
            </div>
            {userState && userState.userRoles.includes("Teacher") && (
                <Link href="/group/create-group">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Group
                    </Button>
                </Link>
            )}
        </div>
    );
}

export default GroupHeader;