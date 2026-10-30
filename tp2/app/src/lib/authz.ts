import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export type Role = "ADMIN" | "ENSEIGNANT" | "ETUDIANT";

type AuthResult =
  | { ok: true; user: { id: number; role: Role } }
  | { ok: false; error: NextResponse };

// Session JWT -> utilisateur relu en base -> rôle vérifié.
// Le rôle vient TOUJOURS de la base, jamais du navigateur.
export async function requireRole(roles: Role[]): Promise<AuthResult> {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, role: true },
      })
    : null;

  if (!user) {
    return { ok: false, error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  }
  if (!roles.includes(user.role as Role)) {
    return { ok: false, error: NextResponse.json({ error: "Accès interdit" }, { status: 403 }) };
  }
  return { ok: true, user: { id: user.id, role: user.role as Role } };
}
