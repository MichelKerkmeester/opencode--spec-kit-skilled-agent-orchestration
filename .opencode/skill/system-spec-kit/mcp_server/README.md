---
title: "Spec Kit Memory - MCP Server"
description: "Model Context Protocol server providing semantic memory, hybrid search and graph intelligence for AI-assisted development across sessions, models and tools."
trigger_phrases:
  - "MCP server"
  - "spec kit memory"
  - "hybrid search"
  - "cognitive memory"
  - "memory_context"
  - "memory_search"
  - "43 tools"
  - "FSRS decay"
---

# Spec Kit Memory - MCP Server

> AI memory that persists across sessions, models and tools without poisoning your context window.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 HOW THE MEMORY SYSTEM WORKS](#31--how-the-memory-system-works)
  - [3.2 TOOL REFERENCE](#32--tool-reference)
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

### What This Is

Your AI assistant has amnesia. Every conversation starts from scratch. You explain your project architecture on Monday and by Wednesday it is a blank slate. This server fixes that.

Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.

The server works across sessions, models and tools. Switch from Claude to GPT to Gemini and back. The memory stays the same because it lives in a database on your machine, not inside any AI's context window.

### Key Numbers

| What | Count | Details |
|------|-------|---------|
| **MCP tools** | 43 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
| **Search channels** | 5 | Vector, FTS5, BM25, Causal Graph, Degree |
| **Pipeline stages** | 4 | Gather, Score, Rerank, Filter |
| **Importance tiers** | 6 | constitutional, critical, important, normal, temporary, deprecated |
| **Memory states** | 5 | HOT, WARM, COLD, DORMANT, ARCHIVED |
| **Intent types** | 7 | add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |
| **Causal relations** | 6 | caused, enabled, supersedes, contradicts, derived_from, supports |
| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
| **Embedding providers** | 3 | Voyage AI, OpenAI, HuggingFace local |

### How This Compares to Basic RAG

| Capability | Basic RAG | Spec Kit Memory |
|------------|-----------|-----------------|
| **Search** | Vector similarity only | 5 channels fused with Reciprocal Rank Fusion (K tuned per intent) |
| **"Why" queries** | Not possible | Causal graph with 6 relationship types, community detection and depth signals |
| **Forgetting curve** | None or exponential | FSRS power-law decay with 2D matrix (context type x importance tier) |
| **Query understanding** | Keyword match | Intent classification (7 types), complexity routing, query decomposition |
| **Sessions** | Stateless | Working memory with attention decay, ~50% token savings via deduplication |
| **Section retrieval** | Returns full documents | ANCHOR-based chunking with ~93% token savings |
| **Duplicate handling** | Indexes everything | 4-outcome Prediction Error gating (create, reinforce, update, supersede) |
| **Memory state** | Everything treated equally | 5-state cognitive lifecycle (HOT through ARCHIVED) with FSRS-driven transitions |
| **Save quality** | Accept everything | 3-layer gate (structure, semantic sufficiency, duplicate) with dry-run preview |
| **Explainability** | Black box | Confidence scoring (high/medium/low) + two-tier trace (basic and debug) |
| **Access control** | None | Shared spaces with deny-by-default membership and kill switches |
| **Evaluation** | Manual testing | Ablation studies, 12-metric computation (MRR, NDCG), synthetic ground truth corpus |

### How You Use It

The memory system exposes 43 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.

| Command | What It Does | Tool Count |
|---------|-------------|------------|
| `/memory:search` | Search, retrieve and analyze knowledge | 13 tools |
| `/memory:learn` | Create always-surface rules (constitutional memories) | 6 tools |
| `/memory:manage` | Database maintenance, checkpoints, bulk ingestion, shared-memory spaces and memberships | 19 primary tools + 1 helper |
| `/memory:save` | Save conversation context | 4 tools |
| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| SQLite | Bundled | Bundled (better-sqlite3) |
| Embedding API | None (HuggingFace local) | Voyage AI (`VOYAGE_API_KEY`) |
| Memory | 512 MB | 1 GB+ |
| Disk | 100 MB | 500 MB (grows with index size) |

Module/runtime profile in this package:
- `package.json` sets `"type": "module"` (ESM runtime output from `dist/`).
- `tsconfig.json` uses `"module": "nodenext"` and `"moduleResolution": "nodenext"`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

This section covers the minimum steps to get running. For full installation with embedding providers, database migration and environment setup, see [INSTALL_GUIDE.md](./INSTALL_GUIDE.md).

### 30-Second Setup

```bash
# 1. Install dependencies (from the mcp_server directory)
cd .opencode/skill/system-spec-kit/mcp_server
npm ci

# 2. Build the TypeScript source
npm run build

# 3. Verify the server starts
node dist/context-server.js --help
```

### Add to Your MCP Configuration

Add this block to your MCP client configuration (for example `opencode.json` or Claude Desktop config):

```json
{
  "mcpServers": {
    "spec-kit-memory": {
      "command": "node",
      "args": ["/absolute/path/to/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
      "env": {
        "VOYAGE_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Verify It Works

After connecting your MCP client, call the health check:

```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "full" }
}
```

You should get a JSON response with `status: "ok"` and database table counts.

### Save Your First Memory

```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/absolute/path/to/your/memory-file.md"
  }
}
```

### Run Your First Search

```json
{
  "tool": "memory_context",
  "arguments": {
    "input": "how did we decide on the auth architecture?",
    "mode": "auto"
  }
}
```

The system reads your question, figures out you are looking for a past decision and routes to the right search strategy automatically.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 HOW THE MEMORY SYSTEM WORKS

This section explains the main ideas behind the memory system in plain language. For the full tool reference with parameters, skip to [3.2 Tool Reference](#32-tool-reference).

---

#### 3.1.1 HYBRID SEARCH

When you search for something, the system checks several sources at once. Think of a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet and the recommendation board all at the same time.

**Five search channels** work together:

| Channel | How It Works | Good For |
|---------|-------------|----------|
| **Vector** | Compares the meaning of your query against stored embeddings | Finding related content even when the words are different |
| **FTS5** | Full-text search on exact words and phrases | Looking up specific terms or error messages |
| **BM25** | Keyword relevance scoring (like a search engine) | Ranking results when you know roughly what you want |
| **Causal Graph** | Follows causal links between memories | "Why did we choose this?" questions |
| **Degree** | Scores memories by graph connectivity, weighted by edge type (`caused`=1.0, `enabled`=0.75, `supports`=0.5) | Finding important hub memories (capped to prevent over-influence) |

**Reciprocal Rank Fusion (RRF)** combines all channel results using the formula `1/(K + rank)`. The K parameter is tuned per query intent through sensitivity analysis across K values {10, 20, 40, 60, 80, 100, 120}. A memory that scores well in multiple channels rises to the top because RRF gives exponential weight to high-ranking items while still including lower-ranked contributions.

**Channel min-representation** guarantees every active channel gets at least one result in the final set, preventing a single dominant channel from drowning out useful evidence.

**Quality-aware 3-tier fallback** escalates automatically when results are weak:

| Fallback Tier | Channels Active | When It Kicks In |
|---------------|----------------|------------------|
| Tier 1 | Vector only | Default fast path for simple queries |
| Tier 2 | Vector + BM25 | Results below confidence floor |
| Tier 3 | All 5 channels | Still poor results after Tier 2 |

**Confidence truncation** cuts off results at 2x the median score gap so you never get a long tail of irrelevant items.

**Evidence gap detection** (TRM Z-score) flags when retrieved memories do not adequately cover the query and suggests broadening the search.

**Calibrated overlap bonus** rewards memories found by multiple channels at once. The bonus scales based on how many channels found the result and how confidently they scored it, rather than applying a flat bonus.

**Tool-level TTL cache** remembers recent results for 60 seconds. When you save, update or delete a memory, the cache for affected searches clears automatically. You never see stale results.

---

#### 3.1.2 SEARCH PIPELINE

Every search goes through four stages. Each stage has one clear job and cannot change results from earlier stages.

**Stage 1 -- Gather candidates** from active channels in parallel. Constitutional-tier memories are always injected regardless of score.

**Stage 2 -- Score and fuse** using RRF plus eight post-fusion scoring signals:

| Signal | What It Does | Magnitude |
|--------|-------------|-----------|
| Co-activation boost | Memories co-occurring with matched results get a lift. Fan-effect divisor `1/sqrt(neighbors)` prevents hubs from dominating | +0.25 |
| FSRS decay | Adjusts score by memory retrievability `R(t,S)`. Recently accessed memories score higher | multiplicative |
| Interference penalty | Suppresses clusters of near-identical memories (>0.75 Jaccard similarity) | -0.08 per neighbor |
| Cold-start boost | Fresh memories (<48h) get `0.15 * exp(-elapsed/12)`, 12h half-life, capped at 0.95 | +0.15 max |
| Session recency | Memories accessed in the current session get a recency bump | cap 0.20 |
| Causal 2-hop | Memories 1-2 hops from retrieved causal neighbors get a contextual boost | variable |
| Intent weights | Each of the 7 task intents has its own channel weight profile | variable |
| Channel min-rep | Floor ensures each active channel has at least one result in the fused set | 0.005 |

All channel scores are normalized to 0-1 before fusion so no single channel wins just because its scale is bigger.

**Stage 3 -- Rerank** using a cross-encoder model that runs locally via node-llama-cpp (GGUF format). No cloud API needed. If your machine lacks VRAM, the reranker gracefully skips and Stage 2 order stands. MPAB (Multi-Pass Aggregation with Boundary) collapses individual chunks back to their parent memory -- the best chunk counts most, but documents with multiple matching chunks rank higher than a single lucky hit.

**Stage 4 -- Filter and annotate**. Enforces score immutability (no score changes after Stage 2). Applies state filtering by minimum state parameter. Annotates results with confidence labels (high/medium/low) and feature flag states.

---

#### 3.1.3 QUERY INTELLIGENCE

Before any search runs, the system figures out what kind of help you need. Think of it like a triage nurse who reads your symptoms and routes you to the right specialist.

**Complexity routing** sizes up your question and picks the right amount of effort:

| Complexity | Channels | Token Budget | When |
|-----------|----------|-------------|------|
| Simple | 2 | 800 tokens | Quick lookups, single-topic questions |
| Moderate | 4 | 1,500 tokens | Multi-factor questions, debugging |
| Complex | All 5 | 2,000 tokens | Research, architecture decisions |

**Intent classification** maps your query to one of 7 task types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`). Each type has its own channel weight profile. A `find_decision` query boosts the causal graph channel. A `fix_bug` query boosts exact-match channels.

**Query decomposition** splits multi-topic questions into focused sub-queries. Each searches separately and results merge. No LLM call needed.

**Query expansion** automatically adds related terms when the question is complex, so you find relevant results even when the exact wording differs. Only kicks in for complex queries to avoid bloating simple lookups.

**Index-time query surrogates** pre-generate alternative names, summaries and likely questions about content when a memory is first saved. These are stored alongside the original so future searches match against them too. Like a library cataloger adding subject headings and cross-references to a new book.

**Context pressure monitoring** watches how full your context window is getting. Above 60% usage the system downgrades to focused mode. Above 80% it switches to quick mode.

For low-confidence deep searches, the system has two additional fallback strategies:

- **LLM query reformulation** -- asks the LLM to rephrase the query more abstractly, grounding in actual knowledge base content. Reformulated hits pass through the same scope, context and quality checks as ordinary results
- **HyDE (Hypothetical Document Embeddings)** -- writes a hypothetical answer to your question, then searches for real documents matching that imaginary answer. Surfaces content your original wording missed

---

#### 3.1.4 MEMORY LIFECYCLE AND SCORING

Not all memories are equally useful forever. The system tracks how fresh each memory is using FSRS (Free Spaced Repetition Scheduler), a model validated on 100M+ Anki flashcard users. The formula `R(t, S) = (1 + (19/81) x t/S)^(-0.5)` calculates a retrievability score where `t` is time since last access and `S` is a stability parameter.

Think of it like how your own brain works: things you reviewed recently are easy to recall, while things you have not thought about in months fade into the background.

**Two-dimensional decay matrix** -- decay speed is controlled by context type AND importance tier:

| | constitutional | critical | important | normal | temporary | deprecated |
|---|---|---|---|---|---|---|
| **Decisions** | Never | Never | 1.5x | 1x | 0.5x | 0.25x |
| **Research** | Never | 2x slower | 1.5x | 1x | 0.5x | 0.25x |
| **General** | Never | 1.5x slower | Slow | Normal | Fast | Fastest |

A critical decision never fades. A temporary debugging note fades within days.

**Cold-start novelty boost** -- fresh memories (under 48 hours) get an exponential boost of `0.15 * exp(-elapsed_hours / 12)` with a 12-hour half-life, capped at 0.95. This counteracts FSRS's natural tendency to underrank brand-new content.

**Interference penalty** -- prevents similar memories from flooding results together. If several memories in the same spec folder share more than 75% Jaccard similarity, each additional neighbor costs -0.08 points. Enforces diversity at the similarity level, beyond ranking alone.

**Auto-promotion** -- memories earn their way up. After 5 positive validation marks, a normal memory promotes to important. After 10, important promotes to critical. Rate-limited to prevent bulk promotion during busy sessions.

**Negative feedback with 30-day decay** -- demotes unhelpful memories, but the penalty fades over time. This prevents permanent blacklisting and allows memories to recover relevance as the project evolves.

**Five cognitive states** based on access patterns:

**HOT** (just used) >> **WARM** (recently relevant) >> **COLD** (not accessed lately) >> **DORMANT** (inactive) >> **ARCHIVED** (stored but rarely surfaced)

When you search, HOT memories get full content in results. WARM memories appear as summaries. COLD and below only show up if they score well enough to earn a spot.

---

#### 3.1.5 CAUSAL GRAPH

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

**Typed-weighted degree channel** -- uses these weights to rank memories by their graph importance. Hub caps (`MAX_TYPED_DEGREE`=15, `MAX_TOTAL_DEGREE`=50) and a `DEGREE_BOOST_CAP` of 0.15 prevent any single highly-connected memory from dominating results.

**Co-activation spreading** -- boosts memories connected to ones you already found relevant. A fan-effect divisor (`1/sqrt(neighbor_count)`) prevents popular hub memories from getting an outsized boost just because they connect to everything.

**Community detection** (Louvain algorithm) -- automatically clusters related memories into groups. When one memory in a cluster is relevant, its neighbors get a small boost. This surfaces related context you might not have thought to ask for.

**Graph momentum** -- tracks how quickly a memory is gaining new connections. Trending knowledge (recently gaining links) surfaces higher than static nodes. Actively evolving decisions get more visibility.

**Temporal contiguity** -- gives a time-proximity boost to memories created around the same time. If one memory from a Tuesday afternoon session is relevant, others from that same session probably are too. The boost fades as the time gap grows.

**Typed traversal** -- pays attention to what kind of connection it follows based on your question. A "what caused this bug?" query prioritizes cause-and-effect links. A "what supports this decision?" query prioritizes evidence links. In smaller knowledge bases, the system takes shorter, more targeted steps.

**Causal depth signals** -- measure how deep each memory sits in the decision tree. Root decisions (with many descendants) get different tiebreaker boosts than leaf tasks.

**Async LLM graph backfill** -- uses an AI to read important documents after they are saved and suggest additional causal connections that pattern matching missed. Runs in the background after initial save.

**Edge density measurement** -- tracks the average links per memory. Too few means graph features add little value. Too many triggers a hold on new link creation to prevent a tangled mess.

**Unified graph retrieval** -- all graph features run through one consistent path with reproducible results and full explainability. A single switch turns off all graph features if anything goes wrong.

---

#### 3.1.6 SAVE INTELLIGENCE

When you save new knowledge, the system runs an arbitration process before storing anything. It runs a sophisticated arbitration process to decide what to do with incoming content.

**Prediction Error gating** compares new content against existing memories and picks one of four outcomes:

| Outcome | When | What Happens |
|---------|------|-------------|
| **CREATE** | No similar memory exists | Stored as new knowledge |
| **REINFORCE** | Similar exists, new one adds value | Both kept, old one gets a confidence boost |
| **UPDATE** | Similar exists, new one is better | Old version replaced in place |
| **SUPERSEDE** | New knowledge contradicts the old | New version active, old one demoted to deprecated |

This is session-scoped to prevent cross-session interference.

**Reconsolidation-on-save** -- handles near-duplicates intelligently. Nearly identical content gets merged. Contradictions retire the old version. Different content keeps both. Like a filing clerk who reads the new document, checks the cabinet and makes an informed decision instead of just stuffing it in.

**Semantic sufficiency gating** -- rejects memories too thin or lacking real evidence. Short documents with strong structural signals (clear title, proper labels) get an exception.

**Verify-fix-verify loop** -- runs quality checks before saving. If the memory falls short, the system tries to fix problems automatically and checks again before storing.

**Content normalization** -- strips formatting clutter (bullet markers, code fences, header symbols) before generating embeddings. Cleaner fingerprints match your questions more accurately.

**Auto-entity extraction** -- spots tool names, project names and concept names when you save and adds them to a shared catalog. Connects memories mentioning the same things even when surrounding text differs completely.

**Signal vocabulary expansion** -- recognizes correction signals ("actually", "wait") and preference signals ("prefer", "want") in your language, shaping quality scoring.

**Correction tracking** -- records what changed when a newer memory replaces an older one. Creates a paper trail of how knowledge evolved.

**SHA-256 content-hash deduplication** -- recognizes unchanged files instantly and skips expensive reprocessing.

---

#### 3.1.7 SESSION AWARENESS

The system keeps track of what happened during your current conversation so it does not repeat itself or lose context mid-session.

**Working memory with attention decay** -- stores findings from the current session. Each result's relevance decays by `0.85^distance` per event (where distance is how many tool calls ago it was found). Floor is 0.05, eviction at 0.01. Recent findings stay prominent while older ones fade gracefully.

**Session deduplication** -- pushes down results you already saw. If you got a result 3 turns ago, new searches rank it lower. Saves approximately 50% of tokens on follow-up queries.

**Context pressure monitoring** -- watches how full your AI's context window is getting. Above 60% usage: downgrades to focused mode. Above 80%: switches to quick mode. Prevents memory retrieval from overwhelming the conversation.

---

#### 3.1.8 SHARED MEMORY

By default, every memory is private to the user or agent that created it. Shared memory adds controlled access so multiple people or agents can read and write to a common knowledge pool.

Think of it like a shared office with a keycard lock. The office stays locked until an admin activates it. Only people on the access list can enter. Management can lock it down instantly if something goes wrong.

- **Spaces** -- named containers for shared knowledge (like rooms in the office)
- **Roles** -- `owner` (full control), `editor` (read/write), `viewer` (read-only)
- **Deny-by-default** -- nobody gets access unless explicitly granted
- **Kill switch** -- immediately blocks all access for emergencies

For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).

---

#### 3.1.9 QUALITY GATES AND LEARNING

Not everything deserves to be stored. Before a new memory enters the system, it goes through three layered checks:

1. **Structure gate** -- does the file have the required format, headings and metadata?
2. **Semantic sufficiency gate** -- is there enough real content to be useful?
3. **Duplicate gate** -- does this already exist? If so, run Prediction Error arbitration (create, reinforce, update or supersede)

If a file fails any gate, the system rejects it with a clear explanation. Preview all checks without saving using `dryRun: true`.

The system also learns from how you use search results:

**Learned relevance feedback** -- watches when you mark results as useful or not. Helpful results get a boost in future queries. 10 safeguards prevent noise: denylist, rate limits, 30-day decay, per-cycle caps, minimum session thresholds, one-week trial period before boosts go live.

**Result confidence scoring** -- tags each result as high, medium or low confidence using fast heuristics (no LLM needed). Checks: top-K separation, multi-channel agreement, quality score and source document structure.

**Two-tier explainability** -- basic mode shows a plain-language reason ("matched strongly on meaning, boosted by causal graph connection"). Debug mode shows exact channel contributions and weights.

**Mode-aware response profiles** -- formats results differently by situation. Quick lookup returns top answer only. Research returns full results with evidence. Resume returns state plus next-steps. Debug returns the full retrieval trace.

**Empty result recovery** -- diagnoses why a search came back empty (too narrow filter, unclear question, missing knowledge) and suggests next steps.

---

#### 3.1.10 RETRIEVAL ENHANCEMENTS

Beyond the core search pipeline, several enhancements make retrieval smarter at finding what you actually need.

**Constitutional memory as expert knowledge injection** -- tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Constitutional injections obey global scope enforcement so the wrong tenant's rules never leak.

**Spec folder hierarchy search** -- uses your project folder organization as a retrieval signal. If you are looking at a child folder, the system also checks parent and sibling folders for related information.

**Dual-scope memory auto-surface** -- watches for tool use and context compression events and automatically brings up important memories without being asked.

**Cross-document entity linking** -- connects memories across folders when they reference the same concept, even if the surrounding text is completely different.

**Memory summary search channel** -- creates a short summary of each memory when saved and searches against those summaries. Like reading the back-cover blurb of a book.

**Contextual tree injection** -- labels each result with its position in the project hierarchy ("Project > Feature > Detail") so you always know where it belongs.

**ANCHOR-based section retrieval** -- memory files can include `<!-- ANCHOR:name -->` markers. The search system indexes individual sections separately, allowing retrieval of just "decisions" or "next-steps" from a large document (~93% token savings). Files above 50K characters are always chunk-split.

**Provenance-rich response envelopes** (when `includeTrace` is enabled) -- show exactly how each result was found: which channels contributed, how scores were calculated and where the information originated.

---

#### 3.1.11 INDEXING AND INFRASTRUCTURE

The system keeps the index accurate and performant as your project evolves.

**Real-time filesystem watching** (chokidar) -- monitors your project folder continuously. When you save, rename or delete a file, the index updates automatically.

**Incremental indexing with content hashing** -- tracks SHA-256 hashes of every indexed file. Unchanged files get skipped instantly during scans.

**Embedding retry orchestrator** -- when the embedding service is temporarily unavailable, the memory is saved without a vector and queued for retry. A background worker retries until it succeeds. A temporary outage never permanently blocks full searchability.

**Deferred lexical-only indexing** -- saves memories in a simpler text-searchable form when the embedding service is down. Keyword search still works. When the service returns, the system upgrades to full vector searchability automatically.

**Atomic write-then-index** -- writes files to a temporary location first and only moves them once confirmed. Crash-safe with pending-file recovery on startup.

**Phase 13 chunked-save finalization hardening** -- chunked saves now track the created parent and child IDs so finalization can stay transactional. Prediction-error supersede finalization records cross-path `supersedes` edges and marks predecessors superseded inside one transaction. Safe-swap updates now null old-child `parent_id` values before bulk delete inside that same finalization step, and any finalize failure triggers compensating cleanup that removes the staged replacement chunk tree. Parent BM25 mutation is delayed until at least one chunk succeeds and, for safe-swap updates, until finalization completes, which preserves the old parent BM25 state when all chunks fail.

**Dynamic server instructions** -- at startup, tells the calling AI how many memories are stored, how many folders exist and which search methods are available.

---

#### 3.1.12 EVALUATION INFRASTRUCTURE

Research-grade infrastructure for measuring and improving search quality over time.

**12-metric core computation** -- grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling, like a doctor running multiple tests instead of just asking "do you feel sick?"

**Synthetic ground truth corpus** -- 110 test questions with known correct answers in everyday language plus trick questions. Makes it possible to measure objectively whether changes improve or hurt quality. The corpus is keyed to live parent-memory IDs, so after DB rebuilds or imports you should rerun `scripts/evals/map-ground-truth-ids.ts` against the active `context-index.sqlite` before trusting ablation or reporting deltas.

**Ablation study framework** -- turns off each search channel one at a time and measures quality degradation (Recall@20 delta). Identifies which components are critical.

**Shadow scoring with holdout evaluation** -- tests proposed ranking improvements on a fixed test set before they go live. A new approach only reaches production after it proves itself.

**Learned Stage 2 weight combiner** -- learns the best combination of scoring signals from actual usage data. Runs in shadow mode only, without affecting live results.

**Scoring observability** -- randomly samples scoring events and saves before-and-after snapshots for debugging.

---

#### 3.1.13 CODE GRAPH

The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.

**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.

**Parser:** Tree-sitter WASM is the default parser (JS/TS/Python/Shell). Set `SPECKIT_PARSER=regex` for regex fallback.

**Storage:** `code-graph.sqlite` (separate from `context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`.

**Edge types:** `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`.

**Auto-trigger:** `ensureCodeGraphReady()` runs automatically on branch switch, session start and stale detection. It checks graph freshness and triggers an incremental scan if needed.

**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.

**Budget allocator floors:** constitutional 700, codeGraph 1200, cocoIndex 900, triggered 400, overflow pool 800 = 4000 total.

---

### 3.2 TOOL REFERENCE

All 43 tools listed by architecture layer. Each entry has a plain-language description and a parameter table. For full Zod schemas with types and defaults, see `tool-schemas.ts`.

**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.

---

#### L1: Orchestration (3 tools)

##### `memory_context`

The smart entry point. You describe what you need and it figures out the best way to find it. It reads your query, detects whether you are looking for a decision, debugging context or general knowledge, picks the right search mode and returns the most relevant results. Start here for almost everything.

| Parameter | Type | Notes |
|-----------|------|-------|
| `input` | string | **Required.** Your question or task description |
| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
| `intent` | string | Override detected intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
| `specFolder` | string | Narrow results to a specific spec folder |
| `tenantId` | string | Tenant boundary for governed retrieval |
| `userId` | string | User boundary for governed retrieval |
| `agentId` | string | Agent boundary for governed retrieval |
| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
| `limit` | number | Max results to return (default varies by mode) |
| `sessionId` | string | Session ID for deduplication across turns |
| `anchors` | string[] | Pull specific sections: `["state", "next-steps"]` |
| `tokenUsage` | number | Current token budget fraction (0.0-1.0) for adaptive depth |
| `enableDedup` | boolean | Skip memories already seen this session |
| `includeContent` | boolean | Include full memory content in response |
| `includeTrace` | boolean | Include retrieval trace for debugging |

```json
{
  "tool": "memory_context",
  "arguments": {
    "input": "implement JWT refresh token rotation",
    "intent": "add_feature",
    "specFolder": "specs/005-auth",
    "anchors": ["decisions", "next-steps"]
  }
}
```

---

##### `session_resume`

Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope resume to a specific spec folder |
| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |

---

##### `session_bootstrap`

Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope bootstrap to a specific spec folder |

---

#### L2: Core (4 tools)

##### `memory_search`

The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search (use `query` OR `concepts`, not both) |
| `concepts` | string[] | AND search: 2-5 strings that must all match |
| `specFolder` | string | Scope to a folder |
| `tenantId` | string | Tenant boundary |
| `userId` | string | User boundary |
| `agentId` | string | Agent boundary |
| `sharedSpaceId` | string | Shared-memory boundary |
| `limit` | number | 1-100 results (default 10) |
| `tier` | string | Filter by importance tier |
| `minState` | string | Minimum state: `HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED` |
| `rerank` | boolean | Apply cross-encoder reranking |
| `useDecay` | boolean | Apply FSRS decay to scores |
| `intent` | string | Adjust channel weights for task type |
| `mode` | string | `auto` or `deep` |
| `min_quality_score` | number | Filter out low-quality results |

```json
{
  "tool": "memory_search",
  "arguments": {
    "query": "database migration strategy",
    "specFolder": "specs/010-db-refactor",
    "rerank": true,
    "limit": 5
  }
}
```

---

##### `memory_quick_search`

The lightweight search option. Works like a preset: you provide a query and optional scope boundaries and it forwards to the full search tool with sensible defaults. Use this when you want fast results without setting lots of parameters.

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | **Required.** Free-text search query |
| `specFolder` | string | Scope to a folder |
| `tenantId` | string | Tenant boundary |
| `userId` | string | User boundary |
| `agentId` | string | Agent boundary |
| `sharedSpaceId` | string | Shared-memory boundary |
| `limit` | number | 1-100 results (default 10) |

---

##### `memory_match_triggers`

The speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases against a list of known keywords, like a phone's autocomplete. Results come back almost instantly. Frequently used memories show up with full details. Older ones appear as lightweight pointers.

| Parameter | Type | Notes |
|-----------|------|-------|
| `prompt` | string | **Required.** The user's current prompt text |
| `limit` | number | Max matches to return |
| `session_id` | string | Session context for co-activation |
| `turnNumber` | number | Current conversation turn for attention decay |
| `include_cognitive` | boolean | Include HOT/WARM tiered content injection |

```json
{
  "tool": "memory_match_triggers",
  "arguments": {
    "prompt": "fix the token refresh bug in auth service",
    "turnNumber": 3,
    "include_cognitive": true
  }
}
```

---

##### `memory_save`

This is how you add new knowledge to the system. Point it at a markdown file and it reads, validates, embeds and stores the content so it becomes searchable. Before storing, it checks whether the information already exists and decides whether to add it fresh, update an older version or skip it. Quality gates catch low-value content before it clutters the knowledge base.

| Parameter | Type | Notes |
|-----------|------|-------|
| `filePath` | string | **Required.** Absolute path to the `.md` file to index |
| `force` | boolean | Overwrite if already indexed |
| `dryRun` | boolean | Preview validation without saving |
| `skipPreflight` | boolean | Bypass quality gate (not recommended) |
| `asyncEmbedding` | boolean | Return immediately, generate embedding in background |
| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
| `deleteAfter` | string | ISO date for automatic deletion |
| `sessionId` | string | Session attribution |
| `tenantId` | string | Governance: tenant scope |
| `userId` | string | Governance: user attribution |
| `agentId` | string | Governance: agent attribution |
| `sharedSpaceId` | string | Governance: shared-space target |
| `provenanceSource` | string | Audit source label |
| `provenanceActor` | string | Audit actor label |
| `governedAt` | string | ISO timestamp for governed ingest audit |

```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/absolute/path/to/memory-file.md",
    "dryRun": true
  }
}
```

---

#### L3: Discovery (4 tools)

##### `memory_list`

Browse what is stored. Like opening a filing cabinet and looking at the folder labels. Use this to discover what is in the index and find IDs for delete or update operations.

| Parameter | Type | Notes |
|-----------|------|-------|
| `limit` | number | Max 100 per page |
| `offset` | number | Pagination offset |
| `specFolder` | string | Scope to a folder |
| `sortBy` | string | `created_at`, `updated_at` or `importance_weight` |
| `includeChunks` | boolean | Include chunk-level detail |

---

##### `memory_stats`

Get the big picture. How many memories are stored, when they were last updated, which folders have the most content and how the importance tiers are distributed. Think of it like a dashboard for your knowledge base.

| Parameter | Type | Notes |
|-----------|------|-------|
| `folderRanking` | string | `count`, `recency`, `importance` or `composite` |
| `excludePatterns` | string[] | Glob patterns to exclude |
| `includeScores` | boolean | Include composite quality scores |
| `includeArchived` | boolean | Include ARCHIVED state memories in counts |
| `limit` | number | Max folders to return |

---

##### `memory_health`

Run a health check. This is the diagnostic tool for when search quality degrades or something feels off. It checks for stale indexes, divergent aliases, broken embeddings and other issues. It can also attempt automatic repairs.

| Parameter | Type | Notes |
|-----------|------|-------|
| `reportMode` | string | `full` (default) or `divergent_aliases` |
| `limit` | number | Max items to report |
| `specFolder` | string | Scope to a folder |
| `autoRepair` | boolean | Attempt automatic repairs |
| `confirmed` | boolean | Confirm destructive repair operations |

---

##### `session_health`

Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ |  | Returns health status with hints |

---

#### L4: Mutation (4 tools)

##### `memory_delete`

Remove a memory by ID, or clear an entire folder at once. Before a big deletion, the system can take a snapshot so you can undo it. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes.

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | number | Memory ID to delete (use OR with specFolder) |
| `specFolder` | string | Delete all memories in folder (requires `confirm: true`) |
| `confirm` | boolean | **Required when using specFolder** |

---

##### `memory_update`

Change a memory's title, keywords or importance without deleting and re-creating it. When you change the title, the search index updates automatically. If the update fails partway through, everything rolls back to the way it was before.

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | number | **Required.** Memory ID to update |
| `title` | string | Updated title |
| `triggerPhrases` | string[] | Updated trigger phrases |
| `importanceWeight` | number | Updated weight (0.0-1.0) |
| `importanceTier` | string | `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| `allowPartialUpdate` | boolean | Update only provided fields (default false) |

---

##### `memory_validate`

Tell the system whether a search result was helpful. Helpful results get a confidence boost so they show up more often. Unhelpful results get demoted. Over time, the system learns which memories are genuinely useful, like training a recommendation engine with thumbs-up and thumbs-down.

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | number | **Required.** Memory ID to validate |
| `wasUseful` | boolean | **Required.** Was this memory helpful? |
| `queryId` | string | Query that retrieved this memory |
| `resultRank` | number | Position in results where this appeared |
| `notes` | string | Why it was or was not useful |

---

##### `memory_bulk_delete`

The cleanup tool for large-scale housekeeping. Delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection. A safety checkpoint is created first so you can restore if needed.

| Parameter | Type | Notes |
|-----------|------|-------|
| `tier` | string | **Required.** Tier to delete: `temporary`, `deprecated`, `normal`, etc. |
| `confirm` | boolean | **Required.** Must be `true` |
| `specFolder` | string | Scope deletion to a folder |
| `olderThanDays` | number | Only delete memories older than N days |
| `skipCheckpoint` | boolean | Skip automatic checkpoint (not recommended) |

---

#### L5: Lifecycle (8 tools)

##### `checkpoint_create`

Take a named snapshot of the current memory state. Like saving your game before a boss fight. Use before bulk operations or risky changes so you can restore if something goes wrong.

| Parameter | Type | Notes |
|-----------|------|-------|
| `name` | string | **Required.** Checkpoint identifier |
| `specFolder` | string | Scope to a folder |
| `metadata` | object | Optional metadata to store with the checkpoint |

---

##### `checkpoint_list`

See all available checkpoints.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope to a folder |
| `limit` | number | Max checkpoints to return |

---

##### `checkpoint_restore`

Go back in time by restoring from a named checkpoint. Replaces the current index with the snapshot.

| Parameter | Type | Notes |
|-----------|------|-------|
| `name` | string | **Required.** Checkpoint name to restore |
| `clearExisting` | boolean | Clear current memories before restoring |

---

##### `checkpoint_delete`

Delete a checkpoint. Requires you to type the name twice as a safety measure so you do not accidentally delete the wrong one.

| Parameter | Type | Notes |
|-----------|------|-------|
| `name` | string | **Required.** Checkpoint name to delete |
| `confirmName` | string | **Required.** Must exactly match `name` |

---

##### `shared_space_upsert`

Create or update a shared-memory space. Shared spaces start locked: nobody can read or write until you add members with `shared_space_membership_set`. The person or agent who creates the space automatically becomes its owner.

| Parameter | Type | Notes |
|-----------|------|-------|
| `spaceId` | string | **Required.** Unique identifier for the space |
| `tenantId` | string | **Required.** Tenant scope |
| `name` | string | **Required.** Human-readable name |
| `actorUserId` | string | Caller identity (user). Provide exactly one actor |
| `actorAgentId` | string | Caller identity (agent). Provide exactly one actor |
| `rolloutEnabled` | boolean | Enable or disable this space |
| `rolloutCohort` | string | Limit access to a specific cohort |
| `killSwitch` | boolean | Emergency shutoff |

---

##### `shared_space_membership_set`

Control who can access a shared space. Assign owner, editor or viewer roles. Only existing owners can change membership.

| Parameter | Type | Notes |
|-----------|------|-------|
| `spaceId` | string | **Required.** Space to configure |
| `tenantId` | string | **Required.** Tenant boundary |
| `actorUserId` | string | Caller identity (user). Provide exactly one actor |
| `actorAgentId` | string | Caller identity (agent). Provide exactly one actor |
| `subjectType` | string | **Required.** `user` or `agent` |
| `subjectId` | string | **Required.** User or agent identifier |
| `role` | string | **Required.** `owner`, `editor` or `viewer` |

---

##### `shared_memory_status`

Check the state of shared memory. See which spaces exist, who has access and whether the kill switch is active. Use this to verify your setup after making changes.

| Parameter | Type | Notes |
|-----------|------|-------|
| `tenantId` | string | Filter by tenant |
| `userId` | string | Filter by user |
| `agentId` | string | Filter by agent |

---

##### `shared_memory_enable`

Turn on the shared-memory subsystem. First-time setup creates the database tables. Safe to call multiple times.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ | | Call with empty arguments |

---

#### L6: Analysis (8 tools)

##### `task_preflight`

Capture your starting knowledge before a task. Records how well you understand the domain, how uncertain you are and how much relevant context you have. These scores get compared to `task_postflight` to measure what you learned.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | **Required.** Spec folder for this task |
| `taskId` | string | **Required.** Unique task identifier |
| `knowledgeScore` | number | **Required.** 0-100: domain understanding |
| `uncertaintyScore` | number | **Required.** 0-100: how uncertain are you? |
| `contextScore` | number | **Required.** 0-100: available relevant context |
| `knowledgeGaps` | string[] | Known gaps before starting |
| `sessionId` | string | Session identifier |

---

##### `task_postflight`

Capture your knowledge after a task. The system calculates a Learning Index by comparing these scores to the preflight baseline.

**Formula:** `LI = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25)`

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | **Required.** Must match the preflight call |
| `taskId` | string | **Required.** Must match the preflight call |
| `knowledgeScore` | number | **Required.** Post-task knowledge score |
| `uncertaintyScore` | number | **Required.** Post-task uncertainty score |
| `contextScore` | number | **Required.** Post-task context score |
| `gapsClosed` | string[] | Gaps resolved during the task |
| `newGapsDiscovered` | string[] | New gaps found during the task |

---

##### `memory_drift_why`

Trace the causal chain for a memory. Answers "why was this decision made?" by following links between memories. Think of it like pulling on a thread: you start with one decision and follow the connections back to the events that caused it.

| Parameter | Type | Notes |
|-----------|------|-------|
| `memoryId` | string | **Required.** Memory to trace from |
| `maxDepth` | number | Max hops to follow (default 3, max 10) |
| `direction` | string | `outgoing`, `incoming` or `both` |
| `relations` | string[] | Filter to specific relationship types |
| `includeMemoryDetails` | boolean | Include full memory content |

---

##### `memory_causal_link`

Connect two memories with a causal relationship. Use this to build decision lineage ("this refactor was caused by that bug report").

| Parameter | Type | Notes |
|-----------|------|-------|
| `sourceId` | string | **Required.** Cause memory ID |
| `targetId` | string | **Required.** Effect memory ID |
| `relation` | string | **Required.** `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` or `supports` |
| `strength` | number | Edge weight (0.0-1.0, default 1.0) |
| `evidence` | string | Free-text evidence supporting this link |

---

##### `memory_causal_stats`

Get statistics about the causal graph: total edges, coverage percentage and breakdown by relationship type. Target coverage is 60% of memories linked.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ | | Returns global stats |

---

##### `memory_causal_unlink`

Remove a causal relationship by edge ID.

| Parameter | Type | Notes |
|-----------|------|-------|
| `edgeId` | string | **Required.** Edge ID from `memory_drift_why` results |

---

##### `eval_run_ablation`

Run a controlled experiment to test which search channels contribute most to finding the right results. Like a scientist removing one ingredient at a time to see which ones matter. Requires `SPECKIT_ABLATION=true` environment variable.

| Parameter | Type | Notes |
|-----------|------|-------|
| `channels` | string[] | Channels to test: `vector`, `bm25`, `fts5`, `graph`, `trigger` |
| `groundTruthQueryIds` | string[] | Query IDs with known-correct results |
| `recallK` | number | K value for Recall@K metric |
| `storeResults` | boolean | Persist results to eval database |
| `includeFormattedReport` | boolean | Return human-readable report |

The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.

---

##### `eval_reporting_dashboard`

Generate a report showing search performance trends over time. Aggregates metrics by sprint and channel.

| Parameter | Type | Notes |
|-----------|------|-------|
| `sprintFilter` | string | Filter by sprint ID |
| `channelFilter` | string | Filter by channel name |
| `metricFilter` | string | Filter by metric type |
| `limit` | number | Max records to include |
| `format` | string | `text` (default) or `json` |

---

##### `code_graph_query`

Query structural code relationships: `outline` (file symbols), `calls_from` and `calls_to` (call graph), `imports_from` and `imports_to` (dependency graph). Use this instead of Grep for structural queries. Supports multi-hop BFS traversal.

| Parameter | Type | Notes |
|-----------|------|-------|
| `operation` | string | **Required.** `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to` |
| `subject` | string | **Required.** File path, symbol name or `symbolId` |
| `edgeType` | string | Filter by edge type |
| `limit` | number | Max results (1-200, default 50) |
| `includeTransitive` | boolean | Enable multi-hop BFS traversal |
| `maxDepth` | number | Max traversal depth (1-10, default 3) |

---

##### `code_graph_context`

Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers).

| Parameter | Type | Notes |
|-----------|------|-------|
| `input` | string | Natural language context query |
| `queryMode` | string | `neighborhood` (default), `outline` or `impact` |
| `subject` | string | Symbol name, fqName or `symbolId` |
| `seeds` | array | Seeds from CocoIndex, manual input or graph lookups |
| `budgetTokens` | number | Token budget for response (100-4000, default 1200) |
| `profile` | string | Output density: `quick`, `research` or `debug` |
| `includeTrace` | boolean | Include trace metadata for debugging |

---

#### L7: Maintenance (5 tools)

##### `memory_index_scan`

Scan the workspace for new or changed memory files and add them to the index. Use after adding files manually or after a git pull. Processes three source families: constitutional rules, spec documents and spec memories. Spec documents stay indexed by default; during scan they run through the save pipeline in warn-only quality mode so validation issues surface as warnings instead of silently bypassing retrieval.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope scan to a folder |
| `force` | boolean | Re-index even if file hash unchanged |
| `includeConstitutional` | boolean | Include constitutional rules directory |
| `includeSpecDocs` | boolean | Include spec folder documents (default: true) |
| `incremental` | boolean | Only process files changed since last scan |

---

##### `memory_get_learning_history`

View learning records (preflight/postflight pairs) for a spec folder. Shows how the Learning Index changed over time.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | **Required.** Spec folder to query |
| `sessionId` | string | Filter by session |
| `limit` | number | Max records to return |
| `onlyComplete` | boolean | Only return paired preflight+postflight records |
| `includeSummary` | boolean | Include aggregated summary statistics |

---

##### `memory_ingest_start`

Start a bulk import job for multiple markdown files. Returns immediately with a job ID so you do not have to wait. Check progress with `memory_ingest_status`.

| Parameter | Type | Notes |
|-----------|------|-------|
| `paths` | string[] | **Required.** Absolute file paths to import |
| `specFolder` | string | Associate imported files with a spec folder |

---

##### `memory_ingest_status`

Check the progress of a running import job.

| Parameter | Type | Notes |
|-----------|------|-------|
| `jobId` | string | **Required.** Job ID from `memory_ingest_start` |

---

##### `memory_ingest_cancel`

Cancel a running import job. The current file finishes processing before the job stops.

| Parameter | Type | Notes |
|-----------|------|-------|
| `jobId` | string | **Required.** Job ID to cancel |

---

##### `code_graph_scan`

Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash.

| Parameter | Type | Notes |
|-----------|------|-------|
| `rootDir` | string | Root directory to scan (default: workspace root) |
| `includeGlobs` | string[] | Glob patterns for files to include |
| `excludeGlobs` | string[] | Additional glob patterns to exclude |
| `incremental` | boolean | Skip unchanged files (default: true) |

---

##### `code_graph_status`

Report code graph index health: file count, node and edge counts by type, parse health summary, last scan timestamp, DB file size and schema version.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ |  | Returns health report |

---

##### `ccc_status`

Check CocoIndex availability, binary path and index status.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ |  | Returns CocoIndex health |

---

##### `ccc_reindex`

Trigger CocoIndex incremental or full re-indexing of the workspace.

| Parameter | Type | Notes |
|-----------|------|-------|
| `full` | boolean | Full re-index (slower) vs incremental (default: `false`) |

---

##### `ccc_feedback`

Submit quality feedback on CocoIndex search results to improve future searches.

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | **Required.** The search query that was executed |
| `rating` | string | **Required.** `helpful`, `not_helpful` or `partial` |
| `resultFile` | string | File path from the result being rated |
| `comment` | string | Optional free-form feedback |

<!-- /ANCHOR:features -->
<!-- /ANCHOR:name -->


---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

``` 
mcp_server/
├── context-server.ts          # MCP entry point and runtime bootstrap
├── startup-checks.ts          # Startup diagnostics used before tool registration
├── cli.ts                     # Admin/maintenance CLI surface
├── tool-schemas.ts            # Tool definition source of truth
├── api/                       # Stable public imports for eval, indexing, search, providers, storage
├── core/                      # Runtime config, DB-state coordination, rebind hooks
├── configs/                   # Cognitive config + search-weights reference data
├── database/                  # Runtime SQLite artifacts and profile-specific DBs
├── formatters/                # Search-result and token-metric formatting
├── handlers/                  # MCP tool handlers plus save/index helper modules
├── hooks/                     # Auto-surface hints, mutation feedback, token-count sync
├── lib/                       # Retrieval, storage, eval, governance, scoring, and parsing internals
├── schemas/                   # Zod tool-input schemas
├── shared-spaces/             # Documentation-only shared-memory surface
├── tests/                     # Vitest suites (329 root `.vitest.ts` files at audit time)
├── tools/                     # Tool dispatch layer
├── package.json               # Package metadata and scripts
├── tsconfig.json              # TypeScript build config
├── vitest.config.ts           # Vitest configuration
├── INSTALL_GUIDE.md           # Full installation walkthrough
└── README.md                  # This file
```

### Key Files

| File | What It Does |
|------|-------------|
| `context-server.ts` | Starts the MCP listener, performs runtime bootstrap, and registers all 43 tools. |
| `startup-checks.ts` | Startup diagnostics and environment validation run before the server begins serving tools. |
| `tool-schemas.ts` | Defines every tool name, description and parameter schema in one place. |
| `handlers/memory-save.ts` | Runs the save pipeline: validates structure, checks dedup/quality gates, generates embeddings, and stores the result. |
| `handlers/chunking-orchestrator.ts` | Handles chunked-save staging, safe-swap finalization, rollback cleanup, and delayed parent BM25 updates. |
| `api/index.ts` | Stable external import surface for eval, indexing, search, provider, rollout, and discovery helpers. |
| `INSTALL_GUIDE.md` | Step-by-step installation with embedding providers and environment variables. |

### 7-Layer Tool Architecture

Tools are organized into layers based on what they do. Lower layers handle everyday operations. Higher layers handle specialized tasks.

| Layer | Name | Tools | Token Budget | Purpose |
|-------|------|-------|-------------|---------|
| L1 | Orchestration | 3 | 2,000 | Smart entry point that figures out what you need |
| L2 | Core | 4 | 1,500 | The main search and save operations |
| L3 | Discovery | 4 | 800 | Browse what is stored, check system health |
| L4 | Mutation | 4 | 500 | Update, delete, validate and bulk cleanup |
| L5 | Lifecycle | 8 | 600 | Checkpoints, shared spaces and enable/status/shared-space lifecycle |
| L6 | Analysis | 10 | 1,200 | Trace decisions, measure learning, run evaluations |
| L7 | Maintenance | 10 | 1,000 | Re-index files, review history, run bulk imports |
| | **Total** | **43** | **7,600** | |

Token budgets control how much content each tool can return per call. The budget prevents any single tool from flooding the AI's context window. When a response exceeds its budget, results are truncated from the bottom up until they fit.

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

For the complete list of all environment variables with defaults and examples, see `../references/config/environment_variables.md`.

Codex note: set `MEMORY_DB_PATH` to a writable location (for example under your home directory or `/tmp`) so the MCP server does not fail when it needs to create or update the SQLite database.

### Embedding Providers

The system needs an embedding provider to convert text into vectors for similarity search. Pick one:

| Provider | Environment Variables | Notes |
|----------|-----------------------|-------|
| **Voyage AI** (recommended) | `EMBEDDING_PROVIDER=voyage`, `VOYAGE_API_KEY=your-key` | Best retrieval quality |
| **OpenAI** | `EMBEDDING_PROVIDER=openai`, `OPENAI_API_KEY=your-key` | Widely available |
| **HuggingFace local** | `EMBEDDING_PROVIDER=huggingface` | No API key needed, runs on your machine |

### Representative Environment Variables

The full source of truth lives in `../references/config/environment_variables.md`. The table below lists the variables most likely to matter during server bring-up and documentation audits.

| Variable | Default | What It Controls |
|------|---------|-----------------|
| `MEMORY_DB_PATH` | `mcp_server/dist/database/context-index.sqlite` | Override the active memory database location |
| `ENABLE_RERANKER` | `false` | Enable the experimental reranker path |
| `ENABLE_TOOL_CACHE` | `true` | Enable tool-level result caching |
| `SPECKIT_STRICT_SCHEMAS` | `true` | Strict Zod validation for MCP tool inputs |
| `SPECKIT_RESPONSE_TRACE` | `false` | Include trace-rich scores/source metadata by default |
| `SPECKIT_DYNAMIC_INIT` | `true` | Inject live startup memory/index summary into MCP init |
| `SPECKIT_CONTEXT_HEADERS` | `true` | Prepend contextual tree headers to markdown results |
| `SPECKIT_FILE_WATCHER` | `false` | Enable chokidar-based auto re-indexing |
| `SPEC_KIT_BATCH_SIZE` | `5` | Batch size for `memory_index_scan` |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | Delay between scan batches in milliseconds |

Provider selection and the wider rollout-flag matrix drift more often than this overview. For current values, rely on:

- `../references/config/environment_variables.md`
- `configs/README.md`
- `database/README.md`

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Find Context for a Feature Task

Start a new feature and pull all relevant prior decisions:

```json
{
  "tool": "memory_context",
  "arguments": {
    "input": "add rate limiting to the auth API",
    "intent": "add_feature",
    "specFolder": "specs/005-auth",
    "mode": "deep",
    "anchors": ["decisions", "state", "next-steps"]
  }
}
```

**What happens**: Constitutional rules appear at the top. Then spec decisions, then prior auth notes. ANCHOR filtering pulls only the relevant subsections from large documents.

---

### Example 2: Save a Decision Memory

After making an architectural decision, save it for future retrieval:

```bash
# 1. Generate the memory file
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth

# 2. Index it
```

```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/absolute/path/to/specs/005-auth/memory/2026-03-15_auth-decision.md"
  }
}
```

**What happens**: File is validated, embedded and indexed. Returns memory ID, quality score and duplicate check results.

---

### Example 3: Trace a Decision's Origin

Find out why a particular choice was made:

```json
{
  "tool": "memory_drift_why",
  "arguments": {
    "memoryId": "mem_abc123",
    "maxDepth": 4,
    "direction": "incoming",
    "relations": ["caused", "enabled"]
  }
}
```

**What happens**: Returns a causal chain showing which decisions, bugs or requirements led to this memory.

---

### Example 4: Checkpoint Before Bulk Cleanup

Before deleting old temporary memories, save your game:

```json
{
  "tool": "checkpoint_create",
  "arguments": {
    "name": "before-temp-cleanup-2026-03-25",
    "specFolder": "specs/022-hybrid-rag-fusion"
  }
}
```

Then clean up:

```json
{
  "tool": "memory_bulk_delete",
  "arguments": {
    "tier": "temporary",
    "confirm": true,
    "specFolder": "specs/022-hybrid-rag-fusion",
    "olderThanDays": 30
  }
}
```

If something goes wrong, restore:

```json
{
  "tool": "checkpoint_restore",
  "arguments": { "name": "before-temp-cleanup-2026-03-25" }
}
```

---

### Example 5: Bulk Import Files

When indexing many files at once, use async ingestion:

```json
{
  "tool": "memory_ingest_start",
  "arguments": {
    "paths": [
      "/absolute/path/to/file1.md",
      "/absolute/path/to/file2.md",
      "/absolute/path/to/file3.md"
    ],
    "specFolder": "specs/022-hybrid-rag-fusion"
  }
}
```

Returns `{ "jobId": "job_xyz789" }`. Check progress:

```json
{
  "tool": "memory_ingest_status",
  "arguments": { "jobId": "job_xyz789" }
}
```

---

### Example 6: Measure Learning Across a Task

Before starting a complex task, capture your baseline:

```json
{
  "tool": "task_preflight",
  "arguments": {
    "specFolder": "specs/022-hybrid-rag-fusion",
    "taskId": "implement-channel-fusion",
    "knowledgeScore": 40,
    "uncertaintyScore": 70,
    "contextScore": 35,
    "knowledgeGaps": ["RRF k-value tuning", "MPAB aggregation logic"]
  }
}
```

After finishing, capture what you learned:

```json
{
  "tool": "task_postflight",
  "arguments": {
    "specFolder": "specs/022-hybrid-rag-fusion",
    "taskId": "implement-channel-fusion",
    "knowledgeScore": 85,
    "uncertaintyScore": 25,
    "contextScore": 80,
    "gapsClosed": ["RRF k-value tuning", "MPAB aggregation logic"]
  }
}
```

**What happens**: Learning Index calculated as `(45 x 0.4) + (45 x 0.35) + (45 x 0.25) = 45 LI points`.

---

### Example 7: Set Up Shared Memory

Enable the subsystem and create a shared space for your team:

```json
{ "tool": "shared_memory_enable", "arguments": {} }
```

```json
{
  "tool": "shared_space_upsert",
  "arguments": {
    "spaceId": "research",
    "tenantId": "acme",
    "name": "Research Team",
    "actorAgentId": "spec-kit"
  }
}
```

Grant another agent access:

```json
{
  "tool": "shared_space_membership_set",
  "arguments": {
    "spaceId": "research",
    "tenantId": "acme",
    "actorAgentId": "spec-kit",
    "subjectType": "agent",
    "subjectId": "claude-code",
    "role": "editor"
  }
}
```

For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).

---

### Common Patterns

| What You Want To Do | Tool | How |
|---------------------|------|-----|
| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
| See what is indexed | `memory_list` + `memory_stats` | Browse and count |
| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
| Test a save without committing | `memory_save` | Set `dryRun: true` |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

For the feature flag rollback procedure, see `../references/workflows/rollback_runbook.md`.

### Search Returns Low-Quality Results

**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.

**Common causes**: Stale BM25 index, divergent aliases in FTS5 or memories with low quality scores surfacing.

**Fix**: Run a health check with auto-repair, then retry with a higher quality floor:

```json
{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
```

```json
{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
```

---

### Save Rejected by Quality Gate

**What you see**: Error like `PREFLIGHT_FAILED`, `INSUFFICIENT_CONTEXT_ABORT` or `Template contract validation failed`.

**Common causes**: Too little real content, missing required structure (headings, metadata) or semantic duplicate.

**Fix**: Preview what would happen with a dry run:

```json
{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
```

If it shows `INSUFFICIENT_CONTEXT_ABORT`, add more real evidence. If it shows a template-contract failure, fix the markdown structure. Do not lower quality thresholds to bypass legitimate rejections.

---

### Embeddings Fail or Return Zeros

**What you see**: Saved memories have zero vector scores. Semantic search returns nothing.

**Cause**: Missing or invalid API key for the configured embedding provider.

**Fix**: Check your environment:

```bash
echo $EMBEDDING_PROVIDER
echo $VOYAGE_API_KEY
```

Switch to local HuggingFace if no API key is available: `EMBEDDING_PROVIDER=huggingface`

---

### Memory Count Wrong After Bulk Operations

**What you see**: `memory_stats` shows fewer memories than expected.

**Fix**: Check if a checkpoint was created before the operation:

```json
{ "tool": "checkpoint_list", "arguments": {} }
```

Restore if needed:

```json
{ "tool": "checkpoint_restore", "arguments": { "name": "the-checkpoint-name" } }
```

---

### Server Fails to Start

**What you see**: `node dist/context-server.js` exits with a module error or `MEMORY_DB_PATH`/database-path error.

**Fix**: Rebuild and check the database path:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build
node --input-type=module -e "await import('./dist/context-server.js')" 2>&1 | head -20
```

---

### Quick Fixes

| Problem | Fix |
|---------|-----|
| Search returning empty | Run `memory_index_scan` to re-index |
| Tools not appearing in MCP client | Restart the MCP client after config changes |
| BM25 index stale | Set `ENABLE_BM25=false` to fall back to FTS5 |
| Slow responses on large index | Set `ENABLE_TOOL_CACHE=true` and review cache + trace settings before enabling heavier debug output |
| Embedding API rate limit | Set `SPECKIT_EMBEDDING_RETRY_DELAY_MS=1000` |
| Shared memory not working | Call `shared_memory_enable` first, then create a space with an actor identity |

### Diagnostic Commands

```bash
# Run full test suite
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run

# Check database tables
sqlite3 database/context-index.sqlite ".tables"

# Count indexed memories
sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"
```

```json
{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Do I need an API key to use this?**

No. The server runs with HuggingFace local embeddings out of the box. Set `EMBEDDING_PROVIDER=huggingface` and no API key is required. Voyage AI gives better retrieval quality but is optional.

---

**Q: What happens to my memories when I switch AI models?**

Nothing. Memories live in the local SQLite database, not inside any AI's context. When you connect a different model to the same MCP server, it reads from the same database.

---

**Q: How is this different from plain RAG with a vector database?**

Three main differences. First, this system uses 5 search channels combined with rank fusion, beyond vector similarity. Second, it applies FSRS decay so recently accessed memories rank higher without manual curation. Third, the causal graph lets you answer "why was this decision made?" which no vector database supports natively.

---

**Q: What is the constitutional tier and why does it always appear first?**

Constitutional memories are rules that never change: coding standards, architectural constraints, project non-negotiables. They get the highest importance weight and appear in every search result regardless of score. Store things like "always use TypeScript strict mode" or "never commit secrets" at this tier.

---

**Q: How much disk space does the database use?**

A typical project with a few hundred memory files uses 10-50 MB. The vector table (1024-dimension float32 embeddings) is the largest contributor. Check with `memory_stats` using `includeScores: true`.

---

**Q: Can multiple AI agents share the same memories?**

Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.

---

**Q: What does FSRS decay mean in practice?**

FSRS (Free Spaced Repetition Scheduler) is a memory model validated on 100M+ Anki users. A memory you accessed yesterday has a retrievability score near 1.0. A memory you have not accessed in months is near 0. Higher importance tiers decay more slowly. The formula is `R(t, S) = (1 + (19/81) x t/S)^(-0.5)` where `t` is time since last access and `S` is a stability parameter.

---

**Q: How do I know which tool to call?**

Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.

---

**Q: What does the dryRun parameter do on memory_save?**

A dry run validates the file against the quality gate, estimates the token budget, checks for duplicates and returns a report, all without writing anything to the database. Use it to verify a file will pass before committing.

---

**Q: How do I roll back a bad feature flag change?**

Set the flag to `false` or `0` in your environment, restart the server and the pipeline falls back to the last working configuration. The full procedure is in `../references/workflows/rollback_runbook.md`. Use `eval_reporting_dashboard` to verify metrics returned to baseline.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | What It Covers |
|----------|---------------|
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Full installation: embedding providers, database setup, MCP client config, verification |
| [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) | Complete shared memory guide: setup, use cases, roles, kill switch, troubleshooting |
| [lib/search/README.md](./lib/search/README.md) | Per-stage module mapping for the 4-stage search pipeline |
| [hooks/README.md](./hooks/README.md) | Lifecycle hook documentation for post-mutation wiring |
| [../README.md](../README.md) | Parent skill README: system-spec-kit overview |
| [../SKILL.md](../SKILL.md) | AI agent workflow instructions for this skill |
| [../feature_catalog/FEATURE_CATALOG.md](../feature_catalog/FEATURE_CATALOG.md) | Complete feature inventory: 22 categories, 291 features with code references |
| [../references/config/environment_variables.md](../references/config/environment_variables.md) | All environment variables with types, defaults and examples |
| [../references/workflows/rollback_runbook.md](../references/workflows/rollback_runbook.md) | Feature flag rollback procedure |

### External Resources

| Resource | Description |
|----------|-------------|
| [Model Context Protocol Spec](https://modelcontextprotocol.io) | Official MCP specification and client documentation |
| [FSRS Algorithm Paper](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm) | The memory decay formula this server implements |
| [sqlite-vec](https://github.com/asg017/sqlite-vec) | Vector similarity extension for embedding storage |
| [Reciprocal Rank Fusion](https://dl.acm.org/doi/10.1145/1571941.1572114) | The fusion algorithm for combining channel results |

<!-- /ANCHOR:related-documents -->

---

*Documentation version: 3.0 | Last updated: 2026-03-25 | Server version: @spec-kit/mcp-server*
