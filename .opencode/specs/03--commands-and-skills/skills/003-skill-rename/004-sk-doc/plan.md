---
title: "Implementation Plan: Phase 004 — Finalize Rename to sk-doc [004-sk-doc/plan]"
description: "Complete migration from the legacy documentation-skill name to sk-doc across the targeted internal and external references for this phase. This was the highest-effort ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "004"
  - "finalize"
  - "documentation"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 004 — Finalize Rename to sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, YAML, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Complete migration from the legacy documentation-skill name to `sk-doc` across the targeted internal and external references for this phase. This was the highest-effort phase due to dense write.md references across 4 runtimes, HVR template paths in system-spec-kit, and command/create template coverage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Folder renamed to `sk-doc`
- [x] Zero legacy-name grep matches in active text targets
- [x] HVR_REFERENCE paths updated
- [x] skill_advisor.py updated to `sk-doc`
- [x] Phase spec validator executed with no errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace. No architectural changes.

### Key Components
- **Skill folder**: 49 files
- **write.md agent files**: 4 runtimes, ~30 refs each (densest target)
- **system-spec-kit templates**: 8+ files with HVR_REFERENCE paths
- **Command create/ files**: 9 files with skill paths
- **Install guides**: 4 files
- **Root docs**: 3 files

### Data Flow
No changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [x] Rename completed from legacy skill-folder path to `.opencode/skill/sk-doc/`

### Step 2: Internal File Updates (49 files)
- [x] SKILL.md, index.md
- [x] nodes/*.md (~8 files)
- [x] references/*.md (~6 files)
- [x] assets/*.md (~25 files)
- [x] scripts/*.{sh,py} (~5 files)

### Step 3: Agent File Updates (8 files — densest)
- [x] write.md across 4 runtimes (~30 refs each)
- [x] orchestrate.md across 4 runtimes

### Step 4: Command File Updates (9 files)
- [x] `.opencode/command/create/*.md` (6 files)
- [x] `.opencode/command/create/*.yaml` (legacy count in spec; current coverage verified on active create templates)

### Step 5: system-spec-kit Updates
- [x] HVR_REFERENCE paths in templates (8 implementation-summary + 3 decision-record + 1 core)
- [x] Config, SKILL.md, README.md

### Step 6: Install Guides & Root Docs
- [x] 4 install guide files
- [x] README.md, CLAUDE.md, .opencode/README.md

### Step 7: skill_advisor.py (8 lines)
- [x] INTENT_BOOSTERS entries
- [x] MULTI_SKILL_BOOSTERS entries

### Step 8: Changelog & Cross-References
- [x] Rename completed from legacy changelog path to `.opencode/changelog/06--sk-doc/`
- [x] Cross-refs in other skill folders

### Step 9: Verification
- [x] Full grep verification
- [x] HVR_REFERENCE legacy-name grep in `.opencode/skill/system-spec-kit/templates/`
- [x] skill_advisor.py smoke test
- [x] Phase validator run: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/skills/003-skill-rename/004-sk-doc`

Evidence:
- Legacy-name grep across active targets -> `EXIT:1` (no matches)
- Legacy-name HVR_REFERENCE grep in `.opencode/skill/system-spec-kit/templates/` -> `EXIT:1`
- `python3 .opencode/skill/scripts/skill_advisor.py "create documentation" --threshold 0.8` -> `TOP_SKILL:sk-doc`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/skills/003-skill-rename/004-sk-doc` -> `Errors: 0, Warnings: 3, EXIT:1`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | All active files | Legacy-name grep (expected no matches) |
| HVR grep | system-spec-kit templates | Legacy-name HVR_REFERENCE grep (expected no matches) |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py "create documentation"` |
| Directory | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3, 1, 2, 7 complete | Internal | Complete | Unblocked; phase execution valid |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken documentation skill, HVR paths broken
- **Procedure**: `git checkout -- .` to restore all files
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 7 ──► Phase 4 (This Phase) ──► Phase 6
                  │
                  ├── Step 1 (Rename)
                  ├── Steps 2-8 (Updates — sequential)
                  └── Step 9 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 | Phase 7 complete | Steps 2-8 |
| Steps 2-8 | Step 1 | Step 9 |
| Step 9 | Steps 2-8 | Phase 6 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (49) | Med | Batch replace |
| Step 3: Agent files (8) | High | ~120 replacements in write.md |
| Step 4: Commands (9) | Med | Path + YAML updates |
| Step 5: spec-kit (12+) | Med | HVR paths |
| Step 6: Guides + docs (7) | Low | Targeted updates |
| Step 7: skill_advisor (1) | Low | 8 lines |
| Step 8: Changelog + xrefs | Low | 1 `git mv` + scan |
| Step 9: Verification | Low | grep + smoke |
| **Total** | **HIGH** | **~101 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phases 3, 1, 2, 7 confirmed complete
- [x] Clean git state

### Rollback Procedure
1. `git checkout -- .`
2. Verify old folder and HVR paths restored

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
