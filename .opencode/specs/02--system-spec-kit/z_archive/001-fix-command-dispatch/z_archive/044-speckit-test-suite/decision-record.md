---
title: "Decision Record: Spec Kit Test Suite [044-speckit-test-suite/decision-record]"
description: "This document captures architectural and framework decisions for the Spec Kit test suite implementation based on research from 4 specialized agents."
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "kit"
  - "test"
  - "decision record"
  - "044"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec Kit Test Suite

## Overview

This document captures architectural and framework decisions for the Spec Kit test suite implementation based on research from 4 specialized agents.

---

## Decision 1: Test Framework Selection

### Context
Need to select appropriate test frameworks for 4 distinct components with different technology stacks.

### Decision
| Component | Framework | Alternative Considered |
|-----------|-----------|------------------------|
| Shell Scripts | Existing test-validation.sh | BATS |
| Skill Advisor | pytest | unittest |
| Memory MCP Server | Jest | Mocha, Vitest |
| Integration | Mixed (shell + Jest) | Unified framework |

### Rationale

**Shell Scripts - test-validation.sh (not BATS)**
- Existing framework already 924 lines with robust structure
- Well-integrated with current validation workflow
- Only needs fixture creation (51 directories), not new framework
- Agent 1 confirmed: "test runner exists, fixtures don't"

**Skill Advisor - pytest**
- Native Python testing framework
- Parametrized tests ideal for testing 97 intent boosters, 55 synonyms
- Rich assertion library and fixtures
- Agent 2 recommendation with 90% line coverage target

**Memory MCP - Jest**
- Native Node.js testing framework
- Excellent async/await support for MCP tool testing
- Built-in mocking capabilities for sqlite-vec, embeddings
- Agent 3 recommendation with detailed mock strategy

**Integration - Mixed approach**
- Shell scripts for command-level integration
- Jest for Node.js component integration
- Allows testing at natural component boundaries

### Consequences
- Multiple test frameworks increases maintenance complexity
- Each framework optimized for its technology stack
- Developers need familiarity with multiple testing tools

---

## Decision 2: Coverage Targets

### Context
Need to establish realistic coverage targets that balance thoroughness with implementation effort.

### Decision
| Component | Line Coverage | Branch Coverage |
|-----------|--------------|-----------------|
| Shell Scripts | 90% | 85% |
| Skill Advisor | 90% | 85% |
| MCP Server | 85% | 80% |
| Integration | 100% commands | 100% gates |

### Rationale
- Shell scripts and skill advisor are critical path components
- MCP server has complex async paths that are harder to cover
- Integration tests focus on complete coverage of commands and gates
- Targets aligned with agent recommendations

### Consequences
- High targets may require significant fixture creation
- 100% command coverage ensures no untested user-facing functionality
- May need to adjust if targets prove unrealistic during implementation

---

## Decision 3: Mock Strategy

### Context
Tests need isolation from external dependencies (Ollama, sqlite-vec, filesystem).

### Decision
Create comprehensive mocks for:
1. **sqlite-vec** - In-memory mock for vector operations
2. **Embedding service** - Pre-computed embeddings, skip Ollama
3. **Filesystem** - Virtual filesystem for isolated tests
4. **Memory files** - Valid and invalid fixture sets

### Rationale
- Ollama dependency makes tests slow and flaky
- sqlite-vec requires native bindings, complicates CI
- Filesystem isolation prevents test pollution
- Pre-computed embeddings provide deterministic results

### Consequences
- Mocks must be maintained as real implementations evolve
- Some integration issues may only surface in real-world usage
- Significant upfront effort to create comprehensive mocks

---

## Decision 4: Performance Targets

### Context
Agent 3 specified performance requirements for memory operations.

### Decision
| Operation | Target | Measurement |
|-----------|--------|-------------|
| Trigger matching | <50ms | memory_match_triggers() |
| Vector search | <500ms | memory_search() with vector |
| Memory save | <1s | Full save with embedding |

### Rationale
- <50ms trigger matching enables responsive proactive surfacing
- <500ms vector search provides acceptable user experience
- Targets from Agent 3's comprehensive MCP server analysis

### Consequences
- Performance tests require isolated benchmarking environment
- May need optimization work if targets not met
- CI/CD needs consistent hardware for reliable benchmarks

---

## Decision 5: Test Directory Structure

### Context
Need organized structure for ~830 test cases across 4 domains.

### Decision
```
.opencode/tests/
├── spec-kit-scripts/     # Shell script tests
│   └── test-fixtures/    # 51 fixture directories
├── skill-advisor/        # pytest tests
├── memory-mcp/           # Jest tests
│   ├── tools/            # MCP tool tests
│   └── lib/              # Library tests
└── integration/
    ├── commands/         # Command flow tests
    ├── gates/            # Gate enforcement tests
    └── e2e/              # End-to-end workflows
```

### Rationale
- Separation by domain matches agent research divisions
- Clear ownership and responsibility boundaries
- Enables parallel development by multiple agents
- Fixtures co-located with tests that use them

### Consequences
- Some shared utilities may need duplication
- Cross-domain tests go in integration/
- Directory structure must be created before implementation

---

## Decision 6: CI/CD Pipeline Design

### Context
Tests need automated execution with appropriate triggers.

### Decision
| Test Type | Trigger | Duration Target |
|-----------|---------|-----------------|
| Unit tests | Every commit | <2 min |
| Integration | PR | <5 min |
| E2E | Merge to main | <10 min |
| Regression | Nightly | <20 min |

### Rationale
- Fast unit tests enable quick feedback loop
- Integration tests gate PR merges
- E2E tests validate complete workflows
- Nightly regression catches subtle issues

### Consequences
- GitHub Actions configuration required
- May need test parallelization to meet time targets
- Need strategy for flaky test handling

---

## Decision 7: Test Priority Classification

### Context
830 test cases need prioritization for phased implementation.

### Decision
Based on agent research:
| Priority | Count | Description |
|----------|-------|-------------|
| P0 | ~180 | Critical path, must complete |
| P1 | ~350 | Important, complete before release |
| P2 | ~300 | Nice-to-have, can defer |

P0 breakdown by agent:
- Agent 1 (Shell): 45 P0 tests
- Agent 2 (Skill Advisor): ~100 P0 tests (routing logic)
- Agent 3 (MCP): 78 P0 tests (MCP tools)
- Agent 4 (Integration): 77 P0 tests (commands)

### Rationale
- P0 tests cover user-facing functionality
- P1 tests cover internal logic and edge cases
- P2 tests cover performance and rare edge cases
- Enables phased delivery with incremental value

### Consequences
- Can ship with P0+P1 complete
- P2 can be implemented as time permits
- Priority may shift as implementation reveals issues

---

## Decision 8: Implementation Timeline

### Context
Need realistic timeline for 830 test cases.

### Decision
5-week implementation:
| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Foundation | Infrastructure, fixtures, mocks |
| 2 | Unit (Part 1) | Shell scripts, skill advisor |
| 3 | Unit (Part 2) | MCP server tests |
| 4 | Integration | Commands, gates, templates |
| 5 | E2E & Polish | Workflows, CI/CD, documentation |

### Rationale
- Foundation week critical for parallel implementation
- Unit tests can proceed in parallel after Week 1
- Integration depends on unit test completion
- Final week for polish and documentation

### Consequences
- Aggressive timeline, may need adjustment
- Week 1 is critical path - delays cascade
- Parallel agent work in Weeks 2-3 maximizes efficiency

---

## Open Questions

1. **Ollama alternative**: Should we use a lighter embedding model for tests?
2. **sqlite-vec CI**: Can we use pre-built binaries or need fallback path?
3. **Performance baseline**: What are current performance metrics?
4. **Test data retention**: How long to keep test artifacts?

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-26 | Agent Synthesis | Initial decision record from 4 agent outputs |
