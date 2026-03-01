---
title: "Feature Specification: Skill Rename — workflows-* to sk-*/mcp-* [002-skill-rename/spec]"
description: "Rename 7 skills from legacy workflows-* prefix to cleaner sk-*/mcp-* convention across ~370 files. The rename improves skill discoverability, distinguishes MCP integrations from..."
trigger_phrases:
  - "feature"
  - "specification"
  - "skill"
  - "rename"
  - "workflows"
  - "spec"
  - "038"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Rename 7 skills from legacy `workflows-*` prefix to cleaner `sk-*`/`mcp-*` convention across ~370 files. The rename improves skill discoverability, distinguishes MCP integrations from standard skills, and reduces naming verbosity. Work is decomposed into 9 phases (7 Public repo + 2 Barter repo extensions) (one per skill), each executable as a standalone spec folder.

**Key Decisions**: Per-skill phase decomposition for isolation and parallel planning; longest-match-first execution order to prevent partial replacements.

**Critical Dependencies**: No concurrent skill sessions during rename execution; clean git state required.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-21 |
| **Completed** | 2026-02-21 |
| **Verified** | 2026-02-21 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current skill naming convention uses `workflows-*` prefix which is verbose and doesn't clearly distinguish between skill categories (code skills, documentation skills, MCP integrations). The `mcp-chrome-devtools` skill is actually an MCP integration but uses the `workflows-` prefix, creating confusion about its nature.

### Purpose
Rename 7 skills to a cleaner naming convention: `sk-*` for standard skills and `mcp-*` for MCP-based integrations, updating all references system-wide while preserving functionality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename 7 skill folders on disk
- Update all internal references within each skill (SKILL.md, index.md, nodes/, references/, assets/, scripts/)
- Update skill_advisor.py (INTENT_BOOSTERS + MULTI_SKILL_BOOSTERS)
- Update agent files across 4 runtimes (`.opencode/agent/`, `.opencode/agent/chatgpt/`, `.claude/agents/`, `.gemini/agents/`)
- Update command files (`.opencode/command/create/`, `.opencode/command/doc-visual/`)
- Update install guides (`.opencode/install_guides/`)
- Update root documentation (README.md, CLAUDE.md, AGENTS.md, .opencode/README.md, PUBLIC_RELEASE.md)
- Update system-spec-kit references (config, tests, templates, SKILL.md, README.md)
- Update changelog directory names
- Update bare `workflows-code` and wildcard `workflows-code--*` references

### Out of Scope
- Renaming `mcp-figma`, `mcp-code-mode`, `system-spec-kit` — explicitly unchanged
- Functional changes to any skill logic or behavior
- Memory files in `specs/*/memory/` — auto-generated, will naturally reflect new names going forward
- Archived/historical changelog content (entries within changelog files)

### Rename Mapping

| Current Name | New Name |
|---|---|
| `sk-code--opencode` | `sk-code--opencode` |
| `workflows-code--web-dev` | `sk-code--web` |
| `sk-code--full-stack` | `sk-code--full-stack` |
| `sk-doc` | `sk-doc` |
| `sk-git` | `sk-git` |
| `sk-doc-visual` | `sk-doc-visual` |
| `mcp-chrome-devtools` | `mcp-chrome-devtools` |

### Wildcard Pattern Updates

| Current Pattern | New Pattern |
|---|---|
| `workflows-code--*` | `sk-code--*` |
| `workflows-code` (bare/stale) | `sk-code--web` (or appropriate variant) |

### Files to Change

| Category | File Count | Description |
|----------|------------|-------------|
| Skill folders (rename) | 7 folders | Filesystem rename |
| Skill internal files | ~290 files | SKILL.md, index.md, nodes/, refs, assets within renamed skills |
| skill_advisor.py | 1 file | ~100+ line changes in dictionaries |
| Agent files (4 runtimes) | 12 files | orchestrate.md, review.md, write.md × 4 |
| Command files | ~25 files | create/ YAMLs/MDs, doc-visual/ MDs |
| Install guides | 4 files | README.md, SET-UP docs |
| Root docs | 5 files | README.md, CLAUDE.md, AGENTS.md, .opencode/README.md, PUBLIC_RELEASE.md |
| system-spec-kit | ~20 files | config, tests, templates, SKILL.md, README.md, references |
| Changelog dirs | 7 dirs | Directory renames |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 1 | 001-sk-code--opencode/ | Rename `sk-code--opencode` → `sk-code--opencode` (35 internal, 13 external files) | None | Completed |
| 2 | 002-sk-code--web/ | Rename `workflows-code--web-dev` → `sk-code--web` (51 internal, 17 external files) | None | Completed |
| 3 | 003-sk-code--full-stack/ | Rename `sk-code--full-stack` → `sk-code--full-stack` (88 internal, 11 external files) | None | Completed |
| 4 | 004-sk-doc/ | Rename `sk-doc` → `sk-doc` (49 internal, 52 external files) | None | Completed |
| 5 | 005-sk-git/ | Rename `sk-git` → `sk-git` (20 internal, 39 external files) | None | Completed |
| 6 | 006-sk-doc-visual/ | Rename `sk-doc-visual` → `sk-doc-visual` (22 internal, 6 external files) | None | Completed |
| 7 | 007-mcp-chrome-devtools/ | Rename `mcp-chrome-devtools` → `mcp-chrome-devtools` (21 internal, 36 external files) | None | Completed |
| 8 | 008-sk-code-from-barter-repo/ | Rename `workflows-code` → `sk-code` in Barter repo (6 internal, 8 external files) | Phase 007 | Completed |
| 9 | 009-sk-git-from-barter-repo/ | Rename `workflows-git` → `sk-git` in Barter repo (8 internal files, 8 text changes) | Phase 005, 008 | Completed |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume 03--commands-and-skills/002-skill-rename/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 003-sk-code--full-stack | 001-sk-code--opencode | All `sk-code--full-stack` refs replaced | `grep -r "sk-code--full-stack"` = 0 |
| 001-sk-code--opencode | 002-sk-code--web | All `sk-code--opencode` refs replaced | `grep -r "sk-code--opencode"` = 0 |
| 002-sk-code--web | 007-mcp-chrome-devtools | All `workflows-code--web-dev` refs replaced | `grep -r "workflows-code--web-dev"` = 0 |
| 007-mcp-chrome-devtools | 004-sk-doc | All `mcp-chrome-devtools` refs replaced | `grep -r "mcp-chrome-devtools"` = 0 |
| 004-sk-doc | 006-sk-doc-visual | All `sk-doc` refs replaced | `grep -r "sk-doc"` = 0 |
| 006-sk-doc-visual | 005-sk-git | All `sk-doc-visual` refs replaced | `grep -r "sk-doc-visual"` = 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename all 7 skill folders on disk | `ls .opencode/skill/sk-*` and `ls .opencode/skill/mcp-chrome-devtools` show correct folders |
| REQ-002 | Update skill_advisor.py with new names | `python3 skill_advisor.py "git commit"` returns `sk-git` (not legacy names) |
| REQ-003 | Zero remaining references to old names in active files | `grep -r "workflows-code--\|sk-doc\|sk-git\|sk-doc-visual\|mcp-chrome-devtools" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ README.md AGENTS.md CLAUDE.md` returns 0 results (excluding changelog content, specs/memory, archives) |
| REQ-004 | Update all agent files across 4 runtimes | All orchestrate.md, review.md, write.md files use new names |
| REQ-005 | Update wildcard patterns `workflows-code--*` → `sk-code--*` | All agent files use `sk-code--*` pattern |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update command files with new skill names and paths | All command YAMLs and MDs reference new paths |
| REQ-007 | Update install guides | All 4 install guide files use new names |
| REQ-008 | Update root documentation | README.md, CLAUDE.md, .opencode/README.md use new names |
| REQ-009 | Update system-spec-kit config and references | config.jsonc, templates, SKILL.md, README.md use new names |
| REQ-010 | Update system-spec-kit test files | Test fixtures use new skill names |
| REQ-011 | Rename changelog directories | Changelog dirs match new skill names |
| REQ-012 | Fix stale bare `workflows-code` references | All resolved to correct `sk-code--web` or `sk-code--*` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "workflows-" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/` returns 0 matches in active files (excluding changelog content/archives/memory)
- **SC-002**: `python3 .opencode/skill/scripts/skill_advisor.py "implement feature"` returns `sk-code--web` (not `workflows-code--web-dev`)
- **SC-003**: All 7 new skill folders exist with complete contents: `sk-code--opencode`, `sk-code--web`, `sk-code--full-stack`, `sk-doc`, `sk-git`, `sk-doc-visual`, `mcp-chrome-devtools`
- **SC-004**: No old skill folders remain: `ls .opencode/skill/workflows-*` returns empty
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed references cause broken skill loading | High | Comprehensive grep verification post-rename |
| Risk | `workflows-code--web-dev` → `sk-code--web` shortens name, may break exact-match logic | Med | Verify skill_advisor.py handles new name correctly |
| Risk | Bare `workflows-code` references ambiguous | Low | Map each to correct variant during rename |
| Risk | Changelog directories rename may confuse git history | Low | Git tracks renames; old names preserved in commit history |
| Dependency | No active sessions using old skill names | Low | Coordinate rename as atomic operation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: All 4 agent runtime directories must have identical skill name references
- **NFR-C02**: Skill names in skill_advisor.py must exactly match folder names on disk

### Completeness
- **NFR-CP01**: Every file referencing old names must be updated — no partial renames
- **NFR-CP02**: Both text references AND filesystem paths must be updated
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Naming Patterns
- Bare `workflows-code` (no suffix): Map to `sk-code--web` as the default variant
- `workflows-code--*` wildcard: Map to `sk-code--*`
- `workflows-code/` (legacy stale path): Map to `sk-code--web/`

### Path References
- Absolute paths containing old skill names: Update path segments
- Relative paths (`../sk-doc/`): Update to `../sk-doc/`
- Hard-coded script paths within SKILL.md files: Update all

### Historical References
- Changelog file content: Leave unchanged (historical record)
- Archived spec memory files: Leave unchanged (auto-generated)
- Committed changelog entries: Leave content unchanged, only rename directories
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~370, LOC: ~2000 replacements, Systems: 10+ directories |
| Risk | 15/25 | No auth/API, but exhaustive cross-ref integrity required |
| Research | 18/20 | Complete — all references cataloged by 5 context agents |
| Multi-Agent | 12/15 | 8 parallel speckit agents for documentation |
| Coordination | 10/15 | 7 phases with shared file ownership |
| **Total** | **77/100** | **Level 3+ — High complexity phased refactor** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `sk-code--opencode` rename breaks opencode skill loading | H | L | grep verification + smoke test |
| R-002 | `sk-code--web` shortening from `web-dev` breaks exact-match logic | M | M | Verify skill_advisor.py handles shortened name |
| R-003 | `sk-code--full-stack` has 88 internal files — high volume | M | L | Mechanical replacement, batch processing |
| R-004 | `sk-doc` has 52 external refs — most cross-cutting | H | M | Careful per-file verification, dedicated high-effort phase |
| R-005 | `sk-git` has 28 skill_advisor lines — dense routing changes | M | L | Test all routing queries post-rename |
| R-006 | `sk-doc-visual` references in command files | L | L | Low reference count, straightforward |
| R-007 | `mcp-chrome-devtools` prefix change (`workflows-` to `mcp-`) is non-standard | M | L | Explicit MCP categorization is the goal |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Intuitive Skill Naming (Priority: P0)

**As a** developer using the OpenCode framework, **I want** skill names to use `sk-*` prefix for standard skills and `mcp-*` for MCP integrations, **so that** I can distinguish skill categories at a glance.

**Acceptance Criteria**:
1. Given a skill folder listing, When I see `sk-` prefix, Then I know it is a standard skill
2. Given a skill folder listing, When I see `mcp-` prefix, Then I know it is an MCP integration

### US-002: Consistent Cross-References (Priority: P1)

**As a** system maintainer, **I want** all skill references updated atomically per skill, **so that** no broken references exist after any phase completes.

**Acceptance Criteria**:
1. Given a completed phase, When I grep for the old name, Then zero matches appear in active files
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Phase 001 Complete (sk-code--opencode) | User | Approved | 2026-02-21 |
| Phase 002 Complete (sk-code--web) | User | Approved | 2026-02-21 |
| Phase 003 Complete (sk-code--full-stack) | User | Approved | 2026-02-21 |
| Phase 004 Complete (sk-doc) | User | Approved | 2026-02-21 |
| Phase 005 Complete (sk-git) | User | Approved | 2026-02-21 |
| Phase 006 Complete (sk-doc-visual) | User | Approved | 2026-02-21 |
| Phase 007 Complete (mcp-chrome-devtools) | User | Approved | 2026-02-21 |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Naming Consistency
- [x] All 7 skill folders use `sk-*` or `mcp-*` prefix (Evidence: required-folder existence check passed for all 7 targets)
- [x] skill_advisor.py entries match folder names exactly (Evidence: smoke tests route to `sk-git`, `sk-code--web`, `sk-doc`, `mcp-chrome-devtools`)
- [x] Agent files across 4 runtimes are consistent (Evidence: old-name active-path grep checks returned no matches)

### Cross-Reference Integrity
- [x] Zero grep matches for old names in active files (Evidence: old-name and bare-name `rg` checks returned exit 1)
- [x] All relative paths between skills resolve correctly (Evidence: no stale old-name paths found in active targets after phase verification)
- [x] Install guides reference correct skill names (Evidence: root/install guide grep checks passed with old-name exit 1)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Developer | Skill consumer | High — uses skill names daily | Per-phase completion notice |
| System Maintainer | Infrastructure | High — maintains skill_advisor.py and agent files | Phase 3-4 review |
| Documentation Author | Content | Medium — references skills in guides | Post-rename doc review |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v2.2 (2026-02-21)
**Barter repo extensions added**: Added Phase 008 (sk-code Barter) and Phase 009 (sk-git Barter) as extension phases for the Barter repository skill renames.

### v2.1 (2026-02-21)
**Documentation closure complete**: Parent/phase statuses synchronized, phase map marked complete, and checklist evidence aligned to verified command outputs.

### v2.0 (2026-02-21)
**Upgraded to Level 3+**: Added executive summary, risk matrix, user stories, approval workflow, compliance checkpoints, stakeholder matrix, phase documentation map. Decomposed into 7 phase child folders.

### v1.0 (2026-02-21)
**Initial Level 2 specification**: Problem statement, scope, requirements, rename mapping, reference catalog.
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None — all requirements clear from user specification
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
