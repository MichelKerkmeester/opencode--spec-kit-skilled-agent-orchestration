---
title: "Implementation Plan: Phase 006 — Rename sk-doc-visual to sk-doc-visual [006-sk-doc-visual/plan]"
description: "Rename sk-doc-visual to sk-doc-visual across 28 files (22 internal + 6 external). Lowest-effort phase with fewest external references."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "006"
  - "rename"
  - "visual"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 006 — Rename sk-doc-visual to sk-doc-visual

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
| **Storage** | Filesystem |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Rename `sk-doc-visual` to `sk-doc-visual` across 28 files (22 internal + 6 external). Lowest-effort phase with fewest external references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Folder renamed to `sk-doc-visual`
- [x] Zero grep matches
- [x] skill_advisor.py correct
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace. No architectural changes.

### Key Components
- **Skill folder**: 22 files
- **skill_advisor.py**: 16 lines
- **Command files**: 3 doc-visual command files
- **Agent files**: 2 orchestrate.md files
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [x] `git mv .opencode/skill/sk-doc-visual .opencode/skill/sk-doc-visual`

### Step 2: Internal File Updates (22 files)
- [x] SKILL.md, index.md, nodes/, references/, assets/, scripts/

### Step 3: External Reference Updates (6 files)
- [x] skill_advisor.py (16 lines)
- [x] orchestrate.md (2 runtimes)
- [x] doc-visual command files (3 files)

### Step 4: Changelog (if exists)
- [x] Check and rename changelog dir if it exists

### Step 5: Verification
- [x] grep: 0 matches
- [x] skill_advisor.py smoke test
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | All active files | `grep -r "sk-doc-visual"` |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py` |
| Directory | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3, 1, 2, 7, 4 complete | Internal | Complete | Must execute 6th |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading
- **Procedure**: `git checkout -- .`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 4 ──► Phase 6 (This Phase) ──► Phase 5
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (22) | Low | Small folder |
| Step 3: External (6) | Low | Fewest external |
| Step 4: Changelog | Low | Check + optional rename |
| Step 5: Verification | Low | grep + smoke |
| **Total** | **Low-Medium** | **~28 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Prior phases confirmed complete
- [x] Clean git state

### Rollback Procedure
1. `git checkout -- .`

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
