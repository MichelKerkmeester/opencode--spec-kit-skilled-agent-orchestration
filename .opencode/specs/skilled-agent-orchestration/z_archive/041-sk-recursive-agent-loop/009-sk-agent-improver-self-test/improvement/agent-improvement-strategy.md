---
title: Recursive Agent Strategy Template
description: Mutable runtime strategy template for agent-improver sessions.
---

# Recursive Agent Strategy

Mutable strategy template for a agent-improver run. Use it to capture the operator-owned goal and hypothesis while reserving the machine-owned sections for reducer updates after scoring and benchmarking.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides the working strategy file for a agent-improver run.

### Usage

Copy this file into the runtime area, fill the operator-owned fields before the run, and let the reducer update the machine-owned status sections after each score or benchmark cycle.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:operator-owned -->
## 2. OPERATOR-OWNED FIELDS

### Target

[Set during initialization]

### Target Profile

[handover, context-prime, or dynamic (any agent)]

### Goal

[What improvement should be tested]

### Constraints

- promotion allowed only for the single canonical handover target
- candidate-only targets must never be promoted
- runtime mirrors excluded from benchmark truth
- no promotion without explicit later-phase gate
- stop when no-go or repeatability rules fail

### Current Hypothesis

[Why the current baseline may be improvable]

### Candidate Focus

[What the next candidate should change]

### Benchmark Focus

[Which fixture behaviors are being improved or protected]

### Integration Focus

[Which integration dimensions need attention: mirror sync, command coverage, permission alignment, resource references]

---

<!-- /ANCHOR:operator-owned -->
<!-- ANCHOR:machine-owned -->
## 3. MACHINE-OWNED FIELDS

<!-- MACHINE-OWNED: START -->
### What Improved

[Reducer updates after scoring and benchmarking]

### Dimensional Scores

| Dimension | Latest | Best | Trend |
| --- | --- | --- | --- |
| Structural | - | - | - |
| Rule Coherence | - | - | - |
| Integration | - | - | - |
| Output Quality | - | - | - |
| System Fitness | - | - | - |

[Reducer populates this table after each scored iteration]

### What Failed

[Reducer updates after scoring and benchmarking]

### Best Known State

[Reducer names the current best state]

### Next Recommendation

[Reducer recommends continue, stop, or hold]

### Packaging Follow-Up

[Reducer records downstream mirror-sync or parity debt separately]
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:machine-owned -->
<!-- ANCHOR:related-resources -->
## 4. RELATED RESOURCES

- `improvement_charter.md`
- `../references/loop_protocol.md`
- `target_manifest.jsonc`

<!-- /ANCHOR:related-resources -->
