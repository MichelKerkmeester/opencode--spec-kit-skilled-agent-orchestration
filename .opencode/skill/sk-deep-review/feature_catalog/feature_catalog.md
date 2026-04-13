---
title: "sk-deep-review: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the sk-deep-review review-loop system."
---

# sk-deep-review: Feature Catalog

This document combines the current feature inventory for the `sk-deep-review` system into a single reference. The root catalog acts as the system-level directory: it summarizes the loop lifecycle, state packet, review dimensions, and severity controls, and points to the per-feature files that carry the deeper protocol and source anchors.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. LOOP LIFECYCLE](#2--loop-lifecycle)
- [3. STATE MANAGEMENT](#3--state-management)
- [4. REVIEW DIMENSIONS](#4--review-dimensions)
- [5. SEVERITY SYSTEM](#5--severity-system)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `sk-deep-review` feature surface. The numbered sections below group the system by lifecycle, packet state, review coverage, and finding controls so readers can move from a top-level summary into per-feature reference files without losing the contract behind each review phase.

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| Loop lifecycle | 5 features | `SKILL.md`, `references/loop_protocol.md`, deep-review workflows |
| State management | 5 features | `references/state_format.md`, review packet files, reducer outputs |
| Review dimensions | 4 features | `assets/review_mode_contract.yaml`, `assets/deep_review_strategy.md` |
| Severity system | 5 features | `references/convergence.md`, `references/state_format.md`, review contract |

---

## 2. LOOP LIFECYCLE

These entries cover the end-to-end review loop from packet initialization through dispatch, stop evaluation, synthesis, and continuity save.

### Initialization

#### Description

Creates the canonical review packet and seeds the first review charter.

#### Current Reality

Initialization classifies the prior state, resolves the target into files, orders the four review dimensions by risk priority, plans applicable core and overlay traceability protocols, and writes the config, JSONL log, findings registry, and strategy packet under `review/`.

#### Source Files

See [`01--loop-lifecycle/01-initialization.md`](01--loop-lifecycle/01-initialization.md) for full implementation and validation file listings.

---

### Iteration dispatch

#### Description

Runs one fresh-context review cycle against the current focus.

#### Current Reality

Each loop pass reads the packet state, generates a compact state summary, dispatches `@deep-review` with one focus dimension and file set, requires write-once iteration output plus JSONL and strategy updates, and keeps the agent leaf-only and read-only against the target code.

#### Source Files

See [`01--loop-lifecycle/02-iteration-dispatch.md`](01--loop-lifecycle/02-iteration-dispatch.md) for full implementation and validation file listings.

---

### Convergence check

#### Description

Determines whether the loop continues, recovers, or stops.

#### Current Reality

The stop path combines hard stops, a three-signal weighted vote, blocked-stop persistence, graph-assisted review gates, and stuck recovery. STOP is legal only when convergence math and the review gate bundle agree.

#### Source Files

See [`01--loop-lifecycle/03-convergence-check.md`](01--loop-lifecycle/03-convergence-check.md) for full implementation and validation file listings.

---

### Synthesis

#### Description

Compiles iteration output into the final review report and terminal state.

#### Current Reality

Synthesis deduplicates findings across iteration files, reconciles adjudicated severities, replays the JSONL audit trail, writes the nine-section `review-report.md`, determines PASS or CONDITIONAL or FAIL, and appends the terminal synthesis event.

#### Source Files

See [`01--loop-lifecycle/04-synthesis.md`](01--loop-lifecycle/04-synthesis.md) for full implementation and validation file listings.

---

### Memory save

#### Description

Preserves the completed review context for future recovery.

#### Current Reality

The save phase treats `generate-context.js` as the supported handoff boundary, keeps the on-disk review packet as ground truth, and does not discard review results when the continuity save step fails.

#### Source Files

See [`01--loop-lifecycle/05-memory-save.md`](01--loop-lifecycle/05-memory-save.md) for full implementation and validation file listings.

---

## 3. STATE MANAGEMENT

These entries describe the review packet files, how they change over time, and how reducer-owned state feeds the loop, dashboard, and synthesis surfaces.

### JSONL state log

#### Description

Stores the append-only execution history for the review lineage.

#### Current Reality

`deep-review-state.jsonl` begins with a config record, appends iteration records with severity-weighted findings and coverage data, records pause and blocked-stop and synthesis events, and can carry graph convergence and graph event payloads for review-aware coverage tracking.

#### Source Files

See [`02--state-management/01-jsonl-state-log.md`](02--state-management/01-jsonl-state-log.md) for full implementation and validation file listings.

---

### Strategy tracking

#### Description

Maintains the mutable review brain across fresh agent dispatches.

#### Current Reality

`deep-review-strategy.md` tracks remaining and completed dimensions, running findings, worked and failed approaches, cross-reference status, files under review, and the next focus anchor that steers the next iteration.

#### Source Files

See [`02--state-management/02-strategy-tracking.md`](02--state-management/02-strategy-tracking.md) for full implementation and validation file listings.

---

### Config management

#### Description

Defines the immutable packet contract for the current review lineage.

#### Current Reality

`deep-review-config.json` captures the topic, target type, configured dimensions, lineage fields, thresholds, protection levels, and reducer contract. It is written once during init and becomes the stable reference for the rest of the run.

#### Source Files

See [`02--state-management/03-config-management.md`](02--state-management/03-config-management.md) for full implementation and validation file listings.

---

### Findings registry

#### Description

Holds the reducer-owned view of active, resolved, repeated, and blocked findings.

#### Current Reality

`deep-review-findings-registry.json` is regenerated after each iteration and lifecycle transition, keeps severity totals and dimension coverage, stores blocked-stop and graph convergence history, and fail-closes when corruption or missing machine-owned anchors break the reducer contract.

#### Source Files

See [`02--state-management/04-findings-registry.md`](02--state-management/04-findings-registry.md) for full implementation and validation file listings.

---

### Dashboard

#### Description

Publishes the current review status as a machine-owned summary surface.

#### Current Reality

`deep-review-dashboard.md` is regenerated from the JSONL log, strategy file, and findings registry after each iteration. It surfaces the provisional verdict, findings deltas, coverage progress, trend signals, and active risks without becoming a manual editing surface.

#### Source Files

See [`02--state-management/05-dashboard.md`](02--state-management/05-dashboard.md) for full implementation and validation file listings.

---

## 4. REVIEW DIMENSIONS

These entries capture the four canonical audit dimensions that define loop coverage and shape findings, convergence, and the strategy checklist.

### Correctness

#### Description

Audits logic, invariants, and behavior against observable intent.

#### Current Reality

Correctness is the first-priority dimension, covers logic and state transitions and edge cases, and is required for severity coverage and for a legal clean stop. It leads the default dimension ordering in both the strategy template and the review contract.

#### Source Files

See [`03--review-dimensions/01-correctness.md`](03--review-dimensions/01-correctness.md) for full implementation and validation file listings.

---

### Security

#### Description

Audits trust boundaries, exploit paths, and exposure risk.

#### Current Reality

Security is the second-priority dimension, checks authn and authz behavior, input handling, secrets exposure, and exploitability, and is a required coverage dimension with direct impact on P0 and P1 classification.

#### Source Files

See [`03--review-dimensions/02-security.md`](03--review-dimensions/02-security.md) for full implementation and validation file listings.

---

### Traceability

#### Description

Audits whether claims and artifacts line up with shipped behavior.

#### Current Reality

Traceability is the third review dimension and owns spec-to-code checks, checklist evidence, and overlay protocols such as skill-agent, feature-catalog, and playbook alignment. Its protocol results feed both convergence and final traceability status reporting.

#### Source Files

See [`03--review-dimensions/03-traceability.md`](03--review-dimensions/03-traceability.md) for full implementation and validation file listings.

---

### Maintainability

#### Description

Audits codebase clarity and the safety of follow-on change.

#### Current Reality

Maintainability is the fourth default dimension and covers patterns, documentation quality, clarity, and change cost. It is still required for full coverage even though it carries lower default risk priority than correctness and security.

#### Source Files

See [`03--review-dimensions/04-maintainability.md`](03--review-dimensions/04-maintainability.md) for full implementation and validation file listings.

---

## 5. SEVERITY SYSTEM

These entries cover how the loop classifies findings, verifies blocker claims, adjudicates evidence, determines verdicts, and blocks premature stop attempts.

### Severity classification

#### Description

Assigns P0 or P1 or P2 meaning and severity weight to each finding.

#### Current Reality

The review loop uses a three-level severity contract with weights `10.0 / 5.0 / 1.0`, requires file-line evidence for every level, uses severity-weighted `newFindingsRatio`, and applies the P0 override to prevent premature convergence when a new blocker is found.

#### Source Files

See [`04--severity-system/01-severity-classification.md`](04--severity-system/01-severity-classification.md) for full implementation and validation file listings.

---

### Adversarial self-check

#### Description

Re-reads blocker evidence before a P0 can shape the verdict.

#### Current Reality

Every P0 must be rechecked before it is accepted as final. The rule appears in the skill contract, iteration checklist, and success criteria, and is treated as a required guard before a FAIL verdict is finalized.

#### Source Files

See [`04--severity-system/02-adversarial-self-check.md`](04--severity-system/02-adversarial-self-check.md) for full implementation and validation file listings.

---

### Claim adjudication

#### Description

Turns new P0 and P1 findings into typed, review-visible claims.

#### Current Reality

Each new blocker or required finding must carry a typed adjudication packet with evidence, counterevidence search, alternative explanation, final severity, confidence, and transition history. Missing or failing packets trip `claimAdjudicationGate` and veto STOP.

#### Source Files

See [`04--severity-system/03-claim-adjudication.md`](04--severity-system/03-claim-adjudication.md) for full implementation and validation file listings.

---

### Verdicts

#### Description

Maps active finding state into FAIL or CONDITIONAL or PASS.

#### Current Reality

Verdicts are derived from active findings plus gate state: unresolved P0 or failed required gates yield FAIL, active P1 without P0 yields CONDITIONAL, and PASS requires no active P0 or P1 while recording `hasAdvisories=true` when P2 remains.

#### Source Files

See [`04--severity-system/04-verdicts.md`](04--severity-system/04-verdicts.md) for full implementation and validation file listings.

---

### Quality gates

#### Description

Prevents the loop from stopping or passing on weak evidence.

#### Current Reality

The legal-stop bundle combines evidence, scope, coverage, P0 resolution, evidence density, hotspot saturation, and claim adjudication checks. When a stop vote fails those checks, the loop persists a `blocked_stop` event and continues with a recovery hint instead of silently stopping.

#### Source Files

See [`04--severity-system/05-quality-gates.md`](04--severity-system/05-quality-gates.md) for full implementation and validation file listings.

