---
title: "014 ccc_status availability probe"
description: "Verify ccc_status reports binary/index availability and recommendation without invoking reindex."
trigger_phrases:
  - "014"
  - "ccc status availability probe"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 014 ccc_status availability probe

## 1. OVERVIEW

Verify ccc_status reports binary/index availability and recommendation without invoking reindex.

---

## 2. SCENARIO CONTRACT

- Objective: Verify ccc_status reports binary/index availability and recommendation without invoking reindex.
- Real user request: `Probe ccc_status and confirm it reports binary and index availability without creating or changing CocoIndex artifacts.`
- RCAF Prompt: `As a CocoIndex integration tester, execute availability probe checks against ccc_status. Verify binary/index diagnostics and recommendations are reported without invoking reindex or mutating artifacts. Return PASS/FAIL with diagnostic payload evidence.`
- Expected execution process: Call `ccc_status({})` and capture `available`, `binaryPath`, `indexExists`, `indexSize`, and `recommendation`.
- Expected signals: Response is diagnostic-only and does not create or modify `.cocoindex_code`; recommendation matches binary/index presence.
- Desired user-visible outcome: A concise verdict explaining whether ccc_status stayed read-only and reported actionable availability diagnostics.
- Pass/fail: PASS if diagnostics match binary/index state and no reindex artifacts change; FAIL if status invokes reindex, mutates `.cocoindex_code`, or gives a mismatched recommendation.

---

## 3. TEST EXECUTION

### Commands

Call `ccc_status({})` and capture `available`, `binaryPath`, `indexExists`, `indexSize`, and `recommendation`.

### Expected Output / Verification

Response is diagnostic-only and does not create or modify `.cocoindex_code`. Recommendation matches binary/index presence.

### Cleanup

None.

### Variant Scenarios

Temporarily rename the copied binary in a disposable workspace to test unavailable status.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 014
- Canonical root source: `manual_testing_playbook.md`
