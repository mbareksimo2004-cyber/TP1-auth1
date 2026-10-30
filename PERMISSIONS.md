# Matrice des permissions
| Action | ADMIN | ENSEIGNANT | ETUDIANT |
|---|---|---|---|
| Lister les étudiants | oui | oui | ses données |
| Créer un étudiant | oui | non | non |
| Modifier un étudiant | oui | à définir | non |
| Supprimer un étudiant | oui | non | non |
| Consulter son profil | oui | oui | oui |

Règle de l’enseignant : il peut modifier uniquement la classe (information pédagogique) des étudiants. name, email, role et password sont réservés à l’ADMIN : sinon 403.
