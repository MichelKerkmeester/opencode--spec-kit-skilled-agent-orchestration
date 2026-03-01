---
title: "MCP Embedding Failure - Implementation Summary [086-mcp-embedding-failure/implementation-summary]"
description: "This spec addressed two issues"
trigger_phrases:
  - "mcp"
  - "embedding"
  - "failure"
  - "implementation"
  - "summary"
  - "implementation summary"
  - "086"
importance_tier: "normal"
contextType: "implementation"
---
# MCP Embedding Failure - Implementation Summary

## Overview

This spec addressed two issues:
1. **User's Reported Error**: "Protobuf parsing failed" - Root cause: corrupted ONNX model cache (environmental issue)
2. **Code Bugs Discovered**: 5 real bugs found during deep investigation that were unrelated to user's error but needed fixing

## User's Error Resolution

**Root Cause**: Corrupted ONNX model cache file (NOT a code bug)

**Fix Instructions**:
```bash
# Clear corrupted cache
rm -rf "/path/to/project/node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5"

# Restart MCP server - model will re-download (~274MB)
```

## Code Bug Fixes Implemented

### Fix #1: CRITICAL - Background Retry Job Never Started
**File**: `mcp_server/context-server.js`
**Issue**: `start_background_job()` in retry-manager.js was never called during MCP startup
**Fix**: Added call to `retryManager.start_background_job()` during initialization, and `stop_background_job()` during graceful shutdown

### Fix #2: CRITICAL - Embedding Dimension Validation
**Files**: `mcp_server/lib/search/vector-index.js`, `mcp_server/context-server.js`
**Issue**: `vec_memories` table created with wrong dimension if provider not initialized
**Fix**:
- Added `vec_metadata` table to store dimension at creation time
- Added `validate_embedding_dimension()` function to detect mismatches
- Added dimension validation during startup with clear warning message

### Fix #3: MEDIUM - Warmup Error Handling in Factory Fallback
**File**: `shared/embeddings/factory.js`
**Issue**: Fallback warmup `await provider.warmup()` was not wrapped in try/catch
**Fix**: Wrapped all fallback warmup calls in try/catch to prevent unhandled errors

### Fix #4: MEDIUM - Wrong Embedding Function in Retry Manager
**File**: `mcp_server/lib/providers/retry-manager.js`
**Issue**: Used `generate_embedding()` instead of `generate_document_embedding()`
**Fix**: Changed to use `generate_document_embedding()` for proper task prefix (Nomic model requires it)

### Fix #5: LOW - Model Loading Timeout
**File**: `shared/embeddings/providers/hf-local.js`
**Issue**: No timeout on model loading - could hang forever on corrupted cache
**Fix**: Added 2-minute timeout wrapper (`MODEL_LOAD_TIMEOUT = 120000ms`) with clear error message

## Files Modified

| File | Changes |
|------|---------|
| `mcp_server/context-server.js` | +Import retryManager, +Start background job, +Dimension validation, +Stop job on shutdown |
| `mcp_server/lib/search/vector-index.js` | +vec_metadata table, +validate_embedding_dimension(), +Export function |
| `mcp_server/lib/providers/retry-manager.js` | Changed generate_embedding to generate_document_embedding |
| `shared/embeddings/factory.js` | +try/catch around fallback warmup (2 locations) |
| `shared/embeddings/providers/hf-local.js` | +MODEL_LOAD_TIMEOUT constant, +Timeout wrapper in get_model() |

## Testing Recommendations

1. **Background Retry Job**: Create a memory with failed embedding, verify it gets retried automatically
2. **Dimension Validation**: Start server with different EMBEDDINGS_PROVIDER, verify warning appears
3. **Factory Fallback**: Simulate API key failure, verify fallback to hf-local works
4. **Model Timeout**: Corrupt model cache, verify timeout error instead of infinite hang

## Status

- [x] User's error diagnosed (environmental, not code)
- [x] Fix instructions provided
- [x] 5 code bugs fixed
- [ ] Documentation updates (T002-T005) - deferred
