---
title: "Feature Specification: Remove Emojis from All Documentation [005-remove-emojis-from-docs/spec]"
description: "Remove all H2 heading emojis and TOC entry emojis from 287 markdown files across the .opencode/ directory, aligning the entire codebase with the updated sk-doc v1.0.7...."
trigger_phrases:
  - "feature"
  - "specification"
  - "remove"
  - "emojis"
  - "from"
  - "spec"
  - "019"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Remove Emojis from All Documentation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Remove all H2 heading emojis and TOC entry emojis from 287 markdown files across the `.opencode/` directory, aligning the entire codebase with the updated sk-doc v1.0.7.0 standard which no longer enforces emoji usage. The sk-doc skill itself was already updated (Phase 0). This spec covers every remaining skill, agent, command, README and reference file.

**Key Decisions**: Regex-based batch stripping via parallel AI agents organized by component group. Semantic H3 emojis (RULES sections) preserved. AGENTS.md and repo root README.md exempt.

**Critical Dependencies**: sk-doc v1.0.7.0 must be merged first (completed). Validation engine already updated to not enforce emojis.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Implementation complete; CHK-1205/1206 blocked by pre-existing modifications |
| **Created** | 2026-02-16 |
| **Predecessor** | sk-doc v1.0.7.0 (emoji enforcement removal) |
| **Changelog** | `.opencode/changelog/06--sk-doc/v1.0.7.0.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-doc skill (v1.0.7.0) no longer enforces emojis in H2 headings. However, 287 files across the `.opencode/` directory still contain emoji H2 headings (pattern: `## N. EMOJI TITLE`) from the previous standard. This creates inconsistency: new documents are created without emojis while existing documents retain them. Additionally, emojis consume tokens in AI context windows without adding semantic value to section headings.

### Purpose

Strip all H2 heading emojis and TOC entry emojis from every markdown file in `.opencode/` (except exempt files), achieving 100% alignment with the updated documentation standard. Zero emoji H2 headings should remain after completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Strip emojis from H2 headings (`## N. EMOJI TITLE` to `## N. TITLE`) in all 287 identified files
- Strip emojis from TOC entries (`[N. EMOJI TITLE]` to `[N. TITLE]`) where present
- Strip emojis from H2 headings inside fenced code block examples (template examples showing `## N. EMOJI TITLE`)
- Update any inline text that references "emoji" as a required format element
- Preserve semantic H3 emojis in RULES sections (only in RULES sections)
- Verify all files pass `validate_document.py` after changes

### Out of Scope

- `AGENTS.md` at repo root (exempt, keeps emojis)
- `README.md` at repo root (exempt, keeps emojis)
- `sk-doc` skill folder (already completed in v1.0.7.0)
- Body-text emojis (status indicators, bullet markers, inline decorators)
- H3/H4/H5/H6 heading emojis outside of the `## N. EMOJI` pattern
- Files inside `node_modules/`, `.git/`, `__pycache__/`, `venv/`
- Spec folder `scratch/` and `z_archive/` directories (low priority, Phase 12)

### Files to Change

| Component Group | File Count | Change Type | Description |
|----------------|-----------|-------------|-------------|
| system-spec-kit skill | 84 | Modify | SKILL.md, READMEs, references, assets, MCP server docs |
| mcp-figma skill | 6 | Modify | SKILL.md, README, INSTALL_GUIDE, references, assets |
| mcp-code-mode skill | 10 | Modify | SKILL.md, README, INSTALL_GUIDE, references, assets |
| sk-code--opencode skill | 22 | Modify | SKILL.md, README, references, checklists |
| mcp-chrome-devtools skill | 7 | Modify | SKILL.md, README, INSTALL_GUIDE, references, examples |
| sk-code--full-stack skill | 33 | Modify | SKILL.md, README, all reference and checklist files |
| workflows-code--web-dev skill | 29 | Modify | SKILL.md, README, all reference and checklist files |
| sk-git skill | 10 | Modify | SKILL.md, README, references, assets |
| Agent files | 32 | Modify | All agent definition files across provider folders |
| Command files | 19 | Modify | All command definition files |
| Top-level and shared READMEs | 5 | Modify | .opencode/README.md, skill/README.md, etc. |
| Spec folder archives | 25 | Modify | Historical spec files (low priority) |
| **TOTAL** | **287** | | |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Strip emojis from all H2 headings in skill SKILL.md files | Zero emoji H2 headings in any SKILL.md |
| REQ-002 | Strip emojis from all H2 headings in README.md files | Zero emoji H2 headings in any README.md (except root README.md) |
| REQ-003 | Strip emojis from all H2 headings in agent definition files | Zero emoji H2 headings in any agent/*.md |
| REQ-004 | Strip emojis from all H2 headings in command definition files | Zero emoji H2 headings in any command/**/*.md |
| REQ-005 | Strip emojis from all H2 headings in reference files | Zero emoji H2 headings in any references/**/*.md |
| REQ-006 | Strip emojis from all H2 headings in asset files | Zero emoji H2 headings in any assets/**/*.md |
| REQ-007 | Strip emojis from TOC entries that mirror H2 headings | Zero emoji TOC entries in any file with TOC |
| REQ-008 | Preserve semantic H3 emojis in RULES sections | H3 emojis (only in RULES) still present after stripping |
| REQ-009 | All files pass validation after changes | `validate_document.py` exit 0 on all modified files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Strip emojis from code block examples showing H2 format | Template examples inside fenced code blocks updated |
| REQ-011 | Update inline references to "emoji required" text | No references to emojis as required format element |
| REQ-012 | Strip emojis from install guide files | Zero emoji H2 headings in INSTALL_GUIDE.md files |
| REQ-013 | Version bump for each modified skill | SKILL.md frontmatter version incremented |
| REQ-014 | Changelog entry for each modified skill | New changelog entry in `.opencode/changelog/` |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | Strip emojis from spec folder archives | Historical spec files cleaned |
| REQ-016 | Strip emojis from scratch/ working directories | Temporary files cleaned |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rn` for emoji H2 pattern returns zero matches across `.opencode/` (excluding AGENTS.md and root README.md)
- **SC-002**: All 287 identified files have been processed and modified
- **SC-003**: `validate_document.py` passes (exit 0) on all README and SKILL files
- **SC-004**: No semantic H3 emojis were accidentally removed from RULES sections
- **SC-005**: Body-text emojis (status indicators, bullet markers) remain untouched
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc v1.0.7.0 merged | Validation would fail without updated rules | Already completed |
| Risk | Accidental removal of semantic H3 emojis | RULES sections lose functional signaling | Regex targets only `## N. EMOJI` pattern, not `### EMOJI` |
| Risk | Body-text emojis removed | Status indicators and decorators lost | Regex scoped to H2 heading lines only |
| Risk | TOC anchor slugs break after emoji removal | Internal navigation broken | Anchors use slugified text without emojis already |
| Risk | Code block examples not updated | Templates show outdated format | Dedicated pass for fenced code block content |
| Risk | Agent/command files have non-standard H2 format | Some files use `## EMOJI TITLE` without numbers | Include unnumbered H2 emoji pattern in regex |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each agent phase should complete within 5 minutes (parallel execution)
- **NFR-P02**: Total wall-clock time under 30 minutes for all 287 files

### Reliability
- **NFR-R01**: Each file must be read before editing (no blind writes)
- **NFR-R02**: Each modified file must be verified after editing (grep for remaining emojis)

### Safety
- **NFR-S01**: No file deletion (modify only)
- **NFR-S02**: Git status checked before and after each phase
- **NFR-S03**: Exempt files (AGENTS.md, root README.md) must never be modified
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Emoji Variations
- Multi-byte emojis with variation selectors (e.g., `⚙️` = `⚙` + `U+FE0F`)
- Emojis at different positions: `## EMOJI TITLE` (no number), `## N. EMOJI TITLE` (numbered)
- Multiple emojis in one heading: `## 1. EMOJI1 EMOJI2 TITLE` (strip all)

### Content Boundaries
- Emojis inside fenced code blocks showing template format (must be stripped)
- Emojis in inline code backticks describing format (may reference old format)
- Emojis in table cells describing heading format (update to new format)

### File Types
- Agent files use frontmatter + H2 sections (different structure from skills)
- Command files use frontmatter + H2 sections with `## N. EMOJI SECTION-NAME`
- Some READMEs have no numbered H2s but still have `## EMOJI TITLE`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 287, LOC: ~50k, Systems: 12 component groups |
| Risk | 10/25 | No auth, no API, no breaking changes. Risk is accuracy |
| Research | 5/20 | Patterns well understood from Phase 0 |
| Multi-Agent | 15/15 | 12 parallel workstreams required |
| Coordination | 10/15 | Dependencies between phases, shared verification |
| **Total** | **62/100** | **Level 3+** (due to multi-agent coordination at scale) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Semantic H3 emojis accidentally removed | H | L | Regex targets `^## ` lines only |
| R-002 | Body-text emojis removed | M | L | Line-level targeting, not file-level |
| R-003 | Exempt files modified | H | L | Explicit exclusion list in every agent prompt |
| R-004 | Files corrupted by bad regex | H | L | Read-before-edit, verify after |
| R-005 | TOC anchors broken | M | L | Anchors already exclude emojis in slug |
| R-006 | Agent timeout on large files | L | M | Per-file processing with 5-min timeout |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Consistent Documentation (Priority: P0)

**As a** developer reading OpenCode documentation, **I want** consistent heading formatting without emojis, **so that** I can quickly scan documents without visual noise.

**Acceptance Criteria**:
1. Given any `.md` file in `.opencode/`, When I open it, Then no H2 heading contains emojis
2. Given a TOC section, When I read entries, Then no entry contains emojis

### US-002: AI Context Efficiency (Priority: P1)

**As an** AI agent processing documentation, **I want** headings without decorative emojis, **so that** context window tokens are used for content rather than decorators.

**Acceptance Criteria**:
1. Given a SKILL.md file, When loaded into context, Then H2 headings use `## N. TITLE` format
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Approved | 2026-02-16 |
| Phase 0 (sk-doc) | User | Approved | 2026-02-16 |
| Phase 1-12 Execution | AI Swarm | Complete (except CHK-1205/1206) | 2026-02-17 |
| Final Verification | User | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Documentation Compliance
- [ ] All files follow sk-doc v1.0.7.0 standard
- [ ] No emoji H2 headings remain (except exempt files)
- [ ] Semantic H3 emojis preserved in RULES sections
- [ ] TOC entries match their corresponding H2 headings

### Quality Compliance
- [ ] `validate_document.py` passes on all README files
- [ ] `extract_structure.py` produces clean output on SKILL files
- [ ] No body-text emojis were removed
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User | Owner | High | Direct approval at each phase |
| AI Swarm | Executor | High | Task-level reporting |
| sk-doc | Standard | High | Source of truth for format rules |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-16)
**Initial specification** - 287 files identified, 12 phases defined, AI swarm execution framework designed.
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None. All questions resolved during Phase 0 implementation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor Changelog**: `.opencode/changelog/06--sk-doc/v1.0.7.0.md`
