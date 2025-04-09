import React, { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "../../types/chat";

interface ChatInterfaceProps {
  messages: Message[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col gap-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};