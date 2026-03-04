# Embedding cache

## Current Reality

Embedding API calls are the most expensive operation in the indexing pipeline. The embedding cache stores generated embeddings in a SQLite table keyed by SHA-256 content hash and model ID. On re-index, the system checks the cache first.

A hit returns the stored embedding in microseconds instead of making a network round-trip that costs money and takes hundreds of milliseconds. LRU eviction via `last_used_at` prevents unbounded cache growth, and the `INSERT OR REPLACE` strategy handles model upgrades cleanly.

The cache has no feature flag because cache misses fall through to normal embedding generation with zero behavioral change.

## Source Metadata

- Group: Scoring and calibration
- Source feature title: Embedding cache
- Summary match found: Yes
- Summary source feature title: Embedding cache
- Current reality source: feature_catalog.md
