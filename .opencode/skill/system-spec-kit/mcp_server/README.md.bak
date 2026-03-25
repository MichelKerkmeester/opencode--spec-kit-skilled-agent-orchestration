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

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. MCP TOOLS](#4--mcp-tools)
- [5. SEARCH SYSTEM](#5--search-system)
- [6. CONFIGURATION](#6--configuration)
- [7. USAGE EXAMPLES](#7--usage-examples)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. FAQ](#9--faq)
- [10. RELATED DOCUMENTS](#10--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Is

`@spec-kit/mcp-server` is a Model Context Protocol server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then retrieves exactly what is relevant using a 5-channel hybrid search pipeline. Context works across sessions, models and tools without re-explaining everything every conversation.

The server exposes **33 MCP tools** organized across 7 architecture layers, from a single unified entry point (`memory_context`) down to async ingestion jobs and causal graph operations. A newcomer uses two or three tools. A power user has full control over decay rates, retention policies, shared spaces and evaluation metrics.

Your AI assistant has amnesia. Every conversation starts fresh. You explain your architecture Monday, by Wednesday it is a blank slate. This server fixes that by storing what matters, decaying what does not, and routing retrieval through a search pipeline that understands query intent, not just keyword overlap.

### Key Statistics

| Metric | Value | Details |
|--------|-------|---------|
| **MCP tools** | 33 | Across 7 layers (L1-L7) |
| **Search channels** | 5 | Vector, FTS5, BM25, Skill Graph, Degree |
| **Pipeline stages** | 4 | Candidate Generation, Fusion+Signals, Rerank+Aggregate, Filter+Annotate |
| **Importance tiers** | 6 | constitutional through deprecated |
| **Memory states** | 5 | HOT, WARM, COLD, DORMANT, ARCHIVED |
| **Intent types** | 7 | add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |
| **Causal relation types** | 6 | caused, enabled, supersedes, contradicts, derived_from, supports |
| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
| **Embedding providers** | 3 | Voyage AI, OpenAI, HuggingFace local |
| **Database tables** | 25 | memory_index, vec_memories, checkpoints, causal_edges and more |
| **Feature flag categories** | 7 | Search, Session/Cache, MCP Config, Memory/Storage, Embedding, Debug, CI |

### What Makes This Different

| Capability | Basic RAG | Spec Kit Memory |
|------------|-----------|-----------------|
| **"Why" queries** | Not possible | Causal graph traversal with 6 relationship types |
| **Decay** | None or exponential | FSRS power-law validated on 100M+ users |
| **Sessions** | None | Deduplication with ~50% tokens saved on follow-up queries |
| **Section retrieval** | Full documents | ANCHOR-based chunking with ~93% token savings |
| **Search** | Vector only | 5-channel fusion with RRF + adaptive reranking |
| **State** | Stateless | 5-state cognitive model (HOT/WARM/COLD/DORMANT/ARCHIVED) |
| **Duplicates** | Index everything | Prediction Error Gating with 4-tier thresholds |
| **Governance** | None | Hierarchical scope, shared spaces, retention policies |

### Key Features

| Feature | Description |
|---------|-------------|
| **Hybrid search** | BM25, vector similarity and graph channels fused with Reciprocal Rank Fusion |
| **FSRS decay** | Power-law memory strength model keeps relevant memories fresh and lets stale ones fade |
| **Causal graph** | Traces decision lineage across 6 relationship types for "why did we choose X?" queries |
| **Intent routing** | 7 task intents adjust channel weights and reranking parameters automatically |
| **Shared spaces** | Deny-by-default multi-agent memory with role-based membership and kill switches |
| **Quality gates** | 3-layer pre-storage validation prevents low-quality content from entering the index |
| **Checkpoints** | Named snapshots of memory state for safe bulk operations and rollback |
| **Learning metrics** | Epistemic pre/post flight captures knowledge delta across task sessions |

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

This section covers the minimum steps to get the server running. For full installation with embedding providers, database migration and environment setup, see [INSTALL_GUIDE.md](./INSTALL_GUIDE.md).

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

Add this block to your MCP client configuration (e.g., `opencode.json` or Claude Desktop config):

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

After connecting your MCP client, call the health check tool:

```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "full" }
}
```

Expected: a JSON response with `status: "ok"` and database table counts.

### First Memory Save

Save your first memory file to the index:

```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/absolute/path/to/your/memory-file.md"
  }
}
```

### First Search

```json
{
  "tool": "memory_context",
  "arguments": {
    "input": "how did we decide on the auth architecture?",
    "mode": "auto"
  }
}
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
mcp_server/
├── context-server.ts          # MCP server entry point, tool registration
├── dist/                      # Compiled JavaScript build output
├── cli.ts                     # CLI entry point
├── tool-schemas.ts            # All 33 tool definitions (Zod schemas)
├── api/                       # Public API surface (search, indexing)
├── core/                      # Core runtime logic (lifecycle, orchestration)
├── configs/                   # Runtime configuration modules
├── formatters/                # Output formatting (markdown, structured)
├── schemas/                   # Zod validation schemas
├── handlers/                  # Per-tool request handlers
│   ├── memory-save.ts         # Save handler with pre-flight validation
│   ├── memory-search.ts       # Core search handler
│   ├── memory-context.ts      # Unified context entry point
│   ├── save/                  # Save sub-modules (types, response-builder)
│   └── ...                    # One handler file per tool or tool group
├── lib/
│   ├── search/                # 4-stage hybrid search pipeline
│   │   ├── README.md          # Per-stage module mapping
│   │   ├── pipeline/          # Orchestrator + stage1/stage2/stage2b/stage3/stage4 modules
│   │   ├── hybrid-search.ts   # End-to-end search entry point
│   │   ├── confidence-scoring.ts
│   │   └── vector-index*.ts   # Vector index storage, query, mutation, and schema helpers
│   ├── architecture/, cache/, chunking/, cognitive/, collab/, config/
│   ├── contracts/, errors/, eval/, extraction/, feedback/, governance/
│   ├── graph/, interfaces/, learning/, manage/, ops/, parsing/
│   └── providers/, response/, scoring/, session/, spec/, storage/, telemetry/, utils/, validation/
│                              # 27 additional runtime subdirectories under lib/
├── hooks/
│   ├── README.md              # Lifecycle hook documentation
│   └── ...                    # Post-mutation hooks, UX payload builders
├── tools/                     # Tool dispatch layer (5 domain dispatchers)
├── database/                  # SQLite database files
├── shared-spaces/             # Shared memory space management
├── scripts/                   # Internal server-side scripts
├── specs/                     # Runtime-local documentation and package notes
├── startup-checks.ts          # Startup validation and environment checks
├── utils/                     # Server utility modules
├── tmp-test-fixtures/         # Fixture data used by test suites
├── tests/                     # Vitest test suites
│   └── *.vitest.ts
├── INSTALL_GUIDE.md           # Full installation walkthrough
└── README.md                  # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `context-server.ts` | Server entry point. Registers all 33 tools and starts the MCP listener. |
| `tool-schemas.ts` | Single source of truth for all tool names, descriptions and Zod parameter schemas. |
| `handlers/memory-save.ts` | Save handler with 3-layer pre-flight quality gate, duplicate detection and embedding. |
| `lib/search/README.md` | Detailed per-stage module mapping for the 4-stage search pipeline. |
| `hooks/README.md` | Lifecycle hook documentation for post-mutation wiring. |
| `INSTALL_GUIDE.md` | Full installation guide with embedding provider setup and environment variables. |

### 7-Layer Tool Architecture

| Layer | Name | Tool Count | Token Budget | Purpose |
|-------|------|-----------|--------------|---------|
| L1 | Orchestration | 1 | 2000 | Unified entry point with intent-aware routing |
| L2 | Core | 4 | 1500 | Search, trigger matching and memory save |
| L3 | Discovery | 3 | 800 | Browse, statistics and health diagnostics |
| L4 | Mutation | 4 | 500 | Update, delete, validate and bulk operations |
| L5 | Lifecycle | 8 | 600 | Checkpoints, shared spaces and enable |
| L6 | Analysis | 8 | 1200 | Causal graph, learning metrics and evaluation |
| L7 | Maintenance | 5 | 1000 | Index scan, learning history and async ingestion |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:mcp-tools -->
## 4. MCP TOOLS

All 33 tools are listed below, organized by architecture layer. Each entry shows the tool name, a short description and the key parameters to know. For full parameter schemas with types and defaults, see `tool-schemas.ts`.

**Start here for most operations**: `memory_context` (L1) automatically routes to the right retrieval strategy. Use the lower-level tools when you need precise control.

---

### L1: Orchestration (1 tool, token budget: 2000)

#### `memory_context`

Unified entry point for context retrieval. Start here for most memory operations. Detects task intent, selects retrieval mode and routes to the optimal strategy automatically.

| Parameter | Type | Notes |
|-----------|------|-------|
| `input` | string | **Required.** Your query or task description. |
| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
| `intent` | string | Override auto-detected intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
| `specFolder` | string | Scope results to a spec folder (e.g., `specs/022-hybrid-rag-fusion`) |
| `tenantId` | string | Governed retrieval tenant boundary forwarded to routed searches |
| `userId` | string | Governed retrieval user boundary forwarded to routed searches |
| `agentId` | string | Governed retrieval agent boundary forwarded to routed searches |
| `sharedSpaceId` | string | Governed shared-space boundary forwarded to routed searches |
| `limit` | number | Max results to return (default varies by mode) |
| `sessionId` | string | Session ID for deduplication across turns |
| `anchors` | string[] | Retrieve specific ANCHOR sections: `["state", "next-steps"]` |
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

### L2: Core (4 tools, token budget: 1500)

#### `memory_search`

Semantic search using vector similarity with optional BM25, FTS5 and graph channels. Returns ranked results with scores. Constitutional tier always surfaces at the top.

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search query (use `query` OR `concepts`, not both) |
| `concepts` | string[] | AND search: 2-5 strings that must all match |
| `specFolder` | string | Scope to a folder |
| `tenantId` | string | Governed retrieval tenant boundary |
| `userId` | string | Governed retrieval user boundary |
| `agentId` | string | Governed retrieval agent boundary |
| `sharedSpaceId` | string | Governed shared-memory boundary |
| `limit` | number | 1-100 results (default 10) |
| `tier` | string | Filter by importance tier |
| `minState` | string | Minimum memory state: `HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED` |
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

#### `memory_quick_search`

Fast delegated search that forwards directly to `memory_search` with sensible defaults. Use this when you want a lightweight surface but still need governed retrieval boundaries.

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | **Required.** Free-text search query |
| `specFolder` | string | Scope to a folder |
| `tenantId` | string | Governed retrieval tenant boundary |
| `userId` | string | Governed retrieval user boundary |
| `agentId` | string | Governed retrieval agent boundary |
| `sharedSpaceId` | string | Governed shared-memory boundary |
| `limit` | number | 1-100 results (default 10) |

---

#### `memory_match_triggers`

Fast trigger phrase matching with cognitive memory features. Returns matches based on phrase overlap, not embedding similarity. Supports attention-based decay and tiered content injection: HOT state returns full content, WARM state returns summaries.

| Parameter | Type | Notes |
|-----------|------|-------|
| `prompt` | string | **Required.** The user's current prompt text. |
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

#### `memory_save`

Index a memory file into the database. Reads the file, extracts metadata, validates rendered-memory structure, generates an embedding and stores everything in the index. Before persistence it can reject for structural contract violations, insufficient durable evidence, quality-gate failures, or semantic duplicates.

| Parameter | Type | Notes |
|-----------|------|-------|
| `filePath` | string | **Required.** Absolute path to the `.md` file to index. |
| `force` | boolean | Overwrite if already indexed |
| `dryRun` | boolean | Preview validation, sufficiency, and rejection details without saving |
| `skipPreflight` | boolean | Bypass quality gate (not recommended) |
| `asyncEmbedding` | boolean | Return immediately, generate embedding in background |
| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
| `deleteAfter` | string | ISO date for automatic deletion |
| `sessionId` | string | Optional session attribution |
| `tenantId` | string | Governance: tenant scope |
| `userId` | string | Governance: user attribution |
| `agentId` | string | Governance: agent attribution |
| `sharedSpaceId` | string | Governance: shared-space target for collaborative ingest |
| `provenanceSource` | string | Governance audit source label |
| `provenanceActor` | string | Governance audit actor label |
| `governedAt` | string | ISO timestamp used for governed ingest audit |

```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/absolute/path/to/specs/022-auth/memory/auth-decision.md",
    "dryRun": true
  }
}
```

---

### L3: Discovery (3 tools, token budget: 800)

#### `memory_list`

Browse stored memories with pagination. Use to discover what is in the index and find IDs for delete or update operations.

| Parameter | Type | Notes |
|-----------|------|-------|
| `limit` | number | Max 100 per page |
| `offset` | number | Pagination offset |
| `specFolder` | string | Scope to a folder |
| `sortBy` | string | `created_at`, `updated_at` or `importance_weight` |
| `includeChunks` | boolean | Include chunk-level detail |

---

#### `memory_stats`

Statistics about the memory system: counts, dates, status breakdowns and top folders. Supports multiple ranking modes for folder importance.

| Parameter | Type | Notes |
|-----------|------|-------|
| `folderRanking` | string | `count`, `recency`, `importance` or `composite` |
| `excludePatterns` | string[] | Glob patterns to exclude from stats |
| `includeScores` | boolean | Include composite quality scores |
| `includeArchived` | boolean | Include ARCHIVED state memories in counts |
| `limit` | number | Max folders to return |

---

#### `memory_health`

Check health status with full diagnostics or compact divergent-alias triage output. Run this when search quality degrades or after schema changes.

| Parameter | Type | Notes |
|-----------|------|-------|
| `reportMode` | string | `full` (default) or `divergent_aliases` |
| `limit` | number | Max items to report |
| `specFolder` | string | Scope to a folder |
| `autoRepair` | boolean | Attempt automatic repairs |
| `confirmed` | boolean | Confirm destructive repair operations |

---

### L4: Mutation (4 tools, token budget: 500)

#### `memory_delete`

Delete a memory by ID, or delete all memories in a spec folder with explicit confirmation.

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | number | Memory ID to delete (use OR with specFolder) |
| `specFolder` | string | Delete all memories in folder (requires `confirm: true`) |
| `confirm` | boolean | **Required when using specFolder** to prevent accidents |

---

#### `memory_update`

Update an existing memory with corrections. Re-generates the embedding when content changes. Supports partial updates so you can fix just the importance tier without touching the content.

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | number | **Required.** Memory ID to update. |
| `title` | string | Updated title |
| `triggerPhrases` | string[] | Updated trigger phrases |
| `importanceWeight` | number | Updated weight (0.0-1.0) |
| `importanceTier` | string | `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| `allowPartialUpdate` | boolean | Update only provided fields (default false) |

---

#### `memory_validate`

Record validation feedback on a memory. Tracks whether memories are useful in context, updating confidence scores. High-confidence memories can be auto-promoted to the `critical` importance tier.

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | number | **Required.** Memory ID to validate. |
| `wasUseful` | boolean | **Required.** Was this memory helpful? |
| `queryId` | string | Query that retrieved this memory |
| `resultRank` | number | Position in results where this appeared |
| `notes` | string | Optional notes on why it was or was not useful |

---

#### `memory_bulk_delete`

Bulk delete memories by importance tier. Auto-creates a checkpoint before deletion. Refuses to delete `constitutional` or `critical` tier memories without explicit per-ID confirmation.

| Parameter | Type | Notes |
|-----------|------|-------|
| `tier` | string | **Required.** Tier to delete: `temporary`, `deprecated`, `normal`, etc. |
| `confirm` | boolean | **Required.** Must be `true`. |
| `specFolder` | string | Scope deletion to a folder |
| `olderThanDays` | number | Only delete memories older than N days |
| `skipCheckpoint` | boolean | Skip automatic checkpoint (not recommended) |

---

### L5: Lifecycle (8 tools, token budget: 600)

#### `checkpoint_create`

Create a named checkpoint of the current memory state. Used before bulk operations or risky changes.

| Parameter | Type | Notes |
|-----------|------|-------|
| `name` | string | **Required.** Checkpoint identifier. |
| `specFolder` | string | Scope to a folder |
| `metadata` | object | Optional metadata to store with the checkpoint |

---

#### `checkpoint_list`

List all available checkpoints, optionally scoped to a spec folder.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope to a folder |
| `limit` | number | Max checkpoints to return |

---

#### `checkpoint_restore`

Restore memory state from a named checkpoint. Replaces current index with the checkpoint snapshot.

| Parameter | Type | Notes |
|-----------|------|-------|
| `name` | string | **Required.** Checkpoint name to restore. |
| `clearExisting` | boolean | Clear current memories before restoring |

---

#### `checkpoint_delete`

Delete a checkpoint. Requires the `confirmName` field to match `name` as a safety measure.

| Parameter | Type | Notes |
|-----------|------|-------|
| `name` | string | **Required.** Checkpoint name to delete. |
| `confirmName` | string | **Required.** Must exactly match `name`. |

---

#### `shared_space_upsert`

Create or update a shared-memory space. Shared spaces start deny-by-default: no agent or user can read or write until explicit membership is added via `shared_space_membership_set`. The first successful creator is auto-granted the `owner` role; later updates require an existing owner identity.

| Parameter | Type | Notes |
|-----------|------|-------|
| `spaceId` | string | **Required.** Unique identifier for the space. |
| `tenantId` | string | **Required.** Tenant scope. |
| `name` | string | **Required.** Human-readable name. |
| `actorUserId` | string | Caller identity for a user admin operation. Provide exactly one actor identity. |
| `actorAgentId` | string | Caller identity for an agent admin operation. Provide exactly one actor identity. |
| `rolloutEnabled` | boolean | Enable or disable this space |
| `rolloutCohort` | string | Limit access to a specific cohort ID |
| `killSwitch` | boolean | Hard disable for emergency shutoff |

---

#### `shared_space_membership_set`

Set deny-by-default membership for a user or agent in a shared space. Assign `owner`, `editor` or `viewer` roles. Caller must already be an `owner` of the target space.

| Parameter | Type | Notes |
|-----------|------|-------|
| `spaceId` | string | **Required.** Space to configure. |
| `tenantId` | string | **Required.** Tenant boundary for the mutation. |
| `actorUserId` | string | Caller identity for a user admin operation. Provide exactly one actor identity. |
| `actorAgentId` | string | Caller identity for an agent admin operation. Provide exactly one actor identity. |
| `subjectType` | string | **Required.** `user` or `agent` |
| `subjectId` | string | **Required.** User or agent identifier. |
| `role` | string | **Required.** `owner`, `editor` or `viewer` |

---

#### `shared_memory_status`

Inspect shared-memory rollout state and the spaces accessible to a given tenant, user or agent.

| Parameter | Type | Notes |
|-----------|------|-------|
| `tenantId` | string | Filter by tenant |
| `userId` | string | Filter by user |
| `agentId` | string | Filter by agent |

---

#### `shared_memory_enable`

Enable the shared-memory subsystem. First-run setup creates infrastructure tables and a README file. Idempotent: safe to call multiple times.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ | | Call with empty arguments object. |

---

### L6: Analysis (8 tools, token budget: 1200)

#### `task_preflight`

Capture epistemic baseline before task execution. Records knowledge, uncertainty and context scores. These scores are compared to `task_postflight` to calculate the Learning Index.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | **Required.** Spec folder for this task. |
| `taskId` | string | **Required.** Unique task identifier. |
| `knowledgeScore` | number | **Required.** 0-100: how well do you understand the domain? |
| `uncertaintyScore` | number | **Required.** 0-100: how uncertain are you? |
| `contextScore` | number | **Required.** 0-100: how much relevant context do you have? |
| `knowledgeGaps` | string[] | Known gaps before starting |
| `sessionId` | string | Session identifier |

---

#### `task_postflight`

Capture epistemic state after a task. Calculates Learning Index delta against the preflight baseline.

**Formula:** `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | **Required.** Must match the preflight call. |
| `taskId` | string | **Required.** Must match the preflight call. |
| `knowledgeScore` | number | **Required.** Post-task knowledge score. |
| `uncertaintyScore` | number | **Required.** Post-task uncertainty score. |
| `contextScore` | number | **Required.** Post-task context score. |
| `gapsClosed` | string[] | Gaps that were resolved |
| `newGapsDiscovered` | string[] | Gaps discovered during the task |

---

#### `memory_drift_why`

Trace the causal chain for a memory. Answers "why was this decision made?" by traversing causal edges up to `maxDepth` hops and grouping results by relationship type.

| Parameter | Type | Notes |
|-----------|------|-------|
| `memoryId` | string | **Required.** Memory to trace from. |
| `maxDepth` | number | Max hops to traverse (default 3, max 10) |
| `direction` | string | `outgoing`, `incoming` or `both` |
| `relations` | string[] | Filter to specific relationship types |
| `includeMemoryDetails` | boolean | Include full memory content in results |

---

#### `memory_causal_link`

Create a causal relationship between two memories. Use this to build decision lineage ("this refactor was caused by that bug fix").

| Parameter | Type | Notes |
|-----------|------|-------|
| `sourceId` | string | **Required.** Cause memory ID. |
| `targetId` | string | **Required.** Effect memory ID. |
| `relation` | string | **Required.** `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` or `supports` |
| `strength` | number | Edge weight (0.0-1.0, default 1.0) |
| `evidence` | string | Free-text evidence supporting this link |

---

#### `memory_causal_stats`

Statistics about the causal memory graph: total edges, coverage percentage, breakdown by relationship type. Target coverage is 60% of memories linked.

| Parameter | Type | Notes |
|-----------|------|-------|
| _(none required)_ | | Returns global stats. |

---

#### `memory_causal_unlink`

Remove a causal relationship by edge ID.

| Parameter | Type | Notes |
|-----------|------|-------|
| `edgeId` | string | **Required.** Edge ID from `memory_drift_why` results. |

---

#### `eval_run_ablation`

Run a controlled channel ablation study. Tests which search channels contribute most to recall. Requires `SPECKIT_ABLATION=true` environment variable. Can persist Recall@20 deltas to the eval metrics database.

| Parameter | Type | Notes |
|-----------|------|-------|
| `channels` | string[] | Channels to test: `vector`, `bm25`, `fts5`, `graph`, `trigger` |
| `groundTruthQueryIds` | string[] | Query IDs with known-correct results |
| `recallK` | number | K value for Recall@K metric |
| `storeResults` | boolean | Persist results to eval_metric_snapshots table |
| `includeFormattedReport` | boolean | Return human-readable report |

---

#### `eval_reporting_dashboard`

Generate a reporting dashboard with sprint and channel trend aggregation from eval database metrics.

| Parameter | Type | Notes |
|-----------|------|-------|
| `sprintFilter` | string | Filter by sprint ID |
| `channelFilter` | string | Filter by channel name |
| `metricFilter` | string | Filter by metric type |
| `limit` | number | Max records to include |
| `format` | string | `text` (default) or `json` |

---

### L7: Maintenance (5 tools, token budget: 1000)

#### `memory_index_scan`

Scan the workspace for new or changed memory files and index them. Processes 3 source families: constitutional rules, spec documents and spec memories. Use after adding files manually or after a git pull.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope scan to a folder |
| `force` | boolean | Re-index even if file hash unchanged |
| `includeConstitutional` | boolean | Include constitutional rules directory |
| `includeSpecDocs` | boolean | Include spec folder documents |
| `incremental` | boolean | Only process files changed since last scan |

---

#### `memory_get_learning_history`

Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows Learning Index trends over time.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | **Required.** Spec folder to query. |
| `sessionId` | string | Filter by session |
| `limit` | number | Max records to return |
| `onlyComplete` | boolean | Only return paired preflight+postflight records |
| `includeSummary` | boolean | Include aggregated LI summary statistics |

---

#### `memory_ingest_start`

Start an async ingestion job for multiple markdown files. Returns immediately with a `jobId`. Check progress with `memory_ingest_status`.

| Parameter | Type | Notes |
|-----------|------|-------|
| `paths` | string[] | **Required.** 1 to N absolute file paths. |
| `specFolder` | string | Associate ingested files with a spec folder |

---

#### `memory_ingest_status`

Get the current state and progress for a running async ingestion job.

| Parameter | Type | Notes |
|-----------|------|-------|
| `jobId` | string | **Required.** Job ID from `memory_ingest_start`. |

---

#### `memory_ingest_cancel`

Cancel a running async ingestion job. Cancellation is checked between files, so the current file finishes before stopping.

| Parameter | Type | Notes |
|-----------|------|-------|
| `jobId` | string | **Required.** Job ID to cancel. |

<!-- /ANCHOR:mcp-tools -->

---

<!-- ANCHOR:search-system -->
## 5. SEARCH SYSTEM

The search system is a 4-stage pipeline that runs every time you call `memory_context` or `memory_search`. It starts with multi-channel candidate generation and ends with annotated, diversity-ranked results.

### Query Pipeline

Before retrieval starts, every query goes through three classification steps:

1. **Complexity routing**: `simple` (2 channels), `moderate` (4 channels) or `complex` (all 5 channels)
2. **Intent detection**: Maps query text to one of 7 task intents, adjusting channel weights and reranking parameters
3. **Artifact routing**: Classifies the target into 9 artifact classes (spec, plan, decision, code, config, test, doc, memory, scratch) for tier-aware filtering

### 5 Search Channels

| Channel | Technology | Base Weight | Best For |
|---------|-----------|-------------|----------|
| **Vector** | sqlite-vec 1024-dimension embeddings | 1.0x | Semantic meaning, paraphrased queries |
| **FTS5** | SQLite full-text search | 1.0x | Exact phrase matching, keyword lookup |
| **BM25** | In-memory BM25 (gated: `ENABLE_BM25`) | 1.0x | TF-IDF keyword relevance scoring |
| **Skill Graph** | Causal edge traversal | 1.5x | Connected decision lineage, "why" queries |
| **Degree** | Typed-weighted graph degree | 1.0x | Hub memories (high connectivity = importance) |

### 4-Stage Pipeline

**Stage 1: Candidate Generation**
Runs active channels in parallel. Applies constitutional injection (constitutional-tier memories always included), quality score filtering and importance tier filters.

**Stage 2: Fusion and Signal Integration**
Merges channel results with Adaptive Reciprocal Rank Fusion (`k=60`, intent-weighted profiles). Then applies post-fusion signals:

| Signal | Effect | Magnitude |
|--------|--------|-----------|
| Co-activation boost | Memories that co-occur with query-matched memories | +0.25 |
| Session/recency boost | Recently accessed memories in current session | cap 0.20 |
| Causal 2-hop boost | Memories 1-2 hops from retrieved causal neighbors | variable |
| FSRS decay | Adjusts score by memory retrievability R(t,S) | multiplicative |
| Intent weights | Channel contribution weights per task intent | variable |
| Interference penalty | Over-retrieved memories suppressed | -0.08 |
| Cold-start boost | New memories with few access events boosted | +N4 formula |
| Channel min-rep | Floor ensures each active channel has at least one result | 0.005 |

**Stage 3: Reranking and Aggregation**
Optional cross-encoder reranking for precision improvement. MPAB (Multi-Pass Aggregation with Boundary) collapses individual chunks back to their parent memory.

**Stage 4: Filter and Annotate**
Enforces score immutability invariant (no score modification after Stage 2). Applies state filtering by `minState` parameter. TRM (Threshold Relevance Measure) Z-score detects evidence gaps. Annotates results with feature flag states.

### Post-Fusion Enhancements

The following operate at Stage 2 and Stage 3, not as separate search channels:

- **MMR diversity reranking**: Maximum Marginal Relevance with intent-specific lambda to balance relevance vs. diversity
- **Confidence truncation**: Cuts off results at 2x the median score gap to avoid surfacing low-confidence tail results
- **Evidence gap detection**: TRM Z-score flags when retrieved memories do not adequately cover the query
- **Dynamic token budget**: 1500/2500/4000 tokens allocated by query complexity tier

### ANCHOR-Based Section Retrieval

Memory files can include `<!-- ANCHOR:name -->` markers. The search system extracts and indexes individual sections, allowing retrieval of just `decisions` or `next-steps` from a large context document. Without ANCHOR markers, the full file is indexed as a single chunk. With them, each section is a separate retrievable unit.

The chunking threshold is 50K characters. Files above this threshold are always chunk-split regardless of ANCHOR markers.

For detailed per-stage module mapping, see `lib/search/README.md`.

<!-- /ANCHOR:search-system -->

---

<!-- ANCHOR:configuration -->
## 6. CONFIGURATION

For the canonical list of all environment variables with defaults and examples, see `../references/config/environment_variables.md`.

### Embedding Providers

Set one provider and its API key:

| Provider | Environment Variables | Notes |
|----------|-----------------------|-------|
| **Voyage AI** (recommended) | `EMBEDDING_PROVIDER=voyage`, `VOYAGE_API_KEY=your-key` | Best retrieval quality |
| **OpenAI** | `EMBEDDING_PROVIDER=openai`, `OPENAI_API_KEY=your-key` | Widely available |
| **HuggingFace local** | `EMBEDDING_PROVIDER=huggingface` | No API key, runs locally |

### Feature Flag Behavior

Feature flags are evaluated by `isFeatureEnabled()` with this rule: absent, empty or `'true'` is enabled. `'false'` or `'0'` is disabled.

The global rollout gate `SPECKIT_ROLLOUT_PERCENT` (default `100`) applies a percentage filter on top of all individual flags. Set to `0` to disable the entire pipeline.

### Feature Flag Categories

**Search Pipeline** (`SPECKIT_*`) -- ~50 flags, most default ON:

| Flag | Default | Controls |
|------|---------|----------|
| `ENABLE_BM25` | `true` | BM25 keyword scoring channel |
| `ENABLE_GRAPH_SEARCH` | `true` | Causal graph traversal channel |
| `ENABLE_RERANKER` | `true` | Cross-encoder reranking at Stage 3 |
| `ENABLE_MMR` | `true` | MMR diversity reranking |
| `ENABLE_CO_ACTIVATION` | `true` | Co-activation spreading boost |
| `ENABLE_FSRS_DECAY` | `true` | FSRS power-law decay scoring |
| `ENABLE_INTERFERENCE_PENALTY` | `true` | Suppresses over-retrieved memories |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | Global percentage gate (0-100) |
| `SPECKIT_ABLATION` | `false` | Enable ablation study mode |
| `SPECKIT_RESPONSE_TRACE` | `false` | Include retrieval trace in responses |

**Session and Cache** -- 10 flags:

| Flag | Default | Controls |
|------|---------|----------|
| `ENABLE_SESSION_DEDUP` | `true` | Skip memories seen in current session |
| `ENABLE_TOOL_CACHE` | `true` | TTL cache for tool-level results |
| `SESSION_CACHE_TTL` | `300` | Session cache TTL in seconds |

**MCP Configuration** -- 7 flags:

| Flag | Default | Controls |
|------|---------|----------|
| `SPECKIT_MIN_QUALITY_SCORE` | `0.3` | Minimum content quality score to save |
| `SPECKIT_PREFLIGHT_STRICT` | `false` | Reject saves that fail quality gate |
| `SPECKIT_MAX_CHUNK_SIZE` | `50000` | Character threshold for ANCHOR chunking |

**Memory and Storage** -- 8 flags:

| Flag | Default | Controls |
|------|---------|----------|
| `DB_PATH` | `mcp_server/database/spec-kit.db` | SQLite database path |
| `SPECKIT_EMBEDDING_CACHE` | `true` | Cache embeddings to avoid re-generation |
| `SPECKIT_BATCH_SIZE` | `50` | Batch size for bulk indexing operations |

**Embedding and API** -- 6 flags:

| Flag | Default | Controls |
|------|---------|----------|
| `EMBEDDING_PROVIDER` | `voyage` | Provider: `voyage`, `openai`, `huggingface` |
| `VOYAGE_API_KEY` | _(none)_ | Voyage AI API key |
| `OPENAI_API_KEY` | _(none)_ | OpenAI API key |

**Debug and Telemetry**:

| Flag | Default | Controls |
|------|---------|----------|
| `SPECKIT_DEBUG` | `false` | Verbose debug logging |
| `SPECKIT_SCORE_TRACE` | `false` | Log per-channel scores for each result |

### Database Schema

The SQLite database currently defines 25 tables. Key tables include:

| Table | Purpose |
|-------|---------|
| `memory_index` | Core memory records (id, path, title, content, metadata) |
| `vec_memories` | Vector embeddings for similarity search |
| `memory_fts` | FTS5 full-text search index |
| `checkpoints` | Named memory state snapshots |
| `memory_history` | Per-memory change history |
| `learning_records` | Preflight/postflight epistemic snapshots |
| `working_memory` | Session-scoped attention tracking |
| `memory_conflicts` | Conflict detection records |
| `causal_edges` | Typed causal relationships between memories |
| `memory_corrections` | User-submitted corrections and feedback |
| `session_state` | Cross-turn session context |
| `schema_version` | Migration version tracking |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 7. USAGE EXAMPLES

### Example 1: Find Context for a Feature Task

Start a new feature and pull all relevant prior decisions and context:

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

**Result**: Returns constitutional rules at top, then spec decisions, then prior auth implementation notes. ANCHOR filtering means you get only the relevant subsections from large documents.

---

### Example 2: Save a Decision Memory

After making an architectural decision, save it for future retrieval:

```bash
# 1. Generate the memory file using the CLI script
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth

# 2. Index it via MCP
```

```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/absolute/path/to/specs/005-auth/memory/2026-03-15_auth-decision.md"
  }
}
```

**Result**: File is validated, embedded and indexed. Returns memory ID, quality score and duplicate check results.

---

### Example 3: Trace a Decision's Origin

Find out why a particular architectural choice was made:

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

**Result**: A causal chain showing which decisions, bugs or requirements led to this memory being created.

---

### Example 4: Checkpoint Before Bulk Cleanup

Before deleting old temporary memories, create a safety checkpoint:

```json
{
  "tool": "checkpoint_create",
  "arguments": {
    "name": "before-temp-cleanup-2026-03-15",
    "specFolder": "specs/022-hybrid-rag-fusion"
  }
}
```

Then delete:

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
  "arguments": {
    "name": "before-temp-cleanup-2026-03-15"
  }
}
```

---

### Example 5: Async Ingest a Large Set of Files

When indexing many files at once, use async ingestion to avoid timeouts:

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

**Result**: Returns `{ "jobId": "job_xyz789" }`. Check progress:

```json
{
  "tool": "memory_ingest_status",
  "arguments": { "jobId": "job_xyz789" }
}
```

---

### Example 6: Measure Learning Across a Task

Before starting a complex task:

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

After completing the task:

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

**Result**: Learning Index calculated as `(45×0.4) + (45×0.35) + (45×0.25) = 45 LI points`.

---

### Common Patterns

| Pattern | Tool | When to Use |
|---------|------|-------------|
| Resume a session | `memory_context` with `mode: "resume"` | Starting a new conversation on existing work |
| Find a decision | `memory_context` with `intent: "find_decision"` | "Why did we choose X?" questions |
| Quick keyword lookup | `memory_search` with `concepts: ["term1", "term2"]` | AND search for specific terms |
| Scan for surface triggers | `memory_match_triggers` | Every new user prompt in an AI workflow |
| Discover what's indexed | `memory_list` + `memory_stats` | Auditing or cleanup |
| Health check | `memory_health` with `reportMode: "full"` | Diagnosing search quality issues |
| Dry-run a save | `memory_save` with `dryRun: true` | Validating quality before committing |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

For the feature flag rollback procedure, see `../references/workflows/rollback_runbook.md`.

### Common Issues

#### Search Returns Low-Quality Results

**Symptom**: `memory_search` or `memory_context` returns irrelevant or low-scoring memories.

**Cause**: Common causes are stale BM25 index, divergent aliases in the FTS5 index, or memories with low quality scores surfacing due to missing minimum threshold.

**Solution**:
```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "full", "autoRepair": true }
}
```

Then re-run with a higher `min_quality_score`:
```json
{
  "tool": "memory_search",
  "arguments": {
    "query": "your query",
    "min_quality_score": 0.5
  }
}
```

---

#### `memory_save` Rejected by Quality Gate

**Symptom**: Save returns an error like `PREFLIGHT_FAILED: ...`, `INSUFFICIENT_CONTEXT_ABORT`, or `Template contract validation failed: ...`.

**Cause**: The memory file failed one of the save-time gates. Common causes:
- too little durable evidence (`INSUFFICIENT_CONTEXT_ABORT`)
- malformed rendered structure (missing required anchors/ids, raw Mustache leakage, duplicate separators)
- low content quality or semantic duplication at the pre-storage quality gate

**Solution**: Check what the dry run says about the file:
```json
{
  "tool": "memory_save",
  "arguments": {
    "filePath": "/path/to/file.md",
    "dryRun": true
  }
}
```

If dry-run shows `INSUFFICIENT_CONTEXT_ABORT`, add real file/tool/decision evidence instead of forcing the save. If it shows a template-contract failure, fix the rendered markdown shape first. Only use threshold changes for legitimate quality-gate tuning, not to bypass insufficiency or malformed structure.

---

#### Embeddings Fail or Return Zeros

**Symptom**: Saved memories have zero vector scores. Search returns no semantic matches.

**Cause**: Embedding provider API key is missing or invalid, or the `EMBEDDING_PROVIDER` variable is set to a provider without a configured key.

**Solution**:
```bash
# Verify environment
echo $EMBEDDING_PROVIDER
echo $VOYAGE_API_KEY

# Test the embedding provider directly
node dist/context-server.js --test-embedding "hello world"
```

Switch to local HuggingFace if no API key is available:
```bash
EMBEDDING_PROVIDER=huggingface
```

---

#### Memory Count Discrepancy After Bulk Operations

**Symptom**: `memory_stats` shows fewer memories than expected after a bulk delete.

**Cause**: Auto-checkpoint was skipped or failed before the delete operation.

**Solution**: Check available checkpoints:
```json
{
  "tool": "checkpoint_list",
  "arguments": {}
}
```

If a checkpoint exists before the deletion, restore it:
```json
{
  "tool": "checkpoint_restore",
  "arguments": { "name": "the-checkpoint-name" }
}
```

---

#### Server Fails to Start

**Symptom**: `node dist/context-server.js` exits immediately with a module error or `DB_PATH` error.

**Cause**: Build not run, or database path is invalid.

**Solution**:
```bash
# Rebuild from source
cd .opencode/skill/system-spec-kit/mcp_server
npm run build

# Check DB path resolves
node -e "require('./dist/context-server.js')" 2>&1 | head -20
```

---

### Quick Fixes

| Problem | Fix |
|---------|-----|
| All search returning empty | Run `memory_index_scan` to re-index |
| Tools not appearing in MCP client | Restart the MCP client after config changes |
| BM25 index out of date | Set `ENABLE_BM25=false` to fall back to FTS5 |
| Slow responses on large index | Set `ENABLE_TOOL_CACHE=true` and check `SESSION_CACHE_TTL` |
| Embedding API rate limit | Add retry delay with `SPECKIT_EMBEDDING_RETRY_DELAY_MS=1000` |
| Shared memory not working | Call `shared_memory_enable` first, then `shared_space_upsert` with an actor identity |

### Diagnostic Commands

```bash
# Run full test suite
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run

# Check database tables directly
sqlite3 mcp_server/database/spec-kit.db ".tables"

# Count indexed memories
sqlite3 mcp_server/database/spec-kit.db "SELECT COUNT(*) FROM memory_index;"

# Check for divergent aliases
```

```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "divergent_aliases", "limit": 20 }
}
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 9. FAQ

### General Questions

**Q: Do I need an API key to use this?**

A: No. The server runs with HuggingFace local embeddings out of the box. Set `EMBEDDING_PROVIDER=huggingface` and no API key is required. Voyage AI (`VOYAGE_API_KEY`) gives better retrieval quality but is optional.

---

**Q: What happens to my memories when I switch AI models or tools?**

A: Nothing changes. Memories live in the local SQLite database, not in any AI's context. When you connect a different model to the same MCP server, it reads from the same database. The `sessionId` parameter controls what gets deduplicated within a session, not what persists.

---

**Q: How is this different from plain RAG with a vector database?**

A: Three main differences. First, this system uses 5 search channels fused with RRF, not just vector similarity. Second, it applies FSRS decay so recently accessed memories rank higher without any manual curation. Third, the causal graph lets you answer "why was this decision made?" which no vector database supports natively.

---

**Q: What is the `constitutional` tier and why does it always appear at the top?**

A: Constitutional memories are rules that never change: coding standards, architectural constraints, project non-negotiables. They get importance weight `1.0` and are injected into every retrieval result regardless of semantic score. Store things like "always use TypeScript strict mode" or "never commit secrets" at the constitutional tier.

---

**Q: How much disk space does the database use?**

A: A typical project with a few hundred memory files uses 10-50 MB. The `vec_memories` table (1024-dimension float32 vectors) is the largest contributor. You can estimate with `memory_stats` and the `includeScores: true` flag.

---

### Technical Questions

**Q: Can multiple AI agents share the same memory space?**

A: Yes, through the shared memory subsystem. Call `shared_memory_enable`, create a space with `shared_space_upsert`, and grant access with `shared_space_membership_set`. Spaces are deny-by-default, the first creator becomes `owner`, and later admin mutations require an owner identity on the request.

---

**Q: What does "FSRS decay" mean in practice?**

A: FSRS (Free Spaced Repetition Scheduler) is a memory model validated on 100M+ Anki flashcard users. The formula `R(t, S) = (1 + (19/81) × t/S)^(-0.5)` calculates a retrievability score where `t` is time since last access and `S` is a stability parameter. A memory you accessed yesterday has `R` near 1.0. A memory you have not accessed in months has `R` near 0. Higher importance tiers get larger `S` multipliers, slowing their decay.

---

**Q: How do I know which tool to call for a given task?**

A: Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channel selection. Use `memory_match_triggers` when processing a raw prompt text at the start of each AI turn. Use the L4-L7 tools only when you need mutation, analysis or maintenance operations.

---

**Q: What is the `dryRun` parameter on `memory_save`?**

A: A dry run validates the file against the quality gate, estimates the token budget, checks for duplicates and returns a preflight report, all without writing anything to the database. Use it to verify a file will pass quality checks before committing, or to see what the duplicate detection threshold would return.

---

**Q: How do I roll back a bad feature flag change?**

A: The rollback runbook at `../references/workflows/rollback_runbook.md` walks through the procedure step by step. The short version: set the flag to `false` or `0` in your environment, restart the server, and the pipeline falls back to the last working configuration. Use `eval_reporting_dashboard` to verify metrics returned to baseline.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 10. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Full installation walkthrough: embedding providers, database setup, MCP client configuration and post-install verification |
| [lib/search/README.md](./lib/search/README.md) | Detailed per-stage module mapping for the 4-stage search pipeline |
| [hooks/README.md](./hooks/README.md) | Lifecycle hook documentation for post-mutation wiring |
| [../README.md](../README.md) | Parent skill README: system-spec-kit overview and workflow |
| [../SKILL.md](../SKILL.md) | AI agent workflow instructions for invoking this skill |
| [../feature_catalog/feature_catalog.md](../feature_catalog/feature_catalog.md) | Complete feature inventory with all 22 categories, code references and implementation details. The authoritative deep-dive for every feature mentioned in this README. |
| [../references/config/environment_variables.md](../references/config/environment_variables.md) | Canonical source of truth for all environment variables with types, defaults and examples |
| [../references/workflows/rollback_runbook.md](../references/workflows/rollback_runbook.md) | Feature flag rollback procedure for reverting pipeline changes |

### External Resources

| Resource | Description |
|----------|-------------|
| [Model Context Protocol Spec](https://modelcontextprotocol.io) | Official MCP specification and client documentation |
| [FSRS Algorithm Paper](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm) | The memory decay formula this server implements |
| [sqlite-vec](https://github.com/asg017/sqlite-vec) | The vector similarity extension used for embedding storage |
| [Reciprocal Rank Fusion](https://dl.acm.org/doi/10.1145/1571941.1572114) | The fusion algorithm used to combine channel results |

<!-- /ANCHOR:related-documents -->

---

*Documentation version: 2.0 | Last updated: 2026-03-25 | Server version: @spec-kit/mcp-server*
