import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");
  const expectedPassword = process.env.SITE_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.next();
  }

  if (basicAuth) {
    const [, value] = basicAuth.split(" ");
    const decoded = atob(value);
    const [password] = decoded.split(":");
    if (password === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Wymagane hasło", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Album Slubny"' },
  });
}
