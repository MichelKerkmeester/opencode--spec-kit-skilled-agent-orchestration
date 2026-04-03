# Iteration 11: Stage 2 Recency Signal Design + Default-Enable Analysis for RECONSOLIDATION and QUALITY_LOOP

## Focus
Deep design investigation for the highest-impact refinement: adding a direct per-result recency signal in Stage 2 fusion. Also analyzing the implementation path for enabling RECONSOLIDATION and QUALITY_LOOP by default.

## Findings

### 1. Stage 2 Signal Architecture -- Complete Map of the 12-Step Pipeline

The `executeStage2()` function in `stage2-fusion.ts` applies ALL scoring signals in a fixed order. The current 12 steps are:

1. Session boost (hybrid only)
2. Causal boost (hybrid only, graph-gated)
2a. Co-activation spreading (graph-gated)
2b. Community co-retrieval N2c (graph-gated)
2c. Graph signals N2a+N2b (graph-gated)
3. Testing effect / FSRS write-back (trackAccess only)
4. Intent weights (NON-hybrid only -- G2 double-weighting guard)
5. Artifact routing weights
6. Feedback signals (learned triggers + negative feedback)
6a. Learned Stage 2 shadow scoring (shadow-only, no live effect)
7. Artifact-based result limiting
8-9. Anchor metadata + Validation metadata/scoring

There is NO recency step in this pipeline for hybrid searches. Recency only enters via step 4 (intent weights), which is SKIPPED for hybrid searches due to the G2 double-weighting guard. This confirms the structural gap identified in iteration 7.

[SOURCE: stage2-fusion.ts:715-1102]

### 2. Where Recency Currently Lives -- Two-System Architecture

**System A (Stage 1 candidate generation):** The `computeRecencyScore()` from `folder-scoring.ts` uses inverse decay: `score = 1 / (1 + days * 0.10)`. This feeds into:
- Stage 1 candidate scoring via `useDecay` parameter (weighted at 0.10 in the pipeline config)
- Intent weights in Stage 2 step 4 (NON-hybrid only)

**System B (Hybrid search internal):** Hybrid search incorporates recency within its own RRF/RSF fusion. But the recency weight in the adaptive fusion profiles is only 0.10-0.50 (via `weights.recency` in `applyIntentWeightsToResults`).

**The gap:** For hybrid searches (the default and most common path), steps 1-3 and 5-9 run, but step 4 (where recency lives) is skipped entirely. So the only recency signal in hybrid mode comes from within the hybrid search's own RRF fusion -- which is weak (effective max ~0.02 as identified in iteration 5).

[SOURCE: stage2-fusion.ts:461-501, stage2-fusion.ts:950-968, folder-scoring.ts computeRecencyScore function]

### 3. Design: Direct Recency Bonus in Stage 2 Fusion

**Injection point:** New step "1a" -- immediately after session boost (step 1) and before causal boost (step 2). Rationale:
- Session boost gives working-memory attention context; recency should layer on top
- Before graph signals, so graph traversal seeds benefit from recency-adjusted ordering
- Before feedback signals, so learned triggers + negative feedback can still override
- Applies to ALL search types (hybrid AND non-hybrid), closing the current gap

**Recency function:** Use the existing `computeRecencyScore()` from `folder-scoring.ts` (already imported at line 80). This provides:
- Inverse decay: `1 / (1 + days * decayRate)` with DECAY_RATE=0.10
- Constitutional tier exemption (always 1.0)
- Invalid timestamp fallback (0.5)
- Future timestamp handling (1.0)
- Values: today=1.0, 7d=0.59, 10d=0.50, 30d=0.25, 100d=0.09

**Weight:** Additive bonus with configurable cap. Recommended:
- `RECENCY_FUSION_WEIGHT = 0.07` (env: `SPECKIT_RECENCY_FUSION_WEIGHT`)
- `RECENCY_FUSION_CAP = 0.10` (env: `SPECKIT_RECENCY_FUSION_CAP`)
- Formula: `bonus = min(RECENCY_FUSION_CAP, recencyScore * RECENCY_FUSION_WEIGHT)`
- Effect: A memory updated today gets +0.07, 7 days ago gets +0.041, 30 days ago gets +0.018

This is additive (not multiplicative) because:
1. Multiplicative would amplify already-high scores disproportionately
2. Additive gives a flat "time bonus" that can be tuned independently
3. The cap prevents runaway (max +0.10 even for newly-created memories)

**Interaction with adaptive weights:** The recency fusion step runs independently of intent weights (step 4). For non-hybrid searches, memories get BOTH the fusion recency bonus (step 1a) AND the intent-weighted recency (step 4). This is acceptable because:
- Step 1a applies a small bounded bonus (max 0.10)
- Step 4 applies intent-weighted recency as part of a larger re-scoring formula
- The two serve different purposes: 1a is "time freshness," 4 is "intent-relevance with recency as a dimension"
- If desired, step 4's recency weight could be reduced proportionally

**Risk of recency bias:** LOW with the proposed parameters:
- Max bonus is 0.07 (7% of [0,1] scale) -- not enough to override strong semantic matches
- A memory with 0.85 semantic score would need the recency bonus to lose to a 0.92 semantic score -- the 0.07 bonus would bring it to 0.92, merely tying, not winning
- Cap of 0.10 provides a hard ceiling
- Constitutional memories are exempt from decay (always get full bonus), preserving their priority

[SOURCE: stage2-fusion.ts:80 (import), folder-scoring.ts computeRecencyScore, stage2-fusion.ts:770-790 (step 1 pattern)]

### 4. Concrete Implementation Sketch for Recency Fusion Step

```typescript
// -- 1a. Recency fusion bonus --
// Direct per-result recency signal for ALL search types.
// Closes the gap where hybrid searches skip intent weights (step 4)
// and therefore receive no post-fusion recency adjustment.
const RECENCY_FUSION_WEIGHT = Number(process.env.SPECKIT_RECENCY_FUSION_WEIGHT) || 0.07;
const RECENCY_FUSION_CAP = Number(process.env.SPECKIT_RECENCY_FUSION_CAP) || 0.10;

try {
  results = results.map((row) => {
    const timestamp = (row.updated_at as string | undefined)
      ?? (row.created_at as string | undefined)
      ?? '';
    const tier = (row.importance_tier as string | undefined) ?? 'normal';
    const recency = computeRecencyScore(timestamp, tier);
    const bonus = Math.min(RECENCY_FUSION_CAP, recency * RECENCY_FUSION_WEIGHT);
    if (bonus <= 0) return row;
    const baseScore = resolveBaseScore(row);
    return withSyncedScoreAliases(row, Math.min(1, baseScore + bonus));
  });
  syncScoreAliasesInPlace(results);
  (metadata as Record<string, unknown>).recencyFusionApplied = true;
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
}
```

Key design decisions:
- Uses `updated_at` with `created_at` fallback -- rewards recently UPDATED memories, not just recently created ones
- Feature-gated via env vars (SPECKIT_RECENCY_FUSION_WEIGHT / SPECKIT_RECENCY_FUSION_CAP) for runtime tuning
- Default ON (no explicit enable/disable flag needed -- setting weight to 0 disables it)
- Follows existing pattern: try/catch isolation, metadata tracking, syncScoreAliasesInPlace

[INFERENCE: based on existing step 1 pattern in stage2-fusion.ts:770-790 and computeRecencyScore API]

### 5. RECONSOLIDATION Default-Enable Path

Current state:
- `isReconsolidationEnabled()` uses explicit env check: `process.env.SPECKIT_RECONSOLIDATION?.toLowerCase().trim() === 'true'` (opt-in)
- `isAssistiveReconsolidationEnabled()` uses `isFeatureEnabled()` (graduated ON by default)
- The `hasReconsolidationCheckpoint()` safety gate in `db-helpers.ts` checks for a `pre-reconsolidation` checkpoint before allowing reconsolidation to proceed

**To enable by default:**
1. Change `isReconsolidationEnabled()` from explicit env check to `isFeatureEnabled('SPECKIT_RECONSOLIDATION')` -- this graduates it to default-ON
2. The checkpoint safety gate already exists (`hasReconsolidationCheckpoint` in `handlers/save/db-helpers.ts`) -- no new guard needed
3. Add auto-checkpoint creation: when reconsolidation is first triggered and no `pre-reconsolidation` checkpoint exists, automatically create one before proceeding

**Risk:** LOW. The assistive reconsolidation variant (similarity-based near-duplicate detection) is already ON by default. Full reconsolidation adds merge/supersede actions on top of detection. The checkpoint gate provides rollback safety.

**Estimated effort:** ~1 hour
- Change flag check pattern (5 min)
- Add auto-checkpoint creation in reconsolidation-bridge.ts (30 min)
- Test coverage for auto-checkpoint + default-on path (25 min)

[SOURCE: search-flags.ts:158-163, search-flags.ts:556-558, handlers/save/db-helpers.ts:15-34, handlers/save/reconsolidation-bridge.ts:12-62]

### 6. QUALITY_LOOP Default-Enable Path

Current state:
- `isQualityLoopEnabled()` uses explicit env check: `process.env.SPECKIT_QUALITY_LOOP?.toLowerCase().trim() === 'true'` (opt-in)
- Pure algorithmic (no external dependencies, no native modules)
- Bounded execution (verify-fix-verify loop with iteration limits)

**To enable by default:**
1. Change `isQualityLoopEnabled()` from explicit env check to `isFeatureEnabled('SPECKIT_QUALITY_LOOP')`
2. No additional guards needed -- the loop is already bounded and pure-algorithmic

**Risk:** MINIMAL. No external dependencies, bounded iteration, and the existing disable flag provides an escape hatch.

**Estimated effort:** ~30 minutes
- Change flag check pattern (5 min)
- Verify/update tests for default-on behavior (25 min)

[SOURCE: search-flags.ts:314-318]

### 7. NOVELTY_BOOST Dead Code Status (Confirmed)

From iteration 10: `calculateNoveltyBoost()` in `composite-scoring.ts` always returns 0 with a "eval complete, marginal value" comment. The env var `SPECKIT_NOVELTY_BOOST` is inert.

**Recommendation:** Dead code cleanup task -- remove `calculateNoveltyBoost()`, the env var check, and any references. This is a P3 cleanup item, not blocking anything.

[SOURCE: composite-scoring.ts calculateNoveltyBoost (iteration 10 finding)]

## Ruled Out
- Multiplicative recency scaling (would disproportionately amplify already-high scores)
- Recency as a separate RRF channel (too expensive, requires full candidate re-retrieval)
- Exponential decay for Stage 2 recency (the existing inverse decay from folder-scoring.ts is well-calibrated and already handles edge cases)
- Separate enable/disable flag for recency fusion (env weight=0 is a sufficient disable mechanism)

## Dead Ends
None -- all investigation paths were productive.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (lines 1-1123)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (lines 1-80)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` (RECONSOLIDATION, QUALITY_LOOP flags)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts` (reconsolidation checkpoint)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` (reconsolidation architecture)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts` (computeRecencyScore via vitest cache)

## Assessment
- New information ratio: 0.71
- Questions addressed: Stage 2 recency design, RECONSOLIDATION default-enable, QUALITY_LOOP default-enable, NOVELTY_BOOST cleanup
- Questions answered: Complete design for recency fusion step, implementation paths for RECONSOLIDATION and QUALITY_LOOP default-enable

## Reflection
- What worked and why: Reading the full `executeStage2()` function gave the definitive signal application order and revealed that recency is entirely absent from hybrid search paths. The import of `computeRecencyScore` at line 80 (already present but only used in step 4 for non-hybrid) confirmed the function is available without new dependencies.
- What did not work and why: Nothing failed -- all code locations were accessible and investigation was productive.
- What I would do differently: Could have started by reading the RECONSOLIDATION bridge implementation earlier rather than searching grep results, as it has a clear module header documenting the full architecture.

## Recommended Next Focus
Final synthesis and convergence. All 10 key questions answered, all P1/P2/P3 items triaged, all opt-in features assessed, and the highest-impact design (recency fusion) is fully specified. The research is ready for convergence into a final research.md synthesis.
