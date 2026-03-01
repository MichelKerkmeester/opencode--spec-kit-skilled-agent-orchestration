---
title: "Memory Command Consolidation [083-memory-command-consolidation/spec]"
description: "Spec ID: 083-memory-command-consolidation"
trigger_phrases:
  - "memory"
  - "command"
  - "consolidation"
  - "spec"
  - "083"
importance_tier: "important"
contextType: "decision"
---
# Memory Command Consolidation

**Spec ID:** 083-memory-command-consolidation
**Created:** 2025-02-02
**Updated:** 2025-02-03
**Verified:** 2025-02-03 (17-agent parallel audit)
**Completed:** 2025-02-03
**Status:** ✅ COMPLETE (100%)
**Priority:** P1
**Level:** 3+ (Full Documentation)

---

## 1. Problem Statement

The `/memory:*` command namespace has grown to **9 separate commands**, creating:
- **Cognitive overload** for users deciding which command to use
- **Functional overlap** between commands (e.g., search vs context)
- **Maintenance burden** with 9 complex command files (avg. 800+ lines each)
- **Deviation from spec** - 082-speckit-reimagined recommended 5-6 commands

### Current Commands (9)

| Command | Lines | Purpose | Complexity |
|---------|-------|---------|------------|
| `/memory:context` | 623 | L1 unified retrieval with intent awareness | HIGH |
| `/memory:search` | 787 | Read-only search and browse | HIGH |
| `/memory:save` | 1101 | Save conversation context | HIGH |
| `/memory:continue` | 739 | Session recovery | HIGH |
| `/memory:learn` | 863 | Capture learnings | HIGH |
| `/memory:correct` | 847 | Fix mistakes | HIGH |
| `/memory:why` | 971 | Decision lineage | HIGH |
| `/memory:database` | 881 | Admin operations | HIGH |
| `/memory:checkpoint` | 657 | State snapshots | HIGH |

**Total: 7,469 lines across 9 commands**

### Related: /spec_kit:* Commands (7)

Also analyzed but **NO consolidation recommended** - these are workflow orchestrators that consume `/memory:*` commands:

| Command | Purpose | Consumes Memory Commands |
|---------|---------|--------------------------|
| `/spec_kit:plan` | Planning workflow | context, why, save |
| `/spec_kit:implement` | Implementation workflow | save, continue, context, why, learn |
| `/spec_kit:complete` | Full lifecycle | save, continue, context, why, learn |
| `/spec_kit:research` | Technical investigation | context, why, save |
| `/spec_kit:resume` | Session continuation | checkpoint, memory tools |
| `/spec_kit:handover` | Session handover | save (companion) |
| `/spec_kit:debug` | Debug delegation | save, why, correct |

**Conclusion:** Keep all 7 `/spec_kit:*` commands - they orchestrate, not duplicate.

---

## 2. Solution Overview

Consolidate from **9 commands → 5 commands** (44% reduction) through:

1. **Absorption** - Merge overlapping commands
2. **Subcommand patterns** - Group related operations
3. **Deletion** - Remove unnecessary commands

### Proposed Structure (5 Commands)

```
/memory:*
├── context    [Tier 1: Core] - Unified retrieval (absorbs search)
├── save       [Tier 1: Core] - Persistence
├── continue   [Tier 1: Core] - Recovery
├── learn      [Tier 2: Learning] - Feedback (absorbs correct)
└── manage     [Tier 3: Admin] - Administration (absorbs database + checkpoint)
```

### Removed Commands

| Command | Action | Reason |
|---------|--------|--------|
| `/memory:search` | Absorbed by context | context is L1, search is redundant L2 |
| `/memory:correct` | Absorbed by learn | Both are "feedback" operations |
| `/memory:why` | **DELETED** | Per user request - not needed |
| `/memory:database` | Renamed to manage | Better naming |
| `/memory:checkpoint` | Absorbed by manage | Admin operation |

---

## 3. Consolidation Details

### 3.1 `/memory:context` ← absorbs `/memory:search`

**Rationale:**
- context.md explicitly states it "makes /memory:search redundant for most use cases"
- context is L1 Orchestration that wraps L2 search operations
- context adds intent-awareness (add_feature, fix_bug, refactor, security_audit, understand)
- Single-call optimization (includeContent: true)

**Migration:**
```
BEFORE: /memory:search "oauth implementation"
AFTER:  /memory:context "oauth implementation"

BEFORE: /memory:search 42
AFTER:  /memory:context 42
```

**Changes Required:**
- Add deprecation notice to search.md
- Ensure context.md handles all search.md argument patterns
- Update documentation references

### 3.2 `/memory:learn` ← absorbs `/memory:correct`

**Rationale:**
- Both are "feedback" mechanisms to improve the system
- `learn` = positive feedback (new insights)
- `correct` = corrective feedback (fix mistakes)
- Infrequently used commands benefit from grouping

**New Subcommand Structure:**
```
/memory:learn [description]           # Capture new learning (default)
/memory:learn correct <id> [type]     # Fix a mistake
/memory:learn undo <id>               # Undo correction
/memory:learn history                 # View correction history
```

**Migration:**
```
BEFORE: /memory:correct 42 superseded 67
AFTER:  /memory:learn correct 42 superseded 67

BEFORE: /memory:correct undo 42
AFTER:  /memory:learn undo 42
```

### 3.3 `/memory:manage` ← absorbs `/memory:database` + `/memory:checkpoint`

**Rationale:**
- database and checkpoint are both administrative operations
- Low-frequency usage doesn't warrant separate commands
- "manage" is more user-friendly than "database"

**New Subcommand Structure:**
```
/memory:manage                        # Stats dashboard (default)
/memory:manage stats                  # Detailed statistics
/memory:manage scan                   # Reindex files
/memory:manage cleanup                # Prune old memories
/memory:manage tier <id> <tier>       # Change importance tier
/memory:manage health                 # System health check
/memory:manage checkpoint create <name>
/memory:manage checkpoint restore <name>
/memory:manage checkpoint list
/memory:manage checkpoint delete <name>
```

**Migration:**
```
BEFORE: /memory:database stats
AFTER:  /memory:manage stats

BEFORE: /memory:checkpoint create "before-refactor"
AFTER:  /memory:manage checkpoint create "before-refactor"
```

### 3.4 `/memory:why` → DELETED

**Rationale:**
- Per user request: "remove the trace / why command all together, its not needed"
- Decision lineage tracing is rarely used
- Complexity not justified by usage frequency

**Migration:**
- Remove all references to `/memory:why` from documentation
- Remove causal graph MCP tool dependencies if no longer needed
- Update spec_kit commands that referenced `/memory:why`

---

## 4. Command Summary

### After Consolidation (5 Commands)

| Command | Purpose | Absorbs | Priority |
|---------|---------|---------|----------|
| `/memory:context` | Unified retrieval | search | Tier 1 |
| `/memory:save` | Persistence | - | Tier 1 |
| `/memory:continue` | Recovery | - | Tier 1 |
| `/memory:learn` | Feedback | correct | Tier 2 |
| `/memory:manage` | Admin | database, checkpoint | Tier 3 |

### Removed Commands (4)

| Command | Action | Replacement |
|---------|--------|-------------|
| `/memory:search` | Deprecated | `/memory:context` |
| `/memory:correct` | Absorbed | `/memory:learn correct` |
| `/memory:database` | Renamed | `/memory:manage` |
| `/memory:checkpoint` | Absorbed | `/memory:manage checkpoint` |
| `/memory:why` | **DELETED** | None - not needed |

---

## 5. Benefits

1. **44% reduction** in command count (9 → 5)
2. **Clear mental model**: Core (3) + Learning (1) + Admin (1)
3. **Aligned with spec**: Matches 082-speckit-reimagined recommendation of 5-6 commands
4. **Reduced cognitive load**: Fewer choices, clearer naming
5. **Progressive disclosure**: Advanced features via subcommands
6. **Maintenance reduction**: Fewer files to maintain

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing workflows | Deprecation notices + transition period |
| User confusion during transition | Clear migration documentation |
| Subcommand complexity | Keep default behaviors intuitive |
| Loss of discoverability | Improve help text and examples |
| spec_kit commands referencing /memory:why | Update all references |

---

## 7. Implementation Phases

### Phase 1: Foundation (P0) ✅
- [x] Add deprecation notice to `/memory:search`
- [x] Verify `/memory:context` handles all search patterns
- [x] Create alias: search → context (temporary)

### Phase 2: Admin Consolidation (P0) ✅
- [x] Create `/memory:manage` from `/memory:database`
- [x] Add checkpoint subcommands to manage
- [x] Deprecate database and checkpoint

### Phase 3: Learning Consolidation (P1) ✅
- [x] Add `correct` subcommand to `/memory:learn`
- [x] Add `undo` and `history` subcommands
- [x] Deprecate `/memory:correct`

### Phase 4: Why Removal (P1) ✅
- [x] Delete `/memory:why` command file
- [x] Update all spec_kit commands that reference it
- [x] Remove causal graph MCP dependencies if unused

### Phase 5: Cleanup (P2) ✅
- [x] Remove deprecated command files
- [x] Update all documentation references
- [x] Remove transition aliases

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Command count | 5 (from 9) |
| User confusion reports | 0 during transition |
| Documentation updates | 100% coverage |
| Backward compatibility | 100% during Phase 1-4 |

---

## 9. spec_kit Command Updates Required

The following `/spec_kit:*` commands reference `/memory:why` and need updates:

| Command | References | Update Action |
|---------|------------|---------------|
| `/spec_kit:plan` | Uses for decision lineage | Remove reference, use memory:context if needed |
| `/spec_kit:implement` | Listed in related commands | Remove from related commands list |
| `/spec_kit:complete` | Listed in next steps | Remove from next steps |
| `/spec_kit:research` | Uses for decision queries | Remove reference |
| `/spec_kit:debug` | Listed in related commands | Remove reference |

---

## 10. References

- **082-speckit-reimagined/spec.md** - Original design recommendations
- **082-speckit-reimagined/decision-record.md** - ADR-008 Tool Organization
- Agent analysis reports (17 parallel agents, 2025-02-02)
  - 10 agents analyzed /memory:* commands
  - 7 agents analyzed /spec_kit:* commands

---

## 11. Appendix: Agent Analysis Summary

### Memory Commands Analyzed (10 Parallel Agents)

| Agent | Target | Key Finding |
|-------|--------|-------------|
| 1 | context.md | L1 orchestration, subsumes search |
| 2 | learn.md | 4-phase workflow, semantic memory |
| 3 | continue.md | Session recovery, SQLite WAL |
| 4 | correct.md | Penalty/boost system, corrections |
| 5 | database.md | 881 lines, 8 modes, admin |
| 6 | checkpoint.md | State snapshots, CONTINUE_SESSION |
| 7 | search.md | 787 lines, read-only, L2 operation |
| 8 | why.md | Lineage tracing, graph traversal |
| 9 | save.md | 1101 lines, core persistence |
| 10 | 082-spec | "5-6 commands recommended" |

### spec_kit Commands Analyzed (7 Parallel Agents)

| Agent | Target | Key Finding |
|-------|--------|-------------|
| 11 | plan.md | 669 lines, 7-step workflow, consumes memory commands |
| 12 | implement.md | 842 lines, 9-step workflow, consumes memory commands |
| 13 | complete.md | 1126 lines, 14-step master orchestrator |
| 14 | research.md | 948 lines, 9-step investigation |
| 15 | resume.md | 627 lines, overlaps with memory:continue |
| 16 | handover.md | 611 lines, companion to memory:save |
| 17 | debug.md | 637 lines, sub-agent delegation |

### Key Insights

1. **All memory commands rated HIGH complexity** - justifies consolidation
2. **context explicitly designed to replace search** - spec-aligned consolidation
3. **learn and correct are both "feedback" mechanisms** - natural grouping
4. **database and checkpoint are admin operations** - natural grouping
5. **why command rarely used** - deletion justified per user request
6. **spec_kit commands are orchestrators** - they consume, not duplicate
7. **spec recommends 5-6 commands** - achieving 5 with this consolidation
