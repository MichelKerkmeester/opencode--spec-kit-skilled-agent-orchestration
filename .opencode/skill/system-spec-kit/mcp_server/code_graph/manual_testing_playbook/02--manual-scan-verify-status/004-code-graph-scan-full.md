---
title: "004 code_graph_scan full"
description: "Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline."
trigger_phrases:
  - "004"
  - "code graph scan full"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 004 code_graph_scan full

## 1. OVERVIEW

Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline.
- Real user request: `Run a full code_graph_scan and confirm it reparses candidates, records graph counts, and persists the edge baseline when requested.`
- RCAF Prompt: `As a code graph scan operator, execute a full scan against a disposable workspace with baseline persistence enabled. Verify full-scan mode, graph counts, readiness, and detector provenance are present. Return PASS/FAIL with the main payload evidence.`
- Expected execution process: Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy and inspect the returned payload.
- Expected signals: Payload shows `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts, readiness with `inlineIndexPerformed:true`, and detector provenance summary.
- Desired user-visible outcome: A concise verdict explaining whether explicit full scan and baseline persistence behaved as documented.
- Pass/fail: PASS if all full-scan and baseline evidence appears; FAIL if the scan runs incrementally, returns empty graph counts, omits readiness, or lacks detector provenance.

---

## 3. TEST EXECUTION

### Commands

Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy.

### Expected Output / Verification

Payload shows `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts, readiness with `inlineIndexPerformed:true`, and detector provenance summary.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Add an excludeGlobs override and verify excluded paths disappear after the full scan.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 004
- Canonical root source: `manual_testing_playbook.md`
