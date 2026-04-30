---
title: NEXTJS — Phase 1 Implementation Workflows
description: Project-agnostic stub entry doc for the NEXTJS Phase 1 implementation walk. Populate with real workflows when a Next.js project is wired into this skill.
status: stub
stack: NEXTJS
populated: false
last_synced_at: 2026-04-30
---

# NEXTJS — Phase 1 Implementation Workflows

> **Stub.** Project-agnostic placeholder. This file is the Phase 1 entry point for the NEXTJS stack; populate with real implementation walks when a concrete Next.js project is wired into this skill.

## Intended scope

When populated, this file orchestrates the per-domain implementation walks for a Next.js 14 project (App Router conventions, Server Component / Client Component boundaries, vanilla-extract styling, motion v12 animation, react-hook-form + zod forms, react-aria accessibility, API integration with the Go backend, optional TinaCMS). It is the doc the smart router loads first when intent is `IMPLEMENTATION`.

## Outline (TODO)

- Project bootstrap (Node version, install, dev / production smoke commands)
- App Router conventions (`src/app/` layout, providers, Server vs Client Component boundary rules)
- Styling layer (vanilla-extract recipes, theme contract, dark-mode class toggle)
- Animation layer (motion v12 mount transitions, scroll-triggered animation, reduced-motion handling)
- Forms layer (react-hook-form orchestration, zod schemas, react-aria field components, submit-handler integration)
- Accessibility layer (react-aria primitives, focus management, keyboard navigation)
- API integration (apiCall helper, JWT bearer auth, error envelope parsing, Server Action proxying, SWR/React Query patterns)
- Optional content layer (TinaCMS schema, dev-only admin gate)

## Per-domain deep-reference docs

When populated, each bullet above will have a dedicated file under `references/nextjs/implementation/`:

- `app_router_patterns.md` — App Router conventions
- `vanilla_extract_styling.md` — styling patterns
- `motion_animation.md` — animation patterns
- `forms_validation.md` — forms layer
- `accessibility_aria.md` — a11y layer
- `api_integration.md` — API integration with the Go backend
- `content_tinacms.md` — optional TinaCMS

## See also

- `references/nextjs/README.md` — stack overview
- `references/router/cross_stack_pairing.md` — Next.js ↔ Go contract (canonical)
- `references/webflow/implementation/implementation_workflows.md` — mirror reference (Webflow live branch)
- `SKILL.md` §2 — smart routing

---

---

## 1. OVERVIEW

_TODO: populate this section_

---

