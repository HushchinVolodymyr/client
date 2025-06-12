"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export interface Message {
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: string;
}

export function useChat(receiverId: string, token: string, currentUserId: string) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5000/chat", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    conn.start().then(() => {
      conn.on("ReceiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    });

    setConnection(conn);

    return () => {
      conn.stop();
    };
  }, [receiverId, token]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(`http://localhost:5000/api/chat/history/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMessages(data);
    };

    fetchHistory();
  }, [receiverId]);

  const sendMessage = async (message: string) => {
    if (connection) {
      await connection.send("SendPrivateMessage", receiverId, message);
    }
  };

  return { messages, sendMessage };
}
