# Iteration 025: D4 Maintainability Test Coverage Audit

## Focus

Fresh D4 maintainability dive on automated test coverage for the hook and code-graph slice. This pass inventories the current `tests/*.vitest.ts` surface, maps direct test imports to live implementation files, and checks whether the existing regression suites actually cover the failure paths behind `F001` through `F019`.

## Scope

- Reviewed review state:
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-research-config.json`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-research-state.jsonl`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-review-strategy.md`
- Reviewed hook implementation files:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts`
- Reviewed code-graph implementation files:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts`
- Reviewed relevant Vitest suites:
  - `.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-shared.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`

## Scorecard

- Verdict: `CONDITIONAL`
- New findings: 1 (`F029`, P2)
- Full Vitest inventory: 349 files under `mcp_server/tests`
- Direct hook-script import coverage: 4/6 (`66.7%`)
- Direct code-graph library import coverage: 6/10 (`60.0%`)
- Confidence: High

## Coverage Matrix

### A. `hooks/claude/*.ts`

| Implementation file | Direct tests | Assessment |
|---|---|---|
| `claude-transcript.ts` | `hook-stop-token-tracking.vitest.ts` | Covered directly for parser and cost-estimator helpers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:8-136] |
| `compact-inject.ts` | `edge-cases.vitest.ts` | Only imported incidentally; the assertions are placeholders and do not execute the merged-context or cache path, so this is not meaningful live-hook protection.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:11-24][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:136-239] |
| `hook-state.ts` | `hook-state.vitest.ts`, `hook-precompact.vitest.ts`, `hook-session-start.vitest.ts`, `session-token-resume.vitest.ts`, `token-snapshot-store.vitest.ts`, `edge-cases.vitest.ts` | Strong helper coverage for state persistence and cache payload storage.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:8-107][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:22-63][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:22-76] |
| `session-prime.ts` | none | No direct test imports the live script. The stale-named `hook-session-start.vitest.ts` suite exercises `hook-state.ts` and `shared.ts` only, then simulates hook behavior by manually reading the JSON state file.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:8-9][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:36-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:38-71][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:168-216] |
| `session-stop.ts` | none | No direct test imports the live script. The stale-named `hook-stop-token-tracking.vitest.ts` suite only covers `claude-transcript.ts`, leaving stop-hook guard, spec detection, and auto-save logic untested at the entrypoint level.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:8-136][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71-170] |
| `shared.ts` | `hook-shared.vitest.ts`, `hook-precompact.vitest.ts`, `hook-session-start.vitest.ts`, `edge-cases.vitest.ts` | Well-covered helper layer for formatting/truncation and stdin/timeout edge cases.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-shared.vitest.ts:4-66][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:27-123] |

### B. Non-Claude hook modules in the 024 packet

| Implementation file | Direct tests | Assessment |
|---|---|---|
| `hooks/index.ts` | `modularization.vitest.ts`, `context-server.vitest.ts` | Covered as a barrel/export surface, not as an ownership-consolidation contract.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:296-320][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1551-1649] |
| `hooks/memory-surface.ts` | `retrieval-directives.vitest.ts`, `dual-scope-hooks.vitest.ts`, `context-server.vitest.ts`, `memory-crud-extended.vitest.ts` | Helper-level coverage exists, but iteration 019 already showed the live Claude compaction path bypasses this helper entirely.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:527-562][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743-809] |
| `hooks/response-hints.ts` | `hooks-ux-feedback.vitest.ts`, `context-server.vitest.ts` | Covered directly, but the suite preserves the duplicate token-count owner rather than collapsing it.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-130][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1142-1193] |

### C. `lib/code-graph/*.ts`

| Implementation file | Direct tests | Assessment |
|---|---|---|
| `budget-allocator.ts` | `budget-allocator.vitest.ts` | Covered for 4000-token happy-path allocations only.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:11-67] |
| `code-graph-context.ts` | none | No dedicated unit or handler test imports `buildContext()` or its fallback / graph-neighborhood contract.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-117] |
| `code-graph-db.ts` | `crash-recovery.vitest.ts` | Partial DB-helper coverage exists, but it does not reproduce the failed-reinit or non-atomic refresh bugs from `F023`/`F024`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:893-973] |
| `compact-merger.ts` | `compact-merger.vitest.ts`, `dual-scope-hooks.vitest.ts` | Partial merger coverage exists, but it does not catch the `sessionState` budget leak or zero-budget rendering defects from `F012`/`F020`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:17-53][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743-809] |
| `index.ts` | none | No dedicated tests cover the code-graph barrel surface.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:1-7] |
| `indexer-types.ts` | `code-graph-indexer.vitest.ts`, `crash-recovery.vitest.ts` | Covered for hashes, language detection, and DB node typing helpers, but not for the `.zsh` discovery mismatch in `F017`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:13-73] |
| `runtime-detection.ts` | `runtime-detection.vitest.ts`, `cross-runtime-fallback.vitest.ts` | Healthy direct coverage.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:4-65] |
| `seed-resolver.ts` | none | No dedicated tests hit DB-unavailable placeholder fallback, exact/enclosing ambiguity, or file-anchor downgrade behavior.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:73-267] |
| `structural-indexer.ts` | `code-graph-indexer.vitest.ts` | Covered for basic symbol extraction, but not for multiline JS/TS ranges, JS/TS method nodes, `TESTED_BY`, or `excludeGlobs` behavior.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:76-146] |
| `working-set-tracker.ts` | none | No direct tests exercise `maxFiles` enforcement, immediate eviction, or symbol/file serialization behavior on the live tracker class.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:16-153] |

## Failure-Path Coverage vs. `F001`-`F019`

### `F001`-`F004` (hook lifecycle correctness)

- `F001` / `F002`: still **untested**. The current suite never forces a stdout-write failure after `session-prime.ts` clears `pendingCompactPrime`, and it never forces `saveState()` / `updateState()` to fail on the compact cache path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:22-76][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:22-63][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:49-53][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:223-239]
- `F003`: still **untested as a regression**, and one edge-case test now codifies the buggy behavior by asserting that an old `cachedAt` payload is still readable instead of rejected.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:141-156][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:39-61]
- `F004`: still **untested**. No suite imports `session-prime.ts` or asserts the missing `workingSet` field against the live hook output path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:8-9][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:119-133]

### `F005`-`F008` (code-graph correctness)

- `F005` / `F008`: only **partially covered**. `code-graph-indexer.vitest.ts` checks top-level JS/TS extraction plus Python `method` containment, but it never asserts multiline JS/TS range fidelity or JS/TS method-node emission.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:77-146]
- `F006`: **untested**. No dedicated suite imports `seed-resolver.ts` or `code-graph-context.ts`, and no handler test asserts provider-typed seed identity survives the `code_graph_context` normalization path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:167-267][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-117]
- `F007`: only **partially covered**. `crash-recovery.vitest.ts` proves `cleanupOrphans()` works when called directly, but there is still no regression that exercises the missing incremental-scan callsite on the normal handler path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:925-973]

### `F009`-`F010` (security and validation)

- `F009`: **untested**. No suite asserts provenance fencing or prompt-injection separation for transcript-derived `Recovered Context` output.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:22-76][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:55-60]
- `F010`: only **partially covered**. `tool-input-schema.vitest.ts` verifies the validator in isolation, while `context-server.vitest.ts` explicitly asserts that the top-level dispatcher does not call `validateToolArgs()` itself. There is still no end-to-end regression proving that `code_graph_*` / `ccc_*` runtime calls are validated before handler execution.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:13-15][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1661-1669]

### `F011`-`F013` (budget / working set)

- `F011`: only **partially covered**. Allocator tests assert the current 4000-token contract, but they never exercise caller budgets above 4000, so the hard ceiling remains invisible to the suite.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:22-58]
- `F012`: only **partially covered**. Merger tests check aggregate token estimates and section presence, but they never assert truncation-marker budgeting or suppression of zero-budget sections.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:17-53]
- `F013`: **untested**. No suite imports `WorkingSetTracker`, so immediate `maxFiles` enforcement still has no regression harness.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:16-153]

### `F014`-`F019` (maintainability slice)

- `F014` / `F015` / `F016` / `F017`: all remain **untested or only indirectly implied**. Existing suites never drive DB-unavailable seed resolution, the dead per-file `TESTED_BY` branch, live `excludeGlobs` behavior, or the `.zsh` discovery mismatch end-to-end.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:40-73][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:83-239][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:315-340]
- `F018`: **untested** because it is a documentation / contract-ownership drift, not an executable runtime path.[SOURCE: CLAUDE.md:48-51][SOURCE: .claude/CLAUDE.md:5-18]
- `F019`: **covered as duplicate contracts rather than prevented**. `hooks-ux-feedback.vitest.ts` locks the hook-side token-count loop, and `envelope.vitest.ts` separately locks the shared envelope loop, so the suite protects both owners instead of forcing consolidation.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-130][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:251-300]

## New Maintainability Issue

### [P2] `F029` - hook/code-graph Vitest naming and import coverage overstate live entrypoint protection

- **Finding:** The current Vitest slice no longer maps cleanly to the live hook/code-graph entrypoints it is supposed to protect. Direct imports cover only four of the six `hooks/claude/*.ts` files and six of the ten `lib/code-graph/*.ts` files, while several hook-named suites now exercise helper modules instead of the scripts named in their titles.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:8-9][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:8-9][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:8][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:38-71][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71-170]
- **Evidence:** `hook-session-start.vitest.ts` imports `hook-state.js` and `shared.js`, then manually reads JSON state rather than importing `session-prime.ts`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:8-9][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:36-57] `hook-precompact.vitest.ts` likewise imports only `hook-state.js` and `shared.js`; the only direct `compact-inject.ts` imports live in `edge-cases.vitest.ts`, where the assertions are placeholders and do not execute the merged-context path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:8-9][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:11-24][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:136-239] On the code-graph side, no suite imports `code-graph-context.ts`, `seed-resolver.ts`, `index.ts`, or `working-set-tracker.ts`, even though current active findings still hinge on those files' live contracts.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-117][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:73-267][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:16-153]
- **Assessment:** This is a maintainability regression, not a new runtime defect. The suite still runs, but its filenames and helper-level assertions now materially overstate how much live entrypoint protection exists around the hook/code-graph behavior under review.
- **Severity:** P2

## Summary

- Direct hook-script import coverage is `4/6`, but only `3/6` of those files have meaningful behavior assertions against the live entrypoint contract.
- Direct code-graph import coverage is `6/10`; `code-graph-context.ts`, `seed-resolver.ts`, `index.ts`, and `working-set-tracker.ts` still have no dedicated regression harness.
- The current suite does **not** directly protect most `F001`-`F019` failure paths. The best-covered surfaces are helper layers (`hook-state.ts`, `shared.ts`, `claude-transcript.ts`, `budget-allocator.ts`, `compact-merger.ts`, `runtime-detection.ts`) rather than the live entrypoints and handler seams where the open findings still live.
- `F029` is added as a new P2 maintainability finding because the current test names and import map overstate live entrypoint protection.
