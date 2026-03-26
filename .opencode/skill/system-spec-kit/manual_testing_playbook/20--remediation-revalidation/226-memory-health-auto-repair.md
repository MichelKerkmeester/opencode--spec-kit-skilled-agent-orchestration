---
title: "226 -- Memory health auto-repair"
description: "This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently."
---

# 226 -- Memory health auto-repair

## 1. OVERVIEW

This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `226` and confirm the expected signals without contradicting evidence.

- Objective: Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently
- Prompt: `Validate memory_health auto-repair behavior for the Spec Kit Memory MCP server. Capture the evidence needed to prove autoRepair requires explicit confirmation before mutation, that confirmed repair can rebuild FTS, refresh trigger caches, and clean orphaned edges or vector data, and that the response preserves requested, attempted, repaired, warnings, errors, and partialSuccess metadata. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings
- Pass/fail: PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 226 | Memory health auto-repair | Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently | `Validate memory_health auto-repair behavior for the Spec Kit Memory MCP server. Capture the evidence needed to prove autoRepair requires explicit confirmation before mutation, that confirmed repair can rebuild FTS, refresh trigger caches, and clean orphaned edges or vector data, and that the response preserves requested, attempted, repaired, warnings, errors, and partialSuccess metadata. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts` 2) inspect assertions covering `memory_health` with `autoRepair: true` and missing `confirmed: true` to verify confirmation-required behavior 3) inspect assertions covering confirmed FTS rebuild, trigger-cache refresh, orphan-edge cleanup, and vector or chunk cleanup 4) inspect assertions covering `repair.requested`, `repair.attempted`, `repair.repaired`, `repair.partialSuccess`, `repair.warnings`, and `repair.errors` in success and partial-success paths | Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings | Test transcript + key assertion output for confirmation gating, staged repair actions, and repair metadata | PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths | Inspect `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/lib/parsing/trigger-matcher.ts`, `mcp_server/lib/search/vector-index.ts`, and `mcp_server/lib/storage/causal-edges.ts` if repair staging, metadata, or cleanup coverage regresses |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [20--remediation-revalidation/02-memory-health-auto-repair.md](../../feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 226
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `20--remediation-revalidation/226-memory-health-auto-repair.md`
