"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ChatSession = {
  id: string;
  title: string;
  updatedAt: string;
};

type ChatSessionsContextValue = {
  sessions: ChatSession[];
  isLoading: boolean;
  newChatKey: number;
  refetch: () => void;
  addSession: (session: ChatSession) => void;
  removeSession: (chatId: string) => void;
  updateTitle: (chatId: string, title: string) => void;
  startNewChat: () => void;
};

const ChatSessionsContext = createContext<ChatSessionsContextValue | null>(null);

export const useChatSessions = (): ChatSessionsContextValue => {
  const ctx = useContext(ChatSessionsContext);
  if (!ctx) throw new Error("useChatSessions must be used within ChatSessionsProvider");
  return ctx;
};

export function ChatSessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newChatKey, setNewChatKey] = useState(0);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      if (res.ok) {
        const data: ChatSession[] = await res.json();
        setSessions(data);
      }
    } catch {
      // silently fail — sidebar will show empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const refetch = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  const addSession = useCallback((session: ChatSession) => {
    setSessions((prev) => [session, ...prev]);
  }, []);

  const removeSession = useCallback((chatId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== chatId));
  }, []);

  const updateTitle = useCallback((chatId: string, title: string) => {
    setSessions((prev) => prev.map((s) => (s.id === chatId ? { ...s, title } : s)));
  }, []);

  const startNewChat = useCallback(() => {
    setNewChatKey((k) => k + 1);
  }, []);

  return (
    <ChatSessionsContext
      value={{
        sessions,
        isLoading,
        newChatKey,
        refetch,
        addSession,
        removeSession,
        updateTitle,
        startNewChat,
      }}
    >
      {children}
    </ChatSessionsContext>
  );
}
