---
title: "Wave 1 - Codex Build System & Dependency Flow Review"
source: "cli-codex (gpt-5.3-codex, read-only sandbox)"
date: 2026-03-02
---

# Wave 1: Codex Build System & Dependency Flow Review

## 1. TypeScript Config Structure (Correct)

**Root** (`tsconfig.json`): Composite project with references to all 3 packages
- References: `./shared`, `./mcp_server`, `./scripts` (correct order)
- No circular dependencies detected

**shared/tsconfig.json**: No references, no path aliases → clean leaf package
**mcp_server/tsconfig.json**: References `../shared` only, alias `@spec-kit/shared/*`
**scripts/tsconfig.json**: References `../shared` + `../mcp_server`, aliases for both

**Build order: shared → mcp_server → scripts** ✅ CORRECT

## 2. Dependency Duplication (P2 - Minor)

Both `scripts` and `mcp_server` declare identical dependencies:

| Package | mcp_server | scripts | Version |
|---------|-----------|---------|---------|
| better-sqlite3 | dependencies | dependencies | ^12.6.2 |
| sqlite-vec | dependencies | dependencies | ^0.1.7-alpha.2 |

**Assessment**: Since this is an npm workspace, npm hoists these. The duplication is harmless but redundant. Scripts could remove them and rely on workspace hoisting from mcp_server.

## 3. Missing Workspace Dependencies (P1)

**scripts/package.json** does NOT declare workspace dependencies on `@spec-kit/shared` or `@spec-kit/mcp-server`. The TypeScript path aliases work at compile time, but the npm workspace link isn't explicit. This means:
- TypeScript compilation works (via tsconfig paths)
- Runtime resolution relies on npm workspace symlinks being set up correctly
- If someone runs `npm install --workspace=scripts` in isolation, it would fail

**Recommendation**: Add explicit workspace dependencies:
```json
"dependencies": {
  "@spec-kit/shared": "workspace:*",
  "@spec-kit/mcp-server": "workspace:*"
}
```

## 4. Mixed Import Patterns (P1 - Code Smell)

Scripts use TWO different patterns to import from mcp_server:

**Pattern A: Path alias** (correct)
- `scripts/core/memory-indexer.ts:13` → `@spec-kit/mcp-server/lib/search/vector-index`
- `scripts/core/memory-indexer.ts:14` → `@spec-kit/mcp-server/core/config`
- `scripts/lib/retry-manager.ts:7` → `@spec-kit/mcp-server/lib/providers/retry-manager`

**Pattern B: Relative paths** (bypasses alias, couples to physical layout)
- `scripts/memory/reindex-embeddings.ts:20-26` → `../../mcp_server/lib/search/vector-index` (type-only)
- `scripts/memory/reindex-embeddings.ts:45-46` → `path.resolve(__dirname, '../../mcp_server/dist')` (runtime)
- `scripts/evals/run-performance-benchmarks.ts:16-24` → `../../mcp_server/lib/search/session-boost` etc.
- `scripts/evals/run-chk210-quality-backfill.ts:10` → `../../mcp_server/lib/parsing/memory-parser.ts`
- `scripts/memory/cleanup-orphaned-vectors.ts:33` → hardcoded path to `mcp_server/database/context-index.sqlite`

**Recommendation**: Standardize all imports through the `@spec-kit/mcp-server/*` alias. The relative paths are fragile and break if the physical layout changes.

## 5. Dynamic require() Usage (P2 - Justified)

- `scripts/memory/reindex-embeddings.ts`: Uses dynamic `require()` via `requireFromMcpServerDist()` to load compiled JS from `mcp_server/dist/`. This is **justified** because the script needs to use the compiled runtime modules (not TypeScript source), and the path resolution must work from the `dist/` directory.
- `scripts/spec-folder/folder-detector.ts:941`: Dynamic `require('better-sqlite3')` — **justified** for optional dependency loading.
- `scripts/loaders/data-loader.ts:57`: Dynamic `import('../extractors/opencode-capture')` — **justified** for lazy loading optional extractors.

## 6. shared/ Does NOT Import from mcp_server ✅

Confirmed: `shared/` has zero imports from `mcp_server`. The dependency direction is clean and one-way.

## Summary

| Finding | Severity | Files |
|---------|----------|-------|
| Mixed import patterns (alias vs relative) | P1 | 6 files in scripts/ |
| Missing workspace deps in scripts/package.json | P1 | scripts/package.json |
| Dependency duplication (better-sqlite3, sqlite-vec) | P2 | scripts/package.json, mcp_server/package.json |
| Dynamic require() for mcp_server dist | P2 (justified) | reindex-embeddings.ts |
| Hardcoded DB path in cleanup-orphaned-vectors.ts | P1 | cleanup-orphaned-vectors.ts:33 |
