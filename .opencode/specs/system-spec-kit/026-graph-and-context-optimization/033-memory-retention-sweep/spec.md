---
title: "Spec: Memory Retention Sweep"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Tier B-alpha implementation for governed memory retention enforcement over memory_index.delete_after."
trigger_phrases:
  - "033-memory-retention-sweep"
  - "memory retention sweep"
  - "delete_after sweep"
  - "retention enforcement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep"
    last_updated_at: "2026-04-29T14:03:15Z"
    last_updated_by: "cli-codex"
    recent_action: "Retention sweep complete"
    next_safe_action: "Orchestrator commit"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: Memory Retention Sweep

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Depends On** | `031-doc-truth-pass` |
| **Related** | `013-automation-reality-supplemental-research` |
| **Mode** | Tier B-alpha implementation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 013 supplemental research validated P1-2: governed memory ingest persists `delete_after`, but no cleanup path consumes it. Session cleanup is real but targets session-state tables, and `memory_bulk_delete` filters by tier/spec/date rather than `delete_after`. [EVIDENCE: `../013-automation-reality-supplemental-research/research/research-report.md:40`; `../013-automation-reality-supplemental-research/research/iterations/iteration-004.md:73-76`]

### Purpose

Add audit-worthy retention enforcement for expired `memory_index.delete_after` rows through a reusable sweep, scheduled cleanup integration, and manual MCP trigger.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Retention sweep logic over `memory_index.delete_after`
- Manual MCP tool `memory_retention_sweep`
- Scheduled retention cleanup wired into session-manager initialization
- Targeted tests for deletion, dry-run, audit, index integrity, empty set, and sweep/insert interleaving
- MCP server README and ENV reference documentation
- Packet-local Level 2 docs and metadata

### Out of Scope

- Full vitest suite execution
- Schema redesign or new migration beyond existing `delete_after` support
- Changes to unrelated memory handlers
- Git commit or PR creation
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sweep expired rows. | Rows where `delete_after IS NOT NULL AND delete_after < datetime('now')` are deleted. |
| REQ-002 | Preserve retained rows. | Rows with no `delete_after` or future `delete_after` remain. |
| REQ-003 | Maintain indexes. | Associated vector/FTS/ancillary records are removed by the normal deletion path. |
| REQ-004 | Audit every deletion. | Each deleted row records `reason="retention_expired"` and original `delete_after`. |
| REQ-005 | Support dry-run. | Dry-run returns candidates and summary without mutation. |
| REQ-006 | Schedule the sweep. | Enabled by default, disabled by `SPECKIT_RETENTION_SWEEP=false`, hourly by default. |
| REQ-007 | Add manual trigger. | `memory_retention_sweep({ dryRun?: boolean })` is registered and returns the summary. |
| REQ-008 | Document behavior. | README and ENV reference document flags, interval, and manual tool. |

### Acceptance Scenarios

1. Given one expired and one future governed row, when the sweep runs, then only the expired row is deleted and audited.
2. Given dry-run mode, when expired rows exist, then the rows are returned and the database is unchanged.
3. Given session-manager startup, when retention sweep is enabled, then a periodic retention interval is installed alongside session cleanup.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New sweep deletes expired rows and preserves non-expired rows.
- **SC-002**: `memory_retention_sweep` is listed in MCP tool definitions and dispatches through memory tools.
- **SC-003**: Build succeeds for `mcp_server`.
- **SC-004**: `npx vitest run memory-retention-sweep` passes.
- **SC-005**: Strict packet validator exits 0.

### Acceptance Scenarios

- **SCN-001**: **Given** an expired governed memory row, **when** the sweep runs, **then** the row is deleted and an audit row records `retention_expired`.
- **SCN-002**: **Given** a future or unset retention timestamp, **when** the sweep runs, **then** the row remains in `memory_index`.
- **SCN-003**: **Given** dry-run mode, **when** expired rows exist, **then** candidates are returned and the database is unchanged.
- **SCN-004**: **Given** session-manager initialization, **when** retention sweep is enabled, **then** scheduled retention cleanup starts without removing session cleanup intervals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Deletion bypasses index cleanup | Reuse `vectorIndex.deleteMemory` rather than raw `DELETE` |
| Risk | Scheduler interferes with session cleanup | Add separate retention interval and do not change session cleanup intervals |
| Risk | Audit entries disappear with parent rows | Use governance audit and memory history rows that are independent of `memory_index` FK deletion |
| Dependency | Existing `delete_after` schema | Confirmed in `vector-index-schema.ts` migration/table definitions |
| Dependency | Existing governance audit table | Use `recordGovernanceAudit` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Sweep must be safe on empty result sets.
- **NFR-R02**: Deletion should be transactional for selected expired rows.

### Maintainability
- **NFR-M01**: Keep scheduled and manual sweep paths on the same implementation.
- **NFR-M02**: Avoid unrelated handler/schema rewrites.

### Security
- **NFR-S01**: Retention audit metadata must include original deletion boundary for traceability.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty expired candidate set returns zero swept and does not error.
- Dry-run returns candidates without writing history, governance audit, ledger, or deletions.
- Rows inserted during a sweep are evaluated by the next sweep unless they were in the selected candidate snapshot.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Files touched | Medium | Handler, scheduler, schema registration, tests, docs |
| Behavioral risk | Medium | Deletes indexed memory rows |
| Verification | Medium | Targeted test plus build plus validator |
| Overall | Level 2 | Focused implementation with audit and scheduler behavior |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions. The packet follows the requested Tier B-alpha implementation path.
<!-- /ANCHOR:questions -->
