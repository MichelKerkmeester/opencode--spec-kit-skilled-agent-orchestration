---
title: "Implementation Plan: manual-testing-per-playbook [template:level_1/plan.md]"
description: "Phased agent-delegated generation of 19 manual testing phase folders, each containing spec.md and plan.md derived from the 229KB playbook cross-reference index."
trigger_phrases:
  - "manual testing plan"
  - "testing phases"
  - "agent delegation"
  - "playbook phases"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit Level 1 templates |
| **Storage** | Filesystem (spec folders) |
| **Testing** | validate.sh --recursive, coverage audit |

### Overview
Generate 19 phase sub-folders inside `014-manual-testing-per-playbook/`, each containing `spec.md` and `plan.md` documenting manual test scenarios for one feature catalog category. Work is delegated to Copilot CLI (GPT-5.4) and Gemini CLI agents in two waves: Wave 1 (12 agents for categories with 7+ tests) and Wave 2 (7 agents for remaining categories).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] All 19 phase directories created
- [x] Parent spec.md and plan.md written

### Definition of Done
- [ ] All 19 phase folders contain spec.md and plan.md (38 files total)
- [ ] Coverage audit: every test ID from cross-reference index appears in exactly one phase
- [ ] validate.sh --recursive passes on entire tree
- [ ] Context saved via generate-context.js
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phased agent delegation with coordinator validation

### Key Components
- **Coordinator (Claude Code)**: Directory setup, parent docs, agent dispatch, validation
- **Copilot CLI agents (GPT-5.4)**: Generate spec.md + plan.md for assigned categories
- **Gemini CLI agents**: Generate spec.md + plan.md for assigned categories
- **Validator**: validate.sh --recursive + custom coverage audit

### Data Flow
```
Playbook (229KB) → Cross-Reference Index → Category Assignment
  → Agent Prompt (with test IDs + feature catalog paths)
    → Agent generates spec.md + plan.md in target folder
      → Coordinator validates coverage + structure
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Setup (Coordinator)
- [x] Verify CLI binaries (copilot, gemini)
- [x] Create 19 empty phase directories
- [x] Write parent spec.md with Phase Documentation Map
- [x] Write parent plan.md

### Phase 1: Wave 1 — 12 Agents (9 Copilot + 3 Gemini)
Categories with 7+ test scenarios:
- [ ] 014-pipeline-architecture (18 tests) — Copilot
- [ ] 013-memory-quality-and-indexing (17+8 tests) — Copilot
- [ ] 011-scoring-and-calibration (16 tests) — Copilot
- [ ] 009-evaluation-and-measurement (16 tests) — Copilot
- [ ] 016-tooling-and-scripts (15+5 tests) — Copilot
- [ ] 008-bug-fixes-and-data-integrity (11 tests) — Copilot
- [ ] 001-retrieval (9 tests) — Copilot
- [ ] 005-lifecycle (9 tests) — Copilot
- [ ] 010-graph-signal-activation (9 tests) — Copilot
- [ ] 015-retrieval-enhancements (9 tests) — Gemini
- [ ] 019-feature-flag-reference (8 tests) — Gemini
- [ ] 006-analysis (7 tests) — Gemini

### Phase 2: Validate Wave 1
- [ ] Verify 12 × 2 = 24 files exist
- [ ] Verify all assigned test IDs present in each spec.md
- [ ] Extract MEMORY_HANDBACK sections

### Phase 3: Wave 2 — 7 Copilot Agents
Categories with <7 test scenarios:
- [ ] 002-mutation (7 tests)
- [ ] 012-query-intelligence (6 tests)
- [ ] 018-ux-hooks (5 tests)
- [ ] 017-governance (5 tests)
- [ ] 003-discovery (3 tests)
- [ ] 007-evaluation (2 tests)
- [ ] 004-maintenance (2 tests)

### Phase 4: Validate Wave 2
- [ ] Verify 7 × 2 = 14 files exist
- [ ] Verify all assigned test IDs present in each spec.md

### Phase 5: Coverage Audit
- [ ] Parse all 19 spec.md files for test IDs
- [ ] Compare against canonical cross-reference index
- [ ] No orphaned IDs, no missing IDs
- [ ] validate.sh --recursive passes

### Phase 6: Context Save
- [ ] Run generate-context.js for 014-manual-testing-per-playbook
- [ ] Write utilization-ledger.md to scratch/
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | All 38 child files exist | ls, find |
| Template | SPECKIT_LEVEL + ANCHOR comments present | grep |
| Coverage | All test IDs mapped to exactly one phase | Custom audit script |
| Validation | Recursive spec validation | validate.sh --recursive |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook | Internal | Green | Cannot generate — source of all test data |
| Feature catalog (19 categories) | Internal | Green | Cannot link tests to features |
| Copilot CLI (copilot binary) | External | Green | Cannot delegate to GPT-5.4 |
| Gemini CLI (gemini binary) | External | Green | Cannot delegate to Gemini 3.1 Pro |
| validate.sh | Internal | Green | Cannot run structural validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent generates invalid or empty files, or coverage audit shows critical gaps
- **Procedure**: Delete affected phase folder contents, re-run agent with corrected prompt. Parent docs and directory structure remain intact.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
