---
title: "Feature [system-spec-kit/z_future/agentic-system-upgrade/002-agentic-adoption/015-worktree-and-pipeline-evaluation/spec]"
description: "Measure whether isolated worktrees, CI repair loops, or backlog-style pipelines add enough value in Public to justify any integration beyond current sk-git and finish workflows."
trigger_phrases:
  - "feature"
  - "specification"
  - "015-worktree-and-pipeline-evaluation"
  - "investigation"
importance_tier: "important"
contextType: "research"
---
# Feature Specification: 015 Worktree and Pipeline Evaluation

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
| **Branch** | `015-worktree-and-pipeline-evaluation` |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../014-multi-model-council-evaluation/spec.md` |
| **Successor Phase** | `../016-self-reflection-and-reconsolidation-study/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Public has enough research signal to justify a focused study for 015 worktree and pipeline evaluation, but not enough evidence for direct adoption. This child phase keeps the question bounded and additive.

### Purpose
Answer the remaining uncertainty for 015 worktree and pipeline evaluation with bounded experiments and a clear promote-or-reject outcome.

### Research Sources
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/research/archive/legacy-research-log/research-dashboard-legacy.md:5-13` - BMad Phase 1 adopted quality pipeline stages and repair loops but explicitly rejected per-story worktrees and sequential auto-merge as direct imports.
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/research/archive/legacy-research-log/research-dashboard-legacy.md:15-24` - Phase 2 kept lifecycle levels and memory architecture while studying thinner packaging and automation UX.
- `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/research/iterations/iteration-029.md:19-31` - Late synthesis identified a bundled workflow entrypoint, not worktree orchestration, as the highest-leverage UX improvement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compare one packet implementation flow under current `sk-git` and finish workflows against a shadow per-story worktree plan.
- Measure handoff friction, validation clarity, and repo churn with and without worktree isolation.
- Study whether a post-push repair loop can be represented as documentation and finish-workflow guidance before any runtime changes are proposed.

### Out of Scope
- Backend replacement or architecture pivots that violate the boundary freeze
- Permanent runtime changes before the study produces explicit evidence

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-git/SKILL.md` | Investigate | Potential touchpoint for the bounded study |
| `.opencode/skill/sk-git/references/finish_workflows.md` | Investigate | Potential touchpoint for the bounded study |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Investigate | Potential touchpoint for the bounded study |
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
