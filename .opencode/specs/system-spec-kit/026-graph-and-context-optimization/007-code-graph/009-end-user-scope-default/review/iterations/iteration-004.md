## Dimension: maintainability

Iteration 4 focused on test brittleness around the new end-user scope default and FIX-009 remediation. I reviewed the in-scope test surfaces for snapshot/golden assertions, filesystem ordering dependencies, hardcoded absolute paths, process-wide env mutation, and pass-by-coincidence assertions.

## Files Reviewed (path:line list)

- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:80-115
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:248-310
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:312-370
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:370-445
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:988-1130
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:1-190
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:190-232
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:230-620
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:620-705
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:57-107
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:184-320
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:1-40
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:500-735
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:1-55
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1315
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1475
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:180-245
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:338-350
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:100-145
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:85-105
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:151-181
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:50-90
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-4
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-86
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-48

## Findings by Severity

### P0

None.

### P1

#### R2-I4-P1-001: Default-scope scan test inherits maintainer env opt-in and fails under documented shell state

- claim: `code-graph-scan.vitest.ts` has a default-scope assertion that assumes `SPECKIT_CODE_GRAPH_INDEX_SKILLS` is unset, but its `beforeEach` only resets mocks and never establishes or restores a known env baseline. The test calls `handleCodeGraphScan()` without `includeSkills`, while production policy intentionally falls back to `process.env` when the per-call argument is absent. Running the in-scope scan test with the documented maintainer env opt-in enabled makes the assertion at line 247 expect the default excluded fingerprint even though the SUT correctly resolves the env-enabled included fingerprint.
- evidenceRefs:
  - .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:98-147
  - .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:193-250
  - .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:233-234
  - .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-39
  - .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:172-180
- counterevidenceSought: I checked the explicit per-call false override test and it does set env true, pass `includeSkills: false`, and delete the env var in `finally`, so FIX-009's precedence path remains covered at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:280-309`. I also ran the affected scan/indexer tests with `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`; `code-graph-indexer.vitest.ts` passed, but `code-graph-scan.vitest.ts` failed exactly at the default-scope expectation on line 247. A separate `code-graph-scope-readiness.vitest.ts` env-enabled run passed, so this is not a blanket failure across all tests.
- alternativeExplanation: The suite may have implicitly assumed test runners never inherit the maintainer opt-in env. That assumption is weak because the accepted decision explicitly documents the missing-argument-plus-env-true contract and states tests can cover true/false overrides without mutating process-wide defaults.
- finalSeverity: P1
- confidence: 0.92
- downgradeTrigger: Downgrade to P2 only if project policy explicitly says the test suite is unsupported when `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` is present in the caller environment and all documented test commands clear that env before running.

### P2

None.

## Traceability Checks

- spec_code: CONDITIONAL. The production code matches ADR-002 precedence (`includeSkills` boolean overrides env, missing value reads env), but one default-scope test does not isolate that contract from the caller environment.
- checklist_evidence: CONDITIONAL. CHK-032's deny-by-default behavior is covered, but the test evidence is brittle under the documented maintainer opt-in flag.
- skill_agent: PASS. This iteration stayed LEAF-only, read state first, reviewed only in-scope files plus traceability docs, and wrote findings to review artifacts.
- feature_catalog_code: PASS. No snapshot/golden-file drift or filesystem-order dependency was found in the in-scope test surfaces.

## Run-1 Regression Check (state which closed finding(s) you re-verified, with PASS/FAIL)

- R1-P1-001 precedence fix: PASS. `resolveIndexScopePolicy()` uses the per-call boolean when present, and the explicit false-over-env test still covers that path; the new finding is test isolation for missing-argument default assertions, not a regression of the production precedence fix.
- R3-P1-001 symlink rootDir bypass: PASS. The scan handler canonicalizes root/workspace paths before policy/config creation, and the symlink exclusion test asserts canonicalized skill roots stay excluded.
- R4-P2-001 absolute path leakage: PASS. The invalid-root and warning tests assert workspace prefixes are not exposed.
- R1-P2-001/R2-P2-001/R4-P2-002 resource-map drift: PASS. The resource map lists the modified test and code surfaces used by this review.

## Verdict -- CONDITIONAL

CONDITIONAL: one P1 test-isolation issue can make the in-scope scan tests fail under the documented maintainer env opt-in, even though FIX-009 production precedence still holds.

## Next Dimension

Correctness.
