---
title: "Feature Specification: 006-ralph-main Research Phase Closeout"
description: "Complete Phase 3 of the Ralph research packet, preserve the prior 20 iterations, and repair the packet root so the phase is structurally valid for future continuation."
trigger_phrases:
  - "006-ralph-main spec"
  - "ralph research phase closeout"
  - "agentic systems ralph spec"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: 006-ralph-main Research Phase Closeout

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-10 |
| **Branch** | `999-agentic-system-upgrade` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `006-ralph-main` phase already contained two completed research waves and a packet-local external snapshot, but it was missing its root spec docs and still referenced stale `external/ralph-main/...` markdown paths in `phase-research-prompt.md`. Phase 3 also needed ten new UX and agentic-system iterations plus an updated merged synthesis.

### Purpose
Extend the Ralph research from 20 to 30 iterations, merge the findings into one canonical report, and leave the phase folder structurally valid for future continuation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `research/iterations/iteration-021.md` through `research/iterations/iteration-030.md`.
- Append Phase 3 rows to `research/deep-research-state.jsonl` and refresh `research/deep-research-dashboard.md`.
- Rewrite `research/research.md` as the merged Phase 1 + Phase 2 + Phase 3 synthesis.
- Restore packet-root docs and repair stale packet-local markdown references so strict validation can pass.

### Out of Scope
- Editing anything under `external/` because the snapshot is read-only.
- Implementing repo-wide `system-spec-kit` source changes outside this packet.
- Saving memory for this turn.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/iterations/iteration-021.md` ... `research/iterations/iteration-030.md` | Create | Phase 3 iteration artifacts |
| `research/deep-research-state.jsonl` | Modify | Append 10 Phase 3 state rows |
| `research/deep-research-dashboard.md` | Modify | Refresh 30-iteration dashboard and totals |
| `research/research.md` | Modify | Merge Phase 1, Phase 2, and Phase 3 synthesis |
| `phase-research-prompt.md` | Modify | Repair packet-local markdown references |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create | Restore packet baseline docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 3 research artifacts must be created without overwriting iterations `001-020`. | Iterations `021-030` exist, earlier iterations remain unchanged, and JSONL rows are appended rather than replaced. |
| REQ-002 | The canonical report and dashboard must reflect all 30 iterations. | `research/research.md` and `research/deep-research-dashboard.md` show merged totals and a dedicated Phase 3 section. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The packet root must become structurally valid for continuation. | `spec.md`, `plan.md`, and `tasks.md` exist and strict validation passes. |
| REQ-004 | Packet-local markdown references must resolve against the current folder layout. | `phase-research-prompt.md` points to `external/...` paths that exist inside this phase folder. |
| REQ-005 | Research conclusions must stay packet-local and evidence-backed. | All writes remain under `006-ralph-main/`, and the merged report preserves exact file-path evidence. |

### Acceptance Scenarios

**Scenario 1 (REQ-001/REQ-002 - append-only Phase 3 continuation)**
- **Given** a future operator resumes work in `006-ralph-main`
- **When** they open the packet root, dashboard, JSONL, and merged report
- **Then** the phase docs and research artifacts all agree on the 30-iteration state

**Scenario 2 (REQ-003/REQ-004 - packet validation repair)**
- **Given** a validator runs strict packet validation
- **When** the phase folder is checked after the write pass
- **Then** the packet-root docs exist, packet-local markdown references resolve, and the validator returns a clean structural result
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten new Phase 3 iterations exist and earlier research artifacts remain intact.
- **SC-002**: The state log, dashboard, and merged report all report the same Phase 3 and combined totals.
- **SC-003**: Strict validation passes on this exact phase folder after the write pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet-local external snapshot | Medium | Keep `external/` read-only and cite only observed files |
| Risk | Structural packet issues hidden behind research work | High | Restore missing root docs and validate after the research pass |
| Risk | Totals drift between iteration files, JSONL, dashboard, and report | Medium | Derive rollup values from the written iteration conclusions before closing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a future follow-on packet prototype the guided "start work" front door recommended in Phase 3?
- Should the lightweight lane proposal land first in workflow docs, command UX, or continuity artifacts?
<!-- /ANCHOR:questions -->
