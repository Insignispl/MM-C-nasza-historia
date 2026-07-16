import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|login|e|historia|fotograf|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

export function middleware(request: NextRequest) {
  if (["/album", "/ksiega", "/dodaj", "/admin"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 308);
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  const expectedPassword = process.env.SITE_PASSWORD;

  if (!expectedPassword || request.cookies.get("site_access")?.value === expectedPassword) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
