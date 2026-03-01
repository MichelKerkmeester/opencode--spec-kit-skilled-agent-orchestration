---
title: "Implementation Plan: Phase 003 — Rename legacy full-stack skill identifier to [003-sk-code--full-stack/plan]"
description: "Renamed legacy full-stack skill identifier to sk-code--full-stack across 99 files (88 internal + 11 external). This phase executed first in the implementation order (longest mat..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "003"
  - "rename"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 003 — Rename legacy full-stack skill identifier to sk-code--full-stack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, TypeScript, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Renamed `legacy full-stack skill identifier` to `sk-code--full-stack` across 99 files (88 internal + 11 external). This phase executed first in the implementation order (longest match) to prevent partial substring collisions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] No dependencies — executes first

### Definition of Done
- [x] Folder renamed to `sk-code--full-stack` [Evidence: EV-01]
- [x] Zero grep matches for old name in active scope [Evidence: EV-09]
- [x] skill_advisor.py uses new name and no old-name entries [Evidence: EV-04, EV-05]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace. No architectural changes.

### Key Components
- **Skill folder**: 88 files (largest in rename set)
- **skill_advisor.py**: 8 lines (MULTI_SKILL_BOOSTERS primarily)
- **Agent files**: 4 orchestrate.md files
- **Install guides**: 2 files

### Data Flow
No changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Filesystem Rename
- [x] `git mv .opencode/skill/legacy full-stack skill identifier .opencode/skill/sk-code--full-stack` [Evidence: EV-01]

### Phase 2: Internal File Updates (88 files)
- [x] Update SKILL.md, index.md [Evidence: EV-11]
- [x] Update nodes/*.md (~15 files) [Evidence: EV-03]
- [x] Update references/*.md (~20 files) [Evidence: EV-03]
- [x] Update assets/*.md (~40 files) [Evidence: EV-03]
- [x] Update scripts/*.{sh,ts} (~8 files) [Evidence: EV-03]

### Phase 3: External Reference Updates (11 files)
- [x] Update skill_advisor.py (8 lines) [Evidence: EV-04, EV-05]
- [x] Update orchestrate.md (4 runtimes) to remove old-name references [Evidence: EV-07]
- [x] Update install guides (2 files) [Evidence: EV-06]
- [x] Verify no old-name references in `CLAUDE.md` [Evidence: EV-12]

### Phase 4: Changelog & Cross-References
- [x] `git mv .opencode/changelog/09--legacy full-stack skill identifier .opencode/changelog/09--sk-code--full-stack` [Evidence: EV-10]
- [x] Update cross-refs in other skills [Evidence: EV-08]

### Phase 5: Verification
- [x] grep: 0 matches for `legacy full-stack skill identifier` in active scope [Evidence: EV-09]
- [x] skill_advisor.py smoke test (string-level routing validation) [Evidence: EV-04, EV-05]
- [x] Directory exists with expected file count [Evidence: EV-01, EV-02]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | All active files | `grep -r` |
| Smoke test | skill_advisor.py | `python3` |
| Directory | Filesystem | `ls -d` |

### Verification Evidence (2026-02-21)
- `EV-01`: folder existence check -> `sk-code--full-stack: present`, `legacy full-stack skill identifier: absent`
- `EV-02`: `find .opencode/skill/sk-code--full-stack -type f | wc -l` -> `88`
- `EV-03`: `rg -n "legacy full-stack skill identifier" .opencode/skill/sk-code--full-stack | wc -l` -> `0`
- `EV-04`: `rg -n "sk-code--full-stack" .opencode/skill/scripts/skill_advisor.py | wc -l` -> `8`
- `EV-05`: `rg -n "legacy full-stack skill identifier" .opencode/skill/scripts/skill_advisor.py | wc -l` -> `0`
- `EV-06`: install guide scan shows `sk-code--full-stack` entries in both files; no old-name hits
- `EV-07`: old-name hits in four orchestrate files -> `0`
- `EV-08`: old-name hits in `.opencode/skill/` tree -> `0`
- `EV-09`: old-name hits in active scope (excluding `.git`, `.opencode/specs`, `.opencode/changelog`) -> `0`
- `EV-10`: changelog directory check -> `09--sk-code--full-stack: present`, `09--legacy full-stack skill identifier: absent`
- `EV-11`: `SKILL.md` and `index.md` both declare `name: sk-code--full-stack`
- `EV-12`: old-name hits in `CLAUDE.md` -> `0`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | Executes first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading
- **Procedure**: `git checkout -- .` to restore all files
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 3 (This Phase — FIRST) ──► Phase 1 (Opencode) ──► Phase 2 (Web)
       │
       ├── Step 1 (Rename) ──► Steps 2-4 ──► Step 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 | None | Steps 2-4 |
| Steps 2-4 | Step 1 | Step 5 |
| Step 5 | Steps 2-4 | Phase 1 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (88 files) | High | Largest batch |
| Step 3: External (11 files) | Low | Few external refs |
| Step 4: Changelog | Low | 1 `git mv` |
| Step 5: Verification | Low | grep + smoke |
| **Total** | **Medium** | **~99 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Clean git state

### Rollback Procedure
1. `git checkout -- .`
2. Verify old folder restored

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
