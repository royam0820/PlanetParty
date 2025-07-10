# Document de Spécification Produit (PRD) – Planète Party

## 1. Résumé du projet
Planète Party est une application web ludique et éducative visant à sensibiliser les utilisateurs aux enjeux de l’écologie urbaine à travers une série de mini-jeux interactifs. L’objectif est d’apprendre les gestes écoresponsables tout en s’amusant.

## 2. Objectifs
- Sensibiliser à l’écologie urbaine et aux comportements responsables.
- Proposer une expérience utilisateur engageante via des mini-jeux variés.
- Suivre la progression, les scores et les succès des utilisateurs.

## 3. Fonctionnalités principales
- **Accueil** : Présentation des défis, progression de l’utilisateur, accès aux mini-jeux.
- **Mini-jeux** : 9 jeux différents (tri des déchets, quiz, réflexes, observation, etc.).
- **Progression** : Système de score, niveaux, badges et suivi des défis accomplis.
- **Résultats et succès** : Affichage des scores, des nouveaux badges et des progrès.
- **Backend** : API Express.js, stockage des utilisateurs, progression et résultats en SQLite.

## 4. Utilisateurs cibles
- Grand public, enfants et adultes, collectivités, écoles.

## 5. Parcours utilisateur
1. L’utilisateur arrive sur la page d’accueil, découvre les défis proposés.
2. Il sélectionne un mini-jeu, joue et reçoit un score.
3. Sa progression est sauvegardée (score total, niveau, badges).
4. Il peut enchaîner les défis pour améliorer son score et débloquer des succès.

## 6. Architecture technique
- **Frontend** : React (TypeScript), Wouter (routing), TanStack React Query, Tailwind CSS.
- **Backend** : Express.js, Drizzle ORM, SQLite.
- **Données** : Utilisateurs, progression, résultats de jeux.
- **Déploiement** : Serveur unique (API + client sur le port 5000).

## 7. Liste des mini-jeux
- Tri des déchets
- Quiz Éclair
- Attrape les déchets
- Vrai ou Faux
- Repère les bons gestes
- Plan de mobilité
- Bataille contre les mégots
- Chasse aux lumières
- Refais la façade

## 8. Suivi et scoring
- Score total, niveau, défis accomplis, badges.
- Historique des parties et résultats par type de jeu.

## 9. Contraintes
- Accessibilité, responsive, expérience fluide.
- Données stockées localement et côté serveur. 