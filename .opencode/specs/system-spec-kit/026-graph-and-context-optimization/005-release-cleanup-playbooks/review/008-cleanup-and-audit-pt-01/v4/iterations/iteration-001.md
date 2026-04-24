# Iteration 001: Correctness baseline for retired-surface rejection

## Focus
Correctness review of runtime retired-memory-surface rejection, the `dropDeprecatedSharedSpaceColumn()` helper, and nearby regression coverage.

## Findings
No new P0, P1, or P2 findings.

## Closure Checks
- Runtime ingest still rejects non-canonical spec packet artifacts because `memory-save` validates the path first and throws unless `memoryParser.isMemoryFile()` accepts it as a canonical spec document or constitutional memory. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083]
- The parser whitelist still excludes retired `specs/**/memory/*.md` paths by requiring recognized spec-document basenames under canonical spec-document paths only. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:963] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:975]
- Regression tests still assert retired packet paths are rejected, including `.opencode/specs/.../memory/notes.md`, `.opencode/specs/.../memory/spec.md`, and `specs/.../memory/session.md`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:266] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:286] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:329]
- The `dropDeprecatedSharedSpaceColumn()` remediation is comment-only for behavior: the helper still returns when the table or column is absent and still swallows `DROP COLUMN` failures on older SQLite. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1539] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1542]

## Ruled Out
- The v4 comment added above `dropDeprecatedSharedSpaceColumn()` did not introduce a runtime behavior change; the executable body remains idempotent and unchanged in effect. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1538]

## Dead Ends
- `context-server.vitest.ts` contains runtime bootstrap and response-hint mocks, but this pass found no active correctness drift tied to the retired `findMemoryFiles` mock path removal. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1092]

## Recommended Next Focus
Traceability pass for F005: align `spec.md`, `checklist.md`, changelog wording, and the helper comment around the same every-startup idempotent semantics.
