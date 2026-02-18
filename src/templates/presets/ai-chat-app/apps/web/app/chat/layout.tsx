import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { ChatSessionsProvider } from "@/components/chat-sessions-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth-session";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <ChatSessionsProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ChatSessionsProvider>
  );
}
