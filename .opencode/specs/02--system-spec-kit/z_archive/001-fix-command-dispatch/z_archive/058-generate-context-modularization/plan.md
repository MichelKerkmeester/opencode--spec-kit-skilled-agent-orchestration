---
title: "Implementation Plan: generate-context.js Modularization [058-generate-context-modularization/plan]"
description: "Strategy: Incremental extraction with validation between each phase"
trigger_phrases:
  - "implementation"
  - "plan"
  - "generate"
  - "context"
  - "modularization"
  - "058"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: generate-context.js Modularization

## Approach Summary

**Strategy**: Incremental extraction with validation between each phase

**Key Principle**: Extract lowest-risk modules first, validate, then proceed to higher-risk modules. Never proceed to next phase until current phase is fully validated.

**Estimated Effort**: 4-6 focused sessions

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: PREPARATION                                                        │
│ Create snapshot tests, map dependencies, establish baseline                 │
│ Risk: None | Effort: 1 session                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: UTILITY EXTRACTION                                                 │
│ Extract pure utility functions (logger, paths, validation)                  │
│ Risk: Low | Effort: 0.5 session                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: NORMALIZERS & PROMPTS                                              │
│ Extract input normalization and user interaction utilities                  │
│ Risk: Low | Effort: 0.5 session                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: EXTRACTORS                                                         │
│ Extract data extraction modules (conversations, decisions, diagrams, etc.)  │
│ Risk: Medium-High | Effort: 1-2 sessions                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: RENDERERS                                                          │
│ Extract template rendering logic                                            │
│ Risk: Medium | Effort: 0.5 session                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: SPEC FOLDER HANDLING                                               │
│ Extract spec folder detection, alignment, and setup                         │
│ Risk: Medium | Effort: 0.5 session                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 7: CORE ORCHESTRATION                                                 │
│ Extract config and workflow, reduce CLI to entry point                      │
│ Risk: High | Effort: 1 session                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 8: CLEANUP & VALIDATION                                               │
│ Final testing, documentation, performance verification                      │
│ Risk: Low | Effort: 0.5 session                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Preparation

**Goal**: Establish baseline and testing infrastructure before any code changes

### 1.1 Create Snapshot Test Fixtures

1. Identify 3-5 representative conversation data samples:
   - Simple session (few messages, no decisions)
   - Complex session (many messages, decisions, diagrams)
   - Edge case (empty/minimal data)
   - Real production data (anonymized if needed)

2. Generate baseline output for each sample:
   ```bash
   node generate-context.js fixture-1.json > baseline-1.md
   node generate-context.js fixture-2.json > baseline-2.md
   # etc.
   ```

3. Create comparison script:
   ```bash
   # scripts/test-snapshot.sh
   diff baseline-1.md output-1.md || exit 1
   ```

### 1.2 Map Function Dependencies

1. Extract all function names:
   ```bash
   grep -n "^function \|^async function " generate-context.js
   ```

2. For each function, identify:
   - What functions it calls
   - What global state it accesses
   - What it exports/returns

3. Create dependency matrix (spreadsheet or diagram)

### 1.3 Document Current Behavior

1. Document all edge cases handled
2. Document error handling patterns
3. Document configuration options

### 1.4 Create Feature Branch

```bash
git checkout -b refactor/generate-context-modularization
```

**Exit Criteria**:
- [ ] Snapshot tests created and passing
- [ ] Dependency graph documented
- [ ] Feature branch created

---

## Phase 2: Utility Extraction

**Goal**: Extract pure utility functions with no business logic dependencies

### 2.1 Create utils/logger.js

Extract from section 2 (STRUCTURED LOGGING UTILITY):
- `structuredLog(level, message, data)`

```javascript
// utils/logger.js
'use strict';

function structuredLog(level, message, data = {}) {
  // ... existing implementation
}

module.exports = { structuredLog };
```

### 2.2 Create utils/path-utils.js

Extract from section 3 (PATH SANITIZATION UTILITY):
- `sanitizePath(inputPath, allowedBases)`
- `getPathBasename(p)` (from MAIN WORKFLOW HELPERS)

### 2.3 Create utils/data-validator.js

Extract from section 16 (DATA VALIDATION HELPERS):
- All validation helper functions

### 2.4 Create utils/index.js

```javascript
// utils/index.js
module.exports = {
  ...require('./logger'),
  ...require('./path-utils'),
  ...require('./data-validator')
};
```

### 2.5 Update Imports in generate-context.js

Replace inline functions with imports:
```javascript
const { structuredLog, sanitizePath } = require('./utils');
```

### 2.6 Validate

- Run snapshot tests
- Verify no functional changes

**Exit Criteria**:
- [ ] utils/logger.js created
- [ ] utils/path-utils.js created
- [ ] utils/data-validator.js created
- [ ] utils/index.js created
- [ ] generate-context.js updated to use imports
- [ ] Snapshot tests passing

---

## Phase 3: Normalizers & Prompts

**Goal**: Extract input normalization and user interaction utilities

### 3.1 Create utils/input-normalizer.js

Extract from section 14 (INPUT NORMALIZATION HELPERS):
- All normalization functions (~432 lines)

### 3.2 Create utils/prompt-utils.js

Extract from MAIN WORKFLOW HELPERS:
- `promptUser(question, defaultValue, requireInteractive)`
- `promptUserChoice(question, maxChoice, maxAttempts, requireInteractive)`
- `requireInteractiveMode(operation)`

### 3.3 Update utils/index.js

Add new exports.

### 3.4 Update Imports in generate-context.js

### 3.5 Validate

**Exit Criteria**:
- [ ] utils/input-normalizer.js created
- [ ] utils/prompt-utils.js created
- [ ] utils/index.js updated
- [ ] Snapshot tests passing

---

## Phase 4: Extractors

**Goal**: Extract data extraction modules (HIGHEST RISK PHASE)

### 4.1 Create extractors/conversation-extractor.js

Extract from MAIN WORKFLOW HELPERS:
- `extractConversations(collectedData)` (~200 lines)

### 4.2 Create extractors/decision-extractor.js

Extract from MAIN WORKFLOW HELPERS:
- `extractDecisions(collectedData)` (~300 lines)

### 4.3 Create extractors/diagram-extractor.js

Extract from MAIN WORKFLOW HELPERS:
- `extractDiagrams(collectedData)` (~100 lines)
- `generateDecisionTree(decisionData)` (~140 lines)

### 4.4 Create extractors/file-extractor.js

Extract from MAIN WORKFLOW HELPERS:
- `extractFilesFromData(collectedData, observations)` (~70 lines)
- `enhanceFilesWithSemanticDescriptions(files, semanticFileChanges)` (~50 lines)
- `buildObservationsWithAnchors(observations, specFolder)` (~40 lines)

### 4.5 Create extractors/phase-extractor.js

Extract from MAIN WORKFLOW HELPERS:
- `extractPhasesFromData(collectedData)` (~90 lines)

### 4.6 Create extractors/session-extractor.js

Extract from MAIN WORKFLOW HELPERS:
- `collectSessionData(collectedData, specFolderName)` (~150 lines)
- Related session metadata helpers from section 8

### 4.7 Create extractors/index.js

### 4.8 Update generate-context.js

### 4.9 Comprehensive Validation

**CRITICAL**: Run ALL snapshot tests. This phase has highest regression risk.

**Exit Criteria**:
- [ ] All 6 extractor modules created
- [ ] extractors/index.js created
- [ ] All snapshot tests passing
- [ ] No runtime errors on edge cases

---

## Phase 5: Renderers

**Goal**: Extract template rendering logic

### 5.1 Create renderers/template-renderer.js

Extract from MAIN WORKFLOW HELPERS:
- `renderTemplate(template, data, parentData)` (~100 lines)
- `populateTemplate(templateName, data)` (~15 lines)
- `cleanupExcessiveNewlines(text)` (~6 lines)
- `stripTemplateConfigComments(text)` (~20 lines)
- `isFalsy(value)` (~10 lines)

### 5.2 Create renderers/index.js

### 5.3 Update generate-context.js

### 5.4 Validate

**Exit Criteria**:
- [ ] renderers/template-renderer.js created
- [ ] renderers/index.js created
- [ ] Snapshot tests passing

---

## Phase 6: Spec Folder Handling

**Goal**: Extract spec folder detection, alignment validation, and directory setup

### 6.1 Create spec-folder/folder-detector.js

Extract from MAIN WORKFLOW HELPERS:
- `detectSpecFolder(collectedData)` (~200 lines)

### 6.2 Create spec-folder/alignment-validator.js

Extract from MAIN WORKFLOW HELPERS:
- `validateContentAlignment(collectedData, specFolderName, specsDir)` (~90 lines)
- `validateFolderAlignment(collectedData, specFolderName, specsDir)` (~70 lines)
- `calculateAlignmentScore(conversationTopics, specFolderName)` (~20 lines)
- `extractConversationTopics(collectedData)` (~25 lines)
- `parseSpecFolderTopic(folderName)` (~10 lines)

### 6.3 Create spec-folder/directory-setup.js

Extract from MAIN WORKFLOW HELPERS:
- `setupContextDirectory(specFolder)` (~80 lines)

### 6.4 Create spec-folder/index.js

### 6.5 Update generate-context.js

### 6.6 Validate

**Exit Criteria**:
- [ ] All 3 spec-folder modules created
- [ ] spec-folder/index.js created
- [ ] Snapshot tests passing

---

## Phase 7: Core Orchestration

**Goal**: Extract configuration and workflow, reduce generate-context.js to CLI entry point

### 7.1 Create core/config.js

Extract from section 5 (CONFIGURATION):
- All configuration constants
- Path resolution logic
- Template paths

### 7.2 Create core/workflow.js

Extract the main orchestration logic:
- Refactor `main()` into `runWorkflow(options)`
- Clear interface with all dependencies injected

```javascript
// core/workflow.js
async function runWorkflow({
  inputPath,
  specFolder,
  verbose = false
}) {
  // Orchestrate: load → extract → render → save → notify
}
```

### 7.3 Create core/index.js

### 7.4 Refactor generate-context.js to CLI Entry Point

Final state of generate-context.js (~100 lines):
```javascript
#!/usr/bin/env node
'use strict';

// CLI argument parsing
// ...

// Delegate to workflow
const { runWorkflow } = require('./core');

runWorkflow({
  inputPath: args.input,
  specFolder: args.specFolder,
  verbose: args.verbose
}).catch(err => {
  console.error(err);
  process.exit(1);
});
```

### 7.5 Comprehensive Validation

**CRITICAL**: Full regression testing required.

**Exit Criteria**:
- [ ] core/config.js created
- [ ] core/workflow.js created
- [ ] core/index.js created
- [ ] generate-context.js reduced to ~100 lines
- [ ] All snapshot tests passing
- [ ] MCP integration verified

---

## Phase 8: Cleanup & Validation

**Goal**: Final testing, documentation, and performance verification

### 8.1 Cleanup

- Remove any dead code
- Remove excessive comments
- Ensure consistent formatting

### 8.2 Documentation

- Add JSDoc headers to all modules
- Update SKILL.md if needed
- Update any references to the script

### 8.3 Performance Verification

```bash
# Benchmark before
time node generate-context.js fixture-large.json > /dev/null

# Benchmark after (should be same or faster)
time node generate-context.js fixture-large.json > /dev/null
```

### 8.4 Final Validation

- [ ] All snapshot tests passing
- [ ] All edge cases handled
- [ ] MCP integration working
- [ ] Performance acceptable
- [ ] No circular dependencies (verify with madge or similar)

### 8.5 Merge

```bash
git checkout main
git merge refactor/generate-context-modularization
```

**Exit Criteria**:
- [ ] All documentation updated
- [ ] All tests passing
- [ ] Performance verified
- [ ] Merged to main

---

## Rollback Plan

If any phase introduces regressions that can't be quickly fixed:

1. **Immediate**: Revert to previous commit
2. **Short-term**: Cherry-pick successful extractions, revert problematic ones
3. **Long-term**: Original generate-context.js preserved in git history

```bash
# Emergency rollback
git checkout main -- .opencode/skill/system-spec-kit/scripts/generate-context.js
```

---

## Dependencies

| Phase | Depends On |
|-------|------------|
| Phase 2 | Phase 1 |
| Phase 3 | Phase 2 |
| Phase 4 | Phase 3 |
| Phase 5 | Phase 3 |
| Phase 6 | Phase 4, Phase 5 |
| Phase 7 | Phase 4, Phase 5, Phase 6 |
| Phase 8 | Phase 7 |

**Parallel Opportunities**:
- Phase 4 and Phase 5 can run in parallel after Phase 3
- No other parallelization recommended (too risky)

---

## Milestones

| Milestone | Phases | Deliverable |
|-----------|--------|-------------|
| **M1: Foundation** | 1-3 | Utils extracted, tests in place |
| **M2: Data Layer** | 4-5 | Extractors and renderers modularized |
| **M3: Complete** | 6-8 | Full modular architecture |
