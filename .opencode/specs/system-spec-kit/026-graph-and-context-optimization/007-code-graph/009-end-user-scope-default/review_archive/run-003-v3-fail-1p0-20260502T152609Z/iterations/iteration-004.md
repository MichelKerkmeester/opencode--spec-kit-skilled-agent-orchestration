## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:27-33`, `:65-73`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:27-83`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:59-64`, `:115-118`, `:219-232`, `:248-265`, `:600-615`, `:855-900`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-198`, `:207-238`, `:296-302`, `:317-340`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:171-175`, `:188-218`, `:261-299`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:268-332`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:321-379`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:73-120`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:1-1040` (scope/status/env grep sweep: no matching status-scope surface)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:250-278`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:31-40`

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Closed-Finding Regression Check

- **R1-P1-001 (`includeSkills:false` precedence over env): PASS.** Per-call `includeSkills` still determines `source: "scan-argument"` and wins over env state (`index-scope-policy.ts:49-60`), with the six-case matrix covering explicit false over env true (`code-graph-indexer.vitest.ts:277-294`, `:322-332`).
- **R3-P1-001 (symlink rootDir bypass): PASS.** Scan still canonicalizes root/workspace paths before checking workspace containment (`scan.ts:207-235`).
- **Run-1 P2 invalid-root absolute path leakage: PASS for the reviewed path.** Invalid/broken root and out-of-workspace root errors still pass through `relativize()` before serialization (`scan.ts:211-235`).
- **R2-I7-P0-001 (`data.errors` absolute path leak): FAIL remains open via existing `RUN3-I3-P0-001`; not re-emitted as a new iteration-4 finding.** The scan-error helper and response mapping are unchanged at the previously cited surface (`scan.ts:196-198`, `:340`).
- **R2-I9-P1-001 (status payload did not reflect per-call scope): PASS.** Status reconstructs `activeScope` from the stored fingerprint/source before falling back to env/default policy (`status.ts:171-175`), and emits only `fingerprint`, enumerated `label`, `includeSkills`, and `source` for `activeScope` (`status.ts:271-276`).
- **R2-I5-P1-001 (missing 6-case precedence matrix): PASS.** The matrix still covers default, explicit true/false, env true, and env true overridden by explicit true/false (`code-graph-indexer.vitest.ts:277-294`).
- **R2-I4-P1-001 (env isolation): PASS for scope/status regression exposure.** The status-scope scan did not find additional `SPECKIT_CODE_GRAPH_INDEX_SKILLS` mutations in `crash-recovery.vitest.ts`, and scope behavior tests exercise policy inputs without relying on process env for the matrix (`code-graph-indexer.vitest.ts:277-294`).

## Verdict — FAIL

FAIL — iteration 4 found no new status/parser security findings, but the run still has the open `RUN3-I3-P0-001` regression against the closed R2 scan-error leak.

## Confidence — 0.86

High confidence for the status-scope surface: fingerprint parsing uses exact string equality and source enumeration, `activeScope` is rebuilt from canonical policy labels, and `excludedTrackedFiles` exposes only an aggregate count; moderate residual uncertainty is limited to the already-open scan-error regression outside this iteration's primary status focus.
