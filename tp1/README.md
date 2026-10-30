# TP1 : Authentification Full Stack (Next.js 15, Prisma 6, SQLite)

Le projet complet est dans `app/`. Pour le lancer :

```bash
cd app
npm install
npx prisma migrate dev     # applique la migration "init" et génère le client Prisma
npm run dev                # http://localhost:3000
npx prisma studio          # voir la table User (mot de passe = hash $2a$10...)
```

`.env` contient déjà `DATABASE_URL` et un `JWT_SECRET` aléatoire (ignoré par Git). Pour en générer un autre :
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Ce qui est réalisé
- [x] Partie 0 : projet Next 15, dépendances, `.env`, `.gitignore`
- [x] Partie 1 : modèle User, migration SQL, `src/lib/prisma.ts`
- [x] Partie 2 : Zod (`src/lib/validation.ts`), JWT + cookie (`src/lib/session.ts`)
- [x] Partie 3 : `src/app/api/auth/{register,login,logout,me}/route.ts`
- [x] Partie 4 : `src/middleware.ts` + revérification serveur (dashboard, /me)
- [x] Partie 5 : `AuthForm`, `LogoutButton`, pages login/register/dashboard/accueil
- [ ] Partie 6 : à faire par toi, recette des 8 scénarios (voir le site)
- [ ] `reponses.md` à compléter, `git init`, démonstration
