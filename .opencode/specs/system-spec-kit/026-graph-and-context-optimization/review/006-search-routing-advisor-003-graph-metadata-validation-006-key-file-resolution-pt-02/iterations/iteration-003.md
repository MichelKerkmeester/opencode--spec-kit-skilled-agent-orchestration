# Iteration 003 - Robustness

## Verification

- Scoped vitest: PASS, 22 tests.
- Git log: checked for both audited files.

## Findings

### DRI-003 - P2 Robustness - Resolution work is unbounded before the 20-item key_files cap

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929` starts `deriveKeyFiles(...)`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938` merges preferred refs, fallback refs, and packet docs before any cap.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:940` resolves every merged candidate.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942` applies the 20-item cap only after filesystem resolution.

Expected: the resolver should bound candidate work before synchronous filesystem probes, or at least cap a safe multiple of the output size.

Actual: docs with a large number of backticked path-like strings can force synchronous resolution for all candidates even though no more than 20 can be emitted.

## Delta

New findings: 1. Registry total: P0=0, P1=2, P2=1.
