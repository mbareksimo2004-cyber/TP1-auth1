"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/auth/" + mode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh(); // la page relit le cookie
        return;
      }
      const data = await res.json();
      setError(
        data.error ?? Object.values(data.errors ?? {}).flat().join(" · ") ?? "Erreur"
      );
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  const input = "w-full rounded border border-gray-300 px-3 py-2 text-black caret-black dark:text-white dark:caret-white";
  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-3">
      {mode === "register" && (
        <input name="name" placeholder="Nom" required className={input} />
      )}
      <input name="email" type="email" placeholder="Email" required className={input} />
      <input name="password" type="password" placeholder="Mot de passe" required className={input} />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50">
        {loading ? "Patientez…" : mode === "login" ? "Se connecter" : "S’inscrire"}
      </button>
    </form>
  );
}
