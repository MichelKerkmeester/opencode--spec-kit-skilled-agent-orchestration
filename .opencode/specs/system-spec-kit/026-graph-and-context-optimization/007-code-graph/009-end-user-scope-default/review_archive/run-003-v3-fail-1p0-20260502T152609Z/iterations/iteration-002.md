## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:27-33`, `:65-73`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:27-83`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:93-99`, `:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:248-265`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:192-198`, `:207-240`, `:296-302`, `:334-349`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:171-175`, `:261-279`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:103-113`, `:268-331`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:99-204`, `:266-379`, `:417-512`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:59-120`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:1-1040` (env-isolation grep sweep for `SPECKIT_CODE_GRAPH_INDEX_SKILLS` / `CODE_GRAPH_INDEX_SKILLS_ENV`: no matches)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:31-42`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:31-40`, `:84-105`

## Findings by Severity

### P0

#### RUN3-I2-P0-001 — REGRESSION: R2-I7-P0-001 — Colon-separated absolute paths can still leak through `data.errors`

- **claim:** `relativizeScanError()` still allows a workspace absolute path to remain in `data.errors` when one error string contains multiple absolute paths separated by a colon. The regex treats `/workspace/src/a.ts:/workspace/src/b.ts` as one match, relativizes it to `src/a.ts:/workspace/src/b.ts`, and leaves the second absolute path embedded in the returned error string.
- **evidenceRefs:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:196-198`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:340`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:486-512`
- **counterevidenceSought:** Verified comma-separated and parenthesized paths are split by the current delimiter class, and the existing regression test covers a single embedded workspace path. Also checked that scan errors are routed through `relativizeScanError()` before response emission.
- **alternativeExplanation:** A colon can be a legal POSIX filename character, so treating it as part of a path is defensible for raw filesystem paths. However, the helper is not receiving raw paths only; it is redacting human/parser error strings, and colon-separated paths are explicitly in this sweep's edge-case set.
- **finalSeverity:** P0
- **confidence:** 0.91
- **downgradeTrigger:** Downgrade if callers prove `parseErrors` and persistence errors can never contain colon-separated absolute paths or if the tokenizer is changed to split/redact each colon-separated absolute path independently before this payload is exposed.

### P1

None.

### P2

None.

## Closed-Finding Regression Check

- **R1-P1-001 (`includeSkills:false` precedence over env): PASS.** The policy resolver gives explicit per-call `includeSkills` precedence over env, and both the 6-case matrix plus scan handler tests cover false-over-env-true behavior (`index-scope-policy.ts:49-60`, `code-graph-indexer.vitest.ts:277-294`, `code-graph-scan.vitest.ts:293-319`).
- **R3-P1-001 (symlink rootDir bypass): PASS.** `handleCodeGraphScan()` canonicalizes workspace and root paths before the workspace-boundary check (`scan.ts:207-235`).
- **Run-1 P2 invalid-root absolute path leakage: PASS.** Invalid and out-of-workspace root errors use relative/basename output and have tests asserting the workspace/outside absolute paths are absent (`scan.ts:211-235`, `code-graph-scan.vitest.ts:417-460`).
- **R2-I7-P0-001 (`data.errors` absolute path leak): FAIL.** The single-path fix works for the covered test case, but colon-separated absolute paths are not fully redacted (`scan.ts:196-198`, `scan.ts:340`, `code-graph-scan.vitest.ts:486-512`).
- **R2-I9-P1-001 (status payload did not reflect per-call scope): PASS.** Status reconstructs `activeScope` from stored fingerprint/source before falling back to current env policy (`status.ts:171-175`, `status.ts:271-279`), and the scan/status regression test confirms env-true plus per-call false reports `scan-argument` false (`code-graph-scan.vitest.ts:321-379`).
- **R2-I5-P1-001 (missing 6-case precedence matrix): PASS.** The matrix now covers default, explicit true/false, env true, and env true overridden by explicit true/false (`code-graph-indexer.vitest.ts:277-294`).
- **R2-I4-P1-001 (env isolation): PASS.** The scoped test files either capture/delete/restore `CODE_GRAPH_INDEX_SKILLS_ENV` in `beforeEach`/`afterEach` or contain no matching env mutation (`code-graph-indexer.vitest.ts:103-113`, `code-graph-scan.vitest.ts:99-204`, `code-graph-scope-readiness.vitest.ts:59-70`, `crash-recovery.vitest.ts:1-1040` grep sweep).

`parseIndexScopePolicyFromFingerprint()` edge cases were also checked: unknown, empty, null, or malformed fingerprints return `null`, and status then falls back to `resolveIndexScopePolicy()` rather than throwing. Roundtrip fidelity is preserved when the stored `source` metadata accompanies the fingerprint (`index-scope-policy.ts:63-83`, `code-graph-db.ts:248-265`, `code-graph-scope-readiness.vitest.ts:74-91`).

## Verdict — FAIL

FAIL — one P0 regression remains because the `data.errors` redaction helper can still leak a workspace absolute path in colon-separated multi-path error strings.

## Confidence — 0.91

High confidence: the regression follows directly from the delimiter regex and was reproduced with the same replacement logic; the only uncertainty is whether production parser/persistence errors currently emit colon-separated absolute path pairs.
