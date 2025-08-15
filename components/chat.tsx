import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/cjs/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { HTMLAttributes } from "react";
import { ExtraProps } from "react-markdown";

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
        className={`chat-bubble ${isAssistant ? "bg-white" : "bg-gray-100"}`}
      >
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({
                inline,
                className,
                children,
                ...props
              }: HTMLAttributes<HTMLElement> &
                ExtraProps & { inline?: boolean }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <span className="loading loading-dots loading-sm"></span>
        )}
      </div>
    </div>
  );
};

export default Chat;
