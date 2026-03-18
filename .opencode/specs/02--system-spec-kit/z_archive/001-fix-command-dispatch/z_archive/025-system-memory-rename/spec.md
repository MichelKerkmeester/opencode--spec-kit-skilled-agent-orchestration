---
title: "Spec: Rename workflows-memory → system-memory [025-system-memory-rename/spec]"
description: "The workflows-memory skill needs to be renamed to system-memory to align with the naming convention established by the recent workflows-spec-kit → system-spec-kit rename. The \"s..."
trigger_phrases:
  - "spec"
  - "rename"
  - "workflows"
  - "memory"
  - "system"
  - "025"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Rename workflows-memory → system-memory

<!-- ANCHOR:metadata -->
## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 009 |
| **Name** | system-memory-rename |
| **Level** | 2 (Verification Required) |
| **Status** | ✅ Complete |
| **Created** | 2024-12-17 |

<!-- /ANCHOR:metadata -->
## Problem Statement

The `workflows-memory` skill needs to be renamed to `system-memory` to align with the naming convention established by the recent `workflows-spec-kit` → `system-spec-kit` rename. The "system-" prefix better reflects that this is a core infrastructure skill rather than a domain workflow.

## Scope

### In Scope
- Rename directory: `.opencode/skills/workflows-memory/` → `.opencode/skills/system-memory/`
- Update all internal skill references (SKILL.md, README.md, config files, scripts, references)
- Update all external references (AGENTS.md, AGENTS Universal, opencode.json, commands, other skills)
- Update package.json files (npm package names)
- Update hardcoded paths in JavaScript files
- Comprehensive verification with parallel agents
- Memory preservation for context continuity

### Out of Scope (Explicitly Preserved)
- `/memory:*` command names - Namespace separate from skill naming
- `semantic_memory` MCP server name - Different concept (MCP server vs skill)
- Historical references in `specs/` directories - Reflect state at time of writing
- Brand names in prose (if any)

## Reference Inventory

### Summary Statistics

| Category | File Count | Reference Count |
|----------|------------|-----------------|
| **Internal Skill Files** | 30 | ~71 |
| **AGENTS Files** | 2 | ~35 |
| **opencode.json** | 1 | 2 (absolute paths) |
| **Command Files** | 14 | ~40 |
| **Other Skills** | 10 | ~17 |
| **spec/ Historical** | 20+ | ~50 (PRESERVE) |
| **TOTAL ACTIVE** | ~57 | ~165 |

### Detailed File Inventory

#### 1. Internal Skill Files (.opencode/skills/workflows-memory/)

| File | References | Lines |
|------|------------|-------|
| `SKILL.md` | 6 | 2, 140, 475, 769-771 |
| `README.md` | 12 | 1083-1085, 1647, 1765, 1776, 1912, 1927, 1937, 2011, 2025, 2028 |
| `config.jsonc` | 2 | 24, 181 |
| `templates/context_template.md` | 2 | 243, 446 |
| `mcp_server/INSTALL_GUIDE.md` | 18 | Multiple (22, 224, 366, 383, 442, 446, 956, etc.) |
| `mcp_server/lib/vector-index.js` | 2 | 28, 30 |
| `scripts/setup.sh` | 2 | 160, 231 |
| `scripts/generate-context.js` | 2 | 155, 157-158 |
| `scripts/lib/vector-index.js` | 2 | 46, 48 |
| `scripts/package.json` | 2 | 2, 8 (package name) |
| `scripts/package-lock.json` | 2 | 2, 8 |
| `mcp_server/package.json` | 0 | (name: semantic-memory-mcp - keep) |
| `references/spec_folder_detection.md` | 1 | 339 |
| `references/semantic_memory.md` | 6 | 354, 431, 443, 453, 456, 473 |
| `references/troubleshooting.md` | 1 | 48 |
| `references/alignment_scoring.md` | 3 | 174, 181, 204 |
| `references/execution_methods.md` | 9 | 187, 206, 217, 223, 228, 231, 246, 404, 413 |

#### 2. AGENTS Configuration Files

| File | References | Lines |
|------|------------|-------|
| `AGENTS.md` | 20 | 78, 188, 422, 655, 664, 819-823 + semantic memory refs |
| `AGENTS (Universal).md` | 15 | 179, 391, 705-709 + semantic memory refs |

#### 3. MCP Configuration

| File | References | Lines |
|------|------------|-------|
| `opencode.json` | 2 | 59 (mcp_server path), 62 (database path) |

#### 4. Command Files (.opencode/command/)

| File | References | Lines |
|------|------------|-------|
| `memory/save.md` | 4 | 135, 275, 316, 485 |
| `memory/search.md` | 1 | 586 |
| `memory/checkpoint.md` | 1 | 473 |
| `spec_kit/assets/spec_kit_complete_auto.yaml` | 6 | 906, 910, 1177, 1181, 1258, 1265-1266 |
| `spec_kit/assets/spec_kit_complete_confirm.yaml` | 6 | 777, 781, 1003, 1007, 1064, 1070-1071 |
| `spec_kit/assets/spec_kit_implement_auto.yaml` | 4 | 503, 507, 560, 566-567 |
| `spec_kit/assets/spec_kit_implement_confirm.yaml` | 4 | 567, 571, 635, 641-642 |
| `spec_kit/assets/spec_kit_plan_auto.yaml` | 2 | 637, 643-644 |
| `spec_kit/assets/spec_kit_plan_confirm.yaml` | 2 | 690, 696-697 |
| `spec_kit/assets/spec_kit_research_auto.yaml` | 4 | 563, 567, 675, 681-682 |
| `spec_kit/assets/spec_kit_research_confirm.yaml` | 4 | 624, 628, 743, 749-750 |
| `create/assets/create_skill.yaml` | 2 | 549, 556 |
| `create/assets/create_skill_asset.yaml` | 2 | 311, 318 |
| `create/assets/create_skill_reference.yaml` | 2 | 423, 430 |
| `create/assets/create_folder_readme.yaml` | 3 | 196, 405, 412 |
| `create/assets/create_install_guide.yaml` | 2 | 398, 405 |
| `create/folder_readme.md` | 1 | 288 |

#### 5. Other Skills Referencing workflows-memory

| File | References | Lines |
|------|------------|-------|
| `cli-codex/SKILL.md` | 1 | 589 |
| `cli-gemini/SKILL.md` | 1 | 483 |
| `sk-doc/SKILL.md` | 1 | 448 |
| `sk-doc/references/quick_reference.md` | 1 | 187 |
| `sk-doc/assets/frontmatter_templates.md` | 1 | 25 |
| `sk-doc/assets/skill_md_template.md` | 1 | 987 |
| `system-spec-kit/SKILL.md` | 3 | 460, 804, 812 |
| `system-spec-kit/README.md` | 1 | 961 |
| `system-spec-kit/references/quick_reference.md` | 1 | 535 |
| `system-spec-kit/references/template_guide.md` | 1 | 863 |
| `system-spec-kit/references/level_specifications.md` | 1 | 443 |

#### 6. Agent Configuration

| File | References | Lines |
|------|------------|-------|
| `.opencode/agent/orchestrator.md` | 4 | 88, 152, 260, 281 |

#### 7. Historical References (PRESERVE - DO NOT UPDATE)

| Location | Approx Count |
|----------|--------------|
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive` | ~10 |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive` | ~40 |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename` | ~5 |

## Replacement Patterns

### UPDATE These Patterns

| Original | Replacement |
|----------|-------------|
| `workflows-memory` | `system-memory` |
| `.opencode/skills/workflows-memory/` | `.opencode/skills/system-memory/` |
| `name: workflows-memory` | `name: system-memory` |
| `<name>workflows-memory</name>` | `<name>system-memory</name>` |
| `workflows-memory-scripts` | `system-memory-scripts` |
| `openskills read workflows-memory` | `openskills read system-memory` |

### PRESERVE These Patterns (DO NOT UPDATE)

| Pattern | Reason |
|---------|--------|
| `/memory:*` commands | Command namespace separate from skill |
| `semantic_memory` | MCP server name (keep as-is) |
| `semantic-memory-mcp` | npm package name for MCP server |
| Historical references in `specs/` | Reflect state at time of writing |

## Success Criteria

1. Directory renamed successfully
2. All 165+ active references updated
3. Zero grep matches for `workflows-memory` in active files (excluding specs/)
4. All commands functional (`/memory:save`, `/memory:search`, `/memory:checkpoint`)
5. MCP server functional (`semantic_memory` tools work)
6. Other skills can invoke `openskills read system-memory`
7. generate-context.js script works correctly
8. Memory context saved for future sessions

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking MCP server | HIGH | Test semantic_memory tools after rename |
| Breaking commands | HIGH | Test all /memory:* commands |
| Missing references | MEDIUM | Multi-pass grep verification |
| Database path issues | HIGH | Verify database connectivity post-rename |
| Cross-skill breakage | MEDIUM | Test skill invocations |

## References

- Previous rename: `.opencode/specs/03--commands-and-skills/z_archive/doc-002-skill-rename`
- Previous rename: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename`
- Current skill: `.opencode/skills/system-memory/`

## Execution Results

**Completed:** 2024-12-17

### Phase Summary

| Phase | Description | Agents | Replacements | Status |
|-------|-------------|--------|--------------|--------|
| 1 | Directory rename | 1 | 1 operation | ✅ |
| 2 | Internal skill files | 14 | 73 | ✅ |
| 3 | External references | 11 | 79 | ✅ |
| 4 | Verification | 3 | N/A | ✅ |
| 5 | Documentation | 1 | N/A | ✅ |
| **Total** | | **25+** | **152** | ✅ |

### Agent Attribution

**Phase 2 (Internal):**
- Agent 2A: SKILL.md (6 refs)
- Agent 2B: README.md (12 refs)
- Agent 2C: config.jsonc (2 refs)
- Agent 2D: INSTALL_GUIDE.md (18 refs)
- Agent 2E: mcp_server/lib/vector-index.js (2 refs) - CRITICAL
- Agent 2F: scripts/lib/vector-index.js (2 refs) - CRITICAL
- Agent 2G: generate-context.js (3 refs)
- Agent 2H: setup.sh (2 refs)
- Agent 2I: package.json files (4 refs)
- Agent 2J: context_template.md (2 refs)
- Agent 2K: execution_methods.md (9 refs)
- Agent 2L: semantic_memory.md (6 refs)
- Agent 2M: alignment_scoring.md (3 refs)
- Agent 2N: troubleshooting.md + spec_folder_detection.md (2 refs)

**Phase 3 (External):**
- Agent 3A: AGENTS.md (6 refs)
- Agent 3B: AGENTS (Universal).md (3 refs)
- Agent 3C: orchestrator.md (4 refs)
- Agent 3D: memory commands (6 refs)
- Agent 3E: spec_kit complete YAMLs (14 refs)
- Agent 3F: spec_kit implement YAMLs (10 refs)
- Agent 3G: spec_kit plan+research YAMLs (14 refs)
- Agent 3H: create commands (11 refs)
- Agent 3I: system-spec-kit skill (5 refs)
- Agent 3J: sk-doc skill (4 refs)
- Agent 3K: CLI skills (2 refs)

### Verification Results

| Check | Result |
|-------|--------|
| Old directory gone | ✅ |
| New directory exists | ✅ |
| Grep text files | ✅ 0 matches |
| Symlink fixed | ✅ |
| Key files verified | ✅ |

### Notes

- Binary SQLite database files contain historical "workflows-memory" strings (expected)
- These will naturally update as new memories are created
- Historical references in `specs/` preserved as intended
