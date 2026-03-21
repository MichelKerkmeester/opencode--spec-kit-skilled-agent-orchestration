# OPUS-5: Type System & Contract Verification Report

## Summary: 20 findings (0 CRITICAL, 5 HIGH, 8 MEDIUM, 7 LOW)

## KEY SYSTEMIC ISSUES

1. **Parallel type hierarchies** — `input-normalizer.ts` defines its own `Observation`, `UserPrompt`, `FileEntry`, `RecentContext` that shadow identically-named types in `session-types.ts` with DIFFERENT shapes. TECH-DEBT P6-05 acknowledged but incomplete.

2. **Dual quality scorer** — Two `scoreMemoryQuality` functions with incompatible signatures BOTH run on every workflow execution. Migration in progress but incomplete.

3. **Index signature overuse** — 8 interfaces in `session-types.ts` use `[key: string]: unknown`, undermining structural type safety. `CollectedDataBase` is the worst offender.

4. **Zero `as any` in production code** — Excellent type hygiene overall.

## HIGH FINDINGS

### OPUS5-001 — Duplicate interface definitions
`implementation-guide-extractor.ts` defines 4 interfaces identically to `session-types.ts` instead of importing. Divergence risk.

### OPUS5-002 — `Observation` naming collision (DIFFERENT shapes)
`input-normalizer.ts:39` has `facts: string[]` (required) vs `session-types.ts:60` has `facts?: FactValue[]` (optional, union). Dangerous naming collision.

### OPUS5-003 — `FileEntry` defined in THREE modules with different shapes
- `session-types.ts`: `{ FILE_PATH, FILE_NAME?, DESCRIPTION? }`
- `input-normalizer.ts`: `{ FILE_PATH, DESCRIPTION, ACTION?, MODIFICATION_MAGNITUDE?, ... }`
- `tree-thinning.ts`: `{ path, content }`
Already requires aliasing in workflow.ts.

### OPUS5-005 — Three `as unknown as Record<string, unknown>` double-casts
`input-normalizer.ts:432,474,813` — bypass type system to feed FileEntry into normalizer.

### OPUS5-009 — Dual quality scorer with incompatible signatures
`core/quality-scorer.ts` (8 positional params) vs `extractors/quality-scorer.ts` (single object). Both called every run.

## MEDIUM FINDINGS

### OPUS5-004 — `ExchangeSummary` naming collision (completely different concepts)
`message-utils.ts`: `{ userIntent, outcome, toolSummary, fullSummary }` vs `session-types.ts`: `{ userInput, assistantResponse, timestamp? }`

### OPUS5-006 — Non-null assertions on guarded optional fields
`collect-session-data.ts:245-247` uses `!` assertions behind indirect boolean guard.

### OPUS5-007 — Non-null assertions in generate-context error handling
`generate-context.ts:499,507` on `CONFIG.SPEC_FOLDER_ARG!`

### OPUS5-008 — Non-null assertion after try/catch in rank-memories
`rank-memories.ts:394` — safe but fragile.

### OPUS5-010 — SQLite .all() result cast to `as unknown[]`
`folder-detector.ts:1346` — row shape not typed.

### OPUS5-016 — `UserPrompt` timestamp required vs optional mismatch
`input-normalizer.ts:51` `timestamp: string` vs `session-types.ts:71` `timestamp?: string`

### OPUS5-020 — Deprecated field `importance_tier` with index signature
`session-types.ts:128-129` — deprecation is documentation-only, no compile-time enforcement.

## LOW FINDINGS (7)
OPUS5-011 through OPUS5-019 — Various minor type casts, dead exports, simulation type naming.
