---
title: "Decision Record: generate-context.js Modularization [058-generate-context-modularization/decision-record]"
description: "The script contains 84 functions across 18 sections. We need to decide how to organize these into modules."
trigger_phrases:
  - "decision"
  - "record"
  - "generate"
  - "context"
  - "modularization"
  - "decision record"
  - "058"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: generate-context.js Modularization

## ADR-001: Module Organization Strategy

### Context
The script contains 84 functions across 18 sections. We need to decide how to organize these into modules.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. By Section | Mirror existing 18 sections as modules | Familiar, easy mapping | Too many small files |
| B. By Function Type | Group by purpose (extractors, renderers, utils) | Clear boundaries, intuitive | Requires careful dependency analysis |
| C. By Data Flow | Group by pipeline stage | Matches execution flow | Harder to maintain |
| D. Minimal | Only extract largest sections | Less disruption | Doesn't solve root problem |

### Decision
**Option B: By Function Type**

Organize into 5 module groups:
- `utils/` - Pure utilities (logging, paths, validation, normalization, prompts)
- `extractors/` - Data extraction (conversations, decisions, diagrams, files, phases, sessions)
- `renderers/` - Output generation (template rendering)
- `spec-folder/` - Spec folder handling (detection, alignment, setup)
- `core/` - Orchestration (config, workflow)

### Rationale
- Clear separation of concerns
- Each group has single responsibility
- Matches mental model of what the script does
- Enables independent testing
- 5-6 files per group is manageable

### Consequences
- Need to carefully map which functions go where
- Some functions may need refactoring to fit cleanly
- Import statements will be more explicit

---

## ADR-002: Handling Existing lib/ Modules

### Context
10 modules already exist in `scripts/lib/`. Should they be reorganized into the new structure?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Keep Unchanged | Leave lib/ as-is | No risk, less work | Inconsistent structure |
| B. Merge into New | Move into extractors/utils/etc | Consistent structure | High risk, much work |
| C. Rename to legacy/ | Clearly mark as old | Clear distinction | Confusing naming |

### Decision
**Option A: Keep Unchanged**

Leave the existing `lib/` modules exactly as they are:
- content-filter.js
- semantic-summarizer.js
- anchor-generator.js
- embeddings.js
- retry-manager.js
- simulation-factory.js
- ascii-boxes.js
- flowchart-generator.js
- opencode-capture.js
- trigger-extractor.js

### Rationale
- These modules are stable and tested
- Risk of breaking working code is not justified
- They already follow good module practices
- Can be reorganized later if needed
- Refactoring should focus on the 74 inline functions, not working modules

### Consequences
- Two patterns coexist (lib/ and new folders)
- New code should prefer new structure
- Document that lib/ is "legacy" but stable

---

## ADR-003: Import/Export Strategy

### Context
Need to decide how modules expose their functions and how consumers import them.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Default Exports | `module.exports = fn` | Simple | Can't export multiple |
| B. Named Exports | `module.exports = { fn1, fn2 }` | Multiple exports, clear | Verbose imports |
| C. Index Re-exports | Named exports + index.js | Clean imports, discoverable | Extra files |
| D. ES Modules | `export { fn1 }` | Modern standard | Requires changes |

### Decision
**Option C: Index Re-exports**

Each folder has an `index.js` that re-exports all public functions:

```javascript
// extractors/index.js
module.exports = {
  ...require('./conversation-extractor'),
  ...require('./decision-extractor'),
  // etc.
};

// Usage
const { extractConversations, extractDecisions } = require('./extractors');
```

### Rationale
- Clean import statements
- Easy to discover available functions
- Single import per module group
- Standard Node.js pattern
- No tooling changes required

### Consequences
- Need to create index.js for each folder
- Must keep index.js in sync when adding functions
- Slightly more files

---

## ADR-004: Error Handling Approach

### Context
Current script has inconsistent error handling - some try/catch, some structuredLog, some console.error.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Keep As-Is | Don't change error handling | No risk | Inconsistent |
| B. Centralize | All errors through structuredLog | Consistent, parseable | Requires changes |
| C. Custom Error Classes | Typed errors with hierarchy | Rich error info | Over-engineering |
| D. Error Middleware | Wrapper that catches all | Clean separation | Architectural change |

### Decision
**Option B: Centralize via structuredLog**

All error handling should use the `structuredLog` function from `utils/logger.js`:

```javascript
try {
  // operation
} catch (err) {
  structuredLog('error', 'Operation failed', { error: err.message, context: {} });
  throw err; // or handle appropriately
}
```

### Rationale
- Already exists in the codebase
- Produces parseable JSON logs
- Minimal change from current pattern
- Consistent error format aids debugging

### Consequences
- Need to update some error handling during extraction
- This is a minor functional change (logging format only)
- Benefits outweigh the small risk

---

## ADR-005: Testing Strategy

### Context
No existing unit tests. Need to ensure refactoring doesn't break functionality.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Unit Tests First | Write tests for all functions before refactoring | High confidence | Weeks of work |
| B. Snapshot Tests | Compare output before/after | Fast to implement, catches regressions | Doesn't test internals |
| C. Integration Tests | Test end-to-end workflow | Tests real behavior | Slower, coarse-grained |
| D. No Tests | Trust careful refactoring | Fast | Risky |

### Decision
**Option B: Snapshot Tests (Primary) + Option C: Integration Tests (Secondary)**

1. **Before refactoring**: Generate baseline outputs from representative fixtures
2. **After each phase**: Compare output to baselines
3. **Integration**: Test MCP notification, file creation, user prompts

### Rationale
- Snapshot tests catch any output changes immediately
- Fast to implement (hours, not weeks)
- Output is what matters - if output is identical, internals are working
- Integration tests catch system-level issues
- Unit tests can be added later to individual modules

### Consequences
- Need to create test fixtures
- Need to maintain baselines if intentional changes are made
- May miss internal bugs that don't affect output (acceptable)

---

## ADR-006: Path Resolution After Restructure

### Context
Script loads templates and creates files using relative paths. After restructure, these paths need to work from new locations.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. __dirname | Use __dirname in each module | Works everywhere | Scattered path logic |
| B. Centralized Config | All paths in core/config.js | Single source of truth | Requires import |
| C. Environment Variables | Paths via env vars | Configurable | Adds complexity |
| D. Path from Entry | Calculate all paths from CLI entry | Clear root | Breaks if modules used standalone |

### Decision
**Option B: Centralized Config**

All path constants defined in `core/config.js`:

```javascript
// core/config.js
const path = require('path');
const SCRIPT_ROOT = path.dirname(__dirname); // scripts/
const TEMPLATE_DIR = path.join(SCRIPT_ROOT, '..', 'templates');
const SPECS_DIR = path.join(process.cwd(), 'specs');

module.exports = {
  SCRIPT_ROOT,
  TEMPLATE_DIR,
  SPECS_DIR,
  // etc.
};
```

### Rationale
- Single source of truth for all paths
- Easy to understand and modify
- Modules don't need to know their location
- Works regardless of where modules are imported from

### Consequences
- All modules that need paths must import config
- Path changes only need updating in one place
- Makes the path logic explicit and documented

---

## Decision Log

| ADR | Decision | Date | Status |
|-----|----------|------|--------|
| ADR-001 | Module Organization: By Function Type | 2026-01-01 | Approved |
| ADR-002 | Keep lib/ Unchanged | 2026-01-01 | Approved |
| ADR-003 | Index Re-exports | 2026-01-01 | Approved |
| ADR-004 | Centralize Error Handling | 2026-01-01 | Approved |
| ADR-005 | Snapshot + Integration Tests | 2026-01-01 | Approved |
| ADR-006 | Centralized Config for Paths | 2026-01-01 | Approved |
