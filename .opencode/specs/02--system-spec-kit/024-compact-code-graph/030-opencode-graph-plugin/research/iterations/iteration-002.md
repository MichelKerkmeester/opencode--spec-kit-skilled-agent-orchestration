# Research Iteration 002: Storage, Retrieval, Privacy, and Repair Internals

## Focus

Trace the plugin's persistence and ranking stack to separate truly reusable patterns from OpenCode-specific glue.

## Findings

1. The plugin keeps a parallel SQLite archive with:
   - `sessions`, `messages`, `parts`, and `resumes`
   - `artifacts` plus deduplicated `artifact_blobs`
   - `summary_nodes`, `summary_edges`, and `summary_state`
   - `message_fts`, `summary_fts`, and `artifact_fts` tables for search. [SOURCE: `external/opencode-lcm-master/src/store.ts:860-960`]
2. The summary model is a DAG over archived messages, persisted transactionally and mirrored into `summary_fts` plus `summary_state` so rebuilds are verifiable. [SOURCE: `external/opencode-lcm-master/src/store.ts:3580-3665`]
3. Retrieval quality is not raw FTS alone. The plugin:
   - builds phrase-aware FTS queries,
   - computes TF-IDF document-frequency weights across all three FTS tables,
   - drops corpus-common noise terms,
   - applies source-aware reranking and recency signals. [SOURCE: `external/opencode-lcm-master/src/store-search.ts:37-164`] [SOURCE: `external/opencode-lcm-master/src/search-ranking.ts:29-121`]
4. Automatic recall is bounded rather than greedy. It uses scope ordering, per-scope budgets, result-type quotas, and stop conditions (`targetHits`, `stopOnFirstScopeWithHits`). [SOURCE: `external/opencode-lcm-master/src/options.ts:37-80`] [SOURCE: `external/opencode-lcm-master/src/store.ts:2937-3219`]
5. Privacy rules run before storage/indexing, supporting tool-prefix exclusion, path-based exclusion, and regex redaction. [SOURCE: `external/opencode-lcm-master/src/privacy.ts:3-122`]
6. Archive integrity is a first-class concept. `lcm_doctor` can detect and optionally repair summary drift, FTS drift, lineage drift, and orphaned artifact blobs. [SOURCE: `external/opencode-lcm-master/src/store.ts:1369-1605`]

## Interim Conclusion

The plugin's backend has real architectural value. The most portable pieces are not "OpenCode plugin" code; they are the deduplicated large-payload model, integrity repair loop, and bounded retrieval policy.

## Open Question After This Iteration

Which of these patterns are already present in Spec Kit Memory, and which are still true gaps?
