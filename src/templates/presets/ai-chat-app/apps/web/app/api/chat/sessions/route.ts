import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatSession } from "@/lib/db/schema";

export const GET = async (req: Request): Promise<Response> => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sessions = await db
    .select({
      id: chatSession.id,
      title: chatSession.title,
      updatedAt: chatSession.updatedAt,
    })
    .from(chatSession)
    .where(eq(chatSession.userId, session.user.id))
    .orderBy(desc(chatSession.updatedAt));

  return Response.json(sessions);
};
