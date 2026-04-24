---
title: "Implementation Plan: manual-testing-per [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/plan]"
description: "Truth-sync plan for the root manual-testing wrapper packet against the live 290-file playbook tree, while preserving historical execution evidence."
trigger_phrases:
  - "manual testing plan"
  - "testing phases"
  - "playbook execution"
  - "test execution plan"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
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
| **Language/Stack** | Markdown wrapper docs over the system-spec-kit playbook tree |
| **Framework** | system-spec-kit packet + manual testing playbook |
| **Storage** | Root packet docs plus read-only playbook/category folders |
| **Testing** | Focused validators and live-tree recounts |

### Overview
This plan now governs wrapper truth-sync, not a fresh end-to-end manual execution wave. The root packet needs to:

- report the live denominator of `290` scenario files across `21` categories,
- include all 22 numbered phase folders that currently exist in the wrapper packet,
- preserve the older `272 exact ID` execution wave as historical evidence only,
- keep the still-open traceability remediation visible.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live playbook recount complete (`290` scenario files across `21` categories)
- [x] Live feature-catalog recount complete (`255` entries across `21` categories)
- [x] Current phase-folder inventory confirmed (`001` through `022`)
- [x] Historical execution evidence boundary identified

### Definition of Done
- [ ] Root docs use the live denominator consistently
- [ ] Historical execution evidence is explicitly labeled as historical
- [ ] Traceability-remediation work remains visible
- [ ] Focused validation passes after the wrapper edits
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Wrapper truth-sync with historical execution preservation.

### Key Components
- **Playbook**: 290 live scenario files across 21 categories
- **Feature Catalog**: 255 live entries across 21 categories
- **Phase Folders**: 22 numbered wrapper phases plus `memory/` and `scratch/`
- **Historical Execution Evidence**: the older `272 exact ID` result set

### Data Flow
```
Live recount -> wrapper truth-sync -> historical-boundary labeling -> focused validation -> updated release-control trust
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Recount And Boundary Check
- [ ] Recount the live playbook and feature-catalog denominators
- [ ] Confirm all 22 numbered phase folders still exist
- [ ] Mark which phase folders are live categories versus retained duplicates

### Phase 2: Root Wrapper Truth-Sync
- [ ] Update root docs to `290` scenario files and `21` categories
- [ ] Preserve the `272 exact ID` execution wave as historical evidence only
- [ ] Keep the 2026-03-26 traceability remediation visible

### Phase 3: Focused Validation
- [ ] Re-run `validate.sh` on the root 015 packet
- [ ] Re-read denominator lines, phase map rows, and remediation references for consistency
- [ ] Report any residual blockers without overstating closure

### Phase 4: Traceability Remediation (from deep review 2026-03-26)

Deep review (6 iterations, 12 GPT-5.4 agents) found traceability gaps. Verdict: CONDITIONAL.
Full report: [`review-report.md`](review-report.md)

#### WS-1 (P0): Create 29 Missing Playbook Scenarios
Create one playbook scenario file per true-gap feature. Use `create:testing-playbook` skill.

| # | Category | Feature Catalog Entry | Target Playbook Path |
|---|----------|-----------------------|---------------------|
| 1 | 01 | `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md` | `01--retrieval/` |
| 2 | 01 | `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md` | `01--retrieval/` |
| 3 | 01 | `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md` | `01--retrieval/` |
| 4 | 02 | `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md` | `02--mutation/` |
| 5 | 02 | `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md` | `02--mutation/` |
| 6 | 10 | `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md` | `10--graph-signal-activation/` |
| 7 | 10 | `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md` | `10--graph-signal-activation/` |
| 8 | 10 | `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md` | `10--graph-signal-activation/` |
| 9 | 11 | `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md` | `11--scoring-and-calibration/` |
| 10 | 11 | `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md` | `11--scoring-and-calibration/` |
| 11 | 11 | `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md` | `11--scoring-and-calibration/` |
| 12 | 13 | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md` | `13--memory-quality-and-indexing/` |
| 13 | 13 | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md` | `13--memory-quality-and-indexing/` |
| 14 | 14 | `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md` | `14--pipeline-architecture/` |
| 15 | 14 | `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md` | `14--pipeline-architecture/` |
| 16 | 14 | `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md` | `14--pipeline-architecture/` |
| 17 | 14 | `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md` | `14--pipeline-architecture/` |
| 18 | 14 | `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md` | `14--pipeline-architecture/` |
| 19 | 16 | `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md` | `16--tooling-and-scripts/` |
| 20 | 16 | `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md` | `16--tooling-and-scripts/` |
| 21 | 16 | `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md` | `16--tooling-and-scripts/` |
| 22 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md` | `18--ux-hooks/` |
| 23 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md` | `18--ux-hooks/` |
| 24 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md` | `18--ux-hooks/` |
| 25 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md` | `18--ux-hooks/` |
| 26 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md` | `18--ux-hooks/` |
| 27 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md` | `18--ux-hooks/` |
| 28 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md` | `18--ux-hooks/` |
| 29 | 18 | `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md` | `18--ux-hooks/` |

#### WS-2 (P1): Add Feature Catalog Back-References to 65 Playbook Scenarios
Add `- Feature catalog: [path](../../feature_catalog/path)` to Section 4 REFERENCES in:
- 25 covered-but-unlinked scenarios (feature-flag-gated IDs 156-180)
- 40 other orphan scenarios (M-001 through M-011, PHASE-001 through PHASE-005, IDs 182-187)

#### WS-3 (P1): Complete Section 12 Cross-Reference Index
Append rows to Section 12 table in `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`:
- 4 existing catalog entries currently missing from Section 12
- 29 new entries from WS-1 (after scenarios are created)

#### WS-4 (P1): Add Scenario Registry Tables to 17 Spec Phases
Add `### Scenario Registry` table to spec.md in these 17 phases (use `006-analysis/spec.md` as template):

003, 004, 005, 008, 009, 010, 011, 012, 014, 015, 016, 017, 018, 019, 020, 021, 022

#### WS-5 (Validation): Cross-Check Verification
- [ ] Re-run programmatic cross-reference check confirming 0 true gaps remaining
- [ ] Verify all live catalog entries appear in Section 12 or an explicitly documented exception set
- [ ] Verify all playbook scenarios have `Feature catalog:` back-reference
- [ ] Verify all spec phases have Scenario Registry tables
- [ ] Update parent spec.md counts to reflect current live totals
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live recount | Root wrapper denominator truth | `find`, `rg`, focused readback |
| Packet validation | Root wrapper packet | `validate.sh` |
| Traceability follow-up | Review-surface accuracy | targeted file checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook | Internal | Green | Cannot maintain wrapper truth without the live tree |
| Feature catalog | Internal | Green | Cannot maintain traceability truth without current catalog totals |
| Historical execution evidence | Internal | Green | Older PASS totals need explicit boundary labeling |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Root wrapper edits reintroduce stale counts, inconsistent phase maps, or false completion claims
- **Procedure**: Restore the affected root docs and reapply only the verified live counts and historical-boundary notes
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Recount) ──► Phase 2 (Truth-sync) ──► Phase 3 (Validation)
                                         \
                                          └──► Phase 4 (Traceability remediation remains active)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Recount | None | Truth-sync |
| Truth-sync | Recount | Validation |
| Validation | Truth-sync | Accurate wrapper state |
| WS-1 (Create scenarios) | Aggregate | WS-2, WS-3 |
| WS-2 (Back-refs) | WS-1 | WS-4 |
| WS-3 (Section 12) | WS-1 | WS-4 |
| WS-4 (Registries) | WS-1, WS-2, WS-3 | WS-5 |
| WS-5 (Validation) | WS-1, WS-2, WS-3, WS-4 | None |

Note: Within Phase 2, individual phase folders (001-022) are independent and can be executed in any order or in parallel. Within Phase 4, WS-1 must complete before WS-2/WS-3; WS-4 waits for WS-1/2/3.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Recount and truth-sync | Low | <0.5 day |
| Focused validation | Low | <0.25 day |
| Traceability remediation follow-up | High | Separate implementation wave |
| **Total** | | **Wrapper-dependent follow-up after recount** |
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
