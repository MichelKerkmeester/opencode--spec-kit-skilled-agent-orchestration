---
title: "Feature Specification: 004-get-it-right-main Research Phase"
description: "Phase 3 deep research on the bundled Get It Right repository, focused on UX, commands, templates, agents, skills, hooks, and operator-facing workflow friction in system-spec-kit."
trigger_phrases:
  - "004-get-it-right-main spec"
  - "get it right phase 3 spec"
  - "system-spec-kit ux research spec"
importance_tier: "important"
contextType: "spec"
---
# Feature Specification: 004-get-it-right-main Research Phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-04-10 |
| **Phase Folder** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 and Phase 2 already established how Get It Right's retry controller works and which retry-loop mechanics are portable. What remained unclear was whether `system-spec-kit`'s operator-facing surface around commands, templates, agents, skills, gates, and hooks is now too fragmented compared with the external repo's much smaller public workflow.

### Purpose
Continue the existing research packet by adding iterations `021-030`, updating the merged synthesis, and turning the final output into a 30-iteration report that clearly distinguishes what `system-spec-kit` should merge, simplify, redesign, keep, or reject.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of the bundled Get It Right sources under `external/`
- Direct comparison against local command, template, agent, skill, gate, and hook surfaces under `.opencode/`
- Creation of iteration files `research/iterations/iteration-021.md` through `research/iterations/iteration-030.md`
- Appending Phase 3 entries to `research/deep-research-state.jsonl`
- Updating `research/research.md` and `research/deep-research-dashboard.md`
- Narrow packet-shell remediation required for strict validation

### Out of Scope
- Editing anything under `external/`
- Editing runtime code or docs outside this phase folder
- Commits, pushes, or PR work
- Rewriting iterations `001-020`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `phase-research-prompt.md` | Modify | Correct stale external path references to match the current packet layout |
| `spec.md` | Create | Define the Phase 3 packet contract |
| `plan.md` | Create | Record the continuation workflow and validation plan |
| `tasks.md` | Create | Track the completed Phase 3 research steps |
| `implementation-summary.md` | Create | Close out the completed Phase 3 run |
| `research/iterations/iteration-021.md` through `research/iterations/iteration-030.md` | Create | Phase 3 iteration artifacts |
| `research/deep-research-state.jsonl` | Modify | Append Phase 3 state rows |
| `research/research.md` | Modify | Merge Phase 1, Phase 2, and Phase 3 findings |
| `research/deep-research-dashboard.md` | Modify | Report all 30 iterations and verdict totals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve existing Phase 1 and Phase 2 artifacts | Iterations `001-020` remain untouched |
| REQ-002 | Add Phase 3 research iterations | Iterations `021-030` exist under `research/iterations/` |
| REQ-003 | Append Phase 3 state entries | `research/deep-research-state.jsonl` ends with 10 new `phase: 3` rows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Produce one merged synthesis | `research/research.md` reflects all 30 iterations and combined totals |
| REQ-005 | Produce one merged dashboard | `research/deep-research-dashboard.md` reports all 30 rows and updated verdict totals |

### Acceptance Scenarios

**Scenario 1**
- **Given** a future planner opens `research/research.md`
- **When** they review the Phase 3 section
- **Then** they can see which UX and system-design surfaces should be merged, simplified, redesigned, or kept

**Scenario 2**
- **Given** a future operator checks the state log and dashboard
- **When** they inspect the final rows
- **Then** they can confirm that Phase 3 appended iterations `021-030` rather than overwriting earlier work
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten new Phase 3 iterations exist and all include the required `UX / System Design Analysis` section.
- **SC-002**: The merged report records combined totals of 13 must-have, 13 should-have, 0 nice-to-have, and 4 rejected recommendations.
- **SC-003**: The dashboard reports Phase 3 verdict totals of MERGE 5, SIMPLIFY 2, KEEP 1, and REDESIGN 2.
- **SC-004**: `external/` remains read-only.
- **SC-005**: Strict phase validation passes after narrow packet-shell remediation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing Phase 1 and 2 artifacts | Without them, Phase 3 could repeat prior work | Re-read prior synthesis and iteration files before writing |
| Dependency | Bundled Get It Right checkout under `external/` | Missing files would weaken evidence | Read the real packet-local `external/agents/` and `external/docs/` paths |
| Risk | Packet-shell validation drift | Strong research could remain inside a structurally invalid packet | Add the missing baseline docs and repair stale prompt references |
| Risk | UX recommendations drift into vague taste | Could produce weak follow-on planning guidance | Tie every major recommendation to concrete repo surfaces and step-count friction |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the follow-on implementation packet collapse lifecycle commands into one primary `/spec_kit` entry point, or keep secondary commands for expert-only flows?
- Should future UX simplification work treat agent and skill consolidation as one program of work, or land them as separate change waves?
<!-- /ANCHOR:questions -->
