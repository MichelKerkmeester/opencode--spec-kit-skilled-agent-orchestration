---
title: "Feature Specification: manual-testing-per-playbook"
description: "Execute manual testing across 227 scenario files (266 exact IDs) in 19 categories from the manual testing playbook, tracking coverage and verdicts per phase folder."
trigger_phrases:
  - "manual testing"
  - "testing playbook"
  - "phase parent"
  - "umbrella spec"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../014-agents-md-alignment/spec.md |
| **Successor** | ../016-rewrite-memory-mcp-readme/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual testing playbook contains 227 scenario files expanding to 266 exact IDs across 19 categories. Each scenario defines prompts, expected behavior, pass/fail criteria, and evidence requirements for verifying Spec Kit Memory features. This spec folder tracks manual test execution across all scenarios, organized into 19 phase folders that mirror the playbook categories.

### Purpose
Execute and record manual test results for all 266 exact scenario IDs, producing per-phase verdicts (PASS/PARTIAL/FAIL) and an aggregate coverage report across the full playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Manual test execution for all 19 phase folders (001 through 019)
- Per-scenario verdict recording (PASS / PARTIAL / FAIL) with evidence
- Aggregate coverage reporting across 266 exact IDs
- Bug and playbook-error tracking discovered during test execution

### Out of Scope
- Automated test suite creation -- this is manual testing only
- Feature catalog maintenance -- catalog is a read-only reference
- Playbook authoring -- playbook is a read-only source of truth
- Runtime code changes -- except for bugs discovered during testing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | This file -- requirements and phase map |
| `plan.md` | Modify | Execution plan and phase dependencies |
| `tasks.md` | Modify | Per-phase task tracking |
| `checklist.md` | Modify | Quality gates and verification evidence |
| `implementation-summary.md` | Create | Post-execution summary (after testing completes) |
| `001-retrieval/` through `019-feature-flag-reference/` | Modify | Per-phase test execution docs |
<!-- /ANCHOR:scope -->

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Category | Scenario Files | Exact IDs |
|-------|--------|----------|---------------|-----------|
| 001 | `001-retrieval/` | Retrieval | 11 | 11 |
| 002 | `002-mutation/` | Mutation | 9 | 9 |
| 003 | `003-discovery/` | Discovery | 3 | 3 |
| 004 | `004-maintenance/` | Maintenance | 2 | 2 |
| 005 | `005-lifecycle/` | Lifecycle | 10 | 10 |
| 006 | `006-analysis/` | Analysis | 7 | 7 |
| 007 | `007-evaluation/` | Evaluation | 2 | 2 |
| 008 | `008-bug-fixes-and-data-integrity/` | Bug Fixes and Data Integrity | 11 | 11 |
| 009 | `009-evaluation-and-measurement/` | Evaluation and Measurement | 16 | 16 |
| 010 | `010-graph-signal-activation/` | Graph Signal Activation | 15 | 15 |
| 011 | `011-scoring-and-calibration/` | Scoring and Calibration | 22 | 22 |
| 012 | `012-query-intelligence/` | Query Intelligence | 10 | 10 |
| 013 | `013-memory-quality-and-indexing/` | Memory Quality and Indexing | 27 | 34 |
| 014 | `014-pipeline-architecture/` | Pipeline Architecture | 18 | 18 |
| 015 | `015-retrieval-enhancements/` | Retrieval Enhancements | 11 | 11 |
| 016 | `016-tooling-and-scripts/` | Tooling and Scripts | 29 | 61 |
| 017 | `017-governance/` | Governance | 5 | 5 |
| 018 | `018-ux-hooks/` | UX Hooks | 11 | 11 |
| 019 | `019-feature-flag-reference/` | Feature Flag Reference | 8 | 8 |
| **TOTAL** | | | **227** | **266** |

### Sub-Scenario Breakdown

Categories 013 and 016 have more exact IDs than scenario files due to sub-scenarios:

| Category | File | Parent ID | Sub-IDs | Extra IDs |
|----------|------|-----------|---------|-----------|
| 013 | 005-outsourced-agent-memory-capture-round-trip.md | M-005 | M-005a, M-005b, M-005c | +3 |
| 013 | 006-session-enrichment-and-alignment-guardrails.md | M-006 | M-006a, M-006b, M-006c | +3 |
| 013 | 155-post-save-quality-review.md | 155 | 155-F | +1 |
| 016 | 007-session-capturing-pipeline-quality.md | M-007 | M-007a through M-007q | +17 |
| 016 | 153-json-mode-hybrid-enrichment.md | 153 | 153-A through 153-O | +15 |
| | | | **Sub-scenario surplus** | **+39** |

> 227 scenario files + 39 sub-scenario surplus = 266 total exact IDs

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 19 phase folders contain executed test results | Each phase folder has recorded verdicts for every scenario in its category |
| REQ-002 | Every exact scenario ID (266 total) has a verdict | Aggregate report shows 266 verdicts with zero unexecuted IDs |
| REQ-003 | Per-phase execution summaries are recorded | Each phase folder contains pass/partial/fail counts with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bugs discovered during testing are documented | Each bug has a description, affected scenario ID, and severity |
| REQ-005 | Playbook errors discovered during testing are documented | Each playbook error has a description, location, and correction |
| REQ-006 | Aggregate coverage report produced | Summary table showing per-phase verdict counts and overall pass rate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 266 exact scenario IDs have recorded verdicts (PASS, PARTIAL, or FAIL)
- **SC-002**: Per-phase summaries are complete for all 19 phases
- **SC-003**: Aggregate coverage report shows overall pass rate and identifies any FAIL scenarios requiring follow-up
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manual testing playbook (227 scenario files) | Source of all prompts, commands, and pass/fail criteria | Treat playbook as read-only source of truth |
| Dependency | Feature catalog (19 categories, 220 features) | Provides feature context for each test scenario | Symlinked into spec folder for reference |
| Risk | Test environment state drift between phases | Medium -- results may not be comparable | Reset test environment between phases or document state |
| Risk | Playbook errors blocking test execution | Medium | Document errors and proceed with corrected interpretation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each phase should complete within a single session
- **NFR-P02**: Total execution across all 19 phases should complete within 5 working days

### Reliability
- **NFR-R01**: Test results must be reproducible given the same environment state
- **NFR-R02**: Evidence must be captured inline or as file references for every verdict
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty database: Some scenarios require a populated memory database; document prerequisite state
- Maximum memory count: Scenarios testing bulk operations need sufficient test data

### Error Scenarios
- MCP server not running: Restart and re-execute affected scenarios
- Embedding service unavailable: Skip embedding-dependent scenarios and mark as BLOCKED

### State Transitions
- Partial phase completion: Resume from last completed scenario within the phase
- Environment reset between phases: Document whether clean or cumulative state was used
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 19 phases, 227 scenario files, 266 exact IDs |
| Risk | 10/25 | Manual testing only, no production changes |
| Research | 5/20 | Playbook provides all prompts and criteria |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at this time. The playbook and feature catalog provide all inputs needed for test execution.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-nav -->
> **Parent Spec:** `../spec.md`
<!-- /ANCHOR:phase-nav -->
