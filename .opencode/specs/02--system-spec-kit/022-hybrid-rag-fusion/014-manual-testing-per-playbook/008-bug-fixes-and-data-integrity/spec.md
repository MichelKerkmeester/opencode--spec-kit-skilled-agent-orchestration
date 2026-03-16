---
title: "Feature Specification: bug-fixes-and-data-integrity manual testing [template:level_1/spec.md]"
description: "This Level 1 packet documents the 11 manual test scenarios assigned to the bug-fixes-and-data-integrity phase of hybrid-rag-fusion. It converts playbook coverage, feature catalog links, and review criteria into a structured spec for per-phase execution."
trigger_phrases:
  - "manual testing"
  - "bug fixes"
  - "data integrity"
  - "hybrid rag fusion"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: bug-fixes-and-data-integrity manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for bug-fixes-and-data-integrity need structured per-phase documentation. The hybrid-rag-fusion playbook already defines prompts, command sequences, expected signals, and pass/fail rules for 11 regression scenarios, but this phase folder needs a focused Level 1 packet so execution can be tracked and reviewed without re-reading the umbrella materials.

### Purpose
Provide a phase-specific specification that maps all 11 bug-fix and data-integrity scenarios to their feature catalog entries, acceptance criteria, and review expectations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase-specific documentation for all 11 bug-fix and data-integrity manual tests assigned by the parent `014-manual-testing-per-playbook` packet.
- Per-test traceability from playbook scenario to feature catalog entry, acceptance criteria, and evidence expectations.
- Manual + MCP execution guidance that preserves exact prompts, command intent, and verdict expectations for review.

### Out of Scope
- Executing the tests themselves - this packet defines coverage and acceptance rules only.
- Runtime code changes for bug fixes or data-layer behavior - implementation already exists elsewhere in the repository.
- Documentation for other manual-testing phases - sibling folders own their own scenario packets.

### Scenario Coverage

| Test ID | Scenario | Feature Catalog |
|---------|----------|-----------------|
| NEW-001 | Confirm graph hits are non-zero when edges exist | [01-graph-channel-id-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md) |
| NEW-002 | Confirm dedup in default mode | [02-chunk-collapse-deduplication.md](../../feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md) |
| NEW-003 | Confirm hub dampening | [03-co-activation-fan-effect-divisor.md](../../feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md) |
| NEW-004 | Confirm identical re-save skips embedding | [04-sha-256-content-hash-deduplication.md](../../feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md) |
| NEW-065 | Confirm Sprint 8 DB safety bundle | [05-database-and-schema-safety.md](../../feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md) |
| NEW-068 | Confirm edge-case guard fixes | [06-guards-and-edge-cases.md](../../feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md) |
| NEW-075 | Confirm mixed-format ID dedup | [07-canonical-id-dedup-hardening.md](../../feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md) |
| NEW-083 | Confirm large-array safety | [08-mathmax-min-stack-overflow-elimination.md](../../feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md) |
| NEW-084 | Confirm transactional limit enforcement | [09-session-manager-transaction-gap-fixes.md](../../feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md) |
| NEW-116 | Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails | [10-chunking-orchestrator-safe-swap.md](../../feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md) |
| NEW-117 | Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format | [11-working-memory-timestamp-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md) |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase-specific requirements, scope, and acceptance criteria for the 11 playbook scenarios. |
| `plan.md` | Create | Execution plan, testing matrix, dependencies, and rollback guidance for the same scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document NEW-001 Graph channel ID fix (G1) in this phase packet. | The documented verdict rule states PASS only when graph channel contributes >=1 hit when causal edges exist, with command transcript and search output captured as evidence. |
| REQ-002 | Document NEW-004 SHA-256 content-hash deduplication (TM-02) in this phase packet. | The documented verdict rule states PASS only when re-save skips embedding and reports duplicate, with save outputs and DB evidence showing no duplicate embedding row. |
| REQ-003 | Document NEW-065 Database and schema safety in this phase packet. | The documented verdict rule states PASS only when all mutation paths complete atomically with no partial corruption and schema constraints hold, supported by mutation output, SQL inspection, and constraint verification. |
| REQ-004 | Document NEW-084 Session-manager transaction gap fixes in this phase packet. | The documented verdict rule states PASS only when concurrent writes are serialized, session limits hold, and no corruption occurs, supported by concurrent write simulation and transaction evidence. |
| REQ-005 | Document NEW-116 Chunking safe swap atomicity in this phase packet. | The documented verdict rule states PASS only when new chunks are staged before old deletion and old children survive when new indexing fails, with re-chunk output and failure-survival evidence captured. |
| REQ-006 | Document NEW-117 SQLite datetime session cleanup in this phase packet. | The documented verdict rule states PASS only when only expired sessions are deleted regardless of timestamp format and active sessions are preserved, with before/after session evidence recorded. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Document NEW-002 Chunk collapse deduplication (G3) in this phase packet. | The documented verdict rule states PASS only when zero duplicate parent IDs appear in collapsed results, with result IDs and dedup evidence attached. |
| REQ-008 | Document NEW-003 Co-activation fan-effect divisor (R17) in this phase packet. | The documented verdict rule states PASS only when hub contribution decreases as degree increases and no single hub dominates >50% of the top-5 results, with comparative query evidence captured. |
| REQ-009 | Document NEW-068 Guards and edge cases in this phase packet. | The documented verdict rule states PASS only when known edge cases are handled without double-counting or incorrect fallback behavior, with trigger output and fallback evidence attached. |
| REQ-010 | Document NEW-075 Canonical ID dedup hardening in this phase packet. | The documented verdict rule states PASS only when mixed-format IDs for the same entity resolve to one canonical ID with no duplicates, with mixed-ID input and canonicalized output recorded. |
| REQ-011 | Document NEW-083 Math.max/min stack overflow elimination in this phase packet. | The documented verdict rule states PASS only when large arrays process without RangeError and produce correct min/max values, with large-array execution output and numeric comparisons attached. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 tests are documented in this phase packet with exact prompts, commands, evidence expectations, and verdict language.
- **SC-002**: Every scoped test ID links to the correct relative feature catalog file under `../../feature_catalog/08--bug-fixes-and-data-integrity/`.
- **SC-003**: The phase packet preserves playbook review intent so PASS/PARTIAL/FAIL decisions can be applied consistently with 100% phase coverage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [manual_testing_playbook.md](../../manual_testing_playbook/manual_testing_playbook.md) | Exact scenario prompts, commands, and pass criteria cannot be confirmed if the playbook changes unexpectedly | Keep this phase packet aligned to the cited playbook rows and update both files together if source rows move or change |
| Dependency | [review_protocol.md](../../manual_testing_playbook/review_protocol.md) | Verdicts may become inconsistent across phases | Apply the shared PASS/PARTIAL/FAIL rules and 100% coverage requirement during execution review |
| Dependency | `../../feature_catalog/08--bug-fixes-and-data-integrity/*.md` | Feature context and traceability would be incomplete | Maintain a one-to-one link for all 11 tests in the scope table |
| Dependency | MCP runtime and sandboxable data stores | Manual scenarios cannot be exercised or evidenced safely without runtime access | Confirm runtime availability before execution and isolate destructive scenarios to sandbox/checkpointed data |
| Risk | Destructive or transactional scenarios could be run against the wrong environment | High | Restrict NEW-065, NEW-084, NEW-116, and NEW-117 to sandbox or checkpointed environments only |
| Risk | Incomplete evidence may force PARTIAL or FAIL verdicts even when behavior is correct | Med | Require prompt, command transcript, output, and explicit rationale for every scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; execution-time sandbox selection will be confirmed when the manual test run begins.
<!-- /ANCHOR:questions -->

---
