---
title: "226 -- Memory health auto-repair"
description: "This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently."
audited_post_018: true
phase_018_change: "Post-018 audit kept the scenario aligned to the confirmed `memory_health` repair path and its transparent repair bookkeeping."
---

# 226 -- Memory health auto-repair

## 1. OVERVIEW

This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently.
- Real user request: `Please validate Memory health auto-repair against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts and tell me whether the expected signals are present: Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings.`
- RCAF Prompt: `As a remediation validation operator, validate Memory health auto-repair against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts. Verify memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths

---

## 3. TEST EXECUTION

### Prompt

```
As a remediation validation operator, confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts. Verify health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts`
2. inspect assertions covering `memory_health` with `autoRepair: true` and missing `confirmed: true` to verify confirmation-required behavior
3. inspect assertions covering confirmed FTS rebuild, trigger-cache refresh, orphan-edge cleanup, and vector or chunk cleanup
4. inspect assertions covering `repair.requested`, `repair.attempted`, `repair.repaired`, `repair.partialSuccess`, `repair.warnings`, and `repair.errors` in success and partial-success paths

### Expected

Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings

### Evidence

Test transcript + key assertion output for confirmation gating, staged repair actions, and repair metadata

### Pass / Fail

- **Pass**: the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/lib/parsing/trigger-matcher.ts`, `mcp_server/lib/search/vector-index.ts`, and `mcp_server/lib/storage/causal-edges.ts` if repair staging, metadata, or cleanup coverage regresses

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [20--remediation-revalidation/02-memory-health-auto-repair.md](../../feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 226
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `20--remediation-revalidation/226-memory-health-auto-repair.md`
