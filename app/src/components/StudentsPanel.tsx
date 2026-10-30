"use client";

import { useCallback, useEffect, useState } from "react";

type Student = { id: number; name: string; email: string; role: string; classe: string | null };
type Result = { ok: boolean; status: number; data: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

async function call(url: string, method = "GET", body?: unknown): Promise<Result> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

function message(r: Result) {
  if (r.status === 401) return "Session expirée (401) : reconnecte-toi.";
  if (r.status === 403) return "Action interdite pour ton rôle (403).";
  return r.data.error ?? (Object.values(r.data.errors ?? {}).flat().join(" · ") || "Erreur");
}

export default function StudentsPanel({ role }: { role: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const isAdmin = role === "ADMIN";
  const canEdit = isAdmin || role === "ENSEIGNANT";

  const load = useCallback(async () => {
    const r = await call("/api/students");
    if (r.ok) setStudents(r.data);
    else setError(message(r));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function run(url: string, method: string, body?: unknown) {
    const r = await call(url, method, body);
    setError(r.ok ? "" : message(r));
    if (r.ok) load();
  }

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const r = await call("/api/students", "POST", values);
    setError(r.ok ? "" : message(r));
    if (r.ok) {
      form.reset();
      load();
    }
  }

  const input = "rounded border border-gray-300 px-2 py-1 text-black caret-black dark:text-white dark:caret-white";
  return (
    <section className="w-full max-w-3xl space-y-4">
      {error && <p role="alert" className="rounded bg-red-100 p-2 text-red-700">{error}</p>}

      <table className="w-full text-left text-sm">
        <thead>
          <tr><th>Nom</th><th>Email</th><th>Classe</th>{canEdit && <th>Actions</th>}</tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-t">
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                {canEdit ? (
                  <input
                    className={input}
                    value={classes[s.id] ?? s.classe ?? ""}
                    onChange={(e) => setClasses({ ...classes, [s.id]: e.target.value })}
                  />
                ) : (
                  s.classe ?? "-"
                )}
              </td>
              {canEdit && (
                <td className="space-x-2">
                  <button className="text-blue-600" onClick={() => run(`/api/students/${s.id}`, "PATCH", { classe: classes[s.id] ?? s.classe ?? "" })}>
                    Enregistrer
                  </button>
                  {isAdmin && (
                    <button className="text-red-600" onClick={() => run(`/api/students/${s.id}`, "DELETE")}>
                      Supprimer
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isAdmin && (
        <form onSubmit={create} className="flex flex-wrap gap-2">
          <input name="name" placeholder="Nom" required className={input} />
          <input name="email" type="email" placeholder="Email" required className={input} />
          <input name="password" type="password" placeholder="Mot de passe" required className={input} />
          <input name="classe" placeholder="Classe" className={input} />
          <button className="rounded bg-blue-600 px-3 py-1 text-white">Créer un étudiant</button>
        </form>
      )}

      {!isAdmin && (
        <button className="text-sm text-gray-500 underline" onClick={() => run("/api/students/1", "DELETE")}>
          Test : tenter une suppression (doit afficher 403)
        </button>
      )}
    </section>
  );
}
