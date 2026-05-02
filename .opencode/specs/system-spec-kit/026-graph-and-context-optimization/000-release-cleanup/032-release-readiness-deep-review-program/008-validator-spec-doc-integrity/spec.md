---
title: "Feature Specification: 045-008 Validator Spec Doc Integrity"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 8 audits the spec validator, phase-parent detectors, template rules and representative spec docs for release readiness."
trigger_phrases:
  - "045-008-validator-spec-doc-integrity"
  - "validator audit"
  - "spec doc integrity review"
  - "phase-parent detection consistency"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity"
    last_updated_at: "2026-04-29T19:47:00Z"
    last_updated_by: "codex"
    recent_action: "Release-readiness audit completed"
    next_safe_action: "Plan validator remediation"
    blockers: []
    key_files:
      - "review-report.md"
      - ".opencode/skill/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh"
      - ".opencode/skill/system-spec-kit/scripts/utils/template-structure.js"
    session_dedup:
      fingerprint: "sha256:045008validatorspecdocintegrity00000000000000000000000000"
      session_id: "045-008-validator-spec-doc-integrity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 045-008 Validator Spec Doc Integrity

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec validator is a release gate for system-spec-kit packets, phase parents and deep-review output. A release-readiness audit needs to verify that strict mode catches malformed spec documents, avoids rejecting valid phase-parent and research packet structures, and produces actionable findings.

### Purpose
Produce a severity-classified review report that identifies validator integrity blockers before the 045 release-readiness program promotes the validator as trustworthy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` and validator rule scripts.
- Compare shell and TypeScript phase-parent detectors on real spec folders.
- Probe strict-mode behavior for phase parents, template headers, frontmatter memory blocks, anchors and links.
- Review related packet history from 010 phase-parent documentation and 037/004 sk-doc template alignment.
- Write packet docs and `review-report.md` under this packet folder only.

### Out of Scope
- Modifying validator implementation files.
- Committing changes.
- Rewriting existing `.opencode/specs` legacy packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/spec.md | Create | Level 2 audit specification |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/plan.md | Create | Audit execution plan |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/tasks.md | Create | Audit task ledger |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/checklist.md | Create | Verification evidence checklist |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/implementation-summary.md | Create | Completion summary |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/review-report.md | Create | Nine-section release-readiness report |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/description.json | Create | Discovery metadata |
| specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/graph-metadata.json | Create | Graph metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compare shell and TypeScript phase-parent detection. | Detector parity result includes sampled folder count and divergence count. |
| REQ-002 | Identify strict validator false negatives. | Report includes any reproduced strict pass for invalid spec content. |
| REQ-003 | Identify strict validator false positives. | Report includes any reproduced strict failure for valid phase-parent or template-extension content. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Assess frontmatter memory compactness rule. | Report states whether narrative `recent_action` or `next_safe_action` values are rejected. |
| REQ-005 | Assess links validation default posture. | Report gives a release recommendation for `SPECKIT_VALIDATE_LINKS`. |
| REQ-006 | Preserve target read-only constraint. | Only packet files are written. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` uses the nine-section deep-review format and classifies findings as P0, P1 or P2.
- **SC-002**: Findings cite concrete file and line evidence.
- **SC-003**: Final packet validation passes with `validate.sh --strict`.
- **SC-004**: Audit notes explicitly answer the user questions about detector agreement, phase-parent distinction, strict false positives and false negatives, frontmatter memory compactness, template header exceptions and link validation defaults.

### Acceptance Scenarios
- **Given** the shell and TypeScript phase-parent detectors run on real spec folders, the report records the checked count and divergence count.
- **Given** a malformed spec hides required anchors inside a fenced block, the report records whether strict validation catches it.
- **Given** a valid phase parent intentionally omits heavy docs, the report records whether strict validation rejects it.
- **Given** a documented custom research section is appended after required template sections, the report records whether strict validation allows it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing validator speed | Full-repo strict validation is expensive. | Use targeted representative samples plus focused repro probes. |
| Risk | Probe artifacts | Temporary malformed folders could pollute the repo. | Create probes only under `/tmp` and remove them after each run. |
| Risk | Read-only target surface | Fixing validator defects would violate audit scope. | Report remediation seeds without editing target code. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit probes should finish within a single interactive session.
- **NFR-P02**: Avoid full-tree strict validation when focused probes answer the release question.

### Security
- **NFR-S01**: Include adversarial checks for path and anchor confusion.
- **NFR-S02**: Treat validator false negatives as release blockers.

### Reliability
- **NFR-R01**: Use repeatable shell commands for parity and strict-mode probes.
- **NFR-R02**: Cite observed command results rather than inferred behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty detector sample: fail the audit because no parity evidence exists.
- Large spec tree: sample representative folders and all phase-parent detector candidates.
- Invalid target path: cite the real repo path when the requested target path is stale.

### Error Scenarios
- Validator timeout: record the blocked check and continue with narrower probes.
- Strict validation failure on this packet: fix packet docs only, then rerun.
- Existing unrelated dirty worktree entries: leave them untouched.

### State Transitions
- Audit complete: packet docs and review report exist, then strict validation passes.
- Remediation deferred: findings remain active in the report and route to planning.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Validator scripts, templates, detectors and representative specs |
| Risk | 24/25 | Validator false positives and negatives affect release gates |
| Research | 17/20 | Requires related packet and commit history review |
| **Total** | **60/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Remediation choices are captured in `review-report.md`.
<!-- /ANCHOR:questions -->
