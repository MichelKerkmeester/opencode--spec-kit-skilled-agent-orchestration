---
title: "AGENTS.md Alignment: Quick Reference Tables"
description: "Align Quick Reference tables, fix cross-file drift, overhaul skill sections in all 3 AGENTS.md governance files + CLAUDE.md."
trigger_phrases:
  - "agents md alignment"
  - "014 agents md alignment"
  - "AGENTS.md quick reference"
  - "memory command table"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Specification: 014-agents-md-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Complexity** | ~35/100 |
| **LOC estimate** | ~36 |
| **Epic** | 022-hybrid-rag-fusion |
| **Phase** | 014 |
| **Dependencies** | 012-command-alignment (source of truth for 6-command suite) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../013-agents-alignment/spec.md |
| **Successor** | ../015-manual-testing-per-playbook/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The three AGENTS.md governance framework files reference outdated Quick Reference workflow tables that show 5 memory commands instead of the current 6. The `/memory:learn` constitutional memory row only documents the `[rule]` creation subcommand, missing `list`, `edit`, `remove`, and `budget`. The `/memory:manage` database maintenance row is missing the `ingest` subcommand. Two entirely new commands (`/memory:analyze`, `/memory:shared`) have no rows at all. Additionally, the FS-Enterprises variant has a stale Research/exploration row missing the `memory_context()` unified alternative.

**Key Metrics**
- 3 target files across 2 repositories (Public, Barter)
- 5 gaps identified and fixed
- 6 memory commands now represented in Quick Reference tables (was 5)
- ~36 LOC total change
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 2.1 In Scope

| # | Item | File |
|---|------|------|
| 1 | Update Constitutional memory row (add subcommands) | All 3 files |
| 2 | Update Database maintenance row (add `ingest`) | All 3 files |
| 3 | Add Analysis/evaluation row (`/memory:analyze`) | All 3 files |
| 4 | Add Shared memory row (`/memory:shared`) | All 3 files |
| 5 | Fix Research/exploration row (add `memory_context()`) | FS-Enterprises only |

### 2.2 Out of Scope

- Agent definitions (Section 6) - identical, no changes needed
- MCP Configuration (Section 7) - tool counts owned by command docs
- Feature catalog - belongs in SKILL.md
- CLAUDE.md - separate governance file, synced independently
- Stack detection tables - FS-Enterprises and Barter specific, no changes needed

### 2.3 Target Files

| # | File | Location |
|---|------|----------|
| 1 | `AGENTS.md` | `Opencode Env/Public/AGENTS.md` |
| 2 | `AGENTS_example_fs_enterprises.md` | `Opencode Env/Public/AGENTS_example_fs_enterprises.md` |
| 3 | `AGENTS.md` | `Opencode Env/Barter/coder/AGENTS.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 3.1 Functional

| ID | Requirement | Priority |
|----|-------------|----------|
| F1 | Constitutional memory row shows all 5 subcommands | P0 |
| F2 | Database maintenance row includes `ingest` | P0 |
| F3 | New Analysis/evaluation row present in all 3 files | P0 |
| F4 | New Shared memory row present in all 3 files | P0 |
| F5 | FS-Enterprises Research/exploration row matches Universal/Barter | P1 |

### 3.2 Non-Functional

| ID | Requirement | Priority |
|----|-------------|----------|
| NF1 | Barter READ-ONLY git policy preserved | P0 |
| NF2 | FS-Enterprises stack detection table preserved | P0 |
| NF3 | Table column alignment consistent within each file | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 AGENTS.md files contain 6 memory command rows in Quick Reference tables
- **SC-002**: Verification greps confirm all 6 checks pass
- **SC-003**: Barter READ-ONLY git policy and FS-Enterprises stack detection table remain preserved
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Accidental removal of variant-specific rows | Medium | Verify row counts before and after edit |
| Dependency | 012-command-alignment source of truth | Low | 6-command suite already established |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. All gaps identified and resolved.
<!-- /ANCHOR:questions -->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../013-agents-alignment/spec.md |
| **Next Phase** | ../015-manual-testing-per-playbook/spec.md |
