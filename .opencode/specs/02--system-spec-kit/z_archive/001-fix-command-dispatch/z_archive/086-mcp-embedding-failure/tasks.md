---
title: "MCP Embedding Failure - Tasks [086-mcp-embedding-failure/tasks]"
description: "Objective: Give user actionable steps to resolve the issue now"
trigger_phrases:
  - "mcp"
  - "embedding"
  - "failure"
  - "tasks"
  - "086"
importance_tier: "normal"
contextType: "implementation"
---
# MCP Embedding Failure - Tasks

## Task Overview

| ID | Task | Priority | Status | Owner |
|----|------|----------|--------|-------|
| T001 | Provide immediate fix instructions to user | P0 | Pending | - |
| T002 | Document Protobuf/ONNX troubleshooting | P1 | Pending | - |
| T003 | Add E005 error code for ONNX issues | P1 | Pending | - |
| T004 | Add Protobuf pattern to error classification | P2 | Pending | - |
| T005 | Document cache locations | P2 | Pending | - |

---

## P0: Critical

### T001: Provide Immediate Fix Instructions to User

**Objective**: Give user actionable steps to resolve the issue now

**Instructions for User**:

1. **Clear the corrupted model cache**:
   ```bash
   rm -rf "/Users/rs/.data/code/barter/ai-speckit/coder/.opencode/skill/system-spec-kit/node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5"
   ```

2. **Restart OpenCode / MCP server**

3. **If still failing, switch Node.js version**:
   ```bash
   # Using nvm
   nvm install 22
   nvm use 22
   ```

4. **If still failing, use cloud provider**:
   ```bash
   export EMBEDDINGS_PROVIDER=voyage
   export VOYAGE_API_KEY="pa-your-key-from-voyage.ai"
   # Then restart
   ```

**Status**: Pending delivery to user

---

## P1: High Priority

### T002: Document Protobuf/ONNX Troubleshooting

**Objective**: Update troubleshooting.md with ONNX cache corruption guidance

**File**: `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md`

**Content to Add**:
```markdown
### Model Loading Issues (ONNX/Protobuf)

| Error | Root Cause | Resolution |
|-------|------------|------------|
| `Protobuf parsing failed` | Corrupted ONNX model cache | Delete cache directory and restart |
| `Load model ... failed` | Incomplete model download | Clear cache, ensure stable network |
| `ONNX runtime error` | Node.js version mismatch | Use Node.js 22.x LTS |
| `MPS unavailable` | Apple Silicon fallback | Automatic CPU fallback (no action) |

**Cache Location:**
```bash
# Project-local cache (most common)
node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5/

# Clear cache command
rm -rf node_modules/@huggingface/transformers/.cache/nomic-ai/
```

**Quick Workaround - Switch to Cloud Provider:**
```bash
export EMBEDDINGS_PROVIDER=voyage
export VOYAGE_API_KEY="your-key"
# Or: EMBEDDINGS_PROVIDER=openai with OPENAI_API_KEY
```
```

**Status**: Pending

---

### T003: Add E005 Error Code for ONNX Issues

**Objective**: Add proper error code and recovery hints for ONNX failures

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.js`

**Content to Add**:
```javascript
// In ERROR_CODES (around line 14):
EMBEDDING_MODEL_CORRUPT: 'E005',

// In RECOVERY_HINTS (around line 140):
[ERROR_CODES.EMBEDDING_MODEL_CORRUPT]: {
  hint: 'Embedding model file is corrupted or incomplete. This is usually caused by an interrupted download.',
  actions: [
    'Delete cached model: rm -rf node_modules/@huggingface/transformers/.cache/nomic-ai/',
    'Restart MCP server to re-download model',
    'If persistent, check disk space and network connectivity',
    'Alternative: Set EMBEDDINGS_PROVIDER=voyage or openai to use cloud embedding'
  ],
  severity: 'high',
  toolTip: 'memory_health()'
},
```

**Status**: Pending

---

## P2: Medium Priority

### T004: Add Protobuf Pattern to Error Classification

**Objective**: Improve error message classification for Protobuf/ONNX errors

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.js`

**Content to Add** (in `internal_patterns` array around line 97):
```javascript
{ pattern: /protobuf.*pars/i, message: 'Model file corrupted. Delete cached model and restart.' },
{ pattern: /onnx.*failed/i, message: 'ONNX runtime error. Try clearing model cache.' },
{ pattern: /model.*invalid/i, message: 'Invalid model format. Re-download model files.' },
```

**Status**: Pending

---

### T005: Document Cache Locations

**Objective**: Add cache location reference to environment variables doc

**File**: `.opencode/skill/system-spec-kit/references/config/environment_variables.md`

**Content to Add**:
```markdown
### Model Cache Locations

The HuggingFace local embedding model is cached at:

| OS | Location |
|----|----------|
| All | `[project]/node_modules/@huggingface/transformers/.cache/` |

**To clear corrupted cache:**
```bash
rm -rf node_modules/@huggingface/transformers/.cache/
```

Model will automatically re-download on next startup (~274MB for nomic-embed-text-v1.5).
```

**Status**: Pending

---

## Completion Criteria

- [ ] User has clear instructions to fix the issue
- [ ] Troubleshooting doc covers Protobuf/ONNX errors
- [ ] Error code E005 added to recovery-hints.js
- [ ] Error classification catches Protobuf patterns
- [ ] Cache locations documented
