"use client";

import { Send, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IUser from "@/types/i-user";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

interface ChatProps {
    selectedUser: IUser;
}


function Chat({ selectedUser }: ChatProps) {
    const [messageText, setMessageText] = useState("");
    const [connection, setConnection] = useState<HubConnection | null>(null);


    const joinChat = async (userName: string, chatRoom: string) => {
        var connection = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_BASE_API_URL}/hubs/chat`)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveMessage", (userName, messageText) => {
            console.log("Message received:", userName, messageText);
        });

        try {
            await connection.start()
            await connection.invoke("JoinChat", { userName, chatRoom });

            setConnection(connection);
        } catch (error) {
            console.error("Error starting connection:", error);
        }

    }

    useEffect(() => {
        

        joinChat(selectedUser.userName, "default-chat-room");
    }, []);

    const getRoleBadges = (roles: IUser["userRoles"]) => {
        return roles.map((role) => {
            switch (role) {
                case "Admin":
                    return <Badge key={role} className="bg-red-500">Admin</Badge>
                case "Teacher":
                    return <Badge key={role} className="bg-blue-500">Teacher</Badge>
                case "Student":
                    return <Badge key={role} className="bg-green-500">Student</Badge>
                default:
                    return null
            }
        })
    }

    return (
        <div className="flex flex-col h-full">
            {selectedUser && connection ? (
                <div className="h-full flex flex-col justify-between">
                    <div className="text-secondary-foreground">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={process.env.NEXT_PUBLIC_BASE_API_URL + selectedUser.photoUrl} alt={selectedUser.userName} />
                                <AvatarFallback>
                                    <UserIcon className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName} {selectedUser.fatherName}</p>
                                    {getRoleBadges(selectedUser.userRoles)}
                                </div>
                                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <ScrollArea className="h-full">
                            <div className="flex flex-col gap-2">


                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <Button size={"icon"}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-center">Select a user to start chatting</p>
                </div>
            )}
        </div>
    );
}

export default Chat;