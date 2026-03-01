---
title: "Implementation Plan: Phase 009 - Rename workflows-git to sk-git (Barter Repo) [009-sk-git-from-barter-repo/plan]"
description: "Rename the Barter repository's .opencode/skill/workflows-git/ to sk-git/ and update 6 internal references across 2 files (SKILL.md and references/git_workflow_guide.md). No exte..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "009"
  - "rename"
  - "git"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 009 - Rename workflows-git to sk-git (Barter Repo)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | OpenCode skill system (Barter repo) |
| **Storage** | Filesystem |
| **Testing** | Binary-safe `rg` verification, file-count validation |

### Overview
Rename the Barter repository's `.opencode/skill/workflows-git/` to `sk-git/` and update 6 internal references across 2 files (SKILL.md and references/git_workflow_guide.md). No external references, routing changes, or smoke tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable
- [x] Dependencies identified (Phase 005 completed; Phase 008 pending but non-blocking)

### Definition of Done
- [x] Folder renamed to `sk-git` in Barter repo [Evidence: EV-01]
- [x] Old-name `rg` check returns 0 matches in sk-git folder [Evidence: EV-03]
- [x] All 8 files present in renamed folder [Evidence: EV-02]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical rename and reference migration. No architectural changes.

### Key Components
- **Skill folder**: 8 files (1 SKILL.md, 3 assets, 4 references)
- **References to update**: 6 (2 in SKILL.md, 4 in git_workflow_guide.md)

### Data Flow
No changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [x] Rename Barter `.opencode/skill/workflows-git/` to `.opencode/skill/sk-git/` [Evidence: EV-01]

### Step 2: Internal File Updates (8 references across 2 files)

**SKILL.md updates:**
- [x] Line 2: `name: workflows-git` → `name: sk-git` [Evidence: EV-03]
- [x] Line 314: `workflows-code` → `sk-code--opencode` [Evidence: EV-03]

**references/git_workflow_guide.md updates:**
- [x] Line 9: `workflows-git skill` → `sk-git skill` [Evidence: EV-03]
- [x] Line 347: `workflows-git for history` → `sk-git for history` [Evidence: EV-03]
- [x] Line 358: `workflows-git for pre-impl` → `sk-git for pre-impl` [Evidence: EV-03]
- [x] Line 370: `workflows-git to inform` → `sk-git to inform` [Evidence: EV-03]
- [x] Line 356: `workflows-code` → `sk-code--opencode` (bonus — section heading) [Evidence: EV-03]
- [x] Line 363: `workflows-code` → `sk-code--opencode` (bonus — inline ref) [Evidence: EV-03]

### Step 3: Verification
- [x] `rg "workflows[-]git" .opencode/skill/sk-git/` from Barter root → 0 matches [Evidence: EV-03]
- [x] `find .opencode/skill/sk-git -type f | wc -l` from Barter root → 8 [Evidence: EV-02]
- [x] Old folder absent: `test ! -d .opencode/skill/workflows-git` [Evidence: EV-01]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Old-name scan | Renamed skill folder only | `rg "workflows[-]git" .opencode/skill/sk-git/` |
| File-count validation | Renamed skill folder | `find .opencode/skill/sk-git -type f \| wc -l` |
| Directory validation | Skill folder existence | `test -d` |

### Evidence Slots
- `EV-01`: directory checks → `new_skill_dir=present`, `old_skill_dir=missing`
- `EV-02`: `find .opencode/skill/sk-git -type f | wc -l` → `8`
- `EV-03`: `rg "workflows[-]git" .opencode/skill/sk-git/` → `0` matches

NOTE: No smoke test (no Barter `skill_advisor.py` routing). No changelog directory to rename.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 (Public sk-git) | External | Complete | Naming convention established |
| Phase 008 (Barter sk-code) | Internal | Pending | Same repo context; should complete first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading after rename
- **Procedure**: `git checkout -- .` from Barter repo root
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 008 (Barter sk-code) -> Phase 009 (this phase, last)
                                  |
                                  +-- Step 1 -> Step 2 -> Step 3
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (2 files, 6 refs) | Low | 6 text substitutions |
| Step 3: Verification | Low | `rg` + file-count check |
| **Total** | **Low** | **~10 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 005 and 008 confirmed complete
- [ ] Clean git state in Barter repo

### Rollback Procedure
1. `git checkout -- .` from Barter repo root
2. Re-run old-name `rg` check

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
