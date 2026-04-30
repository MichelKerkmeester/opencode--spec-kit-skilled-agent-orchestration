---
title: Router Reference — Stack Detection
description: Marker-file precedence and detection logic for the sk-code smart router across WEBFLOW, NEXTJS, and GO.
---

# Router Reference — Stack Detection

Marker-file precedence and edge cases for the first-match-wins stack detector that gates every downstream resource loading decision.

---

## 1. OVERVIEW

### Purpose

Documents the marker-file precedence used by `detect_stack()` in the smart router. Stack detection runs FIRST — before intent classification — and decides which `references/<stack>/` and `assets/<stack>/` directories the router loads from. Operators consult this file when an advisor decision looks wrong and they need to trace why.

### Core Principle

First match wins. WEBFLOW is checked first because Webflow projects routinely carry `package.json` for build tooling (terser, wrangler) and would otherwise misroute to NEXTJS.

### When to Use

- An advisor result picked the wrong stack and you need to debug the precedence.
- A monorepo combines markers from multiple stacks and you need to know which wins.
- A new project has only partial markers (no `package.json`, only HTML) and you want to verify it routes to WEBFLOW via the vanilla-animation signal.
- You are writing a test case for new stack-detection logic.

### Key Sources

- Authoritative routing pseudocode: `SKILL.md` §2 SMART ROUTING.
- Companion router refs: `intent_classification.md`, `resource_loading.md`, `phase_lifecycle.md`, `cross_stack_pairing.md`.

---

## 2. MARKER-FILE PRECEDENCE

```bash
# 1. WEBFLOW — checked first because Webflow projects often have
#    package.json for build tooling but should NOT misroute to NEXTJS
[ -d "src/2_javascript" ]                                       # Webflow project structure
ls *.webflow.js 2>/dev/null                                     # Native Webflow exports
grep -lq "Webflow.push\|--vw-" src/**/*.{js,css,html}            # Webflow conventions
grep -lqE "from ['\"]motion['\"]|window\.gsap|new Lenis|new Hls|new Swiper|FilePond" \
  src/**/*.{js,mjs,ts,html}                                     # Vanilla animation/scroll/video libs
[ -f "wrangler.toml" ]                                          # Cloudflare R2 / Wrangler deploy

# 2. GO
[ -f "go.mod" ]

# 3. NEXTJS — Next.js / React App Router
[ -f "next.config.{js,mjs,ts}" ]
[ -f "package.json" ] && grep -Eq '"next"|"react"' package.json

# 4. UNKNOWN — none matched (Node.js without React/Next, React Native, Swift, other)
#    Surface disambiguation prompt; this skill does not own the stack
```

---

## 3. WHY THIS ORDERING

- **WEBFLOW first**: Webflow projects routinely contain `package.json` for build tooling (terser, wrangler). Without WEBFLOW precedence, they would misroute to NEXTJS.
- **GO before NEXTJS**: alphabetical doesn't matter; both are unambiguous markers. GO is listed first because it is more common in fullstack workspaces.
- **NEXTJS requires `next.config.*` OR explicit React/Next dep**: a bare `package.json` without React/Next signals does NOT route to NEXTJS — it returns UNKNOWN.

---

## 4. MULTI-MARKER EDGE CASES

- **Monorepo with `go.mod` plus `package.json`**: GO wins (first match). Use a prompt hint to override (`"in the next.js frontend ..."`).
- **Webflow project without `src/2_javascript/`**: vanilla animation library detection (motion.dev / GSAP / Lenis) catches it. Failing that, the wrangler.toml or generic CSS+HTML fallback applies.
- **Bare repo with no markers**: returns UNKNOWN; surface disambiguation prompt.
- **Node.js project with `package.json` but no React/Next**: returns UNKNOWN; this skill does not own generic Node.js work.
- **React Native / Expo / Swift**: returns UNKNOWN; this skill does not own those stacks.

---

## 5. STACK → RESOURCE FOLDER MAPPING

```python
STACK_FOLDERS = {
    "WEBFLOW": "webflow",
    "NEXTJS":  "nextjs",
    "GO":      "go",
}
```

Resources are loaded from `references/<STACK_FOLDERS[stack]>/` and `assets/<STACK_FOLDERS[stack]>/`.

| Stack    | Status     | Content                                                                                                 |
| -------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| WEBFLOW  | LIVE       | Webflow / vanilla animation web (motion.dev / GSAP / Lenis / HLS / Swiper / FilePond)                   |
| NEXTJS   | STUB       | Next.js 14 target: App Router + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI + next-themes + optional TinaCMS |
| GO       | STUB       | gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt; pairs with NEXTJS via `cross_stack_pairing.md` |
| UNKNOWN  | not owned  | Disambiguation prompt; this skill does not own Node.js / React Native / Swift / other stacks            |

---

## 6. TEST CASES

| Workspace                                               | Expected stack | Reasoning                                  |
| ------------------------------------------------------- | -------------- | ------------------------------------------ |
| `src/2_javascript/`, `package.json`, `wrangler.toml`     | WEBFLOW        | Webflow markers win over `package.json`    |
| `motion.dev` imports + plain HTML/CSS, no framework deps | WEBFLOW        | Vanilla animation library signal           |
| `go.mod`                                                 | GO             | `go.mod` precedence                        |
| `next.config.js`, `package.json`                         | NEXTJS         | Next config marker                         |
| `package.json` (react)                                  | NEXTJS         | React in deps                              |
| `package.json` (express, no React/Next)                  | UNKNOWN        | Generic Node.js — not owned                |
| `app.json` (expo), `package.json` (react-native)         | UNKNOWN        | React Native — not owned                   |
| `Package.swift`                                          | UNKNOWN        | Swift — not owned                          |
| (no markers)                                             | UNKNOWN        | Disambiguation surface                     |

---

## 7. RELATED RESOURCES

- `references/router/intent_classification.md` - what runs after stack detection (TASK_SIGNALS scoring).
- `references/router/resource_loading.md` - how the detected stack drives load level and per-stack resource selection.
- `references/router/phase_lifecycle.md` - how detected stack maps to Phase 0-3 lifecycle.
- `references/router/cross_stack_pairing.md` - canonical Next.js ↔ Go API contract (relevant when both stacks are present).
- `SKILL.md` §2 — full smart-routing pseudocode.
