---
title: "Feature Specification: Phase 018 — Canonical Continuity Refactor [system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/spec]"
description: "Create the parent coordination packet for phase 018 so the research bundle, execution gates, and packet-level completion rules live in one canonical place."
trigger_phrases:
  - "phase 018"
  - "canonical continuity"
  - "root spec"
  - "026 graph and context optimization"
  - "six gates"
importance_tier: "critical"
contextType: "planning"
feature: "phase-006-canonical-continuity-refactor"
level: 2
status: planned
parent: "026-graph-and-context-optimization"
---
# Feature Specification: Phase 018 — Canonical Continuity Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 018 already contains substantial research, an implementation design, a 325-row resource map, and six populated child phase folders, but the root of the packet does not yet act like the authoritative parent spec folder. That leaves the packet without a canonical summary of what phase 018 is trying to deliver overall, how the six gates fit together, and what must be true before the full refactor can be considered complete.

Without root coordination docs, the packet is harder to validate, harder to resume, and easier to misread as either "research only" or "ready to execute everywhere at once." The parent packet needs to state the overall contract and explicitly route execution work into the child gates.

### Purpose
Turn `006-canonical-continuity-refactor/` into a real parent coordination packet whose root docs explain the overall refactor, the six execution gates, and the packet-wide completion rules without duplicating the child phase plans.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the overall phase 018 objective: move continuity from standalone memory-file primacy to canonical spec-doc continuity with a bounded legacy archive.
- Document the role of the root packet artifacts that already exist: `implementation-design.md`, `resource-map.md`, `research/research.md`, `verify-phases-review.md`, `phase-017-rerun-seed.md`, and `scratch/resource-map/*`.
- Add a phase documentation map that explains the purpose, order, and current status of Gates A through F.
- Define packet-wide sequencing, handoff, and completion rules so the six child phases can be executed as one coordinated program.

### Out of Scope
- Rewriting the six child phase specs, plans, tasks, or checklists. Those folders remain the execution surfaces for detailed gate work.
- Implementing runtime code, template changes, schema migrations, or rollout changes. This parent packet only coordinates that work.
- Normalizing every existing root research note or review artifact in this same change. This packet establishes the coordination layer first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Define the overall phase-018 contract and phase map. |
| `plan.md` | Create | Define sequencing, dependencies, and packet-level execution rules. |
| `tasks.md` | Create | Track the root coordination work and the six gate milestones. |
| `checklist.md` | Create | Add packet-level verification criteria for the parent folder. |
| `implementation-summary.md` | Create | Pre-build the parent closeout shell for the eventual packet summary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## Phase Documentation Map

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| A | `001-gate-a-prework/` | planned | Remove template and packet-prep blockers before any schema or runtime work starts. |
| B | `002-gate-b-foundation/` | planned | Rehearse the migration, add anchor-aware causal-edge fields, archive legacy rows, and expose archived-hit observability. |
| C | `003-gate-c-writer-ready/` | planned | Build the validator and writer-side substrate for canonical spec-doc continuity. |
| D | `004-gate-d-reader-ready/` | planned | Retarget search, context, and resume onto handover plus canonical continuity. |
| E | `005-gate-e-runtime-migration/` | planned | Promote the rollout state machine to canonical and align all command, agent, skill, and doc surfaces. |
| F | `006-gate-f-archive-permanence/` | planned | Decide whether the archived tier should retire, stay, or trigger follow-on refinement. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The root packet must define phase 018 as one coordinated refactor, not six unrelated folders. | `spec.md`, `plan.md`, and `tasks.md` describe the same overall goal and reference the six gates as the execution structure. |
| REQ-002 | The root packet must identify the real source artifacts that drive execution. | Parent docs explicitly point to `implementation-design.md`, `resource-map.md`, `research/research.md`, `phase-017-rerun-seed.md`, and `scratch/resource-map/*` as the grounding set. |
| REQ-003 | The six child folders must remain the detailed execution surfaces. | Parent docs summarize each gate but do not duplicate gate-level requirements, task breakdowns, or checklist evidence already owned by the child folders. |
| REQ-004 | The parent packet must make sequencing and completion rules explicit. | Parent docs state the gate order, major dependencies, and the packet-wide condition for closing phase 018. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The root packet should be resumable without re-reading every child folder first. | A reader can open the root docs and understand the overall objective, gate order, and next planning boundary within a few minutes. |
| REQ-006 | Packet-wide completion should stay honest about planned versus implemented work. | Parent docs clearly separate current planning artifacts from future implementation and verification evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root folder now explains what phase 018 is doing overall and how Gates A-F divide the work.
- **SC-002**: The parent packet gives a clear, grounded execution order from pre-work through permanence decision.
- **SC-003**: The child phase folders stay the owners of gate-level execution detail, while the parent folder owns packet-level coordination.
- **SC-004**: A future implementation pass can close phase 018 by following the parent packet and then closing the six child gates in order.

### Acceptance Scenarios
- **Given** a reader opens the root folder first, **when** they read `spec.md`, **then** they can understand the overall refactor and the six-gate shape without reconstructing it from the research notes.
- **Given** an implementer needs gate order and dependencies, **when** they read the parent packet, **then** they can see why Gate A must precede Gate B and why the work continues through Gate F.
- **Given** a reviewer wants to know where detailed work belongs, **when** they compare the parent packet to the child folders, **then** the parent packet acts as coordination only and the child folders remain the execution owners.
- **Given** phase 018 is resumed in a later session, **when** the operator starts from the parent packet, **then** the real grounding artifacts and current child folders are all discoverable from the root docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `implementation-design.md` | Without it, the parent packet loses the canonical design recommendation and gate intent. | Treat it as the executive design summary for the packet. |
| Dependency | `resource-map.md` and `scratch/resource-map/*` | Without them, the parent packet cannot speak concretely about surfaces, dependencies, or sequencing. | Keep the parent docs grounded to the existing map rather than restating the entire matrix. |
| Risk | Parent docs drift away from child phase truth | Medium | Keep root docs summary-only and defer gate-level detail changes to the child folders. |
| Risk | The packet is treated as completed when only planning exists | High | Keep status as planned and make packet-closeout criteria explicit in the parent plan and checklist. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should phase 018 remain a Level 2 coordination packet, or should it later be upgraded once packet-level architectural decisions need their own root ADR?
- Do the existing root research and review artifacts stay as-is, or should a follow-up pass normalize missing `findings/` references and other root-level integrity drift?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The root packet should let a reader understand the overall refactor and gate order without opening all six child folders first.
- **NFR-P02**: Packet-level coordination docs must stay concise enough to be useful as a resume surface, not another deep research artifact.

### Security
- **NFR-S01**: The parent packet must not imply that schema, archive, or rollout work can skip the safety proofs already defined in Gates A, B, E, and F.
- **NFR-S02**: Packet-level wording must preserve the copy-first and rollback-ready posture already established by the child gates.

### Reliability
- **NFR-R01**: The parent packet must remain synchronized with the six child phases and their current statuses.
- **NFR-R02**: Parent docs must point to artifacts that actually exist in this folder so resume and validation workflows stay trustworthy.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Partial packet execution: some gates may remain planned while others are implemented, so the parent packet must describe sequencing without implying uniform progress.
- Mixed artifact maturity: research, review, and execution docs may exist at different levels of completeness inside the same root folder.

### Error Scenarios
- A child phase changes scope materially: the parent packet must be updated so the phase map and sequencing still match reality.
- Root research artifacts reference files that do not exist: the parent packet should continue to point readers to the real existing grounding set instead of inheriting stale links.

### State Transitions
- Parent packet created before implementation starts: status remains planned even if the child folders are structurally complete.
- Gate closure out of order: the packet should treat skipped dependencies as a blocker, not as a bookkeeping detail.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | One parent coordination layer spanning six child gates and multiple root research artifacts. |
| Risk | 17/25 | Incorrect packet-level framing could mis-sequence safety-critical work across schema, writer, reader, and rollout gates. |
| Research | 12/20 | Research is already converged; this change translates that material into a parent coordination contract. |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
