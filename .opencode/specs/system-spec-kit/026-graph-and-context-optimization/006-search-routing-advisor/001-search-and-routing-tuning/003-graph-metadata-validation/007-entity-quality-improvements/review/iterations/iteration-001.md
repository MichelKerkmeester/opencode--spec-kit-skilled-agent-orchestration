# Iteration 001 - Correctness

Focus: correctness.

Files reviewed:
- `spec.md`
- `implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| DR-COR-001 | P2 | External canonical-doc filtering can overmatch non-spec support docs by suffix. The skip path does not first prove the candidate is under a specs root. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:845`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:848`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:885` |
| DR-COR-002 | P2 | Runtime-name coverage is narrower than the requirement list. The implementation includes nine names, but the focused test asserts only three directly. | `spec.md:24`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:54`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:64`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:521` |

## P0 Self-Check

No P0 findings. The implementation satisfies the headline behavior: cap is 24, current-folder scope tests exist, and runtime names are rejected in code.

## Convergence

New findings ratio: `0.18`. Continue; only one dimension covered.
