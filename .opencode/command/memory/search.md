---
description: Unified continuity retrieval and analysis - canonical spec-doc context search, epistemic baselines, causal graph, ablation studies, and dashboards
argument-hint: "<query> [--intent:<type>] | preflight <specFolder> <taskId> | postflight <specFolder> <taskId> | history <specFolder> | causal <memoryId> | link <sourceId> <targetId> <relation> | unlink <edgeId> | causal-stats | ablation | dashboard"
allowed-tools: Read, spec_kit_memory_memory_context, spec_kit_memory_memory_quick_search, spec_kit_memory_memory_search, spec_kit_memory_memory_match_triggers, spec_kit_memory_task_preflight, spec_kit_memory_task_postflight, spec_kit_memory_memory_drift_why, spec_kit_memory_memory_causal_link, spec_kit_memory_memory_causal_stats, spec_kit_memory_memory_causal_unlink, spec_kit_memory_eval_run_ablation, spec_kit_memory_eval_reporting_dashboard, spec_kit_memory_memory_get_learning_history
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
          - label: "Analysis tools"
            description: "Epistemic baselines, causal graph, ablation, dashboards"
    → WAIT for user response
    → If "Analysis tools" selected → Display ANALYSIS OVERVIEW (Section 8)
    → Otherwise → Use their response to determine the intent and query
    → Only THEN continue with this workflow

IF $ARGUMENTS starts with a KNOWN ANALYSIS SUBCOMMAND (Section 3):
    → Route to ANALYSIS MODE (Section 5)

IF $ARGUMENTS contains a query (any other text):
    → Route to RETRIEVAL MODE (Section 4)
```

**CRITICAL RULES:**
- **DO NOT** infer query from conversation context
- **DO NOT** assume the user's intent without explicit input
- **DO NOT** proceed past this point without explicit query from user
- The query and intent MUST come from `$ARGUMENTS` or user's answer above

---

# Memory Search Command

Unified entry point for knowledge retrieval and analysis. Combines intent-aware context search (retrieval mode) with epistemic measurement, causal graph tools, and evaluation dashboards (analysis mode).

---

## 0. INSTRUCTIONS

Start by classifying `$ARGUMENTS` into retrieval mode or analysis mode. Follow the routing contract below, prefer canonical packet sources in retrieval mode, and only invoke the analysis subcommands that match the user's explicit request.

---

```yaml
role: Retrieval & Analysis Specialist
purpose: Unified entry point combining intent-aware retrieval with epistemic measurement, causal graph, and evaluation tools
action: Route through retrieval or analysis mode based on argument pattern

operating_mode:
  workflow: argument_routing
  workflow_compliance: MANDATORY
  approvals: none_required
  tracking: intent_classification
```

---

## 1. PURPOSE

> **L1 Orchestration + L6 Analysis**: This command operates at both the L1 retrieval layer (orchestrating lower-level context-retrieval operations) and the L6 analysis layer (epistemic baselines, causal graph, evaluation). It provides a single entry point for all knowledge-related context-retrieval operations.

Provide a unified entry point that:

**Retrieval mode** (default):
- Automatically detects task intent from the query
- Applies task-specific weights for search optimization
- Combines search + load in a single operation
- Returns context with relevance explanation
- Enforces L1 token budget constraints (target: ~2000 tokens per call)
- Handles session deduplication for cross-session queries
- Targets canonical packet sources first: `handover.md`, `_memory.continuity`, then the packet spec docs

**Analysis mode** (subcommand-triggered):
- Epistemic measurement: Capture knowledge baselines before and after tasks (`task_preflight`, `task_postflight`)
- Causal graph: Trace decision lineage, create/remove causal links, view graph stats (`memory_drift_why`, `memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`)
- Evaluation: Run channel ablation studies and view reporting dashboards (`eval_run_ablation`, `eval_reporting_dashboard`)
- Learning history: View PREFLIGHT/POSTFLIGHT records and Learning Index trends (`memory_get_learning_history`)

### Hybrid Retrieval Runtime (Retrieval Mode)

The unified context tool runs a hybrid retrieval pipeline with **graph-first routing** (026):

- **Graph channel has priority** in the fusion strategy: structural queries (callers, imports, dependencies) are routed to `code_graph_query` first, before semantic or lexical channels
- Tri-channel retrieval (graph + vector/semantic + FTS5/BM25) with graph results given precedence in the fusion merge
- CocoIndex semantic search (`mcp__cocoindex_code__search`) integrates as the vector/semantic channel, providing natural-language code discovery alongside indexed-continuity vector search
- When graph and semantic channels miss or return weak results, a 3-tier FTS fallback activates: FTS5 full-text → BM25 keyword scoring → Grep/Glob filesystem search. Post-026 FTS5 remediation improved BM25 tokenization and ranking accuracy
- Intent-adaptive fusion and reranking (weights adapt when `SPECKIT_ADAPTIVE_FUSION` is enabled, including the internal continuity profile: semantic `0.52`, keyword `0.18`, recency `0.07`, graph `0.23`)
- MMR diversity pruning to reduce redundant chunks, with continuity-oriented Stage 3 passes using a dedicated lambda of `0.65`
- Cross-encoder reranking only runs when at least 4 candidates reach Stage 3; `applyLengthPenalty` remains on the API surface for compatibility but currently resolves to a neutral `1.0` multiplier for every document
- `getRerankerStatus()` exposes reranker latency plus cache `hits`, `misses`, `staleHits`, and `evictions`
- Deep-mode query expansion for broader lexical coverage
- Evidence-gap detection (026) to flag low-confidence retrievals with explicit gap warnings, enabling downstream reasoning to remain cautious and avoid acting on sparse evidence

### Canonical Retrieval Order

- `/spec_kit:resume` is the recovery surface for session continuation.
- Resume-oriented retrieval follows `handover.md -> _memory.continuity -> spec docs`.
- Packet-oriented retrieval may additionally use indexed `document_type='graph_metadata'` rows for dependency, supersession, related-packet, and key-file signals.
- `find_spec` and `find_decision` should resolve against canonical spec docs and anchors, not against standalone continuity artifacts.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS`: Query with optional intent override, OR analysis subcommand with parameters
**Outputs:** Context with relevance scores and intent explanation, OR `STATUS=<OK|FAIL>` with subcommand-specific output

---

## 3. QUICK REFERENCE

### Retrieval Mode (default)

| Command | Result |
|---------|--------|
| `/memory:search "implement auth"` | Auto-detect add_feature, apply weights |
| `/memory:search "auth bug" --intent:fix_bug` | Explicit fix_bug intent |
| `/memory:search "how does auth work?"` | Auto-detect understand intent |
| `/memory:search "optimize auth code"` | Auto-detect refactor intent |
| `/memory:search "auth security review"` | Auto-detect security_audit intent |
| `/memory:search "find the spec for auth"` | Auto-detect find_spec intent |
| `/memory:search "why did we choose JWT"` | Auto-detect find_decision intent |

### Analysis Mode (subcommand-triggered)

| Command | Result |
|---------|--------|
| `/memory:search preflight specs/007-auth T1` | Capture epistemic baseline |
| `/memory:search postflight specs/007-auth T1` | Calculate learning delta |
| `/memory:search history specs/007-auth` | View learning history |
| `/memory:search causal 42` | Trace causal chain for memory #42 |
| `/memory:search link 42 43 caused` | Link memory #42 → #43 as caused |
| `/memory:search unlink 5` | Remove causal edge #5 |
| `/memory:search causal-stats` | View causal graph statistics |
| `/memory:search ablation` | Run channel ablation study |
| `/memory:search dashboard` | View reporting dashboard |

---

## 4. ARGUMENT ROUTING

```text
$ARGUMENTS
    │
    ├─ Empty (no args)                        → INTERACTIVE PROMPT (see gate above)
    │
    ├─ ANALYSIS SUBCOMMAND DETECTED?
    │   First token matches one of:
    │   "preflight", "postflight", "history",
    │   "causal", "link", "unlink",
    │   "causal-stats", "ablation", "dashboard"
    │   └─► YES → ANALYSIS MODE (Section 5)
    │
    └─ OTHERWISE (any other text)
        └─► RETRIEVAL MODE (Section 4A)
            Parse: <query> [--intent:<type>]
```

**Routing logic:** If the first argument token exactly matches a known analysis subcommand keyword → route to analysis mode. Otherwise → treat entire input as a retrieval query (with optional `--intent:` flag).

---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- SECTION 4A: RETRIEVAL MODE                                     -->
<!-- ═══════════════════════════════════════════════════════════════ -->

## 4A. RETRIEVAL MODE

### Intent Types and Weights

#### Intent Classification

The system detects one of seven intent types:

| Intent Type | Description | Weight Adjustments |
|-------------|-------------|--------------------|
| **add_feature** | Implementing new functionality | implementation: 1.5x, architecture: 1.3x, patterns: 1.2x |
| **fix_bug** | Debugging and fixing issues | decisions: 1.4x, implementation: 1.3x, errors: 1.5x |
| **refactor** | Code restructuring | architecture: 1.5x, patterns: 1.4x, decisions: 1.2x |
| **security_audit** | Security review | decisions: 1.4x, implementation: 1.3x, security: 1.5x |
| **understand** | Learning existing code | architecture: 1.4x, decisions: 1.3x, overview: 1.5x |
| **find_spec** | Canonical spec document retrieval | spec-doc: 1.5x, architecture: 1.3x, overview: 1.2x |
| **find_decision** | Decision rationale lookup from canonical docs | decisions: 1.5x, rationale: 1.4x, architecture: 1.2x |

#### Detection Logic

Intent is detected via keyword matching against the query. Keywords are phrase-based to avoid false positives:

| Intent | Keywords |
|--------|----------|
| `add_feature` | 'implement', 'add feature', 'add new', 'add a', 'create new', 'build new' |
| `fix_bug` | 'bug', 'error', 'fix', 'broken', 'issue', 'debug' |
| `refactor` | 'refactor', 'restructure', 'improve', 'clean up', 'optimize' |
| `security_audit` | 'security', 'vulnerability', 'auth', 'sanitize', 'xss', 'csrf' |
| `understand` | 'how', 'why', 'what', 'explain', 'understand', 'learn' |
| `find_spec` | 'spec', 'specification', 'spec folder', 'spec document', 'find spec' |
| `find_decision` | 'decision', 'rationale', 'why did we', 'chose', 'decision record' |

**Default fallback:** If no keywords match, defaults to `understand`.

#### Anchor Mapping by Intent

| Intent | Primary Anchors | Secondary Anchors | Why These? |
|--------|----------------|-------------------|------------|
| **add_feature** | implementation, architecture, patterns | decisions, code-examples | Need existing patterns + structure |
| **fix_bug** | decisions, implementation, errors | debugging, troubleshooting | Need decision history + error context |
| **refactor** | architecture, patterns, decisions | technical-specs, code-quality | Need structure understanding + rationale |
| **security_audit** | decisions, implementation, security | validation, auth, sanitization | Need security decisions + validation patterns |
| **understand** | architecture, decisions, summary | overview, context, background | Need high-level understanding first |
| **find_spec** | spec-doc, architecture, overview | specification, structure | Need canonical spec document content + structure |
| **find_decision** | decisions, rationale, architecture | context, background, history | Need decision records and rationale from canonical docs |

#### Example: add_feature Intent

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

### Retrieval Workflow

#### Step 1: Parse Query and Detect Intent

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

#### Step 2: Apply Intent-Specific Weights

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

#### Step 3: Execute Search with Optimizations

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

#### Step 4: Return Context with Explanation

Format response:

```text
MEMORY:SEARCH  "<query>"  <detected-intent>  <N> found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  <leaf-folder>/
    <score>  #<id>  <title>

  <leaf-folder>/
    <score>  #<id>  <title>
    <score>  #<id>  <title>
    <score>  #<id>  <title>

  <leaf-folder>/
    <score>  #<id>  <title>
    <score>  #<id>  <title>

STATUS=OK RESULTS=<count>
```

**Folder display rules:**
- Results grouped by spec folder
- **Leaf folder name only** as group header (last path segment, e.g., `010-search-retrieval-quality-fixes/`)
- Drop all parent path prefixes (`system-spec-kit/023-esm-module-compliance/` etc.)
- Top-level folders (like `system-spec-kit/`) shown as-is
- If two leaf names collide, prefix with parent number: `023/010-search-quality/`
- Results indented under their folder group
- Each result shows only: score, ID, title
- No other metadata (no type, bars, previews, weights, or token budget)

#### Step 4b: Empty-Results Fallback (RESULTS=0 with TRIGGERED>0 or CONSTITUTIONAL>0)

When semantic + lexical search return zero direct matches but the trigger-phrase matcher OR constitutional-rule surfacer returned spec-doc records, render them under explicit canonical labels — never invent ad-hoc wording like "Auto-triggered memories":

```text
MEMORY:SEARCH  "<query>"  <detected-intent>  0 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No spec-doc records matched this query via semantic or lexical search.

Trigger-matched spec-doc records (matched on phrase "<keyword>"):
  <leaf-folder>/
    #<id>  <title>
  <leaf-folder>/
    #<id>  <title>

Constitutional rules (always-surface tier):
  #<id>  <title>

STATUS=OK  RESULTS=0  TRIGGERED=<n>  CONSTITUTIONAL=<n>
```

**Vocabulary rules for this fallback:**
- Use `Trigger-matched spec-doc records` — NOT `Auto-triggered memories`, `Triggered memories`, or `Memories`
- Use `Constitutional rules` — NOT `Constitutional memories`
- The phrase that triggered the match is shown in quotes in the section heading
- Drop the score column (trigger matches are categorical, not scored)
- After the formatted output, the assistant MAY ask one clarifying follow-up question if the query was ambiguous (≤2 lines), but the canonical block above must come first.

##### Forbidden Phrase Enforcement (REQ-003 / Cluster 3)

The following phrases MUST NOT appear anywhere in any `/memory:search` rendering — empty-result fallback, full-result render, or analysis subcommand output. This list is authoritative; treat any occurrence as a P0 contract violation.

| Forbidden Phrase | Required Replacement |
|------------------|---------------------|
| `Auto-triggered memories` | `Trigger-matched spec-doc records` |
| `Auto-triggered memory` | `Trigger-matched spec-doc record` |
| `Triggered memories` | `Trigger-matched spec-doc records` |
| `Triggered memory` | `Trigger-matched spec-doc record` |
| `Memories` (as a section header on its own) | `Spec-doc records` |
| `Memory` (as a result-class label) | `Spec-doc record` |
| `Constitutional memories` | `Constitutional rules` |
| `Constitutional memory` | `Constitutional rule` |
| `auto-triggered` (any case) | `trigger-matched` |

Pre-render gate (assistant MUST run before emitting the response block):
1. Build the candidate output text.
2. Case-insensitively scan for every forbidden phrase above.
3. On any match: rewrite using the replacement column. Do not emit the original.
4. After rewrite, verify the candidate is greppable-clean for the forbidden list.

Verification (regression-safe):
- `grep -Eci 'auto-triggered|triggered memories|triggered memory|constitutional memor(y|ies)'` against the rendered block MUST return `0`.
- The rendered block uses only `Trigger-matched spec-doc records`, `Constitutional rules`, and `Spec-doc record(s)` for these concepts.

### Token Budget Enforcement

**memory_context L1 Budget:** ~2000 tokens total (mode-managed)

#### Budget Guidance by Mode

| Mode | Target Budget | Typical Use |
|------|---------------|-------------|
| `quick` | ~800 | Fast trigger/context lookup |
| `focused` | ~1500 | Intent-optimized retrieval (`fix_bug`, etc.) |
| `resume` | ~1200 | Session recovery (`state`, `next-steps`) |
| `deep` | ~2000 | Broader context for complex work |
| `auto` | mode-routed | Server selects mode from detected intent |

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

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- SECTION 5: ANALYSIS MODE                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

## 5. ANALYSIS MODE

### Analysis Subcommand Routing

```text
$ARGUMENTS (first token is a known subcommand)
    │
    ├─ "preflight <specFolder> <taskId>"      → EPISTEMIC MEASUREMENT (Section 5A)
    ├─ "postflight <specFolder> <taskId>"     → EPISTEMIC MEASUREMENT (Section 5A)
    ├─ "history <specFolder>"                 → EPISTEMIC MEASUREMENT (Section 5A)
    ├─ "causal <memoryId>"                    → CAUSAL GRAPH (Section 5B)
    ├─ "link <sourceId> <targetId> <relation>"→ CAUSAL GRAPH (Section 5B)
    ├─ "unlink <edgeId>"                      → CAUSAL GRAPH (Section 5B)
    ├─ "causal-stats"                         → CAUSAL GRAPH (Section 5B)
    ├─ "ablation"                             → EVALUATION (Section 5C)
    └─ "dashboard"                            → EVALUATION (Section 5C)
```

---

### 5A. Epistemic Measurement

#### Preflight

**Trigger:** `/memory:search preflight <specFolder> <taskId>`

Captures epistemic baseline before implementation. Records knowledge, uncertainty, and context scores for later comparison with postflight.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | Yes | Spec folder path (e.g., `specs/003-memory/077-upgrade`) |
| `taskId` | string | Yes | Task identifier (e.g., `T1`, `implementation`) |
| `knowledgeScore` | number | Yes | Knowledge level 0-100 |
| `uncertaintyScore` | number | Yes | Uncertainty level 0-100 |
| `contextScore` | number | Yes | Context completeness 0-100 |
| `knowledgeGaps` | string[] | No | Identified knowledge gaps |
| `sessionId` | string | No | Session identifier |

##### Workflow

1. Parse `specFolder` and `taskId` from arguments
2. Assess current epistemic state (knowledge, uncertainty, context)
3. Call `task_preflight()` with scores
4. Display baseline confirmation

##### Output

```text
MEMORY:SEARCH PREFLIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Spec        <specFolder>
  Task        <taskId>

→ Epistemic Baseline ─────────────────────────────
  Knowledge     <score>/100
  Uncertainty   <score>/100
  Context       <score>/100

→ Knowledge Gaps ─────────────────────────────────
  <gap1>
  <gap2>

STATUS=OK ACTION=preflight
```

#### Postflight

**Trigger:** `/memory:search postflight <specFolder> <taskId>`

Captures post-task epistemic state and calculates Learning Index. The `specFolder` and `taskId` must match a prior preflight record.

**Learning Index:** `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | Yes | Spec folder path (must match preflight) |
| `taskId` | string | Yes | Task identifier (must match preflight) |
| `knowledgeScore` | number | Yes | Post-task knowledge level 0-100 |
| `uncertaintyScore` | number | Yes | Post-task uncertainty level 0-100 |
| `contextScore` | number | Yes | Post-task context completeness 0-100 |
| `gapsClosed` | string[] | No | Knowledge gaps closed during task |
| `newGapsDiscovered` | string[] | No | New gaps discovered during task |

##### Learning Index Interpretation

| Range | Meaning |
|-------|---------|
| 40+ | Significant learning |
| 15-40 | Moderate learning |
| 5-15 | Incremental learning |
| <5 | Execution-focused (minimal learning) |
| Negative | Regression, investigate |

##### Output

```text
MEMORY:SEARCH POSTFLIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Spec        <specFolder>
  Task        <taskId>

→ Epistemic State (Final) ────────────────────────
  Knowledge     <pre> → <post>  (Δ <delta>)
  Uncertainty   <pre> → <post>  (Δ <delta>)
  Context       <pre> → <post>  (Δ <delta>)

→ Learning Index ─────────────────────────────────
  ████████░░  <LI>/10  (<interpretation>)

→ Gaps Closed ────────────────────────────────────
  <gap1>
  <gap2>

STATUS=OK ACTION=postflight LI=<value>
```

#### Learning History

**Trigger:** `/memory:search history <specFolder>`

View learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Completes the epistemic lifecycle: capture (preflight) -> complete (postflight) -> review (history).

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | Yes | Spec folder path (e.g., `specs/007-auth`) |
| `sessionId` | string | No | Filter by session ID |
| `limit` | number | No | Maximum records (default: 10, max: 100) |
| `onlyComplete` | boolean | No | Only return records with both PREFLIGHT and POSTFLIGHT (default: false) |
| `includeSummary` | boolean | No | Include summary statistics and trends (default: true) |

##### Output

```text
MEMORY:SEARCH HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Spec        <specFolder>
  Records     <N>

→ Learning History ───────────────────────────────
  <taskId>  K: <pre>→<post>  U: <pre>→<post>  C: <pre>→<post>  LI: <value>
  <taskId>  K: <pre>→<post>  U: <pre>→<post>  C: <pre>→<post>  LI: <value>

→ Summary ────────────────────────────────────────
  Avg LI      <value>
  Trend       <improving|stable|declining>

STATUS=OK ACTION=history
```

---

### 5B. Causal Graph

#### Causal Trace

**Trigger:** `/memory:search causal <memoryId>`

Traces the causal chain for a spec-doc record to answer "why was this decision made?" Traverses causal edges up to `maxDepth` hops.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `memoryId` | number or string | Yes | Memory ID to trace |
| `maxDepth` | number | No | Max traversal depth (default: 3, max: 10) |
| `direction` | string | No | `outgoing`, `incoming`, or `both` (default: `both`) |
| `relations` | string[] | No | Filter by: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` |
| `includeMemoryDetails` | boolean | No | Include full spec-doc record details (default: true) |

##### Output

```text
MEMORY:SEARCH CAUSAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Record      #<id> "<title>"
  Depth       <maxDepth>
  Direction   <direction>

→ Causal Chain ───────────────────────────────────
  #<id> "<title>"
    ├─ caused → #<id2> "<title2>"
    │   └─ enabled → #<id3> "<title3>"
    └─ supersedes → #<id4> "<title4>"

STATUS=OK ACTION=causal EDGES=<count>
```

#### Causal Link

**Trigger:** `/memory:search link <sourceId> <targetId> <relation>`

Creates a causal relationship between two spec-doc records.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sourceId` | number or string | Yes | Source memory ID |
| `targetId` | number or string | Yes | Target memory ID |
| `relation` | string | Yes | `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` |
| `strength` | number | No | Relationship strength 0.0-1.0 (default: 1.0) |
| `evidence` | string | No | Evidence or reason for the relationship |

##### Output

```text
MEMORY:SEARCH LINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Source      #<sourceId> "<title>"
  Target      #<targetId> "<title>"
  Relation    <relation>
  Strength    <strength>

STATUS=OK ACTION=link
```

#### Causal Unlink

**Trigger:** `/memory:search unlink <edgeId>`

Removes a causal relationship by edge ID. Use `/memory:search causal <memoryId>` first to find edge IDs.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `edgeId` | number | Yes | Edge ID to delete |

##### Output

```text
MEMORY:SEARCH UNLINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Removed     Edge #<edgeId>

STATUS=OK ACTION=unlink
```

#### Causal Stats

**Trigger:** `/memory:search causal-stats`

Shows statistics about the causal spec-doc graph. No parameters required.

Target: 60% of spec-doc records linked (CHK-065).

##### Output

```text
MEMORY:SEARCH CAUSAL-STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Edges     <N>
  Coverage        <pct>% (<linked>/<total> spec-doc records)

→ By Relation ────────────────────────────────────
  caused          ██████░░░░  <N>
  enabled         ████░░░░░░  <N>
  supersedes      ██░░░░░░░░  <N>
  contradicts     █░░░░░░░░░  <N>
  derived_from    ███░░░░░░░  <N>
  supports        █████░░░░░  <N>

STATUS=OK ACTION=causal-stats COVERAGE=<pct>%
```

---

### 5C. Evaluation

#### Ablation Study

**Trigger:** `/memory:search ablation`

Runs a controlled channel ablation study (R13-S3). Requires `SPECKIT_ABLATION=true` environment variable.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mode` | string | No | Evaluation mode. Defaults to `ablation`; use `k_sensitivity` for raw pre-fusion RRF K analysis |
| `channels` | string[] | No | Channels to ablate: `vector`, `bm25`, `fts5`, `graph`, `trigger` (default: all) |
| `groundTruthQueryIds` | number[] | No | Subset of ground truth query IDs to evaluate |
| `recallK` | number | No | Recall cutoff K (default: 20) |
| `storeResults` | boolean | No | Persist metrics to eval_metric_snapshots (default: true) |
| `includeFormattedReport` | boolean | No | Include human-readable markdown report (default: true) |

##### Behavior Notes

- Missing `groundTruthQueryIds` now produce a warning and the run continues with the remaining IDs that exist in the static dataset.
- If the report includes `Token budget overflow` and fewer than `recallK` candidates were evaluated, treat the run as investigation-only rather than a reliable Recall@K verdict.
- After a DB rebuild or eval DB swap, rerun `scripts/evals/map-ground-truth-ids.ts` before comparing baselines or channel deltas.

##### Output

```text
MEMORY:SEARCH ABLATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Recall@<K> Deltas ──────────────────────────────
  -vector     Δ <delta>  (baseline: <base>)
  -bm25       Δ <delta>  (baseline: <base>)
  -fts5       Δ <delta>  (baseline: <base>)
  -graph      Δ <delta>  (baseline: <base>)
  -trigger    Δ <delta>  (baseline: <base>)

  Stored      <yes|no>

STATUS=OK ACTION=ablation
```

#### Reporting Dashboard

**Trigger:** `/memory:search dashboard`

Generates R13-S3 reporting dashboard output with sprint/channel trend aggregation.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sprintFilter` | string[] | No | Sprint label filters |
| `channelFilter` | string[] | No | Channel filters |
| `metricFilter` | string[] | No | Metric-name filters |
| `limit` | number | No | Max sprint groups to return |
| `format` | string | No | `text` (default) or `json` |

##### Output

```text
MEMORY:SEARCH DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Sprint Trends ──────────────────────────────────
  <sprint>    Recall@20: <value>  MRR: <value>
  <sprint>    Recall@20: <value>  MRR: <value>

→ Channel Performance ───────────────────────────
  vector      ████████░░  <value>
  bm25        ██████░░░░  <value>
  fts5        █████░░░░░  <value>

STATUS=OK ACTION=dashboard
```

---

## 6. ERROR HANDLING

| Condition | Response |
|-----------|----------|
| Query empty | Ask user for query or subcommand (see gate at top) |
| Intent invalid | Default to 'understand' with warning |
| No results | Suggest broader query or different intent |
| Search fails | Fall back to unweighted search |
| Unknown subcommand | `STATUS=FAIL`, list valid subcommands |
| Missing required parameter | `STATUS=FAIL ERROR="Missing <param> for <subcommand>"` |
| Preflight/postflight specFolder mismatch | `STATUS=FAIL ERROR="specFolder must match preflight record"` |
| SPECKIT_ABLATION not enabled | `STATUS=FAIL ERROR="Requires SPECKIT_ABLATION=true"` |
| Ablation warns about missing IDs | Continue with available IDs, then correct `groundTruthQueryIds` or rerun `scripts/evals/map-ground-truth-ids.ts` |
| Ablation reports `Token budget overflow` below `recallK` | Report the run as investigation-only and fix truncation before using Recall@K as evidence |
| No causal edges found | Display empty graph message |
| Spec-doc record ID not found | `STATUS=FAIL ERROR="Memory #<id> not found"` (runtime string preserved verbatim) |
| No learning history records | Suggest using `preflight` before tasks |

---

## 7. RELATED COMMANDS

- `/memory:save`: Save conversation context
- `/memory:manage`: Database management, checkpoints, ingest
- `/memory:learn`: Constitutional rules
- `/spec_kit:resume`: Session recovery and continuation

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

**CRITICAL:** Use the correct MCP tools for each step. This command owns 13 tools across L1, L2, L6, and L7 layers.

### Enforcement Matrix

| MODE | REQUIRED CALLS | PATTERN | ON FAILURE |
|------|----------------|---------|------------|
| RETRIEVAL (default) | | | |
| Intent detect | Parse query, match keywords | LOCAL | Default to 'understand' |
| Context (preferred) | `spec_kit_memory_memory_context({ input, ... })` | SINGLE | Fall back to manual search |
| Quick search (optional) | `spec_kit_memory_memory_quick_search({ query, ... })` | SINGLE | Fall back to preferred/manual retrieval |
| Trigger check | `spec_kit_memory_memory_match_triggers({ prompt: query })` | OPTIONAL | Continue without |
| Search (manual) | `spec_kit_memory_memory_search({ query, anchors, includeContent: true })` | SINGLE | Show error msg |
| ANALYSIS | | | |
| Preflight | `task_preflight()` | SINGLE | Show error msg |
| Postflight | `task_postflight()` | SINGLE | Show error msg |
| Causal trace | `memory_drift_why()` | SINGLE | Show error msg |
| Causal link | `memory_causal_link()` | SINGLE | Show error msg |
| Causal unlink | `memory_causal_unlink()` | SINGLE | Show error msg |
| Causal stats | `memory_causal_stats()` | SINGLE | Show error msg |
| Ablation | `eval_run_ablation()` | SINGLE | Show error msg |
| Dashboard | `eval_reporting_dashboard()` | SINGLE | Show error msg |
| History | `memory_get_learning_history()` | SINGLE | Show error msg |

### Tool Signatures

> **Note:** The dedicated `spec_kit_memory_memory_context()` tool provides unified intent-aware retrieval server-side. It accepts `input`, `mode`, `intent`, `specFolder`, governed retrieval params (`tenantId`, `userId`, `agentId`), `limit`, `sessionId`, `enableDedup`, `includeContent`, `includeTrace`, `tokenUsage`, and `anchors`. `spec_kit_memory_memory_quick_search()` also supports governed retrieval via `tenantId`, `userId`, and `agentId`. This is the recommended unified approach. The manual orchestration below is for advanced use cases requiring fine-grained control.

> **Adaptive Fusion, Hybrid Routing & Telemetry:** Retrieval combines vector, FTS5/BM25, and graph channels, then applies intent-adaptive fusion and reranking. Results may be routed through artifact-class classification before scoring. When `SPECKIT_ADAPTIVE_FUSION` is enabled, weights adapt dynamically by intent, including the internal continuity profile (`0.52 / 0.18 / 0.07 / 0.23`) used for resume-style retrieval. When `SPECKIT_EXTENDED_TELEMETRY` is enabled, extended telemetry is captured (query timing, score distributions, fusion decisions) and written to the telemetry log, while `getRerankerStatus()` reports reranker latency and cache `hits` / `misses` / `staleHits` / `evictions`.
>
> **MMR and Evidence Gap Prevention:** Post-fusion MMR reduces redundant context chunks, and low-confidence retrieval can trigger an early evidence-gap warning so sparse results are treated cautiously.

```javascript
// ─── Retrieval tools ───────────────────────────────────────────

// Option 1: Dedicated context tool (preferred - single call)
spec_kit_memory_memory_context({
  input: "<query>",
  intent: "<add_feature|fix_bug|refactor|security_audit|understand|find_spec|find_decision>",  // Optional, auto-detected if omitted
  specFolder: "<folder>",  // Optional
  tenantId: "<tenant-id>", // Optional governed retrieval boundary
  userId: "<user-id>",     // Optional governed retrieval boundary
  agentId: "<agent-id>",   // Optional governed retrieval boundary
  includeContent: true,
  anchors: ["<anchor1>", "<anchor2>"],  // Intent-specific
})

// Option 2: Simplified search for fast query-only retrieval
spec_kit_memory_memory_quick_search({
  query: "<query>",
  limit: 10,                // Optional
  specFolder: "<folder>",   // Optional
  tenantId: "<tenant-id>",  // Optional governed retrieval boundary
  userId: "<user-id>",      // Optional governed retrieval boundary
  agentId: "<agent-id>",    // Optional governed retrieval boundary
})

// Option 3: Manual search with anchors (advanced - fine-grained control)
spec_kit_memory_memory_search({
  query: "<query>",
  anchors: ["<anchor1>", "<anchor2>", ...],  // Intent-specific
  limit: 10,
  includeContent: true,  // Single call, no separate load
  useDecay: true,
  contextType: "<type>",  // e.g., "implementation", "decision"
})

// ─── Analysis tools ───────────────────────────────────────────

// Epistemic measurement
spec_kit_memory_task_preflight({ specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, knowledgeGaps, sessionId })
spec_kit_memory_task_postflight({ specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, gapsClosed, newGapsDiscovered })

// Causal graph
spec_kit_memory_memory_drift_why({ memoryId, maxDepth, direction, relations, includeMemoryDetails })
spec_kit_memory_memory_causal_link({ sourceId, targetId, relation, strength, evidence })
spec_kit_memory_memory_causal_unlink({ edgeId })
spec_kit_memory_memory_causal_stats({})

// Evaluation
spec_kit_memory_eval_run_ablation({ mode: "ablation", channels, groundTruthQueryIds, recallK, storeResults: true, includeFormattedReport: true })
spec_kit_memory_eval_reporting_dashboard({ sprintFilter, channelFilter, metricFilter, limit, format })
spec_kit_memory_memory_get_learning_history({ specFolder, sessionId, limit, onlyComplete, includeSummary })
```

### Tool Coverage

| # | Tool | Layer | Mode | Subcommand |
|---|------|-------|------|------------|
| 1 | `memory_context` | L1 | Retrieval | (default) |
| 2 | `memory_quick_search` | L2 | Retrieval | (default) |
| 3 | `memory_search` | L2 | Retrieval | (default) |
| 4 | `memory_match_triggers` | L2 | Retrieval | (default) |
| 5 | `task_preflight` | L6 | Analysis | `preflight` |
| 6 | `task_postflight` | L6 | Analysis | `postflight` |
| 7 | `memory_drift_why` | L6 | Analysis | `causal` |
| 8 | `memory_causal_link` | L6 | Analysis | `link` |
| 9 | `memory_causal_stats` | L6 | Analysis | `causal-stats` |
| 10 | `memory_causal_unlink` | L6 | Analysis | `unlink` |
| 11 | `eval_run_ablation` | L6 | Analysis | `ablation` |
| 12 | `eval_reporting_dashboard` | L6 | Analysis | `dashboard` |
| 13 | `memory_get_learning_history` | L7 | Analysis | `history` |

---

## APPENDIX B: ADVANCED PARAMETERS

### memory_context: Full Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input` | string | *required* | Query, prompt, or context description |
| `mode` | string | `auto` | `auto`, `quick`, `deep`, `focused`, `resume` |
| `intent` | string | auto-detect | `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
| `specFolder` | string | - | Limit context to specific spec folder |
| `limit` | number | mode-specific | Maximum results (1-100) |
| `sessionId` | string | ephemeral | Caller-supplied session identifier |
| `enableDedup` | boolean | true | Enable session deduplication |
| `includeContent` | boolean | false | Include full file content in results |
| `includeTrace` | boolean | false | Include provenance-rich trace data (scores, source, trace) in results when underlying `memory_search` is called |
| `tokenUsage` | number | - | Caller token usage ratio (0.0-1.0). Helps the server budget-aware pruning when the caller is near context limits |
| `anchors` | string[] | - | Filter content to specific anchors (e.g., `["state", "next-steps"]` for resume mode) |

### memory_search: Advanced Parameters

The full `memory_search` parameter surface is available when using Option 3 (manual search). Key advanced parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query (required unless `concepts` provided) |
| `concepts` | string[] | - | 2-5 concept strings for multi-concept AND search (required unless `query` provided) |
| `specFolder` | string | - | Limit search to specific spec folder |
| `tier` | string | - | Filter by importance tier |
| `contextType` | string | - | Filter by context type |
| `useDecay` | boolean | true | Apply temporal decay scoring |
| `includeContiguity` | boolean | false | Include adjacent/contiguous spec-doc records |
| `includeConstitutional` | boolean | true | Include constitutional-tier spec-doc records at top |
| `enableSessionBoost` | boolean | env flag | Enable session-based score boost from working_memory attention signals |
| `enableCausalBoost` | boolean | env flag | Enable causal-neighbor boost (2-hop traversal on causal_edges) |
| `min_quality_score` | number | - | Minimum quality score threshold (0.0-1.0) |
| `minQualityScore` | number | - | **Deprecated alias** for `min_quality_score`. Prefer the snake_case parameter name |
| `bypassCache` | boolean | false | Skip tool cache and force fresh search |
| `rerank` | boolean | true | Enable cross-encoder reranking |
| `applyLengthPenalty` | boolean | true | Compatibility-only reranker option. Current runtime keeps it on the surface, but the length multiplier is always `1.0` so no documents are penalized for size |
| `applyStateLimits` | boolean | false | Enforce per-tier quantity limits for result diversity |
| `minState` | string | `WARM` | Minimum active spec-doc state: `HOT`, `WARM`, `COLD`, `DORMANT` |
| `autoDetectIntent` | boolean | true | Auto-detect intent from query if not explicitly set |
| `trackAccess` | boolean | false | Write FSRS strengthening updates on read (off by default to avoid write-on-read) |
| `mode` | string | `auto` | `auto` (standard) or `deep` (multi-query expansion). Note: deep mode does not guarantee expansion for simple queries |
| `includeTrace` | boolean | false | Include provenance-rich scores/source/trace fields in each result |

> **Governance scoping:** `tenantId`, `userId`, and `agentId` are advertised in the tool schema for governed retrieval. When scope enforcement is active, results are isolated to the specified boundaries.

### memory_match_triggers: Cognitive Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | *required* | User prompt or text to match against trigger phrases |
| `limit` | number | 3 | Maximum matching spec-doc records to return |
| `session_id` | string | - | Session identifier for cognitive features. Enables attention decay and tiered content injection |
| `turnNumber` | number | - | Current conversation turn number. Used with `session_id` for decay calculations |
| `include_cognitive` | boolean | true | Enable cognitive features (decay, tiers, co-activation). Requires `session_id` |

When cognitive features are enabled (`session_id` + `include_cognitive`), trigger matching uses attention-based decay and tiered content injection: HOT spec-doc records return full content, WARM spec-doc records return summaries, with co-activation of related spec-doc records.

---

## 8. ANALYSIS OVERVIEW DASHBOARD

When the user selects "Analysis tools" from the empty-arguments prompt, or when context warrants showing available analysis capabilities:

```text
MEMORY:SEARCH - ANALYSIS TOOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Available Subcommands ──────────────────────────

  Epistemic Measurement
  [preflight]   Capture knowledge baseline before task
  [postflight]  Capture post-task state and learning delta
  [history]     View learning history for a spec folder

  Causal Graph
  [causal]        Trace decision lineage for a spec-doc record
  [link]          Create causal relationship
  [unlink]        Remove causal relationship
  [causal-stats]  View graph coverage statistics

  Evaluation
  [ablation]    Run channel ablation study
  [dashboard]   View reporting dashboard

STATUS=OK ACTION=overview
```
