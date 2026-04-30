---
title: NEXTJS stack — Next.js 14 entry README
description: Project-agnostic stack overview stub for sk-code NEXTJS routing. Pairs with the GO backend stub via references/router/cross_stack_pairing.md. Populate when a real Next.js project is wired into this skill.
status: stub
stack: NEXTJS
canonical_source: ".opencode/skill/sk-code/references/nextjs/"
populated: false
last_synced_at: 2026-04-30
keywords: [nextjs, next.js, app-router, vanilla-extract, motion, untitled-ui, react-hook-form, zod, react-aria, sonner, next-themes, tinacms]
---

# NEXTJS — sk-code stack stub

Stack detected: **NEXTJS**. The smart router at `SKILL.md` §2 routes to this branch when a Next.js project is detected.

> **Stub.** Project-agnostic placeholder. Populate the subfolder content with real patterns once a concrete Next.js project is wired into this skill.

- [OVERVIEW](#1--overview)

---

## TABLE OF CONTENTS

- [OVERVIEW](#1--overview)

---

## When this branch loads

Marker files that select this branch:

- `next.config.js`, `next.config.mjs`, `next.config.ts`
- `package.json` containing `"next"` (or `"react"` together with a Next.js indicator; excluding react-native / expo)

## Intended target stack (from SKILL.md description)

When populated, this branch documents Next.js 14 App Router patterns paired with:

- vanilla-extract (zero-runtime CSS-in-TypeScript)
- motion v12 (animation)
- react-hook-form + zod (forms and validation)
- react-aria / react-aria-components (accessibility primitives)
- Untitled UI (vendored component library)
- next-themes (dark-mode class toggle)
- Sonner (toasts)
- Optional TinaCMS (Git-backed CMS)

The architectural patterns (App Router, Server Component / Client Component boundaries, Server Actions, accessibility, API integration) transfer to projects that swap any single library.

## Subfolder map

| Subfolder | Status | Intended contents |
|---|---|---|
| `implementation/` | stub | App Router patterns, vanilla-extract styling, motion v12 animation, react-hook-form + zod forms, react-aria a11y, API integration with the Go backend, optional TinaCMS |
| `debugging/` | stub | Server vs Client Component bug patterns, hydration mismatches, network inspection alongside backend logs |
| `verification/` | stub | type-check + lint + build sequence; browser smoke matrix (mobile + desktop, console clean) |
| `deployment/` | stub | Vercel deployment, env vars, preview branch CORS handling |
| `standards/` | stub | TypeScript strict mode, naming conventions, file organization |

## Asset map

| Asset folder | Status | Intended contents |
|---|---|---|
| `assets/nextjs/checklists/` | stub | P0/P1/P2 checklists for code quality, debugging, verification |
| `assets/nextjs/patterns/` | stub | Reference code samples: Server Action, fetch + JWT API call, react-hook-form + zod, motion v12 mount, vanilla-extract recipe |
| `assets/nextjs/integrations/` | stub | vanilla-extract setup, Untitled UI usage, optional TinaCMS bootstrap |

## Cross-stack pairing

This branch pairs with the **GO backend stub** under `references/go/`. For the canonical Next.js ↔ Go API contract, JWT handoff, error envelope shape, CORS configuration, and deploy topology, see `references/router/cross_stack_pairing.md` (canonical contract — not a stub).

## Verification commands

These are the standard Next.js verification commands; they apply regardless of project specifics:

- `npm run type-check` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run build` — Next.js production build

Plus browser smoke (Phase 3): mobile + desktop + DevTools console clean.

## See also

- `SKILL.md` §2 (smart routing) — how this branch is selected
- `references/universal/` — stack-agnostic core (severity model, error recovery, multi-agent research)
- `references/router/cross_stack_pairing.md` — Next.js ↔ Go contract

---

---

## 1. OVERVIEW

_TODO: populate this section_

---

