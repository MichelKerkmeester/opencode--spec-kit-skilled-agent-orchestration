---
title: "Feature Specification [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/spec]"
description: "Phase 003 documents the discovery manual test packet. Execute scenarios EX-011, EX-012, EX-013, EX-036, EX-037, EX-038, EX-039, and EX-040 against the Spec Kit Memory system to verify memory_list, memory_stats, memory_health, and targeted discovery operations including folder filtering, trigger phrase matching, date range queries, importance tier filtering, and causal link traversal."
trigger_phrases:
  - "discovery manual testing"
  - "phase 003 discovery"
  - "ex-011 ex-012 ex-013 ex-036 ex-037 ex-038 ex-039 ex-040"
  - "memory_list memory_stats memory_health test"
  - "folder filter discovery"
  - "trigger phrase matching discovery"
  - "date range discovery"
  - "importance tier filter"
  - "causal link traversal"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook discovery phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [002-mutation](../002-mutation/spec.md) |
| **Successor** | [004-maintenance](../004-maintenance/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 discovery scenarios must be executed from scratch. All prior results are invalidated. The eight discovery scenarios (EX-011, EX-012, EX-013, EX-036, EX-037, EX-038, EX-039, EX-040) require fresh manual execution to verify that memory_list, memory_stats, memory_health, and targeted discovery operations behave as specified by the canonical playbook. The five new scenarios (EX-036 through EX-040) expand coverage to folder name filtering, trigger phrase matching, date range queries, importance tier filtering, and causal link traversal.

### Purpose
Execute all eight Phase 003 discovery scenarios, record verdicts and evidence, and mark this phase complete only when all P0 checklist items pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Playbook File |
|---------|---------------|---------------|
| EX-011 | Memory browser (memory_list) | `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/011-memory-browser-memory-list.md` |
| EX-012 | System statistics (memory_stats) | `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/012-system-statistics-memory-stats.md` |
| EX-013 | Health diagnostics (memory_health) | `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md` |
| EX-036 | Discovery by folder name filter | `.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/036-confidence-based-result-truncation-r15-ext.md` |
| EX-037 | Discovery by trigger phrase matching | `.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/037-dynamic-token-budget-allocation-fut-7.md` |
| EX-038 | Discovery by date range (before/after) | `.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/038-query-expansion-r12.md` |
| EX-039 | Discovery by importance tier filter | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md` |
| EX-040 | Discovery by causal link traversal | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md` |

### Out of Scope
- Scenarios from other phases (retrieval, mutation, maintenance, lifecycle, etc.)
- Modifying the playbook or feature catalog source files
- Automated test harnesses — this phase is manual execution only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 003 clean-slate specification |
| `plan.md` | Rewrite | Execution plan for Phase 003 |
| `tasks.md` | Rewrite | One task per scenario, all pending |
| `checklist.md` | Rewrite | P0/P1 items, all unchecked |
| `implementation-summary.md` | Rewrite | Blank — to be filled after execution |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 011 | Memory browser (memory_list) | 03--discovery/01-memory-browser-memorylist.md |
| 2 | 012 | System statistics (memory_stats) | 03--discovery/02-system-statistics-memorystats.md |
| 3 | 013 | Health diagnostics (memory_health) | 03--discovery/03-health-diagnostics-memoryhealth.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-011: invoke `memory_list` with `specFolder`, `limit`, and `offset` parameters | PASS if paginated list returns with memory items and total count |
| REQ-002 | Execute EX-012: invoke `memory_stats` with `folderRanking: "composite"` and `includeScores: true` | PASS if dashboard fields populate including counts, tiers, and folder ranking |
| REQ-003 | Execute EX-013: invoke `memory_health(reportMode: "full")` then `memory_health(reportMode: "divergent_aliases")` | PASS if both report modes complete with status and diagnostic output |
| REQ-006 | Execute EX-036: invoke `memory_list` with a `specFolder` filter targeting a known subfolder path | PASS if results are restricted to the specified folder; no results from other folders appear; total count reflects filtered set. FAIL if unrelated folder memories appear in results |
| REQ-007 | Execute EX-037: invoke `memory_match_triggers` with a known trigger phrase that exists in at least one memory | PASS if matching memories are returned with relevance scores; trigger phrase highlighted or confirmed in response metadata. FAIL if no matches returned for a known trigger phrase or false positives dominate results |
| REQ-008 | Execute EX-038: invoke `memory_search` with date-range constraints (`createdAfter` / `createdBefore`) bracketing a known memory creation window | PASS if only memories within the specified date range are returned; boundary dates are respected (inclusive/exclusive as documented). FAIL if memories outside the date range appear in results |
| REQ-009 | Execute EX-039: invoke `memory_list` with `importanceTier` filter set to "high", then repeat with "critical" | PASS if each call returns only memories matching the requested tier; tier field in each result matches the filter value. FAIL if memories from other tiers are included |
| REQ-010 | Execute EX-040: invoke `memory_causal_stats` to enumerate causal links, then invoke `memory_search` with a `causalSourceId` parameter to retrieve downstream memories linked from a known source | PASS if causal stats report link counts and the follow-up search returns the expected linked memories with causal metadata. FAIL if causal traversal returns no results when links are known to exist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Capture evidence for each scenario (tool output or screenshot) | Evidence file or inline output recorded in implementation-summary.md |
| REQ-012 | Mark final verdict (PASS / PARTIAL / FAIL) per scenario following the review protocol | Verdict recorded against all 8 scenarios (EX-011 through EX-013 and EX-036 through EX-040) in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: EX-011 returns a paginated memory list with valid item count
- **SC-002**: EX-012 returns a stats dashboard with composite folder ranking and scores
- **SC-003**: EX-013 completes both report modes without error and returns a health status
- **SC-004**: EX-036 returns results restricted to the specified folder only
- **SC-005**: EX-037 returns trigger phrase matches with relevance scores
- **SC-006**: EX-038 returns only memories within the specified date range
- **SC-007**: EX-039 returns only memories matching the requested importance tier
- **SC-008**: EX-040 returns causal link stats and downstream linked memories
- **SC-009**: All eight verdicts are recorded and all P0 checklist items are checked
### Acceptance Scenarios

**Given** the `003-discovery` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `003-discovery` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `003-discovery` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `003-discovery` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical playbook: `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` §03--discovery | Source of truth for exact prompts and pass criteria | Treat as read-only; do not invent alternate criteria |
| Dependency | Feature catalog: `../scratch/context-feature-catalog.md` §03--discovery | Feature context for each scenario | Read before execution for background |
| Dependency | MCP runtime with indexed memory corpus | Required for all three tool invocations | Verify MCP server is running before starting |
| Risk | EX-013 `autoRepair: true` can mutate index state | Medium | Never pass `autoRepair: true` or `confirmed: true` during verification runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at start. Record any blockers discovered during execution here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each tool call must complete within the MCP server's default timeout
- **NFR-P02**: No scenario requires more than one retry to obtain a valid response

### Security
- **NFR-S01**: Run against a non-production indexed corpus; do not expose live user data
- **NFR-S02**: Do not trigger autoRepair operations during read-only discovery execution

### Reliability
- **NFR-R01**: All three scenarios must complete to claim phase done
- **NFR-R02**: Partial execution (only 1 or 2 scenarios) is not acceptable for phase closure
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty corpus: if `memory_list` returns 0 items, record as PARTIAL and note corpus state
- Zero divergent aliases: `groups: []` from EX-013 divergent_aliases mode is a valid PASS
- Stats with no folders: if `memory_stats` returns empty folder list, record as PARTIAL

### Error Scenarios
- MCP server not running: stop, start server, then retry
- Tool call timeout: retry once; if still failing, record as FAIL with error text
- `memory_health` FTS mismatch detected: record PARTIAL with exact error; do not repair

### State Transitions
- EX-013 full mode then divergent_aliases mode must both run in sequence before verdict
- Do not run scenarios in parallel; execute EX-011, EX-012, EX-013 in order
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 8 scenarios across read-only and filtered discovery operations |
| Risk | 7/25 | autoRepair risk mitigated by protocol; causal link traversal requires populated graph |
| Research | 4/20 | Playbook provides context; new scenarios require MCP parameter discovery |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
