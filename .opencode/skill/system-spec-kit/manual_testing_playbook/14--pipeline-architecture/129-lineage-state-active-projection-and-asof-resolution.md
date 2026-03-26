---
title: "129 -- Lineage state active projection and asOf resolution"
description: "This scenario validates Lineage state active projection and asOf resolution for `129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution."
---

# 129 -- Lineage state active projection and asOf resolution

## 1. OVERVIEW

This scenario validates Lineage state active projection and asOf resolution for `129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `129` and confirm the expected signals without contradicting evidence.

- Objective: Verify append-first lineage projection, deterministic `asOf` resolution, and timestamp ordering across non-ISO or timezone variants
- Prompt: `Run the lineage state verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows active projection selection, deterministic asOf resolution, malformed-chain detection, and predecessor timestamp comparisons succeeding for non-ISO or timezone variants because validation uses parsed epoch values instead of raw strings. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants
- Pass/fail: PASS if `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 129 | Lineage state active projection and asOf resolution | Verify append-first lineage projection, deterministic `asOf` resolution, and timestamp ordering across non-ISO or timezone variants | `Run the lineage state verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows active projection selection, deterministic asOf resolution, malformed-chain detection, and predecessor timestamp comparisons succeeding for non-ISO or timezone variants because validation uses parsed epoch values instead of raw strings. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npm test -- --run tests/memory-lineage-state.vitest.ts` 3) Inspect the output for active projection, `asOf`, integrity failure coverage, and timestamp-order coverage for variant date formats | Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants | Test transcript + suite summary | PASS if `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons | Re-run `npm test -- --run tests/memory-lineage-state.vitest.ts -t asOf`; inspect `validateTransitionInput()` in `lib/storage/lineage-state.ts` and `lib/search/vector-index-schema.ts` if projection or timestamp assertions drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 129
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/129-lineage-state-active-projection-and-asof-resolution.md`
