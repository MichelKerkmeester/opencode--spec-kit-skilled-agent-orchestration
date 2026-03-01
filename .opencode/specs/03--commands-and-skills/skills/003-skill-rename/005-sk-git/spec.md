---
title: "Feature Specification: Phase 005 - Finalize sk-git Rename [005-sk-git/spec]"
description: "This is Phase 5 of the Skill Rename (038) specification. It executes last because the legacy git skill name was the shortest old token, avoiding substring-collision risk while o..."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "005"
  - "finalize"
  - "spec"
  - "git"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 005 - Finalize sk-git Rename

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
| **Phase** | 5 of 7 |
| **Predecessor** | 006-sk-doc-visual |
| **Successor** | None (last phase) |
| **Handoff Criteria** | Active-target binary-safe `rg` check for legacy git skill token returns `0` output lines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 5** of the Skill Rename (038) specification. It executes last because the legacy git skill name was the shortest old token, avoiding substring-collision risk while other `workflows-*` renames completed first.

**Scope Boundary**: all rename closure and reference updates for the git skill now named `sk-git`.

**Dependencies**:
- All other phases complete first

**Deliverables**:
- Renamed skill folder: `.opencode/skill/sk-git/`
- Renamed changelog folder: `.opencode/changelog/10--sk-git/`
- Internal reference updates across 20 skill files
- External reference updates across agent/install/root files
- `skill_advisor.py` entries updated (28 lines)
- Active-target binary-safe `rg` verification: `0` output lines
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The git workflow skill used the legacy `workflows-*` naming convention and had the highest `skill_advisor.py` density in this rename set (28 lines).

### Purpose
Finalize migration to `sk-git` across active files and routing definitions while preserving behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename completed for the git skill folder to `.opencode/skill/sk-git/`
- Update all internal references in `sk-git/` (20 files)
- Update external references (agents, install guides, root docs, cross-skill refs)
- Update `skill_advisor.py` mappings (28 lines)
- Changelog directory migrated to `10--sk-git`

### Out of Scope
- Renaming other skills
- Functional behavior changes outside naming
- Editing memory files or historical changelog content

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder | `Legacy git skill folder` | Rename | - |
| Internal | `sk-git/SKILL.md` | Modify | ~5 |
| Internal | `sk-git/index.md` | Modify | ~3 |
| Internal | `sk-git/nodes/*.md` (~5 files) | Modify | ~15 |
| Internal | `sk-git/references/*.md` (~3 files) | Modify | ~8 |
| Internal | `sk-git/assets/*.md` (~5 files) | Modify | ~10 |
| Internal | `sk-git/scripts/*.sh` (~2 files) | Modify | ~5 |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 28 lines |
| Agent | `.opencode/agent/orchestrate.md` | Modify | ~5 refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | ~5 refs |
| Agent | `.claude/agents/orchestrate.md` | Modify | ~5 refs |
| Agent | `.gemini/agents/orchestrate.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/README.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | ~2 refs |
| Install | `.opencode/install_guides/SET-UP - Skill Creation.md` | Modify | ~2 refs |
| Root | `CLAUDE.md` | Modify | ~3 refs |
| Root | `README.md` | Modify | ~3 refs |
| Root | `.opencode/README.md` | Modify | ~3 refs |
| Changelog | `Legacy git changelog folder` | Rename | - |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `.opencode/skill/sk-git/` exists and legacy git folder path is absent |
| REQ-002 | Remove old-name references in active targets | Active-target binary-safe `rg` check returns `0` output lines |
| REQ-003 | Update skill_advisor.py entries (28 lines) | `rg -n "sk-git" .opencode/skill/scripts/skill_advisor.py | wc -l` returns `28` and old-name count returns `0` |
| REQ-004 | Keep git-routing behavior | `skill_advisor.py` resolves `git commit`, `push changes`, and `create branch` to `sk-git` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update install guides (4 files) | Old-name active-target `rg` output line count remains `0` |
| REQ-006 | Update root docs (3 files) | Old-name active-target `rg` output line count remains `0` |
| REQ-007 | Rename changelog dir | `.opencode/changelog/10--sk-git/` exists and old dir is absent |
| REQ-008 | Update cross-refs in other skills | Old-name active-target `rg` output line count remains `0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Verification Status

| ID | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| SC-001 | Old name has `0` output lines in active-target binary-safe `rg` check | Complete | EV-06 |
| SC-002 | `skill_advisor.py` resolves git smoke queries to `sk-git` | Complete | EV-03, EV-04, EV-05 |
| SC-003 | Skill folder exists with expected file count | Complete | EV-01, EV-02 |
| SC-004 | Changelog directory is renamed and old dir is absent | Complete | EV-01 |

### Acceptance Scenarios

1. **Given** current active files, **when** running the generated binary-safe `rg` old-name check, **then** output line count is `0`.
2. **Given** skill routing definitions, **when** running `skill_advisor.py` for `git commit`, `push changes`, and `create branch`, **then** the top skill is `sk-git`.
3. **Given** filesystem state, **when** checking skill/changelog directories, **then** new `sk-git` paths exist and legacy git paths are absent.
4. **Given** `skill_advisor.py` routing definitions, **when** counting `sk-git` and legacy-token occurrences, **then** counts are `28` and `0` respectively.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 28 `skill_advisor.py` lines (highest density) | M | Verified with line-count and smoke tests |
| Risk | Shortest old name; phase had to run last | L | Execution order preserved |
| Risk | 39 external files touched | M | Active-target binary-safe `rg` closure check |
| Dependency | All other phases complete before phase 5 | Complete | Confirmed during implementation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: `skill_advisor.py` entries map to `sk-git` (28 lines)
- **NFR-C02**: Agent references are consistent across 4 runtimes
- **NFR-C03**: Verification commands are binary-safe and scoped to active files
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Substring Ordering
- The legacy git skill name was intentionally executed last to avoid accidental partial replacement during broader `workflows-*` migration.

### Verification Scope
- Historical text in `.opencode/specs/**` and `.opencode/changelog/**` is intentionally excluded from active-file acceptance scans.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 20 internal + 39 external |
| Risk | 12/25 | Highest `skill_advisor.py` density in rename set |
| Research | 18/20 | Reference set fully enumerated and verified |
| **Total** | **45/70** | **Level 2 - Medium-High** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
