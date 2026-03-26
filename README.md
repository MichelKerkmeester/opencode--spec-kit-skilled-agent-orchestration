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
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is OpenCode?

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Every decision, every trade-off, every carefully reasoned choice -- lost the moment the conversation window closes. This framework fixes that.

OpenCode is a multi-agent AI development framework built on top of the [OpenCode](https://github.com/sst/opencode) platform. Think of it like giving your AI assistant a filing cabinet, a long-term memory and a team of specialists -- instead of one forgetful generalist that starts from scratch every time you open a new chat window.

The framework adds three layers on top of the base platform:

1. **Structured documentation** (Spec Kit) -- every file change gets a spec folder that records what changed, why and how. Like a lab notebook for software.
2. **Cognitive memory** (MCP server) -- a local-first memory engine that stores decisions, context and project history in a searchable database. Like a personal librarian who remembers every conversation.
3. **Coordinated agents** -- 12 specialized agents with domain expertise, routed by a gate system that loads the right skills at the right time. Like a team where the project manager delegates to the right specialist instead of doing everything alone.

**Who it is for:** Developers using AI assistants who are tired of re-explaining context every session and watching decisions disappear into chat history.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Agents** | 12 | 2 built-in + 10 custom (multi-runtime) |
| **Skills** | 18 | Code, docs, git, prompts, MCP, research, cross-AI |
| **Commands** | 22 | 8 spec_kit + 6 memory + 7 create + 1 utility |
| **MCP Tools** | 42 | 33 memory + 7 code mode + 1 semantic code search + 1 sequential thinking |
| **Gates** | 3 | Understanding, Skill Routing, Spec Folder |
| **Runtimes** | 4 | OpenCode, Codex CLI, Claude Code, Gemini CLI |
| **Templates** | 81 | CORE + ADDENDUM v2.2 |
| **Feature Catalog** | 222 | Across 21 categories |

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

### Role-Based Navigation

| I want to... | Start here |
|---|---|
| Get started with the framework | [Quick Start](#2-quick-start) |
| Learn about spec folder workflows | [3.1 Spec Kit Documentation](#31-spec-kit-documentation) |
| Understand the memory system | [3.2 Memory Engine](#32-memory-engine) |
| See all agents and their roles | [3.3 Agent Network](#33-agent-network) |
| Browse available commands | [3.4 Command Architecture](#34-command-architecture) |
| Find the right skill for a task | [3.5 Skills Library](#35-skills-library) |
| Understand how requests are validated | [3.6 Gate System](#36-gate-system) |
| Work with external tools (Figma, GitHub, etc.) | [3.7 Code Mode MCP](#37-code-mode-mcp) |
| Understand the folder structure | [Structure](#4-structure) |
| Configure the framework | [Configuration](#5-configuration) |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| [OpenCode](https://github.com/sst/opencode) | v1.0.190+ | Latest |
| Node.js | v18+ | v20+ |
| npm | v9+ | v10+ |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
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

---

<!-- ANCHOR:features -->
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

| Priority | Meaning | Deferral |
|----------|---------|---------|
| **P0** | Hard blocker -- cannot ship without this | Cannot defer |
| **P1** | Required -- must complete or get user approval to defer | Needs explicit approval to skip |
| **P2** | Optional -- nice to have | Can defer without approval |

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

| Exit Code | Meaning | Action |
|-----------|---------|--------|
| 0 | All rules pass | Ready to proceed |
| 1 | Warnings found | Review and fix if practical |
| 2 | Errors found | Must fix before claiming completion |

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders.

#### CORE + ADDENDUM Template Architecture (v2.2)

Templates compose from a CORE layer plus level-specific ADDENDUM layers. Each level inherits from the level below and adds what it needs -- like building blocks that stack.

```text
Level 1:  CORE only               → 4 files, ~455 LOC
Level 2:  CORE + L2-VERIFY        → 6 files, ~875 LOC  (adds checklist.md)
Level 3:  CORE + L2 + L3-ARCH     → 7 files, ~1090 LOC (adds decision-record.md)
Level 3+: CORE + all addendums    → 7 files, ~1350 LOC (adds governance extensions)
```

| Core Template | File | Purpose |
|---------------|------|---------|
| Specification | `spec-core.md` | What the feature is, why it exists, requirements and success criteria |
| Plan | `plan-core.md` | How to implement: architecture, phases, testing strategy |
| Tasks | `tasks-core.md` | Step-by-step task breakdown with status tracking |
| Implementation Summary | `impl-summary-core.md` | Post-implementation record of what changed and verification results |

| Addendum | Level | What It Adds |
|----------|-------|-------------|
| `level2-verify/` | 2+ | Quality gates, NFRs, edge cases, checklist template |
| `level3-arch/` | 3+ | Architecture decisions, ADRs, risk matrix |
| `level3plus-govern/` | 3+ | Enterprise governance, AI protocols, sign-off sections |
| `phase/` | Any | Phase decomposition headers for parent/child folders |

| Special Template | Purpose |
|-----------------|---------|
| `context_template.md` (~26K) | Memory context template with standard ANCHOR sections |
| `research.md` (~20K) | Deep research template for autonomous investigation |
| `handover.md` | Session continuity template for handing off to the next AI |
| `debug-delegation.md` | Debug delegation template for fresh-perspective troubleshooting |

Templates use ANCHOR markers (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) to mark logical sections. Validation checks for required anchors, proper section ordering and template version alignment.

#### Scripts and Validation

**Spec management** (12 scripts in `scripts/spec/`):

| Script | Purpose |
|--------|---------|
| `create.sh` | Create spec folders with level-appropriate templates. Use `--phase` for parent + child |
| `validate.sh` | Run 20 validation rules. Use `--recursive` for phase folders |
| `upgrade-level.sh` | Inject addendum templates to upgrade a folder to a higher level |
| `recommend-level.sh` | Analyze scope and risk to recommend the right documentation level |
| `calculate-completeness.sh` | Calculate spec folder completeness as a percentage |
| `check-completion.sh` | Verify all completion criteria are met |
| `check-placeholders.sh` | Find remaining `[PLACEHOLDER]` values after level upgrade |

**Memory scripts** (10 scripts in `scripts/memory/`):

| Script | Purpose |
|--------|---------|
| `generate-context.ts` | Primary workflow for saving session context to memory files |
| `backfill-frontmatter.ts` | Add missing frontmatter to existing memory files |
| `reindex-embeddings.ts` | Rebuild embedding vectors for stored memories |
| `cleanup-orphaned-vectors.ts` | Remove vector entries with no matching memory |
| `rebuild-auto-entities.ts` | Regenerate auto-extracted entity catalog |
| `validate-memory-quality.ts` | Run quality checks on stored memory content |

TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.

For the full spec folder workflow, template architecture (81 templates) and validation rules, see the [Spec Kit README](.opencode/skill/system-spec-kit/README.md).

---

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

---

#### 3.2.1 HYBRID SEARCH

When you search, the system checks five sources at once. Think of a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet, the recommendation board and the "related topics" corkboard all at the same time.

| Channel | How It Works | Good For |
|---------|-------------|----------|
| **Vector** | Compares meaning via embeddings (Voyage AI 1024d) | Finding related content even when words differ |
| **FTS5** | Full-text search on exact words and phrases | Specific terms and error messages |
| **BM25** | Keyword relevance scoring | Ranking when you know roughly what you want |
| **Causal Graph** | Follows cause-and-effect links between memories | "Why did we choose this?" questions |
| **Degree** | Scores by graph connectivity, weighted by edge type (`caused`=1.0, `enabled`=0.75, `supports`=0.5) | Finding important hub decisions (capped to prevent over-influence) |

**Reciprocal Rank Fusion (RRF)** combines all channel results using `1/(K + rank)`. K is tuned per query intent through sensitivity analysis across values {10, 20, 40, 60, 80, 100, 120}. A memory that scores well in multiple channels rises to the top because RRF gives exponential weight to high-ranking items while still including lower-ranked contributions.

**Channel min-representation** guarantees every active channel gets at least one result in the final set, preventing a single dominant channel from drowning out useful evidence.

**Quality-aware 3-tier fallback** escalates automatically when results are weak:

| Fallback Tier | Channels Active | When It Kicks In |
|---------------|----------------|------------------|
| Tier 1 | Vector only | Default fast path for simple queries |
| Tier 2 | Vector + BM25 | Results below confidence floor |
| Tier 3 | All 5 channels | Still poor results after Tier 2 |

**Confidence truncation** cuts off results at 2x the median score gap so you never get a long tail of irrelevant items. **Evidence gap detection** (TRM Z-score) flags when retrieved memories do not adequately cover the query and suggests broadening the search. **Calibrated overlap bonus** rewards memories found by multiple channels at once. **Tool-level TTL cache** remembers recent results for 60 seconds with automatic invalidation on writes.

---

#### 3.2.2 SEARCH PIPELINE

Every search goes through four stages. Each stage has one clear job and cannot change results from earlier stages.

**Stage 1 -- Gather** candidates from active channels in parallel. Constitutional-tier memories always inject regardless of score.

**Stage 2 -- Score and fuse** using RRF plus eight post-fusion scoring signals:

| Signal | What It Does | Magnitude |
|--------|-------------|-----------|
| Co-activation boost | Memories co-occurring with matched results get a lift. Fan-effect `1/sqrt(neighbors)` prevents hub bias | +0.25 |
| FSRS decay | Adjusts score by memory retrievability. Recently accessed memories score higher | multiplicative |
| Interference penalty | Suppresses near-identical memory clusters (>0.75 Jaccard similarity) | -0.08 per neighbor |
| Cold-start boost | Fresh memories (<48h) get `0.15 * exp(-elapsed/12)`, 12h half-life, capped at 0.95 | +0.15 max |
| Session recency | Memories accessed in the current session get a recency bump | cap 0.20 |
| Causal 2-hop | Memories 1-2 hops from causal neighbors get a contextual boost | variable |
| Intent weights | Each of 7 task intents has its own channel weight profile | variable |
| Channel min-rep | Floor ensures each active channel has at least one result | 0.005 |

All channel scores are normalized to 0-1 before fusion so no single channel wins because its scale is bigger.

**Stage 3 -- Rerank** using a cross-encoder model that runs locally via node-llama-cpp (GGUF format). No cloud API needed. If your machine lacks VRAM, the reranker gracefully skips and Stage 2 order stands. MPAB (Multi-Pass Aggregation with Boundary) collapses individual chunks back to their parent memory -- the best chunk counts most, but documents with multiple matching chunks rank higher than a single lucky hit.

**Stage 4 -- Filter and annotate**. Enforces score immutability (no score changes after Stage 2). Applies state filtering by minimum state parameter. Annotates results with confidence labels (high/medium/low) and feature flag states.

---

#### 3.2.3 QUERY INTELLIGENCE

Before any search runs, the system figures out what kind of help you need. Think of it like a triage nurse who reads your symptoms and routes you to the right specialist.

**Complexity routing** sizes up your question and picks the right amount of effort:

| Complexity | Channels | Token Budget | When |
|-----------|----------|-------------|------|
| Simple | 2 | 800 tokens | Quick lookups, single-topic questions |
| Moderate | 4 | 1,500 tokens | Multi-factor questions, debugging |
| Complex | All 5 | 2,000 tokens | Research, architecture decisions |

**Intent classification** maps your query to one of 7 task types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`). Each type has its own channel weight profile. A `find_decision` query boosts the causal graph channel. A `fix_bug` query boosts exact-match channels.

**Query decomposition** splits multi-topic questions into focused sub-queries. Each searches separately and results merge. No LLM call needed.

**Query expansion** automatically adds related terms when the question is complex, so you find relevant results even when the exact wording differs.

**Index-time query surrogates** pre-generate alternative names, summaries and likely questions about content when a memory is first saved. These are stored alongside the original so future searches match against them too. Like a library cataloger adding subject headings and cross-references to a new book.

**Context pressure monitoring** watches how full your context window is getting. Above 60% usage the system downgrades to focused mode. Above 80% it switches to quick mode.

For low-confidence deep searches, two fallback strategies kick in:

- **LLM query reformulation** -- asks the LLM to rephrase the query more abstractly, grounding in actual knowledge base content
- **HyDE (Hypothetical Document Embeddings)** -- writes a hypothetical answer to your question, then searches for real documents matching that imaginary answer

**Mode-aware response profiles** format results differently depending on what you are doing:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `quick` | Returns top answer only, minimal context | Fast lookups, single-topic questions |
| `focused` | Returns targeted results for one topic | Standard development queries |
| `deep` | Returns full results with evidence trails | Research, architecture decisions |
| `resume` | Returns state summary + next-steps | Session recovery after crash or compaction |

---

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

---

#### 3.2.5 CAUSAL GRAPH

The system tracks how decisions relate to each other. Think of it like a corkboard with sticky notes connected by string. One note says "we chose JWT tokens." A string connects it to "because the session store was too slow." Another string connects that to "the Redis outage on March 5th."

**Six types of causal relationships** link memories together:

| Relation | Weight | Meaning |
|----------|--------|---------|
| **caused** | 1.0 | A led directly to B |
| **enabled** | 0.75 | A made B possible |
| **supersedes** | -- | B replaces A |
| **contradicts** | -- | A and B conflict |
| **derived_from** | -- | B is based on A |
| **supports** | 0.5 | A provides evidence for B |

**Typed-weighted degree channel** uses these weights to rank memories by graph importance. Hub caps (`MAX_TYPED_DEGREE`=15, `MAX_TOTAL_DEGREE`=50) and a `DEGREE_BOOST_CAP` of 0.15 prevent any single highly-connected memory from dominating results.

**Co-activation spreading** boosts memories connected to ones you already found relevant. A fan-effect divisor (`1/sqrt(neighbor_count)`) prevents popular hub memories from getting an outsized boost.

**Community detection** (Louvain algorithm) automatically clusters related memories into groups. When one memory in a cluster is relevant, its neighbors get a small boost.

**Graph momentum** tracks how quickly a memory is gaining new connections. Trending knowledge surfaces higher than static nodes.

**Temporal contiguity** gives a time-proximity boost to memories created around the same time. If one memory from a Tuesday afternoon session is relevant, others from that same session probably are too.

**Typed traversal** pays attention to what kind of connection it follows based on your question. A "what caused this bug?" query prioritizes cause-and-effect links. A "what supports this decision?" query prioritizes evidence links.

**Causal depth signals** measure how deep each memory sits in the decision tree. Root decisions (with many descendants) get different tiebreaker boosts than leaf tasks.

**Async LLM graph backfill** uses an AI to read important documents after they are saved and suggest additional causal connections that pattern matching missed. Runs in the background after initial save.

---

#### 3.2.6 SAVE INTELLIGENCE

When you save new knowledge, the system runs an arbitration process before storing anything.

**Prediction Error gating** compares new content against existing memories and picks one of four outcomes:

| Outcome | When | What Happens |
|---------|------|-------------|
| **CREATE** | No similar memory exists | Stored as new knowledge |
| **REINFORCE** | Similar exists, new one adds value | Both kept, old one gets a confidence boost |
| **UPDATE** | Similar exists, new one is better | Old version replaced in place |
| **SUPERSEDE** | New knowledge contradicts the old | New version active, old one demoted to deprecated |

This is session-scoped to prevent cross-session interference.

**Reconsolidation-on-save** handles near-duplicates intelligently. Nearly identical content gets merged. Contradictions retire the old version. Different content keeps both.

**Semantic sufficiency gating** rejects memories too thin or lacking real evidence. Short documents with strong structural signals (clear title, proper labels) get an exception.

**Verify-fix-verify loop** runs quality checks before saving. If the memory falls short, the system tries to fix problems automatically and checks again before storing.

**Content normalization** strips formatting clutter (bullet markers, code fences, header symbols) before generating embeddings. Cleaner fingerprints match your questions more accurately.

**Auto-entity extraction** spots tool names, project names and concept names when you save and adds them to a shared catalog. Connects memories mentioning the same things even when surrounding text differs.

**SHA-256 content-hash deduplication** recognizes unchanged files instantly and skips expensive reprocessing.

**Signal vocabulary expansion** recognizes correction signals ("actually", "wait") and preference signals ("prefer", "want") in conversation context, using them to adjust quality scoring during save.

**Correction tracking** maintains a paper trail of how knowledge evolved when newer memories replace older ones. When a save triggers an UPDATE or SUPERSEDE outcome, the system records the relationship between old and new versions.

---

#### 3.2.7 SESSION AWARENESS

The system keeps track of what happened during your current conversation so it does not repeat itself or lose context mid-session.

**Working memory with attention decay** stores findings from the current session. Each result's relevance decays by `0.85^distance` per event (where distance is how many tool calls ago it was found). Floor is 0.05, eviction at 0.01. Recent findings stay prominent while older ones fade gracefully.

**Session deduplication** pushes down results you already saw. If you got a result 3 turns ago, new searches rank it lower. Saves approximately 50% of tokens on follow-up queries.

**Context pressure monitoring** watches how full your AI's context window is getting. Above 60% usage: downgrades to focused mode. Above 80%: switches to quick mode. Prevents memory retrieval from overwhelming the conversation.

---

#### 3.2.8 SHARED MEMORY

By default, every memory is private to the user or agent that created it. Shared memory adds controlled access so multiple people or agents can read and write to a common knowledge pool.

Think of it like a shared office with a keycard lock. The office stays locked until an admin activates it. Only people on the access list can enter. Management can lock it down instantly if something goes wrong.

- **Spaces** -- named containers for shared knowledge (like rooms in the office)
- **Roles** -- `owner` (full control), `editor` (read/write), `viewer` (read-only)
- **Deny-by-default** -- nobody gets access unless explicitly granted
- **Kill switch** -- immediately blocks all access for emergencies

For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md).

---

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

---

#### 3.2.10 RETRIEVAL ENHANCEMENTS

**Constitutional memory as expert knowledge injection** tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."

**Spec folder hierarchy search** uses your project folder organization as a retrieval signal. If you are looking at a child folder, the system also checks parent and sibling folders for related information.

**Dual-scope memory auto-surface** watches for tool use and context compression events and automatically brings up important memories without being asked.

**Cross-document entity linking** connects memories across folders when they reference the same concept, even if the surrounding text is different.

**Memory summary search channel** creates a short summary of each memory when saved and searches against those summaries.

**Contextual tree injection** labels each result with its position in the project hierarchy ("Project > Feature > Detail") so you always know where it belongs.

**ANCHOR-based section retrieval** memory files can include `<!-- ANCHOR:name -->` markers. The search system indexes individual sections separately, allowing retrieval of just "decisions" or "next-steps" from a large document (~93% token savings).

**Provenance-rich response envelopes** (when `includeTrace` is enabled) show exactly how each result was found: which channels contributed, how scores were calculated and where the information originated.

---

#### 3.2.11 INDEXING AND INFRASTRUCTURE

**Real-time filesystem watching** (chokidar) monitors your project folder continuously. When you save, rename or delete a file, the index updates automatically.

**Incremental indexing with content hashing** tracks SHA-256 hashes of every indexed file. Unchanged files get skipped instantly during scans.

**Embedding retry orchestrator** when the embedding service is temporarily unavailable, the memory is saved without a vector and queued for retry. A background worker retries until it succeeds.

**Deferred lexical-only indexing** saves memories in a simpler text-searchable form when the embedding service is down. Keyword search still works. When the service returns, the system upgrades to full vector searchability automatically.

**Atomic write-then-index** writes files to a temporary location first and only moves them once confirmed. Crash-safe with pending-file recovery on startup.

---

#### 3.2.12 EVALUATION INFRASTRUCTURE

Research-grade infrastructure for measuring and improving search quality over time.

**12-metric core computation** grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling.

**Synthetic ground truth corpus** 110 test questions with known correct answers in everyday language plus trick questions. Makes it possible to measure objectively whether changes improve or hurt quality.

**Ablation study framework** turns off each search channel one at a time and measures quality degradation (Recall@20 delta). Identifies which components are critical.

**Shadow scoring with holdout evaluation** tests proposed ranking improvements on a fixed test set before they go live. A new approach only reaches production after it proves itself.

#### Embedding Providers

| Provider | Setup | Notes |
|----------|-------|-------|
| Voyage AI | `VOYAGE_API_KEY` env var | Best quality, recommended |
| OpenAI | `OPENAI_API_KEY` env var | Strong alternative |
| HuggingFace Local | No setup needed | Free, auto-detected fallback |

**Local-first:** The memory database runs on your machine at `.opencode/skill/system-spec-kit/shared/mcp_server/database/`. No data leaves your system unless you configure a cloud embedding provider.

For the complete 33-tool API reference (7 layers, 7,600 total token budget) and configuration, see the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).

---

### 3.3 AGENT NETWORK

12 agents total: 2 built-in platform agents and 10 custom specialists. Think of them like a team where the project manager (you or the orchestrator) delegates to the right expert instead of one generalist doing everything. Each agent has a defined role, specific tool permissions and clear boundaries on what it can and cannot modify.

Custom agents are defined in `.opencode/agent/` (source of truth) and adapted for Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`) and Gemini CLI (`.gemini/agents/`). All four directories maintain the same 10 agent files, adapted for each runtime's frontmatter format.

#### All 12 Agents

| Agent | Type | Role |
|-------|------|------|
| `@general` | Built-in | General implementation and complex coding tasks |
| `@explore` | Built-in | Quick codebase exploration and file discovery |
| `@orchestrate` | Custom | Senior task commander -- decomposes work, delegates to sub-agents, synthesizes results |
| `@context` | Custom | Memory-first retrieval specialist -- exclusive entry point for ALL codebase exploration. Read-only |
| `@speckit` | Custom | Spec folder documentation specialist -- EXCLUSIVE agent for writing `*.md` inside spec folders |
| `@debug` | Custom | Fresh-perspective debugging with 5-phase methodology (Observe, Analyze, Hypothesize, Validate, Fix) |
| `@deep-research` | Custom | Autonomous deep research loop with externalized state and convergence detection |
| `@deep-review` | Custom | Autonomous code quality auditing with P0/P1/P2 findings and evidence-backed quality risks |
| `@review` | Custom | Code quality guardian -- READ-ONLY. Findings-first severity analysis with security assessment |
| `@write` | Custom | Documentation generation specialist -- DQI-compliant READMEs, skills, guides. Must NOT write inside spec folders |
| `@handover` | Custom | Session continuation specialist -- creates `handover.md` for context preservation |
| `@ultra-think` | Custom | Multi-strategy planning architect -- dispatches diverse thinking strategies (Analytical, Creative, Critical, Pragmatic, Systems-level) |

#### Runtime Agent Directories

| Runtime | Directory | Files | Notes |
|---------|-----------|-------|-------|
| OpenCode (default) | `.opencode/agent/` | 10 | Source of truth |
| Claude Code | `.claude/agents/` | 10 | Runtime-adapted |
| Codex CLI | `.codex/agents/` | 10 | Runtime-adapted |
| Gemini CLI | `.gemini/agents/` | 10 | Runtime-adapted |

---

### 3.4 COMMAND ARCHITECTURE

22 commands across 4 namespaces. Each command is a two-layer system: a Markdown entry point under `.opencode/command/**/*.md` for input collection and routing, backed by a behavioral execution spec that tells the AI exactly how to run the workflow.

#### spec_kit/ -- 8 Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Full workflow: spec, plan, implement, verify. Supports `:auto`, `:confirm`, `:with-research`, `:auto-debug` modes |
| `/spec_kit:plan` | Planning only, no implementation. Supports `:auto` and `:confirm` |
| `/spec_kit:implement` | Execute an existing plan. Requires plan.md |
| `/spec_kit:phase` | Decompose a spec into phased child folders |
| `/spec_kit:debug` | Delegate debugging to a fresh-perspective `@debug` sub-agent |
| `/spec_kit:resume` | Continue a previous session (auto-loads memory) |
| `/spec_kit:deep-research` | Autonomous deep research loop with iterative investigation and convergence detection |
| `/spec_kit:handover` | Create session handover document (`:quick` or `:full` variants) |

#### memory/ -- 6 Commands

| Command | Purpose |
|---------|---------|
| `/memory:save` | Save context via `generate-context.js` with semantic indexing |
| `/memory:continue` | Session recovery from crash or compaction |
| `/memory:analyze` | Unified retrieval and analysis: intent-aware search, epistemic baselines, causal graph, ablation, dashboard |
| `/memory:learn` | Constitutional memory manager (create, list, edit, remove, budget) |
| `/memory:manage` | Database operations: stats, health, cleanup, checkpoints, bulk ingestion |
| `/memory:shared` | Shared memory: create spaces, manage members, inspect status (deny-by-default governance) |

#### create/ -- 7 Commands

| Command | Purpose |
|---------|---------|
| `/create:sk-skill` | Unified skill workflows (create, update, file) |
| `/create:agent` | Scaffold a new agent definition |
| `/create:folder_readme` | Unified README and install guide creation |
| `/create:changelog` | Create changelog entry from recent work |
| `/create:prompt` | Create or improve AI prompts with structured frameworks |
| `/create:feature-catalog` | Create or update feature catalog packages |
| `/create:testing-playbook` | Create or update manual testing playbook packages |

#### Utility -- 1 Command

| Command | Purpose |
|---------|---------|
| `/agent_router` | Route requests to AI systems with full System Prompt identity adoption |

---

### 3.5 SKILLS LIBRARY

18 skills in `.opencode/skill/`. Skills are on-demand capabilities loaded when a task matches -- like specialist consultants who are only called in when their expertise is needed. Gate 2 runs `skill_advisor.py` to recommend the right skill (confidence >= 0.8 means it must be loaded).

#### Documentation Skills (2)

| Skill | Version | Description |
|-------|---------|-------------|
| `system-spec-kit` | v2.2.27.0 | Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture, validation and Spec Kit Memory. Mandatory for all file modifications |
| `sk-doc` | v1.3.0.0 | Markdown quality enforcement, content optimization, component creation workflows, ASCII flowcharts and install guides |

#### Code Workflow Skills (4)

| Skill | Version | Description |
|-------|---------|-------------|
| `sk-code--full-stack` | v1.1.0.0 | Stack-agnostic development with auto-detection via marker files. Supports Go, Node.js, React/Next.js, React Native/Expo and Swift |
| `sk-code--opencode` | v1.2.0.0 | Code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell and JSON/JSONC |
| `sk-code--web` | v1.1.0.0 | Frontend development orchestrator with 6 specialized code quality sub-skills |
| `sk-code--review` | v1.2.0.0 | Stack-agnostic code review baseline with findings-first severity analysis and mandatory security/correctness minimums |

#### MCP Integration Skills (5)

| Skill | Version | Description |
|-------|---------|-------------|
| `mcp-code-mode` | v1.0.7.0 | MCP orchestration via TypeScript execution for multi-tool workflows. 200+ tools through progressive disclosure. 98.7% context reduction |
| `mcp-coco-index` | v1.0.0 | Semantic code search via vector embeddings. Natural-language discovery of code and implementations. CLI for direct use; MCP exposes `search` tool |
| `mcp-figma` | v1.0.7.0 | Figma design file access via MCP. 18 tools for file retrieval, image export, component/style extraction and team management |
| `mcp-chrome-devtools` | v1.0.7.0 | Chrome DevTools orchestrator. CLI-first (bdg) for speed, MCP fallback for multi-tool integration |
| `mcp-clickup` | v1.0.0 | ClickUp project management. CLI-first (cu) for speed, MCP for enterprise features like docs, goals and webhooks |

#### Cross-AI CLI Skills (4)

| Skill | Version | Description |
|-------|---------|-------------|
| `cli-gemini` | v1.2.1 | Gemini CLI orchestrator for web research via Google Search, codebase architecture analysis and cross-AI validation |
| `cli-codex` | v1.3.1 | Codex CLI orchestrator for OpenAI cross-AI tasks: code generation, web research, codebase analysis and parallel processing |
| `cli-claude-code` | v1.1.1 | Claude Code CLI orchestrator for deep reasoning, extended thinking, code editing and structured output |
| `cli-copilot` | v1.3.1 | Copilot CLI orchestrator for multi-model tasks, cloud delegation, collaborative planning and autopilot mode |

#### Other Skills (3)

| Skill | Version | Description |
|-------|---------|-------------|
| `sk-deep-research` | v1.0.0 | Autonomous deep research loop protocol with iterative investigation, externalized state and convergence detection |
| `sk-git` | v1.1.0.0 | Git workflow orchestrator: workspace setup (worktrees), clean conventional commits and pull request workflows |
| `sk-prompt-improver` | v1.2.0.0 | Prompt engineering specialist with 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and CLEAR scoring |

---

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

| Rule | Type | Trigger | Enforcement |
|------|------|---------|-------------|
| Memory Save | HARD BLOCK | "save context", `/memory:save` | Must use `generate-context.js` -- no manual memory file creation |
| Completion Verification | HARD BLOCK | Claiming "done" or "complete" | Load `checklist.md`, verify ALL items with evidence |

#### Analysis Lenses

Applied silently during gate processing on every request:

| Lens | Focus |
|------|-------|
| CLARITY | Is this the simplest solution? Are abstractions earned? |
| SYSTEMS | What does this touch? What are the side effects? |
| BIAS | Is the user solving a symptom? Is the framing correct? |
| SUSTAINABILITY | Will future developers understand this? |
| VALUE | Does this change behavior or just refactor? |
| SCOPE | Does solution complexity match problem size? |

Full gate definitions and anti-pattern detection rules are in [AGENTS.md](AGENTS.md).

---

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

#### Code Mode Tools (7)

| Tool | Purpose |
|------|---------|
| `search_tools` | Discover relevant tools by task description |
| `tool_info` | Get complete tool parameters and TypeScript interface |
| `call_tool_chain` | Execute TypeScript code with access to all registered tools |
| `list_tools` | List all currently registered tool names |
| `register_manual` | Register a new tool provider |
| `deregister_manual` | Remove a tool provider |
| `get_required_keys_for_tool` | Check required environment variables for a tool |

#### External Integrations (via `.utcp_config.json`)

| Provider | Type | Key Capabilities | Required Env Var |
|----------|------|-----------------|-----------------|
| `chrome_devtools_1` | MCP/stdio | Browser automation (instance 1) | None |
| `chrome_devtools_2` | MCP/stdio | Browser automation (instance 2) | None |
| `clickup` | MCP/stdio | Task management, goals, docs | `CLICKUP_API_KEY` |
| `figma` | MCP/stdio | Design files, components, exports | `FIGMA_API_KEY` |
| `github` | MCP/stdio | Issues, pull requests, commits | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| `webflow` | MCP/remote | Sites, CMS collections | Webflow auth |

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

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
opencode-spec-kit-framework/
├── .opencode/                    # OpenCode runtime (source of truth)
│   ├── agent/                   # 10 custom agent definitions
│   ├── command/                 # 22 command entry files across 4 namespaces
│   │   ├── spec_kit/            # 8 spec workflow commands
│   │   ├── memory/              # 6 memory commands
│   │   ├── create/              # 7 creation commands
│   │   └── agent_router.md      # 1 utility command
│   ├── skill/                   # 18 skills
│   │   ├── system-spec-kit/     # Documentation + memory MCP server
│   │   ├── sk-doc/              # Markdown quality and templates
│   │   ├── sk-code--*/          # Code workflow skills (4)
│   │   ├── mcp-*/               # MCP integration skills (5)
│   │   ├── cli-*/               # Cross-AI CLI skills (4)
│   │   └── sk-*/                # Other skills (3)
│   └── specs/                   # Active spec folders
│       ├── 01--[project]/       # Project-specific specs
│       └── 02--system-spec-kit/ # Framework development specs
├── .claude/agents/              # Claude Code agent adapters (10 files)
├── .gemini/agents/              # Gemini CLI agent adapters (10 files)
├── CLAUDE.md                    # Gate definitions + behavior rules
├── AGENTS.md                    # Agent routing + capability reference
├── opencode.json                # MCP server configuration (4 servers)
└── .utcp_config.json            # Code Mode external tool registrations
```

### Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Primary behavior framework -- gates, skills, coding rules |
| `AGENTS.md` | Agent definitions, routing logic, capability reference |
| `opencode.json` | MCP server bindings (4 servers: memory, code mode, CocoIndex, sequential thinking) |
| `.utcp_config.json` | Code Mode external tool registrations (Figma, GitHub, Chrome, ClickUp, Webflow) |
| `.opencode/skill/system-spec-kit/mcp_server/` | Memory MCP server source and build |
| `.opencode/skill/system-spec-kit/scripts/` | CLI scripts for memory and validation |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Core Configuration Files

| File | Purpose | Who Uses It |
|------|---------|-------------|
| `CLAUDE.md` | Gate definitions, behavior rules, coding anti-patterns | Claude Code, primary runtime |
| `AGENTS.md` | Agent routing, capability reference, gate documentation | All runtimes |
| `opencode.json` | MCP server bindings (4 servers), model configuration | OpenCode platform |
| `.utcp_config.json` | Code Mode external tool registrations | `mcp-code-mode` skill |
| `.claude/mcp.json` | Claude Code MCP configuration | Claude Code only |
| `.gemini/settings.json` | Gemini CLI configuration | Gemini CLI only |

### Memory Engine Configuration

The memory server reads configuration from environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VOYAGE_API_KEY` | No | Voyage AI embeddings (recommended) |
| `OPENAI_API_KEY` | No | OpenAI embeddings (alternative) |
| `MEMORY_DB_PATH` | No | Override default database path |

Default database path: `.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`

If no API key is set, the memory engine auto-detects HuggingFace Local embeddings (free, no setup required).

### Memory Feature Flags

The memory server supports 26+ feature flags organized by category. These control which search channels, scoring signals and infrastructure components are active. All flags default to sensible values and most users never need to change them.

| Category | Key Flags | Default |
|----------|-----------|---------|
| **Search Pipeline** | BM25, Graph channel, Reranker, MMR, Co-Activation, FSRS decay, Interference penalty | All enabled |
| **Session/Cache** | Working memory, TTL cache, Session deduplication | All enabled |
| **Memory/Storage** | Auto-promotion, Negative feedback, Content normalization | All enabled |
| **Embedding/API** | Voyage AI, OpenAI, HuggingFace Local (auto-detected) | Provider-dependent |
| **Debug** | Trace mode, Scoring observability, Shadow evaluation | All disabled |

For the complete flag reference with per-flag defaults, see [MCP Server README Section 5](.opencode/skill/system-spec-kit/mcp_server/README.md#5-configuration).

### Database Schema

The memory system uses a SQLite database with 25 tables:

| Table Group | Tables | Purpose |
|-------------|--------|---------|
| **Core** | memories, embeddings, memory_sections | Content storage and vector index |
| **Search** | fts_memories, bm25_index, search_cache | Full-text and keyword search |
| **Graph** | causal_edges, communities, co_activations | Causal relationships and clustering |
| **Lifecycle** | memory_states, validation_feedback, promotions | State machine and quality tracking |
| **Session** | working_memory, session_events | Current session context |
| **Shared** | shared_spaces, memberships, kill_switches | Multi-user access control |
| **Evaluation** | eval_runs, ablation_results, ground_truth | Quality measurement |

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

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Start a New Feature

Use `/spec_kit:complete` to run the full workflow -- research, plan, implementation and memory save.

```
/spec_kit:complete Add email verification to the user registration flow
```

This creates a spec folder under `.opencode/specs/`, researches the codebase, builds a plan, implements it and saves memory automatically. When you come back tomorrow, the memory engine remembers everything about this feature.

---

### Example 2: Resume After a Crash or Compaction

Use `/memory:continue` to recover session context after a context window reset.

```
/memory:continue
```

The command loads the most recent memory files from the active spec folder and presents a session summary so you can pick up exactly where you left off. Working memory deduplication means follow-up queries skip results you have already seen.

---

### Example 3: Debug a Difficult Problem

Use `/spec_kit:debug` to delegate debugging to a fresh-perspective agent with no prior context bias.

```
/spec_kit:debug The authentication middleware is intermittently returning 401 for valid tokens
```

The `@debug` agent applies a 5-phase methodology (Observe, Analyze, Hypothesize, Validate, Fix) and writes a `debug-delegation.md` with findings.

---

### Example 4: Code Review Before Merging

Ask `@review` to evaluate your changes before a pull request.

```
@review Review the changes in src/auth/ for security issues and coding standards
```

The `@review` agent is read-only, applies the `sk-code--review` skill and returns a findings-first severity report.

---

### Example 5: Save Context Before Ending a Session

```
/memory:save
```

This runs `generate-context.js` against your active spec folder, writes a timestamped memory file and indexes it immediately for future retrieval.

---

### Example 6: Deep Research on a Complex Topic

```
/spec_kit:deep-research Investigate how the authentication system handles token refresh across microservices
```

The `@deep-research` agent runs an autonomous investigation loop with externalized state, iterating until it converges on a complete answer or hits the iteration limit.

---

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| New feature end-to-end | `/spec_kit:complete [description]` | Starting any feature from scratch |
| Planning without building | `/spec_kit:plan [description]` | When you want to review the plan first |
| Pick up previous work | `/spec_kit:resume` | Returning to an in-progress spec |
| Investigate a codebase | `@context [question]` | Exploration and research tasks |
| Generate a README | `/create:folder_readme` | Documenting a directory or component |
| Improve a prompt | `/create:prompt` | Prompt engineering with structured frameworks |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Memory server fails to start

**What you see:** OpenCode reports MCP connection error on startup.

**Common causes:** The memory server binary has not been built, or Node.js is below v18.

**Fix:**
```bash
# Build the memory server
cd .opencode/skill/system-spec-kit/mcp_server
npm install && npm run build

# Verify Node.js version
node --version
# Expected: v18.x.x or higher
```

---

### No embeddings generated (memory search returns no results)

**What you see:** `memory_context()` returns empty results even for queries that should match.

**Common causes:** No embedding provider is configured and HuggingFace Local failed to initialize.

**Fix:**
```bash
# Set a Voyage AI key (recommended)
export VOYAGE_API_KEY="your-key-here"

# Or set an OpenAI key
export OPENAI_API_KEY="your-key-here"

# Then re-run memory indexing
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]
```

---

### Gate 3 asks for a spec folder on every message

**What you see:** Every request triggers the spec folder question, even for read-only tasks.

**Common causes:** The request contains a trigger word that the gate system interprets as a file modification intent.

**Fix:** Use "skip context" or add `[skip]` to your message to bypass the gate for read-only exploration. Example: `[skip] What does the auth middleware do?`

---

### `skill_advisor.py` returns low confidence

**What you see:** Gate 2 reports confidence below 0.8 and no skill is loaded.

**Common causes:** The request is ambiguous or the skill system does not have a strong match.

**Fix:** Either rephrase the request with more domain-specific terms, or explicitly name the skill: "Using sk-doc, improve this README."

---

### Quick Fixes

| Problem | Fix |
|---------|-----|
| Memory DB locked | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --checkpoint` |
| Stale memory index | `/memory:manage` then select "reindex" |
| Wrong spec folder picked up | Explicitly set folder: `/memory:save specs/###-folder-name` |
| Command not found | Verify `.opencode/command/` contains the `.md` file for the command |
| Agent not routing correctly | Check `.claude/agents/` or `.opencode/agent/` for the agent definition file |

### Diagnostic Commands

```bash
# Check memory database health
node .opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js

# List all spec folders
ls .opencode/specs/

# Verify MCP server is running
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js --version

# Check skill advisor output for a query
python3 .opencode/skill/scripts/skill_advisor.py "your task description" --threshold 0.8
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Do I need all 18 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core skills -- `system-spec-kit` and `sk-doc` -- cover most documentation workflows. The MCP and cross-AI CLI skills require additional API keys or tools.

---

**Q: Is this only for OpenCode, or does it work with other runtimes?**

A: It works with OpenCode, Codex CLI, Claude Code and Gemini CLI. Agent definitions are mirrored across all four runtime directories. Each runtime has its own adapter files that translate the source-of-truth definitions into the format that runtime expects.

---

**Q: What happens if I do not use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable via memory search. For trivial changes under 5 characters in a single file, Gate 3 does not trigger.

---

**Q: How does the memory system know what is relevant to my current task?**

A: Every memory file has YAML frontmatter with tags, context type and trigger phrases. When you start a session, `memory_match_triggers()` runs a 5-channel hybrid search across all indexed memory files and returns the top matches. The system classifies your intent (7 types), routes by complexity and applies Reciprocal Rank Fusion to combine results from all channels.

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

A: The feature catalog is a 222-entry reference across 21 categories documenting every capability of the memory system. It comes in two versions: a technical reference and a simple-terms companion with plain-language explanations. Both are in `.opencode/skill/system-spec-kit/feature_catalog/`.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](AGENTS.md) | Complete agent routing reference, gate definitions and behavior rules for all runtimes |
| [Spec Kit README](.opencode/skill/system-spec-kit/README.md) | Full spec folder workflow, template architecture (81 templates), validation rules and memory pipeline |
| [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md) | Complete memory API reference (33 tools across 7 layers), retrieval architecture and configuration |
| [INSTALL_GUIDE.md](.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md) | Step-by-step MCP server installation with embedding providers and environment setup |
| [SHARED_MEMORY_DATABASE.md](.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md) | Shared memory guide with spaces, roles, membership and kill switch |
| [ARCHITECTURE.md](.opencode/skill/system-spec-kit/ARCHITECTURE.md) | API boundary contract between scripts/ and mcp_server/ |
| [sk-doc SKILL.md](.opencode/skill/sk-doc/SKILL.md) | Documentation standards, DQI scoring, templates and HVR writing rules |
| [Skills README](.opencode/skill/README.md) | Index of all 18 skills with descriptions and invocation patterns |
| [FEATURE_CATALOG.md](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md) | 222-entry technical reference across 21 categories |
| [FEATURE_CATALOG_IN_SIMPLE_TERMS.md](.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md) | Plain-language companion to the technical catalog |
| [AGENTS_example_fs_enterprises.md](AGENTS_example_fs_enterprises.md) | Example AGENTS.md for a full-stack enterprise project (runtime-neutral) |

### External Resources

| Resource | Description |
|----------|-------------|
| [OpenCode](https://github.com/sst/opencode) | The underlying AI coding assistant platform this framework extends |
| [Voyage AI](https://www.voyageai.com/) | Recommended embedding provider for memory retrieval |
| [HuggingFace Local](https://huggingface.co/) | Free local embedding alternative (no API key required) |

<!-- /ANCHOR:related-documents -->

---

*Documentation version: 4.0 | Last updated: 2026-03-25 | Framework: 12 agents, 18 skills, 22 commands, 42 MCP tools (33 memory + 7 code mode + 1 CocoIndex + 1 sequential thinking)*
