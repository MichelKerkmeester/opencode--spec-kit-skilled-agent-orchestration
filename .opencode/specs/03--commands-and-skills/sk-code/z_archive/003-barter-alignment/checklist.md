---
title: "Verification Checklist: workflows-code Barter Alignment [003-barter-alignment/checklist]"
description: "assets/"
trigger_phrases:
  - "verification"
  - "checklist"
  - "workflows"
  - "code"
  - "barter"
  - "022"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Verification Checklist: workflows-code Barter Alignment

<!-- ANCHOR:pre-impl -->
## P0 - Must Complete (Hard Blockers)

- [x] **SKILL.md router updated with Barter patterns**
  - Required changes:
    - [x] Priority Loading Section (P1/P2/P3) added
    - [x] Missing routes added (observer_patterns, third_party_integrations, performance_patterns)
    - [x] Token budget estimates included
  - Evidence: Section 2 "Resource Priority Levels" table and "Task Keyword Triggers" block added; all routes include Priority column

- [x] **All file references in SKILL.md are valid**
  - Required: All 20 path references updated with sub-folder prefixes
  - Verification command: `grep -E "assets/|references/" SKILL.md | grep -v "phase1-\|phase2-\|phase3-\|checklists/\|patterns/\|integrations/\|deployment/\|standards/"`
  - Expected result: Empty (no old-style paths remaining)
  - Evidence: Verified - "No old asset paths" and "No old reference paths"

- [x] **Skill loads and invokes correctly**
  - Test: Invoke skill via OpenCode and confirm SKILL.md loads
  - Evidence: SKILL.md frontmatter valid (name, description, allowed-tools, version 2.0.0), 94 new-style path references, 0 old-style paths remaining

<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## P1 - Must Complete or Defer with Approval

- [x] **Assets organized into 3 sub-folders**
  - Expected structure:
    ```
    assets/
    ├── checklists/ (2 files)
    ├── patterns/ (2 files)
    └── integrations/ (2 files)
    ```
  - Verification: `ls -la .opencode/skill/workflows-code/assets/*/`
  - Evidence: Verified - checklists: 2, patterns: 2, integrations: 2 files

- [x] **References organized into 5 sub-folders**
  - Expected structure:
    ```
    references/
    ├── phase1-implementation/ (7 files)
    ├── phase2-debugging/ (1 file)
    ├── phase3-verification/ (1 file)
    ├── deployment/ (2 files)
    └── standards/ (3 files)
    ```
  - Verification: `ls -la .opencode/skill/workflows-code/references/*/`
  - Evidence: Verified - phase1: 7, phase2: 1, phase3: 1, deployment: 2, standards: 3 files

- [x] **No orphan files in assets/ or references/ root**
  - Verification: `ls .opencode/skill/workflows-code/assets/*.* 2>/dev/null || echo "Clean"`
  - Verification: `ls .opencode/skill/workflows-code/references/*.* 2>/dev/null || echo "Clean"`
  - Evidence: Both show "Clean" - no orphan files

- [x] **Verification statement template added to SKILL.md**
  - Location: Section 5 (Success Criteria), after Phase 3 criteria
  - Required fields: Browser version, viewport pass/fail, console/network errors, feature tested, evidence path, reasoning statement
  - Evidence: Template added with all required fields

<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:docs -->
## P2 - Can Defer Without Approval

- [x] **Decision record updated with findings**
  - Evidence: decision-record.md updated with full comparison table, Barter patterns to adopt, anobel.com patterns to preserve
  - Completed: 2026-01-01

- [x] **Tasks.md updated with specific file operations**
  - Evidence: tasks.md includes exact file move list (20 files), SKILL.md update checklist
  - Completed: 2026-01-01

- [x] **Implementation summary created**
  - Evidence: implementation-summary.md created with:
    - Complete file move table (before → after)
    - SKILL.md sections modified
    - New features added (priority loading, keywords, verification template)
    - New folder structure diagram
  - Completed: 2026-01-01

<!-- /ANCHOR:docs -->

---

## Verification Commands (Executed)

```bash
# 1. File counts in each sub-folder
# Result: All counts match expected values
checklists: 2 files
patterns: 2 files
integrations: 2 files
phase1: 7 files
phase2: 1 files
phase3: 1 files
deployment: 2 files
standards: 3 files

# 2. Old-style paths check
# Result: No old asset paths, No old reference paths

# 3. Orphan files check
# Result: Assets root: Clean, References root: Clean
```

---

## Document Split Verification

- [x] **code_style_guide.md created with styling content**
  - Path: `references/standards/code_style_guide.md`
  - Lines: 764
  - Content: Naming conventions, file structure, formatting, commenting rules, CSS conventions
  - Evidence: File exists, verified with Read tool

- [x] **code_quality_standards.md updated with quality patterns**
  - Path: `references/standards/code_quality_standards.md`
  - Lines: 649 (restructured with new sections)
  - New sections: DOM Safety, Error Handling, Async, Observer, Validation, Performance, State Management
  - Removed: Naming Conventions, File Structure, Commenting Rules (moved to code_style_guide.md)
  - Evidence: File exists, verified section headers present

- [x] **SKILL.md references updated**
  - 6 references to code_style_guide.md found
  - Locations: Lines 215, 555, 565, 594, 606, 710
  - Evidence: Grep search verified

- [x] **AGENTS.md references updated**
  - 1 reference to code_style_guide.md found
  - Location: Line 251
  - Evidence: Grep search verified

- [x] **All file paths are valid**
  - code_style_guide.md: EXISTS
  - code_quality_standards.md: EXISTS
  - All cross-references resolve correctly

---

<!-- ANCHOR:sign-off -->
## Sign-off

- [x] All P0 items complete with evidence
- [x] All P1 items complete with evidence
- [x] All P2 items complete
- [x] Implementation summary created
- [x] All verification commands passed (2026-01-01)
- [x] Document split verified (2026-01-01)

<!-- /ANCHOR:sign-off -->
