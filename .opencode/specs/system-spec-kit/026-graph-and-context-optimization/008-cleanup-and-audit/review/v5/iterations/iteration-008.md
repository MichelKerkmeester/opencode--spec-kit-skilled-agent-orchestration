# Iteration 008: Security re-verification of save/index boundaries

## Focus
Security re-verification of save/index trust boundaries, retired-path rejection, and deprecated-column handling while convergence remained blocked by active documentation drift.

## Findings
No new P0, P1, or P2 findings.

## Closure Checks
- `memory-save` still fails closed: it validates the caller path against allowed bases before DB use, then rejects anything that is not a canonical spec document or constitutional memory. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:122] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083]
- Retired `specs/**/memory/*.md` paths remain excluded from admission because `isMemoryFile()` only accepts canonical spec-doc basenames outside working-artifact paths plus constitutional docs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:962] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:975]
- `memory-index` still constrains discovery to fixed workspace-root scans of constitutional files, canonical spec documents, and graph metadata, and its operator hint text matches that restricted contract. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:211] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:214] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:215] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:327]
- Regression tests still cover the retired-surface rejection boundary: legacy `/memory/` files return false from `isMemoryFile()`, and non-canonical save targets are rejected before pipeline admission. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:265] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:285] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:391] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:396]
- The deprecated `shared_space_id` cleanup remains fail-safe: startup drops the column when supported and otherwise leaves an unread orphan rather than reviving the old field. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1541] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1543] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1545]

## Ruled Out
- `extractSpecFolder()` still understands legacy `/memory/` layouts, but the reviewed save/index entry points gate on `isMemoryFile()` and fixed scanner sources, so that compatibility path is not an active trust-boundary bypass in this slice. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:433] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:455] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213]
- No new path-expansion regression appeared in validator hardening; raw `..` segments are rejected after shared path validation rather than normalized through. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:123] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:128]

## Dead Ends
- `context-server.vitest` confirms graph-path hardening only by source-text expectations; the underlying implementation file was outside this pass's scope, so this iteration could not independently re-audit that helper logic. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:274]

## Recommended Next Focus
Finish with a maintainability sweep so the final verdict can separate blocker-level contract drift from stale comments, dead refs, and orphaned verification surfaces.
