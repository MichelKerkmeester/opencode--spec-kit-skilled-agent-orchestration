---
title: "Comprehensive Alignment Fix Checklist [024-comprehensive-alignment-fix/checklist]"
description: "checklist document for 024-comprehensive-alignment-fix."
trigger_phrases:
  - "comprehensive"
  - "alignment"
  - "fix"
  - "checklist"
  - "024"
importance_tier: "normal"
contextType: "implementation"
---
# Comprehensive Alignment Fix Checklist

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[!]` Blocked

---

## [P0] Critical - Must Fix First

- [x] **P0.1** YAML syntax errors fixed in command definitions (Fixed in 6 files: implement_auto.yaml:593, implement_confirm.yaml:668, plan_auto.yaml:650, plan_confirm.yaml:703, research_auto.yaml:688, research_confirm.yaml:756)
  - Files validated with yamllint
  - Commands parse without errors
  
- [x] **P0.2** Script paths corrected (Fixed implementation-phase.md:51, review-phase.md:12)
  - All referenced scripts exist at specified paths
  - Scripts execute successfully when called
  
- [x] **P0.3** Missing command implemented or references removed (Created validate.md - 296 lines)
  - Command executes OR all references cleaned up
  - No dangling references remain
  
- [x] **P0.4** Documentation contradiction resolved (Fixed debug.md:380 to align with debug.md:11)
  - Single source of truth established
  - Conflicting guidance removed or reconciled

---

## [P1] High Priority - Significant Impact

- [x] **P1.1** Bash version compatibility ensured (Added version check to config.sh:16-25)
  - Scripts run on Bash 3.x (macOS default)
  - Scripts run on Bash 4.x+ (Linux/newer systems)
  
- [x] **P1.2** JSON escaping issues fixed (Added _json_escape function validate-spec.sh:30-40, applied at :283-286)
  - All JSON output parses correctly
  - Special characters properly escaped
  
- [x] **P1.3** AGENTS.md sections updated (Fixed Gate 4 references at AGENTS.md:147, :148, :281)
  - Tool references match current system
  - Workflow descriptions accurate
  - Gate definitions current
  
- [x] **P1.4** Templates aligned with actual structure (Added Problem Statement spec.md:24, Architecture plan.md:72)
  - Template outputs match expected folder structure
  - All required files included in templates
  
- [x] **P1.5** Command parameter types corrected (Covered by P0.1 YAML fixes)
  - Parameters accept valid inputs
  - Type validation works correctly
  
- [x] **P1.6** Skill references updated (Replaced find with Glob: debug.md:59, resume.md:53, handover.md:46)
  - All skill paths valid
  - Skill dependencies resolve correctly
  
- [x] **P1.7** Error handling paths corrected (Covered by P0.2 script path fixes)
  - Errors route to valid handlers
  - Error messages accurate
  
- [x] **P1.8** Validation script logic fixed (JSON escaping in validate-spec.sh:30-40 fixes output parsing)
  - validate-spec.sh produces accurate results
  - All validation rules work correctly

---

## [P2] Medium Priority - Quality Improvements

- [x] **P2.1** Glob tool documentation updated (Updated path_scoped_rules.md sections 4 and 7)
  - Documentation matches tool behavior
  - Examples are accurate
  
- [x] **P2.2** Obsolete template markers removed (Fixed planning-summary.md:2, implementation-summary.md:2, removed duplicate debug-delegation.md:3)
  - No placeholder text in production templates
  - All TODOs resolved or documented
  
- [x] **P2.3** Documentation cross-references fixed (SKILL.md router updated: added worked_examples.md, counts at :202, :210, :259, :262)
  - All internal links resolve
  - All file references valid
  
- [x] **P2.4** Deprecated instructions cleaned up (Covered by P1.3 AGENTS.md updates)
  - Deprecated features documented in archive
  - No active references to deprecated items

---

## Additional Fixes (Post-Initial Scope)

- [x] [P1] Fix AGENTS (UNIVERSAL).md Gate 4 format (lines 148, 149, 282) - Changed [1][2][3] to A/B/C/D format
- [x] [P1] Fix resume.md second find command (line 89) - Replaced with Glob("[spec_path]/memory/*.md")
- [x] [P0] Fix shell injection vulnerability in common.sh get_feature_paths() - Used printf %q for safe escaping

---

## Final Minor Fixes (Post-Verification)

- [x] [LOW] Remove duplicate _json_escape() in validate-spec.sh (line 153 removed)
- [x] [LOW] Update path_scoped_rules.md description in level_specifications.md:461
- [x] [LOW] Update path_scoped_rules.md description in quick_reference.md:550
- [x] [LOW] Update path_scoped_rules.md description in template_guide.md:1064
- [x] [LOW] Remove .speckit.yaml from Future Enhancements in path_scoped_rules.md:143-149
- [x] [LOW] Fix mode suffix documentation in SKILL.md:80-87

---

## Verification Gates

### After P0 Completion
- [x] All command files parse without YAML errors (6 files fixed, yamllint passes)
- [x] All scripts execute without path errors (implementation-phase.md, review-phase.md corrected)
- [x] No missing command references in documentation (validate.md created)

### After P1 Completion
- [x] AGENTS.md passes self-consistency check (Gate 4 references aligned)
- [x] Templates produce valid spec folder structures (spec.md, plan.md sections added)
- [x] All skills load without reference errors (Glob tool usage corrected)

### After P2 Completion
- [x] Documentation link checker passes (SKILL.md router updated with correct counts)
- [x] No TODO/FIXME markers in production files (template markers removed)
- [x] Final review completed (all P0/P1/P2 items addressed)

---

## Sign-off

- [x] All P0 items verified complete (4/4 items fixed with evidence)
- [x] All P1 items verified complete (8/8 items fixed with evidence)
- [x] All P2 items verified complete (4/4 items fixed with evidence)
- [x] Integration testing passed (all fixes verified)
- [x] Ready for merge
