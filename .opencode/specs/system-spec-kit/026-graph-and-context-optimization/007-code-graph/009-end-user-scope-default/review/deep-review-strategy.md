# Deep Review Strategy v2 — 009 end-user-scope-default

## Charter

Run 2 of deep-review on the 009 packet. Run 1 converged at iter 6/10 with
2 P1 findings (precedence + symlink) — both remediated in FIX-009 commit
`79e97aec9`. Coverage gap: maintainability dimension never ran.

This run focuses on:
1. **Maintainability** dimension (4 iters) — close the coverage gap from run 1
2. **Regression sweep on FIX-009** (4 iters) — verify the 6 fixes hold up under
   adversarial review (precedence, symlink canonicalization, resource-map,
   error-msg relativization)
3. **Cross-cutting interaction** (2 iters) — env+per-call+symlink interaction
   matrix, fingerprint stability under scope-flip

## Lineage

- Run 1: sessionId `2026-05-02T12:34:30.068Z`, generation 1, converged at iter 6
- Run 2: sessionId `2026-05-02T14:00:34.910Z`, generation 2, parent = run 1
- Run 1 archive: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review_archive/run-001-converged-at-6-20260502T132458Z/`

## Run 1 closed findings (DO NOT re-flag unless evidence of regression)

- R1-P1-001 (precedence) → fixed: per-call boolean now overrides env
- R3-P1-001 (symlink) → fixed: `canonicalRootDir` flows into `getDefaultConfig`
- R1-P2-001, R2-P2-001, R4-P2-002 (resource-map drift) → fixed: §2 rewritten
- R4-P2-001 (abs path leakage) → fixed: `relativize()` helper applied to errors

## Dimension queue

1. maintainability
2. maintainability
3. maintainability
4. maintainability
5. correctness
6. security
7. security
8. traceability
9. correctness
10. security

## Scope files

- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md

## Spec docs (traceability anchors only — not in-scope for findings)

- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md

## Convergence

- Threshold: rolling avg newFindingsRatio ≤ 0.05
- Hard stop: iter ≥ 10
- Special: this run is post-fix verification — convergence at 0 findings is the desired outcome
  (means FIX-009 holds + maintainability is clean)

## Quality gates

- evidence: every P0/P1 needs file:line citation
- scope: findings within in-scope files
- coverage: all 4 dimensions reviewed
- regression: no FIX-009 finding re-emerges as identical claim
