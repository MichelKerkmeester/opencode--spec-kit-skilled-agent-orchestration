---
title: "Feature Specification: Phase 5 — Operations & Tail PRs"
description: "Phase 5 packages the operational tail work after the core nine-PR train: telemetry folded into PR-9, optional historical safe-subset migration, optional D9 save-lock hardening, release communication, and phase-local closeout while parent closeout is tracked separately."
trigger_phrases:
  - "phase 5 operations tail prs"
  - "pr-10 safe subset migration"
  - "pr-11 cross process save lock"
  - "memory save telemetry"
  - "capture mode parity release notes"
  - "operations closeout phase"
importance_tier: important
contextType: "planning"
---
# Feature Specification: Phase 5 — Operations & Tail PRs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child | v2.2 -->

Phase 5 is the packet closeout phase for `003-memory-quality-issues/`. It does not reopen the core nine-PR train. Instead, it packages the operational work that Gen-3 added after the main remediation plan was already frozen: telemetry folded into PR-9, optional safe-subset migration for 82 historical JSON-mode files, optional D9 save-lock hardening, release-note parity framing, and final parent closure. [SOURCE: ../research/research.md:1418-1447] [SOURCE: ../research/research.md:1520-1537]

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P4 |
| **Status** | Phase-local complete, parent gates pending |
| **Created** | 2026-04-07 |
| **Branch** | `system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Parent Tasks** | `../tasks.md` |
| **Parent Checklist** | `../checklist.md` |
| **Phase** | 5 of 5 |
| **Predecessor** | `004-heuristics-refactor-guardrails` |
| **Successor** | `006-memory-duplication-reduction` (handoff currently waived at parent level) |
| **Handoff Criteria** | Phase-local done requires telemetry/release artifacts, PR-10 dry-run evidence, explicit PR-11 status, and phase validator success. Parent closeout remains separate and only completes after the parent packet clears its own strict-validation and `/spec_kit:complete` gates. [SOURCE: ../research/research.md:1445-1447] |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 5 of 5** in the memory-quality packet. It is intentionally the only phase that may end with implementation decisions deferred, because Gen-3 explicitly categorized PR-10 and PR-11 as optional tail work rather than mandatory core-train items. [SOURCE: ../research/research.md:1420-1443]

**Scope Boundary**: Phase 5 owns operationalization and packet finish, not another root-cause investigation. It consumes the already-approved PR-1 through PR-9 sequence and adds monitoring, safe historical cleanup only where recoverable, optional concurrency hardening, release framing, and parent closure. [SOURCE: ../research/research.md:1438-1447] [SOURCE: ../research/iterations/iteration-024.md:150-156]

**Dependencies**:
- Phases 1-4 must be merged first because PR-10 is explicitly post-PR-9 and telemetry folds into PR-9 rather than shipping as a separate PR. [SOURCE: ../research/research.md:1422-1425]
- Historical migration dry-run must precede apply, and apply must remain operator-gated because D1/D2/D5/D7 are unrecoverable or ambiguity-sensitive. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- PR-11 is standalone and low priority; it should only be promoted if concurrent `--json` saves are a real workflow. [SOURCE: ../research/iterations/iteration-021.md:51-55] [SOURCE: ../research/research.md:1422-1423]

**Deliverables**:
- Telemetry metric catalog and alert-rule draft tied to PR-9 ownership.
- PR-10 dry-run report plus explicit operator approval gate before any apply step.
- Optional PR-11 implementation or a documented defer decision.
- Release-notes draft that calls out capture-mode parity benefits without amending spec scope.
- Parent packet phase-map update to reflect Phase 5 phase-local completion, plus an explicit record of any remaining parent closeout blockers. [SOURCE: ../research/research.md:1238-1250] [SOURCE: ../research/research.md:1527-1532]

<!-- /ANCHOR:phase-context -->
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Executive Summary

The core remediation train solves future content-quality defects, but it does not finish the packet operationally. Gen-3 found four remaining closeout problems: a historical migration gap, a latent D9 concurrency risk, missing production-facing telemetry, and inaccurate release framing if the packet says nothing about shared capture-mode benefits. [SOURCE: ../research/research.md:1209-1250] [SOURCE: ../research/research.md:1436-1443]

### Problem Statement

| Sub-problem | Why it exists now | Why Phase 5 owns it |
|-------------|-------------------|---------------------|
| Historical migration gap | PR-1 through PR-9 prevent future corruption but do not repair 82 already-broken JSON-mode files. [SOURCE: ../research/iterations/iteration-023.md:3-6] | The dry-run/apply decision is post-remediation operational work, not part of the core defect fixes. [SOURCE: ../research/research.md:1422-1425] |
| Cross-process save-lock gap | D9 is a newly surfaced latent concurrency defect candidate that matters mainly in multi-process workflows. [SOURCE: ../research/iterations/iteration-021.md:49-55] | Gen-3 explicitly framed PR-11 as a standalone optional tail PR. [SOURCE: ../research/research.md:1422-1423] |
| Missing production visibility | PR-9's reviewer catches defects after write, but without low-cardinality metrics and alerts operators still learn too late. [SOURCE: ../research/iterations/iteration-024.md:3-6] [SOURCE: ../research/iterations/iteration-024.md:150-156] | The telemetry layer is folded into PR-9 and is the operational guardrail add-on for post-fix monitoring. [SOURCE: ../research/research.md:1425-1441] |
| Release communication gap | Capture mode benefits from several shared fixes even though the spec boundary itself does not change. [SOURCE: ../research/iterations/iteration-025.md:34-49] | Phase 5 is the packet-close moment where release framing and parent closure happen together. [SOURCE: ../research/research.md:1527-1532] |

### Problem Detail: Migration

The repo already contains a material legacy population: 82 JSON-mode candidate files across 49 spec folders. D8 appears in all 82, D4 in 81, and D3 in 52, which means "leave history alone" is no longer a tiny cleanup choice. It is a corpus-quality choice with direct implications for retrieval quality, metadata trust, and user confidence in historical memory artifacts. [SOURCE: ../research/iterations/iteration-023.md:15-34] [SOURCE: ../research/iterations/iteration-023.md:88-95]

Gen-3 rejected blanket auto-heal or regeneration. It chose Option C only in the narrowed form: batch-classify D3/D4/D6/D8 in dry-run evidence, skip D1/D2/D5/D7 unless the file is safely recoverable, and defer any future historical apply step to a later operator-approved follow-on. That keeps migration operationally safe without overstating what shipped in this phase. [SOURCE: ../research/iterations/iteration-023.md:64-83] [SOURCE: ../research/research.md:1534-1537]

### Problem Detail: Save Lock

Iteration 21 found exactly one credible D9 candidate outside the original D1-D8 set: the workflow may continue without strong cross-process serialization after stale-lock read failure, lock timeout, or unexpected lock-directory errors. This does not invalidate the core train, but it leaves a non-deterministic concurrent-save behavior that should be either hardened or consciously deferred with rationale. [SOURCE: ../research/iterations/iteration-021.md:49-57] [SOURCE: ../research/research.md:1252-1284]

This is not a content-shaping defect in normal single-user runs. It is an operational risk surface for CI, automation, or parallel save workflows. That distinction is why Phase 5 treats PR-11 as optional and low priority instead of silently promoting it into the mainline train. [SOURCE: ../research/iterations/iteration-021.md:59-75] [SOURCE: ../research/research.md:1524-1525]

### Problem Detail: Telemetry

The post-save reviewer already has the right semantic location for operational signals. It runs after write at Step 10.5, returns structured issues, prints a human-readable report, and adjusts score hints. What it does not do yet is expose a compact, alert-friendly signal set that on-call operators can watch. [SOURCE: ../research/iterations/iteration-024.md:3-6] [SOURCE: ../research/iterations/iteration-024.md:15-22] [SOURCE: ../research/iterations/iteration-024.md:150-156]

Gen-3 therefore specified nine low-cardinality metrics for PR-9's delivery surface in this packet context: overview length, decision fallback usage, trigger-phrase rejection, tier drift, continuation-signal hits, missing git provenance, template-anchor violations, review violations, and save duration. It also froze the operational thresholds the packet should ship with: M4 pages if non-zero, M6 warns above five per hour, and M9 p95 warns above 500 ms. [SOURCE: ../research/iterations/iteration-024.md:23-93] [SOURCE: ../research/iterations/iteration-024.md:135-147] [SOURCE: ../research/research.md:1223-1236]

### Problem Detail: Release Communications

The packet's public story changed in Generation 3. The spec boundary still stands, but the capture-mode parity audit showed that D2, D3, D5, and D8 land in shared downstream code and therefore improve capture-mode outputs too. Leaving that out of release notes would understate value and confuse users who rely on capture mode but did not ask for JSON-specific remediation. [SOURCE: ../research/iterations/iteration-025.md:21-49]

At the same time, the release framing must stay precise. D1 and D7 are JSON-specific; D4 should not be described as a live capture-path defect even though broader tooling can still benefit later. Phase 5 therefore owns an explicit parity note that improves truthfulness without reopening spec scope. [SOURCE: ../research/iterations/iteration-025.md:34-49] [SOURCE: ../research/research.md:1530-1532]

### Purpose

Phase 5 exists to turn the parent packet from "core fixes researched and phased" into "operationally finished, observable, accurately communicated, and explicitly closed," while keeping optional tail work explicit instead of silently assumed. [SOURCE: ../research/research.md:1438-1447]

### User Stories

**Story 1 - Operator**: As a packet operator, I want a dry-run-first migration workflow that only rewrites safe historical defects so that I can improve corpus quality without fabricating lost content or lineage. [SOURCE: ../research/iterations/iteration-023.md:64-83]

**Story 2 - On-call**: As an on-call responder, I want save-quality telemetry and alert rules tied to the post-save reviewer so that I can detect regressions before users discover broken memories manually. [SOURCE: ../research/iterations/iteration-024.md:3-13]

**Story 3 - Capture-mode User**: As a capture-mode user, I want the release notes to explain which fixes improve my saves too, so that I understand the shared value of the packet without assuming the team changed capture-mode scope directly. [SOURCE: ../research/iterations/iteration-025.md:45-49]

**Story 4 - Release Manager**: As a release manager, I want a final phase that cleanly decides whether tail PRs ship or defer, updates the parent packet status, and records whether parent `/spec_kit:complete` is still blocked, so that the packet ends with explicit operational truth instead of an implicit TODO. [SOURCE: ../research/research.md:1445-1447]
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in the packet decision record and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fold the nine low-cardinality metrics and associated reviewer/log hooks into the PR-9 post-save reviewer delivery surface. This is required Phase 5 work, not a separate PR. [SOURCE: ../research/research.md:1425-1441] [SOURCE: ../research/iterations/iteration-024.md:144-148]
- Draft, review, and commit alert rules for the agreed Phase 5 thresholds: M4 page immediately, M6 warn above five per hour, and M9 p95 warn above 500 ms. [SOURCE: ../research/iterations/iteration-024.md:135-143] [SOURCE: ../research/research.md:1530-1530]
- Build and run a PR-10 dry-run migration that only targets the safe subset (D3/D4/D6/D8), emits a report, and records any future historical apply as deferred for a follow-on. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- Keep PR-10 dry-run only in this phase; apply mode is deferred and not part of the shipped CLI surface. See `pr11-defer-rationale.md` for the matching optional-tail defer framing.
- Add a D9 latent-bug reproduction test and either implement PR-11 save-lock hardening or document an explicit defer decision with rationale. [SOURCE: ../research/iterations/iteration-021.md:49-55] [SOURCE: ../research/research.md:1422-1423]
- Draft release notes that explain capture-mode parity benefits and explicitly keep the spec-scope line unchanged. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1531-1532]
- Update the parent phase map and close the parent packet through `/spec_kit:complete`. [SOURCE: ../research/research.md:1445-1447]

### Optionality Rules

| Work item | Optional? | Phase rule |
|-----------|-----------|------------|
| Telemetry M1-M9 | No | Must ship as part of the PR-9 guardrail delivery described by Gen-3. [SOURCE: ../research/research.md:1425-1441] |
| Alert rules | No | Required companion artifact for the telemetry package. [SOURCE: ../research/research.md:1529-1530] |
| Release-notes draft | No | Required to communicate capture-mode parity accurately. [SOURCE: ../research/research.md:1531-1532] |
| PR-10 dry-run | No | The dry-run report is a mandatory Phase 5 deliverable even if apply is later deferred. [SOURCE: ../research/iterations/iteration-023.md:71-80] |
| PR-10 apply | Yes | Requires operator approval after dry-run review. [SOURCE: ../research/iterations/iteration-023.md:71-83] |
| PR-11 save lock | Yes | Can ship or defer without blocking closeout. [SOURCE: ../research/research.md:1422-1423] [SOURCE: ../research/research.md:1524-1525] |

### Out of Scope

- Reordering or widening the core nine-PR train; Gen-3 explicitly preserved that train as-is. [SOURCE: ../research/research.md:1438-1441]
- Auto-migrating D1, D2, D5, or D7 from historical file content alone. Those remain unrecoverable or too ambiguity-sensitive. [SOURCE: ../research/research.md:1534-1537] [SOURCE: ../research/iterations/iteration-023.md:67-76]
- Launching a full tracing platform, span system, or broad observability initiative beyond the guardrail-sized save-quality metrics. [SOURCE: ../research/iterations/iteration-024.md:158-160]
- Amending the parent spec scope line merely because some fixes help capture mode as a side effect. [SOURCE: ../research/research.md:1441-1443] [SOURCE: ../research/research.md:1531-1532]
- Reopening D6 as a production patch. D6 remains test-only unless a live owner is re-established. [SOURCE: ../research/research.md:1536-1536]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Emit PR-9 telemetry metrics and review-derived counts from the existing reviewer contract. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/research.md:1425-1425] |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Attach timing/provenance context at Step 10.5 and optionally wire D9 lock hardening at the save entry path. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-021.md:51-55] |
| `.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts` | Create | Thin structured-log-backed helper for M1-M9 emission and standardized log events. [SOURCE: ../research/iterations/iteration-024.md:144-148] |
| `.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts` | Create | Safe-subset migration CLI with dry-run/report modes and per-defect toggles; apply mode deferred in this phase (see `pr11-defer-rationale.md`). [SOURCE: ../research/iterations/iteration-023.md:50-55] [SOURCE: ../research/iterations/iteration-023.md:71-80] |
| `memory-save-quality-alerts.yml` | Create | Alert-rule file for M4, M6, and M9 thresholds. [SOURCE: ../research/iterations/iteration-024.md:135-143] |
| Phase-local telemetry catalog artifact | Create | Operator-facing metric catalog and implementation crosswalk for M1-M9. [SOURCE: ../research/iterations/iteration-024.md:23-93] |
| Phase-local release-notes draft artifact | Create | Draft release communication with capture-mode parity note. [SOURCE: ../research/iterations/iteration-025.md:45-49] |
| `../spec.md` | Modify | Update the Phase 5 row in the parent phase map to `Complete` during closeout. [SOURCE: ../research/research.md:1445-1447] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-501 | Telemetry M1-M9 must be defined and folded into PR-9 rather than broken out into a separate PR. [SOURCE: ../research/research.md:1425-1441] | Metric catalog and emitting code path exist for M1-M9. |
| REQ-502 | Alert rules must include the frozen thresholds for M4, M6, and M9. [SOURCE: ../research/iterations/iteration-024.md:135-143] | Alert-rule artifact contains the three required rules. |
| REQ-503 | PR-10 must support dry-run-first execution with report output and per-defect controls. [SOURCE: ../research/iterations/iteration-023.md:71-83] | Dry-run script exists and publishes a structured report. |
| REQ-504 | Release notes must explicitly mention shared capture-mode benefits while preserving the spec-scope boundary. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1531-1532] | Release-note draft contains both the parity note and the unchanged-scope note. |
| REQ-505 | Phase 5 must distinguish phase-local closeout from parent packet closeout. [SOURCE: ../research/research.md:1445-1447] | Parent phase row is updated to the qualified phase-local status, and any remaining parent `/spec_kit:complete` blocker is recorded explicitly. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-506 | PR-10 stays dry-run only in this phase, and any historical apply follow-on remains explicitly deferred until a later operator decision. [SOURCE: ../research/iterations/iteration-023.md:71-83] | Phase docs record apply as deferred, and the shipped CLI surface stays dry-run only. |
| REQ-507 | PR-11 may ship or defer, but its status must be explicit and backed by a D9 reproduction path. [SOURCE: ../research/iterations/iteration-021.md:49-55] [SOURCE: ../research/research.md:1422-1423] | Reproduction test exists and ship/defer rationale is recorded. |
| REQ-508 | Phase 5 must not auto-migrate D1/D2/D5/D7 from historical file content alone. [SOURCE: ../research/research.md:1534-1537] | Dry-run and apply logic classify those defects as unrecoverable or ambiguity-sensitive. |
| REQ-509 | Telemetry labels must remain low-cardinality and operator-focused. [SOURCE: ../research/iterations/iteration-024.md:8-13] | Detailed context appears only in structured logs, not metric labels. |
| REQ-510 | Any PR-11 implementation must preserve acceptable single-process save behavior. [SOURCE: ../research/research.md:1524-1525] | Smoke verification shows no meaningful regression in the common path. |

### Acceptance Scenarios

**Scenario A: Telemetry and alerting stay operator-sized**

- **Given** a completed post-save review for a memory save on the Phase 5 branch,
- **When** the reviewer and workflow emit the M1-M9 metric payload,
- **Then** the metric set stays low-cardinality and limited to the agreed guardrail surface,
- **And** the alert-rule draft contains the required `M4 > 0`, `M6 > 5/hr`, and `M9 p95 > 500 ms` thresholds. [SOURCE: ../research/iterations/iteration-024.md:23-93] [SOURCE: ../research/iterations/iteration-024.md:135-147]

**Scenario B: PR-10 stays dry-run-first and safe-subset only**

- **Given** the historical JSON-mode corpus identified by the Phase 5 migration scan,
- **When** the PR-10 utility runs in dry-run mode,
- **Then** it publishes `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets,
- **And** it proposes automatic rewrites only for D3, D4, D6, and D8 rather than fabricating D1, D2, D5, or D7 content. [SOURCE: ../research/iterations/iteration-023.md:64-83] [SOURCE: ../research/research.md:1534-1537]

**Scenario C: PR-11 status is explicit instead of implied**

- **Given** the D9 concurrency risk remains a low-frequency operational concern,
- **When** Phase 5 closes without shipping PR-11 hardening,
- **Then** the phase records a written defer rationale and reopen triggers,
- **And** the packet does not silently present PR-11 as shipped. [SOURCE: ../research/iterations/iteration-021.md:49-55] [SOURCE: ../research/research.md:1422-1423]

**Scenario D: Parent closeout stays truthful**

- **Given** the phase-local telemetry, migration, release-note, and defer-status artifacts are complete,
- **When** Phase 5 updates the parent packet for closeout,
- **Then** the parent phase map marks Phase 5 as phase-local complete with parent gates still tracked separately,
- **And** the release framing states the capture-mode parity benefits without claiming a broader spec-scope change. [SOURCE: ../research/research.md:1445-1447] [SOURCE: ../research/research.md:1531-1532]
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-501 | A telemetry metric catalog for M1-M9 exists, maps each metric to its defect or latency purpose, and identifies the PR-9 callsites that emit it. [SOURCE: ../research/iterations/iteration-024.md:23-93] | Catalog document reviewed against Phase 5 tasks and PR-9 ownership. |
| AC-502 | `post-save-review.ts` emits or returns the Phase 5 metric payload needed for M1-M9 without introducing a separate tracing platform. [SOURCE: ../research/iterations/iteration-024.md:144-148] [SOURCE: ../research/iterations/iteration-024.md:158-160] | Targeted tests or fixture replays show metric fields present on review completion. |
| AC-503 | An alert-rule file exists and contains at least the required thresholds: `M4 > 0` page, `M6 > 5/hr` warn, and `M9 p95 > 500 ms` warn. [SOURCE: ../research/iterations/iteration-024.md:135-143] | Rule file diff plus reviewer sign-off. |
| AC-504 | PR-10 dry-run completes across the 82 historical JSON-mode candidates and publishes a report with `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets. [SOURCE: ../research/iterations/iteration-023.md:71-80] | Dry-run report committed or attached in packet-local evidence. |
| AC-505 | The dry-run applies only safe-subset changes to D3/D4/D6/D8 and does not auto-heal D1/D2/D5/D7 from file content alone. [SOURCE: ../research/iterations/iteration-023.md:64-69] [SOURCE: ../research/research.md:1534-1537] | Dry-run diff sample reviewed against representative files. |
| AC-506 | Any PR-10 apply step is blocked behind explicit operator approval after dry-run review. [SOURCE: ../research/iterations/iteration-023.md:71-83] | Approval note recorded before apply tasks can move to done. |
| AC-507 | A D9 latent-bug reproduction test exists, and Phase 5 records either a passing PR-11 hardening implementation or a documented defer rationale. [SOURCE: ../research/iterations/iteration-021.md:49-55] [SOURCE: ../research/research.md:1422-1423] | Test evidence plus implementation-or-deferral record. |
| AC-508 | Release notes mention that capture mode also benefits from the shared D2/D3/D5/D8 fixes while keeping the spec-scope line unchanged. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1531-1532] | Release-note draft reviewed against parity matrix. |
| AC-509 | The parent phase map shows Phase 5 as `Phase-local complete, parent gates pending`, and the packet records whether parent `/spec_kit:complete` remains blocked outside the child scope. [SOURCE: ../research/research.md:1445-1447] | Parent phase-map diff plus blocker note or completion-workflow evidence. |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies

| Dependency | Type | Status | Why it matters |
|------------|------|--------|----------------|
| Phase 1 merged | Internal | Required | Telemetry and release framing assume D8/D1 fixes exist in the mainline train first. [SOURCE: ../research/research.md:1154-1155] |
| Phase 2 merged | Internal | Required | Phase 5 telemetry and migration reasoning rely on the D4/D7 fixes and reviewer expectations being live. [SOURCE: ../research/research.md:1156-1157] |
| Phase 3 merged | Internal | Required | Historical migration and parity notes depend on D3/D2 remediation semantics already being canonical. [SOURCE: ../research/research.md:1158-1159] |
| Phase 4 merged | Internal | Required | PR-10 is explicitly post-PR-9, and telemetry folds into PR-9. [SOURCE: ../research/research.md:1160-1162] [SOURCE: ../research/research.md:1422-1425] |
| Existing structured logger on stderr | Internal | Available | Iter 24 wants a thin metric/log layer built on current logging practice, not a new platform. [SOURCE: ../research/iterations/iteration-024.md:15-22] [SOURCE: ../research/iterations/iteration-024.md:150-155] |
| Operator approval after dry-run | Process | Required for apply | PR-10 apply is optional and must remain gated. [SOURCE: ../research/iterations/iteration-023.md:71-83] |
| Concurrency pressure evidence | Process | Optional trigger | PR-11 should only be promoted if concurrent saves are real in CI/automation. [SOURCE: ../research/research.md:1422-1423] |
| Parent packet closeout path | Process | Required | This phase has no successor, so packet closure is the terminal handoff. [SOURCE: ../research/research.md:1445-1447] |

### Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Telemetry scope expands into a tracing project | Delays packet closeout and widens blast radius | Keep the implementation to iter 24's guardrail-sized counters, histograms, and structured log events only. [SOURCE: ../research/iterations/iteration-024.md:150-160] |
| Risk | PR-10 fabricates lost content | Historical files become less trustworthy rather than more trustworthy | Hard-ban D1/D2/D7 auto-healing and keep D5 under ambiguity-safe skip logic. [SOURCE: ../research/iterations/iteration-023.md:64-83] [SOURCE: ../research/research.md:1534-1537] |
| Risk | PR-11 slows normal saves | Single-user workflows regress even though D9 is low-frequency | Keep PR-11 localized, test concurrent scenarios directly, and reject designs that penalize the common single-process path. [SOURCE: ../research/iterations/iteration-021.md:51-55] [SOURCE: ../research/research.md:1524-1525] |
| Risk | Release notes overstate capture-mode scope | Users infer a larger packet change than what shipped | Keep the parity note explicit: shared fixes benefit capture mode, but spec scope stays unchanged. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1531-1532] |
| Dependency | Parent closeout hidden behind optional work | Packet appears complete without operational truth | Record whether PR-10 apply and PR-11 shipped, deferred, or remain operator-gated. [SOURCE: ../research/research.md:1438-1447] |

### Prior Art

| Prior art | Relevance to Phase 5 | How it should influence implementation |
|-----------|----------------------|----------------------------------------|
| `B.4 Final PR Train` owner map | Canonical source for which core PR owns which file and why Phase 5 is post-train work. [SOURCE: ../research/research.md:1149-1168] | Use it to avoid reopening or reassigning PR-1 through PR-9 owners while adding telemetry or release framing. |
| Iteration 21 D9 audit | Established D9 as the only new latent defect candidate and scoped it as operational. [SOURCE: ../research/iterations/iteration-021.md:49-77] | Keep PR-11 standalone and low-priority unless concurrency makes it necessary. |
| Iteration 22 performance model | Showed the D5 lineage work is acceptable if implementation stays narrow and optionally uses a partial-header reader. [SOURCE: ../research/iterations/iteration-022.md:59-76] | Preserve the narrowed PR-7 contract and keep Phase 5 telemetry measuring latency rather than redesigning PR-7. |
| Iteration 23 Option C | Chose the safe-subset migration shape and the dry-run/apply/report safety gates. [SOURCE: ../research/iterations/iteration-023.md:64-83] | Treat PR-10 as a controlled migration utility, not a blanket "fix everything" rewrite. |
| Existing bulk migration scripts | The repo already has dry-run/apply/report and conflict-skipping script patterns. [SOURCE: ../research/iterations/iteration-023.md:50-55] [SOURCE: ../research/iterations/iteration-023.md:95-95] | Mirror those semantics for PR-10 instead of inventing a new operational workflow. |
| Iteration 24 telemetry catalog | Defined the exact metric and alert set for Phase 5. [SOURCE: ../research/iterations/iteration-024.md:23-147] | Adopt the frozen metric names and thresholds rather than adding ad hoc counters. |
| Iteration 25 parity audit | Proved capture mode shares downstream fixes while keeping scope stable. [SOURCE: ../research/iterations/iteration-025.md:21-49] | Use parity findings in release notes and keep the parent spec scope unchanged. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: PR-10 must be idempotent in `--dry-run` mode. Re-running dry-run without intervening edits must produce the same bucket counts and defect classifications. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- **NFR-R02**: PR-10 must never rewrite fields outside the approved safe subset unless an explicit, per-defect switch and evidence justify it. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- **NFR-R03**: PR-11, if implemented, must fail closed or surface degraded-lock state clearly rather than silently continuing after unexpected lock failures. [SOURCE: ../research/iterations/iteration-021.md:51-55]

### Performance

- **NFR-P01**: PR-11 must not materially degrade single-process save throughput; the packet should preserve the existing single-user common path even if concurrent hardening lands. [SOURCE: ../research/iterations/iteration-021.md:54-55] [SOURCE: ../research/research.md:1524-1525]
- **NFR-P02**: Telemetry emission must stay guardrail-sized and defect-oriented. It may add counters, histograms, and structured logs, but not a broad tracing framework. [SOURCE: ../research/iterations/iteration-024.md:150-159]
- **NFR-P03**: Save-duration monitoring must keep the operational warning threshold aligned to `M9 p95 > 500 ms` rather than inventing a second latency budget in this phase. [SOURCE: ../research/iterations/iteration-024.md:135-140]

### Operability

- **NFR-O01**: Metric labels must remain low-cardinality and avoid embedding per-file paths or titles in counter labels. High-detail context belongs in structured logs only. [SOURCE: ../research/iterations/iteration-024.md:8-13]
- **NFR-O02**: Dry-run output must be reviewable by an operator without re-scanning the repo manually; the report must expose `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets. [SOURCE: ../research/iterations/iteration-023.md:71-80]
- **NFR-O03**: Release notes must distinguish shared-mode benefits from JSON-only fixes so the packet does not misrepresent impact. [SOURCE: ../research/iterations/iteration-025.md:34-49]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty or already-clean historical file: classify without writing and keep dry-run output deterministic. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- Mixed safe and unsafe defects in one file: rewrite only D3/D4/D6/D8 and classify D1/D2/D5/D7 separately. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- Metric label cardinality growth: keep high-detail context in structured logs, not labels. [SOURCE: ../research/iterations/iteration-024.md:8-13]

### Error Scenarios

- Two saves for the same session compete concurrently: reproduce explicitly, then either serialize correctly or document defer rationale if PR-11 stays out of scope. [SOURCE: ../research/iterations/iteration-021.md:49-55]
- Stale or malformed workflow-lock metadata: PR-11 must either fail closed or expose a degraded-lock signal rather than silently proceeding. [SOURCE: ../research/iterations/iteration-021.md:51-55]
- PR-10 dry-run succeeds but apply is never approved: count dry-run as Phase 5 P0 complete and record apply as a P2 defer if approval is withheld. [SOURCE: ../research/iterations/iteration-023.md:71-83]

### State Transitions

- Ambiguous predecessor candidate appears during migration: mark `skipped-ambiguous`; do not synthesize lineage. [SOURCE: ../research/iterations/iteration-023.md:67-76]
- Capture-mode users infer a scope change from release notes: state shared benefits clearly and also state that the spec scope line remains unchanged. [SOURCE: ../research/iterations/iteration-025.md:40-49]
- Parent closeout starts before optional tail decisions are recorded: stop and write explicit PR-10/PR-11 status first. [SOURCE: ../research/research.md:1438-1447]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple operational artifacts, but only one phase folder owns the plan. |
| Risk | 18/25 | Historical migration and save-lock hardening can both damage trust if handled loosely. |
| Research | 17/20 | Gen-3 findings are already converged; the complexity is in disciplined execution, not unknowns. |
| **Total** | **53/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should PR-10 emit an additional machine-readable manifest for `skipped-ambiguous` candidates so future historical review does not require another full scan? [SOURCE: ../research/iterations/iteration-023.md:102-103]
- If PR-11 ships, should degraded-lock mode be a hard failure for all JSON saves or a controlled opt-in only for CI/automation contexts? [SOURCE: ../research/iterations/iteration-021.md:73-75]
- Are any new cross-cutting operational rules discovered during Phase 5 strong enough to justify a constitutional memory update, or should the phase close without adding new global rules? [SOURCE: ../research/research.md:1438-1443]
<!-- /ANCHOR:questions -->

---
