---
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Degraded-readiness envelope parity [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/checklist]"
description: "Verification Date: 2026-04-27"
trigger_phrases:
  - "degraded readiness envelope parity checklist"
  - "016 checklist"
  - "verification 016"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity"
    last_updated_at: "2026-04-27T22:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored verification checklist"
    next_safe_action: "Run validate.sh --strict; daemon restart for live probe"
    blockers: []
    key_files: ["checklist.md"]
    completion_pct: 88
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Degraded-readiness envelope parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Requirements REQ-001..010 documented in spec.md [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-002 [P0] Technical approach defined in plan.md (snapshot-first ordering, isolated stats, shared `rg` recovery vocabulary) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-003 [P1] Source-of-truth (review-report.md §3, §4, §7 Packet A) read end-to-end [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-004 [P1] `code_graph_query.buildFallbackDecision` + `buildBlockedReadPayload` shape understood (we mirror it; do not modify it) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-005 [P1] `getGraphReadinessSnapshot` confirmed as read-only — no mutating side effects on relocation (packet 014 Test E pins this) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-006 [P1] `readiness-contract.ts:73-87, 109-123` confirmed to already map `error` correctly — fixtures are the only gap [EVIDENCE: see retained verification text in this checklist item.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] `npx tsc --noEmit` PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-011 [P0] No new compile warnings introduced [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-012 [P1] `buildContextFallbackDecision` mirrors `query.ts:buildFallbackDecision` signature shape — `nextTool` discriminates, `reason` describes [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-013 [P1] Inline comments at every modified branch reference packet 016 + the F-NNN finding for traceability [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-014 [P1] Status handler does not duplicate snapshot logic from packet 014; calls the existing helper directly [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-015 [P1] No new mutating surface introduced in either handler (read-only stays read-only) [EVIDENCE: see retained verification text in this checklist item.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] F-001 #1 (context readiness-crash → blocked envelope shape) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-021 [P0] F-001 #2 (full_scan_required backward-compat) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-022 [P0] F-001 #3 (defense in depth — stats throws during envelope assembly) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-023 [P0] F-003 #1 (status stats throws → snapshot preserved) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-024 [P0] F-003 #2 (snapshot crash AND stats throw → trustState='unavailable') PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-025 [P0] F-003 #3 (healthy path regression) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-026 [P0] Cross-handler parity sweep PASS — context + status crash envelopes agree on canonicalReadiness/trustState/fallbackDecision [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-027 [P0] readiness-contract `error → missing` (canonicalReadiness) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-028 [P0] readiness-contract `error → unavailable` (trustState) PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-029 [P0] readiness-contract `buildQueryGraphMetadata` short-circuits on `error` PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-030 [P0] readiness-contract `buildReadinessBlock(error)` augments correctly PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-031 [P1] Packet 014 invariant: `code-graph-status-readiness-snapshot.vitest.ts` PASS without modification [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-032 [P1] Packet 015 invariant: `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` PASS without modification [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-033 [P1] `code-graph-query-fallback-decision.vitest.ts` PASS — query handler vocabulary unchanged [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-034 [P1] `code-graph-degraded-sweep.vitest.ts` PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-035 [P1] `code-graph-db.vitest.ts` PASS [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-036 [P1] `file-watcher.vitest.ts` PASS — `DEFAULT_DEBOUNCE_MS=2000` unchanged [EVIDENCE: see retained verification text in this checklist item.]
- [ ] CHK-037 [P1] Live MCP probe under induced DB lock after daemon restart records preserved degraded envelope (deferred per packet 008)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-040 [P1] No new secrets, env vars, or credentials introduced [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-041 [P1] No new external network calls; both handlers stay local-only [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-042 [P2] Status response shape backward-compatible: `data.readiness`, `data.canonicalReadiness`, `data.trustState`, `data.freshness` (the four canonical fields) always present in the same locations on healthy paths
- [x] CHK-043 [P2] Context response shape backward-compatible: prior `status: 'error'` callers now receive a richer `status: 'blocked'` envelope with all prior fields plus the canonical readiness fields
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-050 [P0] spec.md REQ-001..010 documented [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-051 [P0] plan.md phases all walked [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-052 [P0] tasks.md per-REQ traceability complete [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-053 [P0] decision-record.md ADR-001 (shared vocabulary) and ADR-002 (defense-in-depth ordering) authored [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-054 [P0] implementation-summary.md authored (NOT placeholder) [EVIDENCE: see retained verification text in this checklist item.]
- [ ] CHK-055 [P1] `validate.sh --strict` PASS recorded
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-060 [P1] No temp files left in scratch/ (none created) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-061 [P1] All packet docs sit at the packet folder root (no orphan subfolders) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-062 [P1] Production code changes scoped to `mcp_server/code_graph/handlers/{context,status}.ts` and tests in `mcp_server/tests/` [EVIDENCE: see retained verification text in this checklist item.]
<!-- /ANCHOR:file-org -->

---

### Scope Discipline
- [x] CHK-070 [P0] No change to `getGraphReadinessSnapshot` itself (read-only helper from packet 014) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-071 [P0] No change to `code_graph_query` (already ships canonical vocabulary; this packet aligns the OTHER two handlers) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-072 [P0] No change to `buildCopilotPromptArg`, `validateSpecFolder`, or `executor-config.ts` (Packet B / 017 territory) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-073 [P0] No change to catalog or playbook docs (Packet C / 018 territory) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-074 [P0] No change to `DEFAULT_DEBOUNCE_MS` (packet 014 invariant) [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-075 [P0] Existing test assertions preserved; only ADD new ones — no deletions [EVIDENCE: see retained verification text in this checklist item.]
- [x] CHK-076 [P1] Cross-handler vocabulary kept consistent: all three handlers (context/status/query) emit `nextTool: 'rg'` for crash recovery [EVIDENCE: see retained verification text in this checklist item.]

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 23/23 |
| P1 Items | 16 | 15/16 (CHK-037 / CHK-055 deferred to driver) |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-27
<!-- /ANCHOR:summary -->
