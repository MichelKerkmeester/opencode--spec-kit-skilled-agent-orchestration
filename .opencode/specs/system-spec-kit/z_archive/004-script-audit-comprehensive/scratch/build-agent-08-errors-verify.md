# Build Verification - C08 Error Handling / Logging / Exit Codes

Date: 2026-02-15
Mode: Read-only validation (no source edits)
Input: `context-agent-08-error-handling.md`

## Scope and Filters

- Validated all C08 findings (C08-F001..C08-F023) against current TypeScript sources under:
  - `.opencode/skill/system-spec-kit/scripts/**`
  - `.opencode/skill/system-spec-kit/mcp_server/**`
- Explicitly excluded node_modules and migration-only noise from verdicting (for example migration-warning paths in vector index internals when assessing stderr usage quality).

## Overall Verdict

- Validated: 23 findings
- Confirmed: 20 findings
- Not confirmed: 1 finding
- Partially confirmed: 2 findings

## Critical Theme Checks Requested

### 1) Swallowed errors

Confirmed.

Key evidence:
- `scripts/memory/cleanup-orphaned-vectors.ts:164` empty catch on history count.
- `scripts/memory/cleanup-orphaned-vectors.ts:183` empty catch on `database.close()`.
- `mcp_server/tests/session-manager-extended.vitest.ts:32` and `:33` empty catch in test cleanup.
- `mcp_server/tests/session-manager-extended.vitest.ts:61` empty catch in test directory removal.

### 2) Non-zero exit consistency

Confirmed as inconsistent at policy level.

Key evidence:
- Most CLI scripts use binary `0/1` only:
  - `scripts/memory/rank-memories.ts:349`, `:364`, `:370`, `:380`, `:399`
  - `scripts/memory/generate-context.ts:85`, `:94`, `:99`, `:207`, `:237`, `:252`
  - `scripts/memory/cleanup-orphaned-vectors.ts:176`, `:187`
- No multi-class exit code taxonomy (retryable/configuration/permanent) is present.

### 3) stderr coverage

Confirmed weak/inconsistent.

Key evidence:
- Extensive `console.warn(...)` usage in operational paths (stdout channel), e.g.:
  - `mcp_server/lib/session/session-manager.ts:203`, `:314`, `:459`, `:557`, `:583`
  - `mcp_server/handlers/memory-save.ts:206`, `:253`, `:288`, `:807`, `:864`
  - `scripts/core/memory-indexer.ts:52`, `:89`, `:116`, `:146`
- This confirms warning/error-adjacent signals are not consistently routed to stderr-equivalent pathways.

## Finding-by-Finding Validation

### CRITICAL

- C08-F001: CONFIRMED
  - `scripts/memory/cleanup-orphaned-vectors.ts:164`, `:183`
- C08-F002: CONFIRMED
  - Mixed severity usage in same module (`console.error`, `console.warn`, info via error):
  - `mcp_server/lib/session/session-manager.ts:181`, `:203`, `:314`, `:549`
- C08-F003: CONFIRMED
  - Degraded/fallback flow continues after warning/error without hard fail:
  - `scripts/core/memory-indexer.ts:32`, `:89`, `:146`
  - `mcp_server/handlers/memory-save.ts:206`, `:288`
- C08-F004: PARTIAL
  - Pattern exists (error returned instead of throw/exit), e.g. `mcp_server/handlers/memory-save.ts:267`.
  - But this is an MCP handler/library context, not pure CLI, so strict "must exit" framing is overstated.
- C08-F008: CONFIRMED
  - Null DB path allows operation: `mcp_server/lib/session/session-manager.ts:314` returns `true`.

### HIGH

- C08-F005: NOT CONFIRMED
  - Audit claimed 30s vs 5s mismatch for same readiness operation.
  - Current code uses `waitForEmbeddingModel(30000)` in both places:
    - `mcp_server/handlers/memory-search.ts:600`
    - `mcp_server/context-server.ts:264`
  - The 5000ms seen in `context-server` is API key validation timeout (`embeddings.validateApiKey`) and is not the same operation.
- C08-F006: CONFIRMED
  - Warning-level logs predominantly use `console.warn(...)` in production paths.
- C08-F007: CONFIRMED
  - No retry in `cleanup-orphaned-vectors` main failure path: `scripts/memory/cleanup-orphaned-vectors.ts:177-187`.
- C08-F009: CONFIRMED
  - Empty catches in tests: `mcp_server/tests/session-manager-extended.vitest.ts:32`, `:33`, `:61`.
- C08-F010: CONFIRMED
  - UPDATE 0 rows only warns: `mcp_server/handlers/memory-save.ts:253`.
- C08-F011: CONFIRMED
  - CLI exit taxonomy absent; scripts use mostly binary 0/1.
- C08-F012: CONFIRMED
  - Deferred `setImmediate` async retry has no timeout wrapper: `mcp_server/handlers/memory-save.ts:861-866`.

### MEDIUM/LOW

- C08-F013: PARTIAL
  - Some structured logging exists (`structuredLog` usage), but not consistently used across modules.
- C08-F014: CONFIRMED
  - Vector search failure returns empty array: `mcp_server/handlers/memory-save.ts:206-207`.
- C08-F015: CONFIRMED
  - Trigger extraction fallback with warn path and no metrics counter.
- C08-F016: CONFIRMED
  - Info cleanup message via error channel: `mcp_server/lib/session/session-manager.ts:549`.
- C08-F017: CONFIRMED
  - `memory_history` missing-table path is soft-handled while vec path assumes table existence in same flow (`scripts/memory/cleanup-orphaned-vectors.ts:109-125`).
- C08-F018: CONFIRMED
  - Inconsistent return contracts around PE helper paths (`IndexResult` error object vs boolean false) in `memory-save.ts`.
- C08-F019: CONFIRMED
  - No standardized machine error code scheme in logging statements.
- C08-F020: CONFIRMED
  - Working memory cleanup errors are warned and result still returns success: `session-manager.ts:583`.
- C08-F021: CONFIRMED
  - Metadata update failure warned and indexing proceeds: `scripts/core/memory-indexer.ts:146`.
- C08-F022: CONFIRMED
  - `enforce_entry_limit` failures are warn-only: `session-manager.ts:459`.
- C08-F023: CONFIRMED
  - Success message and `process.exit(0)` emitted despite swallowed/soft-failed substeps in cleanup flow (`cleanup-orphaned-vectors.ts:175-176` with earlier soft catches).

## Top Confirmed IDs

1. C08-F001 (swallowed errors)
2. C08-F008 (null DB allows success path)
3. C08-F006 (stderr coverage gaps via broad console.warn usage)
