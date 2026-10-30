import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { name, email, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  });
  await createSession(user.id);
  return NextResponse.json({ id: user.id, name, email }, { status: 201 });
}
