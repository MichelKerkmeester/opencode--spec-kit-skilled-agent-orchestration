# Canonical ID dedup hardening

## Current Reality

Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.

## Source Metadata

- Group: Alignment remediation (Phase 016)
- Source feature title: Canonical ID dedup hardening
- Current reality source: feature_catalog.md
