---
title: "Feature Specification: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Parent overview for the phased implementation bundle that coordinates runtime truth, semantic coverage, wave execution, and offline optimization across child phases 001-004."
trigger_phrases:
  - "042"
  - "deep research"
  - "deep review"
  - "runtime improvement"
  - "phase overview"
  - "parent packet"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This parent packet now serves as the coordination overview for four child implementation phases. The bundle keeps the same core goal as the original packet: make `sk-deep-research` and `sk-deep-review` easier to trust, resume, scale, and improve without collapsing them into a hidden generic workflow. What changed is the delivery model. The detailed design and task breakdown now live in dedicated child folders, while this root spec tracks the cross-phase shape, sequencing, and handoff logic.

**Key decisions**: keep runtime truth first, reuse existing graph infrastructure instead of building a separate platform, keep wave execution at the orchestrator layer instead of inside LEAF agents, and split the optimizer into active Phase 4a work plus deferred Phase 4b work.

**Critical dependencies**: consolidated research findings `CF-004`, `CF-010`, `CF-014`, `CF-021`, `CF-027`, and `CF-030`; existing deep-loop reducer/parity surfaces; packet-local append-only state; the child phase plans under this packet.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Dependencies** | Consolidated research packet; child phase folders `001`-`004`; existing deep-loop assets, YAML workflows, reducers, and tests |
| **Predecessor** | Related background packets: `028-auto-deep-research-review-improvement`, `040-sk-auto-deep-research-review-improvement` |
| **Successor** | All child phases `001` -> `004` implemented; Phase 4b deferred |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop stack still needs stronger runtime truth, better semantic coverage signals, bounded large-target orchestration, and safer offline tuning. The original parent packet described all of that in one place, but it is now stale because the work has been decomposed into four execution-ready child phases with their own specs, plans, and tasks.

### Purpose

Define the parent coordination layer for Packet 042: summarize the four-phase scope, show where detail now lives, and keep cross-phase requirements, milestones, risks, and open questions visible without duplicating the child packet contents.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Coordinate the four child phases that together deliver the runtime-improvement bundle.
- Keep the parent packet focused on cross-phase scope, dependencies, milestones, and handoff criteria.
- Provide a requirement-to-phase map so operators know where detailed implementation work lives.
- Keep parent-level references to verification, ADRs, and task counts synchronized with the child folders.

### Out of Scope

- Repeating detailed per-file implementation plans already documented in the child folders.
- Repeating child-level edge cases, acceptance scenarios, or task prose in the parent docs.
- Introducing new implementation scope beyond the four existing child phases.

### Files to Change Summary

| Phase | Focus | Primary File Families |
|-------|-------|-----------------------|
| **Phase 1** | Runtime truth foundation | Deep-loop skills, references, commands, workflow YAML, agents, reducer/parity/behavior tests |
| **Phase 2** | Semantic coverage graph | Shared graph libraries, Spec Kit Memory MCP server, reducer integration, graph tests, agent/reference updates |
| **Phase 3** | Wave executor | Orchestration helpers, wave-aware contracts, workflow updates, merge/resume tests |
| **Phase 4** | Offline optimizer | Optimizer scripts, replay fixtures, config boundaries, promotion gate, offline maintenance docs |

### Phase Documentation Map

| Phase | Folder | Focus | Status | Primary Dependency |
|-------|--------|-------|--------|--------------------|
| **1** | [./001-runtime-truth-foundation/](./001-runtime-truth-foundation/) | Stop reasons, legal stop, blocked-stop persistence, resume lineage, journals, observability, parity/test groundwork | Implemented | None |
| **2** | [./002-semantic-coverage-graph/](./002-semantic-coverage-graph/) | Coverage graph reuse, dedicated SQLite store, MCP tools, reducer/MCP seam, graph-aware convergence | Implemented | Phase 1 |
| **3** | [./003-wave-executor/](./003-wave-executor/) | Fan-out/join proof, deterministic segmentation, activation gates, reducer-owned board, keyed merge | Implemented | Phases 1-2 |
| **4** | [./004-offline-loop-optimizer/](./004-offline-loop-optimizer/) | `4a` deterministic config optimizer now; `4b` prompt/meta optimizer deferred | Implemented (4a); Deferred (4b) | Phases 1-3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Parent Requirement | Phase Mapping |
|----|--------------------|---------------|
| REQ-001 | Phase 1 remains the source of truth for runtime stop legality, blocked-stop persistence, continuation lineage, and reducer ownership. | [./001-runtime-truth-foundation/spec.md](./001-runtime-truth-foundation/spec.md) |
| REQ-002 | Phase 2 remains the source of truth for semantic coverage graph reuse, storage, tooling, and reducer/MCP graph integration. | [./002-semantic-coverage-graph/spec.md](./002-semantic-coverage-graph/spec.md) |
| REQ-003 | Phase 3 remains the source of truth for wave-mode fan-out/join, deterministic segmentation, activation gates, and keyed merge behavior. | [./003-wave-executor/spec.md](./003-wave-executor/spec.md) |
| REQ-004 | Phase 4a remains the source of truth for active deterministic replay/config optimization work. | [./004-offline-loop-optimizer/spec.md](./004-offline-loop-optimizer/spec.md) |
| REQ-005 | Phase 4b must remain explicitly deferred until replay fixtures, behavioral suites, and corpus prerequisites exist. | [./004-offline-loop-optimizer/spec.md](./004-offline-loop-optimizer/spec.md) |
| REQ-006 | The parent packet must map every major requirement cluster to the correct child phase instead of duplicating child detail. | This file plus child packet links |
| REQ-007 | Parent milestones and handoff criteria must reflect the child phase dependency order `001 -> 002 -> 003 -> 004`. | [./plan.md](./plan.md) |
| REQ-008 | Parent verification and ADR indexes must point to the child sources of truth that actually own those details. | [./checklist.md](./checklist.md), [./decision-record.md](./decision-record.md) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 1 is complete and validated, making runtime truth, stop legality, continuation lineage, and reducer ownership explicit.
- **SC-002**: Phase 2 is complete and validated, making semantic coverage graph signals available through shared libraries plus MCP tooling.
- **SC-003**: Phase 3 is complete and validated, proving bounded large-target orchestration without moving sub-agent management into LEAF workers.
- **SC-004**: Phase 4a is complete and validated, producing deterministic replay-based advisory tuning without unsafe live mutation.
- **SC-005**: Phase 4b remains explicitly deferred until its stated prerequisites exist; no parent document implies it is active work today.
- **SC-006**: The parent packet remains concise and points readers to child-phase detail instead of duplicating it.
- **SC-007**: Root-level overview docs and child-phase docs stay linkable and validation-clean.

### Acceptance Scenarios

1. **Given** a reader starts at the parent spec, **when** they need runtime-truth detail, **then** Phase 1 is clearly identified as the source of truth.
2. **Given** a reader needs graph-convergence detail, **when** they use the parent spec, **then** Phase 2 is clearly identified as the source of truth.
3. **Given** a reader needs large-target orchestration detail, **when** they use the parent spec, **then** Phase 3 is clearly identified as the source of truth.
4. **Given** a reader needs optimizer detail, **when** they use the parent spec, **then** Phase 4a is clearly identified as active and Phase 4b as deferred.
5. **Given** a maintainer checks progress, **when** they inspect the parent docs, **then** milestones align with the child phase order and handoffs.
6. **Given** a maintainer needs verification or ADR detail, **when** they inspect the parent docs, **then** the child checklist/ADR sources are linked rather than re-stated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 is the contract foundation for every later phase | High | Treat Phase 1 completion as the first milestone and handoff gate. |
| Dependency | Phase 2 graph tooling must exist before graph-enhanced segmentation is trustworthy | High | Keep Phase 3 graph-aware work blocked until Phase 2 is operational. |
| Dependency | Fan-out/join capability is not yet proven on the current YAML engine | High | Keep Phase 3 wave execution gated behind an explicit prerequisite proof. |
| Dependency | Replay fixtures and behavioral suites are prerequisites for non-advisory optimization | High | Keep Phase 4a advisory-only and Phase 4b deferred until those prerequisites exist. |
| Risk | Parent docs drift back into duplicated child detail | Medium | Keep the root packet as an index/overview and push implementation detail into child folders only. |
| Risk | Optional modes are mistaken for baseline requirements | Medium | Keep council mode, coordination-board work, and Phase 4b explicitly marked opt-in or deferred. |
| Risk | Cross-surface parity drifts across commands, skills, agents, reducers, and mirrors | Medium | Use child-phase parity/test gates and keep the parent focused on sequencing and dependency visibility. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Parent docs should stay concise enough to scan faster than the child packets.
- Parent milestone and requirement mapping should not require child-packet duplication to stay understandable.

### Reliability

- Parent links must continue to point to the correct child sources of truth.
- Deferred work must remain clearly marked so later readers do not treat it as active delivery.

### Maintainability

- The root packet should summarize and route, not compete with child docs.
- Cross-phase sequencing should be changeable in one place at the root without rewriting child packets.

---

## 8. EDGE CASES

- Phase 3 planning advances before fan-out/join is proven: keep wave execution blocked until the proof path exists.
- Phase 4b is mistaken for active scope: keep it labeled deferred in every parent overview surface.
- A child phase changes counts or status: update the parent index instead of re-copying child prose.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Four coordinated child phases across runtime contracts, graph infrastructure, orchestration, and offline optimization |
| Risk | 22/25 | Stop legality, graph truth, merge correctness, replay fidelity, and deferred optimizer guardrails |
| Research | 17/20 | Strong evidence base exists, but several cross-phase handoff choices still matter |
| Multi-Agent | 0/15 | Planning only; execution strategy is phase-based rather than multi-agent at the parent level |
| Coordination | 16/15 | Parent packet coordination, child handoffs, deferred-track governance, and cross-surface parity pressure |
| **Total** | **79/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 1 completion slips and blocks every later phase | High | Medium | Keep Phase 1 as the first milestone and handoff gate |
| R-002 | Parent docs drift from child packet status/counts | Medium | Medium | Treat child files as the source of truth and refresh the parent index from them |
| R-003 | Wave execution is treated as buildable before fan-out/join proof exists | High | Medium | Keep the Phase 3 prerequisite explicit in every parent surface |
| R-004 | Phase 4b is mistaken for active scope | Medium | Medium | Mark `4b` as deferred in spec, plan, tasks, and checklist indexes |

---

## 11. USER STORIES

### US-001: Find The Right Phase

**As a** maintainer, **I want** the parent spec to route me to the correct child phase quickly, **so that** I do not have to read stale duplicate detail.

### US-002: Understand Delivery Order

**As a** coordinator, **I want** the parent spec to summarize the phase sequence and handoffs, **so that** I can track progress across the bundle.

### US-003: Distinguish Active vs Deferred Work

**As a** reviewer, **I want** the parent spec to keep Phase 4a and 4b clearly separated, **so that** deferred optimizer work is not treated as current scope.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Q1: Should Phase 3 fan-out/join ship as helper-module orchestration, a YAML engine extension, or a hybrid proof path?
- Q2: What final authority order should Phase 2 use between JSONL truth, local JSON fallback, and SQLite projection state?
- Q3: Which compaction trigger should Phase 1 ultimately prefer for long packets: run count, JSONL size, wall-clock age, or a blended threshold?
- Q4: What concrete prerequisite bar should unlock Phase 4b beyond today's deferment: replay fidelity threshold, corpus-family count, and behavioral-suite coverage?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Plan**: See [./plan.md](./plan.md)
- **Parent Task Index**: See [./tasks.md](./tasks.md)
- **Parent Verification Index**: See [./checklist.md](./checklist.md)
- **Parent ADR Index**: See [./decision-record.md](./decision-record.md)
- **Phase 1**: See [./001-runtime-truth-foundation/spec.md](./001-runtime-truth-foundation/spec.md)
- **Phase 2**: See [./002-semantic-coverage-graph/spec.md](./002-semantic-coverage-graph/spec.md)
- **Phase 3**: See [./003-wave-executor/spec.md](./003-wave-executor/spec.md)
- **Phase 4**: See [./004-offline-loop-optimizer/spec.md](./004-offline-loop-optimizer/spec.md)
