---
title: "Feature Specification: Phase 006 — Rename sk-doc-visual to sk-doc-visual [006-sk-doc-visual/spec]"
description: "This is Phase 6 of the Skill Rename (038) specification. It has the FEWEST external references (6 files), making it the lowest-effort phase."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "006"
  - "rename"
  - "spec"
  - "visual"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 006 — Rename sk-doc-visual to sk-doc-visual

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
| **Phase** | 6 of 7 |
| **Predecessor** | 004-sk-doc |
| **Successor** | 005-sk-git |
| **Handoff Criteria** | `grep -r "sk-doc-visual"` returns 0 matches in active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 6** of the Skill Rename (038) specification. It has the FEWEST external references (6 files), making it the lowest-effort phase.

**Scope Boundary**: ALL changes for `sk-doc-visual` → `sk-doc-visual`.

**Dependencies**:
- Phases 3, 1, 2, 7, 4 must complete first

**Deliverables**:
- Renamed skill folder: `.opencode/skill/sk-doc-visual/`
- All internal references updated (22 files)
- All external references updated (6 files)
- skill_advisor.py entries updated (16 lines)
- grep verification: 0 matches
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill `sk-doc-visual` uses the legacy `workflows-*` naming convention. It has relatively few external references (6) but moderate skill_advisor.py density (16 lines).

### Purpose
Rename `sk-doc-visual` to `sk-doc-visual` across all references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename: `git mv .opencode/skill/sk-doc-visual .opencode/skill/sk-doc-visual`
- Update all 22 internal files
- Update 6 external files
- Update 16 lines in skill_advisor.py
- Update doc-visual command files
- Note: No changelog directory exists for this skill (verify)

### Out of Scope
- Renaming other skills, functional changes, memory files

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder | `.opencode/skill/sk-doc-visual/` | Rename | — |
| Internal | `sk-doc-visual/SKILL.md` | Modify | ~5 |
| Internal | `sk-doc-visual/index.md` | Modify | ~3 |
| Internal | `sk-doc-visual/nodes/*.md` (~4 files) | Modify | ~10 |
| Internal | `sk-doc-visual/references/*.md` (~3 files) | Modify | ~8 |
| Internal | `sk-doc-visual/assets/*.md` (~8 files) | Modify | ~15 |
| Internal | `sk-doc-visual/scripts/*.sh` (~2 files) | Modify | ~4 |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 16 lines |
| Agent | `.opencode/agent/orchestrate.md` | Modify | ~2 refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | ~2 refs |
| Command | `.opencode/command/doc-visual/generate.md` | Modify | ~3 refs |
| Command | `.opencode/command/doc-visual/fact-check.md` | Modify | ~2 refs |
| Command | `.opencode/command/doc-visual/diff-review.md` | Modify | ~2 refs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `ls .opencode/skill/sk-doc-visual/` exists |
| REQ-002 | Update all internal refs | grep = 0 within folder |
| REQ-003 | Update skill_advisor.py (16 lines) | Correct routing |
| REQ-004 | Update doc-visual command files | Command files reference new name |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update agent orchestrate.md files | 2 runtimes updated |
| REQ-006 | Update cross-refs in other skills | All updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "sk-doc-visual"` in active files returns 0
- **SC-002**: Folder `.opencode/skill/sk-doc-visual/` exists
- **SC-003**: skill_advisor.py routes correctly
- **SC-001 Status**: PASS (`rg -n "sk-doc-visual"` legacy-name checks returned exit `1` on active targets)
- **SC-002 Status**: PASS (`test -d .opencode/skill/sk-doc-visual` and file count check returned `22`)
- **SC-003 Status**: PASS (`python3 .opencode/skill/scripts/skill_advisor.py "create doc visual" --threshold 0.8` routes to `sk-doc-visual`)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Low external ref count — straightforward | L | Standard verification |
| Dependency | Phases 3, 1, 2, 7, 4 must complete | Execution order | Sequential |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Folder name must match skill_advisor.py entries
- **NFR-C02**: Doc-visual command files must reference correct skill

### Completeness
- **NFR-CP01**: All 22 internal + 6 external files updated
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Command Files
- doc-visual/ command files reference both the skill name and skill folder path
- Both text references AND path segments must be updated

### Changelog
- Verify whether a changelog directory exists for this skill; if not, skip rename
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 22 internal + 6 external — smallest |
| Risk | 6/25 | Low cross-cutting, straightforward |
| Research | 18/20 | All references cataloged |
| **Total** | **34/70** | **Level 2 — Low-Medium** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Verify existence of changelog directory for `sk-doc-visual`
<!-- /ANCHOR:questions -->
