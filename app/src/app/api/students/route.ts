import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { createStudentSchema, safe } from "@/lib/students";

// GET : ADMIN et ENSEIGNANT voient tous les étudiants, un ETUDIANT seulement lui-même.
export async function GET() {
  const auth = await requireRole(["ADMIN", "ENSEIGNANT", "ETUDIANT"]);
  if (!auth.ok) return auth.error;

  const where = auth.user.role === "ETUDIANT" ? { id: auth.user.id } : { role: "ETUDIANT" };
  const students = await prisma.user.findMany({ where, select: safe, orderBy: { id: "asc" } });
  return NextResponse.json(students);
}

// POST : création réservée à ADMIN.
export async function POST(req: Request) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth.ok) return auth.error;

  const parsed = createStudentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { password, ...data } = parsed.data;
  if (await prisma.user.findUnique({ where: { email: data.email } })) {
    return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  }
  const student = await prisma.user.create({
    data: { ...data, role: "ETUDIANT", password: await bcrypt.hash(password, 10) },
    select: safe,
  });
  return NextResponse.json(student, { status: 201 });
}
