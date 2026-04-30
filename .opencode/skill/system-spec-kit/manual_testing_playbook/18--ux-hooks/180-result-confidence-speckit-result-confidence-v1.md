---
title: "180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE_V1)"
description: "This scenario validates result confidence scoring (SPECKIT_RESULT_CONFIDENCE_V1) for `180`. It focuses on the default-on graduated rollout and verifying per-result calibrated confidence with 4-factor weighting."
---

# 180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE_V1)

## 1. OVERVIEW

This scenario validates result confidence scoring (SPECKIT_RESULT_CONFIDENCE_V1) for `180`. It focuses on the default-on graduated rollout and verifying per-result calibrated confidence with 4-factor weighting.

---

## 2. SCENARIO CONTRACT


- Objective: Verify per-result calibrated confidence with 4-factor weighting.
- Real user request: `Please validate Result confidence (SPECKIT_RESULT_CONFIDENCE_V1) against SPECKIT_RESULT_CONFIDENCE_V1 and tell me whether the expected signals are present: 4 factors: margin 0.35, channel agreement 0.30, reranker support 0.20, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers: large_margin, multi_channel_agreement, reranker_boost, anchor_density; requestQuality: good/weak/gap; heuristic only (no LLM).`
- RCAF Prompt: `As a runtime-hook validation operator, validate Result confidence (SPECKIT_RESULT_CONFIDENCE_V1) against SPECKIT_RESULT_CONFIDENCE_V1. Verify 4 factors: margin 0.35, channel agreement 0.30, reranker support 0.20, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers: large_margin, multi_channel_agreement, reranker_boost, anchor_density; requestQuality: good/weak/gap; heuristic only (no LLM). Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 4 factors: margin 0.35, channel agreement 0.30, reranker support 0.20, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers: large_margin, multi_channel_agreement, reranker_boost, anchor_density; requestQuality: good/weak/gap; heuristic only (no LLM)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if per-result confidence uses 4-factor heuristic weighting (margin/channel/reranker/anchor) blended with a score-prior calibration term, labels match thresholds, and drivers are reported; FAIL if heuristic factors missing, thresholds wrong, labels missing, or LLM called in hot path

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify per-result calibrated confidence with 4-factor weighting against SPECKIT_RESULT_CONFIDENCE_V1. Verify per-result confidence score computed; 4 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_RESULT_CONFIDENCE_V1` is unset or `true`
2. `memory_search({ query: "well-covered topic with multiple memories" })`
3. Inspect per-result confidence scores and labels
4. Verify 4-factor weights: margin=0.35, channel_agreement=0.30, reranker=0.20, anchor_density=0.15
5. Check confidence drivers reported per result
6. Verify labels: score >= 0.7 → high, < 0.4 → low, else → medium
7. Confirm requestQuality label (good/weak/gap)

### Expected

Per-result confidence score computed; 4 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM

### Evidence

Per-result confidence output + factor breakdown + label assignments + driver lists + requestQuality + test transcript

### Pass / Fail

- **Pass**: 4-factor weighted confidence produces correct scores, labels match thresholds, and drivers reported
- **Fail**: weights wrong, thresholds incorrect, labels missing, or LLM used

### Failure Triage

Verify confidence-scoring.ts module loaded → Confirm flag is not forced off → Check factor weights (0.35/0.30/0.20/0.15) → Inspect HIGH_THRESHOLD=0.7 and LOW_THRESHOLD=0.4 → Verify driver detection logic → Check requestQuality computation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/19-result-confidence.md](../../feature_catalog/18--ux-hooks/19-result-confidence.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/confidence-scoring.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 180
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/180-result-confidence-speckit-result-confidence-v1.md`
- audited_post_018: true
