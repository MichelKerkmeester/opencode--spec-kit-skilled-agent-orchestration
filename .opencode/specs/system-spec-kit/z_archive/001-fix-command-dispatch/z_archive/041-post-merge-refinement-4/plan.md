---
title: "Implementation [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4/plan]"
description: "Implementation plan defining phased approach to resolve 75+ issues identified by 10-agent analysis."
trigger_phrases:
  - "implementation"
  - "plan"
  - "post"
  - "merge"
  - "refinement"
  - "041"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Post-Merge Refinement 4 - Systematic Issue Remediation

Implementation plan defining phased approach to resolve 75+ issues identified by 10-agent analysis.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: post-merge-refinement, spec-kit-memory, agent-system, documentation
- **Priority**: P0-critical - blocks launch, must ship
- **Branch**: `041-post-merge-refinement-4`
- **Date**: 2025-12-25
- **Spec**: See `spec.md` for full issue analysis

### Input
10-agent analysis report identifying 75+ issues across P0/P1/P2 priority levels.

### Summary
Systematic remediation of issues discovered during post-merge analysis. Organized into 4 phases with validation gates: Phase 1 addresses 11 critical P0 bugs blocking workflows, Phase 2 resolves 25+ P1 documentation and code consistency issues, Phase 3 tackles 15+ P2 UX improvements, and Phase 4 provides comprehensive validation.

### Technical Context

- **Language/Version**: TypeScript (Node.js), Python 3.x, Bash
- **Primary Dependencies**: Spec Kit Memory MCP, LEANN MCP, OpenCode
- **Storage**: SQLite (context-index.sqlite), JSON configs
- **Testing**: Manual validation, MCP tool testing
- **Target Platform**: macOS/Linux (OpenCode CLI)
- **Project Type**: single-project - monolithic .opencode/
- **Performance Goals**: N/A
- **Constraints**: No breaking changes to existing workflows
- **Scale/Scope**: 75+ issues, 4-day remediation

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**GATE: Must pass before Phase 1 implementation. Re-check after each phase.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented (10-agent analysis complete)
- [x] Stakeholders identified; decisions path agreed (solo developer)
- [x] Constraints known; risks captured (see Risk Matrix)
- [x] Success criteria measurable (issue counts per priority)

### Definition of Done (DoD)
- [ ] All P0 issues resolved (11/11)
- [ ] P1 issues resolved (target: 80%)
- [ ] P2 issues resolved (target: 67%)
- [ ] Documentation accuracy verified
- [ ] All MCP tools tested

### Rollback Guardrails
- **Stop Signals**: MCP server fails to start, existing memories corrupted, breaking changes detected
- **Recovery Procedure**: Restore from checkpoint, revert git commits

### Constitution Check (Complexity Tracking)

No violations anticipated - this is remediation of existing complexity.

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Architecture Overview

Remediation touches multiple subsystems:

```
.opencode/
  agents/           <- P0-001: Missing agent files
  scripts/          <- P0-003/004: Missing scripts
  skill/
    system-spec-kit/
      scripts/      <- P0-005/010: Bug fixes
      templates/    <- P0-008: Template consolidation
      database/     <- P1: FTS5 escaping

AGENTS.md           <- P0-002: Agent registry alignment
```

**Key Architectural Decisions:**
- **Pattern**: Fix-in-place (no structural changes)
- **Data Flow**: Maintain existing patterns
- **State Management**: Preserve existing SQLite schema

### Documentation (This Feature)

```
.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4
  spec.md              # Issue analysis and categorization
  plan.md              # This file
  tasks.md             # Detailed task breakdown
  checklist.md         # Validation checklist (Level 3)
  scratch/             # Debug logs, test scripts
  memory/              # Session context preservation
```

### Source Code (Repository Root)

```
.opencode/
  agents/
    AGENT_TEMPLATE.md          <- Create (P0-001)
    research/AGENT.md          <- Verify exists
    frontend-debug/AGENT.md    <- Verify exists
    documentation-writer/AGENT.md <- Create (P0-001)
    webflow-mcp/AGENT.md       <- Verify exists

  scripts/
    skill_advisor.py           <- Verify exists
    agent_advisor.py           <- Verify exists
    validate-spec.sh           <- Create (P0-003)
    recommend-level.sh         <- Create (P0-004)

  skill/
    system-spec-kit/
      scripts/
        generate-context.js    <- Fix empty query (P0-005)
      templates/
        context_template.md    <- Consolidate (P0-008)
        memory/
          context.md           <- Merge and delete (P0-008)
```

### Structure Decision

Selected Option 1 (single project) - all changes within existing .opencode/ structure.

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Critical Fixes (P0) - Day 1

- **Goal**: Resolve all 11 P0 issues that block core workflows
- **Deliverables**:
  - Agent file alignment complete
  - Missing scripts created
  - Critical bugs fixed
  - Template consolidation done
- **Owner**: Solo developer
- **Duration**: 8 hours
- **Parallel Tasks**: P0-001 through P0-004 can run in parallel [P]

| Task ID | Description                                                    | Effort | Risk   | Parallel |
| ------- | -------------------------------------------------------------- | ------ | ------ | -------- |
| P0-001  | Resolve agent file mismatch (create missing, update AGENTS.md) | 30m    | Low    | [P]      |
| P0-002  | Fix template count in SKILL.md (4 not 5)                       | 15m    | Low    | [P]      |
| P0-003  | Create validate-spec.sh script                                 | 2h     | Medium | [P]      |
| P0-004  | Create recommend-level.sh script                               | 1h     | Medium | [P]      |
| P0-005  | Fix empty query bug in generate-context.js                     | 30m    | Low    |          |
| P0-006  | Add simulation mode warning/cleanup                            | 30m    | Low    |          |
| P0-007  | Fix non-TTY crash in generate-context.js                       | 30m    | Low    |          |
| P0-008  | Consolidate duplicate context templates                        | 1h     | Medium |          |
| P0-009  | Add constitutional tier to memory/context.md                   | 15m    | Low    |          |
| P0-010  | Add anchor validation to generate-context.js                   | 1h     | Medium |          |
| P0-011  | Auto-checkpoint before cleanup operations                      | 30m    | Low    |          |

**Phase 1 Total:** ~8 hours

**Validation Gate:**
- [ ] All 11 P0 issues verified fixed
- [ ] No regression in existing functionality
- [ ] MCP server starts without errors
- [ ] Agent routing works correctly

---

### Phase 2: High Priority Fixes (P1) - Day 2

- **Goal**: Resolve documentation drift and code consistency issues
- **Deliverables**:
  - All documentation aligned
  - Version numbers consistent
  - UX quick wins implemented
- **Owner**: Solo developer
- **Duration**: 10 hours
- **Parallel Tasks**: Documentation tasks can run in parallel [P]

#### 2A: Documentation Alignment (4h)

| Task ID    | Description                              | Effort | Parallel |
| ---------- | ---------------------------------------- | ------ | -------- |
| P1-DOC-001 | Fix step count mismatch (13 vs 14)       | 30m    | [P]      |
| P1-DOC-002 | Align version numbers to v16.0.0         | 30m    | [P]      |
| P1-DOC-003 | Fix progressive model documentation      | 30m    | [P]      |
| P1-DOC-004 | Update tool naming consistency           | 1h     | [P]      |
| P1-DOC-005 | Fix AGENTS.md skill references           | 30m    | [P]      |
| P1-DOC-006 | Remove deprecated memory_load references | 30m    | [P]      |

#### 2B: Code Fixes (4h)

| Task ID     | Description                              | Effort |
| ----------- | ---------------------------------------- | ------ |
| P1-CODE-001 | Fix duplicate step_5 in YAML frontmatter | 30m    |
| P1-CODE-002 | Fix FTS5 query escaping                  | 1h     |
| P1-CODE-003 | Fix embedding warmup race condition      | 1h     |
| P1-CODE-004 | Add constitutional memory caching        | 1h     |


**Phase 2 Total:** ~10 hours

**Validation Gate:**
- [ ] All version numbers consistent across files
- [ ] All step counts accurate in documentation
- [ ] /memory:save:quick command works
- [ ] No YAML syntax errors in frontmatter
- [ ] FTS5 queries handle special characters

---

### Phase 3: Medium Priority Fixes (P2) - Day 3

- **Goal**: Improve UX and reduce template complexity
- **Deliverables**:
  - New quick-fix template
  - Progress indicators
  - Lib directory consolidated
- **Owner**: Solo developer
- **Duration**: 8 hours
- **Parallel Tasks**: Template and config tasks can run in parallel [P]

| Task ID | Description                                 | Effort | Parallel |
| ------- | ------------------------------------------- | ------ | -------- |
| P2-001  | Create quick-fix.md template                | 1h     | [P]      |
| P2-002  | Add template decision tree to docs          | 1h     | [P]      |
| P2-003  | Make batch size configurable                | 30m    |          |
| P2-004  | Add progress indicators to long operations  | 2h     |          |
| P2-005  | Simplify mustache conditionals in templates | 1h     |          |
| P2-006  | Add .hashes file for content tracking       | 30m    |          |
| P2-007  | Consolidate duplicate lib directories       | 2h     |          |

**Phase 3 Total:** ~8 hours

**Validation Gate:**
- [ ] New quick-fix template works correctly
- [ ] Progress indicators visible during indexing
- [ ] No duplicate lib files remain
- [ ] Batch size can be configured via env var

---

### Phase 4: Final Validation - Day 4

- **Goal**: Comprehensive testing and documentation finalization
- **Deliverables**:
  - All MCP tools verified
  - All commands tested
  - Documentation accuracy confirmed
  - Completion summary created
- **Owner**: Solo developer
- **Duration**: 7 hours
- **Parallel Tasks**: Tool testing can run in parallel [P]

| Task ID | Description                                           | Effort | Parallel |
| ------- | ----------------------------------------------------- | ------ | -------- |
| VAL-001 | Test all MCP tools (memory_search, memory_save, etc.) | 1h     | [P]      |
| VAL-002 | Test all slash commands (/spec_kit:*, /memory:*)      | 2h     | [P]      |
| VAL-003 | Verify documentation accuracy against code            | 2h     |          |
| VAL-004 | Update analysis-report.md with resolution status      | 1h     |          |
| VAL-005 | Create completion summary document                    | 1h     |          |

**Phase 4 Total:** ~7 hours

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Test Pyramid

```
        /\
       /E2E\      <- Full workflow tests (save context, search, resume)
      /------\
     /  INTEG \   <- MCP tool integration tests
    /----------\
   /   UNIT     \  <- Script validation (validate-spec.sh output)
  /--------------\
```

### Unit Tests

- **Scope**: validate-spec.sh, recommend-level.sh output validation
- **Tools**: Bash assertions, manual verification
- **Coverage Target**: All exit codes tested
- **Execution**: Manual during development

### Integration Tests

- **Scope**: MCP tool chains, generate-context.js → memory_save
- **Tools**: Manual MCP invocation
- **Coverage Target**: All MCP tools callable
- **Execution**: After each phase

### End-to-End Tests

- **Scope**: Complete workflows (new spec folder, save context, search memories)
- **Tools**: Manual testing in OpenCode
- **Coverage Target**: All slash commands
- **Execution**: Phase 4 validation

### Test Data & Environments

- **Test Data**: Use existing spec folders, create test memories
- **Environments**: Development only
- **Database**: Test with backup of context-index.sqlite

### CI Quality Gates

- [ ] All MCP tools respond without error
- [ ] All slash commands execute
- [ ] No breaking changes to existing workflows
- [ ] Documentation matches implementation

<!-- /ANCHOR:testing -->
---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric                 | Target       | Measurement Method     |
| ---------------------- | ------------ | ---------------------- |
| P0 issues resolved     | 11/11 (100%) | Checklist verification |
| P1 issues resolved     | 20/25 (80%)  | Checklist verification |
| P2 issues resolved     | 10/15 (67%)  | Checklist verification |
| Documentation accuracy | 100%         | Manual review          |

### Performance Metrics

| Metric                | Target | Measurement Method |
| --------------------- | ------ | ------------------ |
| MCP tool response     | < 2s   | Manual timing      |
| Memory save operation | < 5s   | Manual timing      |
| Script execution      | < 1s   | Manual timing      |

### Quality Metrics

| Metric              | Target | Measurement Method |
| ------------------- | ------ | ------------------ |
| Regression count    | 0      | Testing            |
| Breaking changes    | 0      | Testing            |
| All commands tested | 100%   | Checklist          |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description                 | Impact | Likelihood | Mitigation Strategy                                  | Owner |
| ------- | --------------------------- | ------ | ---------- | ---------------------------------------------------- | ----- |
| R-001   | Breaking existing memories  | High   | Low        | Test with backup database, checkpoint before changes | Dev   |
| R-002   | Documentation drift recurs  | Medium | Medium     | Add CI check for doc-code sync                       | Dev   |
| R-003   | Merge conflicts during work | Medium | Low        | Work in feature branch, commit frequently            | Dev   |
| R-004   | Incomplete testing          | Medium | Medium     | Use checklist validation, test each phase            | Dev   |
| R-005   | Agent routing breaks        | High   | Low        | Test agent_advisor.py after each agent change        | Dev   |

### Rollback Plan

- **Rollback Trigger**: MCP server fails to start, memories corrupted, agent routing broken
- **Rollback Procedure**:
  1. Restore database from checkpoint: `checkpoint_restore`
  2. Git revert to last known good commit
  3. Restart OpenCode to reload MCP servers
- **Data Migration Reversal**: SQLite database can be restored from checkpoint
- **Verification**: Run `memory_stats` to verify database accessible

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

### Internal Dependencies

| Dependency          | Type     | Owner | Status | Impact if Blocked             |
| ------------------- | -------- | ----- | ------ | ----------------------------- |
| Spec Kit Memory MCP | Internal | Dev   | Green  | Cannot test memory operations |
| LEANN MCP           | Internal | Dev   | Green  | Cannot test code search       |
| Agent system        | Internal | Dev   | Green  | Cannot test agent routing     |

### External Dependencies

| Dependency | Type     | Vendor     | Status | Impact if Blocked          |
| ---------- | -------- | ---------- | ------ | -------------------------- |
| Node.js    | External | nodejs.org | Green  | Cannot run scripts         |
| Python 3   | External | python.org | Green  | Cannot run advisor scripts |

### Prerequisites
- Access to all .opencode/ files
- Ability to modify AGENTS.md
- MCP server restart capability

### Blockers
- None identified

<!-- /ANCHOR:dependencies -->
---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Product**: Solo developer
- **Engineering**: Solo developer
- **Design**: N/A
- **QA**: Solo developer
- **Operations**: Solo developer

### Checkpoints

- **Phase Gates**: After each phase (4 total)
- **Demo**: N/A
- **Review Gates**: Self-review after each phase

### Approvals

- **Technical Design**: Self
- **Security Review**: N/A
- **Product Sign-off**: Self
- **Launch Approval**: Self

---

## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for full issue analysis
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Checklist**: See `checklist.md` for validation

### Additional References

- Prior refinement: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/040-mcp-server-rename`
- Agent system: `.opencode/agents/`
- Spec Kit skill: `.opencode/skill/system-spec-kit/`
- Memory MCP: `.opencode/skill/system-spec-kit/mcp/`

---

## APPENDIX A: TECHNICAL APPROACH DETAILS

### Agent File Resolution (P0-001)

**Approach: Hybrid**
1. Create missing agent files where referenced
2. Update AGENTS.md to match actual agent registry
3. Verify agent_advisor.py triggers align

**Files to create:**
- `.opencode/agents/AGENT_TEMPLATE.md`
- `.opencode/agents/documentation-writer/AGENT.md`

**Files to update:**
- `AGENTS.md` - Agent Registry section

### Template Consolidation (P0-008)

**Approach:**
1. Compare `context_template.md` and `memory/context.md`
2. Merge differences (add constitutional tier from one to other)
3. Delete duplicate file
4. Update all references in scripts

### Script Creation (P0-003, P0-004)

**validate-spec.sh:**
```bash
#!/bin/bash
# Validates spec folder structure
# Exit codes: 0=pass, 1=warn, 2=fail

# Check required files per level
# Validate YAML frontmatter
# Check anchor format
# Return appropriate exit code
```

**recommend-level.sh:**
```bash
#!/bin/bash
# Recommends spec level based on complexity
# Counts LOC, checks indicators
# Outputs: Level 1, 2, or 3
```

---

<!-- ANCHOR:summary -->
## APPENDIX B: ISSUE SUMMARY BY PRIORITY

### P0 Critical (11 items)
1. Missing agent files
2. Agent naming mismatch
3. Template count inconsistency
4. Missing scripts (validate-spec.sh, recommend-level.sh)
5. Empty query bug
6. Simulation mode pollution
7. Non-TTY crash
8. Duplicate context templates
9. Missing constitutional tier
10. Silent anchor failure
11. No undo after cleanup

### P1 High (25+ items)
- Step count mismatches (13 vs 14)
- Version mismatches (v16.0.0 inconsistent)
- Tool naming inconsistency
- Gate complexity issues
- Memory save friction
- Documentation drift
- Lib directory duplication
- FTS5 escaping bugs
- Embedding warmup race
- Constitutional caching needed

### P2 Medium (15+ items)
- Template complexity
- Missing quick-fix template
- Batch size not configurable
- Progress indicators missing
- Mustache conditional complexity
- Content hash tracking

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:summary -->
## TIMELINE SUMMARY

| Phase         | Duration | Cumulative | Key Deliverable         |
| ------------- | -------- | ---------- | ----------------------- |
| Phase 1 (P0)  | 8h       | 8h         | All critical bugs fixed |
| Phase 2 (P1)  | 10h      | 18h        | Documentation aligned   |
| Phase 3 (P2)  | 8h       | 26h        | UX improvements         |
| Phase 4 (Val) | 7h       | 33h        | Full validation         |

**Total Estimated:** 33 hours (~4 working days)
<!-- /ANCHOR:summary -->
