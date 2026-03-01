---
title: "Task Breakdown: Spec Kit Bug Fixes [083-speckit-reimagined-bug-fixes/tasks]"
description: "tasks document for 083-speckit-reimagined-bug-fixes."
trigger_phrases:
  - "task"
  - "breakdown"
  - "spec"
  - "kit"
  - "bug"
  - "tasks"
  - "083"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: Spec Kit Bug Fixes

> Detailed task list for implementing all bug fixes identified in the 15-agent audit.

---

## Document Information

| Field | Value |
|-------|-------|
| **Spec ID** | 083-speckit-reimagined-bug-fixes |
| **Total Tasks** | 42 |
| **Estimated Effort** | 4-6 hours |

---

## Task Summary by Phase

| Phase | Priority | Tasks | Status |
|-------|----------|-------|--------|
| Phase 1 | P0 - Critical | 12 | ✅ Complete |
| Phase 2 | P1 - High | 12 | ✅ Complete |
| Phase 3 | P2 - Medium | 12 | ✅ Complete |
| Phase 4 | P3 - Low | 6 | ✅ Complete |
| **Total** | | **42** | ✅ Complete |

---

## Phase 1: CRITICAL Fixes (P0)

### T-001: Fix README ANCHOR Format - Line 421
- **Bug:** BUG-001
- **File:** `.opencode/skill/system-spec-kit/README.md`
- **Line:** 421
- **Change:** `ANCHOR_END` → `/ANCHOR:`
- **Status:** [x] Complete

### T-002: Fix README ANCHOR Documentation - Line 696
- **Bug:** BUG-001
- **File:** `.opencode/skill/system-spec-kit/README.md`
- **Line:** 696
- **Change:** Update troubleshooting text
- **Status:** [x] Complete

### T-003: Fix YAML Path - debug.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/debug.md`
- **Lines:** 345-346
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-004: Fix YAML Path - research.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/research.md`
- **Lines:** 420-422
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-005: Fix YAML Path - complete.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/complete.md`
- **Lines:** 604-605
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-006: Fix YAML Path - implement.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/implement.md`
- **Lines:** 340-342
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-007: Fix YAML Path - plan.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/plan.md`
- **Lines:** 309-310
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-008: Fix YAML Path - resume.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/resume.md`
- **Lines:** 250-251
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-009: Fix YAML Path - handover.md
- **Bug:** BUG-002
- **File:** `.claude/commands/spec_kit/handover.md`
- **Line:** 550
- **Change:** `.opencode/command/` → `.claude/commands/`
- **Status:** [x] Complete

### T-010: Add Missing Step 11 to complete YAMLs
- **Bug:** BUG-003
- **Files:** `spec_kit_complete_auto.yaml`, `spec_kit_complete_confirm.yaml`
- **Change:** Add `step_11_checklist_verify` section
- **Status:** [x] Complete

### T-011: Add Missing Step 14 to complete YAMLs
- **Bug:** BUG-003
- **Files:** `spec_kit_complete_auto.yaml`, `spec_kit_complete_confirm.yaml`
- **Change:** Add `step_14_handover_check` section
- **Status:** [x] Complete

### T-012: Renumber complete YAML Steps
- **Bug:** BUG-006
- **Files:** `spec_kit_complete_auto.yaml`, `spec_kit_complete_confirm.yaml`
- **Change:** Renumber 11→12, 12→13
- **Status:** [x] Complete

---

## Phase 2: HIGH Fixes (P1)

### T-013: Add PREFLIGHT to implement YAMLs
- **Bug:** BUG-004
- **Files:** `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`
- **Change:** Add `step_5_5_preflight` section
- **Status:** [x] Complete

### T-014: Add POSTFLIGHT to implement YAMLs
- **Bug:** BUG-004
- **Files:** `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`
- **Change:** Add `step_7_5_postflight` section
- **Status:** [x] Complete

### T-015: Fix Invalid Task Parameter - handover.md
- **Bug:** BUG-005
- **File:** `.claude/commands/spec_kit/handover.md`
- **Lines:** 398-401, 475
- **Change:** Remove `model` parameter from Task invocation
- **Status:** [x] Complete

### T-016: Fix Invalid Task Parameter - agent/handover.md
- **Bug:** BUG-005
- **File:** `.opencode/agent/handover.md`
- **Lines:** 51-59
- **Change:** Remove `model` parameter from Task invocation
- **Status:** [x] Complete

### T-017: Fix Invalid Confidence Steps - resume YAML
- **Bug:** BUG-007
- **File:** `spec_kit_resume_auto.yaml`
- **Line:** 96
- **Change:** `[1, 3, 5]` → `[1, 2, 4]`
- **Status:** [x] Complete

### T-018: Verify/Remove WebSearch Tool
- **Bug:** BUG-008
- **File:** `.claude/commands/spec_kit/research.md`
- **Line:** 4
- **Change:** Remove WebSearch if phantom, standardize to lowercase
- **Status:** [x] Complete

### T-019: Add 4-Tier Session Detection to resume YAMLs
- **Bug:** BUG-009
- **Files:** `spec_kit_resume_auto.yaml`, `spec_kit_resume_confirm.yaml`
- **Change:** Add semantic search and trigger matching tiers
- **Status:** [x] Complete

### T-020: Resolve YAML Contradiction - handover.md
- **Bug:** BUG-010
- **File:** `.claude/commands/spec_kit/handover.md`
- **Line:** 258
- **Change:** Remove claim about not using YAML
- **Status:** [x] Complete

### T-021: Sync YAML Sections - handover
- **Bug:** BUG-011
- **File:** `spec_kit_handover_full.yaml`
- **Lines:** 34-89
- **Change:** Update to 5-section structure
- **Status:** [x] Complete

### T-022: Fix README Step Counts
- **Bug:** BUG-012
- **File:** `.opencode/skill/system-spec-kit/README.md`
- **Lines:** 196, 198
- **Change:** complete=14, implement=9
- **Status:** [x] Complete

### T-023: Fix Step 11 Reference - implement.md
- **Bug:** BUG-013
- **File:** `.claude/commands/spec_kit/implement.md`
- **Line:** 440
- **Change:** "Step 11" → "Step 7"
- **Status:** [x] Complete

### T-024: Fix Duplicate Step Number - implement.md
- **Bug:** BUG-014
- **File:** `.claude/commands/spec_kit/implement.md`
- **Lines:** 74, 76
- **Change:** Renumber second "6." to "7."
- **Status:** [x] Complete

---

## Phase 3: MEDIUM Fixes (P2)

### T-025: Fix Orphaned References - speckit.md
- **Bug:** BUG-015
- **File:** `.opencode/agent/speckit.md`
- **Lines:** 419-420
- **Change:** Remove `/memory:why`, update `/memory:correct` → `/memory:learn correct`
- **Status:** [x] Complete

### T-026: Fix Section Reference - learn.md Line 43
- **Bug:** BUG-016
- **File:** `.claude/commands/memory/learn.md`
- **Line:** 43
- **Change:** "Section 13" → "Section 17"
- **Status:** [x] Complete

### T-027: Fix Section Reference - learn.md Line 48
- **Bug:** BUG-016
- **File:** `.claude/commands/memory/learn.md`
- **Line:** 48
- **Change:** "Section 14" → "Section 18"
- **Status:** [x] Complete

### T-028: Fix Section Reference - learn.md Line 53
- **Bug:** BUG-016
- **File:** `.claude/commands/memory/learn.md`
- **Line:** 53
- **Change:** "Section 15" → "Section 19"
- **Status:** [x] Complete

### T-029: Fix Wrong Tool for sortBy - continue.md
- **Bug:** BUG-017
- **File:** `.claude/commands/memory/continue.md`
- **Lines:** 283-289
- **Change:** `memory_search` → `memory_list`
- **Status:** [x] Complete

### T-030: Fix Short Tool Names - continue.md
- **Bug:** BUG-018
- **File:** `.claude/commands/memory/continue.md`
- **Lines:** 123-127
- **Change:** Add `spec_kit_memory_` prefix to tool names
- **Status:** [x] Complete

### T-031: Fix Fictional Model Name - debug.md
- **Bug:** BUG-019
- **File:** `.claude/commands/spec_kit/debug.md`
- **Line:** 57
- **Change:** "GPT-5.2-Codex" → "OpenAI models"
- **Status:** [x] Complete

### T-032: Fix Step Comment - plan YAML
- **Bug:** BUG-020
- **File:** `spec_kit_plan_confirm.yaml`
- **Line:** 211
- **Change:** "Step 6" → "Step 5"
- **Status:** [x] Complete

### T-033: Fix Question Range - plan.md
- **Bug:** BUG-021
- **File:** `.claude/commands/spec_kit/plan.md`
- **Line:** 237
- **Change:** "Q0-Q5" → "Q0-Q6"
- **Status:** [x] Complete

### T-034: Add Context Loading Sources - resume YAMLs
- **Bug:** BUG-022
- **Files:** `spec_kit_resume_auto.yaml`, `spec_kit_resume_confirm.yaml`
- **Change:** Add CONTINUE_SESSION.md and checklist.md sources
- **Status:** [x] Complete

### T-035: Fix Termination Message - implement YAMLs
- **Bug:** BUG-023
- **Files:** `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`
- **Change:** "step 8" → "step 9"
- **Status:** [x] Complete

### T-036: Add Five Checks to implement YAML
- **Bug:** BUG-024
- **Files:** `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`
- **Change:** Add Five Checks Framework to quality_gates section
- **Status:** [x] Complete

---

## Phase 4: LOW Fixes (P3)

### T-037: Fix DRIFT CONTEXT Label - context.md
- **Bug:** BUG-025
- **File:** `.claude/commands/memory/context.md`
- **Line:** 470
- **Change:** "DRIFT CONTEXT" → "CONTEXT"
- **Status:** [x] Complete

### T-038: Add Related Commands - context.md
- **Bug:** BUG-026
- **File:** `.claude/commands/memory/context.md`
- **Lines:** 540-542
- **Change:** Add `/memory:continue` and `/memory:learn`
- **Status:** [x] Complete

### T-039: Fix Short Tool Name - save.md
- **Bug:** BUG-027
- **File:** `.claude/commands/memory/save.md`
- **Line:** 58
- **Change:** Use full `spec_kit_memory_` prefix
- **Status:** [x] Complete

### T-040: Clarify Stats Mode - manage.md
- **Bug:** BUG-028
- **File:** `.claude/commands/memory/manage.md`
- **Line:** 17
- **Change:** Clarify that empty args = stats mode
- **Status:** [x] Complete

### T-041: Add CONTINUE_SESSION to resume YAML
- **Bug:** BUG-029
- **Files:** `spec_kit_resume_auto.yaml`, `spec_kit_resume_confirm.yaml`
- **Change:** Document CONTINUE_SESSION.md artifact
- **Status:** [x] Complete

### T-042: Fix Tool Capitalization - research.md
- **Bug:** BUG-030
- **File:** `.claude/commands/spec_kit/research.md`
- **Line:** 4
- **Change:** Standardize to lowercase tool names
- **Status:** [x] Complete

---

## Phase 5: Verification & Release

### T-043: Run Command Tests
- **Description:** Test all commands with :auto and :confirm modes
- **Status:** [ ] Pending (Manual)

### T-044: Verify YAML Paths
- **Description:** Confirm all documented paths resolve to actual files
- **Status:** [x] Complete

### T-045: Test Memory Parsing
- **Description:** Verify ANCHOR format works correctly
- **Status:** [ ] Pending (Manual)

### T-046: Update CHANGELOG
- **Description:** Add all fixes to CHANGELOG.md
- **Status:** [x] Complete

### T-047: Version Bump
- **Description:** Update version to 1.2.2.0
- **Status:** [x] Complete

### T-048: Create Implementation Summary
- **Description:** Document all completed fixes
- **Status:** [x] Complete

---

## Completion Tracking

| Task Range | Count | Completed | Remaining |
|------------|-------|-----------|-----------|
| T-001 to T-012 (P0) | 12 | 12 | 0 |
| T-013 to T-024 (P1) | 12 | 12 | 0 |
| T-025 to T-036 (P2) | 12 | 12 | 0 |
| T-037 to T-042 (P3) | 6 | 6 | 0 |
| T-043 to T-048 (Verify) | 6 | 4 | 2 (manual) |
| **Total** | **48** | **46** | **2** |

---

## Notes

- Tasks can be executed in parallel within phases where no dependencies exist
- Phase 1 must complete before Phase 2 begins (critical fixes first)
- Verification (Phase 5) depends on all other phases completing
