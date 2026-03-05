# BM25 trigger phrase re-index gate

## Current Reality

The BM25 re-index condition in `memory-crud-update.ts` was expanded from title-only to title OR trigger phrases: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`. The BM25 corpus includes trigger phrases, so changes to either field must trigger re-indexing.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: BM25 trigger phrase re-index gate
- Current reality source: feature_catalog.md
