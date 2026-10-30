# TP2 : Gestion des rôles et contrôle d'accès (suite du TP1)

Le projet complet est dans `app/` (le TP1 + les rôles). Pour le lancer :

```bash
cd app
npm install
npx prisma migrate dev     # applique "init" puis "add_role" et génère le client
npm run seed               # crée admin@test.com, prof@test.com, etu1@test.com, etu2@test.com
npm run dev                # http://localhost:3000
```
Mot de passe des comptes de test : `motdepasse1`.

## Ce qui est réalisé
- [x] Partie 1 : champ `role` (défaut ETUDIANT) + `classe`, migration `add_role`
- [x] Partie 2 : matrice dans `PERMISSIONS.md`
- [x] Partie 3 : `requireRole()` dans `src/lib/authz.ts` (401 / 403, rôle relu en base)
- [x] Partie 4 : `/api/students` et `/api/students/[id]` (GET, POST, PATCH, DELETE), Zod, jamais `password`
- [x] Partie 5 : dashboard par rôle, liste, formulaire, erreurs 401/403 affichées
- [ ] Partie 6 : à faire par toi, les tests de sécurité (voir le site)
- [ ] `reponses.md` à compléter
