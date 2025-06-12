"use client";

import IUser from "@/types/i-user";
import { RefObject, useRef, useState } from "react";
import { Input } from "../ui/input";
import { findUserLiveAsync } from "@/services/user-service";
import { createChat } from "@/services/chat-service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SearchChatsProps {
    setSelectedUser: (user: IUser) => void;

}

function SerachChats({ setSelectedUser }: SearchChatsProps) {
    const userState = useSelector((state: RootState) => state.user.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchUser, setSearchUser] = useState<IUser[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSearchChange = (query: string) => {
        if (timeoutId) clearTimeout(timeoutId);

        const newTimeoutId = setTimeout(async () => {
            if (query.length > 2) {
                const users = await findUserLiveAsync(query);
                setSearchUser(users || []);
                setIsDropdownOpen((users?.length ?? 0) > 0);
            } else {
                setSearchUser([]);
                setIsDropdownOpen(false);
            }
        }, 400);

        setTimeoutId(newTimeoutId);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsDropdownOpen(false);
        }, 100);
    };

    if (!userState ) {
        return <div className="text-red-500">User not found</div>;
    }

    const handleCreateChat = async (user: IUser) => {
        await createChat(user.id, userState.id);
    }

    return (
        <div>
            <div className="w-80 relative" ref={wrapperRef}>
                <Input
                    placeholder="Search user..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearchChange(e.target.value);
                    }}
                    onFocus={() => {
                        if (searchUser.length > 0) setIsDropdownOpen(true);
                    }}
                    onBlur={handleBlur}
                />

                {isDropdownOpen && (
                    <div className="absolute z-10 bg-popover mt-2 w-full rounded-md shadow-md max-h-60 overflow-y-auto border border-border flex flex-col gap-1">
                        {searchUser.length > 0 ? (
                            searchUser.map((user) => (
                                <div
                                    key={user.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                    onMouseDown={() => {
                                        setSelectedUser(user);
                                        setIsDropdownOpen(false);
                                    }}
                                >

                                    {user.firstName} {user.lastName} {user.fatherName}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500">No users found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SerachChats;