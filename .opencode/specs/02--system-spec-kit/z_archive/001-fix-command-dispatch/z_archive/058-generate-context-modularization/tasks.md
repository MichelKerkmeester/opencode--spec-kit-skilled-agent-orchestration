---
title: "Tasks: generate-context.js Modularization [058-generate-context-modularization/tasks]"
description: "Priority: P0"
trigger_phrases:
  - "tasks"
  - "generate"
  - "context"
  - "modularization"
  - "058"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: generate-context.js Modularization

## Task Overview

| Phase | Tasks | Estimated Effort | Priority |
|-------|-------|------------------|----------|
| Phase 1: Preparation | 4 | 1 session | P0 |
| Phase 2: Utility Extraction | 6 | 0.5 session | P0 |
| Phase 3: Normalizers & Prompts | 5 | 0.5 session | P0 |
| Phase 4: Extractors | 9 | 1-2 sessions | P0 |
| Phase 5: Renderers | 4 | 0.5 session | P1 |
| Phase 6: Spec Folder | 5 | 0.5 session | P1 |
| Phase 7: Core Orchestration | 5 | 1 session | P1 |
| Phase 8: Cleanup & Validation | 5 | 0.5 session | P1 |
| **Total** | **43** | **4-6 sessions** | |

---

## Phase 1: Preparation

### Task 1.1: Create Test Fixtures
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: None

- [ ] Identify 3-5 representative conversation data samples
- [ ] Copy/create fixture JSON files in `scripts/test-fixtures/`
- [ ] Document what each fixture tests (simple, complex, edge cases)

**Acceptance Criteria**:
- At least 3 fixture files created
- Each fixture has a documented purpose

### Task 1.2: Generate Baseline Outputs
**Priority**: P0  
**Effort**: 15 min  
**Dependencies**: Task 1.1

- [ ] Run current script against all fixtures
- [ ] Save outputs as baseline-{n}.md
- [ ] Verify baselines are complete and correct

**Acceptance Criteria**:
- Baseline file for each fixture
- No errors during generation

### Task 1.3: Create Snapshot Test Script
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Task 1.2

- [ ] Create `scripts/test-snapshot.sh`
- [ ] Script runs generate-context.js against fixtures
- [ ] Script compares output to baselines
- [ ] Script exits non-zero on differences

**Acceptance Criteria**:
- Script runs successfully
- Script detects intentional changes

### Task 1.4: Map Function Dependencies
**Priority**: P1  
**Effort**: 45 min  
**Dependencies**: None

- [ ] Extract list of all 84 functions
- [ ] Document which functions call which
- [ ] Identify shared state/globals
- [ ] Create dependency diagram or matrix

**Acceptance Criteria**:
- Complete function list
- Dependency relationships documented
- Shared state identified

---

## Phase 2: Utility Extraction

### Task 2.1: Create utils/logger.js
**Priority**: P0  
**Effort**: 10 min  
**Dependencies**: Phase 1

- [ ] Create `scripts/utils/logger.js`
- [ ] Extract `structuredLog` function
- [ ] Add JSDoc header
- [ ] Export function

**Acceptance Criteria**:
- File created
- Function works identically to original

### Task 2.2: Create utils/path-utils.js
**Priority**: P0  
**Effort**: 15 min  
**Dependencies**: Phase 1

- [ ] Create `scripts/utils/path-utils.js`
- [ ] Extract `sanitizePath` function
- [ ] Extract `getPathBasename` function
- [ ] Add JSDoc headers
- [ ] Export functions

**Acceptance Criteria**:
- File created
- Both functions work identically

### Task 2.3: Create utils/data-validator.js
**Priority**: P0  
**Effort**: 20 min  
**Dependencies**: Phase 1

- [ ] Create `scripts/utils/data-validator.js`
- [ ] Extract all validation helper functions from section 16
- [ ] Add JSDoc headers
- [ ] Export functions

**Acceptance Criteria**:
- File created
- All validation functions extracted

### Task 2.4: Create utils/index.js
**Priority**: P0  
**Effort**: 5 min  
**Dependencies**: Tasks 2.1-2.3

- [ ] Create `scripts/utils/index.js`
- [ ] Re-export all utils functions
- [ ] Verify imports work

**Acceptance Criteria**:
- Clean re-export structure
- `require('./utils')` returns all functions

### Task 2.5: Update generate-context.js Imports
**Priority**: P0  
**Effort**: 15 min  
**Dependencies**: Task 2.4

- [ ] Replace inline functions with `require('./utils')`
- [ ] Remove extracted function definitions
- [ ] Update any local references

**Acceptance Criteria**:
- No duplicate function definitions
- Script still runs

### Task 2.6: Validate Phase 2
**Priority**: P0  
**Effort**: 10 min  
**Dependencies**: Task 2.5

- [ ] Run snapshot tests
- [ ] Verify all tests pass
- [ ] Commit changes

**Acceptance Criteria**:
- All snapshot tests pass
- Git commit created

---

## Phase 3: Normalizers & Prompts

### Task 3.1: Create utils/input-normalizer.js
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Phase 2

- [ ] Create `scripts/utils/input-normalizer.js`
- [ ] Extract all functions from section 14
- [ ] Handle any internal dependencies
- [ ] Add JSDoc headers

**Acceptance Criteria**:
- All normalization functions extracted
- No broken internal calls

### Task 3.2: Create utils/prompt-utils.js
**Priority**: P0  
**Effort**: 15 min  
**Dependencies**: Phase 2

- [ ] Create `scripts/utils/prompt-utils.js`
- [ ] Extract `promptUser`, `promptUserChoice`, `requireInteractiveMode`
- [ ] Add JSDoc headers

**Acceptance Criteria**:
- All prompt functions extracted
- Interactive mode handling works

### Task 3.3: Update utils/index.js
**Priority**: P0  
**Effort**: 5 min  
**Dependencies**: Tasks 3.1-3.2

- [ ] Add new exports to index.js
- [ ] Verify imports work

**Acceptance Criteria**:
- All new functions accessible via index

### Task 3.4: Update generate-context.js
**Priority**: P0  
**Effort**: 15 min  
**Dependencies**: Task 3.3

- [ ] Update imports
- [ ] Remove extracted functions
- [ ] Update references

**Acceptance Criteria**:
- Script still runs
- No duplicate definitions

### Task 3.5: Validate Phase 3
**Priority**: P0  
**Effort**: 10 min  
**Dependencies**: Task 3.4

- [ ] Run snapshot tests
- [ ] Run interactive mode test (if applicable)
- [ ] Commit changes

**Acceptance Criteria**:
- All tests pass
- Git commit created

---

## Phase 4: Extractors

### Task 4.1: Create extractors/conversation-extractor.js
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Phase 3

- [ ] Create `scripts/extractors/conversation-extractor.js`
- [ ] Extract `extractConversations` function
- [ ] Handle dependencies on utils/lib
- [ ] Add JSDoc header

**Acceptance Criteria**:
- Function extracted cleanly
- Dependencies properly imported

### Task 4.2: Create extractors/decision-extractor.js
**Priority**: P0  
**Effort**: 45 min  
**Dependencies**: Phase 3

- [ ] Create `scripts/extractors/decision-extractor.js`
- [ ] Extract `extractDecisions` function
- [ ] Handle complex internal logic
- [ ] Add JSDoc header

**Acceptance Criteria**:
- Function extracted cleanly
- Decision extraction works identically

### Task 4.3: Create extractors/diagram-extractor.js
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Phase 3

- [ ] Create `scripts/extractors/diagram-extractor.js`
- [ ] Extract `extractDiagrams` function
- [ ] Extract `generateDecisionTree` function
- [ ] Add JSDoc headers

**Acceptance Criteria**:
- Both functions extracted
- Diagram generation works

### Task 4.4: Create extractors/file-extractor.js
**Priority**: P0  
**Effort**: 25 min  
**Dependencies**: Phase 3

- [ ] Create `scripts/extractors/file-extractor.js`
- [ ] Extract `extractFilesFromData`
- [ ] Extract `enhanceFilesWithSemanticDescriptions`
- [ ] Extract `buildObservationsWithAnchors`

**Acceptance Criteria**:
- All file-related functions extracted
- Semantic enhancement works

### Task 4.5: Create extractors/phase-extractor.js
**Priority**: P0  
**Effort**: 20 min  
**Dependencies**: Phase 3

- [ ] Create `scripts/extractors/phase-extractor.js`
- [ ] Extract `extractPhasesFromData`
- [ ] Add JSDoc header

**Acceptance Criteria**:
- Function extracted cleanly

### Task 4.6: Create extractors/session-extractor.js
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Phase 3

- [ ] Create `scripts/extractors/session-extractor.js`
- [ ] Extract `collectSessionData`
- [ ] Extract related session metadata helpers
- [ ] Add JSDoc headers

**Acceptance Criteria**:
- All session-related functions extracted
- Session data collection works

### Task 4.7: Create extractors/index.js
**Priority**: P0  
**Effort**: 10 min  
**Dependencies**: Tasks 4.1-4.6

- [ ] Create `scripts/extractors/index.js`
- [ ] Re-export all extractor functions
- [ ] Verify imports work

**Acceptance Criteria**:
- Clean re-export structure

### Task 4.8: Update generate-context.js
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Task 4.7

- [ ] Update imports to use extractors
- [ ] Remove extracted functions
- [ ] Update all references

**Acceptance Criteria**:
- Script still runs
- Significant LOC reduction

### Task 4.9: Validate Phase 4 (CRITICAL)
**Priority**: P0  
**Effort**: 30 min  
**Dependencies**: Task 4.8

- [ ] Run ALL snapshot tests
- [ ] Test edge cases manually
- [ ] Verify no regression
- [ ] Commit changes

**Acceptance Criteria**:
- All tests pass
- No functional differences
- Git commit created

---

## Phase 5: Renderers

### Task 5.1: Create renderers/template-renderer.js
**Priority**: P1  
**Effort**: 30 min  
**Dependencies**: Phase 4

- [ ] Create `scripts/renderers/template-renderer.js`
- [ ] Extract `renderTemplate`
- [ ] Extract `populateTemplate`
- [ ] Extract helper functions (`cleanupExcessiveNewlines`, etc.)

**Acceptance Criteria**:
- All rendering functions extracted
- Template rendering works identically

### Task 5.2: Create renderers/index.js
**Priority**: P1  
**Effort**: 5 min  
**Dependencies**: Task 5.1

- [ ] Create `scripts/renderers/index.js`
- [ ] Re-export all renderer functions

**Acceptance Criteria**:
- Clean re-export structure

### Task 5.3: Update generate-context.js
**Priority**: P1  
**Effort**: 15 min  
**Dependencies**: Task 5.2

- [ ] Update imports
- [ ] Remove extracted functions

**Acceptance Criteria**:
- Script still runs

### Task 5.4: Validate Phase 5
**Priority**: P1  
**Effort**: 15 min  
**Dependencies**: Task 5.3

- [ ] Run snapshot tests
- [ ] Verify output formatting correct
- [ ] Commit changes

**Acceptance Criteria**:
- All tests pass
- Git commit created

---

## Phase 6: Spec Folder Handling

### Task 6.1: Create spec-folder/folder-detector.js
**Priority**: P1  
**Effort**: 30 min  
**Dependencies**: Phase 4, Phase 5

- [ ] Create `scripts/spec-folder/folder-detector.js`
- [ ] Extract `detectSpecFolder`
- [ ] Handle user interaction dependencies

**Acceptance Criteria**:
- Folder detection works
- User prompts function correctly

### Task 6.2: Create spec-folder/alignment-validator.js
**Priority**: P1  
**Effort**: 30 min  
**Dependencies**: Phase 4, Phase 5

- [ ] Create `scripts/spec-folder/alignment-validator.js`
- [ ] Extract `validateContentAlignment`
- [ ] Extract `validateFolderAlignment`
- [ ] Extract alignment helper functions

**Acceptance Criteria**:
- All alignment functions extracted
- Validation works identically

### Task 6.3: Create spec-folder/directory-setup.js
**Priority**: P1  
**Effort**: 15 min  
**Dependencies**: Phase 4, Phase 5

- [ ] Create `scripts/spec-folder/directory-setup.js`
- [ ] Extract `setupContextDirectory`

**Acceptance Criteria**:
- Directory setup works

### Task 6.4: Create spec-folder/index.js
**Priority**: P1  
**Effort**: 5 min  
**Dependencies**: Tasks 6.1-6.3

- [ ] Create `scripts/spec-folder/index.js`
- [ ] Re-export all spec-folder functions

**Acceptance Criteria**:
- Clean re-export structure

### Task 6.5: Validate Phase 6
**Priority**: P1  
**Effort**: 20 min  
**Dependencies**: Task 6.4

- [ ] Run snapshot tests
- [ ] Test folder detection interactively
- [ ] Commit changes

**Acceptance Criteria**:
- All tests pass
- Git commit created

---

## Phase 7: Core Orchestration

### Task 7.1: Create core/config.js
**Priority**: P1  
**Effort**: 20 min  
**Dependencies**: Phase 6

- [ ] Create `scripts/core/config.js`
- [ ] Extract configuration constants
- [ ] Extract path resolution logic
- [ ] Centralize template paths

**Acceptance Criteria**:
- All config in one place
- Path resolution works from new location

### Task 7.2: Create core/workflow.js
**Priority**: P1  
**Effort**: 60 min  
**Dependencies**: Task 7.1

- [ ] Create `scripts/core/workflow.js`
- [ ] Extract main orchestration logic
- [ ] Create clean `runWorkflow` interface
- [ ] Inject dependencies explicitly

**Acceptance Criteria**:
- Workflow orchestrates all phases
- Clean interface with explicit dependencies

### Task 7.3: Create core/index.js
**Priority**: P1  
**Effort**: 5 min  
**Dependencies**: Tasks 7.1-7.2

- [ ] Create `scripts/core/index.js`
- [ ] Re-export config and workflow

**Acceptance Criteria**:
- Clean re-export structure

### Task 7.4: Refactor generate-context.js to CLI
**Priority**: P1  
**Effort**: 30 min  
**Dependencies**: Task 7.3

- [ ] Reduce to CLI entry point only
- [ ] Parse arguments
- [ ] Call workflow
- [ ] Handle errors

**Acceptance Criteria**:
- File is ~100 lines
- CLI behavior unchanged

### Task 7.5: Validate Phase 7 (CRITICAL)
**Priority**: P1  
**Effort**: 30 min  
**Dependencies**: Task 7.4

- [ ] Run ALL snapshot tests
- [ ] Test all CLI arguments
- [ ] Verify MCP integration
- [ ] Commit changes

**Acceptance Criteria**:
- All tests pass
- MCP notification works
- Git commit created

---

## Phase 8: Cleanup & Validation

### Task 8.1: Remove Dead Code
**Priority**: P2  
**Effort**: 15 min  
**Dependencies**: Phase 7

- [ ] Search for unused functions
- [ ] Remove any dead code
- [ ] Verify nothing breaks

**Acceptance Criteria**:
- No unused code remains

### Task 8.2: Add JSDoc Headers
**Priority**: P2  
**Effort**: 30 min  
**Dependencies**: Phase 7

- [ ] Add JSDoc to all exported functions
- [ ] Add module-level documentation
- [ ] Ensure consistent format

**Acceptance Criteria**:
- All modules documented

### Task 8.3: Verify Performance
**Priority**: P2  
**Effort**: 15 min  
**Dependencies**: Phase 7

- [ ] Benchmark original (from git history)
- [ ] Benchmark refactored
- [ ] Compare results

**Acceptance Criteria**:
- No performance regression

### Task 8.4: Update Documentation
**Priority**: P2  
**Effort**: 20 min  
**Dependencies**: Phase 7

- [ ] Update any references to script structure
- [ ] Update SKILL.md if needed
- [ ] Create implementation-summary.md

**Acceptance Criteria**:
- Documentation reflects new structure

### Task 8.5: Final Merge
**Priority**: P1  
**Effort**: 10 min  
**Dependencies**: Tasks 8.1-8.4

- [ ] Final test run
- [ ] Merge to main
- [ ] Tag release

**Acceptance Criteria**:
- Merged successfully
- All tests pass on main
