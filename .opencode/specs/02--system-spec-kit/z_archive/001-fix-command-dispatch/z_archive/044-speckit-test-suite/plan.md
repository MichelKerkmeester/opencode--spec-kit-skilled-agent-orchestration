---
title: "Spec Kit Test Suite - Implementation Plan [044-speckit-test-suite/plan]"
description: "Comprehensive test suite covering 4 domains"
trigger_phrases:
  - "spec"
  - "kit"
  - "test"
  - "suite"
  - "implementation"
  - "plan"
  - "044"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Spec Kit Test Suite - Implementation Plan

## 1. Overview

Comprehensive test suite covering 4 domains:
- Spec Kit Shell Scripts (130+ tests)
- Skill Advisor Python Script (~250 tests)
- Memory MCP Server (239 tests)
- Integration & E2E (209 tests)

**Total: ~830 test cases**

## Technical Context

### Technology Stack
- **Spec Kit Memory MCP**: Node.js-based MCP server using SQLite with sqlite-vec extension for vector similarity search
- **Memory Files**: Use ANCHOR format (`## [ANCHOR:title]`) for semantic indexing and retrieval
- **Validation Scripts**: Bash-based modular validation with individual rule scripts
- **generate-context.js**: Node.js script that creates properly formatted memory files from JSON input or spec folder scanning
- **Embedding Model**: Ollama (nomic-embed-text) for generating 768-dimensional vectors

### Key Components
| Component | Technology | Location |
|-----------|------------|----------|
| MCP Server | Node.js + SQLite | `.opencode/skill/system-spec-kit/mcp_server/` |
| Validation | Bash scripts | `.opencode/skill/system-spec-kit/scripts/` |
| Skill Advisor | Python | `.opencode/scripts/skill_advisor.py` |
| Memory DB | SQLite + sqlite-vec | `.opencode/skill/system-spec-kit/database/` |

## Architecture

### Test Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Test Orchestrator                        │
│              (Parallel Agent Dispatcher)                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Agent 1-3   │   │   Agent 4-6   │   │   Agent 7-10  │
│ Shell Scripts │   │  MCP Tools    │   │ Integration   │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   BATS/Bash   │   │     Jest      │   │  Mixed/E2E    │
│   Framework   │   │   Framework   │   │   Framework   │
└───────────────┘   └───────────────┘   └───────────────┘
```

### Design Principles
- **10 Parallel Test Agents**: Each agent tests a specific domain to avoid conflicts
- **Isolated Sandboxes**: Each agent operates in its own scratch/ folder with isolated database
- **Domain Separation**: Clear boundaries between shell script tests, MCP tool tests, and integration tests
- **Report Aggregation**: Individual agent reports synthesized into unified summary

### Test Isolation Strategy
- Each MCP test uses a temporary SQLite database
- Shell script tests use dedicated fixture directories
- Integration tests reset state between scenarios
- No shared mutable state between parallel agents

## 2. Test Framework Selection

| Domain | Framework | Rationale |
|--------|-----------|-----------|
| Shell Scripts | Existing test-validation.sh | Already 924 lines, just needs fixtures |
| Skill Advisor | pytest | Parametrized tests, rich assertions |
| Memory MCP | Jest | Node.js native, good async support |
| Integration | Mixed (shell + assertions) | Cross-component testing |

## 3. Implementation Phases

### Phase 1: Foundation (Week 1)
- Create test fixtures directory structure
- Install test frameworks (pytest, Jest)
- Set up CI/CD pipeline skeleton
- Create 51 fixture directories for shell script tests

### Phase 2: Unit Tests (Weeks 2-3)
- Shell script tests with fixtures (130+ tests)
  - 12 scripts, 7 validation rules
  - Priority: P0 (45), P1 (55), P2 (30)
- Skill advisor pytest tests (~250 tests)
  - 97 intent boosters, 55 synonym mappings, 100 stop words
  - Routing logic, confidence scoring
- MCP server Jest tests (239 tests)
  - 13 MCP tools, 23 library modules
  - Performance: <50ms triggers, <500ms vector search

### Phase 3: Integration Tests (Week 4)
- Command integration tests (77 tests)
- Gate enforcement tests (21 tests)
- Template validation tests (31 tests)

### Phase 4: E2E Tests (Week 5)
- Full workflow tests (31 scenarios)
- Memory lifecycle tests
- Checkpoint workflow tests
- CI/CD GitHub Actions configuration

## 4. Coverage Targets

| Component | Line Coverage | Branch Coverage |
|-----------|--------------|-----------------|
| Shell Scripts | 90% | 85% |
| Skill Advisor | 90% | 85% |
| MCP Server | 85% | 80% |
| Integration | 100% commands | 100% gates |

## 5. Test Directory Structure

```
.opencode/tests/
├── spec-kit-scripts/
│   ├── test-fixtures/           # 51 fixture directories
│   │   ├── valid-spec-folders/
│   │   ├── invalid-spec-folders/
│   │   ├── edge-cases/
│   │   └── performance/
│   └── test-validation.sh       # Existing 924-line framework
├── skill-advisor/
│   ├── conftest.py              # Shared fixtures
│   ├── test_routing.py          # Intent routing tests
│   ├── test_confidence.py       # Confidence scoring tests
│   ├── test_boosters.py         # 97 intent booster tests
│   ├── test_synonyms.py         # 55 synonym mapping tests
│   └── test_stop_words.py       # 100 stop word tests
├── memory-mcp/
│   ├── jest.config.js
│   ├── __mocks__/               # Mock implementations
│   ├── tools/                   # 13 MCP tool tests
│   └── lib/                     # 23 library module tests
└── integration/
    ├── commands/                # 77 command tests
    ├── gates/                   # 21 gate enforcement tests
    ├── templates/               # Template validation tests
    ├── e2e/                     # 31 E2E workflow tests
    └── workflows/               # Cross-component workflows
```

## 6. CI/CD Integration

| Test Type | Trigger | Target Duration |
|-----------|---------|-----------------|
| Unit tests | Every commit | <2 min |
| Integration tests | PR | <5 min |
| E2E tests | Merge to main | <10 min |
| Regression | Nightly | <20 min |

### GitHub Actions Configuration
- Matrix testing for Node.js 18/20
- Parallel job execution
- Coverage reporting to PR comments
- Performance regression tracking

## 7. Agent Deliverables Summary

| Agent | Component | Test Cases | Status |
|-------|-----------|------------|--------|
| Agent 1 | Shell Scripts | 130+ | Complete |
| Agent 2 | Skill Advisor | ~250 | Complete |
| Agent 3 | Memory MCP Server | 239 | Complete |
| Agent 4 | Integration & E2E | 209 | Complete |

## 8. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Jest, MCP Server |
| Python | 3.6+ | pytest, skill_advisor |
| Jest | ^29.0 | MCP Server testing |
| pytest | ^7.0 | Python testing |
| Ollama | Latest | Embedding tests |
| SQLite3 | 3.x | Database tests |
| sqlite-vec | Latest | Vector search tests |

## 9. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Ollama dependency | Mock embeddings for unit tests |
| sqlite-vec availability | Test graceful degradation path |
| Long test execution time | Parallelize independent tests |
| Flaky integration tests | Retry logic + deterministic fixtures |
| Test fixture maintenance | Auto-generation scripts |

## 10. Timeline

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| Week 1 | Foundation | Test infrastructure, CI/CD skeleton |
| Week 2 | Unit Tests (Part 1) | Shell script tests, Skill advisor tests |
| Week 3 | Unit Tests (Part 2) | MCP server tests |
| Week 4 | Integration | Command, gate, template tests |
| Week 5 | E2E & Polish | E2E workflows, CI/CD complete, docs |
