# Skilled Agent Orchestration w/ The Best Custom Spec Kit Framework

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases)

> Multi-agent AI development framework with cognitive memory, structured documentation, 12 agents, 18 skills, 20 commands, 42 MCP tools - built for OpenCode, Codex CLI, Claude Code and Gemini CLI.

**🧠 Persistent Memory** • **📋 Structured Docs** • **🤖 10 Specialized Agents** • **⚡ 4 Runtimes**

<!-- ANCHOR:table-of-contents -->

---

## Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Features](#-features)
  - [Spec Kit Documentation](#-spec-kit-documentation)
  - [Memory Engine](#-memory-engine)
  - [Agent Network](#-agent-network)
  - [Command Architecture](#-command-architecture)
  - [Skills Library](#-skills-library)
  - [Code Mode MCP](#-code-mode-mcp)
- [Configuration](#%EF%B8%8F-configuration)
- [FAQ](#-faq)
- [Related Documents](#-related-documents)

<!-- /ANCHOR:table-of-contents -->


<!-- ANCHOR:overview -->

---

## 🔍 Overview

### What This Framework Does

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Every decision, every trade-off, every carefully reasoned choice - lost the moment the conversation window closes. This framework fixes that.

OpenCode is a multi-agent AI development framework built on top of the [OpenCode](https://github.com/sst/opencode) platform. It gives your AI assistant a filing cabinet, long-term memory and a team of specialists - instead of one forgetful generalist starting from scratch every session.

The framework adds three layers on top of the base platform:

1. **Structured documentation** (Spec Kit) - every file change gets a spec folder recording what changed, why and how. Like a lab notebook for software.
2. **Cognitive memory** (MCP server) - a local-first memory engine storing decisions, context and project history in a searchable database. Like a personal librarian who remembers every conversation.
3. **Coordinated agents** -12 specialized agents routed by a gate system that loads the right skills at the right time. Like a team where the project manager delegates to the right specialist.

**Who it is for:** Developers using AI assistants who are tired of re-explaining context every session and watching decisions disappear into chat history.


### At a Glance

| | |
|---|---|
| **🤖 10 Agents** | 10 custom specialists, multi-runtime |
| **🎯 18 Skills** | Code, docs, git, prompts, MCP, research, cross-AI |
| **⌨️ 20 Commands** | 8 spec_kit + 4 memory + 7 create + 1 utility |
| **🔧 42 MCP Tools** | 33 memory + 7 code mode + 1 semantic search + 1 sequential thinking |
| **🔒 3 Gates** | Understanding, Skill Routing, Spec Folder |
| **⚡ 4 Runtimes** | OpenCode, Codex CLI, Claude Code, Gemini CLI |
| **📄 81 Templates** | CORE + ADDENDUM v2.2 |
| **📦 255 Features** | Across 21 categories |


### How It All Connects

```
                         YOUR REQUEST
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │       GATE SYSTEM (3 mandatory gates)    │
         │                                          │
         │  Gate 1: Context     Gate 2: Skills      │
         │  Surface relevant    Auto-load the right │
         │  prior memory        domain expertise    │
         │                                          │
         │  Gate 3: Spec Folder (HARD BLOCK)        │
         │  Every file change needs documentation    │
         └──────────────────────┬───────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         ┌───────────────┐          ┌──────────────────┐
         │ AGENT NETWORK │          │  SKILLS LIBRARY  │
         │ 12 specialized│          │ 18 domain skills │
         │ agents with   │◄────────►│ auto-loaded by   │
         │ routing logic │          │ task keywords    │
         └───────┬───────┘          └────────┬─────────┘
                 │                           │
                 ▼                           ▼
         ┌──────────────────────────────────────────┐
         │       MEMORY ENGINE (42 MCP tools)       │
         │  5-channel hybrid: Vector, BM25, FTS5,   │
         │  Causal Graph, Degree                    │
         │  FSRS decay ─ RRF fusion ─ query intel   │
         │  PE gating ─ constitutional tiers        │
         │  Voyage │ OpenAI │ HuggingFace Local     │
         └──────────────────────┬───────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │     SPEC KIT (documentation framework)   │
         │  specs/###-feature/ ─ memory/ ─ scratch/ │
         │  4 levels ─ 81 templates ─ 20 rules      │
         └──────────────────────────────────────────┘
```

<!-- /ANCHOR:overview -->


<!-- ANCHOR:quick-start -->

---

## 🚀 Quick Start

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git
cd opencode--spec-kit-skilled-agent-orchestration

# 2. Install dependencies
npm install

# 3. Build the memory server scripts
cd .opencode/skill/system-spec-kit/mcp_server && npm install && npm run build
cd ../../../../

# 4. Build the CLI scripts
cd .opencode/skill/system-spec-kit/scripts && npm install && npm run build
cd ../../../../
```

### Set Up Embedding Provider

Choose an embedding provider:

```bash
# Option A: Voyage AI (recommended - best quality)
export VOYAGE_API_KEY="your-key-here"

# Option B: OpenAI embeddings
export OPENAI_API_KEY="your-key-here"

# Option C: HuggingFace Local (free, no API key needed)
# No setup required - auto-detected when no API keys are set
```

### Verify Installation

```bash
# Check that the memory server builds correctly
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js --help

# Expected: help output with available options
```

### First Use

Open OpenCode in your project directory. The framework is active. Try:

```
/spec_kit:complete Build a user authentication system
```

This creates a spec folder, runs research, builds a plan and begins implementation - all with memory saved automatically. When you come back tomorrow, the memory engine remembers everything.

<!-- /ANCHOR:quick-start -->


<!-- ANCHOR:features -->

---

## 🧩 Features

---

### 📋 Spec Kit Documentation

The Spec Kit enforces structured spec folders for every file-modifying conversation. Gate 3 requires a spec folder answer before any file modification begins (only typo/whitespace fixes under 5 characters are exempt).


#### Documentation Levels

Documentation depth scales with task complexity.

| Level | LOC Guidance | Required Files | When to Use |
|-------|-------------|----------------|-------------|
| **1** | < 100 | spec.md, plan.md, tasks.md, implementation-summary.md | Small features, bug fixes, single-file changes |
| **2** | 100 - 499 | Level 1 + checklist.md | Features needing QA verification, multi-file changes |
| **3** | 500+ | Level 2 + decision-record.md | Architecture changes, complex refactors |
| **3+** | Complexity 80+ | Level 3 + governance extensions | Multi-agent work, enterprise sign-offs |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**Implementation-summary.md** is required at all levels but created **after** implementation completes, not at spec folder creation time.


#### Spec Folder Structure

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and memory tracking metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── checklist.md                 # QA validation gates (Level 2+)
├── decision-record.md           # Architecture decisions (Level 3+)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── memory/                      # Session context files (via generate-context.js)
│   └── YY-MM-DD_HH-MM__topic.md
└── scratch/                     # Temporary workspace files (gitignored)
```

#### Checklist Priority System (Level 2+)

Checklists use a priority system so reviewers know what blocks shipping and what can wait:

- **P0** - Hard blocker. Cannot ship without this. Cannot defer.
- **P1** - Required. Must complete or get explicit user approval to defer.
- **P2** - Optional. Nice to have. Can defer without approval.


#### Phase Decomposition

Phase decomposition splits large features into a parent spec folder (overall specification) and child folders (one per phase).

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

- **Exit 0** - All rules pass. Ready to proceed.
- **Exit 1** - Warnings found. Review and fix if practical.
- **Exit 2** - Errors found. Must fix before claiming completion.

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders.


#### Scripts and Validation

**Spec Management Scripts** (12 in `scripts/spec/`):

- **`create.sh`** - Create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** - Run 20 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** - Inject addendum templates to upgrade a folder to a higher level
- **`recommend-level.sh`** - Analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** - Calculate spec folder completeness as a percentage
- **`check-completion.sh`** - Verify all completion criteria are met
- **`check-placeholders.sh`** - Find remaining `[PLACEHOLDER]` values after level upgrade

**Memory Scripts** (10 in `scripts/memory/`):

- **`generate-context.ts`** - Primary workflow for saving session context to memory files
- **`backfill-frontmatter.ts`** - Add missing frontmatter to existing memory files
- **`reindex-embeddings.ts`** - Rebuild embedding vectors for stored memories
- **`cleanup-orphaned-vectors.ts`** - Remove vector entries with no matching memory
- **`rebuild-auto-entities.ts`** - Regenerate auto-extracted entity catalog
- **`validate-memory-quality.ts`** - Run quality checks on stored memory content

TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.


#### Gate System

3 mandatory gates run before any file change. Every request passes through the same sequence.

```
  User message arrives
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 1: Understanding (SOFT BLOCK)         │
  │  memory_match_triggers() surfaces context   │
  │  Classify intent: Research / Implementation │
  │  confidence >= 0.70, uncertainty <= 0.35    │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 2: Skill Routing (REQUIRED)           │
  │  skill_advisor.py recommends skill          │
  │  confidence >= 0.8 ─► MUST load skill       │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 3: Spec Folder (HARD BLOCK)           │
  │  Only if file modification detected         │
  │  A) Existing  B) New  C) Update             │
  │  D) Skip      E) Phase folder               │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
              EXECUTION
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Post-Rules                                 │
  │  Memory Save ─ must use generate-context.js │
  │  Completion ─ verify checklist.md items      │
  └─────────────────────────────────────────────┘
```

**Analysis Lenses** - applied silently on every request:
- **CLARITY** - Is this the simplest solution? Are abstractions earned?
- **SYSTEMS** - What does this touch? What are the side effects?
- **BIAS** - Is the user solving a symptom? Is the framing correct?
- **SUSTAINABILITY** - Will future developers understand this?
- **VALUE** - Does this change behavior or just refactor?
- **SCOPE** - Does solution complexity match problem size?

For the full spec folder workflow, template architecture (81 templates), gate definitions and anti-pattern detection rules, see the [→ Spec Kit README](.opencode/skill/system-spec-kit/README.md) and [→ AGENTS.md](AGENTS.md).


---

### 🧠 Memory Engine

The Memory Engine is a local-first cognitive memory system built as an MCP server. Memory files are created via `generate-context.js` and stored in spec folders. The MCP server indexes them with vector embeddings, BM25 and FTS5 full-text search. When you start a session, `memory_match_triggers()` surfaces relevant prior context automatically.

The memory engine uses a 222-feature pipeline. The full 33-tool API reference is in the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).


#### 33 Tools Across 7 Layers

The MCP tools are organized into a layered architecture. Each layer has a token budget that controls how much context it consumes:

| Layer | Name | Tools | Token Budget | Purpose |
|-------|------|-------|-------------|---------|
| **L1** | Orchestration | 1 | 2,000 | `memory_context` - unified entry point for all retrieval |
| **L2** | Core | 4 | 1,500 | Search, quick search, trigger matching, save |
| **L3** | Discovery | 3 | 800 | List, stats, health checks |
| **L4** | Mutation | 4 | 500 | Delete, update, validate, bulk delete |
| **L5** | Lifecycle | 8 | 600 | Checkpoints, shared spaces, enable/status |
| **L6** | Analysis | 8 | 1,200 | Causal graph, epistemic baselines, ablation, dashboard |
| **L7** | Maintenance | 5 | 1,000 | Index scan, learning history, async ingestion (start/status/cancel) |
| | **Total** | **33** | **7,600** | |

Lower layers load only when needed. L1 is always available. L2 loads for any search. L3-L7 load based on the specific command being used.


#### HYBRID SEARCH

Every search checks five channels at once:

- **Vector** - Semantic similarity via embeddings. Finds related content when words differ.
- **FTS5** - Full-text search on exact words and phrases.
- **BM25** - Keyword relevance scoring.
- **Causal Graph** - Follows cause-and-effect links between memories.
- **Degree** - Scores by graph connectivity, weighted by edge type.

**Reciprocal Rank Fusion (RRF)** combines results across channels so memories scoring well in multiple channels rise to the top. The system automatically escalates from vector-only to all 5 channels when confidence is low, truncates weak results, and ensures every active channel is represented.


#### SEARCH PIPELINE

Every search passes through 4 stages:

- **Gather** - Parallel retrieval from active channels. Constitutional-tier memories always inject.
- **Score** - RRF fusion with 8 post-fusion signals (co-activation, FSRS decay, interference penalties, intent-specific weights).
- **Rerank** - Local cross-encoder model via node-llama-cpp. Gracefully skips without VRAM.
- **Filter** - Confidence labels, state filtering, score immutability.


#### QUERY INTELLIGENCE

- **Complexity routing** - Simple (2 channels), moderate (4), complex (all 5)
- **Intent classification** - 7 types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`), each with its own channel weight profile
- **Query decomposition** - Multi-topic queries split into sub-queries, expanded with related terms
- **Context pressure** - Downgrades search mode at 60% and 80% window usage
- **Fallback strategies** - LLM reformulation or HyDE for low-confidence searches

Four response modes: **quick** (top answer only), **focused** (one-topic), **deep** (full evidence trails), **resume** (state summary + next-steps).


#### MEMORY LIFECYCLE AND SCORING

Memories fade using **FSRS** (Free Spaced Repetition Scheduler). Decay speed varies by content type and importance tier - critical decisions never fade; temporary debugging notes fade within days.

- **Cold-start boost** - Fresh memories (under 48h) get temporary scoring lift
- **Interference penalty** - Suppresses near-duplicate clusters
- **Auto-promotion** - Memories earn higher tiers through positive validation
- **Negative feedback** - 30-day decay prevents permanent blacklisting

Five cognitive states: **HOT** >> **WARM** >> **COLD** >> **DORMANT** >> **ARCHIVED**


#### CAUSAL GRAPH


Six relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`

- **Typed traversal** - Prioritizes connection types based on query intent
- **Community detection** - Louvain clustering with neighbor boosting
- **Co-activation spreading** - Fan-effect dampening prevents hub bias
- **Temporal contiguity** - Same-session grouping
- **Graph momentum** - Trending knowledge surfaces higher
- **LLM backfill** - Background discovery of missed causal links


#### SAVE INTELLIGENCE

When you save new knowledge, **Prediction Error gating** compares it against existing memories and picks one of four outcomes:

- **CREATE** - No similar memory exists. Stored as new knowledge.
- **REINFORCE** - Similar exists, new one adds value. Both kept, old one boosted.
- **UPDATE** - Similar exists, new one is better. Old version replaced.
- **SUPERSEDE** - New knowledge contradicts the old. Old one demoted to deprecated.

Additional save-time processing:

- **Semantic sufficiency gating** - Rejects content too thin to be useful
- **Verify-fix-verify** - Auto-fixes quality issues before storing
- **Content normalization** - Strips formatting clutter for cleaner embeddings
- **Auto-entity extraction** - Spots tool/project/concept names for cross-linking
- **SHA-256 deduplication** - Skips unchanged files instantly
- **Correction tracking** - Records how knowledge evolves across versions


#### SESSION AWARENESS

- **Working memory** - Tracks current session findings with attention decay
- **Session deduplication** - Suppresses already-seen results in follow-up queries
- **Context pressure** - Downgrades search mode as the context window fills


#### SHARED MEMORY

By default, every memory is private. Shared memory adds controlled access for multiple people or agents:

- **Spaces** - named containers for shared knowledge
- **Roles** -`owner` (full control), `editor` (read/write), `viewer` (read-only)
- **Deny-by-default** - nobody gets access unless explicitly granted
- **Kill switch** - immediately blocks all access for emergencies

For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md).


#### QUALITY GATES AND LEARNING

Three layered checks before storage:

- **Structure gate** - Format, headings, metadata validation
- **Semantic sufficiency** - Enough real content to be useful
- **Duplicate detection** - Triggers Prediction Error arbitration if similar content exists

Preview all checks without saving using `dryRun: true`. Learned relevance feedback boosts helpful results with safeguards against noise. Two-tier explainability shows plain-language reasons or exact channel contributions.


#### RETRIEVAL ENHANCEMENTS

- **Constitutional injection** - Always-surfaced rules appear without asking
- **Hierarchy awareness** - Searches parent and sibling spec folders
- **Entity linking** - Connects memories referencing the same concepts
- **ANCHOR retrieval** - Per-section indexing (~93% token savings)
- **Auto-surfacing** - Triggers on tool use and context compression events
- **Provenance traces** - Shows exactly how each result was found


#### INDEXING AND INFRASTRUCTURE

- **Real-time watching** - Filesystem monitoring via chokidar
- **Incremental indexing** - Content hashes skip unchanged files
- **Embedding retry** - Background worker retries failed embeddings
- **Lexical fallback** - Text-searchable when embedding services are down
- **Atomic writes** - Crash-safe with pending-file recovery on startup


#### EVALUATION INFRASTRUCTURE

- **12-metric computation** - MRR, NDCG, MAP and more
- **Ground truth corpus** - 110 test questions with known correct answers
- **Ablation studies** - Per-channel quality impact measurement
- **Shadow scoring** - Test ranking changes before deployment


#### Embedding Providers

- **Voyage AI** - Set `VOYAGE_API_KEY` env var. Best quality, recommended.
- **OpenAI** - Set `OPENAI_API_KEY` env var. Strong alternative.
- **HuggingFace Local** - No setup needed. Free, auto-detected fallback.

For the full 222-feature pipeline, per-signal weights, FSRS formula, algorithm parameters and 33-tool API reference, see the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).


---

### 🤖 Agent Network

10 custom specialist agents. Defined in `.opencode/agent/` (source of truth), adapted per runtime.

**Orchestrate**
- Senior task commander with full authority over decomposition, delegation and quality evaluation
- Merges sub-agent outputs into one unified response with conflict resolution
- Read-only permissions - delegates implementation to other agents
- Single-hop delegation only (depth 2 max) to prevent runaway chains

**Context**
- Memory-first retrieval specialist - always checks memory before codebase
- Search order: `match_triggers` → `memory_context` → `memory_search` → grep/glob
- Returns structured Context Packages combining memory findings with codebase evidence
- Uses both CocoIndex semantic search and the 5-channel memory system. Read-only.

**Speckit**
- The ONLY agent permitted to write `*.md` files inside spec folders
- Template-first: copies from `templates/level_N/` - never creates from scratch
- Supports Level 1-3+ documentation with CORE + ADDENDUM architecture and 20-rule validation
- Exceptions: `memory/` (via generate-context.js), `scratch/` (any agent), `handover.md`, `research.md`

**Debug**
- Fresh-perspective debugger that receives structured context handoff (not conversation history)
- Avoids inherited bias from failed prior attempts - use after 3+ failed debugging tries
- Systematic 5-phase methodology: Observe → Analyze → Hypothesize → Validate → Fix
- Writes `debug-delegation.md` with root cause analysis and findings

**Deep-Research**
- Autonomous research agent executing single LEAF (Loop, Externalize, Analyze, Finish) iterations
- State externalized via JSONL + strategy.md for pause/resume across sessions
- Loop orchestration managed by `/spec_kit:deep-research` command, not this agent
- Has permission to write `research.md` and `scratch/` inside spec folders

**Deep-Review**
- Autonomous code quality auditor using LEAF architecture for single review iterations
- Reviews code but NEVER modifies target files (read-only on code)
- Produces P0/P1/P2 severity-ranked findings with `file:line` evidence across 7 review dimensions
- Includes adversarial self-check on all findings before finalizing

**Review**
- Code quality guardian with strict read-only permissions (cannot write or edit any file)
- Loads `sk-code--review` baseline first, then one `sk-code--*` overlay matching the detected stack
- Security and correctness minimums are mandatory and never relaxed by the overlay
- Produces findings-first severity analysis with quality scoring and pattern validation

**Write**
- Documentation generation specialist for project-level docs outside spec folders
- Template-first: MUST load template before proceeding (hard gate)
- Runs `extract_structure.py` and `validate_document.py` for DQI quality scoring
- Handles READMEs, install guides, skills, agents, commands. Cannot write inside `specs/` directories.

**Handover**
- Session continuation specialist for context preservation across conversations
- Always gathers context from spec folder files before creating the handover
- Produces 5-section format: key decisions, blockers, current phase, continuation instructions, next steps
- Has special permission to write `handover.md` inside spec folders

**Ultra-Think**
- Multi-strategy planning architect dispatching diverse thinking strategies
- Uses 5 reasoning lenses: Analytical, Creative, Critical, Pragmatic, and Holistic
- Scores results via a 5-dimension rubric - each strategy uses a different lens and temperature
- Plans only - never modifies files directly

#### RUNTIME

- **OpenCode** - `.opencode/agent/` (source of truth)
- **Claude Code** - `.claude/agents/`
- **Codex CLI** - `.codex/agents/`
- **Gemini CLI** - `.gemini/agents/`


---

### ⌨️ Command Architecture


20 commands across 4 namespaces. Each command is a Markdown entry point under `.opencode/command/**/*.md` backed by a behavioral execution spec.

#### SPEC KIT

**complete**
- End-to-end workflow: research → plan → implement → verify → save memory
- The primary entry point for new features - creates spec folder and runs everything
- Modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:with-research` (adds deep research), `:auto-debug` (auto-delegates failures)

**plan**
- Planning-only workflow that creates spec.md, plan.md and tasks.md without implementing
- Dispatches up to 4 parallel context agents for codebase exploration during planning
- Use when you need stakeholder review before coding. Modes: `:auto`, `:confirm`

**implement**
- Executes an existing plan - requires plan.md to already exist
- 9-step workflow covering task breakdown, implementation, testing and verification
- Modes: `:auto`, `:confirm`

**phase**
- Decomposes large features into parent and child spec folders
- Creates parent with `create.sh --phase`, populates phase metadata
- Sets up parent/child navigation links for multi-phase work

**Debug**
- Delegates debugging to the debug agent with structured context handoff (not conversation history)
- Fresh-perspective approach avoids confirmation bias from failed prior attempts
- Writes `debug-delegation.md` with root cause analysis

**resume**
- Continues a previous session by auto-loading memory from the spec folder
- Presents session summary, shows progress against tasks.md
- Works after crashes, compactions, or new sessions

**Deep-Research**
- Autonomous research loop dispatching deep-research agents iteratively until convergence
- Externalized JSONL state enables pause/resume across sessions
- Modes: `:auto` (research), `:review` (code quality audit via deep-review)

**Handover**
- Creates session handover document for continuing work in a new conversation
- Gathers key decisions, blockers, current phase and next steps from spec folder state
- Variants: `:quick` (summary) or `:full` (comprehensive)

#### MEMORY

**save**
- Saves current session context to a timestamped memory file via `generate-context.js`
- AI composes structured JSON with session summary, key decisions and findings
- Indexes immediately for future retrieval via `memory_save()` or `memory_index_scan()`

**search**
- Unified retrieval and analysis entry point with intent-aware routing
- Supports epistemic baselines, causal graph traversal, ablation studies, and dashboards
- Routes by intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`

**learn**
- Constitutional memory manager for always-surface rules
- Constitutional memories carry a 3.0x boost and never decay
- Lifecycle operations: create, list, edit, remove, budget

**manage**
- Database admin: stats (memory counts, index health), health checks, cleanup (orphaned vectors)
- Checkpoint management: create, list, restore, delete
- Bulk operations, ingestion (start/status/cancel), and shared-memory lifecycle

#### CREATE

**sk-skill**
- Unified skill creation and update workflow
- Creates SKILL.md with 8-section structure, README.md, references and assets directories
- Registers in skill catalog. Modes: `:auto`, `:confirm`

**agent**
- Scaffolds a new agent definition with proper frontmatter, behavioral rules and tool permissions
- Creates source-of-truth file in `.opencode/agent/` and mirrors for Claude, Codex, Gemini runtimes
- Modes: `:auto`, `:confirm`

**folder_readme**
- Unified README and install guide creation using sk-doc quality standards
- Auto-detects folder type, loads appropriate template, validates via DQI scoring
- Structure 40%, Content 35%, Style 25%. Modes: `:auto`, `:confirm`

**changelog**
- Auto-detects recent work from spec folder artifacts or git history
- Resolves correct component folder, calculates next version number
- Generates formatted changelog file matching 370+ existing entries. Modes: `:auto`, `:confirm`

**prompt**
- Creates or improves AI prompts using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Applies DEPTH thinking methodology (3-10 iteration rounds)
- CLEAR quality scoring with 40+/50 pass threshold. 5 output formats.

**feature-catalog**
- Creates or updates feature catalog packages with category routing
- Generates both technical reference entries and simple-terms companion entries
- Validates against the 255-entry catalog structure across 21 categories

**testing-playbook**
- Creates or updates manual testing playbook packages
- Generates scenario files with test steps, expected results and verification evidence fields
- Validates against established playbook format

#### UTILITY

**agent_router**
- Routes requests to external AI systems (Gemini CLI, Codex CLI, Claude Code, Copilot CLI)
- The receiving AI operates under its own system prompt - full identity adoption
- Use for cross-AI delegation where the target AI needs to behave as itself


---

### 🎯 Skills Library

18 skills in `.opencode/skill/`, loaded on demand when Gate 2 matches a task (confidence >= 0.8 means the skill must be loaded).

#### DOCUMENTATION

**system-spec-kit**
- Mandatory orchestrator for all file modifications - activates automatically for any code file change
- Creates numbered spec folders with CORE + ADDENDUM template architecture across 4 levels (1-3+)
- Integrates the 33-tool memory system with constitutional-tier support, FSRS decay and hybrid 5-channel retrieval
- Manages 81 templates, 20 validation rules, 22 scripts, and 255 feature catalog entries across 21 categories

**sk-doc**
- Unified markdown specialist with DQI quality scoring (Structure 40%, Content 35%, Style 25%)
- HVR v0.210 compliance checking and component creation workflows (skills, agents, commands)
- Handles README templates, frontmatter validation, feature catalog authoring, install guide generation

#### CODE WORKFLOW

**sk-code--full-stack**
- Stack-agnostic development orchestrator with automatic stack detection via marker files
- Detects 7 stacks: Go, Swift, React Native/Expo, Next.js, React, Node.js, and default
- 3 mandatory phases: implementation → testing/debugging → verification

**sk-code--opencode**
- Multi-language standards for OpenCode system code across 5 languages
- JavaScript (CommonJS), TypeScript (strict), Python (snake_case), Shell (set -euo pipefail), JSON/JSONC
- Evidence-based patterns extracted from the actual codebase with `file:line` citations

**sk-code--web**
- Frontend development orchestrator with 5-phase lifecycle
- Enforces mandatory browser testing before any completion claims with DevTools integration
- Targets PageSpeed, Lighthouse, TBT and INP metrics. Includes Webflow integration.

**sk-code--review**
- Stack-agnostic code review baseline implementing the baseline + overlay model
- Baseline always runs first: security checklist, correctness checklist, SOLID checklist, threat model
- Security and correctness minimums are mandatory and NEVER relaxed by the overlay. P0/P1/P2 findings.

#### MCP INTEGRATION

**mcp-code-mode**
- MCP orchestration engine providing access to 200+ external tools through a single TypeScript interface
- Reduces context overhead by 98.7% (1.6k tokens vs 141k for 47 tools loaded individually)
- Progressive tool loading - zero upfront cost, tools load on first use. Type-safe with autocomplete.

**mcp-coco-index**
- Semantic code search via vector embeddings (Voyage Code 3 and All-MiniLM-L6-v2 models)
- Natural-language discovery of code patterns and implementations across 28+ languages
- Two access modes: CLI (`ccc`) for direct terminal use, MCP server for AI agent integration

**mcp-figma**
- 18 Figma tools across 6 categories: file access, asset export, design system extraction
- Design tokens (colors, typography, effects), collaboration (comments), team management
- Two setup options: Official Figma MCP (HTTP, OAuth) or Framelink (stdio, local)

**mcp-chrome-devtools**
- Chrome DevTools orchestrator with intelligent 2-mode routing
- CLI mode (`bdg`) prioritized for speed - runs in terminal, supports Unix pipes, composable in CI/CD
- MCP mode as fallback for multi-tool integration scenarios

**mcp-clickup**
- ClickUp project management orchestrator with 2-mode routing
- CLI (`cu`) handles basic operations (tasks, sprints, standups) for speed
- MCP handles enterprise features: docs, goals, webhooks, bulk operations, time tracking

#### CROSS-AI CLI

**cli-gemini**
- Gemini CLI orchestrator enabling cross-AI delegation from Claude Code, Codex, or Copilot
- Real-time web search via Google Search grounding (no other CLI skill has this)
- Deep codebase architecture analysis leveraging 1M+ token context. Single model: `gemini-3.1-pro-preview`

**cli-codex**
- OpenAI Codex CLI orchestrator with dual model support (`gpt-5.4` + `gpt-5.3-codex`)
- `/review` command with diff-aware code review, `--search` for web browsing, `--image` for screenshot analysis
- Session management (resume/fork), agent profiles, cost control via `--max-budget-usd`

**cli-claude-code**
- Claude Code CLI orchestrator with 3 models (Opus 4.6, Sonnet 4.6, Haiku 4.5)
- Extended thinking with chain-of-thought, surgical diff-based code editing
- JSON schema-validated structured output, 9 built-in agents, session continuity

**cli-copilot**
- GitHub Copilot CLI orchestrator with 5 models across 3 providers
- Explore/Task agents for architecture mapping, `/delegate` for cloud-hosted coding agents
- Autopilot autonomous execution mode, MCP server integration, native GitHub ecosystem perspective

#### OTHER

**sk-deep-research**
- Dual-mode autonomous investigation system with iterative LEAF cycles
- Research mode: fresh context per iteration, externalized JSONL state, convergence detection
- Review mode: automated code quality auditing dispatching deep-review agents with P0/P1/P2 findings

**sk-git**
- Git workflow orchestrator coordinating 3 sub-skills
- **git-worktree**: workspace isolation, branch creation, parallel development
- **git-commit**: conventional commit format, staged change analysis, scope detection
- **git-finish**: PR creation via `gh pr create`, branch cleanup, integration workflows

**sk-prompt-improver**
- Prompt engineering specialist auto-selecting from 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- DEPTH thinking methodology with 3-10 iteration rounds of progressive refinement
- CLEAR quality scoring: Clarity, Logic, Expression, Reliability (40+/50 pass threshold)


---

### 🔌 Code Mode MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Instead of loading 47 tool definitions into context (141k tokens), Code Mode loads them on demand through one interface (1.6k tokens) - a 98.7% reduction.


#### Native MCP Servers

Defined in `opencode.json`:

| Server | Tools | Purpose |
|--------|-------|---------|
| `spec_kit_memory` | 33 | Cognitive memory system - the memory engine |
| `code_mode` | 7 | External tool orchestration via TypeScript execution |
| `cocoindex_code` | 1 | Semantic code search via vector embeddings |
| `sequential_thinking` | 1 | Structured multi-step reasoning for complex problems |
| **Total** | **42** | |

#### Code Mode Tools (7)

- **`search_tools`** - Discover relevant tools by task description
- **`tool_info`** - Get complete tool parameters and TypeScript interface
- **`call_tool_chain`** - Execute TypeScript code with access to all registered tools
- **`list_tools`** - List all currently registered tool names
- **`register_manual`** - Register a new tool provider
- **`deregister_manual`** - Remove a tool provider
- **`get_required_keys_for_tool`** - Check required environment variables for a tool

#### External Integrations (via `.utcp_config.json`)

- **`chrome_devtools_1`** (MCP/stdio) - Browser automation (instance 1). No env var needed.
- **`chrome_devtools_2`** (MCP/stdio) - Browser automation (instance 2). No env var needed.
- **`clickup`** (MCP/stdio) - Task management, goals, docs. Requires `CLICKUP_API_KEY`.
- **`figma`** (MCP/stdio) - Design files, components, exports. Requires `FIGMA_API_KEY`.
- **`github`** (MCP/stdio) - Issues, pull requests, commits. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **`webflow`** (MCP/remote) - Sites, CMS collections. Requires Webflow auth.


#### Performance

| Metric | Without Code Mode | With Code Mode |
|--------|-------------------|----------------|
| Context tokens | 141k (47 tools loaded) | 1.6k (on-demand) |
| Round trips | 15+ for chained operations | 1 (TypeScript chain) |
| Type safety | None | Full TypeScript |
| Context reduction | -| 98.7% |

To call a Code Mode tool: `call_tool_chain({ typescript: "const result = await figma.figma_get_file({fileKey: 'abc123'}); return result;" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.opencode/skill/mcp-code-mode/SKILL.md`.

<!-- /ANCHOR:features -->


<!-- ANCHOR:configuration -->

---

## ⚙️ Configuration

### Core Configuration Files

- **`CLAUDE.md`** - Gate definitions, behavior rules, coding anti-patterns. Used by Claude Code (primary runtime).
- **`AGENTS.md`** - Agent routing, capability reference, gate documentation. Used by all runtimes.
- **`opencode.json`** - MCP server bindings (4 servers), model configuration. Used by OpenCode platform.
- **`.utcp_config.json`** - Code Mode external tool registrations. Used by `mcp-code-mode` skill.
- **`.claude/mcp.json`** - Claude Code MCP configuration. Claude Code only.
- **`.gemini/settings.json`** - Gemini CLI configuration. Gemini CLI only.

### Memory Engine Configuration

The memory server reads configuration from environment variables:

- **`VOYAGE_API_KEY`** (optional) - Voyage AI embeddings (recommended)
- **`OPENAI_API_KEY`** (optional) - OpenAI embeddings (alternative)
- **`MEMORY_DB_PATH`** (optional) - Override default database path

Default database path: `.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`

> [!TIP]
> If no API key is set, the memory engine auto-detects **HuggingFace Local** embeddings - free, no setup required.

### Memory Feature Flags

26+ feature flags control search channels, scoring signals and infrastructure components. All default to sensible values.

- **Search Pipeline** - BM25, Graph channel, Reranker, MMR, Co-Activation, FSRS decay, Interference penalty. All enabled by default.
- **Session/Cache** - Working memory, TTL cache, Session deduplication. All enabled by default.
- **Memory/Storage** - Auto-promotion, Negative feedback, Content normalization. All enabled by default.
- **Embedding/API** - Voyage AI, OpenAI, HuggingFace Local (auto-detected). Provider-dependent.
- **Debug** - Trace mode, Scoring observability, Shadow evaluation. All disabled by default.

For the complete flag reference with per-flag defaults, see [MCP Server README Section 5](.opencode/skill/system-spec-kit/mcp_server/README.md#5-configuration).

### Database Schema

The memory system uses a SQLite database with 25 tables:

- **Core** (3) - `memories`, `embeddings`, `memory_sections`
- **Search** (3) - `fts_memories`, `bm25_index`, `search_cache`
- **Graph** (3) - `causal_edges`, `communities`, `co_activations`
- **Lifecycle** (3) - `memory_states`, `validation_feedback`, `promotions`
- **Session** (2) - `working_memory`, `session_events`
- **Shared** (3) - `shared_spaces`, `memberships`, `kill_switches`
- **Evaluation** (3) - `eval_runs`, `ablation_results`, `ground_truth`

### opencode.json Structure

```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"]
    },
    "code_mode": {
      "type": "local",
      "command": "npx",
      "args": ["ts-node", ".opencode/skill/mcp-code-mode/server.ts"]
    },
    "cocoindex_code": {
      "type": "local",
      "command": "ccc",
      "args": ["mcp"]
    },
    "sequential_thinking": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

<!-- /ANCHOR:configuration -->


<!-- /ANCHOR:usage-examples -->


<!-- ANCHOR:faq -->

---

## ❓ FAQ

**Q: Do I need all 18 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core skills -`system-spec-kit` and `sk-doc` - cover most documentation workflows. The MCP and cross-AI CLI skills require additional API keys or tools.

---

**Q: Is this only for OpenCode, or does it work with other runtimes?**

A: It works with OpenCode, Codex CLI, Claude Code and Gemini CLI. Agent definitions are mirrored across all four runtime directories. Each runtime has its own adapter files that translate the source-of-truth definitions into the format that runtime expects.

---

**Q: What happens if I do not use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable via memory search. For trivial changes under 5 characters in a single file, Gate 3 does not trigger.

---

**Q: How does the memory system know what is relevant to my current task?**

A: Memory files have YAML frontmatter with tags and trigger phrases. When you start a session, `memory_match_triggers()` runs a 5-channel hybrid search and returns the top matches, classified by intent and fused with RRF.

---

**Q: Can I use this framework without the cognitive memory features?**

A: Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works independently of the memory MCP server. You will not have cross-session memory retrieval, but you will still get structured documentation, agent routing and skill loading.

---

**Q: How do I add a new skill to the framework?**

A: Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Then register the skill in `.opencode/skill/README.md`.

---

**Q: What does "local-first" mean for the memory system?**

A: The memory database is a SQLite file on your local machine. No session data, code or context is sent to any external service unless you configure a cloud embedding provider (Voyage AI or OpenAI). HuggingFace Local embeddings run entirely on-device.

---

**Q: How do I contribute a new agent definition?**

A: Define the agent in `.opencode/agent/` (the source of truth), then copy the adapter to `.claude/agents/`, `.codex/agents/` and `.gemini/agents/`. Use `/create:agent` to scaffold the file from the agent template.

---

**Q: How many MCP tools are there and where are they defined?**

A: 42 total across 4 native MCP servers: 33 memory tools (spec_kit_memory), 7 code mode tools, 1 semantic code search tool (cocoindex_code) and 1 sequential thinking tool. All server bindings are defined in `opencode.json`. The 33 memory tool definitions live in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`.

---

**Q: What is the feature catalog?**

A: The feature catalog is a 255-entry reference across 21 categories documenting every capability of the memory system. It comes in two versions: a technical reference and a simple-terms companion with plain-language explanations. Both are in `.opencode/skill/system-spec-kit/feature_catalog/`.

<!-- /ANCHOR:faq -->


<!-- ANCHOR:related-documents -->

---

## 📚 Related Documents

**Internal Documentation:**

- **[→ AGENTS.md](AGENTS.md)** - Agent routing, gate definitions, behavior rules
- **[→ Spec Kit README](.opencode/skill/system-spec-kit/README.md)** - Spec folder workflow, 81 templates, validation rules
- **[→ MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md)** - Memory API reference (33 tools, 7 layers)
- **[→ Install Guide](.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md)** - MCP server setup, embedding providers
- **[→ Shared Memory Guide](.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md)** - Spaces, roles, membership, kill switch
- **[→ Architecture](.opencode/skill/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.opencode/skill/sk-doc/SKILL.md)** - Documentation standards, DQI scoring
- **[→ Skills Index](.opencode/skill/README.md)** - All 18 skills with invocation patterns
- **[→ Feature Catalog](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)** - 255-entry technical reference
- **[→ Feature Catalog (Simple Terms)](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)** - Plain-language companion
- **[→ Enterprise Example](AGENTS_example_fs_enterprises.md)** - Example AGENTS.md for full-stack enterprise

**External Resources:**

- **[→ OpenCode](https://github.com/sst/opencode)** - The underlying AI coding platform
- **[→ Voyage AI](https://www.voyageai.com/)** - Recommended embedding provider
- **[→ HuggingFace](https://huggingface.co/)** - Free local embedding alternative

<!-- /ANCHOR:related-documents -->


*Documentation version: 4.0 | Last updated: 2026-03-28 | Framework: 12 agents, 18 skills, 20 commands, 42 MCP tools (33 memory + 7 code mode + 1 CocoIndex + 1 sequential thinking)*
