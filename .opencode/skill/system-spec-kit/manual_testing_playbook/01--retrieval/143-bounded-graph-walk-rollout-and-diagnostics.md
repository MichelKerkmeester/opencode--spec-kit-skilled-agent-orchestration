---
title: "143 -- Bounded graph-walk rollout and diagnostics"
description: "This scenario validates Bounded graph-walk rollout and diagnostics for `143`. It focuses on Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering."
---

# 143 -- Bounded graph-walk rollout and diagnostics

## 1. OVERVIEW

This scenario validates Bounded graph-walk rollout and diagnostics for `143`. It focuses on Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `143` and confirm the expected signals without contradicting evidence.

- Objective: Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering
- Prompt: `Validate bounded graph-walk rollout states and trace diagnostics. Capture the evidence needed to prove Rollout states switch cleanly between trace_only, bounded_runtime, and off; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; off disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Rollout states switch cleanly between `trace_only`, `bounded_runtime`, and `off`; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; `off` disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering
- Pass/fail: PASS if rollout state, bounded bonus, cap saturation signaling, and ordering guarantees all match the documented ladder

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 143 | Bounded graph-walk rollout and diagnostics | Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering | `Validate bounded graph-walk rollout states and trace diagnostics. Capture the evidence needed to prove Rollout states switch cleanly between trace_only, bounded_runtime, and off; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; off disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare a graph-connected sandbox corpus 2) Start runtime with `SPECKIT_GRAPH_WALK_ROLLOUT=trace_only` and run `memory_search({ query:"graph rollout trace check", includeTrace:true, limit:10 })` 3) Verify `trace.graphContribution.rolloutState` is `trace_only` and `appliedBonus` remains 0 while `raw`/`normalized` are still visible 4) Restart with `SPECKIT_GRAPH_WALK_ROLLOUT=bounded_runtime` and repeat 5) Verify `appliedBonus` is present, bounded at `<= 0.03`, and `capApplied` flips to `true` when the bounded runtime bonus saturates at the Stage 2 cap 6) Restart with `SPECKIT_GRAPH_WALK_ROLLOUT=off` and verify the graph-walk bonus disappears while the broader graph-signal path stays governed by `SPECKIT_GRAPH_SIGNALS` and repeated identical runs keep the same ordering | Rollout states switch cleanly between `trace_only`, `bounded_runtime`, and `off`; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; `off` disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering | Search outputs for all three rollout states + ordering comparison across repeated runs | PASS if rollout state, bounded bonus, cap saturation signaling, and ordering guarantees all match the documented ladder | Inspect `lib/search/search-flags.ts`, `lib/search/graph-flags.ts`, `lib/graph/graph-signals.ts`, and `lib/search/pipeline/ranking-contract.ts` if bonus or ordering contracts drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 143
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/143-bounded-graph-walk-rollout-and-diagnostics.md`
