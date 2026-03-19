---
title: "EX-003 -- Trigger phrase matching (memory_match_triggers)"
description: "This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path."
---

# EX-003 -- Trigger phrase matching (memory_match_triggers)

## 1. OVERVIEW

This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-003` and confirm the expected signals without contradicting evidence.

- Objective: Fast recall path
- Prompt: `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Fast trigger hits + cognitive enrichment
- Pass/fail: PASS if matched triggers returned with cognitive fields

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-003 | Trigger phrase matching (memory_match_triggers) | Fast recall path | `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` | Fast trigger hits + cognitive enrichment | Trigger output | PASS if matched triggers returned with cognitive fields | Retry with higher-quality trigger phrase |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md`
