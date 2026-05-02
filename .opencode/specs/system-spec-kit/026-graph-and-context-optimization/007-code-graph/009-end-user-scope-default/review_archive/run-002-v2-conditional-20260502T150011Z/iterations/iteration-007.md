## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:124-135`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-194`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:197-235`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:285-297`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:328-344`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:159-215`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:299-334`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-50`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:56-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:79-90`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1219-1242`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1375-1448`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1487`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1556-1580`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2058-2105`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:348-414`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:465-540`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:119-128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:85-98`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:162-181`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-7`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-63`

## Findings by Severity

### P0

#### R2-I7-P0-001 — REGRESSION: R4-P2-001 scan `data.errors` still expose absolute indexed file paths

- **Claim:** FIX-009 redacts invalid-`rootDir` errors and scan warnings, but the successful `code_graph_scan` payload can still leak absolute workspace file paths through `data.errors` whenever persistence or parser errors occur.
- **EvidenceRefs:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:285-297`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:328-344`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1375-1448`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1219-1242`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:348-414`
- **Evidence:** `handleCodeGraphScan()` builds `errors` with raw `${result.filePath}: ...` for both persistence failures and parse failures, then returns `errors: errors.slice(0, 10)` in the user-facing JSON response. The structural indexer populates scan candidates from `fullPath` values rooted at `config.rootDir`, and `parseFile()` preserves that `filePath` on parser failure. The new FIX-009 tests assert redaction for invalid-root errors and `data.warnings`, but there is no equivalent assertion for `data.errors`.
- **CounterevidenceSought:** Checked the FIX-009 `relativize()` helper and call sites; it only covers invalid root errors and `warnings`. Checked scan tests around absolute-path redaction; they cover `payload.error` and `payload.data.warnings`, not `payload.data.errors`. Checked `status.ts` error paths for direct path construction; no comparable direct path interpolation was found there in this iteration.
- **AlternativeExplanation:** The raw `data.errors` entries may have been intended as operator diagnostics rather than end-user errors. However, they are returned in the MCP tool response rather than debug logs, and this iteration's security focus explicitly treats user-facing errors as unable to disclose absolute host/workspace paths.
- **FinalSeverity:** P0 under the run-1 regression rule, because this is a remaining variant of the closed absolute-path error leak (`R4-P2-001`) in the same scan response surface.
- **Confidence:** 0.87
- **DowngradeTrigger:** Downgrade to P1/P2 if the product contract explicitly classifies `data.errors` as debug-only/operator-internal, or if a downstream transport redacts `scanResult.errors` before the user sees the payload.

### P1

None.

### P2

None.

## Traceability Checks

- `spec_code`: CONDITIONAL. The default-scope and symlink canonicalization code still matches the spec claims: `resolveIndexScopePolicy()` preserves per-call `includeSkills` precedence, `handleCodeGraphScan()` passes `canonicalRootDir` into `getDefaultConfig()`, and `shouldIndexForCodeGraph()` denies `.opencode/skill` paths by default. The conditional gap is limited to the FIX-009 absolute-path redaction claim for scan `data.errors`.
- `checklist_evidence`: CONDITIONAL. CHK-G scope-boundary evidence remains valid for symlink and opt-in scope behavior, and scan tests cover invalid-root plus warning redaction. The checklist evidence is incomplete for parser/persistence `data.errors` redaction.
- `skill_agent`: PASS. This iteration stayed read-only for review-target code and wrote only the required review packet artifacts.
- `feature_catalog_code`: PASS for the scope policy behavior reviewed in this pass; no skill-scope default indexing regression was found.

Additional security edge checks:

- `relativize(absPath, workspaceRoot)` outside-workspace behavior: PASS. It resolves both paths, returns `.` for the workspace root, returns a workspace-relative path for in-root descendants, and falls back to `basename(resolvedPath)` for outside paths, so the helper itself should not return `..`-prefixed parent paths.
- `relativize()` throw surface: PASS for typed call sites. The helper accepts TypeScript `string` inputs and the scan handler calls it with resolved/canonical strings. No undefined/non-string runtime call site was found in the reviewed code.
- `relativizeScanWarning()`: PASS. Returned warning strings are transformed through `relativize()` before being placed in the user-facing scan payload.
- Logging distinction: PASS with caveat. `console.error()` / `console.warn()` messages may include absolute paths in scan/indexer debug logs, but returned invalid-root errors and warnings are redacted. The remaining failure is not debug logging; it is the returned `data.errors` array.
- Throw-site enumeration for in-scope `scan.ts` and `status.ts`: PASS. No `throw new Error(...)` sites exist in these two in-scope handlers; the relevant leaks are structured error response fields, not thrown exceptions.

## Run-1 Regression Check (state which closed finding(s) you re-verified, with PASS/FAIL)

- `R1-P1-001` includeSkills precedence: PASS. `resolveIndexScopePolicy()` uses the per-call boolean when provided before considering `SPECKIT_CODE_GRAPH_INDEX_SKILLS`.
- `R3-P1-001` symlink rootDir bypass: PASS. `handleCodeGraphScan()` canonicalizes `rootDir` before constructing the default indexer config, so symlink aliases flow into scope filtering as their real path.
- `R4-P2-001` absolute path in errors: FAIL. Invalid-root errors and warnings are redacted, but parser/persistence `data.errors` still concatenate raw absolute `result.filePath` values.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

FAIL — FIX-009 did not fully close the absolute-path disclosure surface for user-facing scan errors.

## Next Dimension

Traceability should verify whether the spec/checklist/resource-map claims explicitly require redaction of all scan response error fields, including parser and persistence failures.
