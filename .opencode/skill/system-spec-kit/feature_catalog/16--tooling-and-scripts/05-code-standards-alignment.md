# Code standards alignment

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE EVIDENCE](#4--source-evidence)
- [5. VERIFICATION TRACEABILITY](#5--verification-traceability)
- [6. SOURCE FILES](#6--source-files)
- [7. SOURCE METADATA](#7--source-metadata)

## 1. OVERVIEW
Code standards alignment fixed 45 violations across AI-intent comments, MODULE/COMPONENT headers, import ordering and constant naming to match sk-code--opencode standards.

## 2. CURRENT REALITY
All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`).

## 3. IN SIMPLE TERMS
This was a cleanup pass that made the code follow a consistent style across the project. It fixed 45 places where comments, file headers, naming patterns or import ordering did not match the agreed-upon rules. Think of it like an editor going through a document to make sure every chapter uses the same formatting and citation style.
## 4. SOURCE EVIDENCE
### 1) AI-intent comments (AI-WHY / AI-TRACE / AI-GUARD)

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:357` (allowed AI-intent tags)
  - `sk-code--opencode/SKILL.md:444` (AI comment policy checklist gate)
- **File-level fix counts (auditable)**
  - From `git show 18a0f9548` AI-intent additions:
    - `mcp_server/lib/search/hybrid-search.ts` → `10`
    - `mcp_server/lib/search/folder-discovery.ts` → `7`
    - `mcp_server/lib/search/rsf-fusion.ts` → `5`
    - `mcp_server/lib/cognitive/co-activation.ts` → `4`
  - These four files account for `26` AI-intent conversions (matching the catalog claim).
- **HEAD evidence**
  - `rg "AI-(WHY|TRACE|GUARD):" mcp_server/lib` shows the standardized prefixes are present.

### 2) MODULE/COMPONENT headers

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:341-344` (required file header format by language)
  - `sk-code--opencode/SKILL.md:435` (P0: file header present and correct)
- **File-level evidence (10 files, 1 header each at HEAD)**
  - `mcp_server/handlers/memory-save.ts` → `1`
  - `mcp_server/lib/search/hybrid-search.ts` → `1`
  - `mcp_server/lib/search/folder-discovery.ts` → `1`
  - `mcp_server/lib/search/rsf-fusion.ts` → `1`
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
  - `sk-code--opencode/SKILL.md:429` (P2 import order)
- **File-level evidence**
  - `mcp_server/handlers/memory-save.ts:6-21` has grouped import blocks:
    - `Node built-ins` → `Shared packages` → `Internal modules`
  - `mcp_server/lib/search/hybrid-search.ts:8-53` separates runtime imports and `type` imports.
  - `mcp_server/lib/search/graph-search-fn.ts:6-10` keeps runtime imports before `import type`.

### 4) Constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`)

- **Rule mapping**
  - `sk-code--opencode/SKILL.md:349` (TypeScript constants use UPPER_SNAKE)
- **File-level evidence**
  - `mcp_server/handlers/memory-save.ts:89` defines `const SPEC_FOLDER_LOCKS = ...`.
  - `rg "\\bspecFolderLocks\\b" mcp_server` returns no matches.
  - `rg "SPEC_FOLDER_LOCKS" mcp_server/handlers/memory-save.ts` returns active uses at lines `89, 93, 96, 100, 101`.

## 5. VERIFICATION TRACEABILITY
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

## 6. SOURCE FILES
No dedicated source files. This is a cross-cutting meta-improvement applied across multiple modules.

## 7. SOURCE METADATA
- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Code standards alignment
- Current reality source: feature_catalog.md

