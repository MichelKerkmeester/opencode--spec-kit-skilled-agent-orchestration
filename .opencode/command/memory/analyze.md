---
description: Analysis, causal graph, eval, and reporting tools — epistemic baselines, causal links, ablation studies, and dashboards
argument-hint: "preflight <specFolder> <taskId> | postflight <specFolder> <taskId> | causal <memoryId> | link <sourceId> <targetId> <relation> | unlink <edgeId> | causal-stats | ablation | dashboard"
allowed-tools: Read, spec_kit_memory_task_preflight, spec_kit_memory_task_postflight, spec_kit_memory_memory_drift_why, spec_kit_memory_memory_causal_link, spec_kit_memory_memory_causal_stats, spec_kit_memory_memory_causal_unlink, spec_kit_memory_eval_run_ablation, spec_kit_memory_eval_reporting_dashboard, spec_kit_memory_memory_get_learning_history
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```text
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Display the OVERVIEW DASHBOARD (Section 4)
    → WAIT for user to select a subcommand

IF $ARGUMENTS starts with a recognized subcommand:
    → Route per Section 4

IF $ARGUMENTS is unrecognized:
    → STATUS=FAIL ERROR="Unknown subcommand. Valid: preflight, postflight, causal, link, unlink, causal-stats, ablation, dashboard, history"
```

---

# /memory:analyze, Analysis & Evaluation Command

> [L6:Analysis] Command home for epistemic baselines, causal graph tools, ablation studies, and reporting dashboards.

---

```yaml
role: Analysis & Evaluation Specialist
purpose: Manage epistemic measurement, causal memory graphs, and evaluation metrics
action: Route through preflight/postflight, causal graph, and eval subcommands
operating_mode:
  workflow: subcommand_routing
  approvals: none_required
```

---

## 1. PURPOSE

Provide a unified command for all L6 analysis and evaluation tools:

- **Epistemic measurement:** Capture knowledge baselines before and after tasks (`task_preflight`, `task_postflight`)
- **Causal graph:** Trace decision lineage, create/remove causal links, view graph stats (`memory_drift_why`, `memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`)
- **Evaluation:** Run channel ablation studies and view reporting dashboards (`eval_run_ablation`, `eval_reporting_dashboard`)

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS`: Subcommand with parameters
**Outputs:** `STATUS=<OK|FAIL>` with subcommand-specific output

---

## 3. QUICK REFERENCE

| Command | Result |
|---------|--------|
| `/memory:analyze` | Overview dashboard |
| `/memory:analyze preflight specs/007-auth T1` | Capture epistemic baseline |
| `/memory:analyze postflight specs/007-auth T1` | Calculate learning delta |
| `/memory:analyze history specs/007-auth` | View learning history |
| `/memory:analyze causal 42` | Trace causal chain for memory #42 |
| `/memory:analyze link 42 43 caused` | Link memory #42 → #43 as caused |
| `/memory:analyze unlink 5` | Remove causal edge #5 |
| `/memory:analyze causal-stats` | View causal graph statistics |
| `/memory:analyze ablation` | Run channel ablation study |
| `/memory:analyze dashboard` | View reporting dashboard |

---

## 4. ARGUMENT ROUTING

```text
$ARGUMENTS
    │
    ├─ Empty (no args)                        → OVERVIEW DASHBOARD (below)
    ├─ "preflight <specFolder> <taskId>"      → EPISTEMIC MEASUREMENT (Section 5)
    ├─ "postflight <specFolder> <taskId>"     → EPISTEMIC MEASUREMENT (Section 5)
    ├─ "history <specFolder>"                 → EPISTEMIC MEASUREMENT (Section 5)
    ├─ "causal <memoryId>"                    → CAUSAL GRAPH (Section 6)
    ├─ "link <sourceId> <targetId> <relation>"→ CAUSAL GRAPH (Section 6)
    ├─ "unlink <edgeId>"                      → CAUSAL GRAPH (Section 6)
    ├─ "causal-stats"                         → CAUSAL GRAPH (Section 6)
    ├─ "ablation"                             → EVALUATION (Section 7)
    └─ "dashboard"                            → EVALUATION (Section 7)
```

### Overview Dashboard

**Trigger:** `/memory:analyze` (no arguments)

```text
MEMORY:ANALYZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Available Subcommands ──────────────────────────

  Epistemic Measurement
  [preflight]   Capture knowledge baseline before task
  [postflight]  Capture post-task state and learning delta
  [history]     View learning history for a spec folder

  Causal Graph
  [causal]        Trace decision lineage for a memory
  [link]          Create causal relationship
  [unlink]        Remove causal relationship
  [causal-stats]  View graph coverage statistics

  Evaluation
  [ablation]    Run channel ablation study
  [dashboard]   View reporting dashboard

STATUS=OK ACTION=overview
```

---

## 5. EPISTEMIC MEASUREMENT

### Preflight

**Trigger:** `/memory:analyze preflight <specFolder> <taskId>`

Captures epistemic baseline before implementation. Records knowledge, uncertainty, and context scores for later comparison with postflight.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | Yes | Spec folder path (e.g., `specs/003-memory/077-upgrade`) |
| `taskId` | string | Yes | Task identifier (e.g., `T1`, `implementation`) |
| `knowledgeScore` | number | Yes | Knowledge level 0-100 |
| `uncertaintyScore` | number | Yes | Uncertainty level 0-100 |
| `contextScore` | number | Yes | Context completeness 0-100 |
| `knowledgeGaps` | string[] | No | Identified knowledge gaps |
| `sessionId` | string | No | Session identifier |

#### Workflow

1. Parse `specFolder` and `taskId` from arguments
2. Assess current epistemic state (knowledge, uncertainty, context)
3. Call `task_preflight()` with scores
4. Display baseline confirmation

#### Output

```text
MEMORY:ANALYZE PREFLIGHT
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

### Postflight

**Trigger:** `/memory:analyze postflight <specFolder> <taskId>`

Captures post-task epistemic state and calculates Learning Index. The `specFolder` and `taskId` must match a prior preflight record.

**Learning Index:** `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | Yes | Spec folder path (must match preflight) |
| `taskId` | string | Yes | Task identifier (must match preflight) |
| `knowledgeScore` | number | Yes | Post-task knowledge level 0-100 |
| `uncertaintyScore` | number | Yes | Post-task uncertainty level 0-100 |
| `contextScore` | number | Yes | Post-task context completeness 0-100 |
| `gapsClosed` | string[] | No | Knowledge gaps closed during task |
| `newGapsDiscovered` | string[] | No | New gaps discovered during task |

#### Learning Index Interpretation

| Range | Meaning |
|-------|---------|
| 40+ | Significant learning |
| 15-40 | Moderate learning |
| 5-15 | Incremental learning |
| <5 | Execution-focused (minimal learning) |
| Negative | Regression, investigate |

#### Output

```text
MEMORY:ANALYZE POSTFLIGHT
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

### Learning History

**Trigger:** `/memory:analyze history <specFolder>`

View learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Completes the epistemic lifecycle: capture (preflight) -> complete (postflight) -> review (history).

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | Yes | Spec folder path (e.g., `specs/007-auth`) |
| `sessionId` | string | No | Filter by session ID |
| `limit` | number | No | Maximum records (default: 10, max: 100) |
| `onlyComplete` | boolean | No | Only return records with both PREFLIGHT and POSTFLIGHT (default: false) |
| `includeSummary` | boolean | No | Include summary statistics and trends (default: true) |

#### Output

```text
MEMORY:ANALYZE HISTORY
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

## 6. CAUSAL GRAPH

### Causal Trace

**Trigger:** `/memory:analyze causal <memoryId>`

Traces the causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to `maxDepth` hops.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `memoryId` | number or string | Yes | Memory ID to trace |
| `maxDepth` | number | No | Max traversal depth (default: 3, max: 10) |
| `direction` | string | No | `outgoing`, `incoming`, or `both` (default: `both`) |
| `relations` | string[] | No | Filter by: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` |
| `includeMemoryDetails` | boolean | No | Include full memory details (default: true) |

#### Output

```text
MEMORY:ANALYZE CAUSAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Depth       <maxDepth>
  Direction   <direction>

→ Causal Chain ───────────────────────────────────
  #<id> "<title>"
    ├─ caused → #<id2> "<title2>"
    │   └─ enabled → #<id3> "<title3>"
    └─ supersedes → #<id4> "<title4>"

STATUS=OK ACTION=causal EDGES=<count>
```

### Causal Link

**Trigger:** `/memory:analyze link <sourceId> <targetId> <relation>`

Creates a causal relationship between two memories.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sourceId` | number or string | Yes | Source memory ID |
| `targetId` | number or string | Yes | Target memory ID |
| `relation` | string | Yes | `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` |
| `strength` | number | No | Relationship strength 0.0-1.0 (default: 1.0) |
| `evidence` | string | No | Evidence or reason for the relationship |

#### Output

```text
MEMORY:ANALYZE LINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Source      #<sourceId> "<title>"
  Target      #<targetId> "<title>"
  Relation    <relation>
  Strength    <strength>

STATUS=OK ACTION=link
```

### Causal Unlink

**Trigger:** `/memory:analyze unlink <edgeId>`

Removes a causal relationship by edge ID. Use `/memory:analyze causal <memoryId>` first to find edge IDs.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `edgeId` | number | Yes | Edge ID to delete |

#### Output

```text
MEMORY:ANALYZE UNLINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Removed     Edge #<edgeId>

STATUS=OK ACTION=unlink
```

### Causal Stats

**Trigger:** `/memory:analyze causal-stats`

Shows statistics about the causal memory graph. No parameters required.

Target: 60% of memories linked (CHK-065).

#### Output

```text
MEMORY:ANALYZE CAUSAL-STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Edges     <N>
  Coverage        <pct>% (<linked>/<total> memories)

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

## 7. EVALUATION

### Ablation Study

**Trigger:** `/memory:analyze ablation`

Runs a controlled channel ablation study (R13-S3). Requires `SPECKIT_ABLATION=true` environment variable.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channels` | string[] | No | Channels to ablate: `vector`, `bm25`, `fts5`, `graph`, `trigger` (default: all) |
| `groundTruthQueryIds` | number[] | No | Subset of ground truth query IDs to evaluate |
| `recallK` | number | No | Recall cutoff K (default: 20) |
| `storeResults` | boolean | No | Persist metrics to eval_metric_snapshots (default: true) |
| `includeFormattedReport` | boolean | No | Include human-readable markdown report (default: true) |

#### Output

```text
MEMORY:ANALYZE ABLATION
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

### Reporting Dashboard

**Trigger:** `/memory:analyze dashboard`

Generates R13-S3 reporting dashboard output with sprint/channel trend aggregation.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sprintFilter` | string[] | No | Sprint label filters |
| `channelFilter` | string[] | No | Channel filters |
| `metricFilter` | string[] | No | Metric-name filters |
| `limit` | number | No | Max sprint groups to return |
| `format` | string | No | `text` (default) or `json` |

#### Output

```text
MEMORY:ANALYZE DASHBOARD
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

## 8. ERROR HANDLING

| Condition | Action |
|-----------|--------|
| Unknown subcommand | `STATUS=FAIL`, list valid subcommands |
| Missing required parameter | `STATUS=FAIL ERROR="Missing <param> for <subcommand>"` |
| Preflight/postflight specFolder mismatch | `STATUS=FAIL ERROR="specFolder must match preflight record"` |
| SPECKIT_ABLATION not enabled | `STATUS=FAIL ERROR="Requires SPECKIT_ABLATION=true"` |
| No causal edges found | Display empty graph message |
| Memory ID not found | `STATUS=FAIL ERROR="Memory #<id> not found"` |
| No learning history records | Suggest using `preflight` before tasks |

---

## 9. RELATED COMMANDS

- `/memory:context`: Intent-aware context retrieval
- `/memory:save`: Save conversation context
- `/memory:manage`: Database management, checkpoints, ingest
- `/memory:learn`: Constitutional memories
- `/memory:continue`: Session recovery
- `/memory:shared`: Shared-memory spaces

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

### Enforcement Matrix

| MODE           | REQUIRED CALLS                  | PATTERN | ON FAILURE     |
| -------------- | ------------------------------- | ------- | -------------- |
| PREFLIGHT      | `task_preflight()`              | SINGLE  | Show error msg |
| POSTFLIGHT     | `task_postflight()`             | SINGLE  | Show error msg |
| CAUSAL TRACE   | `memory_drift_why()`            | SINGLE  | Show error msg |
| CAUSAL LINK    | `memory_causal_link()`          | SINGLE  | Show error msg |
| CAUSAL UNLINK  | `memory_causal_unlink()`        | SINGLE  | Show error msg |
| CAUSAL STATS   | `memory_causal_stats()`         | SINGLE  | Show error msg |
| ABLATION       | `eval_run_ablation()`           | SINGLE  | Show error msg |
| DASHBOARD      | `eval_reporting_dashboard()`    | SINGLE  | Show error msg |
| HISTORY        | `memory_get_learning_history()` | SINGLE  | Show error msg |

### Tool Signatures

```javascript
// Epistemic measurement
spec_kit_memory_task_preflight({ specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, knowledgeGaps, sessionId })
spec_kit_memory_task_postflight({ specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, gapsClosed, newGapsDiscovered })

// Causal graph
spec_kit_memory_memory_drift_why({ memoryId, maxDepth, direction, relations, includeMemoryDetails })
spec_kit_memory_memory_causal_link({ sourceId, targetId, relation, strength, evidence })
spec_kit_memory_memory_causal_unlink({ edgeId })
spec_kit_memory_memory_causal_stats({})

// Evaluation
spec_kit_memory_eval_run_ablation({ channels, groundTruthQueryIds, recallK, storeResults, includeFormattedReport })
spec_kit_memory_eval_reporting_dashboard({ sprintFilter, channelFilter, metricFilter, limit, format })
spec_kit_memory_memory_get_learning_history({ specFolder, sessionId, limit, onlyComplete, includeSummary })
```

### Tool Coverage

| Tool | Layer | Subcommand | Description |
|------|-------|------------|-------------|
| `task_preflight` | L6 | `preflight` | Capture epistemic baseline before task |
| `task_postflight` | L6 | `postflight` | Capture post-task state and learning delta |
| `memory_drift_why` | L6 | `causal` | Trace causal chain for a memory |
| `memory_causal_link` | L6 | `link` | Create causal relationship between memories |
| `memory_causal_stats` | L6 | `causal-stats` | Graph statistics and coverage |
| `memory_causal_unlink` | L6 | `unlink` | Remove causal relationship by edge ID |
| `eval_run_ablation` | L6 | `ablation` | Run controlled channel ablation study |
| `eval_reporting_dashboard` | L6 | `dashboard` | Generate reporting dashboard output |
| `memory_get_learning_history` | L7 | `history` | View PREFLIGHT/POSTFLIGHT records and Learning Index trends |
