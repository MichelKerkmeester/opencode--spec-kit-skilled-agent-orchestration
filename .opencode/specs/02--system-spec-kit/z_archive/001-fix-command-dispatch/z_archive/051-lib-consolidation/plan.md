---
title: "Implementation Plan: Lib Consolidation [051-lib-consolidation/plan]"
description: "mkdir -p .opencode/skill/system-spec-kit/lib"
trigger_phrases:
  - "implementation"
  - "plan"
  - "lib"
  - "consolidation"
  - "051"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Lib Consolidation

## Metadata
- **Created:** 2024-12-31
- **Level:** 3
- **Estimated Effort:** 1-2 days

## Phase 1: Create Shared Lib Directory Structure

### 1.1 Create Directory
```bash
mkdir -p .opencode/skill/system-spec-kit/lib
```

### 1.2 Create README
Document the purpose and contents of the shared lib folder:
- Purpose: Modules shared between CLI scripts and MCP server
- Guidelines: What belongs here vs domain-specific folders
- Import patterns: How to import from this folder

## Phase 2: Extract and Move Shared Modules

### 2.1 Move embeddings.js
**Source:** `.opencode/skill/system-spec-kit/mcp_server/shared/embeddings.js`
**Target:** `.opencode/skill/system-spec-kit/shared/embeddings.js`

**Verification:**
- Grep for all imports of embeddings.js
- Ensure no MCP-specific code in the module
- Test embedding generation from both CLI and MCP contexts

### 2.2 Move trigger-extractor.js
**Source:** `.opencode/skill/system-spec-kit/mcp_server/shared/trigger-extractor.js`
**Target:** `.opencode/skill/system-spec-kit/shared/trigger-extractor.js`

**Verification:**
- Grep for all imports
- Ensure no MCP-specific dependencies
- Test trigger extraction functionality

### 2.3 Create Lightweight retry-utils.js
**Purpose:** Base retry utilities without vector-index dependency

**Extract from:** `mcp_server/shared/retry-manager.js`

**Include:**
- `sleep()` function
- `retryWithBackoff()` base implementation
- Configuration constants (MAX_RETRIES, etc.)

**Exclude:**
- Any imports from vector-index.js
- MCP-specific error handling
- Database transaction retry logic

**Verification:**
- New file has zero imports from vector-index.js
- CLI scripts can use retry-utils without loading vector-index
- MCP retry-manager can import from retry-utils for shared logic

## Phase 3: Update All Import Paths

### 3.1 Update scripts/generate-context.js
Change imports from:
```javascript
// Before
const { embeddings } = require('./shared/embeddings');
// or
const { embeddings } = require('../mcp_server/shared/embeddings');

// After
const { embeddings } = require('../shared/embeddings');
```

### 3.2 Update scripts/shared/*.js
- Remove re-export patterns that pull in mcp_server modules
- Update to import from shared lib
- Delete any now-empty wrapper files

### 3.3 Update mcp_server/context-server.js
Change imports to use shared lib where appropriate:
```javascript
// Before
const { EmbeddingService } = require('./shared/embeddings');

// After
const { EmbeddingService } = require('../shared/embeddings');
```

### 3.4 Update mcp_server/shared/vector-index.js
- Update imports for shared modules
- Keep vector-index.js in mcp_server/lib (not shared)

### 3.5 Update mcp_server/shared/retry-manager.js
- Import base utilities from `../shared/retry-utils.js`
- Keep MCP-specific retry logic in place

## Phase 4: Update Documentation

### 4.1 Create lib/README.md
Contents:
- Purpose of shared lib folder
- List of modules and their functions
- Import guidelines
- Ownership rules (what belongs here vs elsewhere)

### 4.2 Update scripts/shared/README.md
- Remove references to moved modules
- Update architecture diagram
- Clarify what remains CLI-specific

### 4.3 Update mcp_server/shared/README.md
- Remove references to moved modules
- Update to reflect multi-provider embedding system
- Clarify what remains MCP-specific
- Document dependency on shared lib

### 4.4 Update system-spec-kit README.md
- Add section about shared lib
- Update architecture overview
- Document import patterns

## Phase 5: Verification and Testing

### 5.1 Static Analysis
```bash
# Check for circular dependencies
npx madge --circular .opencode/skill/system-spec-kit/

# Verify no remaining cross-folder imports
grep -r "../../scripts/lib" .opencode/skill/system-spec-kit/mcp_server/
grep -r "../../mcp_server/lib" .opencode/skill/system-spec-kit/scripts/
```

### 5.2 CLI Script Testing
```bash
# Test generate-context.js loads without vector-index
node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js')"

# Verify vector-index.js NOT loaded
node --print "Object.keys(require.cache).filter(k => k.includes('vector-index'))"
```

### 5.3 MCP Server Testing
```bash
# Test server loads correctly
node -e "require('./.opencode/skill/system-spec-kit/mcp_server/context-server'); console.log('OK')"

# Test memory_health via MCP
# Test memory_search via MCP
# Test memory_save via MCP
```

### 5.4 Functional Testing
- Generate context for a spec folder (CLI)
- Search memories (MCP)
- Index a memory file (MCP)
- Verify embeddings work with all providers

## Rollback Plan

If issues discovered post-implementation:

1. **Revert imports** - Git revert the import changes
2. **Delete shared lib** - Remove `.opencode/skill/system-spec-kit/shared/`
3. **Restore re-exports** - Put back wrapper modules in scripts/lib

## Dependencies Between Phases

```
Phase 1 (Structure) 
    ↓
Phase 2 (Move Modules) - Can be done incrementally
    ↓
Phase 3 (Update Imports) - Must follow Phase 2
    ↓
Phase 4 (Documentation) - Can parallelize with Phase 5
    ↓
Phase 5 (Verification) - Must be last
```

## Risk Assessment

| Phase | Risk Level | Notes |
|-------|------------|-------|
| Phase 1 | Low | Just directory creation |
| Phase 2 | Medium | Must preserve all functionality |
| Phase 3 | High | Most likely to introduce bugs |
| Phase 4 | Low | Documentation only |
| Phase 5 | Low | Verification, no changes |

**Highest Risk:** Phase 3 import updates. Mitigate with:
- Comprehensive grep before changes
- Test after each file update
- Keep changes atomic and reversible
