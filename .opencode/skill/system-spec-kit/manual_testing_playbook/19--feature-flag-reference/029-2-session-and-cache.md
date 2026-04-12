---
title: "EX-029 -- 2. Session and Cache"
description: "This scenario validates 2. Session and Cache for `EX-029`. It focuses on Session policy audit."
audited_post_018: true
---

# EX-029 -- 2. Session and Cache

## 1. OVERVIEW

This scenario validates 2. Session and Cache for `EX-029`. It focuses on Session policy audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-029` and confirm the expected signals without contradicting evidence.

- Objective: Session policy audit
- Prompt: `As a feature-flag validation operator, validate 2. Session and Cache against memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 }). Verify session/cache controls found. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Session/cache controls found
- Pass/fail: PASS if all required keys surfaced

---

## 3. TEST EXECUTION

### Prompt

```
As a feature-flag validation operator, validate Session policy audit against memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 }). Verify session/cache controls found. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })

### Expected

Session/cache controls found

### Evidence

Search output

### Pass / Fail

- **Pass**: all required keys surfaced
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Expand query terms

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/02-2-session-and-cache.md](../../feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-029
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/029-2-session-and-cache.md`
