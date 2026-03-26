---
title: "179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1)"
description: "This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results."
---

# 179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1)

## 1. OVERVIEW

This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `179` and confirm the expected signals without contradicting evidence.

- Objective: Verify structured recovery payloads for empty/weak search results
- Prompt: `Test the default-on SPECKIT_EMPTY_RESULT_RECOVERY_V1 behavior. Trigger all 3 recovery statuses: no_results (search returning zero results), low_confidence (results below DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4), and partial (fewer than PARTIAL_RESULT_MIN=3 results). Verify each status includes root cause reasons, suggested actions, and alternative queries. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3
- Pass/fail: PASS if all 3 recovery statuses generate structured payloads with root cause, actions, and alternative queries; FAIL if any status missing, payloads lack required fields, or recovery not triggered at correct thresholds

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 179 | Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) | Verify structured recovery payloads for empty/weak search results | `Test the default-on SPECKIT_EMPTY_RESULT_RECOVERY_V1 behavior. Trigger all 3 recovery statuses and verify structured payloads. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_EMPTY_RESULT_RECOVERY_V1` is unset or `true` 2) `memory_search({ query: "completely nonexistent topic xyzzy" })` — triggers no_results 3) Search for vague/low-signal query — triggers low_confidence 4) Search with narrow specFolder filter — triggers partial 5) Inspect recovery payload for each: status, reason, actions, alternative queries | Recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3 | Recovery payload JSON per status + root cause + action list + alternative queries + test transcript | PASS if all 3 statuses produce structured payloads with reason, actions, and alternatives; FAIL if status missing, payload fields incomplete, or thresholds incorrect | Verify recovery-payload.ts module loaded → Confirm flag is not forced off → Check DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4 → Verify PARTIAL_RESULT_MIN=3 → Inspect reason inference logic → Check alternative query generation |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/18-empty-result-recovery.md](../../feature_catalog/18--ux-hooks/18-empty-result-recovery.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/recovery-payload.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 179
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/179-empty-result-recovery-speckit-empty-result-recovery-v1.md`
