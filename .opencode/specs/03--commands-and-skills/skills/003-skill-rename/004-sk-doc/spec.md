---
title: "Feature Specification: Phase 004 — Finalize Rename to sk-doc [004-sk-doc/spec]"
description: "This is Phase 4 of the Skill Rename (038) specification. It has the HIGHEST external reference count (52 files) making it the most cross-cutting rename."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "004"
  - "finalize"
  - "spec"
  - "documentation"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 004 — Finalize Rename to sk-doc

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
| **Validation** | 2026-02-21 (`errors: 0`, `warnings: 3`) |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 007-mcp-chrome-devtools |
| **Successor** | 006-sk-doc-visual |
| **Handoff Criteria** | Legacy-name grep returns 0 matches in active files; target-name coverage checks pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 4** of the Skill Rename (038) specification. It has the HIGHEST external reference count (52 files) making it the most cross-cutting rename.

**Scope Boundary**: ALL changes required to complete migration from the legacy documentation-skill name to `sk-doc`, including extensive write.md agent updates, HVR template paths in system-spec-kit, and command file references.

**Dependencies**:
- Phases 3, 1, 2, and 7 must complete first (execution order)

**Deliverables**:
- Renamed skill folder: `.opencode/skill/sk-doc/`
- All internal references updated (49 files)
- All external references updated (52 files) — highest count
- skill_advisor.py entries updated (8 lines)
- HVR_REFERENCE paths in system-spec-kit templates updated (8 files)
- write.md agent files extensively updated across 4 runtimes (~30 refs each)
- grep verification: 0 matches for old name
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The documentation skill previously used a legacy `workflows-*` naming convention and is the most heavily cross-referenced skill in the system. With 52 external files referencing it, this rename requires the most careful coordination.

### Purpose
Complete migration from the legacy documentation-skill name to `sk-doc` across all 101 files (49 internal + 52 external), ensuring zero missed references in the most cross-cutting rename of the set.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename completed to target folder `.opencode/skill/sk-doc/` from the prior legacy path
- Update all 49 internal files
- Update 52 external files (highest count)
- Update 8 lines in skill_advisor.py
- Update write.md across 4 runtimes (~30 refs per file = ~120 replacements)
- Update 8 HVR_REFERENCE template paths in system-spec-kit
- Update 9 command files in `.opencode/command/create/`
- Rename changelog directory to `06--sk-doc` from the prior legacy name

### Out of Scope
- Renaming other skills
- Functional changes
- Memory files, changelog content

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder rename | `legacy path -> .opencode/skill/sk-doc/` | Rename | — |
| Internal | `sk-doc/SKILL.md` | Modify | ~5 |
| Internal | `sk-doc/index.md` | Modify | ~3 |
| Internal | `sk-doc/nodes/*.md` (~8 files) | Modify | ~20 |
| Internal | `sk-doc/references/*.md` (~6 files) | Modify | ~15 |
| Internal | `sk-doc/assets/*.md` (~25 files) | Modify | ~30 |
| Internal | `sk-doc/scripts/*.{sh,py}` (~5 files) | Modify | ~10 |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 8 lines |
| Agent | `.opencode/agent/write.md` | Modify | ~30 refs |
| Agent | `.opencode/agent/orchestrate.md` | Modify | ~5 refs |
| Agent | `.opencode/agent/chatgpt/write.md` | Modify | ~30 refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | ~5 refs |
| Agent | `.claude/agents/write.md` | Modify | ~30 refs |
| Agent | `.claude/agents/orchestrate.md` | Modify | ~5 refs |
| Agent | `.gemini/agents/write.md` | Modify | ~30 refs |
| Agent | `.gemini/agents/orchestrate.md` | Modify | ~5 refs |
| Command | `.opencode/command/create/*.md` (6 files) | Modify | ~15 refs |
| Command | `.opencode/command/create/*.yaml` (3 files) | Modify | ~10 refs |
| Install | `.opencode/install_guides/README.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Skill Creation.md` | Modify | ~3 refs |
| Root | `CLAUDE.md` | Modify | ~3 refs |
| Root | `README.md` | Modify | ~5 refs |
| Root | `.opencode/README.md` | Modify | ~5 refs |
| spec-kit | `system-spec-kit/templates/*/implementation-summary.md` (8 files) | Modify | HVR_REFERENCE path |
| spec-kit | `system-spec-kit/templates/*/decision-record.md` (3 files) | Modify | HVR_REFERENCE path |
| spec-kit | `system-spec-kit/templates/core/impl-summary-core.md` | Modify | HVR_REFERENCE path |
| Changelog | `legacy path -> .opencode/changelog/06--sk-doc/` | Rename | — |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `ls .opencode/skill/sk-doc/` exists |
| REQ-002 | Update all internal refs | Legacy-name grep in `.opencode/skill/sk-doc/` = 0 |
| REQ-003 | Update skill_advisor.py | `python3 skill_advisor.py "create documentation"` returns `sk-doc` |
| REQ-004 | Update write.md agent files | All 4 runtime write.md files use `sk-doc` (~120 replacements) |
| REQ-005 | Update orchestrate.md | All 4 runtime orchestrate.md files updated |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update command/create/ files | All 9 command files updated |
| REQ-007 | Update install guides | All 4 install guide files updated |
| REQ-008 | Update root docs | README.md, CLAUDE.md, .opencode/README.md updated |
| REQ-009 | Update HVR_REFERENCE paths | All system-spec-kit template HVR paths updated |
| REQ-010 | Rename changelog dir | `06--sk-doc` exists |
| REQ-011 | Update cross-refs in other skills | References from other skill folders updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Legacy-name grep across `.opencode/skill/`, `.opencode/command/`, `.opencode/agent/`, `.opencode/install_guides/`, `.claude/`, `.gemini/`, `CLAUDE.md`, and `README.md` returns 0
- **SC-002**: `python3 skill_advisor.py "create documentation"` returns `sk-doc`
- **SC-003**: All HVR_REFERENCE paths in system-spec-kit templates point to `sk-doc`
- **SC-004**: Folder `.opencode/skill/sk-doc/` exists with all files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 52 external files — highest cross-cutting risk | H | Per-file verification checklist |
| Risk | write.md has ~30 refs per runtime (~120 total) | H | Batch replace within each file |
| Risk | HVR_REFERENCE paths in templates | M | Targeted grep for HVR_REFERENCE |
| Risk | 9 command files with embedded paths | M | Per-file check |
| Dependency | Phases 3, 1, 2, 7 must complete | Low | Execution order enforced |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: All 4 runtime write.md files must have identical skill references
- **NFR-C02**: HVR_REFERENCE paths must be consistent across all template levels

### Completeness
- **NFR-CP01**: All 52 external files verified — no partial renames
- **NFR-CP02**: All command file template paths updated
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### High-Volume Targets
- write.md files: ~30 refs each across 4 runtimes — must batch-replace carefully
- HVR_REFERENCE comments: `<!-- HVR_REFERENCE: .opencode/skill/sk-doc/... -->`
- Command YAML files: `skill:` field values

### Cross-References
- Multiple other skills reference `sk-doc` in their nodes/
- system-spec-kit templates embed paths to this skill
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 49 internal + 52 external = 101 files — highest total |
| Risk | 18/25 | Most cross-cutting, HVR templates, write.md density |
| Research | 18/20 | All references cataloged |
| **Total** | **58/70** | **Level 2 — High complexity** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
