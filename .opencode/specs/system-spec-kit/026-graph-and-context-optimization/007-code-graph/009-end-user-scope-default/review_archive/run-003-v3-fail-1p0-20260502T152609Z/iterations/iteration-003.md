## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:27-33`, `:65-73`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:27-83`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:80-90`, `:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:248-265`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-198`, `:207-238`, `:296-302`, `:334-340`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:171-175`, `:261-279`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:103-113`, `:268-332`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:99-204`, `:293-379`, `:417-512`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:59-70`, `:73-120`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:1-1040` (env-isolation grep sweep for `SPECKIT_CODE_GRAPH_INDEX_SKILLS` / `CODE_GRAPH_INDEX_SKILLS_ENV`: no matches)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:31-42`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:31-40`, `:84-105`

## Findings by Severity

### P0

#### RUN3-I3-P0-001 — REGRESSION: R2-I7-P0-001 — scan-error redaction can still leak workspace absolute paths when path-like tokens contain non-excluded delimiters

- **claim:** `relativizeScanError()` still does not reliably remove workspace absolute paths from `data.errors`. The tokenizer treats `/workspace/src/a.ts:/workspace/src/b.ts` and `/workspace/src/a.ts\0/workspace/src/b.ts` as one path-like match, calls `relativize()` once, and can return `src/a.ts:/workspace/src/b.ts` or `src/a.ts\0/workspace/src/b.ts`, leaving the second absolute path in the exposed payload.
- **evidenceRefs:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:196-198`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:340`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:486-512`
- **counterevidenceSought:** Reproduced the same replacement logic against adversarial strings. Long all-matching input completed in linear time (1 MB in ~19 ms), newline-separated paths were individually relativized, and paths containing whitespace or brackets did not retain the workspace root. The existing regression test covers one embedded absolute path but not colon, NUL, quote, bracket, or whitespace variants.
- **alternativeExplanation:** A colon can be a legal POSIX filename character, and NUL cannot be a real filesystem path character. However, this helper is redacting human/parser error strings, not only validated filesystem path inputs; parser or persistence error text can concatenate multiple absolute paths with delimiters before `data.errors` is serialized.
- **finalSeverity:** P0
- **confidence:** 0.90
- **downgradeTrigger:** Downgrade if all producers of `errors` prove they never include colon-delimited, NUL-delimited, or otherwise joined absolute paths, or if `relativizeScanError()` is changed to independently redact every absolute-path segment before response serialization.

### P1

None.

### P2

None.

## Closed-Finding Regression Check

- **R1-P1-001 (`includeSkills:false` precedence over env): PASS.** Explicit per-call `includeSkills` still wins over env input, and the six-case matrix plus scan-handler coverage include false-over-env-true behavior (`index-scope-policy.ts:49-60`, `code-graph-indexer.vitest.ts:277-294`, `code-graph-scan.vitest.ts:293-319`).
- **R3-P1-001 (symlink rootDir bypass): PASS.** `handleCodeGraphScan()` canonicalizes workspace and root paths through `canonicalizeWorkspacePaths()` before applying the workspace-boundary check (`scan.ts:207-235`).
- **Run-1 P2 invalid-root absolute path leakage: PASS.** Broken and out-of-workspace root errors use `relativize()` and have tests asserting workspace/outside absolute paths are absent (`scan.ts:211-235`, `code-graph-scan.vitest.ts:417-460`).
- **R2-I7-P0-001 (`data.errors` absolute path leak): FAIL.** The single-path case is covered, but `relativizeScanError()` can still leak a second workspace absolute path when an error string contains joined path-like tokens separated by colon or NUL (`scan.ts:196-198`, `scan.ts:340`, `code-graph-scan.vitest.ts:486-512`).
- **R2-I9-P1-001 (status payload did not reflect per-call scope): PASS.** Status reconstructs `activeScope` from stored fingerprint/source before falling back to current env policy, then emits that scope in the payload (`status.ts:171-175`, `status.ts:271-279`).
- **R2-I5-P1-001 (missing 6-case precedence matrix): PASS.** The matrix covers default, explicit true/false, env true, and env true overridden by explicit true/false (`code-graph-indexer.vitest.ts:277-294`).
- **R2-I4-P1-001 (env isolation): PASS.** The scoped test files capture/delete/restore `CODE_GRAPH_INDEX_SKILLS_ENV` or contain no matching env mutation (`code-graph-indexer.vitest.ts:103-113`, `code-graph-scan.vitest.ts:99-204`, `code-graph-scope-readiness.vitest.ts:59-70`, `crash-recovery.vitest.ts:1-1040` grep sweep).

## Verdict — FAIL

FAIL — one P0 regression remains because the `data.errors` redaction helper can still expose workspace absolute paths in delimiter-joined error strings.

## Confidence — 0.90

High confidence: the leak is directly reproducible from the current regex and `relativize()` behavior, while ReDoS and the requested whitespace/bracket/newline cases did not reproduce as leaks.
