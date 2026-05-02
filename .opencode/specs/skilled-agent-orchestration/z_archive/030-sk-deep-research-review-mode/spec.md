---
title: "Feature Specification: sk-deep-research Review [skilled-agent-orchestration/030-sk-deep-research-review-mode/spec]"
description: "Add a review mode to sk-deep-research that repurposes the iterative loop infrastructure for automated review work instead of external research."
trigger_phrases:
  - "030"
  - "deep research"
  - "review mode"
  - "sk-deep-research"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/030-sk-deep-research-review-mode"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: sk-deep-research Review Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-24 |
| **Branch** | `030-sk-deep-research-review-mode` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Currently, reviewing spec folders, code changes, skills, and their cross-references for release readiness is a manual, single-pass process. There is no iterative, convergence-driven review flow that systematically checks all dimensions such as correctness, security, patterns, spec alignment, completeness, and cross-reference integrity across a review target.

### Purpose
Add a review mode to sk-deep-research that repurposes the iterative loop infrastructure, including LEAF dispatch, JSONL state, and convergence detection, for automated code-quality and documentation-quality review work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept a review target such as a spec folder, skill, agent, or file set.
- Decompose the target into review dimensions or focus areas.
- Dispatch LEAF review agents per iteration and produce a prioritized review report.
- Use the research phase in this packet to inform a later implementation packet.

### Out of Scope
- Actual implementation of review mode in this packet.
- Changes to existing sk-deep-research v1.1.0 behavior outside the review-mode path.
- Changes to the standalone `@review` agent contract beyond explicit integration points.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/spec.md` | Modify | Restore template-safe structure around the existing review-mode concept |
| `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/plan.md` | Create | Add the missing implementation plan |
| `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/tasks.md` | Create | Add the missing task ledger |
| `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/handover.md` | Modify | Repair broken repo references in the existing handover |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review mode accepts a review target and explicit focus dimensions | The packet describes the target intake and review-dimension model |
| REQ-002 | Review mode reuses the existing iterative loop infrastructure | The packet keeps LEAF dispatch, JSONL state, and convergence at the core of the design |
| REQ-003 | Review mode produces a prioritized review report | The packet describes a report with P0, P1, and P2 findings plus remediation order |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Review mode integrates with existing quality scoring | The packet points at the shared sk-code-review doctrine |
| REQ-005 | Research findings remain actionable for implementation | The packet preserves the current research and handover context without broken references |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 research questions are answered with evidence in `research/research.md`.
- **SC-002**: The implementation roadmap remains actionable with phased follow-up work.
- **SC-003**: The repaired packet preserves the review-mode intent while satisfying template requirements.

### Acceptance Scenarios
1. **Given** a maintainer opens this packet, **when** they read `spec.md`, **then** the review-mode problem, scope, and requirements are visible in template order.
2. **Given** a maintainer resumes the work from `handover.md`, **when** they follow the linked repo files, **then** those references resolve to committed artifacts instead of missing markdown files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/sk-code-review/` reference docs | Review mode depends on the shared scoring and review doctrine | Keep the packet references pointed at committed repo files |
| Dependency | `.opencode/skill/sk-deep-research/` and `.opencode/command/spec_kit/` docs | Review-mode implementation depends on those runtime-facing surfaces | Preserve direct repo references in the packet and handover |
| Risk | Temporary local artifacts from the original session are gone | Resume instructions could point at files that no longer exist | Reword those references as temporary notes rather than committed repo files |

<!-- ANCHOR:nfr -->
### Non-Functional Considerations
- Preserve traceability across the packet and handover.
- Keep the repair aligned with the current repo layout.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
### Edge Cases
- Some referenced docs were later split or renamed, so the packet must point at current canonical paths.
- Temporary local session notes should not be treated as repo dependencies.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
### Complexity Assessment
- Moderate documentation complexity because review mode touches multiple command and skill surfaces.
- Low repair complexity because this pass fixes structure and references, not feature behavior.
<!-- /ANCHOR:complexity -->
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this compliance repair. Remaining feature questions belong in the later implementation work, not in this structural fix.
<!-- /ANCHOR:questions -->
