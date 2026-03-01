---
title: "Memory System Alignment Verification Plan [010-alignment-verification/plan]"
description: "Created: 2025-12-16"
trigger_phrases:
  - "memory"
  - "system"
  - "alignment"
  - "verification"
  - "plan"
  - "010"
importance_tier: "important"
contextType: "decision"
---
# Memory System Alignment Verification Plan

**Created**: 2025-12-16
**Purpose**: Systematically verify all memory-related documentation in anobel.com accurately reflects the actual capabilities of Semantic Memory MCP Server v12.0.0.

---

## 1. SOURCE OF TRUTH

**Location**: `/Users/michelkerkmeester/MEGA/MCP Servers/semantic-memory/`
- `README.md` (1999 lines) - Complete technical reference
- `INSTALL_GUIDE.md` (1206 lines) - Installation and feature documentation

**Version**: 12.0.0

---

## 2. CANONICAL CAPABILITIES (MCP Server v12.0.0)

### 14 MCP Tools

| Tool | Purpose | Parameters |
|------|---------|------------|
| `memory_search` | Semantic vector search with hybrid FTS5 | query, concepts, specFolder, tier, contextType, limit, useDecay, includeConstitutional, includeContiguity |
| `memory_load` | Load memory by spec folder/anchor/ID | specFolder, anchorId, memoryId |
| `memory_match_triggers` | Fast trigger phrase matching (<50ms) | prompt, limit |
| `memory_list` | Browse memories with pagination | specFolder, limit, offset, sortBy |
| `memory_stats` | System statistics | (none) |
| `memory_update` | Update metadata/tier/triggers | id, title, triggerPhrases, importanceWeight, importanceTier |
| `memory_delete` | Delete by ID or spec folder | id, specFolder, confirm |
| `memory_validate` | Record validation feedback | id, wasUseful |
| `memory_save` | Index single memory file | filePath, force |
| `memory_index_scan` | Bulk scan and index workspace | specFolder, force |
| `checkpoint_create` | Save memory state snapshot | name, specFolder, metadata |
| `checkpoint_list` | List available checkpoints | specFolder, limit |
| `checkpoint_restore` | Restore from checkpoint | name, clearExisting |
| `checkpoint_delete` | Delete checkpoint | name |

### 6 Slash Commands (from MCP Server)

| Command | Purpose |
|---------|---------|
| `/memory:save` | Save context with interactive folder detection |
| `/memory:search` | Search, manage index, dashboard |
| `/memory:cleanup` | Interactive cleanup of old memories |
| `/memory:triggers` | View and manage trigger phrases |
| `/memory:status` | Quick health check |
| `/memory:checkpoint` | Create/restore/list/delete checkpoints |

### 6 Importance Tiers

| Tier | Boost | Decay | Auto-Expire | Notes |
|------|-------|-------|-------------|-------|
| `constitutional` | 3.0x | No | Never | Always surfaced (~500 tokens) |
| `critical` | 2.0x | No | Never | Architecture decisions |
| `important` | 1.5x | No | Never | Key implementations |
| `normal` | 1.0x | Yes (90-day) | Never | Standard (default) |
| `temporary` | 0.5x | Yes (90-day) | 7 days | Debug sessions |
| `deprecated` | 0.0x | N/A | Manual | Excluded from search |

### 5 Context Types

- `research`, `implementation`, `decision`, `discovery`, `general`

### Key Configuration

- **Database Path**: `.opencode/memory/database/memory-index.sqlite`
- **Embedding Model**: `nomic-ai/nomic-embed-text-v1.5` (768 dimensions)
- **Decay Half-Life**: 90 days
- **Confidence Promotion**: 90% threshold + 5 validations

---

## 3. FILES TO VERIFY

### Priority 1: Core Agent Instructions

| File | Path | Status |
|------|------|--------|
| AGENTS.md | `/AGENTS.md` | ☐ To verify |
| AGENTS (Universal).md | `/AGENTS (Universal).md` | ☐ To verify |

### Priority 2: Memory Skill

| File | Path | Status |
|------|------|--------|
| SKILL.md | `.opencode/skills/workflows-memory/SKILL.md` | ☐ To verify |
| semantic_memory.md | `.opencode/skills/workflows-memory/references/semantic_memory.md` | ☐ To verify |
| execution_methods.md | `.opencode/skills/workflows-memory/references/execution_methods.md` | ☐ To verify |
| spec_folder_detection.md | `.opencode/skills/workflows-memory/references/spec_folder_detection.md` | ☐ To verify |
| alignment_scoring.md | `.opencode/skills/workflows-memory/references/alignment_scoring.md` | ☐ To verify |
| output_format.md | `.opencode/skills/workflows-memory/references/output_format.md` | ☐ To verify |
| trigger_config.md | `.opencode/skills/workflows-memory/references/trigger_config.md` | ☐ To verify |
| troubleshooting.md | `.opencode/skills/workflows-memory/references/troubleshooting.md` | ☐ To verify |

### Priority 3: Memory Commands

| File | Path | Status |
|------|------|--------|
| search.md | `.opencode/command/memory/search.md` | ☐ To verify |
| save.md | `.opencode/command/memory/save.md` | ☐ To verify |
| checkpoint.md | `.opencode/command/memory/checkpoint.md` | ☐ To verify |

### Priority 4: Install Guides

| File | Path | Status |
|------|------|--------|
| MCP - Semantic Memory.md | `z_install_guides/MCP - Semantic Memory.md` | ☐ To verify |

### Priority 5: Configuration

| File | Path | Status |
|------|------|--------|
| opencode.json | `/opencode.json` | ☐ To verify |

---

## 4. VERIFICATION CHECKLIST PER FILE

### For Each File, Check:

#### A. Tool Names
- [ ] All 14 tool names spelled correctly
- [ ] No deprecated tool names referenced
- [ ] MCP prefix convention consistent (`mcp__semantic_memory__<tool>`)

#### B. Parameter Accuracy
- [ ] `memory_search` parameters (9 params documented correctly)
- [ ] `memory_load` parameters (specFolder OR memoryId required)
- [ ] `memory_match_triggers` parameters
- [ ] All default values match MCP Server

#### C. Feature Descriptions
- [ ] Six importance tiers documented correctly with boost values
- [ ] Constitutional tier behavior (always surfaced, ~500 tokens)
- [ ] 90-day decay half-life
- [ ] Confidence promotion (90% threshold, 5+ validations)
- [ ] Hybrid search (FTS5 + vector)

#### D. Slash Commands
- [ ] `/memory:search` syntax correct
- [ ] `/memory:save` syntax correct
- [ ] `/memory:checkpoint` subcommands correct
- [ ] No references to deprecated commands

#### E. Version References
- [ ] No outdated version numbers (e.g., v11.1 instead of v12.0.0)

#### F. Configuration Paths
- [ ] Database path: `.opencode/memory/database/memory-index.sqlite`
- [ ] MCP server path in opencode.json correct

---

## 5. KNOWN DISCREPANCIES (Pre-Analysis)

### Already Identified

| Location | Issue | Severity |
|----------|-------|----------|
| AGENTS.md:615 | References "v11.1" but server is v12.0.0 | WARNING |
| z_install_guides line 23 | References `/save_context` (old command?) | WARNING |
| z_install_guides line 1195-1197 | References `/save_context check`, `/save_context how did we...` | WARNING |

### To Investigate

| Area | Concern |
|------|---------|
| SKILL.md Tool Table | Check specFolder parameter documentation accuracy |
| semantic_memory.md | Verify context type list matches MCP Server |
| Commands | Verify subcommand syntax matches MCP Server |

---

## 6. EXECUTION PHASES

### Phase 1: Discovery (COMPLETED)
- [x] Glob all memory-related files
- [x] Grep for memory tool references
- [x] Read MCP Server documentation
- [x] Read all consumer files

### Phase 2: Systematic Comparison
For each priority group:
1. Read file content
2. Extract all memory references
3. Compare against canonical capabilities
4. Document discrepancies

### Phase 3: Discrepancy Documentation
For each issue found:
```markdown
### [SEVERITY] File: path/to/file.md:line_number

**Current**: [what it currently says]
**Should Be**: [what it should say based on MCP Server truth]
**Impact**: [what breaks or is misleading]
**Fix**: [exact edit needed]
```

### Phase 4: Fix Recommendations
- Generate prioritized fix list
- Group by file for efficient editing
- Identify any breaking changes

---

## 7. SEVERITY CLASSIFICATION

| Level | Description | Examples |
|-------|-------------|----------|
| **CRITICAL** | Tool won't work, wrong parameters | Wrong tool name, missing required param |
| **WARNING** | Outdated info, may confuse users | Old version numbers, deprecated features |
| **INFO** | Cosmetic, minor inconsistencies | Formatting, wording variations |

---

## 8. SPECIFIC ITEMS TO VERIFY

### memory_search Parameters (Most Complex)

| Parameter | Type | Required | Default | Current in Files |
|-----------|------|----------|---------|------------------|
| query | string | Yes* | - | ☐ Verify |
| concepts | string[] | No* | - | ☐ Verify |
| specFolder | string | No | - | ☐ Verify |
| tier | string | No | - | ☐ Verify |
| contextType | string | No | - | ☐ Verify |
| limit | number | No | 10 | ☐ Verify |
| useDecay | boolean | No | true | ☐ Verify |
| includeConstitutional | boolean | No | true | ☐ Verify |
| includeContiguity | boolean | No | false | ☐ Verify |

*Either query OR concepts required

### Tool Invocation Pattern

**Correct Pattern (OpenCode)**:
```
mcp__semantic_memory__memory_search()
mcp__semantic_memory__memory_load()
mcp__semantic_memory__memory_match_triggers()
```

**Check for incorrect patterns**:
- `semantic_memory.memory_search()` (Code Mode style - should NOT be used)
- `memory.search()` (short form - incorrect)

---

## 9. DELIVERABLES

1. **Discrepancy Report**: List of all misalignments with severity and fixes
2. **Fix Priority List**: Ordered by severity and impact
3. **Updated Files**: Actual corrections (if approved)
4. **Verification Summary**: Final status of all checked items

---

## 10. NEXT STEPS

1. Execute Phase 2: Systematic Comparison
2. Document all discrepancies found
3. Generate fix recommendations
4. Present findings for approval
5. Apply fixes if approved
