---
title: "System Spec Kit"
description: "Unified documentation and context preservation skill: spec folder workflows (Levels 1-3+), CORE + ADDENDUM v2.2 templates, validation scripts and Spec Kit Memory MCP with hybrid multi-channel retrieval."
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

> Documentation and memory for AI-assisted development. Every file change gets a spec folder. Every session gets persistent context.

---

<!-- ANCHOR:table-of-contents -->

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 SPEC FOLDER WORKFLOWS](#31--spec-folder-workflows)
  - [3.2 MEMORY SYSTEM](#32--memory-system)
  - [3.3 COMMANDS](#33--commands)
  - [3.4 TEMPLATES](#34--templates)
  - [3.5 SCRIPTS AND VALIDATION](#35--scripts-and-validation)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->

## 1. OVERVIEW

### What System Spec Kit Does

System Spec Kit solves two problems that every AI-assisted project runs into.

First, AI conversations that modify files leave no paper trail. A feature gets built, the session ends and the reasoning behind every decision vanishes. Spec Kit fixes this by creating a **spec folder** for every file-modifying conversation -- a numbered directory with a specification, plan, task list and implementation summary that documents what changed and why.

Second, AI assistants have amnesia. Every conversation starts from a blank slate. You explain your architecture on Monday and by Wednesday the assistant has forgotten everything. Spec Kit fixes this with a **persistent memory system** -- an MCP server that stores decisions, context and project history in a local SQLite database so the next session can pick up where the last one left off, regardless of which AI model or tool you use.

Together, these two halves form a documentation-and-memory loop: spec folders capture what happened, the memory system makes it searchable and the next session benefits from everything that came before.

### Key Statistics

| Category                    | Count                | Details                                                                                         |
| --------------------------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| **MCP Tools**               | 43                   | Across 7 layers (L1-L7), including code graph, CocoIndex lifecycle, and session bootstrap tools |
| **Commands**                | 12                   | 8 spec_kit + 4 memory                                                                           |
| **Documentation Levels**    | 4                    | Levels 1, 2, 3, 3+                                                                              |
| **Feature Catalog Entries** | 291                  | Across 22 categories                                                                            |
| **Search Channels**         | 5                    | Vector, FTS5, BM25, Causal Graph, Degree                                                        |
| **Pipeline Stages**         | 4                    | Gather, Score, Rerank, Filter                                                                   |
| **Importance Tiers**        | 6                    | constitutional through deprecated                                                               |
| **Memory States**           | 5                    | HOT through ARCHIVED                                                                            |
| **Template Architecture**   | CORE + ADDENDUM v2.2 | Composable layers per level                                                                     |
| **Script Modules**          | 12 spec + 10 memory  | TypeScript, JavaScript and Bash                                                                 |
| **Requirements**            | Node.js 18+          | TypeScript 5.0+, Bash 4.0+                                                                      |

### How This Compares

| Capability                  | Manual Documentation           | Basic RAG              | System Spec Kit                                           |
| --------------------------- | ------------------------------ | ---------------------- | --------------------------------------------------------- |
| **Documentation**           | Ad hoc, inconsistent structure | None                   | Templated spec folders at 4 levels with validation        |
| **Search**                  | Ctrl+F in files                | Vector similarity only | 5-channel hybrid search fused with Reciprocal Rank Fusion |
| **Context across sessions** | Copy-paste from notes          | Stateless              | Persistent semantic memory with session recovery          |
| **Quality control**         | Human review only              | Accept everything      | 3-layer save gate, 20-rule validation, DQI scoring        |
| **"Why" queries**           | Grep through commit messages   | Not possible           | Causal graph with 6 relationship types                    |
| **Forgetting curve**        | Everything treated equally     | None or exponential    | FSRS power-law decay tuned by content type and importance |
| **Access control**          | Filesystem permissions         | None                   | Shared memory with deny-by-default membership             |

### Key Features at a Glance

| Feature                       | What It Does                                                                                                                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spec Folder Workflow**      | Creates mandatory documentation for every file-modifying conversation, scaled to 4 levels based on scope and risk, with packet-local changelog closeout for packet roots and child phases                      |
| **CORE + ADDENDUM Templates** | Composable template architecture where each level inherits from lower levels and adds what it needs                                                                                                            |
| **Spec Kit Memory MCP**       | 43-tool MCP server providing persistent semantic memory, graph intelligence, and session orchestration across sessions, models and tools                                                                       |
| **Hook System**               | Automated context preservation via runtime hooks where available, with `session_bootstrap()` fallback when hooks are unavailable                                                                               |
| **Code Graph**                | Structural code analysis: tree-sitter WASM indexer + SQLite storage + 10 MCP tools (4 graph query, 3 CCC, 3 session lifecycle) for call graphs, imports, LLM-oriented neighborhoods, and CocoIndex integration |
| **Session Continuity**        | Context preserved across session boundaries via `generate-context.js` and semantic indexing                                                                                                                    |
| **Validation Scripts**        | 20-rule validation, completeness checks and placeholder detection for spec folders                                                                                                                             |
| **Phase Decomposition**       | Parent/child spec folder structure for multi-session, multi-phase work                                                                                                                                         |
| **Constitutional Memory**     | Always-surface rules with a 3.0x boost that never decay -- like pinned notes that show up in every search                                                                                                      |
| **Shared Memory**             | Controlled knowledge sharing with deny-by-default access for teams and multi-agent setups                                                                                                                      |

### Code Graph

Structural code analysis via tree-sitter WASM parsing and SQLite storage. Maps function calls, imports, class hierarchy, and containment across JS/TS/Python/Shell files.

| Tool Category       | Tools                                                                    | Purpose                                            |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| **Graph Query**     | code_graph_scan, code_graph_query, code_graph_status, code_graph_context | Index, query, and explore structural relationships |
| **CCC (CocoIndex)** | ccc_status, ccc_reindex, ccc_feedback                                    | CocoIndex lifecycle management                     |
| **Session**         | session_health, session_resume, session_bootstrap                        | Session lifecycle orchestration                    |

CocoIndex (semantic search) finds code by concept. Code Graph (structural) maps what connects to what. The compact-merger combines both with Memory under a 4000-token budget for compaction injection.

For full tool reference with parameters, see [MCP Server README](mcp_server/README.md).

### Requirements

| Requirement   | Minimum                  | Notes                                  |
| ------------- | ------------------------ | -------------------------------------- |
| Node.js       | 18+                      | Required for scripts and MCP server    |
| TypeScript    | 5.0+                     | Source compiled to `dist/` directories |
| Bash          | 4.0+                     | Spec management shell scripts          |
| Embedding API | None (HuggingFace local) | Voyage AI recommended for best quality |

Workspace module profile:

- `shared/` and `mcp_server/` are ESM packages (`"type": "module"`) using NodeNext TypeScript settings.
- `scripts/` remains CommonJS (`"type": "commonjs"`) with explicit ESM interop where runtime cross-package loading is required.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->

## 2. QUICK START

### Create Your First Spec Folder

When an AI assistant asks "Which spec folder?" at Gate 3, choose Option B (New) to create one:

```bash
# Create a Level 1 spec folder
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh 042-my-feature

# Creates: .opencode/[project]/042-my-feature/
# Files: spec.md, plan.md, tasks.md (Level 1 starters)
```

The script sets up the folder, copies the right templates for the chosen level, initializes `description.json` and creates `memory/` and `scratch/` subdirectories.

### Save Context at the End of a Session

When your work session ends, save what happened so the next session can continue:

```bash
# Generate a memory file from structured JSON
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"042-my-feature","sessionSummary":"Implemented login form validation"}' \
  .opencode/specs/[project]/042-my-feature/

# Output: memory/YY-MM-DD_HH-MM__topic.md (auto-indexed in MCP)
```

Or use the command shorthand:

```text
/memory:save 042-my-feature
```

### Resume Work From a Previous Session

Start a new session on work you did before:

```text
/spec_kit:resume
```

The system checks the best available continuation context for your most recent work, prefers a fresh `handover.md` when it exists, falls back to resume-mode memory retrieval and crash-recovery breadcrumbs when needed, and presents your prior decisions, file changes and next steps before you start.

### Search for Context

Ask the memory system a question in plain language:

```text
/memory:search "how did we decide on the auth architecture?"
```

The system reads your question, figures out you are looking for a past decision and routes to the right search strategy automatically.

### Validate a Spec Folder

```bash
# Run all 20 validation rules
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/042-my-feature/

# Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix)
```

### Verify the MCP Is Running

Check that Spec Kit Memory tools are available:

```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "full" }
}
```

The response should return `status: "ok"` and database table counts. If it returns an error, see [Troubleshooting](#7-troubleshooting).

Codex CLI note: if the MCP server runs in a restricted or read-only repo context, set `MEMORY_DB_PATH` to a writable location such as a directory under your home folder or `/tmp`.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->

## 3. FEATURES

### 3.1 SPEC FOLDER WORKFLOWS

#### What Spec Folders Are

A spec folder is a numbered directory (like `specs/042-my-feature/`) that holds the documentation for a single unit of work. Think of it as a project folder for an AI conversation -- it keeps the specification, plan, task list and implementation summary together so the reasoning behind every change is preserved. For packet roots and direct child phases, closeout can also produce packet-local changelog entries that live beside the packet instead of only in the global release stream.

Every conversation that modifies files gets a spec folder. This is enforced by Gate 3 in the project's AGENTS.md -- the AI assistant asks "Which spec folder?" before any file modification begins. The only exemptions are single-file fixes under 5 characters (typo or whitespace corrections).

#### Documentation Levels

Not every change needs the same amount of paperwork. A one-line bug fix does not need an architecture decision record. A multi-system refactor does. Spec Kit uses four levels to match documentation depth to task complexity.

| Level  | LOC Guidance   | Required Files                                        | When to Use                                          |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **1**  | < 100          | spec.md, plan.md, tasks.md, implementation-summary.md | Small features, bug fixes, single-file changes       |
| **2**  | 100 - 499      | Level 1 + checklist.md                                | Features needing QA verification, multi-file changes |
| **3**  | 500+           | Level 2 + decision-record.md                          | Architecture changes, complex refactors              |
| **3+** | Complexity 80+ | Level 3 + governance extensions                       | Multi-agent work, enterprise sign-offs               |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**Implementation-summary.md** is required at all levels but created **after** implementation completes, not at spec folder creation time.

Packet-local changelogs are additive, not a replacement for `implementation-summary.md`. When the target is a packet root or direct child phase, `/spec_kit:implement`, `/spec_kit:complete`, and the nested changelog workflow can write packet history into a local `changelog/` directory using the canonical root/phase naming rules.

#### Spec Folder Structure

When `create.sh` builds a spec folder, it produces this layout:

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and memory tracking metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── checklist.md                 # QA validation gates (Level 2+)
├── decision-record.md           # Architecture decisions (Level 3+)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── changelog/                   # Packet-local changelog history for packet roots / phase parents
├── memory/                      # Session context files (via generate-context.js)
│   └── YY-MM-DD_HH-MM__topic.md
└── scratch/                     # Temporary workspace files (gitignored)
```

#### Checklist Priority System (Level 2+)

Checklists use a priority system so reviewers know what blocks shipping and what can wait:

| Priority | Meaning                                                 | Deferral                        |
| -------- | ------------------------------------------------------- | ------------------------------- |
| **P0**   | Hard blocker -- cannot ship without this                | Cannot defer                    |
| **P1**   | Required -- must complete or get user approval to defer | Needs explicit approval to skip |
| **P2**   | Optional -- nice to have                                | Can defer without approval      |

#### Phase Decomposition

When a feature is too large for a single spec folder, use phase decomposition to split it into parent and child folders. The parent holds the overall specification. Each child holds one phase of the work.

```text
specs/022-big-feature/             # Parent spec folder
├── spec.md                        # Overall specification
├── 001-data-model/                # Phase 1 child
│   ├── spec.md
│   └── ...
├── 002-api-endpoints/             # Phase 2 child
│   ├── spec.md
│   └── ...
└── 003-frontend/                  # Phase 3 child
    ├── spec.md
    └── ...
```

Use `create.sh --phase` to create a parent with its first child in one step. Run `validate.sh --recursive` to validate the parent and all children together.

#### Validation

The `validate.sh` script runs 20 rules against a spec folder and reports what passes and what needs fixing. Rules check for required files, template compliance, placeholder detection, anchor markers and cross-reference consistency.

| Exit Code | Meaning        | Action                              |
| --------- | -------------- | ----------------------------------- |
| 0         | All rules pass | Ready to proceed                    |
| 1         | Warnings found | Review and fix if practical         |
| 2         | Errors found   | Must fix before claiming completion |

Run with `--verbose` to see the details behind each rule, or `--recursive` to validate a parent and all child phase folders.

---

<!-- divider:4.2 -->

### 3.2 MEMORY SYSTEM

The memory system lives in an MCP server that gives AI assistants persistent memory across sessions, models and tools. It stores context in a local SQLite database and retrieves exactly what is relevant when a new session starts.

Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task. Switch from Claude to GPT to Gemini and back -- the memory stays the same because it lives on your machine, not inside any AI's context window.

For full architecture details, the 43-tool API reference, search pipeline internals and configuration, see [`mcp_server/README.md`](./mcp_server/README.md).

#### Hybrid Search

When you search, the system checks five sources at once -- like a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet, the recommendation board and the "related topics" corkboard all at the same time.

| Channel          | How It Works                                        | Good For                                       |
| ---------------- | --------------------------------------------------- | ---------------------------------------------- |
| **Vector**       | Compares meaning via embeddings (Voyage AI 1024d)   | Finding related content even when words differ |
| **FTS5**         | Full-text search on exact words and phrases         | Specific terms and error messages              |
| **BM25**         | Keyword relevance scoring                           | Ranking when you know roughly what you want    |
| **Causal Graph** | Follows cause-and-effect links between memories     | "Why did we choose this?" questions            |
| **Degree**       | Scores by graph connectivity, weighted by edge type | Finding important hub decisions                |

Results from all channels are combined using Reciprocal Rank Fusion (RRF) with a K parameter tuned per query intent. A memory that scores well in multiple channels rises to the top.

#### Search Pipeline

Every search goes through four stages, like an assembly line where each station has one clear job:

1. **Gather** -- collect candidates from active channels in parallel. Constitutional memories are always injected regardless of score.
2. **Score** -- fuse channel results with RRF, then apply 8 post-fusion scoring signals (co-activation boost, FSRS decay, interference penalty, cold-start boost, session recency, causal 2-hop, intent weights, channel min-representation).
3. **Rerank** -- run a local cross-encoder model to re-check ranking accuracy. Chunks are collapsed back to parent memories. If your machine lacks VRAM, the reranker gracefully skips.
4. **Filter** -- enforce score immutability, apply state filtering, annotate with confidence labels (high/medium/low) and truncate at the confidence gap.

#### Query Intelligence

Before any search runs, the system figures out what kind of help you need -- like a triage nurse who reads your symptoms and routes you to the right specialist.

- **Complexity routing** sizes up your question and picks how many channels to use (2 for simple, 4 for moderate, all 5 for complex)
- **Intent classification** maps your query to one of 7 task types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision), each with its own channel weight profile
- **Query decomposition** splits multi-topic questions into focused sub-queries without needing an LLM call
- **HyDE fallback** writes a hypothetical answer to your question, then searches for real documents matching it -- surfaces content your original wording missed

#### Memory Lifecycle

Not all memories are equally useful forever. The system uses FSRS (Free Spaced Repetition Scheduler) to track freshness -- a decay model validated on 100M+ Anki flashcard users.

| Tier               | Description                       | Decay Behavior                           |
| ------------------ | --------------------------------- | ---------------------------------------- |
| **Constitutional** | Always-surface rules (3.0x boost) | Never decays                             |
| **Critical**       | High-importance decisions         | Never decays or decays at 2x slower rate |
| **Important**      | Significant patterns              | 1.5x slower than normal                  |
| **Normal**         | Standard session context          | Standard FSRS decay                      |
| **Temporary**      | Quick scratch notes               | Fast decay                               |
| **Deprecated**     | Superseded content                | Fastest decay                            |

Decay speed is also controlled by content type (decisions decay slower than general notes). Memories earn promotions through positive feedback: 5 thumbs-up promotes normal to important, 10 promotes to critical.

Five cognitive states track access patterns: **HOT** (just used) through **WARM**, **COLD**, **DORMANT** to **ARCHIVED**. Hot memories get full content in results. Warm ones appear as summaries. Cold and below only surface if they score well enough.

#### Causal Graph

The system tracks how decisions relate to each other -- like a corkboard with sticky notes connected by string. One note says "we chose JWT tokens." A string connects it to "because the session store was too slow." Another string connects that to "the Redis outage on March 5th."

Six relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`. Community detection (Louvain algorithm) automatically clusters related memories so finding one surfaces its neighbors.

#### Save Intelligence

When you save new content, the system runs an arbitration process before storing anything. Prediction Error gating compares incoming content against existing memories and picks one of four outcomes:

| Outcome       | When                               | What Happens                                |
| ------------- | ---------------------------------- | ------------------------------------------- |
| **CREATE**    | Nothing similar exists             | Stored as new knowledge                     |
| **REINFORCE** | Similar exists, new one adds value | Both kept, existing gets a confidence boost |
| **UPDATE**    | Similar exists, new one is better  | Old version replaced in place               |
| **SUPERSEDE** | New knowledge contradicts the old  | New version active, old one demoted         |

Three quality gates run before storage: structure check (required format and metadata), semantic sufficiency check (enough real content to be useful), and duplicate detection.
Short decision-type memories can bypass the content-length gate when SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true and at least two structural signals (title, specFolder, or anchor) are present.

#### Shared Memory

By default, every memory is private. Shared memory adds controlled access so teams and multi-agent setups can share a knowledge pool.

Think of it like a shared office with a keycard lock. The office stays locked until an admin activates it. Only people on the access list can enter. Management can lock it down instantly if something goes wrong.

- **Deny-by-default** -- nobody gets access unless explicitly granted
- **Three roles** -- `owner` (full control), `editor` (read/write), `viewer` (read-only)
- **Kill switch** -- immediately blocks all reads for emergencies

For the full shared memory guide, see [`SHARED_MEMORY_DATABASE.md`](./SHARED_MEMORY_DATABASE.md).

#### Evaluation Infrastructure

The memory system includes built-in tools for measuring search quality:

- **Ablation studies** -- turn off one search component at a time to measure its contribution, like removing one ingredient from a recipe to see if the dish still tastes good
- **12-metric computation** -- MRR, NDCG, MAP and 9 other information retrieval metrics
- **Synthetic ground truth corpus** -- 110 test questions with known correct answers for benchmarking, keyed to live parent-memory IDs; rerun `scripts/evals/map-ground-truth-ids.ts` after DB rebuilds or imports before trusting ablation or reporting comparisons
- **Reporting dashboard** -- performance trends across work periods and search channels, sourced from parent-memory-normalized eval rows even when retrieval hits came from chunks

---

<!-- divider:4.3 -->

### 3.3 COMMANDS

Spec Kit exposes 12 workflow commands: 8 `spec_kit` + 4 `memory` operations. (Repository-wide command surface is 20 when combined with 7 `create` commands and 1 `agent_router` utility.) Each command opens access to a specific set of tools.

#### Spec Kit Commands (8)

| Command                       | Steps | Purpose                                                                                                                          |
| ----------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/spec_kit:complete`          | 14    | Full end-to-end workflow: spec through implementation, verification, and packet-local changelog closeout where applicable        |
| `/spec_kit:plan`              | 7     | Planning only -- spec through plan, no implementation                                                                            |
| `/spec_kit:implement`         | 9     | Execute pre-planned work. Requires existing `plan.md`; packet-aware targets also generate local changelog output during closeout |
| `/spec_kit:resume`            | 4     | Resume a previous session on an existing spec folder                                                                             |
| `/spec_kit:handover`          | 4     | Create a session handover document for the next AI                                                                               |
| `/spec_kit:debug`             | 5     | Delegate debugging to a specialized sub-agent with fresh perspective                                                             |
| `/spec_kit:plan :with-phases` | N/A   | Phase decomposition integrated into plan and complete commands                                                                   |
| `/spec_kit:deep-research`     | N/A   | Autonomous research loop with convergence detection                                                                              |
| `/spec_kit:deep-review`       | N/A   | Autonomous code review loop with convergence detection                                                                           |

**Mode Suffixes** change how commands run:

| Suffix           | Behavior                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| `:auto`          | Execute without approval gates                                         |
| `:confirm`       | Pause at each step for approval                                        |
| `:with-research` | Dispatch deep research before verification (`/spec_kit:complete` only) |
| `:auto-debug`    | Auto-dispatch debug agent on 3+ failures (`/spec_kit:complete` only)   |

**Command source files**: `.opencode/command/spec_kit/`

#### Memory Commands (4)

| Command          | Tool Count | Purpose                                                                                                                                 |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/memory:save`   | 4          | Save conversation context to a spec folder's `memory/` directory with semantic indexing                                                 |
| `/memory:search` | 13         | Search, retrieve and analyze knowledge. Auto-detects task intent from 7 types                                                           |
| `/memory:manage` | 20         | Database maintenance plus shared-memory lifecycle: stats, scan, cleanup, bulk-delete, checkpoints, ingest, spaces, memberships, rollout |
| `/memory:learn`  | 6          | Constitutional memory manager: create, list, edit, remove always-surface rules                                                          |

Session recovery lives in `/spec_kit:resume`, which uses shared memory tools for resume-mode retrieval, crash breadcrumbs, and continuation routing.

Some commands own their tools (they are the primary home) while others borrow tools from `/memory:search` or `/memory:manage`. A borrowed tool works the same way -- it is just administered somewhere else.

**Command source files**: `.opencode/command/memory/`

---

<!-- divider:4.4 -->

### 3.4 TEMPLATES

#### CORE + ADDENDUM Architecture (v2.2)

Templates compose from a CORE layer plus level-specific ADDENDUM layers. Each level inherits from the level below and adds what it needs -- like building blocks that stack.

```text
Level 1:  CORE only               → 4 files, ~455 LOC
Level 2:  CORE + L2-VERIFY        → 6 files, ~875 LOC  (adds checklist.md)
Level 3:  CORE + L2 + L3-ARCH     → 7 files, ~1090 LOC (adds decision-record.md)
Level 3+: CORE + all addendums    → 7 files, ~1350 LOC (adds governance extensions)
```

#### Core Templates

The four foundation templates appear at every level:

| Template               | File                   | Purpose                                                               |
| ---------------------- | ---------------------- | --------------------------------------------------------------------- |
| Specification          | `spec-core.md`         | What the feature is, why it exists, requirements and success criteria |
| Plan                   | `plan-core.md`         | How to implement: architecture, phases, testing strategy              |
| Tasks                  | `tasks-core.md`        | Step-by-step task breakdown with status tracking                      |
| Implementation Summary | `impl-summary-core.md` | Post-implementation record of what changed and verification results   |

**Location**: `templates/core/`

#### Addendum Layers

Each addendum adds sections and files for its level:

| Addendum             | Level | What It Adds                                           |
| -------------------- | ----- | ------------------------------------------------------ |
| `level2-verify/`     | 2+    | Quality gates, NFRs, edge cases, checklist template    |
| `level3-arch/`       | 3+    | Architecture decisions, ADRs, risk matrix              |
| `level3plus-govern/` | 3+    | Enterprise governance, AI protocols, sign-off sections |
| `phase/`             | Any   | Phase decomposition headers for parent/child folders   |

**Location**: `templates/addendum/`

#### Pre-Merged Templates

For convenience, pre-merged templates for each level live in `templates/level_1/` through `templates/level_3+/`. These are the templates that `create.sh` copies into new spec folders.

After editing core or addendum templates, run `templates/compose.sh` to regenerate the pre-merged directories.

#### Special Templates

| Template                      | Purpose                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `context_template.md` (~26K)  | Memory context template with standard ANCHOR sections           |
| `research/research.md` (~20K) | Deep research template for autonomous investigation             |
| `handover.md`                 | Session continuity template for handing off to the next AI      |
| `debug-delegation.md`         | Debug delegation template for fresh-perspective troubleshooting |

#### Template Compliance

Templates use ANCHOR markers (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) to mark logical sections. Validation checks for required anchors, proper section ordering and template version alignment. The `template_compliance_contract.md` reference defines which anchors are required at each level.

---

<!-- divider:4.5 -->

### 3.5 SCRIPTS AND VALIDATION

#### Spec Management Scripts

The `scripts/spec/` directory contains 12 scripts that manage the full lifecycle of spec folders:

| Script                        | Purpose                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `create.sh`                   | Create spec folders with level-appropriate templates. Use `--phase` for parent + child folders |
| `validate.sh`                 | Run 20 validation rules. Use `--recursive` for phase folders, `--verbose` for details          |
| `upgrade-level.sh`            | Inject addendum templates to upgrade a folder to a higher level                                |
| `recommend-level.sh`          | Analyze scope and risk to recommend the right documentation level                              |
| `calculate-completeness.sh`   | Calculate spec folder completeness as a percentage                                             |
| `check-completion.sh`         | Verify all completion criteria are met                                                         |
| `check-placeholders.sh`       | Find remaining `[PLACEHOLDER]` values after level upgrade                                      |
| `check-template-staleness.sh` | Detect templates that need regeneration                                                        |
| `progressive-validate.sh`     | Progressive validation for in-progress work                                                    |
| `quality-audit.sh`            | Run quality audit on spec folder content                                                       |
| `archive.sh`                  | Archive completed spec folders                                                                 |
| `test-validation.sh`          | Test the validation rules themselves                                                           |

#### Memory Scripts

The `scripts/memory/` directory contains 10 scripts for the memory system:

| Script                        | Purpose                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `generate-context.ts`         | Primary workflow for saving session context to memory files |
| `backfill-frontmatter.ts`     | Add missing frontmatter to existing memory files            |
| `rank-memories.ts`            | Rank memories by relevance for a query                      |
| `reindex-embeddings.ts`       | Rebuild embedding vectors for stored memories               |
| `cleanup-orphaned-vectors.ts` | Remove vector entries with no matching memory               |
| `rebuild-auto-entities.ts`    | Regenerate auto-extracted entity catalog                    |
| `validate-memory-quality.ts`  | Run quality checks on stored memory content                 |
| `ast-parser.ts`               | Parse markdown AST for section extraction                   |
| `fix-memory-h1.mjs`           | Fix heading levels in memory files                          |

TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.

#### Template Composition

Run `scripts/templates/compose.sh` after editing any core or addendum template to regenerate the pre-merged `level_N/` directories.

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->

## 4. STRUCTURE

```
.opencode/skill/system-spec-kit/
├── SKILL.md                    # AI workflow instructions (when to use, gates, rules)
├── README.md                   # This file (what it does, how to use it)
├── ARCHITECTURE.md             # Boundary contract: scripts/ vs mcp_server/
├── SHARED_MEMORY_DATABASE.md   # Shared memory guide
├── templates/                  # Template system (CORE + ADDENDUM v2.2)
│   ├── core/                   # Foundation templates (spec, plan, tasks, impl-summary)
│   ├── addendum/               # Level-specific additions (level2, level3, level3plus, phase)
│   ├── level_1/ - level_3+/    # Pre-merged composed templates by level
│   ├── context_template.md     # Memory context template (~26K)
│   ├── research/research.md             # Deep research template (~20K)
│   ├── handover.md             # Session continuity template
│   └── debug-delegation.md     # Debug delegation template
├── scripts/                    # CLI tools (TypeScript source + Bash)
│   ├── spec/                   # Spec folder management (12 scripts)
│   ├── memory/                 # Memory system scripts (10 scripts)
│   ├── templates/              # Template composition (compose.sh)
│   ├── core/                   # Core library (17 modules)
│   ├── extractors/             # Session data extractors (12 extractors)
│   ├── utils/                  # Utility modules (20 utilities)
│   └── dist/                   # Compiled JavaScript output
├── mcp_server/                 # Spec Kit Memory MCP (TypeScript)
│   ├── context-server.ts       # MCP server entry point and tool registration
│   ├── handlers/               # Tool handlers, save pipeline, and response assembly
│   ├── lib/                    # Search pipeline, cognitive engine, graph, governance
│   ├── tests/                  # MCP test suite
│   ├── INSTALL_GUIDE.md        # Full installation walkthrough
│   └── README.md               # MCP server reference (tool API, pipeline, configuration)
├── shared/                     # Shared workspace (@spec-kit/shared)
│   ├── algorithms/             # Fusion, reranking, and lab algorithms
│   ├── contracts/              # Typed trace/envelope contracts
│   ├── embeddings/             # Provider implementations
│   └── ...                     # Chunker, scoring, parsing, utilities
├── references/                 # Reference documentation (27 files)
├── assets/                     # Decision matrices, YAML configs
├── constitutional/             # Always-surface rules (never decay)
├── feature_catalog/            # Feature documentation (22 categories, 291 features)
└── manual_testing_playbook/    # Manual validation scenarios (22 categories, 311 scenario files)
```

### Key Files

| File                                                                         | Purpose                                                                                              |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`SKILL.md`](./SKILL.md)                                                     | AI agent instructions: routing rules, gates, validation procedures, template application             |
| [`README.md`](./README.md)                                                   | This file -- what Spec Kit does, how to use it, where to find things                                 |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md)                                       | API boundary contract between `scripts/` and `mcp_server/`                                           |
| [`SHARED_MEMORY_DATABASE.md`](./SHARED_MEMORY_DATABASE.md)                   | Shared memory guide with spaces, roles and kill switch                                               |
| [`mcp_server/README.md`](./mcp_server/README.md)                             | Full MCP architecture: 43-tool API reference, search pipeline, graph intelligence, and configuration |
| [`mcp_server/INSTALL_GUIDE.md`](./mcp_server/INSTALL_GUIDE.md)               | Step-by-step installation with embedding providers and environment                                   |
| [`templates/core/`](./templates/core/)                                       | Four foundation templates used at all documentation levels                                           |
| [`scripts/spec/create.sh`](./scripts/spec/create.sh)                         | Create spec folders with level-appropriate template files                                            |
| [`scripts/spec/validate.sh`](./scripts/spec/validate.sh)                     | Run 20-rule validation on any spec folder                                                            |
| `scripts/dist/memory/generate-context.js`                                    | Primary workflow for saving session context to memory                                                |
| [`feature_catalog/FEATURE_CATALOG.md`](./feature_catalog/FEATURE_CATALOG.md) | Complete catalog of 291 implemented features across 22 categories                                    |

### How the Pieces Connect

Think of Spec Kit as a filing system with a librarian attached.

The **spec folder workflow** is the filing system. Every time you modify files, it creates a numbered folder with the right paperwork (specification, plan, tasks). Templates make sure every folder follows the same structure. Validation checks that nothing is missing.

The **memory system** is the librarian. When a session ends, `generate-context.js` writes a summary of what happened and files it in the spec folder's `memory/` directory. The MCP server indexes it into vector, FTS5, and BM25 surfaces, while graph and degree signals are computed at retrieval time. When a new session starts, hook-capable runtimes auto-prime that context. Hookless runtimes should start with `session_bootstrap`, which bundles resume context, health, and structural readiness into one recovery call before deeper `memory_context` work begins.

The **commands** are the doors into the system. Each command opens access to the tools it needs. `/spec_kit:complete` runs a full workflow from spec through implementation and packet-local changelog closeout when applicable. `/memory:save` saves context. `/spec_kit:resume` recovers or continues a previous session.

```text
Session starts
  └─► Gate 3 asks: "Which spec folder?"
       ├─► Option A: Use existing folder
       ├─► Option B: Create new folder (create.sh)
       └─► Option D: Skip documentation
            │
            ▼
  AI modifies files, tracks tasks in tasks.md
            │
            ▼
  Session ends
  └─► generate-context.js writes memory file
       └─► MCP indexes it (vector + BM25 + graph)
            │
            ▼
  Next session starts
  └─► Hooks auto-prime OR session_bootstrap() runs once
       └─► AI resumes with context + health + structural readiness
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->

## 5. CONFIGURATION

### Embedding Providers

The memory system converts text to numerical embeddings for vector search. Three providers are supported:

| Provider          | Dimensions | Notes                                                            |
| ----------------- | ---------- | ---------------------------------------------------------------- |
| Voyage AI         | 1024       | Recommended. Best retrieval quality. Requires `VOYAGE_API_KEY`   |
| OpenAI            | 1536       | Alternative. Requires `OPENAI_API_KEY`                           |
| HuggingFace Local | Varies     | No API key needed. Higher latency, runs entirely on your machine |

### Environment Variables

| Variable             | Required    | Description                                          |
| -------------------- | ----------- | ---------------------------------------------------- |
| `VOYAGE_API_KEY`     | Recommended | Voyage AI embeddings (1024d, best retrieval quality) |
| `OPENAI_API_KEY`     | Alternative | OpenAI embeddings fallback                           |
| `MEMORY_DB_PATH`     | No          | Override default SQLite database path                |
| `SPEC_KIT_LOG_LEVEL` | No          | Log verbosity: `debug`, `info`, `warn`, `error`      |

For the full list of environment variables (including evaluation, telemetry and feature flag overrides), see [`references/config/environment_variables.md`](./references/config/environment_variables.md).

### MCP Server Configuration

Add the Spec Kit Memory server to your MCP client configuration (for example `opencode.json` or Claude Desktop config):

```json
{
  "mcpServers": {
    "spec-kit-memory": {
      "command": "node",
      "args": [
        "/absolute/path/to/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "env": {
        "VOYAGE_API_KEY": "your-key-here"
      }
    }
  }
}
```

For the full installation walkthrough including database migration and embedding provider setup, see [`mcp_server/INSTALL_GUIDE.md`](./mcp_server/INSTALL_GUIDE.md).

### Feature Flags

The memory system uses runtime-resolved feature flags rather than import-time snapshots. Long-lived MCP processes re-read relevant `process.env` values during search, scoring, and rollout checks, so operator flips take effect without requiring a module reload.

| Group                    | Controls                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Search Pipeline          | 5-channel retrieval, fallback routing, reranking, graph-walk rollout, confidence and token-budget policies |
| Session and Cache        | Embedding cache, session deduplication, crash recovery, DB rebind invalidation                             |
| Memory and Storage       | Save quality gate, reconsolidation, governed save/retrieval scopes, causal graph maintenance               |
| Embedding and API        | Startup provider resolution, fail-fast dimension checks, structured fallback metadata                      |
| Evaluation and Telemetry | Ablation guardrails, reporting dashboard output, optional trace and eval logging                           |

For the full flag reference and rollback procedures, see [`references/workflows/rollback_runbook.md`](./references/workflows/rollback_runbook.md).

### Dynamic Token Budget

The memory system adjusts token budgets per tier to control how much context is injected:

| Tier           | Budget       |
| -------------- | ------------ |
| Working        | 3,500 tokens |
| Core           | 3,500 tokens |
| Constitutional | 4,000 tokens |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->

## 6. USAGE EXAMPLES

### Example 1: Start a New Feature

A new feature affects 3 files and needs QA verification. Level 2 is the right fit.

```bash
# Create the spec folder at Level 2
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh 043-user-profile-update

# Validate it was created correctly
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/
```

Fill `spec.md`, `plan.md`, `tasks.md` and `checklist.md` using the pre-merged templates from `templates/level_2/`.

**Result**: A Level 2 spec folder with QA verification gates, ready for implementation.

### Example 2: Resume Work From a Previous Session

You worked on a feature yesterday and want to pick up where you left off:

```text
/spec_kit:resume
```

The system searches for your most recent context, presents your prior decisions and file changes, and routes you to the right next command. If it finds multiple candidates, it presents alternatives for you to choose from.

**Result**: The AI starts with full knowledge of your prior work, no re-explanation needed.

### Example 3: Save Context at End of Session

After implementing the first phase, save context so the next session can resume:

```bash
# Using the generate-context.js script directly
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"043-user-profile-update","sessionSummary":"Implemented data model and API endpoints. Frontend pending."}' \
  .opencode/specs/[project]/043-user-profile-update/
```

Or use the command:

```text
/memory:save 043-user-profile-update
```

**Result**: A timestamped memory file in `memory/`, indexed and searchable within seconds.

### Example 4: Create a Phase Decomposition

A large feature needs three phases of work across multiple sessions:

```bash
# Create parent spec folder with first phase child
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh \
  022-big-feature --phase

# This creates:
# .opencode/specs/[project]/022-big-feature/         (parent)
# .opencode/specs/[project]/022-big-feature/001-phase/ (first child)
```

Use `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` to create phase structures, track progress across children, validate the entire hierarchy, and keep packet-local changelog history in the parent packet as phases close.

**Result**: A coordinated parent/child folder structure for multi-session work.

### Example 5: Run Validation on a Spec Folder

Before claiming a feature is complete, run validation:

```bash
# Standard validation
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/

# Verbose mode (shows detail behind each rule)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/ --verbose

# Recursive mode (parent + all phase children)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/022-big-feature/ --recursive
```

**Result**: A pass/warn/error report across 20 rules with actionable fix instructions.

### Common Patterns

| Pattern                       | Command / Script                    | When to Use                       |
| ----------------------------- | ----------------------------------- | --------------------------------- |
| New feature, small scope      | `create.sh NNN-name`                | < 100 LOC, single file            |
| New feature, needs QA         | `create.sh NNN-name` + Level 2      | 100-499 LOC                       |
| Architecture change           | `create.sh NNN-name` + Level 3      | 500+ LOC, multiple systems        |
| Multi-phase work              | `create.sh NNN-name --phase`        | Large features, multiple sessions |
| Save session progress         | `/memory:save [folder]`             | Before ending any session         |
| Recover after crash           | `/spec_kit:resume`                  | Session interrupted unexpectedly  |
| Check prior decisions         | `/memory:search "query"`            | Starting a related task           |
| Upgrade documentation level   | `upgrade-level.sh [folder] [level]` | Scope grew beyond original level  |
| Create always-surface rule    | `/memory:learn`                     | Team standards, workflow rules    |
| Share knowledge across agents | `/memory:manage shared`             | Multi-agent or team setups        |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->

## 7. TROUBLESHOOTING

### MCP Tools Return "Tool Not Found"

**What you see**: Calling `memory_match_triggers()` returns an error or the tool is not recognized.

**Common causes**: The MCP server is not running or not registered in your MCP config.

**Fix**:

```bash
# Check the server can start
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js

# If it fails, check Node.js version (requires 18+)
node --version
```

Verify `spec-kit-memory` appears in your `opencode.json` or equivalent MCP config file (see [Configuration](#5-configuration)).

---

### Memory Save Fails or Creates an Empty File

**What you see**: `generate-context.js` runs but the output file is empty or the script exits with an error.

**Common causes**: Invalid JSON input, or TypeScript source not compiled to `dist/`.

**Fix**:

```bash
# Rebuild the scripts
cd .opencode/skill/system-spec-kit && npm run build

# Retry with valid JSON
node scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"NNN-feature","sessionSummary":"Brief summary of what happened"}'
```

---

### Memory Save Rejected by Quality Gate

**What you see**: The save completes but reports the memory was rejected by the semantic sufficiency gate or structure gate.

**Common causes**: The content is too thin (not enough substance) or missing required structure (headings, metadata).

**Fix**: Add more detail to the session summary. Use `dryRun: true` in the `memory_save` tool call to preview gate results without saving. Check the post-save quality review output for specific issues.

---

### Validation Fails With "Missing Required Files"

**What you see**: `validate.sh` reports missing files like `spec.md` or `plan.md`.

**Common causes**: The spec folder was created manually without `create.sh`, or wrong level templates were applied.

**Fix**:

```bash
# Check what files exist
ls -la .opencode/specs/[project]/NNN-feature/

# Get a level recommendation
bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh \
  .opencode/specs/[project]/NNN-feature/

# Upgrade if needed
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/NNN-feature/ [target-level]
```

---

### Memory Search Returns Poor Results

**What you see**: `memory_context()` returns irrelevant results or misses content you know exists.

**Common causes**: The embedding index is stale, or the query is too vague for intent classification.

**Fix**:

```bash
# Force index rebuild (run as MCP tool call)
# memory_index_scan({ specFolder: "NNN-feature" })

# Check database health
# memory_health({ reportMode: "full" })

# Try a more specific query with intent hints
# memory_context({ input: "find_decision: why did we choose JWT?", mode: "deep" })
```

### Quick Fixes

| Problem                          | Fix                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `generate-context.js` not found  | Run `npm run build` in `system-spec-kit/`                                       |
| Spec folder fails validation     | Run `validate.sh --verbose` and read each failing rule                          |
| Memory context seems wrong       | Call `memory_stats({})` to check index counts                                   |
| Session context lost after crash | Use `/spec_kit:resume` to recover from the best available checkpoint or handoff |
| Placeholder check fails          | Run `check-placeholders.sh` and replace all `[PLACEHOLDER]` values              |
| Stale results after save         | Call `memory_index_scan({ specFolder: "..." })` to force re-index               |
| Too many near-duplicate results  | Check that interference penalty is active in feature flags                      |

### Diagnostic Commands

```bash
# Check spec folder completeness
bash .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh \
  .opencode/specs/[project]/NNN-feature/

# Run detailed validation
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/NNN-feature/ --verbose

# Check API boundary (scripts/ vs mcp_server/)
bash .opencode/skill/system-spec-kit/check-api-boundary.sh

# View memory system health
# memory_health({ reportMode: "full" })
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->

## 8. FAQ

**Q: Is System Spec Kit mandatory for every file change?**

A: Yes, for any conversation that modifies files. The only exemption is single-file fixes under 5 characters (typo or whitespace corrections). Gate 3 in AGENTS.md enforces this by asking "Which spec folder?" before any file modification begins.

---

**Q: When do I need Level 2 instead of Level 1?**

A: Level 2 adds a `checklist.md` for QA verification. Use it when the change touches multiple files, needs testing verification or has edge cases worth documenting. The LOC guidance is 100-499, but risk and complexity matter more than line count.

---

**Q: When do I need Level 3?**

A: Level 3 adds a `decision-record.md` for architecture decision records. Use it for changes that affect system architecture, involve trade-offs between alternatives or touch 500+ lines across multiple systems. If you are making decisions that future developers will ask "why?", Level 3 captures the answer.

---

**Q: How do spec folders and memory work together?**

A: Spec folders capture what happened in structured documentation. The memory system makes that documentation searchable across sessions. When a session ends, `generate-context.js` writes a summary to the spec folder's `memory/` directory. The MCP server indexes it. When the next session starts, hook-capable runtimes auto-prime that context, while hookless runtimes should call `session_bootstrap` first and then drop into `memory_context` or `memory_match_triggers` for deeper retrieval. One side captures, the recovery surfaces retrieve.

---

**Q: Can I use memory without spec folders?**

A: The memory system can index any markdown file, beyond spec folder contents. But the spec folder workflow is the primary way context gets saved (via `generate-context.js`), so in practice they work together. You can save standalone memories using `memory_save`, but Gate 3 will still ask about a spec folder for file modifications.

---

**Q: What is the difference between this README and the MCP server README?**

A: This README covers the whole skill: spec folders, documentation levels, commands, templates, scripts and a high-level summary of the memory system. The MCP server README (`mcp_server/README.md`) goes deep on the memory system: the 43-tool API reference, 5-channel hybrid retrieval, code graph and session lifecycle tooling, runtime-resolved rollout behavior, save pipeline, causal graph, query intelligence and evaluation infrastructure. When you need to understand how a specific MCP tool works or how the search pipeline makes decisions, go to the MCP server README.

---

**Q: What is the difference between SKILL.md and this README?**

A: SKILL.md contains instructions for AI agents: when to activate, routing rules, gate procedures, validation workflows and template application procedures. This README is for humans and AI alike: what Spec Kit does, how to use it and where to find things. Think of SKILL.md as the employee handbook and this README as the product brochure.

---

**Q: What is Constitutional Memory?**

A: Constitutional memories are rules that always surface in every retrieval, regardless of recency or score. They carry a 3.0x boost and never decay. Use `/memory:learn` to create them. Typical use cases: team coding standards, mandatory workflow steps, known failure modes. They work like pinned messages in a chat -- always visible, no matter how far you scroll.

---

**Q: How do I upgrade a Level 1 folder to Level 2 after the fact?**

A: Run `upgrade-level.sh` with the target level. It injects the addendum templates into the existing folder. Then run `check-placeholders.sh` to find all new placeholder values that need filling in.

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/NNN-feature/ 2
```

---

**Q: How does shared memory work?**

A: Shared memory adds controlled access boundaries between users or agents. You create a space, grant memberships with roles (owner, editor, viewer) and memories in that space become visible to members. Access is deny-by-default -- nobody gets in unless explicitly granted. A kill switch blocks all reads instantly for emergencies. See [`SHARED_MEMORY_DATABASE.md`](./SHARED_MEMORY_DATABASE.md) for the full guide.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->

## 9. RELATED DOCUMENTS

### Internal Documentation

| Document                                                                                         | Purpose                                                                                              |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [`SKILL.md`](./SKILL.md)                                                                         | AI agent instructions: routing, gates, validation, template application                              |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md)                                                           | API boundary contract between `scripts/` and `mcp_server/`                                           |
| [`mcp_server/README.md`](./mcp_server/README.md)                                                 | Full MCP architecture: 43-tool API reference, search pipeline, graph intelligence, and configuration |
| [`mcp_server/INSTALL_GUIDE.md`](./mcp_server/INSTALL_GUIDE.md)                                   | Step-by-step installation with embedding providers and environment variables                         |
| [`SHARED_MEMORY_DATABASE.md`](./SHARED_MEMORY_DATABASE.md)                                       | Shared memory guide with spaces, roles, kill switch                                                  |
| [`references/memory/memory_system.md`](./references/memory/memory_system.md)                     | Detailed memory system reference                                                                     |
| [`references/validation/validation_rules.md`](./references/validation/validation_rules.md)       | All 20 validation rules with fixes                                                                   |
| [`references/templates/level_specifications.md`](./references/templates/level_specifications.md) | Level definitions and template size guidance                                                         |
| [`references/templates/template_guide.md`](./references/templates/template_guide.md)             | Template usage and composition rules                                                                 |
| [`references/config/environment_variables.md`](./references/config/environment_variables.md)     | Full environment variable reference                                                                  |
| [`references/workflows/rollback_runbook.md`](./references/workflows/rollback_runbook.md)         | Feature-flag rollback and smoke-test procedures                                                      |
| [`feature_catalog/FEATURE_CATALOG.md`](./feature_catalog/FEATURE_CATALOG.md)                     | Complete catalog of 291 features across 22 categories                                                |

### Cross-Skill Alignment

| Skill                                                | Purpose                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| [`sk-doc`](../sk-doc/SKILL.md)                       | Documentation quality standard (DQI scoring, HVR compliance) |
| [`sk-code--opencode`](../sk-code--opencode/SKILL.md) | Code quality standard for OpenCode system code               |
| [`sk-git`](../sk-git/SKILL.md)                       | Git workflow orchestration (worktrees, commits, PRs)         |

### Project-Level References

| Resource                      | Purpose                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `AGENTS.md` (project root)    | Gate definitions, AI behavior framework, mandatory workflow rules            |
| `.opencode/specs/`            | All spec folders created by Spec Kit                                         |
| `.opencode/command/spec_kit/` | Spec Kit command definitions (8 commands)                                    |
| `.opencode/command/memory/`   | Memory command definitions (4 top-level commands plus subcommand namespaces) |

### External Resources

| Resource                                                              | Purpose                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------- |
| [Model Context Protocol](https://modelcontextprotocol.io/)            | MCP specification                                     |
| [FSRS algorithm](https://github.com/open-spaced-repetition/fsrs4anki) | Free Spaced Repetition Scheduler (memory decay model) |
| [sqlite-vec](https://github.com/asg017/sqlite-vec)                    | SQLite vector search extension                        |

<!-- /ANCHOR:related-documents -->

---

_Documentation version: 3.0 | Last updated: 2026-03-25 | Skill version: 3.2.0.0_
