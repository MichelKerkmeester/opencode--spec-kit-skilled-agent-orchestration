---
title: "Memory Commands"
description: "Slash commands for managing the Spec Kit Memory system including context retrieval, session recovery, constitutional memory management, database operations, analysis, shared spaces, and async ingestion."
trigger_phrases:
  - "memory command"
  - "memory save"
  - "memory analyze"
  - "memory continue"
  - "memory learn"
  - "memory manage"
  - "memory shared"
---

# Memory Commands

> Slash commands for managing the Spec Kit Memory system across sessions.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. COMMANDS](#2--commands)
- [3. STRUCTURE](#3--structure)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. MANAGE SUBCOMMANDS](#5--manage-subcommands)
- [6. TOOL COVERAGE MATRIX](#6--tool-coverage-matrix)
- [7. FAQ](#7--faq)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory` command group provides operations for the Spec Kit Memory MCP system. These 6 commands cover context preservation, unified knowledge retrieval and analysis, session recovery, constitutional memory management, database maintenance (including async ingest), and shared-memory spaces.

All commands interact with the memory MCP server tools (`spec_kit_memory_*`). They follow a gate-based argument validation pattern: if required arguments are missing, the command prompts the user before proceeding.

### Canonical Section Order

All 6 commands follow a consistent user-first section order:

```text
GATE -> TITLE -> §1 PURPOSE -> §2 CONTRACT -> §3 QUICK REFERENCE
-> §4 ARGUMENT ROUTING -> [MODE/WORKFLOW HANDLERS] -> ERROR HANDLING
-> RELATED COMMANDS -> APPENDIX A: MCP TOOL REFERENCE -> [APPENDIX B+]
```

Everything above the `---` divider is for users. Appendices below are AI agent reference material.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **analyze** | `/memory:analyze <query> [--intent:<type>]` or `/memory:analyze <subcommand>` | Unified retrieval and analysis: intent-aware search, epistemic baselines, causal graph, ablation, dashboard |
| **continue** | `/memory:continue [recovery-mode:auto\|manual]` | Recover session from crash, compaction, or timeout |
| **learn** | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories (always-surface rules) |
| **manage** | `/memory:manage <subcommand>` | Database operations (scan, cleanup, tier, health, checkpoint, ingest) |
| **save** | `/memory:save <spec-folder>` | Save conversation context with semantic indexing |
| **shared** | `/memory:shared <subcommand>` | Shared-memory space lifecycle (create, membership, status) |

### Intent Types for Analyze Command (Retrieval Mode)

| Intent | Trigger Keywords | Weight Focus |
|--------|-----------------|--------------|
| `add_feature` | implement, add new, create new | Implementation, architecture, patterns |
| `fix_bug` | bug, error, fix, broken, debug | Decisions, implementation, errors |
| `refactor` | refactor, restructure, optimize | Architecture, patterns, decisions |
| `security_audit` | security, vulnerability, auth | Decisions, implementation, security |
| `understand` | how, why, what, explain | Architecture, decisions, overview |
| `find_spec` | spec, specification, find spec | Spec docs, architecture, overview |
| `find_decision` | decision, rationale, why did we | Decisions, rationale, context |

### Learn Subcommands

| Subcommand | Invocation | Description |
|------------|------------|-------------|
| (default) | `/memory:learn [rule]` | Create new constitutional memory (guided) |
| list | `/memory:learn list` | Show all constitutional memories and budget |
| edit | `/memory:learn edit <filename>` | Edit existing constitutional memory |
| remove | `/memory:learn remove <filename>` | Remove constitutional memory |
| budget | `/memory:learn budget` | Token budget status (~2000 max) |

### Analyze Subcommands

| Subcommand | Invocation | Description |
|------------|------------|-------------|
| preflight | `/memory:analyze preflight <specFolder> <taskId>` | Capture epistemic baseline before task |
| postflight | `/memory:analyze postflight <specFolder> <taskId>` | Calculate learning delta after task |
| causal | `/memory:analyze causal <memoryId>` | Trace causal chain for a memory |
| link | `/memory:analyze link <source> <target> <relation>` | Create causal relationship |
| unlink | `/memory:analyze unlink <edgeId>` | Remove causal relationship |
| causal-stats | `/memory:analyze causal-stats` | View causal graph statistics |
| ablation | `/memory:analyze ablation` | Run channel ablation study |
| dashboard | `/memory:analyze dashboard` | View reporting dashboard |
| history | `/memory:analyze history <specFolder>` | View learning history and LI trends |

### Shared Subcommands

| Subcommand | Invocation | Description |
|------------|------------|-------------|
| enable | `/memory:shared enable` | Enable shared memory (first-time setup, required) |
| create | `/memory:shared create <spaceId> <tenantId> <name> (--actor-user <id> \| --actor-agent <id>)` | Create or update shared space. First create auto-grants owner access to the actor |
| member | `/memory:shared member <spaceId> <tenantId> <type> <id> <role> (--actor-user <id> \| --actor-agent <id>)` | Set membership as an existing owner |
| status | `/memory:shared status [--tenant <id>] [--user <id>] [--agent <id>]` | Inspect rollout status |

> **Note:** Shared memory is disabled by default. Run `/memory:shared` or `/memory:shared enable` to complete first-time setup before using other subcommands. Shared spaces stay deny-by-default after bootstrap: the first successful `create` auto-grants `owner` to the acting caller, and later access changes still require explicit membership updates.

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
memory/
├── README.md       # This file, 6-command index and coverage matrix
├── analyze.md      # /memory:analyze - Unified retrieval + analysis (intent-aware search, epistemic, causal, eval)
├── continue.md     # /memory:continue - Session recovery
├── learn.md        # /memory:learn - Constitutional memory manager
├── manage.md       # /memory:manage - Database management, ingest
├── save.md         # /memory:save - Context saving
└── shared.md       # /memory:shared - Shared-memory space lifecycle
```

No `assets/` folder exists for memory commands. Workflows are defined inline within each command file.

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:usage-examples -->
## 4. USAGE EXAMPLES

```bash
# Save context to a spec folder
/memory:save specs/007-feature-name

# Retrieve context with auto-detected intent
/memory:analyze "how does the auth system work"

# Retrieve context with explicit intent
/memory:analyze "auth flow" --intent:fix_bug

# Recover from a crashed session
/memory:continue

# Auto-recovery mode
/memory:continue :auto

# Create a constitutional memory (always-surface rule)
/memory:learn "Never commit API keys or secrets to git"

# List all constitutional memories and budget
/memory:learn list

# Check token budget status
/memory:learn budget

# View database stats
/memory:manage stats

# Scan for new memory files
/memory:manage scan

# Force re-index all files
/memory:manage scan --force

# Check system health
/memory:manage health

# View learning history for a spec folder
/memory:analyze history specs/007-auth

# Capture epistemic baseline before a task
/memory:analyze preflight specs/007-auth T1

# Calculate learning delta after a task
/memory:analyze postflight specs/007-auth T1

# Trace causal chain for a memory
/memory:analyze causal 42

# Create causal link between memories
/memory:analyze link 42 43 caused

# View causal graph statistics
/memory:analyze causal-stats

# Run channel ablation study
/memory:analyze ablation

# View reporting dashboard
/memory:analyze dashboard

# Create a shared-memory space and bootstrap owner access for the acting user
/memory:shared create team-alpha tenant-1 "Team Alpha" --actor-user user-1

# Set membership for a user as an existing owner
/memory:shared member team-alpha tenant-1 user user-42 editor --actor-user user-1

# View rollout status
/memory:shared status

# Start async ingestion of multiple files
/memory:manage ingest start /path/to/file1.md /path/to/file2.md

# Check ingestion job progress
/memory:manage ingest status abc-123

# Cancel a running ingestion job
/memory:manage ingest cancel abc-123
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:manage-subcommands -->
## 5. MANAGE SUBCOMMANDS

The `/memory:manage` command accepts these subcommands:

| Subcommand | Arguments | Description |
|------------|-----------|-------------|
| `stats` | (none) | Show memory database statistics |
| `scan` | `[--force]` | Scan workspace for new/changed memory files |
| `cleanup` | (none) | Remove orphaned or invalid entries |
| `bulk-delete` | `<tier> [--older-than <days>] [--folder <spec>]` | Bulk delete by tier |
| `tier` | `<id> <tier>` | Change importance tier of a memory |
| `triggers` | `<id>` | View trigger phrases for a memory |
| `validate` | `<id> <useful\|not>` | Record validation feedback for a memory |
| `delete` | `<id>` | Delete a specific memory |
| `health` | (none) | Check memory system health status |
| `checkpoint` | `create\|list\|restore\|delete` | Manage named checkpoints of memory state |
| `ingest` | `start\|status\|cancel` | Async bulk ingestion of specific files |

<!-- /ANCHOR:manage-subcommands -->

---

<!-- ANCHOR:tool-coverage -->
## 6. TOOL COVERAGE MATRIX

All 33 MCP tools mapped to their primary command home:

| # | Tool | Layer | Primary Command |
|---|------|-------|-----------------|
| 1 | `memory_context` | L1 | `/memory:analyze` |
| 2 | `memory_quick_search` | L2 | `/memory:analyze` |
| 3 | `memory_search` | L2 | `/memory:analyze` |
| 4 | `memory_match_triggers` | L2 | `/memory:analyze` |
| 5 | `memory_save` | L2 | `/memory:save` |
| 6 | `memory_list` | L3 | `/memory:manage` |
| 7 | `memory_stats` | L3 | `/memory:manage` |
| 8 | `memory_health` | L3 | `/memory:manage` |
| 9 | `memory_delete` | L4 | `/memory:manage` |
| 10 | `memory_update` | L4 | `/memory:manage` |
| 11 | `memory_validate` | L4 | `/memory:manage` |
| 12 | `memory_bulk_delete` | L4 | `/memory:manage` |
| 13 | `checkpoint_create` | L5 | `/memory:manage` |
| 14 | `checkpoint_list` | L5 | `/memory:manage` |
| 15 | `checkpoint_restore` | L5 | `/memory:manage` |
| 16 | `checkpoint_delete` | L5 | `/memory:manage` |
| 17 | `shared_space_upsert` | L5 | `/memory:shared` |
| 18 | `shared_space_membership_set` | L5 | `/memory:shared` |
| 19 | `shared_memory_status` | L5 | `/memory:shared` |
| 20 | `shared_memory_enable` | L5 | `/memory:shared` |
| 21 | `task_preflight` | L6 | `/memory:analyze` |
| 22 | `task_postflight` | L6 | `/memory:analyze` |
| 23 | `memory_drift_why` | L6 | `/memory:analyze` |
| 24 | `memory_causal_link` | L6 | `/memory:analyze` |
| 25 | `memory_causal_stats` | L6 | `/memory:analyze` |
| 26 | `memory_causal_unlink` | L6 | `/memory:analyze` |
| 27 | `eval_run_ablation` | L6 | `/memory:analyze` |
| 28 | `eval_reporting_dashboard` | L6 | `/memory:analyze` |
| 29 | `memory_index_scan` | L7 | `/memory:manage` |
| 30 | `memory_get_learning_history` | L7 | `/memory:analyze` |
| 31 | `memory_ingest_start` | L7 | `/memory:manage ingest` |
| 32 | `memory_ingest_status` | L7 | `/memory:manage ingest` |
| 33 | `memory_ingest_cancel` | L7 | `/memory:manage ingest` |

### Coverage by Command

| Command | Tools Owned | Helper Tools | Layers |
|---------|-------------|--------------|--------|
| `/memory:analyze` | 13 | (none) | L1, L2, L6, L7 |
| `/memory:save` | 1 | 3 (index_scan, stats, update) | L2 |
| `/memory:manage` | 15 | 1 (search) | L3, L4, L5, L7 |
| `/memory:learn` | 0 | uses manage/save tools | (none) |
| `/memory:continue` | 0 | uses context/manage tools | (none) |
| `/memory:shared` | 4 | (none) | L5 |
| **Total** | **33** | | **L1-L7** |

> **Note:** Commands may include helper tools in their `allowed-tools` frontmatter beyond their primary ownership. Helper tools are borrowed from other command scopes for operational needs (e.g., `/memory:save` uses `memory_index_scan` from `/memory:manage` for post-save indexing). The coverage matrix above shows primary ownership. Each command file's `allowed-tools` shows the full operational set.

<!-- /ANCHOR:tool-coverage -->

---

<!-- ANCHOR:faq -->
## 7. FAQ

**Q: What is the difference between `/memory:analyze` and `/memory:continue`?**

`/memory:analyze` retrieves and searches existing memories using a query or subcommand. `/memory:continue` is specifically for session recovery: it reconstructs context from a prior session that ended due to crash, compaction, or timeout. Use `analyze` for knowledge lookup and `continue` after an interrupted session.

**Q: Do I need to run `/memory:shared enable` before every shared-memory operation?**

No. Run `enable` only once during first-time setup. After that, the shared-memory subsystem stays active and you can use `create`, `member`, and `status` directly. Re-running `enable` on an already-enabled system returns `alreadyEnabled: true` without making changes.

**Q: When should I use `/memory:learn` vs `/memory:save`?**

Use `/memory:learn` to create constitutional memories: short, always-surface rules that appear at the top of every search result (e.g., coding standards, project constraints). Use `/memory:save` to preserve session context, implementation decisions, and research findings tied to a specific spec folder. Constitutional memories apply globally. Saved context is scoped to a spec folder.

**Q: What happens if I run `/memory:manage scan --force` on a large workspace?**

The scan re-indexes all memory files regardless of whether their content has changed. This is slower than incremental scanning but useful after bulk renames or moves. For routine maintenance, omit `--force` to skip files whose content hash is unchanged.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| "No results" from knowledge | Query too narrow or no matching memories | Broaden query or try different intent |
| Save fails | Spec folder path invalid or missing | Verify path exists under `specs/` |
| Continue finds no session | No saved context from prior session | Use `/memory:analyze` with manual query instead |
| Manage scan finds 0 files | No memory files in expected directories | Check `specs/**/memory/`, `.opencode/skill/*/constitutional/`, and `.opencode/specs/` |
| Learn file not found | Wrong filename for edit/remove | Run `/memory:learn list` to see available files |
| Analyze ablation fails | `SPECKIT_ABLATION=true` not set | Set environment variable and retry |
| Shared space access denied | No membership | Use `/memory:shared member` to grant access |
| Ingest job not found | Invalid or expired job ID | Start a new job with `/memory:manage ingest start` |
| History returns empty | No PREFLIGHT/POSTFLIGHT records | Use `/memory:analyze preflight` before tasks, view with `/memory:analyze history` |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.md) | Overview of all command groups |
| [system-spec-kit SKILL.md](../../skill/system-spec-kit/SKILL.md) | Memory system architecture and spec folder workflow |
| [Spec Kit Memory MCP](../../skill/system-spec-kit/mcp_server/) | MCP server implementation for memory operations |
| [Tool Schemas](../../skill/system-spec-kit/mcp_server/tool-schemas.ts) | Canonical 33-tool inventory and property definitions |
| [Tool Input Schemas](../../skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts) | Zod validation schemas and ALLOWED_PARAMETERS |

<!-- /ANCHOR:related-documents -->
