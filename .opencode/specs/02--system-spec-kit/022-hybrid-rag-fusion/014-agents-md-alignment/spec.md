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
| **LOC estimate** | ~50+ |
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

### Problem Statement

The three AGENTS.md governance framework files reference outdated Quick Reference workflow tables that show 5 memory commands instead of the current 6. The `/memory:learn` constitutional memory row only documents the `[rule]` creation subcommand, missing `list`, `edit`, `remove`, and `budget`. The `/memory:manage` database maintenance row is missing the `ingest` subcommand. Two entirely new commands (`/memory:analyze`, `/memory:shared`) have no rows at all. Additionally, the FS-Enterprises variant has a stale Research/exploration row missing the `memory_context()` unified alternative.

### Purpose

Reconcile the AGENTS.md quick-reference governance docs to the live 6-command memory suite while preserving variant-specific policy and stack-detection content.

**Key Metrics**
- 4 target files across 2 repositories (Public, Barter) -- 3 AGENTS.md + CLAUDE.md
- 6 gaps identified and fixed (original 5 + G-01 through G-06 refinement gaps)
- 6 memory commands now represented in Quick Reference tables (was 5)
- 2 skill-section overhauls (Universal + FS-Enterprises)
- ~50+ LOC total change (initial ~36 + refinement passes)
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
| 6 | Fix G-01 through G-06 consistency gaps (refinement pass) | All 3 AGENTS.md + CLAUDE.md |
| 7 | Overhaul skill sections (sk-code--opencode, sk-code--full-stack, sk-git) | Universal + FS-Enterprises |

### 2.2 Out of Scope

- Agent definitions (Section 6) - identical, no changes needed
- MCP Configuration (Section 7) - tool counts owned by command docs
- Feature catalog - belongs in SKILL.md
- Stack detection tables - FS-Enterprises and Barter specific, no changes needed

### 2.3 Target Files

| # | File | Location |
|---|------|----------|
| 1 | `AGENTS.md` | `Opencode Env/Public/AGENTS.md` |
| 2 | `AGENTS_example_fs_enterprises.md` | `Opencode Env/Public/AGENTS_example_fs_enterprises.md` |
| 3 | `AGENTS.md` | `Opencode Env/Barter/coder/AGENTS.md` |
| 4 | `CLAUDE.md` | `Opencode Env/Public/CLAUDE.md` (Gate 3 ordering, refinement pass) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Constitutional memory row shows all 5 subcommands (legacy `F1`) | All three governance files document `list`, `edit`, `remove`, and `budget` alongside rule creation |
| REQ-002 | Database maintenance row includes `ingest` (legacy `F2`) | All three governance files document `ingest` under `/memory:manage` |
| REQ-003 | New Analysis or evaluation row is present in all 3 files (legacy `F3`) | All three governance files include `/memory:analyze` in their quick-reference tables |
| REQ-004 | New Shared memory row is present in all 3 files (legacy `F4`) | All three governance files include `/memory:shared` in their quick-reference tables |
| REQ-005 | Barter READ-ONLY git policy and FS-Enterprises stack-detection guidance stay preserved (legacy `NF1` and `NF2`) | Existing variant-specific governance content remains present after the table updates |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | FS-Enterprises Research or exploration row matches Universal and Barter guidance (legacy `F5`) | The FS-Enterprises variant documents `memory_context()` as the unified alternative |
| REQ-007 | Table column alignment stays consistent within each file (legacy `NF3`) | The quick-reference tables remain readable and internally aligned after the edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 AGENTS.md files contain 6 memory command rows in Quick Reference tables
- **SC-002**: Verification greps confirm all 6 checks pass
- **SC-003**: Barter READ-ONLY git policy and FS-Enterprises stack detection table remain preserved

### Acceptance Scenarios

**Given** a reviewer opens any of the three governance files, **when** they inspect the Quick Reference table, **then** they see `/memory:analyze`, `/memory:shared`, and `/memory:manage ingest` represented.

**Given** a reviewer opens the FS-Enterprises variant, **when** they inspect the Research or exploration row, **then** it includes `memory_context()` as the unified alternative.

**Given** a reviewer opens the Barter governance file, **when** they inspect git policy guidance, **then** the READ-ONLY rule remains intact.

**Given** a reviewer compares the three quick-reference tables, **when** they scan the edited rows, **then** the tables stay aligned and variant-specific content outside the targeted rows remains preserved.
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

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NF-001**: Barter READ-ONLY git policy must remain intact after table edits (REQ-005)
- **NF-002**: FS-Enterprises stack-detection guidance must remain intact (REQ-005)
- **NF-003**: Table column alignment must stay visually consistent within each file (REQ-007)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Variant-specific rows (Go/Angular/Swift verification in FS, Git analysis in Barter) must not be accidentally removed when inserting new rows into the Quick Reference table.
- CLAUDE.md Gate 3 ordering must match AGENTS.md ordering after refinement pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Factor | Score | Notes |
|--------|-------|-------|
| File count | Low | 4 target files (3 AGENTS.md + CLAUDE.md) |
| Cross-repo | Medium | Barter repo is a separate checkout |
| Variant drift risk | Medium | 3 AGENTS.md variants must stay consistent |
| Overall | ~35/100 | Documentation-only, low technical risk |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. All gaps identified and resolved.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-navigation -->
### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../013-agents-alignment/spec.md |
| **Next Phase** | ../015-manual-testing-per-playbook/spec.md |
<!-- /ANCHOR:phase-navigation -->
