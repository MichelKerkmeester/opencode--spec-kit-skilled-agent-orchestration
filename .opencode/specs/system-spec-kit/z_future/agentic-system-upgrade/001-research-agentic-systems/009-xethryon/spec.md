---
title: "Feature Specification: 009-xethryon Research Phase"
description: "Read-only Phase 2 research on the bundled Xethryon repository to extract evidence-backed recommendations for system-spec-kit around memory, reflection, autonomy, orchestration, and operator UX."
trigger_phrases:
  - "009-xethryon research spec"
  - "xethryon phase spec"
  - "system-spec-kit xethryon study"
importance_tier: "important"
contextType: "spec"
---
# Feature Specification: 009-xethryon Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 2 finishes the Xethryon research packet as a continuation, not a restart. It preserves the original 10 Phase 1 iterations, adds 10 new iterations focused on refactor, simplification, architecture, and UX questions, then rewrites the synthesis surfaces so later planning work can distinguish what to adopt from what to explicitly reject.

**Key Decisions**: Keep Phase 2 additive to Phase 1; preserve `external/` as read-only; repair the packet shell instead of closing out with a broken validator.

**Critical Dependencies**: Existing Phase 1 artifacts under `research/`, the bundled Xethryon checkout under `external/`, and the Spec Kit strict validator.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-10 |
| **Branch** | `main` |
| **Phase Folder** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`system-spec-kit` needs a grounded answer on which parts of the Xethryon fork are genuinely stronger patterns and which are only smoother packaging. Phase 1 focused mostly on direct feature adoption; without a second pass, later planning could mistake autonomy gloss or repo-local conveniences for better underlying architecture.

### Purpose
Produce a merged 20-iteration research packet that preserves all Phase 1 findings, adds 10 new Phase 2 iterations, and ends with a combined synthesis, dashboard, and state log that are ready for follow-on planning.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `external/README.md`, `external/XETHRYON_CONTEXT.md`, `external/XETHRYON_MODS.md`, and the relevant runtime files under `external/packages/opencode/src/`
- Direct comparison against local `system-spec-kit` memory, command, validation, and orchestration surfaces
- Creation of `research/iterations/iteration-011.md` through `research/iterations/iteration-020.md`
- Appending Phase 2 entries to `research/deep-research-state.jsonl`
- Overwriting `research/research.md` and `research/deep-research-dashboard.md` with merged Phase 1 plus Phase 2 outputs
- Phase-local packet-shell documentation required for strict validation and closeout

### Out of Scope
- Editing anything under `external/`
- Editing `system-spec-kit` runtime code or docs outside this phase folder
- Commits, pushes, or PR work
- Creating a sibling packet or moving the research to a different spec folder

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `phase-research-prompt.md` | Modify | Correct stale external-repo paths and packet references |
| `spec.md` | Create | Define the phase contract and success criteria |
| `plan.md` | Create | Record the continuation workflow and validation plan |
| `tasks.md` | Create | Track packet-shell, iteration, synthesis, and verification work |
| `checklist.md` | Create | Capture verification evidence |
| `decision-record.md` | Create | Record the additive continuation decision and validator-driven packet-shell repair |
| `implementation-summary.md` | Create | Close out the completed Phase 2 run |
| `research/iterations/iteration-011.md` through `research/iterations/iteration-020.md` | Create | Phase 2 iteration artifacts |
| `research/deep-research-state.jsonl` | Modify | Append Phase 2 state entries |
| `research/research.md` | Modify | Merge Phase 1 and Phase 2 findings |
| `research/deep-research-dashboard.md` | Modify | Report all 20 iterations and verdict totals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read the existing Phase 1 artifacts before writing Phase 2 outputs | Phase 2 outputs build on `research/iterations/iteration-001.md` through `research/iterations/iteration-010.md` instead of repeating them |
| REQ-002 | Keep all writes inside this phase folder | `git status --short` for this phase shows only packet-shell and research artifacts |
| REQ-003 | Create iteration files `011-020` without modifying `001-010` | New iteration files exist and the original Phase 1 files remain untouched |
| REQ-004 | Append Phase 2 state entries with a `phase` field | `research/deep-research-state.jsonl` ends with 10 new Phase 2 lines |
| REQ-005 | Produce a merged `research/research.md` that preserves all Phase 1 findings and adds Phase 2 findings | The final report includes combined totals, continued finding IDs, and a new refactor or pivot section |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | At least 4 of the 10 new iterations must address refactor, pivot, simplification, architecture, or UX questions | Phase 2 includes explicit refactor or pivot sections and verdicts |
| REQ-007 | Refresh the dashboard to cover all 20 iterations | `research/deep-research-dashboard.md` reports both phase-specific and combined totals |
| REQ-008 | Validate the phase packet after writing | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <phase>` reports success |

### Acceptance Scenarios

**Scenario 1 (REQ-001/REQ-005 - merged report preserves continuation lineage)**
- **Given** a future planner opens `research/research.md`
- **When** they review the executive summary, findings registry, and refactor or pivot recommendations
- **Then** they can distinguish which Xethryon patterns should be adopted, simplified, or explicitly rejected without re-reading the raw iteration set

**Scenario 2 (REQ-004/REQ-007 - dashboard and state log show a true Phase 2 continuation)**
- **Given** a future operator inspects `research/deep-research-dashboard.md` and `research/deep-research-state.jsonl`
- **When** they verify the final entries
- **Then** they can see that Phase 2 appended iterations `011-020` with `phase: 2` instead of replacing Phase 1 artifacts

**Scenario 3 (REQ-006 - refactor verdicts stay evidence-backed)**
- **Given** a future maintainer reviews the refactor-focused iterations
- **When** they compare the verdicts against the cited external and local subsystem evidence
- **Then** they can see why only one area landed as REFACTOR, three landed as SIMPLIFY, and the rest stayed KEEP rather than architecture hype

**Scenario 4 (REQ-005 - rejected pivots remain explicitly documented)**
- **Given** a future planner is tempted to copy Xethryon's autonomy or markdown-memory model wholesale
- **When** they inspect the merged report
- **Then** they can find the rejected recommendations and the counter-evidence that explains why system-spec-kit should not pivot there

**Scenario 5 (REQ-002 - packet shell remains phase-local)**
- **Given** a validator or reviewer checks the phase diff
- **When** they inspect the changed files
- **Then** they can confirm that only `009-xethryon/` docs and research artifacts changed and `external/` remained read-only

**Scenario 6 (REQ-008 - closeout is usable without replaying the session)**
- **Given** a future operator opens the phase folder cold
- **When** they read `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
- **Then** they can understand what Phase 2 did, how it was verified, and what follow-on planning question remains
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten new Phase 2 iterations exist under `research/iterations/` and are additive to the original ten.
- **SC-002**: The merged report records combined totals of 2 must-have, 8 should-have, 5 nice-to-have, and 5 rejected recommendations.
- **SC-003**: The merged report contains a dedicated `Refactor / Pivot Recommendations` section.
- **SC-004**: No file under `external/` was modified.
- **SC-005**: Strict phase validation passes after the packet-shell fixes and research closeout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing Phase 1 artifacts | Missing or contradictory Phase 1 context would make Phase 2 repetitive | Read Phase 1 synthesis, dashboard, state log, and all 10 iteration files first |
| Dependency | Bundled Xethryon checkout under `external/` | Missing or stale files would weaken the evidence base | Read runtime files directly and correct prompt references to current paths |
| Risk | Packet-shell validation drift | Could leave strong research outputs inside a failing phase packet | Add the missing phase docs and repair stale prompt references |
| Risk | Refactor findings drift into architecture hype | Could recommend large changes without enough evidence | Require explicit KEEP, REFACTOR, SIMPLIFY, or PIVOT verdicts and counterarguments |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research closeout validation should complete via phase-local markdown and JSONL checks only; it must not require runtime rebuilds or edits under `external/`.

### Security
- **NFR-S01**: The phase must remain read-only with respect to the bundled external repo and must not introduce secrets or environment-specific credentials into the artifacts.

### Reliability
- **NFR-R01**: The packet must be self-describing enough that a future maintainer can resume from the phase folder without reconstructing session context from chat history.

---

## 8. EDGE CASES

### Data Boundaries
- Empty continuation signal: if no new evidence emerges, the report must still preserve Phase 1 and document the lack of new signal honestly.
- Maximum iteration spread: if the full ten new iterations are used, the state log and dashboard must still remain additive rather than rewriting prior rows.

### Error Scenarios
- Validator failure after research completion: repair only the narrowest packet-local issue needed and rerun validation before claiming completion.
- Stale external path references: correct the phase prompt and packet shell to match the actual bundled checkout instead of forcing the research back through obsolete paths.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 17 phase-local files touched, 10 new iteration artifacts, 3 merged synthesis outputs |
| Risk | 12/25 | Research-only changes, but high documentation integrity requirements and strict validator expectations |
| Research | 18/20 | Requires comparison across external runtime, local Spec Kit architecture, and prior iteration lineage |
| Multi-Agent | 0/15 | No sub-agents allowed for this phase |
| Coordination | 10/15 | Continuation had to preserve Phase 1 outputs while satisfying strict packet validation |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 2 duplicates Phase 1 instead of extending it | M | L | Re-read all Phase 1 artifacts before authoring new iterations |
| R-002 | A polished Xethryon UX pattern is mistaken for better core architecture | H | M | Require explicit refactor verdicts with counter-evidence |
| R-003 | Strict validation fails after research is already complete | M | M | Repair packet-shell docs in place and rerun the validator |
| R-004 | Bare or stale markdown references break packet integrity | M | M | Normalize all file references to current phase-local paths |

---

## 11. USER STORIES

### US-001: Planner needs a merged adoption and rejection map (Priority: P0)

**As a** future system-spec-kit planner, **I want** one report that keeps Phase 1 adoption findings and adds Phase 2 refactor verdicts, **so that** I can decide what to implement next without rediscovering why certain Xethryon patterns were rejected.

**Acceptance Criteria**:
1. Given the merged report, when the planner reviews the findings registry, then they can see both retained Phase 1 findings and continued Phase 2 finding IDs.

---

### US-002: Operator needs continuation proof (Priority: P1)

**As a** future operator revisiting this phase, **I want** the dashboard and state log to show exactly how Phase 2 extended Phase 1, **so that** I can trust the lineage and avoid accidentally replacing prior work.

**Acceptance Criteria**:
1. Given the dashboard and JSONL state log, when the operator checks the tail of the artifacts, then they can see iterations `011-020` appended with `phase: 2`.

---

### US-003: Reviewer needs packet-local closeout evidence (Priority: P1)

**As a** reviewer validating the research packet, **I want** packet-shell docs that explain the scope, verification, and outcomes, **so that** the phase can close cleanly under strict validation without touching runtime code.

**Acceptance Criteria**:
1. Given the phase folder, when the reviewer opens the shell docs, then they can understand the work completed and the verification commands run without replaying the interactive session.

---

## 12. OPEN QUESTIONS

<!-- ANCHOR:questions -->

- None blocking this completed phase. The next open question is which follow-on packet should implement the combined claim-status, verification-evidence, and runtime-surface inventory model first.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Synthesis**: See `research/research.md`
- **Research Dashboard**: See `research/deep-research-dashboard.md`
