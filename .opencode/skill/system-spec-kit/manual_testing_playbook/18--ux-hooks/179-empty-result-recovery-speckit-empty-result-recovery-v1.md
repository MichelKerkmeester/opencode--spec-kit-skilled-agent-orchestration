---
title: "179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1)"
description: "This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results."
---

# 179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1)

## 1. OVERVIEW

This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results.

---

## 2. SCENARIO CONTRACT


- Objective: Verify structured recovery payloads for empty/weak search results.
- Real user request: `Please validate Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) against SPECKIT_EMPTY_RESULT_RECOVERY_V1 and tell me whether the expected signals are present: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3.`
- RCAF Prompt: `As a runtime-hook validation operator, validate Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) against SPECKIT_EMPTY_RESULT_RECOVERY_V1. Verify structured recovery payloads for empty/weak search results. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 3 recovery statuses generate structured payloads with root cause, actions, and alternative queries; FAIL if any status missing, payloads lack required fields, or recovery not triggered at correct thresholds

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify structured recovery payloads for empty/weak search results against SPECKIT_EMPTY_RESULT_RECOVERY_V1. Verify recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_EMPTY_RESULT_RECOVERY_V1` is unset or `true`
2. `memory_search({ query: "completely nonexistent topic xyzzy" })` — triggers no_results
3. Search for vague/low-signal query — triggers low_confidence
4. Search with narrow specFolder filter — triggers partial
5. Inspect recovery payload for each: status, reason, actions, alternative queries

### Expected

Recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3

### Evidence

Recovery payload JSON per status + root cause + action list + alternative queries + test transcript

### Pass / Fail

- **Pass**: all 3 statuses produce structured payloads with reason, actions, and alternatives
- **Fail**: status missing, payload fields incomplete, or thresholds incorrect

### Failure Triage

Verify recovery-payload.ts module loaded → Confirm flag is not forced off → Check DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4 → Verify PARTIAL_RESULT_MIN=3 → Inspect reason inference logic → Check alternative query generation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/18-empty-result-recovery.md](../../feature_catalog/18--ux-hooks/18-empty-result-recovery.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/recovery-payload.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 179
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/179-empty-result-recovery-speckit-empty-result-recovery-v1.md`
- audited_post_018: true
