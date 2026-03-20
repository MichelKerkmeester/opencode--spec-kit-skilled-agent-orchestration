# Hybrid RAG Fusion Calibration Audit

## Scope and runtime context

This audit covers the requested scoring modules plus the minimum runtime wiring needed to determine which code paths are actually used by `memory_search`. The current `memory_search` handler builds a `PipelineConfig` and calls the 4-stage orchestrator, which in turn delegates ranking to Stage 2 (`executeStage2`) rather than calling `composite-scoring.ts` directly. A separate `hybrid-search.ts` path still exists and is used by at least eval/reporting code, so both paths matter for calibration analysis even though they are not the same runtime surface. [`mcp_server/handlers/memory-search.ts:940-968`](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L940-L968) [`mcp_server/lib/search/pipeline/orchestrator.ts:31-77`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L31-L77) [`mcp_server/handlers/eval-reporting.ts:98`](../../../../../../skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts#L98)

## Executive summary

The system is **not one calibrated scoring model**. It is a stack of rank fusion, normalization, additive bonuses, multiplicative penalties, filtering gates, and folder-level pruning spread across at least two paths. The biggest calibration risk is that several fixed bonuses and clamps are larger than the underlying rank signal they modify, especially RRF's fixed convergence bonus (`0.10`) relative to the base rank term `1 / (k + rank)` with `k = 60`. [`shared/algorithms/rrf-fusion.ts:22-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L40) [`shared/algorithms/rrf-fusion.ts:223-285`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L223-L285)

Adaptive fusion is only **partly** adaptive in live use. The code computes adaptive fused results, but `hybrid-search.ts` only consumes the returned weights and then performs a fresh plain `fuseResultsMulti(lists)` pass, which means the recency-boosted adaptive result ordering is discarded. In practice the live switch is mostly **weighted RRF vs equal-weight RRF**, not a deeper algorithmic switch. [`shared/algorithms/adaptive-fusion.ts:191-237`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L191-L237) [`shared/algorithms/adaptive-fusion.ts:344-419`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L344-L419) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745)

RSF is **not part of live ranking** in the audited implementation. Its own module marks it as dormant/shadow-only, says the feature flag and live branch were removed, and preserves the functions only for offline evaluation. The only surviving mention in `hybrid-search.ts` is metadata shape for `rsfShadow`. [`mcp_server/lib/search/rsf-fusion.ts:7-23`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L7-L23) [`mcp_server/lib/search/hybrid-search.ts:130-141`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L130-L141)

Negative feedback is directionally reasonable but **not well calibrated for rehabilitation**. Positive validations update `memory_index.confidence`, but the runtime demotion path counts durable negative events from `negative_feedback_events`; those events are never cancelled by later positive feedback and only recover through elapsed-time decay since the last negative. That means a memory can remain suppressed even after later proving useful. [`mcp_server/lib/scoring/negative-feedback.ts:74-100`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L74-L100) [`mcp_server/lib/scoring/negative-feedback.ts:146-177`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L146-L177) [`mcp_server/handlers/checkpoints.ts:352-392`](../../../../../../skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L352-L392) [`mcp_server/lib/scoring/confidence-tracker.ts:121-170`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L121-L170)

---

## 1. How multiple scoring signals interact

### 1.1 The live `memory_search` path has a single explicit scoring stage, but it still layers many signals

Stage 2 explicitly declares itself the "single authoritative point" where scoring signals are applied and lists the order: session boost, causal boost, co-activation, community boost, graph signals, testing effect, intent weights, artifact routing, feedback signals, artifact limiting, anchors, and validation metadata. That architecture prevents silent reordering inside Stage 2, but it does **not** make the overall system single-signal; it just centralizes a long chain of signal composition. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:17-45`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L17-L45) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:538-756`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L538-L756)

Within Stage 2, some signals are additive and some are multiplicative:

- Artifact routing multiplies the current score by a bounded `boostFactor`, clamped to `[0, 2]`. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:371-389`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L371-L389)
- Learned triggers add directly to score and cap at `1.0`. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:397-405`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L397-L405) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:460-464`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L460-L464)
- Negative feedback demotes multiplicatively after learned-trigger addition. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:402-405`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L402-L405) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:466-475`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L466-L475)
- Validation metadata later applies another bounded multiplier, clamped to `[0.8, 1.2]`, then clamps the score to `[0, 1]`. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:104-112`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L104-L112) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:121-152`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L121-L152)

**Implication:** signals can partially cancel each other, but the later multiplicative stages are bounded, so true runaway amplification is limited in Stage 2. The larger risk is **ordering sensitivity**: an additive boost applied before a multiplicative demotion behaves differently from the reverse order. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:364-391`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L364-L391) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:411-481`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L411-L481)

### 1.2 In the older `hybrid-search.ts` path, the strongest interaction is between tiny RRF rank mass and large fixed bonuses

RRF uses `1 / (k + rank)` with `DEFAULT_K = 60`, so the top-ranked contribution from a single channel is `1 / 61 ≈ 0.0164`. The same module then adds a fixed `CONVERGENCE_BONUS = 0.10` for multi-source matches. That fixed bonus is materially larger than any one raw top-rank contribution, so agreement across channels dominates rank position much more than the rank formula alone would suggest. [`shared/algorithms/rrf-fusion.ts:22-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L40) [`shared/algorithms/rrf-fusion.ts:245-275`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L245-L275)

The same issue appears in cross-variant fusion: the code sums per-variant RRF scores and then adds another fixed convergence bonus of `0.10 * (variantCount - 1)`. Because normalized RRF scores are later re-min-maxed, this bonus can dominate the shape before normalization and then effectively decide the entire relative ordering. [`shared/algorithms/rrf-fusion.ts:378-446`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L378-L446)

### 1.3 "Adaptive" weights also create interaction dead zones

`hybrid-search.ts` initially distinguishes FTS (`0.8`) from BM25 (`0.6`), but after calling `hybridAdaptiveFuse(...)` it overwrites both sources with the **same** `keywordWeight`. That erases the original distinction between the two lexical channels in the live fusion pass. [`mcp_server/lib/search/hybrid-search.ts:627-643`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L627-L643) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745)

Graph can also be reweighted twice conceptually: RRF has a built-in `GRAPH_WEIGHT_BOOST = 1.5` fallback when no explicit graph weight is provided, but `hybrid-search.ts` always passes an explicit graph weight (`0.5` initially, possibly overwritten by adaptive weights). That means the shared default graph boost is effectively dormant in this path, so calibration differs by callsite rather than by one canonical rule. [`shared/algorithms/rrf-fusion.ts:38-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L38-L40) [`shared/algorithms/rrf-fusion.ts:239-245`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L239-L245) [`mcp_server/lib/search/hybrid-search.ts:646-662`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L646-L662) [`mcp_server/lib/search/hybrid-search.ts:737-743`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L737-L743)

### 1.4 Folder scoring changes eligibility more than score

Folder relevance is computed as `sum(scores) / sqrt(M + 1)` and then used by `twoPhaseRetrieval(...)` to keep only the top-K folders. The post-folder results retain their original per-result scores, but low-scoring folders disappear entirely. This is not score amplification; it is a **gating/filtering** stage that can override individual item quality with folder-level aggregate quality. [`mcp_server/lib/search/folder-relevance.ts:37-85`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts#L37-L85) [`mcp_server/lib/search/folder-relevance.ts:193-238`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts#L193-L238) [`mcp_server/lib/search/hybrid-search.ts:957-975`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L957-L975)

---

## 2. Hardcoded magic numbers and whether they are justified

### 2.1 `shared/algorithms/rrf-fusion.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| `DEFAULT_K` | `60` | Explicitly justified with SIGIR 2009 RRF citation and behavior notes. [`shared/algorithms/rrf-fusion.ts:22-37`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L37) | Reasonable and documented. |
| `CONVERGENCE_BONUS` | `0.10` | No empirical calibration note; only behavior-by-implementation. [`shared/algorithms/rrf-fusion.ts:36-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L36-L40) | Too large relative to raw RRF mass at `k=60`; likely overweights agreement. |
| `GRAPH_WEIGHT_BOOST` | `1.5` | Comment says graph edges encode curated human decisions. [`shared/algorithms/rrf-fusion.ts:38-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L38-L40) | Qualitatively justified, not quantitatively calibrated. |
| `MIN_QUERY_TERM_LENGTH` | `2` | No calibration note. [`shared/algorithms/rrf-fusion.ts:42-43`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L42-L43) | Reasonable heuristic, undocumented impact. |
| `termMatchBonus` default | `0.05` per match | Mentioned in function doc only. [`shared/algorithms/rrf-fusion.ts:289-313`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L289-L313) | Heuristic; not visibly tied to ranking eval. |
| Tie normalization target | `1.0` | Implemented as "all same score -> 1.0". [`shared/algorithms/rrf-fusion.ts:469-510`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L469-L510) | Creates score dead zones. |

### 2.2 `shared/algorithms/adaptive-fusion.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| Intent profiles | per-intent semantic/keyword/recency/graph values | No provenance beyond human-readable intent names. [`shared/algorithms/adaptive-fusion.ts:60-76`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L60-L76) | These are policy choices, not calibrated weights. |
| `DOC_TYPE_WEIGHT_SHIFT` | `0.1` | Described as "small shift". [`shared/algorithms/adaptive-fusion.ts:82-86`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L82-L86) [`shared/algorithms/adaptive-fusion.ts:142-173`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L142-L173) | Qualitative, not empirically supported. |
| `RECENCY_BOOST_SCALE` | `0.1` | No calibration note. [`shared/algorithms/adaptive-fusion.ts:85-86`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L85-L86) [`shared/algorithms/adaptive-fusion.ts:245-261`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L245-L261) | Mild but arbitrary. |
| `MAX_AGE_DAYS` | `365` | No rationale beyond implementation. [`shared/algorithms/adaptive-fusion.ts:247-260`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L247-L260) | Annual horizon is arbitrary. |
| Rollout hashing | `% 100` | Standard rollout implementation. [`shared/algorithms/adaptive-fusion.ts:95-112`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L95-L112) | Operationally fine, unrelated to score calibration. |

### 2.3 `mcp_server/lib/search/rsf-fusion.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| Single-source penalty | `0.5` | "dual-confirmed items rank higher". [`mcp_server/lib/search/rsf-fusion.ts:102-105`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L102-L105) [`mcp_server/lib/search/rsf-fusion.ts:171-180`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L171-L180) | Intuitive but uncalibrated. |
| Multi-list missing-source penalty | `countPresent / totalSources` | Explained behaviorally. [`mcp_server/lib/search/rsf-fusion.ts:207-214`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L207-L214) [`mcp_server/lib/search/rsf-fusion.ts:278-288`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L278-L288) | Sensible but inactive in live ranking. |
| Cross-variant bonus | `0.10` | Behavior comment only. [`mcp_server/lib/search/rsf-fusion.ts:313-315`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L313-L315) [`mcp_server/lib/search/rsf-fusion.ts:322-405`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L322-L405) | Same concern as RRF bonus: fixed and large. |
| Similarity scaling | `/100` when `similarity > 1` | Practical normalization comment. [`mcp_server/lib/search/rsf-fusion.ts:58-64`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L58-L64) | Heuristic but understandable. |
| Tie normalization target | `1.0` | Explicit behavior for `max === min`. [`mcp_server/lib/search/rsf-fusion.ts:68-80`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L68-L80) | Produces hard ties. |

### 2.4 `mcp_server/lib/scoring/composite-scoring.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| 5-factor weights | `0.25 / 0.15 / 0.25 / 0.20 / 0.15` | Named but not empirically justified. [`mcp_server/lib/scoring/composite-scoring.ts:119-127`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L119-L127) | Policy defaults, not calibration-backed. |
| Legacy 6-factor weights | `0.30 / 0.25 / 0.10 / 0.15 / 0.05 / 0.15` | Backward compatibility only. [`mcp_server/lib/scoring/composite-scoring.ts:129-136`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L129-L136) | Historic weights; unclear current validity. |
| FSRS fallback constants | `19/81`, `-0.5` | Explicit formula fallback. [`mcp_server/lib/scoring/composite-scoring.ts:141-145`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L141-L145) [`mcp_server/lib/scoring/composite-scoring.ts:255-317`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L255-L317) | Justified by FSRS formula. |
| Tier/context stability multipliers | `Infinity`, `2.0`, `1.5`, `0.5`, `0.25`, etc. | Encoded as categorical policy. [`mcp_server/lib/scoring/composite-scoring.ts:146-181`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L146-L181) | Very aggressive; `Infinity` creates non-decaying classes. |
| Importance multipliers | `2.0`, `1.5`, `1.3`, `0.6`, `0.1` | No calibration note. [`mcp_server/lib/scoring/composite-scoring.ts:184-193`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L184-L193) | Strong priors, not data-backed here. |
| Citation decay | `0.1`, `90` days | No empirical citation. [`mcp_server/lib/scoring/composite-scoring.ts:195-197`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L195-L197) [`mcp_server/lib/scoring/composite-scoring.ts:348-369`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L348-L369) | Hard age cutoff creates dead zone. |
| Doc multipliers | `spec 1.4`, `plan 1.3`, `constitutional 2.0`, `scratch 0.6`, etc. | Functional rationale only. [`mcp_server/lib/scoring/composite-scoring.ts:198-213`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L198-L213) | High leverage; especially `2.0` constitutional. |
| Pattern bonuses | `exact 0.3`, `partial 0.15`, `anchor 0.25`, `type 0.2`, `semantic_threshold 0.8` | No calibration note. [`mcp_server/lib/scoring/composite-scoring.ts:214-221`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L214-L221) [`mcp_server/lib/scoring/composite-scoring.ts:375-452`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L375-L452) | Multiple bonus layers can saturate quickly. |
| Usage formula | `min(1.5, 1.0 + accessCount * 0.05)` | Explicit formula. [`mcp_server/lib/scoring/composite-scoring.ts:323-332`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L323-L332) | Saturates after 10 accesses. |
| Novelty constants | `0.15`, `12`, `0.95` | Explicitly deprecated/inert. [`mcp_server/lib/scoring/composite-scoring.ts:469-489`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L469-L489) | Not live, but still noise in calibration surface. |

### 2.5 `shared/scoring/folder-scoring.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| Folder weights | `recency 0.40`, `importance 0.30`, `activity 0.20`, `validation 0.10` | Comment says resume/recent-work is primary use case. [`shared/scoring/folder-scoring.ts:54-64`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L54-L64) | Qualitatively justified. |
| Folder decay | `0.10` | Explicit examples for 7/10/30 days. [`shared/scoring/folder-scoring.ts:66-70`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L66-L70) [`shared/scoring/folder-scoring.ts:126-155`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L126-L155) | Better documented than most other constants. |
| `MAX_ACTIVITY_MEMORIES` | `5` | No empirical note. [`shared/scoring/folder-scoring.ts:71-80`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L71-L80) | Arbitrary saturation point. |
| `DEFAULT_VALIDATION_SCORE` | `0.5` | Marked placeholder. [`shared/scoring/folder-scoring.ts:77-80`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L77-L80) | Weakest-calibrated constant in this module. |
| Archive multipliers | archive `0.1`, scratch/test/prototype `0.2` | Decision D2 reference only. [`shared/scoring/folder-scoring.ts:87-97`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L87-L97) | Strong priors, undocumented quantitatively. |
| Output rounding | `Math.round(... * 1000) / 1000` | No rationale. [`shared/scoring/folder-scoring.ts:233-241`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L233-L241) | Introduces quantization dead zones. |

### 2.6 `mcp_server/lib/scoring/negative-feedback.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| Base multiplier | `1.0` | Standard. [`mcp_server/lib/scoring/negative-feedback.ts:19-27`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L19-L27) | Fine. |
| Floor | `0.3` | Comment: never suppress below 30%. [`mcp_server/lib/scoring/negative-feedback.ts:22-27`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L22-L27) | Reasonable guardrail, but creates floor dead zone. |
| Penalty per negative | `0.1` | No empirical citation. [`mcp_server/lib/scoring/negative-feedback.ts:25-27`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L25-L27) | Strong; 3 negatives cut 30%. |
| Recovery half-life | `30 days` | Explained behaviorally. [`mcp_server/lib/scoring/negative-feedback.ts:28-35`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L28-L35) [`mcp_server/lib/scoring/negative-feedback.ts:85-99`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L85-L99) | Sensible but still heuristic. |

### 2.7 `mcp_server/lib/scoring/confidence-tracker.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| Base confidence | `0.5` | None. [`mcp_server/lib/scoring/confidence-tracker.ts:83-90`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L83-L90) | Neutral default, but arbitrary. |
| Positive increment | `+0.1` | None. [`mcp_server/lib/scoring/confidence-tracker.ts:83-90`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L83-L90) [`mcp_server/lib/scoring/confidence-tracker.ts:121-128`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L121-L128) | Faster upward movement than downward penalty in this module. |
| Negative decrement | `-0.05` | None. [`mcp_server/lib/scoring/confidence-tracker.ts:83-90`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L83-L90) [`mcp_server/lib/scoring/confidence-tracker.ts:124-128`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L124-L128) | Not aligned with negative-feedback event penalty (`0.1`). |
| Promotion threshold | `0.9 confidence`, `5` positive validations | None. [`mcp_server/lib/scoring/confidence-tracker.ts:89-90`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L89-L90) [`mcp_server/lib/scoring/confidence-tracker.ts:66-77`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L66-L77) | Clear policy, but not calibrated. |

### 2.8 `mcp_server/lib/search/intent-classifier.ts`

| Constant / rule | Value | Justification in code | Audit take |
| --- | ---: | --- | --- |
| Embedding dimension | `128` | Deterministic centroid classifier note only. [`mcp_server/lib/search/intent-classifier.ts:123-130`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L123-L130) | Fine operationally, not a score-calibration constant. |
| Min confidence threshold | `0.08` | Brief fallback explanation. [`mcp_server/lib/search/intent-classifier.ts:186-188`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L186-L188) [`mcp_server/lib/search/intent-classifier.ts:439-447`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L439-L447) | Very low threshold. |
| Combined intent weights | `0.5 / 0.35 / 0.15` | No empirical provenance. [`mcp_server/lib/search/intent-classifier.ts:401-420`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L401-L420) | Likely brittle. |
| Single-keyword discount | `* 0.3` | Qualitative comment only. [`mcp_server/lib/search/intent-classifier.ts:223-231`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L223-L231) | Heuristic. |
| Negative-pattern penalty | `* 0.3` | Qualitative comment only. [`mcp_server/lib/search/intent-classifier.ts:408-416`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L408-L416) | Heavy penalty; coarse. |
| Explicit spec boost / security demotion | `+0.25`, `* 0.6` | No quantitative rationale. [`mcp_server/lib/search/intent-classifier.ts:423-426`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L423-L426) | Strong manual override. |
| Intent weight adjustments | per-intent recency/importance/similarity triples | No empirical provenance. [`mcp_server/lib/search/intent-classifier.ts:189-197`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L189-L197) | Policy-based, not calibrated. |
| MMR lambdas | `0.5`, `0.85`, `0.7`, `0.6`, `0.75` | Comment explains relevance/diversity trade-off. [`mcp_server/lib/search/intent-classifier.ts:579-592`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts#L579-L592) | Understandable, still heuristic. |

---

## 3. Is adaptive fusion actually adaptive?

### Short answer

**Partly.** It adapts **weights**, but in the main `hybrid-search.ts` path it does **not** use the adaptive fused ordering it computed. [`shared/algorithms/adaptive-fusion.ts:135-176`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L135-L176) [`shared/algorithms/adaptive-fusion.ts:191-237`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L191-L237) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745)

### What is adaptive

- Intent changes the base weight profile. [`shared/algorithms/adaptive-fusion.ts:60-76`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L60-L76)
- Optional document type shifts semantic/keyword/recency by `0.1` and then renormalizes core weights. [`shared/algorithms/adaptive-fusion.ts:142-175`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L142-L175)
- Feature-flag and rollout identity determine whether adaptive fusion is enabled. [`shared/algorithms/adaptive-fusion.ts:80-122`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L80-L122)

### What is *not* adaptive in live ranking

`hybridAdaptiveFuse(...)` can produce:

- weighted semantic/keyword fusion,
- post-fusion recency boost,
- degraded fallback metadata,
- dark-run diff against standard fusion. [`shared/algorithms/adaptive-fusion.ts:191-237`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L191-L237) [`shared/algorithms/adaptive-fusion.ts:302-419`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L302-L419)

But `hybrid-search.ts` immediately discards `adaptiveResult.results`, keeps only `adaptiveResult.weights`, rewrites list weights, and then calls plain `fuseResultsMulti(lists)`. That means:

1. adaptive recency boosting is not preserved in this path,
2. adaptive degraded-mode result selection is not preserved,
3. the actual live effect is mostly channel reweighting before standard RRF. [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745)

### What triggers the switch between RRF and RSF?

Nothing in live ranking. The RSF module says it is dormant/shadow-only, its live feature flag was removed, and the dead RSF branch in `hybrid-search.ts` was removed. The active live hybrid path calls `fuseResultsMulti(lists)` from the RRF module. [`mcp_server/lib/search/rsf-fusion.ts:7-18`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L7-L18) [`mcp_server/lib/search/rsf-fusion.ts:18-23`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L18-L23) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745)

So the real runtime switch is:

- **adaptive flag off** -> standard equal-weight RRF result selection inside `hybridAdaptiveFuse`, or in `hybrid-search.ts`, equal-weight-like behavior after weights fallback to `1.0/1.0/0`; [`shared/algorithms/adaptive-fusion.ts:378-384`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L378-L384)
- **adaptive flag on** -> intent/document-type-dependent **weighted RRF**. [`shared/algorithms/adaptive-fusion.ts:355-419`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L355-L419)

---

## 4. Is negative feedback calibrated, and can it suppress legitimate results?

### 4.1 The demotion rule is simple and strong

The multiplier is `1.0 - negativeCount * 0.1`, decayed exponentially by a 30-day half-life, with a hard floor at `0.3`. [`mcp_server/lib/scoring/negative-feedback.ts:82-99`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L82-L99)

That means:

- 1 recent negative -> `0.9x`,
- 3 recent negatives -> `0.7x`,
- 7+ recent negatives -> bottom out at `0.3x`. [`mcp_server/lib/scoring/negative-feedback.ts:82-99`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L82-L99)

This is easy to reason about, but it is coarse and insensitive to the *severity* or *recency distribution* of multiple negatives beyond the last timestamp.

### 4.2 Positive feedback does not undo stored negative events

`memory_validate` writes negative events to `negative_feedback_events` whenever `wasUseful` is false. Positive validations call `recordValidation(...)`, but they do not remove or decrement those negative events. The runtime scoring path later batch-loads `COUNT(*)` and `MAX(created_at_ms)` from that table and applies demotion from those event counts. [`mcp_server/handlers/checkpoints.ts:352-392`](../../../../../../skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L352-L392) [`mcp_server/lib/scoring/negative-feedback.ts:161-177`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L161-L177) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:444-475`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L444-L475)

That creates a calibration asymmetry:

- positive feedback improves stored confidence by `+0.1`, [`mcp_server/lib/scoring/confidence-tracker.ts:121-128`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L121-L128)
- negative confidence-tracker updates only subtract `0.05`, [`mcp_server/lib/scoring/confidence-tracker.ts:124-128`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L124-L128)
- but live negative-feedback demotion ignores those confidence values and instead uses persisted negative-event counts. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:444-475`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L444-L475)

**Result:** yes, legitimate results can stay suppressed after they become useful again, because the rehabilitation path is time decay only, not "net positive minus negative" evidence. [`mcp_server/lib/scoring/negative-feedback.ts:85-99`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L85-L99) [`mcp_server/lib/scoring/confidence-tracker.ts:139-170`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts#L139-L170)

### 4.3 Ordering matters

Stage 2 applies learned-trigger boosts before negative-feedback demotion. So a memory with strong learned-trigger support can partly recover from negative feedback, but only by first moving its pre-demotion score upward; it is still multiplied downward afterward. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:429-475`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L429-L475)

That ordering prevents negative feedback from becoming an absolute kill-switch, but it also means calibration depends on interaction between two independently tuned heuristic systems.

---

## 5. Score distribution after each stage: compression vs spread

### 5.1 RRF starts compressed

With `k = 60`, raw reciprocal-rank contributions are all small decimals close together. That compresses the baseline score distribution before any bonuses. [`shared/algorithms/rrf-fusion.ts:22-37`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L37) [`shared/algorithms/rrf-fusion.ts:245-248`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L245-L248)

### 5.2 Convergence bonuses spread the head much more than rank does

Fixed `0.10` bonuses for cross-source or cross-variant agreement expand separation among multi-source results far more than the underlying reciprocal-rank term does. This makes the distribution more bimodal: "confirmed by multiple channels" vs "not confirmed." [`shared/algorithms/rrf-fusion.ts:266-275`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L266-L275) [`shared/algorithms/rrf-fusion.ts:428-435`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L428-L435)

### 5.3 Min-max normalization re-expands everything, but destroys absolute scale

Both RRF and composite score normalization map the current batch to `[0, 1]`, so any absolute meaning of "0.12 vs 0.18" is lost and only rank-within-batch remains. When all values are equal, every finite score becomes `1.0`, which fully collapses the distribution. [`shared/algorithms/rrf-fusion.ts:468-510`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L468-L510) [`mcp_server/lib/scoring/composite-scoring.ts:842-876`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L842-L876)

### 5.4 Adaptive recency boosting would spread the head slightly, but it is mostly not used in live hybrid ranking

Inside `adaptiveFuse(...)`, recency adds `freshness * recencyWeight * 0.1` and only renormalizes if the max score exceeds `1.0`. That would modestly spread recent results upward, but `hybrid-search.ts` discards `adaptiveResult.results`, so this distribution shaping is mostly absent in the live path that only consumes weights. [`shared/algorithms/adaptive-fusion.ts:221-231`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L221-L231) [`shared/algorithms/adaptive-fusion.ts:245-261`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L245-L261) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745)

### 5.5 RSF expands within-source differences, then compresses single-source results

RSF min-max normalizes each source independently, so each source is stretched to `[0, 1]`. It then halves single-source results in the pairwise variant, or multiplies by `countPresent / totalSources` in the multi-list variant, compressing unsupported items downward. [`mcp_server/lib/search/rsf-fusion.ts:68-80`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L68-L80) [`mcp_server/lib/search/rsf-fusion.ts:164-187`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L164-L187) [`mcp_server/lib/search/rsf-fusion.ts:278-290`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L278-L290)

### 5.6 Composite scoring widens with multipliers, then clamps the top tail

Composite scores are weighted sums, then `applyPostProcessingAndObserve(...)` applies document-type multipliers, interference penalty, and finally clamps into `[0, 1]`. This expands differences before the clamp, but compresses any over-1.0 tail into a hard ceiling. [`mcp_server/lib/scoring/composite-scoring.ts:517-557`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L517-L557) [`mcp_server/lib/scoring/composite-scoring.ts:575-660`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L575-L660)

### 5.7 Folder scoring filters more than it rescales

Folder relevance sums result scores with a damping factor, then `twoPhaseRetrieval(...)` keeps only the top-K folders. That sharply truncates the distribution by eligibility rather than by continuous rescaling. [`mcp_server/lib/search/folder-relevance.ts:37-85`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts#L37-L85) [`mcp_server/lib/search/folder-relevance.ts:205-238`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts#L205-L238)

### 5.8 Stage 2 feedback and validation compress the upper tail

Learned-trigger boosts cap at `1.0`; negative feedback multiplies downward; validation metadata is bounded to `[0.8, 1.2]` and then clamps to `[0, 1]`. That means upper-tail differentiation is repeatedly compressed once scores approach 1.0. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:121-152`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L121-L152) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:457-481`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L457-L481)

---

## 6. Scoring dead zones and tie regimes

### 6.1 RRF normalization dead zone

If all RRF scores are equal, or if there is only one result, `normalizeRrfScores(...)` sets every finite score to `1.0`. Different absolute-quality cases can therefore become indistinguishable after normalization. [`shared/algorithms/rrf-fusion.ts:469-510`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L469-L510)

### 6.2 Composite normalization dead zone

`normalizeCompositeScores(...)` has the same property: all equal finite scores normalize to `1.0`, and invalid scores become `0`. [`mcp_server/lib/scoring/composite-scoring.ts:842-876`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L842-L876)

### 6.3 RSF tie dead zone

`minMaxNormalize(...)` returns `1.0` whenever `max === min`, so a source with no score variance yields identical RSF values for every item before penalties are applied. [`mcp_server/lib/search/rsf-fusion.ts:68-80`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L68-L80)

### 6.4 Negative-feedback floor dead zone

Once the effective penalty would push the multiplier below `0.3`, every worse case is treated the same because the floor applies. Seven recent negatives and seventy recent negatives both end up at the same floor multiplier. [`mcp_server/lib/scoring/negative-feedback.ts:97-99`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L97-L99)

### 6.5 Usage-score saturation dead zone

`calculateUsageScore(...)` caps `usageBoost` at `1.5`, which means any access count at or above 10 yields the same normalized usage score of `1.0`. [`mcp_server/lib/scoring/composite-scoring.ts:323-332`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L323-L332)

### 6.6 Citation-age cutoff dead zone

`calculateCitationScore(...)` returns `0` for any citation at or beyond 90 days old, so 90-day-old and multi-year-old citations become indistinguishable. [`mcp_server/lib/scoring/composite-scoring.ts:355-369`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L355-L369)

### 6.7 Folder-score quantization dead zone

`computeSingleFolderScore(...)` rounds `score`, `recencyScore`, `importanceScore`, and `activityScore` to three decimals, which can collapse nearby folders into ties. [`shared/scoring/folder-scoring.ts:233-241`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L233-L241)

### 6.8 Lexical-channel dead zone in live adaptive weighting

After adaptive weighting, FTS and BM25 no longer have distinct weights in `hybrid-search.ts`; both receive the same `keywordWeight`. Their differentiated prior weights (`0.8` vs `0.6`) disappear. [`mcp_server/lib/search/hybrid-search.ts:627-643`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L627-L643) [`mcp_server/lib/search/hybrid-search.ts:737-743`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L737-L743)

---

## 7. Specific answers to the investigation questions

1. **How do multiple signals interact?**  
   They interact through a mix of additive boosts, multiplicative boosts/demotions, normalization, and hard filtering. In Stage 2, ordering is fixed and bounded, so true runaway amplification is limited, but cancellation and saturation are common. In the older hybrid path, fixed convergence bonuses dominate the underlying RRF mass, and later co-activation/folder gating can substantially alter rank after fusion. [`mcp_server/lib/search/pipeline/stage2-fusion.ts:21-45`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L21-L45) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:538-756`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L538-L756) [`shared/algorithms/rrf-fusion.ts:223-285`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L223-L285) [`mcp_server/lib/search/hybrid-search.ts:930-975`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L930-L975)

2. **Are there hardcoded magic numbers?**  
   Yes. There are many. Only a few are explicitly justified in code (`DEFAULT_K = 60`, folder recency decay `0.10`, negative-feedback half-life explanation). Most channel weights, bonuses, thresholds, multipliers, and caps are policy constants without empirical justification in the audited source. See the tables above. [`shared/algorithms/rrf-fusion.ts:22-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L40) [`shared/scoring/folder-scoring.ts:54-80`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L54-L80) [`mcp_server/lib/scoring/negative-feedback.ts:19-35`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L19-L35)

3. **Is adaptive fusion actually adaptive, and what switches RRF vs RSF?**  
   It is adaptive in its weight selection, but the live `hybrid-search.ts` consumer only reuses those weights and does a plain RRF pass, discarding adaptive fused ordering. There is no live RRF<->RSF switch; RSF is dormant/shadow-only. [`shared/algorithms/adaptive-fusion.ts:135-176`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L135-L176) [`shared/algorithms/adaptive-fusion.ts:344-419`](../../../../../../skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L344-L419) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745) [`mcp_server/lib/search/rsf-fusion.ts:7-18`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L7-L18)

4. **Is negative feedback calibrated? Can it suppress legitimate results?**  
   It is simple and bounded, but not well rehabilitative. Yes, it can suppress legitimate results because negative events persist independently of later positive validations and only recover by elapsed time. [`mcp_server/lib/scoring/negative-feedback.ts:74-120`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L74-L120) [`mcp_server/handlers/checkpoints.ts:352-392`](../../../../../../skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L352-L392) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:444-475`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L444-L475)

5. **What happens to score distribution after each stage?**  
   RRF starts compressed, fixed bonuses spread the head, normalization re-expands but destroys absolute scale, later additive/multiplicative boosts compress the upper tail through caps/clamps, and folder scoring acts as a top-K eligibility gate. [`shared/algorithms/rrf-fusion.ts:22-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L40) [`shared/algorithms/rrf-fusion.ts:468-510`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L468-L510) [`mcp_server/lib/search/pipeline/stage2-fusion.ts:121-152`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L121-L152) [`mcp_server/lib/search/folder-relevance.ts:205-238`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts#L205-L238)

6. **Are there dead zones where different quality gets the same score?**  
   Yes: RRF tie normalization, composite tie normalization, RSF tie normalization, negative-feedback floor, usage saturation after 10 accesses, citation cutoff after 90 days, folder-score rounding, and lexical-channel weight collapse in live adaptive weighting. [`shared/algorithms/rrf-fusion.ts:469-510`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L469-L510) [`mcp_server/lib/scoring/composite-scoring.ts:323-332`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L323-L332) [`mcp_server/lib/scoring/composite-scoring.ts:355-369`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L355-L369) [`shared/scoring/folder-scoring.ts:233-241`](../../../../../../skill/system-spec-kit/shared/scoring/folder-scoring.ts#L233-L241) [`mcp_server/lib/search/hybrid-search.ts:737-743`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L737-L743)

---

## Bottom line

The main calibration problems are:

- fixed bonuses that are much larger than the base rank signal,
- adaptive fusion that only partially affects live ranking,
- duplicated/parallel ranking surfaces (`executePipeline` vs `hybrid-search.ts`),
- negative feedback that decays by time but not by subsequent positive evidence,
- multiple tie/saturation regimes that flatten distinctions. [`shared/algorithms/rrf-fusion.ts:22-40`](../../../../../../skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L22-L40) [`mcp_server/lib/search/hybrid-search.ts:732-745`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L745) [`mcp_server/lib/scoring/negative-feedback.ts:74-120`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L74-L120) [`mcp_server/lib/scoring/composite-scoring.ts:842-876`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L842-L876)
