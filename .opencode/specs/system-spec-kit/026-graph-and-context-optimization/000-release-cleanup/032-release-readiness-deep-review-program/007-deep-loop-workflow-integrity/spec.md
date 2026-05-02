---
title: "Feature Specification: Deep Loop Workflow Integrity Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 7 audits deep-research and deep-review loop workflow integrity: convergence, JSONL state, lineage, reducer correctness, prompt-pack rendering, and post-dispatch validation."
trigger_phrases:
  - "045-007-deep-loop-workflow-integrity"
  - "deep-loop audit"
  - "convergence detection review"
  - "JSONL state log integrity"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity"
    last_updated_at: "2026-04-29T22:30:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed release-readiness deep-loop workflow integrity audit"
    next_safe_action: "Plan remediation for max-iteration hard-cap and post-dispatch validation drift"
    blockers:
      - "P0-001 max-iteration hard cap can be converted into BLOCKED/CONTINUE"
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:045-007-deep-loop-workflow-integrity"
      session_id: "045-007-deep-loop-workflow-integrity"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Graph STOP_BLOCKED is wired as a stop veto, but max-iteration hard stops are not protected from legal-gate blocking."
---
# Feature Specification: Deep Loop Workflow Integrity Release-Readiness Audit

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
| **Parent** | `032-release-readiness-deep-review-program` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The release-readiness program needs a truth check for the deep-loop workflow layer. Deep-research and deep-review loops must stop honestly, preserve append-only JSONL evidence, continue lineage without exposing deferred branches, recover from malformed or missing iteration artifacts, and render prompt packs without leaking secrets or losing required state paths.

### Purpose

Produce a severity-classified `review-report.md` for the deep-loop workflow integrity surface with file:line evidence and explicit answers to the user-provided questions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/`.
- Audit deep-research and deep-review YAML assets under `.opencode/command/spec_kit/assets/`.
- Audit deep-research and deep-review reducer behavior and workflow references.
- Cross-check prior packets 028, 037/005, 038, and representative 045 release-readiness packet format.
- Write packet-local docs and final `review-report.md`.

### Out of Scope

- Implementing remediation.
- Modifying audited runtime, YAML, reducer, or documentation surfaces.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/spec.md` | Create | Scope and requirements for this audit packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/plan.md` | Create | Audit execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/tasks.md` | Create | Completed audit task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/checklist.md` | Create | Verification checklist with evidence. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/implementation-summary.md` | Create | Summary of the audit deliverable. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/review-report.md` | Create | Final 9-section release-readiness review report. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/description.json` | Create | Memory metadata for the packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/graph-metadata.json` | Create | Graph metadata and dependencies for the packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a 9-section `review-report.md` with P0/P1/P2 findings. | Report contains executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. |
| REQ-002 | Preserve read-only scope for audited workflow files. | Only files under this packet folder are authored. |
| REQ-003 | Cite file:line evidence for every active finding. | Each finding includes concrete local file references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Answer workflow-specific questions about convergence fallback, graph veto, lineage modes, validation failure reasons, prompt-pack substitution, recovery paths, and thresholds. | Report section 7 and section 9 answer each question. |
| REQ-005 | Run strict validator after packet docs are written. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

- **SCN-001**: **Given** max iterations is reached, **when** other legal-stop gates still fail, **then** the audit verifies whether the workflow still stops instead of looping.
- **SCN-002**: **Given** graph convergence returns `STOP_BLOCKED`, **when** inline convergence nominates STOP, **then** the audit verifies the graph blocker vetoes synthesis.
- **SCN-003**: **Given** a non-native executor fails, **when** post-dispatch validation runs, **then** the audit checks whether the failure reason and executor provenance are reachable.
- **SCN-004**: **Given** a prompt pack references state paths, **when** rendering runs, **then** the audit verifies the template variables can be substituted.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` is complete and severity-classified.
- **SC-002**: The report explicitly answers each user-provided workflow question.
- **SC-003**: The packet's strict validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 045 phase parent | Child packet must align to release-readiness program scope. | Use parent manifest and sibling packet format. |
| Dependency | Packet 028 | Defines flat-first artifact and artifact-dir staging expectations. | Read implementation summary and compare current YAML. |
| Dependency | 037/005 and 038 | Stress-test folder migration context can expose stale path references. | Targeted path scan for stale deep-loop references. |
| Risk | YAML prose is partly declarative | Some workflow behavior depends on the command executor interpreting YAML fields. | Classify findings where declared paths are not backed by callable code or reachable failure states. |
| Risk | Graph convergence file path in brief is stale | `coverage-graph.ts` target may not exist under `lib/deep-loop`. | Report as traceability drift rather than inventing a file. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit uses targeted reads and regex checks rather than broad test suites.

### Security
- **NFR-S01**: Check prompt-pack rendering and executor audit paths for secret/provenance risks.
- **NFR-S02**: Do not execute deep-loop workflows or mutate their runtime state.

### Reliability
- **NFR-R01**: Findings distinguish static evidence, implemented behavior, and YAML-declared behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Fewer than three completed iterations.
- Graph convergence unavailable or `STOP_BLOCKED`.
- Malformed JSONL, missing iteration narrative, missing delta file, wrong JSONL type.

### Error Scenarios
- Non-native executor timeout or crash.
- Missing executor provenance on non-native records.
- Synthesis event with legacy or missing stop reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions remain for this read-only audit. Remediation planning should decide whether to fix the max-iteration hard-cap behavior in the same packet as deep-review executor-audit parity.
<!-- /ANCHOR:questions -->
