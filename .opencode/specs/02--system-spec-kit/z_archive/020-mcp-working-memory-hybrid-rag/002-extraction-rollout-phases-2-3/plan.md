---
title: "Phase Package Plan: Extraction and Rollout (Phase 2, Phase 3) [002-extraction-rollout-phases-2-3/plan]"
description: "Implement extraction and causal ranking features, then execute controlled rollout with telemetry and rollback safety."
trigger_phrases:
  - "phase"
  - "package"
  - "plan"
  - "extraction"
  - "and"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Phase Package Plan: Extraction and Rollout (Phase 2, Phase 3)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-plan | v1.1 -->

---

<!-- ANCHOR:objective -->
## 1. Objective

Implement extraction and causal ranking features, then execute controlled rollout with telemetry and rollback safety.
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready
- Package 001 hardening gate (`T027o`) has passed.
- Redaction calibration artifacts are available and approved.
- Root task and verification mappings are synchronized.

### Definition of Done
- Phase 2 and Phase 3 mapped tasks complete (`T029-T070`).
- Extraction precision/recall and MRR thresholds are met.
- Staged rollout evidence and rollback runbook are complete.
- Post-research handoff mapping is published to packages `../004-post-research-wave-1-governance-foundations/`, `../005-post-research-wave-2-controlled-delivery/`, and `../006-post-research-wave-3-outcome-confirmation/`.
- Historical handoff contract includes explicit wave ownership for technical capabilities 1-8 (adaptive fusion, typed trace, artifact routing, ledger, sync/async split, degraded-mode contracts, deterministic tools, capability truth matrix).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:execution-model -->
## 3. Execution Model

| Workstream | Root Tasks | Duration | Output |
|------------|------------|----------|--------|
| Extraction adapter | `T029-T037` | 1 week | Tool-class extraction with summarizers and hook integration |
| Redaction gate | `T035a-T035e` | 2-3 days | Calibrated PII/secret redaction with exclusion heuristics |
| Causal boost | `T038-T044` | 3-4 days | 2-hop bounded causal boost integrated into search |
| Prompt injection and integration | `T045-T055` | 4-5 days | End-to-end extraction-to-search pipeline validated |
| Telemetry and rollout | `T056-T070` | 1 week | Dark launch, staged enablement, runbook, docs |
<!-- /ANCHOR:execution-model -->

---

<!-- ANCHOR:milestones -->
## 4. Milestones

| Milestone | Exit Criteria |
|-----------|---------------|
| EXR-M2 | `T055` complete and Phase 2 sign-off done |
| EXR-M3 | `T070` complete and staged rollout evidence captured |
| EXR-MH | Wave handoff mapping for `C136-01..C136-12` published in root and package docs with explicit capability ownership matrix |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:risk-register -->
## 5. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Extraction noise overfills working memory | Degraded retrieval quality | Precision/recall gates and bounded attention scores |
| Redaction strips useful git context | Missing operational signals | Enforce SHA/UUID exclusions from hardening calibration |
| Causal traversal cost grows unexpectedly | Search latency regression | Bound traversal to 2 hops and enforce p95 checks |
| Rollout regressions | User-facing instability | Feature flags, dark launch, staged percentages, rollback runbook |
| Ambiguous post-research ownership handoff | Rework and conflicting implementation scope in wave packages | Freeze `C136` ownership and capability matrix in this package and root docs |
<!-- /ANCHOR:risk-register -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

- Requires package `../001-foundation-phases-0-1-1-5/` hard-gate success.
- Ownership lock: `REQ-014` and `REQ-017` are accepted in package 001; this package consumes hook and calibration outputs without duplicating ownership.
- Requires root phase alignment in `../plan.md` and `../tasks.md`.
- Consumes quality-gate outputs from package `../003-memory-quality-qp-0-4/` when available.
- Hands off post-research follow-up ownership to package `../004-post-research-wave-1-governance-foundations/` (Wave 1), package `../005-post-research-wave-2-controlled-delivery/` (Wave 2), and package `../006-post-research-wave-3-outcome-confirmation/` (Wave 3).

### Technical Handoff Contract (Execution Baton)

| Wave | Backlog IDs | Contracted Technical Ownership |
|------|-------------|---------------------------------|
| Wave 1 (`004`) | `C136-08`, `C136-09`, `C136-10`, `C136-12`, `C136-01`, `C136-02`, `C136-03` | Foundations for adaptive hybrid fusion, typed retrieval trace envelope, artifact-aware routing policy, degraded-mode contracts, telemetry readiness, and governance approvals |
| Wave 2 (`005`) | `C136-04`, `C136-05`, `C136-11` | Controlled delivery with append-only mutation ledger and operationalization of sync/async split plus deterministic exact-operation tooling |
| Wave 3 (`006`) | `C136-06`, `C136-07` | Longitudinal capability truth matrix confirmation and final outcome/KPI closure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:governance -->
## 7. Governance Notes

- Level 3+ package planning is maintained here.
- `decision-record.md` remains root-only at `../decision-record.md`.
- `implementation-summary.md` present as compliance normalization record; substantive summary at `../implementation-summary.md`.
<!-- /ANCHOR:governance -->

---

<!-- ANCHOR:status -->
## 8. Planning Status

Execution-complete for Phase 2/3 scope. This package remains maintained as the closed implementation record and explicit transition/handoff source for post-research waves.
<!-- /ANCHOR:status -->

---

<!-- ANCHOR:technical-context -->
## Technical Context

| Context Item | Current State | Package Implication |
|--------------|---------------|---------------------|
| Upstream hard gate | Package `../001-foundation-phases-0-1-1-5/` owns prerequisite acceptance | Package 002 consumes outputs and cannot redefine prerequisite acceptance |
| Historical execution record | `T029-T070` is complete in this package | Package remains historical evidence while follow-up delivery moves to waves |
| Transition ownership | Wave 1/2/3 packages own active follow-up backlog | Handoff matrix must remain explicit and stable |
| Root synchronization | Root scope and checklist are canonical | Package references must remain aligned with root artifacts |
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## Architecture

The package architecture is a closed-execution ledger with explicit transition contracts: extraction and rollout evidence remains frozen in this package, while active technical ownership transitions to Wave 1/2/3 packages through the documented contract matrix.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:implementation -->
## Implementation

Implementation sequencing is preserved as historical record and represented through explicit phase headings so downstream teams can consume the package without reinterpreting closed scope.
<!-- /ANCHOR:implementation -->

---

## Phase 2 - Extraction and Integration Delivery

Closed scope for `T029-T055`, including extraction adapter, redaction gate, causal boost, and integration validation as package-owned historical evidence.

## Phase 3 - Rollout and Operations Delivery

Closed scope for `T056-T070`, including telemetry, staged rollout, and rollback controls retained as operational baseline for follow-up wave work.

---

<!-- ANCHOR:ai-execution-protocol -->
## AI Execution Protocol

### Pre-Task Checklist

- Confirm package 001 dependency gate remains unchanged before referencing Phase 2 readiness.
- Confirm closed-scope boundaries for `T029-T070` remain immutable.
- Confirm wave ownership mapping (`004`, `005`, `006`) matches root documents.
- Confirm acceptance thresholds in this package remain synchronized with root references.

### Execution Rules

| Rule | Description | Trigger | Action |
|------|-------------|---------|--------|
| EXR-ER-001 | Preserve historical closure | Any package update | Do not reopen or re-own completed `T029-T070` execution scope |
| EXR-ER-002 | Preserve handoff clarity | Any transition-note edit | Keep wave ownership matrix explicit for `004`, `005`, `006` |
| EXR-ER-003 | Preserve dependency locks | Any requirement mapping edit | Keep `REQ-014` and `REQ-017` dependency-consumed from package 001 |

### Status Reporting Format

Use: `Status: <Historical|Transition-Active|Blocked> | Scope: <task/check IDs> | Evidence: <file paths> | Owner: <historical or wave package> | Next: <handoff action>`.

### Blocked Task Protocol

If transition work is blocked, record `BLOCKED` status with dependency source (001, 004, 005, or 006), impacted contract items, and unblock condition; do not alter closed historical evidence to bypass blockers.
<!-- /ANCHOR:ai-execution-protocol -->
