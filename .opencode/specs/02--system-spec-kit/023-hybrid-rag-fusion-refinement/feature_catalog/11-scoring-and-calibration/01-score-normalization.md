# Score normalization

## Current Reality

The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

## Source Metadata

- Group: Scoring and calibration
- Source feature title: Score normalization
- Summary match found: Yes
- Summary source feature title: Score normalization
- Current reality source: feature_catalog.md
