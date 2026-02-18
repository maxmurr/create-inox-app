import { asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatMessage, chatSession } from "@/lib/db/schema";

type RouteParams = { params: Promise<{ id: string }> };

export const GET = async (req: Request, { params }: RouteParams): Promise<Response> => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const chatSessionRow = await db
    .select({ userId: chatSession.userId })
    .from(chatSession)
    .where(eq(chatSession.id, id))
    .limit(1);

  if (chatSessionRow.length === 0 || chatSessionRow[0].userId !== session.user.id) {
    return new Response("Not Found", { status: 404 });
  }

  const messages = await db
    .select({
      id: chatMessage.id,
      role: chatMessage.role,
      parts: chatMessage.parts,
    })
    .from(chatMessage)
    .where(eq(chatMessage.chatSessionId, id))
    .orderBy(asc(chatMessage.createdAt));

  return Response.json(messages);
};
