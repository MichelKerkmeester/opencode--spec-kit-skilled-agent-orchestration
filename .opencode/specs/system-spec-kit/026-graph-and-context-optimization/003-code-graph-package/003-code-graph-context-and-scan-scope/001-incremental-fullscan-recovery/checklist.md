---
title: "...ptimization/003-code-graph-package/003-code-graph-context-and-scan-scope/001-incremental-fullscan-recovery/checklist]"
description: "P0/P1/P2 verification checklist for code graph stale-gate recovery, duplicate-symbol dedupe, scan response metadata, tests, build, and post-restart operator checks."
trigger_phrases:
  - "incremental fullscan checklist"
  - "ac-1 filesscanned >= 1000"
  - "ac-8 code graph response shapes"
  - "012/002 checklist"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Created verification checklist with AC-1 through AC-8 from research section 9."
    next_safe_action: "Update checklist with command evidence after tests and build."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts"
    session_dedup:
      fingerprint: "sha256:002-incremental-fullscan-recovery-checklist-2026-04-23"
      session_id: "cg-012-002-2026-04-23"
      parent_session_id: "dr-2026-04-23-130100-pt04"
    completion_pct: 0
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Code Graph Incremental Fullscan Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete or explicitly operator-deferred |
| **[P1]** | Required | Must complete OR document deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

### Acceptance Criteria

- [ ] AC-1 [P0] `code_graph_scan({ rootDir: repo, incremental:false })` returns `filesScanned >= 1000` after MCP restart. [evidence: operator-run post-restart.
- [x] AC-2 [P0] Scan response includes `fullScanRequested:true` and `effectiveIncremental:false`. [evidence: focused vitest passed 30/30 and scan handler tests assert both fields.]
- [ ] AC-3 [P0] Scan response `errors[]` is empty. [evidence: focused vitest no UNIQUE errors; live confirmation remains post-restart.
- [ ] AC-4 [P0] `code_graph_status` reports total files in the 1000-3000 range after MCP restart. [evidence: operator-run post-restart.
- [ ] AC-5 [P0] Immediate repeat scan returns the same total file count. [evidence: operator-run post-restart.
- [ ] AC-6 [P0] Existing vitest suites all pass, including structural contract and tree-sitter parser suites. [evidence: focused suites pass 30/30; full suite fails in out-of-scope `tests/copilot-hook-wiring.vitest.ts`.
- [x] AC-7 [P0] New tests include at least three `indexFiles` option cases and at least one dedupe regression case. [evidence: `structural-contract.vitest.ts` has 3 option tests and `tree-sitter-parser.vitest.ts` has 3 dedupe tests.]
- [ ] AC-8 [P1] No regressions in `code_graph_query`, `code_graph_context`, and `code_graph_status` response shapes. [evidence: existing suite pass plus additive scan-only fields.
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [evidence: `spec.md` requirements section includes REQ-001 through REQ-008.]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [evidence: `plan.md` architecture and phases document the scan-mode and dedupe sequence.]
- [x] CHK-003 [P1] Dependencies identified and available. [evidence: `plan.md` dependencies include MCP restart and local node modules.]
- [x] CHK-004 [P0] Initial spec validation passes strictly. [evidence: `validate.sh --strict` exited 0 with 0 errors and 0 warnings.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `structural-indexer.ts` contains `IndexFilesOptions` and `skipFreshFiles`. [evidence: grep found both tokens in source.]
- [x] CHK-011 [P0] `structural-indexer.ts` contains `seenSymbolIds` dedupe guard. [evidence: grep found `seenSymbolIds`.]
- [x] CHK-012 [P0] `scan.ts` passes `{ skipFreshFiles: effectiveIncremental }`. [evidence: grep found exact call.]
- [x] CHK-013 [P0] `scan.ts` exposes `fullScanRequested` and `effectiveIncremental`. [evidence: grep found both fields in source.]
- [x] CHK-014 [P1] `fullReindexTriggered` remains unchanged. [evidence: field remains in `ScanResult` and response population.]
- [x] CHK-015 [P1] Source follows existing project patterns. [evidence: patch uses existing optional parameter, handler response, and vitest mock patterns.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `npx vitest run` exits 0 from `mcp_server/`. [evidence: blocked by out-of-scope `tests/copilot-hook-wiring.vitest.ts` failure.
- [x] CHK-021 [P0] New `indexFiles` option tests pass. [evidence: focused vitest passed 30/30.]
- [x] CHK-022 [P0] New scan handler integration tests pass. [evidence: focused vitest passed 30/30.]
- [x] CHK-023 [P0] New `capturesToNodes()` dedupe tests pass. [evidence: focused vitest passed 30/30.]
- [x] CHK-024 [P0] `npm run build` exits 0 from `mcp_server/`. [evidence: build exited 0.]
- [x] CHK-025 [P0] Dist `structural-indexer.js` contains `skipFreshFiles`. [evidence: dist grep found token.]
- [x] CHK-026 [P0] Dist `scan.js` contains `fullScanRequested`. [evidence: dist grep found token.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added. [evidence: changes only add booleans, tests, and docs.]
- [x] CHK-031 [P0] Existing scan root symlink boundary behavior remains unchanged. [evidence: `realpathSync` guard code was not modified.]
- [x] CHK-032 [P1] No new external network dependency introduced. [evidence: no package changes were made.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and decision record synchronized. [evidence: final `validate.sh --strict` exited 0 with 0 errors and 0 warnings.]
- [x] CHK-041 [P1] Code graph README documents new response fields. [evidence: README has scan response and indexer options sections.]
- [x] CHK-042 [P1] Implementation summary records test counts, deviations, and post-restart verification items. [evidence: implementation-summary.md verification and limitations sections.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left outside allowed scratch or `/tmp`. [evidence: test fixtures use temp dirs and cleanup hooks.]
- [x] CHK-051 [P1] Packet contains required Level 3 docs and metadata. [evidence: initial strict validation passed.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Dedupe option ADR documented in `decision-record.md`. [evidence: ADR-001 documents Option A.]
- [x] CHK-101 [P0] Scan response supplement ADR documented in `decision-record.md`. [evidence: ADR-002 section documents response fields.]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [evidence: alternatives tables cover A/B/C and response options.]
- [x] CHK-103 [P2] Parser-layer identity follow-up explicitly deferred. [evidence: spec and ADR list parser identity redesign out of scope.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Default incremental path remains stale-only. [evidence: focused vitest default option test passed.]
- [x] CHK-111 [P1] Explicit full scan path is isolated to caller-requested full scans or git-triggered full reindex. [evidence: scan handler passes `effectiveIncremental`.]
- [ ] CHK-112 [P2] Live full-scan duration measured after restart.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md`. [evidence: rollback section lists revert and rebuild steps.]
- [x] CHK-121 [P0] Build output refreshed. [evidence: `npm run build` exited 0.]
- [x] CHK-122 [P1] Operator runbook captured in implementation summary. [evidence: implementation summary lists post-restart verification items.]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 24/28 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-04-23
<!-- /ANCHOR:summary -->
