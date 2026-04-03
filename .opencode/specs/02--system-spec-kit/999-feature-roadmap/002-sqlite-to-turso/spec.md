---
title: "Feature Specification: SQLite-to-Turso Migration Research [02--system-spec-kit/999-sqlite-to-turso/spec]"
description: "Define the research scope, required outputs, and success criteria for evaluating Turso as a potential replacement for the current SQLite-based memory stack."
trigger_phrases:
  - "sqlite"
  - "turso"
  - "migration"
  - "research"
  - "spec"
  - "999"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: SQLite-to-Turso Migration Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-05 |
| **Branch** | `999-sqlite-to-turso` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec Kit Memory MCP server currently relies on a mature SQLite stack built around `better-sqlite3`, `sqlite-vec`, and FTS5. Before any migration work can be considered, the project needs a structured research package that evaluates whether Turso can meet functional, operational, and retrieval-quality requirements without introducing unacceptable risk.

### Purpose
Produce a decision-ready research specification that bounds the investigation, required deliverables, and evaluation criteria for a potential SQLite-to-Turso migration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the research objective for assessing Turso as a replacement for the current SQLite stack.
- Document required research deliverables and the core comparison areas they must cover.
- Capture explicit non-goals so the research effort does not drift into implementation.

### Out of Scope
- Building a prototype or changing production code in this spec folder.
- Executing benchmark runs or migration scripts as part of this root document set.
- Making a final architectural approval decision beyond preparing inputs for that decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/999-sqlite-to-turso/spec.md` | Modify | Align with Level 1 template structure and anchors. |
| `.opencode/specs/02--system-spec-kit/999-sqlite-to-turso/plan.md` | Create | Add implementation planning document required by the validator. |
| `.opencode/specs/02--system-spec-kit/999-sqlite-to-turso/tasks.md` | Create | Add task breakdown document required by the validator. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec must describe the current SQLite-based context and why a Turso evaluation is needed. | A reader can identify the current stack, the migration question, and the research objective from this document alone. |
| REQ-002 | The research deliverables must be explicitly defined. | The spec lists the expected analysis and recommendation outputs with enough detail to guide follow-on work. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The spec must separate research from implementation work. | Out-of-scope items clearly exclude code changes, prototyping, and migration execution. |
| REQ-004 | The spec must identify key evaluation dimensions for Turso. | Requirements or success criteria mention compatibility, search capability fit, and operational risk. |
| REQ-005 | The document set must validate cleanly as a Level 1 spec root. | `validate.sh` reports zero errors for this assigned root. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root spec folder validates with 0 errors using the project validator.
- **SC-002**: The research scope is narrow enough that future contributors can distinguish research-only outputs from implementation work.
- **SC-003**: The required deliverables explicitly cover architecture compatibility, search/retrieval implications, and migration risk.

### Acceptance Scenarios
- **Given** a contributor opens this spec root, **when** they read `spec.md`, **then** they can understand the migration question, scope, and expected outputs without consulting templates.
- **Given** the validator is run against this root, **when** it checks required files and template structure, **then** it reports no errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing research documents in `research/` | If the research artifacts drift from this spec, follow-on decisions may use inconsistent assumptions. | Keep this root focused on the canonical research objective and deliverable definitions. |
| Risk | Turso feature gaps may invalidate migration assumptions early | Medium | Require the research outputs to document known gaps such as indexing and FTS limitations. |
| Risk | Scope drift from research into implementation | Medium | Keep implementation, benchmarking, and execution explicitly out of scope in this spec root. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the eventual decision process require a Level 2 or Level 3 expansion after research is complete?
- Which Turso limitations are hard blockers versus acceptable trade-offs for the memory MCP use case?
<!-- /ANCHOR:questions -->

---
