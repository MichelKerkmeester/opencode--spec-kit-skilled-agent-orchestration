---
title: "Lib Consolidation - Shared Module Unification [051-lib-consolidation/spec]"
description: "The system-spec-kit has shared JavaScript modules duplicated or re-exported across two separate lib folders, creating several issues"
trigger_phrases:
  - "lib"
  - "consolidation"
  - "shared"
  - "module"
  - "unification"
  - "spec"
  - "051"
importance_tier: "important"
contextType: "decision"
---
# Lib Consolidation - Shared Module Unification

## Metadata
- **Created:** 2024-12-31
- **Status:** Draft
- **Level:** 3
- **Parent:** 003-memory-and-spec-kit
- **Estimated LOC:** 500-800

## Problem Statement

The system-spec-kit has shared JavaScript modules duplicated or re-exported across two separate lib folders, creating several issues:

### 1. Heavy Dependency Chain
`scripts/shared/retry-manager.js` re-exports the `mcp_server/shared/` version, pulling the entire 3000+ line `vector-index.js` into CLI scripts that don't need embedding functionality.

### 2. Relative Path Fragility
Cross-folder imports use brittle paths like `../../scripts/shared/` which break easily during refactoring and are difficult to maintain.

### 3. Documentation Drift
READMEs in both lib folders are out of sync with the current multi-provider embedding system (nomic, Voyage AI, transformers).

### 4. Ownership Confusion
Not obvious which folder "owns" which module. Some modules logically belong to both contexts (CLI and MCP server), others are domain-specific.

## Goals

1. **Single source of truth** for truly shared modules
2. **Clean imports** with stable, predictable paths
3. **No heavy transitive dependencies** for CLI scripts
4. **Clear ownership** - obvious where each module lives and why

## Proposed Solution

Create a new shared lib folder at `.opencode/skill/system-spec-kit/shared/` containing only modules needed by both CLI scripts AND MCP server:

```
.opencode/skill/system-spec-kit/
├── lib/                    # NEW: Shared modules
│   ├── embeddings.js       # Multi-provider embedding system
│   ├── trigger-extractor.js # Trigger phrase extraction
│   └── retry-utils.js      # Lightweight retry utilities (no vector-index dep)
├── scripts/
│   └── lib/                # CLI-specific utilities
│       └── (domain-specific modules stay here)
└── mcp_server/
    └── lib/                # MCP-specific utilities
        ├── vector-index.js # Stays here (MCP-specific, 3000+ lines)
        └── retry-manager.js # Full retry manager (uses vector-index)
```

## Scope

### In Scope
- Create new `lib/` directory at system-spec-kit root
- Move `embeddings.js` to shared lib (used by both contexts)
- Move `trigger-extractor.js` to shared lib (used by both contexts)
- Create lightweight `retry-utils.js` (base utilities without vector-index dependency)
- Update all import paths in scripts/ and mcp_server/
- Update documentation (READMEs) to reflect new structure

### Out of Scope
- `vector-index.js` stays in `mcp_server/shared/` (MCP-specific, too large for CLI)
- Full `retry-manager.js` stays in `mcp_server/shared/` (needs vector-index)
- No functional changes to module behavior
- No changes to external API/interface

## Files Affected

### New Files
- `.opencode/skill/system-spec-kit/shared/embeddings.js`
- `.opencode/skill/system-spec-kit/shared/trigger-extractor.js`
- `.opencode/skill/system-spec-kit/shared/retry-utils.js`
- `.opencode/skill/system-spec-kit/shared/README.md`

### Modified Files (Import Updates)
- `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/shared/*.js` (remove re-exports)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- `.opencode/skill/system-spec-kit/mcp_server/shared/vector-index.js`

### Documentation Updates
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/scripts/shared/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/shared/README.md`

## Success Criteria

1. **All tests pass** - Existing functionality preserved
2. **No circular dependencies** - Clean dependency graph
3. **Reduced CLI bundle** - `generate-context.js` doesn't load vector-index.js
4. **Clear ownership** - Each module has one canonical location
5. **Updated documentation** - READMEs accurately describe current structure
6. **Stable imports** - No `../../` paths crossing folder boundaries

## Dependencies

- None external
- Requires careful testing of both CLI and MCP server after changes

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing imports | Medium | High | Comprehensive grep for all import statements |
| Missing edge cases in retry-utils | Low | Medium | Extract only proven, tested functionality |
| Documentation gaps | Low | Low | Update all READMEs in same PR |
