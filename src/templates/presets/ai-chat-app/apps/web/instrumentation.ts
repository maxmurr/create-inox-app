import { LangfuseSpanProcessor, type ShouldExportSpan } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

import { env } from "@/env";

const shouldExportSpan: ShouldExportSpan = (span) => {
  return span.otelSpan.instrumentationScope.name !== "next.js";
};

export const langfuseSpanProcessor = new LangfuseSpanProcessor({
  shouldExportSpan,
  secretKey: env.LANGFUSE_SECRET_KEY,
  publicKey: env.LANGFUSE_PUBLIC_KEY,
  baseUrl: env.LANGFUSE_BASE_URL,
});

const tracerProvider = new NodeTracerProvider({
  spanProcessors: [langfuseSpanProcessor],
});

tracerProvider.register();
