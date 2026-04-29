---
title: "Feature Specification: Code Graph Readiness Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 4 audits the code graph readiness contract for release readiness. The packet is read-only against code_graph runtime surfaces and writes only this Level 2 audit packet."
trigger_phrases:
  - "045-004-code-graph-readiness"
  - "code graph readiness audit"
  - "read-path contract review"
  - "ensure-ready behavior"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness"
    last_updated_at: "2026-04-29T22:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Initialized and completed release-readiness code graph readiness audit"
    next_safe_action: "Plan remediation for active P0/P1 findings in review-report.md"
    blockers:
      - "P0 readiness debounce can mask edits made after a recent fresh readiness result"
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:045-004-code-graph-readiness"
      session_id: "045-004-code-graph-readiness"
      parent_session_id: "045-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Current code_graph docs do not claim a structural real-time watcher; historical specs still mention the retracted claim as evidence."
---
# Feature Specification: Code Graph Readiness Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `045-release-readiness-deep-review-program` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The release-readiness program needs a truth check for the post-032 code graph readiness contract. The system should be honest that there is no structural real-time watcher, should selectively self-heal stale tracked files on read paths, should block with required action when full repair is needed, and should keep status/verify/detect_changes behavior observable and non-surprising.

### Purpose

Produce a severity-classified `review-report.md` for the code graph readiness contract with file:line evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `.opencode/skill/system-spec-kit/mcp_server/code_graph/` readiness code, handlers, feature catalog, and manual testing playbook.
- Audit `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/` post-038 stress coverage.
- Cross-check prior packet evidence from 013, 032, 035, and 039 where relevant.
- Write packet-local docs and the final `review-report.md`.

### Out of Scope

- Implementing remediation for code graph findings.
- Modifying code graph runtime, feature catalog, playbook, or stress-test source.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/spec.md` | Create | Scope and acceptance criteria for the audit packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/plan.md` | Create | Audit execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/tasks.md` | Create | Completed audit task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/checklist.md` | Create | Verification checklist with evidence. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/implementation-summary.md` | Create | Summary of the audit deliverable. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/review-report.md` | Create | Final 9-section release-readiness review report. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/description.json` | Create | Memory metadata for the packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/graph-metadata.json` | Create | Graph metadata and dependencies for the packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a 9-section `review-report.md` with P0/P1/P2 findings. | Report contains executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. |
| REQ-002 | Preserve read-only scope for audited code graph surfaces. | Only files under this packet folder are authored. |
| REQ-003 | Cite file:line evidence for every active finding. | Each finding includes concrete local file references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Answer readiness-specific questions about watcher claims, selective self-heal, status side effects, verify states, detect_changes, and degraded stress coverage. | Report section 7 and section 9 answer each question. |
| REQ-005 | Run strict validator after packet docs are written. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

- **SCN-001**: **Given** a recent fresh readiness result, **when** files are edited immediately after it, **then** the report checks whether the next query can skip detection.
- **SCN-002**: **Given** current docs mention watcher terms, **when** the report classifies them, **then** it separates current operator guidance from historical evidence records.
- **SCN-003**: **Given** `code_graph_status` is diagnostic-only, **when** the report audits it, **then** it verifies the status path uses a read-only snapshot.
- **SCN-004**: **Given** a finding is active, **when** it appears in the registry, **then** it has severity, impact, evidence, and a concrete fix.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` is complete and severity-classified.
- **SC-002**: The report explicitly answers each user-provided readiness question.
- **SC-003**: The packet's strict validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 045 phase parent | Child packet must align to release-readiness program scope. | Use parent manifest as packet scope source. |
| Dependency | 013, 032, 035, 039 evidence | Prior packet claims define the readiness contract under audit. | Read prior packet docs and current runtime surfaces. |
| Risk | Cached readiness can hide staleness | Silent stale reads are release blockers. | Classify with P0 severity when evidence shows bypass. |
| Risk | Historical docs still mention watcher overclaim | Regex sweeps can produce noisy false positives. | Report current operator docs separately from historical packet evidence. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit uses targeted reads and regex checks rather than broad test suites.

### Security
- **NFR-S01**: Review path containment and tracked-file logic for path injection or arbitrary execution risk.
- **NFR-S02**: Do not modify code graph database state during the audit.

### Reliability
- **NFR-R01**: Findings distinguish static evidence, test evidence, and unverified runtime behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty graph: should block graph answers and route to `code_graph_scan`.
- Bounded stale graph: should selectively reindex or block when inline index is disallowed.
- Broad stale graph: should block and require full scan.

### Error Scenarios
- Readiness crash: should surface unavailable or `rg` fallback instead of empty graph answers.
- Failed verification: `detect_changes` should refuse attribution; verify should run only on fresh graph state.

### State Transitions
- Fresh-to-stale within debounce window: must not return graph answers from cached fresh readiness.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One subsystem plus feature catalog, playbook, and stress tests. |
| Risk | 22/25 | Silent stale graph reads affect release-readiness gates. |
| Research | 15/20 | Requires code, docs, and prior packet cross-checking. |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for audit completion. Remediation ownership belongs in a follow-up packet.
<!-- /ANCHOR:questions -->
