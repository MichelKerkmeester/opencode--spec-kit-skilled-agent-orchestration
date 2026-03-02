# Wave 2: Cross-Reference Audit of Summary Documents

**Auditor:** Opus 4.6
**Date:** 2026-03-02
**Scope:** Cross-reference `summary_of_new_features.md` (NEW) against `summary_of_existing_features.md` (EXISTING) for contradictions, inconsistencies, and outdated information.

---

## Executive Summary

**12 findings** identified: 5 contradictions (factual conflicts between documents), 4 outdated descriptions (EXISTING has not absorbed Phase 015-017 changes), and 3 inconsistencies (omissions or ambiguities that could mislead a reader).

The dominant pattern is that EXISTING was written before or without full integration of Phase 017 (Opus review remediation). Phase 017 removed the legacy V1 pipeline, introduced `resolveEffectiveScore()`, added ancillary cleanup on delete, and changed memory_update embedding behavior. EXISTING still describes the pre-017 state in several sections.

---

## 1. Pipeline Architecture

### CONTRADICTION C-1: Stage 2 Signal Count and Ordering

EXISTING describes Stage 2 as having 9 signals. NEW describes 11 signals, adding community co-retrieval (N2c) and graph signals (N2a+N2b) between causal boost and FSRS testing effect.

**EXISTING** -- "4-stage pipeline architecture" section (memory_search tool description):
> "Nine signals apply in a fixed, documented order: session boost, causal boost, FSRS testing effect, intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3)."

**NEW** -- "4-stage pipeline refactor (R6)" section, Phase 017 update:
> "Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, community co-retrieval (N2c -- inject co-members into result set), graph signals (N2a+N2b -- additive momentum and depth bonuses), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3)."

**Impact:** A reader of EXISTING would not know that community co-retrieval and graph momentum/depth signals are part of the Stage 2 ordering. They would also have the wrong signal count (9 vs 11).

**Resolution:** EXISTING must update its 4-stage pipeline section AND the memory_search tool description to include community co-retrieval (N2c) at position 3 and graph signals (N2a+N2b) at position 4, increasing the total to 11 signals.

---

### CONTRADICTION C-2: Legacy V1 Pipeline Described as Available

EXISTING describes the legacy V1 pipeline as an available fallback path. NEW (Phase 017) says it was removed entirely.

**EXISTING** -- "Semantic and lexical search (memory_search)" section:
> "A legacy search path remains available when SPECKIT_PIPELINE_V2 is disabled. That path runs the original hybridSearchEnhanced() with its five search channels, Reciprocal Rank Fusion, and a nine-stage post-search pipeline covering state filtering, FSRS testing effect, intent weight application, artifact-class routing, cross-encoder reranking, session boosting, causal boosting, evidence gap detection and chunk reassembly."

**EXISTING** -- "4-stage pipeline architecture" section:
> "The pipeline runs behind the SPECKIT_PIPELINE_V2 flag (default ON). When disabled, the legacy postSearchPipeline path handles the same work in a single function."

**NEW** -- "4-stage pipeline refactor (R6)" section, Phase 017 update:
> "The legacy postSearchPipeline path (~550 lines) was removed entirely. isPipelineV2Enabled() now always returns true regardless of the SPECKIT_PIPELINE_V2 env var (deprecated). The V2 4-stage pipeline is the only code path."

**NEW** -- "Legacy V1 pipeline removal" section (Phase 017):
> "Deleted functions: STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants(), strengthenOnAccess(), applyTestingEffect(), filterByMemoryState(), applyCrossEncoderReranking(), applyIntentWeightsToResults(), shouldApplyPostSearchIntentWeighting(), postSearchPipeline()."

**Impact:** A reader of EXISTING would believe they can disable V2 and fall back to V1. Attempting this would have no effect (the flag is ignored), and the legacy code no longer exists.

**Resolution:** EXISTING must remove all references to the legacy path. The memory_search description should state that the 4-stage pipeline is the only code path. The "4-stage pipeline architecture" section should note the flag is deprecated.

---

### CONTRADICTION C-3: SPECKIT_PIPELINE_V2 Flag Status

Directly related to C-2, but specifically about the flag table.

**EXISTING** -- "Feature Flag Reference", table row for SPECKIT_PIPELINE_V2:
> "R6: activates the 4-stage pipeline architecture (Stage 1 candidate generation, Stage 2 fusion, Stage 3 reranking, Stage 4 filtering with score-immutability invariant). When disabled, the legacy postSearchPipeline single-function path is used."

**NEW** -- "Feature flag sunset audit" section, Phase 017 update:
> "SPECKIT_PIPELINE_V2 is now deprecated. isPipelineV2Enabled() always returns true regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op."

**Impact:** The flag table in EXISTING is wrong. A developer consulting this table would believe the flag is an active toggle.

**Resolution:** EXISTING must mark SPECKIT_PIPELINE_V2 as "deprecated" (or "inert") in the flag table with a note that the function always returns true and the legacy path was removed.

---

## 2. Feature Flags

### INCONSISTENCY I-1: R8 Summary Channel Not Mentioned in EXISTING Pipeline Description

EXISTING does not mention the R8 memory summary search channel as a Stage 1 participant, even though NEW explicitly describes it.

**EXISTING** -- "4-stage pipeline architecture" section, Stage 1:
> "Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants..."

No mention of R8 summary channel running in parallel.

**NEW** -- "4-stage pipeline refactor (R6)" section, Stage 1:
> "The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID."

**EXISTING** -- flag table for SPECKIT_MEMORY_SUMMARIES:
> "R8 TF-IDF extractive summary generation. At index time, generates a top-3-sentence extractive summary..."

The flag table acknowledges R8 exists but describes it only as an index-time feature ("At index time, generates..."), not as a retrieval channel in Stage 1.

**Impact:** A reader of EXISTING's pipeline architecture would not know that R8 summaries participate in Stage 1 candidate generation. The flag table description is also incomplete, describing only the indexing side.

**Resolution:** EXISTING should add R8 summary channel to its Stage 1 description. The flag table entry should mention that summaries serve as a parallel search channel in Stage 1 when >5K memories are indexed.

---

### OBSERVATION O-1: Inert/Deprecated Flags are Consistent

Both documents agree on the status of deprecated/inert flags:

| Flag | EXISTING Status | NEW Status | Match? |
|---|---|---|---|
| SPECKIT_CONSUMPTION_LOG | "Deprecated" / inert | "Inert/deprecated (isConsumptionLogEnabled() hardcoded false)" | Yes |
| SPECKIT_EXTENDED_TELEMETRY | "Deprecated" / inert | Not explicitly listed as a flag but Sprint 7 audit reference | Yes |
| SPECKIT_NOVELTY_BOOST | "Inert" | "calculateNoveltyBoost() call was removed from hot scoring path" | Yes |
| SPECKIT_RSF_FUSION | "Deprecated runtime gate" | "isRsfEnabled() removed as dead code; RSF branch removed" | Yes |
| SPECKIT_SHADOW_SCORING | "Deprecated" | "isShadowScoringEnabled() removed; runShadowScoring returns null" | Yes |

No contradictions on deprecated/inert flags (except SPECKIT_PIPELINE_V2 per C-3 above).

---

### OBSERVATION O-2: Default Values Match

Spot-checked the following flag defaults across both documents:

| Flag | EXISTING Default | NEW Default | Match? |
|---|---|---|---|
| SPECKIT_COACTIVATION_STRENGTH | 0.25 | 0.25 | Yes |
| SPECKIT_ABLATION | false | "Runs behind the SPECKIT_ABLATION flag" (requires true) | Yes |
| SPECKIT_DOCSCORE_AGGREGATION | true | "Runs behind the SPECKIT_DOCSCORE_AGGREGATION flag (default ON)" | Yes |
| SPECKIT_NEGATIVE_FEEDBACK | true | "Runs behind the SPECKIT_NEGATIVE_FEEDBACK flag (default ON)" | Yes |
| SPECKIT_GRAPH_SIGNALS | true | "Runs behind the SPECKIT_GRAPH_SIGNALS flag (default ON)" | Yes |
| SPECKIT_COMMUNITY_DETECTION | true | "Runs behind the SPECKIT_COMMUNITY_DETECTION flag (default ON)" | Yes |
| ENABLE_BM25 | true | "ENABLE_BM25 flag (default ON)" | Yes |

No default value mismatches found.

---

## 3. Phase 015-017 Updates

### OUTDATED D-1: resolveEffectiveScore Shared Function Not in EXISTING

Phase 017 introduced a shared `resolveEffectiveScore()` function that replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. EXISTING does not document this function or the canonical fallback chain.

**EXISTING** -- "4-stage pipeline architecture" section, Stage 3:
> "Non-chunks and reassembled parents merge and sort descending by effective score."

No mention of what the effective score fallback chain is, or that a shared function resolves it.

**NEW** -- "4-stage pipeline refactor (R6)" section, Phase 017 update:
> "A shared resolveEffectiveScore() function in pipeline/types.ts replaced both Stage 2's resolveBaseScore() and Stage 3's local effectiveScore(), ensuring a consistent fallback chain (intentAdjustedScore -> rrfScore -> score -> similarity/100, all clamped [0,1]) across all stages."

**NEW** -- "Stage 3 effectiveScore fallback chain" (Phase 015):
> "effectiveScore() in stage3-rerank.ts only checked score then similarity/100, skipping intentAdjustedScore and rrfScore from Stage 2 enrichment. The fix updated the fallback chain to: intentAdjustedScore -> rrfScore -> score -> similarity/100, all clamped [0,1] with isFinite() guards."

**Impact:** A reader of EXISTING would not know the canonical score resolution order or that it is enforced by a shared function. If someone needs to understand how scores flow through stages, EXISTING provides no guidance.

**Resolution:** EXISTING should document `resolveEffectiveScore()` in the pipeline architecture section, listing the fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, clamped [0,1].

---

### OUTDATED D-2: Quality Gate Timer Persistence Not Reflected

Phase 015 fixed a bug where the quality gate 14-day timer was stored only in memory, resetting on every server restart. EXISTING describes the timer behavior correctly (post-fix) but does not acknowledge the persistence mechanism.

**EXISTING** -- "Memory indexing (memory_save)" section:
> "A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves while the thresholds are being validated."

**NEW** -- "Quality gate timer persistence" (Phase 015):
> "The qualityGateActivatedAt timestamp in save-quality-gate.ts was stored purely in-memory. Every server restart reset the 14-day warn-only countdown... The fix adds SQLite persistence to the config table..."

**Impact:** Minor. EXISTING describes the intended behavior correctly. A developer debugging timer issues would not know about the persistence mechanism (SQLite config table) from EXISTING alone, but would not be misled.

**Resolution:** EXISTING could optionally add that the timer is persisted to the SQLite config table, but this is informational rather than a correction.

---

### OUTDATED D-3: Canonical ID Dedup Hardening Not in EXISTING

Phase 016 fixed mixed ID format handling ("42", "mem:42", 42) in deduplication. EXISTING mentions deduplication but does not specify how ID formats are normalized.

**EXISTING** -- "Hybrid search pipeline" section:
No mention of ID format normalization in deduplication.

**NEW** -- "Canonical ID dedup hardening" (Phase 016):
> "Mixed ID formats (42, '42', mem:42) caused deduplication failures in hybrid search. Normalization was applied in combinedLexicalSearch() for the new pipeline and in legacy hybridSearch() for the dedup map."

**Impact:** Low. The bug is fixed. A reader of EXISTING would not encounter the bug, but would also not know about the normalization if they needed to understand dedup behavior.

**Resolution:** Optional. EXISTING could add a note about canonical ID normalization in the hybrid search pipeline section.

---

## 4. Tool Descriptions

### CONTRADICTION C-4: memory_update Embedding Scope

EXISTING implies that only the title is used for embedding regeneration. NEW (Phase 017) says the fix was to embed full content alongside the title.

**EXISTING** -- "Memory metadata update (memory_update)" section:
> "When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a memory from 'Authentication setup guide' to 'OAuth2 configuration reference', the old embedding no longer represents the content accurately."

**NEW** -- "Pipeline and mutation hardening" section (Phase 017), fix #19:
> "Full-content embedding on update (#19): memory_update now embeds title + '\n\n' + content_text instead of title alone."

**Impact:** EXISTING's description is misleading in two ways: (1) it implies only title changes trigger re-embedding, and (2) the framing suggests the title alone is what gets embedded. After Phase 017, the full content is included in the embedding, and this is the correct behavior.

**Resolution:** EXISTING should state that when the title changes, the system regenerates the embedding using "title + content" (not title alone). The rationale text should be updated accordingly.

---

### CONTRADICTION C-5: memory_delete Ancillary Record Cleanup

EXISTING describes delete cleanup as covering only causal graph edges. NEW (Phase 017) expanded cleanup to five additional tables.

**EXISTING** -- "Single and folder delete (memory_delete)" section:
> "Single deletes are straightforward: remove the memory record, clean up associated causal graph edges and record a mutation ledger entry."

**NEW** -- "Pipeline and mutation hardening" section (Phase 017), fix #20:
> "Ancillary record cleanup on delete (#20): Memory deletion now cleans degree_snapshots, community_assignments, memory_summaries, memory_entities, and causal_edges."

**NEW** -- Phase 017, fix #21:
> "BM25 index cleanup on delete (#21): bm25Index.getIndex().removeDocument(String(id)) called after successful delete when BM25 is enabled."

**Impact:** EXISTING understates the cleanup scope. A developer reading EXISTING might not realize that delete also cleans summary embeddings, entity records, community assignments, degree snapshots, and BM25 index entries. If any of these cleanup operations fail or need debugging, EXISTING provides incomplete context.

**Resolution:** EXISTING should expand the delete description to include all six cleanup targets: causal_edges, degree_snapshots, community_assignments, memory_summaries, memory_entities, and BM25 index removal.

---

### INCONSISTENCY I-2: memory_save Flag Table vs Narrative Description for SPECKIT_MEMORY_SUMMARIES

The flag table describes R8 as an index-time feature only. The memory_save narrative does not mention summary generation as part of the save pipeline.

**EXISTING** -- flag table for SPECKIT_MEMORY_SUMMARIES:
> "R8 TF-IDF extractive summary generation. At index time, generates a top-3-sentence extractive summary for each memory and joins those sentences into summary text. Summaries serve as a lightweight search channel for fallback matching."

**EXISTING** -- "Memory indexing (memory_save)" section:
Does not mention summary generation as part of the save pipeline. The section describes: content normalization, PE gating, quality gate, reconsolidation, chunk thinning, encoding-intent capture, consolidation cycle hook. No mention of summary generation.

**NEW** -- "Memory summary search channel (R8)":
> "R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies."

**Impact:** A reader of EXISTING's memory_save section would not know that summaries are generated during the save pipeline. The flag table hints at it ("at index time") but the tool description omits it entirely.

**Resolution:** EXISTING should add summary generation to the memory_save pipeline description, noting it runs at save time behind the SPECKIT_MEMORY_SUMMARIES flag.

---

### INCONSISTENCY I-3: memory_bulk_delete Does Not Mention BM25 Cleanup

Following from C-5, EXISTING's memory_bulk_delete description also omits BM25 and ancillary table cleanup.

**EXISTING** -- "Tier-based bulk deletion (memory_bulk_delete)" section:
> "Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion."

**NEW** -- Phase 017, fix #32:
> "clearRelatedCache() called from memory-bulk-delete.ts after bulk operations."

**Impact:** The "all caches are invalidated" statement in EXISTING is vague. It does not specify whether BM25 index entries are removed per-memory, whether community/degree/summary/entity records are cleaned, or which caches specifically are invalidated. Phase 017 added co-activation cache clearing explicitly.

**Resolution:** EXISTING should specify the full cleanup list for bulk delete, consistent with the single-delete cleanup expanded in C-5.

---

## 5. Scoring Descriptions

### OBSERVATION O-3: MPAB Formula is Consistent

Both documents use the same formula.

**EXISTING** -- SPECKIT_DOCSCORE_AGGREGATION flag:
> "sMax + 0.3 * sum(remaining) / sqrt(N)"

**NEW** -- "MPAB chunk-to-memory aggregation (R1)":
> "sMax + 0.3 * sum(remaining) / sqrt(N)"

Bonus coefficient (0.3) and structure are identical.

---

### OBSERVATION O-4: Interference Scoring Parameters are Consistent

**EXISTING** -- SPECKIT_INTERFERENCE_SCORE flag:
> "Enables interference-based penalty scoring in composite scoring."

**NEW** -- "Interference scoring (TM-01)":
> "0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases)... -0.08 * interference_score penalty"

EXISTING provides less detail but does not contradict. NEW provides the threshold (0.75) and coefficient (-0.08) that EXISTING omits.

---

### OBSERVATION O-5: Negative Feedback Multiplier is Consistent

**EXISTING** -- "Validation feedback (memory_validate)":
> "A confidence multiplier that starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3. Time-based recovery with a 30-day half-life gradually restores the multiplier."

**NEW** -- "Negative feedback confidence signal (A4)":
> "The multiplier starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3 so a memory is never suppressed below 30% of its natural score. Time-based recovery with a 30-day half-life..."

Identical parameters.

---

### OUTDATED D-4: Five-Factor Weight Normalization Not in EXISTING

Phase 017 added auto-normalization of composite scoring weights so partial overrides still sum to 1.0. EXISTING does not mention this.

**EXISTING** -- No description of five-factor weight normalization in the scoring or pipeline sections.

**NEW** -- "Scoring and fusion corrections" (Phase 017), fix #6:
> "Five-factor weight normalization (#6): Composite scoring weights auto-normalize to sum 1.0 after partial overrides. Without this, overriding one weight broke weighted-average semantics."

**NEW** -- "4-stage pipeline refactor (R6)", Phase 017 update:
> "The five-factor composite weights auto-normalize to sum 1.0 after partial overrides."

**Impact:** A developer overriding composite scoring weights would not know from EXISTING that the system auto-normalizes. Before Phase 017, overriding one weight broke the weighted average. EXISTING doesn't describe the current (correct) normalization behavior.

**Resolution:** EXISTING should document that composite scoring weights auto-normalize to sum 1.0 when partial overrides are applied.

---

## Summary Table

| # | Type | Severity | Finding | EXISTING Section | NEW Section |
|---|---|---|---|---|---|
| C-1 | Contradiction | High | Stage 2 lists 9 signals; should be 11 (missing N2c, N2a+N2b) | 4-stage pipeline architecture | 4-stage pipeline refactor (R6) |
| C-2 | Contradiction | High | Legacy V1 pipeline described as available; was removed | Semantic and lexical search; 4-stage pipeline | Legacy V1 pipeline removal (Phase 017) |
| C-3 | Contradiction | High | SPECKIT_PIPELINE_V2 described as active toggle; is deprecated | Feature Flag Reference table | Feature flag sunset audit, Phase 017 update |
| C-4 | Contradiction | Medium | memory_update embeds title-only; should be title+content | Memory metadata update | Pipeline and mutation hardening #19 |
| C-5 | Contradiction | Medium | memory_delete cleanup omits 5 ancillary tables + BM25 | Single and folder delete | Pipeline and mutation hardening #20, #21 |
| D-1 | Outdated | High | resolveEffectiveScore not documented | 4-stage pipeline architecture | Phase 015 + Phase 017 updates |
| D-2 | Outdated | Low | Quality gate timer persistence mechanism not mentioned | Memory indexing (memory_save) | Quality gate timer persistence (Phase 015) |
| D-3 | Outdated | Low | Canonical ID dedup normalization not mentioned | Hybrid search pipeline | Canonical ID dedup hardening (Phase 016) |
| D-4 | Outdated | Medium | Five-factor weight auto-normalization not documented | (absent) | Scoring and fusion corrections #6 |
| I-1 | Inconsistency | Medium | R8 summary channel missing from Stage 1 description | 4-stage pipeline architecture | 4-stage pipeline refactor, Stage 1 |
| I-2 | Inconsistency | Low | memory_save omits summary generation step | Memory indexing (memory_save) | Memory summary search channel (R8) |
| I-3 | Inconsistency | Low | memory_bulk_delete cleanup scope understated | Tier-based bulk deletion | Phase 017 fix #32 |

### Priority Order for Remediation

1. **C-2 + C-3** (Legacy V1 removal): These are the most dangerous because they describe functionality that no longer exists. A developer could waste time trying to use the legacy path.
2. **C-1** (Stage 2 signals): The pipeline signal ordering is a key architectural reference. Having it wrong by 2 signals is misleading.
3. **D-1** (resolveEffectiveScore): Critical for anyone debugging score flow through stages.
4. **C-4 + C-5** (Tool behaviors): memory_update and memory_delete descriptions are factually wrong about current behavior.
5. **D-4** (Weight normalization): Important for anyone tuning composite scoring weights.
6. **I-1** (R8 in Stage 1): Completes the pipeline channel list.
7. **D-2, D-3, I-2, I-3** (Low severity): Nice-to-have corrections.
