---
title: "EX-032 -- 5. Embedding and API"
description: "This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit."
audited_post_018: true
---

# EX-032 -- 5. Embedding and API

## 1. OVERVIEW

This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-032` and confirm the expected signals without contradicting evidence.

- Objective: Provider selection audit
- Prompt: `As a feature-flag validation operator, validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 }). Verify provider rules and key precedence shown. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Provider rules and key precedence shown
- Pass/fail: PASS if provider routing is clear

---

## 3. TEST EXECUTION

### Prompt

```
As a feature-flag validation operator, validate Provider selection audit against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 }). Verify provider rules and key precedence shown. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })

### Expected

Provider rules and key precedence shown

### Evidence

Search output

### Pass / Fail

- **Pass**: provider routing is clear
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify env in runtime

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/05-5-embedding-and-api.md](../../feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-032
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/032-5-embedding-and-api.md`
