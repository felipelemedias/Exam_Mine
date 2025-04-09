import React from "react";
import { cn } from "../../lib/utils";
import { Message } from "../../types/chat";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser
            ? "bg-[#1760c6] text-white"
            : "bg-white border border-gray-200 text-gray-800"
        )}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <div
          className={cn(
            "text-xs mt-1",
            isUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};