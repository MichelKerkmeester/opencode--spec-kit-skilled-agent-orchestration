---
title: "118 -- Stage-2 score field synchronization (P0-8)"
description: "This scenario validates Stage-2 score field synchronization (P0-8) for `118`. It focuses on Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting."
audited_post_018: true
---

# 118 -- Stage-2 score field synchronization (P0-8)

## 1. OVERVIEW

This scenario validates Stage-2 score field synchronization (P0-8) for `118`. It focuses on Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting.

---

## 2. SCENARIO CONTRACT


- Objective: Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting.
- Real user request: `Please validate Stage-2 score field synchronization (P0-8) against memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true }) and tell me whether the expected signals are present: intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value.`
- RCAF Prompt: `As a scoring validation operator, validate Stage-2 score field synchronization (P0-8) against memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true }). Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if intentAdjustedScore is synchronized with score via bounded clamping (equality sync with Math.max/Math.min bounds) and resolveEffectiveScore returns the correct final value

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting against memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true }). Verify intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** Memory database with varied content.
2. Call `memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true })` targeting non-hybrid flow
3. Inspect trace: verify `intentAdjustedScore` is set at Step 4
4. Verify subsequent artifact routing and feedback signals modify `score`
5. Verify final `intentAdjustedScore >= score` (Math.max sync applied)
6. Verify `resolveEffectiveScore()` returns the synchronized value

### Expected

intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value

### Evidence

Search trace output showing score field progression through pipeline stages

### Pass / Fail

- **Pass**: intentAdjustedScore is synchronized with score via Math.max and resolveEffectiveScore returns the correct final value
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect stage-2 intent weighting logic; verify Math.max sync placement; check resolveEffectiveScore fallback chain for non-hybrid flow

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 118
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md`
