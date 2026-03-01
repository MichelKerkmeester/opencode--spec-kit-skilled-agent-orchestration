---
title: "Implementation Plan: Phase 002 — Rename workflows-code--web-dev to sk-code--web [002-sk-code--web/plan]"
description: "Rename the workflows-code--web-dev skill folder to sk-code--web and update all 68 files (51 internal + 17 external) that reference the old name. Special attention to bare workfl..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "002"
  - "rename"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 002 — Rename workflows-code--web-dev to sk-code--web

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, Shell, JavaScript |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Rename the `workflows-code--web-dev` skill folder to `sk-code--web` and update all 68 files (51 internal + 17 external) that reference the old name. Special attention to bare `workflows-code` references and the name shortening from `web-dev` to `web`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Technical approach defined in plan.md
- [x] Dependencies identified (Phases 1 and 3 must complete first)

### Definition of Done
- [x] Folder renamed to `sk-code--web`
- [x] Zero grep matches for `workflows-code--web-dev` in active files
- [x] Bare `workflows-code` references resolved
- [x] skill_advisor.py returns correct name
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace refactor with name shortening. No architectural changes.

### Key Components
- **Skill folder**: `.opencode/skill/workflows-code--web-dev/` (51 files)
- **skill_advisor.py**: 25 line changes
- **Agent files**: 8 files (orchestrate + review across 4 runtimes)
- **Install guides**: 2 files
- **Root docs**: CLAUDE.md, .opencode/README.md

### Data Flow
No data flow changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [x] `git mv .opencode/skill/workflows-code--web-dev .opencode/skill/sk-code--web`
- [x] Verify new folder exists with all contents

### Step 2: Internal File Updates (51 files)
- [x] Update SKILL.md: name field, title, paths
- [x] Update index.md: name, description
- [x] Update all nodes/*.md (~8 files): self-refs, cross-skill refs
- [x] Update all references/*.md (~8 files): hard-coded paths
- [x] Update all assets/*.md (~25 files): template paths, examples
- [x] Update all scripts/*.{sh,mjs} (~5 files): paths

### Step 3: External Reference Updates (17 files)
- [x] Update skill_advisor.py (25 lines)
- [x] Update agent/orchestrate.md (4 runtimes)
- [x] Update agent/review.md (4 runtimes)
- [x] Update install guides (2 files)
- [x] Update root docs (CLAUDE.md, .opencode/README.md)

### Step 4: Bare Reference Resolution
- [x] Find all bare `workflows-code` references (not followed by `--`)
- [x] Map each to `sk-code--web` (default variant)

### Step 5: Changelog & Cross-References
- [x] `git mv .opencode/changelog/08--workflows-code--web-dev .opencode/changelog/08--sk-code--web`
- [x] Update cross-references in other skill folders

### Step 6: Verification
- [x] `grep -r "workflows-code--web-dev" ...` → 0 results
- [x] `grep -r "workflows-code[^-]" ...` → 0 bare references
- [x] `python3 skill_advisor.py "implement feature"` → `sk-code--web`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All active files | `grep -r "workflows-code--web-dev"` |
| Bare ref check | All active files | `grep -r "workflows-code[^-]"` |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py` |
| Directory check | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 (full-stack) complete | Internal | Complete | Longest match must go first |
| Phase 1 (opencode) complete | Internal | Complete | Avoid partial `workflows-code--` match |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading, missed references
- **Procedure**: `git checkout -- .` to restore all files; `git mv` skill folder back if needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 3 ──► Phase 1 ──► Phase 2 (This Phase) ──► Phase 7
                              │
                              ├── Step 1 (Rename) ──► Steps 2-5 (Updates) ──► Step 6 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 | Phases 1+3 complete | Steps 2-5 |
| Steps 2-5 | Step 1 | Step 6 |
| Step 6 (Verify) | Steps 2-5 | Phase 7 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Filesystem Rename | Low | 1 `git mv` command |
| Step 2: Internal Updates | Med-High | 51 files, mechanical find-replace |
| Step 3: External Updates | Med | 17 files + 25 skill_advisor lines |
| Step 4: Bare References | Low | Targeted grep + replace |
| Step 5: Changelog & Cross-refs | Low | 1 `git mv` + cross-ref scan |
| Step 6: Verification | Low | grep + smoke test |
| **Total** | **Medium** | **~68 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phases 1 and 3 confirmed complete
- [x] Clean git state

### Rollback Procedure
1. `git checkout -- .` to restore all files
2. `git mv` folder back if renamed
3. Verify old skill folder restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
