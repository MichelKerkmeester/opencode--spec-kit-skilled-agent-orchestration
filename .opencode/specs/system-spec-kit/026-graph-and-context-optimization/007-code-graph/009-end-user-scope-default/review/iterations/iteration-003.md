## Dimension: correctness

Cross-cutting verification sweep for FIX-009-v3 found no correctness regressions. The split-then-relativize implementation tokenizes absolute-path-bearing messages with a captured delimiter regex, relativizes every segment that starts with `/`, and rejoins delimiters unchanged, so colon/NUL/quote/bracket/mixed multi-path messages no longer leave a second absolute path behind.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`

## Findings (P0/P1/P2 - say "None." if empty)

None.

## Closed-Finding Regression Check

- PASS - R1-P1-001 (precedence): per-call `includeSkills` still wins over the env setting. `resolveIndexScopePolicy()` treats any boolean `input.includeSkills` as `scan-argument` source and only falls back to `SPECKIT_CODE_GRAPH_INDEX_SKILLS` when the per-call value is absent; the scan regression test asserts `includeSkills: false` overrides an env opt-in.
- PASS - R3-P1-001 (symlink): canonical root flow still holds. `handleCodeGraphScan()` canonicalizes the requested root, verifies it is within the canonical workspace, then passes `canonicalRootDir` into `getDefaultConfig()` and uses it as the git cwd; the symlink regression test asserts the indexer receives the canonical skill-root path.
- PASS - R2-I7-P0-001 (data.errors leak): single-path and multi-path error sanitization still hold. Scan results map `data.errors` through `relativizeScanError()`, the single-path parse-error regression asserts no workspace or `/Users/` prefix leaks, and the six-case multi-path matrix now covers colon, NUL, quote, bracket, mixed-delimiter, and no-absolute-path cases.
- PASS - R2-I9-P1-001 (status payload): status still reads active scope from the stored fingerprint first. `handleCodeGraphStatus()` derives `activeScopePolicy` from `parseIndexScopePolicyFromFingerprint(storedScope) ?? resolveIndexScopePolicy()`, then emits `activeScope` from that policy; the status regression test asserts the stored scan-argument scope remains active after an env override scan.
- PASS - R2-I5-P1-001 (6-case matrix): all six `relativizeScanError` matrix cases are present and covered by the focused `code_graph/tests` Vitest run.
- PASS - R2-I4-P1-001 (env isolation): the scan test suite still captures `SPECKIT_CODE_GRAPH_INDEX_SKILLS` in `beforeEach`, deletes it for isolation, and restores or deletes it in `afterEach`.

Focused verification: `./node_modules/.bin/vitest run code_graph/tests --config vitest.config.ts --reporter=dot` passed with 19 test files and 230 tests.

## Verdict - PASS / CONDITIONAL / FAIL

PASS.

## Confidence - 0.0-1.0

0.94
