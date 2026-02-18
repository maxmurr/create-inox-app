import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/"],
};
