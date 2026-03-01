---
title: "Feature Specification: Memory Overhaul & Agent Upgrade Release [130-memory-overhaul-and-agent-upgrade-release/spec]"
description: "Umbrella specification coordinating documentation alignment across 11 source specs (014–016 agent system, 122–129 spec-kit system) that have been implemented but whose documenta..."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "overhaul"
  - "agent"
  - "spec"
  - "130"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Memory Overhaul & Agent Upgrade Release

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Umbrella specification coordinating documentation alignment across 11 source specs (014–016 agent system, 122–129 spec-kit system) that have been implemented but whose documentation artifacts — READMEs, SKILL.md files, command configs, agent configs, changelogs — have not been audited for cross-referential consistency. This spec produces 7 subtask specifications; future agents execute the actual alignment work.

**Key Decisions**: Specification-only output (no code changes), 7-subtask decomposition with dependency ordering, multi-track changelog consolidation

**Critical Dependencies**: All 11 source specs must be implemented before audit begins
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec** | 130 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Specs 014–016 (agent system) and 122–129 (spec-kit system) have been implemented across 200+ files, but their documentation artifacts contain stale counts (e.g., "4 sources" instead of 5), wrong version numbers, missing feature descriptions (upgrade-level, auto-populate, anchor tags), and outdated architecture references. Additionally, spec 126 post-implementation hardening (MCP server import path fixes, memory-index specFolder boundary filtering, memory-save document_type/spec_level preservation, vector-index metadata updates, causal edge conflict-update semantics) is not documented in spec 130 context. No systematic audit has been performed to ensure cross-referential consistency.

### Purpose
Produce a complete set of specification documents (7 subtask specs with checklists) that enable future agents to systematically audit and align all documentation artifacts to reflect the current post-implementation state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 subtask specification folders (each with Level 3+ doc set: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, plus changes.md for implementers)
- Root umbrella Level 3+ documentation (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, README.md)
- Consolidated changelog reference covering all 11 source specs
- Dependency ordering and self-contained task specifications

### Out of Scope
- Actual file edits to READMEs, SKILL.md, commands, agents — deferred to implementation phase
- Code changes to MCP server, scripts, or shared utilities
- Test creation or modification
- Git tagging or GitHub release execution

### Task Breakdown & Dependency Chain

The specification defines 7 tasks executed in dependency order:

**Phase 1 - Parallel Audits (Tasks 01-04)**: These 4 tasks run in parallel with no inter-dependencies:
- **Task 01 (README Audit)**: Audit 60+ README files across .opencode/ to reflect 5-source pipeline, 7 intent types, schema v13, document-type scoring, specs 122-129 features, and spec 126 MCP server hardening (import path fixes, specFolder filtering, document_type/spec_level preservation, vector metadata updates, causal edge stability)
- **Task 02 (SKILL Audit)**: Verify system-spec-kit SKILL.md and 7 reference files document upgrade-level.sh, auto-populate workflow, check-placeholders.sh, anchor tag conventions, and spec 126 MCP server hardening details
- **Task 03 (Command Audit)**: Verify 9 command .md files and YAML assets reflect spec 014 agent routing, spec 128 script references, and memory command 5-source pipeline descriptions
- **Task 04 (Agent Audit)**: Ensure 24 agent configs across 3 platforms (OpenCode, Claude Code, Codex) match spec 016 requirements: Handover=Haiku, Review=model-agnostic, Codex-native frontmatter

**Phase 2 - Changelog Creation (Task 05)**: Blocked by all Phase 1 tasks completing:
- **Task 05 (Changelog Creation)**: Create 3 changelog entries (environment v2.1.0.0, spec-kit v2.2.19.0, agents v2.0.4.0) documenting alignment work identified in Tasks 01-04

**Phase 3 - Root README Update (Task 06)**: Blocked by Task 05:
- **Task 06 (Root README Update)**: Update root README.md statistics table, Memory Engine description (5 sources, 7 intents), Spec Kit feature list, and Agent System counts to reflect post-alignment state

**Phase 4 - Release (Task 07)**: Blocked by Task 06:
- **Task 07 (GitHub Release)**: Create git tag v2.1.0.0 and GitHub release with notes covering Agent Updates, Spec-Kit Updates, and Documentation Updates from all prior tasks

### Files to Create

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `130-*/README.md` | Create | Executive overview with dependency graph and task summaries |
| `130-*/spec.md` | Create | Level 3+ umbrella specification with governance sections |
| `130-*/plan.md` | Create | 7-task coordination approach |
| `130-*/tasks.md` | Create | 19 tasks across 7 workstreams with dependencies |
| `130-*/checklist.md` | Create | Root verification checklist with P0/P1/P2 items |
| `130-*/decision-record.md` | Create | Umbrella coordination decisions |
| `130-*/implementation-summary.md` | Create | Post-execution summary template |
| `130-*/changelog-reference.md` | Create | Consolidated changelog from 11 source specs |
| `130-*/task-01-*/spec.md` | Create | Level 3+ README audit specification |
| `130-*/task-01-*/plan.md` | Create | README audit implementation approach |
| `130-*/task-01-*/tasks.md` | Create | README audit task breakdown |
| `130-*/task-01-*/checklist.md` | Create | Level 3+ README audit checklist |
| `130-*/task-01-*/decision-record.md` | Create | README audit scope decisions |
| `130-*/task-01-*/implementation-summary.md` | Create | Post-audit summary template |
| `130-*/task-01-*/changes.md` | Create | Empty template for implementer to populate |
| `130-*/task-02-*/spec.md` | Create | Level 3+ SKILL.md audit specification |
| `130-*/task-02-*/plan.md` | Create | SKILL audit implementation approach |
| `130-*/task-02-*/tasks.md` | Create | SKILL audit task breakdown |
| `130-*/task-02-*/checklist.md` | Create | Level 3+ SKILL audit checklist |
| `130-*/task-02-*/decision-record.md` | Create | SKILL audit criteria decisions |
| `130-*/task-02-*/implementation-summary.md` | Create | Post-audit summary template |
| `130-*/task-02-*/changes.md` | Create | Empty template for implementer to populate |
| `130-*/task-03-*/spec.md` | Create | Level 3+ command configs audit specification |
| `130-*/task-03-*/plan.md` | Create | Command audit implementation approach |
| `130-*/task-03-*/tasks.md` | Create | Command audit task breakdown |
| `130-*/task-03-*/checklist.md` | Create | Level 3+ command audit checklist |
| `130-*/task-03-*/decision-record.md` | Create | Command scope decisions |
| `130-*/task-03-*/implementation-summary.md` | Create | Post-audit summary template |
| `130-*/task-03-*/changes.md` | Create | Empty template for implementer to populate |
| `130-*/task-04-*/spec.md` | Create | Level 3+ agent configs audit specification |
| `130-*/task-04-*/plan.md` | Create | Agent audit implementation approach |
| `130-*/task-04-*/tasks.md` | Create | Agent audit task breakdown |
| `130-*/task-04-*/checklist.md` | Create | Level 3+ agent audit checklist |
| `130-*/task-04-*/decision-record.md` | Create | Platform scope decisions |
| `130-*/task-04-*/implementation-summary.md` | Create | Post-audit summary template |
| `130-*/task-04-*/changes.md` | Create | Empty template for implementer to populate |
| `130-*/task-05-*/spec.md` | Create | Level 3+ changelog creation specification |
| `130-*/task-05-*/plan.md` | Create | Changelog implementation approach |
| `130-*/task-05-*/tasks.md` | Create | Changelog task breakdown |
| `130-*/task-05-*/checklist.md` | Create | Level 3+ changelog checklist |
| `130-*/task-05-*/decision-record.md` | Create | Version numbering decisions |
| `130-*/task-05-*/implementation-summary.md` | Create | Post-changelog summary template |
| `130-*/task-05-*/changes.md` | Create | Empty template for implementer to populate |
| `130-*/task-06-*/spec.md` | Create | Level 3+ root README update specification |
| `130-*/task-06-*/plan.md` | Create | README update implementation approach |
| `130-*/task-06-*/tasks.md` | Create | README update task breakdown |
| `130-*/task-06-*/checklist.md` | Create | Level 3+ README update checklist |
| `130-*/task-06-*/decision-record.md` | Create | Changelog structure decisions |
| `130-*/task-06-*/implementation-summary.md` | Create | Post-update summary template |
| `130-*/task-06-*/changes.md` | Create | Empty template for implementer to populate |
| `130-*/task-07-*/spec.md` | Create | Level 3+ release specification |
| `130-*/task-07-*/plan.md` | Create | Release implementation approach |
| `130-*/task-07-*/tasks.md` | Create | Release task breakdown |
| `130-*/task-07-*/checklist.md` | Create | Level 3+ release checklist |
| `130-*/task-07-*/decision-record.md` | Create | Version strategy decisions |
| `130-*/task-07-*/implementation-summary.md` | Create | Post-release summary template |
| `130-*/task-07-*/changes.md` | Create | Empty template for implementer to populate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 task folders created with spec.md, checklist.md, and changes.md | 21 task files exist in correct directory structure |
| REQ-002 | changelog-reference.md covers all 11 source specs | Every spec 014–016 and 122–129 referenced with version number, date, and file count |
| REQ-003 | Each task spec is self-contained | Agent can execute task without reading other specs or external context |
| REQ-004 | Root spec.md follows Level 3+ template | All ANCHOR tags, frontmatter, and sections present |
| REQ-005 | Dependency ordering consistent | README, spec.md, and task specs all show same dependency graph |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each task spec lists explicit file paths | No wildcards — every audit target file listed by full path |
| REQ-007 | Each checklist has P0/P1/P2 items | Priority tiers used consistently across all 7 checklists |
| REQ-008 | Cross-references between sibling documents correct | README links to spec.md and changelog-reference.md resolve |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 24 files exist in the correct directory tree with no empty placeholder content
- **SC-002**: Every spec.md has appropriate SPECKIT_LEVEL frontmatter
- **SC-003**: Each task spec lists enough detail for an agent to execute independently
- **SC-004**: changelog-reference.md has zero gaps across the 11 source specs
- **SC-005**: Dependency ordering is consistent across all documents
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All 11 source specs implemented | Cannot audit unimplemented features | Verify implementation status before audit |
| Risk | Scope creep into implementation | Spec-only umbrella becomes implementation | Strict scope enforcement: no file edits outside 130/ |
| Risk | Incomplete source audit | Missing features in task specs | Cross-reference every changelog entry against task specs |
| Risk | Version conflicts across tracks | Inconsistent version references | changelog-reference.md as single source of truth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- **NFR-D01**: All spec documents follow SpecKit template conventions
- **NFR-D02**: No unfilled placeholders (like PLACEHOLDER or TODO in brackets) in any delivered file

### Self-Containment
- **NFR-S01**: Each task spec provides enough context for an agent to execute without reading other task specs
- **NFR-S02**: File paths are absolute relative to project root (no wildcards)

### Consistency
- **NFR-C01**: Dependency graph identical across README, spec.md, and all task spec blocked-by fields
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Spec 129 (Pending)
- Spec 129 (anchor tags) may not be fully implemented at audit time
- Task specs should note spec 129 status and include conditional audit criteria

### Cross-Track Version Overlap
- Spec 016 appears in both agent-orchestration (v2.0.3.0) and opencode-environment (v2.0.4.0) changelogs
- changelog-reference.md must clearly attribute both entries
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 24, Tracks: 3, Systems: 4 (README, SKILL, commands, agents) |
| Risk | 15/25 | Cross-referential consistency, version conflicts, scope creep |
| Research | 15/20 | Deep audit of 11 source specs and 200+ documentation files |
| Multi-Agent | 12/15 | 7 subtasks, 4 parallel + 3 sequential workstreams |
| Coordination | 12/15 | 3-track changelog consolidation, dependency ordering |
| **Total** | **74/100** | **Level 3+** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Scope creep into implementation edits | H | M | Strict 130/ folder boundary enforcement |
| R-002 | Incomplete source spec audit | H | L | Systematic changelog cross-reference |
| R-003 | Version number conflicts across tracks | M | M | changelog-reference.md as SSOT |
| R-004 | Spec 129 incomplete at audit time | L | M | Conditional audit criteria in task specs |
| R-005 | Task specs not self-contained | M | L | Review pass checking agent executability |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Documentation Consistency Audit (Priority: P0)

**As a** maintainer, **I want** spec documents that define exactly what to audit in each documentation artifact, **so that** agents can execute alignment work systematically without ad-hoc decisions.

**Acceptance Criteria**:
1. **Given** a task spec, **When** an agent reads it, **Then** the agent can identify every file to audit and every criterion to check
2. **Given** all 7 task specs, **When** executed in dependency order, **Then** all documentation artifacts are aligned to post-implementation state

### US-002: Changelog Consolidation (Priority: P1)

**As a** maintainer, **I want** a single consolidated changelog reference, **so that** I can verify version numbers and feature coverage across all 3 tracks without opening 11 individual changelogs.

**Acceptance Criteria**:
1. **Given** changelog-reference.md, **When** I look up any source spec, **Then** I find its version number, date, file count, and key changes
2. **Given** all 3 track changelogs, **When** I compare version numbers, **Then** cross-track references are consistent and no spec is missing

### US-003: Self-Contained Task Specifications (Priority: P0)

**As an** agent executor, **I want** each task spec to contain all context needed for execution, **so that** I don't need to read sibling specs or external documentation mid-task.

**Acceptance Criteria**:
1. **Given** task-01 spec.md, **When** I read the scope section, **Then** all 60+ README paths are explicitly listed
2. **Given** task-02 spec.md, **When** I start audit work, **Then** the spec defines every criterion without referencing external docs
3. **Given** any task spec, **When** checking dependencies, **Then** blocked-by fields match the root dependency graph

### US-004: Cross-Reference Consistency (Priority: P1)

**As a** maintainer, **I want** dependency graphs consistent across all documents, **so that** task ordering is unambiguous and agents follow the correct execution sequence.

**Acceptance Criteria**:
1. **Given** README dependency graph, **When** I compare to spec.md section 3, **Then** phase ordering matches exactly
2. **Given** task specs blocked-by fields, **When** I trace dependencies, **Then** no circular dependencies exist
3. **Given** root tasks.md, **When** I count task dependencies, **Then** sum matches individual task spec blocked-by counts

### US-005: Quality Gate Enforcement (Priority: P1)

**As a** maintainer, **I want** explicit P0/P1/P2 priority markings in all checklists, **so that** agents understand which items block completion and which can be deferred.

**Acceptance Criteria**:
1. **Given** root checklist.md, **When** I scan priority tags, **Then** all 74 items have [P0], [P1], or [P2] markers
2. **Given** task-01 checklist.md, **When** agent claims completion, **Then** all P0 items are verified with evidence
3. **Given** any P1 item uncompleted, **When** claiming done, **Then** user approval or completion is documented

### US-006: Version Traceability (Priority: P1)

**As a** release manager, **I want** version numbers traceable from source specs through changelogs to root README, **so that** GitHub release notes accurately reflect all implemented features.

**Acceptance Criteria**:
1. **Given** changelog-reference.md version entries, **When** I check source spec changelogs, **Then** all version numbers match
2. **Given** task-05 changelog creation output, **When** I verify against task-06 root README update, **Then** statistics reflect post-alignment counts
3. **Given** task-07 GitHub release notes, **When** I trace features back to source specs, **Then** all 11 specs (014-016, 122-129) are represented
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | |
| Task Specs Review | User | Pending | |
| Release Approval | User | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Documentation Compliance
- [ ] All spec.md files have SPECKIT_LEVEL frontmatter
- [ ] All sections have ANCHOR tags
- [ ] No placeholder text in delivered files

### Process Compliance
- [ ] Dependency ordering consistent across all documents
- [ ] Each task spec self-contained for agent execution
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User (Michel) | Maintainer | High | Review spec before execution |
| Agent System | Executor | High | Self-contained task specs |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-16)
**Initial specification** — 7-subtask umbrella for 11 source specs across 3 tracks
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None — all source specs implemented and changelogs available
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **README**: See [README.md](README.md)
- **Changelog Reference**: See [changelog-reference.md](changelog-reference.md)
- **Task 01**: See [task-01-readme-alignment/spec.md](task-01-readme-alignment/spec.md)
- **Task 02**: See [task-02-skill-speckit-alignment/spec.md](task-02-skill-speckit-alignment/spec.md)
- **Task 03**: See [task-03-command-alignment/spec.md](task-03-command-alignment/spec.md)
- **Task 04**: See [task-04-agent-alignment/spec.md](task-04-agent-alignment/spec.md)
- **Task 05**: See [task-05-changelog-updates/spec.md](task-05-changelog-updates/spec.md)
- **Task 06**: See [task-06-global-readme-update/spec.md](task-06-global-readme-update/spec.md)
- **Task 07**: See [task-07-github-release/spec.md](task-07-github-release/spec.md)
