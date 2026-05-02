## Dimension: correctness

Iteration 5 focused on the FIX-009 precedence remediation for `includeSkills` versus `SPECKIT_CODE_GRAPH_INDEX_SKILLS`. Production policy still honors an explicit per-call boolean, including `false`, over the env opt-in. The remaining correctness gap is required regression-test coverage in `code-graph-indexer.vitest.ts`: the suite does not enumerate the full six-case matrix requested for this post-fix verification pass.

## Files Reviewed (path:line list)

- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-39
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:41-50
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-166
- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:56-65
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:26-34
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:233-236
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:615-622
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:248-309
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:253-309
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:252-264
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:258-264
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:119-128
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:98-107
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:162-181
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:84-98
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:50-87
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-5
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-56
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-004.md:41-54

## Findings by Severity

### P0

None.

### P1

#### R2-I5-P1-001: `code-graph-indexer` regression tests do not cover the full six-case scope precedence matrix

- claim: `resolveIndexScopePolicy()` now implements the FIX-009 precedence rule correctly, but the required regression coverage is incomplete in `code-graph-indexer.vitest.ts`. The focused indexer block covers default/missing-arg behavior, env-enabled missing-arg behavior, one per-call true case with env false, and explicit false over env true; it does not cover `(env=undef, includeSkills=false)` or `(env=true, includeSkills=true)` in `code-graph-indexer.vitest.ts`, even though this review pass requires all six combinations there and classifies missing coverage as P1. The missing true-over-env-true case matters because source semantics should still be `scan-argument` when the env also enables skills, not `env`.
- evidenceRefs:
  - .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:257-300
  - .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-39
  - .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:168-180
  - .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:100-106
- counterevidenceSought: I searched all in-scope `mcp_server` files for `resolveIndexScopePolicy`, `includeSkills`, and `SPECKIT_CODE_GRAPH_INDEX_SKILLS`. `code-graph-scan.vitest.ts` has integration coverage for one-call opt-in and explicit false over env true, and `tool-input-schema.vitest.ts` checks non-boolean rejection, but I found no `code-graph-indexer.vitest.ts` assertion for env-undefined plus explicit false or env-true plus explicit true. The production resolver itself uses `typeof input.includeSkills === 'boolean'`, so this finding is test coverage, not a behavior regression.
- alternativeExplanation: The scan handler integration tests may have been considered sufficient because they exercise the handler-to-indexer path. That does not satisfy the stated regression requirement for `code-graph-indexer.vitest.ts` to cover all six precedence combinations, and it leaves the source-label semantics for env-true plus explicit true unpinned at the unit level.
- finalSeverity: P1
- confidence: 0.91
- downgradeTrigger: Downgrade to P2 only if the review contract is amended to allow handler-level integration coverage to replace the explicitly requested six-case `code-graph-indexer.vitest.ts` matrix.

### P2

None.

## Traceability Checks

- spec_code: CONDITIONAL. Production code matches ADR-002: an explicit boolean `includeSkills` wins over env, missing values fall back to env/default, and explicit `false` is labeled `scan-argument`. Required regression coverage in `code-graph-indexer.vitest.ts` is incomplete.
- checklist_evidence: CONDITIONAL. CHK-032 and the plan's default/opt-in test requirement are supported for the primary paths, but the six-case precedence matrix is not fully pinned in the required unit test surface.
- skill_agent: PASS. This iteration stayed LEAF-only, read state first, reviewed only in-scope implementation/test files plus traceability docs, and wrote findings to review artifacts.
- feature_catalog_code: PASS. The reviewed source-field and tool-schema behavior matches the documented skill surface; `includeSkills` is a boolean optional input and explicit per-call values are surfaced as scan arguments.
- includeSkills_null_edge: PASS. Runtime schema uses `z.boolean().optional()` for `includeSkills`, while the resolver defensively treats only actual booleans as per-call values; `null` is not accepted as a production scan argument.
- source_field_semantics: PASS. `source: "scan-argument"` is the correct label for explicit `false` because the scan argument, not env/default, selected the policy.

## Run-1 Regression Check (state which closed finding(s) you re-verified, with PASS/FAIL)

- R1-P1-001 precedence fix: PASS. `resolveIndexScopePolicy()` uses `typeof input.includeSkills === "boolean"` to distinguish missing input from explicit `false`, and the scan handler passes the resolved policy into `getDefaultConfig()`. No production regression was found; the new P1 is missing regression-test matrix coverage.

## Verdict -- CONDITIONAL

CONDITIONAL: FIX-009 production precedence holds, but the required six-case `code-graph-indexer.vitest.ts` regression matrix is incomplete.

## Next Dimension

Security.
