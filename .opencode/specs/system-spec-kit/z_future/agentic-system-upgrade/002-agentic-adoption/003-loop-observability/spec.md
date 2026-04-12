---
title: "Feature Specification: 003 Loop Observability [template:level_2/spec.md]"
description: "Improve operator-facing deep-loop visibility by adding richer metrics, status cards, and progress summaries above the existing JSONL and packet artifact layer."
trigger_phrases:
  - "feature"
  - "specification"
  - "003-loop-observability"
  - "adoption"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: 003 Loop Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-11 |
| **Branch** | `003-loop-observability` |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../002-retry-feedback-bridge/spec.md` |
| **Successor Phase** | `../004-fresh-context-validation-first/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Public already has the core authority needed for 003 loop observability, but the change still needs one implementation-ready contract. This child phase narrows the converged research into a current-authority-safe design.

### Purpose
Turn the research synthesis for 003 loop observability into one follow-on implementation-ready packet contract.

### Research Sources
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/research/archive/legacy-research-log/research-dashboard-legacy.md:5-13` - Agent Lightning Phase 1 marked richer loop metrics and dashboard signals as adopt-now while leaving tracer seams and lifecycle models in prototype-later territory.
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/research/iterations/iteration-029.md:19-45` - Xethryon synthesis identified a single active workflow card as the highest-leverage additive UX artifact across bootstrap, resume, and packet work.
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/research/iterations/iteration-026.md:40-45` - Late Agent Lightning synthesis recommended a compact run-status card above raw JSONL instead of removing explicit state files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the metrics and state summaries that should appear for deep research, deep review, and multi-step implementation workflows.
- Add a compact workflow card or status snapshot that reports state, blockers, validation status, and next action without hiding packet artifacts.
- Preserve raw evidence files while making progress legible through one high-signal surface.

### Out of Scope
- Deleting existing dashboards, iteration files, or JSONL logs.
- Replacing current reducers with a service-backed telemetry backend.
- Creating a full event-sourcing replay engine in this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/deep-research.md` | Modify | Primary affected surface for the adoption work |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Primary affected surface for the adoption work |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modify | Primary affected surface for the adoption work |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Primary affected surface for the adoption work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep the current Public authorities authoritative | The packet does not recommend replacing `/spec_kit:*`, the current agent stack, Spec Kit Memory, CocoIndex, or code-graph |
| REQ-002 | Define the adoption as a wrapper or refactor over current surfaces | The packet maps the work to current repo files and avoids backend transplant language |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Name real current repo paths | All file references resolve in the current checkout |
| REQ-004 | Document measurable success criteria | The child packet can hand off into implementation without reopening the problem framing |
| REQ-005 | Document rollback-safe sequencing | Dependencies, risks, and verification expectations are explicit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet defines a stable status-card schema and the runtime handlers that would emit it.
- **SC-002**: The phase maps observability work to existing command and session handlers instead of proposing a new backend.
- **SC-003**: Loop dashboards remain the detailed evidence layer, while the workflow card becomes the default summary layer.

### Acceptance Scenarios
1. **Given** the child packet is promoted, when a follow-on implementation packet is opened, then the current-authority boundary is already fixed.
2. **Given** the affected files are reviewed, when scope is finalized, then only real current repo paths remain in the packet.
3. **Given** the packet is implementation-ready, when success criteria are checked, then each one maps to an observable verification outcome.
4. **Given** scope expands beyond the named adoption theme, when the checklist is reviewed, then the packet is split or re-scoped before implementation begins.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001-architecture-boundary-freeze | Medium | Keep the phase in draft until the dependency is stable |
| Risk | Scope drift into backend replacement | High | Keep wrap-not-replace language explicit |
| Risk | Source drift from cited research | Medium | Re-verify the cited dashboard and iteration lines before promotion |
| Risk | Stale file references | Medium | Re-check current Public paths during validation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The packet should stay concise enough to hand off without re-reading the full research train.
- **NFR-P02**: Citations and file maps should make source verification fast.

### Security
- **NFR-S01**: The packet must not weaken current governance or validation boundaries.
- **NFR-S02**: The packet must not recommend hidden replacement of current authorities.

### Reliability
- **NFR-R01**: The packet should remain useful even if adjacent study phases are later rejected.
- **NFR-R02**: The packet should preserve a clean follow-on path into implementation or study output.

---

## L2: EDGE CASES

### Data Boundaries
- Empty promotion path: keep the child phase in draft.
- Multiple overlapping findings: keep this child phase narrow and split adjacent work elsewhere.
- Invalid file reference: replace it with a confirmed current Public path before promotion.

### Error Scenarios
- Contradictory research signal: stop and keep the phase in draft until the contradiction is reconciled.
- Validation failure: fix template structure before making more content edits.
- Scope expansion: split the phase instead of widening it silently.

### State Transitions
- Draft to ready: requires measurable outcomes, verified paths, and preserved current-authority constraints.
- Draft to rejected: allowed if evidence shows the phase violates the architecture boundary.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Follow-on implementation-ready packet design |
| Risk | 16/25 | Shell or runtime-surface drift risk |
| Research | 14/20 | Cross-phase synthesis and citation fidelity required |
| **Total** | **48/70** | **Level 2** |

## 10. OPEN QUESTIONS

- Which follow-on implementation packet should pick this phase up first?
- What is the minimum verification stack that proves the adoption without expanding scope?
<!-- /ANCHOR:questions -->
