---
title: "091 -- Implemented: graph centrality and community detection (N2)"
description: "This scenario validates Implemented: graph centrality and community detection (N2) for `091`. It focuses on Confirm deferred->implemented status."
audited_post_018: true
---

# 091 -- Implemented: graph centrality and community detection (N2)

## 1. OVERVIEW

This scenario validates Implemented: graph centrality and community detection (N2) for `091`. It focuses on Confirm deferred->implemented status.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm deferred->implemented status.
- Real user request: `Please validate Implemented: graph centrality and community detection (N2) against the documented validation surface and tell me whether the expected signals are present: N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores.`
- RCAF Prompt: `As a graph-signal validation operator, validate Implemented: graph centrality and community detection (N2) against the documented validation surface. Verify n2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if N2 tables are populated, flags are active, and graph queries include centrality/community scoring. NOTE: ANCHOR-as-node is PLANNED/DEFERRED (feature catalog `_deprecated/09-anchor-tags-as-graph-nodes.md`) and is excluded from pass criteria. This scenario passes based on the implemented N2 features (momentum, depth, community) alone.

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm deferred->implemented status against the documented validation surface. Verify n2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. inspect tables/flags
2. run graph queries
3. verify N2 contributions

### Expected

N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores

### Evidence

Table inspection + flag status + graph query output showing N2 score contributions

### Pass / Fail

- **Pass**: N2 tables are populated, flags are active, and graph queries include centrality/community scoring. ANCHOR-as-node is DEFERRED/SKIPPED — see feature catalog `_deprecated/09-anchor-tags-as-graph-nodes.md`. Test actively guards against edge creation; this aspect must NOT be tested as a current requirement.
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify N2 migration completed; check feature flag state; inspect graph scoring pipeline for N2 channel integration

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 091
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/091-implemented-graph-centrality-and-community-detection-n2.md`
