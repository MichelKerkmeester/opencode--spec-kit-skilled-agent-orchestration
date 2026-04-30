---
title: "006 code_graph_status readonly"
description: "Verify status reads readiness and graph quality without mutating or repairing stale state."
trigger_phrases:
  - "006"
  - "code graph status readonly"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 006 code_graph_status readonly

## 1. OVERVIEW

Verify status reads readiness and graph quality without mutating or repairing stale state.

---

## 2. SCENARIO CONTRACT

- Objective: Verify status reads readiness and graph quality without mutating or repairing stale state.
- Real user request: `Inspect code_graph_status around a stale-file fixture and confirm it reports diagnostics without repairing the graph.`
- RCAF Prompt: `As a code graph status reviewer, execute read-only status checks against code_graph_status around a stale-file fixture. Verify readiness and graph-quality diagnostics are reported without mutation or repair. Return PASS/FAIL with before-and-after evidence.`
- Expected execution process: Capture `code_graph_status({})` twice around a stale-file fixture, compare `lastPersistedAt`, readiness, and scan counts, and confirm no `code_graph_scan` was invoked.
- Expected signals: Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState`, and `graphQualitySummary`, but does not repair stale state.
- Desired user-visible outcome: A concise verdict explaining whether status stayed diagnostic-only.
- Pass/fail: PASS if status reports diagnostics without changing persistence or scan evidence; FAIL if it repairs stale state, invokes scan, or omits readiness and graph-quality diagnostics.

---

## 3. TEST EXECUTION

### Commands

1. Capture `code_graph_status({})` twice around a stale-file fixture.
2. Compare `lastPersistedAt`, readiness, and scan counts.
3. Confirm no `code_graph_scan` was invoked.

### Expected Output / Verification

Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState`, and `graphQualitySummary`, but does not repair stale state.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Corrupt the copied DB and verify status returns a degraded envelope rather than crashing.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 006
- Canonical root source: `manual_testing_playbook.md`
