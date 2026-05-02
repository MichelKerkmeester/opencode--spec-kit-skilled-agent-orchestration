# Deep Review Strategy — 009 end-user-scope-default

## Review Charter

Review the IMPLEMENTATION work shipped in the 009 packet — the code/test/doc changes that
altered code-graph default scoping behavior. NOT a review of the spec docs themselves
(those exist as traceability anchors only).

## Target

- Type: spec-folder (implementation review)
- Spec: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default`

## Review Dimensions (queue across 10 iters)

1. correctness
2. correctness
3. security
4. security
5. traceability
6. traceability
7. maintainability
8. maintainability
9. correctness
10. security

## Scope Files (in-scope for findings)

- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
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
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md

## Spec Docs (traceability anchors, NOT in-scope for findings)

- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md

## Cross-Reference Targets

- Core: spec_code, checklist_evidence
- Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## Known Context

- Resource map present: true
- 009 packet implementation completed at 2026-05-02T12:16:54Z (10m 19s wall-clock)
- All 22 CHK-G* gates marked done with evidence
- Performance baseline: files 1619→48 (-97%), nodes 34850→646 (-98%), edges 16530→1231 (-93%)
- 5 open decisions in plan.md resolved with default recommendations during impl
- Sibling 008 + sentinel 003 regressions clean post-impl

## Convergence

- Threshold: newFindingsRatio rolling avg ≤ 0.05
- Hard stop: iteration_count ≥ 10
- All-clean stop: 0 P0/P1, all dimensions covered, ≥1 coverage_age

## Quality Gates

- evidence: every P0/P1 needs file:line citation
- scope: findings within in-scope files (or flagged as cross-cut)
- coverage: all 4 dimensions reviewed at least once
