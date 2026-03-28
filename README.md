<div align="left">

# OpenCode -- AI Assistant Framework

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases)

> Multi-agent AI development framework with cognitive memory, structured documentatio, 12 agents, 18 skills, 22 commands, 42 MCP tools -- built for OpenCode, Codex CLI, Claude Code and Gemini CLI.
>
> 99.999% of people won't try this system. Beat the odds?
> Don't reward me with unwanted coffee: https://buymeacoffee.com/michelkerkmeester

</div>

---


<!-- ANCHOR:table-of-contents -->

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
  - [3.1 SPEC KIT DOCUMENTATION](#31-spec-kit-documentation)
  - [3.2 MEMORY ENGINE](#32-memory-engine)
  - [3.3 AGENT NETWORK](#33-agent-network)
  - [3.4 COMMAND ARCHITECTURE](#34-command-architecture)
  - [3.5 SKILLS LIBRARY](#35-skills-library)
  - [3.6 GATE SYSTEM](#36-gate-system)
  - [3.7 CODE MODE MCP](#37-code-mode-mcp)
- [4. CONFIGURATION](#4-configuration)
- [5. USAGE EXAMPLES](#5-usage-examples)
- [6. FAQ](#6-faq)
- [7. RELATED DOCUMENTS](#7-related-documents)

<!-- /ANCHOR:table-of-contents -->


<!-- ANCHOR:overview -->

---

## 1. OVERVIEW

### What is OpenCode?

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Every decision, every trade-off, every carefully reasoned choice -- lost the moment the conversation window closes. This framework fixes that.

OpenCode is a multi-agent AI development framework built on top of the [OpenCode](https://github.com/sst/opencode) platform. Think of it like giving your AI assistant a filing cabinet, a long-term memory and a team of specialists -- instead of one forgetful generalist that starts from scratch every time you open a new chat window.

The framework adds three layers on top of the base platform:

1. **Structured documentation** (Spec Kit) -- every file change gets a spec folder that records what changed, why and how. Like a lab notebook for software.
2. **Cognitive memory** (MCP server) -- a local-first memory engine that stores decisions, context and project history in a searchable database. Like a personal librarian who remembers every conversation.
3. **Coordinated agents** -- 12 specialized agents with domain expertise, routed by a gate system that loads the right skills at the right time. Like a team where the project manager delegates to the right specialist instead of doing everything alone.

**Who it is for:** Developers using AI assistants who are tired of re-explaining context every session and watching decisions disappear into chat history.


### At a Glance

- [x] **12 Agents** -- 2 built-in + 10 custom, multi-runtime. [Details](#33-agent-network)
- [x] **18 Skills** -- Code, docs, git, prompts, MCP, research, cross-AI. [Details](#35-skills-library)
- [x] **22 Commands** -- 8 spec_kit + 6 memory + 7 create + 1 utility. [Details](#34-command-architecture)
- [x] **42 MCP Tools** -- 33 memory + 7 code mode + 1 semantic search + 1 sequential thinking. [Details](#37-code-mode-mcp)
- [x] **3 Gates** -- Understanding, Skill Routing, Spec Folder. [Details](#36-gate-system)
- [x] **4 Runtimes** -- OpenCode, Codex CLI, Claude Code, Gemini CLI
- [x] **81 Templates** -- CORE + ADDENDUM v2.2
- [x] **222 Feature Catalog** -- Across 21 categories


### How This Compares

| Capability | Manual Approach | Basic AI Chat | OpenCode Framework |
|------------|----------------|--------------|-------------------|
| **Documentation** | Ad hoc, inconsistent | None | Templated spec folders at 4 levels with 20-rule validation |
| **Context across sessions** | Copy-paste from notes | Stateless | Persistent semantic memory with session recovery |
| **Search** | Ctrl+F in files | Single-pass vector | 5-channel hybrid fused with Reciprocal Rank Fusion |
| **"Why" queries** | Grep through commit messages | Not possible | Causal graph with 6 relationship types and community detection |
| **Save quality** | Accept everything | Accept everything | 3-layer gate: structure, semantic sufficiency, duplicate check |
| **Forgetting curve** | Everything treated equally | None | FSRS power-law decay tuned by content type and importance tier |
| **Query understanding** | Keyword match | Keyword match | Intent classification (7 types), complexity routing, query decomposition |
| **Agent coordination** | One generalist | One generalist | 12 specialists with gate-driven routing and skill auto-loading |
| **Access control** | Filesystem permissions | None | Shared memory spaces with deny-by-default membership |
| **Evaluation** | Manual testing | None | Ablation studies, 12-metric computation (MRR, NDCG), synthetic ground truth |


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

### Quick Navigation

- **Get started with the framework** -- [Quick Start](#2-quick-start)
- **Learn about spec folder workflows** -- [3.1 Spec Kit Documentation](#31-spec-kit-documentation)
- **Understand the memory system** -- [3.2 Memory Engine](#32-memory-engine)
- **See all agents and their roles** -- [3.3 Agent Network](#33-agent-network)
- **Browse available commands** -- [3.4 Command Architecture](#34-command-architecture)
- **Find the right skill for a task** -- [3.5 Skills Library](#35-skills-library)
- **Understand how requests are validated** -- [3.6 Gate System](#36-gate-system)
- **Work with external tools (Figma, GitHub, etc.)** -- [3.7 Code Mode MCP](#37-code-mode-mcp)
- **Configure the framework** -- [4. Configuration](#4-configuration)

<!-- /ANCHOR:overview -->


<!-- ANCHOR:quick-start -->

---

## 2. QUICK START

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode-spec-kit-framework.git
cd opencode-spec-kit-framework

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

The memory engine needs an embedding provider to turn text into searchable vectors. Choose one:

```bash
# Option A: Voyage AI (recommended -- best quality)
export VOYAGE_API_KEY="your-key-here"

# Option B: OpenAI embeddings
export OPENAI_API_KEY="your-key-here"

# Option C: HuggingFace Local (free, no API key needed)
# No setup required -- auto-detected when no API keys are set
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

This creates a spec folder, runs research, builds a plan and begins implementation -- all with memory saved automatically. When you come back tomorrow, the memory engine remembers everything.

<!-- /ANCHOR:quick-start -->


<!-- ANCHOR:features -->

---

## 3. FEATURES

### 3.1 SPEC KIT DOCUMENTATION

The Spec Kit is a documentation framework that enforces structured spec folders for every file change. Think of it like a lab notebook for software -- before you run an experiment, you write down what you plan to do. Before an AI modifies code, it documents what it plans to change.

Every conversation that modifies files gets a spec folder. Gate 3 in the project's AGENTS.md enforces this -- the AI assistant asks "Which spec folder?" before any file modification begins. The only exemptions are single-file fixes under 5 characters (typo or whitespace corrections).


#### Documentation Levels

Not every change needs the same amount of paperwork. A one-line bug fix does not need an architecture decision record. A multi-system refactor does. Spec Kit uses four levels to match documentation depth to task complexity.

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

- **P0** — Hard blocker. Cannot ship without this. Cannot defer.
- **P1** — Required. Must complete or get explicit user approval to defer.
- **P2** — Optional. Nice to have. Can defer without approval.


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

- **Exit 0** — All rules pass. Ready to proceed.
- **Exit 1** — Warnings found. Review and fix if practical.
- **Exit 2** — Errors found. Must fix before claiming completion.

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders.


#### CORE + ADDENDUM Template Architecture (v2.2)

Templates compose from a CORE layer plus level-specific ADDENDUM layers. Each level inherits from the level below and adds what it needs -- like building blocks that stack.

```text
Level 1:  CORE only               → 4 files, ~455 LOC
Level 2:  CORE + L2-VERIFY        → 6 files, ~875 LOC  (adds checklist.md)
Level 3:  CORE + L2 + L3-ARCH     → 7 files, ~1090 LOC (adds decision-record.md)
Level 3+: CORE + all addendums    → 7 files, ~1350 LOC (adds governance extensions)
```

**Core Templates (4):**
- **`spec-core.md`** — What the feature is, why it exists, requirements and success criteria
- **`plan-core.md`** — How to implement: architecture, phases, testing strategy
- **`tasks-core.md`** — Step-by-step task breakdown with status tracking
- **`impl-summary-core.md`** — Post-implementation record of what changed and verification results

**Addendum Layers (4):**
- **`level2-verify/`** (Level 2+) — Quality gates, NFRs, edge cases, checklist template
- **`level3-arch/`** (Level 3+) — Architecture decisions, ADRs, risk matrix
- **`level3plus-govern/`** (Level 3+) — Enterprise governance, AI protocols, sign-off sections
- **`phase/`** (Any level) — Phase decomposition headers for parent/child folders

**Special Templates (4):**
- **`context_template.md`** (~26K) — Memory context template with standard ANCHOR sections
- **`research.md`** (~20K) — Deep research template for autonomous investigation
- **`handover.md`** — Session continuity template for handing off to the next AI
- **`debug-delegation.md`** — Debug delegation template for fresh-perspective troubleshooting

Templates use ANCHOR markers (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) to mark logical sections. Validation checks for required anchors, proper section ordering and template version alignment.


#### Scripts and Validation

<details>
<summary><strong>Spec Management Scripts</strong> (12 in <code>scripts/spec/</code>)</summary>

- **`create.sh`** — Create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** — Run 20 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** — Inject addendum templates to upgrade a folder to a higher level
- **`recommend-level.sh`** — Analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** — Calculate spec folder completeness as a percentage
- **`check-completion.sh`** — Verify all completion criteria are met
- **`check-placeholders.sh`** — Find remaining `[PLACEHOLDER]` values after level upgrade

</details>

<details>
<summary><strong>Memory Scripts</strong> (10 in <code>scripts/memory/</code>)</summary>

- **`generate-context.ts`** — Primary workflow for saving session context to memory files
- **`backfill-frontmatter.ts`** — Add missing frontmatter to existing memory files
- **`reindex-embeddings.ts`** — Rebuild embedding vectors for stored memories
- **`cleanup-orphaned-vectors.ts`** — Remove vector entries with no matching memory
- **`rebuild-auto-entities.ts`** — Regenerate auto-extracted entity catalog
- **`validate-memory-quality.ts`** — Run quality checks on stored memory content

</details>

TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.

For the full spec folder workflow, template architecture (81 templates) and validation rules, see the [Spec Kit README](.opencode/skill/system-spec-kit/README.md).


### 3.2 MEMORY ENGINE

The Memory Engine is a local-first cognitive memory system built as an MCP server. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task -- except this librarian never forgets, understands synonyms, tracks cause-and-effect chains and knows which notes are getting stale.

**How it works:** Memory files are created via `generate-context.js` and stored in spec folders. The MCP server indexes them with vector embeddings, BM25 and FTS5 full-text search. When you start a session, `memory_match_triggers()` surfaces relevant prior context automatically.

The memory engine uses a 222-feature pipeline developed across a 19-phase refinement program. The full 33-tool API reference is in the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).


#### 33 Tools Across 7 Layers

The MCP tools are organized into a layered architecture. Each layer has a token budget that controls how much context it consumes:

| Layer | Name | Tools | Token Budget | Purpose |
|-------|------|-------|-------------|---------|
| **L1** | Orchestration | 1 | 2,000 | `memory_context` -- unified entry point for all retrieval |
| **L2** | Core | 4 | 1,500 | Search, quick search, trigger matching, save |
| **L3** | Discovery | 3 | 800 | List, stats, health checks |
| **L4** | Mutation | 4 | 500 | Delete, update, validate, bulk delete |
| **L5** | Lifecycle | 8 | 600 | Checkpoints, shared spaces, enable/status |
| **L6** | Analysis | 8 | 1,200 | Causal graph, epistemic baselines, ablation, dashboard |
| **L7** | Maintenance | 5 | 1,000 | Index scan, learning history, async ingestion (start/status/cancel) |
| | **Total** | **33** | **7,600** | |

Lower layers load only when needed. L1 is always available. L2 loads for any search. L3-L7 load based on the specific command being used.


#### 3.2.1 HYBRID SEARCH

When you search, the system checks five sources at once. Think of a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet, the recommendation board and the "related topics" corkboard all at the same time.

- **Vector** — Compares meaning via embeddings (Voyage AI 1024d). Good for finding related content even when words differ.
- **FTS5** — Full-text search on exact words and phrases. Good for specific terms and error messages.
- **BM25** — Keyword relevance scoring. Good for ranking when you know roughly what you want.
- **Causal Graph** — Follows cause-and-effect links between memories. Good for "Why did we choose this?" questions.
- **Degree** — Scores by graph connectivity, weighted by edge type (`caused`=1.0, `enabled`=0.75, `supports`=0.5). Good for finding important hub decisions (capped to prevent over-influence).

**Reciprocal Rank Fusion (RRF)** combines all channel results using `1/(K + rank)`. K is tuned per query intent through sensitivity analysis across values {10, 20, 40, 60, 80, 100, 120}. A memory that scores well in multiple channels rises to the top because RRF gives exponential weight to high-ranking items while still including lower-ranked contributions.

**Channel min-representation** guarantees every active channel gets at least one result in the final set, preventing a single dominant channel from drowning out useful evidence.

**Quality-aware 3-tier fallback** escalates automatically when results are weak:

- **Tier 1** — Vector only. Default fast path for simple queries.
- **Tier 2** — Vector + BM25. Kicks in when results fall below confidence floor.
- **Tier 3** — All 5 channels. Activates when Tier 2 still returns poor results.

**Confidence truncation** cuts off results at 2x the median score gap so you never get a long tail of irrelevant items. **Evidence gap detection** (TRM Z-score) flags when retrieved memories do not adequately cover the query and suggests broadening the search. **Calibrated overlap bonus** rewards memories found by multiple channels at once. **Tool-level TTL cache** remembers recent results for 60 seconds with automatic invalidation on writes.


#### 3.2.2 SEARCH PIPELINE

Every search goes through four stages. Each stage has one clear job and cannot change results from earlier stages.

**Stage 1 -- Gather** candidates from active channels in parallel. Constitutional-tier memories always inject regardless of score.

**Stage 2 -- Score and fuse** using RRF plus eight post-fusion scoring signals:

- **Co-activation boost** `+0.25` — Memories co-occurring with matched results get a lift. Fan-effect `1/sqrt(neighbors)` prevents hub bias.
- **FSRS decay** `multiplicative` — Adjusts score by memory retrievability. Recently accessed memories score higher.
- **Interference penalty** `-0.08/neighbor` — Suppresses near-identical memory clusters (>0.75 Jaccard similarity).
- **Cold-start boost** `+0.15 max` — Fresh memories (<48h) get `0.15 * exp(-elapsed/12)`, 12h half-life, capped at 0.95.
- **Session recency** `cap 0.20` — Memories accessed in the current session get a recency bump.
- **Causal 2-hop** `variable` — Memories 1-2 hops from causal neighbors get a contextual boost.
- **Intent weights** `variable` — Each of 7 task intents has its own channel weight profile.
- **Channel min-rep** `0.005` — Floor ensures each active channel has at least one result.

All channel scores are normalized to 0-1 before fusion so no single channel wins because its scale is bigger.

**Stage 3 -- Rerank** using a cross-encoder model that runs locally via node-llama-cpp (GGUF format). No cloud API needed. If your machine lacks VRAM, the reranker gracefully skips and Stage 2 order stands. MPAB (Multi-Pass Aggregation with Boundary) collapses individual chunks back to their parent memory -- the best chunk counts most, but documents with multiple matching chunks rank higher than a single lucky hit.

**Stage 4 -- Filter and annotate**. Enforces score immutability (no score changes after Stage 2). Applies state filtering by minimum state parameter. Annotates results with confidence labels (high/medium/low) and feature flag states.


#### 3.2.3 QUERY INTELLIGENCE

Before any search runs, the system figures out what kind of help you need. Think of it like a triage nurse who reads your symptoms and routes you to the right specialist.

**Complexity routing** sizes up your question and picks the right amount of effort:

- **Simple** (2 channels, 800 tokens) — Quick lookups, single-topic questions
- **Moderate** (4 channels, 1,500 tokens) — Multi-factor questions, debugging
- **Complex** (all 5 channels, 2,000 tokens) — Research, architecture decisions

**Intent classification** maps your query to one of 7 task types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`). Each type has its own channel weight profile. A `find_decision` query boosts the causal graph channel. A `fix_bug` query boosts exact-match channels.

**Query decomposition** splits multi-topic questions into focused sub-queries. Each searches separately and results merge. No LLM call needed.

**Query expansion** automatically adds related terms when the question is complex, so you find relevant results even when the exact wording differs.

**Index-time query surrogates** pre-generate alternative names, summaries and likely questions about content when a memory is first saved. These are stored alongside the original so future searches match against them too. Like a library cataloger adding subject headings and cross-references to a new book.

**Context pressure monitoring** watches how full your context window is getting. Above 60% usage the system downgrades to focused mode. Above 80% it switches to quick mode.

For low-confidence deep searches, two fallback strategies kick in:

- **LLM query reformulation** -- asks the LLM to rephrase the query more abstractly, grounding in actual knowledge base content
- **HyDE (Hypothetical Document Embeddings)** -- writes a hypothetical answer to your question, then searches for real documents matching that imaginary answer

**Mode-aware response profiles** format results differently depending on what you are doing:

- **`quick`** — Top answer only, minimal context. For fast lookups and single-topic questions.
- **`focused`** — Targeted results for one topic. For standard development queries.
- **`deep`** — Full results with evidence trails. For research and architecture decisions.
- **`resume`** — State summary + next-steps. For session recovery after crash or compaction.


#### 3.2.4 MEMORY LIFECYCLE AND SCORING

Memories fade using FSRS (Free Spaced Repetition Scheduler), a model validated on 100M+ Anki flashcard users. The formula `R(t, S) = (1 + (19/81) x t/S)^(-0.5)` calculates a retrievability score where `t` is time since last access and `S` is a stability parameter.

Think of it like how your own brain works: things you reviewed recently are easy to recall, while things you have not thought about in months fade into the background.

**Two-dimensional decay matrix** -- decay speed is controlled by context type AND importance tier:

| | constitutional | critical | important | normal | temporary | deprecated |
|---|---|---|---|---|---|---|
| **Decisions** | Never | Never | 1.5x | 1x | 0.5x | 0.25x |
| **Research** | Never | 2x slower | 1.5x | 1x | 0.5x | 0.25x |
| **General** | Never | 1.5x slower | Slow | Normal | Fast | Fastest |

A critical decision never fades. A temporary debugging note fades within days.

**Cold-start novelty boost** -- fresh memories (under 48 hours) get an exponential boost of `0.15 * exp(-elapsed_hours / 12)` with a 12-hour half-life, capped at 0.95.

**Interference penalty** -- prevents similar memories from flooding results together. If several memories in the same spec folder share more than 75% Jaccard similarity, each additional neighbor costs -0.08 points.

**Auto-promotion** -- memories earn their way up. After 5 positive validation marks, a normal memory promotes to important. After 10, important promotes to critical. Rate-limited to prevent bulk promotion during busy sessions.

**Negative feedback with 30-day decay** -- demotes unhelpful memories, but the penalty fades over time. Prevents permanent blacklisting and allows memories to recover relevance as the project evolves.

**Five cognitive states** based on access patterns:

**HOT** (just used) >> **WARM** (recently relevant) >> **COLD** (not accessed lately) >> **DORMANT** (inactive) >> **ARCHIVED** (stored but rarely surfaced)

When you search, HOT memories get full content in results. WARM memories appear as summaries. COLD and below only show up if they score well enough to earn a spot.


#### 3.2.5 CAUSAL GRAPH


The system tracks how decisions relate to each other. Think of it like a corkboard with sticky notes connected by string. One note says "we chose JWT tokens." A string connects it to "because the session store was too slow." Another string connects that to "the Redis outage on March 5th."

**Six types of causal relationships** link memories together:

- **`caused`** `1.0` — A led directly to B
- **`enabled`** `0.75` — A made B possible
- **`supersedes`** — B replaces A
- **`contradicts`** — A and B conflict
- **`derived_from`** — B is based on A
- **`supports`** `0.5` — A provides evidence for B

**Typed-weighted degree channel** uses these weights to rank memories by graph importance. Hub caps (`MAX_TYPED_DEGREE`=15, `MAX_TOTAL_DEGREE`=50) and a `DEGREE_BOOST_CAP` of 0.15 prevent any single highly-connected memory from dominating results.

**Co-activation spreading** boosts memories connected to ones you already found relevant. A fan-effect divisor (`1/sqrt(neighbor_count)`) prevents popular hub memories from getting an outsized boost.

**Community detection** (Louvain algorithm) automatically clusters related memories into groups. When one memory in a cluster is relevant, its neighbors get a small boost.

**Graph momentum** tracks how quickly a memory is gaining new connections. Trending knowledge surfaces higher than static nodes.

**Temporal contiguity** gives a time-proximity boost to memories created around the same time. If one memory from a Tuesday afternoon session is relevant, others from that same session probably are too.

**Typed traversal** pays attention to what kind of connection it follows based on your question. A "what caused this bug?" query prioritizes cause-and-effect links. A "what supports this decision?" query prioritizes evidence links.

**Causal depth signals** measure how deep each memory sits in the decision tree. Root decisions (with many descendants) get different tiebreaker boosts than leaf tasks.

**Async LLM graph backfill** uses an AI to read important documents after they are saved and suggest additional causal connections that pattern matching missed. Runs in the background after initial save.


#### 3.2.6 SAVE INTELLIGENCE

When you save new knowledge, the system runs an arbitration process before storing anything.

**Prediction Error gating** compares new content against existing memories and picks one of four outcomes:

- **CREATE** — No similar memory exists. Stored as new knowledge.
- **REINFORCE** — Similar exists, new one adds value. Both kept, old one gets a confidence boost.
- **UPDATE** — Similar exists, new one is better. Old version replaced in place.
- **SUPERSEDE** — New knowledge contradicts the old. New version active, old one demoted to deprecated.

This is session-scoped to prevent cross-session interference.

**Reconsolidation-on-save** handles near-duplicates intelligently. Nearly identical content gets merged. Contradictions retire the old version. Different content keeps both.

**Semantic sufficiency gating** rejects memories too thin or lacking real evidence. Short documents with strong structural signals (clear title, proper labels) get an exception.

**Verify-fix-verify loop** runs quality checks before saving. If the memory falls short, the system tries to fix problems automatically and checks again before storing.

**Content normalization** strips formatting clutter (bullet markers, code fences, header symbols) before generating embeddings. Cleaner fingerprints match your questions more accurately.

**Auto-entity extraction** spots tool names, project names and concept names when you save and adds them to a shared catalog. Connects memories mentioning the same things even when surrounding text differs.

**SHA-256 content-hash deduplication** recognizes unchanged files instantly and skips expensive reprocessing.

**Signal vocabulary expansion** recognizes correction signals ("actually", "wait") and preference signals ("prefer", "want") in conversation context, using them to adjust quality scoring during save.

**Correction tracking** maintains a paper trail of how knowledge evolved when newer memories replace older ones. When a save triggers an UPDATE or SUPERSEDE outcome, the system records the relationship between old and new versions.


#### 3.2.7 SESSION AWARENESS

The system keeps track of what happened during your current conversation so it does not repeat itself or lose context mid-session.

**Working memory with attention decay** stores findings from the current session. Each result's relevance decays by `0.85^distance` per event (where distance is how many tool calls ago it was found). Floor is 0.05, eviction at 0.01. Recent findings stay prominent while older ones fade gracefully.

**Session deduplication** pushes down results you already saw. If you got a result 3 turns ago, new searches rank it lower. Saves approximately 50% of tokens on follow-up queries.

**Context pressure monitoring** watches how full your AI's context window is getting. Above 60% usage: downgrades to focused mode. Above 80%: switches to quick mode. Prevents memory retrieval from overwhelming the conversation.


#### 3.2.8 SHARED MEMORY

By default, every memory is private to the user or agent that created it. Shared memory adds controlled access so multiple people or agents can read and write to a common knowledge pool.

Think of it like a shared office with a keycard lock. The office stays locked until an admin activates it. Only people on the access list can enter. Management can lock it down instantly if something goes wrong.

- **Spaces** -- named containers for shared knowledge (like rooms in the office)
- **Roles** -- `owner` (full control), `editor` (read/write), `viewer` (read-only)
- **Deny-by-default** -- nobody gets access unless explicitly granted
- **Kill switch** -- immediately blocks all access for emergencies

For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md).


#### 3.2.9 QUALITY GATES AND LEARNING

Before a new memory enters the system, it goes through three layered checks:

1. **Structure gate** -- does the file have the required format, headings and metadata?
2. **Semantic sufficiency gate** -- is there enough real content to be useful?
3. **Duplicate gate** -- does this already exist? If so, run Prediction Error arbitration (create, reinforce, update or supersede)

If a file fails any gate, the system rejects it with a clear explanation. Preview all checks without saving using `dryRun: true`.

**Learned relevance feedback** watches when you mark results as useful or not. Helpful results get a boost in future queries. 10 safeguards prevent noise: denylist, rate limits, 30-day decay, per-cycle caps, minimum session thresholds, one-week trial period before boosts go live.

**Result confidence scoring** tags each result as high, medium or low confidence using fast heuristics (no LLM needed). Checks: top-K separation, multi-channel agreement, quality score and source document structure.

**Two-tier explainability** -- basic mode shows a plain-language reason ("matched strongly on meaning, boosted by causal graph connection"). Debug mode shows exact channel contributions and weights.

**Empty result recovery** diagnoses why a search came back empty (too narrow filter, unclear question, missing knowledge) and suggests next steps.


#### 3.2.10 RETRIEVAL ENHANCEMENTS

**Constitutional memory as expert knowledge injection** tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."

**Spec folder hierarchy search** uses your project folder organization as a retrieval signal. If you are looking at a child folder, the system also checks parent and sibling folders for related information.

**Dual-scope memory auto-surface** watches for tool use and context compression events and automatically brings up important memories without being asked.

**Cross-document entity linking** connects memories across folders when they reference the same concept, even if the surrounding text is different.

**Memory summary search channel** creates a short summary of each memory when saved and searches against those summaries.

**Contextual tree injection** labels each result with its position in the project hierarchy ("Project > Feature > Detail") so you always know where it belongs.

**ANCHOR-based section retrieval** memory files can include `<!-- ANCHOR:name -->` markers. The search system indexes individual sections separately, allowing retrieval of just "decisions" or "next-steps" from a large document (~93% token savings).

**Provenance-rich response envelopes** (when `includeTrace` is enabled) show exactly how each result was found: which channels contributed, how scores were calculated and where the information originated.


#### 3.2.11 INDEXING AND INFRASTRUCTURE

**Real-time filesystem watching** (chokidar) monitors your project folder continuously. When you save, rename or delete a file, the index updates automatically.

**Incremental indexing with content hashing** tracks SHA-256 hashes of every indexed file. Unchanged files get skipped instantly during scans.

**Embedding retry orchestrator** when the embedding service is temporarily unavailable, the memory is saved without a vector and queued for retry. A background worker retries until it succeeds.

**Deferred lexical-only indexing** saves memories in a simpler text-searchable form when the embedding service is down. Keyword search still works. When the service returns, the system upgrades to full vector searchability automatically.

**Atomic write-then-index** writes files to a temporary location first and only moves them once confirmed. Crash-safe with pending-file recovery on startup.


#### 3.2.12 EVALUATION INFRASTRUCTURE

Research-grade infrastructure for measuring and improving search quality over time.

**12-metric core computation** grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling.

**Synthetic ground truth corpus** 110 test questions with known correct answers in everyday language plus trick questions. Makes it possible to measure objectively whether changes improve or hurt quality.

**Ablation study framework** turns off each search channel one at a time and measures quality degradation (Recall@20 delta). Identifies which components are critical.

**Shadow scoring with holdout evaluation** tests proposed ranking improvements on a fixed test set before they go live. A new approach only reaches production after it proves itself.


#### Embedding Providers

- **Voyage AI** — Set `VOYAGE_API_KEY` env var. Best quality, recommended.
- **OpenAI** — Set `OPENAI_API_KEY` env var. Strong alternative.
- **HuggingFace Local** — No setup needed. Free, auto-detected fallback.

**Local-first:** The memory database runs on your machine at `.opencode/skill/system-spec-kit/shared/mcp_server/database/`. No data leaves your system unless you configure a cloud embedding provider.

For the complete 33-tool API reference (7 layers, 7,600 total token budget) and configuration, see the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).


### 3.3 AGENT NETWORK

12 agents total: 2 built-in platform agents and 10 custom specialists. Think of them like a team where the project manager (you or the orchestrator) delegates to the right expert instead of one generalist doing everything. Each agent has a defined role, specific tool permissions and clear boundaries on what it can and cannot modify.

Custom agents are defined in `.opencode/agent/` (source of truth) and adapted for Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`) and Gemini CLI (`.gemini/agents/`). All four directories maintain the same 10 agent files, adapted for each runtime's frontmatter format.


#### All 12 Agents

<details>
<summary><strong>Built-in Agents (2)</strong></summary>

- **`@general`** — General-purpose implementation agent for complex, multi-step coding tasks. Handles feature development, bug fixes, refactoring and any work that does not require a specialist. Default fallback when no custom agent matches.
- **`@explore`** — Fast codebase exploration agent specialized for file pattern matching (`**/*.tsx`), keyword search, and answering structural questions about the codebase. Read-only. Use for quick discovery before committing to a deeper investigation.

</details>

<details>
<summary><strong>Custom Agents (10)</strong></summary>

- **`@orchestrate`** — Senior task commander with full authority over decomposition, delegation, quality evaluation and conflict resolution. Read-only permissions (cannot implement directly). Single-hop delegation only (depth 2 max). Merges sub-agent outputs into one unified response. Use for complex multi-domain tasks that need coordinated specialists.

- **`@context`** — Memory-first retrieval specialist and the exclusive entry point for ALL codebase exploration. Always checks memory before codebase (`match_triggers` → `memory_context` → `memory_search` → grep/glob). LEAF-only (never dispatches sub-agents). Read-only. Returns structured Context Packages combining memory findings with codebase evidence. Uses both CocoIndex semantic search and the 5-channel memory system.

- **`@speckit`** — The ONLY agent permitted to create or substantively write `*.md` files inside spec folders. Template-first: always copies from `templates/level_N/` (never creates from scratch). Supports Level 1-3+ documentation creation with CORE + ADDENDUM architecture, progressive enhancement, and 20-rule validation. LEAF-only. Exceptions: `memory/` (via generate-context.js), `scratch/` (any agent), `handover.md` (@handover), `research.md` (@deep-research).

- **`@debug`** — Fresh-perspective debugging specialist that receives a structured context handoff (NOT conversation history) to avoid inherited bias from failed prior attempts. Applies a systematic 5-phase methodology: Observe → Analyze → Hypothesize → Validate → Fix. Writes `debug-delegation.md` with findings. Use when 3+ prior debugging attempts have failed and tunnel vision is suspected.

- **`@deep-research`** — Autonomous research agent that executes a single iteration of the LEAF (Loop, Externalize, Analyze, Finish) protocol. State is externalized via JSONL + strategy.md. Reads current state, determines focus, executes research, writes findings, updates strategy. Loop orchestration is managed by the `/spec_kit:deep-research` command, not this agent. Has permission to write `research.md` and `scratch/` inside spec folders. Supports WebFetch for external source gathering.

- **`@deep-review`** — Autonomous code quality auditor that executes a single review iteration using LEAF architecture. Reviews code but NEVER modifies target files (read-only on code). Produces P0/P1/P2 severity-ranked findings with `file:line` evidence across 7 review dimensions. Writes only to `review/` artifacts inside the spec folder (JSONL state, strategy, dashboard, iteration artifacts). Includes adversarial self-check on all findings before finalizing.

- **`@review`** — Code quality guardian with strict READ-ONLY permissions (cannot write or edit any files). Implements the baseline + overlay standards model: loads `sk-code--review` baseline first, then exactly one `sk-code--*` overlay matching the detected stack. Security and correctness minimums are mandatory and never relaxed by the overlay. Produces findings-first severity analysis with quality scoring, pattern validation, and security assessment. Adversarial self-check on all P0/P1 findings.

- **`@write`** — Documentation generation specialist for project-level docs OUTSIDE spec folders (READMEs, install guides, skills, agents, commands). Template-first: MUST load template before proceeding (hard gate). Runs `extract_structure.py` and `validate_document.py` for DQI quality scoring. MUST NOT write inside `specs/[###-name]/` directories (that is @speckit's exclusive domain). Supports WebFetch for external reference gathering.

- **`@handover`** — Session continuation specialist that creates `handover.md` for context preservation across sessions. Has special permission to write `handover.md` inside spec folders (exception to @speckit exclusivity). Always gathers context from spec folder files BEFORE creating the handover (never creates without reading actual session state). Produces a 5-section handover format covering key decisions, blockers, current phase, and continuation instructions.

- **`@ultra-think`** — Multi-strategy planning architect that dispatches diverse thinking strategies and synthesizes the optimal plan. Uses 5 reasoning lenses: Analytical, Creative, Critical, Pragmatic, and Holistic. Each strategy must use a different lens and temperature (never identical repetition). Scores results via a 5-dimension rubric. Plans only — never modifies files directly. Depth-aware: at depth 0 dispatches via Task tool; at depth 1 uses sequential_thinking inline.

</details>

#### Runtime Agent Directories

Agent definitions live in `.opencode/agent/` (source of truth) and are adapted for each runtime:

- **OpenCode** — `.opencode/agent/` (10 files, source of truth)
- **Claude Code** — `.claude/agents/` (10 files, runtime-adapted)
- **Codex CLI** — `.codex/agents/` (10 files, runtime-adapted)
- **Gemini CLI** — `.gemini/agents/` (10 files, runtime-adapted)


### 3.4 COMMAND ARCHITECTURE


22 commands across 4 namespaces. Each command is a two-layer system: a Markdown entry point under `.opencode/command/**/*.md` for input collection and routing, backed by a behavioral execution spec that tells the AI exactly how to run the workflow.

<details>
<summary><strong>spec_kit/ — 8 Commands</strong> (spec folder lifecycle)</summary>

- **`/spec_kit:complete`** — End-to-end workflow: creates spec folder, runs research, builds plan, implements, verifies and saves memory. Supports 4 modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:with-research` (adds deep research before planning), `:auto-debug` (auto-delegates failures to @debug). The primary entry point for new features.
- **`/spec_kit:plan`** — Planning-only workflow that creates spec.md, plan.md and tasks.md without implementing. Use when you need stakeholder review before coding. Dispatches up to 4 parallel `@context` agents for codebase exploration during planning. Modes: `:auto`, `:confirm`.
- **`/spec_kit:implement`** — Executes an existing plan. Requires plan.md to already exist (run `/spec_kit:plan` first). 9-step workflow covering task breakdown, implementation, testing and verification. Modes: `:auto`, `:confirm`.
- **`/spec_kit:phase`** — Decomposes a large feature into parent and child spec folders. Creates the parent with `create.sh --phase`, populates phase metadata, and sets up parent/child navigation links. Use for features that span multiple work phases.
- **`/spec_kit:debug`** — Delegates debugging to the `@debug` agent with a structured context handoff (not conversation history). The fresh-perspective approach avoids confirmation bias from failed prior attempts. Writes `debug-delegation.md` with root cause analysis.
- **`/spec_kit:resume`** — Continues a previous session by auto-loading memory from the spec folder. Presents session summary, shows progress against tasks.md, and picks up where you left off. Works after crashes, compactions, or new sessions.
- **`/spec_kit:deep-research`** — Autonomous research loop that dispatches `@deep-research` agents iteratively until convergence. Modes: `:auto` (research), `:review` (code quality audit via @deep-review), `:review:auto`, `:review:confirm`. Externalized JSONL state enables pause/resume across sessions.
- **`/spec_kit:handover`** — Creates a session handover document for continuing work in a new conversation. Gathers key decisions, blockers, current phase and next steps from spec folder state. Variants: `:quick` (summary) or `:full` (comprehensive).

</details>

<details>
<summary><strong>memory/ — 4 Commands</strong> (cognitive memory operations)</summary>

- **`/memory:save`** — Saves current session context to a timestamped memory file via `generate-context.js`. AI composes structured JSON with session summary, key decisions and findings, then the script generates frontmatter, trigger phrases, and ANCHOR sections. Indexes immediately for future retrieval via `memory_save()` or `memory_index_scan()`.
- **`/memory:search`** — Unified retrieval and analysis entry point supporting intent-aware search, epistemic baselines (what-do-I-know checks), causal graph traversal, ablation studies (channel impact measurement), and dashboards. Routes by intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`.
- **`/memory:learn`** — Constitutional memory manager for always-surface rules that appear at the top of every search result. Lifecycle operations: create, list, edit, remove, budget. Constitutional memories carry a 3.0x boost and never decay. Use for project-wide rules, conventions, and architectural decisions that must always be visible.
- **`/memory:manage`** — Database operations: stats (memory counts, index health), health checks, cleanup (orphaned vectors, stale entries), checkpoint management (create, list, restore, delete), bulk delete, bulk ingestion (start, status, cancel), index scan, validation, and the nested `shared` namespace for shared-memory lifecycle operations. The administrative interface for the memory database.

</details>

<details>
<summary><strong>create/ — 7 Commands</strong> (component scaffolding)</summary>

- **`/create:sk-skill`** — Unified skill creation and update workflow. Creates SKILL.md with 8-section structure, README.md, references directory, and assets directory. Registers in skill catalog. Can also update existing skills or manage individual skill files. Modes: `:auto`, `:confirm`.
- **`/create:agent`** — Scaffolds a new agent definition with proper frontmatter (name, description, allowed-tools), behavioral rules, and tool permissions. Creates the source-of-truth file in `.opencode/agent/` and mirrors for Claude, Codex, and Gemini runtimes. Modes: `:auto`, `:confirm`.
- **`/create:folder_readme`** — Unified README and install guide creation using sk-doc quality standards. Auto-detects folder type, loads the appropriate template (readme_template.md or install guide), fills structure, validates via DQI scoring (Structure 40%, Content 35%, Style 25%), and applies HVR v0.210 rules. Modes: `:auto`, `:confirm`.
- **`/create:changelog`** — Creates a changelog entry by auto-detecting recent work (from spec folder artifacts or git history), resolving the correct component folder in `.opencode/changelog/`, calculating the next version number, and generating a formatted changelog file. Supports version bump auto-detection from commit keywords. Modes: `:auto`, `:confirm`.
- **`/create:prompt`** — Creates or improves AI prompts using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH thinking methodology (3-10 iteration rounds), and CLEAR quality scoring (40+/50 pass threshold). Auto-selects the best framework based on task intent. 5 output formats: text, short, json, yaml, raw.
- **`/create:feature-catalog`** — Creates or updates feature catalog packages with category routing, format validation, and template compliance. Generates both technical reference entries and simple-terms companion entries. Validates against the established 255-entry catalog structure across 21 categories.
- **`/create:testing-playbook`** — Creates or updates manual testing playbook packages with scenario structure, category assignment, and format compliance. Generates scenario files with test steps, expected results, and verification evidence fields. Validates against the established playbook format.

</details>

<details>
<summary><strong>Utility — 1 Command</strong></summary>

- **`/agent_router`** — Routes requests to external AI systems (Gemini CLI, Codex CLI, Claude Code, Copilot CLI) with full System Prompt identity adoption. The receiving AI operates under its own system prompt, not OpenCode's. Use for cross-AI delegation where the target AI needs to behave as itself rather than as an OpenCode sub-agent.

</details>


### 3.5 SKILLS LIBRARY

18 skills in `.opencode/skill/`. Skills are on-demand capabilities loaded when a task matches -- like specialist consultants who are only called in when their expertise is needed. Gate 2 runs `skill_advisor.py` to recommend the right skill (confidence >= 0.8 means it must be loaded).

<details>
<summary><strong>Documentation Skills (2)</strong></summary>

- **`system-spec-kit`** `v2.2.27.0` — The mandatory orchestrator for all file modifications. Creates numbered spec folders with CORE + ADDENDUM template architecture across 4 documentation levels (1-3+). Integrates the 33-tool Spec Kit Memory system for vector-search context preservation with constitutional-tier memory support, FSRS decay, and hybrid 5-channel retrieval. Manages 81 templates, 20 validation rules, 22 scripts, and 255 feature catalog entries across 21 categories. Activates automatically for any code file modification (JS, TS, Python, CSS, HTML, Markdown, JSON, YAML, config).

- **`sk-doc`** `v1.3.0.0` — Unified markdown specialist providing document quality enforcement via DQI scoring (Structure 40%, Content 35%, Style 25%), HVR v0.210 compliance checking, and component creation workflows. Handles 4 major workflows: document quality assessment, OpenCode component scaffolding (skills, agents, commands via `init_skill.py` and `package_skill.py`), ASCII flowchart creation, and install guide generation. Includes README templates, frontmatter validation, feature catalog authoring, manual testing playbook generation, and `llms.txt` creation for LLM navigation.

</details>

<details>
<summary><strong>Code Workflow Skills (4)</strong></summary>

- **`sk-code--full-stack`** `v1.1.0.0` — Stack-agnostic development orchestrator with automatic stack detection via marker files (`go.mod`, `Package.swift`, `next.config.js`, `package.json` patterns). Detects 7 stacks: Go, Swift, React Native/Expo, Next.js, React, Node.js, and default. Enforces the Iron Law: no completion claims without stack-specific verification commands. Routes through 3 mandatory phases: implementation → testing/debugging → verification. Integrates with sk-code--review for baseline+overlay review contracts.

- **`sk-code--opencode`** `v1.2.0.0` — Multi-language code standards for OpenCode system code with language detection routing across 5 languages: JavaScript (CommonJS `require`/`module.exports`, strict mode), TypeScript (interfaces, strict tsconfig, type guards), Python (`snake_case`, argparse, pytest, docstrings), Shell (`set -euo pipefail`, shebang, quoting), and JSON/JSONC (schema validation, commented config). Evidence-based patterns extracted from the actual OpenCode codebase with `file:line` citations. Standards-only (no full development phases).

- **`sk-code--web`** `v1.1.0.0` — Frontend development orchestrator with a 5-phase lifecycle: research → implementation → code quality → debugging → browser verification. Enforces mandatory browser testing before any completion claims with DevTools integration. Coordinates 6 specialized quality sub-skills covering style, async handling, form validation, cache-busting, and performance optimization. Targets PageSpeed, Lighthouse, TBT and INP metrics. Includes Webflow integration for CMS-based projects.

- **`sk-code--review`** `v1.2.0.0` — Stack-agnostic code review baseline implementing the baseline+overlay model. The baseline always runs first (security checklist, correctness checklist, SOLID checklist, threat model). Then exactly one overlay skill (`sk-code--opencode`, `sk-code--web`, or `sk-code--full-stack`) adds stack-specific style guidance. Security and correctness minimums are mandatory and NEVER relaxed by the overlay. Produces findings-first severity analysis with P0/P1/P2 ranking. Includes a removal-focused review option for cleanup tasks.

</details>

<details>
<summary><strong>MCP Integration Skills (5)</strong></summary>

- **`mcp-code-mode`** `v1.0.7.0` — MCP orchestration engine that provides access to 200+ external tools through a single TypeScript execution interface. Reduces context overhead by 98.7% (1.6k tokens vs 141k for 47 tools loaded individually) and speeds execution 60% faster via state persistence. Mandatory for ALL external MCP tool calls (ClickUp, Notion, Figma, Webflow, Chrome DevTools, GitHub). Progressive tool loading means zero upfront cost — tools load on first use. Type-safe with autocomplete and built-in error handling.

- **`mcp-coco-index`** `v1.0.0` — Semantic code search via vector embeddings (Voyage Code 3 and All-MiniLM-L6-v2 models) enabling natural-language discovery of code patterns and implementations across 28+ languages. Two access modes: CLI (`ccc`) for direct terminal use, and MCP server exposing a single `search` tool for AI agent integration. Ideal for onboarding, concept-based discovery when exact names are unknown, architecture exploration, module relationship mapping, and cross-codebase pattern matching.

- **`mcp-figma`** `v1.0.7.0` — Figma design file access providing 18 specialized tools across 6 categories: file access, asset export (PNG/JPG/SVG/PDF at 0.01-4x scale), design system extraction, design tokens (colors, typography, effects), collaboration (read/post/reply/delete comments), and team management. Two setup options: Official Figma MCP (HTTP, OAuth) or Framelink (stdio, local, API key auth). Enables design-to-code bridge and version history access.

- **`mcp-chrome-devtools`** `v1.0.7.0` — Chrome DevTools orchestrator with intelligent 2-mode routing. CLI mode (`bdg`, browser-debugger-cli) is prioritized for speed and token efficiency — runs in terminal, supports Unix pipes, composable in CI/CD. MCP mode is the fallback for multi-tool integration scenarios. Capabilities: screenshot capture, HAR file analysis, console log inspection, DOM query execution, cookie manipulation, JavaScript execution, network monitoring, and CDP pattern references.

- **`mcp-clickup`** `v1.0.0` — ClickUp project management orchestrator with 2-mode routing. CLI (`cu`) handles basic operations (tasks, sprints, standups) for speed. MCP handles enterprise features: docs, goals, webhooks, bulk task operations, time tracking, custom fields, and attachment management. Supports workspace discovery, list/space/folder navigation, comment threading, and sprint management with standup summaries.

</details>

<details>
<summary><strong>Cross-AI CLI Skills (4)</strong></summary>

- **`cli-gemini`** `v1.2.1` — Gemini CLI orchestrator enabling cross-AI delegation from Claude Code, Codex, or Copilot. Provides real-time web search via Google Search grounding (no other CLI skill has this), deep codebase architecture analysis leveraging 1M+ token context, parallel code generation, and second-opinion security audits. Single model: `gemini-3.1-pro-preview`. Self-invocation guard prevents Gemini CLI from invoking itself.

- **`cli-codex`** `v1.3.1` — OpenAI Codex CLI orchestrator with dual model support (`gpt-5.4` + `gpt-5.3-codex`), 7 execution profiles, and sandbox awareness. Key capabilities: `/review` command with diff-aware code review, `--search` flag for live web browsing, `--image` flag for screenshot/design analysis, session management (resume/fork for multi-turn workflows), agent profiles (`.codex/agents/*.toml`), and cost control via `--max-budget-usd`. Self-invocation guard.

- **`cli-claude-code`** `v1.1.1` — Claude Code CLI orchestrator with 3 models (Opus 4.6, Sonnet 4.6, Haiku 4.5), extended thinking with chain-of-thought, surgical diff-based code editing, and JSON schema-validated structured output. Supports 9 built-in agents, permission modes (plan-only vs full), session continuity (`--continue`, `--resume`), and cost control. Self-invocation guard.

- **`cli-copilot`** `v1.3.1` — GitHub Copilot CLI orchestrator with 5 models across 3 providers (GPT-5.4, GPT-5.3-Codex, Opus 4.6, Sonnet 4.6, Gemini 3.1 Pro). Key capabilities: Explore/Task agents for architecture mapping, `/delegate` and `&prompt` for cloud-hosted coding agents, Autopilot autonomous execution mode, MCP server integration, custom Markdown-based agent profiles, repo memory, and native GitHub ecosystem perspective. Self-invocation guard.

</details>

<details>
<summary><strong>Other Skills (3)</strong></summary>

- **`sk-deep-research`** `v1.2.0` — Dual-mode autonomous investigation system. Research mode runs iterative LEAF (Loop, Externalize, Analyze, Finish) cycles with fresh context per iteration, externalized JSONL state, convergence detection with diminishing-returns tracking, and per-iteration token budgets. Review mode reuses the same loop for automated code quality auditing, dispatching `@deep-review` agents that produce P0/P1/P2 findings across 7 dimensions. Features: persistent dashboards, quality guards blocking premature convergence, negative knowledge capture, novelty justification, diagnosis-led recovery, and pause/resume via sentinel files.

- **`sk-git`** `v1.1.0.0` — Git workflow orchestrator coordinating 3 sub-skills: **git-worktree** (workspace isolation via `git worktree add`, branch creation, parallel development), **git-commit** (conventional commit format enforcement, staged change analysis, clean commit messages with scope detection), and **git-finish** (PR creation via `gh pr create`, branch cleanup, integration workflows). Includes hotfix vs cleanup decision matrix, workspace status detection (clean/dirty handling), and branch naming conventions.

- **`sk-prompt-improver`** `v1.2.0.0` — Prompt engineering specialist that auto-selects from 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) based on task intent via keyword-weighted scoring. Applies DEPTH thinking methodology (3-10 iteration rounds of progressive refinement). Quality is measured via CLEAR scoring: Clarity, Logic, Expression, Reliability (40+/50 pass threshold). 5 output formats: text, short, json, yaml, raw. Command-prefix routing (`$improve`, `$text`, `$short`, `$refine`, `$json`, `$yaml`, `$raw`) for direct mode selection.

</details>


### 3.6 GATE SYSTEM

3 mandatory gates run before any file change. They are like a security checkpoint at an airport -- every request passes through the same sequence and each gate checks for something different. The gates are defined in `CLAUDE.md` and `AGENTS.md` and apply to all runtimes.

#### The 3 Gates

| Gate | Name | Type | What It Does |
|------|------|------|--------------|
| **Gate 1** | Understanding + Context Surfacing | SOFT BLOCK | Calls `memory_match_triggers()` to surface relevant prior context. Classifies intent as Research or Implementation. Applies dual-threshold: confidence >= 0.70 AND uncertainty <= 0.35 |
| **Gate 2** | Skill Routing | REQUIRED | Runs `skill_advisor.py` against the request. Confidence >= 0.8 means the skill must be loaded. Ensures the right domain expertise is always in context |
| **Gate 3** | Spec Folder | HARD BLOCK | Overrides Gates 1-2. Asks: A) Existing folder? B) New folder? C) Update related? D) Skip? E) Phase folder? No file changes without an answer |


#### How Requests Flow Through Gates

```
  User message arrives
         │
         ▼
  ┌─────────────────────────────────────────┐
  │  Gate 1 (SOFT)                          │
  │  Surface prior memory, classify intent  │
  │  confidence >= 0.70, uncertainty <= 0.35 │
  └───────────────────┬─────────────────────┘
                      │
                      ▼
  ┌─────────────────────────────────────────┐
  │  Gate 2 (REQUIRED)                      │
  │  skill_advisor.py recommends skill      │
  │  confidence >= 0.8 ─► MUST load skill    │
  └───────────────────┬─────────────────────┘
                      │
                      ▼
  ┌─────────────────────────────────────────┐
  │  Gate 3 (HARD BLOCK)                    │
  │  Only if file modification detected       │
  │  Which spec folder? A / B / C / D / E   │
  └───────────────────┬─────────────────────┘
                      │
                      ▼
               EXECUTION
                      │
                      ▼
  ┌─────────────────────────────────────────┐
  │  Post-Rules                             │
  │  Memory Save + Completion Verification   │
  └─────────────────────────────────────────┘
```


#### Post-Execution Rules

- **Memory Save** (HARD BLOCK) — Triggered by "save context" or `/memory:save`. Must use `generate-context.js` -- no manual memory file creation.
- **Completion Verification** (HARD BLOCK) — Triggered by claiming "done" or "complete". Must load `checklist.md` and verify ALL items with evidence.


#### Analysis Lenses

Applied silently during gate processing on every request:

- **CLARITY** — Is this the simplest solution? Are abstractions earned?
- **SYSTEMS** — What does this touch? What are the side effects?
- **BIAS** — Is the user solving a symptom? Is the framing correct?
- **SUSTAINABILITY** — Will future developers understand this?
- **VALUE** — Does this change behavior or just refactor?
- **SCOPE** — Does solution complexity match problem size?

Full gate definitions and anti-pattern detection rules are in [AGENTS.md](AGENTS.md).


### 3.7 CODE MODE MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Think of it like a universal adapter -- instead of loading 47 separate tool definitions into the context window (141k tokens), Code Mode loads them on demand through one interface (1.6k tokens). That is a 98.7% reduction.


#### Native MCP Servers

Defined in `opencode.json`:

| Server | Tools | Purpose |
|--------|-------|---------|
| `spec_kit_memory` | 33 | Cognitive memory system -- the memory engine |
| `code_mode` | 7 | External tool orchestration via TypeScript execution |
| `cocoindex_code` | 1 | Semantic code search via vector embeddings |
| `sequential_thinking` | 1 | Structured multi-step reasoning for complex problems |
| **Total** | **42** | |

<details>
<summary><strong>Code Mode Tools (7)</strong></summary>

- **`search_tools`** — Discover relevant tools by task description
- **`tool_info`** — Get complete tool parameters and TypeScript interface
- **`call_tool_chain`** — Execute TypeScript code with access to all registered tools
- **`list_tools`** — List all currently registered tool names
- **`register_manual`** — Register a new tool provider
- **`deregister_manual`** — Remove a tool provider
- **`get_required_keys_for_tool`** — Check required environment variables for a tool

</details>

<details>
<summary><strong>External Integrations</strong> (via <code>.utcp_config.json</code>)</summary>

- **`chrome_devtools_1`** (MCP/stdio) — Browser automation (instance 1). No env var needed.
- **`chrome_devtools_2`** (MCP/stdio) — Browser automation (instance 2). No env var needed.
- **`clickup`** (MCP/stdio) — Task management, goals, docs. Requires `CLICKUP_API_KEY`.
- **`figma`** (MCP/stdio) — Design files, components, exports. Requires `FIGMA_API_KEY`.
- **`github`** (MCP/stdio) — Issues, pull requests, commits. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **`webflow`** (MCP/remote) — Sites, CMS collections. Requires Webflow auth.

</details>


#### Performance

| Metric | Without Code Mode | With Code Mode |
|--------|-------------------|----------------|
| Context tokens | 141k (47 tools loaded) | 1.6k (on-demand) |
| Round trips | 15+ for chained operations | 1 (TypeScript chain) |
| Type safety | None | Full TypeScript |
| Context reduction | -- | 98.7% |

To call a Code Mode tool: `call_tool_chain({ typescript: "const result = await figma.figma_get_file({fileKey: 'abc123'}); return result;" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.opencode/skill/mcp-code-mode/SKILL.md`.

<!-- /ANCHOR:features -->


<!-- ANCHOR:configuration -->

---

## 4. CONFIGURATION

### Core Configuration Files

- **`CLAUDE.md`** — Gate definitions, behavior rules, coding anti-patterns. Used by Claude Code (primary runtime).
- **`AGENTS.md`** — Agent routing, capability reference, gate documentation. Used by all runtimes.
- **`opencode.json`** — MCP server bindings (4 servers), model configuration. Used by OpenCode platform.
- **`.utcp_config.json`** — Code Mode external tool registrations. Used by `mcp-code-mode` skill.
- **`.claude/mcp.json`** — Claude Code MCP configuration. Claude Code only.
- **`.gemini/settings.json`** — Gemini CLI configuration. Gemini CLI only.

### Memory Engine Configuration

The memory server reads configuration from environment variables:

- **`VOYAGE_API_KEY`** (optional) — Voyage AI embeddings (recommended)
- **`OPENAI_API_KEY`** (optional) — OpenAI embeddings (alternative)
- **`MEMORY_DB_PATH`** (optional) — Override default database path

Default database path: `.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`

> [!TIP]
> If no API key is set, the memory engine auto-detects **HuggingFace Local** embeddings -- free, no setup required.

### Memory Feature Flags

The memory server supports 26+ feature flags organized by category. These control which search channels, scoring signals and infrastructure components are active. All flags default to sensible values and most users never need to change them.

<details>
<summary><strong>Flag Categories</strong></summary>

- **Search Pipeline** — BM25, Graph channel, Reranker, MMR, Co-Activation, FSRS decay, Interference penalty. All enabled by default.
- **Session/Cache** — Working memory, TTL cache, Session deduplication. All enabled by default.
- **Memory/Storage** — Auto-promotion, Negative feedback, Content normalization. All enabled by default.
- **Embedding/API** — Voyage AI, OpenAI, HuggingFace Local (auto-detected). Provider-dependent.
- **Debug** — Trace mode, Scoring observability, Shadow evaluation. All disabled by default.

</details>

For the complete flag reference with per-flag defaults, see [MCP Server README Section 5](.opencode/skill/system-spec-kit/mcp_server/README.md#5-configuration).

### Database Schema

The memory system uses a SQLite database with 25 tables:

<details>
<summary><strong>25 Tables in 7 Groups</strong></summary>

- **Core** (3) — `memories`, `embeddings`, `memory_sections`. Content storage and vector index.
- **Search** (3) — `fts_memories`, `bm25_index`, `search_cache`. Full-text and keyword search.
- **Graph** (3) — `causal_edges`, `communities`, `co_activations`. Causal relationships and clustering.
- **Lifecycle** (3) — `memory_states`, `validation_feedback`, `promotions`. State machine and quality tracking.
- **Session** (2) — `working_memory`, `session_events`. Current session context.
- **Shared** (3) — `shared_spaces`, `memberships`, `kill_switches`. Multi-user access control.
- **Evaluation** (3) — `eval_runs`, `ablation_results`, `ground_truth`. Quality measurement.

</details>

Default database path: `.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`

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


<!-- ANCHOR:usage-examples -->

---

## 5. USAGE EXAMPLES

### Example 1: Start a New Feature

Use `/spec_kit:complete` to run the full workflow -- research, plan, implementation and memory save.

```
/spec_kit:complete Add email verification to the user registration flow
```

This creates a spec folder under `.opencode/specs/`, researches the codebase, builds a plan, implements it and saves memory automatically. When you come back tomorrow, the memory engine remembers everything about this feature.


### Example 2: Resume After a Crash or Compaction

Use `/spec_kit:resume` to recover session context after a context window reset.

```
/spec_kit:resume
```

The command reconstructs context from recent handovers, resume-mode memory retrieval, crash breadcrumbs, and progress artifacts so you can pick up exactly where you left off. Working memory deduplication means follow-up queries skip results you have already seen.


### Example 3: Debug a Difficult Problem

Use `/spec_kit:debug` to delegate debugging to a fresh-perspective agent with no prior context bias.

```
/spec_kit:debug The authentication middleware is intermittently returning 401 for valid tokens
```

The `@debug` agent applies a 5-phase methodology (Observe, Analyze, Hypothesize, Validate, Fix) and writes a `debug-delegation.md` with findings.


### Example 4: Code Review Before Merging

Ask `@review` to evaluate your changes before a pull request.

```
@review Review the changes in src/auth/ for security issues and coding standards
```

The `@review` agent is read-only, applies the `sk-code--review` skill and returns a findings-first severity report.


### Example 5: Save Context Before Ending a Session

```
/memory:save
```

This runs `generate-context.js` against your active spec folder, writes a timestamped memory file and indexes it immediately for future retrieval.


### Example 6: Deep Research on a Complex Topic

```
/spec_kit:deep-research Investigate how the authentication system handles token refresh across microservices
```

The `@deep-research` agent runs an autonomous investigation loop with externalized state, iterating until it converges on a complete answer or hits the iteration limit.


### Common Patterns

- **New feature end-to-end** — `/spec_kit:complete [description]`. Starting any feature from scratch.
- **Planning without building** — `/spec_kit:plan [description]`. When you want to review the plan first.
- **Pick up previous work** — `/spec_kit:resume`. Returning to an in-progress spec.
- **Investigate a codebase** — `@context [question]`. Exploration and research tasks.
- **Generate a README** — `/create:folder_readme`. Documenting a directory or component.
- **Improve a prompt** — `/create:prompt`. Prompt engineering with structured frameworks.

<!-- /ANCHOR:usage-examples -->


<!-- ANCHOR:faq -->

---

## 6. FAQ

**Q: Do I need all 18 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core skills -- `system-spec-kit` and `sk-doc` -- cover most documentation workflows. The MCP and cross-AI CLI skills require additional API keys or tools.


**Q: Is this only for OpenCode, or does it work with other runtimes?**

A: It works with OpenCode, Codex CLI, Claude Code and Gemini CLI. Agent definitions are mirrored across all four runtime directories. Each runtime has its own adapter files that translate the source-of-truth definitions into the format that runtime expects.


**Q: What happens if I do not use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable via memory search. For trivial changes under 5 characters in a single file, Gate 3 does not trigger.


**Q: How does the memory system know what is relevant to my current task?**

A: Every memory file has YAML frontmatter with tags, context type and trigger phrases. When you start a session, `memory_match_triggers()` runs a 5-channel hybrid search across all indexed memory files and returns the top matches. The system classifies your intent (7 types), routes by complexity and applies Reciprocal Rank Fusion to combine results from all channels.


**Q: Can I use this framework without the cognitive memory features?**

A: Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works independently of the memory MCP server. You will not have cross-session memory retrieval, but you will still get structured documentation, agent routing and skill loading.


**Q: How do I add a new skill to the framework?**

A: Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Then register the skill in `.opencode/skill/README.md`.


**Q: What does "local-first" mean for the memory system?**

A: The memory database is a SQLite file on your local machine. No session data, code or context is sent to any external service unless you configure a cloud embedding provider (Voyage AI or OpenAI). HuggingFace Local embeddings run entirely on-device.


**Q: How do I contribute a new agent definition?**

A: Define the agent in `.opencode/agent/` (the source of truth), then copy the adapter to `.claude/agents/`, `.codex/agents/` and `.gemini/agents/`. Use `/create:agent` to scaffold the file from the agent template.


**Q: How many MCP tools are there and where are they defined?**

A: 42 total across 4 native MCP servers: 33 memory tools (spec_kit_memory), 7 code mode tools, 1 semantic code search tool (cocoindex_code) and 1 sequential thinking tool. All server bindings are defined in `opencode.json`. The 33 memory tool definitions live in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`.


**Q: What is the feature catalog?**

A: The feature catalog is a 222-entry reference across 21 categories documenting every capability of the memory system. It comes in two versions: a technical reference and a simple-terms companion with plain-language explanations. Both are in `.opencode/skill/system-spec-kit/feature_catalog/`.

<!-- /ANCHOR:faq -->


<!-- ANCHOR:related-documents -->

---

## 7. RELATED DOCUMENTS

### Internal Documentation

- **[AGENTS.md](AGENTS.md)** — Complete agent routing reference, gate definitions and behavior rules for all runtimes
- **[Spec Kit README](.opencode/skill/system-spec-kit/README.md)** — Full spec folder workflow, template architecture (81 templates), validation rules and memory pipeline
- **[MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md)** — Complete memory API reference (33 tools across 7 layers), retrieval architecture and configuration
- **[INSTALL_GUIDE.md](.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md)** — Step-by-step MCP server installation with embedding providers and environment setup
- **[SHARED_MEMORY_DATABASE.md](.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md)** — Shared memory guide with spaces, roles, membership and kill switch
- **[ARCHITECTURE.md](.opencode/skill/system-spec-kit/ARCHITECTURE.md)** — API boundary contract between scripts/ and mcp_server/
- **[sk-doc SKILL.md](.opencode/skill/sk-doc/SKILL.md)** — Documentation standards, DQI scoring, templates and HVR writing rules
- **[Skills README](.opencode/skill/README.md)** — Index of all 18 skills with descriptions and invocation patterns
- **[FEATURE_CATALOG.md](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)** — 222-entry technical reference across 21 categories
- **[FEATURE_CATALOG_IN_SIMPLE_TERMS.md](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)** — Plain-language companion to the technical catalog
- **[AGENTS_example_fs_enterprises.md](AGENTS_example_fs_enterprises.md)** — Example AGENTS.md for a full-stack enterprise project (runtime-neutral)

### External Resources

- **[OpenCode](https://github.com/sst/opencode)** — The underlying AI coding assistant platform this framework extends
- **[Voyage AI](https://www.voyageai.com/)** — Recommended embedding provider for memory retrieval
- **[HuggingFace Local](https://huggingface.co/)** — Free local embedding alternative (no API key required)

<!-- /ANCHOR:related-documents -->


*Documentation version: 4.0 | Last updated: 2026-03-25 | Framework: 12 agents, 18 skills, 22 commands, 42 MCP tools (33 memory + 7 code mode + 1 CocoIndex + 1 sequential thinking)*
