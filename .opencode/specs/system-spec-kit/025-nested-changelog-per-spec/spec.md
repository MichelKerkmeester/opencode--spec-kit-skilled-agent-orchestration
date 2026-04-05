---
title: "Feature Specification: Nested Changelog Per Spec [system-spec-kit/025-nested-changelog-per-spec/spec]"
description: "Adds packet-local changelog generation to system-spec-kit so spec roots and nested phase folders can keep their own chronological change history alongside implementation summaries."
trigger_phrases:
  - "nested changelog"
  - "spec packet changelog"
  - "phase changelog"
  - "025"
  - "system spec kit"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Nested Changelog Per Spec

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

System Spec Kit now supports a second changelog mode that lives inside a packet, not just at the global component-release layer. The new workflow adds a nested changelog generator, packet/phase templates, and command guidance so spec roots and nested phase folders can produce packet-local history without replacing `implementation-summary.md`.

**Key Decisions**: keep nested changelog generation additive to implementation summaries, and route generation through a dedicated script plus packet-aware command instructions rather than overloading the existing release-note flow.

**Critical Dependencies**: existing spec packet structure, implementation-summary/task/checklist content quality, and command docs that point to the new generator correctly.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
System Spec Kit already had `implementation-summary.md`, but packet-local changelog history was ad hoc and drift-prone. Packet `024-compact-code-graph` had manual changelog files with no canonical generator, no shared templates, and no command-level guidance for when to create a root changelog versus a phase changelog.

### Purpose
Ship a packet-aware changelog workflow that can derive a nested changelog for a spec root or child phase folder, store it under the parent packet's `changelog/` directory, and teach `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` when to use it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a dedicated nested changelog generator for packet roots and child phase folders.
- Add canonical changelog templates for packet-root and phase-child output.
- Update command, skill, template, and reference surfaces so the new workflow is discoverable and repeatable.

### Out of Scope
- Replacing `implementation-summary.md` with changelog output. The summary remains required.
- Making nested changelog generation a universal hard gate in validation for every packet regardless of workflow context.
- Rewriting historical packet changelogs beyond documenting the new canonical approach.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts` | Create | Generate nested changelog payloads and markdown for packet roots and child phases |
| `.opencode/skill/system-spec-kit/templates/changelog/root.md` | Create | Canonical packet-root changelog template |
| `.opencode/skill/system-spec-kit/templates/changelog/phase.md` | Create | Canonical phase changelog template |
| `.opencode/command/create/changelog.md` | Modify | Add nested spec/phase changelog mode beside global release-note mode |
| `.opencode/command/spec_kit/implement.md` | Modify | Instruct nested changelog generation when target folder is packet-aware |
| `.opencode/command/spec_kit/complete.md` | Modify | Instruct nested changelog generation during closeout for packet roots and phases |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Document nested changelog workflow in core skill guidance |
| `.opencode/skill/system-spec-kit/references/workflows/nested_changelog.md` | Create | Canonical workflow reference for packet-local changelogs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add a packet-local nested changelog generator | A script can resolve a spec root or child phase folder and derive nested changelog data without manual path assembly |
| REQ-002 | Preserve `implementation-summary.md` as a separate artifact | Docs and command instructions explicitly state nested changelog is additive, not a replacement |
| REQ-003 | Support both root and phase output targets | Root output is `<spec-root>/changelog/changelog-<packet>-root.md`; phase output is `<spec-root>/changelog/changelog-<packet>-<phase-folder>.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Update creation and completion command surfaces | `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` document when nested changelog generation should run |
| REQ-005 | Add canonical templates and references | Packet changelog templates plus workflow/template/reference docs are updated and consistent |
| REQ-006 | Verify the implementation | Build and focused nested changelog tests pass from the scripts workspace |
| REQ-007 | Keep packet-local writes inside approved spec directories | Nested changelog generation uses the existing approved spec-folder resolution and path-validation helpers before writing files |
| REQ-008 | Distinguish nested packet history from global release-note history | Documentation and workflow guidance clearly separate packet-local nested mode from the existing global `/create:changelog` release-note mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A spec root or child phase can produce a packet-local changelog with no manual filename decisions.
- **SC-002**: System Spec Kit docs make it clear that nested changelog output complements `implementation-summary.md`.
- **SC-003**: Command guidance consistently points packet-aware workflows at the nested changelog generator.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing packet document quality | Sparse implementation summaries or task/checklist details yield sparse changelog bullets | Derive from multiple packet docs and keep fallback copy explicit when sections are missing |
| Dependency | Packet folder conventions | Incorrect phase/root detection would write files into the wrong directory | Centralize mode detection and output-path logic in one generator |
| Risk | Confusion with global release changelog command | Users could assume `/create:changelog` still only creates release-note artifacts | Add explicit nested mode language and conditions to command docs and assets |
| Risk | Over-enforcing changelog creation | Turning packet changelogs into a universal validator hard requirement would create avoidable friction | Keep generation workflow-aware in commands instead of forcing a validator gate in this packet |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Nested changelog generation logic lives in one script and uses canonical templates.

### Reliability
- **NFR-R01**: Path resolution must stay inside approved spec directories and handle both root packets and phase folders.

### Documentation Quality
- **NFR-D01**: Skill, template, reference, and command docs must describe the same workflow and file naming rules.

---

## 8. EDGE CASES

### Packet Structure
- Root packet with no child phases still needs a valid `changelog-<packet>-root.md`.
- Child phase changelog output must be written to the parent packet's `changelog/` directory, not inside the phase folder.

### Content Extraction
- Missing checklist or verification details should not crash generation; the output should fall back to explicit placeholder text.
- Bare packet names and explicit paths should both resolve if they point to approved spec directories.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Code, templates, command assets, skill docs, references |
| Risk | 16/25 | Workflow drift and wrong output placement would confuse packet closeout |
| Research | 10/20 | Existing packet `024` changelog conventions had to be analyzed before standardizing |
| Multi-Agent | 6/15 | Parallel exploration plus packet documentation closeout |
| Coordination | 9/15 | Skill, command, template, and packet behavior all needed alignment |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Nested changelog mode conflicts with existing release-note expectations | Medium | Medium | Separate nested and global modes in command docs and assets |
| R-002 | Generator writes to the wrong path for phase folders | High | Low | Detect root vs phase centrally and test both output patterns |
| R-003 | Docs imply automatic validator enforcement that does not exist | Medium | Low | Document workflow-triggered generation only |

---

## 11. USER STORIES

### US-001: Packet Maintainer Gets Root History (Priority: P0)

**As a** packet maintainer, **I want** to generate a packet-root changelog, **so that** I can capture root-level milestones without hand-writing filenames or format.

**Acceptance Criteria**:
1. Given a packet root, when nested changelog generation runs, then it writes `changelog-<packet>-root.md` under that packet's `changelog/` folder.
- **Given** a packet root with `implementation-summary.md`, `tasks.md`, and `checklist.md`, **When** nested changelog generation runs in root mode, **Then** it derives packet history without requiring a hand-written output file.
- **Given** a packet root with no child phases, **When** nested changelog generation runs, **Then** it still produces a valid root changelog file in the packet `changelog/` directory.

---

### US-002: Phase Owner Adds Packet-Scoped Phase History (Priority: P0)

**As a** phase owner, **I want** my phase work summarized into the parent packet changelog directory, **so that** all packet history stays in one place.

**Acceptance Criteria**:
1. Given a child phase folder, when nested changelog generation runs, then it writes `changelog-<packet>-<phase-folder>.md` under the parent packet's `changelog/` folder.
- **Given** a direct child phase folder, **When** nested changelog generation runs, **Then** the output file is written to the parent packet `changelog/` directory instead of the phase folder.
- **Given** a phase folder with sparse checklist detail, **When** nested changelog generation runs, **Then** it falls back to explicit placeholder copy instead of failing path generation.

---

### US-003: Command User Gets the Right Changelog Mode (Priority: P1)

**As a** command user, **I want** `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` to tell me when nested changelog mode applies, **so that** I do not confuse packet history with global release notes.

**Acceptance Criteria**:
1. Given a packet-aware workflow, when I read the command docs and assets, then nested changelog guidance is explicit and consistent.
- **Given** `/create:changelog` is used for a packet root or child phase, **When** the command guidance is read, **Then** nested packet mode is described separately from the global release-note mode.
- **Given** `/spec_kit:implement` or `/spec_kit:complete` targets a packet-aware folder, **When** the closeout steps are followed, **Then** they instruct nested changelog generation in addition to `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/implementation-summary.md`.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None at closeout. The shipped scope intentionally stops at workflow guidance and generator support, not validator enforcement.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
