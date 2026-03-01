# Wave 2: Risk Deep-Dive Analysis

> **Date:** 2026-02-26
> **Mission:** Stress-test risk ratings from 141 recommendations document
> **Scope:** Risk accuracy, missing risks, interaction effects, worst-case scenarios, feature flag complexity

---

## Table of Contents

1. [Risk Ratings Accuracy Assessment](#1-risk-ratings-accuracy)
2. [Missing Risks Not Listed in the Matrix](#2-missing-risks)
3. [Interaction Effects Beyond the 6 Key Pairs](#3-interaction-effects)
4. [Worst-Case Scenario Analysis (Top 5)](#4-worst-case-scenarios)
5. [Feature Flag Complexity Analysis](#5-feature-flag-complexity)
6. [Revised Risk Matrix](#6-revised-risk-matrix)
7. [Summary](#7-summary)

---

## 1. Risk Ratings Accuracy

### 1.1 HIGH-Risk Items: Are Ratings Justified?

**R11 (Learned Relevance Feedback) -- Rated HIGH for Regression, HARD for Rollback**

**VERDICT: JUSTIFIED, possibly UNDER-RATED.**

Evidence from codebase [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2872-2928`]:

```typescript
function learn_from_selection(search_query: string, selected_memory_id: number) {
  // ...
  const updated = [...existing, ...new_terms].slice(0, MAX_TRIGGERS_PER_MEMORY);
  database.prepare(
    'UPDATE memory_index SET trigger_phrases = ? WHERE id = ?'
  ).run(JSON.stringify(updated), selected_memory_id);
}
```

The function directly mutates `trigger_phrases` in `memory_index` -- the same column that drives FTS5 matching, trigger-phrase matching in `memory_match_triggers`, and the term-match bonus in `fuseScoresAdvanced()`. A single polluted trigger phrase cascades through three retrieval channels simultaneously. The existing stop_words list has only 25 entries [SOURCE: vector-index-impl.ts:2896-2899], and there is no provenance tagging, no TTL, and no undo mechanism. The HIGH rating is justified. The "HARD" rollback rating is also correct: once triggers are written to `memory_index`, there is no mechanism to distinguish learned triggers from manually authored ones without the proposed `[learned:]` prefix.

**R4+R10 Pair (Amplification Loop) -- Rated HIGH**

**VERDICT: JUSTIFIED.** The document correctly identifies that auto-extracted edges (R10) inflate degree counts that R4 uses for scoring. With `strength=0.5` for auto-edges, the attenuation is present but may be insufficient at scale. See Section 3 for the expanded feedback loop analysis.

### 1.2 LOW-Risk Items: Hidden Risks

**R6 (4-Stage Pipeline Refactor) -- Rated LOW for Regression**

**VERDICT: UNDER-RATED. Should be MEDIUM.**

Evidence: The current pipeline in `hybridSearchEnhanced()` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:411-618`] has deeply interleaved stages. The function:
1. Builds ranked lists (candidate generation)
2. Applies adaptive fusion via `hybridAdaptiveFuse()` inline at line 508
3. Applies MMR reranking at line 527-576
4. Applies co-activation spreading at line 584-608
5. Re-sorts after boost at line 605

Refactoring this into 4 clean stages requires extracting co-activation (imported from `../cache/cognitive/co-activation`), MMR (imported from `./mmr-reranker`), and adaptive fusion (imported from `./adaptive-fusion`) into a pipeline composition. The risk is NOT "no data change" -- the risk is subtle ordering changes from floating-point accumulation differences when intermediate results are passed between stages vs. computed inline. The document's go/no-go ("0 ordering differences on eval corpus") is correct mitigation, but the risk rating should reflect that achieving zero differences will be harder than it appears.

**R8 (Memory Summaries) -- Rated LOW for Regression**

**VERDICT: ACCURATELY RATED.** Additive column, no existing behavior changed. The only hidden risk is if summary generation introduces latency into the save path, but this is an implementation concern, not a regression risk.

**R14/N1 (Relative Score Fusion) -- Rated LOW for Regression**

**VERDICT: UNDER-RATED. Should be MEDIUM.**

The document says "~80 LOC. Parallel to existing `rrf-fusion.ts`." However, the actual RRF fusion module [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts:1-362`] includes complex multi-variant cross-variant fusion (`fuseResultsCrossVariant` at line 265-326) that is not mentioned. Relative Score Fusion must handle:
- Single-pair fusion (equivalent to `fuseResults`)
- Multi-list fusion (equivalent to `fuseResultsMulti`)
- Cross-variant fusion (equivalent to `fuseResultsCrossVariant`)

The 80 LOC estimate covers only the first case. The full replacement is closer to 200-250 LOC and requires careful parity testing across all three fusion paths.

**R9 (Spec Folder Pre-Filter) -- Rated LOW**

**VERDICT: ACCURATELY RATED but with a caveat.** Pre-filtering before search is indeed low-risk IF the confidence threshold is well-calibrated. The hidden risk: at `SPECKIT_PREFILTER_CONFIDENCE=0.8`, the system might pre-filter when the intent classifier is confidently wrong, silently excluding relevant cross-folder memories. This is a "silent accuracy degradation" -- the user never sees what was excluded.

**N3 (Memory Consolidation) -- Rated LOW for Regression, MEDIUM for Perf Impact**

**VERDICT: UNDER-RATED for Regression. Should be MEDIUM.** See Section 2.4 for the runaway edge growth analysis.

**N4 (Cold-Start Boost) -- Rated LOW for Regression**

**VERDICT: ACCURATELY RATED.** The formula `alpha * exp(-elapsed_hours / tau)` is deterministic, bounded (max +15%, decays to negligible in 48h), and easy to feature-flag off. The boost is additive, not multiplicative, so it cannot create runaway amplification.

**R15 (Query Complexity Router) -- Rated LOW for Regression**

**VERDICT: UNDER-RATED. Should be MEDIUM.**

The router decides how many channels to activate. If it misclassifies a complex query as "simple," it routes to single-channel vector with limit=3, potentially missing critical memories that would have surfaced through FTS/BM25/graph channels. This is a "silent recall degradation" that is difficult to detect without evaluation infrastructure (R13). The MEDIUM rating is warranted because the failure mode is invisible -- the user gets fewer results but does not know they missed something.

### 1.3 Summary of Rating Corrections

| Rec | Original Rating | Corrected Rating | Reason |
|-----|----------------|-----------------|--------|
| R6 | LOW | MEDIUM | Interleaved pipeline extraction harder than described |
| R14/N1 | LOW | MEDIUM | 3 fusion variants, not just 1; effort underestimated |
| R15 | LOW | MEDIUM | Silent recall degradation from misclassification |
| N3 | LOW | MEDIUM | Runaway edge growth risk (see Section 2) |
| R11 | HIGH | HIGH (confirmed) | Mutation cascades through 3 retrieval channels |

---

## 2. Missing Risks Not Listed in the Matrix

### 2.1 MISSING: Data Corruption During Concurrent Read/Write

**Risk Level: MEDIUM**

The system uses SQLite WAL mode with a 10-second busy timeout [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1179-1180`]:

```typescript
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 10000');
```

Several proposed recommendations introduce new write paths that execute during search operations:
- **R11** writes to `trigger_phrases` column during relevance feedback
- **N3** writes new causal edges during consolidation
- **R13** writes to a separate `speckit-eval.db` during logging
- **N4** potentially reads `created_at` while R8 writes summaries

For R13, the document wisely proposes a separate database. But R11 and N3 both write to the primary `memory_index` and `causal_edges` tables respectively, during or immediately after search operations. Under better-sqlite3's synchronous model, writes block reads on the same connection. Since the MCP server is single-connection, R11's write-during-search and N3's background consolidation writes could introduce latency spikes.

**Mitigation not mentioned in document:** R11 should defer writes to a post-response queue. N3 should use a dedicated WAL connection or schedule during confirmed idle periods.

### 2.2 MISSING: Feature Flag Explosion (Combinatorial Testing Nightmare)

**Risk Level: HIGH**

The document proposes 17 new flags + 7 existing = 24 total flags. See Section 5 for the full analysis. The short version: 2^24 = 16,777,216 possible flag combinations. Even with strong independence assumptions, the interacting flags create a testing surface that is practically untestable. This is a systemic risk that affects the entire recommendation set, not just individual items.

### 2.3 MISSING: R13 Observer Effect (Evaluation Infrastructure Changes Search Behavior)

**Risk Level: LOW-MEDIUM**

The document claims R13 has "NONE" risk for interaction effects ("Passive observation... Logging doesn't affect ranking"). This is incorrect in two ways:

1. **Performance observer effect:** Every query now writes to `speckit-eval.db`. Even with a separate database, the eval logger introduces I/O on every search path. The document estimates 9MB for 90 days of logging, but the per-query overhead includes 3 table inserts (`eval_queries`, `eval_channel_results` for each channel, `eval_final_results` for each result). For a query returning 20 results from 4 channels, that is 1 + 4 + 20 = 25 INSERT statements per query. At current SQLite write speeds, this adds 5-15ms of overhead to every search operation.

2. **Behavioral observer effect:** If evaluation metrics are surfaced to the developer (via `memory_stats` or a dashboard), the developer may tune parameters to optimize the metrics rather than actual usefulness. This is Goodhart's Law applied to retrieval metrics. The proposed mitigation is to ensure metrics are used for relative A/B comparison (shadow scoring), not absolute target optimization.

**Why the document's "NONE" rating is wrong:** R13 does affect performance (quantifiably) and could affect behavior (indirectly). Should be rated LOW-MEDIUM for Perf Impact.

### 2.4 MISSING: N3 Runaway Edge Growth (Memory Consolidation Creates Unbounded Edges)

**Risk Level: HIGH**

The consolidation process proposed in N3 does four things:
1. Auto-create causal links between semantically similar unlinked memories
2. Merge near-duplicate memories
3. Strengthen edges traversed during retrieval (Hebbian learning)
4. Detect contradiction clusters

Items 1 and 3 create a **positive feedback loop with no natural bound:**

- **Consolidation run 1:** Finds 50 similar pairs among 500 memories. Creates 50 new edges. Graph now has N+50 edges.
- **Consolidation run 2:** The 50 new edges increase connectivity. Spreading activation now reaches more memories. Some newly-connected memories are "semantically similar" to each other. Creates 30 more edges.
- **Consolidation run 3:** The graph is even denser. More pairs are reachable. More edges created.

The causal_edges table has no upper bound on edge count per node [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`]. The `MAX_EDGES_LIMIT = 100` constant at line 38 is a query limit, not a storage limit. The `insertEdge` function at line 89 uses `ON CONFLICT ... DO UPDATE` which prevents duplicate (source, target, relation) triples, but the same pair can have up to 6 different relation types, yielding up to 6 edges between any two nodes.

**Projected growth:** Starting from ~100 edges, with daily consolidation creating ~30 edges/run, after 90 days the graph would have ~2,800 edges. This changes the performance characteristics of every CTE-based graph traversal in `causal-boost.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:118-157`], which uses a recursive CTE with `UNION ALL` that grows exponentially with edge density.

**Mitigation not mentioned in document:**
- Cap edges per node (e.g., MAX_EDGES_PER_NODE = 20)
- Require auto-created edges to have `strength < 0.5` (they do mention this)
- Add edge garbage collection: edges with strength < 0.1 after N consolidation cycles are pruned
- Track edge creation source (manual vs auto vs consolidation) for selective cleanup

### 2.5 MISSING: Trigger Phrase Pollution from R11 Is Irreversible In Practice

**Risk Level: HIGH**

The document proposes safeguards for R11: provenance tracking (`[learned:]` prefix), 30-day TTL, denylist. But examining the actual data flow:

1. Learned triggers are written to `trigger_phrases` (JSON array in `memory_index`)
2. Trigger phrases are used to populate the FTS5 index (`memory_fts`)
3. FTS5 is rebuilt from `memory_index` data

The `[learned:]` prefix is stored in the JSON array but the FTS5 tokenizer strips punctuation and special characters. The string `[learned:deploy]` becomes tokenized as `learned` and `deploy` in FTS5 -- meaning the prefix is invisible to the FTS search channel. The trigger matcher may preserve the prefix, but FTS contamination is irreversible without a full FTS rebuild.

**Even with TTL:** If a learned trigger expires after 30 days, removing it from the JSON array requires an FTS5 re-index to remove the contaminated tokens from the full-text search index. The document does not mention this re-indexing requirement.

**Mitigation not mentioned:** Store learned triggers in a separate column (`learned_triggers TEXT`) rather than appending to the existing `trigger_phrases` column. This prevents FTS5 contamination entirely.

### 2.6 MISSING: Schema Migration Risk for Multi-Column Changes

**Risk Level: MEDIUM**

The recommendations propose 4 schema changes:
- R8: `ALTER TABLE memory_index ADD COLUMN summary TEXT`
- R13: 5 new tables in separate `speckit-eval.db`
- R16: `ALTER TABLE memory_index ADD COLUMN encoding_intent TEXT`
- R18: New `embedding_cache` table

SQLite `ALTER TABLE ADD COLUMN` is safe and non-destructive. However, if R8 and R16 are applied across different rollout phases, they require separate migrations. The risk is not the individual changes but the **migration ordering and versioning.** The document does not mention a migration framework or version tracking mechanism. If a user skips Phase 1 and jumps to Phase 3, the assumed column additions may not exist.

**Mitigation not mentioned:** Add a `schema_version` table or use SQLite's `user_version` pragma to track applied migrations.

### 2.7 MISSING: Embedding Model Lock-In from R18 (Embedding Cache)

**Risk Level: LOW-MEDIUM**

R18 proposes caching embeddings keyed by `(content_hash, model_id)`. This is correctly designed for model versioning. However, the hidden risk is that the cache makes model upgrades more expensive to validate: when switching embedding models, the cache must be entirely invalidated for the old model, and all memories re-embedded. With 500+ memories, this is 500+ API calls -- exactly the cost the cache was designed to avoid.

The document mentions this implicitly ("keyed by model_id"), but does not address the operational risk: a model upgrade that should be a parameter change becomes a full re-indexing event with potential downtime.

---

## 3. Interaction Effects Beyond the 6 Key Pairs

The document lists 6 interaction pairs. The following additional dangerous combinations were identified:

### 3.1 R1 (MPAB) + N4 (Cold-Start Boost): Double-Boosting Fresh Multi-Chunk Memories

**Risk: MEDIUM-HIGH**

Scenario: A new memory is saved with 3 chunks. Within the first 12 hours:
- **N4** gives it +15% cold-start boost (applied to the composite score)
- **R1** applies MPAB aggregation: `S_max + 0.3 * SUM(S_remaining) / sqrt(3)`

If the memory's 3 chunks all score highly (e.g., 0.8, 0.7, 0.6), MPAB yields: `0.8 + 0.3 * (0.7 + 0.6) / sqrt(3) = 0.8 + 0.225 = 1.025` (capped to 1.0).

Then N4 applies: `1.0 * 1.15 = 1.15`

This fresh multi-chunk memory now scores higher than any single-chunk memory regardless of semantic relevance. The combination creates a systematic bias toward recently-saved, multi-chunk content.

**Why the document missed it:** R1 and N4 are in different phases (Phase 1 and Phase 1 respectively), but their interaction is not tested because MPAB is tested with static scores and N4 is tested with single-chunk memories.

**Mitigation:** Apply N4 cold-start boost BEFORE MPAB aggregation (to individual chunk scores, not the aggregated score). Or: cap the combined MPAB+N4 boost to `MAX_COMBINED_BOOST`.

### 3.2 R4 (Degree as 5th Channel) + N3 (Consolidation): Feedback Amplification Loop

**Risk: HIGH**

This is listed in the document as R4+R10 ("auto-edges need 50% strength"), but the R4+N3 interaction is MORE dangerous than R4+R10:

- **N3 Consolidation** creates edges between semantically similar memories AND strengthens edges traversed during retrieval
- **R4** uses typed-weighted degree as a scoring channel
- High-degree nodes rank higher (R4) -> they appear in more search results -> they are traversed more -> N3 strengthens their edges -> their degree increases further

This is a classic preferential attachment / "rich get richer" dynamic. Unlike R10 (which creates edges with `strength=0.5`), N3 also STRENGTHENS existing edges (Hebbian learning), meaning the loop accelerates over time.

**Projected impact:** After 30 consolidation cycles (1 month of daily runs), a hub memory that starts with 10 edges could accumulate 30+ edges with increasing strength, making it appear in the top-5 for almost every query regardless of actual semantic relevance.

**Mitigation not mentioned:**
- N3's Hebbian strengthening should have a `MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05`
- R4 should use a degree staleness penalty: if degree hasn't changed in 7+ days, its contribution decays
- N3 should be aware of R4: consolidation should NOT create edges that would push any node's degree above a `MAX_DEGREE_CAP = 25`

### 3.3 R15 (Complexity Router) + R2 (Channel Minimum-Representation): Guarantee Violation

**Risk: MEDIUM**

- **R15** routes "simple" queries to single-channel vector search with limit=3
- **R2** guarantees at least 1 result from each active channel in top-K

When R15 activates for a "simple" query:
- Only the vector channel is active
- R2's constraint is trivially satisfied (1 of 1 channels represented)
- But the GUARANTEE that diverse signals are included is violated

This means simple queries lose the error correction that multi-channel retrieval provides. If the vector search returns a semantic near-miss (high embedding similarity but wrong topic -- a known failure mode for embedding models), there is no FTS/BM25/graph channel to correct it.

**Why this matters:** The document positions R2 as a quality safeguard ("ensure at least 1 result from each active channel"). R15 undermines this safeguard by deactivating channels. The document does not note this tension.

**Mitigation:** R15's "simple" mode should activate a minimum of 2 channels (vector + FTS at minimum), not 1. The efficiency gain from dropping BM25 and graph is still significant (~40% reduction) while preserving error correction.

### 3.4 R12 (Query Expansion) + R15 (Complexity Router): Contradictory Logic

**Risk: LOW-MEDIUM**

- **R12** expands queries to increase recall (generates 3 variant queries)
- **R15** routes simple queries to reduced retrieval depth

If R15 classifies a query as "simple" and limits it to single-channel, but R12 is also active and generates 3 variant queries, the system simultaneously says "this query is simple, use less resources" AND "this query needs expansion, use more resources."

The likely resolution is that R15 runs first (it is in the candidate generation stage) and R12 runs second (also candidate generation), but the document does not specify ordering or mutual exclusion. If both run, the system wastes the efficiency gains of R15 by expanding with R12.

**Mitigation:** R15 and R12 should be mutually exclusive: if R15 classifies as "simple," R12's expansion should be suppressed. If R12 activates, R15 should not downgrade the query.

### 3.5 N4 (Cold-Start) + R11 (learnFromSelection): Fresh Memory Learns Before Calibration

**Risk: MEDIUM**

- **N4** boosts new memories for 48 hours
- **R11** learns from selection when a memory is NOT in top 3

Scenario: A new memory is created. N4 boosts it into the top-3 for 24 hours. After 48 hours, the boost decays and the memory drops to position 6. A user now searches, finds it at position 6, selects it. R11 triggers: "not in top-3, let's learn."

R11 adds the query terms as triggers. But the memory was ONLY dropped out of top-3 because N4's boost expired, not because it was poorly indexed. The learned triggers are based on a transient ranking artifact, not genuine relevance.

**Mitigation:** R11 should exclude memories created within 72 hours (1.5x N4's decay window) from the learning eligibility check. Or: R11 should check if the memory had EVER been in top-3 for similar queries before learning.

### 3.6 R13 (Eval Logging) + R15 (Complexity Router): Metrics Skew

**Risk: LOW-MEDIUM**

R13 computes MRR@5, NDCG@10, Recall@20. But R15 routes simple queries to limit=3. This means:
- MRR@5: Only 3 results available, positions 4-5 are always empty
- Recall@20: Only 3 results available, recall is artificially low
- NDCG@10: Only 3 results available, NDCG is dominated by positions 1-3

If 40-60% of queries are "simple" (as R15 claims), then the aggregate metrics are heavily biased by truncated result sets. The evaluation framework would show artificially low recall and artificially high MRR for the overall system.

**Mitigation:** R13 should record the `query_complexity` classification from R15 and compute metrics PER complexity tier. Aggregate metrics should be weighted by actual user value, not dominated by simple-query artifacts.

### 3.7 Summary: Interaction Risk Matrix (Expanded)

| Pair | Risk Level | Category | In Document? |
|------|-----------|----------|-------------|
| R1 + R4 | LOW | Additive | Yes |
| R1 + R7 | MEDIUM | Ordering | Yes |
| R4 + R10 | HIGH | Amplification | Yes |
| R11 + R12 | MEDIUM | Circular | Yes |
| R6 + ALL | LOW | Structural | Yes |
| R13 + ALL | NONE (claimed) | Passive | Yes (but wrong) |
| **R1 + N4** | **MEDIUM-HIGH** | **Double-boost** | **NO** |
| **R4 + N3** | **HIGH** | **Feedback loop** | **NO** |
| **R15 + R2** | **MEDIUM** | **Guarantee violation** | **NO** |
| **R12 + R15** | **LOW-MEDIUM** | **Contradictory** | **NO** |
| **N4 + R11** | **MEDIUM** | **Transient artifact** | **NO** |
| **R13 + R15** | **LOW-MEDIUM** | **Metrics skew** | **NO** |

---

## 4. Worst-Case Scenario Analysis (Top 5)

### 4.1 Scenario 1: R11 -- "The Deploy Disaster" (Trigger Pollution Cascade)

**Setup:** R11 is enabled. A developer is working on a deployment pipeline. They search "deploy to production," and select a memory about database migrations (which mentions "deploy" in passing).

**What happens:**
1. R11 learns: adds "deploy" and "production" as triggers to the migration memory
2. FTS5 re-indexes: "deploy" and "production" are now full-text searchable tokens for this memory
3. Next search for "deploy new feature": the migration memory now matches on both FTS5 ("deploy") AND trigger matching ("deploy", "production")
4. The convergence bonus in RRF (+0.10) fires because it appears in multiple channels
5. The migration memory is now systematically ranked in top-3 for ALL deployment queries

**Cascade:** Other users search for deployment topics, see the migration memory, skip it. R11 does NOT learn from skips (only from selections). The polluted triggers persist for 30 days. During those 30 days, every deployment search is contaminated.

**Detection time:** The pollution is silent. Without R13's evaluation infrastructure, there is no metric to detect the recall degradation for deployment queries. If R13 IS running, it would show declining MRR@5 for the "deploy" query family, but only after sufficient ground truth annotations exist for comparison.

**Blast radius:** All queries containing "deploy" or "production" (estimated 5-15% of all queries in a typical development workflow).

**Recovery cost:** Identify polluted triggers (requires scanning all `trigger_phrases` for `[learned:]` prefix), remove them, rebuild FTS5 index. If the `[learned:]` prefix was not implemented correctly (see Section 2.5 on FTS5 tokenization), manual inspection of every memory's trigger phrases is required.

### 4.2 Scenario 2: R4 + N3 -- "The Hub Collapse" (Preferential Attachment Runaway)

**Setup:** R4 (degree as 5th channel) and N3 (consolidation) are both enabled. A "spec-kit architecture overview" memory has 15 causal edges (high but not extreme).

**Week 1-2:** N3 consolidation runs daily. It finds 8 memories semantically similar to the architecture overview. Creates 8 new `supports` edges (strength=0.5). The overview now has 23 edges. R4's degree score: `log(1 + 23 * weighted) / log(1 + max)` -- already ranking in top-5 for most queries.

**Week 3-4:** The overview appears in search results frequently. N3's Hebbian learning strengthens edges that were traversed. 15 of the 23 edges are strengthened from 0.5 to 0.7. The typed-weighted degree increases further. N3 finds 5 more similar memories and creates edges.

**Week 5-6:** The overview has 28 edges with average strength 0.65. It appears in top-3 for 60% of all queries. The causal boost CTE [SOURCE: causal-boost.ts:118-157] now walks 28 edges at hop 1, potentially 100+ at hop 2. Query latency for searches involving this memory increases from ~30ms to ~80ms.

**Week 8:** The overview is in top-1 for 40% of queries. It has become a "gravity well" -- other memories are ranked lower because the overview absorbs their graph signal. The system effectively has a single answer for most questions.

**Detection:** If R13 is running, the "top-5 unique memory ID diversity" metric would show declining diversity. But without R13, the degradation is invisible until a user notices that the same memory keeps appearing.

**Recovery:** Delete consolidation-created edges (requires source tracking). Reset R4's degree normalization. But the Hebbian-strengthened edges are indistinguishable from manually-strengthened ones without provenance tracking.

### 4.3 Scenario 3: R15 -- "The Silent Recall Black Hole" (Complexity Misclassification)

**Setup:** R15 (complexity router) is enabled. A developer asks: "what is the decision about embedding models?"

**What happens:**
1. R15 classifies this as "simple" (short query, single question word, looks like a factual lookup)
2. Routes to single-channel vector search with limit=3
3. Vector search returns 3 results: all about "embedding" in the technical sense, but none about the specific DECISION about embedding model selection
4. The actual relevant memory (a decision-record about choosing HuggingFace vs. Voyage) has low vector similarity because its embedding emphasizes "model comparison" and "trade-offs," not "embedding models"

**What SHOULD have happened:**
- FTS channel would have matched on "decision" keyword (FTS5 weights `title` at 10x)
- Graph channel would have found the decision through the spec document chain (decision-record SUPPORTS plan)
- BM25 would have matched on "embedding models" as a phrase

**User experience:** Gets 3 wrong results. Searches again with different wording. Maybe gets the right result on the 3rd try. Total time wasted: 2-3 minutes. But the user never knows the system had the answer and just didn't look in the right channel.

**Frequency:** With 40-60% of queries routed as "simple," even a 5% misclassification rate means 2-3% of ALL queries silently lose recall. Over 100 queries/day, that is 2-3 silently degraded results daily.

### 4.4 Scenario 4: N3 -- "The Contradiction Cluster Explosion"

**Setup:** N3 (consolidation) is enabled. The codebase has a history of architectural decisions that were reversed: decision A was made, then contradicted by decision B, which was then superseded by decision C.

**What happens:**
1. N3 runs contradiction cluster detection. Finds memories A, B, C with existing `contradicts` and `supersedes` edges.
2. N3 also finds memory D (a research document that discusses the trade-offs) is semantically similar to all three. Creates `supports` edges from D to A, B, and C.
3. N3 finds memory E (an implementation that followed decision C) and creates a `derived_from` edge from E to C.
4. Next consolidation run: D now has 3 edges, making it a minor hub. N3 finds memories F, G (other research docs) similar to D. Creates edges.

**The cluster grows:** After 5 consolidation cycles, the contradiction cluster has expanded from 3 members to 12. The graph traversal in `causal-boost.ts` walks this cluster for every query that touches any member. The `contradicts` relation has a 0.8 multiplier, so contradiction edges dampen scores -- but the cluster's sheer size means walk-score accumulation still produces high boost values.

**Impact:** Searching for anything related to the original architectural topic now surfaces the entire contradiction cluster (12 memories) regardless of which specific decision the user is asking about. The signal-to-noise ratio collapses for this topic.

**Detection:** R13's "channel attribution" metric would show graph channel contributing disproportionately for this topic area. But if the user is asking about the topic, getting related results is not obviously wrong -- it is just noisy.

### 4.5 Scenario 5: Feature Flag Interaction -- "The Untested State"

**Setup:** Development progresses through Phases 1-3. At the end of Phase 3, the following flags are enabled: SPECKIT_DOCSCORE_AGGREGATION, SPECKIT_DEGREE_BOOST, SPECKIT_NOVELTY_BOOST, SPECKIT_LEARN_FROM_SELECTION, SPECKIT_CHANNEL_MIN_REP, SPECKIT_COMPLEXITY_ROUTER, SPECKIT_CONSOLIDATION, SPECKIT_PIPELINE_V2.

**What happens:** Each flag was tested individually during its phase. Each interaction pair was tested during rollout. But the 8-flag combination has never been tested together.

**The emergent behavior:**
1. R15 (complexity router) classifies a query as "moderate" -> activates all 4 channels
2. R1 (MPAB) aggregates chunk scores for multi-chunk memories
3. R4 (degree) boosts high-connectivity memories
4. N4 (cold-start) boosts recent memories
5. R2 (channel min-rep) forces at least 1 result from the graph channel
6. The graph channel result has high degree (boosted by N3 consolidation)
7. MPAB aggregation further boosts it (it has 3 chunks)
8. Cold-start also boosts it (created 6 hours ago)

**Result:** A mediocre memory that happened to be (a) recently created, (b) multi-chunked, and (c) connected to a hub node in the graph receives triple-boosting and lands at position 1, displacing a genuinely relevant memory.

**Why this is hard to detect:** Each individual boost is small and well-bounded. R4 caps at 0.15. N4 caps at 0.15. MPAB adds ~0.1. The combined effect is ~0.4, which on a 0-1 scale can shift a memory from position 8 to position 1. But no individual metric flags the problem.

---

## 5. Feature Flag Complexity Analysis

### 5.1 Flag Inventory

**Existing flags (7):**

| Flag | Default | Module |
|------|---------|--------|
| SPECKIT_CAUSAL_BOOST | ON | causal-boost.ts |
| SPECKIT_ADAPTIVE_FUSION | ON | adaptive-fusion.ts |
| SPECKIT_MMR | ON | search-flags.ts |
| SPECKIT_MULTI_QUERY | ON | search-flags.ts |
| SPECKIT_CROSS_ENCODER | ON | search-flags.ts |
| SPECKIT_EXTENDED_TELEMETRY | ON | retrieval-telemetry.ts |
| SPECKIT_ROLLOUT_PERCENT | 100 | rollout-policy.ts |

**New flags (17):**

| Flag | Default | Knob Flags |
|------|---------|-----------|
| SPECKIT_DOCSCORE_AGGREGATION | false | SPECKIT_DOCSCORE_METHOD |
| SPECKIT_CHANNEL_MIN_REP | false | SPECKIT_CHANNEL_MIN_COUNT |
| SPECKIT_DEGREE_BOOST | false | SPECKIT_DEGREE_BOOST_CAP |
| SPECKIT_PIPELINE_V2 | false | - |
| SPECKIT_CHUNK_THINNING | false | SPECKIT_THIN_THRESHOLD |
| SPECKIT_MEMORY_SUMMARIES | false | SPECKIT_SUMMARY_MAX_TOKENS |
| SPECKIT_SPEC_PREFILTER | false | SPECKIT_PREFILTER_CONFIDENCE |
| SPECKIT_AUTO_ENTITIES | false | SPECKIT_ENTITY_MIN_CONFIDENCE |
| SPECKIT_LEARN_FROM_SELECTION | false | SPECKIT_LEARN_MAX_TERMS |
| SPECKIT_EMBEDDING_EXPANSION | false | SPECKIT_EXPANSION_VARIANTS |
| SPECKIT_EVAL_LOGGING | true | SPECKIT_EVAL_SAMPLE_RATE |
| SPECKIT_RSF_FUSION | false | - |
| SPECKIT_COMPLEXITY_ROUTER | false | - |
| SPECKIT_ENCODING_INTENT | false | - |
| SPECKIT_CONSOLIDATION | false | SPECKIT_CONSOLIDATION_INTERVAL_HOURS |
| SPECKIT_NOVELTY_BOOST | false | SPECKIT_NOVELTY_ALPHA, SPECKIT_NOVELTY_TAU |

**Total: 24 boolean flags + 12 knob parameters = 36 configuration points.**

### 5.2 Theoretical Complexity

- **Boolean flags only:** 2^24 = 16,777,216 combinations
- **With knob parameters:** Effectively infinite (continuous parameter space)

### 5.3 Practical Testing Surface

Not all flags interact. Using the interaction analysis from Section 3, the flags cluster into independence groups:

**Group A: Search Pipeline (high interaction)**
- SPECKIT_DOCSCORE_AGGREGATION (R1)
- SPECKIT_DEGREE_BOOST (R4)
- SPECKIT_CHANNEL_MIN_REP (R2)
- SPECKIT_RSF_FUSION (R14/N1)
- SPECKIT_COMPLEXITY_ROUTER (R15)
- SPECKIT_ADAPTIVE_FUSION (existing)
- SPECKIT_MMR (existing)
- SPECKIT_CAUSAL_BOOST (existing)

**Group B: Feedback & Learning (medium interaction with A)**
- SPECKIT_LEARN_FROM_SELECTION (R11)
- SPECKIT_EMBEDDING_EXPANSION (R12)
- SPECKIT_NOVELTY_BOOST (N4)
- SPECKIT_ENCODING_INTENT (R16)

**Group C: Infrastructure (low interaction)**
- SPECKIT_EVAL_LOGGING (R13)
- SPECKIT_PIPELINE_V2 (R6)
- SPECKIT_EXTENDED_TELEMETRY (existing)
- SPECKIT_MULTI_QUERY (existing)
- SPECKIT_CROSS_ENCODER (existing)

**Group D: Background Processes (low interaction with A, high with each other)**
- SPECKIT_CONSOLIDATION (N3)
- SPECKIT_AUTO_ENTITIES (R10)
- SPECKIT_CHUNK_THINNING (R7)
- SPECKIT_MEMORY_SUMMARIES (R8)
- SPECKIT_SPEC_PREFILTER (R9)

**Group A testing surface:** 2^8 = 256 combinations. This is the critical group that directly affects search ranking on every query. Testing all 256 is feasible with automated eval (R13), but requires:
- A ground truth corpus of at least 100 query-relevance pairs
- Automated test runner that iterates flag combinations
- Metric comparison (MRR@5, NDCG@10) per combination

**Group A x B interaction testing surface:** 2^12 = 4,096 combinations. This is the danger zone. Testing all 4,096 is time-consuming (even at 10 seconds per eval run = 11.4 hours).

### 5.4 Staged Enablement Viability Assessment

The document proposes a 4-phase rollout. Evaluating viability:

**Phase 0 (Bug fixes + R13):** VIABLE. No new flags, just correctness fixes and eval infra. Testing surface = current flags only.

**Phase 1 (R1, R4, N4, R16):** VIABLE with dark-run. 4 new flags. 2^4 = 16 new combinations against existing 7 flags. Dark-run comparison per the document's Kendall tau thresholds is sufficient.

**Phase 2 (R2, R11, R12, R14/N1, R15, R18):** RISKY. 6 new flags in one phase. 2^6 = 64 new combinations against the Phase 1 set. This is where the interaction effects from Section 3 concentrate (R15+R2, R12+R15, N4+R11). Recommendation: Split Phase 2 into 2a (R2, R18, R14/N1 -- low interaction) and 2b (R11, R12, R15 -- high interaction).

**Phase 3 (R6, N2, R8, R7, R9, R17):** MODERATE. R6 (pipeline refactor) should be a standalone phase because it changes the execution model for all other flags. If R6 introduces a subtle ordering change, every flag enabled in Phases 1-2 needs retesting.

**Phase 4 (S1-S5, N3, R10):** RISKY for N3 due to the feedback loop with R4 (already enabled in Phase 1). N3 should have a longer observation period (2-4 weeks with monitoring before advancing).

### 5.5 Recommended Testing Strategy

| Level | What | Combinations | Method | Time |
|-------|------|-------------|--------|------|
| L1: Unit | Each flag in isolation | 24 | Existing test suite | ~5 min |
| L2: Pair | All documented interaction pairs | 12 pairs x 2 states = 24 | Integration tests | ~10 min |
| L3: Group | All combinations within Group A | 256 | Automated eval runner | ~45 min |
| L4: Cross-Group | Group A x Group B critical paths | ~50 selected | Shadow scoring | ~2 hours |
| L5: Full Phase | End state of each phase | 4 | Manual validation | ~1 day each |

**Total estimated testing effort per phase:** ~1 day automated + 0.5 day manual review.

---

## 6. Revised Risk Matrix

Including missing risks and corrected ratings:

| Rec/Risk | Data Loss | Regression | Perf Impact | Schema | Rollback | Interaction Risk |
|----------|-----------|-----------|-------------|--------|----------|-----------------|
| R1 | LOW | MEDIUM | LOW | NONE | EASY | MEDIUM-HIGH (with N4) |
| R2 | NONE | MEDIUM | LOW | NONE | EASY | MEDIUM (with R15) |
| R4 | NONE | MEDIUM | LOW | NONE | EASY | HIGH (with N3) |
| R6 | NONE | **MEDIUM** | LOW | NONE | MEDIUM | LOW |
| R7 | MEDIUM | MEDIUM | POSITIVE | NONE | MEDIUM | LOW |
| R8 | NONE | LOW | LOW | YES | EASY | LOW |
| R9 | NONE | LOW | POSITIVE | NONE | EASY | LOW |
| R10 | NONE | LOW | MEDIUM | NONE | EASY | HIGH (with R4) |
| R11 | MEDIUM | **HIGH** | LOW | NONE | **HARD** | HIGH (with R12, N4) |
| R12 | NONE | MEDIUM | MEDIUM | NONE | EASY | MEDIUM (with R15) |
| R13 | NONE | NONE | **LOW-MED** | YES | EASY | LOW-MEDIUM (observer) |
| R14/N1 | NONE | **MEDIUM** | LOW | NONE | EASY | LOW |
| R15 | NONE | **MEDIUM** | POSITIVE | NONE | EASY | MEDIUM (with R2, R12) |
| R16 | NONE | LOW | LOW | YES | EASY | LOW |
| R17 | NONE | LOW | LOW | NONE | EASY | LOW |
| R18 | NONE | NONE | POSITIVE | YES | EASY | LOW-MEDIUM (model lock-in) |
| N1 | NONE | LOW | LOW | NONE | EASY | LOW |
| N2 | NONE | LOW | LOW | NONE | EASY | MEDIUM |
| N3 | NONE | **MEDIUM** | MEDIUM | NONE | EASY | **HIGH** (with R4) |
| N4 | NONE | LOW | LOW | NONE | EASY | MEDIUM-HIGH (with R1, R11) |
| N5 | NONE | LOW | HIGH | YES | MEDIUM | NONE |
| **Flag Explosion** | NONE | **HIGH** | LOW | NONE | N/A | **SYSTEMIC** |
| **Concurrent R/W** | **MEDIUM** | LOW | MEDIUM | NONE | N/A | MEDIUM |
| **Schema Migration** | LOW | LOW | NONE | YES | MEDIUM | LOW |

**Bold entries** indicate changes from the original matrix.

---

## 7. Summary

### Key Findings

1. **5 risk ratings require correction:** R6, R14/N1, R15 should be MEDIUM (not LOW). N3's interaction risk should be HIGH. R13 has non-zero performance impact.

2. **7 missing risks identified:** Concurrent R/W contention, feature flag explosion, R13 observer effect, N3 runaway edge growth, R11 FTS5 trigger contamination, schema migration versioning, R18 model lock-in.

3. **6 undocumented interaction pairs found:** R1+N4 (double-boost), R4+N3 (feedback loop), R15+R2 (guarantee violation), R12+R15 (contradiction), N4+R11 (transient artifact), R13+R15 (metrics skew).

4. **Phase 2 is the highest-risk phase** and should be split into 2a (low-interaction: R2, R18, R14/N1) and 2b (high-interaction: R11, R12, R15) with dark-run testing between sub-phases.

5. **Feature flag testing is tractable** if organized by independence groups. Group A (8 search pipeline flags, 256 combinations) is the critical testing surface. A ground truth corpus and automated eval runner (R13) are prerequisites for any flag beyond Phase 1.

### Top 3 Actionable Changes to the Document

1. **Add R11 FTS5 isolation:** Store learned triggers in a separate column to prevent FTS5 contamination. This is the single highest-risk mitigation gap.

2. **Add N3 edge growth bounds:** Cap edges per node, cap strength increases per consolidation cycle, add provenance tracking for consolidation-created edges.

3. **Split Phase 2:** Separate low-interaction flags (R2, R18, R14/N1) from high-interaction flags (R11, R12, R15) with a dark-run checkpoint between them.
