import { z } from "zod";

// Champs renvoyés : jamais password.
export const safe = {
  id: true,
  name: true,
  email: true,
  role: true,
  classe: true,
  createdAt: true,
} as const;

const classe = z.string().trim().max(50, "Classe trop longue");

// Pas de champ role ici : un étudiant créé est toujours ETUDIANT.
export const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Nom : 2 caractères minimum"),
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
  classe: classe.optional(),
});

// ADMIN : tous les champs modifiables.
export const adminUpdateSchema = z
  .object({
    name: z.string().trim().min(2, "Nom : 2 caractères minimum"),
    email: z.string().trim().toLowerCase().email("Email invalide"),
    classe: classe.nullable(),
    role: z.enum(["ADMIN", "ENSEIGNANT", "ETUDIANT"]),
  })
  .partial()
  .strict();

// ENSEIGNANT : uniquement les informations pédagogiques (classe).
export const teacherUpdateSchema = z.object({ classe: classe.nullable() }).strict();

export function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
