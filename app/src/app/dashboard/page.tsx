import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
import StudentsPanel from "@/components/StudentsPanel";

const ACTIONS: Record<string, string[]> = {
  ADMIN: ["Lister les étudiants", "Créer un étudiant", "Modifier un étudiant", "Supprimer un étudiant"],
  ENSEIGNANT: ["Lister les étudiants", "Modifier la classe d’un étudiant"],
  ETUDIANT: ["Consulter son profil"],
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, role: true },
  });
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Bonjour {user.name}</h1>
      <p>{user.email} · rôle : <strong>{user.role}</strong></p>
      <ul className="list-disc pl-5">
        {(ACTIONS[user.role] ?? []).map((a) => <li key={a}>{a}</li>)}
      </ul>
      <StudentsPanel role={user.role} />
      <LogoutButton />
    </main>
  );
}
