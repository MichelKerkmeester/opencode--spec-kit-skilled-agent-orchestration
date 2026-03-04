# Query complexity router

## Current Reality

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers based on term count, character count, trigger phrase presence and stop-word ratio. Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

When the `SPECKIT_COMPLEXITY_ROUTER` flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

The router's classification tier (`routeResult.tier`) is propagated into `traceMetadata.queryComplexity` in hybrid search (CHK-038), making it available in response envelopes when `includeTrace: true`. The formatter reads this via a fallback path from `traceMetadata` when stage metadata is unavailable.

## Source Metadata

- Group: Query intelligence
- Source feature title: Query complexity router
- Current reality source: feature_catalog.md
