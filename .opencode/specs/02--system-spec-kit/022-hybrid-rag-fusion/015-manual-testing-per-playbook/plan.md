---
title: "Implementation Plan: manual-testing-per-playbook"
description: "Execute manual testing across 24 top-level subdirectories covering 231 scenario files (272 exact IDs) from the manual testing playbook, with pre-execution setup, phased execution, and aggregate result reporting."
trigger_phrases:
  - "manual testing plan"
  - "testing phases"
  - "playbook execution"
  - "test execution plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Spec Kit Memory MCP (TypeScript/Node.js) |
| **Framework** | system-spec-kit manual testing playbook |
| **Storage** | SQLite (memory_index.db) |
| **Testing** | Manual scenario execution per playbook |

### Overview
Execute manual testing across 24 top-level subdirectories. The 22 numbered phase folders map to playbook categories, while `memory/` and `scratch/` hold supporting artifacts. Results are recorded as per-scenario verdicts (PASS/PARTIAL/FAIL) with evidence, then aggregated into a coverage report.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Manual testing playbook is accessible (symlinked or direct path)
- [ ] Feature catalog is accessible (symlinked or direct path)
- [ ] MCP server is running and responding to tool calls
- [ ] Test database is in a known state (fresh or documented baseline)

### Definition of Done
- [ ] All 272 exact scenario IDs have recorded verdicts
- [ ] Per-phase summaries are complete for all 24 subdirectories
- [ ] Aggregate coverage report is produced
- [ ] Bugs and playbook errors are documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phased manual test execution with verdict recording.

### Key Components
- **Playbook**: 231 scenario files across 19 categories providing prompts, expected behavior, and pass/fail criteria
- **Feature Catalog**: 220 feature definitions across 19 categories providing feature context
- **Phase Folders**: 24 top-level subdirectories (22 numbered phase folders plus `memory/` and `scratch/`)
- **Aggregate Report**: Summary of all phase results with overall coverage metrics

### Data Flow
```
Playbook scenario file -> Read prompts/criteria -> Execute against MCP server -> Record verdict with evidence -> Phase summary -> Aggregate report
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-Execution Setup
- [ ] Verify playbook and feature catalog are accessible
- [ ] Verify MCP server is running and healthy (`memory_health`)
- [ ] Document test environment baseline (database state, feature flags, server version)
- [ ] Confirm all 24 top-level subdirectories exist with scenario files

### Phase 2: Execute Numbered Phase Folders
Execute each phase by running its test scenarios per playbook. Phases can be run independently or in sequence.

| Phase | Folder | Scenarios | Exact IDs |
|-------|--------|-----------|-----------|
| 001 | `001-retrieval/` | 13 | 13 |
| 002 | `002-mutation/` | 9 | 9 |
| 003 | `003-discovery/` | 3 | 3 |
| 004 | `004-maintenance/` | 2 | 2 |
| 005 | `005-lifecycle/` | 10 | 10 |
| 006 | `006-analysis/` | 7 | 7 |
| 007 | `007-evaluation/` | 2 | 2 |
| 008 | `008-bug-fixes-and-data-integrity/` | 11 | 11 |
| 009 | `009-evaluation-and-measurement/` | 16 | 16 |
| 010 | `010-graph-signal-activation/` | 15 | 15 |
| 011 | `011-scoring-and-calibration/` | 22 | 22 |
| 012 | `012-query-intelligence/` | 10 | 10 |
| 013 | `013-memory-quality-and-indexing/` | 27 | 34 |
| 014 | `014-pipeline-architecture/` | 18 | 18 |
| 015 | `015-retrieval-enhancements/` | 11 | 11 |
| 016 | `016-tooling-and-scripts/` | 33 | 65 |
| 017 | `017-governance/` | 5 | 5 |
| 018 | `018-ux-hooks/` | 11 | 11 |
| 019 | `019-feature-flag-reference/` | 8 | 8 |

For each phase:
1. Read scenario files from the playbook category
2. Execute each scenario's prompts/commands against the MCP server
3. Compare actual behavior against expected behavior
4. Record verdict (PASS/PARTIAL/FAIL) with evidence
5. Document any bugs or playbook errors discovered

### Phase 3: Aggregate Results
- [ ] Collect per-phase verdict summaries
- [ ] Produce aggregate coverage table (phase, pass, partial, fail, total)
- [ ] Calculate overall pass rate
- [ ] List all FAIL scenarios requiring follow-up
- [ ] Document all bugs and playbook errors discovered
### Phase 4: Traceability Remediation (from deep review 2026-03-26)

Deep review (6 iterations, 12 GPT-5.4 agents) found traceability gaps. Verdict: CONDITIONAL.
Full report: [`review-report.md`](review-report.md)

#### WS-1 (P0): Create 29 Missing Playbook Scenarios
Create one playbook scenario file per true-gap feature. Use `create:testing-playbook` skill.

| # | Category | Feature Catalog Entry | Target Playbook Path |
|---|----------|-----------------------|---------------------|
| 1 | 01 | `07-ast-level-section-retrieval-tool.md` | `01--retrieval/` |
| 2 | 01 | `09-tool-result-extraction-to-working-memory.md` | `01--retrieval/` |
| 3 | 01 | `11-session-recovery-memory-continue.md` | `01--retrieval/` |
| 4 | 02 | `07-namespace-management-crud-tools.md` | `02--mutation/` |
| 5 | 02 | `09-correction-tracking-with-undo.md` | `02--mutation/` |
| 6 | 10 | `09-anchor-tags-as-graph-nodes.md` | `10--graph-signal-activation/` |
| 7 | 10 | `10-causal-neighbor-boost-and-injection.md` | `10--graph-signal-activation/` |
| 8 | 10 | `11-temporal-contiguity-layer.md` | `10--graph-signal-activation/` |
| 9 | 11 | `15-tool-level-ttl-cache.md` | `11--scoring-and-calibration/` |
| 10 | 11 | `16-access-driven-popularity-scoring.md` | `11--scoring-and-calibration/` |
| 11 | 11 | `17-temporal-structural-coherence-scoring.md` | `11--scoring-and-calibration/` |
| 12 | 13 | `11-content-aware-memory-filename-generation.md` | `13--memory-quality-and-indexing/` |
| 13 | 13 | `12-generation-time-duplicate-and-empty-content-prevention.md` | `13--memory-quality-and-indexing/` |
| 14 | 14 | `15-warm-server-daemon-mode.md` | `14--pipeline-architecture/` |
| 15 | 14 | `16-backend-storage-adapter-abstraction.md` | `14--pipeline-architecture/` |
| 16 | 14 | `18-atomic-write-then-index-api.md` | `14--pipeline-architecture/` |
| 17 | 14 | `19-embedding-retry-orchestrator.md` | `14--pipeline-architecture/` |
| 18 | 14 | `20-7-layer-tool-architecture-metadata.md` | `14--pipeline-architecture/` |
| 19 | 16 | `02-architecture-boundary-enforcement.md` | `16--tooling-and-scripts/` |
| 20 | 16 | `08-watcher-delete-rename-cleanup.md` | `16--tooling-and-scripts/` |
| 21 | 16 | `18-template-compliance-contract-enforcement.md` | `16--tooling-and-scripts/` |
| 22 | 18 | `01-shared-post-mutation-hook-wiring.md` | `18--ux-hooks/` |
| 23 | 18 | `02-memory-health-autorepair-metadata.md` | `18--ux-hooks/` |
| 24 | 18 | `04-schema-and-type-contract-synchronization.md` | `18--ux-hooks/` |
| 25 | 18 | `06-mutation-hook-result-contract-expansion.md` | `18--ux-hooks/` |
| 26 | 18 | `07-mutation-response-ux-payload-exposure.md` | `18--ux-hooks/` |
| 27 | 18 | `10-atomic-save-parity-and-partial-indexing-hints.md` | `18--ux-hooks/` |
| 28 | 18 | `11-final-token-metadata-recomputation.md` | `18--ux-hooks/` |
| 29 | 18 | `13-end-to-end-success-envelope-verification.md` | `18--ux-hooks/` |

#### WS-2 (P1): Add Feature Catalog Back-References to 65 Playbook Scenarios
Add `- Feature catalog: [path](../../feature_catalog/path)` to Section 4 REFERENCES in:
- 25 covered-but-unlinked scenarios (feature-flag-gated IDs 156-180)
- 40 other orphan scenarios (M-001 through M-011, PHASE-001 through PHASE-005, IDs 182-187)

#### WS-3 (P1): Complete Section 12 Cross-Reference Index
Append rows to Section 12 table in `MANUAL_TESTING_PLAYBOOK.md`:
- 4 existing catalog entries currently missing from Section 12
- 29 new entries from WS-1 (after scenarios are created)

#### WS-4 (P1): Add Scenario Registry Tables to 17 Spec Phases
Add `### Scenario Registry` table to spec.md in these 17 phases (use `006-analysis/spec.md` as template):

003, 004, 005, 008, 009, 010, 011, 012, 014, 015, 016, 017, 018, 019, 020, 021, 022

#### WS-5 (Validation): Cross-Check Verification
- [ ] Re-run programmatic cross-reference check confirming 0 true gaps remaining
- [ ] Verify all 222 catalog entries appear in Section 12
- [ ] Verify all playbook scenarios have `Feature catalog:` back-reference
- [ ] Verify all spec phases have Scenario Registry tables
- [ ] Update parent spec.md counts to reflect new totals
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual scenario execution | All 272 exact IDs across 24 subdirectories | MCP tool calls, CLI commands |
| Verdict recording | Per-scenario pass/fail with evidence | Inline documentation in phase folders |
| Coverage aggregation | All 24 subdirectories | Summary table in implementation-summary.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook | Internal | Green | Cannot execute -- source of all scenarios |
| Feature catalog | Internal | Green | Cannot map scenarios to features |
| MCP server (spec-kit-memory) | Internal | Green | Cannot execute tool-based scenarios |
| Embedding service | External | Green | Embedding-dependent scenarios blocked |
| SQLite database | Internal | Green | Cannot test data-dependent scenarios |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test execution corrupts database state or produces unreliable results
- **Procedure**: Restore database from checkpoint, re-execute affected phase from clean state
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Execute) ──► Phase 3 (Aggregate) ──► Phase 4 (Traceability Remediation)
                                                                     ├─ WS-1 (Create 29 scenarios)
                                                                     ├─ WS-2 (Add 65 back-refs)  ← WS-1
                                                                     ├─ WS-3 (Complete Sec.12)    ← WS-1
                                                                     ├─ WS-4 (17 Registries)     ← WS-1,2,3
                                                                     └─ WS-5 (Validation)        ← WS-1,2,3,4
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Execute |
| Execute (001-019) | Setup | Aggregate |
| Aggregate | Execute | Remediation |
| WS-1 (Create scenarios) | Aggregate | WS-2, WS-3 |
| WS-2 (Back-refs) | WS-1 | WS-4 |
| WS-3 (Section 12) | WS-1 | WS-4 |
| WS-4 (Registries) | WS-1, WS-2, WS-3 | WS-5 |
| WS-5 (Validation) | WS-1, WS-2, WS-3, WS-4 | None |

Note: Within Phase 2, individual phase folders (001-022) are independent and can be executed in any order or in parallel. Within Phase 4, WS-1 must complete before WS-2/WS-3; WS-4 waits for WS-1/2/3.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Execute (24 subdirectories) | High | 3-4 days |
| Aggregate | Low | 2 hours |
| **Total** | | **4-5 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Database checkpoint created before testing begins
- [ ] Test environment state documented
- [ ] Feature flag configuration captured

### Rollback Procedure
1. Restore database from pre-testing checkpoint
2. Re-execute affected phase with corrected approach
3. Verify restored state matches pre-testing baseline

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Checkpoint restore via `checkpoint_restore`
<!-- /ANCHOR:enhanced-rollback -->

---
