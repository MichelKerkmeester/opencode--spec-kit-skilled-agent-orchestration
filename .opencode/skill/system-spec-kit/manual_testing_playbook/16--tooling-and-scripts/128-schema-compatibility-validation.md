---
title: "128 -- Schema compatibility validation"
description: "This scenario validates Schema compatibility validation for `128`. It focuses on Verify backward-compatibility validation flags required schema gaps without throwing on partial databases."
---

# 128 -- Schema compatibility validation

## 1. OVERVIEW

This scenario validates Schema compatibility validation for `128`. It focuses on Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.

---

## 2. SCENARIO CONTRACT


- Objective: Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.
- Real user request: `Please validate Schema compatibility validation against cd .opencode/skill/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage.`
- RCAF Prompt: `As a tooling validation operator, validate Schema compatibility validation against cd .opencode/skill/system-spec-kit/mcp_server. Verify backward-compatibility validation flags required schema gaps without throwing on partial databases. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `vector-index-schema-compatibility.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify backward-compatibility validation flags required schema gaps without throwing on partial databases against cd .opencode/skill/system-spec-kit/mcp_server. Verify targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server`
2. `npm test -- --run tests/vector-index-schema-compatibility.vitest.ts`

### Expected

Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage

### Evidence

Test transcript + suite summary

### Pass / Fail

- **Pass**: `vector-index-schema-compatibility.vitest.ts` completes with all tests passing and no failures
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run `npm test -- --run tests/vector-index-schema-compatibility.vitest.ts -t compatible`; inspect `vector-index-schema.ts` required-table/column lists if assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/10-schema-compatibility-validation.md](../../feature_catalog/16--tooling-and-scripts/10-schema-compatibility-validation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 128
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/128-schema-compatibility-validation.md`
