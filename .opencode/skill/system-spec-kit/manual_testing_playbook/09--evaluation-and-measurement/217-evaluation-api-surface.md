---
title: "217 -- Evaluation API Surface"
description: "This scenario validates Evaluation API Surface for `217`. It focuses on verifying the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path."
---

# 217 -- Evaluation API Surface

## 1. OVERVIEW

This scenario validates Evaluation API Surface for `217`. It focuses on verifying the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path.
- Real user request: `` Please validate Evaluation API Surface against mcp_server/api/eval.ts and tell me whether the expected signals are present: `mcp_server/api/eval.ts` exposes ablation exports, BM25 baseline exports, `loadGroundTruth`, and `initEvalDb`; downstream consumers can use one stable import path; the file adds no local wrapper or transformation logic. ``
- RCAF Prompt: `As an evaluation validation operator, validate Evaluation API Surface against mcp_server/api/eval.ts. Verify the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `mcp_server/api/eval.ts` exposes ablation exports, BM25 baseline exports, `loadGroundTruth`, and `initEvalDb`; downstream consumers can use one stable import path; the file adds no local wrapper or transformation logic
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the public facade exposes the full evaluation contract from one import path and remains a pure pass-through re-export layer; FAIL if required evaluation exports are missing, consumers must import internal modules directly, or facade-local behavior appears

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, verify the stable public facade exposes ablation, BM25 baseline, ground-truth loading, and eval DB setup through one approved import path against mcp_server/api/eval.ts. Verify mcp_server/api/eval.ts exposes ablation exports, BM25 baseline exports, loadGroundTruth, and initEvalDb; downstream consumers can use one stable import path; the file adds no local wrapper or transformation logic. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect `mcp_server/api/eval.ts` and capture the full export list
2. Compare the facade exports against `mcp_server/lib/eval/ablation-framework.ts`, `mcp_server/lib/eval/bm25-baseline.ts`, `mcp_server/lib/eval/ground-truth-generator.ts`, and `mcp_server/lib/eval/eval-db.ts`
3. Run an import smoke test or script-level check that consumes the exported symbols from `mcp_server/api/eval` only
4. Confirm the facade contains no local wrappers, validation, or transformation logic

### Expected

`mcp_server/api/eval.ts` exposes ablation exports, BM25 baseline exports, `loadGroundTruth`, and `initEvalDb`; downstream consumers can use one stable import path; the file adds no local wrapper or transformation logic

### Evidence

Export-list capture from `api/eval.ts` + comparison notes against internal modules + import smoke-test transcript or equivalent script evidence + snippet proving the facade is re-export only

### Pass / Fail

- **Pass**: the public facade exposes the full evaluation contract from one import path and remains a pure pass-through re-export layer
- **Fail**: required evaluation exports are missing, consumers must import internal modules directly, or facade-local behavior appears

### Failure Triage

Check for missing re-exports in `mcp_server/api/eval.ts` -> verify the internal eval module symbol names still match the facade export list -> inspect recent script imports for drift back to `lib/eval/*` paths -> confirm no local implementation was added to the facade

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/15-evaluation-api-surface.md](../../feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 217
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/217-evaluation-api-surface.md`
- audited_post_018: true
