# Scoring observability

## Current Reality

Interference score distributions are logged at query time via 5% sampling to a `scoring_observations` table. Each observation captures memory ID, query ID, interference penalty, score before and after and the delta.

The novelty boost (`calculateNoveltyBoost`) was removed from the hot scoring path during Sprint 8 remediation because it always returned 0 (the feature completed its evaluation). Telemetry now hardcodes `noveltyBoostApplied: false, noveltyBoostValue: 0` for backward-compatible log schemas.

The 5% sample rate keeps storage costs low while still catching calibration drift. A try-catch wrapper guarantees that telemetry failures never affect scoring results. If the observation write fails, the search result is unchanged and the failure is swallowed silently.

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Scoring observability
- Current reality source: feature_catalog.md
