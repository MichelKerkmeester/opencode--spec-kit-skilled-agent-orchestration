---
title: "Implementation Plan: System-Spec-Kit Known Limitations Remediation [088-speckit-known-limitations-remediation/plan]"
description: "Fix 4 known limitations from the 087-speckit-deep-analysis: unify the memory_conflicts SQLite table schema via migration v12, fix stale Gate 4/6 references across 7+ files, add ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "system"
  - "spec"
  - "kit"
  - "088"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: System-Spec-Kit Known Limitations Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js), Bash, Markdown |
| **Framework** | MCP Server (system-spec-kit) |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Manual verification + grep validation |

### Overview

Fix 4 known limitations from the 087-speckit-deep-analysis: unify the `memory_conflicts` SQLite table schema via migration v12, fix stale Gate 4/6 references across 7+ files, add 3 undocumented scripts to capability tables, and clean up minor signal handler gaps. All research is complete — this is pure implementation.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (087 known-limitations.md)
- [x] Success criteria measurable (REQ-001 through REQ-010)
- [x] Dependencies identified (shared symlink, SQLite limitations)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-010)
- [ ] Verification greps pass (zero stale references)
- [ ] Database migration tested (schema correct after migration)

---

## 3. ARCHITECTURE

### Pattern
Direct file modifications + SQLite schema migration

### Key Components
- **vector-index.js**: Migration runner, schema definitions, SCHEMA_VERSION constant
- **prediction-error-gate.js**: Conflict evaluation logic, table creation, INSERT path
- **memory-save.js**: Memory save handler, conflict INSERT path
- **context-server.js**: Signal handlers, shutdown cleanup

### Data Flow
```
Memory save request
    → prediction-error-gate.evaluate_memory()
    → Returns action (CREATE/CREATE_LINKED/UPDATE/SUPERSEDE/REINFORCE)
    → memory-save.js INSERT into memory_conflicts  ← CURRENTLY FAILS (column mismatch)
    → prediction-error-gate.log_conflict() INSERT  ← CURRENTLY FAILS (column mismatch)
```

After fix: both INSERT paths use the same unified column set.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: SQLite Schema Unification (KL-1) [P0]

1. **Design unified `memory_conflicts` schema** merging Schema A (vector-index.js) and Schema C (prediction-error-gate.js) columns
2. **Add migration v12** to vector-index.js migrations object:
   - DROP TABLE IF EXISTS memory_conflicts
   - CREATE TABLE with unified schema (includes CHECK constraint with CREATE_LINKED)
3. **Update `create_schema()`** in vector-index.js to use unified DDL
4. **Update SCHEMA_VERSION** to 12
5. **Remove `ensure_conflicts_table()`** from prediction-error-gate.js
6. **Fix memory-save.js INSERT** to match unified column names
7. **Fix prediction-error-gate.js `log_conflict()` INSERT** to match unified column names
8. **Remove error swallowing** in both INSERT callers (let errors propagate to logs)

### Phase 2: Gate Numbering Fixes (KL-2) [P1]

Phase 2a — Active files:
1. `.opencode/agent/orchestrate.md` line 231: `Gate 4` → `Gate 3`
2. `AGENTS.md` line 503: `Gate 4 Option B` → `Gate 3 Option B`
3. `scripts-registry.json` lines 45, 54: `Gate 6` → `Completion Verification Rule`
4. `scripts/README.md` lines 136, 244, 325: `Gate 6` → `Completion Verification Rule`
5. `scripts/spec/check-completion.sh` line 44: `Gate 6` → `Completion Verification Rule`

Phase 2b — Legacy install guide:
6. `SET-UP - AGENTS.md`: Rewrite gate table (lines 125-131) and flow diagram (lines 135-168) to current 3-gate + behavioral rules scheme
7. Update validation checklist (line 968) and appendix (line 1057)

### Phase 3: Script Documentation (KL-3) [P1]

1. Add `archive.sh`, `check-completion.sh`, `recommend-level.sh` to `speckit.md` Capability Scan table
2. Add same 3 scripts to `SKILL.md` Key Scripts table

### Phase 4: Signal Handler Cleanup (KL-4) [P1]

1. Import `toolCache` in context-server.js (or access via existing reference)
2. Add `toolCache.stopCleanupInterval()` to SIGINT and SIGTERM handlers
3. Remove duplicate `process.on('SIGINT')` and `process.on('SIGTERM')` from access-tracker.js

### Phase 5: Verification

1. Verify migration: check `PRAGMA user_version` = 12, `.schema memory_conflicts` shows unified columns
2. Verify gate refs: `grep -rn "Gate [456]"` across all active files = 0 matches
3. Verify scripts: all 6 scripts listed in speckit.md and SKILL.md
4. Verify handlers: read context-server.js shutdown section, confirm toolCache cleanup present

---

## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Schema | Migration v12 output | `sqlite3 .schema memory_conflicts` |
| INSERT | All 5 action types | Trigger memory save with varying similarity scores |
| Grep | Gate references | `grep -rn "Gate [456]"` across ecosystem |
| Grep | Script documentation | `grep -n "archive.sh\|check-completion.sh\|recommend-level.sh"` in speckit.md, SKILL.md |
| Read | Signal handlers | Verify context-server.js cleanup section |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite 12-step ALTER TABLE limitation | Technical | Green | Using DROP+recreate (audit table, data loss acceptable) |
| Shared `.opencode/` symlink | Infrastructure | Green | All changes propagate to all projects |
| 087 known-limitations.md research | Documentation | Green | Complete |

---

## 7. ROLLBACK PLAN

- **Trigger**: Migration v12 causes unexpected errors or data loss beyond `memory_conflicts`
- **Procedure**: `git revert` the commit; database stays at v12 but with correct schema (no rollback needed for schema itself)

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (SQLite) ──────────────────┐
Phase 2 (Gates)  ──── (independent) ├──► Phase 5 (Verify)
Phase 3 (Scripts) ─── (independent) │
Phase 4 (Signals) ─── (independent) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (SQLite) | None | Phase 5 |
| Phase 2 (Gates) | None | Phase 5 |
| Phase 3 (Scripts) | None | Phase 5 |
| Phase 4 (Signals) | None | Phase 5 |
| Phase 5 (Verify) | All phases | None |

Phases 1-4 are fully independent and can be executed in parallel.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC |
|-------|------------|---------------|
| Phase 1 (SQLite) | Medium | ~80-100 LOC |
| Phase 2 (Gates) | Low | ~40-60 LOC |
| Phase 3 (Scripts) | Low | ~15 LOC |
| Phase 4 (Signals) | Low | ~10 LOC |
| Phase 5 (Verify) | Low | 0 LOC (grep/read checks) |
| **Total** | | **~145-185 LOC** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup current database (copy context-index.sqlite)
- [ ] Note current SCHEMA_VERSION (`PRAGMA user_version`)
- [ ] Verify on main branch

### Rollback Procedure
1. `git revert` the commit
2. Database schema stays at v12 (no code references old schema anymore, so this is safe)
3. If needed: restore database backup

### Data Reversal
- **Has data migrations?** Yes (DROP+recreate `memory_conflicts`)
- **Reversal procedure**: Restore from database backup. `memory_conflicts` is audit-only, so data loss is acceptable.
