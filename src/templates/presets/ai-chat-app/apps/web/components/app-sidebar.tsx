"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronsUpDown, LogOut, SquarePen } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatSidebarList } from "@/components/chat-sidebar-list";
import { useChatSessions } from "@/components/chat-sessions-provider";
import { authClient } from "@/lib/auth-client";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { startNewChat } = useChatSessions();
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => window.location.assign("/login") },
    });
  };

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Chat"
              onClick={() => {
                startNewChat();
                router.push("/chat");
              }}
            >
              <SquarePen />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ChatSidebarList />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {!mounted || isPending ? (
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-1.5 group-data-[collapsible=icon]:hidden">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{initials ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{session?.user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" sideOffset={4} className="w-56">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
