---
title: "EX-003 -- Trigger phrase matching (memory_match_triggers)"
description: "This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path."
audited_post_018: true
---

# EX-003 -- Trigger phrase matching (memory_match_triggers)

## 1. OVERVIEW

This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path plus trigger-cache reload efficiency.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-003` and confirm the expected signals without contradicting evidence.

- Objective: Fast recall path plus trigger-cache reload efficiency
- Prompt: `As a retrieval validation operator, validate Trigger phrase matching (memory_match_triggers) against memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003). Verify fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse
- Pass/fail: PASS if matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection. FAIL if trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement.

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, validate Fast recall path plus trigger-cache reload efficiency against memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003). Verify fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` and capture the returned matches
2. In a debug harness or test shell on the same SQLite connection, call `refreshTriggerCache()` or clear+reload the trigger cache twice
3. Capture query-plan, schema, or instrumentation evidence that the reload source is constrained to successful rows with non-empty `trigger_phrases` and backed by `idx_trigger_cache_source`
4. Confirm the second reload on the same DB connection reuses the cached prepared loader statement instead of preparing a new one

### Expected

Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse

### Evidence

Trigger output + cache-refresh logs or instrumentation + query-plan/schema evidence for `idx_trigger_cache_source`

### Pass / Fail

- **Pass**: matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection
- **Fail**: trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement.

### Failure Triage

Retry with higher-quality trigger phrase -> inspect trigger-cache clear/reload instrumentation -> verify `idx_trigger_cache_source` exists and the reload query still filters to successful rows with non-empty trigger phrases

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md`
