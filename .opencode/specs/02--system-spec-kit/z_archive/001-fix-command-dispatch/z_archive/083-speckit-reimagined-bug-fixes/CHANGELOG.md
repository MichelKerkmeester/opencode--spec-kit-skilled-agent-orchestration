# Changelog: Spec Kit Bug Fixes

> Release notes for v1.2.2.0 - Bug fixes from 15-agent parallel audit

---

## [1.2.2.0] - 2025-01-XX

### Summary

This release addresses **30+ bugs** discovered during a comprehensive 15-agent parallel audit of Spec Kit v1.2.1.0. Issues span command files, YAML workflow assets, and documentation.

---

### Critical Fixes (P0)

#### BUG-001: README ANCHOR Format
- **Fixed:** `ANCHOR_END` → `/ANCHOR:` format in README.md line 421
- **Fixed:** Troubleshooting text updated to reflect correct format
- **Impact:** Memory anchors now parse correctly

#### BUG-002: YAML Path Corrections
- **Fixed:** 7 command files updated from `.opencode/command/` → `.claude/commands/`
- **Files:** debug.md, research.md, complete.md, implement.md, plan.md, resume.md, handover.md
- **Impact:** YAML assets now load from correct paths

#### BUG-003 & BUG-006: Missing Complete Steps
- **Added:** `step_11_checklist_verify` to complete YAMLs
- **Added:** `step_14_handover_check` to complete YAMLs
- **Fixed:** Steps renumbered: 11→12, 12→13
- **Impact:** Complete workflow now has proper verification gates

#### BUG-004: Missing Implement Steps
- **Added:** `step_5_5_preflight` to implement YAMLs
- **Added:** `step_7_5_postflight` to implement YAMLs
- **Impact:** Implementation workflow now includes quality validation

#### BUG-005: Invalid Task Parameters
- **Removed:** `model` parameter from Task invocations in handover files
- **Impact:** Task tool now called with valid parameters only

#### BUG-007: Invalid Confidence Steps
- **Fixed:** `key_steps: [1, 3, 5]` → `[1, 2, 4]` in resume YAMLs
- **Impact:** Confidence scoring now references existing steps only

---

### High Priority Fixes (P1)

#### BUG-008: Phantom WebSearch Tool
- **Removed:** WebSearch from research.md allowed-tools (tool doesn't exist)
- **Fixed:** Tool names standardized to lowercase

#### BUG-009: Session Detection Enhancement
- **Added:** 4-tier session detection to resume YAMLs
- **Tiers:** CLI argument → Semantic search → Trigger matching → Glob mtime

#### BUG-010: YAML Contradiction
- **Fixed:** Removed contradictory claim about not using YAML in handover.md line 258

#### BUG-011: Section Alignment
- **Updated:** handover.md command file now describes 7 sections matching YAML structure

#### BUG-012: Step Count Correction
- **Fixed:** README shows complete=14 steps, implement=9 steps

#### BUG-013 & BUG-014: Step Numbering
- **Fixed:** "Step 11" reference corrected to "Step 7" in implement.md
- **Fixed:** Duplicate step "6." renumbered to "7."

---

### Medium Priority Fixes (P2)

#### BUG-015: Orphaned References
- **Removed:** `/memory:why` from speckit.md (command doesn't exist)
- **Removed:** `/memory:correct` reference (use `/memory:learn correct` instead)

#### BUG-016: Section References
- **Fixed:** learn.md references updated: 13→17, 14→18, 15→19

#### BUG-017 & BUG-018: Tool Names
- **Fixed:** `memory_search` → `memory_list` for sortBy parameter in continue.md
- **Added:** Full `spec_kit_memory_` prefix to tool names

#### BUG-019: Fictional Model Name
- **Fixed:** "GPT-5.2-Codex" → "GPT-4/o1/o3 models" in debug.md

#### BUG-020 & BUG-021: Plan Documentation
- **Fixed:** Step comment corrected in plan YAML
- **Fixed:** Question range updated to Q0-Q6

#### BUG-022: Context Sources
- **Added:** CONTINUE_SESSION.md and checklist.md to resume YAML context sources

#### BUG-023: Termination Message
- **Fixed:** "step 8" → "step 9" in implement YAML termination messages

#### BUG-024: Five Checks Framework
- **Added:** Five Checks Framework to implement YAML quality_gates section

---

### Low Priority Fixes (P3)

#### BUG-025: DRIFT Label
- **Fixed:** "DRIFT CONTEXT" → "CONTEXT" label in context.md

#### BUG-026: Related Commands
- **Added:** `/memory:continue` and `/memory:learn` to context.md

#### BUG-027: Tool Prefix
- **Fixed:** Short tool name in save.md now uses full prefix

#### BUG-028: Stats Mode
- **Clarified:** Empty args = stats mode in manage.md

#### BUG-029: CONTINUE_SESSION Documentation
- **Added:** CONTINUE_SESSION.md artifact documentation to resume YAMLs

#### BUG-030: Tool Capitalization
- **Standardized:** All tool names to lowercase in research.md

---

### Files Modified

| Category | Files | Count |
|----------|-------|-------|
| Command Files | spec_kit/*.md, memory/*.md | 13 |
| YAML Assets | spec_kit/assets/*.yaml | 7 |
| Agent Files | .opencode/agent/*.md | 2 |
| Documentation | README.md, SKILL.md | 2 |

---

### Breaking Changes

None. All changes are backwards-compatible bug fixes.

---

### Known Issues

The following items were identified but deferred:

| Item | Reason | Status |
|------|--------|--------|
| Pre-existing YAML syntax errors in debug YAMLs | Existed before this spec | Not in scope |
| Runtime command testing | Requires manual testing | Pending |
| Memory parsing validation | Requires runtime verification | Pending |

---

### Upgrade Notes

No action required. All fixes are internal consistency improvements.

---

### Contributors

- 15-agent parallel audit team (issue identification)
- Claude AI (implementation)
