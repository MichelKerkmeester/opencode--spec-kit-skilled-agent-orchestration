---
title: "Implementation Plan: System Spec Kit v2.1.0 Test Suite [078-speckit-test-suite/plan]"
description: "This plan implements a comprehensive test suite for System Spec Kit v2.1.0 features. The suite covers 8 test files totaling approximately 3,000 LOC across five phases: MCP handl..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "system"
  - "spec"
  - "kit"
  - "078"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: System Spec Kit v2.1.0 Test Suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js), Python 3.9+ |
| **Framework** | Native Node.js test runner, pytest |
| **Storage** | SQLite (better-sqlite3 for mocking) |
| **Testing** | Custom test harness, pytest |

### Overview

This plan implements a comprehensive test suite for System Spec Kit v2.1.0 features. The suite covers 8 test files totaling approximately 3,000 LOC across five phases: MCP handler tests, integration tests, scripts tests, framework tests, and template tests. Tests validate session learning, memory handlers, cognitive integration, validation systems, dual-threshold logic, Five Checks Framework, and template composition.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (8 test files, ~3,000 LOC)
- [x] Dependencies identified (Node.js, Python, pytest, better-sqlite3)

### Definition of Done
- [ ] All 8 test files implemented and passing
- [ ] Tests synced to Public repo
- [ ] Documentation updated (spec/plan/tasks)

---

## 3. ARCHITECTURE

### Pattern
Test-Driven Validation with hierarchical test suites

### Key Components
- **MCP Handler Tests**: Validate session-learning and memory handler MCP tools
- **Integration Tests**: End-to-end cognitive memory system tests
- **Scripts Tests**: Validation system and extractors/loaders verification
- **Framework Tests**: Five Checks and dual-threshold algorithm tests
- **Template Tests**: Comprehensive template composition verification

### Data Flow
```
Test Runner → Test File → Module Under Test → Assertions → Results
                              ↓
                        Mock Database (SQLite)
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: MCP Handler Tests (~900 LOC)
- [ ] test-session-learning.js (~400 LOC) - Session learning handler with preflight/postflight epistemics
- [ ] test-memory-handlers.js (~500 LOC) - Memory MCP handler comprehensive tests

### Phase 2: Integration Tests (~350 LOC)
- [ ] test-cognitive-integration.js (~350 LOC) - End-to-end cognitive memory integration

### Phase 3: Scripts Tests (~800 LOC)
- [ ] test-validation-system.js (~400 LOC) - Validation system comprehensive tests
- [ ] test-extractors-loaders.js (~400 LOC) - Extractors and data loaders verification

### Phase 4: Framework Tests (~650 LOC)
- [ ] test-five-checks.js (~250 LOC) - Five Checks Framework documentation tests
- [ ] test_dual_threshold.py (~400 LOC) - Dual-threshold validation (pytest)

### Phase 5: Template Tests (~300 LOC)
- [ ] test-template-comprehensive.js (~300 LOC) - Template composition and structure tests

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Handler functions, algorithms | Node.js test runner, pytest |
| Integration | MCP tool chains, cognitive memory | Custom harness with mocks |
| Static Analysis | File structure, template patterns | fs module assertions |

### Test Execution Commands
```bash
# JavaScript tests (individual)
node mcp_server/tests/test-session-learning.js
node mcp_server/tests/test-memory-handlers.js
node mcp_server/tests/test-cognitive-integration.js
node scripts/tests/test-validation-system.js
node scripts/tests/test-extractors-loaders.js
node scripts/tests/test-five-checks.js
node scripts/tests/test-template-comprehensive.js

# Python tests
pytest scripts/tests/test_dual_threshold.py -v

# All tests
npm test
```

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js 18+ | External | Green | Cannot run JS tests |
| Python 3.9+ | External | Green | Cannot run pytest |
| pytest | External | Green | Dual-threshold tests fail |
| better-sqlite3 | Internal | Green | Database mock tests skip |
| fs/path modules | Internal | Green | All file tests fail |

---

## 7. ROLLBACK PLAN

- **Trigger**: Test implementation introduces regressions
- **Procedure**: Revert test files, existing tests remain functional

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (MCP Handlers) ─────┐
                            ├──► Phase 2 (Integration) ──► Phase 3 (Scripts)
Phase 4 (Framework) ────────┤                                    │
                            └──────────────────────────────────────► Phase 5 (Templates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: MCP Handlers | None | Phase 2 |
| Phase 2: Integration | Phase 1 | Phase 5 |
| Phase 3: Scripts | None | Phase 5 |
| Phase 4: Framework | None | Phase 5 |
| Phase 5: Templates | Phase 2, 3, 4 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | LOC |
|-------|------------|------------------|-----|
| Phase 1: MCP Handler Tests | Medium | 3-4 hours | ~900 |
| Phase 2: Integration Tests | Medium | 2-3 hours | ~350 |
| Phase 3: Scripts Tests | Medium | 3-4 hours | ~800 |
| Phase 4: Framework Tests | High | 3-4 hours | ~650 |
| Phase 5: Template Tests | Low | 1-2 hours | ~300 |
| **Total** | | **12-17 hours** | **~3,000** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing tests pass before adding new tests
- [ ] Test isolation verified (no shared state pollution)
- [ ] Mock databases cleaned up properly

### Rollback Procedure
1. Identify failing test file(s)
2. Git revert specific test file: `git checkout HEAD~1 -- <test-file>`
3. Verify remaining tests pass
4. Document issue in scratch/ for investigation

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - tests use isolated mock databases

---

## Test File Specifications

### test-session-learning.js (~400 LOC)
**Location**: `mcp_server/tests/test-session-learning.js`
**Test Categories**:
- Schema validation (session learning request/response)
- Preflight epistemic checks
- Postflight epistemic updates
- History tracking and retrieval
- Error handling edge cases

### test-memory-handlers.js (~500 LOC)
**Location**: `mcp_server/tests/test-memory-handlers.js`
**Test Categories**:
- memory_save handler validation
- memory_search with various query types
- memory_match_triggers behavior
- Anchor-based retrieval
- Error responses

### test-cognitive-integration.js (~350 LOC)
**Location**: `mcp_server/tests/test-cognitive-integration.js`
**Test Categories**:
- End-to-end memory workflows
- Attention decay verification
- Co-activation patterns
- Working memory transitions
- Tier classification integration

### test-validation-system.js (~400 LOC)
**Location**: `scripts/tests/test-validation-system.js`
**Test Categories**:
- validate-spec-folder.js functionality
- Level detection and enforcement
- Required file verification
- Template compliance checking
- Exit code validation

### test-extractors-loaders.js (~400 LOC)
**Location**: `scripts/tests/test-extractors-loaders.js`
**Test Categories**:
- decision-extractor.js output
- diagram-extractor.js functionality
- data-loader.js parsing
- collect-session-data.js integration
- Error handling for malformed input

### test_dual_threshold.py (~400 LOC)
**Location**: `scripts/tests/test_dual_threshold.py`
**Test Categories**:
- calculate_uncertainty() edge cases
- passes_dual_threshold() logic
- Threshold boundary conditions
- Floating point precision (pytest.approx)
- Integration with AGENTS.md framework

### test-five-checks.js (~250 LOC)
**Location**: `scripts/tests/test-five-checks.js`
**Test Categories**:
- Five Checks documentation presence
- Template format validation
- Table structure verification
- Integration with decision-record.md

### test-template-comprehensive.js (~300 LOC)
**Location**: `scripts/tests/test-template-comprehensive.js`
**Test Categories**:
- All 4 level directories exist
- CORE + ADDENDUM composition
- compose.sh script functionality
- Placeholder pattern validation
- Example templates verification

---
