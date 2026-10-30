import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.JWT_SECRET);
const WEEK = 60 * 60 * 24 * 7;

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key);
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WEEK,
  });
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete("session");
}
