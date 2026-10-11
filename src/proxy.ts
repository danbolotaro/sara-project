import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, unauthorized, verifySessionToken } from "@/lib/session";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authenticated = verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (authenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/persons", request.url));
  }

  if (authenticated || PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return unauthorized();
  }

  const loginUrl = new URL("/login", request.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("from", `${pathname}${search}`);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
