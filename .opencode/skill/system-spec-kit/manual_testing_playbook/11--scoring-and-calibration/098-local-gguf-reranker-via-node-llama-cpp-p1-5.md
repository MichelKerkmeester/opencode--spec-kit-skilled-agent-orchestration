---
title: "098 -- Local GGUF reranker via node-llama-cpp (P1-5)"
description: "This scenario validates Local GGUF reranker via node-llama-cpp (P1-5) for `098`. It focuses on Confirm reranker gating and graceful fallback."
audited_post_018: true
---

# 098 -- Local GGUF reranker via node-llama-cpp (P1-5)

## 1. OVERVIEW

This scenario validates Local GGUF reranker via node-llama-cpp (P1-5) for `098`. It focuses on Confirm reranker gating and graceful fallback.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm reranker gating and graceful fallback.
- Real user request: `Please validate Local GGUF reranker via node-llama-cpp (P1-5) against RERANKER_LOCAL=1 and tell me whether the expected signals are present: Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; getRerankerStatus() reports cache hits/misses/staleHits/evictions with bounded p95 latency; applyLengthPenalty does not change scores; scoring runs sequentially in logs.`
- RCAF Prompt: `As a scoring validation operator, validate Local GGUF reranker via node-llama-cpp (P1-5) against RERANKER_LOCAL=1. Verify reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; getRerankerStatus() reports cache hits/misses/staleHits/evictions with bounded p95 latency; applyLengthPenalty remains compatibility-only and does not change scores; scoring runs sequentially in logs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; getRerankerStatus() reports cache hits/misses/staleHits/evictions with bounded p95 latency; applyLengthPenalty does not change scores; scoring runs sequentially in logs
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if strict `=== 'true'` check works, custom model lowers threshold, telemetry fields are exposed, length penalty is neutral, and scoring is sequential

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm reranker gating and graceful fallback against RERANKER_LOCAL=1. Verify reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; getRerankerStatus() reports cache hits/misses/staleHits/evictions with bounded p95 latency; applyLengthPenalty remains compatibility-only and does not change scores; scoring runs sequentially in logs. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. set `RERANKER_LOCAL=1` (truthy but not `'true'`) → verify reranker is NOT activated (strict string equality)
2. set `RERANKER_LOCAL=true` without model file → verify silent fallback
3. set `SPECKIT_RERANKER_MODEL=/custom/path` → verify the custom-model threshold applies at 2GB instead of the default 8GB
4. invoke `getRerankerStatus()` across cold and warm rerank calls → verify `hits`, `misses`, `staleHits`, `evictions`, and bounded p95 latency are populated coherently
5. toggle `applyLengthPenalty` across identical rerank inputs → verify the option stays compatibility-only and does not change scores
6. with valid model, verify sequential scoring (not parallel) in logs

### Expected

Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; getRerankerStatus() reports cache hits/misses/staleHits/evictions with bounded p95 latency; applyLengthPenalty does not change scores; scoring runs sequentially in logs

### Evidence

Reranker log output + fallback behavior + `getRerankerStatus()` snapshots

### Pass / Fail

- **Pass**: strict `=== 'true'` check works, custom model lowers threshold, telemetry fields are exposed, length penalty is neutral, and scoring is sequential
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `lib/search/local-reranker.ts` for `canUseLocalReranker()` and `rerankLocal()`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md](../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 098
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md`
