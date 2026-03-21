---
title: "EX-028 -- 1. Search Pipeline Features (SPECKIT_*)"
description: "This scenario validates 1. Search Pipeline Features (SPECKIT_*) for `EX-028`. It focuses on Flag catalog verification."
---

# EX-028 -- 1. Search Pipeline Features (SPECKIT_*)

## 1. OVERVIEW

This scenario validates 1. Search Pipeline Features (SPECKIT_*) for `EX-028`. It focuses on Flag catalog verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-028` and confirm the expected signals without contradicting evidence.

- Objective: Flag catalog verification
- Prompt: `List SPECKIT flags active/inert/deprecated. Capture the evidence needed to prove Accurate flag classification. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Accurate flag classification
- Pass/fail: PASS if classifications are internally consistent

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-028 | 1. Search Pipeline Features (SPECKIT_*) | Flag catalog verification | `List SPECKIT flags active/inert/deprecated. Capture the evidence needed to prove Accurate flag classification. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPECKIT flags active inert deprecated", limit: 20 })` -> `memory_context({ input: "Classify SPECKIT flags as active, inert, or deprecated", mode: "deep", sessionId: "ex028" })` | Accurate flag classification | Search/context outputs | PASS if classifications are internally consistent | Validate against code/config docs |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/028-1-search-pipeline-features-speckit.md`
