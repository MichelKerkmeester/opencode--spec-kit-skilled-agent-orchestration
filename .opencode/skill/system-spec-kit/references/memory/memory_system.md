---
title: Memory System Reference
description: Detailed documentation for Spec Kit Memory MCP tools, behavior notes, and configuration
---

# Memory System Reference - MCP Tools & Behavior

Spec Kit Memory MCP tools, behavior notes, and configuration options.

Current baseline: schema v23 (`document_type`, `spec_level`), 3 indexed content sources, 7 intent types, and `includeSpecDocs: true` by default.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The Spec Kit Memory system provides context preservation across sessions through vector-based semantic search and structured memory files. This reference covers MCP tool behavior, importance tiers, decay scoring, and configuration.

### Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| MCP Server | `mcp_server/context-server.ts` | Spec Kit Memory MCP with vector search |
| Database | `mcp_server/dist/database/context-index.sqlite` | SQLite with FTS5 + vector embeddings (canonical runtime path; `mcp_server/database/context-index.sqlite` is a compatibility symlink) |
| Constitutional | `constitutional/` | Always-surface rules (Gate 3 enforcement) |
| Scripts | `scripts/memory/generate-context.ts` | Memory file generation with ANCHOR format |

### Core Capabilities

- **Semantic search** - Find memories by meaning, not just keywords
- **Importance tiers** - Six-level system for prioritizing context
- **Decay scoring** - Recent memories rank higher than old ones
- **Checkpoints** - Save/restore memory state snapshots
- **Constitutional tier** - Critical rules that always surface

### Indexable Content Sources

The memory system indexes content from three distinct sources:

| Source | Location Pattern | Memory Type | Default Tier | Discovery |
|--------|-----------------|-------------|--------------|-----------|
| **Memory Files** | `specs/*/memory/*.{md,txt}` | Varies (episodic, procedural, etc.) | `normal` | `findMemoryFiles()` |
| **Constitutional Rules** | `.opencode/skill/*/constitutional/*.md` | `meta-cognitive` | `constitutional` | `findConstitutionalFiles()` |
| **Spec Documents** | `specs/**/*.md` and `.opencode/specs/**/*.md` | Per-type (spec, plan, tasks, etc.) | `normal` | `findSpecDocuments()` |

**Content Source Behavior:**

- **Memory Files** — Session-specific context generated via `generate-context.js`. Subject to temporal decay.
- **Constitutional Rules** — Always-surface critical rules. Injected at top of every search result. No decay.
- **Spec Documents** — Discovered via `findSpecDocuments()` which walks both `specs/` and `.opencode/specs/`. Indexes spec folder documentation (specs, plans, tasks, checklists, decision records, implementation summaries, research, handovers) with per-type scoring multipliers. Controlled by `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. Causal chains are created via `createSpecDocumentChain()` linking spec->plan->tasks->implementation_summary.

**Spec Document Indexing Pipeline:**
1. `findSpecDocuments()` walks both supported specs roots and discovers supported doc filenames
2. `isMemoryFile()` validates each document as an indexable file
3. `extractDocumentType()` infers `document_type` (spec/plan/tasks/etc.) for scoring
4. Documents are indexed alongside memory and constitutional files
5. `createSpecDocumentChain()` links lifecycle docs for causal traversal

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:importance-tiers -->
## 2. IMPORTANCE TIERS

Six-tier system for prioritizing memory relevance:

| Tier | Weight | searchBoost | Purpose | Auto-Surface |
|------|--------|-------------|---------|--------------|
| **Constitutional** | 1.0 | 3.0 | Critical rules that ALWAYS apply | Yes (top of every search) |
| **Critical** | 1.0 | 2.0 | High-importance context | Yes (high relevance) |
| **Important** | 0.8 | 1.5 | Significant decisions/context | Relevance-based |
| **Normal** | 0.5 | 1.0 | Standard session context | Relevance-based |
| **Temporary** | 0.3 | 0.5 | Short-term notes | Relevance-based |
| **Deprecated** | 0.1 | 0.0 | Outdated (kept for history) | Never (excluded from search) |

**searchBoost Multipliers:** Applied to search scores to prioritize higher tiers:
- Constitutional memories get 3x boost in search ranking
- Critical memories get 2x boost
- Important memories get 1.5x boost
- Normal memories have no boost (1.0x)
- Temporary and Deprecated get reduced visibility (0.5x and 0x respectively)

### Constitutional Tier Behavior

- Stored in `constitutional/` folder
- Auto-indexed on MCP server startup
- **ALWAYS** surface at top of search results, regardless of query
- Used for gate enforcement (e.g., "always ask spec folder question")
- EXEMPT from decay scoring (always max relevance)

---

<!-- /ANCHOR:importance-tiers -->
<!-- ANCHOR:mcp-tools -->
## 3. MCP TOOLS

> **Note:** MCP tool names use plain names such as `memory_search`, `memory_save`, and `shared_memory_enable`.

### Tool Reference (43 tools)

| Layer | Tool | Purpose | Example Use |
|-------|------|---------|-------------|
| L1: Orchestration | `memory_context()` | Unified entry point with intent-aware routing (7 intents) | START HERE for most memory operations |
| L1: Orchestration | `session_resume()` | Resume memory, code graph, and CocoIndex state in one call | Detailed recovery payload after reconnect, or when you want direct merged resume state |
| L1: Orchestration | `session_bootstrap()` | Composite bootstrap combining resume and health checks | Canonical first tool call in a fresh OpenCode-style session or after `/clear` |
| L2: Core | `memory_search()` | Semantic search with vector similarity | Find prior decisions on auth |
| L2: Core | `memory_quick_search()` | Simplified search wrapper for fast lookups | Quick keyword-based retrieval |
| L2: Core | `memory_match_triggers()` | Fast keyword matching (<50ms) with cognitive features | Gate enforcement |
| L2: Core | `memory_save()` | Index a memory file. Re-generates embedding when **content hash** changes. Title-only changes do not trigger re-embedding. | After generate-context.js |
| L3: Discovery | `memory_list()` | Browse stored memories with pagination (parent rows by default) | Review session history |
| L3: Discovery | `memory_stats()` | Get memory system statistics with composite scoring | Check index health |
| L3: Discovery | `memory_health()` | Check health status of memory system | Diagnose issues |
| L3: Discovery | `session_health()` | Report session readiness, graph freshness, and priming status | Detect stale session context before continuing |
| L4: Mutation | `memory_delete()` | Delete memory by ID or bulk delete by spec folder | Remove outdated memories |
| L4: Mutation | `memory_update()` | Update memory metadata (title, tier, triggers) | Correct memory properties |
| L4: Mutation | `memory_validate()` | Mark memory as useful/not useful | Confidence scoring |
| L4: Mutation | `memory_bulk_delete()` | Bulk delete memories by spec folder with confirmation | Clean up entire spec folder memories |
| L5: Lifecycle | `checkpoint_create()` | Save named state snapshot | Before risky changes |
| L5: Lifecycle | `checkpoint_list()` | List available checkpoints | Find restore points |
| L5: Lifecycle | `checkpoint_restore()` | Restore from checkpoint | Rollback if needed |
| L5: Lifecycle | `checkpoint_delete()` | Delete a checkpoint | Clean up old snapshots |
| L5: Shared | `shared_space_upsert()` | Create or update a shared memory space | Set up team shared memory |
| L5: Shared | `shared_space_membership_set()` | Add or remove members from shared space | Manage space access |
| L5: Shared | `shared_memory_status()` | Get status of shared memory spaces | Check shared memory health |
| L5: Shared | `shared_memory_enable()` | Enable shared memory subsystem globally | Toggle shared memory |
| L6: Analysis | `task_preflight()` | Capture epistemic baseline before task execution | Start of implementation work |
| L6: Analysis | `task_postflight()` | Capture epistemic state after task, calculate Learning Index | After completing implementation |
| L6: Analysis | `memory_drift_why()` | Trace causal chain for a memory ("why was this decided?") | Understand decision lineage |
| L6: Analysis | `memory_causal_link()` | Create causal relationship between two memories | Link decision to its cause |
| L6: Analysis | `memory_causal_stats()` | Get statistics about the causal memory graph | Check causal coverage |
| L6: Analysis | `memory_causal_unlink()` | Remove a causal relationship by edge ID | Clean up incorrect links |
| L6: Analysis | `eval_run_ablation()` | Run ablation study on memory scoring components | Compare scoring strategies |
| L6: Analysis | `eval_reporting_dashboard()` | Generate evaluation and reporting dashboard data | Review system metrics |
| L6: Analysis | `code_graph_query()` | Query structural relationships such as callers, imports, and outlines | Find what calls a symbol or which files import a module |
| L6: Analysis | `code_graph_context()` | Expand CocoIndex or symbol seeds into compact graph neighborhoods | Pull structural context for an LLM prompt |
| L7: Maintenance | `memory_index_scan()` | Bulk scan and index memory files | After creating multiple files |
| L7: Maintenance | `memory_ingest_start()` | Start async bulk memory ingestion | Import large memory sets |
| L7: Maintenance | `memory_ingest_status()` | Check status of running ingestion job | Monitor import progress |
| L7: Maintenance | `memory_ingest_cancel()` | Cancel a running ingestion job | Stop runaway imports |
| L7: Maintenance | `memory_get_learning_history()` | Get learning history (preflight/postflight records) | Analyze learning patterns |
| L7: Maintenance | `code_graph_scan()` | Build or refresh the structural code graph index | Re-index after branch switches or large code changes |
| L7: Maintenance | `code_graph_status()` | Report code graph freshness and node/edge counts | Check whether the structural index is usable |
| L7: Maintenance | `ccc_status()` | Report CocoIndex availability and index health | Confirm semantic code search is ready |
| L7: Maintenance | `ccc_reindex()` | Trigger incremental or full CocoIndex re-indexing | Refresh semantic search after a refactor |
| L7: Maintenance | `ccc_feedback()` | Submit search-quality feedback for CocoIndex results | Record whether semantic hits were helpful |

### memory_index_scan() Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `specFolder` | string | - | Limit scan to specific spec folder |
| `force` | boolean | false | Force re-index all files (ignore content hash) |
| `includeConstitutional` | boolean | true | Scan `.opencode/skill/*/constitutional/` directories |
| `includeSpecDocs` | boolean | true | Scan for spec folder documents in `.opencode/specs/`. When true, discovers and indexes specs, plans, tasks, decision records, etc. with document-type scoring multipliers (11 types). Also controllable via `SPECKIT_INDEX_SPEC_DOCS` env var. |
| `incremental` | boolean | true | Skip files whose mtime and content hash are unchanged since last index |

---

<!-- /ANCHOR:mcp-tools -->
<!-- ANCHOR:memory-search-behavior -->
## 4. MEMORY_SEARCH() BEHAVIOR

### Parameter Requirements

> **IMPORTANT:** You MUST provide either `query` OR `concepts` parameter. Calling `memory_search({ specFolder: "..." })` without a search parameter will cause an E040 error.

**Required Parameters (one of):**
- `query`: Natural language search query (string)
- `concepts`: Multiple concepts for AND search (array of 2-5 strings)

**Optional Parameters:**
- `specFolder`: Limit search to specific spec folder
- `tenantId` (string, optional): Tenant boundary for governed retrieval
- `userId` (string, optional): User boundary for governed retrieval
- `agentId` (string, optional): Agent boundary for governed retrieval
- `sharedSpaceId` (string, optional): Shared-space boundary for governed retrieval
- `includeContent`: Include full file content in results
- `includeConstitutional`: Include constitutional tier memories
- `anchors`: Array of anchor IDs for targeted section retrieval (token-efficient)
- `tier`: Filter by importance tier
- `limit`: Maximum results to return
- `useDecay`: Apply temporal decay scoring

When operating in shared or multi-actor deployments, always provide scope parameters to prevent cross-scope data exposure.

### Parameter Reference

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | One of query/concepts | - | Natural language search query |
| `concepts` | string[] | One of query/concepts | - | 2-5 concepts for AND search (results must match ALL) |
| `specFolder` | string | No | - | Filter to specific spec folder |
| `tenantId` | string | No | - | Tenant boundary for governed retrieval |
| `userId` | string | No | - | User boundary for governed retrieval |
| `agentId` | string | No | - | Agent boundary for governed retrieval |
| `sharedSpaceId` | string | No | - | Shared-space boundary for governed retrieval |
| `includeConstitutional` | boolean | No | true | Include constitutional memories |
| `includeContent` | boolean | No | false | Embed full file content in results |
| `includeContiguity` | boolean | No | false | Include adjacent memories |
| `anchors` | string[] | No | - | Anchor IDs to extract (e.g., `['summary', 'decisions']`) |
| `tier` | string | No | - | Filter by importance tier |
| `limit` | number | No | 10 | Maximum results to return |
| `useDecay` | boolean | No | true | Apply temporal decay scoring |

### Intent-Aware Retrieval (7 Intents)

The system detects query intent and applies task-specific search weights. Seven intent types are supported:

| Intent | Weight Adjustments |
|--------|-------------------|
| `add_feature` | +procedural, +architectural |
| `fix_bug` | +error logs, +debug, +recent |
| `refactor` | +patterns, +structure |
| `security_audit` | +security, +vulnerabilities |
| `understand` | +semantic, +explanatory |
| `find_spec` | +spec documents, +plans, +decision records |
| `find_decision` | +decision records, +architectural context |

### Constitutional Memory Behavior

> **Important:** Constitutional memories ALWAYS appear at the top of search results, even when a `specFolder` filter is applied. This is BY DESIGN to ensure critical context (e.g., Gate enforcement rules) is never accidentally filtered out.

| Parameter | Behavior |
|-----------|----------|
| `specFolder: "007-auth"` | Filters results to that folder, but constitutional memories still appear first |
| `includeConstitutional: false` | Explicitly excludes constitutional memories from results |
| `includeContent: true` | Embeds full memory file content in results (eliminates separate load calls) |

### Usage Examples

```javascript
// Basic semantic search (query required)
memory_search({ query: "authentication decisions" })

// Folder-scoped with content (query still required)
memory_search({
  query: "OAuth implementation",
  specFolder: "007-auth",
  includeContent: true
})

// Multi-concept AND search (alternative to query)
memory_search({
  concepts: ["authentication", "session management"],
  specFolder: "007-auth"
})

// Exclude constitutional tier
memory_search({
  query: "login flow",
  includeConstitutional: false
})

// WRONG: specFolder alone is NOT sufficient
// memory_search({ specFolder: "007-auth" })  // ERROR: E040
```

### Anchor-Based Retrieval (Token-Efficient)

The `anchors` parameter enables **targeted section retrieval** from memory files, reducing token usage by ~90% when you only need specific sections.

**When to Use Anchors:**
- You need only specific sections (summary, decisions) not full content
- Token efficiency is important (large memory files)
- Loading context for specific purposes (e.g., resume work, review decisions)

**Common Anchor Patterns:**

| Anchor ID | Content | Use Case |
|-----------|---------|----------|
| `summary` | High-level overview | Quick context refresh |
| `decisions` | Key decisions made | Understanding rationale |
| `metadata` | File metadata, dates, status | Filtering and sorting |
| `state` | Project state snapshot | Resume work |
| `context` | Project context | Understand scope |
| `artifacts` | Modified/created files | Track changes |
| `blockers` | Current blockers | Identify issues |
| `next-steps` | Planned actions | Continue work |

**Anchor Usage Examples:**

```javascript
// Get only summary and decisions (minimal tokens)
memory_search({
  query: "auth implementation",
  anchors: ['summary', 'decisions']
})

// Resume work - get state and next steps
memory_search({
  query: "session context",
  specFolder: "007-auth",
  anchors: ['state', 'next-steps', 'blockers']
})

// Review what changed - artifacts only
memory_search({
  query: "recent changes",
  anchors: ['artifacts', 'metadata']
})

// Full content (no anchors - default behavior)
memory_search({
  query: "complete context",
  includeContent: true  // Returns entire file
})
```

**Anchor Format in Memory Files:**

Memory files use HTML comment anchors:
```markdown
Brief summary of the session...

- Decision 1: Chose approach X because...
- Decision 2: Deferred Y until...
```

**Token Savings:**
- Full memory file: ~2000 tokens
- With `anchors: ['summary']`: ~150 tokens (93% savings)
- With `anchors: ['summary', 'decisions']`: ~300 tokens (85% savings)

---

<!-- /ANCHOR:memory-search-behavior -->
<!-- ANCHOR:memory-list-behavior -->
## 5. MEMORY_LIST() BEHAVIOR

### Exact Matching Behavior

> **Important:** The `specFolder` filter uses **EXACT matching**, not prefix or hierarchical matching.

| Query | Matches | Does NOT Match |
|-------|---------|----------------|
| `specFolder: "003-memory"` | `003-memory` only | `003-memory-and-spec-kit`, `003-memory-upgrade` |
| `specFolder: "003-memory-and-spec-kit"` | `003-memory-and-spec-kit` only | `003-memory` |

Use exact folder names when filtering. This is intentional for precise filtering control.

### Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `specFolder` | string | - | Filter by exact spec folder name |
| `limit` | number | 20 | Maximum results (max 100) |
| `offset` | number | 0 | Pagination offset |
| `sortBy` | string | `created_at` DESC | Sort order: created_at, updated_at, importance_weight |
| `includeChunks` | boolean | `false` | Include chunk child rows. Default returns parent memories only for cleaner browsing |

### Parent vs Chunk Rows

- By default, `memory_list()` filters to `parent_id IS NULL`, so dashboards and maintenance flows show one row per memory file.
- Use `includeChunks: true` only when chunk-level diagnostics are needed.

### Spec Folder Filtering

The `specFolder` parameter behavior varies by operation:
- `memory_search`: Exact match (SQL `=` operator)
- `memory_list`: Exact match (SQL `=` operator)
- `findMemoryFiles`: Prefix match (`startsWith`) - matches `007-auth` and `007-auth-v2`

For consistent exact matching, use the full spec folder name.

---

<!-- /ANCHOR:memory-list-behavior -->
<!-- ANCHOR:decay-scoring -->
## 6. DECAY SCORING

> [VERIFIED: matches source code as of 2026-02-08]

The memory system uses two complementary decay models, both **day-based** (calendar time), not turn-based.

### Model A: Tier-Based Exponential Decay

**Source:** `lib/cognitive/attention-decay.ts:96-106`

**Formula:** `score_decayed = score × decayRate^(elapsedDays / 30)`

Where `elapsedDays` = calendar days since the memory's `updated_at` (or `created_at`). The 30-day normalization means the decay rate applies per 30-day period. Scores below `0.001` are clamped to 0.

#### Tier-Specific Decay Rates

| Tier | Decay Rate | Behavior |
|------|------------|----------|
| `constitutional` | 1.0 | Never decays (exempt) |
| `critical` | 1.0 | Never decays (exempt) |
| `important` | 1.0 | Never decays (exempt) |
| `normal` | 0.80 | Standard decay (~20% loss per 30 days) |
| `temporary` | 0.60 | Fast decay (~40% loss per 30 days) |
| `deprecated` | 1.0 | Never decays (but excluded from search results) |

**Protected Tiers:** Constitutional, critical, important, and deprecated tiers have rate = 1.0, so `decayRate^(elapsedDays/30)` = 1.0 always.

#### Decay Examples (Normal Tier, decay_rate = 0.80)

| Days Elapsed | Decay Factor (`0.80^(days/30)`) | Effective Score (base 0.50) |
|--------------|----------------------------------|----------------------------|
| 0 | 1.000 | 0.500 |
| 30 | 0.800 | 0.400 |
| 60 | 0.640 | 0.320 |
| 90 | 0.512 | 0.256 |
| 180 | 0.262 | 0.131 |

### Model B: FSRS Power-Law Retrievability

**Source:** `lib/cognitive/attention-decay.ts:111-118`, `lib/scoring/composite-scoring.ts:123-125,158-181`

Used for composite scoring and the 5-state model (Section 10). Based on the FSRS v4 spaced-repetition formula:

**Formula:** `R = (1 + FSRS_FACTOR × t/S)^(-0.5)`

Where:
- `R` = retrievability (0 to 1)
- `t` = elapsed days since last review
- `S` = stability (learned from review history, default 1.0)
- `FSRS_FACTOR` = `19/81 ≈ 0.235` (in composite-scoring) or `1/19` inline fallback (in attention-decay)
- Power exponent = `-0.5`

The FSRS model produces a power-law curve (slower initial decay, steeper long-term decay) compared to the exponential Model A. It is used by `calculateRetrievabilityScore()` in composite scoring and by the tier classifier for state transitions.

### Disabling Decay

```javascript
memory_search({ 
  query: "historical decisions",
  useDecay: false  // Returns results without temporal weighting
})
```

---

<!-- /ANCHOR:decay-scoring -->
<!-- ANCHOR:real-time-sync -->
## 7. REAL-TIME SYNC

### Current Limitation

> **Note:** By default, memory files are indexed on MCP server startup. Changes made after startup are not automatically detected unless the optional `SPECKIT_FILE_WATCHER` feature is enabled.

### Workarounds

To index new or modified memory files:

1. **Single file:** Use `memory_save` tool to index a specific file
   ```javascript
   memory_save({ filePath: "specs/007-auth/memory/session.md" })
   ```

2. **Batch scan:** Use `memory_index_scan` tool to scan and index all memory files
   ```javascript
   memory_index_scan({ specFolder: "007-auth" })
   ```

3. **Enable watcher:** Set `SPECKIT_FILE_WATCHER=true` to opt into automatic markdown re-indexing after startup
4. **Full restart:** Restart the MCP server (indexes all files on startup)

### Future Enhancement

Real-time file watching is optional rather than always-on. By default, use `memory_save()` or `memory_index_scan()` to index new or modified files. Enable `SPECKIT_FILE_WATCHER=true` when you want automatic markdown re-indexing after startup.

### Rate Limiting

The `memory_index_scan` operation has a 1-minute cooldown between scans to prevent resource exhaustion. If called within the cooldown period, it returns an error with the remaining wait time.

---

<!-- /ANCHOR:real-time-sync -->
<!-- ANCHOR:constitutional-rules -->
## 8. CONSTITUTIONAL RULES

### Purpose

Constitutional rules are critical context that should surface in every relevant interaction. Examples:

- Gate 3 enforcement ("always ask spec folder question")
- Project-specific constraints
- Security policies

### Location

Constitutional files are stored in:
```
.opencode/skill/system-spec-kit/constitutional/
```

### Auto-Surfacing

- Indexed automatically on MCP server startup
- Always appear at TOP of search results
- Matched via trigger phrases for fast keyword matching
- Not affected by decay scoring

### Creating Constitutional Rules

1. Create file in `constitutional/` folder
2. Add YAML frontmatter with triggers:
   ```yaml
   ---
   title: Gate 3 Enforcement
   triggers:
     - "file modification"
     - "gate 3"
     - "spec folder"
   importanceTier: constitutional
   ---
   ```
3. Restart MCP server or use `memory_index_scan()`

---

<!-- /ANCHOR:constitutional-rules -->
<!-- ANCHOR:session-deduplication -->
## 9. SESSION DEDUPLICATION

> [VERIFIED: matches source code as of 2026-02-08]

The memory system uses content hashing and session-aware deduplication to prevent redundant memories and reduce token usage.

### Content Hashing

**Source:** `lib/parsing/memory-parser.ts:347-349`

Each memory file is hashed using SHA-256 of its **raw content** (no normalization):

```typescript
function computeContentHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}
```

This hash is stored as `content_hash` in the database and used by `memory_save()` to detect whether a file has changed — if the hash matches, re-embedding is skipped.

### Session Memory Hashing

**Source:** `lib/session/session-manager.ts:230-249`

For session deduplication, a separate hash identifies individual memories within a session:

```typescript
function generateMemoryHash(memory: MemoryInput): string {
  let hashInput: string;

  if (memory.content_hash) {
    hashInput = memory.content_hash;
  } else if (memory.id !== undefined) {
    hashInput = `${memory.id}:${memory.anchorId || ''}:${memory.file_path || ''}`;
  } else {
    hashInput = JSON.stringify({
      anchor: memory.anchorId,
      path: memory.file_path,
      title: memory.title,
    });
  }

  return crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 16);
}
```

The hash priority: `content_hash` > `id:anchorId:file_path` > JSON of `{anchor, path, title}`. Truncated to 16 hex chars for storage efficiency.

### Deduplication Behavior

| Scenario | Hash Match | Action |
|----------|------------|--------|
| Identical file content | Full SHA-256 match | Skip re-embedding, return existing ID |
| Same memory in same session | 16-char hash match | Skip sending (session dedup) |
| Substantive file changes | No match | Re-index with new embedding |
| Same content, different spec folder | Separate entries | Each folder gets its own index entry |

### Token Savings

Session deduplication (`enableDedup: true` with `sessionId`) provides significant savings on follow-up queries:

| Metric | Without Dedup | With Dedup | Savings |
|--------|---------------|------------|---------|
| Avg memories per spec folder | 12 | 6 | 50% |
| Search result tokens | ~4000 | ~2000 | 50% |
| Index size (100 specs) | 1200 entries | 600 entries | 50% |

**Note:** There is no content normalization (lowercasing, whitespace/date normalization) in the hashing pipeline. Hashes are computed on raw content, so even whitespace-only changes will produce a different hash and trigger re-indexing.

---

<!-- /ANCHOR:session-deduplication -->
<!-- ANCHOR:5-state-memory-model -->
## 10. 5-STATE MEMORY MODEL

> [VERIFIED: matches source code as of 2026-02-08]

Memories are classified into five states based on their **retrievability score** (R), not calendar-day thresholds.

**Source:** `lib/cognitive/tier-classifier.ts:26-33, 211-256, 261-299`

### Retrievability Thresholds

```
┌─────────────────────────────────────────────────────────────────┐
│                 5-STATE MODEL (Retrievability-Based)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  R ≥ 0.80    →  HOT       (high recall probability)            │
│  R ≥ 0.25    →  WARM      (moderate recall)                    │
│  R ≥ 0.05    →  COLD      (low recall)                         │
│  R < 0.05    →  DORMANT   (very low recall)                    │
│  R < 0.02                                                       │
│  AND days > 90 → ARCHIVED (frozen, excluded by default)         │
│                                                                 │
│  Constitutional/Critical tiers → always HOT (R = 1.0)           │
│  Pinned memories (is_pinned=1) → always HOT (R = 1.0)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Thresholds are configurable via environment variables (`HOT_THRESHOLD`, `WARM_THRESHOLD`, `COLD_THRESHOLD`, `ARCHIVED_DAYS_THRESHOLD`) with validation that HOT > WARM > COLD.

### State Classification

The core classifier accepts either a numeric retrievability value or a memory object:

```typescript
// lib/cognitive/tier-classifier.ts — classifyState()
function classifyState(
  retrievabilityOrMemory: number | MemoryRow | Record<string, unknown> | null | undefined,
  elapsedDays?: number,
): TierState {
  // ... resolve r and days from input ...

  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
    return 'ARCHIVED';
  }
  if (r >= TIER_CONFIG.hotThreshold) return 'HOT';   // default 0.80
  if (r >= TIER_CONFIG.warmThreshold) return 'WARM';  // default 0.25
  if (r >= TIER_CONFIG.coldThreshold) return 'COLD';  // default 0.05
  return 'DORMANT';
}
```

The richer `classifyTier()` function wraps this with half-life support, pinned-memory handling, and constitutional/critical exemptions. It computes retrievability using the FSRS formula (see Section 6, Model B) with an effective stability derived from the memory's type-specific half-life.

### State Behaviors

| State | Retrievability | Search Inclusion | Description |
|-------|---------------|------------------|-------------|
| **HOT** | R ≥ 0.80 | Always (max 5) | High recall — recently reviewed or important |
| **WARM** | R ≥ 0.25 | Always (max 10) | Moderate recall — still relevant |
| **COLD** | R ≥ 0.05 | Relevance-based | Low recall — aging out |
| **DORMANT** | R < 0.05 | High relevance only | Very low recall — candidate for archival |
| **ARCHIVED** | R < 0.02 + 90+ days | Explicit only | Frozen — excluded from default searches |

HOT and WARM states have per-query limits (`maxHotMemories: 5`, `maxWarmMemories: 10`) to prevent context flooding.

### Half-Life to Stability Conversion

Each memory type has a configured half-life (in days). This is converted to FSRS stability:

```
S = half_life / ln(2) ≈ half_life / 0.693
```

The effective stability is `max(fsrs_stability, type_stability)`, ensuring new memories benefit from their type's baseline while well-reviewed memories keep earned FSRS stability.

### State Transitions

| Event | Effect |
|-------|--------|
| FSRS review (access) | Increases stability → higher R → may promote state |
| Time passes without access | R decays via FSRS formula → may demote state |
| User validates as useful | Increases confidence score (does not directly change state) |
| Memory marked deprecated | Excluded from search (tier-level exclusion, not state) |
| Constitutional/critical tier | Always classified as HOT regardless of R |
| Pinned (`is_pinned=1`) | Always classified as HOT regardless of R |

---

<!-- /ANCHOR:5-state-memory-model -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Reference Files
- [save_workflow.md](./save_workflow.md) - Memory save workflow documentation
- [embedding_resilience.md](./embedding_resilience.md) - Provider fallback and offline mode
- [troubleshooting.md](../debugging/troubleshooting.md) - Common issues and solutions
- [environment_variables.md](../config/environment_variables.md) - Configuration options

### Scripts
- `scripts/memory/generate-context.ts` - Memory file generation
- `mcp_server/context-server.ts` - MCP server implementation

### Related Skills
- `system-spec-kit` - Parent skill orchestrating spec folder workflow
<!-- /ANCHOR:related-resources -->
