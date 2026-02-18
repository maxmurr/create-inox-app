"use client";

import { ChatView } from "@/components/chat-view";
import { useChatSessions } from "@/components/chat-sessions-provider";

export default function NewChatPage() {
  const { newChatKey } = useChatSessions();
  return <ChatView key={`new-${newChatKey}`} />;
}
