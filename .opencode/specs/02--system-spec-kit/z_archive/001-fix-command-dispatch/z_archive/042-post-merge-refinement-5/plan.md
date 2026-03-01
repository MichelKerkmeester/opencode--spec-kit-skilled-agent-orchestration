---
title: "Implementation Plan: post-merge-refinement-5 - Technical Approach & Architecture [042-post-merge-refinement-5/plan]"
description: "Implementation plan defining technical approach, project structure, and execution strategy for Spec Kit Memory system bug fixes and refinements."
trigger_phrases:
  - "implementation"
  - "plan"
  - "post"
  - "merge"
  - "refinement"
  - "042"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: post-merge-refinement-5 - Technical Approach & Architecture

Implementation plan defining technical approach, project structure, and execution strategy for Spec Kit Memory system bug fixes and refinements.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: spec-kit-memory, bug-fix, refinement, mcp-server
- **Priority**: P0-critical (7 critical bugs) + P1-high (8 significant issues) + P2-medium (10 refinements)
- **Branch**: `042-post-merge-refinement-5`
- **Date**: 2025-12-25
- **Spec**: See `spec.md` for full analysis

### Input
Comprehensive analysis from post-merge refinement phases 1-4, identifying 25 issues across the Spec Kit Memory MCP server implementation.

### Summary
Address critical bugs affecting system stability and data integrity (P0), significant issues impacting user experience and documentation consistency (P1), and quality refinements for long-term maintainability (P2). Total estimated effort: ~51 hours across 3 phases.

### Technical Context

- **Language/Version**: JavaScript (Node.js 18+)
- **Primary Dependencies**: better-sqlite3, @anthropic-ai/mcp-toolkit, Ollama (embeddings)
- **Storage**: SQLite (vec_memories, meta_memories tables)
- **Testing**: Manual verification, integration tests
- **Target Platform**: MCP server (macOS/Linux)
- **Project Type**: single-project - monolithic `.opencode/skill/system-spec-kit/`
- **Performance Goals**: <100ms trigger matching, <500ms semantic search
- **Constraints**: Must maintain backward compatibility with existing memory files
- **Scale/Scope**: ~500+ memory files, 10+ active spec folders

---

## 2. QUALITY GATES

**GATE: Must pass before Phase 1 implementation. Re-check after each phase.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented (25 issues identified)
- [x] Stakeholders identified; decisions path agreed (solo developer)
- [x] Constraints known; risks captured (backward compatibility required)
- [x] Success criteria measurable (all P0/P1 resolved, P2 optional)

### Definition of Done (DoD)
- [ ] All acceptance criteria met; tests passing
- [ ] Docs updated (spec/plan/checklist)
- [ ] Performance/error budgets respected
- [ ] Rollback verified or not needed

### Rollback Guardrails
- **Stop Signals**: Database corruption, startup failures, memory search returning empty results
- **Recovery Procedure**: Restore from database backup (created before each migration)

### Constitution Check (Complexity Tracking)

No violations expected. All changes are bug fixes or incremental improvements to existing architecture.

---

## 3. PROJECT STRUCTURE

### Architecture Overview

MCP server with SQLite backend providing semantic search over memory files. Uses Ollama for local embeddings generation.

**Key Architectural Decisions:**
- **Pattern**: Service layer with SQLite persistence
- **Data Flow**: Request-response (MCP protocol)
- **State Management**: Database-backed with LRU caching

```
┌─────────────────────────────────────────────────────────┐
│                    MCP Client                           │
└─────────────────────┬───────────────────────────────────┘
                      │ JSON-RPC
┌─────────────────────▼───────────────────────────────────┐
│                 MCP Server                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ memory_*    │  │ checkpoint_*│  │ maintenance_*   │  │
│  │ tools       │  │ tools       │  │ tools           │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │          │
│  ┌──────▼────────────────▼───────────────────▼────────┐ │
│  │              vector-index.js                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│  │  │ LRU Cache│  │ Embedding│  │ Hybrid Search    │  │ │
│  │  │ (triggers)│  │ Generator│  │ (semantic+text)  │  │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │ │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    SQLite Database                       │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │  vec_memories   │  │  meta_memories              │   │
│  │  (embeddings)   │  │  (metadata + triggers)      │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Documentation (This Feature)

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5
  spec.md              # Full analysis and issue inventory
  plan.md              # This file
  checklist.md         # Task tracking with priorities
  tasks.md             # Detailed task breakdown
  memory/              # Session context preservation
```

### Source Code (Repository Root)

```
.opencode/skill/system-spec-kit/
  mcp-server/
    src/
      vector-index.js     # Core indexing and search (P0-001, P0-002, P0-005, P0-007)
      index.js            # MCP tool definitions
      hybrid-search.js    # Search implementation
    db/
      memory.db           # SQLite database
      migrations/         # Schema migrations (P0-003)
  scripts/
    generate-context.js   # Memory file generation
    validate-spec.js      # Spec folder validation (P1-008)
  SKILL.md               # Skill documentation (P1-001)
  commands/              # Command definitions (P1-001, P1-002)
```

### Structure Decision

Selected Option 1 (single project) because all changes are within the existing `.opencode/skill/system-spec-kit/` directory structure. No new projects or major architectural changes required.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Critical Bug Fixes (P0) - IMMEDIATE

- **Goal**: System stability and data integrity - fix all critical bugs blocking reliable operation
- **Deliverables**:
  - P0-001: Duplicate getConstitutionalMemories removed
  - P0-002: Column name mismatch fixed
  - P0-003: related_memories column added
  - P0-004: Missing functions implemented
  - P0-005: Empty trigger phrases resolved
  - P0-006: Checkpoint embeddings included
  - P0-007: includeContiguity passthrough fixed
- **Owner**: Developer
- **Duration**: 2-3 days (~12 hours)
- **Parallel Tasks**: 
  - [P] P0-001, P0-002, P0-007 (independent fixes)
  - [P] P0-003, P0-004 (database/startup)
  - P0-005, P0-006 (larger, sequential)

**Task Details:**

| ID | Task | Est. | Dependencies | Files |
|----|------|------|--------------|-------|
| P0-001 | Remove duplicate getConstitutionalMemories at line 1111, export cached version from line 209 | 1h | None | vector-index.js |
| P0-002 | Update code to use `last_accessed` instead of `last_accessed_at` | 30m | None | vector-index.js |
| P0-003 | Add migration for `related_memories` column | 1h | None | migrations/, vector-index.js |
| P0-004 | Implement verifyIntegrityWithPaths() and cleanupOrphans() | 2h | None | vector-index.js |
| P0-005 | Add fallback extraction for trigger phrases (headers, paths, folder names) | 3h | None | vector-index.js |
| P0-006 | Modify checkpoint create/restore to include vec_memories | 4h | None | vector-index.js |
| P0-007 | Pass includeContiguity to hybridSearch.searchWithFallback() | 30m | None | vector-index.js |

**Verification Criteria:**
- [ ] No runtime errors on MCP server startup
- [ ] Constitutional memory caching verified (same results, faster subsequent calls)
- [ ] Checkpoint round-trip preserves embeddings
- [ ] All P0 bugs have manual test verification

### Phase 2: Significant Issues (P1) - THIS SPRINT

- **Goal**: User experience and documentation consistency
- **Deliverables**:
  - P1-001: Gate numbering aligned across all docs
  - P1-002: Step count corrected to 14
  - P1-003: Level 1 requirements aligned
  - P1-004: Deprecated constitutional files cleaned
  - P1-005: LRU cache properly implemented
  - P1-006: Content hash comparison added
  - P1-007: Trigger cache invalidation fixed
  - P1-008: Validation false positives resolved
- **Owner**: Developer
- **Duration**: 2-3 days (~11 hours)
- **Parallel Tasks**:
  - [P] P1-001, P1-002, P1-003 (documentation)
  - [P] P1-005, P1-006, P1-007 (caching)
  - P1-004, P1-008 (database/validation)

**Task Details:**

| ID | Task | Est. | Dependencies | Files |
|----|------|------|--------------|-------|
| P1-001 | Update SKILL.md and command files for consistent gate numbering | 2h | None | SKILL.md, commands/*.md |
| P1-002 | Update complete.md to show 14 steps | 30m | None | commands/complete.md |
| P1-003 | Decide and align Level 1 requirements (AGENTS.md + SKILL.md) | 1h | None | AGENTS.md, SKILL.md |
| P1-004 | Query/update deprecated files with constitutional tier | 1h | P0-003 | vector-index.js |
| P1-005 | Implement proper LRU with access time tracking | 2h | P0-002 | vector-index.js |
| P1-006 | Add content hash comparison before re-indexing | 2h | None | vector-index.js |
| P1-007 | Call clearCache() after save/update/delete operations | 1h | None | vector-index.js |
| P1-008 | Make implementation-summary.md optional for new specs | 1h | None | validate-spec.js |

**Verification Criteria:**
- [ ] Gate numbering consistent across AGENTS.md, SKILL.md, and all command files
- [ ] Level requirements match in all documentation
- [ ] Cache behavior correct (LRU eviction, invalidation)
- [ ] Validation accurate (no false positives on new spec folders)

### Phase 3: Refinements (P2) - ONGOING

- **Goal**: Quality improvement and technical debt reduction
- **Deliverables**: 10 refinements prioritized by impact
- **Owner**: Developer
- **Duration**: 1-2 weeks (~28 hours)
- **Parallel Tasks**: All P2 items can be done in any order after Phase 2

**Task Details (by priority):**

| ID | Task | Est. | Priority | Files |
|----|------|------|----------|-------|
| P2-001 | Add database indexes for common queries | 1h | High | migrations/ |
| P2-005 | Add health check endpoint | 2h | High | index.js |
| P2-006 | Document all scripts (JSDoc/README) | 3h | High | scripts/*.js |
| P2-002 | Standardize timestamps (ISO 8601) | 3h | Medium | vector-index.js |
| P2-003 | Add schema version tracking | 2h | Medium | migrations/ |
| P2-004 | Improve error messages with actionable guidance | 4h | Medium | all *.js |
| P2-007 | Add --fix flag to validation script | 4h | Lower | validate-spec.js |
| P2-008 | Add checkpoint comparison tool | 3h | Lower | index.js |
| P2-009 | Add fuzzy trigger matching | 4h | Lower | vector-index.js |
| P2-010 | Add pagination to search results | 2h | Lower | vector-index.js |

**Verification Criteria:**
- [ ] Database queries measurably faster with indexes
- [ ] Health check returns meaningful status
- [ ] All scripts have documentation

### Phase 4: Deployment & Verification

- **Goal**: Verify all fixes in production environment
- **Deliverables**:
  - All phases verified working
  - Documentation updated
  - Checkpoint created for rollback
- **Owner**: Developer
- **Duration**: 1 day
- **Parallel Tasks**: None (sequential verification)

---

## 5. TESTING STRATEGY

### Test Pyramid

```
        /\
       /E2E\      <- Full MCP workflow tests
      /------\
     /  INTEG \   <- Database + embedding integration
    /----------\
   /   UNIT     \  <- Function-level tests
  /--------------\
```

### Unit Tests

- **Scope**: Individual functions (getConstitutionalMemories, LRU cache, trigger extraction)
- **Tools**: Manual verification, console.log debugging
- **Coverage Target**: All P0 fixes verified
- **Execution**: Before committing each fix

### Integration Tests

- **Scope**: Database operations, MCP tool responses, checkpoint create/restore
- **Tools**: MCP client testing via Claude
- **Coverage Target**: All modified tools tested
- **Execution**: After each phase completion

### End-to-End Tests

- **Scope**: Complete workflows (save memory -> search -> find)
- **Tools**: Claude Code MCP integration
- **Coverage Target**: Memory save, search, checkpoint, validation workflows
- **Execution**: Before marking phase complete

### Test Data & Environments

- **Test Data**: Existing memory files in specs/ directories
- **Environments**: Development (local MCP server)
- **Database**: Backup before migrations, test on copy first

### CI Quality Gates

- [x] Manual testing for each fix
- [ ] No runtime errors on startup
- [ ] Memory search returns expected results
- [ ] Checkpoint restore preserves data
- [ ] Validation script runs without false positives

---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| P0 bugs resolved | 7/7 (100%) | Manual verification |
| P1 issues resolved | 8/8 (100%) | Manual verification |
| P2 refinements | Best effort | Checklist tracking |
| Runtime errors | 0 | Server startup test |

### Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Trigger match time | <100ms | Console timing |
| Semantic search time | <500ms | Console timing |
| Startup time | <2s | Manual observation |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Documentation alignment | 100% | Manual review |
| Backward compatibility | Maintained | Existing memories work |
| Code duplication | Eliminated | No duplicate functions |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Database migration breaks existing data | High | Low | Backup before migration, test on copy first | Dev |
| R-002 | Embedding changes invalidate search | High | Low | Preserve existing embeddings, only re-index when needed | Dev |
| R-003 | LRU cache changes cause memory issues | Medium | Low | Set reasonable cache limits, monitor usage | Dev |
| R-004 | Trigger extraction changes miss edge cases | Medium | Medium | Test with variety of memory file types | Dev |
| R-005 | Checkpoint format change breaks restore | High | Medium | Version checkpoint format, support both old/new | Dev |

### Rollback Plan

- **Rollback Trigger**: Database corruption, startup failure, search returning wrong results
- **Rollback Procedure**:
  1. Stop MCP server
  2. Restore database from backup (created before Phase 1)
  3. Revert code changes via git
  4. Restart MCP server
- **Data Migration Reversal**: Database backups include full schema and data
- **Verification**: Memory search returns expected results, startup completes without errors

---

## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Timeline | Impact if Blocked |
|------------|------|-------|--------|----------|-------------------|
| vector-index.js | Core | Dev | Green | Ongoing | All P0 blocked |
| SQLite database | Storage | Dev | Green | Ongoing | All features blocked |
| generate-context.js | Script | Dev | Green | Ongoing | Memory save blocked |
| validate-spec.js | Script | Dev | Green | Ongoing | Validation blocked |

### External Dependencies

| Dependency | Type | Vendor | Status | Timeline | Impact if Blocked |
|------------|------|--------|--------|----------|-------------------|
| better-sqlite3 | Library | npm | Green | Stable | Database access blocked |
| Ollama | Service | Local | Green | Ongoing | Embedding generation blocked |
| MCP Protocol | Standard | Anthropic | Green | Stable | Client communication blocked |

---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Developer**: Solo developer (all roles)

### Checkpoints

- **Phase 1 Complete**: All P0 bugs fixed and verified
- **Phase 2 Complete**: All P1 issues resolved
- **Phase 3 Progress**: P2 items addressed as time permits

### Approvals

- **Technical Design**: Self-review
- **Implementation**: Self-review
- **Completion**: Checklist verification

---

## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for full analysis and issue inventory
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Checklist**: See `checklist.md` for task tracking

### Related Spec Folders

- `041-post-merge-refinement-4/` - Previous refinement phase
- `040-mcp-server-rename/` - Recent MCP server updates
- `039-node-modules-consolidation/` - Dependency cleanup
- `037-post-merge-refinement-2/` - Earlier bug fixes

### Dependency Graph

```
P0-001 ──┐
P0-002 ──┼── Phase 1 Complete ──┐
P0-003 ──┤                      │
P0-004 ──┤                      ├── P1-004 (needs clean DB)
P0-005 ──┤                      │
P0-006 ──┤                      ├── P1-005 (cache fixes)
P0-007 ──┘                      │
                                ├── P1-006 (indexing)
                                │
                                └── Phase 2 Complete ── P2-* (any order)
```

### Timeline Summary

| Phase | Duration | Start | End | Hours |
|-------|----------|-------|-----|-------|
| Phase 1 (P0) | 2-3 days | Day 1 | Day 3 | ~12h |
| Phase 2 (P1) | 2-3 days | Day 4 | Day 6 | ~11h |
| Phase 3 (P2) | 1-2 weeks | Day 7 | Day 14+ | ~28h |
| **Total** | **~2 weeks** | | | **~51h** |

---

## IMPLEMENTATION NOTES

### Phase 1 Execution Order (Recommended)

1. **Backup database** - Critical first step
2. P0-002 (column name) - Quick fix, unblocks P1-005
3. P0-001 (duplicate function) - Quick cleanup
4. P0-007 (passthrough) - Quick fix
5. P0-003 (migration) - Database change
6. P0-004 (missing functions) - Startup sequence
7. P0-005 (trigger extraction) - Larger change
8. P0-006 (checkpoint embeddings) - Largest change

### Key Files Summary

| File | Changes |
|------|---------|
| `vector-index.js` | P0-001 through P0-007, P1-004 through P1-007 |
| `validate-spec.js` | P1-008 |
| `SKILL.md` | P1-001, P1-003 |
| `commands/*.md` | P1-001, P1-002 |
| `AGENTS.md` | P1-003 |
| `migrations/` | P0-003, P2-001, P2-003 |
