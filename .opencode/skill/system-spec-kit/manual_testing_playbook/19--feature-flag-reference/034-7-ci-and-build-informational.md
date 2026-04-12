---
title: "EX-034 -- 7. CI and Build (informational)"
description: "This scenario validates 7. CI and Build (informational) for `EX-034`. It focuses on Branch metadata source audit."
audited_post_018: true
---

# EX-034 -- 7. CI and Build (informational)

## 1. OVERVIEW

This scenario validates 7. CI and Build (informational) for `EX-034`. It focuses on Branch metadata source audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-034` and confirm the expected signals without contradicting evidence.

- Objective: Branch metadata source audit
- Prompt: `As a feature-flag validation operator, validate 7. CI and Build (informational) against memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 }). Verify branch source vars surfaced. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Branch source vars surfaced
- Pass/fail: PASS if all listed vars are found

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-034 | 7. CI and Build (informational) | Branch metadata source audit | `As a feature-flag validation operator, validate Branch metadata source audit against memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 }). Verify branch source vars surfaced. Return a concise pass/fail verdict with the main reason and cited evidence.` | `memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })` | Branch source vars surfaced | Search output | PASS if all listed vars are found | Search CI scripts and runtime helpers |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/07-7-ci-and-build-informational.md](../../feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-034
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/034-7-ci-and-build-informational.md`
