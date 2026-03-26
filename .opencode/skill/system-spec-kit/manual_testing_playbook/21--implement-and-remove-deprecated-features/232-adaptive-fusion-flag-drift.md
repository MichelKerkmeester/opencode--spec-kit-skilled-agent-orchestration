---
title: "232 -- Adaptive-fusion flag drift"
description: "This scenario validates Adaptive-fusion flag drift for `232`. It focuses on confirming live hybrid search always applies adaptive fusion while the install guide still documents a stale disable switch."
---

# 232 -- Adaptive-fusion flag drift

## 1. OVERVIEW

This scenario validates Adaptive-fusion flag drift for `232`. It focuses on confirming live hybrid search always applies adaptive fusion while the install guide still documents a stale disable switch.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `232` and confirm the expected signals without contradicting evidence.

- Objective: Confirm live hybrid search always applies adaptive fusion while the install guide still documents a stale disable switch
- Prompt: `Validate that live hybrid search still applies adaptive fusion regardless of the documented SPECKIT_ADAPTIVE_FUSION disable guidance, then compare that runtime behavior against the install guide text. Run the targeted checks, capture the implementation and documentation evidence, and return a concise pass/fail verdict with the main reason.`
- Expected signals: The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path always calls `hybridAdaptiveFuse(...)` without a flag gate in `hybrid-search.ts`, and `INSTALL_GUIDE.md` still documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch
- Pass/fail: PASS if the targeted checks prove adaptive fusion stays active in the live runtime path while the install guide still reflects stale flag-toggle guidance

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 232 | Adaptive-fusion flag drift | Confirm live hybrid search always applies adaptive fusion while the install guide still documents a stale disable switch | `Validate that live hybrid search still applies adaptive fusion regardless of the documented SPECKIT_ADAPTIVE_FUSION disable guidance, then compare that runtime behavior against the install guide text. Run the targeted checks, capture the implementation and documentation evidence, and return a concise pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npx vitest run tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts` 3) `sed -n '985,1015p' lib/search/hybrid-search.ts` 4) `rg -n "SPECKIT_ADAPTIVE_FUSION" INSTALL_GUIDE.md` 5) `rg -n "hybridAdaptiveFuse" lib/search/hybrid-search.ts tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts` | The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path always calls `hybridAdaptiveFuse(...)` without a flag gate in `hybrid-search.ts`, and `INSTALL_GUIDE.md` still documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch | Vitest transcript plus the runtime-source excerpt and the install-guide lines that still advertise the stale flag behavior | PASS if the targeted checks prove adaptive fusion stays active in the live runtime path while the install guide still reflects stale flag-toggle guidance | Inspect `lib/search/hybrid-search.ts` and `INSTALL_GUIDE.md`; confirm the checked-in docs match the tested source tree and that no alternate fusion gate was introduced elsewhere in the pipeline |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/05-adaptive-fusion-flag-drift.md](../../feature_catalog/21--implement-and-remove-deprecated-features/05-adaptive-fusion-flag-drift.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 232
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `21--implement-and-remove-deprecated-features/232-adaptive-fusion-flag-drift.md`
