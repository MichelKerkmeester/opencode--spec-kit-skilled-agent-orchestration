---
title: "Feature Specification [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/078-speckit-test-suite/spec]"
description: "The system-spec-kit has grown to ~10,500 LOC across MCP handlers (2,208 LOC) and scripts (8,500 LOC), but test coverage is incomplete. While 14 existing test files cover ~1,027 ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "system"
  - "spec"
  - "kit"
  - "078"
  - "speckit"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: System Spec Kit Comprehensive Test Suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-01-23 |
| **Updated** | 2026-01-24 |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit has grown to ~10,500 LOC across MCP handlers (2,208 LOC) and scripts (8,500 LOC), but test coverage is incomplete. While 14 existing test files cover ~1,027 tests, critical gaps remain:

1. **Session Learning Handler** - No dedicated tests for preflight/postflight epistemics
2. **Memory MCP Handlers** - 8 handlers with 17 tools lack integration tests
3. **Cognitive Integration** - Dual-threshold validation and learning systems untested
4. **Validation System** - JavaScript validation functions need dedicated coverage
5. **Extractors/Loaders** - 45+ script modules lack unit tests
6. **Five Checks Framework** - Documentation validation untested

Without comprehensive coverage, regressions in the memory system, cognitive processing, and validation logic could go undetected.

### Purpose
Achieve comprehensive test coverage by creating 8 new test files (~3,000 LOC) that validate all system-spec-kit functionality including MCP handlers, cognitive systems, validation logic, and script modules.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Coverage |
|----------|----------|
| MCP Handlers | All 8 handlers, 17 tools |
| Cognitive Systems | Dual-threshold, session learning, uncertainty |
| Scripts | Extractors, loaders, validation utilities |
| Templates | Template generation and validation |
| Integration | Cross-system workflow tests |

### Out of Scope
- Live SQLite database integration (mocked in tests)
- End-to-end Claude Code workflows (manual testing)
- Performance benchmarks (functional tests only)
- UI/visual testing (CLI-only system)

### Files to Create

| File Path | LOC Est. | Description |
|-----------|----------|-------------|
| `mcp_server/tests/test-session-learning.js` | ~400 | Session learning handler: schema, preflight, postflight, history, edge cases |
| `mcp_server/tests/test-memory-handlers.js` | ~500 | All memory MCP handlers: search, match triggers, save, delete, health |
| `mcp_server/tests/test-cognitive-integration.js` | ~350 | Cognitive system integration: learning index, uncertainty, thresholds |
| `mcp_server/tests/test-validation-system.js` | ~400 | JavaScript validation: input validation, error handling, sanitization |
| `mcp_server/tests/test-template-comprehensive.js` | ~300 | Extended template tests: all template types, edge cases, format validation |
| `scripts/tests/test_dual_threshold.py` | ~400 | Python dual-threshold: calculate_uncertainty, passes_dual_threshold, edge cases |
| `scripts/tests/test-extractors-loaders.js` | ~400 | Extractor/loader modules: collect-session-data, decision-extractor, diagram-extractor |
| `scripts/tests/test-five-checks.js` | ~250 | Five Checks Framework: documentation presence, format, template validation |

**Total Estimated LOC:** ~3,000

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Session learning handler tests | ~400 LOC covering schema validation, preflight/postflight operations, history tracking, error handling, edge cases |
| REQ-002 | Memory MCP handler tests | ~500 LOC covering all 8 handlers (memory_search, memory_match_triggers, memory_save, memory_delete, etc.) with 17 tool coverage |
| REQ-003 | Cognitive integration tests | ~350 LOC validating learning index calculations, uncertainty propagation, threshold decisions, cross-component integration |
| REQ-004 | Validation system tests | ~400 LOC covering input validation, error messages, sanitization, boundary conditions |
| REQ-005 | Extended template tests | ~300 LOC for all template types (context, decision, handover), format validation, edge cases |
| REQ-006 | Dual-threshold Python tests | ~400 LOC pytest tests for calculate_uncertainty(), passes_dual_threshold(), readiness evaluation |
| REQ-007 | Extractor/loader tests | ~400 LOC covering collect-session-data.js, decision-extractor.js, diagram-extractor.js, data-loader.js |
| REQ-008 | Five Checks Framework tests | ~250 LOC validating documentation requirements, template formats, integration with spec folders |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Test README updated | README.md documents all 8 new test files and how to run them |
| REQ-010 | Tests synced to Public repo | All test files exist in both anobel.com and Public repo |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Validation Method |
|----|-----------|-------------------|
| SC-001 | All JavaScript tests pass | `npm test` exits 0 with all assertions passing |
| SC-002 | All Python tests pass | `pytest scripts/tests/test_dual_threshold.py` exits 0 |
| SC-003 | Tests complete in reasonable time | Full suite < 30 seconds (no network calls, mocked dependencies) |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Runtime | Node.js 18+ | JavaScript tests won't run | Document in README, check in CI |
| Runtime | Python 3.9+ | pytest tests won't run | Document requirement |
| Package | pytest | Dual-threshold tests fail | Install via `pip install pytest` |
| Package | better-sqlite3 | Memory handler tests fail | Mock SQLite for unit tests |

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Test flakiness | Low | Medium | Use deterministic test data, no timing dependencies |
| Floating point precision | Medium | Low | Use pytest.approx() with abs=0.01 |
| Mock complexity | Medium | Medium | Keep mocks minimal, test interfaces not internals |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:requirements -->
## L3: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full test suite completes in < 30 seconds
- **NFR-P02**: Individual test files complete in < 5 seconds each
- **NFR-P03**: No external network calls (all dependencies mocked)

### Reliability
- **NFR-R01**: Tests are deterministic (same result on every run)
- **NFR-R02**: Tests work on macOS and Linux
- **NFR-R03**: Tests gracefully skip when optional dependencies missing

### Maintainability
- **NFR-M01**: Each test file is self-contained with clear describe/it blocks
- **NFR-M02**: Test fixtures are reusable and documented
- **NFR-M03**: Error messages are descriptive for debugging

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## L3: EDGE CASES

### Data Boundaries
| Boundary | Handling |
|----------|----------|
| Negative uncertainty matches | Treat as 0 matches, log warning |
| Learning index negative | Valid for regression scenarios, no floor |
| Empty memory database | Return empty results, not errors |
| Oversized payloads | Validate and reject with clear message |

### Error Scenarios
| Scenario | Expected Behavior |
|----------|-------------------|
| Missing better-sqlite3 | Skip database tests with reason |
| Malformed JSON input | Return validation error with details |
| Missing skill files | Skip tests gracefully with skip message |
| Invalid spec folder path | Return error with valid path suggestions |

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L3: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 8 files, ~3,000 LOC, comprehensive coverage |
| Risk | 10/25 | Test code only, no production impact |
| Research | 15/20 | Analyzed existing tests, patterns, MCP handlers |
| Integration | 15/20 | Cross-system tests, dual-language (JS + Python) |
| **Total** | **60/90** | **Level 3** (High complexity testing effort) |

<!-- /ANCHOR:complexity -->
---

## 10. TECHNICAL NOTES

### Test Organization
```
.opencode/skill/system-spec-kit/
├── mcp_server/tests/
│   ├── test-session-learning.js      # REQ-001
│   ├── test-memory-handlers.js       # REQ-002
│   ├── test-cognitive-integration.js # REQ-003
│   ├── test-validation-system.js     # REQ-004
│   └── test-template-comprehensive.js # REQ-005
└── scripts/tests/
    ├── test_dual_threshold.py        # REQ-006
    ├── test-extractors-loaders.js    # REQ-007
    └── test-five-checks.js           # REQ-008
```

### Existing Test Baseline
The system already has 14 test files with ~1,027 tests:
- `test-context-server.js` - 152 tests
- `test-memory-basic.js` - 98 tests
- `test-checkpoints.js` - 78 tests
- `test-importance.js` - 87 tests
- `test-template-generation.js` - 63 tests
- Plus 9 additional test files

This effort adds ~450+ new tests to achieve comprehensive coverage.

### Running Tests
```bash
# JavaScript tests
cd .opencode/skill/system-spec-kit
npm test

# Python tests
cd .opencode/skill/system-spec-kit/scripts/tests
pytest test_dual_threshold.py -v
```

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

None - All requirements derived from codebase discovery and gap analysis.

<!-- /ANCHOR:questions -->
---
