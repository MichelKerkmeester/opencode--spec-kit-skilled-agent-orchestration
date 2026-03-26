---
title: "231 -- Inert scoring flags and compatibility shims"
description: "This scenario validates Inert scoring flags and compatibility shims for `231`. It focuses on confirming retired scoring controls stay inert while legacy graph-flag imports only forward into newer rollout logic."
---

# 231 -- Inert scoring flags and compatibility shims

## 1. OVERVIEW

This scenario validates Inert scoring flags and compatibility shims for `231`. It focuses on confirming retired scoring controls stay inert while legacy graph-flag imports only forward into newer rollout logic.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `231` and confirm the expected signals without contradicting evidence.

- Objective: Confirm retired scoring controls stay inert while legacy graph-flag imports only forward into newer rollout logic
- Prompt: `Validate that retired scoring controls remain compatibility shims: novelty boost stays permanently inert and legacy graph-flag helpers only forward to the newer rollout resolver. Run the targeted checks, capture the evidence that proves the old controls cannot re-enable a deprecated path, and return a concise pass/fail verdict with the main reason.`
- Expected signals: The targeted scoring and rollout tests pass, `calculateNoveltyBoost()` always returns `0`, novelty telemetry stays disabled, and `getGraphWalkRolloutState()` continues to mirror `resolveGraphWalkRolloutState()` instead of restoring separate legacy flag behavior
- Pass/fail: PASS if the targeted checks prove novelty boost is inert and the graph-flag module acts only as a compatibility shim over the newer rollout logic

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 231 | Inert scoring flags and compatibility shims | Confirm retired scoring controls stay inert while legacy graph-flag imports only forward into newer rollout logic | `Validate that retired scoring controls remain compatibility shims: novelty boost stays permanently inert and legacy graph-flag helpers only forward to the newer rollout resolver. Run the targeted checks, capture the evidence that proves the old controls cannot re-enable a deprecated path, and return a concise pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npx vitest run tests/cold-start.vitest.ts tests/search-flags.vitest.ts tests/scoring-observability.vitest.ts` 3) `sed -n '470,530p' lib/scoring/composite-scoring.ts` 4) `sed -n '1,120p' lib/search/graph-flags.ts` 5) `rg -n "SPECKIT_NOVELTY_BOOST|calculateNoveltyBoost|getGraphWalkRolloutState|resolveGraphWalkRolloutState" lib/scoring/composite-scoring.ts lib/search/graph-flags.ts lib/search/search-flags.ts tests/cold-start.vitest.ts tests/search-flags.vitest.ts tests/scoring-observability.vitest.ts` | The targeted scoring and rollout tests pass, `calculateNoveltyBoost()` always returns `0`, novelty telemetry stays disabled, and `getGraphWalkRolloutState()` continues to mirror `resolveGraphWalkRolloutState()` instead of restoring separate legacy flag behavior | Vitest transcript plus the source excerpts showing inert novelty boost logic and forwarded graph-walk rollout helpers | PASS if the targeted checks prove novelty boost is inert and the graph-flag module acts only as a compatibility shim over the newer rollout logic | Inspect `lib/scoring/composite-scoring.ts`, `lib/search/graph-flags.ts`, and `lib/search/search-flags.ts`; confirm test env setup is not leaking rollout variables across cases |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md](../../feature_catalog/21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 231
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `21--implement-and-remove-deprecated-features/231-inert-scoring-flags.md`
