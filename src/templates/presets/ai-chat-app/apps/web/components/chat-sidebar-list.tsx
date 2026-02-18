"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Pencil, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useChatSessions, type ChatSession } from "@/components/chat-sessions-provider";
import { groupByDate } from "@/lib/group-by-date";

function ChatSessionItem({ session }: { session: ChatSession }) {
  const pathname = usePathname();
  const router = useRouter();
  const { removeSession, updateTitle } = useChatSessions();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive = pathname === `/chat/${session.id}`;

  const handleDelete = async () => {
    const res = await fetch(`/api/chat/sessions/${session.id}`, { method: "DELETE" });
    if (res.ok) {
      removeSession(session.id);
      if (isActive) router.push("/chat");
    }
    setDeleteOpen(false);
  };

  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === session.title) {
      setIsRenaming(false);
      return;
    }
    const res = await fetch(`/api/chat/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    if (res.ok) {
      updateTitle(session.id, trimmed);
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    } else if (e.key === "Escape") {
      setRenameValue(session.title);
      setIsRenaming(false);
    }
  };

  const startRenaming = () => {
    setRenameValue(session.title);
    setIsRenaming(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  return (
    <SidebarMenuItem>
      {isRenaming ? (
        <input
          ref={inputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={handleRename}
          className="flex h-8 w-full items-center rounded-md border border-sidebar-ring bg-transparent px-2 text-sm outline-hidden"
        />
      ) : (
        <>
          <SidebarMenuButton isActive={isActive} render={<Link href={`/chat/${session.id}`} />}>
            <span className="truncate pr-6 group-hover/menu-item:pr-10">{session.title}</span>
          </SidebarMenuButton>
          <SidebarMenuAction
            showOnHover
            className="right-7"
            aria-label="Rename"
            onClick={startRenaming}
          >
            <Pencil />
          </SidebarMenuAction>
          <SidebarMenuAction showOnHover aria-label="Delete" onClick={() => setDeleteOpen(true)}>
            <X />
          </SidebarMenuAction>
        </>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{session.title}&rdquo; and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarMenuItem>
  );
}

export function ChatSidebarList() {
  const { sessions, isLoading } = useChatSessions();

  if (isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, i) => (
              <SidebarMenuSkeleton key={i} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
        No conversations yet
      </div>
    );
  }

  const groups = groupByDate(sessions);

  return (
    <div className="group-data-[collapsible=icon]:hidden">
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((session) => (
                <ChatSessionItem key={session.id} session={session} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
