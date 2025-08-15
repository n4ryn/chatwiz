import Image from "next/image";

import { ChatType, Persona } from "@/types";

const Chat = ({ chat, persona }: { chat: ChatType; persona: Persona }) => {
  const { role, content, timestamp } = chat;
  const { name, avatar } = persona;

  const isAssistant = role === "assistant";
  const date = new Date(timestamp).toLocaleTimeString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className={`chat ${isAssistant ? "chat-start" : "chat-end"}`}>
      {isAssistant && (
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image
              alt={`${name} avatar`}
              width={400}
              height={400}
              src={avatar}
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
      )}
      <div className="chat-header">
        {isAssistant ? name : "You"}
        <time className="text-xs opacity-50">{date}</time>
      </div>

      <div
        className={`chat-bubble ${isAssistant ? "bg-white" : "bg-gray-200"}`}
      >
        {content || <span className="loading loading-dots loading-sm"></span>}
      </div>
    </div>
  );
};

export default Chat;
