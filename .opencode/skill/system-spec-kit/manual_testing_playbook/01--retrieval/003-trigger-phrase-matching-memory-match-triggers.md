---
title: "EX-003 -- Trigger phrase matching (memory_match_triggers)"
description: "This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path."
---

# EX-003 -- Trigger phrase matching (memory_match_triggers)

## 1. OVERVIEW

This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path plus trigger-cache reload efficiency.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-003` and confirm the expected signals without contradicting evidence.

- Objective: Fast recall path plus trigger-cache reload efficiency
- Prompt: `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment, trigger-cache reload reads from the partial index source (`idx_trigger_cache_source`), and repeated reloads on the same DB connection reuse the prepared loader statement. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse
- Pass/fail: PASS if matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection. FAIL if trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-003 | Trigger phrase matching (memory_match_triggers) | Fast recall path plus trigger-cache reload efficiency | `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment, trigger-cache reload reads from the partial index source (`idx_trigger_cache_source`), and repeated reloads on the same DB connection reuse the prepared loader statement. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` and capture the returned matches 2) In a debug harness or test shell on the same SQLite connection, call `refreshTriggerCache()` or clear+reload the trigger cache twice 3) Capture query-plan, schema, or instrumentation evidence that the reload source is constrained to successful rows with non-empty `trigger_phrases` and backed by `idx_trigger_cache_source` 4) Confirm the second reload on the same DB connection reuses the cached prepared loader statement instead of preparing a new one | Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse | Trigger output + cache-refresh logs or instrumentation + query-plan/schema evidence for `idx_trigger_cache_source` | PASS if matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection. FAIL if trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement. | Retry with higher-quality trigger phrase -> inspect trigger-cache clear/reload instrumentation -> verify `idx_trigger_cache_source` exists and the reload query still filters to successful rows with non-empty trigger phrases |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md`
