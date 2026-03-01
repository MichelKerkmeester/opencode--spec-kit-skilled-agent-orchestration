---
title: "MCP Embedding Failure Investigation [086-mcp-embedding-failure/spec]"
description: "Users report that the spec_kit_memory MCP server fails to generate semantic embeddings due to a corrupted local HuggingFace embedding model cache. The ONNX model fails protobuf ..."
trigger_phrases:
  - "mcp"
  - "embedding"
  - "failure"
  - "investigation"
  - "spec"
  - "086"
importance_tier: "important"
contextType: "decision"
---
# MCP Embedding Failure Investigation

## Problem Statement

Users report that the `spec_kit_memory` MCP server fails to generate semantic embeddings due to a corrupted local HuggingFace embedding model cache. The ONNX model fails protobuf parsing.

## Symptoms

1. MCP server starts but semantic embeddings fail
2. Log shows: `provider: hf-local` then `Loading nomic-ai/nomic-embed-text-v1.5 ...`
3. Error: `Load model .../onnx/model.onnx failed: Protobuf parsing failed`
4. Memory-save falls back to "deferred indexing" (BM25/FTS only)
5. Semantic search / vector ranking appears to fail
6. `libc++abi ... mutex lock failed` at process termination (SIGTERM during native code execution)

## Root Cause Hypothesis

The ONNX model file for `nomic-ai/nomic-embed-text-v1.5` in the HuggingFace transformers cache is corrupted. This can happen due to:
- Interrupted download
- Disk issues
- Node.js version incompatibility (user on v25.5.0, recommended 18+)

## Investigation Areas

1. **Model Cache Analysis** - Verify cache location and file integrity
2. **Node.js Compatibility** - Test with different Node versions
3. **Package Dependencies** - Check @huggingface/transformers compatibility
4. **Fallback Behavior** - Verify deferred indexing works correctly
5. **Alternative Providers** - Test Voyage/OpenAI providers as alternatives
6. **Error Handling** - Improve error messages and recovery

## Proposed Fixes

### Option 1: Clear Corrupted Cache (Most Common Fix)
```bash
rm -rf "[user-cache-path]/nomic-ai/nomic-embed-text-v1.5"
# Then restart MCP server
```

### Option 2: Use Supported Node Version
```bash
# Use Node 18-20 LTS instead of v25.5.0
nvm use 20
# Then restart
```

### Option 3: Use Alternative Provider
```bash
# Set environment variable to bypass hf-local
export EMBEDDINGS_PROVIDER=voyage  # or openai
export VOYAGE_API_KEY=your-key    # or OPENAI_API_KEY
# Then restart
```

## Files of Interest

- `.opencode/skill/system-spec-kit/shared/embeddings.js` - Main embeddings module
- `.opencode/skill/system-spec-kit/shared/embeddings/factory.js` - Provider factory
- `.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.js` - HF local provider
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.js` - Vector index implementation
- `.opencode/skill/system-spec-kit/mcp_server/package.json` - Dependencies

## Dependencies

```json
{
  "@huggingface/transformers": "^3.8.1",
  "better-sqlite3": "^12.5.0",
  "sqlite-vec": "^0.1.7-alpha.2"
}
```

## Node.js Requirements

- Documented: `>=18.0.0` (package.json engines field)
- User's version: `v25.5.0` (may have compatibility issues)
