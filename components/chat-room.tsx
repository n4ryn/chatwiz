"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import Chat from "./chat";

import { Persona } from "@/types";
import { useChatStore } from "@/stores/useChatStore";
import { personaData } from "@/libs/persona";

const Chatroom = ({ persona }: { persona: Persona }) => {
  const { chats, addChat, updateLastMessage } = useChatStore();
  const [message, setMessage] = useState("");
  const chatroomId = persona.id.toString();
  const roomChats = chats[chatroomId] || [];
  const [limitReached, setLimitReached] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleStream = async () => {
    if (limitReached) {
      alert("Demo complete: You have reached the request limit.");
      return;
    }

    addChat(chatroomId, {
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    setMessage("");

    addChat(chatroomId, {
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          history: [...roomChats, { role: "user", content: message }],
          systemPrompt: persona.systemPrompts,
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        if (data.error === "demo_complete") {
          setLimitReached(true);
          updateLastMessage(
            chatroomId,
            "🚫 Demo complete: Request limit reached."
          );

          alert("Demo complete: You have reached the request limit.");
          return;
        }
      }

      if (!res.ok) {
        updateLastMessage(chatroomId, "❌ Error: Unable to get a response.");
        return;
      }

      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partialMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const { content } = JSON.parse(line.replace("data: ", ""));
              partialMessage += content;
              useChatStore
                .getState()
                .updateLastMessage(chatroomId, partialMessage);
            } catch (error) {
              updateLastMessage(
                chatroomId,
                "❌ Network error. Please try again."
              );
            }
          }
        });
      }
    } catch (error) {
      updateLastMessage(chatroomId, "❌ Network error. Please try again.");
    }
  };

  return (
    <section className="w-full h-screen">
      <main className="lg:px-5 w-full h-full lg:py-5">
        <div
          className="overflow-scroll h-full p-4 lg:p-8 pt-32 lg:pt-30 mx-auto max-w-7xl lg:rounded-4xl flex"
          style={{
            background:
              "linear-gradient(165deg, #f2f2f2 30%, #f9d8ad 40%, #f1a9d3 60%, #f0d1fc 70%, #fbd2e2 80%, #e3f1fd 100%)",
          }}
        >
          <div className="h-full w-24 transition-all duration-300 md:block md:w-80 shrink-0 bg-white/20 backdrop-blur-lg p-4 rounded-l-2xl overflow-scroll">
            {personaData.map((room) => (
              <Link href={`/chat/${room.id}`} key={room.id}>
                <div
                  className={`flex gap-4 p-3 mb-4 ${
                    Number(chatroomId) === room.id && "bg-[#f0d1fc]"
                  } hover:bg-[#fbd2e2]/40  rounded-box shadow-md`}
                >
                  <Image
                    alt={`${room.name} avatar`}
                    width={400}
                    height={400}
                    src={room.avatar}
                    className="size-10 rounded-box"
                  />
                  <div className="hidden md:flex flex-col">
                    <p className="text-sm font-bold">{room.name}</p>
                    <p className="text-xs opacity-60 line-clamp-1 mt-1">
                      {chats[room.id]?.length
                        ? chats[room.id][chats[room.id].length - 1].content
                        : "Start chatting..."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col justify-end flex-1">
            {chats[chatroomId]?.length > 0 && (
              <div className="overflow-scroll p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                {roomChats.map((chat, index) => (
                  <Chat key={index} chat={chat} persona={persona} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            {!chats[chatroomId]?.length && (
              <div className="flex flex-col items-center justify-center gap-4 p-4 text-center">
                <p className="text-sm font-bold">No chats yet</p>
                <p className="text-xs opacity-60">
                  Start chatting with {persona.name}
                </p>
              </div>
            )}

            <fieldset className="fieldset backdrop-blur-md bg-white/20 border-base-300 rounded-box w-full p-2">
              <div className="join">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStream()}
                  className="input join-item w-full focus:outline-none"
                  placeholder="Type a message..."
                />
                <button
                  className="btn bg-black text-white join-item"
                  onClick={handleStream}
                >
                  Send
                </button>
              </div>
            </fieldset>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Chatroom;
