# Chunk ordering preservation

## Current Reality

When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.

## Source Metadata

- Group: Pipeline architecture
- Source feature title: Chunk ordering preservation
- Summary match found: Yes
- Summary source feature title: Chunk ordering preservation
- Current reality source: feature_catalog.md
