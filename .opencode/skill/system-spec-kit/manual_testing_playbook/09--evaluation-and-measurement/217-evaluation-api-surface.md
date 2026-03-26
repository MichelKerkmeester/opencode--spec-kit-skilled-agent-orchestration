---
title: "217 -- Evaluation API Surface"
description: "This scenario validates Evaluation API Surface for `217`. It focuses on verifying the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path."
---

# 217 -- Evaluation API Surface

## 1. OVERVIEW

This scenario validates Evaluation API Surface for `217`. It focuses on verifying the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `217` and confirm the expected signals without contradicting evidence.

- Objective: Verify the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path
- Prompt: `Validate the evaluation API surface. Capture the evidence needed to prove scripts can import ablation helpers, BM25 baseline helpers, ground-truth loading, and evaluation DB initialization from \`mcp_server/api/eval\` without reaching into internal \`lib/eval/*\` modules, and that the facade remains a pure re-export boundary. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `mcp_server/api/eval.ts` exposes ablation exports, BM25 baseline exports, `loadGroundTruth`, and `initEvalDb`; downstream consumers can use one stable import path; the file adds no local wrapper or transformation logic
- Pass/fail: PASS if the public facade exposes the full evaluation contract from one import path and remains a pure pass-through re-export layer; FAIL if required evaluation exports are missing, consumers must import internal modules directly, or facade-local behavior appears

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 217 | Evaluation API Surface | Verify the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path | `Validate the evaluation API surface. Capture the evidence needed to prove scripts can import ablation helpers, BM25 baseline helpers, ground-truth loading, and evaluation DB initialization from \`mcp_server/api/eval\` without reaching into internal \`lib/eval/*\` modules, and that the facade remains a pure re-export boundary. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect `mcp_server/api/eval.ts` and capture the full export list 2) Compare the facade exports against `mcp_server/lib/eval/ablation-framework.ts`, `mcp_server/lib/eval/bm25-baseline.ts`, `mcp_server/lib/eval/ground-truth-generator.ts`, and `mcp_server/lib/eval/eval-db.ts` 3) Run an import smoke test or script-level check that consumes the exported symbols from `mcp_server/api/eval` only 4) Confirm the facade contains no local wrappers, validation, or transformation logic | `mcp_server/api/eval.ts` exposes ablation exports, BM25 baseline exports, `loadGroundTruth`, and `initEvalDb`; downstream consumers can use one stable import path; the file adds no local wrapper or transformation logic | Export-list capture from `api/eval.ts` + comparison notes against internal modules + import smoke-test transcript or equivalent script evidence + snippet proving the facade is re-export only | PASS if the public facade exposes the full evaluation contract from one import path and remains a pure pass-through re-export layer; FAIL if required evaluation exports are missing, consumers must import internal modules directly, or facade-local behavior appears | Check for missing re-exports in `mcp_server/api/eval.ts` -> verify the internal eval module symbol names still match the facade export list -> inspect recent script imports for drift back to `lib/eval/*` paths -> confirm no local implementation was added to the facade |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/15-evaluation-api-surface.md](../../feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 217
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/217-evaluation-api-surface.md`
