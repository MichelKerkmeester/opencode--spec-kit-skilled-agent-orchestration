---
title: "230 -- Shadow-scoring retirement"
description: "This scenario validates Shadow-scoring retirement for `230`. It focuses on confirming runtime shadow scoring and persistence stay retired while read-only comparison helpers remain usable."
---

# 230 -- Shadow-scoring retirement

## 1. OVERVIEW

This scenario validates Shadow-scoring retirement for `230`. It focuses on confirming runtime shadow scoring and persistence stay retired while read-only comparison helpers remain usable.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `230` and confirm the expected signals without contradicting evidence.

- Objective: Confirm runtime shadow scoring and persistence stay retired while read-only comparison helpers remain usable
- Prompt: `Validate that shadow-scoring execution and persistence remain retired even when the legacy flag is set, while comparison and historical stats helpers stay safe to call. Run the targeted checks, capture the evidence that proves the runtime path is shut off, and return a concise pass/fail verdict with the main reason.`
- Expected signals: The targeted shadow-scoring tests pass, `runShadowScoring()` returns `null`, `logShadowComparison()` returns `false`, `getShadowStats()` stays in the zero-case when no historical rows exist, and `compareShadowResults()` remains available as the live analysis surface
- Pass/fail: PASS if the targeted checks prove runtime execution and write paths are retired while comparison and historical read helpers remain intact

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 230 | Shadow-scoring retirement | Confirm runtime shadow scoring and persistence stay retired while read-only comparison helpers remain usable | `Validate that shadow-scoring execution and persistence remain retired even when the legacy flag is set, while comparison and historical stats helpers stay safe to call. Run the targeted checks, capture the evidence that proves the runtime path is shut off, and return a concise pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npx vitest run tests/shadow-scoring.vitest.ts tests/mpab-quality-gate-integration.vitest.ts` 3) `sed -n '230,420p' lib/eval/shadow-scoring.ts` 4) `rg -n "runShadowScoring|logShadowComparison|getShadowStats|compareShadowResults|SPECKIT_SHADOW_SCORING" lib/eval/shadow-scoring.ts tests/shadow-scoring.vitest.ts tests/mpab-quality-gate-integration.vitest.ts` | The targeted shadow-scoring tests pass, `runShadowScoring()` returns `null`, `logShadowComparison()` returns `false`, `getShadowStats()` stays in the zero-case when no historical rows exist, and `compareShadowResults()` remains available as the live analysis surface | Vitest transcript plus the source excerpts showing the retired runtime/write paths and the retained comparison helpers | PASS if the targeted checks prove runtime execution and write paths are retired while comparison and historical read helpers remain intact | Inspect `lib/eval/shadow-scoring.ts`; confirm the test sandbox DB path is isolated; verify no environment leakage or stale eval DB state is affecting the results |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/03-shadow-scoring-retirement.md](../../feature_catalog/21--implement-and-remove-deprecated-features/03-shadow-scoring-retirement.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 230
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `21--implement-and-remove-deprecated-features/230-shadow-scoring-retirement.md`
