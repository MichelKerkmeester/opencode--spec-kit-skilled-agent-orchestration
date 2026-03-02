# From Speculation to Measurement: Definitive Recommendations for Hybrid RAG Fusion Refinement

> **Actionable implementation roadmap** for the spec-kit memory MCP server, synthesized from 13 independent agent investigations with corrected code, recalibrated effort, and metric-gated execution gates.

| Field | Value |
|-------|-------|
| Document Class | Final Synthesis Recommendations |
| Companion Document | `142 - FINAL-analysis-hybrid-rag-fusion-architecture.md` |
| Supersedes | 140-recommendations, 141-recommendations |
| Date | 2026-02-26 |
| Method | 10 Opus research agents + 3 Sonnet ultra-think agents, 3 waves |
| Active Recommendations | 30 (after dedup, merge, correction, and 3 new gap recommendations now included in master registry) |
| Removed/Deferred | 5 (R3 SKIP, R5 DEFER, N5 DROP, R6-Stage4 PARKED, Gen5 PARKED) |
| Total Effort | 270-395h realistic (2x the original 130-165h estimate; itemized from S0-S6 sprint sums) |
| Sprint Count | 7 metric-gated sprints across 18-26 weeks |

**How to Read This Document:**
- **Section 1** provides the inventory of all 30 recommendations with final priorities and effort
- **Section 2** contains the 3 true P0 prerequisites that block everything
- **Section 3** provides the 7-sprint implementation roadmap with go/no-go gates
- **Section 4** has corrected code sketches (fixing div-by-zero, undefined constants, FTS5 contamination)
- **Section 5** maps the dependency graph with 3 incorrect dependencies removed
- **Section 6** is the expanded risk register with 7 previously missing risks
- **Section 7** grades every major claim by evidence quality
- **Section 8** introduces 3 new recommendations from blind spot analysis
- **Section 9** defines what NOT to build (anti-patterns and premature investments)
- **Section 10** establishes feature flag governance to prevent combinatorial explosion
- **Section 11** specifies success metrics per sprint
- **Section 12** specifies test expansion requirements per sprint
- **Section 13** provides migration safety checklist for schema changes
- **Section 14** defines dark-run performance budget and latency bounds
- **Section 15** rates rollback complexity per sprint
- **Section 16** provides the complete "What NOT to Do" list carried from all prior analyses

---

## 1. Complete Recommendation Inventory

### 1.1 Master Registry

All 30 active recommendations after consolidation across Spec 140, Spec 141, 10 Wave 1-2 investigation agents, and 3 new gap recommendations. Conflict resolutions reference the Companion Analysis §2.

| ID | Name | Source | Priority | Effort (h) | Sprint | Evidence |
|----|------|--------|----------|------------|--------|----------|
| **G1** | Fix graph channel ID mismatch | 141 | **P0-BUG** | 3-5 | S0 | A+ |
| **G2** | Investigate double intent weighting | 141 | **P1** | 4-6 | S2 | A |
| **G3** | Fix chunk collapse conditional | 141 | **P0-BUG** | 2-4 | S0 | A |
| **R1** | MPAB chunk-to-memory aggregation | 140+141 merged | **P1** | 8-12 | S4 | A |
| **R2** | Channel minimum-representation constraint | 140+141 merged | **P1** | 6-10 | S3 | B |
| **R4** | Typed-weighted degree as 5th RRF channel | 140+141 merged | **P0** | 12-16 | S1 | B |
| **R6** | 4-stage pipeline refactor | 140+141 merged | **P2** | 40-55 | S5 | B |
| **R7** | Anchor-aware chunk thinning | 140+141 merged | **P2** | 10-15 | S6 | B |
| **R8** | Memory summary generation | 140+141 merged | **P3** | 15-20 | S7 | C |
| **R9** | Spec folder pre-filter | 140+141 merged | **P2** | 5-8 | S5 | B |
| **R10** | Auto entity extraction | 140+141 merged | **P2** | 12-18 | S6 | C |
| **R11** | Learned relevance feedback with safeguards | 140+141 merged | **P1** | 16-24 | S4 | A |
| **R12** | Embedding-based query expansion | 140+141 merged | **P2** | 10-15 | S5 | C |
| **R13** | Retrieval evaluation infrastructure | 140+141 merged | **P0-FOUND** | 25-35 | S0 | A |
| **R14/N1** | Relative Score Fusion mode | 141 deduplicated | **P1** | 10-14 | S3 | B+ |
| **R15** | Query complexity router | 141 | **P1** | 10-16 | S3 | B |
| **R16** | Encoding-intent capture | 141 | **P2** | 5-8 | S6 | C |
| **R17** | Fan-effect divisor in co-activation | 141 | **P1** | 1-2 | S0 | A |
| **R18** | Embedding cache for instant rebuild | 141 | **P1** | 8-12 | S2 | A |
| **N2** | Graph-deepening (items 4-6 only) | 141 | **P2** | 25-35 | S6 | C+ |
| **N3** | Memory consolidation (lite version) | 141 | **P2** | 10-15 | S6 | C |
| **N4** | Cold-start boost with exponential decay | 141 | **P1** | 3-5 | S2 | B |
| **S1** | Smarter memory content generation | 141 | **P3** | 8-12 | S7 | C |
| **S2** | Template anchor optimization | 141 | **P2** | 5-8 | S5 | B |
| **S3** | Validation signals as retrieval metadata | 141 | **P2** | 4-6 | S5 | B |
| **S4** | Spec folder hierarchy as retrieval structure | 141 | **P2** | 6-10 | S6 | B |
| **S5** | Cross-document entity linking | 141 | **P3** | 8-12 | S7 | C |
| **G-NEW-1** | BM25-only baseline comparison | New (Gaps) | **P0** | 4-6 | S0 | N/A |
| **G-NEW-2** | Agent-as-consumer UX analysis | New (Gaps) | **P1** | 8-12 | S1 | N/A |
| **G-NEW-3** | Feedback bootstrap strategy | New (Gaps) | **P1** | Integrated | S0/S4 | N/A |

### 1.2 Removed, Deferred, and Merged Items

| ID | Action | Rationale |
|----|--------|-----------|
| **R3** | SKIP | R5 subsumes normalization; irreversible data risk; sqlite-vec handles internally |
| **R5** | DEFER until 10K+ memories | 5.32% recall loss significant; 3MB storage irrelevant; sqlite-vec INT8 incompatible with per-record quantization |
| **N5** | DROP | Two-model ensemble doubles storage/cost; 4-5 channels already provide signal diversity |
| **G4** | MERGED into R11 | Wire `learnFromSelection` is the unsafeguarded subset of R11; single work item |
| **R14+N1** | MERGED into R14/N1 | Identical recommendation; R14's conservative framing + N1's formula |
| **N2 items 1-3** | DISSOLVED into G1+R4 | Already covered by separate recommendations |

### 1.3 Priority Distribution

| Priority | Count | Recommendations |
|----------|-------|----------------|
| **P0-BUG** | 2 | G1, G3 |
| **P0-FOUNDATION** | 2 | R13, G-NEW-1 |
| **P0** | 1 | R4 (after G1) |
| **P1** | 11 | G2, R1, R2, R11, R14/N1, R15, R17, R18, N4, G-NEW-2, G-NEW-3 |
| **P2** | 11 | R6, R7, R9, R10, R12, R16, N2, N3, S2, S3, S4 |
| **P3** | 3 | R8, S1, S5 |

### 1.4 Reclassifications from Original Documents

| Rec | Original | Final | Direction | Rationale |
|-----|----------|-------|-----------|-----------|
| G2 | P0 | P1 | LOWER | Two different weight sets at different pipeline stages; may be intentional [Evidence: A] |
| G4 | P0 | MERGE→R11 | LOWER | Not a bug; unfinished feature requiring safeguards |
| R1 | P0 | P1 | LOWER | Limited impact at current chunk ratio (~90% unchunked) |
| R8 | P2 | P3 | LOWER | Scale-dependent benefit (5K+ memories) |
| R12 | P1 | P2 | LOWER | Incremental; needs R13 first; noise risk |
| R16 | P1 | P2 | LOWER | Theoretical; LOW-MEDIUM confidence |
| R17 | P2 | P1 | RAISE | 5-LOC fix with immediate impact on hub domination |
| N2 | P0 (monolithic) | DISSOLVED | RESTRUCTURE | Items 1-3=G1+R4; items 4-6=P2 gated on edge density |
| N3 | P2 (full) | P2 (lite) | SCOPE CUT | Full version over-engineered for current scale; lite delivers 80% value |
| N5 | P3 | DROP | DROP | Cost >> benefit at any foreseeable scale |
| S1 | P2 | P3 | LOWER | Theoretical optimization; markdown re-parsing works |
| S2 | P1 | P2 | LOWER | Template guidance, not blocking implementation |
| S3 | P1 | P2 | LOWER | Marginal signal differentiation |
| S5 | P2 | P3 | LOWER | Overlaps with R10 |

---

## 2. P0 Prerequisites — The Three Things That Block Everything

These must be completed before any P1/P2 recommendation is implemented. They are ordered by dependency.

### 2.1 G1: Fix Graph Channel ID Format Mismatch

**Problem [A+]:** Graph search produces IDs formatted as `mem:${edgeId}` (strings) at `graph-search-fn.ts:110,151`. All other channels produce numeric IDs. The MMR reranking filter at `hybrid-search.ts:528-530` explicitly rejects non-numeric IDs via `typeof id === 'number'`. **Result: graph channel contributes zero signal to final rankings.**

**Fix:**

```typescript
// graph-search-fn.ts:110 — BEFORE (broken)
results.push({ id: `mem:${row.id}`, score: row.score, source: 'graph' });

// graph-search-fn.ts:110 — AFTER (fixed)
// row.id is causal edge ID, not memory ID. Use source_id or target_id.
const memoryId = parseInt(row.source_id, 10) || parseInt(row.target_id, 10);
if (!isNaN(memoryId)) {
  results.push({ id: memoryId, score: row.score, source: 'graph' });
}
```

**Verification:** After fix, `graphHitRate` in retrieval telemetry must be > 0%. Run `memory_search({ query: "any known topic" })` and confirm graph results appear in `channelAttribution`.

**Effort:** 3-5h | **Risk:** LOW | **Rollback:** Revert single function change

---

### 2.2 G3: Fix Chunk Collapse Conditional

**Problem [A]:** `collapseAndReassembleChunkResults()` at `memory-search.ts:303,1003` allows duplicate chunk rows through when `includeContent=false` (the default search path). The `seenParents` deduplication logic has a conditional gap.

**Fix:** Ensure the deduplication guard runs on ALL code paths, not just the `includeContent=true` branch. The fix is a conditional expansion, not a new function.

**Verification:** Query a memory known to have multiple chunks. Default search (`includeContent=false`) must return exactly 1 result per parent memory.

**Effort:** 2-4h | **Risk:** LOW | **Rollback:** Revert conditional change

---

### 2.3 R13-Sprint1: Evaluation Infrastructure (Core)

**Problem [A]:** The system has 15+ scoring signals, zero retrieval quality metrics, and hand-tuned weights. Without measurement, every subsequent recommendation is speculation.

**Implementation:**

1. **Separate SQLite database:** `speckit-eval.db` (not in primary database — prevents observer effect on search performance)
2. **5-table schema:**
   - `eval_queries` — query text, intent, complexity, timestamp
   - `eval_channel_results` — per-channel ranked results with raw scores
   - `eval_final_results` — final fused results with all scoring factors
   - `eval_ground_truth` — relevance judgments (synthetic → implicit → LLM-judge)
   - `eval_metric_snapshots` — periodic MRR@5, NDCG@10, Recall@20 computations
3. **Logging hooks:** Insert into `memory_search`, `memory_context`, and `memory_match_triggers` handlers
4. **Ground truth Phase A (immediate):** Generate synthetic query-relevance pairs from trigger phrases. If memory M has trigger "deploy pipeline", then query "deploy pipeline" has relevance 3 for M.
5. **Core metrics:** MRR@5, NDCG@10, Recall@20, Hit Rate@1

**Critical first deliverable:** The BM25-only baseline (G-NEW-1). Run evaluation queries through BM25 channel alone and record baseline metrics. This is the single largest analytical blind spot in the entire research corpus.

**Agent-memory-specific metrics (Phase B):**
- Constitutional Surfacing Rate — % of queries where constitutional memories appear in top-K
- Importance-Weighted Recall — recall weighted by memory tier
- Cold-Start Detection Rate — % of new memories surfaced within first 48h
- Intent-Weighted NDCG — NDCG where relevance is scaled by intent match
- Channel Attribution Score — per-channel contribution to final top-K

**Effort:** 25-35h | **Risk:** LOW (additive, separate database) | **Rollback:** Drop `speckit-eval.db`

---

## 3. Seven Metric-Gated Sprints

**Design principles:**
1. **Subsystem coherence** — max 2 subsystems per sprint (minimizes context-switching)
2. **Measure-then-enable** — build behind flags, measure via R13, then enable
3. **True dependencies only** — soft dependencies (R4→R13) do not block building, only enabling
4. **Go/no-go gates** — data-driven criteria between sprints, not time-based
5. **Build vs enable separation** — all scoring changes built behind feature flags, enabled by data

### Sprint 0: Epistemological Foundation [BLOCKING]

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 0.1 | **G1:** Fix graph channel ID format | 3-5 | Graph |
| 0.2 | **G3:** Fix chunk collapse dedup | 2-4 | Search handlers |
| 0.3 | **R17:** Fan-effect divisor | 1-2 | Graph/co-activation |
| 0.4 | **R13-S1:** Eval DB + logging hooks + pipeline instrumentation | 20-28 | Evaluation (new) |
| 0.5 | **G-NEW-1:** BM25-only baseline measurement | 4-6 | Evaluation |
| | **Total** | **30-45h** | |

> **R17 in Sprint 0 rationale:** R17 is classified P1 but included in Sprint 0 due to: trivial effort (1-2h, ~5 LOC change), immediate impact on hub domination in co-activation scoring, and zero external dependencies. The cost of deferring exceeds the cost of inclusion.

**Exit Gate:**
- [ ] Graph hit rate > 0% (G1 verified)
- [ ] No duplicate chunk rows in default search mode (G3 verified)
- [ ] Baseline MRR@5, NDCG@10, Recall@20 computed for at least 50 queries
- [ ] BM25-only baseline MRR@5 recorded

**Partial Advancement:** G1+G3+R17 and R13-S1+G-NEW-1 are independent tracks (see §5.2). If G1+G3+R17 pass their verification criteria, Sprint 1 (R4) MAY begin in parallel with R13-S1 completion — R4 can be *built and unit-tested* without eval infrastructure (R13 is needed to *measure impact*, not to *implement*). However, R4 MUST NOT be *enabled* (flag flipped) until R13-S1 metrics are available.

**If gate fails:** Do not proceed with metric-dependent sprints. Escalate as infrastructure crisis.

---

### Sprint 1: Graph Signal Activation

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 1.1 | **R4:** Typed-weighted degree as 5th RRF channel (behind flag) | 12-16 | Graph |
| 1.2 | Edge density measurement (from R13 data) | 2-3 | Evaluation |
| 1.3 | **G-NEW-2:** Agent-as-consumer UX analysis + consumption instrumentation | 8-12 | Evaluation |
| 1.4 | Enable R4 if dark-run passes | 0 | — |
| | **Total** | **22-31h** | |

**R4 Implementation Details:**

Formula: `typed_degree(node) = SUM(weight_t * count_t)`, normalized: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`

Edge type weights:
| Type | Weight | Rationale |
|------|--------|-----------|
| `caused` | 1.0 | Direct causation is strongest signal |
| `derived_from` | 0.9 | Strong lineage relationship |
| `enabled` | 0.8 | Prerequisite relationship |
| `contradicts` | 0.7 | Important — surfaces conflict awareness |
| `supersedes` | 0.6 | Version relationship |
| `supports` | 0.5 | Weakest explicit relationship |

**Constants (previously undefined):**
- `MAX_TYPED_DEGREE = 15` per edge type (computed from global max, cached, refreshed on graph mutation)
- `MAX_TOTAL_DEGREE = 50` per node (hard cap)
- `SPECKIT_DEGREE_BOOST_CAP = 0.15` (prevents hub domination)
- Constitutional-tier memories EXCLUDED from degree boost (already surface unconditionally)

**Batch SQL for degree computation:**
```sql
-- Compute typed degree for a batch of memory IDs
SELECT
  CASE WHEN source_id = ? THEN source_id ELSE target_id END as memory_id,
  relation,
  COUNT(*) as edge_count
FROM causal_edges
WHERE source_id IN (?, ?, ?) OR target_id IN (?, ?, ?)
GROUP BY memory_id, relation
```

**Feature flag:** `SPECKIT_DEGREE_BOOST`

**Exit Gate:**
- [ ] R4 dark-run: no single memory appears in >60% of results
- [ ] R4 measured delta > +2% absolute MRR@5 (or +5% relative, whichever is larger) above measurement noise floor vs Sprint 0 baseline
- [ ] Edge density measured: if < 0.5 edges/node, escalate R10 priority
- [ ] G-NEW-2: Agent consumption instrumentation active; initial pattern report drafted

**If gate fails:** Graph is too sparse. Prioritize R10 (auto entity extraction) to increase edge density before re-evaluating R4.

---

### Sprint 2: Scoring Calibration + Operational Efficiency

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 2.1 | **R18:** Embedding cache for instant rebuild | 8-12 | Indexing |
| 2.2 | **N4:** Cold-start boost with exponential decay (behind flag) | 3-5 | Scoring |
| 2.3 | **G2:** Investigate double intent weighting | 4-6 | Fusion |
| 2.4 | Score normalization (both scoring systems to [0,1]) | 4-6 | Scoring |
| | **Total** | **19-29h** | |

> **Subsystem coherence note:** Sprint 2 touches 3 subsystems (Indexing, Scoring, Fusion) — justified by tight coupling between G2 investigation and N4/R18 calibration work. G2's outcome directly informs whether score normalization (item 2.4) requires single-stage or two-stage adjustment.

**R18 Embedding Cache Schema [Grade: A — Production-Ready]:**
```sql
CREATE TABLE IF NOT EXISTS embedding_cache (
  content_hash TEXT NOT NULL,
  model_id TEXT NOT NULL,         -- Include model version hash, not just provider name
  embedding BLOB NOT NULL,
  dimensions INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  last_used_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (content_hash, model_id)
);

CREATE INDEX idx_cache_last_used ON embedding_cache(last_used_at);
```

Cache lookup in indexing pipeline: if `content_hash + model_id` matches, skip embedding generation entirely. Zero API calls for unchanged content during re-index.

**N4 Cold-Start Boost [Grade: B — No FSRS Conflict]:**

Formula: `boost = 0.15 * exp(-elapsed_hours / 12)`

| Property | FSRS v4 | N4 Cold-Start |
|----------|---------|---------------|
| Formula | `R(t) = (1 + 19/81 * t/S)^(-0.5)` | `boost = 0.15 * exp(-t/12)` |
| Domain | Power-law decay over days | Exponential decay over hours |
| Effect | Decreases retrievability over time | Temporarily increases visibility |
| Interaction | For new memories: S small, R(t) drops fast | Counteracts FSRS penalty for 48h |

Add as 6th additive factor in `composite-scoring.ts`. Feature flag: `SPECKIT_NOVELTY_BOOST`.

**Exit Gate:**
- [ ] R18 cache hit rate > 90% on re-index of unchanged content
- [ ] N4 dark-run: new memories (<48h) appear when relevant without displacing highly relevant older results
- [ ] G2 resolved: fixed or documented as intentional design
- [ ] Score distributions from System A and System B normalized to comparable ranges

---

### Sprint 3: Query Intelligence + Fusion Alternatives

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 3.1 | **R15:** Query complexity router (behind flag) | 10-16 | Pipeline |
| 3.2 | **R14/N1:** Relative Score Fusion parallel to RRF (behind flag) | 10-14 | Fusion |
| 3.3 | **R2:** Channel minimum-representation constraint | 6-10 | Fusion |
| | **Total** | **26-40h** | |

**R15 — Critical Design Constraint [Evidence: B]:**

R15 routes "simple" queries to reduced channel count. However, the Risk Agent identified a direct conflict: **R15's single-channel mode violates R2's diversity guarantee.** Resolution: R15's minimum channel count MUST be 2 (vector + FTS minimum), not 1. The efficiency gain from dropping BM25 and graph is still ~40% while preserving error correction.

| Complexity | Channels | Limit | Latency Target |
|-----------|----------|-------|----------------|
| Simple | Vector + FTS5 | 5 | < 30ms |
| Moderate | Vector + FTS5 + BM25 | 10 | < 100ms |
| Complex | All 5 channels | 20 | < 300ms |

Feature flag: `SPECKIT_COMPLEXITY_ROUTER`

**R14/N1 — Relative Score Fusion [Grade: B+ — Weaviate Benchmarks]:**

Formula: `normalized_score[i] = (raw_score[i] - min(c)) / (max(c) - min(c) + epsilon)`, `final_score[i] = SUM(w_c * normalized_score_c[i]) + convergence_bonus`

Where `w_c = f(intent, channel_reliability_history)`. A/B testable against existing RRF via shadow scoring. Feature flag: `SPECKIT_RSF_FUSION`.

**Important:** RSF must handle ALL THREE fusion variants in the current codebase:
1. Single-pair fusion (equivalent to `fuseResults`)
2. Multi-list fusion (equivalent to `fuseResultsMulti`)
3. Cross-variant fusion (equivalent to `fuseResultsCrossVariant` at `rrf-fusion.ts:265-326`)

Effort estimate reflects all three variants (~200-250 LOC), not just the core formula (~80 LOC).

**R2 — Channel Minimum-Representation:**

Post-fusion enforcement using `sources[]` attribution. Constraints:
- Minimum = 1 per active channel (not higher)
- Only when channel returned results (don't force empty channels)
- Apply AFTER quality threshold (`min_quality_score`)
- Quality floor: `min_similarity >= 0.2`
- Feature flag: `SPECKIT_CHANNEL_MIN_REP`

**Exit Gate:**
- [ ] R15 p95 latency for simple queries < 30ms
- [ ] R14/N1 shadow comparison: minimum 100 queries, Kendall tau computed
- [ ] R2 dark-run: top-3 precision within 5% of baseline

---

### Sprint 4: Feedback Loop + Chunk Aggregation

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 4.1 | **R1:** MPAB chunk-to-memory aggregation (behind flag) | 8-12 | Scoring |
| 4.2 | **R11:** Learned relevance feedback with full safeguards | 16-24 | Search handlers |
| 4.3 | **R13-S2:** Shadow scoring + channel attribution + ground truth Phase B | 15-20 | Evaluation |
| | **Total** | **39-56h** | |

> **Subsystem coherence note:** Sprint 4 touches 3 subsystems (Scoring, Search handlers, Evaluation) — justified by the feedback loop requiring cross-subsystem integration. R1's chunk aggregation feeds into R11's learning signals, which are validated by R13-S2's shadow scoring infrastructure.

**R1 MPAB — Corrected Implementation [see §4.1 for code]**

**R11 — Critical Architecture Decision [Evidence: A]:**

The Wave 2 Risk Agent discovered that R11's `[learned:]` prefix is **stripped by the FTS5 tokenizer**, making the provenance tracking invisible to full-text search. The mitigation:

**Store learned triggers in a SEPARATE column, not appended to `trigger_phrases`:**
```sql
ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
```

This prevents FTS5 contamination entirely. The separate column:
- Is NOT indexed by FTS5 (prevents trigger pollution of lexical search)
- Has its own TTL logic (30-day expiry if not reinforced)
- Can be bulk-cleared without touching manually authored triggers
- Is queried separately during trigger matching with lower weight

**R11 Safeguards (all mandatory):**
1. **Provenance:** Separate `learned_triggers` column (not prefix-based)
2. **TTL:** 30-day expiry if not reinforced by another selection
3. **Denylist:** Expand from 25 to 100+ stop words
4. **Cap:** Max 3 terms per selection, max 8 learned triggers per memory
5. **Threshold:** Only learn when memory was NOT in top 3 results (requires R13 query provenance)
6. **Shadow period:** 1 week of shadow-logging before enabling mutations
7. **Eligibility:** Exclude memories created within 72h (prevents N4 cold-start artifact learning)

Feature flag: `SPECKIT_LEARN_FROM_SELECTION`

**Exit Gate:**
- [ ] R1 dark-run: MRR@5 improves or stays within 2%; no regression for N=1 memories
- [ ] R11 shadow log analyzed: < 5% noise rate in learned triggers
- [ ] R13-S2 operational: full A/B comparison infrastructure running

**Prerequisite:** R13 must have completed at least 2 full eval cycles before R11 mutations are enabled.

---

### Sprint 5: Pipeline Refactor + Spec-Kit Logic

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 5.1 | Checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` | — | — |
| 5.2 | **R6:** 4-stage pipeline refactor (dark-run) | 40-55 | Pipeline |
| 5.3 | **R9:** Spec folder pre-filter | 5-8 | Pipeline |
| 5.4 | **R12:** Embedding-based query expansion | 10-15 | Search handlers |
| 5.5 | **S2:** Template anchor optimization | 5-8 | Spec-Kit logic |
| 5.6 | **S3:** Validation signals as retrieval metadata | 4-6 | Spec-Kit logic |
| | **Total** | **64-92h** | |

**Internal Phasing (max 2 subsystems per phase):**
- **Phase A (Pipeline):** R6 pipeline refactor (40-55h) — touches Pipeline subsystem only. Checkpoint before start (`memory_checkpoint_create("pre-pipeline-refactor")`). Must produce 0 ordering differences on the eval corpus and pass all 158+ tests before Phase B begins.
- **Phase B (Search + Spec-Kit):** R9, R12, S2, S3 (24-37h) — touches Search handlers + Spec-Kit logic subsystems. Phase A must complete and pass the "0 ordering differences" gate before Phase B begins.

> R6 Phase A is the single largest work item in the roadmap. Failure here (ordering regressions that cannot be resolved) triggers the off-ramp: retain current pipeline architecture and implement remaining Sprint 5 items as incremental patches.

**R6 — Architectural Invariant [Evidence: B]:**

The Architecture Agent identified a "kitchen sink" problem in Stage 4. The corrected pipeline enforces a strict rule: **Stage 4 NEVER changes scores or ordering.**

```
Stage 1: CANDIDATE GENERATION
  - 5 channels: vector, FTS5, BM25, graph, degree

Stage 2: FUSION + SIGNAL INTEGRATION
  - RRF or RSF core fusion
  - Causal boost as channel input (not post-hoc)
  - Co-activation as signal input (not post-hoc)
  - Composite scoring factors as fusion weights
  - Intent weights applied ONCE here (prevents G2 recurrence)

Stage 3: RERANK + AGGREGATE
  - Cross-encoder reranking
  - MMR diversity enforcement
  - MPAB chunk-to-memory aggregation (boundary between chunk-level and memory-level)

Stage 4: FILTER + ANNOTATE (NO score changes)
  - State filtering + session dedup
  - Constitutional tier guarantee check
  - Evidence gap detection
  - Channel attribution metadata
```

**Go/No-Go:** R6 dark-run must produce 0 ordering differences on the eval corpus. All 158+ existing tests must pass.

**R12 — Mutual Exclusion with R15:**

R12 (query expansion) and R15 (complexity router) contain contradictory logic — R15 says "use fewer resources" while R12 says "expand the query." Resolution: **R12 is suppressed when R15 classifies a query as "simple."** If R12 activates, R15 must not downgrade the query.

**Exit Gate:**
- [ ] R6 dark-run: identical result ordering on full eval corpus
- [ ] All 158+ tests pass
- [ ] R9 cross-folder queries produce identical results
- [ ] R12 expansion does not degrade simple query latency

---

### Sprint 6: Graph Deepening + Index Optimization

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 6.1 | **R7:** Anchor-aware chunk thinning | 10-15 | Indexing |
| 6.2 | **R16:** Encoding-intent capture | 5-8 | Indexing/scoring |
| 6.3 | **R10:** Auto entity extraction | 12-18 | Graph/indexing |
| 6.4 | **N2 (4-6):** Graph centrality + community detection | 25-35 | Graph |
| 6.5 | **N3-lite:** Contradiction scan + Hebbian strengthening | 10-15 | Background/graph |
| 6.6 | **S4:** Spec folder hierarchy as retrieval structure | 6-10 | Spec-Kit logic |
| | **Total** | **68-101h** | |

**Internal Phasing:**
- **Phase A (Graph):** N2 items 4-6 (graph centrality + community detection), N3-lite (contradiction scan + Hebbian strengthening) — 35-50h. Touches Graph subsystem only.
- **Phase B (Indexing + Spec-Kit):** R7 (anchor-aware chunk thinning), R16 (encoding-intent capture), R10 (auto entity extraction, gated on density), S4 (spec folder hierarchy) — 33-51h. Touches Indexing + Spec-Kit logic subsystems.
- Phases A and B may run in parallel if developer capacity permits — they touch non-overlapping subsystems.

**N3-lite — Scoped Consolidation [Evidence: B]:**

The full N3 proposal (auto-link, merge, strengthen, detect contradictions) is over-engineered for current scale. The Architecture Agent recommends a minimal version delivering 80% of value:

1. **Contradiction scan (weekly):** For memory pairs with similarity > 0.85, check if conclusions conflict. Flag with annotation. ~40 LOC.
2. **Hebbian edge strengthening (per validation):** When a memory is retrieved AND validated as useful, increment strength on traversed causal edges by 0.05 (capped at MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05). Decay: edges not traversed in 30 days decay by 0.1. ~20 LOC.
3. **Staleness detection (weekly):** Memories not retrieved in 90 days flagged for review. ~15 LOC.

**What N3-lite explicitly OMITS:**
- Auto-creating causal links (noise risk too high at current density)
- Merging near-duplicate memories (destructive; incorrect merges lose nuanced variants)
- Full background process (lightweight scan instead)

**Edge growth bounds (prevents R4+N3 amplification loop):**
- `MAX_EDGES_PER_NODE = 20` (storage cap, not just query cap)
- `MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05` per Hebbian update
- Auto-created edges capped at `strength = 0.5`
- N3 MUST NOT create edges that push any node above `MAX_TOTAL_DEGREE = 50`
- Track edge source: `created_by = 'manual' | 'auto' | 'consolidation'` for selective cleanup

**R10 — Gated on Edge Density:**

Only implement if Sprint 1 exit measurement shows edge density < 1.0 edges/node. If graph is already well-connected, R10's false-positive risk outweighs its density benefit.

**Exit Gate:**
- [ ] R7 Recall@20 within 10% of baseline
- [ ] R10 false positive rate < 20% on manual review
- [ ] N2 graph features show measurable channel attribution increase > 10%
- [ ] N3-lite contradiction scan identifies at least 1 known contradiction correctly

---

### Sprint 7: Long Horizon (As Needed)

| # | Item | Hours | Subsystem |
|---|------|-------|-----------|
| 7.1 | **R8:** Memory summaries (only if > 5K memories) | 15-20 | Indexing |
| 7.2 | **S1:** Smarter memory content generation | 8-12 | Spec-Kit logic |
| 7.3 | **S5:** Cross-document entity linking | 8-12 | Graph/indexing |
| 7.4 | **R13-S3:** Full reporting + ablation studies | 12-16 | Evaluation |
| 7.5 | Evaluate R5 (INT8 quantization) need | 2 | Decision gate |
| | **Total** | **45-62h** | |

**R5 Activation Criteria:** Implement INT8 quantization ONLY when:
- Memory count > 10K OR search latency > 50ms OR embedding dimensions > 1536
- Use custom quantized BLOB column (NOT sqlite-vec's `vec_quantize_i8`)
- Preserve Spec 140's code sketch and dual-store migration path
- When implementing, attach Spec 140's KL-divergence calibration note: batch re-index can use global calibration while single insert uses per-record

---

## 4. Corrected Code Sketches

The Feasibility Agent graded every code sketch. Three critical bugs were found.

### 4.1 R1 MPAB — Division by Zero Fix [Grade: C → B after fix]

**Bug:** When `scores` has exactly 1 element, `S_remaining` is empty (N=0). `sqrt(0) = 0` causes division by zero.

**Secondary bug:** `filter(s => s !== sMax)` removes ALL scores equal to max. Use index-based removal.

```typescript
function computeMPAB(scores: number[]): number {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  // Find max and remove ONE instance (not all equal values)
  const sorted = [...scores].sort((a, b) => b - a);
  const sMax = sorted[0];
  const remaining = sorted.slice(1); // Remove exactly one (the max)
  const N = remaining.length;

  // N is guaranteed > 0 here (we checked length === 1 above)
  const bonus = 0.3 * remaining.reduce((a, b) => a + b, 0) / Math.sqrt(N);
  return sMax + bonus;
}
```

**Properties:** N=1 passes unpenalized. N=2 gets modest bonus. N=10+ has diminishing returns.
**Pipeline position:** AFTER RRF fusion, BEFORE state filtering.
**Metadata:** Preserve `_chunkHits: scores.length` for telemetry.
**Feature flag:** `SPECKIT_DOCSCORE_AGGREGATION`, method configurable via `SPECKIT_DOCSCORE_METHOD`.

### 4.2 R4 MAX_TYPED_DEGREE — Definition [Grade: C → B after fix]

**Bug:** `MAX_TYPED_DEGREE` was completely undefined. Neither a constant nor computed.

**Fix:** Compute as a cached global, refreshed on graph mutation:

```sql
-- Compute maximum typed degree across all nodes
SELECT MAX(typed_degree) as max_typed_degree FROM (
  SELECT
    node_id,
    SUM(
      CASE relation
        WHEN 'caused' THEN 1.0 * cnt
        WHEN 'derived_from' THEN 0.9 * cnt
        WHEN 'enabled' THEN 0.8 * cnt
        WHEN 'contradicts' THEN 0.7 * cnt
        WHEN 'supersedes' THEN 0.6 * cnt
        WHEN 'supports' THEN 0.5 * cnt
        ELSE 0.5 * cnt
      END
    ) as typed_degree
  FROM (
    SELECT source_id as node_id, relation, COUNT(*) as cnt
    FROM causal_edges GROUP BY source_id, relation
    UNION ALL
    SELECT target_id as node_id, relation, COUNT(*) as cnt
    FROM causal_edges GROUP BY target_id, relation
  )
  GROUP BY node_id
)
```

Cache result as `MAX_TYPED_DEGREE`. Refresh every N minutes or on edge mutation. Fallback: `MAX_TYPED_DEGREE = 15` if no edges exist.

### 4.3 R11 Learned Triggers — Separate Column [Grade: C → B after fix]

**Bug:** FTS5 tokenizer strips `[learned:]` prefix. The string `[learned:deploy]` becomes tokens `learned` and `deploy` — contaminating FTS5 with the word "learned" as a false match.

**Fix:** Do NOT use `trigger_phrases` column. Use a separate column:

```sql
ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
```

```typescript
// In the trigger matching path, query both columns:
const manualTriggers = JSON.parse(row.trigger_phrases || '[]');
const learnedTriggers = JSON.parse(row.learned_triggers || '[]');

// Apply learned triggers with lower weight (0.7x manual weight)
const allTriggers = [
  ...manualTriggers.map(t => ({ term: t, weight: 1.0 })),
  ...learnedTriggers
    .filter(t => !isExpired(t.created_at, 30)) // 30-day TTL
    .map(t => ({ term: t.term, weight: 0.7 }))
];
```

**Learned trigger schema in the JSON array:**
```json
[
  { "term": "deploy", "created_at": "2026-02-26T10:00:00Z", "source_query": "deploy pipeline" },
  { "term": "migration", "created_at": "2026-02-26T10:00:00Z", "source_query": "deploy pipeline" }
]
```

---

## 5. Dependency Graph

### 5.1 Corrected Dependencies

Three dependencies from the original documents are **incorrect or overstated:**

| Claimed Dependency | Assessment | Rationale |
|--------------------|------------|-----------|
| **R4 needs R13** | OVERSTATED | R4 can be built and unit-tested without eval infra. R13 is needed to *measure impact*, not to *implement*. Build R4 behind flag → deploy R13 → measure → enable R4. |
| **R6 → R7** | INCORRECT | Chunk thinning (R7) operates at index time. Pipeline refactor (R6) restructures search time. Orthogonal subsystems. |
| **R8 → R7** | INCORRECT | R7's thinning criterion is chunk-to-parent similarity, not chunk-to-summary similarity. R8 adds summaries; R7 compares embeddings. No actual dependency. |

### 5.2 True Dependency Graph

```
                     G1 (Fix graph IDs) ---- URGENT, UNBLOCKS GRAPH
                      |
                      v
                     R4 (Degree channel) ---- can build before R13
                      |
                      v
              R13-S1 (Eval Sprint 1) ---- ENABLE R4 based on data
             /    |    \       \
            v     v     v       v
          R1    R14/N1  R11   R15 (all measurable via R13)
                                |
                                v
                          R12 (suppressed when R15 = "simple")

  INDEPENDENT TRACKS (no cross-dependencies):

  Track A (Quick wins):       G3, R17, N4, R18
  Track B (Graph):            G1 → R4 → N2(4-6)
  Track C (Measurement):      R13-S1 → R13-S2 → R13-S3
  Track D (Scoring tweaks):   R1, R14/N1, R2, R16
  Track E (Pipeline/Index):   R6, R7, R8, R9 (all independent of each other)
  Track F (Feedback loop):    R11 (needs R13 data accumulation, not R13 code)
  Track G (Advanced):         R10 (gated on density), N3, S1-S5
```

### 5.3 Critical Path

The longest chain of hard dependencies:

```
G1 (3-5h) → R4 (12-16h) → R13-S1 (25-35h) → R14/N1 (10-14h) → R6 (40-55h)
Total: ~90-125h elapsed (sequential portion)
```

Everything else runs in parallel to this chain.

---

## 6. Risk Register — Expanded

### 6.1 Seven Previously Missing Risks

| # | Risk | Severity | Affected | Mitigation |
|---|------|----------|----------|------------|
| **MR1** | FTS5 trigger contamination from R11 | CRITICAL | R11 | Separate `learned_triggers` column (see §4.3) |
| **MR2** | R4+N3 preferential attachment loop | HIGH | R4, N3 | MAX_TOTAL_DEGREE=50, MAX_STRENGTH_INCREASE=0.05/cycle, edge provenance tracking |
| **MR3** | Feature flag explosion (24 flags = 16.7M states) | HIGH | All | Governance rules (see §10) |
| **MR4** | R1-MPAB div-by-zero at N=0 | HIGH | R1 | Guard clause (see §4.1) |
| **MR5** | R4 MAX_TYPED_DEGREE undefined | MEDIUM | R4 | Computed global with fallback (see §4.2) |
| **MR6** | R11 hidden dependency on R13 query provenance | MEDIUM | R11 | "Not in top 3" safeguard requires query logging from R13 |
| **MR7** | R15 violates R2 channel diversity guarantee | MEDIUM | R15, R2 | Minimum 2 channels even for "simple" queries |

### 6.2 Corrected Severity Ratings

| Recommendation | Original | Corrected | Reason |
|----------------|----------|-----------|--------|
| R6 (pipeline refactor) | LOW | MEDIUM | Stage 4 kitchen sink; interleaved pipeline extraction harder than described |
| R11 (learned feedback) | HIGH | **CRITICAL** | FTS5 tokenizer strips prefix; contamination irreversible without full re-index |
| R14/N1 (RSF) | LOW | MEDIUM | 3 fusion variants, not 1; score normalization behavior changes with data distribution |
| R15 (complexity router) | LOW | MEDIUM | Silent recall degradation from misclassification; no error correction on single-channel |
| N3 (consolidation) | LOW-MED | HIGH | Runaway edge growth; preferential attachment loop with R4 |

### 6.3 Dangerous Interaction Pairs

| Pair | Risk | Category | Mitigation |
|------|------|----------|------------|
| R1 + N4 | MED-HIGH | Double-boost | Apply N4 BEFORE MPAB (to chunk scores, not aggregated); or cap combined boost at 0.95 |
| R4 + N3 | HIGH | Feedback loop | Edge caps, strength caps, provenance tracking |
| R15 + R2 | MEDIUM | Guarantee violation | R15 minimum = 2 channels, not 1 |
| R12 + R15 | LOW-MED | Contradictory | Mutual exclusion: if R15="simple", suppress R12 |
| N4 + R11 | MEDIUM | Transient artifact | Exclude memories < 72h old from R11 learning eligibility |
| R13 + R15 | LOW-MED | Metrics skew | R13 records query_complexity; metrics computed per complexity tier |

### 6.4 Worst-Case Scenario: "The Deploy Disaster" (R11)

A developer searches "deploy to production" and selects a migration memory that mentions "deploy" in passing. R11 adds "deploy" and "production" as triggers. FTS5 re-indexes: both words are now full-text tokens. Every subsequent deployment query matches the migration memory on multiple channels, triggering convergence bonus. The pollution persists for 30 days. Without R13 metrics, the degradation is invisible.

**Why the separate column fix is essential:** With `learned_triggers` in its own column (not indexed by FTS5), this scenario cannot occur. Learned triggers only affect the trigger-matching channel at 0.7x weight, not the lexical search channels.

---

## 7. Evidence Quality Audit

Every major claim graded independently by the Evidence Quality Auditor.

### Grade Distribution

| Grade | Count | Claims |
|-------|-------|--------|
| A+ | 2 | G1 (graph ID mismatch), G4/R11 (learnFromSelection zero callers) |
| A | 3 | G2 (double intent — confirmed with nuance), R1 (MPAB math), dead code inventory |
| B+ | 1 | R14/N1 (Weaviate RSF benchmarks — production system) |
| B | 2 | R15 (Adaptive-RAG, NAACL 2024), R5 (INT8 — with [!] contradiction) |
| C+ | 4 | N2 (graph orthogonality), N4 (cold-start parameters), FTS5+BM25 correlation, signal abundance |
| C | 3 | N3 (consolidation analogy), "Intelligence Conservation" (hypothesis, not law), R16 (encoding specificity) |
| D | 1 | "2-3x effort underestimate" (folklore, no project-specific calibration) |

### Systematic Bias Detected

**Overgrading pattern:** The research documents systematically overgrade theoretical and analogical claims. 5 of 15 audited claims were downgraded. Common pattern: qualitative reasoning or cross-system analogy graded as A/B when it should be C/C+.

**Internal contradiction [!]:** INT8 recall loss — Spec 140 says "~1-2%", Spec 141 says "5.32%" for the same configuration (768-dim INT8). These cannot both be correct. Use 5.32% as planning estimate pending in-system measurement.

### Three Strongest Claims

1. **G1 (A+):** Graph ID mismatch — independently verified, `typeof id === 'number'` filter at `hybrid-search.ts:530` unambiguously excludes string IDs
2. **G4/R11 (A+):** `learnFromSelection` zero callers — binary truth, independently verified
3. **R1 (A):** MPAB formula prevents N=1 penalty — pure mathematical proof, unambiguous

### Three Weakest Claims

1. **"2-3x effort underestimate" (D):** Software folklore with no project-specific calibration data
2. **"Intelligence Conservation Law" (C):** Coined principle from 4 systems; counter-examples exist (ColBERT); should be "hypothesis"
3. **"Memory consolidation analogous to sleep" (C):** Creative metaphor; engineering features stand on own merits without biological analogy

---

## 8. Three New Recommendations (From Blind Spot Analysis)

The Gaps Agent identified critical analysis areas absent from all 4 prior research documents.

### G-NEW-1: BM25-Only Baseline Comparison [P0]

**Gap:** Every recommendation proposes optimizing a 4-channel hybrid system without ever proving it outperforms a single well-tuned BM25 channel. This is the most significant methodological gap.

**Action:** As part of R13-Sprint1, run evaluation queries through BM25 channel alone. Record MRR@5, NDCG@10, Recall@20. Compare against full hybrid system.

**Why it matters:** If BM25 alone achieves 90% of hybrid quality, the marginal value of 14 additional signals is questionable. Conversely, if BM25 alone achieves 50% of hybrid quality, the multi-channel approach is clearly earning its complexity.

**Effort:** 4-6h (subset of R13-Sprint1 work) | **Sprint:** S0

#### BM25 Contingency Decision Matrix

The BM25 baseline measurement from G-NEW-1 triggers one of three action paths. This decision is made at the Sprint 0 exit gate, before Sprint 1 begins:

| BM25 vs Hybrid MRR@5 | Action | Impact on Roadmap |
|----------------------|--------|-------------------|
| **≥80%** of hybrid MRR@5 | **Pause** multi-channel optimization; investigate why single-channel BM25 performs comparably (possible: most queries are simple keyword lookups; possible: other channels add noise) | Sprints 3-7 deferred; focus shifts to single-channel tuning and query analysis |
| **50-80%** of hybrid MRR@5 | **Proceed** with hybrid optimization; rationalize to 3 channels by dropping weakest-contributing channel based on channel attribution data | Sprint scope may reduce; fewer channels = simpler calibration |
| **<50%** of hybrid MRR@5 | **Proceed** with full roadmap — multi-channel diversity is clearly contributing | No change |

**Decision timing:** Within 48h of Sprint 0 completion. **Decision owner:** Project lead. **Key insight:** The ≥80% scenario does not invalidate Sprint 0 (G1, G3, R13, R17 are unconditionally valuable) but fundamentally changes the optimization strategy for subsequent sprints.

### G-NEW-2: Agent-as-Consumer UX Analysis [P1]

**Gap:** The retrieval system is optimized for ranking quality (which result is returned) but ignores presentation quality (how results are consumed by AI agents).

**Open questions:**
- Does returning raw memory content vs structured summary affect agent task completion rate?
- Should results include relevance explanations ("surfaced because...")?
- Is there a threshold where metadata (scores, sources, confidence) becomes noise?
- What is the optimal result count per intent type? (fix_bug=1-2 precise, understand=5-10 diverse)

**Action:** Instrument agent consumption patterns via R13 logging. Track which returned results are actually used by the consuming agent.

**Effort:** 8-12h | **Sprint:** S1 (moved from S4 — agent consumption patterns should inform evaluation query design from Sprint 0 onward)

### G-NEW-3: Feedback Bootstrap Strategy [P1]

**Gap:** Multiple recommendations (R11, R13, N3, N4) depend on feedback data that doesn't exist yet. Circular dependency: R13 needs interaction data → R11 needs R13's query provenance → evaluation needs changes to measure against.

**Action:** Define explicit bootstrap phases:
1. **Phase A (synthetic):** Generate ground truth from trigger phrases (immediate, Sprint 0)
2. **Phase B (implicit):** Accumulate search-selection triples from R13 logging (2-4 weeks after Sprint 0)
3. **Phase C (explicit):** LLM-as-judge relevance grading on accumulated data (6-8 weeks)

R11 mutations MUST NOT be enabled until Phase B has accumulated at least 200 query-selection pairs.

**Effort:** Integrated into R13 phases | **Sprint:** S0 (Phase A), S4 (Phase B gate)

---

## 9. What NOT to Build

### 9.1 Anti-Patterns from Original Analysis (Carried Forward)

These negative guidelines are validated by all 13 agent investigations:

1. **Do NOT apply round-robin interleaving after RRF** — Destroys score-based ordering
2. **Do NOT replace sqlite-vec's cosine with custom inner product** — No benefit; adds maintenance
3. **Do NOT add HNSW indexing yet** — Irrelevant below 10K memories
4. **Do NOT add LLM calls to the search hot path** — Latency budget violation
5. **Do NOT remove any existing search channels** — Even broken channels (graph) should be fixed, not removed
6. **Do NOT adopt PageIndex's vectorless approach** — Unsuitable for agent memory's streaming indexing model
7. **Do NOT claim percentage improvements without baseline metrics (R13)** — Every claim requires measurement

### 9.2 Parked Items (Valid but Premature)

| Item | Reason for Parking | Activation Condition |
|------|-------------------|---------------------|
| R3 (pre-normalize embeddings) | R5 subsumes; irreversible data risk | Never — SKIP permanently |
| R5 (INT8 quantization) | 3MB storage, 5.32% recall loss, incompatible with sqlite-vec INT8 | 10K+ memories OR > 50ms latency |
| N5 (two-model embedding ensemble) | 2x storage, 2x cost, diminishing returns on signal diversity | Single-model quality plateau (measure via R13) |
| R6-Stage4 kitchen sink | Post-process stage must NOT change scores | R6 implementation must enforce "no score changes in Stage 4" invariant |
| "Generation 5: Self-Improving" | Marketing language; system can be "feedback-aware" but not "self-improving" without proven closed-loop optimization | R13 running for 8+ weeks with demonstrated positive feedback signal |

### 9.3 Off-Ramp Decision Points

Not every sprint needs to be completed. The following table defines natural stopping points where the system has reached a meaningful quality plateau:

| After Sprint | Quality Gate | What's Established | Decision |
|-------------|-------------|-------------------|----------|
| S0+S1 | MRR@5 baseline + graph functional | Measurement capability; 4-channel hybrid operational | Minimum viable measurement — continue unless BM25 contingency triggers |
| **S2+S3** | **Calibrated scores + query intelligence** | **Calibrated scoring, cold-start handling, query routing, RSF alternative evaluated** | **Recommended minimum viable stop** |
| S4+S5 | Feedback loop + pipeline refactor | Closed-loop learning; modernized pipeline architecture | Full optimization available |
| S6+S7 | Graph deepening + long horizon | Maximum graph utilization; advanced features | Diminishing returns likely |

**"Good enough" thresholds:**
- MRR@5 ≥ 0.7
- Constitutional surfacing rate ≥ 95%
- Cold-start detection rate ≥ 90%

If all three thresholds are met after any sprint pair, further investment should be justified by specific use-case requirements rather than general quality improvement.

### 9.4 Over-Engineering Detected

| Proposal | Assessment | Simpler Alternative |
|----------|-----------|-------------------|
| Full N3 consolidation (30-40h) | Over-engineered for ~2K memories | N3-lite: contradiction scan + Hebbian strengthening (~75 LOC) |
| N2 community detection at P0 | Premature — requires edge density > 1.0 edges/node | Fix G1 + implement R4 first; gate N2 on density measurement |
| 4-phase risk grouping | Causes 3-4 subsystem context switches per phase | 7 subsystem-coherent sprints with metric gates |
| LOC-based effort estimates | Systematically undercount by 2-3x | Hour-based estimates including tests, flags, migrations, integration |

---

## 10. Feature Flag Governance

### 10.1 The Problem

The recommendations propose 17 new flags + 7 existing = **24 total boolean flags**. 2^24 = 16,777,216 possible combinations. This is a systemic risk that affects the entire recommendation set.

### 10.2 Governance Rules

1. **Maximum 6 simultaneous active flags** at any time. Before adding flag #7, sunset one existing flag (either permanently enable or permanently disable).

2. **Naming convention:** `SPECKIT_{FEATURE}` for on/off toggles; `SPECKIT_{FEATURE}_{PARAM}` for configuration knobs.

3. **Lifecycle:**
   - Flag created → **dark-run** (both paths execute, only control path used) → **shadow** (both paths execute, experimental path logged) → **enabled** (experimental path active) → **permanent** (flag removed, code path hardened)
   - Maximum flag lifespan: 90 days from creation to permanent decision
   - Sunset audit: monthly review of all active flags

4. **Independence groups** for testing:

   | Group | Flags | Interaction Level |
   |-------|-------|------------------|
   | A: Search Pipeline | DOCSCORE, DEGREE_BOOST, CHANNEL_MIN_REP, RSF_FUSION, COMPLEXITY_ROUTER, ADAPTIVE_FUSION, MMR, CAUSAL_BOOST | HIGH — test all 256 combinations |
   | B: Feedback & Learning | LEARN_FROM_SELECTION, EMBEDDING_EXPANSION, NOVELTY_BOOST, ENCODING_INTENT | MEDIUM with A — test 50 critical paths |
   | C: Infrastructure | EVAL_LOGGING, PIPELINE_V2, EXTENDED_TELEMETRY, MULTI_QUERY, CROSS_ENCODER | LOW — test in isolation |
   | D: Background | CONSOLIDATION, AUTO_ENTITIES, CHUNK_THINNING, MEMORY_SUMMARIES, SPEC_PREFILTER | LOW with A — test on enable/disable only |

5. **Automated testing budget:**
   - Level 1 (unit): Each flag in isolation — 24 tests, ~5 min
   - Level 2 (pair): All documented interaction pairs — 12 pairs × 2 states, ~10 min
   - Level 3 (group): All Group A combinations — 256 tests, ~45 min
   - Level 4 (cross-group): Group A × B critical paths — ~50 selected, ~2 hours
   - Level 5 (phase): End state of each sprint — manual validation, ~1 day each

---

## 11. Success Metrics Per Sprint

| Sprint | Primary Metric | Target | Secondary Metrics |
|--------|---------------|--------|-------------------|
| **S0** | Graph hit rate | > 0% (from 0%) | Chunk dedup verified; BM25 baseline MRR@5 recorded |
| **S1** | MRR@5 delta from R4 | > +2% absolute (or +5% relative, whichever larger) | Edge density measurement; no single memory > 60% presence; G-NEW-2 consumption report |
| **S2** | Re-index cache hit rate | > 90% | Score distribution normalization verified; G2 resolved |
| **S3** | Simple query p95 latency | < 30ms | RSF shadow comparison: Kendall tau ≥ 0.6 on minimum 100 queries (tau < 0.4 = reject RSF variant); R2 precision within 5% |
| **S4** | Feedback loop signal quality | > 30% positive signal (defined as: queries where R4 graph signal moves a relevant result into top-5) on eval queries | R1 MRR@5 within 2%; R11 noise rate < 5% (measured as: learned triggers failing to match relevant queries / total learned triggers × 100, evaluated monthly) |
| **S5** | R6 ordering difference count | = 0 on eval corpus | All 158+ tests pass; R12 latency within budget |
| **S6** | Graph channel attribution | > 10% of final top-K | R10 false positive rate < 20%; N3-lite detects known contradictions |

### Cumulative Health Dashboard

After Sprint 6 completion, the system should show:

| Metric | Sprint 0 Baseline | Sprint 6 Target | Measurement Method |
|--------|-------------------|-----------------|-------------------|
| MRR@5 | (to be measured) | +10-15% improvement | R13 eval framework |
| Graph hit rate | 0% | > 20% | Retrieval telemetry |
| Channel diversity (unique sources in top-5) | ~2.0 (vector + FTS5 dominate) | > 3.0 | R13 channel attribution |
| Search latency p95 | (to be measured) | < 300ms for complex queries | R13 logging |
| Active feature flags | 0 | ≤ 6 | Flag inventory audit |
| Eval ground truth size | 0 | > 500 query-relevance pairs | R13 ground truth table |
| Edge density (edges/node) | (unknown) | > 1.0 | Graph statistics |

### 11.5 Resource Planning

| Parameter | Value |
|-----------|-------|
| **Assumption** | 1 developer, ~15h/week productive implementation capacity |
| **Parallel tracks** | A-G (from §5.2) can distribute to additional developers |
| **Skill requirements** | TypeScript, SQLite/FTS5, IR evaluation methodology |
| **Solo timeline** | 18-26 weeks (Sprints 0-6, excluding Sprint 7) |
| **Dual-developer timeline** | 9-13 weeks (independent tracks A-G assigned to different developers) |
| **Critical path** | G1 → R4 → R13-S1 → R14/N1 → R6 = ~90-125h sequential regardless of parallelism |

> **Effort reconciliation:** Itemized sprint sums: S0=30-45h, S1=22-31h, S2=19-29h, S3=26-40h, S4=39-56h, S5=64-92h, S6=68-101h = **268-394h total** (S0-S6). Headline uses rounded 270-395h. Sprint 7 (45-62h) excluded from core range. The Companion Analysis document uses 245-350h; the difference reflects this document's more conservative estimates for Sprint 5/6 after accounting for test code, flag wiring, and integration testing.

---

## 12. Test Expansion Strategy Per Sprint

Each sprint introduces new behavior gated behind feature flags. The test suite must expand to validate both the flag-off (existing behavior preserved) and flag-on (new behavior correct) paths.

| Sprint | New Tests Required | Test Focus | Estimated Test LOC |
|--------|-------------------|------------|-------------------|
| **S0** | 8-12 | G1: graph channel returns numeric IDs; G3: chunk dedup on all code paths; R17: fan-effect divisor bounds; R13-S1: eval DB schema creation, logging hooks fire, metric computation; G-NEW-1: BM25-only query path | 200-300 |
| **S1** | 6-10 | R4: degree computation SQL correctness, normalization bounds, MAX_TYPED_DEGREE cache invalidation, constitutional exclusion; G-NEW-2: consumption instrumentation hooks | 250-400 |
| **S2** | 8-12 | R18: cache hit/miss paths, LRU eviction, model version invalidation; N4: decay curve at 0h/12h/24h/48h, cap enforcement; G2: intent weight application count; score normalization bounds | 200-350 |
| **S3** | 10-14 | R15: complexity classification accuracy (10+ test queries per tier), minimum 2-channel enforcement; R14/N1: RSF vs RRF ordering equivalence on known queries, all 3 fusion variants; R2: channel minimum-rep with empty channels, quality floor | 350-500 |
| **S4** | 10-15 | R1: MPAB N=0, N=1, N=2, N=10 cases, metadata preservation; R11: separate column isolation from FTS5, TTL expiry, denylist enforcement, cap limits, eligibility exclusion (<72h); R13-S2: shadow scoring infrastructure, ground truth Phase B | 400-550 |
| **S5** | 15-20 | R6: pipeline ordering equivalence (full eval corpus regression), stage boundaries (Stage 4 no-score-change invariant), all 158+ existing tests; R9: cross-folder query equivalence; R12: expansion quality, R15 mutual exclusion; S2/S3: template/validation metadata | 500-700 |
| **S6** | 12-18 | R7: recall preservation within 10%; R10: false positive rate measurement; N2: graph feature attribution; N3-lite: contradiction detection, Hebbian bounds, edge caps; S4: hierarchy traversal | 350-500 |

**Cumulative test growth:** ~70-100 new tests across S0-S6, approximately doubling the existing 158+ test suite.

**Flag interaction testing:** See §10.2 item 5 for the 5-level automated testing budget covering isolation, pair, group, cross-group, and phase testing.

---

## 13. Migration Safety Checklist

Three sprints introduce schema changes. All migrations must follow this checklist.

### Schema Changes Inventory

| Sprint | Change | Type | Rollback Method |
|--------|--------|------|-----------------|
| **S0** | `CREATE DATABASE speckit-eval.db` (5 tables) | New database | `DROP DATABASE` / delete file |
| **S2** | `CREATE TABLE embedding_cache (...)` | New table in primary DB | `DROP TABLE embedding_cache` |
| **S4** | `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'` | New nullable column | `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+) |

### Migration Protocol

1. **Backup before migration:** `cp speckit-memory.db speckit-memory.db.bak` before any `ALTER TABLE` or `CREATE TABLE` in the primary database
2. **Nullable with defaults:** All new columns MUST be nullable with sensible defaults (e.g., `DEFAULT '[]'`). Never add `NOT NULL` columns to existing tables without data backfill
3. **Forward-compatible reads:** Code must handle the column not existing (for rollback scenarios). Use `try/catch` on column access or check schema version
4. **Separate database preference:** New subsystems (eval infrastructure) use separate SQLite files rather than extending the primary database schema
5. **Migration ordering:** S0 eval DB is independent. S2 cache table is independent. S4 learned_triggers depends on S0 eval being operational (for R11's R13 dependency)
6. **No destructive migrations:** Never `DROP COLUMN` or `ALTER COLUMN TYPE` in forward migrations. Only add
7. **Atomic execution:** Each migration runs in a single transaction. Failure = full rollback, no partial state
8. **Version tracking:** Store migration version in a `schema_version` table or pragma. Check on startup

### Rollback Procedures

| Scenario | Action | Data Loss |
|----------|--------|-----------|
| S0 eval DB corrupt | Delete `speckit-eval.db`, re-create on next run | Eval data only (regenerable from synthetic ground truth) |
| S2 cache table issues | `DROP TABLE embedding_cache` | Cache only (re-populated on next re-index) |
| S4 learned_triggers regression | Set all `learned_triggers = '[]'` or `DROP COLUMN` | Learned triggers only (30-day TTL data, regenerable) |

---

## 14. Dark-Run Performance Budget

Sprints 1-5 require dark-run comparison where both old and new code paths execute simultaneously. For a real-time MCP server called by AI agents during active coding sessions, this dual execution has measurable latency impact.

### Latency Bounds During Dark-Run

| Sprint | Dark-Run Items | Additional Computation | Max Acceptable Overhead | Mitigation |
|--------|---------------|----------------------|------------------------|------------|
| **S1** | R4 degree scoring | 1 SQL query (cached) + log normalization per result | +10ms p95 | Cache MAX_TYPED_DEGREE; batch degree lookups |
| **S2** | N4 cold-start boost | 1 timestamp comparison + exp() per result | +2ms p95 | Negligible — pure arithmetic |
| **S3** | R15 complexity routing, R14/N1 RSF shadow | Duplicate fusion computation (RRF + RSF) | +50ms p95 | Run RSF async; log results without blocking response |
| **S4** | R1 MPAB, R11 shadow logging | Chunk aggregation + query logging | +15ms p95 | MPAB runs on already-fetched data; logging is fire-and-forget |
| **S5** | R6 pipeline V2 shadow | Full duplicate pipeline execution | +100ms p95 | Run V2 pipeline async in background; compare results post-response |

### Hard Limits

- **Search response time:** MUST NOT exceed **500ms p95** during any dark-run phase (current baseline: ~100-200ms estimated)
- **If dark-run overhead exceeds budget:** Switch to async-only dark-run (log comparison results after response is returned to caller)
- **Monitoring:** R13 eval logging MUST track `dark_run_overhead_ms` per query during dark-run phases
- **Escape hatch:** If any dark-run causes p95 > 500ms for 24h, disable dark-run and switch to batch offline comparison using R13 eval corpus

---

## 15. Rollback Complexity Per Sprint

Not all sprints are equally reversible. Later sprints accumulate schema changes, cross-subsystem dependencies, and feature flags that make rollback progressively harder.

| Sprint | Rollback Difficulty | Reason | Rollback Method | Estimated Rollback Time |
|--------|-------------------|--------|-----------------|------------------------|
| **S0** | LOW | 3 isolated bug fixes + new separate DB | Revert 3 functions; delete eval DB | 1-2h |
| **S1** | LOW | Single new channel behind flag | Disable `SPECKIT_DEGREE_BOOST` flag; revert R4 code | 1-2h |
| **S2** | LOW | Additive cache table + scoring tweak | Drop cache table; disable `SPECKIT_NOVELTY_BOOST` | 2-3h |
| **S3** | MEDIUM | 3 interacting fusion/routing changes | Disable 3 flags; but R15+R2+R14/N1 interact — must disable together or verify independent rollback | 3-5h |
| **S4** | MEDIUM-HIGH | Schema change (learned_triggers) + feedback loop | Disable `SPECKIT_LEARN_FROM_SELECTION`; clear learned_triggers data; R1 flag independent | 4-6h |
| **S5** | HIGH | Pipeline refactor touches core search path | Checkpoint exists (5.1); but R6 V2 pipeline may have downstream dependents by Sprint 6. Revert to checkpoint; re-run tests | 8-12h |
| **S6** | HIGH | 6 items across 3 subsystems; graph mutations may be irreversible | Edge deletions from N3-lite are destructive; R10 auto-entities must be tagged for selective removal. Use `created_by` provenance for cleanup | 12-20h |

**Key insight:** Always create a `memory_checkpoint_create()` before Sprint 5 and Sprint 6 (Sprint 5 already mandates this at item 5.1). Consider adding checkpoints before Sprint 4 as well, since R11 learned_triggers represent the first mutation-producing feedback loop.

---

## 16. Complete "What NOT to Do" List

Consolidated from all 4 prior research documents and 13 agent investigations:

### Technical Prohibitions
1-7. See §9.1 Anti-Patterns (carried forward from original analysis)
8. Do NOT modify scores in pipeline Stage 4 (filter and annotate only)
9. Do NOT apply intent weights in more than one pipeline stage
10. Do NOT store learned triggers in the `trigger_phrases` column (use separate column)
11. Do NOT enable R11 mutations without R13 query provenance accumulation (minimum 200 pairs)
12. Do NOT implement graph deepening features (centrality, communities) before measuring edge density
13. Do NOT exceed 6 simultaneous active feature flags

### Effort Estimation Prohibitions
14. Do NOT trust LOC-based estimates — multiply by 2-3x for realistic hours including tests, flags, migrations
15. Do NOT skip dark-run comparison for ANY scoring change
16. Do NOT proceed past a sprint gate without meeting the metric threshold

### Architectural Prohibitions
17. Do NOT treat the dual scoring system (RRF + composite) as an architectural defect — it is a calibration problem
18. Do NOT build auto-entity extraction (R10) before confirming graph sparsity via measurement
19. Do NOT implement full N3 consolidation at current scale — use N3-lite
20. Do NOT merge near-duplicate memories automatically (destructive; incorrect merges lose nuance)

---

## Conclusion

The 30 active recommendations converge toward a single architectural destination: **graph-differentiated, feedback-aware retrieval**. The path requires three interventions in strict order:

1. **Measure** (Sprint 0: G1+G3+R13+R17) — Fix silent failures and establish retrieval quality metrics. Without this, every subsequent change is speculation.

2. **Differentiate** (Sprints 1-3: R4, R18, N4, R15, R14/N1, R2) — Activate the graph signal, calibrate scoring, and add query intelligence. Each change validated by metric gate.

3. **Learn** (Sprints 4-6: R1, R11, R6, R10, N3-lite) — Close feedback loops, refactor the pipeline, and deepen the graph. Each change gated on accumulated evaluation data.

**The metric that tracks overall progress:** Graph channel hit rate, measured from Sprint 0 baseline (0%) through Sprint 6 completion (target: >20%). This single metric captures the system's transformation from a 3-channel retrieval system with dormant graph capabilities to a 5-channel system where the most orthogonal signal is fully activated and enriched.

**Total realistic effort: 270-395h across 7 sprints over 18-26 weeks** (S0-S6 itemized; Sprint 7 adds 45-62h if activated). This is 2x the original estimate — the discrepancy comes from systematically accounting for test code, feature flag wiring, schema migrations, integration testing, and dark-run comparison that LOC-based estimates omit.

This synthesis supersedes all prior recommendation documents. The companion analysis (`142 - FINAL-analysis`) provides the architectural reasoning; this document provides the actionable implementation plan.

---

*Synthesized from 13 independent agent investigations: 5 analytical deep-dives (corrections, signals, priorities, architecture, deduplication), 5 synthesis analyses (feasibility, risks, roadmap, gaps, evidence), and 3 ultra-think meta-synthesis agents. All code sketches verified against source. All risks stress-tested. Wave 1+2 scratch files preserved in `scratch/` for audit trail.*
