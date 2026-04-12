---
title: "143 -- Bounded graph diagnostics and ordering stability"
description: "This scenario validates the bounded graph bonus diagnostics that remain after the graph-walk rollout ladder was retired."
audited_post_018: true
phase_018_replaces: graph-walk rollout-state ladder and diagnostics
---

# 143 -- Bounded graph diagnostics and ordering stability

## 1. OVERVIEW

This scenario validates bounded graph diagnostics for `143`. It focuses on confirming the active trace contract exposes bounded bonus behavior and stable ordering without relying on the retired rollout-state ladder.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `143` and confirm the expected signals without contradicting evidence.

- Objective: Verify bounded graph diagnostics expose the live trace fields and preserve deterministic ordering even when any legacy rollout metadata is treated as compatibility-only
- Prompt: `As a retrieval validation operator, validate Bounded graph diagnostics and ordering stability against memory_search({ query:"graph diagnostics stable ordering", includeTrace:true, limit:10 }). Verify bounded graph diagnostics expose the live trace fields and preserve deterministic ordering even when any legacy rollout metadata is treated as compatibility-only. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Trace diagnostics expose `raw`, `normalized`, `appliedBonus`, and `capApplied`; repeated identical runs preserve deterministic ordering; any legacy rollout-state label is compatibility metadata only and not part of the active operator contract
- Pass/fail: PASS if bounded bonus and ordering remain stable and the active contract no longer depends on rollout-state transitions

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 143 | Bounded graph diagnostics and ordering stability | Verify the live trace contract exposes bounded bonus fields and stable ordering without depending on retired rollout states | `As a retrieval validation operator, verify the live trace contract exposes bounded bonus fields and stable ordering without depending on retired rollout states against memory_search({ query:"graph diagnostics stable ordering", includeTrace:true, limit:10 }). Verify trace diagnostics expose raw, normalized, appliedBonus, and capApplied; repeated identical runs preserve deterministic ordering; any legacy rollout-state label is compatibility metadata only and not part of the active operator contract. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Run `memory_search({ query:"graph diagnostics stable ordering", includeTrace:true, limit:10 })` on a graph-connected corpus 2) Verify `trace.graphContribution.raw`, `normalized`, `appliedBonus`, and `capApplied` are present in the trace envelope 3) Repeat the identical query and confirm the returned ordering is stable across runs 4) If `trace.graphContribution.rolloutState` is present, treat it as compatibility metadata only and confirm the active operator contract does not depend on `trace_only`, `bounded_runtime`, or `off` state transitions | Trace diagnostics expose `raw`, `normalized`, `appliedBonus`, and `capApplied`; repeated identical runs preserve deterministic ordering; any legacy rollout-state label is compatibility metadata only and not part of the active operator contract | Search outputs for repeated identical runs + trace-envelope comparison | PASS if bounded bonus and ordering remain stable and the active contract no longer depends on rollout-state transitions | Inspect `mcp_server/formatters/search-results.ts`, `mcp_server/lib/search/hybrid-search.ts`, and `mcp_server/tests/search-results-format.vitest.ts` if the trace envelope no longer carries the bounded graph fields |

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
