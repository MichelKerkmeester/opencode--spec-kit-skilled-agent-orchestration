---
title: "System Spec Kit"
description: "Unified documentation and context preservation skill: spec folder workflows (Levels 1-3+), CORE + ADDENDUM v2.2 templates, validation scripts, and Spec Kit Memory MCP with hybrid multi-channel retrieval."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
  - "hybrid search"
  - "context preservation"
  - "documentation levels"
  - "memory save"
  - "spec folder workflow"
---

# System Spec Kit

> Mandatory spec folder and context preservation skill for all file-modifying conversations. Version 2.2.26.0.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is System Spec Kit?

System Spec Kit is an AI skill that enforces documentation and context preservation across all file-modifying conversations. It creates spec folders at the right documentation level (1 through 3+), applies CORE + ADDENDUM v2.2 templates, runs validation scripts, and stores context in a Spec Kit Memory MCP that survives session boundaries.

Every time an AI assistant modifies files, Spec Kit ensures the work is documented in a spec folder, tracked at the appropriate level, and saved to semantic memory so the next session can pick up where the last one left off.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| MCP Tools | 32 | Across 7 layers (L1-L7) |
| Commands | 15 | 8 spec_kit + 7 memory |
| Documentation Levels | 4 | Levels 1, 2, 3 and 3+ |
| Script Modules | 11 spec + 8 memory | TypeScript and Bash |
| Feature Entries | 189 | Across 19 categories in feature catalog |
| Template LOC | ~455 to ~1350 | Scales with documentation level |
| Requirements | Node.js 18+ | TypeScript 5.0+, OpenCode 1.0.190+ |

### Key Features

| Feature | Description |
|---------|-------------|
| **Spec Folder Workflow** | Mandatory documentation for all file modifications, scaled to 4 levels based on scope and risk |
| **CORE + ADDENDUM Templates** | Composable template architecture where each level inherits from lower levels |
| **Spec Kit Memory MCP** | 32 MCP tools providing hybrid multi-channel retrieval (Vector, FTS5/BM25, Graph, Degree) |
| **Session Continuity** | Context preserved across session boundaries via `generate-context.js` and semantic indexing |
| **Validation Scripts** | 13-rule validation orchestrator, completeness checks and placeholder detection |
| **Hybrid RAG Fusion** | Intent-weighted adaptive RRF with co-activation, causal lineage and FSRS spaced repetition |
| **Constitutional Memory** | Always-surface rules with 3.0x boost that never decay across sessions |

### Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| Node.js | 18+ | Required for scripts and MCP server |
| TypeScript | 5.0+ | Compiled to `dist/` directories |
| OpenCode | 1.0.190+ | Agent workflow integration |
| Bash | 4.0+ | Spec management shell scripts |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Start a New Spec Folder

When an AI assistant asks "Which spec folder?" at Gate 3, choose Option B (New) to create one:

```bash
# Create a new spec folder (Level 1 by default)
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh 042-my-feature

# Creates: .opencode/specs/[project]/042-my-feature/
# Files: spec.md, plan.md, tasks.md (Level 1 starters)
```

### Save Context During a Session

```bash
# Save current conversation context to a spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  .opencode/specs/[project]/042-my-feature/

# Output: memory/DD-MM-YY_HH-MM__topic.md (auto-indexed in MCP)
```

### Validate a Spec Folder

```bash
# Run all 13 validation rules on a spec folder
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/042-my-feature/

# Expected: 13/13 rules pass, exit 0
```

### Verify the MCP is Running

Check that Spec Kit Memory tools are available in your AI assistant by calling:

```
memory_match_triggers({ prompt: "spec folder" })
```

The response should return relevant memory entries. If it returns an error, see the Troubleshooting section.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
.opencode/skill/system-spec-kit/
├── SKILL.md                    # AI workflow instructions (788 lines)
├── README.md                   # This file
├── ARCHITECTURE.md             # Boundary contract: scripts/ vs mcp_server/
├── templates/                  # Template system (CORE + ADDENDUM v2.2)
│   ├── core/                   # Foundation templates (spec, plan, tasks, impl-summary)
│   ├── addendum/               # Level-specific additions (level2, level3, level3plus, phase)
│   ├── level_1/ - level_3+/    # Pre-merged composed templates by level
│   ├── context_template.md     # Memory context template (~26K)
│   ├── research.md             # Research template (~20K)
│   ├── handover.md             # Session continuity template
│   └── debug-delegation.md     # Debug delegation template
├── scripts/                    # CLI tools (TypeScript source + Bash)
│   ├── spec/                   # Spec folder management (11 scripts)
│   ├── memory/                 # Memory system scripts (8 scripts)
│   ├── templates/              # Template composition (compose.sh)
│   ├── core/                   # Core library (config, quality-scorer, workflow, etc.)
│   ├── extractors/             # Session data extractors (18 extractors)
│   ├── utils/                  # Utility modules (14 utilities)
│   ├── loaders/                # Data loading
│   ├── renderers/              # Output rendering
│   └── dist/                   # Compiled JavaScript output
├── mcp_server/                 # Spec Kit Memory MCP (TypeScript)
│   ├── context-server.ts       # MCP server entry (~682 lines, 32 tools)
│   ├── handlers/               # Tool handlers (9 functional + 2 infra)
│   ├── lib/                    # cognitive/, search/, cache/, storage/, providers/
│   ├── tests/                  # MCP test suite
│   └── database/               # SQLite + vector search
├── shared/                     # Shared workspace (@spec-kit/shared)
├── references/                 # Reference documentation (19 files)
├── assets/                     # Decision matrices, YAML configs
├── constitutional/             # Always-surface rules (never decay)
└── feature_catalog/            # Feature documentation (19 categories, 189 features)
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent instructions: routing, gates, validation, templates |
| `ARCHITECTURE.md` | API boundary contract between `scripts/` and `mcp_server/` |
| `templates/core/` | Four foundation templates used at all documentation levels |
| `scripts/spec/create.sh` | Create spec folders with level-appropriate template files |
| `scripts/spec/validate.sh` | Run 13-rule validation on any spec folder |
| `scripts/memory/generate-context.ts` | Primary workflow for saving session context to memory |
| `mcp_server/context-server.ts` | MCP server entry point exposing 32 tools |
| `feature_catalog/feature_catalog.md` | Complete catalog of 189 implemented features |
| `references/memory/memory_system.md` | Detailed memory system reference |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:features -->
## 4. FEATURES

### Documentation Levels

Spec Kit uses four documentation levels. The required LOC ranges are guidance: risk, complexity and number of affected files can push a task to a higher level. When in doubt, choose the higher level.

| Level | LOC Guidance | Required Files | Template LOC |
|-------|-------------|----------------|-------------|
| **1** | <100 | spec.md, plan.md, tasks.md, implementation-summary.md | ~455 |
| **2** | 100-499 | Level 1 + checklist.md | ~875 |
| **3** | 500+ | Level 2 + decision-record.md | ~1090 |
| **3+** | Complexity 80+ | Level 3 + governance extensions | ~1350 |

**Spec Folder Structure** (created by `create.sh`):

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and memory tracking metadata
├── spec.md                      # Feature specification
├── plan.md                      # Implementation plan
├── tasks.md                     # Task breakdown
├── checklist.md                 # QA validation (Level 2+)
├── decision-record.md           # ADRs (Level 3+)
├── implementation-summary.md    # Post-implementation summary
├── memory/                      # Context via generate-context.js
│   └── DD-MM-YY_HH-MM__topic.md
└── scratch/                     # Temporary files (git-ignored)
```

**Checklist Priority System** (Level 2+):

| Priority | Meaning | Deferral |
|----------|---------|---------|
| P0 | Hard blocker | Cannot defer |
| P1 | Required | Must complete or get user approval to defer |
| P2 | Optional | Can defer without approval |

### CORE + ADDENDUM Template Architecture

Templates compose from a CORE layer plus level-specific ADDENDUM layers. Each level inherits from the level below.

```text
Level 1:  CORE only               → 4 files, ~455 LOC
Level 2:  CORE + L2-VERIFY        → 6 files, ~875 LOC  (adds checklist.md)
Level 3:  CORE + L2 + L3-ARCH     → 7 files, ~1090 LOC (adds decision-record.md)
Level 3+: CORE + all addendums    → 7 files, ~1350 LOC (adds governance)
```

**Core Templates** (`templates/core/`):

| File | Purpose |
|------|---------|
| `spec-core.md` | Foundation specification template |
| `plan-core.md` | Foundation implementation plan |
| `tasks-core.md` | Foundation task breakdown |
| `impl-summary-core.md` | Foundation implementation summary |

**Addendum Layers** (`templates/addendum/`):

| Addendum | Level | What It Adds |
|----------|-------|-------------|
| `level2-verify/` | 2+ | Quality gates, NFRs, edge cases, checklist sections |
| `level3-arch/` | 3+ | Architecture decisions, ADRs, risk matrix |
| `level3plus-govern/` | 3+ | Enterprise governance, AI protocols, sign-offs |
| `phase/` | Any | Phase decomposition for multi-session work |

Run `templates/compose.sh` after editing core or addendum templates to regenerate the pre-merged `level_N/` directories.

### Memory System

Spec Kit Memory stores context from each working session and retrieves it across session boundaries. For full architecture details and MCP configuration, see [`mcp_server/README.md`](./mcp_server/README.md).

**How it works:**

1. During a session, the AI calls `generate-context.js` to write a memory file to `memory/`
2. The MCP server indexes the file (vector + BM25 + graph)
3. In the next session, `memory_match_triggers()` or `memory_context()` retrieves relevant context
4. Retrieved context is injected before the AI starts working

**Memory Tiers:**

| Tier | Description | Retention |
|------|-------------|-----------|
| **Constitutional** | Always-surface rules (3.0x boost) | Never decays |
| **Core** | High-importance decisions and patterns | FSRS power-law decay |
| **Working** | Session context and task details | Standard FSRS decay |
| **Archive** | Low-signal content moved to cold storage | No retrieval |

**Search Pipeline:**

The MCP uses a 4-stage hybrid pipeline: scatter-gather across Vector, FTS5/BM25, Graph and Degree channels, followed by intent-weighted adaptive RRF fusion, then MMR diversity reranking, then confidence truncation. Query complexity routing directs simple queries to fast paths and complex queries to the full pipeline.

**ANCHOR Format:**

Memory files use the ANCHOR format (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) for fine-grained section retrieval. The `context_template.md` (~26K) defines all standard anchors.
Active memories are now also checked against a rendered-memory contract before write/index: required frontmatter keys, mandatory section anchors and HTML ids, no raw Mustache leakage, and no duplicate top-of-body separators.

### MCP Tools

The Spec Kit Memory MCP exposes **32 tools** across 7 functional groups. All tools use the `spec_kit_memory_` prefix in MCP calls.

| Group | Tools | Count |
|-------|-------|-------|
| Search and Retrieval | memory_context, memory_search, memory_match_triggers, memory_list, memory_stats | 5 |
| CRUD Operations | memory_save, memory_update, memory_delete, memory_bulk_delete, memory_validate, memory_index_scan | 6 |
| Checkpoints | checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete | 4 |
| Session Learning | task_preflight, task_postflight, memory_get_learning_history | 3 |
| Causal Tools | memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink | 4 |
| Evaluation | eval_run_ablation, eval_reporting_dashboard | 2 |
| Async Ingest | memory_ingest_start, memory_ingest_status, memory_ingest_cancel | 3 |
| Shared Memory | shared_space_upsert, shared_space_membership_set, shared_memory_status, shared_memory_enable | 4 |
| System | memory_health | 1 |

For full API reference including parameters, return types and configuration, see [`mcp_server/README.md`](./mcp_server/README.md).

### Commands

**Spec Kit Commands (8):**

| Command | Steps | Purpose |
|---------|-------|---------|
| `/spec_kit:complete` | 14 | Full end-to-end workflow. Supports `:auto`, `:confirm`, `:with-research`, `:auto-debug` |
| `/spec_kit:plan` | 7 | Planning only, no implementation. Supports `:auto`, `:confirm` |
| `/spec_kit:implement` | 9 | Execute pre-planned work with PREFLIGHT/POSTFLIGHT gates. Requires existing `plan.md` |
| `/spec_kit:research` | 9 | Technical investigation and documentation |
| `/spec_kit:resume` | 4 | Resume a previous session on an existing spec folder |
| `/spec_kit:handover` | 4 | Create a session handover document |
| `/spec_kit:debug` | 5 | Delegate debugging to a specialized sub-agent |
| `/spec_kit:phase` | N/A | Create and manage phase decomposition for complex spec folders |

**Mode Suffixes** (apply to spec_kit commands):

| Suffix | Behavior |
|--------|---------|
| `:auto` | Execute without approval gates |
| `:confirm` | Pause at each step for approval |
| `:with-research` | Dispatch `@research` before verification (`/spec_kit:complete` only) |
| `:auto-debug` | Auto-dispatch `@debug` on 3+ failures (`/spec_kit:complete` only) |

**Memory Commands (7):**

| Command | Purpose |
|---------|---------|
| `/memory:save [folder]` | Save conversation context to spec folder `memory/` with semantic indexing |
| `/memory:analyze <query>` | Unified knowledge retrieval and analysis. Auto-detects task intent from 7 types, applies task-specific weights, plus epistemic baselines, causal graph, and evaluation |
| `/memory:continue` | Session recovery from crash, compaction or timeout via resume-mode memory retrieval |
| `/memory:manage` | Database management: stats, scan, cleanup, bulk-delete, tier, validate, health, checkpoint, ingest |
| `/memory:learn` | Constitutional memory manager: create, list, edit, remove, budget. Manages always-surface rules |
| | (Analysis mode: preflight, postflight, causal, link, unlink, causal-stats, ablation, dashboard, history) |
| `/memory:shared` | Shared-memory space lifecycle: create spaces, manage memberships, inspect rollout status |

### Validation Scripts

The spec management scripts in `scripts/spec/` cover the full lifecycle of a spec folder.

| Script | Purpose |
|--------|---------|
| `create.sh` | Create spec folder with level-appropriate template files. `--phase` creates parent + child phase folders |
| `validate.sh` | Run 13 validation rules. `--recursive` validates parent and all child phase folders |
| `calculate-completeness.sh` | Calculate spec folder completeness percentage |
| `check-placeholders.sh` | Verify zero placeholders remain after level upgrade |
| `recommend-level.sh` | Recommend documentation level based on scope and risk |
| `archive.sh` | Archive completed spec folders |
| `upgrade-level.sh` | Inject addendum templates to upgrade a folder to a higher level |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Feature Flags

Spec Kit Memory uses feature flags stored in `assets/` to control which pipeline features are active. Six flag groups exist:

| Group | Purpose |
|-------|---------|
| Search Pipeline | Hybrid channels, adaptive RRF, query complexity routing, MMR diversity |
| Session and Cache | Embedding cache, session deduplication, crash recovery |
| MCP Config | Server warm mode, dynamic instructions, cross-process rebinding |
| Memory and Storage | Atomic write-index, mutation ledger, causal graph |
| Embedding and API | Voyage AI, OpenAI, HuggingFace local providers |
| Debug and Telemetry | Shadow scoring, observability, eval reporting |

For the full flag reference and rollback procedures, see [`references/workflows/rollback_runbook.md`](./references/workflows/rollback_runbook.md).

### Embedding Providers

| Provider | Dimensions | Notes |
|----------|-----------|-------|
| Voyage AI | 1024 | Recommended. Requires `VOYAGE_API_KEY` |
| OpenAI | 1536 | Requires `OPENAI_API_KEY` |
| HuggingFace Local | Varies | No API key needed, higher latency |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VOYAGE_API_KEY` | Recommended | Voyage AI embeddings (1024d, best retrieval quality) |
| `OPENAI_API_KEY` | Alternative | OpenAI embeddings fallback |
| `SPEC_KIT_DB_PATH` | No | Override default SQLite database path |
| `SPEC_KIT_LOG_LEVEL` | No | Log verbosity: `debug`, `info`, `warn`, `error` |

### Dynamic Token Budget

The memory system adjusts token budgets per tier:

| Tier | Budget |
|------|--------|
| Working | 1500 tokens |
| Core | 2500 tokens |
| Constitutional | 4000 tokens |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Start a New Feature (Level 2)

A new feature affects 3 files and needs QA verification. Use Level 2.

```bash
# Create the spec folder
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh 043-user-profile-update

# Validate it was created correctly
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/
```

Then fill `spec.md`, `plan.md`, `tasks.md` and `checklist.md` using the pre-merged templates in `templates/level_2/`.

**Result**: A Level 2 spec folder ready for implementation with QA verification gates.

### Example 2: Save Context Mid-Session

After implementing the first phase of a feature, save context so the next session can resume:

```bash
# Generate a memory file (direct path mode)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  .opencode/specs/[project]/043-user-profile-update/

# Force immediate MCP indexing
# In your AI assistant, call:
# memory_index_scan({ specFolder: "043-user-profile-update" })
```

**Result**: A timestamped file in `memory/` is indexed and searchable in the next session.

### Example 3: Resume a Previous Session

Start a new session on a spec folder you worked on before:

```text
/memory:continue
```

Or retrieve context directly:

```text
/memory:analyze "user profile update implementation state"
```

**Result**: The AI assistant receives your prior decisions, file changes and next steps before starting work.

### Example 4: Upgrade a Spec Folder to Level 3

A feature grew in scope and now requires architecture decision records:

```bash
# Inject Level 3 addendum templates
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/043-user-profile-update/ 3

# Verify zero placeholders after upgrade
bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh \
  .opencode/specs/[project]/043-user-profile-update/
```

**Result**: `decision-record.md` is added to the spec folder. All placeholders should be replaced before continuing.

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| New feature, small scope | `create.sh NNN-name` | <100 LOC, single file |
| New feature, needs QA | `create.sh NNN-name` + Level 2 templates | 100-499 LOC |
| Architecture change | `create.sh NNN-name` + Level 3 templates | 500+ LOC, multiple systems |
| Save session progress | `generate-context.js [folder]` | Before ending any session |
| Recover after crash | `/memory:continue` | Session interrupted unexpectedly |
| Check prior decisions | `/memory:analyze "query"` | Starting a related task |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Common Issues

#### MCP Tools Return "Tool Not Found"

**Symptom**: Calling `memory_match_triggers()` returns an error or the tool is not recognized.

**Cause**: The Spec Kit Memory MCP server is not running or not registered in your MCP config.

**Solution**:
```bash
# Check MCP server can start
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js

# Expected: Server starts and logs "ready" or similar
# If it fails, check Node.js version (requires 18+)
node --version
```

Verify `system-spec-kit` appears in your `opencode.json` or equivalent MCP config file.

#### Memory Save Fails or Creates an Empty File

**Symptom**: `generate-context.js` runs but creates an empty memory file or exits with an error.

**Cause**: Usually a missing spec folder path or uncompiled TypeScript.

**Solution**:
```bash
# Rebuild the scripts
cd .opencode/skill/system-spec-kit
npm run build

# Then retry with an absolute path
node scripts/dist/memory/generate-context.js \
  /absolute/path/to/specs/[project]/NNN-feature/
```

#### Validation Fails with "Missing Required Files"

**Symptom**: `validate.sh` reports missing files like `spec.md` or `plan.md`.

**Cause**: The spec folder was created manually without using `create.sh`, or the wrong level templates were applied.

**Solution**:
```bash
# Check what files are present
ls -la .opencode/specs/[project]/NNN-feature/

# Run level recommendation to confirm the right level
bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh \
  .opencode/specs/[project]/NNN-feature/

# Upgrade if needed
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/NNN-feature/ [target-level]
```

#### Memory Retrieval Returns Stale Results

**Symptom**: `memory_context()` returns results from old sessions even after saving new context.

**Cause**: The embedding index was not updated after the save.

**Solution**:
```bash
# Force index rebuild for the spec folder
# In your AI assistant, call:
# memory_index_scan({ specFolder: "NNN-feature" })

# Or check database health
# memory_health({})
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| `generate-context.js` not found | Run `npm run build` in `system-spec-kit/` directory |
| Spec folder fails validation | Run `validate.sh` and read each failing rule output |
| Memory context seems wrong | Call `memory_stats({})` to check index counts |
| Session context lost after crash | Use `/memory:continue` to recover from last checkpoint |
| Placeholder check fails | Run `check-placeholders.sh` and replace all `[PLACEHOLDER]` values |

### Diagnostic Commands

```bash
# Check spec folder completeness
bash .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh \
  .opencode/specs/[project]/NNN-feature/

# Check validation rules
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/NNN-feature/ --verbose

# Check API boundary (scripts/ vs mcp_server/)
bash .opencode/skill/system-spec-kit/check-api-boundary.sh
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General Questions

**Q: Is System Spec Kit mandatory for every file change?**

A: Yes, for any conversation that modifies files. The only exemption is single-file fixes under 5 characters (typo or whitespace corrections). For everything else, Gate 3 in AGENTS.md requires a spec folder before any file modification begins.

---

**Q: What is the difference between SKILL.md and README.md?**

A: SKILL.md contains instructions for AI agents: routing rules, gates, validation workflows and template application procedures. README.md (this file) is for humans: what Spec Kit does, how to use it, and where to find things. Both live at the skill root.

---

**Q: Can I create a spec folder manually without using create.sh?**

A: You can, but `create.sh` is faster and error-free. It creates the folder, copies the right level templates, initializes `description.json` and sets up the `memory/` and `scratch/` subdirectories. Manual creation risks missing files that validation will catch later.

---

**Q: What happens if I save memory without a spec folder?**

A: The Memory Save Rule in AGENTS.md blocks it. If no spec folder was established at Gate 3, the save is blocked until you answer the Gate 3 question. Never use the Write tool directly to create files in `memory/` directories: always go through `generate-context.js`.

---

### Technical Questions

**Q: How does the hybrid search pipeline work?**

A: At query time, the MCP runs a scatter-gather across four channels: vector similarity (Voyage AI 1024d embeddings in sqlite-vec), full-text FTS5/BM25, graph connectivity (co-activation and causal signals) and typed-weighted degree scoring. Results from each channel are fused using intent-weighted adaptive RRF, then re-ranked with MMR diversity to avoid near-duplicate results, then trimmed at a confidence gap.

---

**Q: What is the ANCHOR format and why does it matter?**

A: Memory files use HTML comment anchors (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) to mark logical sections. The MCP can retrieve individual sections instead of loading entire files. This keeps token budgets low and improves retrieval precision. The `context_template.md` defines the standard set of anchors.

---

**Q: What is Constitutional Memory?**

A: Constitutional memories are rules that always surface in every retrieval, regardless of recency or score. They carry a 3.0x boost and never decay. Use `/memory:learn` to create them. Typical use cases: team coding standards, mandatory workflow steps, known failure modes.

---

**Q: How do I upgrade a Level 1 folder to Level 2 after the fact?**

A: Run `upgrade-level.sh` with the target level. It injects the addendum templates for that level into the existing folder. Then run `check-placeholders.sh` to find all new placeholder values that need to be filled in before validation passes.

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/NNN-feature/ 2
```

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [`SKILL.md`](./SKILL.md) | AI agent instructions: routing, gates, validation, template application |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | API boundary contract between `scripts/` and `mcp_server/` |
| [`mcp_server/README.md`](./mcp_server/README.md) | Full MCP architecture, 32-tool API reference, search system, cognitive memory, configuration |
| [`references/memory/memory_system.md`](./references/memory/memory_system.md) | Detailed memory system reference |
| [`references/validation/validation_rules.md`](./references/validation/validation_rules.md) | All 13 validation rules and their fixes |
| [`references/validation/five_checks.md`](./references/validation/five_checks.md) | Five Checks evaluation framework |
| [`references/workflows/rollback_runbook.md`](./references/workflows/rollback_runbook.md) | Feature-flag rollback and smoke-test procedures |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Complete catalog of 189 implemented features across 19 categories |

### Cross-Skill Alignment

| Skill | Purpose |
|-------|---------|
| [`sk-doc SKILL.md`](../sk-doc/SKILL.md) | Mandatory documentation alignment standard for all documentation created or updated |
| [`sk-code--opencode SKILL.md`](../sk-code--opencode/SKILL.md) | Mandatory code alignment standard for all code created or updated |

### Project-Level References

| Resource | Purpose |
|----------|---------|
| `AGENTS.md` (project root) | Gate definitions, AI behavior framework, mandatory workflow rules |
| `.opencode/specs/` | All spec folders created by Spec Kit |

<!-- /ANCHOR:related-documents -->

---

*Documentation version: 2.2 | Last updated: 2026-03-15 | Skill version: 2.2.26.0*
