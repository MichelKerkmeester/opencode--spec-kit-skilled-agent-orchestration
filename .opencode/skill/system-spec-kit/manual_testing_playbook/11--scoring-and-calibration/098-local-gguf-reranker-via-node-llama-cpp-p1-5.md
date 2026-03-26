---
title: "098 -- Local GGUF reranker via node-llama-cpp (P1-5)"
description: "This scenario validates Local GGUF reranker via node-llama-cpp (P1-5) for `098`. It focuses on Confirm reranker gating and graceful fallback."
---

# 098 -- Local GGUF reranker via node-llama-cpp (P1-5)

## 1. OVERVIEW

This scenario validates Local GGUF reranker via node-llama-cpp (P1-5) for `098`. It focuses on Confirm reranker gating and graceful fallback.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `098` and confirm the expected signals without contradicting evidence.

- Objective: Confirm reranker gating and graceful fallback
- Prompt: `Validate RERANKER_LOCAL strict check and memory thresholds. Capture the evidence needed to prove Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; scoring runs sequentially in logs. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; scoring runs sequentially in logs
- Pass/fail: PASS if strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 098 | Local GGUF reranker via node-llama-cpp (P1-5) | Confirm reranker gating and graceful fallback | `Validate RERANKER_LOCAL strict check and memory thresholds. Capture the evidence needed to prove Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; scoring runs sequentially in logs. Return a concise user-facing pass/fail verdict with the main reason.` | 1) set `RERANKER_LOCAL=1` (truthy but not `'true'`) → verify reranker is NOT activated (strict string equality) 2) set `RERANKER_LOCAL=true` without model file → verify silent fallback 3) set `SPECKIT_RERANKER_MODEL=/custom/path` → verify the custom-model threshold applies at 2GB instead of the default 8GB 4) with valid model, verify sequential scoring (not parallel) in logs | Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; scoring runs sequentially in logs | Reranker log output + fallback behavior | PASS if strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential | Check `lib/search/local-reranker.ts` for `canUseLocalReranker()` and `rerankLocal()` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md](../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 098
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md`
