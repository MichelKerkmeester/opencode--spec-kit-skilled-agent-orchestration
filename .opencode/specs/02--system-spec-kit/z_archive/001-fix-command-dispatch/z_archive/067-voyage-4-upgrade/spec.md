---
title: "Voyage 4 Model Upgrade Analysis [067-voyage-4-upgrade/spec]"
description: "Objective: Evaluate and plan the upgrade from current Voyage models to the newly released Voyage 4 model family for both Spec Kit Memory MCP and Narsil MCP systems."
trigger_phrases:
  - "voyage"
  - "model"
  - "upgrade"
  - "analysis"
  - "spec"
  - "067"
importance_tier: "important"
contextType: "decision"
---
# Voyage 4 Model Upgrade Analysis

## Overview

**Objective**: Evaluate and plan the upgrade from current Voyage models to the newly released Voyage 4 model family for both Spec Kit Memory MCP and Narsil MCP systems.

**Scope**: 
- Spec Kit Memory MCP (conversation context embeddings)
- Narsil MCP (code semantic search embeddings)
- Configuration files, documentation, and provider implementations

**Decision Required**: Determine optimal Voyage 4 model for each use case

---

## Current State Analysis

### System 1: Spec Kit Memory MCP

| Component | Current Value | Location |
|-----------|---------------|----------|
| **Default Model** | `voyage-3.5` | `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.js:12` |
| **Dimensions** | 1024 | `MODEL_DIMENSIONS` mapping |
| **Environment Variable** | `VOYAGE_API_KEY` | `opencode.json:27` |
| **Model Override** | `VOYAGE_EMBEDDINGS_MODEL` | Factory reads from env |
| **Provider** | VoyageProvider class | `shared/embeddings/providers/voyage.js` |

**Supported Models in Code:**
```javascript
const MODEL_DIMENSIONS = {
  'voyage-3.5': 1024,
  'voyage-3.5-lite': 1024,
  'voyage-3-large': 1024,
  'voyage-code-3': 1024,
  'voyage-code-2': 1536,
  'voyage-3': 1024,
  'voyage-finance-2': 1024,
  'voyage-law-2': 1024,
};
```

### System 2: Narsil MCP

| Component | Current Value | Location |
|-----------|---------------|----------|
| **Default Model** | `voyage-code-2` | `.utcp_config.json:36` |
| **Dimensions** | 1536 | Hardcoded in config |
| **Environment Variable** | `VOYAGE_API_KEY` (+ `narsil_VOYAGE_API_KEY` for Code Mode) | `.env` |
| **Configuration** | `--neural-model voyage-code-2` | `.utcp_config.json` args |

**Narsil Config (`.utcp_config.json`):**
```json
"args": [
  "--neural",
  "--neural-backend", "api",
  "--neural-model", "voyage-code-2"
]
```

---

## Voyage 4 Model Family (Released January 15, 2026)

### New Models Available

| Model | Dimensions | TPM Limit | RPM Limit | Best For |
|-------|------------|-----------|-----------|----------|
| **voyage-4-large** | 2048* | 3,000,000 | 2,000 | Highest accuracy, MoE architecture |
| **voyage-4** | 1024* | 8,000,000 | 2,000 | Best balance accuracy/cost |
| **voyage-4-lite** | 1024* | 16,000,000 | 2,000 | High throughput, low latency |
| **voyage-4-nano** | 512* | Open Source | - | Local dev, HuggingFace Apache 2.0 |

*Dimensions support Matryoshka learning: 2048, 1024, 512, 256 options

### Key Features

1. **Shared Embedding Space**: All Voyage 4 models produce compatible embeddings
   - Embed documents with `voyage-4-large` (one-time, best quality)
   - Query with `voyage-4-lite` or `voyage-4` (ongoing, lower cost)
   - **Asymmetric retrieval** is now possible

2. **MoE Architecture** (`voyage-4-large`): 
   - First production-grade MoE embedding model
   - 40% lower serving cost than comparable dense models
   - State-of-the-art retrieval accuracy

3. **Matryoshka Learning**: 
   - Supports multiple dimension outputs: 2048, 1024, 512, 256
   - Multiple quantization: float32, int8, uint8, binary

4. **Performance Benchmarks**:
   - `voyage-4-large` beats Gemini Embedding 001 by 3.87%
   - `voyage-4-large` beats Cohere Embed v4 by 8.20%
   - `voyage-4-large` beats OpenAI v3 Large by 14.05%

---

## Upgrade Recommendations

### Spec Kit Memory MCP

| Scenario | Recommended Model | Rationale |
|----------|-------------------|-----------|
| **Standard Use** | `voyage-4` | Best balance, approaches voyage-3-large quality |
| **High Volume** | `voyage-4-lite` | 16M TPM, approaches voyage-3.5 quality |
| **Maximum Quality** | `voyage-4-large` + `voyage-4` asymmetric | Best retrieval with cost-efficient queries |

**Recommended**: `voyage-4` for default, with documentation on asymmetric retrieval option.

### Narsil MCP (Code Search)

| Current | Recommended | Rationale |
|---------|-------------|-----------|
| `voyage-code-2` (1536d) | Keep `voyage-code-2` OR test `voyage-4` | No `voyage-code-4` announced yet |

**Analysis**: The Voyage 4 announcement focuses on general-purpose retrieval. There is **no `voyage-code-4`** mentioned. The existing `voyage-code-2` and `voyage-code-3` remain the specialized code embedding models.

**Recommendation**: 
- **Narsil**: Keep `voyage-code-2` until a code-specific Voyage 4 model is released
- **Alternative**: Test `voyage-4` for code search and compare accuracy before switching

---

## Affected Files

### Must Update

| File | Change Required |
|------|-----------------|
| `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.js` | Add Voyage 4 models to `MODEL_DIMENSIONS` |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Update model recommendations |
| `.opencode/skill/system-spec-kit/README.md` | Update model documentation |
| `.opencode/skill/system-spec-kit/shared/embeddings/factory.js` | Update default from `voyage-3.5` to `voyage-4` |

### Consider Updating

| File | Change Required |
|------|-----------------|
| `.utcp_config.json` | Only if testing Voyage 4 for Narsil |
| `.opencode/skill/mcp-narsil/INSTALL_GUIDE.md` | Document Voyage 4 option |
| `.opencode/skill/mcp-narsil/SKILL.md` | Update model recommendations |

### No Change Required

| File | Reason |
|------|--------|
| `opencode.json` | Uses env variable, no model hardcoded |
| `profile.js` | Generic, handles any model |

---

## Migration Considerations

### Database Compatibility

**CRITICAL**: Voyage 4 models produce different embeddings than Voyage 3.x models.

**Options:**
1. **Fresh Index**: Delete existing database, re-index all memory files with new model
2. **Parallel Databases**: The existing `EmbeddingProfile` system creates separate database files per model/provider (e.g., `context-index__voyage__voyage-4__1024.sqlite`)

**Recommended**: Option 2 (parallel databases) - the system already supports this.

### Dimension Compatibility

| Model | Default Dimension | Matryoshka Options |
|-------|-------------------|-------------------|
| voyage-3.5 | 1024 | Not supported |
| voyage-4 | 1024 (default) | 2048, 1024, 512, 256 |
| voyage-4-large | 2048 (default) | 2048, 1024, 512, 256 |
| voyage-4-lite | 1024 (default) | 2048, 1024, 512, 256 |

**Recommendation**: Use 1024 dimensions initially for backward compatibility.

---

## Success Criteria

- [ ] Voyage 4 models added to `MODEL_DIMENSIONS` mapping
- [ ] Default model changed from `voyage-3.5` to `voyage-4` in factory.js
- [ ] Install guides updated with Voyage 4 recommendations
- [ ] Asymmetric retrieval documented as optional optimization
- [ ] Database migration path documented
- [ ] Memory files re-indexed with new model
- [ ] Search quality verified (no regressions)

---

## Out of Scope

- Narsil model change (no code-specific Voyage 4 yet)
- Matryoshka dimension reduction (future optimization)
- Binary quantization (future optimization)
- `voyage-4-nano` local deployment (requires HuggingFace setup)

---

## References

- [Voyage 4 Blog Post](https://blog.voyageai.com/2026/01/15/voyage-4/)
- [Voyage AI Documentation](https://docs.voyageai.com)
- [voyage-4-nano on HuggingFace](https://huggingface.co/voyageai/voyage-4-nano)
