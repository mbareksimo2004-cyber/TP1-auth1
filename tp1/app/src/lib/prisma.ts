import { PrismaClient } from "@prisma/client";

// Une seule instance du client, réutilisée en développement (hot reload).
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
