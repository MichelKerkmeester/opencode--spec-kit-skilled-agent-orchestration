---
title: "Implementation Plan: Post-Merge Refinement Final [043-post-merge-refinement-final/plan]"
description: "Duration: 3-4 days | Effort: ~10 hours"
trigger_phrases:
  - "implementation"
  - "plan"
  - "post"
  - "merge"
  - "refinement"
  - "043"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Post-Merge Refinement Final

| **Field** | **Value** |
|-----------|-----------|
| **Level** | 3 |
| **Estimated Effort** | 37 hours |
| **Duration** | 2-3 weeks |
| **Phases** | 4 |

## Phase 1: Critical Fixes (P0)
**Duration:** 3-4 days | **Effort:** ~10 hours

### Tasks

| Task | Description | Effort | Dependencies |
|------|-------------|--------|--------------|
| P0-001 | Remove duplicate getConstitutionalMemories | 1h | None |
| P0-002 | Fix verifyIntegrityWithPaths (implement or remove call) | 1h | None |
| P0-003 | Fix cleanupOrphans (implement or remove reference) | 1h | None |
| P0-004 | Fix column name: last_accessed_at → last_accessed | 1h | None |
| P0-005 | Add related_memories column migration | 1h | None |
| P0-006 | Create validate-spec.sh script | 2h | None |
| P0-007 | Create recommend-level.sh script | 1h | None |
| P0-008 | Update MCP tool documentation to match actual names | 2h | None |

### Verification Gate
- [ ] MCP server starts without errors
- [ ] All P0 issues verified fixed with code review
- [ ] No regression in existing functionality

---

## Phase 2: Documentation Alignment (P1-DOC)
**Duration:** 2-3 days | **Effort:** ~8 hours

### Tasks

| Task | Description | Effort | Dependencies |
|------|-------------|--------|--------------|
| P1-001 | Fix gate numbering: Update SKILL.md to use Gate 4 | 2h | None |
| P1-002 | Fix step count: Update complete.md to 14 steps consistently | 0.5h | None |
| P1-003 | Align Level 1 requirements across AGENTS.md/SKILL.md | 1h | None |
| P1-008 | Fix ALWAYS list numbering gap (14→16) | 0.5h | None |
| P1-009 | Document all scripts in SKILL.md | 1h | None |
| P1-010 | Add context_template.md to template table | 0.5h | None |
| P1-011 | Standardize terminology (Last task vs Last Action) | 1.5h | None |
| P1-013 | Create /help command for command discovery | 1h | None |

### Verification Gate
- [ ] AGENTS.md and SKILL.md aligned on all gates
- [ ] Step counts match across documentation
- [ ] All templates listed in SKILL.md

---

## Phase 3: Feature Fixes (P1-CODE)
**Duration:** 2-3 days | **Effort:** ~7 hours

### Tasks

| Task | Description | Effort | Dependencies |
|------|-------------|--------|--------------|
| P1-004 | Wire includeContiguity through to search | 1.5h | Phase 1 |
| P1-005 | Add trigger cache invalidation after mutations | 1h | Phase 1 |
| P1-006 | Fix LRU cache to use access time, not insertion | 1.5h | Phase 1 |
| P1-007 | Make implementation-summary.md optional for new specs | 1h | P0-006 |
| P1-012 | Include embeddings in checkpoint snapshots | 2h | Phase 1 |

### Verification Gate
- [ ] includeContiguity: true returns adjacent memories
- [ ] New memories immediately findable by triggers
- [ ] Checkpoint restore preserves semantic search capability

---

## Phase 4: Quality Improvements (P2)
**Duration:** 1-2 weeks | **Effort:** ~12 hours

### Tasks (Prioritized)

| Task | Description | Effort | Priority |
|------|-------------|--------|----------|
| P2-001 | Add database indexes | 1h | High |
| P2-004 | Remove process.exit from library functions | 1h | High |
| P2-007 | Document SKILL.md/YAML parity gap | 1h | Medium |
| P2-002 | Standardize timestamp formats | 2h | Medium |
| P2-003 | Fix JSONC parser regex edge case | 1h | Medium |
| P2-005 | Improve level detection regex | 1h | Medium |
| P2-006 | Add more unicode checkmarks | 0.5h | Low |
| P2-008 | Document maintenance tax | 1h | Low |
| P2-009 | Document Level 0 protocol need | 1h | Low |

### Deferred to Future Spec
- P2-010: Unit tests (requires test framework setup)
- P2-011: Integration tests (requires test framework)
- P2-012: CI/CD pipeline (requires infrastructure)
- P3-*: All polish items

---

## Dependency Graph

```
Phase 1 (P0) ─────────────────────────────────────┐
  │                                                │
  ├── P0-001 (duplicate function) ──────────────────┤
  ├── P0-002 (verifyIntegrity) ─────────────────────┤
  ├── P0-003 (cleanupOrphans) ──────────────────────┤
  ├── P0-004 (column name) ─────────────────────────┤
  ├── P0-005 (related_memories) ────────────────────┤
  ├── P0-006 (validate-spec.sh) ──────── P1-007 ────┤
  ├── P0-007 (recommend-level.sh) ──────────────────┤
  └── P0-008 (MCP docs) ────────────────────────────┤
                                                    │
Phase 2 (P1-DOC) ─────────────────────────────────  │
  │                                                 │
  ├── P1-001 to P1-003 (can run parallel) ──────────┤
  └── P1-008 to P1-013 (can run parallel) ──────────┤
                                                    │
Phase 3 (P1-CODE) ────────────────────────────────  │
  │                                                 │
  ├── P1-004 (contiguity) ──────────────────────────┤
  ├── P1-005 (trigger cache) ───────────────────────┤
  ├── P1-006 (LRU cache) ───────────────────────────┤
  ├── P1-007 (depends on P0-006) ───────────────────┤
  └── P1-012 (checkpoint embeddings) ───────────────┤
                                                    │
Phase 4 (P2) ─────────────────────────────────────  │
  │                                                 │
  └── All P2 tasks (can run parallel) ──────────────┘
```

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Database migration | Backup before Phase 1, test on copy |
| Documentation confusion | Announce changes, provide summary |
| Regressions | Full checklist verification after each phase |
| Scope creep | New issues go to separate spec |

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Phase 1 + Phase 2 | P0 fixed, docs aligned |
| 2 | Phase 3 | Feature bugs fixed |
| 3 | Phase 4 | Quality improvements |
