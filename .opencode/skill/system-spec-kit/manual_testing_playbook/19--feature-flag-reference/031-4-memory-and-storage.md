---
title: "EX-031 -- 4. Memory and Storage"
description: "This scenario validates 4. Memory and Storage for `EX-031`. It focuses on Storage precedence check."
---

# EX-031 -- 4. Memory and Storage

## 1. OVERVIEW

This scenario validates 4. Memory and Storage for `EX-031`. It focuses on Storage precedence check.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-031` and confirm the expected signals without contradicting evidence.

- Objective: Storage precedence check
- Prompt: `Explain DB path precedence env vars. Capture the evidence needed to prove Precedence chain identified. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Precedence chain identified
- Pass/fail: PASS if precedence is unambiguous

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-031 | 4. Memory and Storage | Storage precedence check | `Explain DB path precedence env vars. Capture the evidence needed to prove Precedence chain identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 })` -> `memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })` | Precedence chain identified | Search/context output | PASS if precedence is unambiguous | Cross-check shared config loader and vector-index store override path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/04-4-memory-and-storage.md](../../feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-031
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/031-4-memory-and-storage.md`
