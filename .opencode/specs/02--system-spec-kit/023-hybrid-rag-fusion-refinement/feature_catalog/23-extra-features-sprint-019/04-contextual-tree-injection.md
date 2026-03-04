# Contextual tree injection

## Current Reality

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Contextual tree injection
- Summary match found: Yes
- Summary source feature title: Contextual tree injection
- Current reality source: feature_catalog.md
