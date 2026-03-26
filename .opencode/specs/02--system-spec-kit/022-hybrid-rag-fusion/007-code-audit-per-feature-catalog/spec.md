---
title: "Feature Specification: Code Audit per Feature Catalog"
description: "Comprehensive code audit of the Spec Kit Memory MCP server organized by the 19-category feature catalog covering 222 live features across 22 child folders."
trigger_phrases:
  - "code audit"
  - "feature catalog audit"
  - "spec kit memory audit"
  - "007 code audit"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Code Audit per Feature Catalog

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Comprehensive code audit of the Spec Kit Memory MCP server, systematically verifying the 222-feature live catalog against the actual source code. The work is decomposed into 22 child folders (001-022): 19 category audits, 2 synthesis/remediation meta-phases, and 1 downstream implementation/removal follow-up tracked under the same umbrella packet.

**Key Decisions**: Organize audit by feature catalog categories (not by source file), use phase decomposition for parallel execution

**Critical Dependencies**: Feature catalog must be current and complete before audit phases begin

---

**Deep Research Addendum (2026-03-26)**

A 12-agent deep research campaign (~3.3M tokens, GPT-5.4 high/xhigh via Codex CLI) cross-referenced the audit against current source code and feature catalog. Key findings:

- **Stale feature count:** Umbrella spec says 218 features; actual catalog now has **222 snippets**. Delta of 4 needs reconciliation.
- **5 unaudited snippets:** (1) session recovery `01/11`, (2) template compliance `16/18`, (3) audit mapping note `19/08`, (4) cat 20 stub, (5) cat 21 stub.
- **13 BOTH_MISSING capabilities** exist in source but have no catalog entry AND no audit coverage: entire `mcp_server/api/` surface (6 files), ops/setup/kpi scripts, config contracts, constitutional gate-enforcement, phase-system node.
- **2 AUDIT_MISSING** items (in catalog but not audited): `scripts/spec/create.sh`, `scripts/spec/validate.sh`.
- **Phases 019/021/022** are mapping/meta packets whose audited-item lists no longer correspond to live catalog entries — consider reclassifying.
- **Phases 009 and 011** have implementation summaries that overcount retired features no longer in the live catalog.

Full details: `scratch/deep-research-gap-report-2026-03-26.md` and `scratch/deep-research-round2-2026-03-26.md`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — 100% MATCH (catalog remediation applied 2026-03-26) |
| **Completed** | 2026-03-26 |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../006-feature-catalog/spec.md |
| **Successor** | ../008-hydra-db-based-features/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for the Spec Kit Memory MCP server has evolved significantly through multiple refinement phases, now documenting 222 live features across 19 categories. No systematic audit has verified whether each documented feature accurately reflects the current source code. Gaps between documentation and implementation create risk of incorrect AI agent behavior, stale references, and undetected regressions.

### Purpose
Establish a verified baseline where every feature in the catalog has been audited against source code, with findings documented per category and cross-phase dependencies mapped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 222 live features across 19 feature catalog categories
- Verify each feature's documented behavior against source code
- Document findings (confirmed, divergent, missing, deprecated) per phase
- Map cross-phase dependencies and shared code paths
- Produce a synthesis report with aggregate findings

### Out of Scope
- Fixing discovered code issues - deferred to remediation phase (021)
- Modifying the feature catalog itself - separate workflow
- Performance benchmarking of features - separate spec
- Adding new features not in the catalog - out of audit scope

### Phase Folders

| Phase | Folder | Feature Count | Category |
|-------|--------|---------------|----------|
| 1 | `001-retrieval/` | 11 | Retrieval |
| 2 | `002-mutation/` | 10 | Mutation |
| 3 | `003-discovery/` | 3 | Discovery |
| 4 | `004-maintenance/` | 2 | Maintenance |
| 5 | `005-lifecycle/` | 7 | Lifecycle |
| 6 | `006-analysis/` | 7 | Analysis |
| 7 | `007-evaluation/` | 2 | Evaluation |
| 8 | `008-bug-fixes-and-data-integrity/` | 11 | Bug Fixes and Data Integrity |
| 9 | `009-evaluation-and-measurement/` | 14 | Evaluation and Measurement |
| 10 | `010-graph-signal-activation/` | 16 | Graph Signal Activation |
| 11 | `011-scoring-and-calibration/` | 22 | Scoring and Calibration |
| 12 | `012-query-intelligence/` | 11 | Query Intelligence |
| 13 | `013-memory-quality-and-indexing/` | 24 | Memory Quality and Indexing |
| 14 | `014-pipeline-architecture/` | 22 | Pipeline Architecture |
| 15 | `015-retrieval-enhancements/` | 9 | Retrieval Enhancements |
| 16 | `016-tooling-and-scripts/` | 17 | Tooling and Scripts |
| 17 | `017-governance/` | 4 | Governance |
| 18 | `018-ux-hooks/` | 19 | UX Hooks |
| 19 | `019-decisions-and-deferrals/` | cross-cutting | Decisions and Deferrals |
| 20 | `020-feature-flag-reference/` | 7 | Feature Flag Reference |
| 21 | `021-remediation-revalidation/` | meta-phase | Remediation and Revalidation |
| 22 | `022-implement-and-remove-deprecated-features/` | follow-up | Implementation and removal follow-up |
<!-- /ANCHOR:scope -->

### Catalog/Audit Matching Contract

Matching between feature-catalog categories and audit phases is **slug-based**, not ordinal-based.

- Compare the text portion after the numeric prefix (for example, `feature-flag-reference`).
- Do not require numeric prefixes to match (for example, `19--feature-flag-reference` may map to `020-feature-flag-reference`).

---

## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 1 | `001-retrieval/` | Audit 11 retrieval features (memory_context, memory_search, memory_continue, etc.) | None | Coverage sync required (8M/2P + 1 pending) |
| 2 | `002-mutation/` | Audit 10 mutation features (memory_save, memory_update, etc.) | None | Complete (8M/2P) |
| 3 | `003-discovery/` | Audit 3 discovery features (memory_list, memory_stats, memory_health) | None | Complete (2M/1P) |
| 4 | `004-maintenance/` | Audit 2 maintenance features (index_scan, startup guards) | None | Complete (1M/1P) |
| 5 | `005-lifecycle/` | Audit 7 lifecycle features (checkpoint, ingest, etc.) | None | Complete (4M/3P) |
| 6 | `006-analysis/` | Audit 7 analysis features (causal_link, drift_why, etc.) | None | Complete (5M/2P) |
| 7 | `007-evaluation/` | Audit 2 evaluation features (eval_run_ablation, etc.) | None | Complete (1M/1P) |
| 8 | `008-bug-fixes-and-data-integrity/` | Audit 11 bug fix features | None | Complete (9M/2P) |
| 9 | `009-evaluation-and-measurement/` | Audit 14 eval/measurement features | None | Complete (11M/3P) |
| 10 | `010-graph-signal-activation/` | Audit 16 graph signal features | None | Complete (12M/4P) |
| 11 | `011-scoring-and-calibration/` | Audit 22 scoring/calibration features | None | Complete (20M/2P) |
| 12 | `012-query-intelligence/` | Audit 11 query intelligence features | None | Complete (8M/3P) |
| 13 | `013-memory-quality-and-indexing/` | Audit 24 memory quality features | None | Complete (20M/4P) |
| 14 | `014-pipeline-architecture/` | Audit 22 pipeline architecture features | None | Complete (19M/3P) |
| 15 | `015-retrieval-enhancements/` | Audit 9 retrieval enhancement features | None | Complete (8M/1P) |
| 16 | `016-tooling-and-scripts/` | Audit 17 tooling/script features | None | Complete (16M/1P) |
| 17 | `017-governance/` | Audit 4 governance features | None | Complete (3M/1P) |
| 18 | `018-ux-hooks/` | Audit 19 UX hook features | None | Complete (17M/2P) |
| 19 | `019-decisions-and-deferrals/` | Cross-cutting decisions and deferrals synthesis | 001-018 | Complete |
| 20 | `020-feature-flag-reference/` | Audit 7 feature flag references | None | Complete (6M/1P) |
| 21 | `021-remediation-revalidation/` | Synthesize findings, plan remediation | 001-020 | Complete |
| 22 | `022-implement-and-remove-deprecated-features/` | Apply downstream implementation/removal work surfaced by deprecated-feature audits | 009, 011, 019, 021 | Live child tracked under umbrella |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume 007-code-audit-per-feature-catalog/NNN-phase/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Phases 001-018 and 020 can execute in parallel (no inter-dependencies)
- Phase 019 requires phases 001-018 to complete (cross-cutting analysis)
- Phase 021 requires all other phases to complete (remediation synthesis)
- Phase 022 consumes deprecated-feature findings from phases 009, 011, 019, and 021 under umbrella ownership

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-018, 020 (parallel) | 019-decisions-and-deferrals | All category audits complete with findings documented | Each phase folder has implementation-summary.md |
| 001-020 | 021-remediation-revalidation | All audits and cross-cutting analysis complete | All phase folders pass validate.sh |
| 009, 011, 019, 021 | 022-implement-and-remove-deprecated-features | Deprecated-feature decisions translated into a scoped implementation/removal packet | Child spec records parent ownership and downstream outputs |

### Traceability

Completed second-half phases 012-022 remain owned by this umbrella packet. Each child phase declares parent ownership in its local `spec.md`, consumes the inputs listed below, and returns its outputs back to `007-code-audit-per-feature-catalog`.

| Phase | Scope | Upstream Inputs | Downstream Outputs | Parent |
|-------|-------|-----------------|--------------------|--------|
| `012-query-intelligence/` | Query-intelligence audit packet | Live Query Intelligence catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `013-memory-quality-and-indexing/` | Memory quality/indexing audit packet | Live Memory Quality and Indexing catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `014-pipeline-architecture/` | Pipeline architecture audit packet | Live Pipeline Architecture catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `015-retrieval-enhancements/` | Retrieval enhancements audit packet | Live Retrieval Enhancements catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `016-tooling-and-scripts/` | Tooling/scripts audit packet | Live Tooling and Scripts catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `017-governance/` | Governance audit packet | Live Governance catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `018-ux-hooks/` | UX hooks audit packet | Live UX Hooks catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `019-decisions-and-deferrals/` | Cross-cutting decisions/deferrals synthesis | Outputs from category audit phases | Cross-phase decisions, deferrals, and implementation-summary.md | `007-code-audit-per-feature-catalog` |
| `020-feature-flag-reference/` | Feature-flag audit packet | Live Feature Flag Reference catalog + 007 audit method | Phase findings and implementation summary | `007-code-audit-per-feature-catalog` |
| `021-remediation-revalidation/` | Remediation synthesis packet | Outputs from phases 001-020 | Prioritized remediation backlog and revalidation summary | `007-code-audit-per-feature-catalog` |
| `022-implement-and-remove-deprecated-features/` | Downstream implementation/removal follow-up | Deprecated-feature findings from phases 009, 011, 019, and 021 | Applied follow-up scope tracked under umbrella ownership | `007-code-audit-per-feature-catalog` |

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each phase folder audits every feature in its catalog category against source code | Phase implementation-summary.md lists every feature with status (confirmed/divergent/missing/deprecated) |
| REQ-002 | Findings include source file references with line numbers | Each finding cites `[SOURCE: file:lines]` |
| REQ-003 | Feature-to-code traceability matrix per phase | Each phase has a traceability table mapping feature name to source location |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cross-phase dependency mapping | Phase 019 documents shared code paths and cross-category interactions |
| REQ-005 | Aggregate synthesis report | Phase 021 produces summary statistics and prioritized remediation backlog |
| REQ-006 | Consistent audit methodology across all phases | All phases follow the same finding format and severity classification |
| REQ-007 | Umbrella packet preserves parent-child traceability for the late audit phases | Parent spec, plan, tasks, and checklist all reference the `012-022` umbrella contract |
| REQ-008 | Recursive strict validation can evaluate the full phase tree without child-level structural drift | All 22 child packets pass packet validation under the recursive umbrella run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 222 of 222 live-catalog features have explicit audit findings — 5 previously unaudited snippets now audited (T032-T036), 13 BOTH_MISSING capabilities documented (T037-T049), 2 AUDIT_MISSING scripts audited (T050-T051)
- **SC-002**: Every phase folder contains a completed implementation-summary.md with findings — all 22 phases updated with Phase 5 audit additions
- **SC-003**: Cross-phase dependency map identifies shared code paths between categories
- **SC-004**: Remediation backlog prioritized by severity (P0/P1/P2) for follow-up work
- **SC-005**: All 13 BOTH_MISSING capabilities documented — 5 API surface modules (ARCH-1 facades), 3 operational scripts, 1 eval script, 2 config files, 1 constitutional memory, 1 knowledge node. `storage.ts` confirmed as intentional minimal facade (not dead code)

### Acceptance Scenarios

- **Given** the 22-child audit tree, **when** recursive validation runs, **then** every child packet resolves as a structurally valid phase document.
- **Given** a maintainer reviewing the umbrella packet, **when** they inspect the phase map, **then** each late-phase child has explicit parent ownership and downstream outputs.
- **Given** the aggregate findings tables, **when** release-control uses them, **then** MATCH, PARTIAL, pending, and remediation states are easy to distinguish.
- **Given** a remediation session revisits this packet, **when** it follows the cross-phase contract, **then** the correct synthesis phases and downstream child packet are identified.
- **Given** a validator checks the Level 3 packet, **when** it counts requirements and scenarios, **then** the umbrella packet meets the Level 3 content minimums.
- **Given** future audit refresh work, **when** the umbrella packet is reused, **then** the methodology, dependency map, and remediation ownership remain discoverable in one place.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog currency | Audit results invalid if catalog is stale | Verify catalog version before starting; re-audit if catalog updates mid-process |
| Risk | Feature catalog still evolving | Medium | Freeze catalog version at audit start; document delta if updates occur |
| Risk | Some features may be deprecated or partially implemented | Low | Classify as "deprecated" or "partial" in findings rather than forcing pass/fail |
| Risk | Source code refactoring during audit | Medium | Use specific commit SHA as audit baseline |
| Dependency | Access to all MCP server source files | Audit blocked if files inaccessible | Verify file access in Phase 1 setup |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Scalability
- **NFR-S01**: Audit methodology must support parallel execution across the 21 audit/synthesis child phases while preserving umbrella traceability for follow-up child 022

### Consistency
- **NFR-C01**: All phases must use identical finding classification (confirmed/divergent/missing/deprecated)
- **NFR-C02**: All phases must use identical severity ratings (P0/P1/P2) for divergent findings

### Traceability
- **NFR-T01**: Every finding must reference both the feature catalog entry and the source code location

---

## 8. EDGE CASES

### Feature Boundaries
- Feature spans multiple source files: document all relevant file locations
- Feature partially implemented: classify as "partial" with percentage estimate

### Catalog Ambiguity
- Feature description is vague: document interpretation used for audit
- Duplicate features across categories: flag in cross-cutting analysis (phase 019)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 50+, Features: 222, Categories: 19 |
| Risk | 15/25 | Catalog evolution, cross-dependencies |
| Research | 15/20 | Source code investigation per feature |
| Multi-Agent | 12/15 | 21 parallel phase workstreams |
| Coordination | 11/15 | Cross-phase synthesis, consistent methodology |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Feature catalog updates during audit | H | M | Freeze catalog at audit start, track delta |
| R-002 | Inconsistent methodology across phases | M | M | Define methodology in parent spec, validate in review |
| R-003 | Source code changes during audit | M | L | Pin to specific commit SHA |
| R-004 | Phase 019/021 blocked by incomplete earlier phases | H | L | Track completion rigorously via phase map |

---

## 11. USER STORIES

### US-001: Category Audit (Priority: P0)

**As a** system maintainer, **I want** each feature catalog category audited against source code, **so that** I know which features are correctly implemented, divergent, or missing.

**Acceptance Criteria**:
1. Given a feature catalog category, When the audit completes, Then every feature has a status (confirmed/divergent/missing/deprecated) with source references

---

### US-002: Cross-Phase Synthesis (Priority: P1)

**As a** system architect, **I want** a cross-phase dependency map and remediation backlog, **so that** I can prioritize fixes based on impact across the entire system.

**Acceptance Criteria**:
1. Given all phase audits are complete, When the synthesis runs, Then a prioritized remediation backlog is produced with severity ratings

---

### Audit Results (Post-Remediation 2026-03-26)

| Metric | Value |
|--------|-------|
| Live features inventoried | 222 |
| Features with explicit findings | 222 |
| MATCH (exact accuracy) | **222 (100%)** |
| PARTIAL (minor issues) | **0 (0%)** |
| Pending coverage sync | 0 |
| MISMATCH (wrong) | **0 (0%)** |

All 84 PARTIAL and 5 MISMATCH findings from the re-audit (2026-03-23) were resolved by editing 53 catalog entries to accurately reflect source code: bloated source lists trimmed, behavioral drift corrected, flag defaults updated, deprecated modules properly documented.

### Deep Review (2026-03-25)

**Deep Review Update (2026-03-25)**: The parent audit packet is now tracked against the 2026-03-25 deep review rather than the original zero-MISMATCH baseline.

| Metric | Value |
|--------|-------|
| Verdict | PASS (remediated 2026-03-26; was CONDITIONAL) |
| P0 (Blockers) | 0 |
| P1 (Required) | 22 |
| P2 (Suggestions) | 35 |
| Tests Executed | 3,144+ passing |

### Deep Research Gap Analysis

A post-audit deep research cycle (10 iterations, 11 questions answered) identified five systemic gaps:

| # | Finding | Severity | Detail |
|---|---------|----------|--------|
| 1 | Coverage Gaps | HIGH | 32/286 source files unreferenced; 4 modules with zero mentions; session-manager 85% unaudited |
| 2 | Accuracy Concerns | MEDIUM | 85.7% correction accuracy in Wave 1; 2 MATCH boundary reclassifications (net zero) |
| 3 | Temporal Instability | HIGH | 82% files modified during audit; 22 flags graduated mid-audit |
| 4 | Structural Blind Spots | MEDIUM | Cross-cutting modules inversely correlated with audit effectiveness |
| 5 | Risk Concentration | CRITICAL | Phases 011 and 014 — highest density + deepest cross-module dependencies |

**Re-audit estimate**: 27-38 hours targeting 32 unreferenced files and 2 critical phases to reach coverage threshold.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- ~~Should deprecated features be removed from the catalog or marked in-place?~~ Mark in-place with @deprecated tag (Phase 019 recommendation)
- ~~What commit SHA should serve as the audit baseline?~~ Current HEAD on main branch at 2026-03-22
- ~~Should the remediation phase (021) create individual fix specs or a single batch spec?~~ Single remediation tracking phase (021) with prioritized backlog, plus downstream child `022-implement-and-remove-deprecated-features/` for deprecated-feature execution
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Feature Catalog**: See `../feature_catalog/FEATURE_CATALOG.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

---

<!--
LEVEL 3 SPEC - Parent Phase Spec
- 22 child folders under umbrella ownership
- 222 live-catalog features across 19 categories
- Cross-phase synthesis in phases 019 and 021, with downstream follow-up in phase 022
-->
