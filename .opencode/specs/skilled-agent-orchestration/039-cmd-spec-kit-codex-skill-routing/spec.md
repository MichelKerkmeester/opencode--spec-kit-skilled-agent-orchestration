---
title: "Feature Specification: Codex command discoverability routing update [03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/spec]"
description: "This packet already contains research that recommended a four-command first-touch shortlist. The Level 1 docs now need to preserve that finding, record the user's expanded all-commands override, and define the downstream quick-reference update honestly."
trigger_phrases:
  - "codex command discoverability"
  - "system-spec-kit shortlist"
  - "quick reference start here"
  - "memory command routing"
  - "039 spec"
importance_tier: "normal"
contextType: "research"
---
# Feature Specification: Codex command discoverability routing update

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Research complete, implementation direction updated |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research packet in `research/` already answered the core question: Codex does not mainly lack command docs. The higher-value fix is better placement in the first-touch surface that `system-spec-kit` already loads, especially when runtime UI command surfaces are weak or absent.

That research converged on a minimal four-command shortlist. The user later overrode that recommendation with, "add all commands though in short list," so this packet now needs to preserve the original finding and record the chosen broader implementation direction without blurring the difference between the two.

### Purpose
Record the completed research outcome, document the explicit user override, and define the downstream quick-reference and skill-pointer update scope without claiming that the downstream files were changed in this packet update.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update the existing Level 1 packet docs in this spec folder.
- Keep the research record honest that the minimal recommendation was a four-command shortlist.
- Record the approved expanded all-commands short list for the downstream quick reference.
- Preserve the rule that the quick reference is the primary surface and `.opencode/skill/system-spec-kit/SKILL.md` should only point to it.
- Reflect that downstream quick-reference and skill-pointer updates are now the intended implementation scope.

### Out of Scope
- Creating new command docs or a new command registry.
- Duplicating the full quick-reference matrix inside `.opencode/skill/system-spec-kit/SKILL.md`.
- Changing command behavior or command semantics.
- Creating new files in this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/spec.md` | Modify | Capture the original research finding and the approved override |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/plan.md` | Modify | Define the packet update and downstream docs-update scope |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/tasks.md` | Modify | Track the scoped packet refresh work |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/implementation-summary.md` | Modify | Record what changed in the packet and what remains downstream |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/research/research.md` | Modify | Preserve the research recommendation while noting the chosen implementation direction |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec docs must state that the main issue is discoverability placement, not missing command documentation | `spec.md` names discoverability placement as the root problem and names the quick reference as the primary fix location |
| REQ-002 | The packet must preserve the original research recommendation honestly | The docs state that the minimal research recommendation was the four-command shortlist: `/spec_kit:resume`, `/spec_kit:plan`, `/memory:search`, and `/memory:save` |
| REQ-003 | The packet must record the approved implementation override | The docs state that the chosen direction is an expanded all-commands short list because the user asked to "add all commands though in short list" |
| REQ-004 | The packet must include the exact expanded command surface | The docs list all 12 commands: `/spec_kit:resume`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:debug`, `/spec_kit:handover`, `/spec_kit:deep-research`, `/spec_kit:deep-review`, `/memory:save`, `/memory:search`, `/memory:manage`, and `/memory:learn` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The docs must identify the primary downstream target file and the secondary pointer rule | The recommendation names the system-spec-kit quick reference as primary and states that `.opencode/skill/system-spec-kit/SKILL.md` should only point to it, not duplicate the whole matrix |
| REQ-006 | The docs must reflect that downstream docs updates are now in scope without overstating completion | `spec.md`, `plan.md`, `implementation-summary.md`, and `research/research.md` all distinguish packet updates from downstream execution |
| REQ-007 | The files must stay validator-friendly and free of placeholders | The existing Level 1 files remain present, contain real content, and pass spec validation with no placeholder or missing-file errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can open this folder and immediately understand both the original research recommendation and the later user override.
- **SC-002**: The recommended downstream change is unambiguous: the quick reference becomes the primary all-commands short list surface, while `.opencode/skill/system-spec-kit/SKILL.md` stays a pointer only.
- **SC-003**: The minimal four-command recommendation is still recorded exactly as `/spec_kit:resume`, `/spec_kit:plan`, `/memory:search`, and `/memory:save`.
- **SC-004**: The approved expanded command surface is recorded exactly as the eight `spec_kit` commands and four `memory` commands listed in REQ-004.
- **SC-005**: The folder validates as a complete Level 1 packet.

### Acceptance Scenarios

**Given** a future implementer opens this spec folder, **when** they read the Level 1 docs, **then** they can identify the exact minimal research recommendation, the exact approved all-commands list, and the fact that the quick reference remains the primary downstream target.

**Given** a reviewer checks whether this packet overreaches, **when** they inspect the scope and requirements, **then** they see that the work stays limited to this packet update and does not invent new command docs or duplicate the full matrix inside `.opencode/skill/system-spec-kit/SKILL.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The existing research packet remains the source of truth for the completed investigation | If it changes later, these summary docs can drift | Keep the packet aligned with the recorded research finding and decision update |
| Risk | The expanded all-commands short list becomes too verbose to scan quickly | The quick reference can lose first-touch clarity | Keep each command description to one short line and group commands by surface |
| Risk | The skill-file pointer turns into duplicated command inventory | Discoverability docs drift over time | Limit `.opencode/skill/system-spec-kit/SKILL.md` to a short pointer back to the quick reference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What final heading should the expanded quick-reference block use so it still reads like a short first-touch surface?
- Should the grouped all-commands short list lead with `spec_kit` first, `memory` first, or a mixed urgency order?
<!-- /ANCHOR:questions -->

---
