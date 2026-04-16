# Iteration 13 - correctness - scripts_lib

## Dispatcher
- iteration: 13 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:38:53.122Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`
- `.opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`truncateOnWordBoundary` is not actually code-point-safe for astral Unicode input, so it truncates strings that are already within the advertised limit.** The helper decides whether truncation is needed with `text.length` and slices with `substring(0, limit)`, both of which operate on UTF-16 code units instead of code points (`.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:14-31`). The whitespace-free fallback then switches to `[...text]` code-point logic (`.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:35-41`), which makes the behavior internally inconsistent: `truncateOnWordBoundary('😀😀', 2)` returns `😀…` even though the input is already 2 code points long. The current regression file only exercises ASCII/word-boundary cases, so this contract break is not covered (`.opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts:78-145`).

```json
{
  "claim": "The helper can drop astral characters unnecessarily because the early length/slice checks count UTF-16 code units while the fallback counts Unicode code points.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:14-31",
    ".opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:35-41",
    "runtime probe: truncateOnWordBoundary('😀😀', 2) => '😀…'",
    ".opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts:78-145"
  ],
  "counterevidenceSought": "I checked whether the helper documented the limit as UTF-16 code units instead of code points, but the module header explicitly says code-point-safe truncation.",
  "alternativeExplanation": "If callers intentionally budget in code units, the current result might be tolerated, but that would still contradict the helper's own documented contract and mixed internal logic.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the public contract is explicitly redefined to be UTF-16-code-unit based and all call sites are updated accordingly."
}
```

2. **`shouldActivateReviewWave()` can auto-activate wave mode for completely cold inventories because `computeHotspotSpread()` treats every directory at the median as a hotspot.** The activation gate uses `computeHotspotSpread(files)` whenever callers do not inject metrics (`.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:86-105`). That helper says it should count directories with **above-median** hotspot scores, but the implementation uses `>= median` (`.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:553-580`). When all scores are identical (for example, 1000 files with zero complexity/churn/issues), every directory is counted as hot and the function returns spread `1.0`, which immediately flips the gate to `activate: true`. The tests avoid this path by injecting `hotspotSpread` for both positive and negative activation cases instead of exercising the default computation (`.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:81-115`, `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:243-254`).

```json
{
  "claim": "The default hotspot-spread path can misclassify flat zero-signal review scopes as high-spread hotspots and activate wave mode when the code comments say the gate should require above-median hotspots.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:86-105",
    ".opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:553-580",
    "runtime probe: 1000 zero-score files => {\"activate\":true,\"hotspotSpread\":1}",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:81-115",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:243-254"
  ],
  "counterevidenceSought": "I looked for a caller that always supplies a vetted hotspotSpread override, but the public helper defaults to its own computation and the tests explicitly call the no-metrics path elsewhere.",
  "alternativeExplanation": "If the intended policy is 'at-or-above median' rather than 'above median', the code would be consistent with that policy, but the helper comment and the default-path regression intent both point the other way.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the activation contract is updated to explicitly define hotspot spread as median-inclusive and the sequential default-path expectations are revised."
}
```

3. **The wave merge stack double-counts identical findings across segments even though the code claims segment-independent IDs should enable cross-segment deduplication.** `generateFindingId()` explicitly says the ID is segment-independent so cross-segment dedup works (`.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:569-582`), but `mergeFinding()` only exact-dedupes on the 5-key composite that includes `segment` and `wave`, so the same logical finding from a second segment can never hit the exact-dedupe branch (`.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:241-338`, `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:615-631`). In the sibling path, equal-severity/equal-evidence findings are just pushed as another record instead of being deduped (`.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:294-327`). `joinWave()` and `mergeSegmentStates()` both delegate to that reducer, so merged outputs and stats retain duplicates (`.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:255-297`, `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:187-246`). This is also locked in by tests that explicitly expect duplicate preservation across segments (`.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:101-109`, `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:281-291`, `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:163-171`).

```json
{
  "claim": "Identical findings emitted by different segments are merged as separate records instead of being deduped, which breaks the helpers' stated cross-segment dedupe contract and inflates merged outputs.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:241-338",
    ".opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:569-582",
    ".opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:615-631",
    ".opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:255-297",
    ".opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:187-246",
    "runtime probe: joinWave([{seg-1,f1},{seg-2,f1}], 'dedupe') => merged.length 2",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:101-109",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:281-291",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:163-171"
  ],
  "counterevidenceSought": "I checked whether the contract explicitly wanted one retained record per segment, but the helper comment on deterministic finding IDs says the opposite and the join helpers are described as handling duplicates.",
  "alternativeExplanation": "If provenance-per-segment is intentionally more important than deduplication, the implementation could be deliberate; however, that would require the comments, function names, and merge-strategy labels to stop advertising dedupe semantics.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the product contract is clarified to keep identical findings per segment and downstream consumers are documented to dedupe later."
}
```

### P2 Findings
- **False-positive regression expectation:** the merge tests assert that cross-segment duplicates should be preserved (`deep-loop-wave-merge.vitest.ts:101-109`, `:281-291`, `deep-loop-wave-executor.vitest.ts:163-171`), so the suite currently passes when the dedupe contract is broken.
- **Missing edge-case coverage:** `truncate-on-word-boundary.vitest.ts:78-145` never exercises astral Unicode or grapheme-heavy inputs, and the planner tests only validate review activation with injected `hotspotSpread` overrides instead of the default `computeHotspotSpread()` path (`deep-loop-wave-planner.vitest.ts:81-115`).

## Traceability Checks
- `truncate-on-word-boundary.ts` advertises "code-point-safe string truncation" in the module header, but the implementation starts with UTF-16 `length`/`substring` checks, so the code does not fully match its own stated contract.
- `wave-segment-planner.cjs` says hotspot spread should count directories with **above-median** hotspot score, but the actual predicate is `>= median`, which changes the gate behavior for flat score distributions.
- `wave-coordination-board.cjs` says segment-independent finding IDs are used so cross-segment dedup works correctly, but the merge reducer keeps same-severity sibling findings as separate records.

## Confirmed-Clean Surfaces
- **`wave-convergence.cjs`**: the missing-input guards, terminal-status gate, and prune decision order are internally consistent on this pass; I did not find a correctness issue in `evaluateWaveConvergence()`, `shouldPruneSegment()`, or `evaluateSegmentConvergence()`.
- **`wave-lifecycle.cjs` phase handling**: `advancePhase()` correctly rejects backward/skipped transitions and `dispatchWave()` accounts for deferred segments without mutating the input array; the correctness problem in this file is isolated to the join/merge path above.
- **`wave-segment-state.cjs` JSONL parsing**: `parseJsonl()` rejects malformed lines and records missing merge keys instead of silently accepting partial records.

## Next Focus
- Inspect downstream consumers of merged wave findings and planner activation decisions, especially any executor/reducer code that assumes deduped findings or trusts the default hotspot-spread computation.
