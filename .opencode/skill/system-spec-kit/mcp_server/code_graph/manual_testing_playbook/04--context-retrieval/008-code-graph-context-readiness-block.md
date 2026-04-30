---
title: "008 code_graph_context readiness block"
description: "Verify context retrieval preserves readiness metadata and blocks full-scan-required states."
trigger_phrases:
  - "008"
  - "code graph context readiness block"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 008 code_graph_context readiness block

## 1. OVERVIEW

Verify context retrieval preserves readiness metadata and blocks full-scan-required states.

---

## 2. SCENARIO CONTRACT

- Objective: Verify context retrieval preserves readiness metadata and blocks full-scan-required states.
- Real user request: `Check that code_graph_context blocks broad stale state and returns readiness metadata instead of omitting graph-safety details.`
- RCAF Prompt: `As a code graph context operator, execute broad-stale readiness checks against code_graph_context in a disposable workspace. Verify context retrieval blocks full-scan-required states while preserving readiness metadata. Return PASS/FAIL with the blocked payload evidence.`
- Expected execution process: Run a full scan, touch more than 50 tracked source files, and call `code_graph_context` in neighborhood mode for `handleCodeGraphQuery`.
- Expected signals: Payload returns `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, readiness, canonical readiness, and trust state.
- Desired user-visible outcome: A concise verdict explaining whether context retrieval blocked safely and exposed the needed diagnostics.
- Pass/fail: PASS if broad stale state blocks with graph omission and readiness metadata; FAIL if context answers stale graph data, omits `requiredAction`, or drops readiness/trust fields.

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Touch more than 50 tracked source files.
3. Call `code_graph_context({"queryMode":"neighborhood","subject":"handleCodeGraphQuery"})`.

### Expected Output / Verification

Payload returns `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, readiness, canonical readiness, and trust state.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Call with a single stale file and verify selective self-heal mirrors query behavior.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 008
- Canonical root source: `manual_testing_playbook.md`
