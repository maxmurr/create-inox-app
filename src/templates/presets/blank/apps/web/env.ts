import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SOURCE_VERSION: z.string().default("dev"),
  },
  experimental__runtimeEnv: {},
});
