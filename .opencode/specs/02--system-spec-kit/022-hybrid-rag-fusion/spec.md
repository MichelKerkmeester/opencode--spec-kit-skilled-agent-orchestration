---
title: "Epic Specification: Hybrid RAG Fusion"
description: "Root epic specification for the 16-phase, 51-folder program that transformed the Spec Kit Memory MCP server from an unvalidated mixed-scoring retrieval system into a metric-gated, graph-differentiated, feedback-aware retrieval engine."
trigger_phrases:
  - "hybrid rag fusion"
  - "022 epic"
  - "retrieval refinement program"
  - "spec kit memory epic"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: CORE -->
# Epic Specification: 022-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

The Hybrid RAG Fusion epic is a 16-phase program (51 spec folders) that transformed the Spec Kit Memory MCP server's retrieval pipeline from a broken state (0% graph hit rate, 15:1 scoring mismatch, zero evaluation metrics) into a metric-gated, graph-differentiated, feedback-aware retrieval engine with 189 cataloged features across 19 categories, 7,500+ passing tests, and a comprehensive code audit of every feature. The program delivered 8 core RAG sprints, architecture audits, bug-fix campaigns, a feature catalog with per-feature markdown documentation, a 21-child code audit campaign, a 6-child Hydra database architecture roadmap, and UX/automation improvements, all governed by sprint exit gates and multi-agent verification campaigns.

**Key Decisions**: Evaluation first (R13 gates all improvements), calibration before surgery (normalize scores before pipeline refactor), density before deepening (edge creation before graph traversal sophistication).

**Critical Dependencies**: Sprint 0 exit gate (BM25 baseline) determines the trajectory of all subsequent sprints.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 (epic) |
| **Status** | In Progress (~80% complete) |
| **Created** | 2025-12-01 |
| **Updated** | 2026-03-14 |
| **Branch** | `017-markovian-architectures` |
| **Complexity** | 95/100 |
| **Spec Folders** | 51 total (16 main phases + 21 code-audit children + 6 Hydra children + 7 finalization children + 1 root) |
| **Feature Count** | 189 features across 19 categories |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Spec Kit Memory MCP server suffered from three compounding failures: (1) the graph channel produced 0% hit rate in production due to an ID format mismatch (`mem:${edgeId}` strings vs numeric IDs), making the system operate as a 3-channel system despite being designed as 4-channel; (2) the dual scoring systems (RRF fusion ~[0, 0.07] and composite scoring ~[0, 1]) had a ~15:1 magnitude mismatch where composite dominated purely due to scale, not quality; (3) zero retrieval quality metrics existed despite 15+ implemented scoring signals, making every tuning decision speculation.

Beyond these core retrieval issues, the broader system lacked: standardized spec documentation quality, constitutional memory management, UX consistency in mutation responses, per-feature documentation traceability, and a forward-looking database architecture for multi-agent collaboration.

### Purpose

Transform the system into a measurably improving, graph-differentiated, feedback-aware retrieval engine where the graph channel is fully activated, scoring is calibrated, every improvement is validated by metric gates, and the entire feature surface is documented, audited, and architecturally governed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

This epic encompasses 16 main phases spanning:

- **Core RAG Pipeline**: 8-sprint refinement program (43 recommendations + 8 PageIndex-derived + 6 sprint-derived requirements)
- **Quality & Standards**: Spec-Kit quality enforcement, constitutional memory refactoring
- **Bug Fixes & Hardening**: Multi-wave bug fix campaigns, architecture boundary audits
- **UX & Automation**: Mutation hook standardization, session capture pipeline hardening
- **Catalog & Audit**: Feature catalog creation (189 features, 19 categories), comprehensive 21-child code audit
- **Architecture & Roadmap**: Hydra database architecture (6 phases), session/description/agent memory improvements
- **Pending Work**: Skill alignment, command alignment, finalization (7 children)

### Out of Scope

- R3 (SKIP): sqlite-vec handles normalization internally
- R5 (DEFER): Activation condition unmet (10K+ memories OR >50ms latency)
- N5 (DROP): Two-model ensemble doubles storage/cost
- HNSW indexing: Irrelevant below 10K memories
- LLM calls in search hot path: 500ms p95 hard limit violation

### Phase Status Dashboard

| # | Phase | Status | Level | Key Metric |
|---|-------|--------|-------|------------|
| 001 | Hybrid RAG Fusion Epic | In Progress (this root + child spec) | 3+ | Program coordination |
| 002 | Indexing Normalization | **Complete** | 3 | 238 tests, canonical dedup |
| 003 | Constitutional Learn Refactor | **Complete** | 2 | 583 tests, full rewrite |
| 004 | UX Hooks Automation | **Complete** | 2 | 1,466 test executions |
| 005 | Architecture Audit | **Complete** | 3 | 50 files, boundary contract |
| 006 | Feature Catalog | In Progress | 3 | 40/40 handlers traced |
| 007 | Code Audit per Feature Catalog | **Complete** (parent) | 1 | 21 children, all audited |
| 008 | Hydra DB-Based Features | **Complete** | 3 | 6 children, all verified |
| 009 | Skill Alignment | Stub | - | Empty scaffold |
| 010 | Perfect Session Capturing | In Progress | 3 | 375 tests, 67 deferred |
| 011 | Command Alignment | Stub | - | Empty scaffold |
| 012 | Agents Alignment | Stub | - | Empty scaffold |
| 013 | Agents MD Alignment | Stub | - | Empty scaffold |
| 014 | Manual Testing per Playbook | Stub | - | Empty scaffold |
| 015 | Rewrite Memory MCP README | Stub | - | Empty scaffold |
| 016 | Update Install Guide | Stub | - | Empty scaffold |
| 017 | Rewrite System SpecKit README | Stub | - | Empty scaffold |
| 018 | Rewrite Repo README | Stub | - | Empty scaffold |
| 999 | Finalization | Pending | - | 7 children, all stubs |
<!-- /ANCHOR:scope -->

---

## 4. PHASE DOCUMENTATION MAP

### Main Phases (001-018 + 999)

| Phase | Folder | Children | Status | Last Updated |
|-------|--------|----------|--------|--------------|
| 001 | `001-hybrid-rag-fusion-epic` | 0 | In Progress | 2026-03-14 |
| 002 | `002-indexing-normalization` | 0 | Complete | 2026-03-08 |
| 003 | `003-constitutional-learn-refactor` | 0 | Complete | 2026-03-08 |
| 004 | `004-ux-hooks-automation` | 0 | Complete | 2026-03-08 |
| 005 | `005-architecture-audit` | 0 | Complete | 2026-03-08 |
| 006 | `006-feature-catalog` | 0 | In Progress | 2026-03-14 |
| 007 | `007-code-audit-per-feature-catalog` | 21 | Complete | 2026-03-14 |
| 008 | `008-hydra-db-based-features` | 6 | Complete | 2026-03-14 |
| 009 | `009-skill-alignment` | 0 | Stub | 2026-03-14 |
| 010 | `010-perfect-session-capturing` | 0 | In Progress | 2026-03-14 |
| 011 | `011-command-alignment` | 0 | Stub | 2026-03-14 |
| 012 | `012-agents-alignment` | 0 | Stub | 2026-03-14 |
| 013 | `013-agents-md-alignment` | 0 | Stub | 2026-03-14 |
| 014 | `014-manual-testing-per-playbook` | 0 | Stub | 2026-03-14 |
| 015 | `015-rewrite-memory-mcp-readme` | 0 | Stub | 2026-03-14 |
| 016 | `016-update-install-guide` | 0 | Stub | 2026-03-14 |
| 017 | `017-rewrite-system-speckit-readme` | 0 | Stub | 2026-03-14 |
| 018 | `018-rewrite-repo-readme` | 0 | Stub | 2026-03-14 |
| 999 | `999-finalization` | 7 | Pending | 2026-03-14 |

### 007 Code Audit Children (21 folders)

| # | Folder | Scope | Status |
|---|--------|-------|--------|
| 001 | `001-retrieval` | 9 features: search, trigger matching, pipeline, BM25, section retrieval | Complete |
| 002 | `002-mutation` | 10 features: save, update, delete, bulk delete, validation, transactions | Complete |
| 003 | `003-discovery` | 3 features: memory_list, memory_stats, memory_health | Complete |
| 004 | `004-maintenance` | 2 features: index_scan, startup guards | Complete |
| 005 | `005-lifecycle` | 7 features: checkpoint CRUD, async ingestion, recovery, archival | Complete |
| 006 | `006-analysis` | 7 features: causal graph, drift analysis, epistemic measurement | Complete |
| 007 | `007-evaluation` | 2 features: ablation studies, reporting dashboard | Complete |
| 008 | `008-bug-fixes-and-data-integrity` | 11 features: causal-link fixes, regression quality, scripts | Complete |
| 009 | `009-evaluation-and-measurement` | 16 features: precision/F1, observer effect, telemetry | Complete |
| 010 | `010-graph-signal-activation` | 12 features: weight history, constitutional paths, temporal bounds | Complete |
| 011 | `011-scoring-and-calibration` | 18 features: access-tracker, RRF convergence, scoring closure | Complete |
| 012 | `012-query-intelligence` | 6 features: complexity routing, token budgets, propagation | Complete |
| 013 | `013-memory-quality-and-indexing` | 18 features: quality loop, dedup, chunk handling, reindex | Complete |
| 014 | `014-pipeline-architecture` | 22 features: 4-stage pipeline, atomic writes, retry, schema | Complete |
| 015 | `015-retrieval-enhancements` | 9 features: fallback ownership, provenance, token-budget | Complete |
| 016 | `016-tooling-and-scripts` | 13 features: tree thinning, validation, watcher, CLI safety | In Progress |
| 017 | `017-governance` | 4 features: flag governance, sunset audit | Complete |
| 018 | `018-ux-hooks` | 13 features: mutation response, hook contracts, checkpoint safety | Complete |
| 019 | `019-decisions-and-deferrals` | 5 features: deferred WARN closure, sentence extraction fix | Complete |
| 020 | `020-feature-flag-reference` | 7 features: flag mapping, doc/test guards | Complete |
| 021 | `021-remediation-revalidation` | Reconciliation record | In Progress (validation failures) |

### 008 Hydra Children (6 folders)

| # | Folder | Scope | Status |
|---|--------|-------|--------|
| 001 | `001-baseline-and-safety-rails` | Capability flags, checkpoint hardening, schema compat | Complete |
| 002 | `002-versioned-memory-state` | Lineage, active projection, temporal asOf semantics | Complete |
| 003 | `003-unified-graph-retrieval` | Deterministic ranking, graph explainability, telemetry | Complete |
| 004 | `004-adaptive-retrieval-loops` | Shadow-mode adaptive ranking, rollout gating, rollback | Complete |
| 005 | `005-hierarchical-scope-governance` | Scope enforcement, governed lifecycle, cascade fixes | Complete |
| 006 | `006-shared-memory-rollout` | Shared spaces, membership policy, conflict handling | Complete |

### 999 Finalization Children (7 folders)

| # | Folder | Status | Notes |
|---|--------|--------|-------|
| 012 | `012-agents-alignment` | Stub | Empty scaffold |
| 013 | `013-agents-md-alignment` | Stub | Empty scaffold |
| 014 | `014-manual-testing-per-playbook` | Stub | Empty scaffold |
| 015 | `015-rewrite-memory-mcp-readme` | Stub | Empty scaffold |
| 016 | `016-update-install-guide` | Stub | Empty scaffold |
| 017 | `017-rewrite-system-speckit-readme` | Stub | Empty scaffold |
| 018 | `018-rewrite-repo-readme` | Stub | Empty scaffold |

---

## 5. FEATURE CATALOG ALIGNMENT

The feature catalog (4,262 lines, 189 feature files) covers 19 categories organized by MCP layer:

| # | Category | Features | Scope |
|---|----------|----------|-------|
| 01 | Retrieval | 9 | Search, trigger matching, hybrid pipeline, BM25, section retrieval, fallback |
| 02 | Mutation | 10 | Save, update, delete, bulk delete, validation, transactions, undo, history |
| 03 | Discovery | 3 | memory_list, memory_stats, memory_health |
| 04 | Maintenance | 2 | Index scan, startup compatibility guards |
| 05 | Lifecycle | 7 | Checkpoint CRUD, async ingestion, pending-file recovery, archival |
| 06 | Analysis | 7 | Causal graph, drift tracing, epistemic measurement, learning history |
| 07 | Evaluation | 2 | Ablation studies, reporting dashboard |
| 08 | Bug Fixes & Data Integrity | 11 | Graph ID fix, chunk dedup, fan-effect, hash dedup, schema safety |
| 09 | Evaluation & Measurement | 16 | Precision/F1, observer effect, channel attribution, ground truth |
| 10 | Graph Signal Activation | 12 | Edge density, community clusters, temporal contiguity, depth scoring |
| 11 | Scoring & Calibration | 18 | Decay policies, score normalization, access scoring, interference |
| 12 | Query Intelligence | 6 | Complexity routing, token budgets, query expansion, truncation |
| 13 | Memory Quality & Indexing | 18 | Pre-flight validation, content cleanup, dedup, entity extraction |
| 14 | Pipeline Architecture | 22 | 4-stage pipeline, atomic writes, retry, schema validation, DB safety |
| 15 | Retrieval Enhancements | 9 | Summarization, contextual injection, dual-scope triggers |
| 16 | Tooling & Scripts | 13 | Tree thinning, progressive validation, filesystem watcher, admin |
| 17 | Governance | 4 | Feature flag governance, sunset audit, scope governance, shared rollout |
| 18 | UX Hooks | 13 | Mutation response, hook contracts, checkpoint safety, hint append |
| 19 | Feature Flag Reference | 7 | Pipeline flags, session/cache, MCP config, storage, embedding, debug |
| | **Total** | **189** | |

---

<!-- ANCHOR:requirements -->
## 6. EPIC-LEVEL REQUIREMENTS

### P0 - Blockers (program-level)

| ID | Requirement | Status |
|----|-------------|--------|
| EP-001 | Graph channel activated (hit rate >0%) | **Complete** (Sprint 0) |
| EP-002 | Evaluation infrastructure operational (R13 5-table schema) | **Complete** (Sprint 0) |
| EP-003 | BM25 baseline recorded and contingency evaluated | **Complete** (Sprint 0) |
| EP-004 | Content-hash deduplication in save pipeline | **Complete** (Sprint 0) |
| EP-005 | Architecture boundary contract defined and enforced | **Complete** (Phase 005) |

### P1 - Required

| ID | Requirement | Status |
|----|-------------|--------|
| EP-006 | Scoring calibrated (min-max normalization, [0,1] scale) | **Complete** (Sprint 2) |
| EP-007 | Query complexity routing operational | **Complete** (Sprint 3) |
| EP-008 | Feature catalog comprehensive (all features documented) | **Complete** (Phase 006) |
| EP-009 | Code audit complete for all 19 feature categories | **Complete** (Phase 007) |
| EP-010 | Hydra database architecture roadmap delivered | **Complete** (Phase 008) |
| EP-011 | UX hooks standardized across mutation handlers | **Complete** (Phase 004) |
| EP-012 | Per-folder description metadata system | **Complete** (Phase 009, merged) |
| EP-013 | Constitutional memory management rewritten | **Complete** (Phase 003) |

### P2 - Desired / Pending

| ID | Requirement | Status |
|----|-------------|--------|
| EP-014 | Skill alignment to RAG architecture | Stub (009) |
| EP-015 | Command alignment to RAG architecture | Stub (011) |
| EP-016 | Finalization: agent alignment, readme rewrites, manual testing | Pending (999) |
| EP-017 | Sprint 4+ RAG improvements (feedback, pipeline refactor, indexing) | Pending (001 S4-S7) |
| EP-018 | Session capture Phase 3-4 (Claude capture, score calibration) | Deferred (010, unchanged) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

| ID | Criterion | Status |
|----|-----------|--------|
| SC-001 | MRR@5 improves +10-15% over Sprint 0 baseline by Sprint 6 | Pending (S4+ not started) |
| SC-002 | Graph channel hit rate >20% (from 0%) | Complete (Sprint 0 activated) |
| SC-003 | Channel diversity in top-5 >3.0 (from ~2.0) | In Progress |
| SC-004 | Search latency p95 <300ms complex, <500ms hard limit | Maintained |
| SC-005 | Active feature flags <=6 at gate, <=8 ceiling | Maintained |
| SC-006 | Evaluation ground truth >500 query-relevance pairs | In Progress |
| SC-007 | Graph edge density >1.0 edges/node | In Progress |
| SC-008 | All 19 feature categories audited with evidence | **Complete** |
| SC-009 | Hydra database architecture phases delivered | **Complete** |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 8. RISKS & DEPENDENCIES

### Epic-Level Risks

| Risk ID | Risk | Impact | Status |
|---------|------|--------|--------|
| MR1 | FTS5 trigger contamination from R11 | CRITICAL | Mitigated (separate learned_triggers column) |
| MR2 | Preferential attachment loop (R4+N3) | HIGH | Mitigated (degree caps, strength caps) |
| MR3 | Feature flag explosion (24 flags = 16.7M states) | HIGH | Mitigated (<=8 ceiling, sunset audit) |
| MR8 | R4+N3+R10 three-way interaction | HIGH | Mitigated (entity quality gate, caps) |
| MR13 | Concurrent write corruption | HIGH | Mitigated (per-spec-folder mutex, WAL mode) |
| ER-001 | Sprint 4+ not yet approved (scope cap at S2+3) | MEDIUM | Open |
| ER-002 | 009/011 stubs never populated | LOW | Open |
| ER-003 | 999-finalization numbering resolved (015 and 016 distinct) | LOW | Resolved |
| ER-004 | 999-finalization description.json references wrong path (015 vs 999) | LOW | Open |

### Cross-Phase Dependencies

All dependencies are internal. The sprint-gate model ensures sequential progression within the core RAG pipeline (005), while other phases (002-004, 006-014) operated independently or in parallel.
<!-- /ANCHOR:risks -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | 51 folders, 189 features, 16 phases, ~7,500 tests |
| Risk | 20/25 | 14 risks (MR1-MR14), FTS5 contamination CRITICAL |
| Research | 18/20 | 43 recommendations + 8 PageIndex + 6 sprint-derived |
| Multi-Agent | 15/15 | 25+ agent verification campaigns, 5-wave parallel execution |
| Coordination | 17/15 | 16 phases with sprint gates, parent-child hierarchies |
| **Total** | **95/100** | **Level 3+** |

---

## 10. OPEN QUESTIONS

1. **Sprint 4+ approval**: Sprints 0-3 constituted the approved scope. Sprints 4-7 require NEW approval based on S0-S3 metrics (evidence of measured deficiencies, updated effort estimates, updated ROI).
2. **009/011 stubs**: Will skill and command alignment proceed, or should these be removed?
3. **999-finalization numbering collision**: Resolved — folders are now numbered 015 and 016 distinctly.
4. **999 description.json path error**: References `015-finalization` instead of `999-finalization`.
5. **007/021 validation failure**: Recursive spec validation reported 2 errors, 1 warning.
6. **007/016 still in Draft**: Tooling-and-scripts audit has spec metadata showing Draft status.

---

## RELATED DOCUMENTS

- **Child Spec (001)**: `001-hybrid-rag-fusion-epic/spec.md` (detailed requirements, signal ordering, NFRs)
- **Core RAG Sprints**: `001-hybrid-rag-fusion-epic/spec.md` (8 sprints merged inline, ~4,400 lines)
- **Feature Catalog**: `feature_catalog/feature_catalog.md` (4,262 lines, 19 categories)
- **Code Audit Synthesis**: `007-code-audit-per-feature-catalog/synthesis.md`
- **Hydra Roadmap**: `008-hydra-db-based-features/spec.md`
- **Manual Testing Playbook**: `manual_testing_playbook/`

---

<!--
ROOT EPIC SPEC (~300 lines)
- Synthesizes 16 main phases + 34 children
- Provides status dashboard, feature catalog alignment, and epic-level requirements
- References detailed child specs for drill-down
-->
