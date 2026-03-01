---
title: "MCP Embedding Failure - Investigation Plan [086-mcp-embedding-failure/plan]"
description: "After comprehensive parallel investigation by 12 opus agents, the root cause of the \"Protobuf parsing failed\" error is identified as"
trigger_phrases:
  - "mcp"
  - "embedding"
  - "failure"
  - "investigation"
  - "plan"
  - "086"
importance_tier: "important"
contextType: "decision"
---
# MCP Embedding Failure - Investigation Plan

## Executive Summary

After comprehensive parallel investigation by 12 opus agents, the root cause of the "Protobuf parsing failed" error is identified as:

**PRIMARY CAUSE: Corrupted ONNX model cache** - The `nomic-ai/nomic-embed-text-v1.5` model file in the HuggingFace transformers cache is corrupted or incomplete.

**SECONDARY FACTOR: Node.js v25 compatibility** - While not directly causing the issue, Node.js v25.5.0 may have subtle incompatibilities with onnxruntime-node prebuilt binaries.

**NOT THE CAUSE: Recent code changes** - No changes to ONNX loading code were made. This is an environmental issue.

---

## Root Cause Analysis

### Evidence Summary

| Factor | Status | Evidence |
|--------|--------|----------|
| Code changes to ONNX loading | EXCLUDED | No relevant commits in last 10 commits |
| @huggingface/transformers version | CONTRIBUTING | v3.8.1 has known issues (v3.4.0+) |
| Corrupted model cache | LIKELY ROOT CAUSE | Common issue documented in GitHub #1228 |
| Node.js v25.5.0 | CONTRIBUTING | May affect onnxruntime-node ABI |
| Native module compatibility | EXCLUDED | All modules support Node.js 22+ |

### The Error Chain

```
1. User calls memory_search/memory_save (first embedding request)
       ↓
2. Lazy provider initialization triggers
       ↓
3. HfLocalProvider.get_model() called
       ↓
4. @huggingface/transformers pipeline() invoked
       ↓
5. Model loading from cache: .cache/nomic-ai/nomic-embed-text-v1.5/onnx/model.onnx
       ↓
6. onnxruntime-node attempts protobuf parsing
       ↓
7. ERROR: "Protobuf parsing failed" - file corrupted/incomplete
       ↓
8. System falls back to BM25-only mode (deferred indexing)
```

---

## Immediate Fixes (For User)

### Fix 1: Clear Corrupted Cache (Most Likely Solution)

```bash
# For the user's project path (from error message):
rm -rf "/Users/rs/.data/code/barter/ai-speckit/coder/.opencode/skill/system-spec-kit/node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5"

# Then restart MCP server - model will re-download (~274MB)
```

### Fix 2: Use Node.js 22 LTS (Recommended)

```bash
# Using nvm
nvm install 22
nvm use 22

# Then restart MCP server
```

### Fix 3: Switch to Cloud Provider (Bypass Local Model)

```bash
# Option A: Voyage AI (recommended)
export EMBEDDINGS_PROVIDER=voyage
export VOYAGE_API_KEY="pa-your-key-here"

# Option B: OpenAI
export EMBEDDINGS_PROVIDER=openai
export OPENAI_API_KEY="sk-your-key-here"

# Then restart MCP server
```

---

## Findings by Investigation Area

### 1. Recent Code Changes (Agent: a52414)
- **Finding**: NO changes to embedding/ONNX code in recent commits
- **Conclusion**: Issue is environmental, not code-related
- **Evidence**: git diff analysis of last 10 commits

### 2. HuggingFace Transformers (Agent: a5209f4)
- **Finding**: Known issues with v3.4.0+ causing protobuf failures
- **Root Cause**: Incomplete downloads, cache corruption
- **Reference**: GitHub Issue #1228
- **Recommendation**: Clear cache or downgrade to v3.3.3

### 3. Node.js Compatibility (Agent: a650895)
- **Finding**: Node.js v25.5.0 meets requirements but may have edge issues
- **Native Modules**: All compatible with Node.js 22+
- **Recommendation**: Use Node.js 22.x LTS for stability

### 4. ONNX Model Loading (Agent: a979a26)
- **Finding**: Model loads lazily on first embedding request
- **Cache Location**: `node_modules/@huggingface/transformers/.cache/`
- **Model Size**: ~522MB total (onnx/model.onnx is main file)
- **Validation**: Protobuf parsing happens in onnxruntime-node

### 5. Fallback Behavior (Agent: a297d2b)
- **Finding**: Deferred indexing works correctly
- **Degradation**: BM25/FTS5 search continues working
- **Retry**: Background job attempts re-embedding every 5 minutes
- **Status**: FUNCTIONING AS DESIGNED

### 6. Error Handling (Agent: a6d1792)
- **Finding**: Protobuf errors not classified in error catalog
- **Gap**: No E0XX code for ONNX/Protobuf failures
- **Recommendation**: Add E005 ONNX_CACHE_CORRUPT code

### 7. Alternative Providers (Agent: a0ad453)
- **Finding**: Voyage/OpenAI switch is well-documented
- **Process**: Set env vars, restart server
- **Note**: Different providers use separate database files

### 8. Native Modules (Agent: aa049f2)
- **Finding**: better-sqlite3, sqlite-vec, isolated-vm all compatible
- **Minimum Node.js**: 22.0.0 (due to isolated-vm)
- **Graceful Degradation**: sqlite-vec failure falls back to anchor-only

### 9. Cache Location (Agent: a987e6f)
- **Finding**: Project-local cache, NOT user-home cache
- **Path**: `node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5/`
- **Note**: ~/.cache/huggingface/ exists but NOT used for this model

### 10. MCP Startup (Agent: a4e618d)
- **Finding**: Lazy loading is default behavior
- **Timing**: Model loads on first embedding request, not startup
- **Env Var**: SPECKIT_EAGER_WARMUP=true for eager loading

### 11. Dimension Handling (Agent: aa0416e)
- **Finding**: Each provider gets separate database file
- **Migration**: NO dimension migration exists
- **Isolation**: Switching providers doesn't corrupt existing data

### 12. Troubleshooting Docs (Agent: afac4cd)
- **Finding**: MAJOR GAP - Protobuf errors not documented
- **Missing**: Cache clearing instructions
- **Missing**: Error code E005 for ONNX issues
- **Recommendation**: Update troubleshooting.md

---

## Implementation Recommendations

### Phase 1: Immediate (For User)
1. Clear corrupted model cache
2. Restart MCP server
3. If still failing, switch to Node.js 22 LTS
4. If still failing, use Voyage/OpenAI as workaround

### Phase 2: Documentation Updates (For Project)
1. Add Protobuf/ONNX troubleshooting section to troubleshooting.md
2. Add error code E005: ONNX_CACHE_CORRUPT to recovery-hints.js
3. Document cache locations in environment_variables.md
4. Add emergency provider switch instructions

### Phase 3: Code Improvements (Optional)
1. Add Protobuf error pattern to user_friendly_error() in core.js
2. Add startup cache validation (check model file size)
3. Improve error messages for ONNX failures
4. Consider pinning @huggingface/transformers to specific version

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cache clear doesn't fix | Low | Medium | Switch to cloud provider |
| Node.js downgrade breaks other tools | Low | Medium | Test thoroughly |
| Cloud provider costs | Low | Low | Free tiers available |
| Re-download fails | Low | Medium | Retry or use alternative |

---

## Validation Checklist

- [ ] Clear model cache
- [ ] Restart MCP server
- [ ] Verify model downloads completely (~274MB)
- [ ] Test memory_search() works
- [ ] Verify semantic search returns results
- [ ] Check logs for "Model loaded" message
