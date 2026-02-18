import { NextResponse } from "next/server";

import { env } from "@/env";
import { pool } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    await pool.query("SELECT 1");

    return NextResponse.json({
      status: "ok",
      version: env.SOURCE_VERSION,
      uptime: process.uptime(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Health check failed:", message);

    return NextResponse.json({ status: "error", error: message }, { status: 503 });
  }
}
