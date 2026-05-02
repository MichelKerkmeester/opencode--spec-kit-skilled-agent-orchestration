# Skilled Agent Orchestration w/ Custom Spec Kit Framework

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases)

> Multi-agent AI development framework with cognitive memory, structured documentation, 11 agents, 19 skills, 23 command entry points, 63 MCP tools - built for OpenCode, Codex CLI, Claude Code, Gemini CLI, with Copilot support for MCP and startup-surface workflows.
>
> Don't buy me unwanted coffee: https://buymeacoffee.com/michelkerkmeester

**🧠 Persistent Memory** • **📋 Structured Docs** • **🤖 11 Specialized Agents** • **⚡ 5 Mirrored Runtimes**

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
| **🤖 11 Agents** | 11 custom specialists, multi-runtime |
| **🎯 21 Skills** | Code, docs, git, prompts, MCP, research, review, improvement, cross-AI |
| **⌨️ 23 Commands** | 6 spec_kit + 4 memory + 6 create + 2 improve + 4 doctor + 1 agent_router |
| **🔧 63 MCP Tools** | spec_kit_memory (54), code mode (7), CocoIndex (1), sequential thinking (1) — see canonical count in FAQ |
| **🔍 CocoIndex Code** | [Forked](.opencode/skill/mcp-coco-index/NOTICE) from [cocoindex-io/cocoindex-code](https://github.com/cocoindex-io/cocoindex-code) (Apache 2.0) - semantic code search via vector embeddings and natural-language discovery across 28+ languages |
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
        │       MEMORY ENGINE + ADVISOR TOOLS      │
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
├── resource-map.md              # Optional path ledger of resources the packet touched
├── graph-metadata.json          # Packet-level graph metadata (auto-refreshed on save)
└── scratch/                     # Temporary workspace files
```

`resource-map.md` is optional at any level. Render it from `.opencode/skill/system-spec-kit/templates/manifest/resource-map.md.tmpl` when a packet wants a lean, central listing of the files, scripts, and external resources it interacts with. Deep-research and deep-review loops emit it automatically next to `review-report.md`.

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
- **Exit 1** - User error (bad flags or invalid input).
- **Exit 2** - Validation error. Must fix before claiming completion.
- **Exit 3** - System error (file I/O failure, missing manifest, or other environment problem).

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders. Strict validation of a Level 3 packet runs in ~108 ms via a single-orchestrator design. The default scaffold path skips post-create validation; set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows. Path traversal inputs (e.g. `--path "../etc/passwd"`) are rejected before any filesystem write. Parallel `/memory:save` calls for the same packet are serialized by an advisory lock on `description.json` and `graph-metadata.json`.

&nbsp;
#### Scripts and Validation

**Spec Management Scripts** (in `scripts/spec/`):

- **`create.sh`** - Create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** - Run 20 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** - Upgrade a spec folder to a higher level by injecting new sections
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
  │  advisor_recommend recommends skill         │
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

For the full spec folder workflow, Level contract template architecture, gate definitions, and anti-pattern detection rules, see the [→ Spec Kit README](.opencode/skill/system-spec-kit/README.md) and [→ AGENTS.md](AGENTS.md).

---

### 🧠 Memory Engine

The Memory Engine is a local-first cognitive memory system built as an MCP server. `generate-context.js` updates canonical packet continuity and may emit supporting generated context artifacts inside the spec folder. Canonical continuity lives in the spec packet itself: use `/spec_kit:resume` as the recovery surface, then rebuild context in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs. The MCP server indexes those packet-local sources with vector embeddings, BM25 and FTS5 full-text search, and `memory_match_triggers()` can still surface relevant prior context automatically when deeper retrieval is needed.

`/memory:save` refreshes packet metadata on every invocation, and `session_resume` binds `args.sessionId` to transport caller context by default; set `MCP_SESSION_RESUME_AUTH_MODE=permissive` for rollout canaries. Copilot, Claude, and Gemini all share the same compact-cache provenance path.

The memory engine includes a compact code graph and session lifecycle surfaces alongside hybrid retrieval.

Expired ephemeral rows are cleaned by a retention sweep on startup and hourly by default; use `memory_retention_sweep` for manual or dry-run cleanup. The handler is defined at [memory-retention-sweep.ts](.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts), with `SPECKIT_RETENTION_SWEEP` and `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` controlling the background interval.

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
| **L8** | Graph + Advisor | 17 | 1,400 | Code graph, skill graph, advisor, and CocoIndex bridge |
| **L9** | Coverage Graph | 4 | 700 | Deep-loop coverage graph operations |
| | **Total** | **54** | **10,500** | |

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
- **Rerank** - Cross-encoder reranking with chunk reassembly, a minimum Stage 3 gate of 4 candidates, and compatibility-only length-penalty wiring that resolves to a neutral `1.0` multiplier. `getRerankerStatus()` exposes latency plus cache hits, misses, stale hits, and evictions; if the reranker is unavailable, Stage 2 order is preserved with degraded metadata.
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
#### Trust Badges on Search Results

Every search result ships with a small `trustBadges` block that tells you how reliable the hit is at a glance. The badges are display-only — they read existing causal links and don't add new storage:

| Badge | What it tells you |
|-------|-------------------|
| `confidence` | How strong the strongest causal link to this result is |
| `extractionAge` | How long ago the supporting evidence was extracted |
| `lastAccessAge` | How recently anything in the chain was used |
| `orphan` | True when nothing else in the graph points at this result |
| `weightHistoryChanged` | True when the underlying edge weight has been re-tuned |

If the database is unreachable the formatter quietly skips badges instead of failing. Caller-provided badges pass through untouched, and every response profile (`quick`, `research`, `resume`) keeps the badges on the top result and the result list.

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

Our CocoIndex is forked. The Python wrapper that powers semantic search is a soft-fork at version `0.2.3+spec-kit-fork.0.2.0`, vendored alongside the skill so it ships with this repo; the Rust engine underneath stays on PyPI. The fork adds four things the upstream wrapper doesn't: duplicate suppression so mirror copies of the same file don't crowd results, canonical path identity per chunk (so dedup works across symlinks), a path-class taxonomy that nudges "find me the implementation of X" toward implementation files first, and ranking telemetry that surfaces *why* each result ranked where it did. Responses from the MCP tool or `ccc search` CLI carry seven fork-specific fields — `source_realpath`, `content_hash`, `path_class`, `dedupedAliases`, `uniqueResultCount`, `raw_score`, `rankingSignals` — that vanilla cocoindex output does not include. Schema, attribution, and per-release patch list all live under [`.opencode/skill/mcp-coco-index/`](.opencode/skill/mcp-coco-index/).

&nbsp;
#### How the Code Graph Works

The Code Graph is a SQLite-backed structural index that ships as part of the Spec Kit MCP server (`context-server.ts`). It is available to **every supported CLI** - Claude Code, Codex CLI, Gemini CLI, and GitHub Copilot - because each runtime connects to the same MCP server via its own config (`.claude/mcp.json`, `.mcp.json`, `.codex/config.toml`, `.agents/mcp.json`).

**Startup injection.** When the MCP server starts, it initializes the `code-graph.sqlite` database, runs a non-blocking startup scan, and activates a file watcher. All four supported runtimes (Claude Code, Gemini CLI, GitHub Copilot, Codex CLI) transport the same compact startup shared-payload through their runtime hooks (`session-prime.ts` on Claude/Gemini/Copilot, `session-start.ts` on Codex). The payload includes a one-line health summary, `graphQualitySummary` (detector provenance + edge-enrichment summary), and the `sharedPayloadTransport` envelope so downstream consumers receive identical structural context regardless of runtime. `session_bootstrap()` remains available as a manual recovery surface when native hooks are disabled.

**Auto-indexing.** The graph stays current through three mechanisms:
1. **Startup scan** - indexes on server boot (async, non-blocking)
2. **File watcher** - Chokidar monitors spec and source folders with a 2-second debounce, reindexing changed files in real time
3. **Lazy refresh** - `code_graph_query` calls `ensureCodeGraphReady()` which detects staleness and triggers a bounded inline refresh before returning results

The indexer uses tree-sitter to parse source files and extract functions, classes, imports, and call relationships. It tracks per-file content hashes to skip unchanged files, making incremental scans fast.

&nbsp;
#### Readiness & Response Contract

`code_graph_query` and `code_graph_context` share a readiness-aware response contract. When the graph is fresh enough, both return `status: "ok"` with resolved results plus a `readiness` / `canonicalReadiness` / `trustState` block. When readiness requires a full scan that cannot run inline, both return an explicit **`status: "blocked"`** payload naming `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, `degraded`, and `graphAnswersOmitted` instead of silently returning empty results. Callers should run `code_graph_scan` before retrying.

Success payloads of `code_graph_context` carry structured `data.metadata.partialOutput` (`isPartial`, `reasons`, `omittedSections`, `omittedAnchors`, `truncatedText`) and an explicit `deadlineMs` field so callers can distinguish a complete answer from one trimmed by deadline or budget pressure. `code_graph_status` exposes `graphQualitySummary` (detector provenance + edge-enrichment confidence). CALLS queries on ambiguous subjects (e.g. `handle*`) prefer callable implementation nodes over wrapper-shadow candidates, and return ambiguity / selected-candidate metadata so callers can audit the choice.

&nbsp;
#### Edge Explanations and Better Blast Radius

Relationship answers from `code_graph_query` include short `reason` and `step` fields alongside confidence and provenance, so you can see *why* an edge is there instead of just *that* it exists. `code_graph_context` carries those same fields through to structured edges and text briefs.

`blast_radius` keeps the prior payload (affected files, source files, hot files, multi-file union, depth) and adds:

- **`depthGroups`** — affected nodes bucketed by how far they sit from the change
- **`riskLevel`** — `high` when the subject is ambiguous or fans out to more than 10 things at depth one, `medium` for 4–10, `low` otherwise
- **`minConfidence`** filter — drop traversals below a confidence floor
- **`ambiguityCandidates`** — list of plausible matches when the subject can't be resolved
- **`failureFallback`** — structured info instead of a bare error string when resolution can't continue

All of this rides inside the existing `code_edges.metadata` JSON blob — no SQLite schema changes.

&nbsp;
#### `detect_changes` — Preflight Impact Check

`detect_changes` is a read-only Code Graph tool that takes a diff and tells you which symbols and files it touches. It runs alongside `code_graph_scan`, `code_graph_query`, `code_graph_status`, and `code_graph_context`.

You hand it `{ diff: string, rootDir?: string }`. It walks each diff hunk, overlaps the line ranges with stored symbols, and returns `{ status, affectedSymbols[], affectedFiles[], blockedReason?, timestamp, readiness }`.

Safety is non-negotiable: the tool checks the graph is fresh before parsing the diff. If the graph is stale or unavailable, it returns `status: 'blocked'` immediately — you never get a false "nothing impacted" answer from an out-of-date index. Inline indexing is explicitly disabled here, so the read-only contract is enforced.

Under the hood the scan runner is split into four declared phases (`find-candidates` → `parse-candidates` → `finalize` → `emit-metrics`) for clearer instrumentation, with no SQLite schema changes.

The code graph runtime has its own feature catalog and operator playbook under [code_graph/feature_catalog/](.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/) and [code_graph/manual_testing_playbook/](.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/). They document 17 runtime features and 15 manual scenarios for freshness, scan/verify/status, `detect_changes`, context retrieval, coverage graph, CCC, and doctor-code-graph behavior.

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

The Skill Advisor matches what you type to the right skill before any tool runs. It's the native gate-2 router, packaged as a TypeScript MCP module at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/`. Four tools cover the surface: `advisor_recommend` for routing, `advisor_rebuild` for explicit stale-state repair, `advisor_status` for health, and `advisor_validate` for measurement. A small Python compatibility shim still works as a fallback when the native path is unavailable.

Current shipped baseline: **80.5% full-corpus accuracy**, **77.5% holdout accuracy**, **UNKNOWN ≤ 10**, **0 regressions on previously-correct prompts**.

#### How It Works

```
  YOU TYPE: "use figma to export designs"
                      │
                      ▼
           ┌──────────────────────┐
      1.   │  NORMALIZE           │  Clean up the prompt; never store
           │                      │  the raw text
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      2.   │  5-LANE FUSION       │  Explicit author signals 0.45
           │                      │  Lexical match 0.30
           │                      │  Causal graph 0.15
           │                      │  Derived hints 0.10
           │                      │  Semantic shadow 0.00
           └──────────┬───────────┘
                      ▼
      ┌───────────────────────────────┐
      │  3. FRESHNESS + LIFECYCLE     │  Is each candidate still alive?
      │                               │  live / stale / absent / archived
      │  Reads SQLite skill graph     │  with redirect metadata
      │  + generated metadata         │  Falls open on errors
      └───────────────┬───────────────┘
                      ▼
           ┌──────────────────────┐
      4.   │  VALIDATE + FILTER   │  Apply confidence + uncertainty
           │                      │  thresholds; cache the trust
           │                      │  envelope
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      5.   │  RENDER              │  Either a one-line hook brief
           │                      │  or a JSON recommendation list
           └──────────┬───────────┘
                      ▼
                RESULT:
           advisor_recommend -> list of skill recommendations
           hook adapter -> "Advisor: live; use ..."
           shim fallback -> legacy JSON
```

&nbsp;
#### Native Package Layout

```text
.opencode/skill/system-spec-kit/mcp_server/skill_advisor/
├── bench/      benchmarks
├── compat/     stable compatibility entry for runtimes
├── handlers/   the four MCP tool handlers
├── lib/        scorer, normalizer, freshness, cache
├── schemas/    JSON + Zod schemas
├── tests/      test suite
└── tools/      tool registration
```

| Tool | What it does |
|------|--------------|
| `advisor_recommend` | Recommends skills for a prompt with lane breakdown, lifecycle redirects, and a freshness trust signal. Returns the workspace root and the effective thresholds it used. |
| `advisor_rebuild` | Rebuilds the advisor skill graph when `advisor_status` reports stale, absent, or unavailable state; `force:true` rebuilds even when live. |
| `advisor_status` | Reports freshness, generation, trust state, lane weights, skill count, last scan time, and background daemon status. |
| `advisor_validate` | Runs measurement slices: corpus accuracy, holdout, parity, safety, latency. Surfaces the workspace root, effective thresholds, threshold semantics (aggregate vs runtime), and prompt-safe outcome counts (accepted / corrected / ignored). |

&nbsp;
#### How Runtimes Talk To It

- **Claude Code, Copilot CLI, Gemini CLI, Codex CLI** — call prompt-time hook adapters under `.opencode/skill/system-spec-kit/mcp_server/hooks/`.
- **OpenCode** — uses `.opencode/plugins/spec-kit-skill-advisor.js` with `spec-kit-skill-advisor-bridge.mjs`, which imports the stable compat entry at `skill-advisor/compat/index.ts`.
- **Codex cold starts** — the Codex prompt hook emits a prompt-safe stale advisory plus `{"stale":true,"reason":"timeout-fallback"}` when startup context times out; the smoke helper lives at [freshness-smoke-check.ts](.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts).
- **Disable everywhere** — set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to turn off all prompt-time advisor surfaces.
- **Threshold contract at the prompt** — confidence ≥ 0.8 and uncertainty ≤ 0.35 by default.

&nbsp;
#### Validation and Testing

- `advisor_validate({"skillSlug":null})` returns measured corpus / holdout / parity / safety / latency slices plus prompt-safe outcome totals.
- Python compatibility regression suite: 52 / 52 passing.
- Native package: 23 advisor test files, 167 tests.
- Manual testing playbook: 17 scenarios spanning native MCP tools, runtime hooks, the OpenCode plugin, compatibility controls, and operator-state edge cases.
- Hook diagnostics write to bounded JSONL sinks under the temp metrics root; the validator reads those sinks back across processes.

&nbsp;
#### Affordance Evidence

Callers can pass structured tool and resource hints — `skillId`, `name`, `triggers[]`, `category`, `dependsOn[]`, `enhances[]`, `siblings[]`, `prerequisiteFor[]`, `conflictsWith[]` — as affordance evidence. A normalizer strips URLs, emails, token-shaped fragments, control characters, and instruction-shaped strings before the scorer sees anything; free-form `description` text is ignored on purpose. Sanitized triggers feed the existing derived-hints lane at reduced weight, and normalized relations become temporary edges in the existing causal-graph lane reusing the standard relation multipliers (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`). No new scoring lane, no new entity kind, no raw matched phrases in recommendation payloads — evidence labels stay as stable `affordance:<skillId>:<index>` identifiers.

For details, see the [Skill Advisor README](.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md).

---

### 🎯 Skills Library

19 skills in `.opencode/skill/`, loaded on demand when Gate 2 matches a task (confidence >= 0.8 means the skill must be loaded).

#### DOCUMENTATION

**system-spec-kit**
- Mandatory orchestrator for all file modifications - activates automatically for any code file change
- Creates numbered spec folders with manifest templates rendered through Level contracts across 4 levels (1-3+)
- Integrates the 54-tool memory and code-graph surface with constitutional-tier support, session bootstrap, and hybrid 5-channel retrieval
- Manages the manifest template source, 20 validation rules, the spec-kit script suite, and the feature-catalog / testing-playbook documentation surfaces

**sk-doc**
- Unified markdown specialist with DQI quality scoring (Structure 40%, Content 35%, Style 25%)
- HVR v0.210 compliance checking and component creation workflows (skills, agents, commands)
- Handles README templates, frontmatter validation, feature catalog authoring, install guide generation

&nbsp;
#### CODE WORKFLOW

**sk-code**
- Smart-routing umbrella for application code work — detects stack first then classifies intent and loads stack-aware resources
- Three owned stacks: WEBFLOW (live — full content + Lighthouse/TBT/INP targets + CDN deployment), NEXTJS (stub — Next.js 14 + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI scaffolding), GO (stub — gin + sqlc + Postgres + golang-jwt scaffolding)
- Cross-stack pairing doc captures the Next.js↔Go API contract (JWT handoff, error envelope, CORS, deploy topology)
- Other stacks (Node.js, React Native, Swift) fall through to UNKNOWN disambiguation
- 3 mandatory phases: implementation → testing/debugging → verification

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

**sk-deep-research** 
- Autonomous research investigation system with iterative LEAF cycles
- Fresh context per iteration, externalized JSONL state, 3-signal convergence detection (Rolling Average + MAD Noise Floor + Coverage/Age)
- Semantic coverage graph with 7 relation types, question coverage tracking, sourceDiversity and evidenceDepth guards
- Progressive synthesis, negative knowledge preservation, quality guards (source diversity, focus alignment, weak-source checks)
- Fail-closed corruption handling, graph convergence fallback scoring, terminal stop metadata parsing
- Lifecycle modes: `new`, `resume`, `restart`. Dispatched by `/spec_kit:deep-research` command

**sk-deep-review** 
- Autonomous code quality auditing system with iterative LEAF cycles
- P0/P1/P2 severity-weighted findings across 4 dimensions (Correctness, Security, Traceability, Maintainability)
- 3-signal convergence model, P0 override blocks stop, adversarial self-check (Hunter/Skeptic/Referee)
- Binary quality gates (evidence, scope, coverage), graph-aware legal-stop checks, semantic coverage graph
- 9-section review report with PASS/CONDITIONAL/FAIL verdict
- Fail-closed corruption, claim-adjudication `finalSeverity`, stale STOP veto auto-clearing
- Lifecycle modes: `new`, `resume`, `restart`. Dispatched by `/spec_kit:deep-review` command

&nbsp;
#### CROSS-AI CLI

These skills let you run **cross-CLI agent teams from any starting CLI**. Whichever assistant you're talking to (Claude Code, Codex, Copilot, Gemini, OpenCode, raw shell), it can dispatch the other AI CLIs as specialist sub-tools — each one a one-shot non-interactive call that streams structured output back to the caller. The conducting AI stays in charge; the dispatched CLI handles the part it's best at and returns. Use this to compose a Gemini web search + Codex implementation + Claude review pipeline from inside any one of them.

> **Self-invocation guard:** every skill refuses to call itself. A Claude Code session never dispatches `cli-claude-code`, an OpenCode session never dispatches `cli-opencode`, etc. Cross-AI delegation only — no cycles.

**cli-gemini**
- Gemini CLI orchestrator. Use it for **real-time web search via Google Search grounding** — no other CLI skill has this — and for analyzing very large codebases (1M+ token context).
- Single model: `gemini-3.1-pro-preview`.

**cli-codex**
- OpenAI Codex CLI orchestrator. Use it for **code generation, diff-aware review (`/review`), web browsing (`--search`), and screenshot analysis (`--image`)**. Supports session resume/fork, agent profiles, and cost control via `--max-budget-usd`.
- Default model: `gpt-5.5` at medium reasoning, fast service tier. `gpt-5.3-codex` and other GPT-5.x variants available via override.

**cli-claude-code**
- Claude Code CLI orchestrator. Use it for **extended thinking (chain-of-thought), surgical diff-based edits, and JSON-schema-validated structured output**. Ships with 9 built-in agents and session continuity.
- Three models: `claude-opus-4-6` (deep reasoning), `claude-sonnet-4-6` (default, balanced), `claude-haiku-4-5` (fast/cheap).

**cli-copilot**
- GitHub Copilot CLI orchestrator. Use it for **autopilot autonomous execution, cloud delegation via `/delegate`, MCP server integration, and Explore/Task agents** for architecture mapping. Native GitHub ecosystem perspective (repo memory, PR awareness).
- Default model: `gpt-5.4`. Other surfaced models: `gpt-5.5`, `gpt-5.3-codex`, `claude-opus-4.7`, `claude-sonnet-4.6`, `gemini-3.1-pro-preview` (5 picks across OpenAI / Anthropic / Google).

**cli-opencode**
- OpenCode CLI orchestrator. Use it when the dispatched task needs **the project's full plugin / skill / MCP / Spec Kit Memory runtime** — a one-shot `opencode run` boots every plugin in `opencode.json`, every skill under `.opencode/skill/`, every MCP server, and the memory database. Also handles **parallel detached sessions** (`--share --port N` for ablation suites, worker farms) and **cross-repo dispatch** (`--dir <path>`).
- Three providers: `github-copilot` (default, with `gpt-5.4` default + `claude-sonnet-4.6` alternative), `opencode-go` (DeepSeek + GLM/Kimi/Qwen via gateway), `deepseek` (direct DeepSeek API).

&nbsp;
#### MCP INTEGRATION

**mcp-code-mode**
- MCP orchestration engine providing access to 200+ external tools through a single TypeScript interface
- Reduces context overhead by 98.7% by loading external tool schemas on demand
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

&nbsp;
#### OTHER

**sk-improve-prompt**
- Prompt engineering specialist auto-selecting from 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- DEPTH thinking methodology with 3-10 iteration rounds of progressive refinement
- CLEAR quality scoring: Clarity, Logic, Expression, Reliability (40+/50 pass threshold)

**sk-improve-agent** 
- Evaluator-first agent improvement with 5-dimension integration-aware scoring (structural, ruleCoherence, integration, outputQuality, systemFitness)
- Integration scanner discovers all surfaces an agent touches (canonical, mirrors, commands, YAML, skills)
- Dynamic profile generator derives scoring rubric from any agent's own rules, no hardcoded profiles needed
- Proposal-first: candidates written to packet-local runtime areas, canonical target untouched until guarded promotion
- Guarded promotion with scoring, benchmark, repeatability and operator approval gates. Rollback support.
- Dimensional progress tracking with plateau detection (3+ identical scores triggers stop)
- All scoring is deterministic (regex/string/file-existence), no LLM-as-judge, safe for promotion gates
- Legal-stop events, session-boundary gate, `plateau` stop reason, dashboard sections for journal/lineage/coverage

---

### 🤖 Agent Network

11 custom specialist agents. Defined in `.opencode/agent/` (source of truth), mirrored for Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`), and Gemini CLI (`.gemini/agents/`) runtime surfaces.

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

**Code**
- Stack-aware application-code implementation specialist (write-capable LEAF, `mode: subagent`, `task: deny`)
- Delegates stack detection to `sk-code` baseline + at most one `sk-code-*` overlay; never bakes stack rules into the agent body
- 7 dispatch modes: full implementation / surgical fix / refactor only / test add / scaffold new file / rename-move / dependency bump
- 5-dimension acceptance rubric (100 pts total): Correctness 30, Scope-Adherence 20, Verification-Evidence 20, Stack-Pattern-Compliance 15, Integration 15
- Builder → Critic → Verifier adversarial self-check on every completion claim (challenges `DONE`, opposite axis from `@review`'s Hunter/Skeptic/Referee which challenges findings)
- Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE FROM THE ACTUAL STACK; LOW confidence strictly blocks `DONE`
- Fail-closed verification — failure returns to orchestrator, no internal retry; BLOCKED-count circuit breaker (3× BLOCKED → orchestrator offers `@debug`)
- Compact RETURN line + structured body with `escalation` classifier (NONE / UNKNOWN_STACK / SCOPE_CONFLICT / LOW_CONFIDENCE / LOGIC_SYNC / VERIFY_FAIL)
- Dispatched ONLY by `@orchestrate` via convention-floor caller-restriction (description prose + body §0 dispatch gate + orchestrate.md routing entry; not harness-enforced)

**Write**
- Documentation generation specialist for project-level docs outside spec folders
- Template-first: MUST load template before proceeding (hard gate)
- Runs `extract_structure.py` and `validate_document.py` for DQI quality scoring
- Handles READMEs, install guides, skills, agents, commands. Cannot write inside `specs/` directories.

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

23 command entry points across 6 namespaces. Each command is a Markdown entry point under `.opencode/command/**/*.md` backed by a behavioral execution spec.

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
- Validates against the 294-entry catalog structure across 22 categories

**Testing Playbook**
- Creates or updates manual testing playbook packages
- Generates scenario files with test steps, expected results and verification evidence fields
- Validates against established playbook format

The MCP server also ships explicit stress and matrix execution surfaces. Run `npm run stress` from [mcp_server/](.opencode/skill/system-spec-kit/mcp_server/) for the dedicated [stress_test/](.opencode/skill/system-spec-kit/mcp_server/stress_test/) suite, which covers search-quality, memory, skill-advisor, code-graph, session, and matrix subsystems; [matrix_runners/](.opencode/skill/system-spec-kit/mcp_server/matrix_runners/) provides five per-CLI adapters plus a manifest and meta-runner for the F1-F14 feature matrix across `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`.

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

**Code Graph**
- Diagnoses code graph readiness, stale state, and verification status; apply mode is documented in the code graph runtime playbook

**Skill Advisor**
- Checks advisor freshness, routing health, and stale-state repair paths, including when to use `advisor_rebuild`

&nbsp;
#### UTILITY

**Agent Router**
- Routes requests to external AI systems (Gemini CLI, Codex CLI, Claude Code, Copilot CLI)
- The receiving AI operates under its own system prompt - full identity adoption
- Use for cross-AI delegation where the target AI needs to behave as itself

---

### 🔌 Code Mode MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Instead of loading large external tool definitions into context, Code Mode loads them on demand through one interface (1.6k tokens) - a 98.7% reduction.

#### Native MCP Servers

Defined in `opencode.json`:

| Server | Tools | Purpose |
|--------|-------|---------|
| `spec_kit_memory` | 54 | Cognitive memory system - the memory engine + skill graph |
| `code_mode` | 7 | External tool orchestration via TypeScript execution |
| `cocoindex_code` | 1 | Semantic code search via vector embeddings |
| `sequential_thinking` | 1 | Structured multi-step reasoning for complex problems |
| **Total** | **63** | |

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
| Context tokens | Large external tool schemas loaded upfront | 1.6k (on-demand) |
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

**Q: Do I need all 19 skills installed to use the framework?**

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

A: 63 total across 4 native MCP servers, sourced from the registered MCP-dispatched tools only (internal helper handlers and any deferred / not-yet-wired handlers are intentionally excluded). The canonical count for the `spec_kit_memory` server is `TOOL_DEFINITIONS.length` in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (currently 54). Breakdown: 54 `spec_kit_memory` tools (50 local descriptors in `tool-schemas.ts` plus 4 imported Skill Advisor descriptors: `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`), 7 code mode tools, 1 semantic code search tool (`cocoindex_code`), and 1 sequential thinking tool. All server bindings are defined in `opencode.json`.
&nbsp;

**Q: What is the feature catalog?**

A: The feature catalog is a 294-entry reference across 22 categories documenting every capability of the memory system. The technical reference lives at `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`; the code graph runtime adds a package-local catalog at `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md`.

<!-- /ANCHOR:faq -->


<!-- ANCHOR:related-documents -->

---

## 6. RELATED DOCUMENTS

**Internal Documentation:**

- **[→ AGENTS.md](AGENTS.md)** - Agent routing, gate definitions, behavior rules
- **[→ Spec Kit README](.opencode/skill/system-spec-kit/README.md)** - Spec folder workflow, Level contract template set, validation rules
- **[→ MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md)** - Memory and code-graph API reference (54 tools, 7 memory layers + L8 graph/advisor + L9 coverage)
- **[→ Install Guide](.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md)** - MCP server setup, embedding providers
- **[→ Deployment Notes](DEPLOYMENT.md)** - Docker anti-patterns, Copilot notes, and session-resume auth flag
- **[→ Architecture](.opencode/skill/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.opencode/skill/sk-doc/SKILL.md)** - Documentation standards, DQI scoring
- **[→ Skills Index](.opencode/skill/README.md)** - All 19 skills with invocation patterns
- **[→ Feature Catalog](.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)** - 294-entry technical reference
- **[→ Code Graph Runtime Catalog](.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md)** - Package-local code graph runtime inventory
- **[→ Code Graph Manual Playbook](.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/manual_testing_playbook.md)** - Operator scenarios for code graph validation
- **[→ Latest System Spec-Kit Release Notes](.opencode/changelog/system-spec-kit/v3.4.0.3.md)** - Most recent shipped release notes

**External Resources:**

- **[→ OpenCode](https://github.com/sst/opencode)** - The underlying AI coding platform
- **[→ Voyage AI](https://www.voyageai.com/)** - Recommended embedding provider
- **[→ HuggingFace](https://huggingface.co/)** - Free local embedding alternative

<!-- /ANCHOR:related-documents -->


*Documentation version: 4.5 | Last updated: 2026-05-01 | Framework: 11 agents, 19 skills, 23 commands, 63 MCP tools (54 spec_kit_memory + 7 code mode + 1 CocoIndex + 1 sequential thinking; canonical source `TOOL_DEFINITIONS` in `tool-schemas.ts`; deferred / internal-only handlers do NOT count).*
