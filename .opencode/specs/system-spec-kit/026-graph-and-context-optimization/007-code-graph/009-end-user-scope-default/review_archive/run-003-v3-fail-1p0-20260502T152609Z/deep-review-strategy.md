# Deep Review Strategy v3 — 009 end-user-scope-default

## Charter

Run 3 of deep-review on the 009 packet. **VERIFICATION SWEEP** to confirm
FIX-009-v2 (commit `03d873276`) introduced 0 regressions and properly closed
the issues found in run 2.

## Lineage

- Run 1: sessionId 2026-05-02T12:34:30.068Z, gen 1, converged at iter 6 — 2 P1 + 4 P2
- Run 2: sessionId 2026-05-02T14:00:34.910Z, gen 2, completed iter 10 — 2 P0 + 3 P1 + 5 P2
- Run 3: sessionId 2026-05-02T15:03:06.606Z, gen 3, parent = run 2

## V2 closed findings (DO NOT re-flag unless evidence of regression)

P0:
- R2-I7-P0-001: data.errors abs path leak → fixed at `scan.ts:340` via `relativizeScanError()`

P1:
- R2-I9-P1-001: status payload didn't reflect per-call → fixed at `status.ts:174` via `parseIndexScopePolicyFromFingerprint()`
- R2-I5-P1-001: missing 6-case precedence matrix → fixed in `code-graph-indexer.vitest.ts` via describe.each
- R2-I4-P1-001: env isolation → capture+restore applied to 3 test files

P2:
- R2-I1-P2-001: literal centralization → `CODE_GRAPH_SKILL_EXCLUDE_GLOBS` / `CODE_GRAPH_INDEX_SKILLS_ENV` constants
- R2-I2-P2-001: lib README updated with index-scope-policy.ts
- R2-I8-P2-001: ADR-001 6th sub-decision added

V1 closed findings (already verified clean in run 2 — DO NOT re-flag):
- R1-P1-001 (precedence): fixed
- R3-P1-001 (symlink): fixed
- R*-P2-* (resource-map drift, abs path in invalid-root errors): fixed

## Dimension queue (5 iters)

1. correctness
2. correctness
3. security
4. security
5. correctness

## Scope files

- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md

## Convergence

- Threshold: rolling avg newFindingsRatio ≤ 0.05
- Hard stop: iter ≥ 5
- IDEAL OUTCOME: 0 P0, 0 P1 — confirms FIX-009-v2 holds. P2 advisories acceptable.
