---
title: "EX-020 -- Causal graph statistics (memory_causal_stats)"
description: "This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review."
audited_post_018: true
---

# EX-020 -- Causal graph statistics (memory_causal_stats)

## 1. OVERVIEW

This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `deltaByRelation` per-relation deltas, `balanceStatus` enum (`balanced` | `skewed_inbound` | `skewed_outbound` | `capped`), and per-relation per-window cap surface.
- Real user request: `` Please validate Causal graph statistics (memory_causal_stats) against memory_causal_stats() and tell me whether the expected signals are present: `deltaByRelation` keys cover all causal relation types in the test corpus; `balanceStatus` value matches corpus shape; `windowCap` surfaces when configured cap is exceeded; baseline coverage/edge metrics still present. ``
- RCAF Prompt: `As an analysis validation operator, validate Causal graph statistics (memory_causal_stats) against memory_causal_stats(). Verify response carries (1) deltaByRelation map keyed by relation type, (2) balanceStatus from the documented enum, (3) windowCap field surfacing when a relation hit the per-relation per-window cap, plus baseline coverage and edge metrics. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `deltaByRelation` keys cover all causal relation types in the test corpus; `balanceStatus` value matches corpus shape; `windowCap` surfaces when configured cap is exceeded; baseline coverage/edge metrics still present
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all three window-metric fields are present and align with the corpus shape across balanced, skewed, and cap-trigger scenarios

---

## 3. TEST EXECUTION

### Prompt

```
As an analysis validation operator, validate Graph coverage review against memory_causal_stats(). Verify coverage and edge metrics present. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_causal_stats()

### Expected

Coverage and edge metrics present

### Evidence

Stats output

### Pass / Fail

- **Pass**: metrics returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Rebuild causal edges if empty

---

### Prompt

```
As an analysis validation operator, validate the per-window causal metrics shape of memory_causal_stats() across three corpora: balanced, skewed, and cap-triggering. Verify deltaByRelation enumerates per-relation deltas, balanceStatus reflects the corpus, and windowCap surfaces only on the cap-trigger corpus. Return a concise pass/fail verdict.
```

### Commands

1. `memory_causal_stats()` against a balanced corpus → assert `balanceStatus === "balanced"`, `deltaByRelation` populated, no `windowCap`
2. `memory_causal_stats()` against a skewed corpus → assert `balanceStatus ∈ {"skewed_inbound","skewed_outbound"}`, `deltaByRelation` shows the dominant relation
3. `memory_causal_stats()` against a cap-trigger corpus (relation deltas exceeding configured per-window cap) → assert `balanceStatus === "capped"` and `windowCap` field surfaces with the relation that hit the cap

### Expected

`deltaByRelation` keyed by every relation type with non-negative integer deltas; `balanceStatus` matches the corpus shape; `windowCap` only present when the cap is triggered.

### Evidence

memory_causal_stats responses for all three corpora highlighting deltaByRelation, balanceStatus, and windowCap fields

### Pass / Fail

- **Pass**: every window-metric field present and consistent with the corpus across the three scenarios
- **Fail**: any field missing, balanceStatus drifts from the documented enum, or windowCap surfaces on a non-capped corpus

### Failure Triage

Inspect `mcp_server/handlers/memory/causal-stats.ts` window-metrics computation; confirm packet 006 dist marker present

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/02-causal-graph-statistics-memorycausalstats.md](../../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/020-causal-graph-statistics-memory-causal-stats.md`
