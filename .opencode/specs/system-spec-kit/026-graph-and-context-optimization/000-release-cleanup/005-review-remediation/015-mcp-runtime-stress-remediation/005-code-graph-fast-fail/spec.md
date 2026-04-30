---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: code_graph fail-fast routing with fallbackDecision [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec]"
description: "Remediation packet for 005/REQ-017 + 007/Q6. Promotes structural code-graph readiness from advisory hint to binding routing contract. Adds fallbackDecision.nextTool to blocked/degraded read payloads so callers run code_graph_scan before grep fallback. Preserves allowInlineFullScan:false boundary."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "005-code-graph-fast-fail"
  - "code_graph_query fallbackDecision"
  - "code_graph_scan routing contract"
  - "structural graph fail fast"
  - "REQ-017 code graph empty"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail"
    last_updated_at: "2026-04-27T09:42:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet from 007 §5 Q6 + §11 Rec #3-4"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: code_graph fail-fast routing with fallbackDecision

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 004-cocoindex-overfetch-dedup; SUCCESSOR: 006-causal-graph-window-metrics -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Sources** | 005/REQ-017 (code graph empty, naming collision), 007/Q6 contract, 007/§11 Rec #3-4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
006 stress-test recorded 249.8s spent on `cli-opencode` Q1 because the structural code-graph was empty/stale; the read path correctly blocked but the caller did not know to run `code_graph_scan` first. Instead, it fell through to multi-minute `rg`/grep loops. 007/Q6 isolated the cause as a missing routing contract: `requiredAction:"code_graph_scan"` exists in blocked payloads but is too soft for autonomous callers. They need a machine-readable `fallbackDecision.nextTool` instruction that says "run scan before query."

### Purpose
Add `fallbackDecision: { nextTool, reason, retryAfter }` to all blocked/degraded code-graph read payloads. Preserve `allowInlineFullScan:false` (no inline full scans on read paths). Make the operator action obvious instead of weakening the boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `fallbackDecision` field to blocked code-graph read responses per 007 §5 Q6.
- Cover all readiness states: `fresh`, `stale + selective_reindex`, `empty`, `stale + full_scan`, `unavailable/error`.
- Update `code_graph_query` handler at lines `query.ts:775-796` per 007 §9.
- Add tests for each readiness state's fallbackDecision.

### Out of Scope
- Inline scan execution (preserve current `allowInlineFullScan:false` per 007 §11 Rec #4).
- code_graph_scan implementation changes.
- Caller-side enforcement.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/handlers/query.ts` | Modify | Add fallbackDecision at blocked payload site (~:775-796) |
| `mcp_server/code_graph/lib/ensure-ready.ts` | Read-only | Reference for state vocabulary |
| `mcp_server/tests/code-graph-query-blocked.vitest.ts` (or equivalent) | Modify/Create | Test fallbackDecision per readiness state |
| `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Blocked code-graph read responses MUST include `fallbackDecision: { nextTool, reason, retryAfter? }`. | After fix, `code_graph_query({operation:"callers", subject:"<x>"})` against an empty graph returns `data.fallbackDecision.nextTool:"code_graph_scan"`, `reason:"full_scan_required"`, `retryAfter:"scan_complete"`. |
| REQ-002 | Routing matrix per 007 §5 Q6 MUST be implemented: fresh → query, stale+selective → self-heal, empty → scan, stale+full → scan, unavailable → diagnostics+rg fallback only after scan unavailable/declined/failed. | Tests cover each state and assert correct fallbackDecision.nextTool. |
| REQ-003 | `allowInlineFullScan:false` MUST remain unchanged. Read paths MUST NOT trigger inline full scans. | Verify the existing boundary in code is preserved; add a regression test. |
| REQ-004 | Disambiguation per 005/REQ-017: startup hook says "structural code graph" and `causal-stats` says "memory causal graph" (or use a single canonical noun consistently). | After fix, naming collision in startup hooks vs causal-stats is resolved. |

### Acceptance Scenarios

**Given** an empty code-graph, **when** `code_graph_query` is called, **then** the response is blocked with `fallbackDecision.nextTool:"code_graph_scan"` and `retryAfter:"scan_complete"`.

**Given** a fresh code-graph, **when** `code_graph_query` is called, **then** structural results return normally and no fallbackDecision is emitted.

**Given** stale + selective reindex state, **when** read path executes, **then** self-heal runs inline AND no fallbackDecision is emitted.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 REQs covered by tests.
- **SC-002**: Live probe `code_graph_query({operation:"callers", subject:"handleCodeGraphQuery"})` shows fallbackDecision in blocked state.
- **SC-003**: `validate.sh --strict` PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding fallbackDecision could be misread as opening inline-scan opportunity. | Medium | Keep allowInlineFullScan:false explicit; add regression test. |
| Risk | Naming collision rename could break downstream consumers. | Medium | Audit all callers of "Code Graph"/"causal graph" naming first. |
| Dependency | Daemon restart per 005 phantom-fix lesson. | High | See packet 013. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should fallbackDecision also appear in autoprime/startup surfaces? Per 007 §12 open question. Default: query/context only for v1.
- Naming choice: stick with "code graph" (structural) and "causal graph" (memory) as separate qualified nouns, or use one canonical noun? Default: keep both, qualify them.
<!-- /ANCHOR:questions -->
