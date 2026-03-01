---
title: "Feature Specification: System-Spec-Kit Known Limitations Remediation [088-speckit-known-limitations-remediation/spec]"
description: "The 087-speckit-deep-analysis remediation identified and fixed 3 critical bugs and 15+ moderate misalignments, but deferred 4 known limitations that require separate implementat..."
trigger_phrases:
  - "feature"
  - "specification"
  - "system"
  - "spec"
  - "kit"
  - "088"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: System-Spec-Kit Known Limitations Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (KL-1), P1 (KL-2, KL-3, KL-4) |
| **Status** | Draft |
| **Created** | 2026-02-05 |
| **Parent** | 087-speckit-deep-analysis |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The 087-speckit-deep-analysis remediation identified and fixed 3 critical bugs and 15+ moderate misalignments, but deferred 4 known limitations that require separate implementation work: (1) existing SQLite databases have a drifted schema with three conflicting DDL definitions causing silent INSERT failures, (2) stale Gate 4/6 references remain in 7 active files plus the legacy install guide, (3) three spec management scripts are undocumented in capability tables, and (4) minor signal handler gaps exist in the MCP server.

### Purpose

All 4 known limitations resolved: conflict tracking data writes succeed, gate numbering is consistent across the entire ecosystem, all spec scripts are discoverable by agents, and MCP server shutdown is fully clean.

---

## 3. SCOPE

### In Scope

- **KL-1**: SQLite `memory_conflicts` table schema unification (migration v12 + INSERT fixes + remove error swallowing)
- **KL-2 Phase 1**: Fix stale Gate 4/6 references in 7 active files
- **KL-2 Phase 2**: Update legacy install guide gate numbering
- **KL-3**: Add 3 undocumented scripts to speckit.md and SKILL.md capability tables
- **KL-4**: Add `toolCache.stopCleanupInterval()` to shutdown handlers, remove duplicate access-tracker handlers

### Out of Scope

- MCP tool details in AGENTS.md — by design, SKILL.md is the right place (see 087 known-limitations.md "Dismissed" section)
- New MCP features or tool additions
- Database data migration (KL-1 uses DROP+recreate for `memory_conflicts` since it's an audit log)

### Files to Change

| File Path | Change Type | KL | Description |
|-----------|-------------|-----|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.js` | Modify | KL-1 | Add migration v12, update create_schema, bump SCHEMA_VERSION |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.js` | Modify | KL-1 | Remove `ensure_conflicts_table()`, align `log_conflict()` INSERT columns |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.js` | Modify | KL-1 | Align INSERT columns, remove error swallowing |
| `.opencode/agent/orchestrate.md` | Modify | KL-2 | Gate 4 → Gate 3 |
| `AGENTS.md` (project root) | Modify | KL-2 | Gate 4 Option B → Gate 3 Option B |
| `.opencode/skill/system-spec-kit/scripts/scripts-registry.json` | Modify | KL-2 | Gate 6 → Completion Verification Rule |
| `.opencode/skill/system-spec-kit/scripts/README.md` | Modify | KL-2 | Gate 6 → Completion Verification Rule |
| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Modify | KL-2 | Gate 6 → Completion Verification Rule |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | KL-2 | Rewrite Gates 0-6 section to current 3-gate scheme |
| `.opencode/agent/speckit.md` | Modify | KL-3 | Add 3 scripts to Capability Scan table |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | KL-3 | Add 3 scripts to Key Scripts table |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | Modify | KL-4 | Add toolCache cleanup to SIGINT/SIGTERM handlers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/access-tracker.js` | Modify | KL-4 | Remove duplicate signal handlers |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Unify `memory_conflicts` table schema across all three DDL definitions | Single canonical DDL used by vector-index.js; prediction-error-gate.js `ensure_conflicts_table()` removed |
| REQ-002 | Add migration v12 that rebuilds `memory_conflicts` with unified schema | `PRAGMA user_version` returns 12 after migration; `.schema memory_conflicts` shows all required columns |
| REQ-003 | Fix INSERT statements in memory-save.js and prediction-error-gate.js to match unified schema | Both INSERT paths succeed without errors when `CREATE_LINKED` action triggers |
| REQ-004 | Remove silent error swallowing on conflict INSERT | Errors from INSERT into `memory_conflicts` propagate (logged, not swallowed) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fix Gate 4 references in active agent/project files | `grep -rn "Gate 4" .opencode/agent/ AGENTS.md` returns 0 matches (except speckit.md internal numbering) |
| REQ-006 | Fix Gate 6 references in active scripts | `grep -rn "Gate 6" .opencode/skill/system-spec-kit/scripts/` returns 0 matches |
| REQ-007 | Update legacy install guide gate section | `grep -n "Gate [0456]" "SET-UP - AGENTS.md"` returns 0 matches |
| REQ-008 | Add archive.sh, check-completion.sh, recommend-level.sh to capability tables | All 3 scripts listed in speckit.md Capability Scan AND SKILL.md Key Scripts |
| REQ-009 | Add toolCache cleanup to shutdown handlers | `stopCleanupInterval()` called in SIGINT/SIGTERM handlers |
| REQ-010 | Remove duplicate access-tracker signal handlers | Only context-server.js registers SIGINT/SIGTERM handlers for access-tracker flush |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `memory_conflicts` INSERT succeeds for all 5 action types (CREATE, CREATE_LINKED, UPDATE, SUPERSEDE, REINFORCE) — verified via test or manual trigger
- **SC-002**: Zero stale Gate 4/5/6 references in any active file across `.opencode/`
- **SC-003**: All 6 spec scripts discoverable in speckit.md and SKILL.md capability tables
- **SC-004**: MCP server SIGINT/SIGTERM handlers clean up all background intervals

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Migration v12 on shared database affects all projects | Medium | `memory_conflicts` is audit-only; DROP+recreate loses no critical data |
| Risk | legacy install guide changes affect onboarding docs | Low | File is not loaded at runtime; documentation-only impact |
| Dependency | SQLite "12-step ALTER TABLE" limitation | Low | Using DROP+recreate (acceptable for audit table) |
| Dependency | Shared `.opencode/` symlink | Medium | All changes are framework-wide via symlink; test on one project first |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Data Integrity
- **NFR-D01**: No memory data loss from migration (only `memory_conflicts` audit table is rebuilt)
- **NFR-D02**: All existing memories, checkpoints, causal edges preserved

### Compatibility
- **NFR-C01**: Migration v12 must work on databases at any version from v4 to v11
- **NFR-C02**: New databases (fresh install) must create the unified schema directly

---

## L2: EDGE CASES

### Database Migration
- Database at version <4 (no `memory_conflicts` table): Migration v4 creates Schema A, then v12 rebuilds it — both run in sequence
- Database already at version 12+: Migration skipped (guard in migration runner)
- Database locked by running MCP server: Migration runs at startup before server accepts connections — no conflict

### Gate References
- speckit.md line 534 uses "Gate 4" for its OWN internal gate numbering (not AGENTS.md gates): Must NOT be changed
- `SET-UP - AGENTS.md` has "Gate 0" (Compaction Check): Replace with note that this is now handled by compaction recovery edge case in gate-enforcement.md

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 13 files, ~150-200 LOC changes |
| Risk | 10/25 | SQLite migration on shared DB; audit table only |
| Research | 5/20 | Already fully researched in 087 known-limitations.md |
| **Total** | **30/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- None — all research completed in 087 known-limitations.md

---

## Cross-References

- **Detailed analysis**: `087-speckit-deep-analysis/known-limitations.md`
- **Parent findings**: `087-speckit-deep-analysis/implementation-summary.md` (Known Limitations section)
