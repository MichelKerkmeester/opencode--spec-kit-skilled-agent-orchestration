---
title: "134 -- Startup pending-file recovery lifecycle coverage"
description: "This scenario validates Startup pending-file recovery lifecycle coverage for `134`. It focuses on Verify startup recovery scans allowed roots and preserves stale pending files for manual review."
---

# 134 -- Startup pending-file recovery lifecycle coverage

## 1. OVERVIEW

This scenario validates Startup pending-file recovery lifecycle coverage for `134`. It focuses on Verify startup recovery scans allowed roots and preserves stale pending files for manual review.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `134` and confirm the expected signals without contradicting evidence.

- Objective: Verify startup recovery scans allowed roots and preserves stale pending files for manual review
- Prompt: `Validate startup pending-file recovery behavior across committed and stale files. Capture the evidence needed to prove Committed pending file recovers to original path; stale pending file remains with explicit stale classification; startup scan covers configured/allowed roots without scanning unrelated workspace trees. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Committed pending file recovers to original path; stale pending file remains with explicit stale classification; startup scan covers configured/allowed roots without scanning unrelated workspace trees
- Pass/fail: PASS if committed/stale behavior diverges correctly and startup scan root set includes expected allowed locations

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 134 | Startup pending-file recovery lifecycle coverage | Verify startup recovery scans allowed roots and preserves stale pending files for manual review | `Validate startup pending-file recovery behavior across committed and stale files. Capture the evidence needed to prove Committed pending file recovers to original path; stale pending file remains with explicit stale classification; startup scan covers configured/allowed roots without scanning unrelated workspace trees. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a pending file where DB row is committed, then run startup recovery (`recoverAllPendingFiles` path) 2) Verify committed pending file is renamed to original path 3) Create a stale pending file with no DB row 4) Verify stale pending file is not renamed and is reported for manual review 5) Verify scan roots include configured memory base roots plus `.opencode/specs` and constitutional locations | Committed pending file recovers to original path; stale pending file remains with explicit stale classification; startup scan covers configured/allowed roots without scanning unrelated workspace trees | Recovery output + filesystem checks + startup scan log evidence | PASS if committed/stale behavior diverges correctly and startup scan root set includes expected allowed locations | Inspect `context-server.ts` recovery root derivation and `transaction-manager.ts` stale pending detection |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/06-startup-pending-file-recovery.md](../../feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 134
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md`
