---
title: "Implementation Plan: Remove Emojis from All Documentation [005-remove-emojis-from-docs/plan]"
description: "This plan executes a 12-phase AI swarm operation to strip emojis from H2 headings and TOC entries across 287 markdown files in the .opencode/ directory. Each phase targets one c..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "remove"
  - "emojis"
  - "from"
  - "019"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Remove Emojis from All Documentation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown files, Python validation scripts |
| **Framework** | sk-doc v1.0.7.0 |
| **Storage** | Local filesystem (.opencode/ directory) |
| **Testing** | validate_document.py, extract_structure.py, grep verification |

### Overview

This plan executes a 12-phase AI swarm operation to strip emojis from H2 headings and TOC entries across 287 markdown files in the `.opencode/` directory. Each phase targets one component group and can run as an independent agent. Phases 1-10 are parallelizable. Phases 11-12 are sequential (verification and cleanup). The core transformation is a regex substitution: `## N. EMOJI TITLE` becomes `## N. TITLE`, and `[N. EMOJI TITLE]` becomes `[N. TITLE]` in TOC entries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (zero emoji H2 headings)
- [x] Dependencies identified (sk-doc v1.0.7.0 merged)
- [x] File inventory complete (287 files across 12 groups)
- [x] Regex pattern validated on Phase 0 files

### Definition of Done
- [ ] All 287 files processed
- [ ] Zero emoji H2 headings remain (grep verification)
- [ ] All SKILL.md and README.md files pass validation
- [ ] Semantic H3 emojis preserved in RULES sections
- [ ] Changelog entries created for each modified skill
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File-level batch transformation using AI agents with read-verify-edit-verify workflow.

### Key Components
- **Emoji Regex**: Matches Unicode emoji ranges U+1F300-1F9FF, U+2600-26FF, U+2700-27BF in H2 heading context
- **H2 Pattern (numbered)**: `^## \d+\.\s+EMOJI\s+` - strip emoji + trailing space
- **H2 Pattern (unnumbered)**: `^## EMOJI\s+` - strip emoji + trailing space (agent/command files)
- **TOC Pattern**: `\[(\d+\.)\s+EMOJI\s+` - strip emoji from TOC link text
- **Code Block Pattern**: Same patterns but inside fenced code blocks (template examples)
- **Verification**: `grep -rn` for emoji characters in `^## ` lines post-edit

### Data Flow
```
For each file in phase:
  1. Read file content
  2. Identify all H2 lines with emojis
  3. Apply regex substitution (strip emoji + space)
  4. Identify all TOC entries with emojis
  5. Apply regex substitution on TOC entries
  6. Identify code block examples with emoji H2s
  7. Apply regex substitution inside code blocks
  8. Write modified content
  9. Verify: grep for remaining emoji H2 patterns
```

### Exempt Files (NEVER modify)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/AGENTS.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md`
- All files in `.opencode/skill/sk-doc/` (already done)
- All files in `node_modules/`, `.git/`, `__pycache__/`, `venv/`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Validation Engine & sk-doc (COMPLETED)
**Status**: Complete (2026-02-16)
**Files**: ~30 files in `.opencode/skill/sk-doc/`
**Summary**: Updated template_rules.json, validate_document.py, extract_structure.py. Stripped emojis from all templates, references, core docs and test fixtures. All 6/6 tests pass.

---

### Phase 1: system-spec-kit Skill (~84 files)

**Target**: `.opencode/skill/system-spec-kit/`
**Agent Assignment**: Agent 1 (dedicated - largest group)

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 1a | 1 | `SKILL.md` - Strip H2 emojis, update version |
| 1b | 30 | `scripts/**/README.md` - All README files in scripts subdirectories |
| 1c | 20 | `mcp_server/**/README.md` - All README files in MCP server subdirectories |
| 1d | 5 | `references/**/*.md` - All reference files (memory, config, debugging, workflows, templates, structure, validation) |
| 1e | 5 | `shared/**/README.md` - Shared module READMEs |
| 1f | 4 | `assets/*.md` - Asset files (parallel_dispatch, level_decision, complexity, template_mapping) |
| 1g | 2 | `constitutional/README.md`, `config/README.md` |
| 1h | 2 | `README.md`, `templates/scratch/README.md` |
| 1i | 1 | `mcp_server/INSTALL_GUIDE.md` |

**Verification**: `grep -rn '^## .*[emoji]' .opencode/skill/system-spec-kit/ --include='*.md'` returns zero matches.

---

### Phase 2: mcp-figma Skill (~6 files)

**Target**: `.opencode/skill/mcp-figma/`
**Agent Assignment**: Agent 2

| File | Type |
|------|------|
| `SKILL.md` | Skill definition |
| `README.md` | Skill README |
| `INSTALL_GUIDE.md` | Installation guide |
| `references/tool_reference.md` | Reference |
| `references/quick_start.md` | Reference |
| `assets/tool_categories.md` | Asset |

**Verification**: Zero emoji H2 headings in `.opencode/skill/mcp-figma/`.

---

### Phase 3: mcp-code-mode Skill (~10 files)

**Target**: `.opencode/skill/mcp-code-mode/`
**Agent Assignment**: Agent 3

| File | Type |
|------|------|
| `SKILL.md` | Skill definition |
| `README.md` | Skill README |
| `INSTALL_GUIDE.md` | Installation guide |
| `references/workflows.md` | Reference |
| `references/architecture.md` | Reference |
| `references/tool_catalog.md` | Reference |
| `references/naming_convention.md` | Reference |
| `references/configuration.md` | Reference |
| `assets/config_template.md` | Asset |
| `assets/env_template.md` | Asset |

**Verification**: Zero emoji H2 headings in `.opencode/skill/mcp-code-mode/`.

---

### Phase 4: sk-code--opencode Skill (~22 files)

**Target**: `.opencode/skill/sk-code--opencode/`
**Agent Assignment**: Agent 4

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 4a | 2 | `SKILL.md`, `README.md` |
| 4b | 12 | `references/**/*.md` - All reference files (python, typescript, javascript, shell, config, shared) |
| 4c | 6 | `assets/checklists/*.md` - All checklist files |

**Verification**: Zero emoji H2 headings in `.opencode/skill/sk-code--opencode/`.

---

### Phase 5: mcp-chrome-devtools Skill (~7 files)

**Target**: `.opencode/skill/mcp-chrome-devtools/`
**Agent Assignment**: Agent 5

| File | Type |
|------|------|
| `SKILL.md` | Skill definition |
| `README.md` | Skill README |
| `INSTALL_GUIDE.md` | Installation guide |
| `references/troubleshooting.md` | Reference |
| `references/cdp_patterns.md` | Reference |
| `references/session_management.md` | Reference |
| `examples/README.md` | Example README |

**Verification**: Zero emoji H2 headings in `.opencode/skill/mcp-chrome-devtools/`.

---

### Phase 6: sk-code--full-stack Skill (~33 files)

**Target**: `.opencode/skill/sk-code--full-stack/`
**Agent Assignment**: Agent 6 (dedicated - large group)

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 6a | 2 | `SKILL.md`, `README.md` |
| 6b | 7 | `references/frontend/react/*.md` - All React reference files |
| 6c | 12 | `references/backend/go/*.md` - All Go reference files |
| 6d | 1 | `references/backend/nodejs/nodejs_standards.md` |
| 6e | 6 | `references/mobile/react-native/*.md` - All React Native files |
| 6f | 6 | `references/mobile/swift/*.md` - All Swift files |
| 6g | 6 | `assets/backend/**/*.md` - All backend checklist files |

**Verification**: Zero emoji H2 headings in `.opencode/skill/sk-code--full-stack/`.

---

### Phase 7: workflows-code--web-dev Skill (~29 files)

**Target**: `.opencode/skill/workflows-code--web-dev/`
**Agent Assignment**: Agent 7 (dedicated - large group)

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 7a | 2 | `SKILL.md`, `README.md` |
| 7b | 13 | `references/implementation/*.md` - All implementation reference files |
| 7c | 4 | `references/performance/*.md` - All performance reference files |
| 7d | 5 | `references/standards/*.md` - All standards reference files |
| 7e | 3 | `references/verification/*.md`, `references/debugging/*.md`, `references/research/*.md` |
| 7f | 2 | `references/deployment/*.md` - Deployment references |
| 7g | 3 | `assets/checklists/*.md` - All checklist files |

**Verification**: Zero emoji H2 headings in `.opencode/skill/workflows-code--web-dev/`.

---

### Phase 8: sk-git Skill (~10 files)

**Target**: `.opencode/skill/sk-git/`
**Agent Assignment**: Agent 8

| File | Type |
|------|------|
| `SKILL.md` | Skill definition |
| `README.md` | Skill README |
| `references/shared_patterns.md` | Reference |
| `references/worktree_workflows.md` | Reference |
| `references/finish_workflows.md` | Reference |
| `references/quick_reference.md` | Reference |
| `references/commit_workflows.md` | Reference |
| `assets/pr_template.md` | Asset |
| `assets/worktree_checklist.md` | Asset |
| `assets/commit_message_template.md` | Asset |

**Verification**: Zero emoji H2 headings in `.opencode/skill/sk-git/`.

---

### Phase 9: Agent Files (~32 files)

**Target**: `.opencode/agent/`
**Agent Assignment**: Agent 9

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 9a | 10 | Root agent files: `debug.md`, `context.md`, `speckit.md`, `research.md`, `write.md`, `review.md`, `orchestrate.md`, `handover.md` |
| 9b | 8 | `copilot/*.md` - All copilot agent files |
| 9c | 8 | `chatgpt/*.md` - All ChatGPT agent files |
| 9d | 8 | `.provider-backups/**/*.md` - Backup agent files |

**Special Note**: Agent files often use `## N. EMOJI SECTION` AND `## EMOJI SECTION` (without numbers). Both patterns must be handled.

**Verification**: Zero emoji H2 headings in `.opencode/agent/`.

---

### Phase 10: Command Files + Shared READMEs (~24 files)

**Target**: `.opencode/command/` and top-level READMEs
**Agent Assignment**: Agent 10

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 10a | 1 | `command/agent_router.md` |
| 10b | 5 | `command/memory/*.md` - All memory command files |
| 10c | 7 | `command/spec_kit/*.md` - All spec_kit command files |
| 10d | 4 | `command/create/*.md` - All create command files |
| 10e | 3 | `.opencode/README.md`, `skill/README.md`, `skill/scripts/README.md` |
| 10f | 1 | `skill/scripts/SET-UP_GUIDE.md` |

**Special Note**: Command files have frontmatter. Do not modify frontmatter content, only H2 headings in the body.

**Verification**: Zero emoji H2 headings in `.opencode/command/` and top-level files.

---

### Phase 11: Spec Folder Archives (~25 files, P2 priority)

**Target**: `.opencode/specs/` (excluding 005-remove-emojis-from-docs)
**Agent Assignment**: Agent 11

| Sub-phase | Files | Description |
|-----------|-------|-------------|
| 11a | 5 | `.opencode/specs/02--system-spec-kit**/*.md` - Historical spec files |
| 11b | 10 | `.opencode/specs/03--commands-and-skills**/*.md` - Historical spec and scratch files |
| 11c | 5 | `.opencode/specs/01--anobel.com**/*.md` - Historical project specs |

**Priority**: P2 (optional). These are historical working documents. Can be deferred.

**Verification**: Zero emoji H2 headings in `.opencode/specs/` (excluding this spec folder).

---

### Phase 12: Final Verification & Reporting (SEQUENTIAL)

**Target**: Entire `.opencode/` directory
**Agent Assignment**: Primary agent (sequential, after all phases complete)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 12a | `grep -rn '^## .*[emoji_pattern]' .opencode/ --include='*.md'` excluding AGENTS.md and root README.md | Zero matches |
| 12b | Run `validate_document.py` on all README.md files | All exit 0 |
| 12c | Run `extract_structure.py` on all SKILL.md files | No emoji-related style issues |
| 12d | Verify semantic H3 emojis preserved in RULES sections | H3 emojis present where expected |
| 12e | Verify body-text emojis preserved | Status indicators and markers intact |
| 12f | Count total files modified | Should match or exceed 287 |
| 12g | Generate summary report | File counts, verification results |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All modified files | `grep -rn` for emoji H2 pattern |
| Validation | README.md files | `validate_document.py --type readme` |
| Structure analysis | SKILL.md files | `extract_structure.py` |
| Regression | Semantic H3 emojis | `grep -rn '### [emoji]' --include='*.md'` (should still find matches in RULES sections) |
| Negative test | Exempt files | Verify AGENTS.md and root README.md unchanged |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc v1.0.7.0 | Internal | Green (merged) | Cannot validate without updated rules |
| validate_document.py | Internal | Green (updated) | Cannot verify README compliance |
| extract_structure.py | Internal | Green (updated) | Cannot verify SKILL compliance |
| template_rules.json | Internal | Green (updated) | Validation would still enforce emojis |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Files corrupted, wrong content removed, or user requests revert
- **Procedure**: `git checkout -- .opencode/` to restore all files from last commit
- **Note**: All changes are file-level text modifications. Git provides full rollback capability.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Complete) ──┐
                     ├──► Phases 1-11 (PARALLEL) ──► Phase 12 (Verify)
                     │
                     └──► Each phase independent (no cross-phase deps)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0 | None | All phases |
| Phases 1-11 | Phase 0 | Phase 12 |
| Phase 12 | Phases 1-11 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (system-spec-kit) | High | ~10 minutes (84 files) |
| Phase 2-3 (mcp-figma, mcp-code-mode) | Low | ~2 minutes each |
| Phase 4 (sk-code--opencode) | Medium | ~5 minutes |
| Phase 5 (mcp-chrome-devtools) | Low | ~2 minutes |
| Phase 6 (sk-code--full-stack) | Medium | ~5 minutes |
| Phase 7 (workflows-code--web-dev) | Medium | ~5 minutes |
| Phase 8 (sk-git) | Low | ~2 minutes |
| Phase 9 (agents) | Medium | ~5 minutes |
| Phase 10 (commands + READMEs) | Medium | ~5 minutes |
| Phase 11 (spec archives) | Low | ~3 minutes |
| Phase 12 (verification) | Low | ~3 minutes |
| **Total (sequential)** | | **~47 minutes** |
| **Total (parallel phases 1-11)** | | **~15 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (COMPLETED)
**Phase**: 0
**Duration**: Completed
**Agent**: Primary
**Output**: Updated validation engine and sk-doc skill

### Tier 2: Parallel Execution
| Agent | Phase | Focus | File Count |
|-------|-------|-------|-----------|
| Agent 1 | Phase 1 | system-spec-kit | 84 |
| Agent 2 | Phase 2 | mcp-figma | 6 |
| Agent 3 | Phase 3 | mcp-code-mode | 10 |
| Agent 4 | Phase 4 | sk-code--opencode | 22 |
| Agent 5 | Phase 5 | mcp-chrome-devtools | 7 |
| Agent 6 | Phase 6 | sk-code--full-stack | 33 |
| Agent 7 | Phase 7 | workflows-code--web-dev | 29 |
| Agent 8 | Phase 8 | sk-git | 10 |
| Agent 9 | Phase 9 | agent files | 32 |
| Agent 10 | Phase 10 | commands + READMEs | 24 |
| Agent 11 | Phase 11 | spec archives | 25 |

**Duration**: ~10 minutes (parallel, bounded by Phase 1)

### Tier 3: Verification
**Phase**: 12
**Agent**: Primary
**Task**: Cross-cutting verification, summary report
**Duration**: ~3 minutes

### Agent Prompt Template

Each agent receives this standardized prompt:

```
Strip emojis from H2 headings in the following files.

TRANSFORMATION RULES:
1. Pattern `## N. EMOJI TITLE` becomes `## N. TITLE` (remove emoji + trailing space)
2. Pattern `## EMOJI TITLE` becomes `## TITLE` (unnumbered headings)
3. TOC pattern `[N. EMOJI TITLE]` becomes `[N. TITLE]`
4. Same patterns inside fenced code blocks (template examples)
5. DO NOT remove semantic H3 emojis (only in RULES sections)
6. DO NOT remove body-text emojis
7. DO NOT modify AGENTS.md or root README.md

WORKFLOW PER FILE:
1. Read the file
2. Find all H2 lines with emojis
3. Strip emoji + trailing space from each
4. Find all TOC entries with emojis
5. Strip emoji + trailing space from each
6. Write the modified file

FILES: See phase-specific file inventory in Section 4 (Implementation Phases) above.

VERIFICATION: After all edits, grep for remaining emoji H2 patterns. Report count.
```
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-01 | system-spec-kit | Agent 1 | 84 files | Pending |
| W-02 | mcp-figma | Agent 2 | 6 files | Pending |
| W-03 | mcp-code-mode | Agent 3 | 10 files | Pending |
| W-04 | sk-code--opencode | Agent 4 | 22 files | Pending |
| W-05 | mcp-chrome-devtools | Agent 5 | 7 files | Pending |
| W-06 | sk-code--full-stack | Agent 6 | 33 files | Pending |
| W-07 | workflows-code--web-dev | Agent 7 | 29 files | Pending |
| W-08 | sk-git | Agent 8 | 10 files | Pending |
| W-09 | agent files | Agent 9 | 32 files | Pending |
| W-10 | commands + READMEs | Agent 10 | 24 files | Pending |
| W-11 | spec archives | Agent 11 | 25 files | Pending |
| W-12 | verification | Primary | All files | Blocked on W-01 to W-11 |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | All W-01 to W-11 complete | Primary agent | Begin Phase 12 verification |
| SYNC-002 | Phase 12 complete | Primary agent | Final summary report |

### File Ownership Rules
- Each file owned by exactly ONE workstream (no overlap)
- No cross-workstream dependencies (phases are independent)
- All workstreams converge at SYNC-001 for verification
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Agent reports file count processed and verification result
- **SYNC-001**: All agents report completion before verification begins
- **Final**: Summary report with total files modified and verification status

### Escalation Path
1. File read/write errors: Skip file, report in summary
2. Ambiguous emoji patterns: Preserve (do not remove if uncertain)
3. Exempt file accidentally in scope: Stop and verify exclusion list
<!-- /ANCHOR:communication -->
