# Deep Technical Analysis: true-mem Source Code

> **Research ID**: 140-R9
> **Status**: Complete
> **Date**: 2026-02-26
> **Source**: https://github.com/rizal72/true-mem (v1.0.14)
> **Evidence Grade**: A (primary source code analysis)

---

## 1. Executive Summary

true-mem is a persistent memory plugin for OpenCode that implements cognitive psychology-based memory management. It is approximately 92KB bundled, written in TypeScript, and uses SQLite for storage with zero native dependencies. The system models human cognition through dual-store memory (STM/LTM), Ebbinghaus forgetting curves, and a 7-feature scoring model. Search uses Jaccard word-overlap similarity rather than vector embeddings -- a deliberate simplicity trade-off that eliminates transformer dependencies entirely.

**Key architectural decisions:**
- Jaccard similarity instead of neural embeddings (zero dependencies, ~O(n) search)
- Dual-scope storage: global (user-level) vs. project-specific memories
- Four-layer false-positive defense system before any memory is stored
- Non-blocking async extraction pipeline via microtask queue
- Role-aware classification requiring human origin for personal memories
- Content-hash deduplication (SHA256, O(1)) with Jaccard-based semantic dedup

---

## 2. Repository Structure

```
true-mem/
  src/
    index.ts                          # Plugin entry, deferred init, hook registration
    config.ts                         # All default constants and thresholds
    types.ts                          # Core type definitions, MemoryUnit, Session, Event
    logger.ts                         # File-based debug logging (~/.true-mem/)
    shutdown.ts                       # Bun-specific graceful shutdown manager
    storage/
      database.ts                     # SQLite schema, CRUD, search, decay, consolidation
      sqlite-adapter.ts              # Runtime adapter: bun:sqlite / node:sqlite
    memory/
      patterns.ts                     # 8 multilingual importance signal categories
      negative-patterns.ts           # False-positive filtering (negation, AI meta-talk)
      role-patterns.ts               # Human vs. assistant message heuristics
      classifier.ts                  # 4-layer storage decision + classification scoring
      embeddings.ts                  # Jaccard similarity (deprecated vector stubs)
      reconsolidate.ts              # Dedup/conflict/complement decision logic
    extraction/
      queue.ts                       # Sequential async job queue (microtask-based)
    adapters/opencode/
      index.ts                       # OpenCode plugin hooks, injection, extraction pipeline
    utils/
      toast.ts                       # TUI notification wrapper
      version.ts                     # Runtime package.json version lookup
```

[SOURCE: https://github.com/rizal72/true-mem/tree/main/src]

---

## 3. Core Memory Data Model and Schema

### 3.1 MemoryUnit Type

The central data structure contains 8 classification types across 2 scope levels:

```
Classifications:
  User-level (global scope):  constraint, preference, learning, procedural
  Project-level (project scope): decision, bugfix, episodic, semantic
```

Each MemoryUnit carries 7 cognitive features:

| Feature       | Type  | Default | Role                                    |
|---------------|-------|---------|----------------------------------------|
| recency       | REAL  | 0       | Hours since last access                 |
| frequency     | INT   | 1       | Access count (log-normalized in scoring)|
| importance    | REAL  | 0.5     | Signal-derived weight                   |
| utility       | REAL  | 0.5     | Usage-derived relevance                 |
| novelty       | REAL  | 0.5     | Information uniqueness                  |
| confidence    | REAL  | 0.5     | Classification certainty                |
| interference  | REAL  | 0       | Negative: competing memory penalty      |

[SOURCE: database.ts - CREATE TABLE memory_units]

### 3.2 SQLite Schema

```sql
CREATE TABLE IF NOT EXISTS memory_units (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  store TEXT NOT NULL,              -- 'stm' or 'ltm'
  classification TEXT NOT NULL,     -- 8 types
  summary TEXT NOT NULL,            -- The actual memory content
  source_event_ids TEXT NOT NULL,   -- Evidence chain
  project_scope TEXT,               -- NULL = global, else project path
  content_hash TEXT,                -- SHA256 for O(1) dedup
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_accessed_at TEXT NOT NULL,
  recency REAL NOT NULL DEFAULT 0,
  frequency INTEGER NOT NULL DEFAULT 1,
  importance REAL NOT NULL DEFAULT 0.5,
  utility REAL NOT NULL DEFAULT 0.5,
  novelty REAL NOT NULL DEFAULT 0.5,
  confidence REAL NOT NULL DEFAULT 0.5,
  interference REAL NOT NULL DEFAULT 0,
  strength REAL NOT NULL DEFAULT 0.5,
  decay_rate REAL NOT NULL,
  tags TEXT,
  associations TEXT,
  status TEXT NOT NULL DEFAULT 'active',  -- active|decayed|pinned|forgotten
  version INTEGER NOT NULL DEFAULT 1,
  embedding BLOB,                   -- Vestigial; unused with Jaccard
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

Additional tables:
- `sessions` - conversation tracking with watermarks
- `events` - raw hook events with tool execution details

[SOURCE: database.ts schema definition]

### 3.3 Memory Lifecycle States

```
active    --> Normal operational state
decayed   --> Strength fell below threshold (0.1)
pinned    --> Exempt from decay (manual override)
forgotten --> Explicitly removed
```

---

## 4. Memory Consolidation and Deduplication Logic

### 4.1 Three-Phase Deduplication Pipeline

The `createMemory()` function implements a multi-phase dedup strategy:

**Phase 0: Exact Duplicate Detection (O(1))**
```typescript
// SHA256 content hash for instant duplicate detection
function generateContentHash(text: string): string {
  const normalized = text.toLowerCase().trim();
  return createHash('sha256').update(normalized).digest('hex');
}
```
If the hash matches an existing memory, the operation is rejected immediately. This is the cheapest check and runs first.

**Phase 1: Semantic Similarity Search**
Uses Jaccard word-overlap against all active memories in the same project scope (up to 1000 candidates). This is a full table scan with in-memory similarity computation.

**Phase 2: Reconsolidation Decision**
Based on similarity score, three outcomes are possible:

```
Similarity >= 0.85  --> DUPLICATE: increment frequency, update timestamp
Similarity 0.7-0.85 --> CONFLICT: "newer wins" - replace existing memory
Similarity < 0.7    --> COMPLEMENT: store as new memory
```

If classifications differ between candidate and existing memory, always treated as COMPLEMENT regardless of similarity score.

[SOURCE: reconsolidate.ts - SIMILARITY_THRESHOLDS, handleReconsolidation()]

### 4.2 Reconsolidation Implementation

```typescript
const SIMILARITY_THRESHOLDS = {
  DUPLICATE: 0.85,    // Lowered from 0.95 for Jaccard word-overlap
  CONFLICT: 0.7,      // Lowered from 0.8
  MIN_RELEVANT: 0.5,  // Lowered from 0.7
} as const;

// Decision tree:
// 1. Different classification? --> complement (always new)
// 2. Similarity >= 0.85? --> duplicate (increment frequency)
// 3. Similarity >= 0.70? --> conflict (replace existing)
// 4. Otherwise --> complement (store new)
```

The thresholds were explicitly lowered from their original values to accommodate Jaccard's coarser similarity compared to cosine similarity on embeddings. This is documented in the source as intentional calibration.

### 4.3 STM-to-LTM Promotion (Consolidation)

```typescript
runConsolidation(): number {
  // Fetch all active STM memories
  // Promote if ANY condition met:
  //   strength >= 0.7 (stmToLtmStrengthThreshold)
  //   frequency >= 3 (stmToLtmFrequencyThreshold)
  //   classification in ['bugfix', 'learning', 'decision'] (autoPromoteToLtm)

  // On promotion: store = 'ltm', decay_rate = 0.01 (down from 0.05)
}
```

Key insight: `bugfix`, `learning`, and `decision` memories are ALWAYS auto-promoted to LTM regardless of strength or frequency. This is a hard-coded policy reflecting that these memory types have long-term architectural value.

[SOURCE: config.ts - autoPromoteToLtm, database.ts - runConsolidation()]

---

## 5. Importance/Relevance Scoring Algorithms

### 5.1 Seven-Feature Strength Calculation

```typescript
calculateStrength(features): number {
  // Weights from config:
  // recency: 0.20, frequency: 0.15, importance: 0.25,
  // utility: 0.20, novelty: 0.10, confidence: 0.10,
  // interference: -0.10

  // Normalization:
  const normalizedFrequency = Math.min(1, Math.log(freq + 1) / Math.log(10));
  const recencyFactor = 1 - Math.min(1, recencyHours / 168);  // 168h = 7 days

  const strength =
    0.20 * recencyFactor +         // Decays linearly over 7 days
    0.15 * normalizedFrequency +   // Log-normalized access count
    0.25 * importance +             // Signal-derived (highest weight)
    0.20 * utility +                // Usage-derived
    0.10 * novelty +                // Uniqueness
    0.10 * confidence +             // Classification certainty
    -0.10 * interference;           // Competing memory penalty

  return Math.max(0, Math.min(1, strength));  // Clamped [0, 1]
}
```

**Notable design choices:**
- `importance` has the highest weight (0.25) -- signal quality matters most
- `interference` is the only negative factor -- active penalty for conflicting memories
- `frequency` uses logarithmic normalization to prevent runaway scores
- `recency` uses a linear 7-day window (168 hours), not exponential

[SOURCE: database.ts - calculateStrength(), config.ts - scoringWeights]

### 5.2 Signal Detection (Importance Derivation)

The patterns.ts module defines 8 signal categories with weighted scores:

| Signal Type       | Weight | Example Triggers                           |
|-------------------|--------|--------------------------------------------|
| EXPLICIT_REMEMBER | 0.9    | "remember this", "keep in mind"            |
| EMPHASIS_CUE      | 0.8    | "critical", "essential", "important"       |
| BUG_FIX           | 0.8    | "bug", "fix", "crash", "exception"         |
| LEARNING          | 0.8    | "learned", "realized", "figured out"       |
| CORRECTION        | 0.7    | "actually", "wait", "I was wrong"          |
| DECISION          | 0.7    | "decided", "chose", "went with"            |
| CONSTRAINT        | 0.7    | "can't", "forbidden", "must never"         |
| PREFERENCE        | 0.6    | "prefer", "like", "want"                   |

Each signal contributes to the `importance` feature of a MemoryUnit.

[SOURCE: patterns.ts - IMPORTANCE_PATTERNS]

### 5.3 Classification Scoring

The classifier uses a sentence-level keyword scoring formula:

```typescript
// For each sentence:
sentenceScore = 0.3 + primaryScore + boosterScore
  where:
    primaryScore = min(0.5, primaryMatches * 0.2)   // max 2-3 primaries needed
    boosterScore = min(0.3, boosterMatches * 0.15)  // max 2 boosters needed
    sentenceScore capped at 1.0

// Final confidence:
finalScore = (baseSignalScore + keywordScore) / 2
// Must exceed 0.6 threshold to store
```

The baseline of 0.3 means a single primary keyword match yields 0.5 (0.3 + 0.2), and with a booster it reaches 0.65. This calibration ensures:
- Single keyword alone: 0.4 (below threshold -- not stored)
- Two signals needed minimum: primary + booster OR 2+ primaries

[SOURCE: classifier.ts - calculateClassificationScore()]

---

## 6. Search and Retrieval Mechanisms

### 6.1 Jaccard Word-Overlap Similarity

The ENTIRE search system is based on Jaccard similarity -- no neural embeddings:

```typescript
jaccardSimilarity(text1: string, text2: string): number {
  const tokenize = (text: string): Set<string> => {
    return new Set(
      text.toLowerCase()
        .replace(/[^\w\s]/g, '')  // Remove punctuation
        .split(/\s+/)
        .filter(w => w.length > 0)
    );
  };

  const set1 = tokenize(text1);
  const set2 = tokenize(text2);
  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}
```

**Characteristics:**
- Token-level (word), not character-level
- No stemming, no stop-word removal, no n-grams
- Case-insensitive, punctuation stripped
- Symmetric: sim(A,B) = sim(B,A)
- Range: [0, 1] where 1 = identical word sets

### 6.2 Vector Search Implementation

Despite the method name `vectorSearch()`, it actually performs a brute-force Jaccard scan:

```typescript
async vectorSearch(queryText, currentProject, limit = 10): Promise<MemoryUnit[]> {
  // 1. Fetch ALL active memories matching project scope (up to 1000)
  // 2. Compute jaccardSimilarity(query, memory.summary) for each
  // 3. Sort by similarity descending
  // 4. Return top N
}
```

The SQL query for candidate retrieval:
```sql
SELECT * FROM memory_units
WHERE status = 'active'
AND (project_scope IS NULL OR project_scope = ?)
LIMIT 1000
```

This means global memories (project_scope IS NULL) are ALWAYS included in search results alongside project-specific ones. The 1000-row limit is a hard cap on search candidates.

[SOURCE: database.ts - vectorSearch(), jaccardSimilarity()]

### 6.3 Deprecated Embedding Pipeline

The embeddings.ts file contains vestigial stubs for a previous transformer-based approach:
- `embed()` returns empty Float32Array
- `cosineSimilarity()` returns 0
- `getEmbeddingPipeline()` returns null
- `disposeEmbeddings()` is a no-op

All are annotated `@deprecated` pointing to `jaccardSimilarity`.

[SOURCE: embeddings.ts]

### 6.4 Performance Implications

| Aspect | Jaccard Approach | Embedding Approach |
|--------|-----------------|-------------------|
| Dependencies | Zero | Transformer model (~100MB+) |
| Startup time | Instant | Model loading (seconds) |
| Search complexity | O(n) per query | O(n) or O(log n) with index |
| Semantic quality | Word overlap only | Deep semantic understanding |
| Memory footprint | Negligible | Model in RAM |
| Accuracy on synonyms | Poor | Good |
| Accuracy on paraphrase | Poor | Good |

The trade-off is explicit: true-mem prioritizes zero-dependency operation and startup speed over semantic search quality. For coding context where technical terms are specific and repeated, Jaccard may perform adequately since the same keywords tend to recur.

---

## 7. Memory Lifecycle Management

### 7.1 Creation Flow

```
User/Assistant message
  --> Pattern matching (8 signal categories)
  --> Role-aware classification (human vs. assistant)
  --> Four-layer validation:
      Layer 1: Question detection (filter interrogatives)
      Layer 2: Negative pattern matching (AI meta-talk, negations)
      Layer 3: Multi-keyword classification scoring (>= 0.6 threshold)
      Layer 4: Role validation (constraints/preferences require human origin)
  --> If passes: SHA256 hash check --> Jaccard dedup --> Store to STM/LTM
```

### 7.2 Decay (Ebbinghaus Forgetting Curve)

```typescript
applyDecay(): number {
  // For each active memory (optionally episodic-only):
  //   newStrength = strength * exp(-decay_rate * hours_since_update)
  //   if newStrength < 0.1: status = 'decayed'
  //   else: update strength

  // Decay rates:
  //   STM: 0.05/hour (~14h half-life)
  //   LTM: 0.01/hour (~69h half-life)
}
```

**Decay behavior by classification:**

| Classification | Store | Decays? | Reason |
|---------------|-------|---------|--------|
| constraint    | STM   | No*     | Never-decay policy for episodic-only mode |
| preference    | STM   | No*     | Never-decay policy |
| learning      | LTM   | No*     | Auto-promoted, episodic-only excludes |
| procedural    | STM   | No*     | Never-decay policy |
| decision      | LTM   | No*     | Auto-promoted |
| bugfix        | LTM   | No*     | Auto-promoted |
| episodic      | STM   | YES     | 7-day effective lifetime |
| semantic      | varies | No*    | Explicit intent bypass |

*When `applyDecayOnlyToEpisodic = true` (default), only episodic memories decay. All other classifications are effectively permanent.

[SOURCE: database.ts - applyDecay(), config.ts - applyDecayOnlyToEpisodic]

### 7.3 Consolidation (STM to LTM Promotion)

Three independent promotion triggers (ANY one sufficient):
1. `strength >= 0.7` -- the memory proved durably important
2. `frequency >= 3` -- accessed at least 3 times
3. `classification in ['bugfix', 'learning', 'decision']` -- inherently long-term types

On promotion: decay rate reduces from 0.05 to 0.01 (5x slower decay).

### 7.4 Maintenance Operations

Maintenance runs at session termination (deferred, non-blocking):
- Decay application
- STM-to-LTM consolidation
- No explicit archival or compaction of old memories

---

## 8. Integration Patterns (MCP Tools, API Design)

### 8.1 OpenCode Plugin Hook System

true-mem integrates via 4 hook points:

| Hook | Trigger | Memory Direction | Limit |
|------|---------|-----------------|-------|
| `tool.execute.before` | Before task/background_task tools | Injection (read) | 10 memories |
| `tool.execute.after` | After any tool | Logging (write) | N/A |
| `experimental.chat.system.transform` | System prompt build | Injection (read) | 20 memories |
| `experimental.session.compacting` | Session compaction | Injection (read) | 10 memories |

### 8.2 Memory Injection Strategy

Three injection points with different scopes:

**Atomic injection** (tool.execute.before):
- Triggers for task/background_task tools only
- Retrieves 10 memories via Jaccard search against the tool prompt
- Prepends memories as structured context to tool input

**Global system injection** (chat.system.transform):
- Fires for every system prompt construction
- Retrieves up to 20 memories matching project scope
- Appends memory section to system prompt
- 4000 token budget for injected context

**Compaction injection** (session.compacting):
- Fires during conversation history compression
- Injects relevant memories to preserve context during compaction
- Prevents critical information loss when conversation is truncated

### 8.3 Extraction Pipeline

```
Session idle event
  --> Check extraction interval (2-second minimum)
  --> Check for sub-agent session (skip "-task-" sessions)
  --> Fetch messages beyond watermark
  --> Strip injection markers (remove previously injected memory text)
  --> Parse conversation with role attribution
  --> For each message segment:
      --> Detect importance signals (patterns.ts)
      --> Apply role-aware scoring (10x weight for user messages)
      --> Classify with explicit intent detection
      --> Validate through 4-layer defense
      --> If passes: createMemory() with dedup pipeline
  --> Update watermark (always, even on failure)
```

[SOURCE: adapters/opencode/index.ts - processSessionIdle()]

### 8.4 Safety Mechanisms

| Mechanism | Purpose |
|-----------|---------|
| 2-second extraction interval | Debounce rapid idle events |
| Sub-agent detection | Skip "-task-" session IDs to avoid duplicate extraction |
| Injection marker filtering | Remove previously injected memory text before re-extraction |
| Watermark management | Track processed message count per session |
| Tool output markers | Prevent re-processing system artifacts |
| Content hash (SHA256) | O(1) exact duplicate prevention |

---

## 9. Novel Approaches to Memory Management

### 9.1 Cognitive Psychology Foundation

The most distinctive aspect of true-mem is its grounding in cognitive psychology:

**Ebbinghaus Forgetting Curve**: Exponential decay on memory strength models natural forgetting. Only episodic memories decay, matching the psychological observation that procedural knowledge and personal preferences are resistant to forgetting.

**Dual-Store Model**: STM/LTM distinction with promotion criteria mirrors the Atkinson-Shiffrin model. Promotion requires either repeated access (frequency >= 3), demonstrated importance (strength >= 0.7), or categorical significance (auto-promote list).

**Seven-Feature Scoring**: The multi-dimensional strength model goes beyond simple recency or frequency. The inclusion of `interference` as a negative factor is notably absent from most memory systems. Interference models the psychological phenomenon where similar competing memories degrade each other's accessibility.

### 9.2 Role-Aware Classification

The system distinguishes between human intent and assistant acknowledgment, preventing the assistant's reformulations from being stored as the user's memories:

```
User: "I prefer functional programming"
  --> Stores as: preference (user role, global scope)

Assistant: "Understood, you prefer functional programming"
  --> BLOCKED: assistant role cannot create preference memories
  --> Filtered by shouldStoreMemoryWithRole()
```

The 10x human message weight multiplier further amplifies user-originated content during scoring.

[SOURCE: role-patterns.ts, classifier.ts - shouldStoreMemoryWithRole()]

### 9.3 Four-Layer False-Positive Defense

This is the most sophisticated anti-noise system observed in a memory plugin:

```
Layer 1: Question Detection
  "How do I fix this?" --> REJECTED (interrogative, not a statement)

Layer 2: Negative Pattern Matching (~50 regex patterns)
  "I don't understand X" --> REJECTED (negation)
  "Summary: The user prefers..." --> REJECTED (AI meta-talk)

Layer 3: Multi-Keyword Validation
  Requires 2+ signals from primary + booster keywords
  Single keyword = 0.4 confidence = below 0.6 threshold

Layer 4: Role Validation
  Preferences/constraints MUST come from user role
  Assistant acknowledgments are explicitly filtered
```

[SOURCE: classifier.ts, negative-patterns.ts]

### 9.4 Non-Blocking Extraction Queue

The ExtractionQueue uses `queueMicrotask()` instead of `setTimeout()`, keeping execution within the current event loop phase while remaining non-blocking. Jobs execute sequentially with continue-on-error semantics -- a failed extraction does not block subsequent ones.

[SOURCE: extraction/queue.ts]

---

## 10. Error Handling and Edge Cases

### 10.1 Database Operations

- All memory writes use transaction wrappers with rollback on failure
- WAL mode with fallback to DELETE journal mode for SQLite compatibility
- Schema versioning with migration support prevents data loss on upgrades

### 10.2 Runtime Adapter

- Auto-detection of Bun vs. Node.js runtime
- Normalized API surface across both SQLite drivers
- Async function signatures maintained even for synchronous Node.js API (uniform interface)

### 10.3 Extraction Safety

- Watermark ALWAYS updates after processing, even on failure (prevents infinite reprocessing loops)
- Sub-agent sessions (containing "-task-" in ID) are skipped entirely
- Injection markers are stripped before re-extraction to prevent memory-of-memory loops
- 2-second minimum interval prevents rapid-fire extraction on idle events

### 10.4 Logger Resilience

- File-based logging to ~/.true-mem/plugin-debug.log
- 10MB rotation with .log.1 backup
- All logging errors silently caught -- logger never crashes the host

### 10.5 Shutdown Safety

- Singleton ShutdownManager with LIFO handler execution
- Handlers run synchronously (async promises intentionally ignored)
- Bun-specific: avoids custom signal handlers that cause C++ exceptions
- Guard prevents handler registration during active shutdown

[SOURCE: shutdown.ts, logger.ts, database.ts]

---

## 11. Performance Considerations

### 11.1 Search Scalability

| Memory Count | Search Behavior | Concern |
|-------------|----------------|----------|
| <100 | Fast (sub-ms) | No issues |
| 100-1000 | Acceptable | Full scan with Jaccard |
| >1000 | HARD CAPPED | LIMIT 1000 in SQL prevents runaway |

The 1000-row hard cap in vectorSearch() is both a safety valve and a scaling limitation. Beyond 1000 active memories, some will simply never appear in search results.

### 11.2 Deduplication Cost

- Phase 0 (hash check): O(1) -- negligible
- Phase 1 (Jaccard scan): O(n) where n = active memories in scope
- Each Jaccard comparison: O(w1 + w2) where w = word count
- Total per-creation: O(n * w_avg) -- linear in memory count

### 11.3 Injection Token Budget

- System prompt injection: 4000 tokens max
- Per-tool injection: 10 memories
- Compaction injection: 10 memories
- These budgets prevent context window pollution

### 11.4 Memory Storage

- SQLite with WAL mode for concurrent read performance
- Text-based storage (no BLOB embeddings used despite column existing)
- Content hashing adds ~negligible overhead per write

---

## 12. Graph/Relationship Tracking

true-mem does NOT implement explicit graph or relationship tracking between memories. The `associations` column exists in the schema (TEXT type) but is not actively populated by any code path observed. The `tags` column is similarly defined but underutilized.

The only implicit relationship mechanism is the reconsolidation system, which detects when new memories relate to existing ones (via Jaccard similarity) and handles them as duplicates, conflicts, or complements. This is a pairwise relationship, not a graph.

**Absent features compared to graph-based memory systems:**
- No causal edges between memories
- No memory clustering or topic grouping
- No dependency chains or derivation tracking
- No explicit "supersedes" or "contradicts" relationships
- No traversal or pathfinding operations

[SOURCE: database.ts schema, reconsolidate.ts]

---

## 13. Comparative Analysis: true-mem vs. Spec Kit Memory

| Feature | true-mem | Spec Kit Memory |
|---------|----------|-----------------|
| **Search** | Jaccard word-overlap (O(n)) | Vector embeddings (semantic) |
| **Storage** | SQLite (single file) | SQLite with vector index |
| **Dedup** | SHA256 hash + Jaccard thresholds | Content hash + embedding similarity |
| **Scoring** | 7-feature weighted formula | Multi-factor with temporal decay |
| **Decay** | Ebbinghaus exponential (episodic only) | Temporal decay with state tiers |
| **Classification** | 8 types with role validation | Importance tiers + context types |
| **Relationships** | None (pairwise reconsolidation only) | Causal graph with 6 relation types |
| **Scope** | Global vs. project | Spec folder hierarchy |
| **Integration** | OpenCode plugin hooks | MCP tool protocol |
| **Dependencies** | Zero native deps | Embedding model required |
| **False positive defense** | 4-layer (question, negative, keyword, role) | Trigger phrases + validation |
| **Memory promotion** | STM-to-LTM (strength/frequency/auto) | State tiers (HOT/WARM/COLD/DORMANT) |

---

## 14. Key Takeaways and Recommendations

### 14.1 Patterns Worth Adopting

| Pattern | Description | Confidence |
|---------|-------------|------------|
| Role-aware classification | Prevent assistant reformulations from polluting user memories | High |
| Four-layer false-positive defense | Question detection + negative patterns + multi-keyword + role validation | High |
| Content hash fast-path | SHA256 O(1) check before expensive similarity search | High |
| Interference scoring | Negative weight for competing/conflicting memories | Medium |
| Episodic-only decay | Only temporal memories fade; preferences/decisions persist | Medium |
| Non-blocking extraction | Microtask queue prevents UI blocking during memory processing | Medium |

### 14.2 Patterns to Avoid or Improve Upon

| Pattern | Concern | Confidence |
|---------|---------|------------|
| Jaccard-only search | No synonym handling, no semantic understanding of paraphrases | High |
| 1000-row hard cap | Arbitrary limit; memories beyond this are invisible to search | High |
| No relationship graph | Memories are isolated; no causal chains or contradiction tracking | High |
| "Newer wins" conflict resolution | Naive; older memory may be more accurate in some cases | Medium |
| Vestigial embedding column | Dead code in schema; should be removed or activated | Low |

### 14.3 Novel Ideas for Potential Integration

1. **Interference scoring**: Adding a negative-weight feature to penalize competing memories is psychologically grounded and computationally cheap. Could be added to Spec Kit Memory's scoring pipeline.

2. **Role-aware extraction**: The human/assistant distinction prevents a class of false positives that pure content analysis misses. Relevant if Spec Kit Memory ever processes conversation history directly.

3. **Classification-based decay policies**: The insight that some memory types should NEVER decay (decisions, constraints) while others should (episodic events) is more nuanced than uniform decay.

4. **Dual-scope injection**: Injecting memories at multiple points (system prompt, tool calls, compaction) provides defense-in-depth for context preservation.

---

## 15. Acknowledgements

- **Repository**: https://github.com/rizal72/true-mem
- **Author**: rizal72
- **License**: MIT
- **Version analyzed**: 1.0.14
- **Analysis method**: Direct source code review via GitHub raw file access
- **All citations**: Grade A (primary source code)

---

## 16. Appendix: Complete Configuration Defaults

```typescript
// Scoring weights (must sum to ~1.0 with interference offset)
recency: 0.20
frequency: 0.15
importance: 0.25
utility: 0.20
novelty: 0.10
confidence: 0.10
interference: -0.10

// Decay rates (per hour)
stmDecayRate: 0.05     // ~14h half-life
ltmDecayRate: 0.01     // ~69h half-life
decayThreshold: 0.1    // Below this = status 'decayed'
applyDecayOnlyToEpisodic: true

// Consolidation
stmToLtmStrengthThreshold: 0.7
stmToLtmFrequencyThreshold: 3
autoPromoteToLtm: ['bugfix', 'learning', 'decision']

// Retrieval
defaultRetrievalLimit: 20
maxContextTokens: 4000
maxMemoriesPerStop: 7
deduplicationThreshold: 0.7

// Reconsolidation thresholds
DUPLICATE: 0.85
CONFLICT: 0.70
MIN_RELEVANT: 0.50

// Classifier
CONFIDENCE_THRESHOLD: 0.6
HUMAN_MESSAGE_WEIGHT_MULTIPLIER: 10

// OpenCode adapter
maxCompactionMemories: 10
maxSessionStartMemories: 10
messageWindowSize: 3
messageImportanceThreshold: 0.5

// Sweep
structuralWeight: 1.0
signalThreshold: 0.3
regexConfidence: 0.75
structuralConfidence: 0.5
```

[SOURCE: config.ts - DEFAULT_CONFIG]
