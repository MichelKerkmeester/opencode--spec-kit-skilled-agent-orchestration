# Synthetic ground truth corpus

## Current Reality

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

40 queries are hand-written natural language, not derived from trigger phrases. That last detail matters: if your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Synthetic ground truth corpus
- Summary match found: Yes
- Summary source feature title: Synthetic ground truth corpus
- Current reality source: feature_catalog.md
