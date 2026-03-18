---
title: "NEW-129 -- Lineage state active projection and asOf resolution"
description: "This scenario validates Lineage state active projection and asOf resolution for `NEW-129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution."
---

# NEW-129 -- Lineage state active projection and asOf resolution

## 1. OVERVIEW

This scenario validates Lineage state active projection and asOf resolution for `NEW-129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-129` and confirm the expected signals without contradicting evidence.

- Objective: Verify append-first lineage projection and deterministic `asOf` resolution
- Prompt: `Run the lineage state verification suite.`
- Expected signals: Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, and malformed-chain detection
- Pass/fail: PASS if `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-129 | Lineage state active projection and asOf resolution | Verify append-first lineage projection and deterministic `asOf` resolution | `Run the lineage state verification suite.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npm test -- --run tests/memory-lineage-state.vitest.ts` 3) Inspect the output for active projection, `asOf`, and integrity failure coverage | Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, and malformed-chain detection | Test transcript + suite summary | PASS if `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases | Re-run `npm test -- --run tests/memory-lineage-state.vitest.ts -t asOf`; inspect `lib/storage/lineage-state.ts` and `lib/search/vector-index-schema.ts` if projection or integrity assertions drift |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-129
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/129-lineage-state-active-projection-and-asof-resolution.md`
