## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`: 5-10, 27-38, 65-74
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`: 5-12, 49-61, 63-84
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`: 79-100
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`: 11-19, 248-265
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`: 196-198, 207-231, 237-240, 263-303, 334-350
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`: 162-175, 261-280
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`: 50-56, 103-112, 259-295, 311-331
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts`: 99-104, 198-202, 293-319, 321-379, 381-461, 486-512
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts`: 27-28, 59-70, 73-120
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts`: searched for scope env mutation terms; no `CODE_GRAPH_INDEX_SKILLS_ENV` or `process.env` scope-policy matches.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md`: 36-42, 82-102
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md`: 35-40, 84-105

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Closed-Finding Regression Check

- PASS — R2-I7-P0-001 (`data.errors` absolute path leak): scan error construction now relativizes persistence exceptions and parse errors before pushing (`scan.ts:296-302`) and applies a final `relativizeScanError()` pass to all response errors (`scan.ts:340`). The regression test uses a parse-error result whose `filePath` and `parseErrors` both contain the absolute broken-file path, then asserts `payload.data.errors[0]` contains only `mcp_server/broken.ts` and not the workspace, `process.cwd()`, or `/Users/` (`code-graph-scan.vitest.ts:486-512`). A focused grep found no remaining `result.filePath` use in response error construction outside the relativized branches.
- PASS — R2-I9-P1-001 (status payload per-call override): `handleCodeGraphStatus()` derives `activeScopePolicy` from `graphDb.getStoredCodeGraphScope()` via `parseIndexScopePolicyFromFingerprint(storedScope)` before falling back to ambient env resolution (`status.ts:173-175`), and serializes that policy into `data.activeScope` (`status.ts:271-276`). The regression test sets env opt-in true, scans with `includeSkills:false`, feeds the stored scan policy into status, and asserts `activeScope.includeSkills === false`, `source === "scan-argument"`, `storedScope === activeScope`, and `scopeMismatch === false` (`code-graph-scan.vitest.ts:321-379`).
- PASS — R2-I5-P1-001 (6-case precedence matrix): the matrix includes all six combinations for env absent/present and includeSkills absent/true/false, including the required env true plus includeSkills false row mapping to `false, "scan-argument"` (`code-graph-indexer.vitest.ts:277-294`).
- PASS — R2-I4-P1-001 (test env isolation for reviewed scope files): the relevant code graph tests capture and restore `CODE_GRAPH_INDEX_SKILLS_ENV` around tests that mutate it (`code-graph-indexer.vitest.ts:50-56,103-112`; `code-graph-scan.vitest.ts:99-104,198-202`; `code-graph-scope-readiness.vitest.ts:27-28,59-70`). `crash-recovery.vitest.ts` has no scope-policy env mutation matches in this sweep.
- PASS — R1-P1-001 (`includeSkills:false` precedence over env): `resolveIndexScopePolicy()` treats any boolean `includeSkills` as a per-call value before consulting env (`index-scope-policy.ts:49-61`), and the scan regression asserts env true plus `includeSkills:false` still indexes with `includeSkills:false`, `source:"scan-argument"`, and skill exclusion globs (`code-graph-scan.vitest.ts:293-319`).
- PASS — R3-P1-001 (symlink rootDir bypass): scan canonicalizes the workspace/rootDir pair with realpath-derived canonical paths before the workspace-boundary check (`scan.ts:207-231`) and passes the canonical root into indexing/git operations (`code-graph-scan.vitest.ts:381-415`).
- PASS — Run-1 P2 invalid-root absolute path cleanup: invalid and out-of-workspace rootDir errors use relativized/basename surfaces (`scan.ts:211-231`) and tests assert the workspace/outside absolute prefixes are absent (`code-graph-scan.vitest.ts:417-461`).
- PASS — Run-2 P2 documentation/literal follow-ups relevant to correctness scope: shared constants are centralized in `index-scope-policy.ts` (`index-scope-policy.ts:5-10`), and the code graph docs describe default end-user scans and list `index-scope-policy.ts` in the lib topology (`code_graph/README.md:36-42`; `code_graph/lib/README.md:84-105`).

Focused validation also passed for the three regression test files: `code-graph-indexer.vitest.ts`, `code-graph-scan.vitest.ts`, and `code-graph-scope-readiness.vitest.ts` (68 tests).

## Verdict — PASS

PASS — correctness verification found no P0/P1/P2 regressions in FIX-009-v2.

## Confidence — 0.94

High confidence: the sweep covered the exact code paths and regression tests named in the prompt, confirmed the relevant tests pass, and searched for residual unrelativized scan error construction.
