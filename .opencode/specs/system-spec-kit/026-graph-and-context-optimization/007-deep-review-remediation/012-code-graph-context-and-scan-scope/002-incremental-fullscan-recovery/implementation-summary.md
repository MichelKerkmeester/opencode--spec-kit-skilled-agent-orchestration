---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Code Graph Incremental Fullscan Recovery"
description: "The code graph scan path now distinguishes explicit full scans from stale-only incremental scans, blocks duplicate symbol IDs before persistence, and exposes additive scan-mode response fields."
trigger_phrases:
  - "incremental fullscan implementation"
  - "code graph stale gate fixed"
  - "skipFreshFiles implemented"
  - "seenSymbolIds implemented"
  - "012/002 implementation summary"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Implemented scan recovery"
    next_safe_action: "Fix hook test or restart MCP"
    blockers:
      - "Full vitest suite fails in out-of-scope tests/copilot-hook-wiring.vitest.ts"
      - "AC-1, AC-4, and AC-5 require MCP restart before live scan"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/README.md"
    session_dedup:
      fingerprint: "sha256:002-incremental-fullscan-recovery-summary-2026-04-23"
      session_id: "cg-012-002-2026-04-23"
      parent_session_id: "dr-2026-04-23-130100-pt04"
    completion_pct: 86
    open_questions:
      - "Should the out-of-scope copilot hook wiring failure be fixed in a separate packet?"
    answered_questions:
      - "indexFiles now accepts IndexFilesOptions with skipFreshFiles defaulting true."
      - "scan.ts passes skipFreshFiles: effectiveIncremental and keeps fullReindexTriggered unchanged."
      - "capturesToNodes dedupes generated symbolIds and preserves the first-seen node."
      - "README documents fullScanRequested, effectiveIncremental, and IndexFilesOptions."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-incremental-fullscan-recovery |
| **Completed** | Blocked on full-suite ambient failure |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code graph scanner now has a real full-scan path again. `indexFiles()` accepts `IndexFilesOptions { skipFreshFiles?: boolean }`, defaults to stale-only behavior for existing callers, and lets `code_graph_scan({ incremental:false })` parse every post-exclude candidate by passing `skipFreshFiles:false`.

### Full-Scan Mode Propagation

`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` now exports `IndexFilesOptions` and gates `isFileStale()` behind `skipFreshFiles`. `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` now passes `{ skipFreshFiles: effectiveIncremental }`, so explicit full scans and git-triggered full reindexes bypass the stale gate.

### Duplicate-Symbol Guard

`capturesToNodes()` now tracks `seenSymbolIds` with the module node preloaded. Duplicate `(filePath, fqName, kind)` captures are dropped through `flatMap()`, preserving the first-seen node and preventing duplicate IDs from reaching `replaceNodes()`.

### Response Metadata and Documentation

`ScanResult` now includes `fullScanRequested` and `effectiveIncremental`, while `fullReindexTriggered` remains unchanged. `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` documents the new scan response fields and the `IndexFilesOptions` parameter.

### Tests Added

`.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` gained three `indexFiles` option tests and two scan handler integration tests. `.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts` gained three `capturesToNodes()` dedupe regression tests.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I followed the deep research packet sequence: docs first, source patch second, regression tests third, then build and dist inspection. The nested Level 3 packet strict-validated before source changes. Focused regression coverage passed after one ordering assertion was made deterministic.

No live `code_graph_scan` was run from this Codex session, per constraint. AC-1, AC-4, and AC-5 remain operator checks after MCP restart.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `skipFreshFiles` optional and default true | Existing callers like ensure-ready keep stale-only behavior without code changes. |
| Pass `effectiveIncremental` from scan handler | The handler already owns caller intent plus git-head reindex mode. |
| Dedupe in `capturesToNodes()` | It is the smallest crash fix that preserves stable symbol IDs. |
| Add response fields instead of renaming | `fullReindexTriggered` stays backward-compatible while operators get explicit mode visibility. |
| Stop short of hook-wiring changes | The full-suite failure is outside this packet's file scope and should be handled separately. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Before baseline | Not captured before edits; scoped verification used post-change focused and full-suite runs. |
| Initial spec validation | PASS: `validate.sh --strict` exited 0 with 0 errors and 0 warnings. |
| Focused vitest | PASS: `npx vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts code-graph/tests/code-graph-scan.vitest.ts` passed 3 files / 30 tests. |
| Full vitest | FAIL/BLOCKED: `npx vitest run` reported `tests/copilot-hook-wiring.vitest.ts` failure, expecting `.github/hooks/scripts/session-start.sh` but receiving `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart`; the first full run then hung after the failure. |
| Isolated ambient failure | FAIL: `npx vitest run tests/copilot-hook-wiring.vitest.ts` passed 3 tests and failed 1 with the same hook-wiring assertion. |
| Build | PASS: `npm run build` exited 0. |
| Source grep | PASS: source contains `skipFreshFiles`, `seenSymbolIds`, `fullScanRequested`, and `effectiveIncremental`. |
| Dist grep | PASS: `dist/code-graph/lib/structural-indexer.js` contains `skipFreshFiles`; `dist/code-graph/handlers/scan.js` contains `fullScanRequested` and `effectiveIncremental`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full-suite acceptance is blocked.** The repository-wide `npx vitest run` does not exit 0 because `tests/copilot-hook-wiring.vitest.ts` currently disagrees with the hook configuration. That file is outside this packet's scope.
2. **Live MCP scan checks are operator-owned.** AC-1, AC-4, and AC-5 require restarting the MCP server and then running `code_graph_scan({ rootDir: repo, incremental:false })` plus `code_graph_status`.
3. **Parser identity remains intentionally minimal.** The dedupe guard prevents DB crashes, but richer scope-aware symbol identity remains a future parser-completeness packet.
<!-- /ANCHOR:limitations -->
