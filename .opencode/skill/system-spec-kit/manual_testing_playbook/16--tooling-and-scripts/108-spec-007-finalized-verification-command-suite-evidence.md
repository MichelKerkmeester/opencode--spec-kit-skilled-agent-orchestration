---
title: "108 -- Spec 007 finalized verification command suite evidence"
description: "This scenario validates Spec 007 finalized verification command suite evidence for `108`. It focuses on Confirm the recorded verification set matches the current Spec 007 evidence."
---

# 108 -- Spec 007 finalized verification command suite evidence

## 1. OVERVIEW

This scenario validates Spec 007 finalized verification command suite evidence for `108`. It focuses on Confirm the recorded verification set matches the current Spec 007 evidence.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `108` and confirm the expected signals without contradicting evidence.

- Objective: Confirm the recorded verification set matches the current Spec 007 evidence
- Prompt: `Run the finalized Spec 007 verification command suite and record evidence. Capture the evidence needed to prove npx tsc -b. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed
- Pass/fail: PASS if all five verification steps match the recorded Spec 007 evidence exactly

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 108 | Spec 007 finalized verification command suite evidence | Confirm the recorded verification set matches the current Spec 007 evidence | `Run the finalized Spec 007 verification command suite and record evidence. Capture the evidence needed to prove npx tsc -b. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx tsc -b` 2) `npm run lint` 3) `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts` 4) `npx vitest run tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts` 5) run MCP SDK stdio smoke test against `node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed | Build/lint/test/smoke transcripts with totals and tool count | PASS if all five verification steps match the recorded Spec 007 evidence exactly | Re-run the failing verification step in isolation and inspect the corresponding Spec 007 handler or test coverage |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: *(Spec 007 verification suite — no dedicated catalog entry)*

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 108
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/108-spec-007-finalized-verification-command-suite-evidence.md`
