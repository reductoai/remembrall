import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const path = url.pathname;

  const session = await getToken({ req });
  console.log("middleware intercepted: ", session, path);
  if (path !== "/") {
    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
}
