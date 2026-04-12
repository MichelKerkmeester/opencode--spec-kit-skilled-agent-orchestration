---
title: "EX-031 -- 4. Memory and Storage"
description: "This scenario validates 4. Memory and Storage for `EX-031`. It focuses on Storage precedence check."
audited_post_018: true
---

# EX-031 -- 4. Memory and Storage

## 1. OVERVIEW

This scenario validates 4. Memory and Storage for `EX-031`. It focuses on Storage precedence check.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-031` and confirm the expected signals without contradicting evidence.

- Objective: Storage precedence check
- Prompt: `As a feature-flag validation operator, validate 4. Memory and Storage against memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 }). Verify precedence chain identified. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Precedence chain identified
- Pass/fail: PASS if precedence is unambiguous

---

## 3. TEST EXECUTION

### Prompt

```
As a feature-flag validation operator, validate Storage precedence check against memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 }). Verify precedence chain identified. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 })
2. memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })

### Expected

Precedence chain identified

### Evidence

Search/context output

### Pass / Fail

- **Pass**: precedence is unambiguous
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Cross-check shared config loader and vector-index store override path

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/04-4-memory-and-storage.md](../../feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-031
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/031-4-memory-and-storage.md`
