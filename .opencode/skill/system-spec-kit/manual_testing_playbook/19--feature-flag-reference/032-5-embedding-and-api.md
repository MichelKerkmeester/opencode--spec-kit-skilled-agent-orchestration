---
title: "EX-032 -- 5. Embedding and API"
description: "This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit."
---

# EX-032 -- 5. Embedding and API

## 1. OVERVIEW

This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-032` and confirm the expected signals without contradicting evidence.

- Objective: Provider selection audit
- Prompt: `Retrieve embedding provider selection rules. Capture the evidence needed to prove Provider rules and key precedence shown. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Provider rules and key precedence shown
- Pass/fail: PASS if provider routing is clear

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-032 | 5. Embedding and API | Provider selection audit | `Retrieve embedding provider selection rules. Capture the evidence needed to prove Provider rules and key precedence shown. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })` | Provider rules and key precedence shown | Search output | PASS if provider routing is clear | Verify env in runtime |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/05-5-embedding-and-api.md](../../feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-032
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/032-5-embedding-and-api.md`
