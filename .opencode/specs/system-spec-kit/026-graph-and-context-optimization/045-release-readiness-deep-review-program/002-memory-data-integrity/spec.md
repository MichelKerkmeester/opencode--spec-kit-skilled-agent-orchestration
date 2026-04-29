---
title: "Feature Specification: Memory Data Integrity Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 2 audits memory subsystem data integrity for release readiness: DB consistency, FTS/vector index sync, retention sweep correctness, race-condition resilience, and governance enforcement."
trigger_phrases:
  - "045-002-memory-data-integrity"
  - "memory data integrity"
  - "DB consistency audit"
  - "retention sweep correctness"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity"
    last_updated_at: "2026-04-29T23:10:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed read-only memory data integrity release-readiness audit"
    next_safe_action: "Plan remediation for active P1/P2 findings in review-report.md"
    blockers:
      - "P1 memory_health can report healthy while consistency checks are missing or degraded"
      - "P1 retention sweep concurrency coverage is not a true multi-writer fixture"
      - "P1 governed retention deletes do not define or enforce embedding-cache invalidation"
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:045-002-memory-data-integrity"
      session_id: "045-002-memory-data-integrity"
      parent_session_id: "045-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Retention sweep removes primary SQLite FTS and vector rows through the normal delete path."
      - "memory_health does not currently expose a reliable DB consistency verdict by default."
---
# Feature Specification: Memory Data Integrity Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `045-release-readiness-deep-review-program` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The release-readiness program needs a data-integrity audit for the memory subsystem. The critical risk is not ordinary handler failure; it is silent drift between `memory_index`, FTS, vector rows, derived caches, governance audit trails, and retention deletion records under save/delete/sweep workflows.

### Purpose

Produce a severity-classified `review-report.md` for memory data integrity with file:line evidence and concrete remediation seeds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit memory save, search, context, bulk delete, retention sweep, health, and index scan handlers.
- Audit governance, memory library, search index, embedding cache, and database schema behavior relevant to data integrity.
- Answer the packet-specific questions about retention cleanup, save/sweep races, embedding cache invalidation, partial save failures, and health accuracy.
- Write packet-local Level 2 docs and the final 9-section review report.

### Out of Scope

- Implementing remediation for active findings.
- Modifying memory subsystem source, database migrations, or test fixtures.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/spec.md` | Create | Scope and acceptance criteria for this audit packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/plan.md` | Create | Audit execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/tasks.md` | Create | Completed audit task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/checklist.md` | Create | Verification checklist with evidence. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/implementation-summary.md` | Create | Summary of the audit deliverable. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/review-report.md` | Create | Final 9-section release-readiness review report. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/description.json` | Create | Memory metadata for the packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/graph-metadata.json` | Create | Graph metadata and dependencies for the packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a 9-section `review-report.md` with P0/P1/P2 findings. | Report contains executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. |
| REQ-002 | Preserve read-only scope for audited memory subsystem surfaces. | Only files under this packet folder are authored. |
| REQ-003 | Cite file:line evidence for every active finding. | Each finding includes concrete local file references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Answer all memory-data-integrity questions. | Report section 7 explicitly answers retention cleanup, save/sweep races, embedding cache invalidation, partial save failure, and memory health accuracy. |
| REQ-005 | Run strict validator after packet docs are written. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

- **SCN-001**: **Given** an expired memory row is swept, **when** the report assesses referential integrity, **then** it distinguishes SQLite FTS/vector cleanup from derived BM25/cache drift.
- **SCN-002**: **Given** a fixture claims save/sweep interleaving coverage, **when** the report audits race resilience, **then** it checks whether the fixture uses real concurrent writers.
- **SCN-003**: **Given** `memory_health` returns `healthy`, **when** consistency checks are absent or advisory-only, **then** the report classifies the release risk.
- **SCN-004**: **Given** a finding is active, **when** it appears in the registry, **then** it has severity, impact, evidence, and a concrete fix.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` is complete and severity-classified.
- **SC-002**: The report answers every specific packet question.
- **SC-003**: The packet's strict validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 045 phase parent | Child packet must align to release-readiness program scope. | Use parent manifest as packet scope source. |
| Dependency | 033 retention sweep packet | Prior claims describe intended retention cleanup and race coverage. | Compare claimed coverage against actual tests and source. |
| Dependency | Post-038 stress tests | Stress fixtures inform concurrency confidence. | Read dedicated memory stress-test directory when present. |
| Risk | Hidden derived index drift | Primary SQLite rows can be correct while BM25/cache lanes drift. | Separate primary DB integrity from derived-cache integrity in findings. |
| Risk | Health overclaims | Operators may treat `healthy` as consistency-safe. | Classify health reporting gaps as release-readiness findings. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit does not run broad suites beyond packet validation.

### Security
- **NFR-S01**: Governance scope, provenance metadata, tenant isolation, and SQL parameterization are checked from source evidence.

### Reliability
- **NFR-R01**: Findings distinguish primary SQLite referential integrity from derived index/cache observability.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Retention deletion of primary memory rows must be checked against FTS, vector rows, active projections, causal refs, governance audit, and derived caches.

### Error Scenarios
- Partial save failure must be assessed separately for DB transaction state and pre-transaction embedding cache writes.

### State Transitions
- P1 findings active: route to remediation planning before release readiness.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple handlers, schema, governance, tests, and derived indexes. |
| Risk | 17/25 | Silent consistency drift can affect memory search and retention guarantees. |
| Research | 15/20 | Requires source, tests, prior packet claims, and schema cross-checking. |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for audit completion. Remediation ownership belongs in a follow-up packet.
<!-- /ANCHOR:questions -->
