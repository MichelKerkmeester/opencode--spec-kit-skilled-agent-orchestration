---
title: "Wave 1 Synthesis: Script Location Analysis"
date: 2026-03-02
sources: [wave1-gemini-architecture.md, wave1-codex-build-system.md, wave1-opus-import-map.md]
---

# Wave 1 Synthesis: Script Location Analysis

## Consensus Findings (All 3 Models Agree)

### 1. Package Boundaries Are Not Clean (P1)
All three reviewers found that `scripts/` has significant direct coupling to `mcp_server/` internals. **10 files** in scripts/ reference mcp_server through **15 imports + 7 type references + 9 runtime path constructions**.

### 2. Mixed Import Patterns (P1)
Three different import styles coexist:
- `@spec-kit/mcp-server/*` alias (3 imports, 2 files) — preferred
- `../../mcp_server/*` relative paths (5 imports, 2 files) — fragile
- Runtime `path.join(__dirname, '../../mcp_server/dist')` (9 refs, 6 files) — necessary for dist loading

### 3. Eval Scripts Are Misplaced (P1 - Gemini) / Justified Coupling (P2 - Opus)
**Disagreement**: Gemini recommends moving `scripts/evals/` to `mcp_server/tests/evals/`. Opus argues the tight coupling is justified since benchmarks MUST import actual modules. **Resolution**: The evals are CLI tools that benchmark server internals. They belong in `scripts/evals/` (correct location) but should use `@spec-kit/mcp-server/*` aliases instead of relative paths.

### 4. Missing Workspace Dependencies (P1)
`scripts/package.json` doesn't declare `@spec-kit/shared` or `@spec-kit/mcp-server` as workspace deps. TypeScript path aliases work at compile time, but npm resolution is implicit.

### 5. Duplicate Dependencies (P2)
`better-sqlite3` and `sqlite-vec` appear in both `scripts` and `mcp_server` at identical versions. Harmless (npm hoisting), but redundant.

### 6. Hardcoded DB Path (P1)
`scripts/memory/cleanup-orphaned-vectors.ts:33` hardcodes `path.join(__dirname, '../../../mcp_server/database/context-index.sqlite')`.

## Recommended Actions

### Immediate (This Session)

| # | Action | Severity | Files |
|---|--------|----------|-------|
| 1 | Standardize all scripts/ imports to use `@spec-kit/mcp-server/*` alias (not relative `../../mcp_server/`) | P1 | 4 files |
| 2 | Add workspace deps to scripts/package.json | P1 | 1 file |
| 3 | Extract DB_PATH constant to shared/config.ts | P1 | 5+ files |
| 4 | Remove duplicate better-sqlite3/sqlite-vec from scripts/package.json | P2 | 1 file |

### Future (Separate Spec)

| # | Action | Severity | Rationale |
|---|--------|----------|-----------|
| 5 | Move quality-scorer.ts to shared/scoring/ | P2 | Gemini: shared scoring logic |
| 6 | Move topic-extractor.ts to shared/lib/extraction/ | P2 | Gemini: consolidate extraction |
| 7 | Move alignment-validator.ts telemetry function to mcp_server/ | P2 | Cross-concern violation |
| 8 | Move Observation/UserPrompt/FileEntry types to shared/types.ts | P2 | Gemini: centralize entities |
| 9 | Move retry-manager to shared/ (it's a shim over mcp_server) | P2 | Opus: eliminate indirection |

## Architecture Verdict

The monorepo structure is **fundamentally sound**:
- Three-package split (shared, mcp_server, scripts) makes sense
- Build order (shared → mcp_server → scripts) is correct
- No circular dependencies
- shared/ is properly positioned as the dependency-free base

The issues are **coupling hygiene**, not architectural. Scripts reaching into `mcp_server/lib/*` internals creates fragile coupling that should be routed through either `shared/` (for reusable logic) or `@spec-kit/mcp-server/*` aliases (for intentional coupling).
