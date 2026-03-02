# Wave 2 — S1-A5: T008 Quality Loop Complete

## Task
T008: Implement verify-fix-verify memory quality loop

## Files Modified

### Modified
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
  - Added Section 11: Quality Loop (T008) with ~300 lines of new code
  - Added types: `QualityScore`, `QualityScoreBreakdown`, `QualityLoopResult`
  - Added functions: `computeMemoryQualityScore`, `attemptAutoFix`, `runQualityLoop`
  - Added helpers: `scoreTriggerPhrases`, `scoreAnchorFormat`, `scoreTokenBudget`, `scoreCoherence`
  - Added auto-fix helpers: `extractTriggersFromContent`, `normalizeAnchors`
  - Added eval logging: `logQualityMetrics` (writes to eval_metric_snapshots)
  - Added feature gate: `isQualityLoopEnabled` (SPECKIT_QUALITY_LOOP env var)
  - Updated exports (Section 12) with all new functions and types
  - Added snake_case backward-compatible aliases

### Created
- `.opencode/skill/system-spec-kit/mcp_server/tests/t014-quality-loop.vitest.ts`
  - 43 tests across 8 describe blocks
  - Covers: scoreTriggerPhrases, scoreAnchorFormat, scoreTokenBudget, scoreCoherence
  - Covers: computeMemoryQualityScore, normalizeAnchors, extractTriggersFromContent
  - Covers: attemptAutoFix, runQualityLoop, isQualityLoopEnabled

## Decisions

1. **Quality score weights**: triggers=0.25, anchors=0.30, budget=0.20, coherence=0.25 (anchors weighted highest as they drive searchability)
2. **Token budget estimation**: 1 token ~ 4 chars, default budget 2000 tokens = 8000 chars
3. **Anchor neutral score**: No anchors present (but no broken ones) scores 0.5, not 0 — avoids penalizing simple memories
4. **Auto-fix strategies**: Re-extract triggers from headings/title, close unclosed anchors, trim to budget on line boundary
5. **Eval logging**: Uses existing eval_metric_snapshots table with channel='quality_loop', metric_name='memory_quality_score'
6. **Not integrated into save flow**: Functions are standalone exports — Wave 3 will wire them into the save pipeline
7. **Dynamic require for eval-db**: Used `require()` instead of static import to keep eval-db as a soft dependency

## Test Results
- 43/43 tests passing
- Existing handler-memory-save tests: 12/12 passing
- Existing memory-save-extended tests: 43/43 passing (13 skipped)
- Existing memory-save-integration tests: 55/55 passing
