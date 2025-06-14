"use client";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import IUser from "@/types/i-user";
import Chat from "@/components/chat/chat";
import SerachChats from "@/components/chat/search-chats";
import ChatList from "@/components/chat/chat-list";

function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    return (
        <div className="p-4 md:p-6 flex gap-4 md:gap-6 h-full">
            <div className="display-flex flex-col gap-4 w-80">
                <SerachChats setSelectedUser={setSelectedUser} />
                <ChatList />
            </div>
            
            <Separator orientation="vertical" />

            <div className="w-full">
                {selectedUser ? (
                    <Chat selectedUser={selectedUser} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p className="text-center">Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;
