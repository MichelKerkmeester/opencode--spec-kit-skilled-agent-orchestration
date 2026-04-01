# Review Iteration 048
## Dimension: D4 Maintainability
## Focus: All new modules — test coverage gaps, dead code, import hygiene across all phases

## Findings

### [P1] F060 - No test files exist for 5 of the 7 new modules from phases 017-023
- Files: tree-sitter-parser.ts, ensure-ready.ts, context-metrics.ts, session-resume.ts, query-intent-classifier.ts
- Evidence: Searched for test files matching these modules — no dedicated test files found for:
  - tree-sitter-parser.ts (F039, still active from prior review)
  - ensure-ready.ts (Phase 019 auto-trigger — no tests)
  - context-metrics.ts (Phase 023 metrics — no tests)
  - session-resume.ts (Phase 020 composite tool — no tests)
  - All 5 Gemini hook files (Phase 022 — no tests)
  Only query-intent-classifier.ts appears to have some indirect coverage via handler tests.
- Fix: Add unit tests for at minimum: ensure-ready.ts (freshness detection), context-metrics.ts (quality scoring edge cases), and session-resume.ts (sub-call failure handling).

### [P2] F061 - ensure-ready.ts is not exported from code-graph/index.ts barrel
- File: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts
- Evidence: The barrel file exports all other code-graph modules but not ensure-ready.ts. Currently only consumed by direct imports from handlers (context.ts, query.ts, status.ts). This is fine for internal use but inconsistent with the pattern of re-exporting all modules from the barrel.
- Fix: Add `export * from './ensure-ready.js';` to index.ts for consistency. Or document the intentional omission.

### [P2] F062 - recordMetricEvent call sites are insufficient for accurate session quality scoring
- File: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:690-699
- Evidence: Only 4 call sites exist for recordMetricEvent:
  1. `tool_call` — every tool invocation (correct)
  2. `memory_recovery` — only for tools containing "memory_context" (misses session_resume)
  3. `code_graph_query` — only for tools containing "code_graph" (correct)
  4. `spec_folder_change` — only when args.specFolder is a string (correct)
  Missing: session_resume doesn't trigger memory_recovery event; Gemini hook priming doesn't trigger any metric; session_health tool call doesn't record itself.
- Fix: Add metric recording in session-resume.ts and consider adding metric hooks for hook-based priming events.

### [P2] F063 - Dead import: context-metrics.ts imports graphDb but only uses getStats()
- File: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:8
- Evidence: `import * as graphDb from '../code-graph/code-graph-db.js'` imports the entire module but only `graphDb.getStats()` is used in `computeGraphFreshness()`. This creates an unnecessary coupling and means the code-graph DB must be initialized before context-metrics can compute quality scores. If the DB isn't ready, `computeGraphFreshness` catches the error and returns 0.0, which is correct, but the star import is wasteful.
- Fix: Change to `import { getStats } from '../code-graph/code-graph-db.js'` for cleaner dependency.

## Verified Correct (Maintainability)
- tree-sitter-parser.ts: Imports RawCapture from structural-indexer.ts (F043 fixed — single source of truth)
- tree-sitter-parser.ts: Uses lazy initialization pattern (ensureInit) — appropriate for optional WASM dependency
- ensure-ready.ts: Clean separation between detection (detectState) and mutation (indexWithTimeout)
- context-metrics.ts: Simple module-level state is appropriate for in-memory-only metrics
- query-intent-classifier.ts: Keyword sets are well-organized by category
- session-resume.ts: Independent error handling for each sub-call — good failure isolation
- Gemini hooks: All reuse shared helpers from claude/shared.ts — minimal code duplication
- Gemini shared.ts: Clean interface definitions for GeminiHookInput and GeminiHookOutput

## Iteration Summary
- New findings: 4 (1 P1, 3 P2)
- Items verified correct: 8
- Reviewer: Claude Opus 4.6 (1M context)
