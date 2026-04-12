---
title: "034 -- Relative score fusion in shadow mode (R14/N1) [deprecated]"
description: "RSF runtime-path validation is retired. This tombstone preserves the historical record while the live path remains RRF-only with precomputed adaptive weights."
status: deprecated
deprecated_at: 2026-04-11
deprecated_by: phase-006-canonical-continuity-refactor
deprecation_reason: "The shipped ranking path no longer uses RSF; validation should stay source-only."
phase_018_replaces: "feature_catalog/12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md"
---

# 034 -- Relative score fusion in shadow mode (R14/N1) [deprecated]

## 1. TOMBSTONE

This scenario is retained only as a historical retirement record. Do not use it as an active runtime validation.

## 2. CURRENT REALITY

The shipped ranking path is RRF-only. Source-only checks may confirm the live path still precomputes adaptive weights and builds a single `fusionLists` payload for `fuseResultsMulti(...)`.

- Objective: Record retirement of the RSF live-runtime scenario and preserve the source-only guardrail
- Prompt: `As a query-intelligence validation operator, validate Relative score fusion in shadow mode (R14/N1) [deprecated] against the documented validation surface. Verify record retirement of the RSF live-runtime scenario and preserve the source-only guardrail. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: This tombstone clearly marks the scenario as deprecated, contains no live RSF validation steps, and the source-only check shows `getAdaptiveWeights(...)` plus a single-pass `fusionLists` -> `fuseResultsMulti(...)` path
- Pass/fail: PASS if the page is clearly a retirement note, contains no active RSF runtime test steps, and the source-only check confirms the live path stays on single-pass RRF; FAIL if it reintroduces live RSF validation or the source anchors disappear

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 034 | Relative score fusion in shadow mode (R14/N1) [deprecated] | Record retirement of the RSF live-runtime scenario and preserve single-pass RRF weighting guardrails | `N/A for live RSF execution. Use source-only checks to confirm production ranking still stays on RRF and that hybrid search now precomputes adaptive weights before building the live fusion lists.` | 1) `rg -n "getAdaptiveWeights|const fusionLists = lists|fuseResultsMulti\\(fusionLists\\)" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`<br>2) Confirm this tombstone and the linked catalog tombstone still frame RSF as retired documentation only, with no live RSF execution steps. | This tombstone clearly marks the scenario as deprecated, contains no live RSF validation steps, and the source grep shows `getAdaptiveWeights(...)` plus the single-pass `fusionLists` -> `fuseResultsMulti(...)` live path | Saved `rg` output plus the current tombstone text and linked catalog tombstone reference | PASS if the tombstone is clearly a retirement note, contains no active RSF runtime test steps, and the source-only check confirms the live path stays on single-pass RRF; FAIL if it still instructs operators to validate live RSF behavior or if the single-pass RRF anchors are missing | If active-runtime wording reappears, keep it out of the active playbook index and leave this tombstone as the deprecation record. If the source grep fails, inspect `mcp_server/lib/search/hybrid-search.ts` and `shared/algorithms/adaptive-fusion.ts` for a fusion-path regression before updating the tombstone |

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02-relative-score-fusion-in-shadow-mode [deprecated]](../../feature_catalog/12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md)

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 034
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/_deprecated/034-relative-score-fusion-in-shadow-mode-r14-n1.md`
