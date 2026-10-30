import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  // Défense en profondeur : on revérifie la session côté serveur.
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Bonjour {user.name}</h1>
      <p>Email : {user.email}</p>
      <p>Inscrit le {user.createdAt.toLocaleDateString("fr-FR")}</p>
      <LogoutButton />
    </main>
  );
}
