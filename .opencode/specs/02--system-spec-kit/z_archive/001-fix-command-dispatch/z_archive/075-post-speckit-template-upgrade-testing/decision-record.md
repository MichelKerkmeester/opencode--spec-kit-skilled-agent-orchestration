---
title: "Decision Record: Post-SpecKit Template Upgrade Testing [075-post-speckit-template-upgrade-testing/decision-record]"
description: "The refinement task required comprehensive analysis of ~450 files and 27,600 LOC across the SpecKit system. Sequential analysis by a single agent would require 15+ minutes per s..."
trigger_phrases:
  - "decision"
  - "record"
  - "post"
  - "speckit"
  - "template"
  - "decision record"
  - "075"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Post-SpecKit Template Upgrade Testing

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Multi-Agent Parallel Dispatch Architecture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | User (Michel), AI Orchestrator (Opus 4.5) |
| **Approval** | Approved at Spec Review checkpoint |

---

### Context

The refinement task required comprehensive analysis of ~450 files and 27,600 LOC across the SpecKit system. Sequential analysis by a single agent would require 15+ minutes per subsystem, totaling hours of processing time. The scope demanded an efficient approach to complete within reasonable time while maintaining analysis quality.

### Constraints
- API rate limits for Opus 4.5 model calls
- Coordination overhead for parallel execution
- Need for consistent analysis methodology across agents

---

### Decision

**Summary**: Deploy 10 parallel Opus 4.5 research agents, each assigned specific subsystems, with orchestrator coordination.

**Details**: Each research agent receives a focused scope (core templates, addendum templates, scripts, etc.) and produces structured findings. An orchestrator agent coordinates dispatch, collects results, and synthesizes analysis documents. Workstream notation ([W-A], [W-B], [SYNC]) enables clear task assignment.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel 10-agent dispatch** | 10x faster, specialized focus | Coordination overhead | 9/10 |
| Sequential single-agent | Simple coordination | Too slow (~2+ hours) | 4/10 |
| Manual human review | High accuracy | Not feasible for 450 files | 3/10 |
| Sample-based analysis | Fast | May miss critical issues | 5/10 |

**Why Chosen**: Parallel dispatch provides optimal balance of speed and coverage. The ~90 second parallel execution time is acceptable, and workstream notation manages coordination effectively.

---

### Consequences

**Positive**:
- 10x faster analysis completion (~90s vs ~15 min per subsystem)
- Specialized agent focus improves depth of analysis
- Scalable pattern for future large-scale tasks

**Negative**:
- Requires orchestrator complexity - Mitigation: Defined sync points with clear protocols
- Potential for conflicting findings - Mitigation: Aggregation phase resolves conflicts

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent timeout | M | 3x retry with extended timeout |
| Inconsistent findings | L | Structured output format enforced |
| API rate limit | M | Staggered dispatch if needed |

---

### Implementation

**Affected Systems**:
- Spec folder 074 task management
- Agent coordination framework

**Rollback**: If parallel dispatch fails, fall back to sequential single-agent analysis with extended timeline.

---

---

## ADR-002: Retain CORE + ADDENDUM v2.0 Architecture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | User (Michel), Research Agents (10x) |
| **Approval** | Approved at Design Review checkpoint |

---

### Context

Spec 073 introduced the CORE + ADDENDUM v2.0 template architecture, achieving 74-82% template reduction. The refinement analysis needed to determine whether to keep, modify, or revert this architecture based on quality assessment.

### Constraints
- Backward compatibility with existing spec folders
- Template token efficiency for AI processing
- User onboarding experience

---

### Decision

**Summary**: Retain the CORE + ADDENDUM v2.0 architecture with targeted refinements for documentation gaps.

**Details**: The architecture is well-designed and achieves its goals. Rather than structural changes, add documentation for verbose variants, compose scripts, and path conventions as future enhancement paths.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Retain with refinements** | Preserves gains, addresses gaps | Does not fully restore onboarding guidance | 9/10 |
| Full revert to v1.0 | Complete onboarding support | Loses 70% token efficiency | 3/10 |
| Hybrid verbose/minimal | Best of both | Maintenance overhead doubles | 6/10 |
| Complete redesign | Could optimize further | Disrupts stable system | 4/10 |

**Why Chosen**: The v2.0 architecture wins 4/6 quality dimensions. Adding verbose variants as future enhancement addresses onboarding without sacrificing current benefits.

---

### Consequences

**Positive**:
- Maintains 74-82% template reduction
- Preserves DRY compositional architecture
- Avoids disruption to existing workflows

**Negative**:
- Onboarding gap remains for new users - Mitigation: Document as future REC-001 implementation
- Some users prefer verbose templates - Mitigation: Can reference backup as example

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| User complaints about minimal templates | M | Document verbose variant roadmap |
| Template drift over time | L | Document compose script for future |

---

### Implementation

**Affected Systems**:
- Template files (documentation only)
- SKILL.md (version update)
- level_specifications.md (path documentation)

**Rollback**: Backup preserved at z_backup/system-spec-kit/ for reference or full revert if needed.

---

---

## ADR-003: Workstream Notation Standard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | AI Orchestrator (Opus 4.5) |
| **Approval** | Approved at Design Review checkpoint |

---

### Context

Multi-agent coordination requires clear task assignment and ownership tracking. Without a notation standard, agents may conflict on file ownership or duplicate work. The orchestration framework needed a lightweight, readable notation for task files.

### Constraints
- Human-readable in markdown
- Compatible with existing task.md format
- Minimal overhead to apply

---

### Decision

**Summary**: Adopt [W-A], [W-B], [SYNC] workstream notation for multi-agent task coordination.

**Details**:
- [W-A] = Research Workstream (analysis, investigation)
- [W-B] = Implementation Workstream (file changes)
- [SYNC] = Synchronization point (verification, aggregation)

Tasks prefixed with workstream notation can be filtered and assigned to appropriate agents.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[W-X] notation** | Simple, readable, extensible | New convention to learn | 8/10 |
| Agent ID prefix (A1-A10) | Precise assignment | Not meaningful to humans | 5/10 |
| No notation | No overhead | Coordination chaos | 2/10 |
| Full YAML metadata | Rich information | Verbose, hard to read | 4/10 |

**Why Chosen**: [W-X] notation is simple enough to add to any task without breaking existing format, while providing clear workstream identification for both humans and orchestrators.

---

### Consequences

**Positive**:
- Clear task ownership in multi-agent scenarios
- Human-readable workstream identification
- Extensible (can add [W-C], [W-D] as needed)

**Negative**:
- New convention for users to learn - Mitigation: Documented in parallel_dispatch_config.md
- Some overhead in task creation - Mitigation: Templates include notation

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Notation confusion | L | Clear documentation with examples |
| Incomplete adoption | L | Enforce in Level 3+ templates |

---

### Implementation

**Affected Systems**:
- tasks.md templates (all levels 3+)
- parallel_dispatch_config.md (documentation)
- Agent dispatch framework

**Rollback**: Notation is additive; tasks work without it if reverted.

---

---

## ADR-004: Analysis Document Structure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | AI Orchestrator (Opus 4.5), User (Michel) |
| **Approval** | Approved at Spec Review checkpoint |

---

### Context

The comprehensive review required formal deliverables to capture findings, quality assessment, and recommendations. The output format needed to serve as both reference documentation and actionable input for implementation decisions.

### Constraints
- Must be human-readable markdown
- Must capture quantitative metrics
- Must prioritize recommendations clearly

---

### Decision

**Summary**: Produce three structured analysis documents: analysis.md, review.md, refinement-recommendations.md.

**Details**:
- `analysis.md`: Comprehensive comparison with metrics (what changed)
- `review.md`: Quality assessment with grades (how well it was done)
- `refinement-recommendations.md`: Prioritized actions (what to do next)

Each document follows a standard structure with executive summary, detailed sections, and conclusions.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three documents** | Clear separation of concerns | More files to maintain | 9/10 |
| Single mega-document | One place for everything | Too long, hard to navigate | 4/10 |
| JSON output | Machine-readable | Not human-friendly | 3/10 |
| Issue tracker entries | Actionable format | Loses narrative context | 5/10 |

**Why Chosen**: Three documents provide clear separation between "what happened" (analysis), "how good is it" (review), and "what to do" (recommendations). Each can be referenced independently.

---

### Consequences

**Positive**:
- Clear separation of concerns
- Each document serves specific purpose
- Recommendations are actionable and prioritized

**Negative**:
- Three files to maintain - Mitigation: Cross-references link them
- Some overlap in content - Mitigation: Each has distinct focus

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Documents drift out of sync | L | Generated together, cross-referenced |
| Recommendations become stale | M | Include implementation roadmap |

---

### Implementation

**Affected Systems**:
- Spec folder 074 (primary output location)
- Future spec folders (pattern for large reviews)

**Rollback**: Documents are additive output; can be deleted if not useful.

---

---

## ADR-005: Version Numbering Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-20 |
| **Deciders** | User (Michel), AI Orchestrator |
| **Approval** | Approved at Implementation Review checkpoint |

---

### Context

The refinement work represents meaningful improvements to the SpecKit system following the Spec 073 optimization. A version number update is needed to signal the changes and maintain changelog continuity.

### Constraints
- Semantic versioning convention (MAJOR.MINOR.PATCH)
- No breaking changes introduced
- Spec 073 released as v1.8.0

---

### Decision

**Summary**: Bump version from v1.8.0 to v1.9.0 for the refinement release.

**Details**: The refinement adds new documentation and improvements but does not introduce breaking changes. This warrants a MINOR version bump (1.8 → 1.9) rather than PATCH (no bug fixes only) or MAJOR (no breaking changes).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **v1.9.0** | Semantic, reflects improvements | May seem small for work done | 8/10 |
| v1.8.1 | Minimal bump | Understates scope of changes | 5/10 |
| v2.0.0 | Major version signal | No breaking changes to justify | 4/10 |
| v1.8.0-refinement | Keeps base version | Non-standard format | 3/10 |

**Why Chosen**: v1.9.0 follows semantic versioning correctly - new features/improvements without breaking changes warrant MINOR bump.

---

### Consequences

**Positive**:
- Clear version progression (v1.8.0 → v1.9.0)
- Semantic versioning compliance
- Room for v1.9.1, v1.9.2 patches if needed

**Negative**:
- Version numbers increase quickly - Mitigation: Semantic versioning handles this appropriately

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Version confusion | L | Changelog clearly documents changes |

---

### Implementation

**Affected Systems**:
- SKILL.md (version number in metadata)
- Changelog (new entry for v1.9.0)

**Rollback**: Version number is metadata; can be adjusted if needed.

---

---

## ADR-006: Test Framework Selection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-20 |
| **Deciders** | AI Orchestrator (Opus 4.5), User (Michel) |
| **Approval** | Approved at Test Planning checkpoint |

---

### Context

The post-upgrade testing phase requires validating 44 JS modules, 14 MCP tools, and 17 shell scripts. A consistent testing approach is needed to verify all components work correctly after the template upgrade. The existing codebase already uses a custom test pattern with results objects tracking pass/fail/skip states.

### Constraints
- No new dependencies should be introduced to the project
- Tests must integrate with existing CI/validation workflows
- Must support async operations common in MCP tools and scripts

---

### Decision

**Summary**: Use the existing custom test framework pattern (results object with pass/fail/skip tracking) rather than adopting an external test framework.

**Details**: Each test file exports a `runTests()` function that returns a results object with `{ passed: [], failed: [], skipped: [], summary: {} }`. This pattern is already established in the codebase and provides sufficient capability for validation testing.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Custom Framework (Chosen)** | No dependencies, consistent with codebase, simple | Less features, no watch mode | 8/10 |
| Jest | Rich features, snapshots, mocking | Heavy dependency, config overhead | 6/10 |
| Vitest | Fast, modern, ESM-native | New dependency, learning curve | 6/10 |
| Mocha | Flexible, well-established | Requires assertion library, setup time | 5/10 |

**Why Chosen**: The custom framework maintains consistency with existing test files in the codebase, avoids introducing new dependencies that would require maintenance, and provides all the functionality needed for validation testing.

---

### Consequences

**Positive**:
- Zero new dependencies to maintain
- Immediate familiarity for contributors who know the codebase
- Lightweight, fast execution

**Negative**:
- No built-in watch mode - Mitigation: Can add file watcher script if needed
- Less sophisticated mocking - Mitigation: Use simple stub functions for most cases

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing edge cases | M | Comprehensive test coverage planning |
| Inconsistent test patterns | L | Document standard test structure |

---

### Implementation

**Affected Systems**:
- All test files in `scripts/tests/`
- Validation runner scripts
- CI/validation workflows

**Rollback**: Tests are additive; can simply remove or disable individual test files if issues arise.

---

---

## ADR-007: Test Execution Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-20 |
| **Deciders** | AI Orchestrator (Opus 4.5), User (Michel) |
| **Approval** | Approved at Test Planning checkpoint |

---

### Context

The test surface includes 75+ components across different domains (JS modules, MCP tools, shell scripts). Running all tests sequentially would be slow and inefficient. A strategy is needed to maximize coverage while maintaining reasonable execution time.

### Constraints
- Some tests have dependencies on shared resources (database, filesystem)
- MCP tool tests require server availability
- Test execution time should remain under 5 minutes for rapid iteration

---

### Decision

**Summary**: Execute tests in parallel using 5 domain-specific workstreams that can run concurrently without resource conflicts.

**Details**: Tests are grouped into workstreams by domain:
1. **Core Utilities** - Input normalizer, path resolver, data loader
2. **Memory System** - Context generation, memory indexing, search
3. **Validation System** - Validation rules, checklist validators
4. **MCP Tools** - Memory search, save, index management tools
5. **Shell Scripts** - Bash utilities, validation runners

Each workstream manages its own resources and can execute independently.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel (5 workstreams)** | Fast, organized, scalable | Complexity in coordination | 9/10 |
| Sequential | Simple, deterministic | Slow execution (10+ min) | 5/10 |
| Random order | Catches hidden dependencies | Hard to reproduce failures | 4/10 |
| Priority-based | Tests critical paths first | May miss edge cases | 6/10 |

**Why Chosen**: Parallel execution with domain grouping provides the best balance of speed and reliability. The workstream structure naturally aligns with component boundaries, reducing resource contention.

---

### Consequences

**Positive**:
- Estimated 3-5x speedup vs sequential
- Natural organization by domain
- Easy to add new tests to appropriate workstream

**Negative**:
- Coordination complexity - Mitigation: Clear workstream boundaries and documentation
- Potential race conditions - Mitigation: Isolated resources per workstream

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Resource contention | M | Separate test databases per workstream |
| Flaky tests from timing | L | Add retry logic for transient failures |

---

### Implementation

**Affected Systems**:
- Test runner script
- Workstream configuration
- Results aggregation

**Rollback**: Can switch to sequential execution by running workstreams one at a time.

---

---

## ADR-008: MCP Tool Testing Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-20 |
| **Deciders** | AI Orchestrator (Opus 4.5), User (Michel) |
| **Approval** | Approved at Test Planning checkpoint |

---

### Context

MCP tools (14 total) require a running MCP server to fully exercise the protocol layer. However, full protocol testing is slow and requires complex setup. Most bugs occur in the business logic layer, not the MCP transport layer.

### Constraints
- MCP server startup takes 2-3 seconds
- Protocol-level tests require end-to-end setup
- Business logic can be tested independently of transport

---

### Decision

**Summary**: Use direct module import testing for business logic, supplemented by integration tests for MCP protocol interactions.

**Details**: Test files import tool handler functions directly and test them in isolation. A smaller set of integration tests verify the MCP protocol layer works correctly with 2-3 representative tools (memory_search, memory_save, index_status).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Direct import + integration (Chosen)** | Fast iteration, good coverage | Some protocol edge cases missed | 8/10 |
| Full MCP protocol testing | Complete coverage | Slow, complex setup | 5/10 |
| Unit tests only | Very fast | Misses integration issues | 6/10 |

**Why Chosen**: Direct import testing catches 90%+ of bugs with 10% of the setup complexity. Integration tests cover the critical protocol path without requiring full protocol testing for every tool.

---

### Consequences

**Positive**:
- Fast test iteration (sub-second for most tests)
- Easy to debug failures (direct function calls)
- Catches most business logic bugs

**Negative**:
- Some protocol edge cases not covered - Mitigation: Integration tests for critical paths
- Tests may pass when protocol has issues - Mitigation: Periodic full integration test runs

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Protocol bugs in production | M | Integration test suite for key flows |
| Missing serialization issues | L | Test input/output schemas explicitly |

---

### Implementation

**Affected Systems**:
- MCP tool test files
- Tool handler exports
- Integration test harness

**Rollback**: Can add more integration tests if direct testing proves insufficient.

---

---

## ADR-009: Coverage Scope and Prioritization

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-20 |
| **Deciders** | AI Orchestrator (Opus 4.5), User (Michel) |
| **Approval** | Approved at Test Planning checkpoint |

---

### Context

30+ modules currently lack test coverage. Attempting 100% coverage immediately would delay the upgrade validation significantly. A prioritization strategy is needed to maximize value within time constraints.

### Constraints
- Limited time for initial test creation
- Some modules are more critical than others
- Technical debt must be managed, not eliminated immediately

---

### Decision

**Summary**: Focus on P0 (critical path) modules first, then systematically expand coverage to P1 and P2 components.

**Details**:
- **P0 (Critical)**: Modules on the critical path for spec folder creation, memory operations, and validation. Tested first.
- **P1 (Important)**: Modules supporting common workflows. Tested in second phase.
- **P2 (Standard)**: Modules handling edge cases or optional features. Tested as time permits.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **P0-first prioritization (Chosen)** | High-value coverage quickly | Some gaps remain | 8/10 |
| 100% coverage attempt | Complete coverage | Significant time investment | 5/10 |
| Random/alphabetical | Easy to track | May miss critical modules | 3/10 |
| Newest code first | Catches recent bugs | Ignores stable but critical code | 4/10 |

**Why Chosen**: Prioritization ensures the most critical functionality is verified first. This provides confidence in the upgrade while allowing incremental improvement of coverage over time.

---

### Consequences

**Positive**:
- Critical paths verified quickly
- Clear prioritization framework for future test additions
- Manageable scope for initial implementation

**Negative**:
- Some modules remain untested initially - Mitigation: Track coverage debt and address incrementally
- May miss bugs in lower-priority modules - Mitigation: Add tests when bugs are found

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Bug in untested P2 module | L | User reports, add test when found |
| Prioritization misjudgment | M | Review prioritization with stakeholder input |

---

### Implementation

**Affected Systems**:
- Test planning documentation
- Coverage tracking
- CI/validation thresholds

**Rollback**: Prioritization is a planning decision; can be adjusted at any time based on findings.

---

---

## Decision Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Multi-agent parallel dispatch | Accepted | High - enables enterprise-scale analysis |
| ADR-002 | Retain CORE + ADDENDUM v2.0 | Accepted | High - preserves optimization gains |
| ADR-003 | Workstream notation standard | Accepted | Medium - enables coordination |
| ADR-004 | Three analysis documents | Accepted | Medium - clear deliverables |
| ADR-005 | Version bump to v1.9.0 | Accepted | Low - versioning housekeeping |
| ADR-006 | Custom test framework | Accepted | Medium - testing consistency |
| ADR-007 | Parallel 5-workstream execution | Accepted | High - testing efficiency |
| ADR-008 | Direct import + integration MCP tests | Accepted | Medium - MCP coverage strategy |
| ADR-009 | P0-first coverage prioritization | Accepted | High - focus on critical paths |

---

## Approval Tracking

| ADR | Proposed | Reviewed | Accepted | Implemented |
|-----|----------|----------|----------|-------------|
| ADR-001 | 2026-01-19 | 2026-01-19 | 2026-01-19 | 2026-01-19 |
| ADR-002 | 2026-01-19 | 2026-01-19 | 2026-01-19 | 2026-01-20 |
| ADR-003 | 2026-01-19 | 2026-01-19 | 2026-01-19 | 2026-01-19 |
| ADR-004 | 2026-01-19 | 2026-01-19 | 2026-01-19 | 2026-01-19 |
| ADR-005 | 2026-01-20 | 2026-01-20 | 2026-01-20 | 2026-01-20 |
| ADR-006 | 2026-01-20 | 2026-01-20 | 2026-01-20 | Pending |
| ADR-007 | 2026-01-20 | 2026-01-20 | 2026-01-20 | Pending |
| ADR-008 | 2026-01-20 | 2026-01-20 | 2026-01-20 | Pending |
| ADR-009 | 2026-01-20 | 2026-01-20 | 2026-01-20 | Pending |

---

<!--
Level 3+ Decision Record - Full ADR format
- 9 Architecture Decision Records
- ADR-001 to ADR-005: Refinement phase decisions
- ADR-006 to ADR-009: Testing phase decisions
- Each with full context, alternatives, consequences
- Approval tracking table
- Implementation status per ADR
-->
