---
description: Retrieve context with intent awareness - combines search + load with task-specific weights
argument-hint: "<query> [--intent:<type>]"
allowed-tools: Read, spec_kit_memory_memory_context, spec_kit_memory_memory_search, spec_kit_memory_memory_match_triggers
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```text
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Present the user with this question:
        question: "What would you like to retrieve context for?"
        options:
          - label: "Add feature"
            description: "Context for implementing a new feature"
          - label: "Fix bug"
            description: "Context for debugging and fixing an issue"
          - label: "Refactor"
            description: "Context for code restructuring"
          - label: "Security audit"
            description: "Context for security review"
          - label: "Understand"
            description: "Context for learning existing code"
          - label: "Find spec"
            description: "Context for spec document retrieval"
          - label: "Find decision"
            description: "Context for decision rationale lookup"
    → WAIT for user response
    → Use their response to determine the intent and query
    → Only THEN continue with this workflow

IF $ARGUMENTS contains a query:
    → Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer query from conversation context
- **DO NOT** assume the user's intent without explicit input
- **DO NOT** proceed past this point without explicit query from user
- The query and intent MUST come from `$ARGUMENTS` or user's answer above

---

# Memory Context Command

Unified entry point for context retrieval with intent awareness. Automatically detects task intent and applies task-specific weights for optimal context relevance.

---

```yaml
role: Intent-Aware Context Retrieval Specialist
purpose: Unified entry point combining search + load with intent-specific optimization
action: Detect intent, apply task-specific weights, return optimized context

operating_mode:
  workflow: intent_aware_retrieval
  workflow_compliance: MANDATORY
  workflow_execution: single_unified_call
  approvals: none_required
  tracking: intent_classification
```

---

## 1. PURPOSE

> **L1 Orchestration Layer**: This command operates at the top layer of the context retrieval architecture. It orchestrates lower-level memory operations (L2: search, load, match) and provides intent-aware optimization. L1 commands combine multiple L2 operations into unified workflows with token budget management.

Provide a unified entry point for context retrieval that:
- Automatically detects task intent from the query
- Applies task-specific weights for search optimization
- Combines search + load in a single operation
- Returns context with relevance explanation
- Enforces L1 token budget constraints (target: ~2000 tokens per call)
- Handles session deduplication for cross-session queries

### Hybrid Retrieval Runtime (Current Behavior)

The unified context tool now runs a hybrid retrieval pipeline:
- Tri-channel retrieval (vector + FTS5/BM25 + graph)
- Intent-adaptive fusion and reranking
- MMR diversity pruning to reduce redundant chunks
- Deep-mode query expansion for broader lexical coverage
- Evidence-gap detection to flag low-confidence retrievals

When evidence quality is low, responses may include an explicit evidence-gap warning so downstream reasoning can remain cautious.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS`: Query with optional intent override
**Outputs:** Context with relevance scores and intent explanation

### Argument Patterns

| Pattern                   | Mode        | Example                                           |
| ------------------------- | ----------- | ------------------------------------------------- |
| `<query>`                 | Auto-detect | `/memory:context "oauth implementation"`          |
| `<query> --intent:<type>` | Explicit    | `/memory:context "auth flow" --intent:understand` |

---

## 3. QUICK REFERENCE

| Command                                       | Result                                 |
| --------------------------------------------- | -------------------------------------- |
| `/memory:context "implement auth"`            | Auto-detect add_feature, apply weights |
| `/memory:context "auth bug" --intent:fix_bug` | Explicit fix_bug intent                |
| `/memory:context "how does auth work?"`       | Auto-detect understand intent          |
| `/memory:context "optimize auth code"`        | Auto-detect refactor intent            |
| `/memory:context "auth security review"`      | Auto-detect security_audit intent      |
| `/memory:context "find the spec for auth"`    | Auto-detect find_spec intent           |
| `/memory:context "why did we choose JWT"`     | Auto-detect find_decision intent       |

---

## 4. INTENT TYPES AND WEIGHTS

### Intent Classification

The system detects one of seven intent types:

| Intent Type        | Description                    | Weight Adjustments                                        |
| ------------------ | ------------------------------ | --------------------------------------------------------- |
| **add_feature**    | Implementing new functionality | implementation: 1.5x, architecture: 1.3x, patterns: 1.2x |
| **fix_bug**        | Debugging and fixing issues    | decisions: 1.4x, implementation: 1.3x, errors: 1.5x      |
| **refactor**       | Code restructuring             | architecture: 1.5x, patterns: 1.4x, decisions: 1.2x      |
| **security_audit** | Security review                | decisions: 1.4x, implementation: 1.3x, security: 1.5x    |
| **understand**     | Learning existing code         | architecture: 1.4x, decisions: 1.3x, overview: 1.5x      |
| **find_spec**      | Spec document retrieval        | spec-doc: 1.5x, architecture: 1.3x, overview: 1.2x       |
| **find_decision**  | Decision rationale lookup      | decisions: 1.5x, rationale: 1.4x, architecture: 1.2x     |

### Detection Logic

Intent is detected via keyword matching against the query. Keywords are phrase-based to avoid false positives:

| Intent           | Keywords                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| `add_feature`    | 'implement', 'add feature', 'add new', 'add a', 'create new', 'build new'    |
| `fix_bug`        | 'bug', 'error', 'fix', 'broken', 'issue', 'debug'                            |
| `refactor`       | 'refactor', 'restructure', 'improve', 'clean up', 'optimize'                 |
| `security_audit` | 'security', 'vulnerability', 'auth', 'sanitize', 'xss', 'csrf'              |
| `understand`     | 'how', 'why', 'what', 'explain', 'understand', 'learn'                       |
| `find_spec`      | 'spec', 'specification', 'spec folder', 'spec document', 'find spec'         |
| `find_decision`  | 'decision', 'rationale', 'why did we', 'chose', 'decision record'            |

**Default fallback:** If no keywords match, defaults to `understand`.

### Anchor Mapping by Intent

| Intent             | Primary Anchors                        | Secondary Anchors              | Why These?                                    |
| ------------------ | -------------------------------------- | ------------------------------ | --------------------------------------------- |
| **add_feature**    | implementation, architecture, patterns | decisions, code-examples       | Need existing patterns + structure            |
| **fix_bug**        | decisions, implementation, errors      | debugging, troubleshooting     | Need decision history + error context         |
| **refactor**       | architecture, patterns, decisions      | technical-specs, code-quality  | Need structure understanding + rationale      |
| **security_audit** | decisions, implementation, security    | validation, auth, sanitization | Need security decisions + validation patterns |
| **understand**     | architecture, decisions, summary       | overview, context, background  | Need high-level understanding first           |
| **find_spec**      | spec-doc, architecture, overview       | specification, structure       | Need spec document content + structure        |
| **find_decision**  | decisions, rationale, architecture     | context, background, history   | Need decision records + rationale context     |

### Example: add_feature Intent

```text
Query: "implement oauth token refresh"
Intent: add_feature (detected)

Anchors Selected:
  1. implementation (1.5x weight)
  2. architecture (1.3x weight)
  3. patterns (1.2x weight)

Reasoning:
  - Need existing OAuth implementation patterns
  - Need architecture understanding for integration points
  - Need code examples for token handling
```

---

## 5. WORKFLOW

### Step 1: Parse Query and Detect Intent

```text
Input: $ARGUMENTS
    ↓
Extract Query + Intent Override (if --intent: flag)
    ↓
IF intent override provided:
    → Use explicit intent
ELSE:
    → Auto-detect via keyword matching
    ↓
Store: query, intent
```

### Step 2: Apply Intent-Specific Weights

```text
Based on detected intent:
    ↓
Select appropriate anchors:
    - add_feature: ['implementation', 'architecture', 'patterns']
    - fix_bug: ['decisions', 'implementation', 'errors', 'debugging']
    - refactor: ['architecture', 'patterns', 'decisions']
    - security_audit: ['decisions', 'implementation', 'security']
    - understand: ['architecture', 'decisions', 'summary', 'overview']
    - find_spec: ['spec-doc', 'architecture', 'overview', 'specification']
    - find_decision: ['decisions', 'rationale', 'architecture', 'context']
    ↓
Adjust search parameters:
    - Weight boost for relevant context types
    - Anchor filtering for targeted retrieval
```

### Step 3: Execute Search with Optimizations

```javascript
spec_kit_memory_memory_context({
  input: query,
  intent: intent,
  mode: "auto",                 // use "deep" for expanded multi-query retrieval
  anchors: intentAnchors[intent],
  limit: 10,
  includeContent: true,
  enableDedup: true
});
```

### Step 4: Return Context with Explanation

Format response:

```text
MEMORY:CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Query       "<query>"
  Intent      <detected-intent> (auto)
  Weights     <anchor1> ×1.5 · <anchor2> ×1.3 · <anchor3> ×1.2

→ Results ──────────────────────────────── <N> found

  #<id>  <title>
         █████████░  <score>%  ·  <spec-folder>  ·  <context_type>
         <content-preview>

  #<id>  <title>
         ███████░░░  <score>%  ·  <spec-folder>  ·  <context_type>
         <content-preview>

→ Token Budget ──────────────────────────────────────

  ████████████░░░░░░░░  <used> / <budget> tokens (<percentage>%)

STATUS=OK INTENT=<intent> RESULTS=<count>
```

### Token Budget Enforcement

**memory_context L1 Budget:** ~2000 tokens total (mode-managed)

#### Budget Guidance by Mode

| Mode      | Target Budget | Typical Use                                  |
| --------- | ------------- | -------------------------------------------- |
| `quick`   | ~800          | Fast trigger/context lookup                  |
| `focused` | ~1500         | Intent-optimized retrieval (`fix_bug`, etc.) |
| `resume`  | ~1200         | Session recovery (`state`, `next-steps`)     |
| `deep`    | ~2000         | Broader context for complex work             |
| `auto`    | mode-routed   | Server selects mode from detected intent     |

#### Truncation Logic

When results exceed token budget:
1. Sort results by intent-specific relevance score
2. Include results until budget reached
3. If last result causes overage but >90% budget used, truncate to fit remaining budget
4. Output includes: `Token Budget: ~<tokens> / <budget> tokens (<percentage>% used)` and `Truncation: <none|partial|significant>`

### Session Deduplication

#### Purpose

Prevent duplicate context when the same query spans multiple sessions or when overlapping sessions contain redundant information.

#### Strategy

- Content hashing: Each result is hashed; duplicates with same hash are merged (keeping most recent version)
- Cross-session detection via `sessionId` metadata and content hash comparison
- Timestamp-based recency preference when duplicates found

#### Deduplication Metadata

When deduplication occurs, the response includes:

```yaml
deduplication:
  enabled: true
  original_count: <N>
  deduplicated_count: <M>
  duplicates_removed: <N - M>
  session_dedup_applied: true
```

---

## 6. ERROR HANDLING

| Condition      | Response                                  |
| -------------- | ----------------------------------------- |
| Query empty    | Ask user for query (see top of file)      |
| Intent invalid | Default to 'understand' with warning      |
| No results     | Suggest broader query or different intent |
| Search fails   | Fall back to unweighted search            |

---

## 7. RELATED COMMANDS

- `/memory:save`: Save conversation context
- `/memory:manage`: Database management, checkpoints, ingest
- `/memory:learn`: Constitutional memories
- `/memory:continue`: Session recovery
- `/memory:analyze`: Analysis, causal graph, evaluation, learning history
- `/memory:shared`: Shared-memory spaces

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

**CRITICAL:** Use the correct MCP tools for each step.

### Enforcement Matrix

| STEP            | REQUIRED CALLS                                           | PATTERN  | ON FAILURE                |
| --------------- | -------------------------------------------------------- | -------- | ------------------------- |
| INTENT DETECT   | Parse query, match keywords                              | LOCAL    | Default to 'understand'   |
| CONTEXT (PREF)  | `spec_kit_memory_memory_context({ input, ... })`         | SINGLE   | Fall back to manual search |
| TRIGGER CHECK   | `spec_kit_memory_memory_match_triggers({ prompt: query })`| OPTIONAL | Continue without          |
| SEARCH (MANUAL) | `spec_kit_memory_memory_search({ query, anchors, includeContent: true })` | SINGLE | Show error msg |

### Tool Signatures

> **Note:** The dedicated `spec_kit_memory_memory_context()` tool provides unified intent-aware retrieval server-side. It accepts `input`, `mode`, `intent`, `specFolder`, `limit`, `sessionId`, `enableDedup`, `includeContent`, and `anchors` params. This is the recommended unified approach. The manual orchestration below is for advanced use cases requiring fine-grained control.

> **Adaptive Fusion, Hybrid Routing & Telemetry:** Retrieval combines vector, FTS5/BM25, and graph channels, then applies intent-adaptive fusion and reranking. Results may be routed through artifact-class classification before scoring. When `SPECKIT_ADAPTIVE_FUSION` is enabled, weights adapt dynamically by intent. When `SPECKIT_EXTENDED_TELEMETRY` is enabled, extended telemetry is captured (query timing, score distributions, fusion decisions) and written to the telemetry log.
>
> **MMR and Evidence Gap Prevention:** Post-fusion MMR reduces redundant context chunks, and low-confidence retrieval can trigger an early evidence-gap warning so sparse results are treated cautiously.

```javascript
// Option 1: Dedicated context tool (preferred — single call)
spec_kit_memory_memory_context({
  input: "<query>",
  intent: "<add_feature|fix_bug|refactor|security_audit|understand|find_spec|find_decision>",  // Optional, auto-detected if omitted
  specFolder: "<folder>",  // Optional
  includeContent: true,
  anchors: ["<anchor1>", "<anchor2>"],  // Intent-specific
})

// Option 2: Manual search with anchors (advanced — fine-grained control)
spec_kit_memory_memory_search({
  query: "<query>",
  anchors: ["<anchor1>", "<anchor2>", ...],  // Intent-specific
  limit: 10,
  includeContent: true,  // Single call, no separate load
  useDecay: true,
  contextType: "<type>",  // e.g., "implementation", "decision"
})
```

---

## APPENDIX B: ADVANCED PARAMETERS

### memory_context: Full Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input` | string | *required* | Query, prompt, or context description |
| `mode` | string | `auto` | `auto`, `quick`, `deep`, `focused`, `resume` |
| `intent` | string | auto-detect | `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
| `specFolder` | string | — | Limit context to specific spec folder |
| `limit` | number | mode-specific | Maximum results (1-100) |
| `sessionId` | string | ephemeral | Caller-supplied session identifier |
| `enableDedup` | boolean | true | Enable session deduplication |
| `includeContent` | boolean | false | Include full file content in results |
| `includeTrace` | boolean | false | Include provenance-rich trace data (scores, source, trace) in results when underlying `memory_search` is called |
| `tokenUsage` | number | — | Caller token usage ratio (0.0-1.0). Helps the server budget-aware pruning when the caller is near context limits |
| `anchors` | string[] | — | Filter content to specific anchors (e.g., `["state", "next-steps"]` for resume mode) |

### memory_search: Advanced Parameters

The full `memory_search` parameter surface is available when using Option 2 (manual search). Key advanced parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | — | Natural language search query (required unless `concepts` provided) |
| `concepts` | string[] | — | 2-5 concept strings for multi-concept AND search (required unless `query` provided) |
| `specFolder` | string | — | Limit search to specific spec folder |
| `tier` | string | — | Filter by importance tier |
| `contextType` | string | — | Filter by context type |
| `useDecay` | boolean | true | Apply temporal decay scoring |
| `includeContiguity` | boolean | false | Include adjacent/contiguous memories |
| `includeConstitutional` | boolean | true | Include constitutional tier memories at top |
| `enableSessionBoost` | boolean | env flag | Enable session-based score boost from working_memory attention signals |
| `enableCausalBoost` | boolean | env flag | Enable causal-neighbor boost (2-hop traversal on causal_edges) |
| `min_quality_score` | number | — | Minimum quality score threshold (0.0-1.0) |
| `minQualityScore` | number | — | **Deprecated alias** for `min_quality_score`. Prefer the snake_case parameter name |
| `bypassCache` | boolean | false | Skip tool cache and force fresh search |
| `rerank` | boolean | true | Enable cross-encoder reranking |
| `applyLengthPenalty` | boolean | true | Penalize very long memories during reranking |
| `applyStateLimits` | boolean | false | Enforce per-tier quantity limits for result diversity |
| `minState` | string | `WARM` | Minimum memory state: `HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED` |
| `autoDetectIntent` | boolean | true | Auto-detect intent from query if not explicitly set |
| `trackAccess` | boolean | false | Write FSRS strengthening updates on read (off by default to avoid write-on-read) |
| `includeArchived` | boolean | false | Include archived memories in results |
| `mode` | string | `auto` | `auto` (standard) or `deep` (multi-query expansion). Note: deep mode does not guarantee expansion for simple queries |
| `includeTrace` | boolean | false | Include provenance-rich scores/source/trace fields in each result |

> **Governance scoping:** `tenantId`, `userId`, `agentId`, and `sharedSpaceId` are advertised in the tool schema for governed retrieval. When shared-memory scope enforcement is active, results are isolated to the specified boundaries. These parameters are rollout-dependent.

### memory_match_triggers: Cognitive Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | *required* | User prompt or text to match against trigger phrases |
| `limit` | number | 3 | Maximum matching memories to return |
| `session_id` | string | — | Session identifier for cognitive features. Enables attention decay and tiered content injection |
| `turnNumber` | number | — | Current conversation turn number. Used with `session_id` for decay calculations |
| `include_cognitive` | boolean | true | Enable cognitive features (decay, tiers, co-activation). Requires `session_id` |

When cognitive features are enabled (`session_id` + `include_cognitive`), trigger matching uses attention-based decay and tiered content injection: HOT memories return full content, WARM memories return summaries, with co-activation of related memories.
