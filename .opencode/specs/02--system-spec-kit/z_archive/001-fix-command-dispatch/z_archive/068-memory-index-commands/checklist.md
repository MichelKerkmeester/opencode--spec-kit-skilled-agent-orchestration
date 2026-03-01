---
title: "Validation Checklist: Memory Command Separation - Validation Items [068-memory-index-commands/checklist]"
description: "Checklist for validating the memory command separation implementation."
trigger_phrases:
  - "validation"
  - "checklist"
  - "memory"
  - "command"
  - "separation"
  - "068"
importance_tier: "normal"
contextType: "implementation"
---
# Validation Checklist: Memory Command Separation - Validation Items

Checklist for validating the memory command separation implementation.

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Checklist
- **Tags**: memory-system, commands, refactoring
- **Priority**: P1
- **Type**: Testing & QA - validation during/after implementation

### Purpose
Ensure the command separation preserves all functionality while properly isolating read and write operations.

### Context
- **Created**: 2026-01-16
- **Feature**: [spec.md](./spec.md)
- **Status**: Implementation Complete - Testing Pending

---

## 2. LINKS

### Related Documents
- **Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Task List**: [tasks.md](./tasks.md)
- **Decision Record**: [decision-record.md](./decision-record.md)

---

## 3. CHECKLIST CATEGORIES

### Pre-Implementation Readiness

- [x] CHK001 [P0] Requirements clearly documented in spec.md | Evidence: spec.md sections 1-7 complete
- [x] CHK002 [P0] Technical approach defined in plan.md | Evidence: plan.md 4 phases with diagrams
- [x] CHK003 [P0] Operation mapping complete (what moves where) | Evidence: tasks.md Section 5
- [x] CHK004 [P1] Backup of original search.md created | Evidence: scratch/search-backup-20260116.md

### `/memory:search` Refactoring (Read-Only)

- [x] CHK010 [P0] Section 11 (Cleanup Mode) removed | Evidence: search.md has no cleanup section
- [x] CHK011 [P0] Section 9 (Trigger Edit) removed | Evidence: Triggers view is now read-only (Section 8)
- [x] CHK012 [P0] Section 12 (Tier Promotion) removed | Evidence: No tier promotion in search.md
- [x] CHK013 [P0] Validation actions [v], [x] removed from Memory Detail | Evidence: Section 7 actions are view-only
- [x] CHK014 [P0] Tier promotion action [p] removed from Memory Detail | Evidence: Section 7 has no [p] action
- [x] CHK015 [P0] Trigger edit action [t] removed from Memory Detail | Evidence: Section 7 has no [t] action
- [x] CHK016 [P0] Cleanup action [c] removed from Dashboard | Evidence: Section 5.3 actions: [#], [s], [t], [q] only
- [x] CHK017 [P0] Gate 1 (Cleanup confirmation) removed or marked N/A | Evidence: No gates in search.md
- [x] CHK018 [P1] Frontmatter allowed-tools updated (no write tools) | Evidence: Only Read + read-only MCP tools
- [x] CHK019 [P1] Description updated to emphasize read-only | Evidence: "search and browse - search, load... (read-only)"
- [x] CHK020 [P1] Argument-hint updated (no management options) | Evidence: No cleanup/tier/triggers edit options
- [x] CHK021 [P1] Cross-reference to `/memory:database` added | Evidence: Section 12 Related Commands
- [x] CHK022 [P1] Sections renumbered correctly | Evidence: Sections 1-13 sequential
- [ ] CHK023 [P2] Line count < 400 lines | Current: 500 lines (acceptable deviation, comprehensive docs)

### `/memory:database` Creation (Management)

- [x] CHK030 [P0] File created at `.opencode/command/memory/database.md` | Evidence: File exists
- [x] CHK031 [P0] Frontmatter complete (description, argument-hint, allowed-tools) | Evidence: Lines 1-4
- [x] CHK032 [P0] Gate 1 (Cleanup confirmation) implemented | Evidence: Lines 13-48
- [x] CHK033 [P0] Gate 2 (Delete confirmation) implemented | Evidence: Lines 52-87
- [x] CHK034 [P0] Stats Dashboard mode (no args) implemented | Evidence: Section 5
- [x] CHK035 [P0] Scan mode implemented | Evidence: Section 6
- [x] CHK036 [P0] Scan --force flag supported | Evidence: Section 6 Step 1
- [x] CHK037 [P0] Cleanup mode implemented (from original) | Evidence: Section 7
- [x] CHK038 [P0] Tier management mode implemented | Evidence: Section 8
- [x] CHK039 [P0] Trigger edit mode implemented (from original) | Evidence: Section 9
- [x] CHK040 [P0] Validate mode implemented | Evidence: Section 10
- [x] CHK041 [P0] Delete mode implemented | Evidence: Section 11
- [x] CHK042 [P1] Health check mode implemented | Evidence: Section 12
- [x] CHK043 [P1] Cross-reference to `/memory:search` added | Evidence: Section 15 Related Commands
- [x] CHK044 [P1] MCP Enforcement Matrix complete | Evidence: Section 4
- [x] CHK045 [P1] Error handling section complete | Evidence: Section 14
- [ ] CHK046 [P2] Line count < 500 lines | Current: 700 lines (acceptable, comprehensive gates + modes)

### Functionality Preservation

- [ ] CHK050 [P0] Dashboard mode works in search.md | Pending: Runtime test
- [ ] CHK051 [P0] Semantic search works in search.md | Pending: Runtime test
- [ ] CHK052 [P0] Direct load by ID works in search.md | Pending: Runtime test
- [ ] CHK053 [P0] Load by spec folder works in search.md | Pending: Runtime test
- [ ] CHK054 [P0] Load with anchor works in search.md | Pending: Runtime test
- [ ] CHK055 [P0] Triggers view (read-only) works in search.md | Pending: Runtime test
- [ ] CHK056 [P0] Memory detail view works in search.md | Pending: Runtime test
- [ ] CHK057 [P0] Cleanup gate works in database.md | Pending: Runtime test
- [ ] CHK058 [P0] Tier change works in database.md | Pending: Runtime test
- [ ] CHK059 [P0] Trigger edit works in database.md | Pending: Runtime test
- [ ] CHK060 [P0] Validate works in database.md | Pending: Runtime test
- [ ] CHK061 [P0] Delete gate works in database.md | Pending: Runtime test
- [ ] CHK062 [P1] Scan works in database.md | Pending: Runtime test
- [ ] CHK063 [P1] Health check works in database.md | Pending: Runtime test

### Safety & Isolation

- [x] CHK070 [P0] NO write operations accessible from search.md | Evidence: allowed-tools has no write tools
- [x] CHK071 [P0] NO destructive operations without gate confirmation | Evidence: Gates 1 & 2 in database.md
- [x] CHK072 [P0] Cleanup creates checkpoint before bulk delete | Evidence: Section 7 Pre-Cleanup Safety
- [x] CHK073 [P1] Error messages suggest correct command | Evidence: Section 8 triggers view note

### Documentation

- [x] CHK080 [P1] spec.md complete | Evidence: 4 user stories, success criteria defined
- [x] CHK081 [P1] plan.md complete | Evidence: 4 phases, architecture diagrams
- [x] CHK082 [P1] tasks.md complete | Evidence: 69 tasks across 7 phases
- [x] CHK083 [P1] decision-record.md complete | Evidence: ADR with 3 alternatives evaluated
- [x] CHK084 [P1] Cross-references valid in both commands | Evidence: Both have Related Commands
- [x] CHK085 [P2] Related Commands section updated in both | Evidence: Sections 12 & 15 respectively

### File Organization

- [x] CHK090 [P1] All temporary files placed in scratch/ (not spec root) | Evidence: scratch/search-backup-*.md
- [ ] CHK091 [P1] scratch/ cleaned up before claiming completion | Defer: Keep backup until testing complete
- [ ] CHK092 [P2] Implementation context saved to memory/ | Pending: After testing

---

## VERIFICATION PROTOCOL

### Priority Enforcement

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0] Critical** | HARD BLOCKER | Cannot claim done until complete |
| **[P1] High** | Required | Must complete OR get user approval to defer |
| **[P2] Medium** | Optional | Can defer with documented reason |

### Evidence Format

When marking items complete, include evidence:

```markdown
- [x] CHK001 [P0] Requirements documented | Evidence: [spec.md](./spec.md) sections 1-7
- [x] CHK010 [P0] Cleanup Mode removed | Evidence: search.md no longer contains "CLEANUP MODE"
```

---

## 4. VERIFICATION SUMMARY

```markdown
## Verification Summary
- **Total Items**: 46
- **Verified [x]**: 32/46
- **P0 Status**: 19/27 COMPLETE (8 pending runtime tests)
- **P1 Status**: 12/15 COMPLETE (3 pending)
- **P2 Deferred**: 2 items (line count targets - acceptable deviation)
- **Implementation Date**: 2026-01-16
- **Testing Status**: PENDING - Runtime tests needed for CHK050-CHK063
```

---

## 5. USAGE NOTES

### Test Commands

**`/memory:search` Tests:**
```
/memory:search                           # Dashboard (should work)
/memory:search 42                        # Direct load (should work)
/memory:search 007-auth                  # Folder load (should work)
/memory:search 42 --anchor:summary       # Anchor load (should work)
/memory:search oauth tokens              # Search (should work)
/memory:search triggers                  # Triggers view (should work, read-only)
/memory:search cleanup                   # Should NOT work (moved to db)
```

**`/memory:database` Tests:**
```
/memory:database                               # Stats dashboard (should work)
/memory:database scan                          # Scan (should work)
/memory:database scan --force                  # Force scan (should work)
/memory:database cleanup                       # Cleanup (should gate)
/memory:database tier 42 critical              # Tier change (should work)
/memory:database triggers 42                   # Trigger edit (should work)
/memory:database validate 42 yes               # Validate (should work)
/memory:database delete 42                     # Delete (should gate)
/memory:database health                        # Health check (should work)
```

### Priority Tags
- **[P0]**: Critical - blocks completion
- **[P1]**: High - required OR user-approved deferral
- **[P2]**: Medium - can defer without approval
