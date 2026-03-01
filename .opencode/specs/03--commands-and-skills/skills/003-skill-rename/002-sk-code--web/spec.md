---
title: "Feature Specification: Phase 002 — Rename workflows-code--web-dev to sk-code--web [002-sk-code--web/spec]"
description: "This is Phase 2 of the Skill Rename (038) specification."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "002"
  - "rename"
  - "spec"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 002 — Rename workflows-code--web-dev to sk-code--web

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-21 |
| **Completed** | 2026-02-21 |
| **Verified** | 2026-02-21 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-sk-code--opencode |
| **Successor** | 007-mcp-chrome-devtools |
| **Handoff Criteria** | `grep -r "workflows-code--web-dev"` returns 0 matches in active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 2** of the Skill Rename (038) specification.

**Scope Boundary**: ALL changes required to rename `workflows-code--web-dev` to `sk-code--web`, including the name shortening from `web-dev` to `web`.

**Dependencies**:
- Phase 1 (sk-code--opencode) must complete first
- Phase 3 (sk-code--full-stack) must complete first (longest match)

**Deliverables**:
- Renamed skill folder: `.opencode/skill/sk-code--web/`
- All internal references updated (51 files)
- All external references updated (17 files)
- skill_advisor.py entries updated (25 lines)
- Bare `workflows-code` references resolved to `sk-code--web`
- grep verification: 0 matches for old name
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill `workflows-code--web-dev` uses the legacy `workflows-*` naming convention. Additionally, the `web-dev` suffix is unnecessarily verbose when `web` is sufficient and clearer.

### Purpose
Rename `workflows-code--web-dev` to `sk-code--web` across all references, shortening the name while adopting the cleaner `sk-*` convention.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename: `git mv .opencode/skill/workflows-code--web-dev .opencode/skill/sk-code--web`
- Update all 51 internal files within the skill folder
- Update 17 external files that reference this skill
- Update 25 lines in skill_advisor.py
- Resolve bare `workflows-code` references to `sk-code--web` (the default variant)
- Rename changelog directory: `08--workflows-code--web-dev` → `08--sk-code--web`
- Update cross-references to this skill within other skill folders

### Out of Scope
- Renaming any other skill (handled by other phases)
- Functional changes to the skill itself
- Memory files in specs/ (auto-generated)
- Changelog file content (historical record)

### Files to Change

| Category | File Path | Change Type | Description |
|----------|-----------|-------------|-------------|
| Folder rename | `.opencode/skill/workflows-code--web-dev/` | Rename | `git mv` to `sk-code--web/` |
| Internal | `sk-code--web/SKILL.md` | Modify | Update name, title, self-references |
| Internal | `sk-code--web/index.md` | Modify | Update name, description |
| Internal | `sk-code--web/nodes/*.md` (~8 files) | Modify | Update cross-references, self-references |
| Internal | `sk-code--web/references/*.md` (~8 files) | Modify | Update paths, cross-refs |
| Internal | `sk-code--web/assets/*.md` (~25 files) | Modify | Update template paths, examples |
| Internal | `sk-code--web/scripts/*.{sh,mjs}` (~5 files) | Modify | Update hard-coded paths |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | Update 25 lines in INTENT_BOOSTERS/MULTI_SKILL_BOOSTERS |
| Agent | `.opencode/agent/orchestrate.md` | Modify | Update skill table entries |
| Agent | `.opencode/agent/review.md` | Modify | Update `workflows-code--web-dev` refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | Update skill table entries |
| Agent | `.opencode/agent/chatgpt/review.md` | Modify | Update refs |
| Agent | `.claude/agents/orchestrate.md` | Modify | Update skill table entries |
| Agent | `.claude/agents/review.md` | Modify | Update refs |
| Agent | `.gemini/agents/orchestrate.md` | Modify | Update skill table entries |
| Agent | `.gemini/agents/review.md` | Modify | Update refs |
| Install | `.opencode/install_guides/README.md` | Modify | Update skill registry |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Update skill references |
| Root | `CLAUDE.md` | Modify | Update skill references |
| Root | `.opencode/README.md` | Modify | Update skill references |
| Changelog | `.opencode/changelog/08--workflows-code--web-dev/` | Rename | Rename directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder on disk | `ls .opencode/skill/sk-code--web/` exists |
| REQ-002 | Update all internal references | `grep -r "workflows-code--web-dev" .opencode/skill/sk-code--web/` = 0 |
| REQ-003 | Update skill_advisor.py | `python3 skill_advisor.py "implement feature"` returns `sk-code--web` |
| REQ-004 | Update agent files (orchestrate + review) | All 4 runtime agent files use `sk-code--web` |
| REQ-005 | Resolve bare `workflows-code` references | All mapped to `sk-code--web` or `sk-code--*` as appropriate |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update install guides | Install guide skill registries use new name |
| REQ-007 | Update root docs | CLAUDE.md, .opencode/README.md use new name |
| REQ-008 | Rename changelog directory | `ls .opencode/changelog/08--sk-code--web/` exists |
| REQ-009 | Update cross-refs in other skills | Other skill nodes referencing this skill use new name |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "workflows-code--web-dev" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md` returns 0 matches
- **SC-002**: `python3 .opencode/skill/scripts/skill_advisor.py "implement feature"` returns `sk-code--web`
- **SC-003**: Folder `.opencode/skill/sk-code--web/` exists with all files intact
- **SC-004**: No remaining bare `workflows-code` references (without suffix) in active files
- **SC-001 Status**: PASS (`rg -n "workflows-code--web-dev"` on active targets returned exit `1`)
- **SC-002 Status**: PASS (`python3 .opencode/skill/scripts/skill_advisor.py "implement feature" --threshold 0.8` -> `sk-code--web`, confidence `0.80`)
- **SC-003 Status**: PASS (`rg --files .opencode/skill/sk-code--web | wc -l` -> `51`)
- **SC-004 Status**: PASS (`rg -nP "\\bworkflows-code\\b(?!--)"` on active targets returned exit `1`)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1 and 3 must complete first | Substring match risk for `workflows-code--` prefix | Execute after Phase 1 |
| Risk | Name shortening `web-dev` → `web` may break exact-match logic | Med | Verify skill_advisor.py handles shortened name |
| Risk | Bare `workflows-code` references ambiguous | Low | Map each to `sk-code--web` as default variant |
| Risk | 25 skill_advisor lines — moderate density | Low | Mechanical string replacement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Folder name must match skill_advisor.py entries exactly
- **NFR-C02**: All 4 agent runtime directories must have identical references

### Completeness
- **NFR-CP01**: Every file referencing old name must be updated — no partial renames
- **NFR-CP02**: Bare `workflows-code` resolved everywhere, not just full-name matches
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Naming Patterns
- Full path: `.opencode/skill/workflows-code--web-dev/` → `.opencode/skill/sk-code--web/`
- Bare `workflows-code` (no suffix): → `sk-code--web` (default variant)
- Wildcard `workflows-code--*`: → `sk-code--*` (if not already handled by Phase 3)
- Backtick-quoted: `` `workflows-code--web-dev` `` → `` `sk-code--web` ``

### Name Shortening
- `workflows-code--web-dev` → `sk-code--web`: the `dev` suffix is dropped
- Any references to `web-dev` as a descriptor should become `web`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 51 internal + 17 external files |
| Risk | 12/25 | Name shortening adds complexity |
| Research | 18/20 | All references cataloged |
| **Total** | **48/70** | **Level 2 — Medium complexity** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — rename mapping and file inventory complete
<!-- /ANCHOR:questions -->
