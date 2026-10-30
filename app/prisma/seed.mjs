// Comptes de test (mot de passe : motdepasse1). Lancer : npm run seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const password = await bcrypt.hash("motdepasse1", 10);
const users = [
  { email: "admin@test.com", name: "Admin", role: "ADMIN" },
  { email: "prof@test.com", name: "Prof", role: "ENSEIGNANT" },
  { email: "etu1@test.com", name: "Etudiant Un", role: "ETUDIANT", classe: "L3-A" },
  { email: "etu2@test.com", name: "Etudiant Deux", role: "ETUDIANT", classe: "L3-B" },
];
for (const u of users) {
  await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, password } });
}
console.log("Comptes créés :", users.map((u) => u.email).join(", "));
await prisma.$disconnect();
