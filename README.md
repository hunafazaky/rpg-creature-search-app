# RPG Creature Search App

**Created by: [Hunafa Zaky]('https://hunafazaky.github.io')**

A simple Vite + TypeScript frontend that fetches creature data from an external RPG creature API.

## Tech stack

- Vite
- TypeScript
- Tailwind CSS (via `@tailwindcss/vite`)

## Source

Data is retrieved from the public API at:

`https://rpg-creature-api.freecodecamp.rocks/api/creature/{search}`

## How it works

The app mounts a search interface inside `src/main.ts` and delegates the API logic to `src/search.ts`. When a user enters a creature name or ID, the app calls the API, parses the response, and updates the page with the creature's name, ID, weight, height, types, and stats.

## Run locally

```bash
pnpm install
pnpm dev
```
