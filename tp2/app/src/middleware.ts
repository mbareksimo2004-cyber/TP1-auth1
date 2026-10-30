import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Edge Runtime : on vérifie seulement le JWT (jose), pas de Prisma ici.
const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  let connecte = false;
  if (token) {
    try {
      await jwtVerify(token, key);
      connecte = true;
    } catch {
      connecte = false;
    }
  }

  const path = req.nextUrl.pathname;
  if (!connecte && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (connecte && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/login", "/register"] };
