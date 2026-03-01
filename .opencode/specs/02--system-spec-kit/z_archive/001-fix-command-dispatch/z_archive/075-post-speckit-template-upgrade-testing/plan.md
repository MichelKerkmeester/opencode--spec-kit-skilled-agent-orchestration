---
title: "Implementation Plan: Post-SpecKit Template Upgrade Testing [075-post-speckit-template-upgrade-testing/plan]"
description: "This plan implements a comprehensive 5-phase test suite covering the entire SpecKit system post-template-upgrade. The testing strategy validates 44 JavaScript modules across 6 s..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "post"
  - "speckit"
  - "template"
  - "075"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Post-SpecKit Template Upgrade Testing

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js), Shell (Bash/Zsh), SQLite |
| **Framework** | Custom test harness using existing validation patterns |
| **Storage** | SQLite (context-index.sqlite for memory), JSON fixtures |
| **Testing** | Custom test harness, shell script validation, MCP tool verification |

### Overview

This plan implements a comprehensive 5-phase test suite covering the entire SpecKit system post-template-upgrade. The testing strategy validates 44 JavaScript modules across 6 script categories, 17 shell scripts, and 14 MCP tools with cognitive memory features. Tests are organized into parallel workstreams (Templates, Validation, MCP, Scripts, Integration) coordinated through multi-agent orchestration with Tier 1 sequential foundation, Tier 2 parallel domain testing, and Tier 3 integration synthesis.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Spec 073/074 completion verified (template optimization)
- [x] All target modules and tools catalogued

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (all 5 phases green)
- [ ] Docs updated (spec/plan/tasks/checklist)
- [ ] Test coverage report generated
- [ ] Verification agents confirm quality

---

## 3. ARCHITECTURE

### Pattern
Test Harness Architecture with Domain-Isolated Test Suites

### Key Components
- **Test Harness Core**: Central orchestrator managing test execution, result aggregation, and reporting
- **Template Test Suite**: Validates CORE + ADDENDUM v2.0 template structure and composition
- **Validation Test Suite**: Exercises 3 validation approaches (path-scoped, manifest, shell scripts)
- **MCP Test Suite**: Verifies 14 MCP tools including cognitive memory features
- **Script Test Suite**: Tests 44 JS modules across memory, validation, migration, loaders, utils, hooks
- **Integration Test Suite**: End-to-end workflows combining multiple subsystems

### Data Flow
```
Test Inputs (fixtures, configs)
    --> Test Harness Orchestrator
    --> Domain Test Suites (parallel execution)
    --> Result Aggregation
    --> Coverage Report + Pass/Fail Summary
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Template System Tests
- [ ] Test CORE template parsing (spec, plan, tasks, checklist, decision-record)
- [ ] Test ADDENDUM layer composition (L2, L3, L3+ sections)
- [ ] Validate template inheritance and overrides
- [ ] Test compose-templates.mjs script functionality
- [ ] Verify level detection from SPECKIT_LEVEL markers
- [ ] Test 51 template fixtures for structure compliance

### Phase 2: Validation Rule Tests
- [ ] Test path-scoped validation rules (path_scoped_rules.md patterns)
- [ ] Test manifest.json schema validation
- [ ] Test validation shell scripts (validate-spec-folder.sh, etc.)
- [ ] Verify exit code semantics (0=pass, 1=warn, 2=error)
- [ ] Test rule priority and cascade logic
- [ ] Validate error message formatting

### Phase 3: MCP Tool Tests
- [ ] Test memory_search with semantic matching
- [ ] Test memory_match_triggers pattern detection
- [ ] Test memory_save_context workflow
- [ ] Test memory_delete_context cleanup
- [ ] Verify anchor-based retrieval (summary, state, decisions)
- [ ] Test cognitive features (importance tiers, constitutional rules)
- [ ] Validate SQLite persistence layer

### Phase 4: Script Module Tests
- [ ] Test memory scripts (generate-context.js, cleanup-duplicates.js)
- [ ] Test validation scripts (validate.js, check-paths.js)
- [ ] Test migration scripts (migrate-v1.js, backup.js)
- [ ] Test loader scripts (data-loader.js, config-loader.js)
- [ ] Test utility scripts (input-normalizer.js, hash.js)
- [ ] Test hook scripts (pre-commit, post-create)
- [ ] Verify error handling and edge cases

### Phase 5: Integration Tests
- [ ] Test complete spec folder creation workflow
- [ ] Test memory save --> search --> delete lifecycle
- [ ] Test validation pipeline (file --> path-scoped --> manifest --> shell)
- [ ] Test multi-level spec folder generation (L1 --> L2 --> L3 --> L3+)
- [ ] Test cross-workstream synchronization points
- [ ] Verify no regressions from Spec 073/074 changes

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Individual JS modules, shell scripts | Custom test harness, node:test |
| Integration | Multi-module workflows, MCP tool chains | Test harness, fixture files |
| Validation | Template structure, rule compliance | validate-spec-folder.sh, manifest checks |
| Regression | Spec 073/074 preserved functionality | Baseline comparison, 51 fixtures |
| End-to-End | Full spec folder lifecycle | Manual + automated verification |

### Test Fixtures Location
- `scripts/test-fixtures/` - 51 template and validation fixtures
- `database/context-index.sqlite` - Memory persistence testing
- `templates/` - Template composition sources

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js v18+ | External | Green | Cannot run JS modules |
| SQLite3 | External | Green | Memory tests fail |
| Bash/Zsh | External | Green | Shell script tests fail |
| Spec 073/074 completion | Internal | Green | Missing baseline |
| OpenCode MCP server | Internal | Green | MCP tool tests blocked |
| Test fixtures (51) | Internal | Green | Validation tests incomplete |

---

## 7. ROLLBACK PLAN

- **Trigger**: Test harness failures, critical module regressions, database corruption
- **Procedure**:
  1. Stop test execution immediately
  2. Restore database from backup (if corrupted)
  3. Review failed test logs in scratch/
  4. Fix identified issues
  5. Re-run affected test phase only

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Templates) --------+
                            |
Phase 2 (Validation) -------+--> Phase 5 (Integration)
                            |
Phase 3 (MCP) -------------+
                            |
Phase 4 (Scripts) ---------+
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Templates | None | Phase 5 |
| Phase 2: Validation | None | Phase 5 |
| Phase 3: MCP | None | Phase 5 |
| Phase 4: Scripts | None | Phase 5 |
| Phase 5: Integration | Phases 1-4 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Template Tests | Medium | 2-3 hours |
| Phase 2: Validation Tests | Medium | 2-3 hours |
| Phase 3: MCP Tests | High | 3-4 hours |
| Phase 4: Script Tests | High | 4-5 hours |
| Phase 5: Integration Tests | High | 3-4 hours |
| **Total** | | **14-19 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Database backup created (context-index.sqlite)
- [ ] Git stash available for uncommitted changes
- [ ] Test fixtures validated before run

### Rollback Procedure
1. Stop test execution (Ctrl+C or kill process)
2. Check scratch/ for partial outputs
3. Restore database: `cp database/context-index.sqlite.bak database/context-index.sqlite`
4. Review logs and identify failure point
5. Fix and re-run single phase (not full suite)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Database backup restore only

---

## L3: DEPENDENCY GRAPH

```
+------------------+     +------------------+     +------------------+
|   Phase 1        |---->|                  |     |                  |
|   Templates      |     |                  |     |                  |
+------------------+     |                  |     |                  |
                         |                  |     |                  |
+------------------+     |    BARRIER       |     |                  |
|   Phase 2        |---->|    (All P1-4     |---->|   Phase 5        |
|   Validation     |     |    Must Pass)    |     |   Integration    |
+------------------+     |                  |     |                  |
                         |                  |     |                  |
+------------------+     |                  |     |                  |
|   Phase 3        |---->|                  |     |                  |
|   MCP Tools      |     |                  |     |                  |
+------------------+     |                  |     |                  |
                         |                  |     |                  |
+------------------+     |                  |     |                  |
|   Phase 4        |---->|                  |     |                  |
|   Scripts        |     +------------------+     +------------------+
+------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Template Tests | Fixtures | Pass/Fail + Coverage | Integration |
| Validation Tests | Fixtures | Pass/Fail + Coverage | Integration |
| MCP Tests | SQLite, MCP Server | Pass/Fail + Coverage | Integration |
| Script Tests | Node.js, Fixtures | Pass/Fail + Coverage | Integration |
| Integration Tests | All Phase 1-4 | Final Report | None |

---

## L3: CRITICAL PATH

1. **Phase 3: MCP Tool Tests** - 3-4 hours - CRITICAL (most complex, dependencies on server)
2. **Phase 4: Script Module Tests** - 4-5 hours - CRITICAL (44 modules, most volume)
3. **Phase 5: Integration Tests** - 3-4 hours - CRITICAL (validates all prior work)

**Total Critical Path**: 10-13 hours (Phases 3 --> 4 --> 5 sequential if failures)

**Parallel Opportunities**:
- Phase 1 (Templates) and Phase 2 (Validation) can run simultaneously
- Phase 3 (MCP) and Phase 4 (Scripts) can run simultaneously
- All four domain phases (1-4) can run in parallel with workstream agents

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Test Harness Ready | Harness executes, fixtures load | Phase 1 start |
| M2 | Domain Tests Complete | Phases 1-4 all pass | Before Phase 5 |
| M3 | Integration Verified | Phase 5 passes, no regressions | Final |
| M4 | Coverage Report | >80% coverage, all edge cases | Completion |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Custom Test Harness vs External Framework

**Status**: Accepted

**Context**: Need to test diverse components (JS, Shell, MCP, SQLite) with unified reporting. External frameworks (Jest, Mocha) add complexity for shell and MCP testing.

**Decision**: Build custom test harness extending existing validation patterns in scripts/test-fixtures/

**Consequences**:
- Positive: Full control, unified reporting, no external dependencies
- Negative: Initial development time; mitigated by reusing existing patterns

**Alternatives Rejected**:
- Jest: Poor shell script integration
- TAP: Insufficient MCP tool support

### ADR-002: 5-Phase Testing Strategy

**Status**: Accepted

**Context**: 44 JS modules, 17 shell scripts, 14 MCP tools require organized testing approach.

**Decision**: Organize into 5 parallel-capable phases: Templates, Validation, MCP, Scripts, Integration

**Consequences**:
- Positive: Clear boundaries, parallel execution, isolated failures
- Positive: Integration phase validates cross-domain interactions
- Negative: Coordination overhead; mitigated by workstream notation

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md, plan.md (this file), tasks.md
**Duration**: ~60s
**Agent**: Primary Orchestrator
**Tasks**:
- Create spec folder structure
- Generate documentation skeleton
- Initialize test harness configuration

### Tier 2: Parallel Execution
| Agent | Focus | Files | Duration |
|-------|-------|-------|----------|
| W-TEMPLATES Agent | Template system tests | templates/*.md, compose-templates.mjs | ~90s |
| W-VALIDATION Agent | Validation rule tests | validation/*.js, *.sh | ~90s |
| W-MCP Agent | MCP tool tests | mcp_server/*.ts, SQLite | ~90s |
| W-SCRIPTS Agent | Script module tests | scripts/**/*.js | ~90s |
| W-INTEGRATION Agent | Integration tests | End-to-end workflows | ~120s |

**Duration**: ~120s (parallel, longest workstream)

### Tier 3: Integration
**Agent**: Primary Orchestrator
**Task**:
- Merge test results from all workstreams
- Resolve conflicts (if any test touched same file)
- Generate unified coverage report
- Produce final pass/fail summary
**Duration**: ~60s

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-TEMPLATES | Template System Tests | Template Agent | templates/, compose-templates.mjs | Pending |
| W-VALIDATION | Validation Rule Tests | Validation Agent | validation/*.js, validate-*.sh | Pending |
| W-MCP | MCP Tool Tests | MCP Agent | mcp_server/, context-index.sqlite | Pending |
| W-SCRIPTS | Script Module Tests | Scripts Agent | scripts/**/*.js (44 modules) | Pending |
| W-INTEGRATION | Integration Tests | Integration Agent | End-to-end workflows | Blocked on W-TEMPLATES, W-VALIDATION, W-MCP, W-SCRIPTS |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-TEMPLATES, W-VALIDATION complete | Templates + Validation Agents | Template-Validation integration check |
| SYNC-002 | W-MCP, W-SCRIPTS complete | MCP + Scripts Agents | MCP-Scripts integration check |
| SYNC-003 | All workstreams (W-1 to W-4) | All domain agents | Release to W-INTEGRATION |
| SYNC-004 | W-INTEGRATION complete | Primary + All agents | Final verification and report |

### File Ownership Rules
- Each script module owned by ONE workstream (W-SCRIPTS)
- MCP tools exclusively owned by W-MCP
- Templates exclusively owned by W-TEMPLATES
- Cross-workstream testing happens ONLY in W-INTEGRATION
- Conflicts resolved at SYNC points before proceeding

### Workstream Communication Protocol
```
[W-TEMPLATES] --> SYNC-001 ----+
[W-VALIDATION] --> SYNC-001 ---+--> Check: Template rules validate correctly
                                      |
[W-MCP] --> SYNC-002 ----------+      |
[W-SCRIPTS] --> SYNC-002 ------+--> Check: Scripts integrate with MCP
                                      |
                               SYNC-003 --> All domain tests pass
                                      |
                               [W-INTEGRATION] --> End-to-end verification
                                      |
                               SYNC-004 --> Final report, coverage metrics
```

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Test Phase**: Status update in tasks.md (pass/fail/blocked)
- **Per Sync Point**: Workstream leads report to Primary Orchestrator
- **Blockers**: Immediate escalation with evidence (logs, stack traces)

### Escalation Path
1. Test failures --> Retry with verbose logging (scratch/)
2. Persistent failures --> Escalate to Primary Orchestrator
3. Cross-workstream conflicts --> SYNC point resolution
4. Critical blockers --> User notification for decision

### Status Reporting Format
```
[W-{ID}] Phase {N}: {PASS|FAIL|BLOCKED}
  - Tests run: {count}
  - Tests passed: {count}
  - Tests failed: {count}
  - Blockers: {description or "None"}
  - Next: {action or "SYNC-{N}"}
```

---

## APPENDIX A: MODULE INVENTORY

### JavaScript Modules (44 total)

| Category | Module | Test Priority |
|----------|--------|---------------|
| Memory | generate-context.js | P0 |
| Memory | cleanup-duplicates.js | P1 |
| Memory | index-memories.js | P1 |
| Validation | validate.js | P0 |
| Validation | check-paths.js | P0 |
| Validation | schema-validate.js | P1 |
| Migration | migrate-v1.js | P1 |
| Migration | backup.js | P1 |
| Loaders | data-loader.js | P0 |
| Loaders | config-loader.js | P0 |
| Utils | input-normalizer.js | P0 |
| Utils | hash.js | P1 |
| Hooks | pre-commit.js | P1 |
| Hooks | post-create.js | P1 |

### Shell Scripts (17 total)

| Script | Purpose | Test Priority |
|--------|---------|---------------|
| validate-spec-folder.sh | Primary validation | P0 |
| run-validation.sh | Validation orchestrator | P0 |
| compose-templates.sh | Template composition | P0 |
| backup-database.sh | SQLite backup | P1 |

### MCP Tools (14 total)

| Tool | Purpose | Test Priority |
|------|---------|---------------|
| memory_search | Semantic context search | P0 |
| memory_match_triggers | Pattern detection | P0 |
| memory_save_context | Context persistence | P0 |
| memory_delete_context | Context cleanup | P1 |
| memory_list_folders | Folder enumeration | P1 |

---

<!--
LEVEL 3+ PLAN (~400 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework with 3-tier agent coordination
- 5 workstreams with 4 sync points
- Full communication plan with escalation
- Module inventory appendix for test coverage tracking
-->
