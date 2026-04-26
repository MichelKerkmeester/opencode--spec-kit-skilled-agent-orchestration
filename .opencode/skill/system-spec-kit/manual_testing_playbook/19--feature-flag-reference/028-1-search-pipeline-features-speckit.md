---
title: "EX-028 -- 1. Search Pipeline Features (SPECKIT_*)"
description: "This scenario validates 1. Search Pipeline Features (SPECKIT_*) for `EX-028`. It focuses on flag catalog verification with inert and retired surface cleanup."
audited_post_018: true
---

# EX-028 -- 1. Search Pipeline Features (SPECKIT_*)

## 1. OVERVIEW

This scenario validates 1. Search Pipeline Features (SPECKIT_*) for `EX-028`. It focuses on Flag catalog verification.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-028` and confirm the expected signals without contradicting evidence.

- Objective: Flag catalog verification with inert and retired surface cleanup
- Prompt: `As a feature-flag validation operator, validate 1. Search Pipeline Features (SPECKIT_*) against memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 }). Verify flag catalog verification with inert and retired surface cleanup. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Accurate active/inert/retired classification; retired topics absent from active manual-test guidance
- Pass/fail: PASS if classifications are internally consistent and retired topics are not framed as active checks

---

## 3. TEST EXECUTION

### Prompt

```
As a feature-flag validation operator, validate Flag catalog verification with inert and retired surface cleanup against memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 }). Verify accurate active/inert/retired classification; retired topics absent from active manual-test guidance. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 })
2. memory_context({ input: "Classify live search-pipeline flags versus inert compatibility shims and retired topics", mode: "deep", sessionId: "ex028" })

### Expected

Accurate active/inert/retired classification; retired topics absent from active manual-test guidance

### Evidence

Search/context outputs + catalog cross-check notes

### Pass / Fail

- **Pass**: classifications are internally consistent and retired topics are not framed as active checks
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Validate against code/config docs; remove any manual-test wording that still treats retired topics as live search-pipeline behavior

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/028-1-search-pipeline-features-speckit.md`
