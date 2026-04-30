---
title: React / Next.js stack — kerkmeester-style live branch
description: Live reference content for sk-code REACT routing. Modeled on kerkmeester.com (Next.js 14 App Router + vanilla-extract + motion v12 + react-hook-form/zod + Untitled UI + react-aria + Sonner + next-themes). Pairs with the Go backend live branch via references/router/cross_stack_pairing.md.
status: live
stack: REACT
canonical_source: ".opencode/skill/sk-code/references/react/"
populated: true
last_synced_at: "2026-04-30"
keywords: [react, nextjs, app-router, vanilla-extract, motion, untitled-ui, react-hook-form, zod, react-aria, sonner, next-themes, tinacms, kerkmeester]
---

# React / Next.js — sk-code live branch

Stack detected: **REACT**. Live content under this folder is modeled on **kerkmeester.com** (Next.js 14 App Router + zero-runtime CSS via vanilla-extract + the new `motion` v12 animation library + Untitled UI components).

This branch was promoted from placeholder to live in packet `056-sk-code-fullstack-branch/` (2026-04-30).

## When this branch loads

The smart router at `SKILL.md` §2 routes to this branch when stack detection identifies React / Next.js — markers:
- `next.config.js`, `next.config.mjs`, `next.config.ts`
- `package.json` containing `"next"` or `"react"` (excluding react-native/expo)

## Pattern provenance

The patterns documented here come from `kerkmeester.com`'s production codebase. **If your Next.js project uses Tailwind / CSS modules / framer-motion** instead of vanilla-extract / motion v12, the implementation patterns in this folder still apply at the App Router / Server Component / forms / a11y level — but the styling and animation specifics will differ. Treat the kerkmeester-flavored snippets as one canonical example variant.

## Subfolder map

| Subfolder | Contents | Phase |
|---|---|---|
| `implementation/` | App Router patterns, vanilla-extract styling, motion v12 animation, react-hook-form + zod forms, react-aria a11y, API integration with Go backend, optional TinaCMS | Phase 1 |
| `debugging/` | Server vs Client Component bugs, hydration errors, network inspection (DevTools + Go server log correlation) | Phase 2 |
| `verification/` | type-check + lint + build + browser smoke matrix | Phase 3 |
| `deployment/` | Vercel deploy + env vars + preview branches; backend URL config | Phase 3 |
| `standards/` | ES2023 strict TS conventions, file organization (`src/{app,components,hooks,utils,styles}`) | Phase 1.5 |

## Asset map

| Asset folder | Contents |
|---|---|
| `assets/react/checklists/` | P0/P1/P2 checklists for code quality, debugging, verification |
| `assets/react/patterns/` | Working code samples: Server Action, fetch+JWT API call, react-hook-form + zod, motion v12 mount, vanilla-extract recipe |
| `assets/react/integrations/` | vanilla-extract setup, Untitled UI usage, optional TinaCMS bootstrap |

## Cross-stack pairing

This branch pairs with the **Go backend live branch** (`references/go/`). For the canonical React↔Go API contract, JWT handoff, error envelope shape, and deploy topology, see `references/router/cross_stack_pairing.md`.

## Verification commands

```bash
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
npm run build        # Next.js production build
```

Plus browser smoke (Phase 3): mobile + desktop + DevTools console clean.

## See also

- `SKILL.md` §2 (smart routing) — how this branch is selected
- `references/universal/` — stack-agnostic core (severity model, error recovery, multi-agent research)
- `references/router/cross_stack_pairing.md` — React↔Go contract
- Frontend reference source: `/Users/michelkerkmeester/MEGA/Development/Websites/kerkmeester.com/`
