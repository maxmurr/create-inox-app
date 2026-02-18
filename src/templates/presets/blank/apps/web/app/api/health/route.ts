import { NextResponse } from "next/server";

import { env } from "@/env";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    version: env.SOURCE_VERSION,
    uptime: process.uptime(),
  });
}
