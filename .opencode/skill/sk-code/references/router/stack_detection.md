---
title: Router Reference — Stack Detection
description: Marker-file precedence and detection logic for the sk-code smart router.
keywords: [routing, stack-detection, marker-files, sk-code]
---

# Router Reference — Stack Detection

Stack detection runs FIRST — before intent classification. The detected stack gates which `references/<stack>/` and `assets/<stack>/` directories the router loads from.

> Authoritative source: `SKILL.md §2 — SMART ROUTING`. This doc is a deep-reference extract for operators investigating advisor decisions.

---

## Marker-File Precedence (first match wins)

```bash
# 1. WEB (Webflow) — checked first because Webflow projects often have
#    package.json for tooling but should NOT route to NODEJS
[ -d "src/2_javascript" ]                 # Webflow project structure
ls *.webflow.js 2>/dev/null                # Native Webflow exports
grep -lq "Webflow.push\|--vw-" src/**/*.{js,css,html}  # Webflow conventions

# 2. GO
[ -f "go.mod" ]

# 3. SWIFT
[ -f "Package.swift" ] || ls *.xcodeproj 2>/dev/null

# 4. REACT_NATIVE — Expo manifest precedence
[ -f "app.json" ] && grep -q "expo" app.json
[ -f "package.json" ] && grep -Eq "react-native|expo" package.json

# 5. REACT
[ -f "next.config.{js,mjs,ts}" ]
[ -f "package.json" ] && grep -Eq '"next"|"react"' package.json

# 6. NODEJS (fallback for any package.json that wasn't already classified)
[ -f "package.json" ]

# 7. UNKNOWN — none matched; surface disambiguation prompt
```

## Why this ordering

- **WEB first**: Webflow projects routinely contain `package.json` for build tooling (terser, wrangler). Without WEB precedence, they'd misroute to NODEJS.
- **GO before SWIFT**: alphabetical doesn't matter; both are unambiguous markers. GO listed first because it's more common.
- **REACT_NATIVE before REACT**: Expo + RN projects also contain React in their package.json; the more-specific RN check must run first.
- **NODEJS last**: catch-all for any package.json that wasn't a more specific React / RN / Expo project.

## Multi-Marker Edge Cases

- **Monorepo with go.mod + package.json**: GO wins (first match). Use prompt hint to override.
- **Webflow project without `src/2_javascript/`**: falls through to NODEJS via package.json. Acceptable false negative; user can re-prompt with explicit "Webflow" keyword.
- **Bare repo with no markers**: returns UNKNOWN; advisor surfaces `UNKNOWN_FALLBACK_CHECKLIST`.

## Stack → Resource Folder Mapping

```python
STACK_FOLDERS = {
    "WEBFLOW":          "web",
    "GO":           "go",
    "NODEJS":       "nodejs",
    "REACT":        "react",
    "REACT_NATIVE": "react-native",
    "SWIFT":        "swift",
}
```

Resources are loaded from `references/<STACK_FOLDERS[stack]>/` and `assets/<STACK_FOLDERS[stack]>/`.

| Stack | Status | Content |
|---|---|---|
| WEBFLOW | LIVE | Full Webflow / vanilla animation content (motion.dev / GSAP / Lenis / HLS / Swiper) |
| REACT | LIVE | Kerkmeester-style Next.js 14: App Router + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI + next-themes + optional TinaCMS |
| GO | LIVE | gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt; pairs with REACT via `references/router/cross_stack_pairing.md` |
| NODEJS | placeholder | `_placeholder.md` (canonical retired in packet 055) |
| REACT_NATIVE | placeholder | `_placeholder.md` (canonical retired in packet 055) |
| SWIFT | placeholder | `_placeholder.md` (canonical retired in packet 055) |

## Test Cases

| Workspace | Expected stack | Reasoning |
|---|---|---|
| `src/2_javascript/, package.json, wrangler.toml` | WEB | Webflow markers win over package.json |
| `go.mod` | GO | go.mod precedence |
| `Package.swift` | SWIFT | Swift package marker |
| `app.json`(expo), `package.json`(react-native) | REACT_NATIVE | Expo manifest precedence |
| `next.config.js`, `package.json` | REACT | Next config marker |
| `package.json`(react) | REACT | React in deps |
| `package.json`(express) | NODEJS | Generic Node fallback |
| (no markers) | UNKNOWN | Disambiguation surface |

## See Also

- `references/router/intent_classification.md` — what runs after stack detection
- `references/router/resource_loading.md` — how the detected stack drives resource selection
- `SKILL.md §2 — SMART ROUTING` — full routing pseudocode
