---
title: "EX-035 -- Startup runtime compatibility guards"
description: "This scenario validates Startup runtime compatibility guards for `EX-035`. It focuses on Startup diagnostics verification."
---

# EX-035 -- Startup runtime compatibility guards

## 1. OVERVIEW

This scenario validates Startup runtime compatibility guards for `EX-035`. It focuses on Startup diagnostics verification.

---

## 2. SCENARIO CONTRACT


- Objective: Startup diagnostics verification.
- Real user request: `Please validate Startup runtime compatibility guards against cd .opencode/skill/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript.`
- RCAF Prompt: `As a maintenance validation operator, validate Startup runtime compatibility guards against cd .opencode/skill/system-spec-kit/mcp_server. Verify targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `startup-checks.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

### Prompt

```
As a maintenance validation operator, validate Startup diagnostics verification against cd .opencode/skill/system-spec-kit/mcp_server. Verify targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server
2. npm test -- --run tests/startup-checks.vitest.ts

### Expected

Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript

### Evidence

Test transcript + suite summary

### Pass / Fail

- **Pass**: `startup-checks.vitest.ts` completes with all tests passing and no failures
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run `npm test -- --run tests/startup-checks.vitest.ts -t detectRuntimeMismatch`; inspect `startup-checks.ts` and test expectations if counts or assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [04--maintenance/02-startup-runtime-compatibility-guards.md](../../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md)

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: EX-035
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--maintenance/035-startup-runtime-compatibility-guards.md`
- audited_post_018: true
- phase_018_change: post-018 audit verified against `mcp_server/startup-checks.ts`, `mcp_server/context-server.ts`, and `mcp_server/tests/startup-checks.vitest.ts`
