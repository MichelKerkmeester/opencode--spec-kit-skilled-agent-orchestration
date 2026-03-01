---
title: "Implementation Plan: Phase 001 — Rename legacy workflow-prefixed skill to sk-code--opencode [001-sk-code--opencode/plan]"
description: "Finalize migration to sk-code--opencode by renaming the legacy workflow-prefixed skill folder and updating all active-path references (35 internal + 12 external) that still use ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "001"
  - "rename"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 001 — Rename legacy workflow-prefixed skill to `sk-code--opencode`

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Finalize migration to `sk-code--opencode` by renaming the legacy workflow-prefixed skill folder and updating all active-path references (35 internal + 12 external) that still use the legacy token.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 3 dependency status recorded as satisfied and non-blocking for this phase

### Definition of Done
- [x] Canonical folder path is `sk-code--opencode`
- [x] Zero legacy-token matches in active files
- [x] skill_advisor.py returns correct name
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace refactor. No architectural changes.

### Key Components
- **Skill folder**: `.opencode/skill/sk-code--opencode/` (35 files)
- **skill_advisor.py**: 19 line changes in INTENT_BOOSTERS/MULTI_SKILL_BOOSTERS dictionaries
- **Skill documentation refs**: `.opencode/skill/README.md`, `sk-code--full-stack/README.md`, `sk-doc/README.md`, `sk-git/README.md`
- **system-spec-kit refs**: README, SKILL.md, nodes/rules.md, config/config.jsonc, mcp_server test fixture
- **Install guides**: 2 files with skill registry entries

### Data Flow
No data flow changes. Skills are loaded by name from filesystem paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [x] Rename legacy workflow-prefixed skill folder to `.opencode/skill/sk-code--opencode/`
- [x] Verify new folder exists with all contents

### Step 2: Internal File Updates (35 files)
- [x] Update SKILL.md: name field, title, internal paths
- [x] Update index.md: name, description
- [x] Update all nodes/*.md: self-references, cross-skill references
- [x] Update all references/*.md: hard-coded paths
- [x] Update all assets/*.md: template paths, example invocations
- [x] Update all scripts/*.sh: hard-coded paths

### Step 3: External Reference Updates (12 active-path files)
- [x] Update skill_advisor.py (19 lines)
- [x] Update `.opencode/skill/README.md`
- [x] Update `sk-code--full-stack/README.md`, `sk-doc/README.md`, `sk-git/README.md`
- [x] Update system-spec-kit references (`README.md`, `SKILL.md`, `nodes/rules.md`, `config/config.jsonc`, `mcp_server/tests/skill-ref-config.vitest.ts`)
- [x] Update install guides (2 files)

### Step 4: Changelog & Cross-References
- [x] Rename legacy workflow-prefixed changelog directory to `.opencode/changelog/07--sk-code--opencode/`
- [x] Update active-path cross-references to this skill within skill folders

### Step 5: Verification
- [x] Legacy-token scan across active-path target set → 0 results
- [x] `python3 .opencode/skill/scripts/skill_advisor.py "opencode standards"` → `sk-code--opencode`
- [x] `ls .opencode/skill/sk-code--opencode/` → exists
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Legacy-token verification | All active files | Active-path legacy-token scan (`rg`/`grep`) |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py` |
| Directory check | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 (full-stack) predecessor | Internal | Satisfied | Not blocking for this phase |
| Filesystem access | Internal | Green | Cannot rename without access |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading, missed references
- **Procedure**: `git checkout -- .opencode/skill/ .opencode/install_guides/`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 3 (Full-Stack) [Satisfied] ──► Phase 1 (This Phase) ──► Phase 2 (Web)
                                        │
                                        ├── Step 1 (Rename) ──► Steps 2-4 (Updates) ──► Step 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 (Rename) | Phase 3 dependency recorded as satisfied | Steps 2-4 |
| Steps 2-4 (Updates) | Step 1 | Step 5 |
| Step 5 (Verify) | Steps 2-4 | Phase 2 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Filesystem Rename | Low | 1 `git mv` command |
| Step 2: Internal Updates | Med | 35 files, mechanical find-replace |
| Step 3: External Updates | Med | 12 active-path files + 19 skill_advisor lines |
| Step 4: Changelog & Cross-refs | Low | 1 `git mv` + cross-ref scan |
| Step 5: Verification | Low | grep + smoke test |
| **Total** | **Medium** | **~47 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phase 3 dependency marked satisfied (non-blocking) for this phase
- [x] Clean git state (or changes committed)

### Rollback Procedure
1. `git checkout -- .` to restore all modified files
2. Restore legacy workflow-prefixed skill folder path if rollback requires name reversal
3. Verify legacy workflow-prefixed folder alias is restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure filesystem and content changes
<!-- /ANCHOR:enhanced-rollback -->
