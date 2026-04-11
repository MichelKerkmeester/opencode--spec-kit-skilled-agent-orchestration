---
title: "Phase 7 Plan: Skill Rename Execution Strategy"
description: "Four-stage plan: pre-flight scan, folder renames, mass text replace, verification."
trigger_phrases:
  - "phase 7 plan"
  - "skill rename plan"
importance_tier: "normal"
contextType: "plan"
---
# Implementation Plan: Skill Rename — sk-improve-agent & sk-improve-prompt

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Mechanical rename refactor with no behavior change. Executes in four stages:

1. **Pre-flight** — confirm no collisions, build authoritative file list via `grep -l`.
2. **Folder renames** — `git mv` two skill folders and two changelog folders.
3. **Mass text replace** — run `sed -i ''` across all text files containing either old name. Do this AFTER folder renames so sed also fixes the content inside the newly-moved folders.
4. **Verification** — grep residuals, run validator, smoke-test `skill_advisor.py`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Pre-execution: spec.md + tasks.md + checklist.md present; no collisions outside the phase folder itself.
- Mid-execution: after folder renames, `ls .opencode/skill/sk-improve-agent` and `ls .opencode/skill/sk-improve-prompt` both succeed.
- Post-execution: `grep -r "sk-agent-improver\|sk-prompt-improver"` returns zero matches (excluding `.git/`).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

**Strategy**: folder rename first, text replace second.

**Why this order?**
- `git mv` preserves file identity and history tracking.
- Doing text replace AFTER the folder rename means we only run sed once and it covers the moved files (now at new paths) and all external references in one pass.

**Text replace tooling**: `sed -i ''` on macOS via `xargs` fed by `grep -rl`. Safer than find+exec loop because xargs handles quoting and errors.

**Excluded paths**: `.git/`, `node_modules/`, `*/dist/`, `*.lock`, binary files (implicit — sed skips).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight (T001–T002)
- Confirm absence of collision strings outside this spec folder.
- Capture authoritative file list via `grep -rl`.

### Phase 2: Folder renames (T003–T006)
- `git mv .opencode/skill/sk-agent-improver .opencode/skill/sk-improve-agent`
- `git mv .opencode/skill/sk-prompt-improver .opencode/skill/sk-improve-prompt`
- `git mv .opencode/changelog/14--sk-prompt-improver .opencode/changelog/14--sk-improve-prompt`
- `git mv .opencode/changelog/15--sk-agent-improver .opencode/changelog/15--sk-improve-agent`

### Phase 3: Mass text replace (T007–T008)
- `sk-agent-improver` → `sk-improve-agent` across all text files
- `sk-prompt-improver` → `sk-improve-prompt` across all text files

### Phase 4: Verification (T009–T012)
- Grep residuals (expect zero).
- Spot-check high-value files.
- Confirm `git status` shows renames (R).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Static verification**: grep residual count must be zero.
- **Path resolution**: `ls .opencode/skill/sk-improve-agent/SKILL.md` and `ls .opencode/skill/sk-improve-prompt/SKILL.md` succeed.
- **Routing smoke test**: verify `skill_advisor.py` fixtures reference new names.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `git` (rename detection).
- macOS `sed` with `-i ''` in-place edit syntax.
- `grep` with `-r` recursive and `-l` file-list modes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If mid-run failure:
- `git checkout -- .` discards uncommitted text changes.
- `git mv` reversals for the four folders.
- Commit only once all stages pass verification.
<!-- /ANCHOR:rollback -->
