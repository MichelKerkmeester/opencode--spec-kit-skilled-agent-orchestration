---
title: "Spec: Codebase Fixes - Embedding Dimension & Performance [052-codebase-fixes/spec]"
description: "Fix critical bugs and performance issues identified during comprehensive codebase analysis."
trigger_phrases:
  - "spec"
  - "codebase"
  - "fixes"
  - "embedding"
  - "dimension"
  - "052"
importance_tier: "important"
contextType: "decision"
---
# Spec: Codebase Fixes - Embedding Dimension & Performance

## Overview

Fix critical bugs and performance issues identified during comprehensive codebase analysis.

## Problem Statement

1. **P0-1: Checkpoint dimension mismatch** - `checkpoints.js` hardcodes `EMBEDDING_DIM = 768` but system uses Voyage (1024 dimensions). All checkpoint restores fail to restore embeddings.

2. **P0-2: getEmbeddingDimension() wrong default** - Returns 768 before provider initialization, which is wrong for Voyage (1024) and OpenAI (1536).

3. **P1-1: Sequential batch embeddings** - `generateBatchEmbeddings()` processes texts one at a time instead of in parallel, causing 10x slower performance.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Checkpoint restore must use dynamic embedding dimension from provider | P0 |
| FR-002 | Checkpoint create must store embedding dimension in metadata | P0 |
| FR-003 | getEmbeddingDimension() must return correct dimension based on configured provider | P0 |
| FR-004 | Batch embedding generation must process texts in parallel with concurrency control | P1 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | Backward compatibility with existing checkpoints (created without dimension metadata) | P0 |
| NFR-002 | Batch embeddings should process 5 texts concurrently by default | P1 |
| NFR-003 | No breaking changes to existing API signatures | P0 |

## Technical Approach

### Fix 1: Checkpoint Dimension Handling

1. Import `getEmbeddingDimension` from embeddings module
2. Store dimension in checkpoint metadata during `createCheckpoint()`
3. Use dynamic dimension comparison during `restoreCheckpoint()`
4. Handle legacy checkpoints (assume 768 if no metadata)

### Fix 2: getEmbeddingDimension Default

1. Check provider instance first (existing behavior)
2. If not initialized, check environment variable for provider type
3. Return provider-specific dimension based on config

### Fix 3: Parallel Batch Embeddings

1. Replace sequential for-loop with batched Promise.all
2. Add concurrency parameter (default: 5)
3. Process in batches to avoid overwhelming API

## Files to Modify

| File | Change |
|------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js` | Remove hardcoded EMBEDDING_DIM, import from embeddings, store/use dynamic dimension |
| `.opencode/skill/system-spec-kit/shared/embeddings.js` | Fix getEmbeddingDimension() default, add parallel batch processing |

## Success Criteria

- [ ] Checkpoint restore works with Voyage (1024-dim) embeddings
- [ ] getEmbeddingDimension() returns correct dimension for all providers
- [ ] Batch embeddings are 3-5x faster
- [ ] No syntax errors in modified files
- [ ] Existing tests pass

## Out of Scope

- God module refactoring (separate spec)
- Embedding cache implementation (future iteration)
- Test fixture creation (documentation task)
