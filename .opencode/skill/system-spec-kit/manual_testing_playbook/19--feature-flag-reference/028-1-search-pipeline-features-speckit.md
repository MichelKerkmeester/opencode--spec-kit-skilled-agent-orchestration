---
title: "EX-028 -- 1. Search Pipeline Features (SPECKIT_*)"
description: "This scenario validates 1. Search Pipeline Features (SPECKIT_*) for `EX-028`. It focuses on flag catalog verification with inert and retired surface cleanup."
---

# EX-028 -- 1. Search Pipeline Features (SPECKIT_*)

## 1. OVERVIEW

This scenario validates 1. Search Pipeline Features (SPECKIT_*) for `EX-028`. It focuses on Flag catalog verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-028` and confirm the expected signals without contradicting evidence.

- Objective: Flag catalog verification with inert and retired surface cleanup
- Prompt: `List SPECKIT search-pipeline flags as active, inert compatibility shims, or retired. Capture the evidence needed to prove active flags stay separated from inert compatibility shims such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING, and that retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not presented as active manual-test scenarios. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Accurate active/inert/retired classification; retired topics absent from active manual-test guidance
- Pass/fail: PASS if classifications are internally consistent and retired topics are not framed as active checks

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-028 | 1. Search Pipeline Features (SPECKIT_*) | Flag catalog verification with inert and retired surface cleanup | `List SPECKIT search-pipeline flags as active, inert compatibility shims, or retired. Capture the evidence needed to prove active flags stay separated from inert compatibility shims such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING, and that retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not presented as active manual-test scenarios. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 })` -> `memory_context({ input: "Classify live search-pipeline flags versus inert compatibility shims and retired topics", mode: "deep", sessionId: "ex028" })` | Accurate active/inert/retired classification; retired topics absent from active manual-test guidance | Search/context outputs + catalog cross-check notes | PASS if classifications are internally consistent and retired topics are not framed as active checks | Validate against code/config docs; remove any manual-test wording that still treats retired topics as live search-pipeline behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-028
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/028-1-search-pipeline-features-speckit.md`
