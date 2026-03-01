---
title: "Feature Specification: System-Spec-Kit Deep Analysis & Remediation [087-speckit-deep-analysis/spec]"
description: "Comprehensive audit and remediation of the entire system-spec-kit ecosystem: MCP server code, skill files, agent definitions, command files, constitutional memories, scripts, an..."
trigger_phrases:
  - "feature"
  - "specification"
  - "system"
  - "spec"
  - "kit"
  - "087"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: System-Spec-Kit Deep Analysis & Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## EXECUTIVE SUMMARY

Comprehensive audit and remediation of the entire system-spec-kit ecosystem: MCP server code, skill files, agent definitions, command files, constitutional memories, scripts, and AGENTS.md integration. Found and fixed 3 critical bugs (SQL constraint violation, ghost tool references, stale file references), 15+ moderate misalignments (gate numbering, threshold inconsistencies, missing commands), and performed ecosystem-wide AGENTS.md-to-AGENTS.md migration across 30+ files.

**Key Decisions**: Fix all issues in-place rather than batching into separate specs; standardize on SKILL.md Section 4 as source of truth for template file counts.

**Critical Dependencies**: All changes to `.opencode/` affect all projects sharing the symlink.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 (critical bugs) + P1 (misalignments) |
| **Status** | Complete |
| **Created** | 2026-02-05 |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
6 Opus agents analyzed the system-spec-kit ecosystem and found: (1) a SQL CHECK constraint that silently rejects valid `CREATE_LINKED` PE decisions, losing conflict tracking data; (2) the speckit.md agent references 2 non-existent MCP tools and uses a completely wrong 5-layer architecture instead of the actual 7-layer one; (3) SKILL.md references "AGENTS.md" (renamed to AGENTS.md) 5 times, causing incorrect cross-references for any agent loading the skill. Additionally, 15+ moderate misalignments including stale gate numbers, undocumented tool naming conventions, inconsistent template counts, and skill routing threshold issues.

### Purpose
Eliminate all identified bugs and misalignments so that AI agents loading any part of the spec-kit ecosystem get consistent, correct information about tools, gates, file names, and architecture.

---

## 3. SCOPE

### In Scope
- Fix 3 critical bugs (SQL constraint, ghost tools, stale file references)
- Fix 15 moderate misalignments across documentation and scripts
- Ecosystem-wide AGENTS.md -> AGENTS.md migration (all active files)
- Standardize template file counts/LOC across all documentation
- Boost skill_advisor.py thresholds for memory/context queries
- Fix debug routing conflict in skill_advisor.py
- Document shared-DB architecture in opencode.json

### Out of Scope
- Archived spec folders (`z_archive/`) - historical records, not modified
- Legacy install guide (`install_guides/SET-UP - AGENTS.md`) - separate remediation
- Minor gaps N-1 through N-5 (documentation improvements) - deferred
- MCP server code bugs found by deep analysis agent (BUG-C01, C02, H02-H06) - separate spec

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index.js` | Modify | Add CREATE_LINKED to CHECK constraints |
| `agent/speckit.md` | Modify | Rewrite tool layers table, add commands |
| `skill/system-spec-kit/SKILL.md` | Modify | AGENTS.md->AGENTS.md, fix template counts |
| `AGENTS.md` (project) | Modify | Tool prefix note, gate fix, threshold clarification, save pathways |
| `command/spec_kit/complete.md` | Modify | AGENTS.md section references |
| `command/spec_kit/handover.md` | Modify | AGENTS.md references |
| `command/spec_kit/implement.md` | Modify | AGENTS.md references |
| `command/spec_kit/resume.md` | Modify | AGENTS.md references |
| `command/spec_kit/research.md` | Modify | AGENTS.md references |
| `command/spec_kit/plan.md` | Modify | AGENTS.md references |
| `command/memory/save.md` | Modify | Gate 5 -> Memory Save Rule |
| `command/spec_kit/assets/*.yaml` (9 files) | Modify | AGENTS.md references |
| `mcp_server/INSTALL_GUIDE.md` | Modify | Gate references |
| `constitutional/gate-enforcement.md` | Modify | Align gate numbers |
| `scripts/scripts-registry.json` | Modify | Gate reference |
| `skill/system-spec-kit/README.md` | Modify | Template counts, AGENTS.md ref |
| `scripts/skill_advisor.py` | Modify | Boost thresholds, debug routing |
| `opencode.json` (project) | Modify | Document shared-DB |
| `agent/research.md` | Modify | AGENTS.md reference |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix CREATE_LINKED SQL constraint | Both CHECK constraints (migration + create_schema) include CREATE_LINKED |
| REQ-002 | Remove ghost tools from speckit.md | No references to memory_drift_context or memory_drift_learn |
| REQ-003 | Fix AGENTS.md references in SKILL.md | 0 occurrences of "AGENTS.md" in SKILL.md |
| REQ-004 | Correct speckit.md tool layers | 7-layer table matching context-server.js |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fix Gate 4/5 ghost references | 0 occurrences of "Gate 4 Option B" or "Gate 5" in active files |
| REQ-006 | Ecosystem AGENTS.md migration | 0 occurrences in active command/agent/skill files |
| REQ-007 | Standardize template counts | Consistent counts across speckit.md, SKILL.md, README.md |
| REQ-008 | Document tool name prefix | AGENTS.md notes spec_kit_memory_ prefix convention |
| REQ-009 | Fix confidence threshold confusion | Clarifying note distinguishing Gate 1 (70%) from Section 5 (80%) |
| REQ-010 | Boost memory query scores | "save memory context" passes 0.8 threshold |
| REQ-011 | Fix debug routing | "debug this issue" doesn't auto-route to chrome-devtools |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All grep verifications pass (0 stale references)
- **SC-002**: `skill_advisor.py "save memory context"` confidence >= 0.8
- **SC-003**: `skill_advisor.py "debug this issue"` does NOT route to chrome-devtools above 0.8

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Symlink affects all projects | All projects get changes simultaneously | Changes are correctness fixes, not behavioral changes |
| Risk | YAML asset files bulk-edited | Potential formatting issues | sed with targeted patterns, verified via grep |
| Risk | skill_advisor.py threshold changes | May affect other query routing | Only boosted spec-kit scores, verified chrome-devtools still works for explicit queries |
| Dependency | Existing SQLite databases | CHECK constraint change only affects new tables | Existing databases need manual ALTER TABLE or recreation |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: All MCP tool references must match actual tool definitions in context-server.js
- **NFR-C02**: All gate numbers must match AGENTS.md as source of truth
- **NFR-C03**: All file name references must point to files that exist

---

## 8. EDGE CASES

### Existing Databases
- The CHECK constraint fix only applies to new `memory_conflicts` tables. Existing databases created before this fix still have the old constraint. They need manual `ALTER TABLE` or database recreation to pick up the change.

### Archived Specs
- Archived spec folders in `z_archive/` contain historical AGENTS.md references. These are intentionally NOT modified to preserve historical accuracy.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 19+, LOC: ~500, Systems: MCP server, agents, commands, skills, scripts |
| Risk | 18/25 | Symlink affects all projects, SQL schema change, routing threshold change |
| Research | 18/20 | 6 parallel analysis agents, full ecosystem audit |
| Multi-Agent | 12/15 | 6 analysis agents + 1 implementation agent + 1 fix agent |
| Coordination | 12/15 | Cross-file dependencies, template count standardization |
| **Total** | **82/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Existing DB constraint mismatch | M | H | Document in known limitations |
| R-002 | Routing threshold too aggressive | L | L | Verified with test queries |
| R-003 | Missed AGENTS.md reference | L | M | Final grep verification |

---

## 11. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Analysis Review | User | Approved | 2026-02-05 |
| Implementation Plan | User | Approved | 2026-02-05 |
| Post-Implementation Review | Pending | | |

---

## 12. CHANGE LOG

### v1.0 (2026-02-05)
**Initial specification and implementation** - All 3 critical bugs fixed, 15+ moderate misalignments resolved, ecosystem-wide AGENTS.md migration completed.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
