---
title: "Feature Specification: manual-testing-per-playbook"
description: "Execute manual testing across 231 scenario files (272 exact IDs) in 19 categories from the manual testing playbook, tracking coverage and verdicts per phase folder."
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
| **Status** | In Progress — Testing: 272/272 PASS. Traceability remediation: PENDING (deep review verdict CONDITIONAL) |
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
The manual testing playbook contains 231 scenario files expanding to 272 exact IDs across 19 categories. Each scenario defines prompts, expected behavior, pass/fail criteria, and evidence requirements for verifying Spec Kit Memory features. This spec folder tracks manual test execution across all scenarios, organized into 24 top-level subdirectories (22 numbered phase folders plus `memory/` and `scratch/`).

### Purpose
Execute and record manual test results for all 272 exact scenario IDs, producing per-phase verdicts (PASS/PARTIAL/FAIL) and an aggregate coverage report across the full playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Manual test execution across 24 top-level subdirectories (001 through 022 plus `memory/` and `scratch/`)
- Per-scenario verdict recording (PASS / PARTIAL / FAIL) with evidence
- Aggregate coverage reporting across 272 exact IDs
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
| `001-retrieval/` through `022-implement-and-remove-deprecated-features/` | Modify | Per-phase test execution docs |
<!-- /ANCHOR:scope -->

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Category | Scenario Files | Exact IDs |
|-------|--------|----------|---------------|-----------|
| 001 | `001-retrieval/` | Retrieval | 13 | 13 |
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
| 016 | `016-tooling-and-scripts/` | Tooling and Scripts | 33 | 65 |
| 017 | `017-governance/` | Governance | 5 | 5 |
| 018 | `018-ux-hooks/` | UX Hooks | 11 | 11 |
| 019 | `019-feature-flag-reference/` | Feature Flag Reference | 8 | 8 |
| **TOTAL** | | | **231** | **272** |

Current child-phase status snapshot (2026-03-24):
- Complete: `009-evaluation-and-measurement`, `011-scoring-and-calibration`, `014-pipeline-architecture`, `016-tooling-and-scripts`
- Pending (`Not Started`/`Draft`): `001`, `002`, `003`, `004`, `005`, `006`, `007`, `008`, `010`, `012`, `013`, `015`, `017`, `018`, `019`, `020`, `021`, `022`

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

> Scenario-file and sub-scenario tallies combine to the live exact-ID denominator (272).

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 24 top-level subdirectories contain executed test results | Each phase folder has recorded verdicts for every scenario in its category |
| REQ-002 | Every exact scenario ID (272 total) has a verdict | Aggregate report shows 272 verdicts with zero unexecuted IDs |
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

- **SC-001**: All 272 exact scenario IDs have recorded verdicts (PASS, PARTIAL, or FAIL)
- **SC-002**: Per-phase summaries are complete for all 24 subdirectories
- **SC-003**: Aggregate coverage report shows overall pass rate and identifies any FAIL scenarios requiring follow-up
### Acceptance Scenarios

**Given** the umbrella playbook packet, **when** a reviewer opens the phase map, **then** all numbered child folders from `001` through `022` appear in the documented execution sequence.

**Given** the umbrella packet, **when** a reviewer checks coverage expectations, **then** the packet records the exact-ID denominator and the per-phase verdict-tracking intent without inventing missing execution.

**Given** a reviewer checks the execution controls, **when** they read the packet and checklist, **then** evidence, bug tracking, and playbook-error tracking expectations are explicit.

**Given** recursive validation runs on the umbrella packet, **when** the packet is audited structurally, **then** the parent spec remains template-compatible and points readers to the child execution packets.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manual testing playbook (231 scenario files) | Source of all prompts, commands, and pass/fail criteria | Treat playbook as read-only source of truth |
| Dependency | Feature catalog (19 categories, 222 features) | Provides feature context for each test scenario | Symlinked into spec folder for reference |
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
- **NFR-P02**: Total execution across all 24 subdirectories should complete within 5 working days

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
| Scope | 20/25 | 24 subdirectories, 231 scenario files, 272 exact IDs |
| Risk | 10/25 | Manual testing only, no production changes |
| Research | 5/20 | Playbook provides all prompts and criteria |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at this time. The playbook and feature catalog provide all inputs needed for test execution.
<!-- /ANCHOR:questions -->

---

### DEEP REVIEW FINDINGS (2026-03-26)

A 6-iteration deep review (12 GPT-5.4 agents via codex exec) audited feature catalog ↔ playbook ↔ spec phase traceability. **Verdict: CONDITIONAL.**

Full report: [`review-report.md`](review-report.md)

### Finding Summary

| ID | Severity | Title | Count | Remediation |
|----|----------|-------|-------|-------------|
| P0-001 | Critical | Features with NO playbook scenario (true gaps) | 29/222 (13.1%) | Create 29 playbook scenario files |
| P1-001 | Major | Features missing from Section 12 cross-reference | 4 entries | Add 4 rows to Section 12 |
| P1-002 | Major | Playbook scenarios lacking FC back-reference | 40 scenarios | Add `Feature catalog:` to 40 files |
| P1-003 | Major | Spec phases lacking Scenario Registry table | 17/22 phases | Add registry table to 17 spec.md |
| P1-004 | Major | Inconsistent FC ref patterns in spec phases | 6 phases | Standardize to registry tables |
| P1-005 | Major | Features covered but unlinked (missing back-ref) | 25 scenarios | Add `Feature catalog:` to 25 files |
| P2-001 | Advisory | Section 12 links all valid | 0 broken | No action |
| P2-002 | Advisory | Spec phase 020 duplicates 019 name | 1 | No action (intentional) |
| P2-003 | Advisory | Category count mismatches | Expected | No action (sub-scenario expansion) |

### Remediation Workstreams

| WS | Priority | Scope | Depends On |
|----|----------|-------|------------|
| WS-1 | P0 | Create 29 missing playbook scenario files | None |
| WS-2 | P1 | Add FC back-references to 65 playbook scenarios (25+40) | WS-1 |
| WS-3 | P1 | Add 33 rows to Section 12 index (4 existing + 29 new) | WS-1 |
| WS-4 | P1 | Add Scenario Registry tables to 17 spec phase spec.md files | WS-1, WS-2, WS-3 |

### True-Gap Features (P0-001) — 29 features needing new playbook scenarios

| # | Category | Feature |
|---|----------|---------|
| 1 | 01-Retrieval | AST-level section retrieval tool |
| 2 | 01-Retrieval | Tool-result extraction to working memory |
| 3 | 01-Retrieval | Session recovery via /memory:continue |
| 4 | 02-Mutation | Namespace management CRUD tools |
| 5 | 02-Mutation | Correction tracking with undo |
| 6 | 10-Graph Signal | ANCHOR tags as graph nodes |
| 7 | 10-Graph Signal | Causal neighbor boost and injection |
| 8 | 10-Graph Signal | Temporal contiguity layer |
| 9 | 11-Scoring | Tool-level TTL cache |
| 10 | 11-Scoring | Access-driven popularity scoring |
| 11 | 11-Scoring | Temporal-structural coherence scoring |
| 12 | 13-Memory Quality | Content-aware memory filename generation |
| 13 | 13-Memory Quality | Generation-time duplicate and empty content prevention |
| 14 | 14-Pipeline | Warm server / daemon mode |
| 15 | 14-Pipeline | Backend storage adapter abstraction |
| 16 | 14-Pipeline | Atomic write-then-index API |
| 17 | 14-Pipeline | Embedding retry orchestrator |
| 18 | 14-Pipeline | 7-layer tool architecture metadata |
| 19 | 16-Tooling | Architecture boundary enforcement |
| 20 | 16-Tooling | Watcher delete/rename cleanup |
| 21 | 16-Tooling | Template Compliance Contract Enforcement |
| 22 | 18-UX Hooks | Shared post-mutation hook wiring |
| 23 | 18-UX Hooks | Memory health autoRepair metadata |
| 24 | 18-UX Hooks | Schema and type contract synchronization |
| 25 | 18-UX Hooks | Mutation hook result contract expansion |
| 26 | 18-UX Hooks | Mutation response UX payload exposure |
| 27 | 18-UX Hooks | Atomic-save parity and partial-indexing hints |
| 28 | 18-UX Hooks | Final token metadata recomputation |
| 29 | 18-UX Hooks | End-to-end success-envelope verification |

---

