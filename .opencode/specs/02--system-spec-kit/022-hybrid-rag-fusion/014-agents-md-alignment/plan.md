---
title: "Plan: 014-agents-md-alignment"
description: "Implementation plan for aligning AGENTS.md Quick Reference tables with the 7-command memory suite."
trigger_phrases:
  - "014 plan"
  - "agents md plan"
importance_tier: "important"
contextType: "plan"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 014-agents-md-alignment

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation only |
| **Framework** | AGENTS.md Quick Reference workflow tables |
| **Testing** | Grep verification checks |

### Overview

Direct edit of 3 AGENTS.md files to close 5 identified gaps in Quick Reference workflow tables. All gaps are documentation-only changes to markdown tables.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 3 AGENTS.md files read and gaps confirmed
- [x] 7-command suite established by 012-command-alignment

### Definition of Done
- [x] All 5 gaps closed across 3 files
- [x] 6 grep verification checks pass
- [x] Barter READ-ONLY policy preserved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only table updates.

### Gap Analysis

| Gap | Description | Files Affected |
|-----|-------------|----------------|
| 1 | Constitutional memory row missing subcommands (`list`, `edit`, `remove`, `budget`) | All 3 |
| 2 | Database maintenance row missing `ingest` subcommand | All 3 |
| 3 | Missing Analysis/evaluation row for `/memory:analyze` | All 3 |
| 4 | Missing Shared memory row for `/memory:shared` | All 3 |
| 5 | FS-Enterprises Research/exploration row missing `memory_context()` | FS only |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read and Verify
- [x] Read all 3 AGENTS.md files to verify current state

### Phase 2: Edit
- [x] Update Constitutional memory row (Gap 1)
- [x] Update Database maintenance row + add 2 new rows after it (Gaps 2-4)
- [x] Fix Research/exploration row in FS-Enterprises only (Gap 5)

### Phase 3: Verify
- [x] Grep checks: `/memory:analyze` (3 matches), `/memory:shared` (3 matches), `ingest operations` (3 matches), `list.*edit.*remove.*budget` (3 matches), `GIT POLICY: READ-ONLY` (1 match), `memory_context.*unified` (1 match)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All 3 AGENTS.md files | grep/rg |
| Policy preservation | Barter READ-ONLY | grep |
| Table consistency | All 3 files | Manual comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 012-command-alignment | Internal | Green | Source of truth for 7-command suite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Accidental removal of variant-specific rows or policy breakage
- **Procedure**: Revert the 3 AGENTS.md files and reapply gap fixes carefully
<!-- /ANCHOR:rollback -->

---
