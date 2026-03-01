---
title: "Feature Specification: Phase 008 — Rename workflows-code to sk-code in Barter repo [008-sk-code-from-barter-repo/spec]"
description: "This is Phase 8 of the Skill Rename (038) specification — the final phase."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "008"
  - "rename"
  - "spec"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 008 — Rename `workflows-code` to `sk-code` in Barter repo

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
| **Phase** | 8 of 8 |
| **Predecessor** | 007-mcp-chrome-devtools (Completed) |
| **Successor** | None (final phase) |
| **Handoff Criteria** | Legacy-token scan returns 0 bare `workflows-code` matches in Barter repo active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 8** of the Skill Rename (038) specification — the final phase.

**Scope Boundary**: ALL changes required to finalize rename of the `workflows-code` skill to `sk-code` in the Barter repo, including filesystem rename, internal file updates, external reference updates across Barter repo files, and verification.

**Dependencies**:
- Phase 7 (007-mcp-chrome-devtools) is completed and not a blocker

**Deliverables**:
- Canonical skill folder path: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/sk-code/`
- All internal references updated (6 files, 6 lines)
- All active-path external references updated (8 files, ~35 lines)
- skill_advisor.py entries updated (27 lines)
- Legacy-token verification: 0 bare `workflows-code` matches in Barter repo active files

**Notes**:
- No suffix is used (`sk-code`, not `sk-code--opencode`) because the Barter repo has a single code skill
- Cross-skill references within `workflows-code/SKILL.md` to other Barter skills (`workflows-git`, `workflows-documentation`, `workflows-chrome-devtools`) are deferred to future Barter rename phases
- References to `workflows-code--*` suffixed variants in `README.md` and `config.jsonc` are out of scope (only suffixed variants, handled separately)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Barter repo's `workflows-code` skill folder uses the legacy `workflows-` prefix convention. This is inconsistent with the target `sk-*` convention adopted across the Public repo. Unlike the Public repo where multiple suffixed variants exist (`sk-code--opencode`, `sk-code--web-dev`, etc.), the Barter repo has a single code skill, so the correct rename target is `sk-code` with no suffix.

### Purpose
Rename `workflows-code` to `sk-code` across all active references in the Barter repo, maintaining full functionality while adopting the cleaner `sk-*` naming convention as the final phase of the 038 skill rename specification.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename of `.opencode/skill/workflows-code/` to `.opencode/skill/sk-code/` in the Barter repo
- Update 6 internal files within the skill folder (6 lines total)
- Update 8 external files in the Barter repo that reference `workflows-code` (~35 lines)
- Update 27 lines in the Barter repo's `skill_advisor.py`
- Add CHANGELOG entry in `sk-code/SKILL.md` and bump version from 6.0.0

### Out of Scope
- Cross-skill references within `SKILL.md` to other Barter skills (`workflows-git`, `workflows-documentation`, `workflows-chrome-devtools`) — deferred to future Barter rename phases
- References on SKILL.md L46-47 to `workflows-git/documentation` — other skills, leave as-is
- Suffixed variants in `README.md` (`workflows-code--full-stack`, `workflows-code--web-dev`, `workflows-code--opencode`) — future phases
- Suffixed variants in `config.jsonc` (`workflows-code--web-dev`, `workflows-code--opencode`) — future phases
- Cross-skill references in `workflows-git/`, `workflows-chrome-devtools/` — future Barter phases
- Commands, agents, install guides — will be duplicated from Public repo later
- Functional changes to the skill itself
- Memory files in specs/ (auto-generated)
- Changelog file content history

### Files to Change

All paths are relative to `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/`.

| Category | File Path | Change Type | Description |
|----------|-----------|-------------|-------------|
| Folder rename | `.opencode/skill/sk-code/` | Rename | Move `workflows-code/` to canonical `sk-*` path |
| Internal | `.opencode/skill/sk-code/SKILL.md` | Modify | L2: name field; L10: keywords comment; L653: directory tree reference |
| Internal | `.opencode/skill/sk-code/references/stack_detection.md` | Modify | L21: skill name in prose |
| Internal | `.opencode/skill/sk-code/assets/debugging_checklist.md` | Modify | L242: relative link label |
| Internal | `.opencode/skill/sk-code/assets/verification_checklist.md` | Modify | L225: relative link label |
| External | `.opencode/skill/scripts/skill_advisor.py` | Modify | 27 bare `workflows-code` entries in INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS |
| External | `.opencode/skill/system-spec-kit/SKILL.md` | Modify | L699, L725: routing and downstream skill references |
| External | `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md` | Modify | L192: skill name in prose |
| External | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | L688: skill listing entry |
| External | `.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md` | Modify | L410: skill name in prose |
| External | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | L817: skill listing entry |
| External | `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Modify | L1133: skill listing entry |
| External | `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md` | Modify | L363: skill listing entry |
| Changelog | `.opencode/skill/sk-code/SKILL.md` | Modify | Add `## 2026-02-21` changelog entry and bump version from 6.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder on disk | `ls .opencode/skill/sk-code/` exists in Barter repo |
| REQ-002 | Update all internal references (6 lines in 4 files) | Legacy-token scan in `.opencode/skill/sk-code/` returns 0 bare `workflows-code` matches |
| REQ-003 | Update skill_advisor.py (27 lines) | `python3 skill_advisor.py "code standards"` routes to `sk-code` |
| REQ-004 | Update active-path external references (8 files) | All listed external files use `sk-code` instead of `workflows-code` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add CHANGELOG entry and version bump in SKILL.md | SKILL.md contains `## 2026-02-21` entry and version > 6.0.0 |
| REQ-006 | Confirm deferred cross-skill refs are documented | SKILL.md L752-757 and L46-47 cross-refs to other Barter skills noted as deferred; no unintended changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Legacy-token scan for bare `workflows-code` across the active-path Barter target set returns 0 matches
- **SC-002**: `python3 .opencode/skill/scripts/skill_advisor.py "code standards"` returns `sk-code` in Barter repo
- **SC-003**: Folder `.opencode/skill/sk-code/` exists in Barter repo with all files intact (original `workflows-code/` folder absent)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 7 predecessor completion | Satisfied; not blocking this phase | Predecessor status recorded in metadata |
| Risk | Distinguishing bare `workflows-code` from suffixed variants (`workflows-code--full-stack`, etc.) | Med | Use exact token match `\bworkflows-code\b` without suffix; verify out-of-scope files untouched |
| Risk | skill_advisor.py 27-line update volume | Low | Mechanical string replacement; all entries are bare `workflows-code` |
| Risk | Deferred cross-skill refs accidentally updated | Low | Explicitly exclude SKILL.md L46-47 and L752-757 from scope; grep-verify after changes |
| Risk | CHANGELOG version bump format | Low | Follow existing SKILL.md changelog format; increment from 6.0.0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Folder name must match skill_advisor.py entries exactly (`sk-code`)
- **NFR-C02**: All active-path external references listed in Scope must resolve to `sk-code`
- **NFR-C03**: Suffixed variants (`workflows-code--*`) must remain unchanged in files listed as out of scope

### Completeness
- **NFR-CP01**: Every file referencing bare `workflows-code` in the active-path Barter target set must be updated; no partial renames
- **NFR-CP02**: Deferred references (cross-skill L46-47, L752-757, suffixed variants) must be explicitly left unchanged and documented as deferred
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Naming Patterns
- Bare token: `workflows-code` → `sk-code` (all active-path occurrences)
- Path segment: `workflows-code/` → `sk-code/` (folder reference)
- Backtick-quoted: `` `workflows-code` `` → `` `sk-code` ``
- Prose mention: `workflows-code skill` → `sk-code skill`

### Suffixed Variants (NOT updated in this phase)
- `workflows-code--full-stack`, `workflows-code--web-dev`, `workflows-code--opencode` — remain unchanged; these appear only in `README.md` and `config.jsonc` which are out of scope for this phase

### Cross-Skill References (DEFERRED)
- SKILL.md L752-757: Related Skills table references `workflows-documentation`, `workflows-git`, `workflows-chrome-devtools` — these reference OTHER skills, not `workflows-code` itself; deferred to future Barter rename phases
- SKILL.md L46-47: References to `workflows-git/documentation` paths — other skills; leave unchanged

### CHANGELOG Version Bump
- Current version: 6.0.0 in `sk-code/SKILL.md`
- Format: Add `## 2026-02-21` section with `### Updated` subsection and bullet describing the rename
- Version increment: bump to reflect the rename change (e.g., 6.1.0 or as appropriate to existing versioning pattern)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 6 internal lines + 8 external files (~35 lines) — smaller than earlier phases |
| Risk | 8/25 | Mechanical but must distinguish bare from suffixed tokens |
| Research | 18/20 | All references cataloged; deferred items explicitly documented |
| **Total** | **34/70** | **Level 2 — Low-Medium complexity** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — rename mapping and file inventory complete; deferred items documented
<!-- /ANCHOR:questions -->
