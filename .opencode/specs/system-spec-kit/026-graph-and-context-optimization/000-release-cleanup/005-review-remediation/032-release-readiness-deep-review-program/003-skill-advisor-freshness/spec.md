---
title: "Feature Specification: Skill Advisor Freshness Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 3 audits skill advisor freshness for release readiness. The packet is read-only against skill_advisor runtime surfaces and writes only this Level 2 audit packet."
trigger_phrases:
  - "045-003-skill-advisor-freshness"
  - "advisor freshness audit"
  - "daemon freshness review"
  - "advisor rebuild review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness"
    last_updated_at: "2026-04-29T22:05:20+02:00"
    last_updated_by: "codex"
    recent_action: "Initialized and completed release-readiness skill advisor freshness audit"
    next_safe_action: "Plan remediation for active P1/P2 findings in review-report.md"
    blockers:
      - "P1 advisor_rebuild public schema does not accept workspaceRoot despite the status/rebuild playbook requiring it"
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:045-003-skill-advisor-freshness"
      session_id: "045-003-skill-advisor-freshness"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "advisor_status is diagnostic-only in the reviewed handler."
      - "advisor_rebuild force path performs a full index and publishes generation when invoked against the intended workspace."
---
# Feature Specification: Skill Advisor Freshness Release-Readiness Audit

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
| **Parent** | `032-release-readiness-deep-review-program` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Release readiness depends on whether the skill advisor reports freshness honestly, keeps status diagnostic-only, rebuilds graph state on explicit request, and avoids scoring drift or silent stale-context fallback. Prior packets unified the daemon and advisor paths, but the release program still needs an evidence-backed audit of status/rebuild split, cache invalidation, scoring table trust, Codex cold-start markers, and Python compatibility behavior.

### Purpose

Produce a severity-classified `review-report.md` for skill advisor freshness with file:line evidence and direct answers to the packet questions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/` and the named status, rebuild, recommend, validate, daemon, scoring, feature catalog, and manual playbook surfaces.
- Read packet history for 026/008, 034, and 045/005 where it affects advisor freshness and cross-runtime hook parity.
- Answer the packet's six specific questions in the report.
- Write packet-local docs and the final `review-report.md`.

### Out of Scope

- Implementing remediation for release-readiness findings.
- Modifying skill advisor runtime source, tests, feature catalog docs, or manual playbooks.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/spec.md` | Create | Scope and acceptance criteria for the audit packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/plan.md` | Create | Audit execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/tasks.md` | Create | Completed audit task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/checklist.md` | Create | Verification checklist with evidence. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/implementation-summary.md` | Create | Summary of the audit deliverable. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/review-report.md` | Create | Final 9-section release-readiness review report. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/description.json` | Create | Memory metadata for the packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness/graph-metadata.json` | Create | Graph metadata and dependencies for the packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a 9-section `review-report.md` with P0/P1/P2 findings. | Report contains executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. |
| REQ-002 | Preserve read-only scope for audited skill advisor surfaces. | Only files under this packet folder are authored. |
| REQ-003 | Cite file:line evidence for every active finding. | Each finding includes concrete local file references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Answer advisor-specific questions for status side effects, force rebuild, scoring table loading, Codex stale marker, Python shim parity, and cache hit rate. | Report section 7 and section 9 answer each question. |
| REQ-005 | Run strict validator after packet docs are written. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

- **SCN-001**: **Given** `advisor_status` is called, **when** the audit checks side effects, **then** it distinguishes read-only diagnostics from cache or graph mutation.
- **SCN-002**: **Given** `advisor_rebuild({force:true})` is called, **when** the audit checks rebuild behavior, **then** it verifies index publication and cache invalidation.
- **SCN-003**: **Given** scoring tables are used, **when** the audit checks prompt-injection risk, **then** it verifies the trust boundary for token and phrase boosts.
- **SCN-004**: **Given** Codex hook timeout fallback occurs, **when** the audit checks freshness reporting, **then** it verifies `stale: true` and `reason: "timeout-fallback"` evidence.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` is complete and severity-classified.
- **SC-002**: The report answers all six advisor-specific questions with file:line evidence.
- **SC-003**: The packet's strict validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 045 phase parent | Child packet must align to release-readiness program scope. | Use parent packet as dependency in graph metadata. |
| Dependency | 026/008 and 034 history | Prior advisor unification and freshness-smoke work defines expected behavior. | Cross-read relevant packet history and cite current implementation. |
| Dependency | 045/005 cross-runtime hook parity | Codex cold-start and hook fallback concerns overlap. | Cross-reference Codex freshness status without duplicating the hook parity audit. |
| Risk | Read-only audit cannot remediate findings | Active findings remain open after report completion. | Classify findings and provide concrete remediation workstreams. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Report cache behavior using measured test evidence or explicit UNKNOWN, not invented production telemetry.

### Security
- **NFR-S01**: Verify scoring boosts are not loaded from prompt-controlled or untrusted runtime sources.
- **NFR-S02**: Check for prompt-injection paths through scoring evidence.

### Reliability
- **NFR-R01**: Verify stale, live, unavailable, and timeout fallback states are reported honestly.
- **NFR-R02**: Verify rebuild and daemon generation paths invalidate advisor caches.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or unavailable graph: report cold-start and unavailable behavior.
- Missing boost tables: report whether failure is silent or module-load hard failure.
- Repeated prompt calls: report exact-cache hit behavior.

### Error Scenarios
- Rebuild request against stale workspace: verify the intended workspace is addressable.
- Codex hook timeout: verify explicit stale fallback marker.
- Daemon shutdown or takeover: verify generation demotion and restart behavior.

### State Transitions
- Live to stale after metadata mtime changes.
- Stale to live after rebuild.
- Live to unavailable on daemon shutdown.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Multiple advisor handlers, daemon libs, scoring files, tests, feature catalog, and manual playbook surfaces. |
| Risk | 15/25 | Freshness bugs can silently route stale context or corrupt scoring. |
| Research | 16/20 | Requires prior packet cross-reading and file:line audit evidence. |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Runtime telemetry beyond checked-in tests is reported as unavailable rather than inferred.
<!-- /ANCHOR:questions -->
