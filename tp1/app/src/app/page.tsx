import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">TP : Authentification Full Stack</h1>
      <div className="flex gap-4">
        <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">Se connecter</Link>
        <Link href="/register" className="rounded border border-blue-600 px-4 py-2 text-blue-600">S’inscrire</Link>
      </div>
    </main>
  );
}
