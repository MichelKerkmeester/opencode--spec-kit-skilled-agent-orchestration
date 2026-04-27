---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: code_graph fail-fast routing [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/implementation-summary]"
description: "Implemented fallbackDecision routing for blocked/degraded code_graph_query read payloads."
trigger_phrases:
  - "code graph fast fail summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail"
    last_updated_at: "2026-04-27T10:02:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Phase 2 source/test patches and Phase 3 targeted test/build/dist verification"
    next_safe_action: "Restart the MCP-owning client/runtime, then run the live code_graph_query probe"
    blockers:
      - "Live MCP probe requires daemon/client restart before rebuilt dist is loaded"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-code-graph-fast-fail |
| **Completed** | 2026-04-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the code-graph fail-fast routing contract from 007/Q6:

- Added the `FallbackDecision` type to `code_graph/handlers/query.ts`.
- Added readiness-to-fallback mapping for full-scan-required states and readiness errors.
- Attached `fallbackDecision` through `buildGraphQueryPayload()` when readiness calls for it and no explicit decision was already supplied.
- Added blocked payload output for empty and stale full-scan states: `nextTool:"code_graph_scan"`, `reason:"full_scan_required"`, `retryAfter:"scan_complete"`.
- Added readiness-crash output for unavailable/error states: `nextTool:"rg"`, `reason:"scan_failed"`.
- Preserved the read-path `allowInlineFullScan:false` boundary.
- Audited startup-hook versus causal-stats naming and added a startup-brief comment that `Code Graph` means structural code graph, distinct from the memory causal graph.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Modified | Added `FallbackDecision`, routing helper, blocked-payload routing, and readiness-error fallback |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Modified | Added 005/REQ-017 naming disambiguation comment for structural code graph vs memory causal graph |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Modified | Updated existing readiness-crash assertion for the new `rg` fallbackDecision |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts` | Added | Covered empty, stale full-scan, stale selective, fresh, unavailable/error, and `allowInlineFullScan:false` regression cases |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/implementation-summary.md` | Modified | Recorded implementation and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly against `spec.md`, `tasks.md`, 007/Q6, 007 §9, 007 §11 Rec #3-4, and the packet 013 rebuild/restart protocol. The change is additive to response payloads and keeps full scans out of read paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve allowInlineFullScan:false | 007 §11 Rec #4 — keep full scans out of read paths; make operator action obvious instead. |
| Add machine-readable routing | Soft requiredAction was not enough for autonomous callers (006 took 249.8s on cli-opencode Q1). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-*.vitest.ts` | PASS: 2 files passed, 8 tests passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-*.vitest.ts code_graph/tests/code-graph-query-handler.vitest.ts` | PASS: 3 files passed, 36 tests passed |
| Empty graph test | PASS: `fallbackDecision.nextTool === "code_graph_scan"` and `retryAfter === "scan_complete"` |
| Stale + full_scan test | PASS: `fallbackDecision.nextTool === "code_graph_scan"` and `reason === "full_scan_required"` |
| Stale + selective_reindex test | PASS: no `fallbackDecision` emitted |
| Fresh graph test | PASS: no `fallbackDecision` emitted |
| Unavailable/error test | PASS: `fallbackDecision.nextTool === "rg"` and `reason === "scan_failed"` |
| `allowInlineFullScan:false` regression test | PASS: `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })` preserved |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | PASS: `tsc --build` completed successfully |
| `grep -l fallbackDecision .opencode/skill/system-spec-kit/mcp_server/dist/code_graph/handlers/query.js` | PASS: matched `dist/code_graph/handlers/query.js` |
| `grep -l "nextTool" .opencode/skill/system-spec-kit/mcp_server/dist/code_graph/handlers/query.js` | PASS: matched `dist/code_graph/handlers/query.js` |
| `grep -l "retryAfter" .opencode/skill/system-spec-kit/mcp_server/dist/code_graph/handlers/query.js` | PASS: matched `dist/code_graph/handlers/query.js` |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail --strict` | PASS: Errors 0, Warnings 0 |
| Live `code_graph_query({operation:"calls_to", subject:"handleCodeGraphQuery"})` probe | PASS (fresh-graph branch): recorded 2026-04-27T10:12:38.462Z; `data.readiness.freshness:"fresh"`, `freshnessAuthority:"live"`, `evidenceStatus:"confirmed"`, `selfHealAttempted:true`, `selfHealResult:"ok"`; no `fallbackDecision` field — fresh-graph path confirmed; function definition returned 0 CALLS edges (other 6 fq_name matches are imports/exports/test imports), `ambiguous_subject` warning surfaced with `selectionReason:"callable kind preference"` as expected. Note: probe template uses `operation:"callers"` but the schema enum is `calls_to` — `calls_to` is the structural equivalent of "who calls this"; template wording is a doc-only mismatch, not a runtime gap. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Caller-side enforcement out of scope.** This packet adds the routing field; CLI runtimes need their own contract to honor fallbackDecision.
2. **MCP daemon restart required.** Per packet 013, TypeScript source/build verification is provisional until the MCP-owning client/runtime is restarted and a live `code_graph_query` probe confirms the running daemon loaded rebuilt `dist`.
<!-- /ANCHOR:limitations -->
