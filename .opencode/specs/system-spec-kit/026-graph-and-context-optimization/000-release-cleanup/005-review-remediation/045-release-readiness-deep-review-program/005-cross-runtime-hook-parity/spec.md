---
title: "Feature Specification: Cross-Runtime Hook Parity Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 5 audits Claude, Codex, Copilot, Gemini, and OpenCode hook parity for release readiness. The packet is read-only against hook source/config surfaces and writes only this Level 2 audit packet."
trigger_phrases:
  - "045-005-cross-runtime-hook-parity"
  - "hook parity audit"
  - "5-runtime hook review"
  - "cross-runtime feature parity"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity"
    last_updated_at: "2026-04-29T22:30:00+02:00"
    last_updated_by: "codex"
    recent_action: "Initialized and completed release-readiness hook parity audit"
    next_safe_action: "Plan remediation for active P0/P1 findings in review-report.md"
    blockers:
      - "P0 Copilot checked-in live wrapper does not invoke Spec Kit writer scripts"
      - "Normal-shell live runtime verdict is not present in latest run-output"
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:045-005-cross-runtime-hook-parity"
      session_id: "045-005-cross-runtime-hook-parity"
      parent_session_id: "045-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Latest hook-tests run-output is sandbox-skipped for live CLI cells, not a normal-shell verdict."
---
# Feature Specification: Cross-Runtime Hook Parity Release-Readiness Audit

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

The release-readiness program needs a runtime-by-runtime truth check for Spec Kit hook delivery. Prior remediation clarified the hook contract, but release readiness still depends on whether Claude, Codex, Copilot, Gemini, and OpenCode produce the documented signal, expose actionable fallback paths, and avoid silent feature loss when an operator switches runtimes.

### Purpose

Produce a severity-classified `review-report.md` for cross-runtime hook and plugin parity with file:line evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit per-runtime hook source under `.opencode/skill/system-spec-kit/mcp_server/hooks/{claude,codex,copilot,gemini}/`.
- Audit the OpenCode skill-advisor plugin bridge at `.opencode/plugins/spec-kit-skill-advisor.js`.
- Audit hook contract docs, per-runtime configs, and packet evidence from 035, 043, and 044.
- Write packet-local docs and the final `review-report.md`.

### Out of Scope

- Implementing remediation for hook parity findings.
- Modifying hook source, runtime config, or 035/043/044 evidence files.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/spec.md` | Create | Scope and acceptance criteria for the audit packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/plan.md` | Create | Audit execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/tasks.md` | Create | Completed audit task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/checklist.md` | Create | Verification checklist with evidence. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/implementation-summary.md` | Create | Summary of the audit deliverable. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/review-report.md` | Create | Final 9-section release-readiness review report. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/description.json` | Create | Memory metadata for the packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/graph-metadata.json` | Create | Graph metadata and dependencies for the packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a 9-section `review-report.md` with P0/P1/P2 findings. | Report contains executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. |
| REQ-002 | Preserve read-only scope for audited hook surfaces. | Only files under this packet folder are authored. |
| REQ-003 | Cite file:line evidence for every active finding. | Each finding includes concrete local file references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Answer parity-specific questions for Copilot, Codex, live test evidence, fallback docs, silent bypass paths, and feature parity tables. | Report section 7 and section 9 answer each question. |
| REQ-005 | Run strict validator after packet docs are written. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

- **SCN-001**: **Given** the latest run-output is sandboxed, **when** the report states live CLI status, **then** it marks normal-shell verdicts as UNKNOWN rather than PASS.
- **SCN-002**: **Given** direct hook smoke evidence exists, **when** the report states hook-code status, **then** it preserves direct smoke PASS separately from live CLI status.
- **SCN-003**: **Given** a checked-in Copilot wrapper is present, **when** the report audits live wiring, **then** it follows the wrapper path rather than only the direct script smoke.
- **SCN-004**: **Given** a finding is active, **when** it appears in the registry, **then** it has severity, impact, evidence, and a concrete fix.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` is complete and severity-classified.
- **SC-002**: The report distinguishes direct hook smoke evidence from live CLI evidence.
- **SC-003**: The packet's strict validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 045 phase parent | Child packet must align to release-readiness program scope. | Use parent manifest as packet scope source. |
| Dependency | 035, 043, 044 evidence | Prior findings determine live-test interpretation. | Read findings, methodology correction, and latest run-output. |
| Risk | Latest live CLI run-output is sandbox-skipped | Normal-shell runtime verdict remains unknown. | Report as active release-readiness evidence gap rather than inventing a pass/fail. |
| Risk | Copilot live config depends on external Superset wrapper | Repo-local direct smoke can pass while live wrapper drops Spec Kit context. | Classify as P0 silent feature gap with file:line evidence. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit does not run broad suites beyond packet validation.

### Security
- **NFR-S01**: Report avoids reproducing secrets or unredacted credentials from user-level config.
- **NFR-S02**: Timeout fallback and stale-context semantics are checked for machine-visible markers.

### Reliability
- **NFR-R01**: Findings distinguish verified runtime behavior from unverified or sandbox-blocked evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty hook output: classify as expected only when the runtime contract documents fail-open or next-prompt transport.
- One-line JSONL evidence: cite line 1 and summarize the relevant fields.

### Error Scenarios
- Sandbox-skipped live CLI run: report as non-canonical live evidence.
- External wrapper indirection: audit the actual wrapper path when present.

### State Transitions
- P0 finding active: route to remediation planning before release readiness.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Five runtime surfaces plus prior evidence packets. |
| Risk | 18/25 | Runtime switching can silently drop context. |
| Research | 16/20 | Requires source, docs, configs, and run-output cross-checking. |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for audit completion. Remediation ownership belongs in a follow-up packet.
<!-- /ANCHOR:questions -->
