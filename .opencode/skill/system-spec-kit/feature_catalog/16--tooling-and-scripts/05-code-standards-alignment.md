---
title: "Code standards alignment"
description: "Code standards alignment brought comments, MODULE/COMPONENT headers, import ordering, and constant naming into line with sk-code--opencode standards."
---

# Code standards alignment

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE EVIDENCE](#3--source-evidence)
- [4. VERIFICATION TRACEABILITY](#4--verification-traceability)
- [5. SOURCE FILES](#5--source-files)
- [6. SOURCE METADATA](#6--source-metadata)

## 1. OVERVIEW

Code standards alignment brought comments, MODULE/COMPONENT headers, import ordering, and constant naming into line with sk-code--opencode standards.

This was a cleanup pass that made the code follow a consistent style across the project. It fixed 45 places where comments, file headers, naming patterns or import ordering did not match the agreed-upon rules. Think of it like an editor going through a document to make sure every chapter uses the same formatting and citation style.

---

## 2. CURRENT REALITY

All modified files were reviewed against sk-code--opencode standards. At HEAD, the live codebase uses MODULE/COMPONENT headers plus purposeful inline comments where explanation adds value. Legacy AI-intent prefixes (`AI-WHY`, `AI-TRACE`, `AI-GUARD`) are no longer part of the active convention, and `rg "AI-(WHY|TRACE|GUARD):" .opencode/skill/system-spec-kit/mcp_server` returns no matches.

---

## 3. SOURCE EVIDENCE

### 1) Purposeful comments and retired AI-intent prefixes

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:357` documents the purposeful-comment rule used at HEAD.
  - `sk-code--opencode/SKILL.md:437` keeps file headers as a P0 compliance check.
- **HEAD evidence**
  - `rg "AI-(WHY|TRACE|GUARD):" .opencode/skill/system-spec-kit/mcp_server` returns no matches at HEAD.
  - The live alignment posture uses standardized `// MODULE:` / `// COMPONENT:` headers and targeted explanatory comments rather than AI-intent marker prefixes.

### 2) MODULE/COMPONENT headers

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:341-343` (required file header format by language — TypeScript at line 343)
  - `sk-code--opencode/SKILL.md:437` (P0: file header present and correct — was line 435)
- **File-level evidence (10 files, 1 header each at HEAD)**
  - `mcp_server/handlers/memory-save.ts` → `1`
  - `mcp_server/lib/search/hybrid-search.ts` → `1`
  - `mcp_server/lib/search/folder-discovery.ts` → `1`
  - `mcp_server/lib/search/rsf-fusion.ts` (deleted) → was `1`
  - `mcp_server/lib/search/graph-search-fn.ts` → `1`
  - `mcp_server/lib/scoring/composite-scoring.ts` → `1`
  - `mcp_server/lib/parsing/trigger-matcher.ts` → `1`
  - `mcp_server/lib/cognitive/co-activation.ts` → `1`
  - `mcp_server/lib/search/query-classifier.ts` → `1`
  - `mcp_server/lib/search/channel-representation.ts` → `1`
- **Verification method**
  - `rg "^//\\s*(MODULE|COMPONENT):" <file>` returns one marker per file in the list above.

### 3) Import ordering and grouping

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:431` (P2 import order — was line 429)
- **File-level evidence**
  - `mcp_server/handlers/memory-save.ts:6-21` has grouped import blocks:
    - `Node built-ins` → `Shared packages` → `Internal modules`
  - `mcp_server/lib/search/hybrid-search.ts:8-53` separates runtime imports and `type` imports.
  - `mcp_server/lib/search/graph-search-fn.ts:6-10` keeps runtime imports before `import type`.

### 4) Constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`)

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:349` (TypeScript constants use UPPER_SNAKE)
- **File-level evidence**
  - `mcp_server/handlers/save/spec-folder-mutex.ts:10` defines `const SPEC_FOLDER_LOCKS = ...`.
  - `rg "\\bspecFolderLocks\\b" mcp_server/handlers/save mcp_server/handlers/memory-save.ts` returns no matches.
  - `rg "SPEC_FOLDER_LOCKS" mcp_server/handlers/save/spec-folder-mutex.ts` returns active uses at lines `10, 14, 19, 23, 24, 29`.

---

## 4. VERIFICATION TRACEABILITY

### Lint/check commands

- Lint (MCP server scope):
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint`
- Lint + type-check bundle:
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm run check`
- Workspace type-check:
  - `cd .opencode/skill/system-spec-kit && npm run typecheck`

### Expected compliant output

- `npm run lint` exits `0` and reports `0` warnings / `0` errors.
- `npm run check` exits `0` (lint clean + `npx tsc --noEmit` clean).
- `npm run typecheck` exits `0` across `shared`, `mcp_server` and `scripts`.

### Configuration links (rules and enforcement points)

- ESLint rules:
  - `mcp_server/eslint.config.mjs`
  - Includes `@typescript-eslint/no-unused-vars` (error severity).
- TypeScript configs:
  - `tsconfig.json` (workspace references)
  - `mcp_server/tsconfig.json`
  - `scripts/tsconfig.json`
- Script entry points:
  - `mcp_server/package.json` (`lint`, `check`)
  - `package.json` at `system-spec-kit` root (`typecheck`)

---

## 5. SOURCE FILES

### Representative implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/spec-folder-mutex.ts` | Handler/save | Owns the extracted `SPEC_FOLDER_LOCKS` constant and per-spec-folder save mutex used by the standards-alignment evidence above |

---

## 6. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Code standards alignment
- Current reality source: FEATURE_CATALOG.md
