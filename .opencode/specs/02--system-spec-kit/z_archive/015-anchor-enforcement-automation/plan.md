---
title: "Implementation Plan: Anchor Enforcement Automation [132-anchor-enforcement-automation/plan]"
description: "Implements multi-layer enforcement system preventing spec documentation creation without template/anchor compliance. Three enforcement points: (1) Pre-flight validation gates in..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "anchor"
  - "enforcement"
  - "automation"
  - "132"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Anchor Enforcement Automation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (anchor-generator.ts, MCP server), Bash (validation scripts) |
| **Framework** | Node.js, MCP Server Protocol, Agent Dispatch System |
| **Storage** | File system (templates), SQLite (memory database) |
| **Testing** | Vitest (TS tests), Bash test harness (validation scripts) |

### Overview
Implements multi-layer enforcement system preventing spec documentation creation without template/anchor compliance. Three enforcement points: (1) Pre-flight validation gates in @speckit agent, (2) Automated ANCHOR tag generation in templates, (3) Runtime validation in MCP memory save operations. Modifies 7 files across agent definitions, validation scripts, and template generation logic.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2-3)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (validate.sh, anchor-generator.ts, agent routing)
- [x] Root cause analysis completed (documented in research findings)

### Definition of Done
- [ ] All P0 requirements implemented and tested
- [ ] validate.sh catches 100% of template/anchor violations
- [ ] @speckit routing enforcement prevents bypass attempts
- [ ] ANCHOR tags auto-generated for all template sections
- [ ] Tests passing (vitest suite + bash validation tests)
- [ ] Documentation updated (AGENTS.md, speckit.md, system-spec-kit SKILL.md)
- [ ] Checklist.md P0/P1 items completed with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Layered Enforcement with Defense-in-Depth**

Three independent validation layers ensure compliance even if one layer fails:
1. **Agent Dispatch Layer** - Routing enforcement at orchestration level
2. **Template Generation Layer** - ANCHOR tags embedded at creation time
3. **Runtime Validation Layer** - Pre-flight checks before file writes

### Key Components

- **Speckit Agent Router** (`.opencode/agent/chatgpt/speckit.md`): Exclusive entry point for spec file creation, validates templates before write
- **Template Validator** (`scripts/spec/validate.sh`): Multi-rule validation engine checking template source headers, ANCHOR tag completeness, placeholder removal
- **ANCHOR Generator** (`scripts/lib/anchor-generator.ts`): Automatic ANCHOR tag wrapping for all major sections in templates
- **Orchestrator Enforcer** (`.opencode/agent/chatgpt/orchestrate.md`): Gate 3 routing logic with HARD BLOCK on @speckit bypass attempts
- **MCP Memory Validator** (`mcp_server/src/routes/memory/save.ts`): Pre-flight ANCHOR validation before memory file persistence

### Data Flow

```
User Request → Gate 3 (orchestrate.md) → Route to @speckit ONLY
                                            ↓
                            @speckit loads template → ANCHOR Generator wraps sections
                                            ↓
                            Content filled → Pre-flight validate.sh check
                                            ↓
                            Validation PASS → File written to spec folder
                                            ↓
                            Memory save → MCP validates ANCHOR tags → Indexed
```

**Enforcement Guarantee**: If any layer fails validation, file write is blocked with clear error message and remediation guidance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research & Analysis (COMPLETED)
- [x] Root cause analysis of non-compliance patterns
- [x] Under-utilization analysis of @speckit agent
- [x] Template structure investigation
- [x] Existing validation gap identification
- [x] Evidence gathering from codebase

### Phase 2: Validation Enhancement (4-6 hours)
- [ ] **Task 1**: Extend validate.sh with template source header check
- [ ] **Task 2**: Add ANCHOR tag requirement validation for spec docs
- [ ] **Task 3**: Implement template hash verification (informational warnings)
- [ ] **Task 4**: Add clear error messages with fix guidance
- [ ] **Task 5**: Create validation test suite with edge cases

### Phase 3: ANCHOR Auto-Generation (3-4 hours)
- [ ] **Task 6**: Enhance anchor-generator.ts to detect major sections
- [ ] **Task 7**: Auto-wrap template sections with ANCHOR tags
- [ ] **Task 8**: Preserve existing ANCHOR tags (no overwrites)
- [ ] **Task 9**: Add ANCHOR ID collision detection
- [ ] **Task 10**: Update template files with ANCHOR coverage

### Phase 4: Agent Routing Enforcement (4-5 hours)
- [ ] **Task 11**: Update speckit.md with pre-flight validation gates
- [ ] **Task 12**: Modify orchestrate.md with HARD BLOCK enforcement
- [ ] **Task 13**: Add routing violation detection in file write paths
- [ ] **Task 14**: Implement emergency bypass logging mechanism
- [ ] **Task 15**: Update AGENTS.md with clarified Gate 3 rules

### Phase 5: MCP Integration (2-3 hours)
- [ ] **Task 16**: Add ANCHOR validation in memory/save.ts
- [ ] **Task 17**: Implement pre-flight check before file write
- [ ] **Task 18**: Add validation bypass for scratch/ folder
- [ ] **Task 19**: Integrate with check-anchors.sh validation

### Phase 6: Documentation & Testing (2-3 hours)
- [ ] **Task 20**: Update system-spec-kit SKILL.md with new enforcement
- [ ] **Task 21**: Create migration guide for legacy specs
- [ ] **Task 22**: Write integration tests for all enforcement layers
- [ ] **Task 23**: Document emergency bypass procedures
- [ ] **Task 24**: Complete implementation-summary.md

### Phase 7: Verification & Completion (1-2 hours)
- [ ] **Task 25**: Run full validation suite on all existing specs
- [ ] **Task 26**: Verify checklist.md P0/P1/P2 completion
- [ ] **Task 27**: Gather evidence for each checklist item
- [ ] **Task 28**: Save context to memory with generate-context.js
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | anchor-generator.ts ANCHOR wrapping logic | Vitest |
| Unit | validate.sh rule execution (each rule isolated) | Bash test harness |
| Integration | Full spec creation flow through @speckit | Manual agent dispatch |
| Integration | Gate 3 routing enforcement scenarios | Orchestrator dispatch tests |
| Regression | Existing specs still pass validation | validate.sh on all spec folders |
| Edge Cases | Partial templates, missing sections, malformed ANChORS | Vitest + bash tests |
| Manual | User experience with error messages and fix guidance | Developer testing |

### Test Scenarios

**Positive Cases**:
- Valid spec with proper ANCHOR tags → validation passes
- Template with all required sections → validation passes
- @speckit dispatch for spec creation → routing succeeds

**Negative Cases**:
- Spec missing ANCHOR tags → validation fails with clear error
- Spec missing `SPECKIT_TEMPLATE_SOURCE` header → validation blocks write
- @general attempts spec file write → routing violation error
- Orphaned ANCHOR closing tag → check-anchors.sh reports line number
- Template with placeholders unfilled → validation fails with placeholder list
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| anchor-generator.ts | Internal | Green | ANCHOR auto-generation fails, manual tags required |
| check-anchors.sh | Internal | Green | ANCHOR validation skipped, non-compliance undetected |
| validate.sh | Internal | Green | Pre-flight checks disabled, validation only post-write |
| @speckit agent definition | Internal | Green | Routing enforcement impossible, compliance unenforceable |
| Template files (level_1-3+) | Internal | Green | No source for validation, cannot verify compliance |
| MCP Memory Server | Internal | Yellow | Memory file validation disabled, affects memory/ only |
| Orchestrator dispatch logic | Internal | Green | Cannot enforce Gate 3 routing, bypass possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation causing >5% false positive rate OR blocking legitimate spec creation
- **Procedure**:
  1. Set environment variable `SPECKIT_SKIP_VALIDATION=true` to disable enforcement
  2. Revert changes to speckit.md, orchestrate.md, validate.sh
  3. Re-deploy previous versions of modified files
  4. Notify users of rollback and request bug reports
  5. Investigate false positive causes, fix validation logic
  6. Re-enable enforcement after fix validation
- **Data Reversal**: Not applicable (no data migrations)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Research) ────────► COMPLETED
                                │
                                ↓
Phase 2 (Validation) ──┬──► Phase 3 (ANCHOR Gen) ──┬──► Phase 5 (MCP)
                       │                            │
                       └──► Phase 4 (Agent Routing) ┘
                                                    │
                                                    ↓
                       Phase 6 (Documentation) ──► Phase 7 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research | None | All phases (COMPLETED) |
| Validation Enhancement | Research | MCP Integration |
| ANCHOR Auto-Generation | Research | MCP Integration |
| Agent Routing Enforcement | Research | Documentation |
| MCP Integration | Validation, ANCHOR Gen | Documentation |
| Documentation & Testing | Validation, ANCHOR Gen, Routing | Verification |
| Verification & Completion | Documentation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research & Analysis | High | 6-8 hours (COMPLETED) |
| Validation Enhancement | Medium | 4-6 hours |
| ANCHOR Auto-Generation | Medium | 3-4 hours |
| Agent Routing Enforcement | High | 4-5 hours |
| MCP Integration | Low | 2-3 hours |
| Documentation & Testing | Medium | 2-3 hours |
| Verification & Completion | Low | 1-2 hours |
| **Total** | | **22-31 hours** (16-23 hours remaining) |

**Parallel Opportunities**: Phase 2 (Validation) and Phase 3 (ANCHOR) can run simultaneously. Phase 4 (Routing) can start after Phase 1 completes, in parallel with Phases 2-3.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created of all modified files (git commit before merge)
- [ ] Feature flag `SPECKIT_SKIP_VALIDATION` tested and documented
- [ ] Monitoring: validation failure rate tracked in logs
- [ ] Emergency bypass procedure documented and tested

### Rollback Procedure
1. **Immediate action**: Set `SPECKIT_SKIP_VALIDATION=true` in environment
2. **Revert code**: `git revert <commit-hash>` for enforcement changes
3. **Verify rollback**: Create test spec without ANCHOR tags, verify acceptance
4. **Notify stakeholders**: Post in dev channel, update changelog
5. **Root cause analysis**: Gather validation logs, identify false positive patterns
6. **Fix and re-deploy**: Patch validation logic, re-enable enforcement

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no database schema changes)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────┐     ┌──────────────────────┐
│  anchor-generator │────►│  Template Files      │
│      .ts          │     │  (level_1-3+/*.md)   │
└───────────────────┘     └──────────┬───────────┘
                                     │
                                     ↓
┌───────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  check-anchors.sh │────►│   validate.sh        │────►│  @speckit agent │
│  (ANCHOR rules)   │     │  (orchestrator)      │     │  (dispatch)     │
└───────────────────┘     └──────────┬───────────┘     └────────┬────────┘
                                     │                            │
                                     ↓                            ↓
                          ┌──────────────────────┐     ┌─────────────────┐
                          │  MCP Memory Server   │     │  orchestrate.md │
                          │  (memory/save.ts)    │     │  (Gate 3 routing)│
                          └──────────────────────┘     └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| anchor-generator.ts | None | ANCHOR-wrapped templates | Template files, validate.sh |
| check-anchors.sh | None | ANCHOR validation rules | validate.sh |
| validate.sh | check-anchors.sh, templates | Validation pass/fail | @speckit agent |
| @speckit agent | validate.sh | Spec files | None |
| orchestrate.md | @speckit definition | Agent dispatch decisions | None |
| MCP memory/save.ts | check-anchors.sh | Memory file validation | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 2 (Validation)** - 4-6 hours - CRITICAL (blocks MCP integration)
2. **Phase 4 (Agent Routing)** - 4-5 hours - CRITICAL (blocks documentation)
3. **Phase 6 (Documentation)** - 2-3 hours - CRITICAL (blocks verification)
4. **Phase 7 (Verification)** - 1-2 hours - CRITICAL (final gate)

**Total Critical Path**: 11-16 hours

**Parallel Opportunities**:
- Phase 3 (ANCHOR Gen) can run parallel to Phase 2 (Validation)
- Phase 5 (MCP) can start immediately after Phase 2 completes, parallel to Phase 4
- Testing in Phase 6 can overlap with documentation writing
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Research Complete | Root cause analysis documented, gaps identified | COMPLETED |
| M2 | Validation Layer Done | validate.sh catches all template/ANCHOR violations | End of Phase 2 |
| M3 | Routing Enforced | @speckit is ONLY path for spec file creation | End of Phase 4 |
| M4 | Integration Complete | All 3 layers (validation, routing, MCP) operational | End of Phase 5 |
| M5 | Launch Ready | All P0/P1 items complete, tests passing, docs updated | End of Phase 7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Three-Layer Enforcement vs Single Validation Point

**Status**: Accepted

**Context**: Need to prevent spec documentation creation without template/ANCHOR compliance. Could implement single validation point (e.g., only at file write) or multiple independent layers.

**Decision**: Implement three independent validation layers (agent dispatch, template generation, runtime validation) with defense-in-depth approach.

**Consequences**:
- **Positive**: Redundancy ensures compliance even if one layer fails or is bypassed
- **Positive**: Clear error messages at each layer improve user experience
- **Positive**: Can disable individual layers without breaking entire system
- **Negative**: More code to maintain (3 validation implementations)
- **Mitigation**: Share validation logic in check-anchors.sh, called from all layers

**Alternatives Rejected**:
- **Single validation at file write**: Too late, files already generated, harder to debug
- **Only agent dispatch enforcement**: Can be bypassed by manual file creation
- **Only template generation**: Doesn't catch manual edits or alternative creation paths

### ADR-002: Auto-Generate vs Require Manual ANCHOR Tags

**Status**: Accepted

**Context**: ANCHOR tags are required for structured memory retrieval, but manual tagging is error-prone and often skipped.

**Decision**: Auto-generate ANCHOR tags for all major sections (## headings) in templates, preserve existing tags on regeneration.

**Consequences**:
- **Positive**: Zero-effort compliance for template users
- **Positive**: Consistent ANCHOR ID format across all specs
- **Negative**: Less flexibility for custom ANCHOR IDs
- **Mitigation**: Allow manual override by preserving existing tags

**Alternatives Rejected**:
- **Require manual tags**: High error rate, poor compliance
- **Validate-only without auto-generation**: Doesn't solve root cause (forgetting to add tags)
- **Auto-generate on ALL headings**: Too granular, clutters memory queries

### ADR-003: Hard Block vs Warning for Violations

**Status**: Accepted

**Context**: Validation can either block file writes (hard block) or allow writes with warnings (soft enforcement).

**Decision**: Hard block on P0 violations (missing template source, mismatched ANChORS), warnings on P1/P2 (missing optional sections).

**Consequences**:
- **Positive**: Guarantees 100% compliance for critical requirements
- **Positive**: Clear distinction between blockers and nice-to-haves
- **Negative**: Can frustrate users if false positives occur
- **Mitigation**: Provide clear error messages with fix guidance, emergency bypass flag

**Alternatives Rejected**:
- **All warnings**: Poor compliance, defeats purpose of enforcement
- **All hard blocks**: Too rigid, blocks legitimate edge cases
- **User-configurable per spec**: Too complex, inconsistent enforcement

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md (sections 1-3), plan.md (sections 1-4)
**Agent**: @research (root cause analysis), @context (system investigation)
**Dependencies**: None
**Parallelism**: None (foundational understanding required)
**Completion**: Phase 1 (COMPLETED)

### Tier 2: Parallel Implementation
**Files**: validate.sh, anchor-generator.ts, check-anchors.sh
**Agents**: @general (3 parallel instances, one per file)
**Dependencies**: Tier 1 complete
**Parallelism**: High (independent file modifications)
**Completion**: Phases 2-3

### Tier 3: Integration & Enforcement
**Files**: speckit.md, orchestrate.md, memory/save.ts
**Agents**: @general (sequential, agent definitions have dependencies)
**Dependencies**: Tier 2 complete
**Parallelism**: Low (routing logic interdependent)
**Completion**: Phases 4-5

### Tier 4: Documentation & Verification
**Files**: AGENTS.md, system-spec-kit SKILL.md, implementation-summary.md, checklist.md
**Agents**: @speckit (spec docs), @write (general docs), @review (verification)
**Dependencies**: Tier 3 complete
**Parallelism**: Medium (docs independent, verification sequential)
**Completion**: Phases 6-7

### Agent Resource Allocation

| Tier | Agents | Parallelism | Duration |
|------|--------|-------------|----------|
| 1 | 2 | Sequential | COMPLETED |
| 2 | 3 | Parallel | 4-6 hours |
| 3 | 3 | Sequential | 6-8 hours |
| 4 | 3 | Semi-parallel | 3-5 hours |
| **Total** | **11** | **Mixed** | **13-19 hours** |

**Coordination Protocol**: Orchestrator dispatches Tier 2 agents in parallel, waits for completion, then dispatches Tier 3 sequentially with handoff Context Packages between agents.

### Pre-Task Checklist

Before starting any task in this spec:
- [ ] Read relevant section in spec.md to understand requirements
- [ ] Review corresponding phase in plan.md for technical approach
- [ ] Check tasks.md for dependencies and blocking tasks
- [ ] Verify checklist.md for quality gates applicable to this task
- [ ] Load prior context from memory/ if resuming work

### Task Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ | Complete tasks in dependency order (see [B:T###] markers) | HARD |
| TASK-SCOPE | Only modify files listed in task scope | HARD |
| TASK-TEST | Run validation/tests before marking complete | HARD |
| TASK-DOC | Update checklist.md with evidence after completion | SOFT |
| TASK-SAVE | Save context to memory/ at phase boundaries | SOFT |

### Status Reporting Format

When reporting task completion:
```
Task: T### - [Task Name]
Status: [COMPLETE | IN PROGRESS | BLOCKED]
Evidence: [Tool output, file paths, test results]
Files Modified: [List of changed files]
Next: [Next task ID or blocking issue]
```

### Blocked Task Protocol

If a task cannot be completed:
1. Mark task as BLOCKED in tasks.md with reason
2. Document blocking issue in scratch/
3. Attempt resolution (max 3 attempts)
4. If still blocked: Report to user with options (skip, defer, escalate)
5. Do NOT proceed to dependent tasks while blocked
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:governance -->
## L3+: GOVERNANCE & APPROVAL

### Change Impact Assessment

| Dimension | Impact Level | Affected Systems | Mitigation |
|-----------|--------------|------------------|------------|
| User Workflow | High | Spec creation process | Clear error messages, migration guide |
| System Stability | Low | Validation scripts only | Rollback flag available |
| Documentation | Medium | AGENTS.md, speckit.md | Update all references simultaneously |
| Testing | Low | Existing specs unaffected | Regression suite validates legacy |

### Approval Gates

| Gate | Criteria | Approver | Status |
|------|----------|----------|--------|
| Design Approval | Architecture decisions documented | System Architect | Pending |
| Implementation Review | Code changes peer-reviewed | Tech Lead | Pending |
| Testing Sign-off | All test scenarios passing | QA Lead | Pending |
| Documentation Approval | All docs updated and clear | Product Owner | Pending |
| Launch Approval | Rollback plan tested, monitoring ready | Engineering Manager | Pending |

### Communication Plan

| Stakeholder | Message | Channel | Timing |
|-------------|---------|---------|--------|
| All developers | Enforcement changes announcement | Dev channel | Before Phase 4 merge |
| Spec authors | Migration guide for legacy specs | Documentation site | With Phase 7 completion |
| System architects | ADR decisions and rationale | Architecture review | Phase 3 completion |
| Management | Compliance improvement metrics | Status report | Phase 7 completion |
<!-- /ANCHOR:governance -->

---

<!--
LEVEL 3+ PLAN (~450 lines)
- Core + L2 + L3 + L3+ addendums
- Comprehensive ANCHOR tag coverage
- AI execution framework with tier-based parallelism
- Governance and approval workflow
-->
