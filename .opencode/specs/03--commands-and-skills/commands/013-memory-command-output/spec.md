---
title: "Feature Specification: Memory Command Dashboard Visual Design System [013-memory-command-output/spec]"
description: "Each of the 5 memory commands (context.md, save.md, manage.md, learn.md, continue.md) defines its own visual output format independently, producing 5 different visual languages...."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "command"
  - "dashboard"
  - "spec"
  - "036"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Memory Command Dashboard Visual Design System

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
| **Created** | 2026-02-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Each of the 5 memory commands (`context.md`, `save.md`, `manage.md`, `learn.md`, `continue.md`) defines its own visual output format independently, producing 5 different visual languages. Headers alternate between ALL CAPS and Title Case, box-drawing characters range from square to rounded to absent, status line key patterns are inconsistent, and icon usage mixes emoji, ASCII symbols, and nothing at all. This makes the system feel disjointed and degrades the user experience across all memory workflows.

### Purpose

Define a unified Memory Dashboard Visual Design System — a shared component library (headers, dividers, tables, status bars, box frames, metric displays) applied consistently across all 5 memory commands — to create a cohesive and professional CLI output experience.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define a visual design system reference document (shared template/component library for CLI output)
- Standardize headers, dividers, status lines, tables, and box frames across all 5 memory commands
- Update output templates in all 5 command files (`context.md`, `save.md`, `manage.md`, `learn.md`, `continue.md`)
- Ensure monospace/terminal-friendly rendering (minimum 80-character width)
- ASCII-only indicators — no emoji per project rules

### Out of Scope

- Changing command functionality or workflow logic — only visual output templates are modified
- MCP tool signatures or parameters — no API surface changes
- Memory database schema changes — data layer is not touched
- Implementation code changes — only documentation/template files are in scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/memory/context.md` | Modify | Update visual output templates to use shared design system |
| `.opencode/command/memory/save.md` | Modify | Update visual output templates to use shared design system |
| `.opencode/command/memory/manage.md` | Modify | Update visual output templates to use shared design system |
| `.opencode/command/memory/learn.md` | Modify | Update visual output templates to use shared design system |
| `.opencode/command/memory/continue.md` | Modify | Update visual output templates to use shared design system |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a shared visual component library covering headers, dividers, status lines, tables, and box frames | Reference document exists with all components fully defined and example output shown for each |
| REQ-002 | All 5 memory commands use a consistent header format | All command output headers follow the same capitalization, divider, and layout pattern |
| REQ-003 | All 5 memory commands use a consistent status line format | All status lines follow the `STATUS=<OK\|FAIL> [KEY=value]...` pattern with no deviations |
| REQ-004 | All 5 memory commands use a consistent divider style | The same box-drawing characters are used in all dividers across every command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All table output follows a consistent format (pipe tables vs key-value blocks) | Visual comparison across commands shows uniform table style |
| REQ-006 | Consistent icon/indicator system using ASCII only — no emoji | No emoji characters appear in any output template across all 5 files |
| REQ-007 | Clear visual hierarchy in output (Header > Section > Content > Status) | Reading any command's output flows naturally through the defined hierarchy |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Visual comparison of all 5 command outputs shows consistent formatting patterns — headers, dividers, status lines, and tables match the shared design system
- **SC-002**: Zero emoji characters present in any output template across all 5 command files
- **SC-003**: All status lines across all 5 commands follow the unified `STATUS=<OK|FAIL> [KEY=value]...` format
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Large scope — 5 files with approximately 150 output templates across all subcommands | Med | Define the design system reference document first, then apply changes methodically file by file |
| Risk | Output changes could disorient existing users familiar with the current formats | Low | Maintain identical information density; only standardize visual presentation, not content |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Output rendering must work correctly in any monospace terminal at 80 or more character width

### Security

- **NFR-S01**: No sensitive data in output templates — already compliant, no changes required

### Reliability

- **NFR-R01**: Output templates must render correctly regardless of terminal emulator, provided UTF-8 box-drawing character support is available
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty data: All 5 commands must display a consistent "no results" or empty-state message using the shared format
- Long content: Define explicit truncation rules for titles, paths, and content previews — maximum display length and ellipsis convention
- Invalid format: Not applicable — edge cases are presentational only, no input validation involved

### Error Scenarios

- Terminal width below 80 characters: Output must degrade gracefully — wrap or truncate rather than break layout
- Unicode unavailable: Box-drawing characters require UTF-8; define a plain-ASCII fallback for environments without UTF-8 support

### State Transitions

- Partial completion: Not applicable — output templates are stateless; no partial render scenarios
- Session expiry: Not applicable — output templates are rendered synchronously
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 5 files, approximately 150-200 LOC of template changes across 1 system |
| Risk | 8/25 | Documentation-only changes, no runtime impact, no breaking API changes |
| Research | 5/20 | All patterns already analyzed — no further investigation needed |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — analysis of all 5 commands is complete and all inconsistencies are fully documented
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
