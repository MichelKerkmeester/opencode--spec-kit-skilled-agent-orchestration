---
title: "Feature Specification: Create Commands YAML-First Architecture Refactor [009-create-yaml-architecture/spec]"
description: "Architectural refactor of all 6 create commands (.opencode/command/create/) to align with the spec_kit YAML-first workflow pattern. The current create commands use an inverted w..."
trigger_phrases:
  - "feature"
  - "specification"
  - "create"
  - "commands"
  - "yaml"
  - "spec"
  - "009"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Create Commands YAML-First Architecture Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Architectural refactor of all 6 create commands (`.opencode/command/create/`) to align with the spec_kit YAML-first workflow pattern. The current create commands use an inverted workflow model where `.md` files contain inline workflows and YAML is supplementary, whereas spec_kit commands correctly use YAML as the primary workflow engine. This refactor standardizes the architecture, fixes broken auto mode, eliminates phantom dispatch vulnerabilities, and aligns with sk-doc standards.

**Key Decisions**: Golden reference strategy (refactor skill.md first, replicate to others), Keep setup phase in .md (complex setup stays pre-YAML), Dual YAML mode (auto + confirm)

**Critical Dependencies**: Existing spec_kit commands as architectural reference, sk-doc skill for DQI enforcement

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-14 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 6 create commands use an inverted workflow model: `.md` files contain full inline workflows and YAML serves as supplementary configuration. The spec_kit commands use the correct YAML-first model where `.md` routes to YAML immediately and YAML is the primary workflow engine. This inconsistency causes: broken auto mode (no auto YAMLs exist), phantom dispatch vulnerability (no REFERENCE ONLY annotations), missing quality gates (no circuit_breaker, workflow_enforcement sections), and inconsistent document creation standards (no DQI enforcement or validate_document.py integration).

### Purpose
Refactor all 6 create commands to use YAML-first architecture matching the spec_kit convention, enabling auto mode, eliminating phantom dispatch, and enforcing consistent document quality standards.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refactoring 6 `.md` command files to use EXECUTION PROTOCOL banner and YAML-first routing
- Renaming 6 existing YAML files to `_confirm` variants
- Creating 6 new `_auto` YAML variants (12 YAMLs total)
- Adding missing structural sections to all YAMLs (circuit_breaker, workflow_enforcement, etc.)
- Aligning with sk-doc standards (DQI enforcement, validate_document.py, canonical templates)
- Fixing bugs: step count metadata, orphaned create_agent.yaml, missing auto mode support

### Out of Scope
- Modifying spec_kit commands - already correct architecture
- Changing the actual document templates or content that commands produce
- Refactoring non-create commands (other command categories)
- Changing the skill system itself

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/skill.md` | Modify | Refactor to EXECUTION PROTOCOL + YAML routing (golden reference) |
| `.opencode/command/create/agent.md` | Modify | Refactor to EXECUTION PROTOCOL + YAML routing (largest: 670 lines) |
| `.opencode/command/create/folder_readme.md` | Modify | Refactor to EXECUTION PROTOCOL + YAML routing |
| `.opencode/command/create/install_guide.md` | Modify | Refactor to EXECUTION PROTOCOL + YAML routing |
| `.opencode/command/create/skill_asset.md` | Modify | Refactor to EXECUTION PROTOCOL + YAML routing |
| `.opencode/command/create/skill_reference.md` | Modify | Refactor to EXECUTION PROTOCOL + YAML routing |
| `.opencode/command/create/create_skill.yaml` | Rename | Rename to `create_skill_confirm.yaml` |
| `.opencode/command/create/create_agent.yaml` | Rename | Rename to `create_agent_confirm.yaml` (currently orphaned) |
| `.opencode/command/create/create_folder_readme.yaml` | Rename | Rename to `create_folder_readme_confirm.yaml` |
| `.opencode/command/create/create_install_guide.yaml` | Rename | Rename to `create_install_guide_confirm.yaml` |
| `.opencode/command/create/create_skill_asset.yaml` | Rename | Rename to `create_skill_asset_confirm.yaml` |
| `.opencode/command/create/create_skill_reference.yaml` | Rename | Rename to `create_skill_reference_confirm.yaml` |
| `.opencode/command/create/create_skill_auto.yaml` | Create | New auto-mode YAML for skill creation |
| `.opencode/command/create/create_agent_auto.yaml` | Create | New auto-mode YAML for agent creation |
| `.opencode/command/create/create_folder_readme_auto.yaml` | Create | New auto-mode YAML for folder readme creation |
| `.opencode/command/create/create_install_guide_auto.yaml` | Create | New auto-mode YAML for install guide creation |
| `.opencode/command/create/create_skill_asset_auto.yaml` | Create | New auto-mode YAML for skill asset creation |
| `.opencode/command/create/create_skill_reference_auto.yaml` | Create | New auto-mode YAML for skill reference creation |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 `.md` files use EXECUTION PROTOCOL banner | Each `.md` has standardized banner with YAML routing |
| REQ-002 | All 6 existing YAMLs renamed to `_confirm` variants | No YAML files exist without `_confirm` or `_auto` suffix |
| REQ-003 | All 6 `_auto` YAML variants created | Each command has both `_auto` and `_confirm` YAML |
| REQ-004 | Fix step count metadata bug | Step counts in YAML metadata match actual step count |
| REQ-005 | Fix orphaned create_agent.yaml | agent.md correctly references its YAML file |
| REQ-006 | No regression in existing command functionality | All 6 commands produce correct output in confirm mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | All YAMLs have circuit_breaker section | `circuit_breaker:` present in all 12 YAMLs |
| REQ-008 | All YAMLs have workflow_enforcement section | `workflow_enforcement:` present in all 12 YAMLs |
| REQ-009 | DQI enforcement integrated | `validate_document.py` called in verification steps |
| REQ-010 | REFERENCE ONLY annotations on inline content | `.md` inline workflow content marked as reference |
| REQ-011 | Phase 0 (@write agent verification) stays in .md | Pre-YAML guardrail preserved in all .md files |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 create commands work in both auto and confirm modes
- **SC-002**: Zero phantom dispatch vulnerability (all inline workflows annotated REFERENCE ONLY)
- **SC-003**: All 12 YAMLs contain complete structural sections (circuit_breaker, workflow_enforcement, etc.)
- **SC-004**: DQI enforcement active via validate_document.py integration in verification steps
- **SC-005**: Architecture matches spec_kit command pattern (verifiable by structural comparison)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | spec_kit commands as reference architecture | Pattern to replicate | Already implemented and stable |
| Dependency | sk-doc skill | DQI templates and validate_document.py | Already available |
| Risk | Regression in existing commands | High | Phase 1 bug fixes first; test each command after refactor |
| Risk | agent.md complexity (670 lines inline) | Medium | Refactor skill.md first as golden reference; apply pattern |
| Risk | Large scope (24-30 files) | Medium | 4-phase approach; session boundaries at phase completion |
| Risk | Multi-session execution required | Low | Memory saves at phase boundaries for context continuity |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: All 6 `.md` files follow identical EXECUTION PROTOCOL structure
- **NFR-C02**: All 12 YAML files follow identical structural sections

### Maintainability
- **NFR-M01**: Pattern changes to one command can be replicated across all 6 mechanically
- **NFR-M02**: Clear separation between `.md` (routing + setup) and YAML (workflow engine)

### Reliability
- **NFR-R01**: Auto mode produces equivalent output to confirm mode (minus confirmation pauses)

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: Commands should handle missing user arguments gracefully (existing behavior preserved)
- Maximum length: Long file paths or names in generated documents (existing behavior preserved)

### Error Scenarios
- Missing YAML file: `.md` should report clear error if referenced YAML not found
- Invalid mode parameter: Default to confirm mode if neither auto nor confirm specified
- Partial refactor state: If interrupted mid-phase, each phase is independently functional

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 24-30, LOC: 500+, Systems: command framework |
| Risk | 15/25 | Auth: N, API: N, Breaking: Y (command behavior) |
| Research | 10/20 | Reference architecture exists (spec_kit), pattern replication |
| Multi-Agent | 5/15 | Workstreams: 1 (serial phases) |
| Coordination | 8/15 | Dependencies: cross-file consistency, YAML-MD alignment |
| **Total** | **60/100** | **Level 3** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Regression in command output | H | M | Test each command post-refactor; phase 1 fixes bugs first |
| R-002 | agent.md refactor breaks due to 670-line complexity | M | M | Golden reference strategy; refactor skill.md first |
| R-003 | Session boundary loses context | M | H | Memory saves at each phase boundary |
| R-004 | Inconsistent YAML structure across commands | M | L | Template-driven creation; checklist verification |
| R-005 | DQI integration conflicts with existing validation | L | L | Test validate_document.py independently first |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Auto Mode Command Execution (Priority: P0)

**As a** developer using create commands, **I want** auto mode variants that execute without confirmation pauses, **so that** I can quickly generate documents in batch or scripted workflows.

**Acceptance Criteria**:
1. **Given** a create command invoked with auto mode, **When** execution starts, **Then** all steps run without user confirmation
2. **Given** auto mode output, **When** compared to confirm mode output, **Then** the generated documents are identical
3. **Given** auto mode with missing required input, **When** invoked, **Then** a clear error message is shown before any file creation

---

### US-002: Consistent Command Architecture (Priority: P0)

**As a** command maintainer, **I want** all create commands to follow the same YAML-first architecture as spec_kit commands, **so that** pattern changes can be replicated mechanically across all commands.

**Acceptance Criteria**:
1. **Given** any create command `.md` file, **When** inspected, **Then** it contains EXECUTION PROTOCOL banner and routes to YAML
2. **Given** any create command YAML, **When** inspected, **Then** it contains all required structural sections (circuit_breaker, workflow_enforcement)
3. **Given** structural comparison with spec_kit commands, **When** analyzed, **Then** the architecture pattern matches

---

### US-003: Phantom Dispatch Prevention (Priority: P1)

**As a** system administrator, **I want** inline workflow content in `.md` files annotated as REFERENCE ONLY, **so that** AI agents cannot accidentally execute deprecated inline workflows instead of YAML workflows.

**Acceptance Criteria**:
1. **Given** any create command `.md` file, **When** an AI agent reads it, **Then** REFERENCE ONLY annotations prevent inline workflow execution
2. **Given** YAML-first routing, **When** a command is invoked, **Then** the YAML workflow is always the execution target

---

### US-004: Document Quality Enforcement (Priority: P1)

**As a** documentation consumer, **I want** DQI enforcement via validate_document.py integrated into create command verification, **so that** all generated documents meet quality standards.

**Acceptance Criteria**:
1. **Given** a create command verification step, **When** executed, **Then** validate_document.py is called on the output
2. **Given** a generated document with quality issues, **When** validated, **Then** specific DQI failures are reported

---

### US-005: Bug-Free Command Metadata (Priority: P0)

**As a** command framework consumer, **I want** step count metadata to accurately reflect actual YAML steps, **so that** progress tracking and reporting are correct.

**Acceptance Criteria**:
1. **Given** any YAML file, **When** step_count metadata is read, **Then** it matches the actual number of steps defined
2. **Given** create_agent.yaml, **When** referenced from agent.md, **Then** the YAML loads correctly (not orphaned)

---

### US-006: Dual Mode Routing (Priority: P0)

**As a** developer, **I want** each create command `.md` to detect execution mode and route to the correct YAML, **so that** auto and confirm modes work transparently.

**Acceptance Criteria**:
1. **Given** a create command invoked without mode specification, **When** processed, **Then** it defaults to confirm mode
2. **Given** a create command invoked with auto mode, **When** processed, **Then** it routes to `_auto.yaml`
3. **Given** a create command invoked with confirm mode, **When** processed, **Then** it routes to `_confirm.yaml`

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should Phase 0 (@write agent verification) be moved into YAML in a future iteration, or permanently remain in .md?
- Are there any undocumented create commands beyond the 6 identified?
- Should `_auto` YAMLs skip ALL confirmations or only step-level confirmations (preserving Phase 0 gate)?

<!-- /ANCHOR:questions -->

---

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC - Create Commands YAML-First Architecture Refactor
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
