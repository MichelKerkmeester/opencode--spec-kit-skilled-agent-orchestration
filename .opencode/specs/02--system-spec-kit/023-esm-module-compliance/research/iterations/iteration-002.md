# Iteration 2: Fusion Pipeline Bug Audit and Quality Analysis

## Focus
Examine the 4-stage retrieval pipeline (stage1-candidate-gen.ts through stage4-filter.ts) for bugs, edge cases, dead code, and quality issues. Additionally investigate whether SPECKIT_MEMORY_ADAPTIVE_RANKING=false is intentional and whether the governance flag discrepancy (roadmap-ON/runtime-OFF) is a bug.

## Findings

### Finding 1: Pipeline architecture is well-defended with 12-step signal application order
The stage2-fusion.ts module enforces a strict 12-step signal application order with clear G2 double-weighting prevention. Intent weights are ONLY applied for non-hybrid search types, preventing the documented G2 recurrence bug. Each step has try/catch isolation so a failure in one signal (e.g., session boost, causal boost) does not crash the entire pipeline -- it degrades gracefully with a "failed" status.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:720-740]

### Finding 2: Score aliasing is properly synced via withSyncedScoreAliases and syncScoreAliasesInPlace
After each boost step (session boost, causal boost), `syncScoreAliasesInPlace(results)` is called to ensure `score`, `rrfScore`, and `intentAdjustedScore` stay consistent. The F2.03 fix clamps all scores to [0,1]. This prevents stale alias values from propagating to downstream steps. The `attentionScore` is explicitly preserved (not overwritten), which is correct because it comes from the attention-decay module.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:256-280]

### Finding 3: ADAPTIVE_RANKING=false is INTENTIONAL -- it is a roadmap/shadow-only feature
The adaptive ranking system has 3 modes: `disabled` (default), `shadow` (collect data without affecting results), and `promoted` (actively affect ranking). The flag `SPECKIT_MEMORY_ADAPTIVE_RANKING` is documented in telemetry/README.md as "Default-off roadmap capability flag." The `getAdaptiveMode()` function returns `disabled` when the flag is off, which means `recordAdaptiveAccessSignals()` in stage2 is a no-op. This is by design -- the feature collects training data when shadow-enabled but does not yet have enough data to safely promote. NOT a bug.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:333-337]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:98]

### Finding 4: Stage 4 has a defensive UNKNOWN_STATE_PRIORITY=6 workaround for missing memoryState column
Stage4 sets `UNKNOWN_STATE_PRIORITY = 6` (above HOT=5) so memories without a memoryState column always pass filtering. The comment explicitly states: "memoryState column doesn't exist yet -- all memories are UNKNOWN. Reset to 0 when the TRM state column is implemented." This means the state filtering is currently a no-op for all memories. While this is safe (no false filtering), it means the `minState` parameter is effectively ignored until TRM is implemented. This is documented tech debt, not a bug.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:77-81]

### Finding 5: Stage 1 quality score backfill handles edge cases correctly
The `backfillMissingQualityScores` function checks `quality_score !== 0 && quality_score != null` -- this means a quality_score of exactly 0 WILL be backfilled. This is correct behavior because 0 typically means "not yet computed" rather than "explicitly zero quality." The `filterByMinQualityScore` function treats missing/non-finite scores as 0, applies threshold clamping to [0,1], and handles null/undefined gracefully.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:102-131]

### Finding 6: Deep clone fix prevents race condition in stage2 candidates
Line 768 performs `candidates.map(row => ({ ...row }))` instead of a shallow array copy. The comment (FIX #3) explains this prevents corruption when the orchestrator's timeout fallback uses the original Stage 1 candidates array. This is a good defensive practice but note: it is a SHALLOW object spread, not a deep clone. Nested objects (like `graphContribution`, `sourceScores`) are still shared references. If any step mutates a nested property IN PLACE (not via spread), it could still corrupt the original. Current code appears safe because all nested mutations use spread operators, but this is fragile.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:764-768]

### Finding 7: Validation signal scoring has a potential multiplier stacking issue
In `applyValidationSignalScoring`, the multiplier is computed as `qualityFactor + specLevelBonus + completionBonus + checklistBonus`. The qualityFactor ranges [0.9, 1.1], specLevelBonus up to 0.06, completionBonus up to 0.04, and checklistBonus up to 0.01. The maximum possible multiplier is 1.1 + 0.06 + 0.04 + 0.01 = 1.21, which exceeds MAX_VALIDATION_MULTIPLIER (1.2). However, this is correctly handled by `clampMultiplier()` which caps at 1.2. The minimum possible is 0.9 + 0 + 0 + 0 = 0.9, correctly above MIN_VALIDATION_MULTIPLIER (0.8). No bug, but the values are tight to the clamp boundary.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:212-244]

### Finding 8: Stage 3 has proper score preservation contract with stage2Score
The stage3-rerank module states: "Stage 3 MAY overwrite score with the reranked value and MUST preserve the original in stage2Score for auditability." The `resolveRerankOutputScore` function floors all scores at 0 (never negative). Stage 4 has a compile-time readonly constraint on score fields plus a runtime `captureScoreSnapshot`/`verifyScoreInvariant` defense-in-depth mechanism. This contract chain is well-designed.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:40-43]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:6-10]

### Finding 9: Governance flag discrepancy is BY DESIGN -- roadmap flags are opt-in
The governance flags (SCOPE_ENFORCEMENT, GOVERNANCE_GUARDRAILS) are correctly roadmap-ON (listed in the roadmap as targets) but runtime-OFF (not enabled via env vars). This follows the same pattern as ADAPTIVE_RANKING: roadmap features are tracked but not yet promoted to default-on. The runtime behavior (OFF) takes precedence, and the roadmap listing indicates future intent. This is the standard feature graduation pathway: roadmap -> shadow -> promoted -> default-on.
[INFERENCE: based on capability-flags.ts architecture pattern matching adaptive-ranking.ts and telemetry/README.md documentation patterns]

## Ruled Out
- Looking for null pointer crashes in the pipeline: All functions have proper null/undefined/NaN guards with `Number.isFinite()` checks throughout.
- Looking for off-by-one errors in filtering: `filterByMinQualityScore` uses `>=` (inclusive), which is correct. State filtering uses priority comparison with `>=`, also correct.

## Dead Ends
- None identified this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (lines 1-320)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (lines 1-920)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` (lines 1-150)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts` (lines 1-150)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts` (lines 320-340)
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md` (line 98)

## Assessment
- New information ratio: 0.83
- Questions addressed: Q5 (fusion pipeline bugs), Q3 (search quality issues), Q9 (adaptive fusion refinement)
- Questions answered: Q5 (partially -- no critical bugs found, 1 fragility concern)

## Reflection
- What worked and why: Reading the pipeline files in execution order (stage1 -> stage2 -> stage3 -> stage4) gave a clear picture of the data flow and score contract chain. The module header comments are exceptionally well-documented with I/O contracts and invariants.
- What did not work and why: N/A -- all approaches were productive.
- What I would do differently: Focus next on the SPECIFIC fixes from specs 009/010/011 to verify they are correctly integrated, rather than broad pipeline review. Also check the stage1 candidate generation branches (hybrid, deep-mode, multi-concept) for search quality issues.

## Recommended Next Focus
Investigate Q6 (validator fixes from spec 009), Q7 (retrieval quality fixes from spec 010), and Q8 (lexical score propagation from spec 011). Read the specific fix implementations to verify they are working. Check the hybrid-search.ts for lexical score propagation through RRF fusion.
