# Pre-storage quality gate

## Current Reality

A three-layer quality gate on memory save validates content before it enters the index. Layer 1 checks structural validity (title exists, content at least 50 characters, valid spec folder path format). Layer 2 scores content quality across five dimensions (title quality, trigger quality, length quality, anchor quality, metadata quality) with a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity against existing memories in the same spec folder, rejecting near-duplicates above 0.92.

The gate starts in warn-only mode for 14 days after activation per the MR12 mitigation: it logs would-reject decisions without blocking saves while the thresholds are being validated. After the warn-only period, hard rejections apply. Runs behind the `SPECKIT_SAVE_QUALITY_GATE` flag (default ON).

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Pre-storage quality gate
- Current reality source: feature_catalog.md
