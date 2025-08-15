"use client";

import { Persona } from "@/types";
import Chat from "./chat";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";

const Chatroom = ({ persona }: { persona: Persona }) => {
  const { chats, addChat } = useChatStore();
  const [message, setMessage] = useState("");
  const chatroomId = persona.id.toString();
  const roomChats = chats[chatroomId] || [];

  console.log(roomChats);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleStream = async () => {
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
              console.error(error);
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
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
          <div className="flex flex-col justify-end flex-1">
            <div className="overflow-scroll p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {roomChats.map((chat, index) => (
                <Chat key={index} chat={chat} persona={persona} />
              ))}
              <div ref={messagesEndRef} />
            </div>

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

{
  /* <div className="h-full hidden md:block w-80 shrink-0 bg-white/40 backdrop-blur-lg p-4 rounded-l-2xl overflow-scroll"></div> */
}
