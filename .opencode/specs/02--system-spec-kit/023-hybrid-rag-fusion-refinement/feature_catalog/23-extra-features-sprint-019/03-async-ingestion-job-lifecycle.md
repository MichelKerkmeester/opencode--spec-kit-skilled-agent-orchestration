# Async ingestion job lifecycle

## Current Reality

**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, max 10 concurrent jobs, and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Supersedes the current lightweight `asyncEmbedding` path in `memory_save`.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Async ingestion job lifecycle
- Summary match found: Yes
- Summary source feature title: Async ingestion job lifecycle
- Current reality source: feature_catalog.md
