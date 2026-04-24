---
title: "Feature [system-spec-kit/z_future/agentic-system-upgrade/002-agentic-adoption/011-event-journal-and-replay-study/spec]"
description: "Evaluate whether a journaled replay layer could improve determinism for specific long-running flows without replacing current JSONL and packet artifact contracts."
trigger_phrases:
  - "feature"
  - "specification"
  - "011-event-journal-and-replay-study"
  - "investigation"
importance_tier: "important"
contextType: "research"
---
# Feature Specification: 011 Event Journal and Replay Study

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-04-11 |
| **Branch** | `011-event-journal-and-replay-study` |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../010-tracer-seam-prototype/spec.md` |
| **Successor Phase** | `../012-runtime-manifest-and-hook-extensibility/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Public has enough research signal to justify a focused study for 011 event journal and replay study, but not enough evidence for direct adoption. This child phase keeps the question bounded and additive.

### Purpose
Answer the remaining uncertainty for 011 event journal and replay study with bounded experiments and a clear promote-or-reject outcome.

### Research Sources
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/research/archive/legacy-research-log/research-dashboard-legacy.md:5-14` - Babysitter Phase 1 highlighted append-only journals, replay caches, pending-action registries, and runtime manifests as promising but not yet productized imports.
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/research/iterations/iteration-025.md:21-49` - Late Babysitter synthesis explicitly defended inspectable loop artifacts and argued that simplification should target wrapper surfaces rather than deleting evidence layers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replay a representative resume flow from current packet artifacts and compare it to a journal-head reconstruction sketch.
- Prototype a pending-action registry for one blocked or partially parallel loop scenario.
- Measure whether replay improves debugging enough to justify the extra state layer.

### Out of Scope
- Backend replacement or architecture pivots that violate the boundary freeze
- Permanent runtime changes before the study produces explicit evidence

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/resume.md` | Investigate | Potential touchpoint for the bounded study |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Investigate | Potential touchpoint for the bounded study |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Investigate | Potential touchpoint for the bounded study |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep the study additive to current Public authorities | The packet only proposes bounded experiments or shadow evaluation |
| REQ-002 | Define a bounded investigation question | The packet can end with adopt, prototype-later, or reject |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Name real current repo touchpoints | Potential touchpoints resolve in the current checkout |
| REQ-004 | Document decision criteria | The study defines what evidence supports adopt, prototype-later, or reject |
| REQ-005 | Document an exit condition | The packet can stop cleanly after one bounded study output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet answers the investigation question with bounded evidence.
- **SC-002**: The packet can end with adopt, prototype-later, or reject without reopening the full research train.
- **SC-003**: Touchpoints remain additive to current Public authorities.

### Acceptance Scenarios
1. **Given** the study starts, when experiments are defined, then they stay additive to current Public authorities.
2. **Given** the investigation ends, when the decision criteria are applied, then the packet concludes with adopt, prototype-later, or reject.
3. **Given** a prototype touches current runtime surfaces, when touchpoints are reviewed, then no backend replacement proposal is treated as in scope.
4. **Given** the exit condition is checked, when evidence is still weak, then the packet remains an investigation instead of being promoted prematurely.
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
| Scope | 14/25 | Bounded study design over current surfaces |
| Risk | 12/25 | Prototype drift risk |
| Research | 14/20 | Cross-phase synthesis and citation fidelity required |
| **Total** | **40/70** | **Level 2** |

## 10. OPEN QUESTIONS

- What evidence would immediately promote this study into an implementation packet?
- What failure signal would permanently reject this pattern for Public?
<!-- /ANCHOR:questions -->
