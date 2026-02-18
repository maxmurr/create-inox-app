import { env } from "@/env";

type LogLevel = "info" | "error";

const write = (level: LogLevel, payload: Record<string, unknown>): void => {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    environment: env.NODE_ENV,
    source_version: env.SOURCE_VERSION,
    ...payload,
  });

  const stream = level === "error" ? process.stderr : process.stdout;
  stream.write(line + "\n");
};

export const logger = {
  info: (payload: Record<string, unknown>) => write("info", payload),
  error: (payload: Record<string, unknown>) => write("error", payload),
};
