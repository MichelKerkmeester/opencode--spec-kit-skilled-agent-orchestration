---
title: "Pipeline Architecture Code Review — Features 49-54"
reviewer: "@review agent (claude-sonnet-4-6)"
date: "2026-03-01"
files_reviewed:
  - lib/search/pipeline/orchestrator.ts
  - lib/search/pipeline/stage1-candidate-gen.ts
  - lib/search/pipeline/stage2-fusion.ts
  - lib/search/pipeline/stage3-rerank.ts
  - lib/search/pipeline/stage4-filter.ts
  - lib/search/pipeline/types.ts
  - lib/search/pipeline/index.ts
  - lib/scoring/mpab-aggregation.ts (supplementary — MPAB formula verification)
score: 87
band: ACCEPTABLE
recommendation: PASS with notes
---

# Pipeline Architecture Code Review: Features 49-54

## Summary

**Recommendation:** ACCEPT WITH NOTES
**Score: 87 / 100** (ACCEPTABLE — PASS)
**Confidence: HIGH** — All 7 pipeline files + supplementary MPAB module read in full.

The 4-stage pipeline architecture is well-implemented with clear stage boundaries, strong invariant enforcement, and thorough error handling. Three issues require attention: a MPAB formula gap in Stage 3, a missing chunk-ordering sort in the Stage 3 DB reassembly path, and a silent empty-error swallow in hybrid-search MPAB. All are Important severity; no blockers.

---

## Score Breakdown

| Dimension | Score | Max | Notes |
|---|---|---|---|
| Correctness | 24 | 30 | MPAB score formula gap in Stage 3; chunk ordering not applied during DB reassembly |
| Security | 23 | 25 | No hardcoded secrets; DB error handling is sound; one concern with broad `catch {}` in hybrid-search |
| Patterns | 18 | 20 | Excellent compliance; minor: `communityBoostApplied` written to typed metadata via cast |
| Maintainability | 14 | 15 | Well-documented, guard clauses, test surfaces exposed; acceptable |
| Performance | 8 | 10 | DB query per parent in Stage 3 reassembly is sequential; acceptable given small result sets |

---

## Feature Verification

### Feature 49: 4-Stage Pipeline Architecture — PASS

**Evidence:**
- `orchestrator.ts:28-62` executes stages sequentially: Stage 1 → Stage 2 → Stage 3 → Stage 4 with no cross-stage data sharing.
- Stage boundaries are enforced via typed interfaces: `Stage1Output`, `Stage2Input/Output`, `Stage3Input/Output`, `Stage4Input/Output` in `types.ts`.
- Stage 4 receives a narrowed `Stage4ReadonlyRow[]` type (cast at `orchestrator.ts:47`) so score fields are compile-time readonly.
- Stage comments in each file correctly describe their allowed operations (Stage 1: no scoring; Stage 2: all scoring; Stage 3: rerank only; Stage 4: filter/annotate, no scores).
- The feature flag (`SPECKIT_PIPELINE_V2`) is referenced in the spec; the pipeline files themselves do not inline the flag check (the flag is handled upstream by the caller), which is architecturally clean.

**No issues.**

---

### Feature 50: Multi-Pipeline Adaptive Blending (MPAB) — ISSUE

**Status: Partial — formula not applied in Stage 3 pipeline path.**

**Evidence from spec (`summary_of_new_features.md:494-496`):**
> MPAB formula: `sMax + 0.3 * sum(remaining) / sqrt(N)`. The bonus coefficient (0.3) is exported as `MPAB_BONUS_COEFFICIENT`. The aggregation runs in Stage 3 of the 4-stage pipeline after RRF fusion and before state filtering.

**Evidence from code:**

The MPAB scoring formula (`computeMPAB` in `lib/scoring/mpab-aggregation.ts`) correctly implements:
```typescript
// mpab-aggregation.ts:107-116
const sMax = sorted[0];
const remaining = sorted.slice(1);
const sumRemaining = remaining.reduce((acc, s) => acc + s, 0);
const bonus = MPAB_BONUS_COEFFICIENT * sumRemaining / Math.sqrt(N);
return sMax + bonus;
```
This matches the spec formula exactly. GOOD.

**However**, `stage3-rerank.ts:263-337` implements its own `collapseAndReassembleChunkResults` function that does NOT invoke `computeMPAB`. Instead, it:
1. Elects the best-scoring chunk (`electBestChunk` at line 347) by highest `effectiveScore`.
2. Loads the parent row from the DB and merges fields.
3. Returns a `PipelineRow` with the **best chunk's score** unchanged, not an MPAB-aggregated score.

```typescript
// stage3-rerank.ts:408-429
const reassembled: PipelineRow = {
  ...bestChunk,         // <-- score comes entirely from bestChunk
  id: parentId,
  // ...
  // No MPAB bonus applied
};
```

The `collapsedChunkHits` stat counts `chunks.length - 1` (line 325), confirming N-1 chunks are dropped entirely. Their scores contribute zero to the parent score.

**MPAB formula used:** `score = bestChunk.score` (i.e., `sMax` only, bonus = 0)
**MPAB formula specified:** `score = sMax + 0.3 * sum(remaining) / sqrt(N)`

The spec-correct MPAB formula is only applied in `hybrid-search.ts` via `lib/scoring/mpab-aggregation.ts`, which is the **pre-pipeline** path. In the 4-stage pipeline path, Stage 3 uses a simpler "elect best chunk" strategy without the bonus term.

**Severity: Important (P1)**
The bonus term is absent in the Stage 3 path, meaning multi-chunk documents receive lower pipeline scores than specified. Single-chunk documents are unaffected. The fallback behavior (best chunk) is functionally reasonable and degrades gracefully, but does not match the spec.

**Fix:** Stage 3's `collapseAndReassembleChunkResults` should import and call `computeMPAB(chunks.map(effectiveScore))` to compute the aggregated score, then set `score: mpabScore` on the reassembled row instead of inheriting `bestChunk.score`.

---

### Feature 51: Chunk Ordering Preservation — ISSUE

**Status: Partial — ordering preserved in the `mpab-aggregation.ts` path but NOT in Stage 3's DB-reassembly path.**

**Evidence from spec (`summary_of_new_features.md:500`):**
> When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order.

**Evidence from `mpab-aggregation.ts:163`:**
```typescript
const sortedChunks = [...chunks].sort((a, b) => a.chunkIndex - b.chunkIndex);
```
Chunk ordering is correctly applied in `mpab-aggregation.ts`. GOOD.

**Evidence from `stage3-rerank.ts:381-441`:**
The `reassembleParentRow` function constructs the reassembled row using `bestChunk` (elected by score, not by index). When the DB fetch succeeds, parent content replaces chunk content entirely, so ordering is irrelevant for the content field. When the DB fetch fails (`markFallback` at line 450), the `bestChunk` is returned — this is a single chunk, so ordering of multiple chunks is not applied.

**More specifically:** the `collapseAndReassembleChunkResults` in Stage 3 (`stage3-rerank.ts:283-338`) discards all non-best chunks (`stats.collapsedChunkHits += chunks.length - 1`). The sorted chunk order from the spec is not used to assemble multi-chunk content in this path; only the DB `content_text` column is used.

This is acceptable when the DB lookup succeeds (full parent content is loaded), but the spec's chunk-ordering guarantee is implicit in the `mpab-aggregation.ts` module and is NOT independently implemented in Stage 3. If the DB content is absent or null, the fallback returns only the best-score chunk without considering chunk ordering for multi-chunk assembly.

**Severity: Important (P1)**
The chunk ordering guarantee specified in B2 is only honoured in the `mpab-aggregation.ts` path (hybrid-search legacy path). The Stage 3 pipeline path does not sort chunks before assembly; it relies solely on the DB `content_text` field. If DB content is missing, no multi-chunk ordered assembly occurs.

**Fix:** In `reassembleParentRow`, when DB content is null/absent and multiple chunks exist, sort the group's chunks by `chunk_index` (ascending) and concatenate their `content` fields before falling back, rather than returning a single best chunk.

---

### Feature 52: Anchor Optimization in Pipeline — PASS

**Evidence:**
- `stage2-fusion.ts:612-617` calls `enrichResultsWithAnchorMetadata(results)` as step 8 of Stage 2.
- The operation is wrapped in try/catch with `console.warn` fallback, so anchor enrichment failure cannot abort the pipeline.
- The `types.ts` Stage2 interface comment explicitly lists "anchor metadata annotation" as step 8.
- No score fields are touched by the enrichment (per the spec: "pure annotation step ... never modifies any score fields").
- The `Stage4ReadonlyRow` type permits `channelAttribution?: string[]` and `evidenceGap` annotation fields, confirming Stage 4 can add annotations without score modification.

**No issues.**

---

### Feature 53: Validation Signals Integration — PASS

**Evidence:**
- `stage2-fusion.ts:619-629` calls `enrichResultsWithValidationMetadata(results)` then `applyValidationSignalScoring(results)`.
- `applyValidationSignalScoring` at `stage2-fusion.ts:88-120` applies a clamped multiplier:
  ```typescript
  const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]
  const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);
  ```
- `clampMultiplier` at `stage2-fusion.ts:74-79` enforces `[0.8, 1.2]` bounds, matching spec.
- Bonus components match spec:
  - Quality factor: 0.9-1.1 (spec: "quality factor 0.9-1.1") — MATCH
  - Spec level bonus: `Math.max(0, Math.min(0.06, (specLevel - 1) * 0.02))` → [0, 0.06] (spec: "0-0.06") — MATCH
  - Completion bonus: 0.04 complete, 0.015 partial, 0 unknown (spec: "0-0.04") — MATCH
  - Checklist bonus: 0.01 (spec: "0-0.01") — MATCH

**Minor note:** The function is called after `enrichResultsWithAnchorMetadata` (step 8 before step 9), and both are inside the same try/catch block, meaning an anchor enrichment failure would skip validation metadata too. These should ideally be in separate try/catch blocks. This is a Minor/P2 concern.

**No blocking issues.**

---

### Feature 54: Learned Feedback Integration — PASS

**Evidence:**
- `stage2-fusion.ts:321-391` implements `applyFeedbackSignals` as the canonical feedback step.
- Learned trigger boost: `LEARNED_TRIGGER_WEIGHT * match.weight` at line 340, with `LEARNED_TRIGGER_WEIGHT = 0.7` at line 69. Matches spec: "0.7x weight applied during the feedback signals step in Stage 2."
- Negative feedback: gated by `isNegativeFeedbackEnabled()` at line 352, applied via `applyNegativeFeedback` at line 376.
- Boost is additive and capped: `Math.min(1.0, currentScore + learnedBoost)` at line 369.
- DB unavailability is gracefully handled: `requireDb()` failure returns `results` unchanged (lines 327-333).
- `metadata.feedbackSignalsApplied` is only set `true` when scores actually changed (line 586: `changed` check).

**No issues.**

---

## Bug and Logic Analysis

### ISSUE-01: Anchor and Validation Metadata Share One try/catch Block

**Location:** `stage2-fusion.ts:619-629`

```typescript
try {
  results = enrichResultsWithAnchorMetadata(results);
  results = applyValidationSignalScoring(results);  // <-- only runs if anchor didn't throw
} catch (err: unknown) {
  ...
}
```

If `enrichResultsWithAnchorMetadata` throws, `applyValidationSignalScoring` is silently skipped. The spec documents these as two independent steps (8 and 9). An anchor parsing failure should not suppress validation signal scoring.

**Severity: Important (P1)**

**Fix:** Separate into two independent try/catch blocks.

---

### ISSUE-02: `rerankApplied` Flag Logic Has a Race Condition

**Location:** `stage3-rerank.ts:101`

```typescript
rerankApplied = results !== scored && config.rerank && isCrossEncoderEnabled();
```

This checks reference inequality (`results !== scored`). If `applyCrossEncoderReranking` returns the **same array reference** (e.g., empty reranked results, or all input IDs missing from the map), `rerankApplied` will be `false` even if the reranker was invoked. Conversely, if `applyCrossEncoderReranking` returns a new array (always the case for the happy path), the flag is correct. However, the guard conditions inside `applyCrossEncoderReranking` return `results` (original reference) unchanged, so `rerankApplied` is correctly `false` in those cases.

**Actual risk:** The reranker processes documents and returns `rerankedRows` (a new array), so in the success path `results !== scored` is always `true` when the reranker ran. The flag only misleads when fewer reranked results are returned than the minimum guard triggers, which would already cause early return with the same reference.

**Severity: Minor (P2)** — The logic is fragile but functionally correct for current code paths. A cleaner signal would be a return value from `applyCrossEncoderReranking` rather than reference identity.

---

### ISSUE-03: `effectiveScore` in Stage 3 Does Not Normalise `similarity`

**Location:** `stage3-rerank.ts:360-364`

```typescript
function effectiveScore(row: PipelineRow): number {
  if (typeof row.score === 'number' && isFinite(row.score)) return row.score;
  if (typeof row.similarity === 'number' && isFinite(row.similarity)) return row.similarity;
  return 0;
}
```

`similarity` is stored in the 0-100 range (as documented in `resolveBaseScore` in `stage2-fusion.ts:137`: `return row.similarity / 100`). Stage 3 uses `effectiveScore` for sorting merged results and electing the best chunk, but it does not normalise `similarity` by dividing by 100. This means rows with only `similarity` set will sort as if their score is 0-100, while rows with `score` set sort as 0-1. Mixed sets produce incorrect ordering.

**Severity: Important (P1)** — This bug affects chunk election and final merged sort order when `score` is absent but `similarity` is present. In practice, Stage 2 sets `score` on most rows, but the fallback branch is incorrect.

**Fix:**
```typescript
function effectiveScore(row: PipelineRow): number {
  if (typeof row.score === 'number' && isFinite(row.score)) return row.score;
  if (typeof row.similarity === 'number' && isFinite(row.similarity)) return row.similarity / 100;
  return 0;
}
```

---

### ISSUE-04: Silent Empty Error Swallow in hybrid-search MPAB Path

**Location:** `hybrid-search.ts:734` (supplementary reference, not a pipeline file but invoked in context)

```typescript
} catch (_mpabErr: unknown) {
  // AI-GUARD: Non-critical — MPAB failure does not block pipeline
}
```

The catch block discards the error entirely — no `console.warn`. This makes it impossible to diagnose MPAB failures in production. The pipeline files consistently use `console.warn(...)` on all catch paths. This is inconsistent with the established pattern.

**Severity: Minor (P2)** — Does not affect correctness, but degrades observability. The pipeline files themselves do not have this problem.

---

## Score Immutability Invariant (Stage 4) — PASS

**Evidence:**
- `types.ts:49-80` defines `Stage4ReadonlyRow` with score fields (`similarity`, `score`, `importance_weight`, `rrfScore`, `intentAdjustedScore`, `attentionScore`) as `Readonly<Pick<...>>`. Compile-time enforcement active.
- `types.ts:289-350` implements `captureScoreSnapshot` and `verifyScoreInvariant`. The invariant checks all 6 score fields by name.
- `stage4-filter.ts:210` captures snapshot before any operations: `const scoresBefore = captureScoreSnapshot(results)`.
- `stage4-filter.ts:269` verifies the invariant after all operations: `verifyScoreInvariant(scoresBefore, workingResults)`.
- `filterByMemoryState` (`stage4-filter.ts:100-154`) only removes rows via `Array.filter` — no mutations.
- Evidence gap annotation (`stage4-filter.ts:236-241`) uses object spread to add `evidenceGap` — not a score field.
- `orchestrator.ts:47` casts `stage3Result.reranked as Stage4ReadonlyRow[]` — this is a runtime type assertion, not a structural guard, but the compile-time readonly fields on `Stage4ReadonlyRow` provide real protection once inside Stage 4.

**Dual enforcement is working correctly.**

---

## Error Handling Assessment

| Location | Behaviour | Assessment |
|---|---|---|
| Stage 1 deep-mode expansion failure | Falls back to single hybrid search, warns | Good |
| Stage 1 R12 expansion failure | Continues with standard hybrid, warns | Good |
| Stage 1 embedding generation failure | Throws with clear message | Good |
| Stage 2 session boost failure | Warns, continues | Good |
| Stage 2 causal boost failure | Warns, continues | Good |
| Stage 2 DB unavailable for feedback | Returns results unchanged (no warn) | Acceptable |
| Stage 3 cross-encoder failure | Warns, returns original results | Good |
| Stage 3 DB reassembly failure per-parent | Warns, uses fallback chunk | Good |
| Stage 4 invariant violation | Throws — correct; this is a bug signal | Good |
| MPAB in hybrid-search | Silent catch | Poor — see ISSUE-04 |

---

## TypeScript Standards Check (sk-code--opencode)

| Check | Status | Notes |
|---|---|---|
| File headers with description | PASS | All files have module comment with sprint tag |
| Section organization (imports → types → constants → functions → exports) | PASS | Consistently followed across all 7 files |
| camelCase functions | PASS | All internal functions camelCase |
| PascalCase types/interfaces | PASS | `PipelineRow`, `Stage4ReadonlyRow`, etc. |
| UPPER_SNAKE constants | PASS | `MAX_DEEP_QUERY_VARIANTS`, `CONSTITUTIONAL_INJECT_LIMIT`, `LEARNED_TRIGGER_WEIGHT`, etc. |
| No `any` types | PASS | Uses `unknown` with narrowing throughout |
| Guard clauses at function start | PASS | `if (!Array.isArray(results) || results.length === 0) return results;` pattern used consistently |
| Readonly where appropriate | PASS | `Stage4ReadonlyRow` uses Readonly; `__testables` in stage4 uses `as const` |
| Discriminated unions | N/A | No union types needed in this module |
| Test surface exported | PASS | All files export `__testables` with `@internal` JSDoc note |

**One Standards Violation (Minor):**

`stage2-fusion.ts:465-473` — The `metadata` object is typed with an intersection of `Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean }`. These extension fields are then written via `(metadata as Record<string, unknown>).communityBoostApplied = true` (lines 518, 533). This cast indicates the type declaration is not fully aligned with the runtime shape. The `Stage2Output['metadata']` type should include these fields, or the metadata should use a local extended type rather than a cast.

**Severity: Minor (P2)**

---

## Positive Highlights

1. **Stage boundary discipline is exemplary.** No stage reaches into another's responsibilities. The orchestrator (`orchestrator.ts`) is 35 lines — clean and focused.

2. **Score immutability dual enforcement.** Both compile-time (`Stage4ReadonlyRow` readonly fields) and runtime (`verifyScoreInvariant`) guards are active and correctly wired. This is a well-engineered defensive pattern.

3. **G2 double-weighting prevention is structural.** The `isHybrid` boolean in Stage 2 (`stage2-fusion.ts:476`) gates intent weights so the code path is absent for hybrid, not just conditionally skipped. The comment explains the architectural reason clearly.

4. **Graceful degradation throughout.** Every feature-gated sub-step has a try/catch with fallback. No single failure (session boost, causal boost, cross-encoder, DB) can abort the full pipeline.

5. **MPAB formula in `mpab-aggregation.ts` is correct and well-documented.** The `N=0` and `N=1` guards are handled; tie-breaking by sort-then-index is correctly explained.

6. **`filterByMinQualityScore` is robust.** Threshold clamping, NaN handling, and early-return for missing threshold are all handled (`stage1-candidate-gen.ts:63-79`).

7. **Test surface exposure pattern is consistent.** All files export `__testables` with `@internal` JSDoc tag, enabling unit testing without polluting the public API.

---

## Files Reviewed

| File | Lines | P0 | P1 | P2 |
|---|---|---|---|---|
| `lib/search/pipeline/orchestrator.ts` | 62 | 0 | 0 | 0 |
| `lib/search/pipeline/stage1-candidate-gen.ts` | 595 | 0 | 0 | 0 |
| `lib/search/pipeline/stage2-fusion.ts` | 678 | 0 | 2 | 1 |
| `lib/search/pipeline/stage3-rerank.ts` | 482 | 0 | 2 | 1 |
| `lib/search/pipeline/stage4-filter.ts` | 319 | 0 | 0 | 0 |
| `lib/search/pipeline/types.ts` | 351 | 0 | 0 | 0 |
| `lib/search/pipeline/index.ts` | 24 | 0 | 0 | 0 |
| `lib/scoring/mpab-aggregation.ts` | 178 | 0 | 0 | 1 |
| **Total** | **2689** | **0** | **4** | **3** |

---

## Issues Summary

### P1 — Required Fixes (4)

| ID | Location | Description |
|---|---|---|
| ISSUE-01 | `stage2-fusion.ts:619-629` | Anchor and validation metadata share one try/catch; anchor failure silently skips validation scoring |
| ISSUE-02 (MPAB) | `stage3-rerank.ts:283-337` | Stage 3 MPAB does not apply the `sMax + 0.3*sum/sqrt(N)` formula; only `sMax` used |
| ISSUE-03 (chunk ordering) | `stage3-rerank.ts:283-337` | Stage 3 MPAB does not sort chunks by `chunk_index` before assembly in fallback path |
| ISSUE-04 (effectiveScore) | `stage3-rerank.ts:360-364` | `similarity` not normalised to 0-1 range; mixed `score`/`similarity` rows sort incorrectly |

### P2 — Suggestions (3)

| ID | Location | Description |
|---|---|---|
| SUG-01 | `stage3-rerank.ts:101` | `rerankApplied` uses reference inequality; prefer explicit boolean from return value |
| SUG-02 | `stage2-fusion.ts:465-473` | Metadata type uses cast for `communityBoostApplied`/`graphSignalsApplied`; should be in type definition |
| SUG-03 | `hybrid-search.ts:734` | MPAB catch block silently discards error; add `console.warn` for observability |

---

## Gate Result

**Result: PASS (with required fixes)**
**Score: 87 / 100**

The pipeline architecture is sound and the core invariants (Stage 4 score immutability, G2 prevention, stage boundary isolation) are correctly implemented. The 4 P1 issues should be addressed before the next sprint, as ISSUE-02 (MPAB formula gap) and ISSUE-04 (similarity normalisation) represent spec deviations that affect scoring accuracy.

No P0 blockers. No security vulnerabilities found.
