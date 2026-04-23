---
title: "Feature Specification: 028 — Code-Graph Self-Contained Package Migration"
description: "Migrate mcp_server/lib/code-graph/ + handlers/code-graph/ + tools/code-graph-tools.ts + tests/code-graph-*.vitest.ts into a self-contained mcp_server/code-graph/ package mirroring the skill-advisor architecture shipped in Phase 027. Pure behavior-preserving move + import-path update + dispatcher rewiring."
trigger_phrases:
  - "028"
  - "code-graph self-contained"
  - "code-graph package migration"
  - "mcp_server/code-graph/"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/002-code-graph-self-contained-package"
    last_updated_at: "2026-04-20T20:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded Phase 028 code-graph self-contained package migration"
    next_safe_action: "Dispatch cli-codex gpt-5.4 high fast on 028"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/"
      - ".opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-*.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tools/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 028 — Code-Graph Self-Contained Package Migration

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent Spec** | ../spec.md |
| **Parent** | `../` (003-code-graph-package) |
| **Predecessor** | ../001-code-graph-upgrades/spec.md |
| **Successor** | ../003-code-graph-context-and-scan-scope/spec.md |
| **Predecessor / Pattern** | Phase 027 (skill-advisor self-contained package under `mcp_server/skill-advisor/`). This phase applies the same architectural pattern to code-graph. |
| **Related** | `005-code-graph-upgrades` (original code-graph feature), `027/003 migration prep` (11 skill-advisor files moved with same pattern, SHA `1146faeec`) |

## 2. PROBLEM & PURPOSE

### Problem
Code-graph code is currently fragmented across four top-level `mcp_server/` folders:
- `mcp_server/lib/code-graph/` — 17 TypeScript modules (indexer, db, context, seed-resolver, parser, tree-sitter, readiness, ops-hardening, compact-merger, budget-allocator, etc.)
- `mcp_server/handlers/code-graph/` — 9 MCP handler files (scan, query, context, status, ccc-*)
- `mcp_server/tools/code-graph-tools.ts` — MCP tool descriptors
- `mcp_server/tests/code-graph-*.vitest.ts` — 7 test files

The fragmentation makes the package boundary unclear: there's no single directory that "owns" the code-graph module. By contrast, the skill-advisor migration in Phase 027 established a self-contained package shape (`mcp_server/skill-advisor/{lib,tools,handlers,tests,schemas,bench}/`) which is easier to reason about, test in isolation, and evolve.

### Purpose
Migrate code-graph into a parallel self-contained package at `mcp_server/code-graph/` with subfolders `lib/`, `tools/`, `handlers/`, `tests/`, `schemas/` (if extracted). This is a **pure behavior-preserving move** — no logic changes, no test changes. The only outputs that change are:
1. File locations (moves via `git mv` to preserve history)
2. Import paths across the codebase (updated to reference the new locations)
3. MCP dispatcher registration (rewired to the new tool descriptor path)

## 3. SCOPE

### In Scope
- **Migrate 17 files** from `mcp_server/lib/code-graph/` → `mcp_server/code-graph/lib/` (preserve filenames, preserve README.md)
- **Migrate 9 handler files** from `mcp_server/handlers/code-graph/` → `mcp_server/code-graph/handlers/`
- **Migrate tool descriptor** from `mcp_server/tools/code-graph-tools.ts` → `mcp_server/code-graph/tools/` (split per tool if it simplifies the structure; otherwise single-file move is acceptable)
- **Migrate 7 test files** from `mcp_server/tests/code-graph-*.vitest.ts` → `mcp_server/code-graph/tests/`
- **Update all importers** across the codebase (including `scripts/`, `hooks/`, other `lib/` modules, other test files) to reference the new package paths
- **Update dispatcher registration** in `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`, `mcp_server/tools/index.ts`
- **Update `vitest.config.ts`** include patterns to pick up `mcp_server/code-graph/tests/**/*.{vitest,test}.ts`
- **Verify no behavior change**: all existing code-graph tests still pass; no regressions in other tests

### Out of Scope
- Any change to code-graph logic, algorithms, DB schema, or tool behavior
- Moving the runtime SQLite DB at `mcp_server/database/code-graph.sqlite*` (keep in place; package structure is code-only)
- Moving `scripts/graph/backfill-graph-metadata.ts` (that's a CLI utility, separate concern from the MCP package)
- Any new feature work on code-graph (belongs to a follow-up phase)
- Schema or Zod-contract changes
- New code-graph tests (only migrating existing ones)

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. All 17 `lib/code-graph/*.ts` files present at `mcp_server/code-graph/lib/` with git history preserved via `git mv`
2. All 9 `handlers/code-graph/*.ts` files present at `mcp_server/code-graph/handlers/` with git history
3. Tool descriptor `tools/code-graph-tools.ts` present at `mcp_server/code-graph/tools/` (single-file acceptable, or split per tool)
4. All 7 `tests/code-graph-*.vitest.ts` files present at `mcp_server/code-graph/tests/` with git history
5. No remaining source file anywhere in the repo imports from the old paths (`mcp_server/lib/code-graph/`, `mcp_server/handlers/code-graph/`, `mcp_server/tools/code-graph-tools.ts`)
6. `mcp_server/vitest.config.ts` include patterns updated to discover the migrated tests
7. Pre-existing code-graph vitest suite green (targeted run): `cd mcp_server && npx vitest run mcp_server/code-graph/tests/` — all 7 files pass with the same pass-count as baseline
8. Typecheck + build green: `npm run typecheck && npm run build` exit 0
9. Zero behavior change: any advisor/hook/other test that previously passed still passes (no regressions)

### 4.2 P1 (Required)
1. Old folders (`mcp_server/lib/code-graph/` and `mcp_server/handlers/code-graph/`) are deleted after migration (empty, no stragglers)
2. MCP tool names remain unchanged: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `ccc_reindex`, `ccc_status`, `ccc_feedback`
3. All dispatcher registrations (`schemas/tool-input-schemas.ts`, `tool-schemas.ts`, `tools/index.ts`) reference the new package location
4. The `mcp_server/code-graph/lib/README.md` file preserved (contains architecture notes)
5. The `mcp_server/code-graph/handlers/README.md` file preserved
6. Baseline test count preserved (no tests lost in migration)

### 4.3 P2 (Suggestion)
1. Consider extracting Zod schemas into `mcp_server/code-graph/schemas/` if any are co-located with lib/ today
2. Consider adding `mcp_server/code-graph/index.ts` as the package public surface (re-exports from lib/, tools/, handlers/)
3. Consider adding a brief `mcp_server/code-graph/README.md` linking to lib/README.md + handlers/README.md

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** `find mcp_server/code-graph -type f | wc -l` ≥ 33 (17 lib + 9 handlers + 1 tools + 7 tests + READMEs + any extracted schemas)
2. **AC-2** `find mcp_server/lib/code-graph mcp_server/handlers/code-graph -type f 2>/dev/null | wc -l` returns 0 (old locations empty)
3. **AC-3** `grep -rln "mcp_server/lib/code-graph\|mcp_server/handlers/code-graph\|tools/code-graph-tools" mcp_server/ scripts/ --include="*.ts"` returns 0 lines (no stale imports)
4. **AC-4** `cd mcp_server && npx vitest run mcp_server/code-graph/tests/ --reporter=default` — all 7 test files pass with same pass-count as baseline
5. **AC-5** `npm run typecheck` exit 0
6. **AC-6** `npm run build` exit 0
7. **AC-7** `git log --follow mcp_server/code-graph/lib/code-graph-db.ts` shows the full history from the old `lib/code-graph/` location (git mv preserved)
8. **AC-8** MCP tool smoke test: `mcp__spec_kit_memory__code_graph_status` returns valid response (no dispatcher regression)

## 6. FILES TO CHANGE

### Moves (via `git mv` to preserve history)

**`mcp_server/lib/code-graph/` → `mcp_server/code-graph/lib/` (17 files):**
- `seed-resolver.ts`, `code-graph-db.ts`, `ops-hardening.ts`, `compact-merger.ts`, `startup-brief.ts`, `code-graph-context.ts`, `query-intent-classifier.ts`, `working-set-tracker.ts`, `tree-sitter-parser.ts`, `readiness-contract.ts`, `indexer-types.ts`, `index.ts`, `ensure-ready.ts`, `runtime-detection.ts`, `structural-indexer.ts`, `budget-allocator.ts`, `README.md`

**`mcp_server/handlers/code-graph/` → `mcp_server/code-graph/handlers/` (9 files):**
- `ccc-status.ts`, `status.ts`, `ccc-feedback.ts`, `scan.ts`, `context.ts`, `ccc-reindex.ts`, `README.md`, `index.ts`, `query.ts`

**`mcp_server/tools/code-graph-tools.ts` → `mcp_server/code-graph/tools/code-graph-tools.ts`** (single-file move; splitting per tool is optional P2)

**`mcp_server/tests/code-graph-*.vitest.ts` → `mcp_server/code-graph/tests/` (7 files):**
- `code-graph-scan.vitest.ts`, `code-graph-seed-resolver.vitest.ts`, `code-graph-indexer.vitest.ts`, `code-graph-context-handler.vitest.ts`, `code-graph-siblings-readiness.vitest.ts`, `code-graph-ops-hardening.vitest.ts`, `code-graph-query-handler.vitest.ts`

### Modified (import-path updates)

- `mcp_server/schemas/tool-input-schemas.ts`
- `mcp_server/tool-schemas.ts`
- `mcp_server/tools/index.ts`
- `mcp_server/vitest.config.ts` (include patterns)
- Any hook under `mcp_server/hooks/**/*.ts` that imports code-graph (likely `startup-brief.ts` consumers)
- Any lib module under `mcp_server/lib/**` that cross-references code-graph
- Any script under `scripts/**/*.ts` that imports code-graph
- Any remaining test file under `mcp_server/tests/**` that imports code-graph modules

### Unchanged (kept in place)

- `mcp_server/database/code-graph.sqlite*` — runtime DB, not code
- `scripts/graph/backfill-graph-metadata.ts` — CLI utility, separate concern
- All MCP tool names + dispatcher surface semantics
- All DB schema, query interfaces, public API
