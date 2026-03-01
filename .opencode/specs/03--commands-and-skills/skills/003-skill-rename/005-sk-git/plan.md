---
title: "Implementation Plan: Phase 005 - Finalize sk-git Rename [005-sk-git/plan]"
description: "Phase implementation is complete for sk-git, including skill/changelog folder renames, internal and external reference updates, and routing verification for git queries."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "005"
  - "finalize"
  - "git"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 005 - Finalize sk-git Rename

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
| **Testing** | Binary-safe active-target `rg` verification, `skill_advisor.py` smoke tests |

### Overview
Phase implementation is complete for `sk-git`, including skill/changelog folder renames, internal and external reference updates, and routing verification for git queries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable
- [x] Dependencies identified (this phase executes last)

### Definition of Done
- [x] Folder renamed to `sk-git` [Evidence: EV-01]
- [x] Old-name active-target binary-safe `rg` output line count is `0` [Evidence: EV-06]
- [x] `skill_advisor.py` routing is correct for git smoke tests [Evidence: EV-03, EV-04, EV-05]
- [x] Changelog folder renamed to `10--sk-git` [Evidence: EV-01]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical rename and reference migration. No architectural changes.

### Key Components
- **Skill folder**: 20 files
- **skill_advisor.py**: 28 lines updated/verified
- **Agent files**: 4 orchestrate.md files
- **Install guides**: 4 files
- **Root docs**: 3 files

### Data Flow
No changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Filesystem Rename
- [x] Git skill folder moved to `.opencode/skill/sk-git` [Evidence: EV-01]

### Phase 2: Internal File Updates (20 files)
- [x] SKILL.md, index.md, nodes/, references/, assets/, scripts/ [Evidence: EV-06]

### Phase 3: skill_advisor.py (28 lines)
- [x] INTENT_BOOSTERS entries updated [Evidence: EV-07, EV-08]
- [x] MULTI_SKILL_BOOSTERS entries updated [Evidence: EV-07, EV-08]

### Phase 4: External Reference Updates (39 files)
- [x] orchestrate.md (4 runtimes) [Evidence: EV-06]
- [x] Install guides (4 files) [Evidence: EV-06]
- [x] Root docs (3 files) [Evidence: EV-06]
- [x] Other external references [Evidence: EV-06]

### Phase 5: Changelog & Cross-References
- [x] Git changelog folder moved to `.opencode/changelog/10--sk-git` [Evidence: EV-01]
- [x] Cross-references updated [Evidence: EV-06]

### Phase 6: Verification
- [x] Binary-safe active-target old-name `rg` check returns `0` output lines [Evidence: EV-06]
- [x] `python3 .opencode/skill/scripts/skill_advisor.py "git commit"` -> `sk-git` [Evidence: EV-03]
- [x] `python3 .opencode/skill/scripts/skill_advisor.py "push changes"` -> `sk-git` [Evidence: EV-04]
- [x] `python3 .opencode/skill/scripts/skill_advisor.py "create branch"` -> `sk-git` [Evidence: EV-05]
- [x] Folder and changelog directory presence checks pass [Evidence: EV-01, EV-02]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Active-target old-name scan | Active text files only | `rg -n -I --hidden --no-messages ... | wc -l` |
| Smoke test | `skill_advisor.py` | `python3 .opencode/skill/scripts/skill_advisor.py` |
| Routing density check | `skill_advisor.py` line counts | `rg -n` + `wc -l` |
| Directory validation | Skill/changelog folders | `test -d`, `find ... | wc -l` |

### Verification Evidence (2026-02-21)
- `EV-01`: directory checks -> `new_skill_dir=present`, `old_skill_dir=missing`, `new_changelog_dir=present`, `old_changelog_dir=missing`
- `EV-02`: `find .opencode/skill/sk-git -type f | wc -l` -> `20`
- `EV-03`: `python3 .opencode/skill/scripts/skill_advisor.py "git commit"` -> top skill `sk-git` (confidence `0.95`)
- `EV-04`: `python3 .opencode/skill/scripts/skill_advisor.py "push changes"` -> top skill `sk-git` (confidence `0.95`)
- `EV-05`: `python3 .opencode/skill/scripts/skill_advisor.py "create branch"` -> top skill `sk-git` (confidence `0.94`)
- `EV-06`: `rg -n -I --hidden --no-messages "workflows[-]git" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md README.md .opencode/README.md --glob '!.git/**' --glob '!.opencode/specs/**' --glob '!.opencode/changelog/**' --glob '!**/memory/**' --glob '!**/scratch/**' --glob '!*.sqlite' --glob '!*.sqlite-*' | wc -l` -> `0`
- `EV-07`: `rg -n "sk-git" .opencode/skill/scripts/skill_advisor.py | wc -l` -> `28`
- `EV-08`: `rg -n "workflows[-]git" .opencode/skill/scripts/skill_advisor.py | wc -l` -> `0`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| All other phases complete first | Internal | Complete | This phase now unblocked and complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading after rename
- **Procedure**: `git checkout -- .`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 6 -> Phase 5 (this phase, last)
              |
              +-- Step 1 -> Steps 2-5 -> Step 6
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (20) | Low | Small folder |
| Step 3: skill_advisor (28 lines) | Medium | Highest line count |
| Step 4: External (39) | Medium | Moderate refs |
| Step 5: Changelog | Low | 1 `git mv` |
| Step 6: Verification | Low | `rg` + smoke tests |
| **Total** | **Medium-High** | **~59 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All other phases confirmed complete
- [x] Clean git state

### Rollback Procedure
1. `git checkout -- .`
2. Re-run the active-target old-name check

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
