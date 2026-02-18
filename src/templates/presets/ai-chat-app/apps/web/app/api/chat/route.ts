import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { eq } from "drizzle-orm";
import { startActiveObservation } from "@langfuse/tracing";
import { nanoid } from "nanoid";
import { after } from "next/server";
import { z } from "zod";

import { langfuseSpanProcessor } from "@/instrumentation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatMessage, chatSession } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { openrouter } from "@/lib/openrouter";
import { inputGuardrail } from "./input-guardrail";

const MODEL_ID = "gpt-oss-120b";
const TITLE_MODEL_ID = "gpt-oss-20b";

const model = openrouter(MODEL_ID, {
  extraBody: {
    provider: { order: ["Cerebras", "Groq"], allow_fallbacks: true },
  },
});

const titleModel = openrouter(TITLE_MODEL_ID);

const chatRequestSchema = z.object({
  messages: z.array(
    z.looseObject({
      id: z.string(),
      role: z.enum(["user", "assistant", "system"]),
      parts: z.array(z.looseObject({ type: z.string() })),
    }),
  ),
  chatId: z.string(),
});

const extractLastUserText = (messages: UIMessage[]): string | null => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.role !== "user") continue;

    for (const part of msg.parts) {
      if (part.type === "text") return part.text;
    }
  }
  return null;
};

const extractLastUserMessage = (messages: UIMessage[]): UIMessage | null => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === "user") return messages[i];
  }
  return null;
};

export const POST = async (req: Request): Promise<Response> => {
  const start = performance.now();
  const ctx: Record<string, unknown> = {
    request_id: nanoid(),
    method: req.method,
    path: "/api/chat",
    model: MODEL_ID,
    outcome: "error",
  };

  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      ctx.outcome = "unauthorized";
      return new Response("Unauthorized", { status: 401 });
    }
    ctx.user_id = session.user.id;

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      ctx.outcome = "invalid_request";
      return new Response("Invalid request body", { status: 400 });
    }

    const { messages, chatId } = parsed.data as { messages: UIMessage[]; chatId: string };
    ctx.message_count = messages.length;
    ctx.chat_id = chatId;

    const userText = extractLastUserText(messages);
    if (userText) {
      ctx.user_text_prefix = userText.slice(0, 100);
    }

    const response = await startActiveObservation(
      "chat-handler",
      async (span) => {
        span.updateTrace({
          name: "chat-response",
          userId: session.user.id,
          sessionId: chatId,
          input: userText,
          metadata: { messageCount: messages.length },
        });
        span.update({ input: userText });

        if (userText) {
          const guardrailStart = performance.now();
          const guardrail = await inputGuardrail(userText);
          ctx.guardrail_duration_ms = Math.round(performance.now() - guardrailStart);
          ctx.guardrail_safe = guardrail.isSafe;
          ctx.guardrail_category = guardrail.category;
          ctx.guardrail_confidence = guardrail.confidence;

          if (!guardrail.isSafe) {
            ctx.outcome = "rejected";
            const rejectionText =
              "I'm sorry, but I can't help with that request. I'm here to assist with knowledge management questions. Could you try rephrasing your message?";
            span.updateTrace({ output: rejectionText });
            span.update({ output: rejectionText });
            span.end();
            const partId = nanoid();
            return createUIMessageStreamResponse({
              stream: createUIMessageStream({
                execute: ({ writer }) => {
                  writer.write({ type: "start" });
                  writer.write({ type: "start-step" });
                  writer.write({ type: "text-start", id: partId });
                  writer.write({ type: "text-delta", delta: rejectionText, id: partId });
                  writer.write({ type: "text-end", id: partId });
                  writer.write({ type: "finish-step" });
                  writer.write({ type: "finish", finishReason: "stop" });
                },
              }),
            });
          }
        }

        const existing = await db
          .select({ id: chatSession.id })
          .from(chatSession)
          .where(eq(chatSession.id, chatId))
          .limit(1);

        const isNewChat = existing.length === 0;

        if (isNewChat) {
          await db.insert(chatSession).values({
            id: chatId,
            userId: session.user.id,
            title: "New Chat",
          });
        }

        const lastUserMsg = extractLastUserMessage(messages);
        if (lastUserMsg) {
          await db
            .insert(chatMessage)
            .values({
              id: lastUserMsg.id,
              chatSessionId: chatId,
              role: "user",
              parts: lastUserMsg.parts,
            })
            .onConflictDoNothing();
        }

        const modelMessages = await convertToModelMessages(messages);

        const result = streamText({
          model,
          messages: modelMessages,
          experimental_telemetry: { isEnabled: true, functionId: "chat-completion" },
          onFinish: ({ text }) => {
            span.updateTrace({ output: text });
            span.update({ output: text });
            span.end();
          },
        });

        ctx.outcome = "streamed";

        const stream = createUIMessageStream({
          execute: async ({ writer }) => {
            writer.merge(result.toUIMessageStream());

            await result.text;

            if (isNewChat && userText) {
              try {
                const titleResult = streamText({
                  model: titleModel,
                  system:
                    "You are a conversation titler. Given context from a conversation, generate a very short, concise title that captures the essence of the conversation. The title should be a few words at most — like a chat label or subject line. Respond with only the title, nothing else.",
                  prompt: `User message: ${userText}\n\nTitle:`,
                  experimental_telemetry: { isEnabled: true, functionId: "title-generation" },
                });

                let fullTitle = "";
                for await (const delta of titleResult.textStream) {
                  fullTitle += delta;
                  writer.write({
                    type: "data-title-update" as const,
                    data: { chatId, title: fullTitle },
                    transient: true,
                  });
                }

                const trimmedTitle = fullTitle.trim();
                if (trimmedTitle) {
                  await db
                    .update(chatSession)
                    .set({ title: trimmedTitle, updatedAt: new Date() })
                    .where(eq(chatSession.id, chatId));

                  writer.write({
                    type: "data-title-final" as const,
                    data: { chatId, title: trimmedTitle },
                    transient: true,
                  });
                }
              } catch {
                logger.error({ chat_id: chatId, msg: "title generation failed" });
              }
            }
          },
          onFinish: async ({ responseMessage }) => {
            await db.insert(chatMessage).values({
              id: responseMessage.id,
              chatSessionId: chatId,
              role: "assistant",
              parts: responseMessage.parts,
            });

            await db
              .update(chatSession)
              .set({ updatedAt: new Date() })
              .where(eq(chatSession.id, chatId));
          },
        });

        return createUIMessageStreamResponse({ stream });
      },
      { endOnExit: false },
    );

    after(async () => {
      await langfuseSpanProcessor.forceFlush();
    });

    return response;
  } catch (error) {
    ctx.outcome = "error";
    if (error instanceof Error) {
      ctx.error_name = error.name;
      ctx.error_message = error.message;
    }
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    ctx.duration_ms = Math.round(performance.now() - start);
    const level = ctx.outcome === "error" ? "error" : "info";
    logger[level](ctx);
  }
};
