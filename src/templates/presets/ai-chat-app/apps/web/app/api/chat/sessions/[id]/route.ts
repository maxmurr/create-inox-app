import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatSession } from "@/lib/db/schema";

type RouteParams = { params: Promise<{ id: string }> };

export const DELETE = async (req: Request, { params }: RouteParams): Promise<Response> => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const deleted = await db
    .delete(chatSession)
    .where(and(eq(chatSession.id, id), eq(chatSession.userId, session.user.id)))
    .returning({ id: chatSession.id });

  if (deleted.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(null, { status: 204 });
};

const patchSchema = z.object({
  title: z.string().min(1).max(255),
});

export const PATCH = async (req: Request, { params }: RouteParams): Promise<Response> => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  const updated = await db
    .update(chatSession)
    .set({ title: parsed.data.title, updatedAt: new Date() })
    .where(and(eq(chatSession.id, id), eq(chatSession.userId, session.user.id)))
    .returning({ id: chatSession.id, title: chatSession.title });

  if (updated.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(updated[0]);
};
