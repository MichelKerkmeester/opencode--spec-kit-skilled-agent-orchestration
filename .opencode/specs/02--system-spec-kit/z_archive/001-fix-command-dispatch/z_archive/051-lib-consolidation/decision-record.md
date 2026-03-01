---
title: "Decision Record: Lib Consolidation [051-lib-consolidation/decision-record]"
description: "This document captures the architectural decisions made for consolidating shared JavaScript modules in the system-spec-kit skill. The consolidation addresses code duplication, i..."
trigger_phrases:
  - "decision"
  - "record"
  - "lib"
  - "consolidation"
  - "decision record"
  - "051"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Lib Consolidation

## Overview

This document captures the architectural decisions made for consolidating shared JavaScript modules in the system-spec-kit skill. The consolidation addresses code duplication, import fragility, and heavy dependency chains between CLI scripts and the MCP server.

**Document Status:** Proposed  
**Created:** 2024-12-31  
**Last Updated:** 2024-12-31

---

## ADR-001: Shared Library Location

**Status:** Proposed  
**Date:** 2024-12-31  
**Decision Makers:** Development Team

### Context

The system-spec-kit currently has two separate `lib/` folders:
- `.opencode/skill/system-spec-kit/scripts/shared/` - CLI script utilities
- `.opencode/skill/system-spec-kit/mcp_server/shared/` - MCP server utilities

Both folders contain modules that are used by *both* contexts (CLI and MCP), leading to:
1. Re-export patterns with brittle relative paths (`../../scripts/shared/embeddings.js`)
2. Confusion about which folder "owns" which module
3. Documentation drift between the two locations
4. No clear single source of truth for shared code

### Decision

Create a new shared library at `.opencode/skill/system-spec-kit/shared/` at the skill root level, containing only modules genuinely needed by both CLI scripts AND the MCP server.

**Resulting structure:**
```
.opencode/skill/system-spec-kit/
├── lib/                    # NEW: Shared modules (CLI + MCP)
│   ├── embeddings.js
│   ├── trigger-extractor.js
│   ├── retry-utils.js
│   └── README.md
├── scripts/
│   └── lib/                # CLI-specific utilities only
└── mcp_server/
    └── lib/                # MCP-specific utilities only
        ├── vector-index.js # (3000+ lines, MCP-only)
        └── retry-manager.js
```

### Alternatives Considered

#### Alternative 1: Symlinks
Create symbolic links from one lib folder to another.

**Pros:**
- No file duplication
- Single edit updates both locations
- Zero code changes needed

**Cons:**
- Symlinks are fragile across platforms (especially Windows)
- Git handling of symlinks is inconsistent
- IDE/editor support varies
- Debugging becomes confusing (which file am I actually in?)
- Doesn't solve the ownership confusion problem

#### Alternative 2: Package.json Exports Only
Use Node.js package exports to expose modules from a single location.

**Pros:**
- Modern Node.js approach
- Clean import paths (`require('system-spec-kit/embeddings')`)
- No structural changes needed

**Cons:**
- Requires Node.js 12.7+ (though this is not a blocker)
- Adds complexity to package.json
- Still doesn't clarify ownership
- Re-export wrappers would still exist
- Import paths would differ from file paths (debugging friction)

#### Alternative 3: Keep Current Re-export Pattern
Maintain the status quo with `module.exports = require('../../other/shared/module.js')`.

**Pros:**
- No changes required
- "Works" currently

**Cons:**
- Brittle relative paths break during refactoring
- Heavy dependency chain: `scripts/shared/retry-manager.js` pulls in entire `vector-index.js` (3000+ lines)
- Ownership confusion persists
- Documentation remains fragmented
- Technical debt accumulates

### Consequences

**Positive:**
- Single source of truth for shared modules
- Clear ownership: shared → `lib/`, CLI-only → `scripts/shared/`, MCP-only → `mcp_server/shared/`
- Stable import paths from both contexts (`../shared/module.js`)
- Reduced documentation maintenance (one README for shared modules)
- Foundation for future modularization

**Negative:**
- One-time migration effort required
- All import paths in affected files must be updated
- Temporary duplication during transition period

**Risks:**
- Import path updates may miss edge cases → Mitigated by comprehensive grep and testing
- Future developers may add to wrong folder → Mitigated by clear README guidelines

---

## ADR-002: Which Modules to Share

**Status:** Proposed  
**Date:** 2024-12-31  
**Decision Makers:** Development Team

### Context

Not all modules in the existing lib folders are truly shared. Some are domain-specific:
- `vector-index.js` (3000+ lines) - MCP-only, heavy SQLite/vector operations
- Various CLI helpers - generate-context specific utilities

We need criteria to determine what belongs in the shared lib vs. domain-specific folders.

### Decision

Share these modules in the new `lib/` folder:

| Module | Size | Reason for Sharing |
|--------|------|-------------------|
| `embeddings.js` | ~380 lines | Used by both CLI (generate-context) and MCP (indexing) |
| `trigger-extractor.js` | ~830 lines | Used by both CLI and MCP for phrase extraction |
| `retry-utils.js` | ~50 lines (new) | Base retry utilities needed by both contexts |

**Sharing criteria applied:**
1. ✅ Used by both CLI scripts AND MCP server
2. ✅ No heavy dependencies that would bloat CLI scripts
3. ✅ Stable API unlikely to diverge between contexts
4. ✅ No platform-specific code

### Alternatives Considered

#### Alternative 1: Share Everything
Move all lib modules to the shared folder.

**Pros:**
- Simplest mental model (one lib folder)
- No decisions about what goes where

**Cons:**
- `vector-index.js` (3000+ lines) would be loaded by CLI scripts that don't need it
- Violates principle of minimal dependencies
- CLI script startup time would increase significantly
- Memory footprint bloat for simple scripts

#### Alternative 2: Share Nothing (Keep Re-exports)
Keep modules in their current locations, maintain re-export wrappers.

**Pros:**
- No migration work
- Status quo maintained

**Cons:**
- Heavy dependency chain persists (`scripts/shared/retry-manager.js` → `mcp_server/shared/retry-manager.js` → `vector-index.js`)
- Ownership confusion remains
- Brittle import paths continue to cause maintenance burden
- CLI scripts unnecessarily load 3000+ lines of vector-index code

### Consequences

**Positive:**
- CLI scripts remain lightweight (no vector-index dependency)
- Clear criteria for future module placement
- Each folder has a defined purpose

**Negative:**
- Some modules remain in domain-specific folders
- Developers must check criteria when adding new modules

**Risks:**
- Criteria may need refinement as patterns emerge → Document and update as needed

---

## ADR-003: Retry-Manager Split

**Status:** Proposed  
**Date:** 2024-12-31  
**Decision Makers:** Development Team

### Context

The current `retry-manager.js` in `mcp_server/shared/` provides:
1. Base retry utilities (sleep, exponential backoff, constants)
2. MCP-specific retry logic (database transactions, vector index operations)

The problem: `scripts/shared/retry-manager.js` re-exports the MCP version:
```javascript
module.exports = require('../../mcp_server/shared/retry-manager.js');
```

This causes CLI scripts to load `vector-index.js` (3000+ lines) transitively, even when they only need basic retry logic.

**Dependency chain:**
```
scripts/shared/retry-manager.js
  → mcp_server/shared/retry-manager.js (line 15)
    → ./vector-index.js (line 15)
      → better-sqlite3, @anthropic-ai/sdk, etc.
```

### Decision

Split retry functionality into two modules:

1. **`lib/retry-utils.js`** (NEW - ~50 lines) - Lightweight shared utilities:
   - `sleep(ms)` function
   - `retryWithBackoff(fn, options)` base implementation
   - Configuration constants (`MAX_RETRIES`, `BACKOFF_DELAYS`)
   - Zero external dependencies

2. **`mcp_server/shared/retry-manager.js`** (EXISTING - ~440 lines) - Full MCP retry manager:
   - Imports from `../shared/retry-utils.js` for base utilities
   - Database-aware retry logic
   - Vector index integration
   - Queue management

### Alternatives Considered

#### Alternative 1: Keep Single Implementation
Maintain one retry-manager with all functionality.

**Pros:**
- Single file to maintain
- No API surface duplication

**Cons:**
- CLI scripts continue to load heavy dependencies
- Cannot use retry logic without vector-index
- Violates single responsibility principle
- CLI startup time penalty remains

#### Alternative 2: Lazy-Load Dependencies
Use dynamic `require()` to load vector-index only when needed.

**Pros:**
- No file splitting needed
- Deferred loading reduces startup time

**Cons:**
- Makes dependency graph unclear
- Harder to test and debug
- Dynamic requires are fragile
- Doesn't solve the conceptual coupling problem
- ESM migration would be problematic

#### Alternative 3: Optional Peer Dependency
Make vector-index an optional dependency, check before use.

**Pros:**
- Flexible at runtime
- Single module with conditional features

**Cons:**
- Runtime checks add complexity
- Error-prone (what if check is missed?)
- TypeScript/JSDoc types become complicated
- Unclear which features work in which context

### Consequences

**Positive:**
- CLI scripts can use retry logic without loading vector-index
- Clear separation of concerns (base utils vs. MCP-specific)
- Easier testing of base utilities in isolation
- Reduced memory footprint for CLI scripts
- Foundation for future MCP server modularization

**Negative:**
- Two files to maintain instead of one
- Must keep shared constants in sync
- Slight increase in total code lines

**Risks:**
- API drift between retry-utils and retry-manager → Mitigated by importing from retry-utils in retry-manager
- Incomplete extraction of shared logic → Mitigated by starting minimal, extending as needed

---

## ADR-004: Import Path Strategy

**Status:** Proposed  
**Date:** 2024-12-31  
**Decision Makers:** Development Team

### Context

After moving modules to the shared `lib/` folder, all consuming files need updated import paths. We need a consistent strategy that:
1. Works from both scripts/ and mcp_server/ contexts
2. Is maintainable and predictable
3. Doesn't rely on fragile path gymnastics

### Decision

Use relative paths from each context to the shared lib folder:

**From scripts (e.g., `scripts/generate-context.js`):**
```javascript
const { generateEmbedding } = require('../shared/embeddings');
const { extractTriggerPhrases } = require('../shared/trigger-extractor');
const { retryWithBackoff } = require('../shared/retry-utils');
```

**From mcp_server (e.g., `mcp_server/context-server.js`):**
```javascript
const { generateEmbedding } = require('../shared/embeddings');
const { extractTriggerPhrases } = require('../shared/trigger-extractor');
```

**From mcp_server/lib (e.g., `mcp_server/shared/retry-manager.js`):**
```javascript
const { BACKOFF_DELAYS, MAX_RETRIES } = require('../../shared/retry-utils');
```

**Pattern:**
- Shared modules: `../shared/` or `../../shared/` (depending on nesting depth)
- No `../../scripts/shared/` or `../../mcp_server/shared/` cross-references

### Alternatives Considered

#### Alternative 1: Absolute Paths via Module Resolution
Configure Node.js module resolution to allow absolute imports.

**Pros:**
- Clean import syntax (`require('system-spec-kit/shared/embeddings')`)
- No relative path counting
- Consistent across all files

**Cons:**
- Requires package.json `exports` configuration
- Adds build/config complexity
- Different from standard Node.js patterns used elsewhere in codebase
- IDE support may vary
- Debugging shows different paths than imports

#### Alternative 2: Path Aliases (tsconfig/jsconfig)
Use TypeScript/JavaScript config path aliases.

**Pros:**
- Familiar to TypeScript developers
- IDE autocomplete support

**Cons:**
- Project uses plain JavaScript (no tsconfig)
- Would require adding jsconfig.json
- Adds tooling dependency
- Runtime still needs relative paths (or a resolver)

#### Alternative 3: Environment Variable for Base Path
Use `process.env.SPEC_KIT_ROOT` + path joining.

**Pros:**
- Absolute paths work from anywhere
- Easy to reconfigure

**Cons:**
- Requires environment setup
- Fragile if env not set
- Non-standard pattern
- Makes code harder to understand

### Consequences

**Positive:**
- Standard Node.js require patterns
- No tooling configuration needed
- Works with all IDEs out of the box
- Predictable path from any location
- No cross-folder `../../scripts/shared/` or `../../mcp_server/shared/` paths

**Negative:**
- Must count `../` correctly
- Deep nesting requires more `../` segments

**Risks:**
- Developers may add incorrect paths → Mitigated by linting rule or grep check in CI
- Refactoring folders changes paths → Mitigated by shared lib being stable location

---

## ADR-005: Backward Compatibility

**Status:** Proposed  
**Date:** 2024-12-31  
**Decision Makers:** Development Team

### Context

Existing code depends on the current module locations:
- `scripts/shared/embeddings.js` (re-export)
- `scripts/shared/retry-manager.js` (re-export)
- `mcp_server/shared/embeddings.js` (re-export)
- `mcp_server/shared/trigger-extractor.js` (re-export)

Abrupt removal would break any code importing from these locations.

### Decision

Keep re-export wrappers in original locations during a transition period, with deprecation notices.

**Transition approach:**

1. **Phase 1 (Immediate):** Add modules to new `lib/` folder. Keep re-exports in original locations pointing to NEW shared lib.

   ```javascript
   // scripts/shared/embeddings.js (updated re-export)
   /**
    * @deprecated Import from '../shared/embeddings.js' instead
    * This re-export wrapper will be removed in a future version.
    */
   console.warn('[DEPRECATED] Import embeddings from lib/embeddings.js, not scripts/shared/');
   module.exports = require('../../shared/embeddings');
   ```

2. **Phase 2 (1-2 weeks):** Update all internal imports to use new paths. Verify no warnings in normal operation.

3. **Phase 3 (1 month):** Remove re-export wrappers. Any remaining imports will fail immediately with clear error.

**Deprecation timeline:**
| Phase | Duration | Action |
|-------|----------|--------|
| Phase 1 | Immediate | Add deprecation warnings |
| Phase 2 | 1-2 weeks | Update internal imports |
| Phase 3 | 1 month | Remove wrappers |

### Migration Guide

For consumers updating their code:

**Before (deprecated):**
```javascript
// From scripts/
const { generateEmbedding } = require('./shared/embeddings');

// From mcp_server/
const { generateEmbedding } = require('./shared/embeddings');
```

**After (new):**
```javascript
// From scripts/
const { generateEmbedding } = require('../shared/embeddings');

// From mcp_server/
const { generateEmbedding } = require('../shared/embeddings');
```

**Verification command:**
```bash
# Find deprecated import patterns
grep -r "scripts/shared/embeddings\|scripts/shared/retry-manager\|mcp_server/shared/embeddings\|mcp_server/shared/trigger-extractor" \
  --include="*.js" .opencode/skill/system-spec-kit/
```

### Alternatives Considered

#### Alternative 1: Immediate Breaking Change
Remove old re-exports immediately, update all imports in one PR.

**Pros:**
- Clean cut, no transition period
- No deprecated code to maintain
- Faster completion

**Cons:**
- Higher risk of missed imports
- No gradual rollout
- External consumers (if any) would break
- Harder to debug if issues arise

#### Alternative 2: Permanent Re-exports
Keep re-export wrappers indefinitely for compatibility.

**Pros:**
- Maximum compatibility
- No breaking changes ever

**Cons:**
- Permanent maintenance burden
- Confusing dual import paths
- Documentation must explain both patterns
- Encourages use of deprecated paths
- Technical debt never resolved

#### Alternative 3: Symlinks Instead of Re-exports
Replace re-export files with symbolic links.

**Pros:**
- Zero-overhead forwarding
- No console warnings needed

**Cons:**
- Symlinks have platform issues (see ADR-001)
- Can't add deprecation warnings
- Less explicit than re-export pattern

### Consequences

**Positive:**
- Smooth transition for all consumers
- Clear deprecation warnings guide migration
- Time to discover edge cases before removal
- Final state has no technical debt

**Negative:**
- Temporary code duplication during transition
- Console warnings may be noisy
- Requires remembering to complete Phase 3

**Risks:**
- Phase 3 never happens (perpetual deprecation) → Mitigated by creating tracking issue with due date
- Warnings ignored → Mitigated by failing tests if warnings appear in CI

---

## Summary Matrix

| ADR | Decision | Key Benefit | Primary Risk |
|-----|----------|-------------|--------------|
| 001 | Shared `lib/` at skill root | Single source of truth | Migration effort |
| 002 | Share embeddings, trigger-extractor, retry-utils | Lightweight CLI scripts | Module placement criteria |
| 003 | Split retry-manager → retry-utils + retry-manager | No vector-index in CLI | Two files to maintain |
| 004 | Relative paths (`../shared/`) | Standard Node.js patterns | Path counting errors |
| 005 | Transitional re-exports with deprecation | Smooth migration | Phase 3 completion |

---

## Appendix: Current Module Analysis

### embeddings.js

**Location:** Currently canonical in `scripts/shared/embeddings.js`, re-exported from `mcp_server/shared/`  
**Size:** ~378 lines  
**Dependencies:** `./embeddings/factory.js`, `./embeddings-legacy.js`  
**Used by:** CLI (generate-context), MCP (vector-index, context-server)  
**Decision:** Move to shared lib ✅

### trigger-extractor.js

**Location:** Currently canonical in `scripts/shared/trigger-extractor.js`, re-exported from `mcp_server/shared/`  
**Size:** ~830 lines  
**Dependencies:** None (self-contained NLP logic)  
**Used by:** CLI (generate-context), MCP (memory indexing)  
**Decision:** Move to shared lib ✅

### retry-manager.js

**Location:** Canonical in `mcp_server/shared/retry-manager.js`, re-exported from `scripts/shared/`  
**Size:** ~438 lines  
**Dependencies:** `./vector-index.js`, `./embeddings.js`  
**Used by:** MCP (retry queue processing)  
**Decision:** Keep in mcp_server, extract base utilities to shared retry-utils.js ✅

### vector-index.js

**Location:** `mcp_server/shared/vector-index.js`  
**Size:** ~3000+ lines  
**Dependencies:** better-sqlite3, sqlite-vec, embeddings  
**Used by:** MCP only  
**Decision:** Keep in mcp_server/lib ✅ (too heavy for CLI)

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| 2024-12-31 | 1.0 | Initial decision record created |
