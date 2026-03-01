---
title: "Implementation Plan: Codebase Fixes [052-codebase-fixes/plan]"
description: "File: mcp_server/lib/checkpoints.js"
trigger_phrases:
  - "implementation"
  - "plan"
  - "codebase"
  - "fixes"
  - "052"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Codebase Fixes

## Phase 1: P0 Critical Fixes

### Step 1.1: Fix checkpoints.js Dimension Handling

**File:** `mcp_server/lib/checkpoints.js`

**Changes:**
1. Remove hardcoded `EMBEDDING_DIM = 768` constant (line 20)
2. Add import: `const { getEmbeddingDimension } = require('../../shared/embeddings');`
3. In `createCheckpoint()` (line 135): Add `embeddingDimension` to metadata
4. In `restoreCheckpoint()` (line 509): Use dynamic dimension for validation

**Before:**
```javascript
const EMBEDDING_DIM = 768;
// ...
if (embeddingArray.length !== EMBEDDING_DIM) {
```

**After:**
```javascript
const { getEmbeddingDimension } = require('../../shared/embeddings');
// ...
const currentDim = getEmbeddingDimension();
const checkpointDim = snapshot.metadata?.embeddingDimension || 768;
if (embeddingArray.length !== currentDim) {
```

### Step 1.2: Fix embeddings.js getEmbeddingDimension

**File:** `shared/embeddings.js`

**Changes:**
1. Update `getEmbeddingDimension()` to check environment for provider type
2. Return provider-specific dimension as fallback

**Before:**
```javascript
function getEmbeddingDimension() {
  if (providerInstance) {
    return providerInstance.getProfile().dim;
  }
  return 768;
}
```

**After:**
```javascript
function getEmbeddingDimension() {
  if (providerInstance) {
    return providerInstance.getProfile().dim;
  }
  // Fallback based on configured provider
  const provider = process.env.EMBEDDINGS_PROVIDER?.toLowerCase();
  if (provider === 'voyage') return 1024;
  if (provider === 'openai') return 1536;
  return 768; // HF-local default
}
```

## Phase 2: P1 Performance Fixes

### Step 2.1: Parallel Batch Embeddings

**File:** `shared/embeddings.js`

**Changes:**
1. Update `generateBatchEmbeddings()` to use Promise.all with concurrency
2. Add concurrency parameter

**Before:**
```javascript
async function generateBatchEmbeddings(texts) {
  const results = [];
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
  }
  return results;
}
```

**After:**
```javascript
async function generateBatchEmbeddings(texts, concurrency = 5) {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts must be an array');
  }

  const results = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch = texts.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(text => generateEmbedding(text))
    );
    results.push(...batchResults);
  }
  return results;
}
```

## Phase 3: Verification

1. Run syntax check on modified files
2. Test MCP server health check
3. Test checkpoint create/restore
4. Verify embedding dimension detection

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking existing checkpoints | Legacy fallback to 768 if no metadata |
| Provider not initialized when dimension needed | Environment-based fallback |
| Rate limiting with parallel embeddings | Concurrency limit of 5 |

## Rollback Plan

If issues arise:
1. Revert checkpoints.js to previous version
2. Revert embeddings.js to previous version
3. Both files are in git, easy rollback
