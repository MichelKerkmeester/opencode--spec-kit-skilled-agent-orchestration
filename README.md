<div align="left">

# OpenCode Dev Environment + Spec Kit w/ Cognitive Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases)

> - 99.999% of people won't try this system. Beat the odds?
> - Don't reward me with unwanted coffee: https://buymeacoffee.com/michelkerkmeester
</div>

---

## 📑 TABLE OF CONTENTS

- [🔭 1. OVERVIEW](#1--overview)
- [🚀 2. QUICK START](#2--quick-start)
- [📝 3. SPEC KIT DOCUMENTATION](#3--spec-kit-documentation)
- [🧠 4. MEMORY ENGINE](#4--memory-engine)
- [🤖 5. AGENT NETWORK](#5--agent-network)
- [⌨️ 6. COMMAND ARCHITECTURE](#6--command-architecture)
- [🧩 7. SKILLS LIBRARY](#7--skills-library)
- [🚧 8. GATE SYSTEM](#8--gate-system)
- [💻 9. CODE MODE MCP](#9--code-mode-mcp)
- [🔌 10. EXTENSIBILITY](#10--extensibility)
- [⚙️ 11. CONFIGURATION](#11--configuration)
- [💡 12. USAGE EXAMPLES](#12--usage-examples)
- [🔧 13. TROUBLESHOOTING](#13--troubleshooting)
- [❓ 14. FAQ](#14--faq)
- [📚 15. RELATED DOCUMENTS](#15--related-documents)

---

## 1. 🔭 OVERVIEW
<!-- ANCHOR:overview -->

### What is This?

AI coding assistants are powerful, but they have amnesia. Every session starts from zero. You explain your auth system Monday. By Wednesday, it's a blank slate. Architectural decisions? Lost in chat history. Documentation? "I'll do it later" (you won't).

Two custom-built systems fix this: a **spec-kit documentation framework** and a **cognitive memory MCP server** that turn stateless AI sessions into a continuous, searchable development history. Purpose-built for AI-assisted development, not a wrapper around existing tools.

**Who it's for:** Developers using AI assistants who are tired of re-explaining context every session and losing decisions to chat history while hoping documentation happens "later."

### How It All Connects

```
┌──────────────────────────────────────────────────────────────┐
│                      YOUR REQUEST                            │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  GATE SYSTEM (3 mandatory gates)                             │
│  Gate 1: Understanding ─► Gate 2: Skill Routing ─► Gate 3:   │
│  Context surfacing        Auto-load expertise      Spec      │
│  Dual-threshold           skill_advisor.py         folder    │
│  validation               confidence >= 0.8        HARD BLOCK │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
         ┌─────────────┴──────────────┐
         ▼                            ▼
┌─────────────────┐        ┌─────────────────────┐
│  AGENT NETWORK  │        │  SKILLS LIBRARY     │
│  10 specialized │        │  16 domain skills   │
│  agents with    │◄──────►│  auto-loaded by     │
│  routing logic  │        │  task keywords      │
└────────┬────────┘        └──────────┬──────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────────────────┐
│  MEMORY ENGINE (32 MCP tools: 25 memory + 7 code mode)       │
│  Cognitive tiers ─ Causal graphs ─ Unified Context Engine     │
│  3-channel hybrid: Vector + BM25 + FTS5 (RRF)                │
│  MMR diversity ─ TRM confidence gating ─ query expansion      │
│  Sources: spec memory + constitutional + spec documents      │
│  Embeddings: Voyage | OpenAI | HuggingFace Local (free)      │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  SPEC KIT (documentation framework)                          │
│  specs/###-feature/  ─  memory/  ─  scratch/                 │
│  4 levels ─ 81 templates ─ 13 validation rules               │
└──────────────────────────────────────────────────────────────┘
```

Everything connects. Memory files live *inside* spec folders. Gates enforce documentation before any file change. Skills auto-load based on your task. Agents coordinate and delegate. The result: every AI-assisted session is documented, searchable, recoverable and auditable.

**Local-first**: The Memory Engine runs on your local system with no cloud dependency. See [Embedding Providers](#embedding-providers) for optional cloud upgrades.

### Recent Platform Highlights

- **Hybrid RAG Fusion phase tree (spec 139)**: The memory engine now covers a full multi-phase rollout: baseline tri-channel retrieval (Vector/BM25/FTS5), deterministic alias/tier fixes, frontmatter normalization + reindex flow, session auto-detection hardening, deprecation closure, subsystem hardening, template policy enforcement, and code-quality completion.
- **Hybrid retrieval baseline (RRF + MMR + TRM)**: Tri-channel fusion via Reciprocal Rank Fusion, MMR diversity pruning, Transparent Reasoning Module confidence gating, and multi-query expansion are active in the Unified Context Engine.
- **Frontmatter normalization + title disambiguation (spec 139/004)**: Managed metadata was standardized across templates, spec docs and memory files so dashboard/search titles are unique, parser compatibility accepts `contextType` and `context_type`, and bulk backfill + reindex scripts keep the index consistent.
- **SpecKit Phase System (spec 138)**: phase-aware recommendation and folder creation (`--recommend-phases`, `--phase`) plus recursive validation (`--recursive`) are integrated. Implementation is broadly complete (`31/34`) with fixture backlog tracked in `T005`, `T028`, and `T033`.
- **Code review baseline promoted (spec 041)**: `sk-code--review` is a first-class findings-first review baseline with a baseline-plus-overlay contract and mandatory security/correctness minimums.
- **AGENTS.md modernization shipped**: Gate formatting was condensed from ASCII box blocks to structured markdown, section topology was consolidated from 9 to 8, and `AGENTS_example_fs_enterprises.md` was added as a runtime-neutral companion.
- **Gemini CLI is the 4th runtime**: 8 agents, 19 TOML command wrappers, 11 skill symlinks and 3 MCP servers. Agents optimized for gemini-3.1-pro within a 400K effective token window.
- **Spec documents are indexed and searchable**: spec folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`) surface via `find_spec` and `find_decision` intents.
- **473 anchor tags across 74 READMEs**: section-level retrieval with ~93% token savings over loading full files.
- **Runtime DB path standardized**: `MEMORY_DB_PATH` aligned to `mcp_server/dist/database/context-index.sqlite` across all runtime configurations.

### Requirements

| Requirement                                 | Minimum   | Recommended |
| ------------------------------------------- | --------- | ----------- |
| [OpenCode](https://github.com/sst/opencode) | v1.0.190+ | Latest      |
| Node.js                                     | v18+      | v20+        |
| npm                                         | v9+       | v10+        |

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### Prerequisites

- [OpenCode](https://github.com/sst/opencode) v1.0.190+ (`opencode --version`)
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)

### 30-Second Setup

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode-spec-kit-framework.git
cd opencode-spec-kit-framework

# 2. Install and build the Memory Engine
cd .opencode/skill/system-spec-kit && npm install && npm run build && cd ../../..

# 3. Launch OpenCode
opencode
```

### Verify Installation

```bash
# Inside OpenCode, test the memory system
/memory:manage health
# Expected: "Status: healthy" with database stats

# Test skill routing
# Ask: "What skills are available?"
# Expected: 16 skills listed
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📝 SPEC KIT DOCUMENTATION
<!-- ANCHOR:spec-kit-documentation -->

4 levels, 81 templates, 13 validation rules.

Every feature leaves a trail. Not for bureaucracy. For your future self, your team and the AI that picks up where you left off.

### Four Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | >=500          | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

### CORE + ADDENDUM Template Architecture

**81 templates** across the v2.2 composition model. CORE templates are shared across levels. ADDENDUM templates extend them. Update CORE once and all levels inherit. Zero duplication.

```
Level 1:  [CORE templates]                    -> 4 files
Level 2:  [CORE] + [L2-VERIFY addendum]       -> 5 files
Level 3:  [CORE] + [L2] + [L3-ARCH addendum]  -> 6 files
Level 3+: [CORE] + [all addendums]             -> 6+ files
```

| Template                    | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| `spec.md`                   | Feature scope, requirements, constraints (frozen)     |
| `plan.md`                   | Implementation approach and design decisions          |
| `tasks.md`                  | Ordered task breakdown with status tracking           |
| `checklist.md`              | QA validation items (P0/P1/P2 priority)               |
| `decision-record.md`        | Architectural decisions with rationale and trade-offs |
| `research.md`               | Technical investigation findings (optional, L3+)      |
| `implementation-summary.md` | Post-implementation record of what was built          |

### Validation and Automation

**13 pluggable validation rules** run before you can mark any spec folder complete:

| Rule                   | Validates                                    |
| ---------------------- | -------------------------------------------- |
| `check-anchors`        | Reference integrity                          |
| `check-placeholders`   | No `[PLACEHOLDER]` text remaining            |
| `check-frontmatter`    | YAML metadata present and valid              |
| `check-sections`       | Required sections exist with content         |
| `check-complexity`     | Complexity score matches documentation level |
| `check-evidence`       | Evidence citations present                   |
| `check-priority-tags`  | P0/P1/P2 tags applied correctly              |
| `check-files`          | Required files exist for declared level      |
| `check-folder-naming`  | `###-kebab-case` naming convention           |
| `check-level-match`    | Declared level matches actual complexity     |
| `check-level`          | Level detection from folder contents         |
| `check-section-counts` | Minimum section counts met                   |
| `check-ai-protocols`   | AI interaction rules validated               |

Exit code 0 = pass. Exit code 2 = must fix.

### Frontmatter Normalization + Index Rebuild

Spec 139/004 adds a metadata normalization workflow for all indexed markdown:

- Managed keys: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`
- Memory dashboard titles are disambiguated with scoped suffixes
- Parser compatibility accepts both `contextType` and legacy `context_type`
- Compose pipeline preserves one top-level frontmatter block in composed templates

Operational workflow:

```bash
# 1) Dry-run metadata normalization
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --include-archive --report /tmp/frontmatter-dry-run.json

# 2) Apply metadata normalization
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --apply --include-archive --report /tmp/frontmatter-apply.json

# 3) Verify composed templates
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify

# 4) Rebuild embeddings index
node .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js
```

<!-- /ANCHOR:spec-kit-documentation -->

---

## 4. 🧠 MEMORY ENGINE
<!-- ANCHOR:memory-engine -->

25 MCP tools across 7 cognitive layers.

> *Remember everything. Surface what matters. Keep it private.*

Your AI assistant forgets everything between sessions. The Memory Engine fixes this with 23 MCP tools across 7 architectural layers: 3-source indexing, 7-intent retrieval routing, schema v15 metadata (`document_type`, `spec_level`) and document-type scoring. The Unified Context Engine (spec 138) adds a 3-channel hybrid retrieval pipeline with RRF fusion, MMR diversity pruning, confidence gating and causal graph enrichment.

### 3-Source Discovery Pipeline

The memory index builds from 5 distinct source types, each with its own discovery path and importance weight:

| #   | Source                    | Discovery Path                        | Weight  | What Gets Indexed                          |
| --- | ------------------------- | ------------------------------------- | ------- | ------------------------------------------ |
| 1   | **Constitutional docs**   | `constitutional.md` files             | 1.0     | System rules (never decay, always surface) |
| 2   | **Spec folder documents** | `.opencode/specs/**/*.md`             | 0.6-0.8 | Specs, plans, tasks, decisions, summaries  |
| 3   | **Memory files**          | `specs/###-feature/memory/*.{md,txt}` | 0.5     | Session context, decisions, progress       |

Source 2 was added in spec 126 — prior to that, spec folder documents (the most authoritative project knowledge) were invisible to memory search. Controlled via `includeSpecDocs` parameter on `memory_index_scan` and `SPECKIT_INDEX_SPEC_DOCS` environment variable.

### MCP Tool Layers

Each layer has enforced token budgets to prevent context bloat:

| Layer                | Tools                                                                                                                        | Purpose                                                       | Token Budget |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------ |
| **L1** Orchestration | `memory_context`                                                                                                             | Unified entry with intent-aware routing                       | 2,000        |
| **L2** Core          | `memory_search`, `memory_match_triggers`, `memory_save`                                                                      | Semantic search, fast keyword matching (<50ms), file indexing | 1,500        |
| **L3** Discovery     | `memory_list`, `memory_stats`, `memory_health`                                                                               | Browse, statistics, health checks                             | 800          |
| **L4** Mutation      | `memory_update`, `memory_delete`, `memory_validate`                                                                          | Update metadata, delete, record feedback                      | 500          |
| **L5** Checkpoints   | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`                                            | Save/restore memory state (undo button for your index)        | 600          |
| **L6** Analysis      | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` | Epistemic tracking, causal graphs                             | 1,200        |
| **L7** Maintenance   | `memory_index_scan`, `memory_get_learning_history`                                                                           | Bulk indexing, learning trends                                | 1,000        |

Most agents interact only with L1-L2. Mutation (L4) and lifecycle (L5) are reserved for explicit user actions. Analysis (L6) is invoked at task boundaries for learning measurement.

### Cognitive Features

Not basic vector storage. Inspired by biological working memory with cognitive subsystems:

**Attention-Based Decay**: memory relevance decays using `recency x frequency x importance` scoring.

```
new_score = current_score x (decay_rate ^ turns_elapsed)
```

| Tier           | Decay Rate | Behavior                             |
| -------------- | ---------- | ------------------------------------ |
| Constitutional | 1.00       | Never decays, always surfaces        |
| Normal         | 0.80       | Gradual fade over conversation turns |
| Temporary      | 0.60       | Fast fade, session-scoped            |

**Tiered Content Injection**: content delivery adapts to memory state.

| Memory State | Score Range | Injection Behavior                 |
| ------------ | ----------- | ---------------------------------- |
| `HOT`        | >= 0.8      | Full content injected into context |
| `WARM`       | 0.25 - 0.79 | Summary only                       |
| `COLD`       | < 0.25      | Trigger phrases only (suppressed)  |

**Co-Activation (Spreading Activation)**: when a primary memory is activated, semantically related memories receive a 0.35 score boost. Search for "authentication" and the system co-activates memories about JWT tokens and OAuth setup along with session management.

Two additional subsystems: **FSRS Scheduler** (spaced repetition for review intervals) and **Prediction Error Gating** (novel discoveries amplified, expected content deprioritized).

### Hybrid Search Architecture

Three retrieval channels fuse via Reciprocal Rank Fusion (RRF) in the Unified Context Engine (spec 138):

| Channel            | Method                            | Strength                                         |
| ------------------ | --------------------------------- | ------------------------------------------------ |
| **Vector**         | Semantic similarity (embeddings)  | Conceptual matching, paraphrase detection        |
| **BM25 Keyword**   | Term frequency / inverse document | Technical terms, code identifiers, exact phrases |
| **FTS5 Full-Text** | SQLite full-text search           | Exact substring matching, structured queries     |

**Post-fusion processing**: MMR diversity pruning (reduces redundant results by >= 30%), Transparent Reasoning Module confidence gating (blocks results below `confidence_threshold=0.65`, never returns empty set), multi-query expansion (>= 3 query variants for vocabulary mismatch resolution) and AST-based document section extraction.

**Latency target**: p95 <= 120ms with all three channels active on the v15 SQLite schema. Zero schema migrations required.

**4 embedding providers**: Voyage AI, OpenAI, HuggingFace Local (free, default), auto-detection.

**Spec Hardening**: import-path fixes, `specFolder` filtering, metadata preservation, vector metadata plumbing and stable causal edge semantics.

**Intent-Aware Scoring**: weights adjust for 7 task types.

| Task Intent      | Weight Adjustment                                     |
| ---------------- | ----------------------------------------------------- |
| `fix_bug`        | Boosts error history, debugging context               |
| `add_feature`    | Boosts implementation patterns, existing architecture |
| `understand`     | Balanced weights across all memory types              |
| `refactor`       | Boosts code structure, dependency information         |
| `security_audit` | Boosts security decisions, vulnerability context      |
| `find_spec`      | Boosts spec documents, plans, decision records        |
| `find_decision`  | Boosts decision records, architectural context        |

**Document-Type Scoring**: search results are multiplied by document type to prioritize authoritative sources. Schema v15 tracks `document_type` and `spec_level` per indexed entry.

| Document Type            | Multiplier | Rationale                                    |
| ------------------------ | ---------- | -------------------------------------------- |
| `constitutional`         | 2.0x       | System rules — always highest priority       |
| `spec`                   | 1.4x       | Authoritative requirements and scope         |
| `decision_record`        | 1.4x       | Architectural decisions with rationale       |
| `plan`                   | 1.3x       | Implementation approach and design           |
| `tasks`                  | 1.1x       | Ordered task breakdowns                      |
| `implementation_summary` | 1.1x       | Post-implementation records                  |
| `research`               | 1.0x       | Investigation findings                       |
| `checklist`              | 1.0x       | QA validation items                          |
| `handover`               | 1.0x       | Session continuation context                 |
| `memory`                 | 1.0x       | Baseline — session context and decisions     |
| `readme`                 | 0.8x       | Documentation (informational, not decisions) |
| `scratch`                | 0.6x       | Temporary workspace (lowest priority)        |

### ANCHOR Format

Structured content markers enabling selective retrieval with ~93% token savings:

```markdown
<!-- ANCHOR:decisions -->
Key architectural decisions for this spec...
<!-- /ANCHOR:decisions -->
```

Instead of loading entire memory files (~2,000 tokens), the system retrieves only the relevant anchor section (~150 tokens). ~473 anchor tags across 74 READMEs enable section-level extraction throughout the project.

### Causal Memory Graph

Every decision has a lineage. The causal graph tracks 6 relationship types:

| Relationship   | Direction | Example                                                           |
| -------------- | --------- | ----------------------------------------------------------------- |
| `caused`       | A -> B    | "JWT decision" -> caused -> "token refresh implementation"        |
| `derived_from` | A <- B    | "rate limiter config" -> derived from -> "load testing results"   |
| `supports`     | A -> B    | "performance benchmarks" -> supports -> "caching decision"        |
| `supersedes`   | A -> B    | "v2 auth flow" -> supersedes -> "v1 auth flow"                    |
| `enabled`      | A -> B    | "OAuth2 setup" -> enabled -> "social login feature"               |
| `contradicts`  | A <-> B   | "stateless approach" -> contradicts -> "session storage proposal" |

Use `memory_drift_why` to trace the causal chain up to N hops. `memory_causal_stats` reports coverage percentage (target: 60% of memories linked).

**Spec Document Chains**: when spec folder documents are indexed, `createSpecDocumentChain()` automatically establishes relationship edges between related documents within the same spec folder:

```
spec.md ──caused──► plan.md ──caused──► tasks.md ──caused──► implementation-summary.md
                       ▲
  decision-record.md ──supports──┘   research.md ──supports──► spec.md
  checklist.md ──supports──► spec.md
```

This enables traversal from high-level specs down to implementation details (and back) via `memory_drift_why`.

> Full reference: [MCP Server Documentation](.opencode/skill/system-spec-kit/mcp_server/README.md) | [Memory System Guide](.opencode/skill/system-spec-kit/README.md)

<!-- /ANCHOR:memory-engine -->

---

## 5. 🤖 AGENT NETWORK
<!-- ANCHOR:agent-network -->

11 specialized agents with role-based routing.

Eleven specialized agents prevent AI assistants from making assumptions, skipping documentation, creating technical debt and drifting from scope. Two are built into OpenCode. Nine are custom agents in `.opencode/agent/`.

11 specialized agents across 4 runtime platforms (OpenCode, Claude Code, ChatGPT, Gemini CLI) with aligned role definitions.

### All Agents

| Agent          | Type     | Model         | Role                                                               |
| -------------- | -------- | ------------- | ------------------------------------------------------------------ |
| `@general`     | Built-in |               | Implementation, complex coding tasks                               |
| `@explore`     | Built-in |               | Quick codebase exploration, file discovery                         |
| `@orchestrate` | Custom   | Primary       | Multi-agent coordination with enterprise patterns                  |
| `@context`     | Custom   | claude-haiku  | Context retrieval and synthesis for other agents                   |
| `@speckit`     | Custom   | claude-sonnet | Spec folder creation (exclusive: only agent that writes spec docs) |
| `@debug`       | Custom   | claude-opus   | Fresh-perspective debugging, root cause analysis                   |
| `@research`    | Custom   | claude-opus   | Evidence gathering, technical investigation                        |
| `@review`      | Custom   | inherited     | Code review with pattern validation (READ-ONLY)                    |
| `@write`       | Custom   | claude-sonnet | Documentation generation (READMEs, skills, guides)                 |
| `@handover`    | Custom   | claude-haiku  | Session continuation, context preservation                         |
| `@ultra-think` | Custom   | Primary       | Multi-strategy planning architect (planning-only, no file changes) |

### Enterprise Orchestration

The `@orchestrate` agent implements distributed-systems patterns:

- **Context Window Budget (CWB)**: tracks context consumption across delegated tasks. Wave-based dispatching enables 10+ parallel agents without overflow.
- **Circuit Breaker**: isolates failing agents (3 failures -> OPEN state, 60s cooldown)
- **Saga Compensation**: reverse-order rollback when multi-task workflows fail
- **Quality Gates**: pre/mid/post execution scoring with 70-point threshold
- **Resource Budgeting**: token budget management (50K default, 80% warning, 100% halt)
- **Checkpointing**: recovery snapshots every 5 tasks or 10 tool calls
- **Conditional Branching**: IF/THEN/ELSE logic with 3-level nesting
- **Sub-Orchestrator Pattern**: delegates complex sub-workflows to nested orchestrators

### Runtime Platforms

Each runtime gets its own agent adapter directory. Agent bodies share the same OpenCode source content. Frontmatter adapts to what each platform expects.

| Runtime         | Agent Directory            | Config File             | Model                    |
| --------------- | -------------------------- | ----------------------- | ------------------------ |
| **OpenCode**    | `.opencode/agent/`         | `opencode.json`         | Provider default         |
| **Claude Code** | `.claude/agents/`          | `.claude/mcp.json`      | claude-sonnet/opus/haiku |
| **ChatGPT**     | `.opencode/agent/chatgpt/` | n/a                     | gpt-4.1                  |
| **Gemini CLI**  | `.gemini/agents/`          | `.gemini/settings.json` | gemini-3.1-pro           |

OpenCode is the source of truth. Claude, ChatGPT and Gemini directories are runtime adapters that reference or mirror the same agent definitions. Edit `.opencode/agent/` and all runtimes stay in sync.

### How Agents Get Chosen

`@research` for investigation. `@speckit` for spec documentation (exclusively). `@debug` when stuck 3+ attempts. `@review` for code quality. `@orchestrate` for multi-agent coordination. `@ultra-think` for multi-strategy planning analysis on complex tasks.

### Fresh-Perspective Debugging

The `@debug` agent uses a 4-phase methodology: Observe, Analyze, Hypothesize, Fix. It starts with no prior context on purpose. Trigger with `/spec_kit:debug`, select your preferred model and get a fresh perspective.

<!-- /ANCHOR:agent-network -->

---

## 6. ⌨️ COMMAND ARCHITECTURE
<!-- ANCHOR:command-architecture -->

19 commands across 4 namespaces with 23 YAML assets.

Commands are user-triggered workflows built on a two-layer architecture. Markdown entry points route to YAML execution engines.

**Layer 1: Entry Point (.md)**: user-facing interface for input collection, setup and routing.
**Layer 2: Execution Engine (.yaml)**: behavioral spec with step enumeration, validation gates, agent prompts and circuit breakers.

**Why commands beat free-form prompts**: One prompt. Twelve steps. Zero manual overhead.

| Aspect            | Free-Form Prompts    | Commands                 |
| ----------------- | -------------------- | ------------------------ |
| Step Memory       | You remember each    | Workflow baked in        |
| Interaction Count | 12 prompts for 12    | 1 prompt, 12 steps       |
| Enforcement       | No enforcement       | Gates prevent skipping   |
| Skill Loading     | Manual skill loading | Auto-loads what's needed |

### spec_kit/ (8 commands)

All support `:auto` and `:confirm` mode suffixes.

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `/spec_kit:complete`  | Full workflow: spec -> plan -> implement -> verify     |
| `/spec_kit:plan`      | Planning only, no implementation                       |
| `/spec_kit:implement` | Execute an existing plan                               |
| `/spec_kit:phase`     | Decompose a spec into phased child folders             |
| `/spec_kit:research`  | Technical investigation with evidence gathering        |
| `/spec_kit:debug`     | Delegate debugging to a fresh-perspective sub-agent    |
| `/spec_kit:resume`    | Continue a previous session (auto-loads memory)        |
| `/spec_kit:handover`  | Create session handover (`:quick` or `:full` variants) |

### memory/ (5 commands)

| Command            | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `/memory:save`     | Save context via `generate-context.js`                        |
| `/memory:continue` | Session recovery from crash or compaction                     |
| `/memory:context`  | Unified retrieval with intent-aware routing                   |
| `/memory:learn`    | Explicit learning capture (`correct` subcommand for mistakes) |
| `/memory:manage`   | Database ops: stats, health, cleanup, checkpoints             |

### create/ (5 commands)

| Command                   | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `/create:sk-skill`        | Unified skill workflows (create/update/file)              |
| `/create:agent`           | Scaffold a new agent definition                           |
| `/create:folder_readme`   | Unified README + install guide creation                   |
| `/create:changelog`       | Create a changelog entry from recent work                 |
| `/create:prompt`          | Create or improve AI prompts with structured frameworks   |

### Utility (1 command)

| Command         | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `/agent_router` | Route requests to AI Systems with full System Prompt identity adoption |

<!-- /ANCHOR:command-architecture -->

---

## 7. 🧩 SKILLS LIBRARY
<!-- ANCHOR:skills-library -->

16 domain skills, auto-loaded by task keywords.

Skills are domain expertise on demand. The AI loads the right skill and already knows your conventions.

### All Skills

| Skill                 | Domain        | Purpose                                                                                |
| --------------------- | ------------- | -------------------------------------------------------------------------------------- |
| `mcp-code-mode`       | Integrations  | External tools via Code Mode (Figma, GitHub, ClickUp)                                  |
| `mcp-figma`           | Design        | Figma file access, components, styles, comments                                        |
| `system-spec-kit`     | Documentation | Spec folders, templates, memory integration, context preservation and memory workflows |
| `mcp-chrome-devtools` | Browser       | DevTools automation, screenshots, debugging                                            |
| `mcp-clickup`         | Project Mgmt  | ClickUp project management via CLI-first routing with MCP fallback                     |
| `sk-code--full-stack` | Multi-Stack   | Go, Node.js, React, React Native, Swift, auto-detected via marker files                |
| `sk-code--opencode`   | System Code   | TypeScript, Python, Shell for MCP servers and scripts                                  |
| `sk-code--web`        | Web Dev       | Webflow, vanilla JS: implementation, debugging, verification                           |
| `sk-code--review`     | Review        | Findings-first review baseline with security/correctness minimums and baseline+overlay contract |
| `sk-doc`              | Docs          | Document quality scoring, skill creation and install guides                            |
| `sk-git`              | Git           | Commits, branches, PRs, worktrees                                                      |
| `sk-prompt-improver`  | Prompt Eng    | Prompt optimization with 7 frameworks and CLEAR scoring                                |
| `cli-gemini`          | Cross-AI     | Gemini CLI orchestration for web research, code review, architecture analysis          |
| `cli-codex`           | Cross-AI     | Codex CLI orchestrator for OpenAI cross-AI tasks                                       |
| `cli-claude-code`     | Cross-AI     | Claude Code CLI orchestrator for deep reasoning, extended thinking, structured output  |
| `cli-copilot`         | Cross-AI     | Copilot CLI orchestrator for multi-model tasks, cloud delegation, plan mode, autopilot |

### Auto-Detection

`skill_advisor.py` analyzes your request keywords. Confidence >= 0.8 = skill auto-loads.

**Multi-Stack Auto-Detection** (`sk-code--full-stack`):

| Stack            | Category | Detection Marker                                | Example Patterns                  |
| ---------------- | -------- | ----------------------------------------------- | --------------------------------- |
| **Go**           | backend  | `go.mod`                                        | Domain layers, table-driven tests |
| **Node.js**      | backend  | `package.json` with "express"                   | Express routes, async/await       |
| **React**        | frontend | `next.config.js` or `package.json` with "react" | Server/Client components, hooks   |
| **React Native** | mobile   | `app.json` with "expo"                          | Navigation, hooks, platform APIs  |
| **Swift**        | mobile   | `Package.swift`                                 | SwiftUI, Combine, async/await     |

### Skill Content Structure

Each skill is organized for progressive disclosure:

- `SKILL.md` as the entrypoint and routing surface
- `references/` for deeper documentation and standards
- `assets/` for reusable templates and examples
- Optional `scripts/` for deterministic automation and validation

See [Skills Library README](.opencode/skill/README.md#5-skill-structure) for directory conventions and authoring guidance.

<!-- /ANCHOR:skills-library -->

---

## 8. 🚧 GATE SYSTEM
<!-- ANCHOR:gate-system -->

3 mandatory gates before any file change.

Every request passes through mandatory gates before the AI touches a single file. *Enforced*, not suggested. No exceptions.

```
Request ──► Gate 1 (SOFT) ──► Gate 2 (REQUIRED) ──► Gate 3 (HARD) ──► Execute
            Understanding      Skill Routing         Spec Folder
```

**Gate 1: Understanding + Context Surfacing** (SOFT BLOCK)
Dual-threshold validation: `READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)`. Both must pass. If either fails, the AI investigates (max 3 iterations) before escalating with options. Surfaces relevant memories via trigger matching before you even ask.

**Gate 2: Skill Routing** (REQUIRED)
Runs `skill_advisor.py` against your request. Confidence >= 0.8 means the skill *must* be loaded. This ensures the right domain expertise is always in context.

**Gate 3: Spec Folder** (HARD BLOCK)
If the request involves *any* file modification, the AI must ask: A) Use existing? B) Create new? C) Update related? D) Skip? E) Phase folder — target a specific phase child (e.g., `specs/NNN-name/001-phase/`)? No file changes without an answer.

**Post-Execution Rules:**
- **Memory Save**: `generate-context.js` is mandatory (no manual memory file creation)
- **Completion Verification**: AI loads `checklist.md` and verifies every item with evidence

### Analysis Lenses

Six lenses applied silently to catch problems:

| Lens               | Catches                                    |
| ------------------ | ------------------------------------------ |
| **SYSTEMS**        | Missed dependencies, side effects          |
| **BIAS**           | Solving symptoms instead of root causes    |
| **SCOPE**          | Solution complexity exceeding problem size |
| **CLARITY**        | Over-abstraction, unearned complexity      |
| **VALUE**          | Cosmetic changes disguised as improvements |
| **SUSTAINABILITY** | Future maintenance nightmares              |

### Auto-Detected Anti-Patterns

24 pre-indexed anti-patterns with automatic detection. Six core patterns:

| Pattern                | Trigger                          | Response                                                   |
| ---------------------- | -------------------------------- | ---------------------------------------------------------- |
| Scope creep            | "also add", "bonus feature"      | "That's a separate change."                                |
| Over-engineering       | "future-proof", "might need"     | "Is this solving a current problem or a hypothetical one?" |
| Gold-plating           | "while we're here"               | "That's outside current scope. Track separately?"          |
| Premature optimization | "could be slow"                  | "Has this been measured?"                                  |
| Cargo culting          | "best practice", "always should" | "Does this pattern fit this specific case?"                |
| Wrong abstraction      | "DRY this up" (2 instances)      | "Similar code isn't always the same concept."              |

<!-- /ANCHOR:gate-system -->

---

## 9. 💻 CODE MODE MCP
<!-- ANCHOR:code-mode-mcp -->

7 tools for external integrations with 98.7% context savings.

External tool integration via TypeScript execution. Instead of loading all tool definitions into context upfront, Code Mode uses **progressive disclosure**: search for tools, load only what's needed, execute in TypeScript.

### Code Mode Tools (7)

| Tool                         | Purpose                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| `search_tools`               | Discover relevant tools by task description                 |
| `tool_info`                  | Get complete tool parameters and TypeScript interface       |
| `call_tool_chain`            | Execute TypeScript code with access to all registered tools |
| `list_tools`                 | List all currently registered tool names                    |
| `register_manual`            | Register a new tool provider                                |
| `deregister_manual`          | Remove a tool provider                                      |
| `get_required_keys_for_tool` | Check required environment variables for a tool             |

### Progressive Tool Disclosure

```typescript
// 1. Discover relevant tools
search_tools({ task_description: "webflow site management" })

// 2. Get parameter details
tool_info({ tool_name: "webflow.webflow_sites_list" })

// 3. Execute with TypeScript
call_tool_chain({ code: "await webflow.webflow_sites_list({})" })
```

### Performance

| Metric             | Without Code Mode      | With Code Mode          |
| ------------------ | ---------------------- | ----------------------- |
| **Context tokens** | 141k (47 tools loaded) | 1.6k (on-demand)        |
| **Round trips**    | 15+ for chained ops    | 1 (TypeScript chain)    |
| **Type safety**    | None                   | Full TypeScript support |

**Supported Integrations**: GitHub (issues, PRs, commits), Figma (design files, components), Webflow (sites, CMS), ClickUp (tasks, workspaces), Chrome DevTools (browser automation).

**Configuration**: `.utcp_config.json` defines available MCP servers. Tool naming: `{manual}.{manual}_{tool}()`.

<!-- /ANCHOR:code-mode-mcp -->

---

## 10. 🔌 EXTENSIBILITY
<!-- ANCHOR:extensibility -->

Custom skills, agents, commands and templates.

Every component follows standardized patterns for customization:

**Custom Skills**: `/create:sk-skill my-skill full-create` or `init_skill.py`. Auto-detected by `skill_advisor.py`. Structure: SKILL.md + references/ + assets/ + scripts/.

**Custom Agents**: `/create:agent my-agent`. Define constraints, tool access, delegation rules. Integrate with gate system and orchestration.

**Custom Commands**: two-layer (.md + .yaml). Optimize to <=600 lines.

**Template System**: 81 templates across CORE + ADDENDUM v2.2. Update once, inherit everywhere. 13 validation rules ensure compliance.

**Philosophy**: Convention over configuration. Templates provide structure. You own the content. The framework adapts to your project.

<!-- /ANCHOR:extensibility -->

---

## 11. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

### Configuration File

**Location**: `opencode.json` (project root)

The configuration file defines 3 MCP servers and their settings:

```json
{
  "mcpServers": {
    "sequential-thinking": { "..." },
    "spec_kit_memory": { "..." },
    "code-mode": { "..." }
  }
}
```

### Embedding Providers

The memory system auto-detects available API keys and selects the best provider. Your code never leaves your machine unless you explicitly choose a cloud provider.

| Provider      | Dimensions | Requirements     | Best For                            |
| ------------- | ---------- | ---------------- | ----------------------------------- |
| **Voyage AI** | 1024       | `VOYAGE_API_KEY` | Recommended: best retrieval quality |
| **OpenAI**    | 1536/3072  | `OPENAI_API_KEY` | Cloud-based alternative             |
| **HF Local**  | 768        | Node.js only     | Privacy, offline, free (default)    |

```bash
# Voyage provider (recommended)
export VOYAGE_API_KEY=pa-...

# OpenAI provider (alternative)
export OPENAI_API_KEY=sk-proj-...

# Force HF local (even with API keys set)
export EMBEDDINGS_PROVIDER=hf-local
```

**Privacy note:** HF Local runs embeddings on your machine. No external API calls. Works fully offline. This is the default if no API keys are set.

### MCP Servers

| Server                  | Tools | Purpose                                                               |
| ----------------------- | ----- | --------------------------------------------------------------------- |
| **Spec Kit Memory**     | 25    | Cognitive memory system (the memory engine)                           |
| **Code Mode**           | 7     | External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools) |
| **Sequential Thinking** |       | Structured multi-step reasoning for complex problems                  |

See individual install guides in [`.opencode/install_guides/`](.opencode/install_guides/) for setup details and install scripts.

<!-- /ANCHOR:configuration -->

---

## 12. 💡 USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

Real workflows, not toy examples.

### Common Workflow Patterns

| Task                       | Command / Action                  | What Happens                                                  |
| -------------------------- | --------------------------------- | ------------------------------------------------------------- |
| Resume previous work       | `/spec_kit:resume`                | Loads memory context, shows where you left off                |
| Save session context       | `/memory:save`                    | Extracts context via `generate-context.js`, indexes it        |
| Start a documented feature | `/spec_kit:complete "add auth"`   | Creates spec folder, templates, implements, verifies          |
| Search past decisions      | `/memory:context "auth approach"` | Semantic search across all saved memories                     |
| Debug a stuck issue        | `/spec_kit:debug`                 | Spawns fresh-perspective sub-agent with model selection       |
| Plan without implementing  | `/spec_kit:plan "refactor API"`   | Creates spec + plan, stops before code changes                |
| Hand off to next session   | `/spec_kit:handover`              | Creates continuation doc (`:quick` = 15 lines, `:full` = 150) |
| Create a new skill         | `/create:sk-skill my-skill full-create` | Scaffolds complete skill structure with templates      |

### End-to-End Example: Feature Development

```bash
# 1. Start with a plan
/spec_kit:plan "add rate limiting to API"
# -> Creates specs/<NNN-rate-limiting>/ with spec.md and plan.md

# 2. Review and approve the plan, then implement
/spec_kit:implement
# -> Follows plan.md, creates code, runs verification

# 3. Save context for future reference
/memory:save
# -> Extracts decisions, blockers, progress into memory/

# 4. Next week, pick up where you left off
/spec_kit:resume
# -> Loads memories, shows checklist status, continues
```

### End-to-End Example: Debugging

```bash
# After 3+ failed attempts at fixing an issue:
/spec_kit:debug
# -> Prompts: "Select model: Opus / Sonnet / Gemini"
# -> Dispatches @debug agent with 4-phase methodology
# -> Observe -> Analyze -> Hypothesize -> Fix
# -> Fresh perspective, no prior assumptions
```

### Memory Workflow Examples

Practical examples of the MCP memory tools in action.

Context retrieval at the start of a session:
```
memory_context({ input: "implementing dark mode toggle", mode: "auto" })
→ Auto-detects intent: "add_feature"
→ Returns: relevant prior work, decisions, patterns
```

Semantic search with full content embedding:
```
memory_search({ query: "authentication flow", specFolder: "005-auth", includeContent: true })
→ Returns: ranked results with full content embedded
→ Constitutional memories always appear first
```

Bulk indexing with source control:
```
memory_index_scan({ includeSpecDocs: true })
→ Indexes all 3 sources (memory files, constitutional, spec documents)
→ Skips unchanged files (content hash comparison)
→ Generates embeddings only for new/modified content

memory_index_scan({ specFolder: "<NNN-rate-limiting>", force: true })
→ Re-indexes a single spec folder (force = regenerate all embeddings)

memory_index_scan({ includeSpecDocs: false })
→ Index without spec documents (equivalent to pre-spec-126 behavior)
```

<!-- /ANCHOR:usage-examples -->

---

## 13. 🔧 TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

Something broken? Start here.

### Common Issues

#### Memory MCP server won't start

**Symptom**: OpenCode shows "MCP server failed to connect" for `spec_kit_memory`

**Cause**: TypeScript hasn't been compiled to `dist/`

**Solution**:
```bash
cd .opencode/skill/system-spec-kit
npm install && npm run build
```

#### `/memory:save` fails with "generate-context.js not found"

**Symptom**: Error when saving context

**Cause**: Build step was skipped. `scripts/dist/` doesn't exist.

**Solution**:
```bash
cd .opencode/skill/system-spec-kit && npm run build
```

#### Skills not loading automatically

**Symptom**: AI doesn't load relevant skill for your task

**Cause**: `skill_advisor.py` confidence below 0.8, or OpenCode version too old

**Solution**:
```bash
# Check OpenCode version (need v1.0.190+)
opencode --version

# Manually invoke a skill if needed
# Ask: "Load the sk-git skill"
```

### Quick Fixes

| Problem                      | Quick Fix                                                      |
| ---------------------------- | -------------------------------------------------------------- |
| MCP server won't start       | `cd .opencode/skill/system-spec-kit && npm run build`          |
| Context window full          | `/memory:continue` for session recovery                        |
| Stale memory results         | `/memory:manage cleanup`                                       |
| Spec folder validation fails | Check exit code: 0=pass, 1=warning, 2=error                    |
| Embedding dimension mismatch | Each provider uses its own SQLite DB. Switch providers safely. |

### Diagnostic Commands

```bash
# Check memory system health
/memory:manage health

# View memory statistics
/memory:manage stats

# Verify MCP server is running (inside OpenCode)
# Look for "spec_kit_memory" in the status bar

# Test build
cd .opencode/skill/system-spec-kit && npm run test:cli
```

<!-- /ANCHOR:troubleshooting -->

---

## 14. ❓ FAQ
<!-- ANCHOR:faq -->

### General Questions

**Q: Do I need API keys to use the memory system?**

A: No. HuggingFace Local runs on your machine with no API keys needed. It's the default fallback. Voyage AI and OpenAI are optional upgrades for better retrieval quality.

---

**Q: Can I use this with my existing project?**

A: Yes. Copy `.opencode/`, `opencode.json` and `AGENTS.md` to your project root. The system adapts to your codebase. It doesn't impose a project structure.

---

**Q: How is this different from Cursor's memory or Copilot's context?**

A: Those are session-scoped. This system persists across sessions, models and even projects. It uses causal graphs to trace decision lineage and cognitive tiers to prioritize relevance. It uses ANCHOR format for 93% token savings. It's also local-first. Your code stays on your machine.

---

**Q: Is this overkill for solo developers?**

A: You might think so, until you lose 3 hours re-debugging an issue you already solved last month. Solo developers benefit *more* because there's no team to ask "hey, why did we do it this way?" The memory system is your institutional knowledge.

---

**Q: What happens if my session crashes mid-work?**

A: Run `/memory:continue`. The system auto-recovers from compaction events, timeouts and crashes by loading the most recent memory context. Your work is saved in the spec folder and memory system.

---

### Technical Questions

**Q: What database does the memory system use?**

A: SQLite with the `sqlite-vec` extension for vector operations. Each embedding provider+model+dimension combination gets its own database file to prevent dimension mismatches.

---

**Q: Can I switch embedding providers without losing data?**

A: Each provider uses a separate database, so switching is safe. Your old embeddings remain intact. Re-index with `memory_index_scan` if you want to regenerate embeddings with a new provider.

---

**Q: How do I create a custom skill?**

A: Run `/create:sk-skill my-skill-name full-create` or use the init script:

```bash
python3 .opencode/skill/sk-doc/scripts/init_skill.py my-skill
```

Skills are auto-discovered from `.opencode/skill/*/SKILL.md`. No plugin registration needed.

---

**Q: How much disk space does the memory system use?**

A: Minimal. SQLite databases are compact. A project with 100+ memories typically uses under 50MB including embeddings. The HF Local model downloads on first use (~130MB) and is cached for subsequent runs.

<!-- /ANCHOR:faq -->

---

## 15. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related-documents -->

### Internal Documentation

| Document                                                                             | Purpose                                                           |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Spec Kit README](.opencode/skill/system-spec-kit/README.md)                         | Full memory system and documentation framework reference          |
| [AGENTS.md](AGENTS.md)                                                               | Complete gate system, confidence framework, operational protocols |
| [AGENTS_example_fs_enterprises.md](AGENTS_example_fs_enterprises.md)                 | Runtime-neutral full-stack AGENTS companion                      |
| [Install Guides](.opencode/install_guides/README.md)                                 | MCP servers, skill creation, agent configuration                  |
| [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP%20-%20AGENTS.md)                | Detailed AGENTS.md configuration guide                            |
| [SET-UP - Skill Creation](.opencode/install_guides/SET-UP%20-%20Skill%20Creation.md) | Custom skill creation walkthrough                                 |

### Changelogs

| Component                                                                    | Versions |
| ---------------------------------------------------------------------------- | -------- |
| [OpenCode Environment](.opencode/changelog/00--opencode-environment/)        | 107 files |
| [System Spec Kit](.opencode/changelog/01--system-spec-kit/)                  | 68 files  |
| [AGENTS.md](.opencode/changelog/02--agents-md/)                              | 30 files  |
| [Agent Orchestration](.opencode/changelog/03--agent-orchestration/)          | 34 files  |
| [Commands](.opencode/changelog/04--commands/)                                | 34 files  |
| [Skill Advisor](.opencode/changelog/05--skill-advisor/)                      | 4 files   |
| [Workflows: Code (OpenCode)](.opencode/changelog/06--sk-code--opencode/)     | 11 files  |
| [Workflows: Code (Web Dev)](.opencode/changelog/07--sk-code--web/)           | 11 files  |
| [Workflows: Code (Full Stack)](.opencode/changelog/08--sk-code--full-stack/) | 5 files   |
| [Workflows: Code Review](.opencode/changelog/09--sk-code--review/)           | 2 files   |
| [Workflows: Git](.opencode/changelog/10--sk-git/)                            | 8 files   |
| [Workflows: Documentation](.opencode/changelog/11--sk-doc/)                  | 12 files  |
| [MCP: Code Mode](.opencode/changelog/13--mcp-code-mode/)                     | 8 files   |
| [MCP: Chrome DevTools](.opencode/changelog/14--mcp-chrome-devtools/)         | 5 files   |
| [CLI: Gemini](.opencode/changelog/17--cli-gemini/)                            | 1 file    |
| [MCP: Figma](.opencode/changelog/16--mcp-figma/)                             | 6 files   |

### External Resources

| Resource                                                                                 | Description                                          |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [OpenCode](https://github.com/sst/opencode)                                              | The AI coding assistant that powers this environment |
| [GitHub Issues](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/issues) | Report bugs and request features                     |

<!-- /ANCHOR:related-documents -->

---

**License:** See [LICENSE](LICENSE) for details.
