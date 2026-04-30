---
title: Router Reference — Stack Detection
description: Marker-file precedence and detection logic for the sk-code smart router. Three live stacks: WEBFLOW, REACT, GO.
keywords: [routing, stack-detection, marker-files, sk-code, webflow, react, nextjs, go]
---

# Router Reference — Stack Detection

Stack detection runs FIRST — before intent classification. The detected stack gates which `references/<stack>/` and `assets/<stack>/` directories the router loads from.

`sk-code` owns three live stacks: **WEBFLOW**, **REACT** (Next.js 14, kerkmeester-style), **GO** (gin + sqlc + Postgres). Anything else returns `UNKNOWN` — disambiguation prompt; this skill does not own those stacks.

> Authoritative source: `SKILL.md §2 — SMART ROUTING`. This doc is a deep-reference extract for operators investigating advisor decisions.

---

## Marker-File Precedence (first match wins)

```bash
# 1. WEBFLOW — checked first because Webflow projects often have
#    package.json for build tooling but should NOT misroute to REACT
[ -d "src/2_javascript" ]                                       # Webflow project structure
ls *.webflow.js 2>/dev/null                                     # Native Webflow exports
grep -lq "Webflow.push\|--vw-" src/**/*.{js,css,html}            # Webflow conventions
grep -lqE "from ['\"]motion['\"]|window\.gsap|new Lenis|new Hls|new Swiper|FilePond" \
  src/**/*.{js,mjs,ts,html}                                     # Vanilla animation/scroll/video libs
[ -f "wrangler.toml" ]                                          # Cloudflare R2 / Wrangler deploy

# 2. GO
[ -f "go.mod" ]

# 3. REACT / Next.js
[ -f "next.config.{js,mjs,ts}" ]
[ -f "package.json" ] && grep -Eq '"next"|"react"' package.json

# 4. UNKNOWN — none matched (Node.js without React/Next, React Native, Swift, other)
#    Surface disambiguation prompt; this skill does not own the stack
```

## Why this ordering

- **WEBFLOW first**: Webflow projects routinely contain `package.json` for build tooling (terser, wrangler). Without WEBFLOW precedence, they'd misroute to REACT.
- **GO before REACT**: alphabetical doesn't matter; both are unambiguous markers. GO listed first because it's more common in fullstack workspaces.
- **REACT requires `next.config.*` OR explicit React/Next dep**: a bare `package.json` without React/Next signals does NOT route to REACT — it returns UNKNOWN.

## Multi-Marker Edge Cases

- **Monorepo with go.mod + package.json**: GO wins (first match). Use prompt hint to override.
- **Webflow project without `src/2_javascript/`**: vanilla animation library detection (motion.dev/GSAP/Lenis) catches it. Failing that, generic CSS+HTML fallback.
- **Bare repo with no markers**: returns UNKNOWN; surface disambiguation prompt.
- **Node.js project with package.json but no React/Next**: returns UNKNOWN; this skill does not own generic Node.js work.
- **React Native / Expo / Swift**: returns UNKNOWN; this skill does not own those stacks.

## Stack → Resource Folder Mapping

```python
STACK_FOLDERS = {
    "WEBFLOW": "webflow",
    "REACT":   "react",
    "GO":      "go",
}
```

Resources are loaded from `references/<STACK_FOLDERS[stack]>/` and `assets/<STACK_FOLDERS[stack]>/`.

| Stack | Status | Content |
|---|---|---|
| WEBFLOW | LIVE | Webflow / vanilla animation web (motion.dev / GSAP / Lenis / HLS / Swiper / FilePond) |
| REACT | LIVE | Kerkmeester-style Next.js 14: App Router + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI + next-themes + optional TinaCMS |
| GO | LIVE | gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt; pairs with REACT via `references/router/cross_stack_pairing.md` |
| UNKNOWN | not owned | Disambiguation prompt; this skill does not own Node.js / React Native / Swift / other stacks |

## Test Cases

| Workspace | Expected stack | Reasoning |
|---|---|---|
| `src/2_javascript/, package.json, wrangler.toml` | WEBFLOW | Webflow markers win over package.json |
| `motion.dev imports + plain HTML/CSS, no framework deps` | WEBFLOW | Vanilla animation library signal |
| `go.mod` | GO | go.mod precedence |
| `next.config.js`, `package.json` | REACT | Next config marker |
| `package.json`(react) | REACT | React in deps |
| `package.json`(express, no React/Next) | UNKNOWN | Generic Node.js — not owned |
| `app.json`(expo), `package.json`(react-native) | UNKNOWN | React Native — not owned |
| `Package.swift` | UNKNOWN | Swift — not owned |
| (no markers) | UNKNOWN | Disambiguation surface |

## See Also

- `references/router/intent_classification.md` — what runs after stack detection
- `references/router/resource_loading.md` — how the detected stack drives resource selection
- `references/router/cross_stack_pairing.md` — React↔Go contract
- `SKILL.md §2 — SMART ROUTING` — full routing pseudocode
