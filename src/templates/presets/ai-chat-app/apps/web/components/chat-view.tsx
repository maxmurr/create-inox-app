"use client";

import type { ChatStatus, UIMessage } from "ai";

import { useChat } from "@ai-sdk/react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { useChatSessions } from "@/components/chat-sessions-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

const shouldShowLoadingShimmer = (status: ChatStatus, messages: UIMessage[]): boolean => {
  if (status === "submitted") return true;

  if (status === "streaming") {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg?.role !== "assistant") continue;

      const hasContent = msg.parts.some(
        (part: UIMessage["parts"][number]) =>
          (part.type === "text" || part.type === "reasoning") && part.text.length > 0,
      );

      return !hasContent;
    }
    return true;
  }

  return false;
};

type ChatViewProps = {
  chatId?: string;
  initialMessages?: UIMessage[];
};

export function ChatView({ chatId: initialChatId, initialMessages }: ChatViewProps) {
  const { sessions, addSession, updateTitle } = useChatSessions();
  const [chatId] = useState(() => initialChatId ?? nanoid());
  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;
  const isNewChatRef = useRef(!initialChatId);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionTitle = sessions.find((s) => s.id === chatId)?.title;
  const chatTitle = sessionTitle && sessionTitle !== "New Chat" ? sessionTitle : undefined;

  const handleData = useCallback(
    (dataPart: { type: string; data?: unknown }) => {
      if (dataPart.type === "data-title-update" || dataPart.type === "data-title-final") {
        const { chatId: id, title } = dataPart.data as { chatId: string; title: string };
        updateTitle(id, title);
      }
    },
    [updateTitle],
  );

  const { messages, sendMessage, status, stop } = useChat({
    id: chatId,
    messages: initialMessages,
    onData: handleData,
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = ({ text }: PromptInputMessage) => {
    if (!text.trim()) return;

    if (isNewChatRef.current) {
      isNewChatRef.current = false;
      addSession({
        id: chatIdRef.current,
        title: "New Chat",
        updatedAt: new Date().toISOString(),
      });
      window.history.replaceState(null, "", `/chat/${chatIdRef.current}`);
    }

    sendMessage({ text }, { body: { chatId: chatIdRef.current } });
    setInput("");
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="relative flex h-12 shrink-0 items-center border-b px-4">
        <SidebarTrigger className="-ml-1" />
        {chatTitle && (
          <span className="absolute left-1/2 max-w-[50%] -translate-x-1/2 truncate text-sm font-medium">
            {chatTitle}
          </span>
        )}
      </header>
      <Conversation className="[scrollbar-width:none] **:[scrollbar-width:none]">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.map((message: UIMessage) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts
                  .filter(
                    (part): part is Extract<UIMessage["parts"][number], { type: "text" }> =>
                      part.type === "text",
                  )
                  .map((part, i) =>
                    message.role === "assistant" ? (
                      <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
                    ) : (
                      <span key={`${message.id}-${i}`}>{part.text}</span>
                    ),
                  )}
              </MessageContent>
            </Message>
          ))}
          {shouldShowLoadingShimmer(status, messages) && (
            <Message from="assistant">
              <MessageContent>
                <Spinner className="size-5 text-muted-foreground" />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="px-4 pb-4">
        <PromptInput onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <PromptInputFooter>
            <div />
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
