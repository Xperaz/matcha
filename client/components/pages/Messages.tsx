/* eslint-disable no-console */
"use client";
import { useEffect, useState } from "react";
import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import useSocketSetup from "@/hooks/useSocketSetup";

interface Message {
  id: number;
  content: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocketSetup();

  useEffect(() => {
    const onNewMessage = (message: Message) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket]);

  const sendTestMessage = () => {
    fetch("http://localhost:5000/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: "Test message",
        receiver_id: "07cfdf86-3b49-40b6-90c2-aee98b76b8bd",
      }),
    });
  };

  return (
    <div>
      <h1>Messages</h1>
      <button onClick={sendTestMessage}>Send Test Message</button>

      <div>
        {messages.map((message, index) => (
          <div key={message.id || index}>
            <p>{message.content}</p>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Messages));
