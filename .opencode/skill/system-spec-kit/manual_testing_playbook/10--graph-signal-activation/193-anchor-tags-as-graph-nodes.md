---
title: "193 -- ANCHOR tags as graph nodes"
description: "This scenario validates ANCHOR tags as graph nodes for `193`. It focuses on Confirm deferred/not-implemented status."
---

# 193 -- ANCHOR tags as graph nodes

## 1. OVERVIEW

This scenario validates ANCHOR tags as graph nodes for `193`. It focuses on Confirm deferred/not-implemented status.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `193` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deferred/not-implemented status
- Prompt: `Verify ANCHOR tags as graph nodes remains deferred and not active. Capture the evidence needed to prove ANCHOR markers are parsed and extracted as metadata only; no graph-node promotion or graph-edge creation is performed for anchors; current tests explicitly guard against accidental activation. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: ANCHOR markers are parsed and extracted as metadata only; no graph-node promotion or graph-edge creation is performed for anchors; current tests explicitly guard against accidental activation
- Pass/fail: PASS if anchor handling stays metadata-only, no anchor graph nodes or edges are created, and the guard test confirms the feature remains deferred. FAIL if any active graph-node promotion exists or current documentation claims the feature is implemented.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 193 | ANCHOR tags as graph nodes | Confirm deferred/not-implemented status | `Verify ANCHOR tags as graph nodes remains deferred and not active. Capture the evidence needed to prove ANCHOR markers are parsed and extracted as metadata only; no graph-node promotion or graph-edge creation is performed for anchors; current tests explicitly guard against accidental activation. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect anchor chunking and metadata extraction paths 2) Run or review the guard test that confirms anchors do not create graph edges 3) Verify no graph-node promotion path exists for anchors in the current graph pipeline | ANCHOR markers are parsed and extracted as metadata only; no graph-node promotion or graph-edge creation is performed for anchors; current tests explicitly guard against accidental activation | Source inspection notes + guard test output + absence of anchor-node or edge-creation traces | PASS if anchor handling stays metadata-only, no anchor graph nodes or edges are created, and the guard test confirms the feature remains deferred. FAIL if any active graph-node promotion exists or current documentation claims the feature is implemented. | Verify deferred status in the feature catalog and N2 notes → Inspect anchor parsing and metadata extraction modules → Check tests for explicit non-activation guards → Confirm graph scoring/types do not expose anchor-node promotion |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md](../../feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 193
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/193-anchor-tags-as-graph-nodes.md`
