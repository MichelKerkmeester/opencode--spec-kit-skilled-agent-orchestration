# Pipeline and mutation hardening

## Current Reality

Ten fixes addressed schema completeness, pipeline metadata, embedding efficiency, stemmer quality, and data cleanup:

- **Schema params exposed (#13):** `memorySearch` tool schema now includes `trackAccess`, `includeArchived`, and `mode` parameters.
- **Dead dedup config removed (#14):** `sessionDeduped` removed from Stage 4 metadata (dedup is post-cache in the main handler).
- **Constitutional count passthrough (#15):** Stage 1's constitutional injection count flows through the orchestrator to Stage 4 output metadata.
- **Embedding caching (#16):** Stage 1 caches the query embedding at function scope for reuse in the constitutional injection path, saving one API call per search.
- **Stemmer double-consonant (#18):** `simpleStem()` now handles doubled consonants after suffix removal: "running"->"runn"->"run", "stopped"->"stopp"->"stop".
- **Full-content embedding on update (#19):** `memory_update` now embeds `title + "\n\n" + content_text` instead of title alone.
- **Ancillary record cleanup on delete (#20):** Memory deletion now cleans `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities`, and `causal_edges`.
- **BM25 index cleanup on delete (#21):** `bm25Index.getIndex().removeDocument(String(id))` called after successful delete when BM25 is enabled.
- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
- **Dynamic preflight error code (#23):** Preflight validation uses the actual error code from `preflightResult.errors[0].code` instead of hardcoding `ANCHOR_FORMAT_INVALID`.

## Source Metadata

- Group: Opus review remediation (Phase 017)
- Source feature title: Pipeline and mutation hardening
- Current reality source: feature_catalog.md
