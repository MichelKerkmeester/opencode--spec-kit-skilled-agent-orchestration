# 143 - Gap Analysis: Additional Feature Recommendations

> **Cross-reference of ~120+ research recommendations against 30 planned items across 8 sprints (57 tasks) to identify features recommended in research but NOT yet mapped to any sprint.**

**Date:** 2026-02-26
**Source Documents Analyzed:**
- `140 - analysis-hybrid-rag-fusion-architecture.md`
- `140 - recommendations-hybrid-rag-fusion-refinement.md`
- `141 - analysis-deep-dive-10-agent-synthesis.md`
- `141 - recommendations-deep-dive-10-agent-synthesis.md`
- `142 - FINAL-analysis-hybrid-rag-fusion-architecture.md`
- `142 - FINAL-recommendations-hybrid-rag-fusion-refinement.md`
- `scratch/` (16 files: wave1-*, wave2-*, research-*)

**Method:** 9 parallel Opus research agents, each analyzing a different source, followed by cross-reference synthesis against `spec.md`, `plan.md`, `tasks.md`, and all 8 sprint subfolder specs (`001-sprint-0` through `008-sprint-7`).

---

## Executive Summary

The 8 planned sprints cover 30 active recommendations (G1, G2, G3, G-NEW-1/2/3, R1, R2, R4, R6-R18, N1-N4, N3-lite, S1-S5) with 5 explicitly excluded (R3 SKIP, R5 DEFER, N5 DROP, R6-Stage4 PARKED, Gen5 PARKED). However, the research corpus contains **31 additional recommendations** not mapped to any sprint, organized below into 4 categories by readiness and value.

**Total additional effort if all high/medium gaps addressed:** ~100-150h
**Top 5 recommended additions only:** ~22-34h (~6-8% budget increase)

---

## Category A: High-Value Gaps (Should Consider Adding)

### A1. Dynamic Token Budget Allocation

- **Source:** 140-analysis Section 3.7, 6.2 row 3
- **What:** Replace static per-tool token budgets (500-2000) with adaptive allocation based on query complexity. Compute overhead first (system prompt, KG context, query), then dynamically allocate remaining budget to content. Follows LightRAG's pattern.
- **Why it matters:** Current static budgets waste context on simple queries and starve complex ones. Every query gets the same budget regardless of whether it needs 200 tokens or 2000.
- **Suggested sprint:** S3 (alongside R15 query complexity router -- natural pairing, both adapt to query complexity)
- **Effort estimate:** ~8-12h
- **Dependencies:** None (independent of other recommendations)
- **Risk:** LOW (additive, feature-flaggable)

---

### A2. Full-Context Alternative Evaluation

- **Source:** scratch/wave2-gaps.md (unique finding #26)
- **What:** At current scale (~2000 memories), evaluate whether sending ALL memory titles in context to the LLM and letting it select outperforms retrieval entirely. A zero-cost experiment that challenges the fundamental RAG assumption at this corpus size.
- **Why it matters:** If full-context beats retrieval at this scale, the entire optimization roadmap's ROI changes. This is the most paradigm-informing experiment possible. It costs almost nothing and could redirect hundreds of hours of effort.
- **Suggested sprint:** S0 (alongside G-NEW-1 BM25 baseline -- same paradigm-validation logic)
- **Effort estimate:** ~4-6h
- **Dependencies:** None
- **Risk:** LOW (read-only experiment, no code changes)
- **Decision matrix:**
  - Full-context >= 90% of hybrid: **PAUSE** retrieval optimization entirely
  - Full-context 60-90% of hybrid: **PROCEED** but add full-context as fallback mode
  - Full-context < 60% of hybrid: **PROCEED** with current roadmap (retrieval justified)

---

### A3. Learned Fusion Weight Optimization

- **Source:** 141-analysis F2, anti-pattern 1 across all four analyzed systems
- **What:** All four analyzed systems (zvec, LightRAG, PageIndex, spec-kit Memory) use fixed or manually-tuned fusion weights. None learn optimal weights from user feedback. This is a solved problem in ML (LambdaMART, RankNet). Wire `memory_validate` feedback and `learnFromSelection()` data into a weight learning loop that adjusts channel and scoring weights over time.
- **Why it matters:** R14/N1 adds RSF as an alternative fusion algorithm but still uses hand-tuned weights. Learning from accumulated feedback data would compound all other improvements multiplicatively rather than additively.
- **Suggested sprint:** S4 or S5 (requires R13 evaluation data + R11 feedback loop to be operational)
- **Effort estimate:** ~15-20h
- **Dependencies:** R13 (evaluation data), R11 (feedback data), R14/N1 (fusion alternatives)
- **Risk:** MEDIUM (wrong learned weights could degrade quality; requires shadow-mode validation)
- **Minimum data requirement:** 500+ query-result-feedback triples before activation

---

### A4. Negative Feedback Loop Strengthening

- **Source:** 141-analysis F4, anti-pattern 5 across all systems
- **What:** `memory_validate(wasUseful: false)` currently decreases confidence, but `confidence` is never used in the search scoring path (it's a dead signal -- identified as Gap G6 in 141-analysis). The path from negative validation to actual ranking demotion is indirect and weak. Strengthen it by: (1) incorporating `confidence` into composite scoring, (2) adding a negative feedback multiplier that actively demotes memories with consistently negative validation.
- **Why it matters:** Without functional negative feedback, bad memories persist at their original rank forever. R11 learns from positive signals, but there's no symmetric mechanism for demotion.
- **Suggested sprint:** S4 (alongside R11 learned relevance feedback -- symmetric positive/negative pairing)
- **Effort estimate:** ~4-6h
- **Dependencies:** B2 activation of unused quality signals (already identified as dead code)
- **Risk:** LOW (gradual demotion with floor, feature-flaggable)

---

### A5. Session Query History as Retrieval Signal

- **Source:** 141-analysis H1, Section 7.3
- **What:** Use the current session's query history to boost contextually related memories beyond simple dedup. If "database schema" was queried earlier in the session, subsequent queries about "migration" should boost database-related migration memories. Implement as a session context vector: rolling average of recent query embeddings that provides a contextual boost to semantically similar memories.
- **Why it matters:** Working memory currently only does dedup and session-boost flag. It doesn't inform ranking with sequential context. Agents work in topical sessions, and retrieval should understand that context.
- **Suggested sprint:** S3 (alongside R15 query intelligence -- both enhance query understanding)
- **Effort estimate:** ~8-12h
- **Dependencies:** Working memory infrastructure (already exists)
- **Risk:** MEDIUM (session context could bias toward recent topics, missing cross-topic needs)

---

### A6. Online Quality Self-Diagnosis

- **Source:** 141-analysis E2, anti-pattern 3 across all systems
- **What:** Real-time quality estimation beyond R13's offline evaluation:
  - **Distribution monitoring:** Detect score collapse (all results score ~0.5) or score inflation
  - **Channel health monitoring:** Detect dead channels (0 contributions over N queries)
  - **Confidence calibration:** Verify that high-confidence results are actually validated as useful more often
  - Surface alerts in `memory_health` or as warnings in search responses
- **Why it matters:** R13 provides offline batch evaluation, but nothing alerts in real-time when retrieval quality degrades. A channel could silently die (like the graph channel currently returns 0% due to G1) and go undetected.
- **Suggested sprint:** S2 (alongside measurement infrastructure) or S4 (after R13 data exists)
- **Effort estimate:** ~10-15h
- **Dependencies:** R13 (evaluation logging for calibration data)
- **Risk:** LOW (read-only monitoring, no score modifications)

---

### A7. Co-Activation Boost Strength Increase

- **Source:** 141-analysis C1, Gap G7
- **What:** R17 adds the fan-effect divisor to prevent hub domination, but the fundamental problem remains: co-activation boost is only 0.1x multiplier with 0.5 decay per hop. The effective boost at hop 2 is only `0.1 * 0.5 = 0.05` (5%). The graph channel is the most orthogonal signal (lowest correlation with other channels, per ensemble learning theory) but contributes the least to final results. Increase the base multiplier to 0.25-0.3x (with R17's fan-effect divisor keeping hubs in check).
- **Why it matters:** R4 adds graph degree as a 5th RRF channel, but graph neighborhood signals (co-activation) remain nearly invisible. R17 fixes the distribution problem but doesn't fix the magnitude problem.
- **Suggested sprint:** S1 (alongside R4 graph signal activation -- natural pairing, same subsystem)
- **Effort estimate:** ~2-4h
- **Dependencies:** R17 (fan-effect divisor must be in place first to prevent hub domination at higher boost)
- **Risk:** LOW (configurable via existing coefficient, dark-run testable)

---

## Category B: Medium-Value Gaps (Worth Planning)

### B1. Per-Chunk Source Attribution Preservation

- **Source:** 141-analysis D4
- **What:** During chunk collapse in `collapseAndReassembleChunkResults()`, per-chunk source attribution (which channel found which chunk) is lost. The collapsed parent memory has aggregate `sources[]` but not per-chunk channel mapping.
- **Why it matters:** Without this, R13 evaluation can't measure per-channel contribution at the chunk level, and debugging why a multi-chunk memory ranked where it did becomes opaque.
- **Suggested sprint:** S4 (alongside R1 MPAB chunk aggregation -- same code area)
- **Effort estimate:** ~4-6h
- **Risk:** LOW (additive metadata, no behavioral change)

---

### B2. Chunk Ordering Preservation Within Documents

- **Source:** 141-analysis D5
- **What:** Original chunk order within a document is not preserved during the collapse process. When content is reassembled from multiple chunks, the output may be incoherent because chunks appear in retrieval-score order rather than document order.
- **Suggested sprint:** S4 (alongside R1 MPAB -- same code area)
- **Effort estimate:** ~2-4h
- **Risk:** LOW

---

### B3. Decouple Spec-Kit Scripts from MCP Server Internals

- **Source:** 141-analysis I1, Gap G11
- **What:** `memory-indexer.ts` has a compile-time import directly into MCP server internals (`vectorIndex.indexMemory()`). This prevents independent versioning and creates a tight coupling boundary that makes either system harder to evolve.
- **Suggested sprint:** S5 (alongside R6 pipeline refactor -- architectural sprint)
- **Effort estimate:** ~8-12h
- **Risk:** MEDIUM (interface change, requires coordination)

---

### B4. Formal Interface Contract (Spec-Kit <-> MCP Server)

- **Source:** 141-analysis I2, Gap G12
- **What:** No formal API boundary exists between the spec-kit logic layer and the Memory MCP server. The two systems share a SQLite database file directly. A formal interface contract would enable independent evolution, testing, and versioning.
- **Suggested sprint:** S5 (alongside R6 and B3 -- architectural sprint)
- **Effort estimate:** ~12-16h
- **Risk:** MEDIUM (boundary definition requires careful design)

---

### B5. Embedding Quality & Distribution Monitoring

- **Source:** 141-analysis K1, anti-pattern 2 across all systems
- **What:** All vector-using systems treat the embedding model as a black box. None measure embedding quality, detect distribution drift, or validate health. The system supports multiple providers but uses only one at a time. Implement: (1) embedding dimension sanity checks, (2) distribution monitoring (detect collapse where all vectors cluster), (3) provider health tracking (API latency, error rates).
- **Suggested sprint:** S2 (alongside R18 embedding cache -- same subsystem)
- **Effort estimate:** ~6-10h
- **Risk:** LOW (monitoring only)

---

### B6. RRF K-Value Tuning Investigation

- **Source:** 140-recommendations FI5
- **What:** Current RRF uses K=60 (the standard default). This may not be optimal for this specific corpus and query patterns. Investigate K=30-100 range using R13 evaluation data. Lower K amplifies high-ranked results, higher K produces smoother blending.
- **Suggested sprint:** S3 (alongside R14/N1 fusion alternatives -- natural comparison)
- **Effort estimate:** ~4-6h
- **Risk:** LOW (parameter sweep using eval data)

---

### B7. Quality Proxy Formula for Automated Regression

- **Source:** scratch/research-evaluation-framework.md (unique finding #2)
- **What:** Composite automated quality metric for regression testing without human judges:
  ```
  qualityProxy = avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15
  ```
  Enables automated CI/CD regression checks for retrieval quality.
- **Why it matters:** Without this, every sprint gate requires manual evaluation. This gives R13 an automated regression signal from day one.
- **Suggested sprint:** S0 (alongside R13-S1 eval infrastructure)
- **Effort estimate:** ~4-6h
- **Risk:** LOW (additive metric, doesn't affect behavior)

---

### B8. Signal Count Ceiling Enforcement (~8-12 Active Signals)

- **Source:** scratch/wave1-signals.md (unique finding #16)
- **What:** With 15+ scoring signals and zero ground truth data, hand-tuned weights become unreliable beyond 8-12 active signals. Interactions between signals create unpredictable emergent behavior. The roadmap adds MORE signals (R4, N4, R16, etc.) without removing old ones. Impose a governance rule: maximum 8-12 active scoring signals at any time. Adding a new one requires deactivating or merging an existing one.
- **Why it matters:** More signals ≠ better quality when weights are hand-tuned. Signal interference is a well-documented problem in information retrieval.
- **Suggested sprint:** Cross-cutting governance rule (alongside feature flag governance)
- **Effort estimate:** ~2h (policy definition)
- **Risk:** LOW (governance, no code change)

---

### B9. Two-Pass Gleaning for Causal Link Extraction

- **Source:** 140-analysis Section 7.2
- **What:** LightRAG pattern for higher-quality causal link discovery: (1) first pass extracts entities/relationships from memory content, (2) second pass asks "did we miss anything?" to catch false negatives. Reduces missed links by ~15-25% in LightRAG benchmarks.
- **Suggested sprint:** S6 (alongside R10 auto entity extraction -- same subsystem, same pipeline)
- **Effort estimate:** ~6-10h
- **Dependencies:** R10 (auto entity extraction)
- **Risk:** MEDIUM (requires LLM calls, latency concern at index time)

---

### B10. Weighted Chunk Selection via Reference Frequency

- **Source:** 140-analysis Section 7.5
- **What:** Use how often a chunk is referenced (by multiple causal edges, trigger phrases, or cross-references) as a relevance signal. Chunks referenced by multiple independent sources score higher than chunks referenced only once. LightRAG uses this as a linear gradient based on chunk occurrence across entities.
- **Suggested sprint:** S6 (alongside graph deepening sprint)
- **Effort estimate:** ~4-8h
- **Dependencies:** R10 (entity extraction provides reference data)
- **Risk:** LOW (additive scoring signal)

---

## Category C: Research-Stage Items (Future Investigation)

These appeared in the research but are not ready for sprint planning. They require further investigation before commitment.

| # | Feature | Source | Description | Potential Impact |
|---|---------|--------|-------------|-----------------|
| C1 | **Matryoshka Embeddings** | 140-rec FI1 | Dimension truncation (768 -> 384 -> 192) as complementary approach to quantization. Enables multi-resolution search. | MEDIUM -- storage reduction + speed |
| C2 | **SPLADE / Learned Sparse Retrieval** | 140-rec FI2 | Replace hand-crafted BM25 channel with a learned sparse retrieval model. Better term weighting without manual tuning. | HIGH -- could replace BM25 entirely |
| C3 | **ColBERT Multi-Vector** | 140-rec FI3, IMPROVE-010 | Multi-representation per memory (one vector per token) for richer late-interaction matching. | HIGH -- fundamentally better matching |
| C4 | **Fine-Tune Embeddings on Corpus** | scratch/wave2-gaps | Domain-specific embedding fine-tuning on the memory corpus. Better representations for spec-kit's unique vocabulary. | HIGH -- domain adaptation |
| C5 | **Two-Stage Search** | 140-rec FI6 | Summary pre-filter at full precision, then INT8 detail search for top candidates. Combines accuracy with speed. | MEDIUM -- tied to deferred R5 |
| C6 | **PageIndex Dual Thresholds** | scratch/research-pageindex | Use both token count AND section count (not just tokens) for deciding when to split content. Prevents structurally complex but token-short content from being left unsplit. | LOW-MEDIUM |
| C7 | **Entropy-Calibrated Batch Quantization** | 140-analysis Section 7.1 | KL divergence minimization for optimal INT8 clipping during batch re-index. Better compression quality than per-record min/max. | LOW -- tied to deferred R5 |
| C8 | **LightRAG Delimiter Format** | scratch/research-lightrag | Use `<\|#\|>` instead of JSON for LLM entity extraction output. Dramatically improves extraction reliability. | LOW -- applicable only if R10 uses LLM |

---

## Category D: Reactive Mitigations (Need Proactive Detection Triggers)

These are mentioned as "reactive" or "monitor and adjust" in the research but would benefit from explicit detection logic and automated triggers rather than manual observation.

| # | Mitigation | What It Prevents | Trigger Condition | Suggested Sprint | Effort |
|---|-----------|-----------------|-------------------|------------------|--------|
| D1 | **Keyword Blindness Detection** | Important exact-match results buried by RRF | Term match bonus drowned out (monitor via R13 per-channel metrics) | S3 | ~2-4h |
| D2 | **Popularity Bias Mitigation** (log saturation cap on `access_count`) | Frequently accessed memories always ranking highest, starving newer relevant ones | Access count exceeds 2 standard deviations above mean | S4 (with N4 cold-start) | ~2-4h |
| D3 | **Context Drift Detection** (periodic validity audits) | Old memories semantically matching but containing outdated information | Memories not updated in 180+ days with high retrieval frequency | S6 (with N3-lite staleness) | ~4-6h |
| D4 | **R13 Observer Effect Mitigation** | Eval instrumentation changing system behavior through I/O overhead | Search p95 increases >10% after enabling eval logging | S0 (during R13 design) | ~2-4h |
| D5 | **`computeStructuralFreshness()` Activation Decision** | Dead code wasting maintenance effort or missing valuable signal | Currently unassigned; evaluate after Sprint 6 whether it adds orthogonal signal or should be removed | S7 | ~2-4h |

---

## Impact vs. Effort Matrix

```
HIGH IMPACT
  |
  |  A2 (full-context)         A3 (learned weights)
  |  A1 (dynamic budgets)      A6 (self-diagnosis)
  |  A7 (co-activ. strength)   A4 (negative feedback)
  |  A5 (session history)      B3/B4 (decouple arch.)
  |  B7 (quality proxy)        B5 (embed. monitoring)
  |
  +-----------------------------------------------------
  |
  |  B8 (signal ceiling)       B9 (two-pass gleaning)
  |  B6 (K-value tuning)       B10 (ref frequency)
  |  B1 (chunk attribution)    B2 (chunk ordering)
  |  D1-D5 (reactive mitig.)
  |
LOW IMPACT
  +------------------------------------------------------->
       LOW EFFORT                         HIGH EFFORT
       (2-6h)                             (12-20h)
```

---

## Top 5 Recommended Additions

If only 5 items can be added, these provide the highest ROI:

### 1. A2: Full-Context Alternative Evaluation
- **Sprint:** S0 | **Effort:** 4-6h | **Impact:** Paradigm-informing
- The single highest-ROI experiment possible. If full-context beats retrieval at ~2000 memories, the roadmap priorities shift dramatically. It's cheap and the answer determines whether hundreds of hours are well-spent.

### 2. A1: Dynamic Token Budget Allocation
- **Sprint:** S3 | **Effort:** 8-12h | **Impact:** Direct quality improvement
- Pairs naturally with R15 query complexity router. Both adapt system behavior to query complexity. Static budgets are the simplest thing to improve for immediate quality gains.

### 3. A7: Co-Activation Boost Strength Increase
- **Sprint:** S1 | **Effort:** 2-4h | **Impact:** Amplifies graph channel investment
- R17 fixes the fan-effect problem but doesn't fix the magnitude problem. Without this, the graph channel remains nearly invisible even after R4 adds degree scoring. Trivial effort, directly amplifies the entire graph investment.

### 4. A4: Negative Feedback Loop Strengthening
- **Sprint:** S4 | **Effort:** 4-6h | **Impact:** Completes feedback symmetry
- R11 learns from positive signals. Without negative feedback strengthening, bad memories never get demoted. The `confidence` signal already exists but is dead -- activating it and connecting it to negative validation completes the feedback loop.

### 5. B7: Quality Proxy Formula
- **Sprint:** S0 | **Effort:** 4-6h | **Impact:** Enables automated sprint gates
- Gives R13 an automated regression metric from day one. Without it, every sprint exit gate requires manual evaluation. This single formula automates regression detection.

**Total for Top 5:** ~22-34h (~6-8% increase over 313-456h budget)

---

## Sprint Integration Map

If these gaps are accepted, here is where they slot into the existing sprint structure:

| Sprint | Existing Effort | Added Items | Added Effort | New Total |
|--------|----------------|-------------|-------------|-----------|
| **S0** | 30-45h | A2 (full-context eval), B7 (quality proxy), D4 (observer effect) | 10-16h | 40-61h |
| **S1** | 22-31h | A7 (co-activation strength) | 2-4h | 24-35h |
| **S2** | 19-29h | A6 (self-diagnosis), B5 (embedding monitoring) | 16-25h | 35-54h |
| **S3** | 26-40h | A1 (dynamic budgets), A5 (session history), B6 (K-value tuning) | 20-30h | 46-70h |
| **S4** | 39-56h | A4 (negative feedback), B1 (chunk attribution), B2 (chunk ordering), D2 (popularity bias) | 12-20h | 51-76h |
| **S5** | 64-92h | A3 (learned weights), B3 (decouple), B4 (interface contract) | 35-48h | 99-140h |
| **S6** | 68-101h | B9 (two-pass gleaning), B10 (ref frequency), D3 (context drift) | 14-24h | 82-125h |
| **S7** | 45-62h | D5 (structuralFreshness decision) | 2-4h | 47-66h |

**Revised total (all gaps):** ~420-630h (vs. original 313-456h)
**Revised total (Top 5 only):** ~335-490h (vs. original 313-456h)

---

## Governance Note: Signal Count Ceiling (B8)

Independent of sprint placement, B8 should be adopted as a cross-cutting governance rule alongside the existing feature flag governance (max 6 simultaneous flags, 90-day lifespan). The proposed rule:

> **Maximum 8-12 active scoring signals at any time.** Adding a new scoring signal requires either (a) deactivating an existing one, or (b) demonstrating via R13 evaluation that the new signal provides orthogonal value that justifies exceeding the ceiling.

This prevents the roadmap from gradually degrading quality by accumulating hand-tuned signals beyond the point where weight interactions can be reliably managed.
