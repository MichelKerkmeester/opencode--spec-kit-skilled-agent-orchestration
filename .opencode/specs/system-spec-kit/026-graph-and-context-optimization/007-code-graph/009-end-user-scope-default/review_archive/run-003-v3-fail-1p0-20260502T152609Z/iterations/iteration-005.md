## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:27-33`, `:65-73`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:35-60`, `:63-83`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:93-99`, `:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:248-265`, `:600-615`, `:855-900`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-304`, `:531-563`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`, `:1375-1448`, `:1451-1489`, `:2068-2195`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/utils/workspace-path.ts:21-30`, `:42-50`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-198`, `:207-240`, `:296-302`, `:317-340`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:171-175`, `:261-279`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:103-113`, `:268-339`, `:345-390`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:99-204`, `:266-379`, `:381-460`, `:486-512`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:59-120`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:1-1040` (env-isolation grep sweep: no scope-env mutation surface found)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:31-42`, `:155-168`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:31-40`, `:84-105`, `:161-177`

## Findings by Severity

### P0

No new P0 findings. The existing open run-3 P0 remains confirmed and continues to block PASS:

#### Existing open: RUN3-I2-P0-001 / RUN3-I3-P0-001 — REGRESSION: R2-I7-P0-001 — `data.errors` redaction can still leak a joined absolute path

- **claim:** `relativizeScanError()` still treats a colon-joined pair such as `/workspace/src/a.ts:/workspace/src/b.ts` as one path-like token, so one replacement can return `src/a.ts:/workspace/src/b.ts` and leave the second workspace absolute path in the serialized `data.errors` payload.
- **evidenceRefs:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:196-198`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:340`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:486-512`
- **counterevidenceSought:** Re-checked the current helper behavior with the same regex and relativization logic; it still outputs `src/a.ts:/workspace/src/b.ts` for a colon-joined two-path error string. Also verified the response path still maps `errors` through `relativizeScanError()` before serialization.
- **alternativeExplanation:** Colon can be a legal POSIX filename character, so not splitting on colon may be intentional for raw filesystem paths. However, this helper receives composed parser/persistence error strings, and the prior regression was specifically about preventing workspace absolute paths from reaching `data.errors`.
- **finalSeverity:** P0
- **confidence:** 0.90
- **downgradeTrigger:** Downgrade if all producers of `result.parseErrors` and persistence errors are proven unable to emit delimiter-joined absolute paths, or if `relativizeScanError()` is changed to redact each embedded absolute path independently.

### P1

None.

### P2

None.

## Closed-Finding Regression Check

- **R1-P1-001 (`includeSkills:false` precedence over env): PASS.** `resolveIndexScopePolicy()` still gives any boolean per-call value precedence over env (`index-scope-policy.ts:49-60`), the default config carries that policy into `scopePolicy` and skill excludes (`indexer-types.ts:140-166`), and tests cover explicit false over env true (`code-graph-indexer.vitest.ts:277-294`, `code-graph-scan.vitest.ts:293-319`).
- **R3-P1-001 (symlink rootDir bypass): PASS.** `handleCodeGraphScan()` canonicalizes workspace and root with `realpathSync()` through `canonicalizeWorkspacePaths()` before checking workspace containment (`workspace-path.ts:21-30`, `:42-50`; `scan.ts:207-235`). The canonical root is passed into `getDefaultConfig()` and then `indexFiles()` (`scan.ts:237-254`), and the structural indexer applies `shouldIndexForCodeGraph()` to full paths before glob-relative exclusion (`structural-indexer.ts:1292-1305`, `:1421-1424`).
- **Run-1 P2 invalid-root absolute path leakage: PASS.** Broken-root and out-of-workspace errors still serialize via `relativize()` (`scan.ts:211-235`) and tests assert workspace/outside absolute prefixes are absent (`code-graph-scan.vitest.ts:417-460`).
- **R2-I7-P0-001 (`data.errors` absolute path leak): FAIL remains open.** The single-path regression test exists (`code-graph-scan.vitest.ts:486-512`), but the helper still leaks a second absolute path in colon-joined error strings (`scan.ts:196-198`, `:340`).
- **R2-I9-P1-001 (status payload did not reflect per-call scope): PASS for the previously closed activeScope payload contract.** Status reconstructs `activeScope` from stored fingerprint/source before env fallback and emits the stored scan policy (`status.ts:171-175`, `:271-279`); the env-true plus per-call-false test confirms status reports `scan-argument` false and `scopeMismatch: false` (`code-graph-scan.vitest.ts:321-379`).
- **R2-I5-P1-001 (missing 6-case precedence matrix): PASS.** The matrix covers default, explicit true/false, env true, and env true overridden by explicit true/false (`code-graph-indexer.vitest.ts:277-294`). Fingerprints and labels are deterministic products of the resolved `includeSkills` boolean (`index-scope-policy.ts:35-46`), with representative default/env/per-call-false assertions around the matrix (`code-graph-indexer.vitest.ts:268-275`, `:297-332`).
- **R2-I4-P1-001 (env isolation): PASS.** Scope tests capture/delete/restore `CODE_GRAPH_INDEX_SKILLS_ENV` in `beforeEach`/`afterEach` (`code-graph-indexer.vitest.ts:103-113`, `code-graph-scan.vitest.ts:99-204`, `code-graph-scope-readiness.vitest.ts:59-70`), and the crash-recovery test sweep found no matching scope-env mutation surface.
- **Run-2 P2 centralization/docs updates: PASS.** The skill exclude/env literals are centralized in `index-scope-policy.ts` (`index-scope-policy.ts:5-10`) and both package docs list `index-scope-policy.ts` plus the end-user default scan scope (`code_graph/README.md:31-42`, `:155-168`; `code_graph/lib/README.md:84-105`, `:161-177`).

## Verdict — FAIL

FAIL — iteration 5 found no new correctness issues, but the existing run-3 P0 regression against closed finding R2-I7-P0-001 remains reproducible.

## Confidence — 0.90

High confidence because the core scope precedence, symlink, status-activeScope, and metadata flows are directly supported by implementation and tests; the only blocker is the already-open redaction regression reproduced from the current helper logic.
