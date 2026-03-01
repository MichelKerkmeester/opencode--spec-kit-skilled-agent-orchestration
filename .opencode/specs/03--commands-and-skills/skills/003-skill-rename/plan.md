---
title: "Implementation Plan: Skill Rename — workflows-* to sk-*/mcp-* [002-skill-rename/plan]"
description: "Rename 7 skill folders from workflows-* convention to sk-*/mcp-* convention, then systematically update all references across the codebase. The implementation uses a phased appr..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "skill"
  - "rename"
  - "workflows"
  - "038"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, TypeScript, JSONC, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Rename 7 skill folders from `workflows-*` convention to `sk-*`/`mcp-*` convention, then systematically update all references across the codebase. The implementation uses a phased approach: filesystem renames first, then content updates grouped by domain (skills → agents → commands → docs → tests), followed by verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] All references cataloged by 5 context agents

### Definition of Done
- [x] All 7 folders renamed on disk
- [x] Zero grep matches for old names in active files
- [x] skill_advisor.py returns correct new names
- [x] Docs updated (spec/plan)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace refactor across filesystem and file contents. No architectural changes.

### Key Components
- **Skill folders**: 7 folders under `.opencode/skill/` to rename
- **skill_advisor.py**: Central skill routing script with name-to-skill mappings
- **Agent files**: 12 files across 4 runtime directories with skill references
- **Command YAMLs**: 20+ template files referencing `sk-doc` paths
- **Install guides**: 4 files with skill registry tables
- **Root docs**: 5 files (README.md, CLAUDE.md, AGENTS.md, etc.)
- **system-spec-kit**: Config, tests, templates, and documentation referencing skill names

### Data Flow
No data flow changes. Skills are loaded by name from filesystem paths. Renaming folders and updating name strings maintains identical behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Filesystem Renames (7 operations)
- [x] `mv .opencode/skill/sk-code--opencode → sk-code--opencode`
- [x] `mv .opencode/skill/workflows-code--web-dev → sk-code--web`
- [x] `mv .opencode/skill/sk-code--full-stack → sk-code--full-stack`
- [x] `mv .opencode/skill/sk-doc → sk-doc`
- [x] `mv .opencode/skill/sk-git → sk-git`
- [x] `mv .opencode/skill/sk-doc-visual → sk-doc-visual`
- [x] `mv .opencode/skill/mcp-chrome-devtools → mcp-chrome-devtools`

### Phase 2: Update Internal Skill References (~290 files)
For each renamed skill folder, update all internal files:
- [x] SKILL.md — name field, title, internal references, self-paths
- [x] index.md — name, description
- [x] README.md — title, paths, related skills references
- [x] nodes/*.md — cross-references to other skills, self-references
- [x] references/*.md — hard-coded paths, cross-skill references
- [x] assets/*.md — template paths, example invocations
- [x] scripts/*.{sh,py,mjs} — hard-coded paths

**Find-replace operations per skill:**

| Old Name | New Name | Also update paths |
|----------|----------|-------------------|
| `sk-code--opencode` | `sk-code--opencode` | `.opencode/skill/sk-code--opencode/` → `.opencode/skill/sk-code--opencode/` |
| `workflows-code--web-dev` | `sk-code--web` | `.opencode/skill/workflows-code--web-dev/` → `.opencode/skill/sk-code--web/` |
| `sk-code--full-stack` | `sk-code--full-stack` | `.opencode/skill/sk-code--full-stack/` → `.opencode/skill/sk-code--full-stack/` |
| `sk-doc` | `sk-doc` | `.opencode/skill/sk-doc/` → `.opencode/skill/sk-doc/` |
| `sk-git` | `sk-git` | `.opencode/skill/sk-git/` → `.opencode/skill/sk-git/` |
| `sk-doc-visual` | `sk-doc-visual` | `.opencode/skill/sk-doc-visual/` → `.opencode/skill/sk-doc-visual/` |
| `mcp-chrome-devtools` | `mcp-chrome-devtools` | `.opencode/skill/mcp-chrome-devtools/` → `.opencode/skill/mcp-chrome-devtools/` |

**Special cases:**
- Bare `workflows-code` → `sk-code--web` (default variant)
- Wildcard `workflows-code--*` → `sk-code--*`

### Phase 3: Update skill_advisor.py (~100+ lines)
- [x] Update all `sk-git` entries in INTENT_BOOSTERS → `sk-git`
- [x] Update all `mcp-chrome-devtools` entries → `mcp-chrome-devtools`
- [x] Update all `sk-doc` entries → `sk-doc`
- [x] Update all `sk-doc-visual` entries → `sk-doc-visual`
- [x] Update all `workflows-code--web-dev` entries → `sk-code--web`
- [x] Update all `sk-code--opencode` entries → `sk-code--opencode`
- [x] Update all `sk-code--full-stack` entries in MULTI_SKILL_BOOSTERS → `sk-code--full-stack`

### Phase 4: Update Agent Files (12 files × 4 runtimes)
- [x] `.opencode/agent/orchestrate.md` — skill tables, routing tables, path references
- [x] `.opencode/agent/review.md` — `workflows-code--*` → `sk-code--*`, bare references
- [x] `.opencode/agent/write.md` — `sk-doc` → `sk-doc` (extensive: ~30 refs)
- [x] `.opencode/agent/chatgpt/orchestrate.md` — same as above
- [x] `.opencode/agent/chatgpt/review.md` — same as above
- [x] `.opencode/agent/chatgpt/write.md` — same as above
- [x] `.claude/agents/orchestrate.md` — same as above
- [x] `.claude/agents/review.md` — same as above
- [x] `.claude/agents/write.md` — same as above
- [x] `.gemini/agents/orchestrate.md` — same as above
- [x] `.gemini/agents/review.md` — same as above
- [x] `.gemini/agents/write.md` — same as above

### Phase 5: Update Command Files (~25 files)
- [x] `.opencode/command/create/` — All 12 YAML asset files (auto/confirm pairs for skill, skill_asset, skill_reference, agent, install_guide, folder_readme)
- [x] `.opencode/command/create/` — All 6 .md files (skill.md, skill_asset.md, skill_reference.md, agent.md, install_guide.md, folder_readme.md)
- [x] `.opencode/command/create/README.txt`
- [x] `.opencode/command/README.txt`
- [x] `.opencode/command/doc-visual/` — 5 files (generate.md, fact-check.md, diff-review.md, plan-review.md, recap.md)

### Phase 6: Update Install Guides (4 files)
- [x] `.opencode/install_guides/README.md` — skill registry, routing tables, file paths, manifest
- [x] `.opencode/install_guides/SET-UP - AGENTS.md` — skill routing, triggers, manifest
- [x] `.opencode/install_guides/SET-UP - Opencode Agents.md` — template paths, prerequisites
- [x] `.opencode/install_guides/SET-UP - Skill Creation.md` — script paths, prerequisites

### Phase 7: Update Root & System Documentation (5+ files)
- [x] `README.md` (project root) — skill table, changelog paths, examples
- [x] `CLAUDE.md` (project root) — documentation workflow reference
- [x] `AGENTS.md` — quick reference table (if separate from CLAUDE.md)
- [x] `.opencode/README.md` — skill registry table, manual reference example
- [x] `PUBLIC_RELEASE.md` — version table entries (historical — evaluate case by case)

### Phase 8: Update system-spec-kit References (~20 files)
- [x] `config/config.jsonc` — indexedSkills array
- [x] `SKILL.md` — downstream skill references, workflow chains
- [x] `README.md` — related resources table
- [x] `nodes/rules.md` — routing rules
- [x] `templates/*/implementation-summary.md` — HVR_REFERENCE paths (8 files)
- [x] `templates/*/decision-record.md` — HVR_REFERENCE paths (3 files)
- [x] `templates/core/impl-summary-core.md` — HVR_REFERENCE paths
- [x] `assets/template_mapping.md` — skill reference
- [x] `references/templates/template_guide.md` — skill reference
- [x] `references/templates/level_specifications.md` — skill reference
- [x] `references/workflows/quick_reference.md` — skill reference
- [x] `scripts/sgqs/index.ts` — example queries
- [x] `scripts/lib/flowchart-generator.ts` — comment reference
- [x] Test files (4 .vitest.ts files) — fixture skill names

### Phase 9: Rename Changelog Directories (7 renames)
- [x] `mv .opencode/changelog/07--sk-code--opencode → 07--sk-code--opencode`
- [x] `mv .opencode/changelog/08--workflows-code--web-dev → 08--sk-code--web`
- [x] `mv .opencode/changelog/09--sk-code--full-stack → 09--sk-code--full-stack`
- [x] `mv .opencode/changelog/06--sk-doc → 06--sk-doc`
- [x] `mv .opencode/changelog/10--sk-git → 10--sk-git`
- [x] `mv .opencode/changelog/11--mcp-chrome-devtools → 11--mcp-chrome-devtools`
- [x] Verify: `sk-doc-visual` changelog dir existence

### Phase 10: Verification
- [x] Run: `grep -r "workflows-code--\|sk-doc\|sk-git\|sk-doc-visual\|mcp-chrome-devtools" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ README.md CLAUDE.md AGENTS.md .opencode/README.md`
- [x] Expected: 0 results (excluding changelog content, specs/memory, archives)
- [x] Run: `python3 .opencode/skill/scripts/skill_advisor.py "git commit"` → verify returns `sk-git`
- [x] Run: `python3 .opencode/skill/scripts/skill_advisor.py "implement feature"` → verify returns `sk-code--web`
- [x] Run: `python3 .opencode/skill/scripts/skill_advisor.py "create documentation"` → verify returns `sk-doc`
- [x] Run: `python3 .opencode/skill/scripts/skill_advisor.py "take screenshot"` → verify returns `mcp-chrome-devtools`
- [x] Verify all 7 new folders exist: `ls -d .opencode/skill/sk-* .opencode/skill/mcp-chrome-devtools`
- [x] Verify no old folders remain: `ls -d .opencode/skill/workflows-* 2>/dev/null` → empty
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All active files | `grep -r` with exclusion patterns |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py "<query>"` |
| Directory verification | Filesystem | `ls -d` for new/old folders |
| Unit tests | system-spec-kit test files | `npx vitest` (after fixture updates) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Filesystem access to .opencode/skill/ | Internal | Green | Cannot rename folders |
| No concurrent sessions modifying skills | Internal | Green | Conflicts during rename |
| Git tracking of renames | Internal | Green | Use `git mv` for clean tracking |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading, missed references causing errors
- **Procedure**: `git checkout -- .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/` to restore all modified files. Skill folder renames tracked by git can be reverted via `git checkout`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Filesystem Renames) ──┐
                                ├──► Phase 2 (Internal Skill Refs)
                                ├──► Phase 3 (skill_advisor.py)
                                ├──► Phase 4 (Agent Files)
                                ├──► Phase 5 (Command Files)
                                ├──► Phase 6 (Install Guides)
                                ├──► Phase 7 (Root Docs)
                                ├──► Phase 8 (system-spec-kit)
                                └──► Phase 9 (Changelog Dirs)
                                         │
                                         ▼
                                Phase 10 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Renames) | None | Phases 2-9 |
| Phases 2-9 | Phase 1 | Phase 10 |
| Phase 10 (Verify) | Phases 2-9 | None |

**Note**: Phases 2-9 are independent of each other and can be executed in parallel after Phase 1 completes. However, for implementation simplicity, sequential execution per-phase is recommended.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Filesystem Renames | Low | 7 `git mv` commands |
| Phase 2: Internal Skill Refs | High | ~290 files, mostly mechanical |
| Phase 3: skill_advisor.py | Med | ~100 line changes in 1 file |
| Phase 4: Agent Files | Med | 12 files, ~10 replacements each |
| Phase 5: Command Files | High | ~25 files, ~172 refs for `sk-doc` alone |
| Phase 6: Install Guides | Med | 4 files, ~80 references total |
| Phase 7: Root Docs | Low | 5 files, ~30 references total |
| Phase 8: system-spec-kit | Med | ~20 files, mix of config/test/template |
| Phase 9: Changelog Dirs | Low | 7 `git mv` commands |
| Phase 10: Verification | Low | grep + smoke tests |
| **Total** | **High** | **~370 unique files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Working on clean git state (or committed current changes)
- [x] No other sessions actively using skill files

### Rollback Procedure
1. `git checkout -- .` to restore all file contents
2. Verify old skill folders restored
3. Run skill_advisor.py smoke test to confirm restored state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure filesystem and content changes, fully git-reversible
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────┐
│  Phase 3 (Full-Stack)    │──► longest match first
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│  Phase 1 (Opencode)      │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│  Phase 2 (Web)           │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│  Phase 7 (Chrome DT)     │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│  Phase 4 (Documentation) │──► highest external refs
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│  Phase 6 (Visual Expl.)  │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│  Phase 5 (Git)           │──► shortest match last
└──────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 3 (full-stack) | None | Renamed `sk-code--full-stack` | Phase 1 |
| Phase 1 (opencode) | Phase 3 | Renamed `sk-code--opencode` | Phase 2 |
| Phase 2 (web) | Phase 1 | Renamed `sk-code--web` | Phase 7 |
| Phase 7 (chrome-devtools) | Phase 2 | Renamed `mcp-chrome-devtools` | Phase 4 |
| Phase 4 (documentation) | Phase 7 | Renamed `sk-doc` | Phase 6 |
| Phase 6 (sk-doc-visual) | Phase 4 | Renamed `sk-doc-visual` | Phase 5 |
| Phase 5 (git) | Phase 6 | Renamed `sk-git` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 3: sk-code--full-stack** — 88 internal + 11 external files — CRITICAL (longest match)
2. **Phase 1: sk-code--opencode** — 35 internal + 13 external files — CRITICAL
3. **Phase 2: sk-code--web** — 51 internal + 17 external files — CRITICAL
4. **Phase 7: mcp-chrome-devtools** — 21 internal + 36 external files — CRITICAL
5. **Phase 4: sk-doc** — 49 internal + 52 external files — CRITICAL (most external refs)
6. **Phase 6: sk-doc-visual** — 22 internal + 6 external files — CRITICAL
7. **Phase 5: sk-git** — 20 internal + 39 external files — CRITICAL (shortest match last)

**Total Critical Path**: All 7 phases sequential (~370 unique files)

**Parallel Opportunities**:
- Phase documentation (spec folders) can be created in parallel
- Actual implementation phases must be sequential to avoid shared file conflicts
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase documentation complete | All 7 phase folders have L2 spec/plan/tasks/checklist | Phase 0 |
| M2 | Phase 3 complete (full-stack) | `grep "sk-code--full-stack"` = 0 in active files | Phase 3 |
| M3 | Phases 1-2 complete (code skills) | All `workflows-code--*` variants renamed | Phases 1-2 |
| M4 | Phase 7 complete (chrome-devtools) | `grep "mcp-chrome-devtools"` = 0 | Phase 7 |
| M5 | Phase 4 complete (documentation) | 52 external refs updated, HVR templates fixed | Phase 4 |
| M6 | Phases 5-6 complete (git + visual) | All `workflows-*` names eliminated | Phases 5-6 |
| M7 | Full verification | `grep -r "workflows-"` = 0 in all active files, all smoke tests pass | Final |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Per-Skill Phase Decomposition

**Status**: Accepted

**Context**: Renaming 7 skills across ~370 files requires careful sequencing. Shared files (agent/orchestrate.md, install guides, root docs) are referenced by multiple skills, creating potential merge conflicts.

**Decision**: Decompose the rename into 7 independent phases, one per skill. Each phase handles ALL changes for ONE skill rename, including its entries in shared files.

**Consequences**:
- Positive: Each phase is independently verifiable via grep
- Positive: Phases can be planned in parallel (spec/plan/tasks)
- Negative: Shared files are touched by multiple phases sequentially, requiring execution order discipline

**Alternatives Rejected**:
- Monolithic: All 7 renames in one pass — rejected because too complex to verify incrementally
- By-file-type: Group by file type (all agent files, all install guides) — rejected because hard to verify per-skill completeness

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: Parent spec.md upgrade (L2 → L3+)
**Duration**: ~120s
**Agent**: Primary speckit agent

### Tier 2: Parallel Documentation
| Agent | Focus | Files |
|-------|-------|-------|
| Phase 1 Agent | 001-sk-code--opencode/ | spec.md, plan.md, tasks.md, checklist.md |
| Phase 2 Agent | 002-sk-code--web/ | spec.md, plan.md, tasks.md, checklist.md |
| Phase 3 Agent | 003-sk-code--full-stack/ | spec.md, plan.md, tasks.md, checklist.md |
| Phase 4 Agent | 004-sk-doc/ | spec.md, plan.md, tasks.md, checklist.md |
| Phase 5 Agent | 005-sk-git/ | spec.md, plan.md, tasks.md, checklist.md |
| Phase 6 Agent | 006-sk-doc-visual/ | spec.md, plan.md, tasks.md, checklist.md |
| Phase 7 Agent | 007-mcp-chrome-devtools/ | spec.md, plan.md, tasks.md, checklist.md |

**Duration**: ~180s (parallel)

### Tier 3: Verification
**Agent**: Primary
**Task**: Verify all phase folders, validate cross-references
**Duration**: ~60s
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Phase 3: Full-Stack | Impl Agent | `.opencode/skill/sk-code--full-stack/` | Completed |
| W-B | Phase 1: Opencode | Impl Agent | `.opencode/skill/sk-code--opencode/` | Completed |
| W-C | Phase 2: Web | Impl Agent | `.opencode/skill/sk-code--web/` | Completed |
| W-D | Phase 7: Chrome DT | Impl Agent | `.opencode/skill/mcp-chrome-devtools/` | Completed |
| W-E | Phase 4: Documentation | Impl Agent | `.opencode/skill/sk-doc/` | Completed |
| W-F | Phase 6: Visual Expl. | Impl Agent | `.opencode/skill/sk-doc-visual/` | Completed |
| W-G | Phase 5: Git | Impl Agent | `.opencode/skill/sk-git/` | Completed |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Phases 1-3 complete | W-A, W-B, W-C | All `sk-code--*` variants verified |
| SYNC-002 | Phase 7 complete | W-D | MCP prefix verified |
| SYNC-003 | All phases complete | All | Full grep verification: 0 matches |

### File Ownership Rules
- Each skill folder owned by its phase's workstream
- Shared files (orchestrate.md, install guides, root docs): each phase updates ONLY its skill's references
- Phases execute sequentially to avoid shared file conflicts
- skill_advisor.py: each phase updates ONLY its skill's entries
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Grep verification report (0 matches for old name)
- **Per Milestone**: Cumulative verification across completed phases
- **Final**: Full system grep + skill_advisor.py smoke tests

### Escalation Path
1. Partial replacement found post-phase → Re-execute phase with missed files
2. Shared file conflict → Review execution order, ensure longest-match-first
3. skill_advisor.py routing failure → Debug with test queries
<!-- /ANCHOR:communication -->

---

## IMPLEMENTATION NOTES

### Recommended Implementation Strategy

Given the massive number of files (~370), the implementation should use **batch sed/find-replace operations** rather than individual file edits:

1. **Phase 1**: Use `git mv` for folder renames (preserves git history)
2. **Phases 2-9**: For each old→new name pair, use recursive find-replace across all relevant directories:
   - Process replacements in order from most specific to least specific to avoid partial matches:
     1. `sk-code--full-stack` → `sk-code--full-stack` (longest first)
     2. `sk-code--opencode` → `sk-code--opencode`
     3. `workflows-code--web-dev` → `sk-code--web`
     4. `mcp-chrome-devtools` → `mcp-chrome-devtools`
     5. `sk-doc` → `sk-doc`
     6. `sk-doc-visual` → `sk-doc-visual`
     7. `sk-git` → `sk-git`
     8. `workflows-code--*` → `sk-code--*` (wildcard pattern in prose)
     9. `workflows-code` (bare) → `sk-code--web` (only in non-wildcard contexts)

### Files to Exclude from Replacement
- `.opencode/changelog/*/v*.md` — changelog entry content (historical)
- `.opencode/specs/*/memory/` — auto-generated memory files
- `z_archive/` directories — archived content
- `.git/` — git internals

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
