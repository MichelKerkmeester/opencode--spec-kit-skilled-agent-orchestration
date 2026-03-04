# Scoring and fusion corrections

## Current Reality

Eight scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
- **Five-factor weight normalization (#6):** Composite scoring weights auto-normalize to sum 1.0 after partial overrides. Without this, overriding one weight broke weighted-average semantics.
- **Stack overflow prevention (#7):** `normalizeCompositeScores` replaced `Math.max(...scores)` / `Math.min(...scores)` with a for-loop. The spread operator causes stack overflow on arrays >100K elements.
- **BM25 specFolder filter (#8):** The BM25 index stores document IDs as stringified numbers (e.g., "42"). The old filter compared these against spec folder paths, which never matched. Replaced with a DB lookup to resolve `spec_folder` per result.
- **RRF convergence double-count (#9):** Cross-variant fusion accumulated per-variant convergence bonuses during merge, then added cross-variant bonuses on top. Fix subtracts per-variant bonus before applying cross-variant bonus.
- **Adaptive fusion normalization (#10):** Core weights (semantic + keyword + recency) now normalize to sum 1.0 after doc-type adjustments. Only applied when doc-type shifts alter the balance.
- **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1].
- **Configurable interference threshold (#12):** `computeInterferenceScoresBatch()` now accepts an optional `threshold` parameter (defaults to `INTERFERENCE_SIMILARITY_THRESHOLD`).

## Source Metadata

- Group: Opus review remediation (Phase 017)
- Source feature title: Scoring and fusion corrections
- Summary match found: Yes
- Summary source feature title: Scoring and fusion corrections
- Current reality source: feature_catalog.md
