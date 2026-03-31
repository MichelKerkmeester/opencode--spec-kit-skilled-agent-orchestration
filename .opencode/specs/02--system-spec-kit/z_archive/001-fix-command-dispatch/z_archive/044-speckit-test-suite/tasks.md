---
title: "Tasks: Spec Kit Test [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite/tasks]"
description: "Total: ~830 test cases across 4 domains"
trigger_phrases:
  - "tasks"
  - "spec"
  - "kit"
  - "test"
  - "suite"
  - "044"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Spec Kit Test Suite

<!-- ANCHOR:notation -->
## Overview

Total: ~830 test cases across 4 domains

| Domain | Test Cases | Framework | Agent |
|--------|------------|-----------|-------|
| Shell Scripts | 130+ | test-validation.sh | Agent 1 |
| Skill Advisor | ~250 | pytest | Agent 2 |
| Memory MCP | 239 | Jest | Agent 3 |
| Integration & E2E | 209 | Mixed | Agent 4 |

---

<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Foundation Setup (Week 1)

### Task 1.1: Test Infrastructure
- [ ] Create `.opencode/tests/` directory structure
- [ ] Create 51 fixture directories for shell script tests
- [ ] Initialize Jest for MCP server (`npm init`, `jest.config.js`)
- [ ] Initialize pytest for skill advisor (`conftest.py`)
- [ ] Set up CI/CD pipeline skeleton (GitHub Actions)

### Task 1.2: Mock Implementations
- [ ] Create sqlite-vec mock for MCP tests
- [ ] Create embedding service mock (skip Ollama calls)
- [ ] Create filesystem mock for isolated tests
- [ ] Create memory file fixtures (valid/invalid)

### Task 1.3: Shared Resources
- [ ] Create test utility functions
- [ ] Document test running procedures
- [ ] Set up coverage reporting

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Unit Tests - Shell Scripts (Week 2)

### Task 2.1: Core Script Tests (P0 - 45 tests)
- [ ] `validate-spec-folder.sh` - 15 test cases
  - Level 1/2/3 validation
  - Missing file detection
  - Error message formatting
- [ ] `generate-context.js` - 12 test cases
  - Memory file generation
  - ANCHOR format validation
  - Error handling
- [ ] `test-validation.sh` - 10 test cases
  - Self-validation tests
  - Fixture discovery
- [ ] `version-check.sh` - 8 test cases
  - Version comparison logic
  - Upgrade detection

### Task 2.2: Helper Script Tests (P1 - 55 tests)
- [ ] `archive-spec-folder.sh` tests
- [ ] `list-spec-folders.sh` tests
- [ ] `cleanup-scratch.sh` tests
- [ ] `template-copy.sh` tests
- [ ] Template validation tests (7 rules)

### Task 2.3: Edge Case Tests (P2 - 30 tests)
- [ ] Unicode filename handling
- [ ] Very large spec folders
- [ ] Concurrent access scenarios
- [ ] Symlink handling

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Unit Tests - Skill Advisor (Week 2)

### Task 2.4: Routing Logic Tests (P0 - ~100 tests)
- [ ] Intent detection tests (97 intent boosters)
- [ ] Skill matching tests
- [ ] Confidence threshold tests
- [ ] Default routing tests

### Task 2.5: Text Processing Tests (P1 - ~100 tests)
- [ ] Synonym mapping tests (55 mappings)
- [ ] Stop word filtering tests (100 stop words)
- [ ] Text normalization tests
- [ ] Edge case text handling

### Task 2.6: Integration Tests (P2 - ~50 tests)
- [ ] SKILL.md metadata parsing
- [ ] Multi-skill matching scenarios
- [ ] Confidence score calculations

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Unit Tests - Memory MCP Server (Week 3)

### Task 3.1: MCP Tool Tests (P0 - 78 tests)
- [ ] `memory_save` - 8 tests
- [ ] `memory_search` - 12 tests
- [ ] `memory_match_triggers` - 10 tests
- [ ] `memory_list` - 6 tests
- [ ] `memory_delete` - 8 tests
- [ ] `memory_update` - 8 tests
- [ ] `memory_validate` - 6 tests
- [ ] `memory_stats` - 4 tests
- [ ] `checkpoint_create` - 6 tests
- [ ] `checkpoint_restore` - 6 tests
- [ ] `checkpoint_list` - 4 tests

### Task 3.2: Core Library Tests (P0 - 80 tests)
- [ ] `vector-index.js` - 20 tests
- [ ] `embeddings.js` - 15 tests
- [ ] `memory-parser.js` - 15 tests
- [ ] `hybrid-search.js` - 15 tests
- [ ] `trigger-matcher.js` - 15 tests

### Task 3.3: Supporting Library Tests (P1 - 60 tests)
- [ ] `importance-tiers.js` - 10 tests
- [ ] `temporal-decay.js` - 10 tests
- [ ] `composite-scoring.js` - 10 tests
- [ ] `checkpoints.js` - 10 tests
- [ ] `history-manager.js` - 10 tests
- [ ] `access-tracker.js` - 10 tests

### Task 3.4: Infrastructure Tests (P2 - 21 tests)
- [ ] `config-loader.js` - 7 tests
- [ ] `retry-manager.js` - 7 tests
- [ ] `errors.js` - 7 tests

<!-- /ANCHOR:phase-3 -->
---

## Phase 4: Integration Tests (Week 4)

### Task 4.1: Command Integration Tests (P0 - 77 tests)
- [ ] `/memory:save` command flow - 15 tests
- [ ] `/memory:search` command flow - 12 tests
- [ ] `/spec_kit:resume` command flow - 10 tests
- [ ] `/spec_kit:handover` command flow - 10 tests
- [ ] `/spec_kit:debug` command flow - 10 tests
- [ ] Command error handling - 20 tests

### Task 4.2: Gate Enforcement Tests (P0 - 21 tests)
- [ ] Gate 2 (Understanding) tests - 5 tests
- [ ] Gate 3 (Skill Routing) tests - 5 tests
- [ ] Gate 4 (Spec Folder) tests - 6 tests
- [ ] Gate bypass phrase tests - 5 tests

### Task 4.3: Template Validation Tests (P1 - 31 tests)
- [ ] Level 1 template tests - 8 tests
- [ ] Level 2 template tests - 8 tests
- [ ] Level 3 template tests - 8 tests
- [ ] Template inheritance tests - 7 tests

---

## Phase 5: E2E Tests (Week 5)

### Task 5.1: Full Workflow Tests (P0 - 31 tests)
- [ ] New spec folder creation workflow - 8 tests
- [ ] Memory save/load cycle - 8 tests
- [ ] Checkpoint create/restore - 8 tests
- [ ] Session handover workflow - 7 tests

### Task 5.2: Error Recovery Tests (P1 - 15 tests)
- [ ] Database corruption recovery - 5 tests
- [ ] Interrupted save recovery - 5 tests
- [ ] Invalid input handling - 5 tests

### Task 5.3: Performance Tests (P2 - 10 tests)
- [ ] <50ms trigger matching benchmark
- [ ] <500ms vector search benchmark
- [ ] Large memory database performance
- [ ] Concurrent access performance

---

## Task Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: FOUNDATION                          │
│  Task 1.1 (Infrastructure) ─→ Task 1.2 (Mocks) ─→ Task 1.3 (Utils) │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ PHASE 2: SHELL  │    │ PHASE 2: SKILL  │    │ PHASE 3: MCP    │
│ Tasks 2.1-2.3   │    │ Tasks 2.4-2.6   │    │ Tasks 3.1-3.4   │
│ (130+ tests)    │    │ (~250 tests)    │    │ (239 tests)     │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PHASE 4: INTEGRATION                           │
│          Task 4.1 (Commands) + Task 4.2 (Gates) + Task 4.3          │
│                         (77 + 21 + 31 = 129 tests)                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PHASE 5: E2E                               │
│               Task 5.1 + Task 5.2 + Task 5.3                        │
│                    (31 + 15 + 10 = 56 tests)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Completed Tasks

| Task | Agent | Date | Deliverable |
|------|-------|------|-------------|
| Create spec folder | - | 2025-12-26 | `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite` |
| Agent 1 research | Agent 1 | 2025-12-26 | Shell scripts test plan |
| Agent 2 research | Agent 2 | 2025-12-26 | Skill advisor test plan |
| Agent 3 research | Agent 3 | 2025-12-26 | `memory-mcp-test-plan.md` |
| Agent 4 research | Agent 4 | 2025-12-26 | Integration test plan |
| Plan synthesis | - | 2025-12-26 | Updated plan.md, tasks.md |

---

## Next Actions

1. **Begin Phase 1**: Create test directory structure and fixtures
2. **Install frameworks**: Jest, pytest, verify test-validation.sh
3. **Create mocks**: sqlite-vec, embeddings, filesystem
4. **Start Phase 2**: Parallel implementation of unit tests
