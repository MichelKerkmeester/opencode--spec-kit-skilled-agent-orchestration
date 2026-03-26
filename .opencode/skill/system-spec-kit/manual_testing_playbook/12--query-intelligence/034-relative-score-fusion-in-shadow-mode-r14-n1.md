---
title: "034 -- Relative score fusion in shadow mode (R14/N1) [retired]"
description: "This page records that the RSF runtime-path scenario was removed from active manual testing because the shipped ranking path no longer uses RSF."
---

# 034 -- Relative score fusion in shadow mode (R14/N1) [retired]

## 1. OVERVIEW

This page records that the RSF runtime-path scenario was removed from active manual testing because the shipped ranking path no longer uses RSF.

---

## 2. CURRENT REALITY

This feature is fully removed from the codebase. The RSF module (`rsf-fusion.ts`), its dedicated test files, and the `rsfShadow` metadata field were deleted during the v3 remediation sweep. This playbook entry is retained only as a retirement record.

- Objective: Record retirement of the RSF live-runtime scenario
- Prompt: `N/A — active manual validation for RSF live ranking was removed from the playbook because production ranking stays on RRF and RSF is no longer a shipped runtime path.`
- Expected signals: This page clearly marks the scenario as retired and no longer asks operators to prove live RSF behavior
- Pass/fail: PASS if the page is clearly a retirement note and contains no active RSF runtime test steps; FAIL if it still instructs operators to validate live RSF behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 034 | Relative score fusion in shadow mode (R14/N1) [retired] | Record retirement of the RSF live-runtime scenario | `N/A — active manual validation for RSF live ranking was removed from the playbook because production ranking stays on RRF and RSF is no longer a shipped runtime path.` | No active execution sequence. Confirm the playbook and linked catalog frame RSF as retired or inert documentation only. | This page clearly marks the scenario as retired and no longer asks operators to prove live RSF behavior | Current page text + linked catalog reference | PASS if the page is clearly a retirement note and contains no active RSF runtime test steps; FAIL if it still instructs operators to validate live RSF behavior | If active-runtime wording reappears, remove it from this page and the root playbook index, then re-check the linked catalog note |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md](../../feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 034
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/034-relative-score-fusion-in-shadow-mode-r14-n1.md`
