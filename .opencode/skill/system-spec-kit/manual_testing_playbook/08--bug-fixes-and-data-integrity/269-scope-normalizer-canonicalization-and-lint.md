---
title: "269 -- Scope normalizer canonicalization and lint"
description: "This scenario validates the canonical scope normalizer and duplicate-helper lint for `269`. It focuses on proving scope cleanup stays centralized and new local duplicates are rejected."
---

# 269 -- Scope normalizer canonicalization and lint

## 1. OVERVIEW

This scenario validates the canonical scope normalizer and duplicate-helper lint for `269`. It focuses on proving scope cleanup stays centralized and new local duplicates are rejected.

---

## 2. SCENARIO CONTRACT


- Objective: Verify all target callers use `normalizeScopeValue()` and strict validation rejects new duplicate local helpers.
- Real user request: `Please validate Scope normalizer canonicalization and lint against normalizeScopeValue() and tell me whether the expected signals are present: canonical imports visible at the documented call sites; parity matrix still passes; synthetic duplicate helper fails the lint rule.`
- RCAF Prompt: `As a data-integrity validation operator, validate Scope normalizer canonicalization and lint against normalizeScopeValue(). Verify the documented callers all import the canonical helper, string and null semantics still match the parity matrix, and validate.sh --strict rejects a synthetic duplicate normalizeScope helper outside scope-governance.ts. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: canonical imports visible at the documented call sites; parity matrix still passes; synthetic duplicate helper fails the lint rule
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if scope normalization stays centralized and the lint guard blocks new duplicates

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, validate the canonical scope normalizer and duplicate-helper lint. Verify the documented callers all import normalizeScopeValue(), string and null semantics still match the parity matrix, and validate.sh --strict rejects a synthetic duplicate normalizeScope helper outside scope-governance.ts. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect the documented callers and confirm they import `normalizeScopeValue()` from `scope-governance.ts`
2. Run the parity suite for the canonical helper
3. Create or use a synthetic duplicate-helper fixture and run the strict validator or lint test against it
4. Confirm the duplicate-helper case fails with the normalizer lint rule

### Expected

Canonical imports visible at the documented call sites; parity matrix still passes; synthetic duplicate helper fails the lint rule

### Evidence

Caller import snippets, parity test output, and lint failure output for the duplicate-helper fixture

### Pass / Fail

- **Pass**: scope normalization stays centralized and the lint guard blocks new duplicates
- **Fail**: a documented caller still carries its own helper or the lint rule lets a duplicate through

### Failure Triage

Inspect `mcp_server/lib/governance/scope-governance.ts`, the four documented callers, `scripts/rules/check-normalizer-lint.sh`, and `scripts/tests/normalizer-lint.vitest.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/12-scope-normalizer-canonicalization-and-lint.md](../../feature_catalog/08--bug-fixes-and-data-integrity/12-scope-normalizer-canonicalization-and-lint.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 269
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/269-scope-normalizer-canonicalization-and-lint.md`
