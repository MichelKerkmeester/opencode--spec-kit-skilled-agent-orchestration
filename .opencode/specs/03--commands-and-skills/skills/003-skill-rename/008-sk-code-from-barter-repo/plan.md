---
title: "Implementation Plan: Phase 008 — Rename workflows-code to sk-code in Barter repo [008-sk-code-from-barter-repo/plan]"
description: "Finalize migration to sk-code in the Barter repo by renaming the workflows-code skill folder and updating all active-path references: 6 internal content lines across 4 files, an..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "008"
  - "rename"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 008 — Rename `workflows-code` to `sk-code` in Barter repo

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, Shell |
| **Framework** | OpenCode skill system (Barter repo) |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |
| **Repo** | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/` |

### Overview
Finalize migration to `sk-code` in the Barter repo by renaming the `workflows-code` skill folder and updating all active-path references: 6 internal content lines across 4 files, and 8 external files containing ~35 lines (including 27 entries in skill_advisor.py). No suffix is applied (`sk-code`, not `sk-code--opencode`) because the Barter repo has a single code skill. This is the final phase (8 of 8) of the 038 skill rename specification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable (legacy-token scan, smoke test, directory check)
- [x] Phase 7 predecessor status recorded as completed and non-blocking
- [x] Deferred items (cross-skill refs, suffixed variants) explicitly documented and excluded from scope

### Definition of Done
- [ ] Canonical folder path is `sk-code` in Barter repo
- [ ] Zero bare `workflows-code` matches in active-path Barter files
- [ ] skill_advisor.py returns `sk-code` for test queries
- [ ] CHANGELOG entry added and version bumped in SKILL.md
- [ ] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace refactor. No architectural changes.

### Key Components

**Barter repo base path**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/`

- **Skill folder**: `.opencode/skill/sk-code/` (renamed from `workflows-code/`; ~88 files in folder)
- **Internal content files (4 files, 6 lines)**:
  - `sk-code/SKILL.md` — 3 lines (L2, L10, L653)
  - `sk-code/references/stack_detection.md` — 1 line (L21)
  - `sk-code/assets/debugging_checklist.md` — 1 line (L242)
  - `sk-code/assets/verification_checklist.md` — 1 line (L225)
- **skill_advisor.py**: 27 bare `workflows-code` entries in INTENT_BOOSTERS (L256-277) and MULTI_SKILL_BOOSTERS (L302-315)
- **system-spec-kit external refs**: SKILL.md (2 lines) + 5 references files (1 line each) + 1 assets file (1 line)

### Data Flow
No data flow changes. Skills are loaded by name from filesystem paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [ ] Rename `workflows-code/` skill folder to `sk-code/` in Barter repo
- [ ] Verify new folder exists with all contents intact

### Step 2: Internal File Updates (4 files, 6 lines)
- [ ] Update `SKILL.md` L2: `name: workflows-code` → `name: sk-code`
- [ ] Update `SKILL.md` L10: `<!-- Keywords: workflows-code, ...` → `<!-- Keywords: sk-code, ...`
- [ ] Update `SKILL.md` L653: `workflows-code/` (directory tree) → `sk-code/`
- [ ] Update `references/stack_detection.md` L21: `workflows-code skill` → `sk-code skill`
- [ ] Update `assets/debugging_checklist.md` L242: `[workflows-code SKILL.md]` → `[sk-code SKILL.md]`
- [ ] Update `assets/verification_checklist.md` L225: `[workflows-code SKILL.md]` → `[sk-code SKILL.md]`

### Step 3: External Reference Updates (8 files, ~35 lines)
- [ ] Update `skill_advisor.py` INTENT_BOOSTERS (L256-277): replace 17 bare `workflows-code` entries with `sk-code`
- [ ] Update `skill_advisor.py` MULTI_SKILL_BOOSTERS (L302-315): replace 10 bare `workflows-code` entries with `sk-code`
- [ ] Update `system-spec-kit/SKILL.md` L699: `workflows-code` → `sk-code` in routing chain
- [ ] Update `system-spec-kit/SKILL.md` L725: `workflows-code` → `sk-code` in skill table
- [ ] Update `system-spec-kit/references/validation/phase_checklists.md` L192: prose reference
- [ ] Update `system-spec-kit/references/workflows/quick_reference.md` L688: skill listing entry
- [ ] Update `system-spec-kit/references/memory/epistemic-vectors.md` L410: prose reference
- [ ] Update `system-spec-kit/references/templates/level_specifications.md` L817: skill listing entry
- [ ] Update `system-spec-kit/references/templates/template_guide.md` L1133: skill listing entry
- [ ] Update `system-spec-kit/assets/level_decision_matrix.md` L363: skill listing entry

### Step 4: Changelog & Version Bump
- [ ] Add `## 2026-02-21` CHANGELOG entry to `sk-code/SKILL.md` with rename description
- [ ] Bump version from 6.0.0 in `sk-code/SKILL.md`

### Step 5: Verification
- [ ] Legacy-token scan (bare `workflows-code`) across active-path Barter target set → 0 results
- [ ] `python3 .opencode/skill/scripts/skill_advisor.py "code standards"` → routes to `sk-code`
- [ ] `ls .opencode/skill/sk-code/` in Barter repo → folder exists
- [ ] Confirm `workflows-code/` folder alias is absent in Barter repo
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Legacy-token verification | All active-path Barter files | `rg 'workflows-code' --no-suffix-match` (bare token scan) |
| Smoke test | skill_advisor.py routing | `python3 .opencode/skill/scripts/skill_advisor.py "code standards"` |
| Directory check | Filesystem rename | `ls -d .opencode/skill/sk-code/` and absence of `workflows-code/` |
| Deferred ref confirmation | SKILL.md L46-47, L752-757 | Manual spot-check that these lines were NOT modified |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 7 (007-mcp-chrome-devtools) | Internal | Completed | Not blocking for this phase |
| Filesystem access to Barter repo | External | Available | Cannot rename without access |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading, missed references, unintended changes to out-of-scope files
- **Procedure**: `git checkout -- .opencode/skill/` in Barter repo (`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/`)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 7 (Chrome DevTools) [Completed] ──► Phase 8 (This Phase — Final)
                                              │
                                              ├── Step 1 (Rename) ──► Steps 2-4 (Updates) ──► Step 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 (Rename) | Phase 7 recorded as completed | Steps 2-4 |
| Steps 2-4 (Updates) | Step 1 | Step 5 |
| Step 5 (Verify) | Steps 2-4 | Nothing (final phase) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Filesystem Rename | Low | 1 `git mv` command |
| Step 2: Internal Updates | Low | 4 files, 6 mechanical line replacements |
| Step 3: External Updates | Med | 8 files, ~35 lines; 27 skill_advisor.py entries |
| Step 4: Changelog & Version Bump | Low | 2 edits in SKILL.md |
| Step 5: Verification | Low | grep scan + smoke test + directory check |
| **Total** | **Low-Medium** | **~14 files, ~41 line changes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 7 dependency marked completed (non-blocking) for this phase
- [ ] Clean git state in Barter repo (or changes committed)
- [ ] Deferred items confirmed and documented before starting

### Rollback Procedure
1. `git checkout -- .` in Barter repo to restore all modified files
2. Restore `workflows-code/` skill folder path if rollback requires name reversal: `git mv .opencode/skill/sk-code .opencode/skill/workflows-code`
3. Verify `workflows-code/` folder is restored and `sk-code/` alias is absent

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure filesystem and content changes
<!-- /ANCHOR:enhanced-rollback -->
