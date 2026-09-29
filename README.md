# Fathom Solutions (Landing Page)

This repo contains a lightweight React (Vite) landing page for Fathom Solutions.

## Develop

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
npm run preview
```

## Notes

- Static assets live in `static/` and are referenced as `/static/...`.
- SWPT now lives at https://swpt.dev. The build writes redirect pages at `/SWPT/` and `/swpt/` so old links keep working (`scripts/write-swpt-redirect.mjs`).

