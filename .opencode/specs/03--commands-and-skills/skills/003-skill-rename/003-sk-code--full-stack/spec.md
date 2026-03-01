---
title: "Feature Specification: Phase 003 — Rename legacy full-stack skill identifier to [003-sk-code--full-stack/spec]"
description: "This is Phase 3 of the Skill Rename (038) specification. It executes FIRST in the implementation order because legacy full-stack skill identifier is the longest old name, and mu..."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "003"
  - "rename"
  - "spec"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 003 — Rename legacy full-stack skill identifier to sk-code--full-stack

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
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 of 7 |
| **Predecessor** | None (executes first — longest match) |
| **Successor** | 001-sk-code--opencode |
| **Handoff Criteria** | `rg -n "legacy full-stack skill identifier" . --glob '!.git/**' --glob '!.opencode/specs/**' --glob '!.opencode/changelog/**'` returns 0 matches |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the Skill Rename (038) specification. It executes FIRST in the implementation order because `legacy full-stack skill identifier` is the longest old name, and must be replaced before shorter `workflows-code--` prefixes to prevent partial matches.

**Scope Boundary**: ALL changes required to rename `legacy full-stack skill identifier` to `sk-code--full-stack`.

**Dependencies**:
- None — this phase executes first

**Deliverables**:
- Renamed skill folder: `.opencode/skill/sk-code--full-stack/`
- All internal references updated (88 files)
- All external references updated (11 files)
- skill_advisor.py entries updated (8 lines)
- grep verification: 0 matches for old name
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill `legacy full-stack skill identifier` uses the legacy `workflows-*` naming convention. At 88 internal files, it is the largest skill folder and the longest name in the rename set.

### Purpose
Rename `legacy full-stack skill identifier` to `sk-code--full-stack` across all references. Execute first to prevent `workflows-code--` prefix from causing partial matches in later phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename: `git mv .opencode/skill/legacy full-stack skill identifier .opencode/skill/sk-code--full-stack`
- Update all 88 internal files within the skill folder
- Update 11 external files that reference this skill
- Update 8 lines in skill_advisor.py
- Rename changelog directory: `09--legacy full-stack skill identifier` → `09--sk-code--full-stack`

### Out of Scope
- Renaming any other skill
- Functional changes
- Memory files, changelog content

### Files to Change

| Category | File Path | Change Type | Description |
|----------|-----------|-------------|-------------|
| Folder rename | `.opencode/skill/legacy full-stack skill identifier/` | Rename | `git mv` to `sk-code--full-stack/` |
| Internal | `sk-code--full-stack/SKILL.md` | Modify | name, title, self-refs |
| Internal | `sk-code--full-stack/index.md` | Modify | name, description |
| Internal | `sk-code--full-stack/nodes/*.md` (~15 files) | Modify | cross-refs, self-refs |
| Internal | `sk-code--full-stack/references/*.md` (~20 files) | Modify | paths, cross-refs |
| Internal | `sk-code--full-stack/assets/*.md` (~40 files) | Modify | template paths, examples |
| Internal | `sk-code--full-stack/scripts/*.{sh,ts}` (~8 files) | Modify | paths |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 8 lines |
| Agent | `.opencode/agent/orchestrate.md` | Modify | skill table |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | skill table |
| Agent | `.claude/agents/orchestrate.md` | Modify | skill table |
| Agent | `.gemini/agents/orchestrate.md` | Modify | skill table |
| Install | `.opencode/install_guides/README.md` | Modify | skill registry |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | skill refs |
| Root | `CLAUDE.md` | Modify | skill refs |
| Changelog | `.opencode/changelog/09--legacy full-stack skill identifier/` | Rename | directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `ls .opencode/skill/sk-code--full-stack/` exists |
| REQ-002 | Update all internal refs | `grep -r "legacy full-stack skill identifier" .opencode/skill/sk-code--full-stack/` = 0 |
| REQ-003 | Update skill_advisor.py | Correct routing for full-stack queries |
| REQ-004 | Update agent files | All 4 runtime orchestrate.md use new name |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update install guides | 2 files updated |
| REQ-006 | Update root docs | CLAUDE.md updated |
| REQ-007 | Rename changelog dir | `09--sk-code--full-stack` exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Verification Status

| ID | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| SC-001 | Old name has 0 matches in active files | Complete | EV-09: `0` matches |
| SC-002 | `.opencode/skill/sk-code--full-stack/` exists with 88 files | Complete | EV-01 + EV-02 |
| SC-003 | `skill_advisor.py` uses `sk-code--full-stack` and no old-name entries | Complete | EV-04: `8` hits, EV-05: `0` hits |

### Acceptance Scenarios

1. **Given** the repository state on 2026-02-21, **when** checking `.opencode/skill/`, **then** `sk-code--full-stack` exists and `legacy full-stack skill identifier` is absent.
2. **Given** the renamed skill folder, **when** scanning its files for `legacy full-stack skill identifier`, **then** the result is `0` matches.
3. **Given** the active documentation and runtime files (excluding specs/changelog history), **when** scanning for `legacy full-stack skill identifier`, **then** the result is `0` matches.
4. **Given** skill routing definitions, **when** checking `skill_advisor.py`, **then** `sk-code--full-stack` appears in routing entries and `legacy full-stack skill identifier` does not.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 88 internal files — highest volume | Med | Batch find-replace |
| Risk | Longest name — must execute first | Low | Execution order enforced |
| Dependency | None — executes first | N/A | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Folder name must match skill_advisor.py entries
- **NFR-C02**: Agent files consistent across 4 runtimes

### Completeness
- **NFR-CP01**: All 88 internal files updated — no partial renames
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Volume
- 88 internal files is the largest skill folder
- assets/ alone has ~40 files — ensure batch processing covers all

### Naming
- Full path segments and backtick-quoted references
- No name shortening (unlike Phase 2) — straightforward prefix swap
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 88 internal + 11 external files — highest volume |
| Risk | 8/25 | Straightforward prefix swap, no name shortening |
| Research | 18/20 | All references cataloged |
| **Total** | **46/70** | **Level 2 — Medium complexity (high volume)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
