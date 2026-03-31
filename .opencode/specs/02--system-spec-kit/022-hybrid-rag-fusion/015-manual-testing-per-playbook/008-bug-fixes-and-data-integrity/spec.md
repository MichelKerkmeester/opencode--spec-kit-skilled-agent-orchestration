---
title: "Featur [02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/008-bug-fixes-and-data-integrity/spec]"
description: "Test specification for the 11 manual test scenarios in the bug-fixes-and-data-integrity phase of the hybrid-rag-fusion playbook."
trigger_phrases:
  - "manual testing"
  - "bug fixes and data integrity"
  - "graph channel id fix"
  - "chunk collapse deduplication"
  - "sha-256 content hash"
  - "canonical id dedup"
  - "session manager transaction"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Manual Testing — Bug Fixes and Data Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `015-manual-testing-per-playbook/008-bug-fixes-and-data-integrity` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [007-evaluation](../007-evaluation/spec.md) |
| **Successor** | [009-evaluation-and-measurement](../009-evaluation-and-measurement/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The bug-fixes-and-data-integrity category covers 11 scenarios that verify correctness of data handling, deduplication, and transaction safety in the hybrid-rag-fusion memory system. These scenarios require structured manual execution to confirm that historical bug fixes remain effective and no regressions exist.

### Purpose

Execute all 11 playbook scenarios, record pass/fail for each, and confirm the system is free of known data-integrity defects before marking this phase complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Manual execution of all 11 scenarios listed in section 4
- Pass/fail recording per scenario with evidence notes
- Checklist sign-off for each P0 item

### Out of Scope

- Automated regression tests — covered by CI pipeline separately
- New feature development — this is verification only
- Other playbook phases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `checklist.md` | Modify | Mark items as each scenario completes |
| `tasks.md` | Modify | Mark tasks complete as scenarios pass |
| `implementation-summary.md` | Modify | Fill in after all scenarios executed |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 001 | Graph channel ID fix (G1) | 08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md |
| 2 | 002 | Chunk collapse deduplication (G3) | 08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md |
| 3 | 003 | Co-activation fan-effect divisor (R17) | 08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md |
| 4 | 004 | SHA-256 content-hash deduplication (TM-02) | 08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md |
| 5 | 065 | Database and schema safety | 08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md |
| 6 | 068 | Guards and edge cases | 08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md |
| 7 | 075 | Canonical ID dedup hardening | 08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md |
| 8 | 083 | Math.max/min stack overflow elimination | 08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md |
| 9 | 084 | Session-manager transaction gap fixes | 08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md |
| 10 | 116 | Chunking safe swap atomicity (P0-6) | 08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md |
| 11 | 117 | SQLite datetime session cleanup (P0-7) | 08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

All 11 scenarios must be executed and pass before this phase is marked complete.

| ID | Scenario ID | Scenario Title | Acceptance Criteria |
|----|-------------|----------------|---------------------|
| REQ-001 | 001 | Graph channel ID fix (G1) | Graph channel IDs resolve without collision; no phantom results from wrong-ID mapping |
| REQ-002 | 002 | Chunk collapse deduplication (G3) | Duplicate chunks are collapsed on save; single canonical entry survives in index |
| REQ-003 | 003 | Co-activation fan-effect divisor (R17) | Co-activation score is divided by fan-out count; large fan-out does not inflate scores |
| REQ-004 | 004 | SHA-256 content-hash deduplication (TM-02) | Identical content saved twice yields one indexed record with matching SHA-256 hash |
| REQ-005 | 065 | Database and schema safety | Schema migrations apply cleanly; no data loss on upgrade path |
| REQ-006 | 068 | Guards and edge cases | Null inputs, empty strings, and malformed data return safe error responses, not crashes |
| REQ-007 | 075 | Canonical ID dedup hardening | Canonical ID generation is deterministic; re-indexing the same file produces the same ID |
| REQ-008 | 083 | Math.max/min stack overflow elimination | Large array operations on scores do not throw RangeError; spread-operator paths replaced |
| REQ-009 | 084 | Session-manager transaction gap fixes | Concurrent session writes complete without orphaned rows or partial commits |
| REQ-010 | 116 | Chunking safe swap atomicity (P0-6) | Chunk table swap is atomic; no partial state visible to concurrent readers during swap |
| REQ-011 | 117 | SQLite datetime session cleanup (P0-7) | Session cleanup uses correct datetime comparison; expired sessions are purged accurately |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 scenarios execute without blocking errors
- **SC-002**: All 11 P0 checklist items are checked with evidence
- **SC-003**: No scenario produces a regression finding that was not already tracked
- **SC-004**: implementation-summary.md is filled in with pass/fail results and date
### Acceptance Scenarios

**Given** the `008-bug-fixes-and-data-integrity` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `008-bug-fixes-and-data-integrity` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `008-bug-fixes-and-data-integrity` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `008-bug-fixes-and-data-integrity` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Running MCP server instance | Cannot execute MCP tool calls without server | Confirm server is running before starting |
| Dependency | SQLite DB with test data | Some scenarios require existing records | Seed data or use checkpoint restore before running |
| Risk | Scenario 116 atomicity window is small | Race condition may not be reliably reproducible | Note environment and repeat 3x if inconclusive |
| Risk | Schema migration scenarios (065) may be environment-specific | Pass on fresh DB, fail on migrated DB | Run on both a fresh and existing DB if possible |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at this time. All scenario definitions are complete in the playbook.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each scenario executes within 60 seconds of manual steps
- **NFR-P02**: MCP tool calls respond within 5 seconds under normal load

### Security
- **NFR-S01**: No secrets or credentials written to scratch/ during testing
- **NFR-S02**: Test DB used is isolated from production data

### Reliability
- **NFR-R01**: Scenarios 083 and 116 require three independent runs to confirm stability
- **NFR-R02**: Any scenario that fails must be re-run after environment reset before recording FAIL
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Scenarios 068 explicitly tests this — record the exact error response
- Maximum length: Scenario 083 tests large arrays — document array size used in the run
- Invalid format: Malformed IDs in scenario 075 — confirm deterministic rejection behavior

### Error Scenarios
- MCP server unavailable: Pause execution, restart server, re-run from last incomplete scenario
- DB locked during concurrent write (084): Retry once after 2s; record FAIL if lock persists
- Schema version mismatch (065): Document DB version in evidence notes
<!-- /ANCHOR:edge-cases -->
