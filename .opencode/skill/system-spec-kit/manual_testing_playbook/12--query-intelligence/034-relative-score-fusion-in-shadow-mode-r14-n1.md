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

- Objective: Record retirement of the RSF live-runtime scenario and guard that the shipped path remains single-pass RRF with precomputed weights
- Prompt: `N/A for live RSF execution. Use source-only checks to confirm production ranking still stays on RRF and that hybrid search now precomputes adaptive weights before building the live fusion lists.`
- Expected signals: This page clearly marks the scenario as retired, contains no live RSF validation steps, and the source-only check shows `getAdaptiveWeights(...)` plus a single-pass `fusionLists` -> `fuseResultsMulti(...)` path
- Pass/fail: PASS if the page is clearly a retirement note, contains no active RSF runtime test steps, and the source-only check confirms the live path stays on single-pass RRF; FAIL if it reintroduces live RSF validation or the source anchors disappear

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 034 | Relative score fusion in shadow mode (R14/N1) [retired] | Record retirement of the RSF live-runtime scenario and guard single-pass RRF weighting | `N/A for live RSF execution. Use source-only checks to confirm production ranking still stays on RRF and that hybrid search now precomputes adaptive weights before building the live fusion lists.` | 1) `rg -n "getAdaptiveWeights|const fusionLists = lists|fuseResultsMulti\\(fusionLists\\)" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`<br>2) Confirm this page and the linked catalog entry still frame RSF as retired or inert documentation only, with no live RSF execution steps. | This page clearly marks the scenario as retired, contains no live RSF validation steps, and the source grep shows `getAdaptiveWeights(...)` plus the single-pass `fusionLists` -> `fuseResultsMulti(...)` live path | Saved `rg` output plus the current page text and linked catalog reference | PASS if the page is clearly a retirement note, contains no active RSF runtime test steps, and the source-only check confirms the live path stays on single-pass RRF; FAIL if it still instructs operators to validate live RSF behavior or if the single-pass RRF anchors are missing | If active-runtime wording reappears, remove it from this page and the root playbook index, then re-check the linked catalog note. If the source grep fails, inspect `mcp_server/lib/search/hybrid-search.ts` and `shared/algorithms/adaptive-fusion.ts` for a fusion-path regression before updating the retirement note |

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
