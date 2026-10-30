import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { adminUpdateSchema, teacherUpdateSchema, parseId, safe } from "@/lib/students";

type Ctx = { params: Promise<{ id: string }> }; // Next 15 : params est une Promise

const json = (body: unknown, status: number) => NextResponse.json(body, { status });

// GET : un ETUDIANT ne peut lire que son propre profil (protection contre l'IDOR).
export async function GET(_req: Request, { params }: Ctx) {
  const id = parseId((await params).id);
  if (!id) return json({ error: "Identifiant invalide" }, 400);

  const auth = await requireRole(["ADMIN", "ENSEIGNANT", "ETUDIANT"]);
  if (!auth.ok) return auth.error;
  if (auth.user.role === "ETUDIANT" && auth.user.id !== id) {
    return json({ error: "Accès interdit" }, 403);
  }

  const student = await prisma.user.findUnique({ where: { id }, select: safe });
  return student ? json(student, 200) : json({ error: "Introuvable" }, 404);
}

// PATCH : ADMIN tous les champs, ENSEIGNANT seulement la classe, ETUDIANT interdit.
export async function PATCH(req: Request, { params }: Ctx) {
  const id = parseId((await params).id);
  if (!id) return json({ error: "Identifiant invalide" }, 400);

  const auth = await requireRole(["ADMIN", "ENSEIGNANT"]);
  if (!auth.ok) return auth.error;

  const body = await req.json().catch(() => null);
  const isAdmin = auth.user.role === "ADMIN";

  // L'enseignant qui touche à un autre champ que "classe" reçoit 403.
  if (!isAdmin && body && typeof body === "object" && Object.keys(body).some((k) => k !== "classe")) {
    return json({ error: "Un enseignant ne peut modifier que la classe" }, 403);
  }

  const parsed = (isAdmin ? adminUpdateSchema : teacherUpdateSchema).safeParse(body);
  if (!parsed.success) return json({ errors: parsed.error.flatten().fieldErrors }, 400);

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target) return json({ error: "Introuvable" }, 404);
  if (!isAdmin && target.role !== "ETUDIANT") return json({ error: "Accès interdit" }, 403);

  const updated = await prisma.user.update({ where: { id }, data: parsed.data, select: safe });
  return json(updated, 200);
}

// DELETE : réservé à ADMIN (qui ne peut pas se supprimer lui-même).
export async function DELETE(_req: Request, { params }: Ctx) {
  const id = parseId((await params).id);
  if (!id) return json({ error: "Identifiant invalide" }, 400);

  const auth = await requireRole(["ADMIN"]);
  if (!auth.ok) return auth.error;
  if (auth.user.id === id) return json({ error: "Impossible de se supprimer soi-même" }, 400);

  if (!(await prisma.user.findUnique({ where: { id }, select: { id: true } }))) {
    return json({ error: "Introuvable" }, 404);
  }
  await prisma.user.delete({ where: { id } });
  return json({ ok: true }, 200);
}
