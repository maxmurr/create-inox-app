"use client";

import type { UIMessage } from "ai";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ChatView } from "@/components/chat-view";
import { Spinner } from "@/components/ui/spinner";

export default function ExistingChatPage() {
  const { id } = useParams<{ id: string }>();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInitialMessages(null);
    setError(false);

    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/chat/sessions/${id}/messages`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data: UIMessage[] = await res.json();
        setInitialMessages(data);
      } catch {
        setError(true);
      }
    };

    loadMessages();
  }, [id]);

  if (error) {
    return (
      <div className="flex h-dvh items-center justify-center text-muted-foreground">
        Chat not found
      </div>
    );
  }

  if (!initialMessages) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return <ChatView key={id} chatId={id} initialMessages={initialMessages} />;
}
