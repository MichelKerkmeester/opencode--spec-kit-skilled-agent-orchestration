# System statistics (memory_stats)

## Current Reality

A single call returns the system dashboard. Total memory count, embedding status breakdown (how many succeeded, how many are pending, how many failed), date range of the oldest and newest memories, total trigger phrase count, tier distribution across all six tiers, database file size in bytes, last indexed timestamp and whether vector search is available.

The top spec folders are ranked by one of four strategies. Count (default) sorts by how many memories each folder contains. Recency sorts by the most recently updated memory in each folder. Importance sorts by the highest importance tier present. Composite uses a weighted multi-factor score from `folderScoring.computeFolderScores()` that combines recency, importance, activity and validation scores into a single ranking.

The composite mode is the most revealing. A folder can have many memories (high count) but all of them stale (low recency) and unvalidated (low validation score). Composite catches that. Pass `includeScores: true` to see the score breakdown per folder: recencyScore, importanceScore, activityScore, validationScore, topTier and lastActivity.

Graph channel metrics from hybrid search and a `vectorSearchEnabled` flag round out the response. If scoring fails for any reason, the system falls back to count-based ranking gracefully.

## Source Metadata

- Group: Discovery
- Source feature title: System statistics (memory_stats)
- Summary match found: No
- Current reality source: feature_catalog.md
