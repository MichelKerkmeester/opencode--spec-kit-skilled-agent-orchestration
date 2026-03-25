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
  - "33 tools"
  - "FSRS decay"
---

# Spec Kit Memory - MCP Server

> AI memory that persists across sessions, models and tools without poisoning your context window.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. STRUCTURE](#3-structure)
- [4. FEATURES](#4-features)
  - [4.1 How the Memory System Works](#41-how-the-memory-system-works)
  - [4.2 Tool Reference](#42-tool-reference)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)

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
| **MCP tools** | 33 | Organized across 7 layers (L1 through L7) |
| **Search channels** | 5 | Vector, FTS5, BM25, Skill Graph, Degree |
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

The memory system exposes 33 tools through 6 slash commands. Think of commands as doors into the system. Each door opens access only to the tools it needs.

| Command | What It Does | Tool Count |
|---------|-------------|------------|
| `/memory:analyze` | Search, retrieve and analyze knowledge | 13 tools |
| `/memory:continue` | Recover an interrupted session | 4 tools |
| `/memory:learn` | Create always-surface rules (constitutional memories) | 6 tools |
| `/memory:manage` | Database maintenance, checkpoints and bulk ingestion | 16 tools |
| `/memory:save` | Save conversation context | 4 tools |
| `/memory:shared` | Manage shared-memory spaces and memberships | 4 tools |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| SQLite | Bundled | Bundled (better-sqlite3) |
| Embedding API | None (HuggingFace local) | Voyage AI (`VOYAGE_API_KEY`) |
| Memory | 512 MB | 1 GB+ |
| Disk | 100 MB | 500 MB (grows with index size) |

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

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
mcp_server/
├── context-server.ts          # Server entry point, registers all 33 tools
├── dist/                      # Compiled JavaScript build output
├── cli.ts                     # CLI entry point
├── tool-schemas.ts            # Single source of truth for all tool definitions
├── api/                       # Public API surface (search, indexing)
├── core/                      # Core runtime logic (lifecycle, orchestration)
├── configs/                   # Runtime configuration modules
├── formatters/                # Output formatting (markdown, structured)
├── schemas/                   # Zod validation schemas
├── handlers/                  # Per-tool request handlers
│   ├── memory-save.ts         # Save handler with pre-flight quality gate
│   ├── memory-search.ts       # Core search handler
│   ├── memory-context.ts      # Unified context entry point
│   └── ...                    # One handler file per tool or tool group
├── lib/
│   ├── search/                # 4-stage hybrid search pipeline
│   │   ├── README.md          # Per-stage module mapping
│   │   └── pipeline/          # Stage modules (stage1 through stage4)
│   ├── cognitive/             # Memory states and FSRS decay
│   ├── graph/                 # Causal graph operations
│   ├── governance/            # Scope, tenant and shared-space enforcement
│   └── ...                    # 27 additional runtime subdirectories
├── hooks/                     # Post-mutation lifecycle hooks
├── tools/                     # Tool dispatch layer (5 domain dispatchers)
├── shared-spaces/             # Shared memory space management
├── database/                  # SQLite database files
├── tests/                     # Vitest test suites
├── INSTALL_GUIDE.md           # Full installation walkthrough
└── README.md                  # This file
```

### Key Files

| File | What It Does |
|------|-------------|
| `context-server.ts` | Starts the MCP listener and registers all 33 tools. This is the entry point. |
| `tool-schemas.ts` | Defines every tool name, description and parameter schema in one place. |
| `handlers/memory-save.ts` | Runs the save pipeline: validates structure, checks for duplicates, generates embeddings, stores the result. |
| `lib/search/README.md` | Maps each search pipeline stage to its source module. |
| `INSTALL_GUIDE.md` | Step-by-step installation with embedding providers and environment variables. |

### 7-Layer Tool Architecture

Tools are organized into layers based on what they do. Lower layers handle everyday operations. Higher layers handle specialized tasks.

| Layer | Name | Tools | Purpose |
|-------|------|-------|---------|
| L1 | Orchestration | 1 | Smart entry point that figures out what you need |
| L2 | Core | 4 | The main search and save operations |
| L3 | Discovery | 3 | Browse what is stored, check system health |
| L4 | Mutation | 4 | Update, delete, validate and bulk cleanup |
| L5 | Lifecycle | 8 | Checkpoints, shared spaces and enable/disable |
| L6 | Analysis | 8 | Trace decisions, measure learning, run evaluations |
| L7 | Maintenance | 5 | Re-index files, review history, run bulk imports |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:features -->
## 4. FEATURES

### 4.1 How the Memory System Works

This section explains the main ideas behind the memory system in plain language. For the full tool reference with parameters, skip to [4.2 Tool Reference](#42-tool-reference).

#### Hybrid Search: Checking Both the Index and the Shelves

When you search for something, the system does not just look in one place. It checks several sources at once, like a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet and the recommendation board all at the same time. Then it combines everything and ranks results so the best match shows up first.

Five search channels work together:

| Channel | How It Works | Good For |
|---------|-------------|----------|
| **Vector** | Compares the meaning of your query against stored embeddings | Finding related content even when the words are different |
| **FTS5** | Full-text search on exact words and phrases | Looking up specific terms or error messages |
| **BM25** | Keyword relevance scoring (like a search engine) | Ranking results when you know roughly what you want |
| **Skill Graph** | Follows causal links between memories | "Why did we choose this?" questions |
| **Degree** | Counts how connected a memory is to others | Finding important hub memories |

Results from all channels merge through Reciprocal Rank Fusion. If a memory scores well in multiple channels, it rises to the top. If the first search comes back empty, the system automatically widens its net and tries again so you almost never get zero results.

Every search goes through four stages like an assembly line:

1. **Gather candidates** from active channels
2. **Score and fuse** results with decay, boost and penalty signals
3. **Rerank** for precision using a cross-encoder model
4. **Filter and annotate** to remove noise and add metadata

#### Memory Lifecycle: How Memories Age

Not all memories are equally useful forever. The system tracks how fresh each memory is using a model called FSRS (Free Spaced Repetition Scheduler). Think of it like how your own brain works: things you reviewed recently are easy to recall, while things you have not thought about in months fade into the background.

Each memory has an importance tier that controls how quickly it fades:

| Tier | What It Means | Decay Speed |
|------|--------------|-------------|
| **constitutional** | Rules that never change (coding standards, architecture constraints) | Never fades |
| **critical** | Key decisions and architectural choices | Very slow |
| **important** | Significant findings and context | Slow |
| **normal** | Regular session notes and observations | Normal |
| **temporary** | Scratch work, debugging notes | Fast |
| **deprecated** | Outdated information kept for history | Fastest |

Memories also move through five states based on how recently they were accessed:

**HOT** (just used) >> **WARM** (recently relevant) >> **COLD** (not accessed lately) >> **DORMANT** (inactive) >> **ARCHIVED** (stored but rarely surfaced)

When you search, HOT memories get full content in results. WARM memories appear as summaries. COLD and below only show up if they score well enough to earn a spot.

#### Causal Graph: Connecting the Dots

The system can track how decisions relate to each other. Think of it like a corkboard with sticky notes connected by string. One note says "we chose JWT tokens." A string connects it to another note that says "because the session store was too slow." Another string connects that to "the Redis outage on March 5th."

Six types of relationships link memories together:

- **caused**: A led directly to B
- **enabled**: A made B possible
- **supersedes**: B replaces A
- **contradicts**: A and B conflict
- **derived_from**: B is based on A
- **supports**: A provides evidence for B

When you ask "why did we make this decision?", the system follows these links backwards to show the chain of reasoning.

#### Shared Memory: A Shared Office With a Keycard Lock

By default, every memory is private to the user or agent that created it. Shared memory adds controlled access so multiple people or agents can read and write to a common knowledge pool.

Think of it like a shared office. The office stays locked until an admin activates it. Only people on the access list can enter. And management can lock it down instantly if something goes wrong.

Key concepts:
- **Spaces** are named containers for shared knowledge (like rooms in the office)
- **Roles** control what members can do: `owner` (full control), `editor` (read/write), `viewer` (read-only)
- **Deny-by-default** means nobody gets access unless explicitly granted
- **Kill switch** immediately blocks all access for emergencies

For the full shared memory guide including setup, use cases and troubleshooting, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).

#### Quality Gates: The Bouncer at the Door

Not everything deserves to be stored. Before a new memory enters the system, it goes through three checks:

1. **Structure check**: Does the file have the required format, headings and metadata?
2. **Semantic check**: Is there enough real content to be useful, or is it too thin?
3. **Duplicate check**: Does this information already exist in a different form?

If a file fails any check, the system rejects it with a clear explanation of what went wrong. You can preview these checks without actually saving by using the `dryRun` parameter. Think of it like a dress rehearsal before opening night.

---

### 4.2 Tool Reference

All 33 tools listed by architecture layer. Each entry has a plain-language description and a parameter table. For full Zod schemas with types and defaults, see `tool-schemas.ts`.

**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.

---

#### L1: Orchestration (1 tool)

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

#### L2: Core (4 tools)

##### `memory_search`

The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning, not just keywords, so searching for "login problems" can find a document titled "authentication troubleshooting."

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

The lightweight search option. Works like a preset: you provide a query and optional scope boundaries, and it forwards to the full search tool with sensible defaults. Use this when you want fast results without setting lots of parameters.

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

#### L3: Discovery (3 tools)

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

#### L7: Maintenance (5 tools)

##### `memory_index_scan`

Scan the workspace for new or changed memory files and add them to the index. Use after adding files manually or after a git pull. Processes three source families: constitutional rules, spec documents and spec memories.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope scan to a folder |
| `force` | boolean | Re-index even if file hash unchanged |
| `includeConstitutional` | boolean | Include constitutional rules directory |
| `includeSpecDocs` | boolean | Include spec folder documents |
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

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

For the complete list of all environment variables with defaults and examples, see `../references/config/environment_variables.md`.

### Embedding Providers

The system needs an embedding provider to convert text into vectors for similarity search. Pick one:

| Provider | Environment Variables | Notes |
|----------|-----------------------|-------|
| **Voyage AI** (recommended) | `EMBEDDING_PROVIDER=voyage`, `VOYAGE_API_KEY=your-key` | Best retrieval quality |
| **OpenAI** | `EMBEDDING_PROVIDER=openai`, `OPENAI_API_KEY=your-key` | Widely available |
| **HuggingFace local** | `EMBEDDING_PROVIDER=huggingface` | No API key needed, runs on your machine |

### Feature Flags

Feature flags control which parts of the pipeline are active. Most are turned on by default. The evaluation rule is simple: absent, empty or `'true'` means enabled. `'false'` or `'0'` means disabled.

The global rollout gate `SPECKIT_ROLLOUT_PERCENT` (default `100`) applies a percentage filter on top of all individual flags. Set to `0` to turn off the entire pipeline.

**Search Pipeline** (representative flags):

| Flag | Default | What It Controls |
|------|---------|-----------------|
| `ENABLE_BM25` | `true` | BM25 keyword scoring channel |
| `ENABLE_GRAPH_SEARCH` | `true` | Causal graph traversal channel |
| `ENABLE_RERANKER` | `true` | Cross-encoder reranking at Stage 3 |
| `ENABLE_MMR` | `true` | Diversity reranking |
| `ENABLE_CO_ACTIVATION` | `true` | Co-activation spreading boost |
| `ENABLE_FSRS_DECAY` | `true` | FSRS power-law decay scoring |
| `ENABLE_INTERFERENCE_PENALTY` | `true` | Suppresses over-retrieved memories |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | Global percentage gate (0-100) |
| `SPECKIT_ABLATION` | `false` | Enable ablation study mode |
| `SPECKIT_RESPONSE_TRACE` | `false` | Include retrieval trace in responses |

**Session and Cache**:

| Flag | Default | What It Controls |
|------|---------|-----------------|
| `ENABLE_SESSION_DEDUP` | `true` | Skip memories already seen this session |
| `ENABLE_TOOL_CACHE` | `true` | TTL cache for tool-level results |
| `SESSION_CACHE_TTL` | `300` | Cache lifetime in seconds |

**MCP Configuration**:

| Flag | Default | What It Controls |
|------|---------|-----------------|
| `SPECKIT_MIN_QUALITY_SCORE` | `0.3` | Minimum quality score to accept a save |
| `SPECKIT_PREFLIGHT_STRICT` | `false` | Reject saves that fail the quality gate |
| `SPECKIT_MAX_CHUNK_SIZE` | `50000` | Character threshold for section chunking |

**Memory and Storage**:

| Flag | Default | What It Controls |
|------|---------|-----------------|
| `DB_PATH` | `mcp_server/database/spec-kit.db` | SQLite database path |
| `SPECKIT_EMBEDDING_CACHE` | `true` | Cache embeddings to avoid re-generation |
| `SPECKIT_BATCH_SIZE` | `50` | Batch size for bulk indexing |

**Embedding and API**:

| Flag | Default | What It Controls |
|------|---------|-----------------|
| `EMBEDDING_PROVIDER` | `voyage` | Provider: `voyage`, `openai`, `huggingface` |
| `VOYAGE_API_KEY` | _(none)_ | Voyage AI API key |
| `OPENAI_API_KEY` | _(none)_ | OpenAI API key |

**Debug and Telemetry**:

| Flag | Default | What It Controls |
|------|---------|-----------------|
| `SPECKIT_DEBUG` | `false` | Verbose debug logging |
| `SPECKIT_SCORE_TRACE` | `false` | Log per-channel scores for each result |

### Database Schema

The SQLite database has 25 tables. The most important ones:

| Table | What It Stores |
|-------|---------------|
| `memory_index` | Core memory records (id, path, title, content, metadata) |
| `vec_memories` | Vector embeddings for similarity search |
| `memory_fts` | FTS5 full-text search index |
| `checkpoints` | Named memory state snapshots |
| `causal_edges` | Typed causal relationships between memories |
| `learning_records` | Preflight/postflight epistemic snapshots |
| `working_memory` | Session-scoped attention tracking |
| `shared_spaces` | Shared memory space definitions |
| `shared_space_members` | Membership records for shared spaces |
| `session_state` | Cross-turn session context |
| `schema_version` | Migration version tracking |

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
| Resume a session | `memory_context` | Set `mode: "resume"` |
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

**Common causes**: Stale BM25 index, divergent aliases in FTS5, or memories with low quality scores surfacing.

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

**Common causes**: Too little real content, missing required structure (headings, metadata), or semantic duplicate.

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

**What you see**: `node dist/context-server.js` exits with a module error or DB_PATH error.

**Fix**: Rebuild and check the database path:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build
node -e "require('./dist/context-server.js')" 2>&1 | head -20
```

---

### Quick Fixes

| Problem | Fix |
|---------|-----|
| Search returning empty | Run `memory_index_scan` to re-index |
| Tools not appearing in MCP client | Restart the MCP client after config changes |
| BM25 index stale | Set `ENABLE_BM25=false` to fall back to FTS5 |
| Slow responses on large index | Set `ENABLE_TOOL_CACHE=true` and check `SESSION_CACHE_TTL` |
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

Three main differences. First, this system uses 5 search channels combined with rank fusion, not just vector similarity. Second, it applies FSRS decay so recently accessed memories rank higher without manual curation. Third, the causal graph lets you answer "why was this decision made?" which no vector database supports natively.

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
| [../feature_catalog/feature_catalog.md](../feature_catalog/feature_catalog.md) | Complete feature inventory: 21 categories, 222 features with code references |
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
