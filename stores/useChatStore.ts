import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatType } from "@/types";

interface ChatState {
  chats: Record<string, ChatType[]>; // keyed by chatroomId
  addChat: (chatroomId: string, chat: ChatType) => void;
  updateLastMessage: (chatroomId: string, content: string) => void;
  clearChats: (chatroomId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: {},
      addChat: (chatroomId, chat) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [chatroomId]: [...(state.chats[chatroomId] || []), chat],
          },
        })),
      updateLastMessage: (chatroomId, content) =>
        set((state) => {
          const updatedChats = [...(state.chats[chatroomId] || [])];
          if (updatedChats.length > 0) {
            updatedChats[updatedChats.length - 1].content = content;
          }
          return { chats: { ...state.chats, [chatroomId]: updatedChats } };
        }),
      clearChats: (chatroomId) =>
        set((state) => ({
          chats: { ...state.chats, [chatroomId]: [] },
        })),
    }),
    {
      name: "chat-storage", // key in localStorage
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
