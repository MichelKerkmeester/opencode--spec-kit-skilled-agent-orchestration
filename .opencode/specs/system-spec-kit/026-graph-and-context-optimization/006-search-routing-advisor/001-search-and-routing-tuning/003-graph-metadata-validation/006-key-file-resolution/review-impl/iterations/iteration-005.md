# Iteration 005 - Correctness

## Verification

- Scoped vitest: PASS, 22 tests.
- Git log: checked for both audited files.

## Findings

No new correctness findings beyond DRI-001.

Rechecked the current-schema path:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929` derives current key files from docs.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:940` routes current candidates through `resolveKeyFileCandidate(...)`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942` deduplicates and caps resolved output.

The active correctness gap remains isolated to legacy fallback parity.

## Delta

New findings: 0. Registry total: P0=0, P1=3, P2=1.
