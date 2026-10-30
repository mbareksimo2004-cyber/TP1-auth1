import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <AuthForm mode="login" />
      <Link href="/register" className="text-blue-600 underline">Pas de compte ? S’inscrire</Link>
    </main>
  );
}
