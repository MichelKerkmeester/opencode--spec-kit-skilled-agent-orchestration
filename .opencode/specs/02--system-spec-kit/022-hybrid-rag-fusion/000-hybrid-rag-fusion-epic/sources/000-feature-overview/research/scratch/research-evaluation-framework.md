# Evaluation Framework Design for Spec-Kit Memory MCP Server

> **Agent**: 9 (Evaluation Framework Design)
> **Spec**: 140-hybrid-rag-fusion-refinement
> **Date**: 2026-02-26
> **Status**: Complete
> **Evidence Grade**: A (codebase-verified) + B (IR literature)

---

## 1. Current Telemetry Inventory

### 1.1 What Is Already Collected

The system has two telemetry layers, both production-active but limited in scope.

**Layer 1: Retrieval Telemetry** (`lib/telemetry/retrieval-telemetry.ts`)
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:30-63`]

| Metric | Type | Collected | Notes |
|--------|------|-----------|-------|
| `totalLatencyMs` | Latency | Yes | Sum of stage latencies |
| `candidateLatencyMs` | Latency | Yes | Vector/keyword candidate retrieval |
| `fusionLatencyMs` | Latency | Yes | RRF fusion stage |
| `rerankLatencyMs` | Latency | Yes | Cross-encoder/MMR reranking |
| `boostLatencyMs` | Latency | Yes | Session + causal boost |
| `selectedMode` | Mode | Yes | deep/focused/quick |
| `modeOverrideApplied` | Mode | Yes | Boolean |
| `pressureLevel` | Mode | Yes | Token pressure state |
| `tokenUsageRatio` | Mode | Yes | 0-1 ratio |
| `fallbackTriggered` | Fallback | Yes | Boolean |
| `fallbackReason` | Fallback | Yes | String description |
| `degradedModeActive` | Fallback | Yes | Boolean |
| `resultCount` | Quality | Yes | Number of results returned |
| `avgRelevanceScore` | Quality | Yes | Mean of result scores |
| `topResultScore` | Quality | Yes | Highest score |
| `boostImpactDelta` | Quality | Yes | Score delta from boosting |
| `extractionCountInSession` | Quality | Yes | Extraction pipeline count |
| `qualityProxyScore` | Quality | Yes | Composite 0-1 proxy |

**Quality Proxy Formula** (line 206-224):
```
qualityProxy = avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15
```
This is a *self-referential proxy* -- it measures pipeline health, not retrieval relevance.

**Layer 2: Retrieval Trace** (`lib/contracts/retrieval-trace.ts`)
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:14-41`]

Per-stage trace entries with:
- `stage` (candidate | filter | fusion | rerank | fallback | final-rank)
- `inputCount` / `outputCount` per stage
- `durationMs` per stage
- `traceId` for request correlation

**Layer 3: Performance Benchmarks** (`scripts/evals/run-performance-benchmarks.ts`)
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:26-70`]

Offline benchmark script measuring:
- Session boost p95 latency (threshold: <10ms)
- Causal traversal p95 latency (threshold: <20ms)
- Extraction hook p95 latency (threshold: <5ms)
- 1000-concurrent load test
- Baseline vs boosted comparison

**Layer 4: Shadow Evaluation** (`scripts/evals/run-phase1-5-shadow-eval.ts`)
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts:72-98`]

- Spearman rho rank correlation (baseline vs boosted)
- Context error telemetry (pressure simulation)
- Per-intent error breakdown

**Layer 5: Feedback Collection**
- `memory_validate(wasUseful)` handler exists and updates confidence scores
  [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:290-335`]
- `confidence-tracker.ts` records validation events, adjusts confidence (+0.1/-0.05), tracks promotion eligibility
  [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:64-114`]
- `learn_from_selection()` extracts trigger phrases from search query when user selects a result
  [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2872-2928`]

**Layer 6: Dark-Run Diffing** (`lib/search/adaptive-fusion.ts`)
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:245-271`]

- `DarkRunDiff`: standardCount, adaptiveCount, orderDifferences, topResultChanged
- Compares standard RRF vs adaptive fusion rankings

### 1.2 What Is Missing

| Gap ID | Missing Metric | Impact | Priority |
|--------|---------------|--------|----------|
| GAP-01 | **Query logging** -- no queries are persisted to a table | Cannot compute MRR/NDCG offline; cannot build eval corpus from real usage | P0 |
| GAP-02 | **Result-set logging** -- returned result IDs per query not stored | Cannot compute position-aware metrics | P0 |
| GAP-03 | **Selection tracking** -- which result the agent actually used | Cannot compute click-through or MRR from implicit feedback | P0 |
| GAP-04 | **Per-channel contribution** -- which channel(s) contributed each result | Cannot diagnose channel utility or weight optimization | P1 |
| GAP-05 | **MRR@K / NDCG@K / Recall@K** -- no IR quality metrics computed | Cannot measure whether changes improve retrieval | P0 |
| GAP-06 | **Constitutional surfacing rate** -- not tracked as separate metric | Cannot verify constitutional memories always appear | P1 |
| GAP-07 | **Cold-start detection** -- no metric for new sessions with no history | Cannot measure cold-start degradation | P2 |
| GAP-08 | **Cross-session learning signal** -- `learn_from_selection` exists but is not wired to any handler | Trigger phrase learning is dead code | P1 |
| GAP-09 | **A/B test result persistence** -- dark-run diffs are computed but not stored | Cannot aggregate dark-run statistics over time | P1 |
| GAP-10 | **Task success correlation** -- no link between retrieval and task_postflight outcomes | Cannot measure end-to-end impact | P2 |

### 1.3 Existing Eval Dataset Assessment

The existing eval dataset at `z_archive/136-mcp-working-memory-hybrid-rag/scratch/eval-dataset-100.json` is **synthetic and insufficient**:
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/008-mcp-working-memory-hybrid-rag/scratch/eval-dataset-100.json:1-20`]

- 100 queries with synthetic IDs (`mem-add_feature-1` etc.)
- No relevance judgments (only baseline rank positions)
- Only 5 intent buckets (missing `find_decision`, `security_audit`)
- No connection to actual memory content
- Queries are template-generated, not representative of real usage

---

## 2. Evaluation Corpus Design

### 2.1 Golden Dataset Construction Strategy

The golden dataset must be constructed from **real memories** in the production database, not synthetic data. Three-phase approach:

**Phase A: Query Harvesting (requires GAP-01 fix first)**
1. Instrument `handleMemorySearch` and `handleMemoryContext` to log queries to `eval_queries` table
2. Collect 2-4 weeks of real queries (estimated 200-500 queries/week based on single-user agent workflow)
3. Deduplicate and sample by intent category

**Phase B: Relevance Annotation (semi-automated)**
1. For each harvested query, re-run search and capture top-20 results
2. Use the agent's `memory_validate(wasUseful)` signals as weak labels
3. Bootstrap relevance judgments using three heuristics:
   - **Selected**: memory was accessed after search = relevant (grade 2)
   - **Validated useful**: `wasUseful=true` on a memory from that session = highly relevant (grade 3)
   - **Validated not useful**: `wasUseful=false` = not relevant (grade 0)
   - **Not selected**: in top-20 but never accessed = unknown (grade 1, pooled)

**Phase C: Manual Curation (for golden subset)**
1. Sample 50 queries with highest diversity across intents
2. Manually annotate top-20 results with graded relevance (0-3 scale)
3. This becomes the "golden" subset for regression testing

### 2.2 Query Categories

| Category | Description | Target Count | Rationale |
|----------|------------|--------------|-----------|
| **trigger-match** | Exact trigger phrase queries | 30 | Tests trigger matching path; should have near-perfect recall |
| **semantic-search** | Natural language descriptions | 50 | Core use case; tests embedding quality |
| **causal-query** | "Why was this decided?" / decision lineage | 25 | Tests graph channel; `find_decision` intent |
| **cross-folder** | Queries touching multiple spec folders | 25 | Tests diversity and folder-spanning retrieval |
| **intent-specific** | One set per intent type (7 types x 15) | 105 | Tests intent-aware weight adjustment |
| **cold-start** | New session, no working memory | 15 | Tests baseline quality without personalization |
| **multi-concept** | AND queries with 2-5 concepts | 20 | Tests concept intersection search |
| **edge-case** | Empty results, very long queries, special chars | 10 | Robustness testing |
| **TOTAL** | | **280** | |

### 2.3 Statistical Significance

For paired comparison tests (A/B evaluation):

- **MRR difference of 0.05** (meaningful for agent workflow): With variance estimate sigma=0.15, need n >= 72 queries at alpha=0.05, power=0.80 (paired t-test)
- **Per-category minimum**: 15 queries per category allows detecting MRR differences of 0.10 within category
- **Recommendation**: 280 total queries (as above) provides:
  - Aggregate significance for 0.05 MRR difference
  - Per-category significance for 0.10 MRR difference
  - Sufficient for bootstrap confidence intervals with 1000 resamples

### 2.4 Query-Relevance-Judgment Triple Format

```typescript
/**
 * A single evaluation query with graded relevance judgments.
 * Format follows TREC-style qrels with extensions for agent memory.
 */
interface EvalQuery {
  /** Unique query identifier */
  queryId: string;

  /** The actual query text */
  query: string;

  /** Classified intent (auto-detected or manually labeled) */
  intent: IntentType;

  /** Query category from the taxonomy above */
  category: EvalQueryCategory;

  /** Optional: session context for personalized evaluation */
  sessionContext?: {
    sessionId: string;
    workingMemoryIds: number[];
    turnNumber: number;
  };

  /** Graded relevance judgments for known documents */
  judgments: EvalJudgment[];

  /** Source of judgments: manual, implicit, or bootstrapped */
  judgmentSource: 'manual' | 'implicit' | 'bootstrapped';

  /** When this query was harvested (null for synthetic) */
  harvestedAt: string | null;
}

interface EvalJudgment {
  /** Memory ID in the database */
  memoryId: number;

  /** Graded relevance: 0=not relevant, 1=marginal, 2=relevant, 3=highly relevant */
  relevance: 0 | 1 | 2 | 3;

  /** Optional: which search channel(s) surfaced this memory */
  sourceChannels?: ('vector' | 'fts5' | 'bm25' | 'graph')[];

  /** Annotator identifier (manual curation tracking) */
  annotator?: string;

  /** Confidence in this judgment */
  confidence?: number;
}

type EvalQueryCategory =
  | 'trigger-match'
  | 'semantic-search'
  | 'causal-query'
  | 'cross-folder'
  | 'intent-specific'
  | 'cold-start'
  | 'multi-concept'
  | 'edge-case';
```

---

## 3. Metrics Framework

### 3.1 Primary Metrics

| Metric | Formula | K Values | Justification |
|--------|---------|----------|---------------|
| **MRR@K** | 1/rank of first relevant result | K=5, K=10 | Agent typically uses first 1-3 results; K=5 captures this; K=10 for recall safety |
| **NDCG@K** | Graded relevance with position discount | K=5, K=10, K=20 | Accounts for graded relevance (0-3 scale); K=20 for full ranked list quality |
| **Recall@K** | fraction of relevant docs in top-K | K=5, K=10 | Constitutional memories must appear in K=5; K=10 for general recall |

**Why these K values:**
- **K=5**: The MCP tools return results with a default token budget of 1500-2000 tokens. At ~150 tokens per memory summary, this means ~10-13 results max. But the agent practically reads 3-5 results. K=5 matches agent behavior.
- **K=10**: Maximum practical result set. Captures most retrievable relevance.
- **K=20**: Full pipeline output (the system fetches up to `limit*2` internally). Used only for NDCG to measure complete ranking quality.

**Implementation:**

```typescript
/** Compute MRR@K from ranked results against judgments */
function computeMRR(
  rankedIds: number[],
  judgments: Map<number, number>,  // memoryId -> relevance grade
  k: number,
  relevanceThreshold: number = 2   // grade >= 2 counts as "relevant"
): number {
  for (let i = 0; i < Math.min(k, rankedIds.length); i++) {
    const grade = judgments.get(rankedIds[i]) ?? 0;
    if (grade >= relevanceThreshold) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

/** Compute NDCG@K with graded relevance */
function computeNDCG(
  rankedIds: number[],
  judgments: Map<number, number>,
  k: number
): number {
  let dcg = 0;
  for (let i = 0; i < Math.min(k, rankedIds.length); i++) {
    const relevance = judgments.get(rankedIds[i]) ?? 0;
    dcg += (Math.pow(2, relevance) - 1) / Math.log2(i + 2);
  }

  // Ideal DCG: sort all judgments by relevance descending
  const idealRelevances = [...judgments.values()]
    .sort((a, b) => b - a)
    .slice(0, k);
  let idcg = 0;
  for (let i = 0; i < idealRelevances.length; i++) {
    idcg += (Math.pow(2, idealRelevances[i]) - 1) / Math.log2(i + 2);
  }

  return idcg > 0 ? dcg / idcg : 0;
}

/** Compute Recall@K */
function computeRecall(
  rankedIds: number[],
  judgments: Map<number, number>,
  k: number,
  relevanceThreshold: number = 2
): number {
  const totalRelevant = [...judgments.values()].filter(g => g >= relevanceThreshold).length;
  if (totalRelevant === 0) return 1.0; // no relevant docs = perfect recall vacuously

  const topK = new Set(rankedIds.slice(0, k));
  let found = 0;
  for (const [id, grade] of judgments) {
    if (grade >= relevanceThreshold && topK.has(id)) {
      found++;
    }
  }
  return found / totalRelevant;
}
```

### 3.2 Secondary Metrics

| Metric | Description | Computation |
|--------|-------------|-------------|
| **Channel Contribution Rate** | % of final results from each channel | Track `sourceChannels` per result through fusion |
| **Channel Unique Contribution** | Results found by only one channel | Set difference across channel result sets |
| **Result Diversity (ILS)** | Intra-List Similarity via spec-folder overlap | 1 - (unique_folders / result_count) |
| **Latency Breakdown** | Per-stage latency distribution | Already collected in telemetry Layer 1 |
| **Fusion Reorder Rate** | % of results whose rank changed from pre-fusion | Compare channel-specific ranks to final rank |
| **Query Expansion Impact** | Results found only after expansion | Compare pre/post expansion result sets |

### 3.3 Agent-Memory-Specific Metrics

| Metric | Description | Target | Computation |
|--------|-------------|--------|-------------|
| **Constitutional Surfacing Rate** | % of searches where all constitutional memories appear in top-K | 100% at K=5 | Count constitutional IDs in top-K / total constitutional count |
| **Importance-Weighted Recall@K** | Recall weighted by importance tier | > 0.90 for critical+constitutional | Weight: constitutional=4, critical=3, important=2, normal=1, temporary=0.5 |
| **Cold-Start MRR** | MRR for first query in new session | >= 0.70 * warm MRR | Compare MRR for cold-start queries vs. warm queries |
| **Session Personalization Lift** | MRR improvement from session boost | > 0 (measurable) | MRR(with session boost) - MRR(without session boost) |
| **Causal Chain Completeness** | For decision queries, % of causal chain surfaced | > 0.60 | Relevant chain nodes in top-K / total chain length |
| **Tier Stratified Precision** | Precision broken down by importance tier | critical > important > normal | Separate precision computation per tier |
| **Dedup Token Savings** | Tokens saved by session dedup | Track per session | Sum of token counts for dedup-filtered results |

### 3.4 Handling "No Single Right Answer"

Memory retrieval differs from web search because:
1. Multiple memories may be equally valid for a query
2. The "best" result depends on agent task state
3. Constitutional memories are always relevant (by design)

**Solutions:**

1. **Graded relevance (0-3 scale)** instead of binary: Captures degrees of relevance. NDCG naturally handles this.

2. **Set-based metrics alongside ranked metrics**: Compute Recall@K (any relevant in top-K) in addition to MRR (position of first relevant). A system that returns 5 relevant results in positions 2-6 is better than one returning 1 relevant result at position 1.

3. **Intent-conditional evaluation**: Compute metrics separately per intent type. A `find_decision` query has different relevance criteria than `understand`.

4. **Equivalence classes**: Group memories that are "interchangeably relevant" (e.g., same spec folder, same topic). If any member of the equivalence class appears in top-K, count it as a hit. This is particularly important for chunked memories where parent and children overlap semantically.

5. **Weighted judgment pools**: When manual judgments are incomplete, use pooling with depth-K pooling (judge only top-K from each system variant, mark unjudged as grade 1/marginal).

---

## 4. A/B Testing Infrastructure

### 4.1 Dark-Run Comparison Mechanism (Shadow Mode)

The system already has `darkRun` support in `adaptive-fusion.ts`. Extend this to the full pipeline:

```typescript
interface ShadowRunConfig {
  /** Feature being tested */
  featureId: string;

  /** Percentage of queries to shadow (0-100) */
  shadowPercent: number;

  /** Function to produce the experimental pipeline result */
  experimentalPipeline: (query: string, options: SearchOptions) => Promise<SearchResult[]>;

  /** Whether to log full results or just diffs */
  logLevel: 'diff-only' | 'full-results';
}

interface ShadowRunResult {
  /** Unique run identifier */
  runId: string;

  /** Control (production) results */
  controlResultIds: number[];
  controlLatencyMs: number;

  /** Treatment (experimental) results */
  treatmentResultIds: number[];
  treatmentLatencyMs: number;

  /** Computed diff metrics */
  diff: {
    /** Kendall tau rank correlation */
    rankCorrelation: number;
    /** Number of position changes */
    orderDifferences: number;
    /** Top-1 result changed */
    topResultChanged: boolean;
    /** Jaccard similarity of result sets */
    setOverlap: number;
    /** MRR difference (if eval corpus available) */
    mrrDelta: number | null;
    /** NDCG difference (if eval corpus available) */
    ndcgDelta: number | null;
  };

  /** Query metadata for stratification */
  metadata: {
    query: string;
    intent: string;
    sessionId?: string;
    timestamp: string;
  };
}
```

**Integration point**: In `handleMemorySearch` (line ~976 of `handlers/memory-search.ts`), after computing the control result, conditionally execute the experimental pipeline and log the diff. The control result is always returned to the caller.

### 4.2 Statistical Significance at Low Volume

With a single-user agent producing ~50-200 queries/day, standard hypothesis testing is slow. Use these approaches:

**1. Sequential Testing (SPRT)**
Instead of fixed-sample-size tests, use Sequential Probability Ratio Test:
- Decide after each query whether to continue or stop
- Can reach significance 2-3x faster than fixed tests
- Set boundaries: alpha=0.05, beta=0.20, minimum detectable effect=0.05 MRR

```typescript
interface SequentialTestState {
  featureId: string;
  logLikelihoodRatio: number;
  upperBound: number;  // ln((1-beta)/alpha)
  lowerBound: number;  // ln(beta/(1-alpha))
  sampleCount: number;
  decision: 'continue' | 'accept-treatment' | 'accept-control' | null;
}

function updateSequentialTest(
  state: SequentialTestState,
  controlMetric: number,
  treatmentMetric: number,
  effectSize: number = 0.05
): SequentialTestState {
  // Simplified: assume Normal distribution, paired comparison
  const diff = treatmentMetric - controlMetric;
  const z = diff / effectSize;  // Standardized effect

  state.logLikelihoodRatio += z * effectSize - 0.5 * effectSize * effectSize;
  state.sampleCount++;

  if (state.logLikelihoodRatio >= state.upperBound) {
    state.decision = 'accept-treatment';
  } else if (state.logLikelihoodRatio <= state.lowerBound) {
    state.decision = 'accept-control';
  } else {
    state.decision = 'continue';
  }

  return state;
}
```

**2. Bootstrap Confidence Intervals**
After collecting N queries (minimum 50), compute bootstrap CIs:
- Resample 1000 times from paired (control, treatment) metric pairs
- Compute 95% CI for the mean difference
- If CI excludes 0, the difference is significant

**3. Bayesian Approach (Alternative)**
Use Beta-Binomial model for binary success metrics:
- Prior: Beta(1,1) (uniform)
- Update with each query pair
- Report P(treatment > control) directly
- No need for p-values; decision at P > 0.95

### 4.3 Feature Flag Integration

The existing `rollout-policy.ts` provides the foundation:
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:1-59`]

- `isFeatureEnabled(flagName, identity)` already supports deterministic bucketing
- `SPECKIT_ROLLOUT_PERCENT` controls gradual rollout (0-100%)
- `deterministicBucket(identity)` uses hash-based bucketing

**Extension needed:**

```typescript
/** Extended feature flag for A/B evaluation */
interface EvalFeatureFlag {
  /** Environment variable name */
  flagName: string;

  /** Rollout percentage for treatment group */
  rolloutPercent: number;

  /** Whether to run shadow evaluation */
  shadowEnabled: boolean;

  /** Sequential test state */
  testState?: SequentialTestState;

  /** Minimum samples before auto-graduation */
  minSamples: number;

  /** MRR improvement threshold for auto-graduation */
  graduationThreshold: number;
}

// Predefined flags for each refinement recommendation
const EVAL_FLAGS: Record<string, EvalFeatureFlag> = {
  'R01_MULTI_VECTOR': {
    flagName: 'SPECKIT_MULTI_VECTOR',
    rolloutPercent: 0,
    shadowEnabled: true,
    minSamples: 100,
    graduationThreshold: 0.03,
  },
  'R03_GRAPH_SCORING': {
    flagName: 'SPECKIT_GRAPH_SCORING',
    rolloutPercent: 0,
    shadowEnabled: true,
    minSamples: 100,
    graduationThreshold: 0.02,
  },
  // ... one per recommendation
};
```

### 4.4 Result Diffing: Meaningful Difference Definition

Two result sets are "meaningfully different" when:

```typescript
interface DiffSignificance {
  /** Kendall tau-b rank correlation (1.0 = identical, 0 = unrelated) */
  rankCorrelation: number;

  /** Jaccard similarity of top-K result sets */
  setOverlap: number;

  /** Whether the top-1 result changed */
  topResultChanged: boolean;

  /** MRR delta (requires eval corpus) */
  mrrDelta: number | null;
}

/**
 * Meaningful difference thresholds.
 * These are calibrated for agent-memory retrieval where small
 * ranking changes can significantly impact agent behavior.
 */
const DIFF_THRESHOLDS = {
  /** Rank correlation below this = major ranking change */
  rankCorrelationMajor: 0.85,

  /** Rank correlation below this = minor ranking change */
  rankCorrelationMinor: 0.95,

  /** Set overlap below this = substantially different results */
  setOverlapThreshold: 0.70,

  /** MRR delta above this = statistically meaningful (with sufficient samples) */
  mrrDeltaThreshold: 0.03,

  /** Top result change is always flagged */
  topResultChangeWeight: 2.0,
};

function classifyDiff(diff: DiffSignificance): 'identical' | 'minor' | 'major' | 'incompatible' {
  if (diff.rankCorrelation >= 0.99 && diff.setOverlap >= 0.95) return 'identical';
  if (diff.rankCorrelation >= DIFF_THRESHOLDS.rankCorrelationMinor && !diff.topResultChanged) return 'minor';
  if (diff.rankCorrelation >= DIFF_THRESHOLDS.rankCorrelationMajor) return 'major';
  return 'incompatible';
}
```

---

## 5. Feedback Loop Design

### 5.1 How `learnFromSelection` Connects to Evaluation

Current state: `learn_from_selection()` exists at line 2872 of `vector-index-impl.ts` but is **not called** from any handler. It extracts terms from a search query and adds them as trigger phrases to the selected memory.

**Proposed wiring:**

```
Agent calls memory_search(query)
  -> Returns results
  -> Agent reads a memory via Read tool or memory_load
  -> Extraction adapter detects Read of a memory file
     [existing: extraction-adapter.ts hooks tool results]
  -> Match file path to memory_id
  -> Call learnFromSelection(originalQuery, selectedMemoryId)
  -> Log to eval_results table: (queryId, selectedMemoryId, rank, timestamp)
```

**Key requirement**: The original query must be preserved in session context so it is available when the selection signal arrives (potentially many turns later). Store in `working_memory` table or a dedicated `session_queries` field.

### 5.2 How `memory_validate(wasUseful)` Feeds Back

Current flow:
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:64-114`]

```
memory_validate(id, wasUseful=true)
  -> recordValidation(db, memoryId, true)
  -> confidence += 0.10 (clamped to [0, 1])
  -> validationCount++
  -> if confidence >= 0.9 AND validations >= 5: promotionEligible = true
```

**Proposed extensions for evaluation:**

1. **Tag validation with originating query**: When `memory_validate` is called, check if the session has a recent search query. If so, record a `(queryId, memoryId, wasUseful)` triple in `eval_feedback` table.

2. **Negative signal amplification**: Currently `wasUseful=false` only decrements confidence by 0.05. For evaluation, also record which query led to the negative signal -- this identifies retrieval failures.

3. **Batch validation**: After task completion (via `task_postflight`), prompt for batch validation of all memories accessed during the task. This provides task-level success signal.

### 5.3 Implicit Signals

| Signal | Source | What It Means | Collection Method |
|--------|--------|---------------|-------------------|
| **Read after search** | Extraction adapter | Agent found the result useful enough to read | Match Read file paths to memory file_paths |
| **Re-search** | Query log | Agent didn't find what it needed | Detect same-session queries with high semantic similarity |
| **Scroll-past** | Result position | Agent skipped early results | Track which results were in top-K but not accessed |
| **Session length** | Session manager | Longer sessions may indicate search friction | Correlate session turn count with search frequency |
| **Copy/reference** | Extraction adapter | Agent used content from a memory | Detect when agent output contains verbatim memory content |

**Implementation for "Read after search":**

```typescript
interface ImplicitFeedbackEvent {
  eventType: 'read_after_search' | 're_search' | 'scroll_past' | 'reference';
  sessionId: string;
  queryId: string | null;
  memoryId: number;
  timestamp: string;
  metadata: Record<string, unknown>;
}

// In extraction-adapter.ts, when a Read tool result contains a memory file path:
function detectReadAfterSearch(
  toolName: string,
  result: unknown,
  sessionId: string,
  recentQueries: Array<{ queryId: string; resultIds: number[]; timestamp: number }>
): ImplicitFeedbackEvent | null {
  if (toolName !== 'Read') return null;

  const filePath = extractFilePathFromResult(result);
  if (!filePath) return null;

  const memoryId = lookupMemoryByPath(filePath);
  if (!memoryId) return null;

  // Find most recent search that included this memory
  const matchingQuery = recentQueries.find(q => q.resultIds.includes(memoryId));

  return {
    eventType: 'read_after_search',
    sessionId,
    queryId: matchingQuery?.queryId ?? null,
    memoryId,
    timestamp: new Date().toISOString(),
    metadata: { rankInResults: matchingQuery?.resultIds.indexOf(memoryId) ?? -1 },
  };
}
```

### 5.4 Session-Level Feedback

Connect retrieval quality to task outcomes via `task_postflight`:

```typescript
interface SessionEvalSummary {
  sessionId: string;

  /** All queries made during this session */
  queries: Array<{
    queryId: string;
    query: string;
    intent: string;
    resultIds: number[];
    selectedIds: number[];  // Implicit selection via Read
    validatedIds: Array<{ memoryId: number; wasUseful: boolean }>;
  }>;

  /** Task outcome (from task_postflight if available) */
  taskOutcome?: {
    specFolder: string;
    taskId: string;
    knowledgeDelta: number;
    uncertaintyReduction: number;
    learningIndex: number;
  };

  /** Aggregate session metrics */
  aggregateMetrics: {
    totalSearches: number;
    totalMemoriesAccessed: number;
    avgMRR: number | null;  // null if no eval corpus match
    reSearchRate: number;   // fraction of queries that were re-searches
    sessionDurationMinutes: number;
  };
}
```

---

## 6. Implementation Blueprint

### 6.1 Database Schema

```sql
-- ============================================================
-- EVALUATION FRAMEWORK TABLES (Schema Extension)
-- ============================================================

-- Table 1: Query Log (GAP-01, GAP-02 fix)
-- Every search query is logged with its results for offline evaluation.
CREATE TABLE IF NOT EXISTS eval_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_id TEXT NOT NULL UNIQUE,          -- Deterministic: 'eq_' + timestamp + hash
  query TEXT NOT NULL,                     -- The actual query text
  intent TEXT,                             -- Classified intent (7 types)
  mode TEXT,                               -- deep/focused/quick
  session_id TEXT,                         -- Session identifier
  tool_name TEXT NOT NULL,                 -- memory_search | memory_context | memory_match_triggers

  -- Results snapshot
  result_ids TEXT NOT NULL DEFAULT '[]',   -- JSON array of memory IDs in ranked order
  result_count INTEGER NOT NULL DEFAULT 0,

  -- Per-channel contribution (GAP-04 fix)
  channel_contributions TEXT DEFAULT '{}', -- JSON: { "vector": [id,...], "fts5": [...], "bm25": [...], "graph": [...] }

  -- Pipeline metadata
  total_latency_ms REAL,
  fusion_weights TEXT,                     -- JSON: FusionWeights used
  quality_proxy_score REAL,

  -- Telemetry reference
  trace_id TEXT,

  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  -- Eval corpus membership
  is_eval_corpus INTEGER NOT NULL DEFAULT 0,  -- 1 if included in golden dataset
  eval_category TEXT                           -- trigger-match, semantic-search, etc.
);

CREATE INDEX IF NOT EXISTS idx_eval_queries_session ON eval_queries(session_id);
CREATE INDEX IF NOT EXISTS idx_eval_queries_intent ON eval_queries(intent);
CREATE INDEX IF NOT EXISTS idx_eval_queries_created ON eval_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_eval_queries_corpus ON eval_queries(is_eval_corpus) WHERE is_eval_corpus = 1;
CREATE INDEX IF NOT EXISTS idx_eval_queries_tool ON eval_queries(tool_name);

-- Table 2: Relevance Judgments
-- Graded relevance judgments for query-document pairs.
CREATE TABLE IF NOT EXISTS eval_judgments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_id TEXT NOT NULL,                  -- References eval_queries.query_id
  memory_id INTEGER NOT NULL,             -- References memory_index.id
  relevance INTEGER NOT NULL CHECK(relevance BETWEEN 0 AND 3),  -- 0=not, 1=marginal, 2=relevant, 3=highly
  source TEXT NOT NULL CHECK(source IN ('manual', 'implicit', 'bootstrapped', 'validated')),
  annotator TEXT,                          -- Who/what made the judgment
  confidence REAL DEFAULT 1.0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(query_id, memory_id, source)
);

CREATE INDEX IF NOT EXISTS idx_eval_judgments_query ON eval_judgments(query_id);
CREATE INDEX IF NOT EXISTS idx_eval_judgments_memory ON eval_judgments(memory_id);
CREATE INDEX IF NOT EXISTS idx_eval_judgments_source ON eval_judgments(source);

-- Table 3: Eval Results (computed metrics per run)
-- Stores computed metrics for each evaluation run.
CREATE TABLE IF NOT EXISTS eval_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,                    -- Unique eval run identifier
  run_type TEXT NOT NULL CHECK(run_type IN ('full', 'shadow', 'regression', 'ab_test')),
  feature_id TEXT,                         -- Feature being tested (for A/B)

  -- Aggregate metrics
  mrr_at_5 REAL,
  mrr_at_10 REAL,
  ndcg_at_5 REAL,
  ndcg_at_10 REAL,
  ndcg_at_20 REAL,
  recall_at_5 REAL,
  recall_at_10 REAL,

  -- Agent-memory-specific metrics
  constitutional_surfacing_rate REAL,
  importance_weighted_recall REAL,
  cold_start_mrr REAL,
  session_personalization_lift REAL,
  causal_chain_completeness REAL,

  -- Secondary metrics
  avg_latency_ms REAL,
  channel_contribution_json TEXT,          -- JSON breakdown per channel
  result_diversity_score REAL,

  -- Statistical metadata
  query_count INTEGER NOT NULL,
  confidence_interval_lower REAL,
  confidence_interval_upper REAL,

  -- Comparison (for A/B)
  control_run_id TEXT,                     -- Reference to control run
  mrr_delta REAL,
  ndcg_delta REAL,
  p_value REAL,
  is_significant INTEGER,                 -- 1 if p < 0.05

  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  -- Full detail blob
  per_query_results TEXT                   -- JSON array of per-query metrics
);

CREATE INDEX IF NOT EXISTS idx_eval_results_run ON eval_results(run_id);
CREATE INDEX IF NOT EXISTS idx_eval_results_feature ON eval_results(feature_id);
CREATE INDEX IF NOT EXISTS idx_eval_results_type ON eval_results(run_type);
CREATE INDEX IF NOT EXISTS idx_eval_results_created ON eval_results(created_at);

-- Table 4: Implicit Feedback Events (GAP-03 fix)
-- Captures implicit signals from agent behavior.
CREATE TABLE IF NOT EXISTS eval_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL CHECK(event_type IN (
    'read_after_search', 're_search', 'scroll_past', 'reference', 'validate_useful', 'validate_not_useful'
  )),
  session_id TEXT NOT NULL,
  query_id TEXT,                           -- References eval_queries.query_id
  memory_id INTEGER,                       -- References memory_index.id
  rank_in_results INTEGER,                 -- Position of memory in search results (-1 if not from search)
  metadata TEXT DEFAULT '{}',              -- JSON additional context
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_eval_feedback_session ON eval_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_eval_feedback_query ON eval_feedback(query_id);
CREATE INDEX IF NOT EXISTS idx_eval_feedback_type ON eval_feedback(event_type);
CREATE INDEX IF NOT EXISTS idx_eval_feedback_created ON eval_feedback(created_at);

-- Table 5: A/B Test State (persistent sequential test tracking)
CREATE TABLE IF NOT EXISTS eval_ab_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feature_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('running', 'graduated', 'rejected', 'paused')),

  -- Sequential test state
  log_likelihood_ratio REAL NOT NULL DEFAULT 0,
  upper_bound REAL NOT NULL,               -- ln((1-beta)/alpha)
  lower_bound REAL NOT NULL,               -- ln(beta/(1-alpha))
  sample_count INTEGER NOT NULL DEFAULT 0,

  -- Running metrics
  control_mrr_sum REAL NOT NULL DEFAULT 0,
  treatment_mrr_sum REAL NOT NULL DEFAULT 0,
  control_ndcg_sum REAL NOT NULL DEFAULT 0,
  treatment_ndcg_sum REAL NOT NULL DEFAULT 0,

  -- Config
  min_samples INTEGER NOT NULL DEFAULT 100,
  graduation_threshold REAL NOT NULL DEFAULT 0.03,

  -- Timestamps
  started_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  graduated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_eval_ab_status ON eval_ab_tests(status);

-- Table 6: Shadow Run Log (dark-run diffs)
CREATE TABLE IF NOT EXISTS eval_shadow_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_id TEXT NOT NULL,                  -- References eval_queries.query_id
  feature_id TEXT NOT NULL,                -- Which feature was being shadowed

  -- Results comparison
  control_result_ids TEXT NOT NULL,         -- JSON array
  treatment_result_ids TEXT NOT NULL,       -- JSON array

  -- Diff metrics
  rank_correlation REAL,
  set_overlap REAL,
  top_result_changed INTEGER,
  order_differences INTEGER,
  mrr_delta REAL,
  ndcg_delta REAL,

  -- Latency comparison
  control_latency_ms REAL,
  treatment_latency_ms REAL,

  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_eval_shadow_feature ON eval_shadow_runs(feature_id);
CREATE INDEX IF NOT EXISTS idx_eval_shadow_created ON eval_shadow_runs(created_at);
```

### 6.2 TypeScript Interfaces for the Evaluation Pipeline

```typescript
// ---------------------------------------------------------------
// FILE: lib/eval/eval-types.ts
// ---------------------------------------------------------------

import type { IntentType } from '../search/intent-classifier';

/** Query categories for stratified evaluation */
export type EvalQueryCategory =
  | 'trigger-match'
  | 'semantic-search'
  | 'causal-query'
  | 'cross-folder'
  | 'intent-specific'
  | 'cold-start'
  | 'multi-concept'
  | 'edge-case';

/** A single evaluation query with judgments */
export interface EvalQuery {
  queryId: string;
  query: string;
  intent: IntentType | string;
  category: EvalQueryCategory;
  sessionContext?: {
    sessionId: string;
    workingMemoryIds: number[];
    turnNumber: number;
  };
  judgments: EvalJudgment[];
  judgmentSource: 'manual' | 'implicit' | 'bootstrapped';
  harvestedAt: string | null;
}

/** Graded relevance judgment */
export interface EvalJudgment {
  memoryId: number;
  relevance: 0 | 1 | 2 | 3;
  sourceChannels?: ('vector' | 'fts5' | 'bm25' | 'graph')[];
  annotator?: string;
  confidence?: number;
}

/** Metrics computed for a single query */
export interface QueryMetrics {
  queryId: string;
  intent: string;
  category: EvalQueryCategory;
  mrr5: number;
  mrr10: number;
  ndcg5: number;
  ndcg10: number;
  ndcg20: number;
  recall5: number;
  recall10: number;
  constitutionalPresent: boolean;
  importanceWeightedRecall: number;
  latencyMs: number;
  resultCount: number;
}

/** Aggregate evaluation run result */
export interface EvalRunResult {
  runId: string;
  runType: 'full' | 'shadow' | 'regression' | 'ab_test';
  featureId?: string;
  timestamp: string;
  queryCount: number;

  /** Aggregate primary metrics (mean across queries) */
  metrics: {
    mrr5: number;
    mrr10: number;
    ndcg5: number;
    ndcg10: number;
    ndcg20: number;
    recall5: number;
    recall10: number;
  };

  /** Agent-memory-specific metrics */
  agentMetrics: {
    constitutionalSurfacingRate: number;
    importanceWeightedRecall: number;
    coldStartMrr: number | null;
    sessionPersonalizationLift: number | null;
    causalChainCompleteness: number | null;
  };

  /** Per-intent breakdown */
  perIntent: Record<string, {
    queryCount: number;
    mrr5: number;
    ndcg10: number;
    recall10: number;
  }>;

  /** Per-category breakdown */
  perCategory: Record<EvalQueryCategory, {
    queryCount: number;
    mrr5: number;
    ndcg10: number;
  }>;

  /** Bootstrap confidence intervals */
  confidenceIntervals: {
    mrr5: [number, number];
    ndcg10: [number, number];
    recall10: [number, number];
  };

  /** Comparison with control (for A/B) */
  comparison?: {
    controlRunId: string;
    mrrDelta: number;
    ndcgDelta: number;
    pValue: number;
    isSignificant: boolean;
    sequentialTestDecision: 'continue' | 'accept-treatment' | 'accept-control';
  };

  /** Per-query detail */
  perQueryMetrics: QueryMetrics[];
}

/** Evaluation pipeline configuration */
export interface EvalPipelineConfig {
  /** Path to eval corpus JSON file (optional, uses DB if not provided) */
  corpusPath?: string;

  /** K values for metrics computation */
  kValues: { mrr: number[]; ndcg: number[]; recall: number[] };

  /** Minimum relevance grade to count as "relevant" for binary metrics */
  relevanceThreshold: number;

  /** Number of bootstrap resamples for confidence intervals */
  bootstrapResamples: number;

  /** Feature ID for A/B comparison (null for standalone eval) */
  featureId?: string;

  /** Whether to use session context for personalized eval */
  useSessionContext: boolean;

  /** Sampling rate (1.0 = evaluate all, 0.1 = 10% sample) */
  samplingRate: number;
}

/** Default pipeline configuration */
export const DEFAULT_EVAL_CONFIG: EvalPipelineConfig = {
  kValues: {
    mrr: [5, 10],
    ndcg: [5, 10, 20],
    recall: [5, 10],
  },
  relevanceThreshold: 2,
  bootstrapResamples: 1000,
  useSessionContext: false,
  samplingRate: 1.0,
};
```

### 6.3 Integration Points with Existing Search Pipeline

```
INTEGRATION POINT MAP
=====================

1. QUERY LOGGING (GAP-01/GAP-02)
   File: handlers/memory-search.ts (line ~1050, handleMemorySearch)
   Action: After computing results, INSERT into eval_queries
   Overhead: ~1ms (single INSERT, non-blocking)

2. CHANNEL TRACKING (GAP-04)
   File: lib/search/hybrid-search.ts (hybridSearchEnhanced)
   Action: Tag each result with its source channel before fusion
   Overhead: ~0.5ms (set membership per result)

3. SHADOW RUN EXECUTION
   File: handlers/memory-search.ts (after line ~999, telemetry block)
   Action: If shadow config active, re-run with experimental pipeline
   Overhead: ~50-200ms (full pipeline re-execution, async)

4. IMPLICIT FEEDBACK CAPTURE
   File: lib/extraction/extraction-adapter.ts (existing hook)
   Action: When Read tool accesses a memory file, match to recent query
   Overhead: ~0.5ms (path lookup + recent query scan)

5. VALIDATION FEEDBACK LINKAGE
   File: handlers/checkpoints.ts (handleMemoryValidate, line ~291)
   Action: After recordValidation, INSERT into eval_feedback
   Overhead: ~0.5ms (single INSERT)

6. EVALUATION RUN EXECUTION
   File: NEW scripts/evals/run-eval-suite.ts
   Action: Load eval corpus, re-run queries, compute metrics
   Overhead: Offline only (not in hot path)

7. METRICS REPORTING
   File: handlers/memory-health.ts (extend memory_health tool)
   Action: Add eval metrics summary to health report
   Overhead: ~5ms (aggregate query on eval_results)
```

### 6.4 Sampling Strategy to Minimize Overhead

**Hot path overhead budget: < 2ms per query**

| Component | Est. Overhead | Strategy |
|-----------|--------------|----------|
| Query logging (INSERT) | 0.5-1ms | Always-on; single prepared statement, WAL mode |
| Channel tagging | 0.2ms | Always-on; in-memory set operations |
| Implicit feedback check | 0.3ms | Always-on; O(1) path -> memoryId lookup |
| Shadow run | 50-200ms | **Sampled**: 10% of queries (configurable) |
| Full eval computation | 0ms hot path | Offline only; scheduled or manual trigger |

**Sampling implementation:**

```typescript
function shouldShadowRun(queryId: string, config: ShadowRunConfig): boolean {
  // Deterministic sampling based on query ID hash
  const hash = deterministicBucket(queryId);  // Reuse existing rollout-policy function
  return hash < config.shadowPercent;
}
```

**Data retention policy:**
- `eval_queries`: Keep 90 days, then archive to JSON
- `eval_feedback`: Keep 90 days
- `eval_shadow_runs`: Keep 30 days (high volume when shadow mode active)
- `eval_results`: Keep indefinitely (small, one row per eval run)
- `eval_judgments`: Keep indefinitely (golden dataset)
- `eval_ab_tests`: Keep indefinitely (audit trail)

---

## 7. Implementation Sequence

| Phase | Deliverable | Depends On | Estimated Effort |
|-------|-------------|------------|------------------|
| **Phase 1** | Schema migration (6 tables) | None | 1 day |
| **Phase 2** | Query logging in handleMemorySearch + handleMemoryContext | Phase 1 | 1 day |
| **Phase 3** | Channel tagging through fusion pipeline | Phase 2 | 1 day |
| **Phase 4** | Implicit feedback capture (extraction adapter) | Phase 2 | 1 day |
| **Phase 5** | Metrics computation library (MRR, NDCG, Recall) | Phase 1 | 1 day |
| **Phase 6** | Offline eval runner script | Phase 2, 5 | 1 day |
| **Phase 7** | Shadow run infrastructure | Phase 2, 3, 5 | 2 days |
| **Phase 8** | Sequential testing (SPRT) + A/B state management | Phase 7 | 1 day |
| **Phase 9** | Golden dataset construction (query harvesting + annotation) | Phase 2 (after 2-4 weeks data) | 2 days |
| **Phase 10** | Integration with memory_health reporting | Phase 5, 6 | 0.5 day |

**Total estimated effort: 11-12 days**

**Critical path: Phase 1 -> Phase 2 -> (Phase 3 + Phase 4 + Phase 5 in parallel) -> Phase 6 -> Phase 7**

Phase 9 (golden dataset) has a calendar dependency: needs 2-4 weeks of real query data from Phase 2 before annotation can begin. Bootstrap with synthetic queries in the interim.

---

## 8. Relationship to Other Recommendations

This evaluation framework (R13) is the **measurement foundation** that gates all other recommendations:

| Recommendation | How R13 Enables It |
|---------------|-------------------|
| R01 (Multi-vector) | Measure MRR/NDCG improvement from title+content dual vectors via A/B shadow |
| R02 (MMR calibration) | Measure diversity-relevance tradeoff via NDCG + ILS |
| R03 (Graph scoring) | Measure causal chain completeness improvement |
| R04 (BM25 persistence) | Measure cold-start MRR improvement |
| R05 (Query expansion) | Measure recall@K improvement from expansion |
| R06 (Cross-encoder) | Measure NDCG@5 improvement from better reranking |
| R07 (Chunking) | Measure recall improvement for long documents |
| R08 (Learned weights) | Use eval metrics as optimization objective |
| R09-R12 | Infrastructure changes measured via latency/quality regression |
| R14 (Graduation) | Use sequential test to auto-graduate features past significance threshold |

**Without R13, no recommendation can be validated.** Every feature flag graduation should require:
1. Shadow run data showing improvement on eval corpus
2. Sequential test reaching accept-treatment threshold
3. No regression on constitutional surfacing rate
4. Latency increase < 20% at p95

---

*End of Evaluation Framework Design*
