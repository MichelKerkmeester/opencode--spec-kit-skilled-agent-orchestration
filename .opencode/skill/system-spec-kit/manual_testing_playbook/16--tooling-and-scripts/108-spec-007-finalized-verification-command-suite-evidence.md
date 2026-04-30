---
title: "108 -- Spec 007 finalized verification command suite evidence"
description: "This scenario validates Spec 007 finalized verification command suite evidence for `108`. It focuses on Confirm the recorded verification set matches the current Spec 007 evidence."
---

# 108 -- Spec 007 finalized verification command suite evidence

## 1. OVERVIEW

This scenario validates Spec 007 finalized verification command suite evidence for `108`. It focuses on Confirm the recorded verification set matches the current Spec 007 evidence.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the recorded verification set matches the current Spec 007 evidence.
- Real user request: `` Please validate Spec 007 finalized verification command suite evidence against npx tsc -b and tell me whether the expected signals are present: `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed. ``
- RCAF Prompt: `As a tooling validation operator, validate Spec 007 finalized verification command suite evidence against npx tsc -b. Verify the recorded verification set matches the current Spec 007 evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all five verification steps match the recorded Spec 007 evidence exactly

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm the recorded verification set matches the current Spec 007 evidence against npx tsc -b. Verify npx tsc -b PASS, npm run lint PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `npx tsc -b`
2. `npm run lint`
3. `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts`
4. `npx vitest run tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts`
5. run MCP SDK stdio smoke test against `node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`

### Expected

`npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed

### Evidence

Build/lint/test/smoke transcripts with totals and tool count

### Pass / Fail

- **Pass**: all five verification steps match the recorded Spec 007 evidence exactly
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run the failing verification step in isolation and inspect the corresponding Spec 007 handler or test coverage

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: *(Spec 007 verification suite — no dedicated catalog entry)*

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 108
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/108-spec-007-finalized-verification-command-suite-evidence.md`
