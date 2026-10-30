import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Inscription</h1>
      <AuthForm mode="register" />
      <Link href="/login" className="text-blue-600 underline">Déjà inscrit ? Se connecter</Link>
    </main>
  );
}
