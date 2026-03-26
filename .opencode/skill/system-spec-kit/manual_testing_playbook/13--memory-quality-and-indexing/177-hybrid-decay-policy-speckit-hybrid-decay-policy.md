---
title: "177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)"
description: "This scenario validates hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) for `177` with executable source checks and targeted Vitest coverage for the default-on no-decay policy."
---

# 177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)

## 1. OVERVIEW

This scenario validates hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) for `177`. It focuses on the default-on graduated rollout and verifies the type-aware no-decay policy for `decision`, `constitutional`, and `critical` context types with executable source checks and regression tests.

---

## 2. CURRENT REALITY

Operators confirm the hybrid-decay symbols are present in the implementing code, then rerun the targeted Vitest files that cover flag gating, no-decay classification, Infinity stability, and separation from TM-03.

- Objective: Verify type-aware no-decay FSRS policy for decision/constitutional/critical types
- Prompt: `Test the default-on SPECKIT_HYBRID_DECAY_POLICY behavior. Confirm the implementing symbols exist in the expected code, rerun the hybrid-decay regression tests, and verify that decision, constitutional, and critical context types resolve to no-decay while other types stay on the standard FSRS schedule. Return a concise pass/fail verdict with the first failing symbol or test if anything breaks.`
- Expected signals: `rg` finds `SPECKIT_HYBRID_DECAY_POLICY`, `HYBRID_NO_DECAY_CONTEXT_TYPES`, `classifyHybridDecay`, `getHybridDecayMultiplier`, `applyHybridDecayPolicy`, `calculateRetrievability`, and the central `isHybridDecayPolicyEnabled()` accessor; the Vitest run exits 0; the current baseline summary is `Test Files 2 passed (2)` and `Tests 30 passed (30)`.
- Pass/fail: PASS if the expected symbols are present and the targeted Vitest run exits 0 with no failed tests. FAIL if any symbol is missing, protected types do not map to Infinity/no-decay, or the test run fails.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | Verify type-aware no-decay FSRS policy for decision/constitutional/critical types | `Test the default-on SPECKIT_HYBRID_DECAY_POLICY behavior. Confirm the implementing symbols exist in the expected code, rerun the hybrid-decay regression tests, and verify that decision, constitutional, and critical context types resolve to no-decay while other types stay on the standard FSRS schedule. Return a concise pass/fail verdict with the first failing symbol or test if anything breaks.` | 1) `rg -n "SPECKIT_HYBRID_DECAY_POLICY|SPECKIT_CLASSIFICATION_DECAY|HYBRID_NO_DECAY_CONTEXT_TYPES|classifyHybridDecay|getHybridDecayMultiplier|applyHybridDecayPolicy|calculateRetrievability|isHybridDecayPolicyEnabled" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`<br>2) `cd .opencode/skill/system-spec-kit/mcp_server && node ./node_modules/vitest/vitest.mjs run tests/hybrid-decay-policy.vitest.ts tests/fsrs-hybrid-decay.vitest.ts` | Source grep returns matches for the flag gate, no-decay set, classifier, multiplier, policy application, and FSRS retrievability helpers; Vitest reports both files passing and no `FAIL` lines; current baseline summary is `Test Files 2 passed (2)` and `Tests 30 passed (30)` | Saved `rg` output plus the final Vitest summary showing both files passed | PASS if the `rg` command returns all expected symbols and the Vitest command exits 0 with zero failed files/tests. FAIL if any symbol is missing, the no-decay mapping is absent, or either target test file fails. | If the source grep misses a symbol, inspect `mcp_server/lib/cognitive/fsrs-scheduler.ts` or `mcp_server/lib/search/search-flags.ts`. If Vitest fails, use `hybrid-decay-policy.vitest.ts` for default-on flag behavior, type classification, Infinity stability, and TM-03 separation, and `fsrs-hybrid-decay.vitest.ts` for the lower-level no-decay multiplier and routing checks. |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/23-hybrid-decay-policy.md](../../feature_catalog/13--memory-quality-and-indexing/23-hybrid-decay-policy.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source files: `mcp_server/lib/cognitive/fsrs-scheduler.ts`, `mcp_server/lib/search/search-flags.ts`
- Regression tests: `mcp_server/tests/hybrid-decay-policy.vitest.ts`, `mcp_server/tests/fsrs-hybrid-decay.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 177
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/177-hybrid-decay-policy-speckit-hybrid-decay-policy.md`
