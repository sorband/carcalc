# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

There are no tests.

## Architecture

The entire application lives in **`src/ev-calculator.jsx`** — a single self-contained React component. `src/App.jsx` is an unused Vite template leftover; the real entry point is `src/main.jsx` which imports from `ev-calculator.jsx`.

### Car data

Cars are defined in the `DEFAULT_CARS` array at the top of `ev-calculator.jsx`. Each car has:
- `id` (integer, unique), `name`, `type` (`"ev"` or `"petrol"`)
- EVs: `cityKwh` and `motorwayKwh` (kWh/100km, real-world estimates)
- Petrol: `cityL` and `motorwayL` (litres/100km)

The `nextId` variable below `DEFAULT_CARS` must be kept one above the highest existing id, as it tracks runtime IDs for user-added cars.

Consumption figures should be **real-world estimates**, not official WLTP figures (typically 10–20% higher than WLTP for EVs).

### Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Note: the workflow currently triggers on the `master` branch, but the repo's default branch is `main`.
