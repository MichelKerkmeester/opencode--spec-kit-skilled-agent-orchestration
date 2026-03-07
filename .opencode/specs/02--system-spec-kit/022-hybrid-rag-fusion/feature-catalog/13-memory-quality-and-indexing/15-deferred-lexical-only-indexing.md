# Deferred lexical-only indexing

## Current Reality

Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations with deferred path |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema including embedding_status |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation pipeline with fallback |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector index implementation |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler validation |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |

## Source Metadata

- Group: Undocumented feature gap scan
- Source feature title: Deferred lexical-only indexing
- Current reality source: 10-agent feature gap scan
- Playbook reference: NEW-111
