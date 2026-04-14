# Iteration 007: Security pass on retired-path trust boundaries

## Focus
Security review of the runtime trust boundary around retired-memory path rejection, path validation, and canonical-source filtering.

## Findings
No new P0, P1, or P2 findings.

## Closure Checks
- Local file-path validation still rejects paths outside allowed roots, explicit `..` traversal, and null-byte attempts before downstream handlers act on the path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:122] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:97] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:122]
- Search-result classification still drops non-canonical document types and only returns canonical spec-document rows when the normalized path can be classified as a spec document. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:231] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:242] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:247]
- Save-pipeline tests still reject non-memory-file paths and traversal attempts, so the remediation did not introduce a new path-acceptance or trust-boundary gap. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:391] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:397] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1112] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1114]

## Ruled Out
- The documentation drift found in earlier iterations does not correspond to a security regression in runtime path acceptance; the code still rejects traversal and non-canonical sources.

## Dead Ends
- This pass surfaced a likely stale test comment in `memory-save-pipeline-enforcement.vitest.ts`, but that is maintainability drift rather than a security vulnerability.

## Recommended Next Focus
Maintainability pass: inspect stale comments, dead mocks, and orphan tests around the save pipeline and `context-server.vitest.ts`, starting with the suspicious test comment surfaced here.
