---
title: "Voyage 4 Upgrade Plan [067-voyage-4-upgrade/plan]"
description: "File: .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.js"
trigger_phrases:
  - "voyage"
  - "upgrade"
  - "plan"
  - "067"
importance_tier: "important"
contextType: "decision"
---
# Voyage 4 Upgrade Plan

## Phase 1: Code Updates (Spec Kit Memory)

### 1.1 Update Voyage Provider
**File**: `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.js`

**Changes**:
1. Update `DEFAULT_MODEL` from `voyage-3.5` to `voyage-4`
2. Add Voyage 4 models to `MODEL_DIMENSIONS`:
   ```javascript
   const MODEL_DIMENSIONS = {
     // Voyage 4 family (new - shared embedding space)
     'voyage-4-large': 1024,  // Default 2048, using 1024 for compat
     'voyage-4': 1024,
     'voyage-4-lite': 1024,
     // Voyage 3 family (legacy)
     'voyage-3.5': 1024,
     'voyage-3.5-lite': 1024,
     'voyage-3-large': 1024,
     'voyage-3': 1024,
     // Specialized models
     'voyage-code-3': 1024,
     'voyage-code-2': 1536,
     'voyage-finance-2': 1024,
     'voyage-law-2': 1024,
   };
   ```
3. Add pricing comment update for voyage-4 models

### 1.2 Update Factory Default
**File**: `.opencode/skill/system-spec-kit/shared/embeddings/factory.js`

**Changes**:
1. Line 165: Update `VOYAGE_EMBEDDINGS_MODEL` default from `voyage-3.5` to `voyage-4`

### 1.3 Update Install Guide
**File**: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`

**Changes**:
1. Update model table to show `voyage-4` as recommended
2. Add note about Voyage 4 shared embedding space feature
3. Document asymmetric retrieval option

---

## Phase 2: Documentation Updates

### 2.1 Spec Kit README
**File**: `.opencode/skill/system-spec-kit/README.md`

**Changes**:
1. Update Voyage model recommendation from `voyage-3.5` to `voyage-4`
2. Add section on Voyage 4 features if relevant

### 2.2 Narsil Documentation (Optional)
**Files**: 
- `.opencode/skill/mcp-narsil/INSTALL_GUIDE.md`
- `.opencode/skill/mcp-narsil/SKILL.md`

**Changes**:
1. Add note that `voyage-4` can be tested for code search
2. Keep `voyage-code-2` as current recommendation until code-specific V4 releases

---

## Phase 3: Testing

### 3.1 Integration Test
1. Set `VOYAGE_EMBEDDINGS_MODEL=voyage-4` in environment
2. Restart OpenCode to reload MCP server
3. Run `memory_health` to verify provider detection
4. Run `memory_index_scan` to re-index a test memory file
5. Run `memory_search` to verify search quality

### 3.2 Database Migration
1. Note: System creates new database file automatically: `context-index__voyage__voyage-4__1024.sqlite`
2. Old database (`context-index__voyage__voyage-3.5__1024.sqlite`) remains intact
3. Run full re-index: `memory_index_scan({ force: true })`

---

## Phase 4: Rollout

### 4.1 Staged Rollout
1. **Test**: Use `VOYAGE_EMBEDDINGS_MODEL=voyage-4` override first
2. **Validate**: Verify search quality and performance
3. **Default**: Update code defaults once validated
4. **Document**: Update all references

### 4.2 Rollback Plan
- Set `VOYAGE_EMBEDDINGS_MODEL=voyage-3.5` to revert
- Old database files are preserved

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Voyage API access | Already configured (`VOYAGE_API_KEY`) |
| Voyage 4 API availability | Available (announced Jan 15, 2026) |
| Code Mode MCP | Not affected |
| Narsil MCP | Optional (no change recommended) |

---

## Estimated Effort

| Task | Time |
|------|------|
| Code updates | 30 minutes |
| Documentation | 30 minutes |
| Testing | 30 minutes |
| Re-indexing | ~5-10 minutes (depends on memory file count) |
| **Total** | ~1.5-2 hours |

---

## Decision Points

### Q1: Change default model now or wait for testing?
**Recommendation**: Update code to support Voyage 4, but test before changing default.

### Q2: Update Narsil to use Voyage 4?
**Recommendation**: No. Keep `voyage-code-2` until Voyage releases a code-specific V4 model.

### Q3: Use asymmetric retrieval?
**Recommendation**: Document as optional optimization. Default to symmetric (same model for docs and queries).
