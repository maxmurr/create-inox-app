import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SOURCE_VERSION: z.string().default("dev"),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    OPENROUTER_API_KEY: z.string().min(1),
    LANGFUSE_SECRET_KEY: z.string().min(1),
    LANGFUSE_PUBLIC_KEY: z.string().min(1),
    LANGFUSE_BASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SOURCE_VERSION: process.env.SOURCE_VERSION,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    LANGFUSE_SECRET_KEY: process.env.LANGFUSE_SECRET_KEY,
    LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY,
    LANGFUSE_BASE_URL: process.env.LANGFUSE_BASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },
});
