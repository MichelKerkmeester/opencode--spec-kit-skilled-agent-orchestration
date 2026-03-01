---
title: "Tasks: Codebase Fixes [052-codebase-fixes/tasks]"
description: "1. Add import for getEmbeddingDimension"
trigger_phrases:
  - "tasks"
  - "codebase"
  - "fixes"
  - "052"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Codebase Fixes

## Task Breakdown

### T1: Fix checkpoints.js Dimension Handling [P0]
- **Status:** Pending
- **Estimate:** 15 min
- **Files:** `mcp_server/lib/checkpoints.js`
- **Steps:**
  1. Add import for getEmbeddingDimension
  2. Remove hardcoded EMBEDDING_DIM constant
  3. Update createCheckpoint to store dimension in metadata
  4. Update restoreCheckpoint to use dynamic dimension
  5. Add legacy checkpoint handling (fallback to 768)

### T2: Fix embeddings.js getEmbeddingDimension [P0]
- **Status:** Pending
- **Estimate:** 10 min
- **Files:** `shared/embeddings.js`
- **Steps:**
  1. Update getEmbeddingDimension() function
  2. Add environment-based fallback logic
  3. Keep backward compatibility

### T3: Parallel Batch Embeddings [P1]
- **Status:** Pending
- **Estimate:** 10 min
- **Files:** `shared/embeddings.js`
- **Steps:**
  1. Update generateBatchEmbeddings() function
  2. Add concurrency parameter
  3. Implement batched Promise.all pattern

### T4: Verification [P0]
- **Status:** Pending
- **Estimate:** 10 min
- **Steps:**
  1. Syntax check both files
  2. Test MCP server startup
  3. Verify dimension detection

## Dependencies

```
T1 ──┐
     ├──> T4 (Verification)
T2 ──┤
     │
T3 ──┘
```

T1 and T2 are related (both deal with dimensions) but can be done in parallel.
T3 is independent.
T4 must wait for T1, T2, T3.
