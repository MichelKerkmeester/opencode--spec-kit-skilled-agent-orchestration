---
title: "Feature Specification: Memory README Coverage Ownership Remediation [template:level_1/spec.md]"
description: "The Coverage by Command table in .opencode/command/memory/README.txt currently blurs primary tool ownership with helper-tool usage. This small documentation remediation narrows the section so readers can understand the table without changing any other README content."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "coverage"
  - "ownership"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Memory README Coverage Ownership Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-25 |
| **Branch** | `032-fix-memory-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `Coverage by Command` section in `.opencode/command/memory/README.txt` currently reports a single ownership-style count per command. That wording makes helper-tool usage look like direct ownership and leaves readers unsure why commands such as `/memory:learn` and `/memory:continue` appear with zero owned tools while still depending on other command surfaces.

### Purpose
Clarify the coverage table so it distinguishes primary ownership from helper-tool usage and add a short note below the table that explains how to read the revised counts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update only the `Coverage by Command` table in `.opencode/command/memory/README.txt`.
- Revise the table wording so primary ownership is separated from helper-tool usage.
- Add one explanatory note directly below the table describing how to interpret the revised counts.

### Out of Scope
- Any edits outside the `Coverage by Command` section in `.opencode/command/memory/README.txt` - the remediation is intentionally narrow.
- Changes to command behavior, tool routing, or ownership logic - this effort is documentation-only.
- Updates to other memory command files or spec folders - they are unaffected by this fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/memory/README.txt` | Modify | Adjust the coverage table labels and add a clarifying note below the table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `Coverage by Command` table must distinguish primary ownership from helper-tool usage. | The table headers and row values clearly separate tools a command primarily owns from tools it only uses through helper workflows. |
| REQ-002 | The remediation must stay limited to the `Coverage by Command` section. | A diff review shows that only the table and the note directly below it were edited in `.opencode/command/memory/README.txt`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A note below the table must explain how to interpret primary ownership versus helper-tool usage. | A reader can understand why some commands show zero primary-owned tools while still relying on helper tools. |

### Acceptance Scenarios

- **Given** a reader reviewing the `Coverage by Command` table, **when** they compare `/memory:analyze`, `/memory:manage`, `/memory:save`, `/memory:shared`, `/memory:learn`, and `/memory:continue`, **then** they can tell which counts represent primary ownership and which commands rely on helper tools.
- **Given** a reader sees a command with zero primary-owned tools, **when** they read the note below the table, **then** they understand that the command still participates through helper-tool usage rather than direct ownership.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The updated table wording no longer implies that helper-tool usage is the same as primary ownership.
- **SC-002**: The note below the table resolves ambiguity for commands that depend on helper tools without directly owning them.
- **SC-003**: The final diff is limited to the `Coverage by Command` section in `.opencode/command/memory/README.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing tool inventory in `.opencode/command/memory/README.txt` | Medium | Reuse the current command list and totals, changing only the ownership wording and note unless a count is clearly inconsistent. |
| Risk | The edit could accidentally expand into adjacent README sections | Low | Keep the implementation plan and tasks scoped to the table and the immediately following note only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at planning time. If the current counts are disputed during implementation, confirm them before editing the table text.
<!-- /ANCHOR:questions -->

---
