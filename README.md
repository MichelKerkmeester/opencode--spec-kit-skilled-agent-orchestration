# Skilled Agent Orchestration w/ Custom Spec Kit Framework

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases)

> Multi-agent AI development framework with cognitive memory, structured documentation, 10 agents, 21 skills, 21 command entry points, 56 MCP tools - built for OpenCode, Codex CLI, Claude Code, Gemini CLI, with Copilot support for MCP and startup-surface workflows.
>
> Don't buy me unwanted coffee: https://buymeacoffee.com/michelkerkmeester

**🧠 Persistent Memory** • **📋 Structured Docs** • **🤖 10 Specialized Agents** • **⚡ 5 Mirrored Runtimes**

<!-- ANCHOR:table-of-contents -->

## TABLE OF CONTENTS

- [OVERVIEW](#1--overview)
- [QUICK START](#2--quick-start)
- [FEATURES](#3--features)
  - [SPEC KIT DOCUMENTATION](#spec-kit-documentation)
  - [MEMORY ENGINE](#memory-engine)
  - [COCOINDEX + CODE GRAPH](#cocoindex--code-graph)
  - [SKILL ADVISOR](#skill-advisor)
  - [SKILLS LIBRARY](#skills-library)
  - [AGENT NETWORK](#agent-network)
  - [COMMANDS](#commands)
  - [CODE MODE MCP](#code-mode-mcp)
- [CONFIGURATION](#4--configuration)
- [FAQ](#5--faq)
- [RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->


<!-- ANCHOR:overview -->

&nbsp;

## 1. OVERVIEW

### What This Framework Does

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Every decision, every trade-off, every carefully reasoned choice - lost the moment the conversation window closes. This framework fixes that.

The framework adds three layers on top of the base platform:

1. **Structured documentation** (Spec Kit) - every file change gets a spec folder recording what changed, why and how. Like a lab notebook for software.
2. **Cognitive memory** (MCP server) - a local-first memory engine storing decisions, context and project history in a searchable database. Like a personal librarian who remembers every conversation.
3. **Coordinated agents** - 10 specialized agents routed by a gate system that loads the right skills at the right time. Like a team where the project manager delegates to the right specialist.

| | |
|---|---|
| **🤖 10 Agents** | 10 custom specialists, multi-runtime |
| **🎯 21 Skills** | Code, docs, git, prompts, MCP, research, review, improvement, cross-AI |
| **⌨️ 21 Commands** | 6 spec_kit + 4 memory + 6 create + 2 improve + 2 doctor + 1 agent_router |
| **🔧 56 MCP Tools** | 47 spec_kit_memory + 7 code mode + 1 semantic search + 1 sequential thinking |
| **🔍 CocoIndex Code** | Semantic code search via vector embeddings - natural-language discovery across 28+ languages |
| **🏗️ Code Graph** | Structural indexer + SQLite - call graphs, imports, hierarchy, LLM-oriented neighborhoods, graph-first routing |
| **⚡ Runtime Coverage** | OpenCode, Codex CLI, Claude Code, Gemini CLI, plus Copilot MCP/startup support |

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
         │ 10 specialized│          │ 21 domain skills │
         │ agents with   │◄────────►│ auto-loaded by   │
         │ routing logic │          │ task keywords    │
         └───────┬───────┘          └────────┬─────────┘
                 │                           │
                 ▼                           ▼
         ┌──────────────────────────────────────────┐
         │       MEMORY ENGINE (56 MCP tools)       │
         │  5 core + CocoIndex bridge: Vector,      │
         │  BM25, FTS5, Causal Graph, Degree        │
         │  Graph-first routing ─ 3-tier fallback    │
         │  FSRS decay ─ RRF fusion ─ query intel   │
         │  runtime flags ─ eval guardrails          │
         │  Voyage │ OpenAI │ HuggingFace Local     │
         └──────────────────────┬───────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │     SPEC KIT (documentation framework)   │
         │  specs/###-feature/ - scratch/           │
         │  4 levels - template set - 20 rules      │
         └──────────────────────────────────────────┘
```

<!-- /ANCHOR:overview -->


<!-- ANCHOR:quick-start -->

---

## 2. QUICK START

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

## 3. FEATURES

### 📋 Spec Kit Documentation

The Spec Kit enforces structured spec folders for every file-modifying conversation. Gate 3 requires a spec folder answer before any file modification begins (only typo/whitespace fixes under 5 characters are exempt).

#### Documentation Levels

Documentation depth scales with task complexity.

| Level | LOC Guidance | Required Files | When to Use |
|-------|-------------|----------------|-------------|
| **1** | < 100 | spec.md, plan.md, tasks.md, implementation-summary.md | Small features, bug fixes, single-file changes |
| **2** | 100 - 499 | Level 1 + checklist.md | Features needing QA verification, multi-file changes |
| **3** | 500+ | Level 2 + decision-record.md | Architecture changes, complex refactors |
| **3+** | Complexity 80+ | Level 3 + approval workflow, compliance checkpoints, stakeholder matrix | High-complexity work needing review tracking and workstream coordination |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**Implementation-summary.md** is required at all levels but created **after** implementation completes, not at spec folder creation time.

&nbsp;
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
├── graph-metadata.json          # Packet-level graph metadata (auto-refreshed on save)
└── scratch/                     # Temporary workspace files
```

&nbsp;
#### Checklist Priority System

Checklists use a priority system so reviewers know what blocks shipping and what can wait:

- **P0** - Hard blocker. Cannot ship without this. Cannot defer.
- **P1** - Required. Must complete or get explicit user approval to defer.
- **P2** - Optional. Nice to have. Can defer without approval.

&nbsp;
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

&nbsp;
#### Validation

The `validate.sh` script runs 20 rules against a spec folder and reports what passes and what needs fixing. Rules check for required files, template compliance, placeholder detection, anchor markers and cross-reference consistency.

- **Exit 0** - All rules pass. Ready to proceed.
- **Exit 1** - Warnings found. Review and fix if practical.
- **Exit 2** - Errors found. Must fix before claiming completion.

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders.

&nbsp;
#### Scripts and Validation

**Spec Management Scripts** (in `scripts/spec/`):

- **`create.sh`** - Create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** - Run 20 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** - Inject addendum templates to upgrade a folder to a higher level
- **`recommend-level.sh`** - Analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** - Calculate spec folder completeness as a percentage
- **`check-completion.sh`** - Verify all completion criteria are met
- **`check-placeholders.sh`** - Find remaining `[PLACEHOLDER]` values after level upgrade

**Memory Scripts** (in `scripts/memory/`):

- **`generate-context.ts`** - Primary workflow for updating packet continuity and supporting generated context artifacts
- **`backfill-frontmatter.ts`** - Add missing frontmatter to existing generated context artifacts and indexed spec docs
- **`reindex-embeddings.ts`** - Rebuild embedding vectors for stored memories
- **`cleanup-orphaned-vectors.ts`** - Remove vector entries with no matching memory
- **`rebuild-auto-entities.ts`** - Regenerate auto-extracted entity catalog
- **`validate-memory-quality.ts`** - Run quality checks on stored memory content

TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.

&nbsp;
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
  │  confidence >= 0.70, uncertainty <= 0.35     │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 2: Skill Routing (REQUIRED)           │
  │  skill_advisor.py recommends skill          │
  │  confidence >= 0.8 ─► MUST load skill        │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 3: Spec Folder (HARD BLOCK)           │
  │  Only if file modification detected           │
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
  │  Completion ─ verify checklist.md items     │
  └─────────────────────────────────────────────┘
```

**Analysis Lenses** - applied silently on every request:
- **CLARITY** - Is this the simplest solution? Are abstractions earned?
- **SYSTEMS** - What does this touch? What are the side effects?
- **BIAS** - Is the user solving a symptom? Is the framing correct?
- **SUSTAINABILITY** - Will future developers understand this?
- **VALUE** - Does this change behavior or just refactor?
- **SCOPE** - Does solution complexity match problem size?

For the full spec folder workflow, template architecture (CORE + ADDENDUM v2.2), gate definitions, and anti-pattern detection rules, see the [→ Spec Kit README](.opencode/skill/system-spec-kit/README.md) and [→ AGENTS.md](AGENTS.md).

---

### 🧠 Memory Engine

The Memory Engine is a local-first cognitive memory system built as an MCP server. `generate-context.js` updates canonical packet continuity and may emit supporting generated context artifacts inside the spec folder. Canonical continuity lives in the spec packet itself: use `/spec_kit:resume` as the recovery surface, then rebuild context in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs. The MCP server indexes those packet-local sources with vector embeddings, BM25 and FTS5 full-text search, and `memory_match_triggers()` can still surface relevant prior context automatically when deeper retrieval is needed.

Phase 017 tightened that flow in two places: `/memory:save` now refreshes packet metadata on every invocation, and `session_resume` now binds `args.sessionId` to transport caller context by default, with `MCP_SESSION_RESUME_AUTH_MODE=permissive` available for rollout canaries. Copilot also now shares the same compact-cache provenance path as Claude and Gemini.

The memory engine now includes the packet-024 compact code graph and session lifecycle surfaces alongside hybrid retrieval. 

The full MCP API reference is in the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).

&nbsp;
#### Layered MCP Surface

The MCP tools are organized into a layered architecture. Each layer has a token budget that controls how much context it consumes:

| Layer | Name | Tools | Token Budget | Purpose |
|-------|------|-------|-------------|---------|
| **L1** | Orchestration | 3 | 2,000 | Unified context, resume, and bootstrap entry points |
| **L2** | Core | 4 | 1,500 | Search, quick search, trigger matching, save |
| **L3** | Discovery | 4 | 800 | List, stats, health checks, and session readiness |
| **L4** | Mutation | 4 | 500 | Delete, update, validate, bulk cleanup |
| **L5** | Lifecycle | 4 | 600 | Checkpoints and lifecycle state |
| **L6** | Analysis | 10 | 1,200 | Causal graph, epistemic baselines, evaluations, and dashboards |
| **L7** | Maintenance | 10 | 1,000 | Index scans, async ingest, learning history, and graph/CocoIndex maintenance |
| | **Total** | **47** | **8,400** | |

Lower layers load only when needed. L1 is always available. L2 loads for any search. L3-L7 load based on the specific command being used.

&nbsp;
#### Hybrid Search

Every search checks five core channels at once, with CocoIndex available as a semantic code search bridge:

- **Vector** - Semantic similarity via embeddings. Finds related content when words differ.
- **FTS5** - Full-text search on exact words and phrases.
- **BM25** - Keyword relevance scoring.
- **Causal Graph** - Follows cause-and-effect links between memories.
- **Degree** - Scores by graph connectivity, weighted by edge type.

**Reciprocal Rank Fusion (RRF)** combines results across channels so memories scoring well in multiple channels rise to the top. **Graph-first routing** dispatches structural queries to the Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline. A **3-tier FTS fallback** activates when graph and semantic channels miss: FTS5 full-text, BM25 keyword scoring, then Grep/Glob filesystem search. The system truncates weak results and ensures every active channel is represented.

&nbsp;
#### Search Pipeline

Every search passes through 4 stages:

- **Candidate generation** - Parallel retrieval from the active channels plus constitutional injection where applicable.
- **Fusion** - RRF-based scoring with post-fusion signals such as co-activation, FSRS decay, interference control, intent weights, and graph/session boosts when enabled.
- **Rerank** - Cross-encoder reranking with chunk reassembly, a minimum Stage 3 gate of 4 candidates, and compatibility-only length-penalty wiring that now resolves to a neutral `1.0` multiplier. `getRerankerStatus()` exposes latency plus cache hits, misses, stale hits, and evictions; if the reranker is unavailable, Stage 2 order is preserved with degraded metadata.
- **Filtering** - State/quality filtering, confidence annotation, token-budget enforcement, and final response shaping without mutating post-rerank scores.

&nbsp;
#### Query Intelligence

- **Complexity routing** - Simple (2 channels), moderate (4), complex (all 5)
- **Intent classification** - 7 public types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`) plus an internal continuity profile for resume-oriented retrieval (`semantic 0.52`, `keyword 0.18`, `recency 0.07`, `graph 0.23`; Stage 3 MMR lambda `0.65`)
- **Query decomposition** - Multi-topic queries split into sub-queries, expanded with related terms
- **Context pressure** - Downgrades search mode at 60% and 80% window usage
- **Fallback strategies** - LLM reformulation or HyDE for low-confidence searches

Four response modes: **quick** (top answer only), **focused** (one-topic), **deep** (full evidence trails), **resume** (state summary + next-steps).

&nbsp;
#### Memory Lifecycle

Memories fade using **FSRS** (Free Spaced Repetition Scheduler). Decay speed varies by content type and importance tier - critical decisions never fade; temporary debugging notes fade within days.

- **Cold-start boost** - Fresh memories (under 48h) get temporary scoring lift
- **Interference penalty** - Suppresses near-duplicate clusters
- **Auto-promotion** - Memories earn higher tiers through positive validation
- **Negative feedback** - 30-day decay prevents permanent blacklisting

Four active cognitive states drive normal retrieval weighting: **HOT** >> **WARM** >> **COLD** >> **DORMANT**.

&nbsp;
#### Causal Graph

Six relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`

- **Typed traversal** - Prioritizes connection types based on query intent
- **Community detection** - Louvain clustering with neighbor boosting
- **Co-activation spreading** - Fan-effect dampening prevents hub bias
- **Temporal contiguity** - Same-session grouping
- **Graph momentum** - Trending knowledge surfaces higher
- **LLM backfill** - Background discovery of missed causal links

&nbsp;
#### Save Intelligence

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

&nbsp;
#### Session Awareness

- **Working memory** - Tracks current session findings with attention decay
- **Session deduplication** - Suppresses already-seen results in follow-up queries
- **Context pressure** - Downgrades search mode as the context window fills

&nbsp;
#### Quality Gates

Three layered checks before storage:

- **Structure gate** - Format, headings, metadata validation
- **Semantic sufficiency** - Enough real content to be useful
- **Duplicate detection** - Triggers Prediction Error arbitration if similar content exists

Preview all checks without saving using `dryRun: true`. Learned relevance feedback boosts helpful results with safeguards against noise. Two-tier explainability shows plain-language reasons or exact channel contributions.

&nbsp;
#### Retrieval Enhancements

- **Constitutional injection** - Always-surfaced rules appear without asking
- **Hierarchy awareness** - Searches parent and sibling spec folders
- **Entity linking** - Connects memories referencing the same concepts
- **ANCHOR retrieval** - Per-section indexing (~93% token savings)
- **Auto-surfacing** - Triggers on tool use and context compression events
- **Provenance traces** - Shows exactly how each result was found

&nbsp;
#### Indexing and Infrastructure

- **Real-time watching** - Filesystem monitoring via chokidar
- **Incremental indexing** - Content hashes skip unchanged files
- **Embedding retry** - Background worker retries failed embeddings
- **Lexical fallback** - Text-searchable when embedding services are down
- **Atomic writes** - Crash-safe with pending-file recovery on startup

&nbsp;
#### Evaluation

- **12-metric computation** - MRR, NDCG, MAP and more
- **Ground truth corpus** - 110 test questions with known correct answers
- **Ablation studies** - Per-channel quality impact measurement
- **Offline scoring checks** - Test ranking changes before deployment

&nbsp;
#### Embedding Providers

- **Voyage AI** - Set `VOYAGE_API_KEY` env var. Best quality, recommended.
- **OpenAI** - Set `OPENAI_API_KEY` env var. Strong alternative.
- **HuggingFace Local** - No setup needed. Free, auto-detected fallback.

---

### 🔍 CocoIndex + Code Graph

The framework uses two different code-understanding systems on purpose. **CocoIndex** handles semantic discovery, so the assistant can answer "find code that does X" or "how is Y implemented?" without knowing exact symbols first. The **Code Graph** handles structural expansion, so the assistant can answer questions like "what calls this?", "what imports this?", or "what breaks if we change it?" using an indexed relationship graph.

The intended routing order is graph-first: the code graph resolves structural queries first, CocoIndex finds semantic candidates when structural resolution misses, and Memory supports session decisions and active-task context after the packet-local recovery sources have been checked. A 3-tier FTS fallback escalates automatically when results are weak.

&nbsp;
#### How the Code Graph Works

The Code Graph is a SQLite-backed structural index that ships as part of the Spec Kit MCP server (`context-server.ts`). It is available to **every supported CLI** - Claude Code, Codex CLI, Gemini CLI, and GitHub Copilot - because each runtime connects to the same MCP server via its own config (`.claude/mcp.json`, `.mcp.json`, `.codex/config.toml`, `.agents/mcp.json`).

**Startup injection.** When the MCP server starts, it initializes the `code-graph.sqlite` database, runs a non-blocking startup scan, and activates a file watcher. Runtimes with SessionStart hooks (Claude Code, Gemini CLI) inject a startup brief into the conversation's first turn with a one-line health summary (e.g., "Code Graph: healthy - 42 files, 8.3K nodes, 15.2K edges"). Codex CLI achieves equivalent startup via `session_bootstrap()` MCP tool. Copilot hook behavior varies by environment.

**Auto-indexing.** The graph stays current through three mechanisms:
1. **Startup scan** - indexes on server boot (async, non-blocking)
2. **File watcher** - Chokidar monitors spec and source folders with a 2-second debounce, reindexing changed files in real time
3. **Lazy refresh** - `code_graph_query` calls `ensureCodeGraphReady()` which detects staleness and triggers a bounded inline refresh before returning results

The indexer uses tree-sitter to parse source files and extract functions, classes, imports, and call relationships. It tracks per-file content hashes to skip unchanged files, making incremental scans fast.

&nbsp;
#### What Each System Does

| System | Best for | Primary surface |
|-------|----------|-----------------|
| **CocoIndex** | Concept search, similar implementations, unfamiliar modules | `mcp__cocoindex_code__search` |
| **Code Graph** | Callers, imports, symbol outlines, impact analysis, neighborhood expansion | `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context` |
| **Session bridge tools** | Session bootstrap, resume, and health checks around graph availability | `session_bootstrap`, `session_resume`, `session_health` |
| **CCC utilities** | CocoIndex availability, reindexing, result feedback | `ccc_status`, `ccc_reindex`, `ccc_feedback` |

&nbsp;
#### How Query Routing Works (Graph-First)

The default routing order is: **Code Graph** (structural) -> **CocoIndex** (semantic code) -> **Memory** (session/decision context). This graph-first approach tries structural resolution before semantic similarity, with a 3-tier FTS fallback when earlier stages miss.

- Use the **Code Graph** first for structural questions: callers, callees, imports, hierarchy, file outlines, and reverse impact.
- Use **CocoIndex** for semantic and intent-based questions: "find code that validates memory quality", "show similar routing patterns", "where is the logic for X?"
- Use **session tools** when recovering or checking environment readiness, but treat `/spec_kit:resume` as the canonical operator-facing recovery surface.
- Rebuild task continuity in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs.
- Use **Memory** after those packet-local sources when the question is about prior decisions, spec history, handovers, or task continuity that still needs deeper retrieval.

&nbsp;
#### Why It Matters

This split avoids forcing one search system to do everything poorly. Semantic search is good at resemblance. Structural search is good at relationships. Keeping both lets the framework move from "this code looks relevant" to "this is how it connects" without collapsing those concerns into a single noisy result set.

For the full tool and architecture reference, see [`mcp_server/README.md`](.opencode/skill/system-spec-kit/mcp_server/README.md) and the system skill docs in [`.opencode/skill/system-spec-kit/README.md`](.opencode/skill/system-spec-kit/README.md).

---

### 🎯 Skill Advisor

The Skill Advisor is an intelligent routing system that automatically matches user requests to the right skill. It powers Gate 2 in the gate system, analyzing every request against 21 skills using a multi-stage scoring pipeline with a SQLite-backed relationship graph. Average routing time: **0.5ms per query**.

#### How It Works

```
  YOU TYPE: "use figma to export designs"
                      │
                      ▼
           ┌──────────────────────┐
      1.   │  NORMALIZE (0.1ms)   │  Lowercase, tokenize, expand
           │                      │  synonyms, canonical intent rules
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      2.   │  SCORE (0.2ms)       │  170 single-skill boosters
           │                      │  32 multi-skill boosters
           │                      │  134 phrase intent boosters
           └──────────┬───────────┘
                      ▼
      ┌───────────────────────────────┐
      │  3. GRAPH BOOSTS (0.1ms)      │  Reads skill-graph.sqlite:
      │                               │  mcp-figma depends_on
      │  SQLite-backed skill graph    │    mcp-code-mode -> boost it
      │  with typed relationships,    │  MCP family -> light boost
      │  auto-indexed via watcher     │    to other MCP skills
      │                               │  Ghost guard: only boost
      │  4 MCP tools for any runtime  │    skills already scored
      └───────────────┬───────────────┘
                      ▼
           ┌──────────────────────┐
      4.   │  CALIBRATE (0.1ms)   │  Confidence + uncertainty
           │                      │  Graph-heavy results get haircut
           │                      │  Conflict penalty if applicable
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      5.   │  FILTER              │  confidence >= 0.8 AND
           │                      │  uncertainty <= 0.35
           └──────────┬───────────┘
                      ▼
                RESULT:
           mcp-figma      0.95  pass
           mcp-code-mode  0.95  pass  <- graph pulled this up
           mcp-clickup    0.55  fail  <- below threshold
```

&nbsp;
#### Skill Graph (SQLite-Backed)

Every skill folder contains a `graph-metadata.json` declaring typed relationships to other skills. The graph is stored in `skill-graph.sqlite` (alongside `code-graph.sqlite` and `deep-loop-graph.sqlite`) and auto-indexed on MCP server startup and on file changes via a Chokidar watcher. The advisor reads SQLite first, falling back to the compiled JSON if SQLite is unavailable.

4 MCP tools expose the graph to all runtimes:

| Tool | Purpose |
|------|---------|
| `skill_graph_scan` | Index/reindex all metadata files into SQLite |
| `skill_graph_query` | Structural queries: depends_on, enhances, family, transitive paths, hubs |
| `skill_graph_status` | Health: node/edge counts, staleness, family distribution |
| `skill_graph_validate` | Weight band, symmetry, and schema validation |

&nbsp;
#### Relationship Types

| Edge Type | Semantics | Damping | Example |
|-----------|-----------|---------|---------|
| `depends_on` | Cannot function without target | 0.20 | mcp-figma depends on mcp-code-mode |
| `enhances` | Adds value alongside target (overlay) | 0.30 | sk-code-review enhances sk-code-opencode |
| `siblings` | Peer with shared characteristics | 0.15 | cli-gemini siblings cli-codex |
| `conflicts_with` | Should not be recommended together | penalty | - |
| `prerequisite_for` | Inverse of depends_on | 0.20 | mcp-code-mode prerequisite for mcp-figma |

Family affinity gives an additional 8% boost to same-family members when one has a strong signal. A ghost candidate guard prevents the graph from creating brand-new winners -- graph boosts only apply to candidates that already have positive evidence.

&nbsp;
#### Validation and Testing

- `skill_graph_compiler.py --validate-only` validates all 21 metadata files with schema, weight band, and edge symmetry checks
- `skill_advisor.py --health` reports graph source (sqlite/json), skill count, and CocoIndex availability
- 44-case regression suite with 12 P0 cases, 3 graph-specific test cases, and 100% pass rate
- 28-scenario manual testing playbook covering routing, graph boosts, compiler, regression safety, and SQLite graph
- 20-feature catalog across 4 categories (routing pipeline, graph system, semantic search, testing)

For details, see the [Skill Advisor README](.opencode/skill/skill-advisor/README.md).

---

### 🎯 Skills Library

21 skills in `.opencode/skill/`, loaded on demand when Gate 2 matches a task (confidence >= 0.8 means the skill must be loaded).

#### DOCUMENTATION

**system-spec-kit**
- Mandatory orchestrator for all file modifications - activates automatically for any code file change
- Creates numbered spec folders with CORE + ADDENDUM template architecture across 4 levels (1-3+)
- Integrates the 47-tool memory and code-graph surface with constitutional-tier support, session bootstrap, and hybrid 5-channel retrieval
- Manages the CORE + ADDENDUM v2.2 template set, 20 validation rules, the spec-kit script suite, and the feature-catalog / testing-playbook documentation surfaces

**sk-doc**
- Unified markdown specialist with DQI quality scoring (Structure 40%, Content 35%, Style 25%)
- HVR v0.210 compliance checking and component creation workflows (skills, agents, commands)
- Handles README templates, frontmatter validation, feature catalog authoring, install guide generation

&nbsp;
#### CODE WORKFLOW

**sk-code-full-stack**
- Stack-agnostic development orchestrator with automatic stack detection via marker files
- Detects 7 stacks: Go, Swift, React Native/Expo, Next.js, React, Node.js, and default
- 3 mandatory phases: implementation → testing/debugging → verification

**sk-code-web**
- Frontend development orchestrator with 5-phase lifecycle
- Enforces mandatory browser testing before any completion claims with DevTools integration
- Targets PageSpeed, Lighthouse, TBT and INP metrics. Includes Webflow integration.

**sk-code-review**
- Stack-agnostic code review baseline implementing the baseline + overlay model
- Baseline always runs first: security checklist, correctness checklist, SOLID checklist, threat model
- Security and correctness minimums are mandatory and NEVER relaxed by the overlay. P0/P1/P2 findings.

**sk-code-opencode**
- Multi-language standards for OpenCode system code across 5 languages
- JavaScript (CommonJS), TypeScript (strict), Python (snake_case), Shell (set -euo pipefail), JSON/JSONC
- Evidence-based patterns extracted from the actual codebase with `file:line` citations

**sk-git**
- Git workflow orchestrator coordinating 3 sub-skills
- **git-worktree**: workspace isolation, branch creation, parallel development
- **git-commit**: conventional commit format, staged change analysis, scope detection
- **git-finish**: PR creation via `gh pr create`, branch cleanup, integration workflows

**sk-deep-research** (v1.6.2.0)
- Autonomous research investigation system with iterative LEAF cycles
- Fresh context per iteration, externalized JSONL state, 3-signal convergence detection (Rolling Average + MAD Noise Floor + Coverage/Age)
- Semantic coverage graph with 7 relation types, question coverage tracking, sourceDiversity and evidenceDepth guards
- Progressive synthesis, negative knowledge preservation, quality guards (source diversity, focus alignment, weak-source checks)
- Fail-closed corruption handling, graph convergence fallback scoring, terminal stop metadata parsing
- Lifecycle modes: `new`, `resume`, `restart`. Dispatched by `/spec_kit:deep-research` command

**sk-deep-review** (v1.3.2.0)
- Autonomous code quality auditing system with iterative LEAF cycles
- P0/P1/P2 severity-weighted findings across 4 dimensions (Correctness, Security, Traceability, Maintainability)
- 3-signal convergence model, P0 override blocks stop, adversarial self-check (Hunter/Skeptic/Referee)
- Binary quality gates (evidence, scope, coverage), graph-aware legal-stop checks, semantic coverage graph
- 9-section review report with PASS/CONDITIONAL/FAIL verdict
- Fail-closed corruption, claim-adjudication `finalSeverity`, stale STOP veto auto-clearing
- Lifecycle modes: `new`, `resume`, `restart`. Dispatched by `/spec_kit:deep-review` command

&nbsp;
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

&nbsp;
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

&nbsp;
#### OTHER

**sk-improve-prompt**
- Prompt engineering specialist auto-selecting from 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- DEPTH thinking methodology with 3-10 iteration rounds of progressive refinement
- CLEAR quality scoring: Clarity, Logic, Expression, Reliability (40+/50 pass threshold)

**sk-improve-agent** (v1.2.2.0)
- Evaluator-first agent improvement with 5-dimension integration-aware scoring (structural, ruleCoherence, integration, outputQuality, systemFitness)
- Integration scanner discovers all surfaces an agent touches (canonical, mirrors, commands, YAML, skills)
- Dynamic profile generator derives scoring rubric from any agent's own rules, no hardcoded profiles needed
- Proposal-first: candidates in packet-local runtime areas, canonical target untouched until guarded promotion
- Guarded promotion with scoring, benchmark, repeatability and operator approval gates. Rollback support.
- Dimensional progress tracking with plateau detection (3+ identical scores triggers stop)
- All scoring is deterministic (regex/string/file-existence), no LLM-as-judge, safe for promotion gates
- Legal-stop events, session-boundary gate, `plateau` stop reason, dashboard sections for journal/lineage/coverage

---

### 🤖 Agent Network

12 custom specialist agents. Defined in `.opencode/agent/` (source of truth), mirrored for the `.agents/agents/`, Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`), and Gemini CLI (`.gemini/agents/`) runtime surfaces.

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
- Exceptions: `scratch/` (any agent), `handover.md`, `research.md`, `graph-metadata.json` (via generate-context.js)

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
- 3-signal convergence model: Rolling Average (0.45), MAD Noise Floor (0.30), Coverage/Age (0.25) with 0.60 threshold
- Semantic coverage graph: each iteration emits `graphEvents` with relation types (ANSWERS, SUPPORTS, CONTRADICTS, SUPERSEDES, DERIVED_FROM, COVERS, CITES)
- Graph convergence guards: sourceDiversity (>= 0.4) and evidenceDepth (>= 1.5) block premature STOP
- Question coverage tracking computes answerCoverage ratio from ANSWERS edges
- Quality guards: source diversity, focus alignment and weak-source checks must pass before STOP
- Progressive synthesis: `research.md` updated incrementally and finalized during synthesis
- Negative knowledge: ruled-out directions and dead ends preserved as first-class outputs
- Lifecycle modes: `new`, `resume`, `restart` (fork and completed-continue are deferred)
- Fail-closed corruption handling: throws structured error before writing derived files when JSONL is corrupt
- Graph convergence fallback: scoring uses a numeric fallback when `blendedScore` is absent

**Deep-Review**
- Autonomous code quality auditor using LEAF architecture for single review iterations
- Reviews code but NEVER modifies target files (read-only on code)
- Loop orchestration managed by `/spec_kit:deep-review` command, not this agent
- Produces P0/P1/P2 severity-ranked findings with `file:line` evidence across 4 review dimensions (Correctness, Security, Traceability, Maintainability)
- Severity-weighted convergence: P0 contributes weight 10.0, P1 contributes 5.0, P2 contributes 1.0. Refinements contribute 0.5x those weights
- 3-signal convergence model: Rolling Average (0.45), MAD Noise Floor (0.30), Dimension Coverage (0.25)
- P0 override: any new P0 finding forces at least one more iteration regardless of convergence math
- Adversarial self-check on P0 findings: Hunter/Skeptic/Referee triad before admission
- Binary quality gates: evidence (file:line backed), scope (stays inside declared target), coverage (all dimensions and cross-reference protocols complete)
- Graph-aware legal-stop checks using structural graph signals from `graphEvents`
- Semantic coverage graph with review-specific node types (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION) and edge types (COVERS, EVIDENCE_FOR, IN_DIMENSION, CONTRADICTS, RESOLVES, CONFIRMS)
- 9-section review report with PASS/CONDITIONAL/FAIL verdict (FAIL on P0, CONDITIONAL on P1, PASS otherwise)
- Claim-adjudication `finalSeverity` overrides original severity in the findings registry
- Fail-closed corruption handling: reducer refuses to write derived files when JSONL corruption is detected
- Lifecycle modes: `new`, `resume`, `restart` with typed JSONL lineage events

**Review**
- Code quality guardian with strict read-only permissions (cannot write or edit any file)
- Loads `sk-code-review` baseline first, then one `sk-code-*` overlay matching the detected stack
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

**Agent-Improver**
- Proposal-only mutator for bounded agent improvement experiments
- Reads the target agent's charter, manifest and integration surface, then writes ONE candidate to a packet-local runtime area
- Never scores, promotes, benchmarks or edits canonical targets. The `/improve:agent` command loop handles those.
- Loop orchestration: scan integration surfaces, generate dynamic profile, dispatch this agent, score candidate across 5 dimensions (structural, ruleCoherence, integration, outputQuality, systemFitness), reduce state, check stop conditions

**Improve-Prompt**
- Prompt-escalation specialist for high-stakes external CLI invocations and other sensitive AI prompt work
- Selects the best-fit framework from `sk-improve-prompt`, applies DEPTH at the right energy level, and validates the result with CLEAR
- Returns a structured prompt package with `FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, and `ESCALATION_NOTES`
- Used by the CLI mirror-card pipeline and `/improve:prompt` agent mode when complexity, compliance, or stakeholder spread makes inline prompting too weak

---

### ⌨️ Commands

21 command entry points across 6 namespaces. Each command is a Markdown entry point under `.opencode/command/**/*.md` backed by a behavioral execution spec.

&nbsp;
#### SPEC KIT

**Plan --intake-only**
- Standalone intake workflow that publishes `spec.md`, `description.json`, and `graph-metadata.json`
- Used directly for new packet setup and paired with `/spec_kit:plan` or `/spec_kit:complete` when `folder_state` is `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`
- Modes: `:auto`, `:confirm`

**Complete**
- End-to-end workflow: intake/delegate → research → plan → implement → verify → save memory
- Smart-detects missing or unhealthy packet state and reuses the shared intake contract from `/spec_kit:plan --intake-only`; healthy folders continue without extra setup prompts
- Modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:with-research` (adds deep research)
- After 3 failed implementation attempts, surface diagnostics and let the user dispatch `@debug` via the Task tool

**Plan**
- Planning-only workflow that authors `spec.md`, `plan.md`, and `tasks.md` without implementing
- Reuses the shared intake contract from `/spec_kit:plan --intake-only` when the packet is `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`
- Dispatches up to 4 parallel context agents for codebase exploration during planning
- Use when you need stakeholder review before coding. Modes: `:auto`, `:confirm`

**Implement**
- Executes an existing plan - requires plan.md to already exist
- 9-step workflow covering task breakdown, implementation, testing and verification
- Modes: `:auto`, `:confirm`

**Debug**
- Delegates debugging to the debug agent with structured context handoff (not conversation history)
- Fresh-perspective approach avoids confirmation bias from failed prior attempts
- Writes `debug-delegation.md` with root cause analysis

**Resume**
- Continues a previous session by auto-loading memory from the spec folder
- Presents session summary, shows progress against tasks.md
- Works after crashes, compactions, or new sessions

**Deep Research**
- Autonomous research loop dispatching deep-research agents iteratively until convergence
- Anchors every run to a real `spec.md` under `spec_check_protocol.md`, with advisory lock handling, `folder_state` detection, and bounded `BEGIN/END GENERATED` write-back
- Externalized JSONL state enables pause/resume across sessions
- Reducer parses terminal `synthesis_complete` events for authoritative stop metadata
- Graph convergence guards block premature STOP when sourceDiversity or evidenceDepth thresholds fail
- Lifecycle modes: `new`, `resume`, `restart` with lineage tracking across generations
- Modes: `:auto`, `:confirm`

**Deep Review**
- Autonomous code review loop dispatching deep-review agents iteratively until convergence
- Severity-weighted findings (P0/P1/P2) across 4 dimensions with release readiness verdicts (PASS/CONDITIONAL/FAIL)
- Claim-adjudication packets with `finalSeverity` override, stale STOP veto auto-clearing
- Binary quality gates (evidence, scope, coverage) checked after convergence math before allowing stop
- Adversarial self-check on P0 findings using Hunter/Skeptic/Referee triad
- Lifecycle modes: `new`, `resume`, `restart` with typed JSONL lineage events
- Modes: `:auto`, `:confirm`

**Handover**
- Creates session handover document for continuing work in a new conversation
- Gathers key decisions, blockers, current phase and next steps from spec folder state
- Variants: `:quick` (summary) or `:full` (comprehensive)

**Spec-first command chains**

```text
/spec_kit:plan --intake-only
  ├─► /spec_kit:plan -> /spec_kit:implement
  ├─► /spec_kit:deep-research -> /spec_kit:plan
  └─► /spec_kit:complete
       └─► reuses the shared intake contract from /spec_kit:plan --intake-only when folder_state still needs intake
```

`/spec_kit:deep-research` only enters that chain after a real `spec.md` exists; it follows `spec_check_protocol.md` for advisory-lock handling, `folder_state` classification, and bounded generated-fence sync.

&nbsp;
#### MEMORY

**Save**
- Updates packet continuity and supporting generated context artifacts via `generate-context.js`
- AI composes structured JSON with session summary, key decisions and findings
- Indexes immediately for future retrieval via `memory_save()` or `memory_index_scan()`

**Search**
- Unified retrieval and analysis entry point with intent-aware routing
- Supports epistemic baselines, causal graph traversal, ablation studies, and dashboards
- Routes by intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`

**Learn**
- `/memory:learn` constitutional memory manager for always-surface rules
- Constitutional memories carry a 3.0x boost and never decay
- Lifecycle operations: create, list, edit, remove, budget

**Manage**
- Database admin: stats (memory counts, index health), health checks, cleanup (orphaned vectors)
- Checkpoint management: create, list, restore, delete
- Bulk operations and ingestion (start/status/cancel)

&nbsp;
#### CREATE

**Skill**
- Unified skill creation and update workflow
- Creates SKILL.md with 8-section structure, README.md, references and assets directories
- Registers in skill catalog. Modes: `:auto`, `:confirm`

**Agent**
- Scaffolds a new agent definition with proper frontmatter, behavioral rules and tool permissions
- Creates source-of-truth file in `.opencode/agent/` and mirrors for Claude, Codex, Gemini runtimes
- Modes: `:auto`, `:confirm`

**Readme**
- Unified README and install guide creation using sk-doc quality standards
- Auto-detects folder type, loads appropriate template, validates via DQI scoring
- Structure 40%, Content 35%, Style 25%. Modes: `:auto`, `:confirm`

**Changelog**
- Auto-detects recent work from spec folder artifacts or git history
- Resolves correct component folder, calculates next version number
- Generates formatted changelog file matching 370+ existing entries. Modes: `:auto`, `:confirm`

**Prompt (planned)**
- `/create:prompt` is a reserved surface, but there is no shipped `.opencode/command/create/prompt.md` entry point in this repo snapshot
- Use `/improve:prompt` or the `sk-improve-prompt` skill directly when you need prompt work today

**Feature Catalog**
- Creates or updates feature catalog packages with category routing
- Generates both technical reference entries and simple-terms companion entries
- Validates against the 291-entry catalog structure across 22 categories

**Testing Playbook**
- Creates or updates manual testing playbook packages
- Generates scenario files with test steps, expected results and verification evidence fields
- Validates against established playbook format

&nbsp;
#### IMPROVE

**Improve Agent**
- Evaluates and improves any agent across 5 integration-aware dimensions with deterministic scoring
- Runs a bounded loop: scan integration surfaces, generate dynamic profile, dispatch `@improve-agent`, score candidate, reduce state, check stop conditions
- Integration scanner discovers all surfaces an agent touches: canonical definition, runtime mirrors, command dispatch, YAML workflows, skill references
- Dynamic profiling: derives scoring rubric from any agent's own rules, no hardcoded profiles needed
- Proposal-first: candidates written to packet-local runtime areas, canonical target untouched until guarded promotion
- Guarded promotion requires passing scoring, benchmark status, repeatability evidence and operator approval. Rollback restores pre-promotion backup.
- Dimensional progress tracking detects plateau (3+ identical scores across all dimensions) and triggers stop
- All scoring is regex/string/file-existence based (no LLM-as-judge) for promotion gate reliability
- Emits `legal_stop_evaluated` and `blocked_stop` events to the JSONL ledger matching the deep-loop runtime-truth contract
- Session-boundary gate enforces fresh-session isolation before initialization
- Modes: `:auto`, `:confirm`. Supports any agent in `.opencode/agent/` as target

**Improve Prompt**
- Refines prompts and prompt packages using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Applies DEPTH thinking methodology with CLEAR quality scoring
- Used when the target already exists and needs structured improvement rather than new scaffolding

&nbsp;
#### DOCTOR

**MCP Debug**
- Diagnoses all 4 MCP servers (Spec Kit Memory, CocoIndex Code, Code Mode, Sequential Thinking) with PASS/WARN/FAIL per check
- Investigates failures using install guide knowledge, cross-references config wiring across all 5 runtime configs
- Interactive repair: walks through each failure with root cause + targeted fix. Also supports `--fix` for automatic repair

**MCP Install**
- Fresh install or reinstall all 4 MCP servers from their install guides
- Assesses current state (INSTALLED/STALE/MISSING), runs install scripts, configures runtime wiring, verifies health
- Handles old-install-conflicting-with-new scenarios (clean reinstall with venv/node_modules removal)

&nbsp;
#### UTILITY

**Agent Router**
- Routes requests to external AI systems (Gemini CLI, Codex CLI, Claude Code, Copilot CLI)
- The receiving AI operates under its own system prompt - full identity adoption
- Use for cross-AI delegation where the target AI needs to behave as itself

---

### 🔌 Code Mode MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Instead of loading 47 tool definitions into context (141k tokens), Code Mode loads them on demand through one interface (1.6k tokens) - a 98.7% reduction.

#### Native MCP Servers

Defined in `opencode.json`:

| Server | Tools | Purpose |
|--------|-------|---------|
| `spec_kit_memory` | 47 | Cognitive memory system - the memory engine + skill graph |
| `code_mode` | 7 | External tool orchestration via TypeScript execution |
| `cocoindex_code` | 1 | Semantic code search via vector embeddings |
| `sequential_thinking` | 1 | Structured multi-step reasoning for complex problems |
| **Total** | **56** | |

&nbsp;
#### Code Mode Tools (7)

- **`search_tools`** - Discover relevant tools by task description
- **`tool_info`** - Get complete tool parameters and TypeScript interface
- **`call_tool_chain`** - Execute TypeScript code with access to all registered tools
- **`list_tools`** - List all currently registered tool names
- **`register_manual`** - Register a new tool provider
- **`deregister_manual`** - Remove a tool provider
- **`get_required_keys_for_tool`** - Check required environment variables for a tool

&nbsp;
#### External Integrations (via `.utcp_config.json`)

- **`chrome_devtools_1`** (MCP/stdio) - Browser automation (instance 1). No env var needed.
- **`chrome_devtools_2`** (MCP/stdio) - Browser automation (instance 2). No env var needed.
- **`clickup`** (MCP/stdio) - Task management, goals, docs. Requires `CLICKUP_API_KEY`.
- **`figma`** (MCP/stdio) - Design files, components, exports. Requires `FIGMA_API_KEY`.
- **`github`** (MCP/stdio) - Issues, pull requests, commits. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **`webflow`** (MCP/remote) - Sites, CMS collections. Requires Webflow auth.

&nbsp;
#### Performance

| Metric | Without Code Mode | With Code Mode |
|--------|-------------------|----------------|
| Context tokens | 120k (47 tools loaded) | 1.6k (on-demand) |
| Round trips | 15+ for chained operations | 1 (TypeScript chain) |
| Type safety | None | Full TypeScript |
| Context reduction | -| 98.7% |

To call a Code Mode tool: `call_tool_chain({ typescript: "const result = await figma.figma_get_file({fileKey: 'abc123'}); return result;" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.opencode/skill/mcp-code-mode/SKILL.md`.

<!-- /ANCHOR:features -->


<!-- ANCHOR:configuration -->

---

## 4. CONFIGURATION

### Core Configuration Files

- **`CLAUDE.md`** - Gate definitions, behavior rules, coding anti-patterns. Used by Claude Code (primary runtime).
- **`AGENTS.md`** - Agent routing, capability reference, gate documentation. Used by all runtimes.
- **`opencode.json`** - MCP server bindings (4 servers), model configuration. Used by OpenCode platform.
- **`.utcp_config.json`** - Code Mode external tool registrations. Used by `mcp-code-mode` skill.
- **`.claude/mcp.json`** - Claude Code MCP configuration. Claude Code only.
- **`.codex/config.toml`** - Codex CLI MCP configuration and profile definitions.
- **`.gemini/settings.json`** - Gemini CLI configuration. Gemini CLI only.
- **`.vscode/mcp.json`** - VS Code / Copilot MCP configuration wrapper.

&nbsp;
### Memory Engine Configuration

The memory server reads configuration from environment variables:

- **`VOYAGE_API_KEY`** (optional) - Voyage AI embeddings (recommended)
- **`OPENAI_API_KEY`** (optional) - OpenAI embeddings (alternative)
- **`MEMORY_DB_PATH`** (optional) - Override default database path

Default repo-local database path: `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`

> [!TIP]
> If no API key is set, the memory engine auto-detects **HuggingFace Local** embeddings - free, no setup required.


&nbsp;
### Memory Feature Flags

Feature flags control search channels, scoring signals, save-time enforcement, and evaluation behavior. The important retrieval/runtime flags are resolved at call time, so long-lived MCP processes do not depend on frozen import-time snapshots.

- **Search Pipeline** - 5-channel retrieval, fallback routing, reranking, graph-walk rollout, confidence and token-budget policies.
- **Session/Cache** - Working memory, cache invalidation on DB rebind, session deduplication, recovery helpers.
- **Memory/Storage** - Save quality gate, reconsolidation, governed scopes, causal graph maintenance, projection cleanup.
- **Embedding/API** - Startup provider resolution, fail-fast dimension checks, structured fallback metadata for effective vs requested provider.
- **Evaluation/Debug** - Trace mode, eval logging, ablation/reporting guardrails, feedback evaluation, and proposal diagnostics that observe candidates without reordering live results.

For the complete flag reference with per-flag defaults, see [MCP Server README Section 5](.opencode/skill/system-spec-kit/mcp_server/README.md#5-configuration).

&nbsp;
### Database Schema

The runtime centers on a SQLite `memory_index` table with 56 columns plus companion FTS5/vector, lineage, checkpoint, working-memory, and eval tables.

- **Primary store** - `memory_index` holds the searchable memory rows plus governance, quality, chunking, and retrieval metadata.
- **Search companions** - FTS5 and vector tables support lexical and embedding retrieval alongside BM25 rebuild/index data.
- **Graph/lifecycle** - Causal edges, lineage projection, checkpoints, working memory, and access tracking support decision tracing and session continuity.
- **Evaluation** - Separate eval tables persist ablation/reporting metrics, with guards for missing query IDs and synthetic token-usage markers.
- **Paths** - The checked-in configs default to `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`. If a runtime cannot write inside the repo, override `MEMORY_DB_PATH` (and, when relevant, `SPEC_KIT_DB_DIR`) to a writable location.

&nbsp;
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


<!-- ANCHOR:faq -->

---

## 5. FAQ

**Q: Do I need all 21 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core skills -`system-spec-kit` and `sk-doc` - cover most documentation workflows. The MCP and cross-AI CLI skills require additional API keys or tools.
&nbsp;
**Q: Is this only for OpenCode, or does it work with other runtimes?**

A: It works with OpenCode, Codex CLI, Claude Code, and Gemini CLI, and the repo also includes Copilot-oriented MCP/startup integration surfaces. Agent definitions are mirrored in the checked-in Claude, Codex, and Gemini runtime directories; OpenCode and Copilot use runtime-specific MCP/startup integration rather than a dedicated agent mirror.
&nbsp;
**Q: What happens if I do not use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable via memory search. For trivial changes under 5 characters in a single file, Gate 3 does not trigger.
&nbsp;
**Q: How does the memory system know what is relevant to my current task?**

A: Packet continuity and any supporting generated context artifacts use structured frontmatter and anchored markdown so the memory engine can classify, index, and retrieve them reliably. For recovery, start with `/spec_kit:resume` and the packet-local continuity ladder `handover.md` -> `_memory.continuity` -> canonical spec docs. After that, `memory_match_triggers()` can do a fast trigger/cognitive pass, while `memory_context()` and `memory_search()` handle deeper retrieval with intent routing, reranking, and filtering.
&nbsp;
**Q: Can I use this framework without the cognitive memory features?**

A: Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works independently of the memory MCP server. You will not have cross-session memory retrieval, but you will still get structured documentation, agent routing and skill loading.
&nbsp;
**Q: How do I add a new skill to the framework?**

A: Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Then register the skill in `.opencode/skill/README.md`.
&nbsp;
**Q: What does "local-first" mean for the memory system?**

A: The memory database is a SQLite file on your local machine. No session data, code or context is sent to any external service unless you configure a cloud embedding provider (Voyage AI or OpenAI). HuggingFace Local embeddings run entirely on-device.
&nbsp;
**Q: How do I contribute a new agent definition?**

A: Define the agent in `.opencode/agent/` (the source of truth), then copy the adapter to `.agents/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`. Use `/create:agent` to scaffold the file from the agent template.
&nbsp;
**Q: How many MCP tools are there and where are they defined?**

A: 56 total across 4 native MCP servers: 47 `spec_kit_memory` tools (21 memory + 4 checkpoint + 2 task + 2 eval + 4 code_graph + 4 skill_graph + 3 ccc + 3 session + 4 deep_loop_graph), 7 code mode tools, 1 semantic code search tool (`cocoindex_code`), and 1 sequential thinking tool. All server bindings are defined in `opencode.json`. The 47 `spec_kit_memory` tool definitions live in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`.
&nbsp;

**Q: What is the feature catalog?**

A: The feature catalog is a 291-entry reference across 22 categories documenting every capability of the memory system. It comes in two versions: a technical reference and a simple-terms companion with plain-language explanations. Both are in `.opencode/skill/system-spec-kit/feature_catalog/`.

<!-- /ANCHOR:faq -->


<!-- ANCHOR:related-documents -->

---

## 6. RELATED DOCUMENTS

**Internal Documentation:**

- **[→ AGENTS.md](AGENTS.md)** - Agent routing, gate definitions, behavior rules
- **[→ Spec Kit README](.opencode/skill/system-spec-kit/README.md)** - Spec folder workflow, CORE + ADDENDUM v2.2 template set, validation rules
- **[→ MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md)** - Memory and code-graph API reference (47 tools, 7 layers)
- **[→ Install Guide](.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md)** - MCP server setup, embedding providers
- **[→ Deployment Notes](DEPLOYMENT.md)** - Docker anti-patterns, Copilot notes, and session-resume auth flag
- **[→ Architecture](.opencode/skill/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.opencode/skill/sk-doc/SKILL.md)** - Documentation standards, DQI scoring
- **[→ Skills Index](.opencode/skill/README.md)** - All 21 skills with invocation patterns
- **[→ Feature Catalog](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)** - 291-entry technical reference
- **[→ Feature Catalog (Simple Terms)](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)** - Plain-language companion
- **[→ Phase 017 Changelog](.opencode/changelog/01--system-spec-kit/v3.4.0.2.md)** - Release notes for H-56-1, session-resume auth binding, and Copilot parity
- **[→ Enterprise Example](AGENTS_example_fs_enterprises.md)** - Example AGENTS.md for full-stack enterprise

**External Resources:**

- **[→ OpenCode](https://github.com/sst/opencode)** - The underlying AI coding platform
- **[→ Voyage AI](https://www.voyageai.com/)** - Recommended embedding provider
- **[→ HuggingFace](https://huggingface.co/)** - Free local embedding alternative

<!-- /ANCHOR:related-documents -->


*Documentation version: 4.2 | Last updated: 2026-04-17 | Framework: 12 agents, 21 skills, 23 commands, 60 MCP tools (51 spec_kit_memory + 7 code mode + 1 CocoIndex + 1 sequential thinking)*
