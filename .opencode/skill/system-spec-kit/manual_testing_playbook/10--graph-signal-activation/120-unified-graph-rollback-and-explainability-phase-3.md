---
title: "120 -- Unified graph rollback and explainability (Phase 3)"
description: "This scenario validates Unified graph rollback and explainability (Phase 3) for `120`. It focuses on Confirm graph kill switch removes graph-side effects while traces still explain enabled runs."
---

# 120 -- Unified graph rollback and explainability (Phase 3)

## 1. OVERVIEW

This scenario validates Unified graph rollback and explainability (Phase 3) for `120`. It focuses on Confirm graph kill switch removes graph-side effects while traces still explain enabled runs.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `120` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graph kill switch removes graph-side effects while traces still explain enabled runs
- Prompt: `Validate Phase 3 graph rollback and explainability. Capture the evidence needed to prove When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; the graph FTS query materializes matched rowids once in a CTE, expands via UNION ALL source/target edge lookups, and avoids JS-side dedup; when disabled, graph-side effects are absent and baseline ordering remains deterministic. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; graph FTS path uses a CTE with SQL-side dedup and cached FTS-table availability; when disabled, graph-side effects are absent and baseline ordering remains deterministic
- Pass/fail: PASS: Enabled trace shows graph contributions, enabled query evidence shows the CTE/UNION ALL path with SQL-side dedup and cached FTS availability, disabled trace shows kill-switch baseline parity, repeated runs preserve exact ordering; FAIL: Graph effects remain after disable, CTE path regresses to OR-join or JS dedup, or repeated runs reorder ties

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 120 | Unified graph rollback and explainability (Phase 3) | Confirm graph kill switch removes graph-side effects while traces still explain enabled runs | `Validate Phase 3 graph rollback and explainability. Capture the evidence needed to prove When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; the graph FTS query materializes matched rowids once in a CTE, expands via UNION ALL source/target edge lookups, and avoids JS-side dedup; when disabled, graph-side effects are absent and baseline ordering remains deterministic. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_search({ query:"graph rollout check", includeTrace:true })` with graph rollout enabled 2) Capture SQL/query-plan evidence that the graph FTS path uses a matched-memory CTE plus `UNION ALL` source/target edge lookups and SQL-side duplicate collapse 3) Repeat the enabled query to confirm deterministic ordering and cached FTS availability behavior 4) Set `SPECKIT_GRAPH_UNIFIED=false` 5) Repeat query 6) Verify graph contribution counters drop to zero and ordering stays stable | When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; graph FTS path uses a CTE with SQL-side dedup and cached FTS-table availability; when disabled, graph-side effects are absent and baseline ordering remains deterministic | Search output + trace payloads for enabled/disabled runs + SQL/query-plan evidence for the CTE path + repeated query ordering comparison | PASS: Enabled trace shows graph contributions, enabled query evidence shows the CTE/UNION ALL path with SQL-side dedup and cached FTS availability, disabled trace shows kill-switch baseline parity, repeated runs preserve exact ordering; FAIL: Graph effects remain after disable, CTE path regresses to OR-join or JS dedup, or repeated runs reorder ties | Verify `SPECKIT_GRAPH_UNIFIED` propagation into Stage 2 → Inspect `graphContribution` trace metadata → Inspect graph query shape for CTE materialization and SQL-side dedup → Re-run identical query to confirm tie-break stability and cached FTS availability |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md](../../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 120
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/120-unified-graph-rollback-and-explainability-phase-3.md`
