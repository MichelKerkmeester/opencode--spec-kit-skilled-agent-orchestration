# Iteration 001: Correctness baseline for retired-surface rejection

## Focus
Correctness re-verification of retired `specs/**/memory/*.md` rejection, `shared_space_id` startup-drop semantics, and no regression from stale test/mock cleanup.

## Findings
No new P0, P1, or P2 findings.

## Closure Checks
- F001 remains closed: retired `specs/**/memory/*.md` paths are still rejected because `isMemoryFile()` only accepts canonical spec docs / constitutional memories, and `memory-save` hard-fails when that gate returns false. Coverage remains in both parser and indexing tests for legacy `/memory/` rejection. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:264] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:328]
- F002 baseline remains consistent on executable correctness: the spec and checklist both claim an every-startup, idempotent `dropDeprecatedSharedSpaceColumn()` call with silent fallback on unsupported SQLite, and the runtime still implements that behavior from `ensureGovernanceTables()`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/spec.md:65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/checklist.md:52] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1549]
- NF003 baseline remains closed in reviewed runtime surfaces: the active context-server and save-pipeline tests reflect the post-removal contract and do not reintroduce a retired shared-memory/shared-space seam. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:157] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:61]

## Ruled Out
- Legacy `/memory/` parsing support in `extractSpecFolder()` is not an active correctness bug in the reviewed save path because acceptance is still gated by `isMemoryFile()` and then re-checked by `memory-save`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:433] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083]
- The startup helper/comment remediation did not introduce an obvious destructive side effect: if `shared_space_id` is already absent the helper returns immediately, and if `DROP COLUMN` is unsupported it swallows the error and leaves the orphan column unused. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534]

## Dead Ends
- No scoped test file reviewed here explicitly simulates the older-SQLite `DROP COLUMN` failure branch, so that fallback was confirmed by direct code inspection rather than a dedicated test assertion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1542]

## Recommended Next Focus
Traceability sweep for F005/F002 across `spec.md`, `checklist.md`, the changelog, and the helper comment to confirm the story is aligned everywhere rather than only in executable behavior.
