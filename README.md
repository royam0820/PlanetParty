# Planète Party

**Planète Party** est une application web ludique pour sensibiliser à l’écologie urbaine à travers des mini-jeux interactifs.

## Fonctionnalités

- 9 mini-jeux éducatifs sur l’écologie et la ville durable
- Système de score, niveaux et badges
- Suivi de la progression utilisateur
- Interface moderne et responsive

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <repo-url>
   cd PlanetQuest
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur (API + client)**
   ```bash
   npm run dev
   ```
   L’application sera accessible sur [http://localhost:5000](http://localhost:5000).

## Structure du projet

- `client/` : Frontend React (mini-jeux, interface, navigation)
- `server/` : Backend Express.js (API, gestion des données)
- `shared/schema.ts` : Schéma des données (utilisateurs, progression, résultats)
- `attached_assets/` : Documents et ressources

## Technologies

- React, TypeScript, Tailwind CSS, Wouter, TanStack React Query
- Express.js, Drizzle ORM, SQLite

## Mini-jeux disponibles

- Tri des déchets
- Quiz Éclair
- Attrape les déchets
- Vrai ou Faux
- Repère les bons gestes
- Plan de mobilité
- Bataille contre les mégots
- Chasse aux lumières
- Refais la façade

## Contribution

Les contributions sont les bienvenues ! Merci de créer une issue ou une pull request.

## Licence

MIT 