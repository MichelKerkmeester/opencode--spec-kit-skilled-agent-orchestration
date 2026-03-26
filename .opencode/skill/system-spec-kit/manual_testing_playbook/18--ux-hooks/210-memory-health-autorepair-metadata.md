---
title: "210 -- Memory health autoRepair metadata"
description: "This scenario validates Memory health autoRepair metadata for `210`. It focuses on Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting."
---

# 210 -- Memory health autoRepair metadata

## 1. OVERVIEW

This scenario validates Memory health autoRepair metadata for `210`. It focuses on Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `210` and confirm the expected signals without contradicting evidence.

- Objective: Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting
- Prompt: `Validate memory_health autoRepair metadata in full report mode. Capture the evidence needed to prove unconfirmed autoRepair requests return a confirmation-only payload, confirmed repairs return structured repair actions, and mixed outcomes set repaired and partialSuccess exactly as documented. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds
- Pass/fail: PASS if the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 210 | Memory health autoRepair metadata | Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting | `Validate memory_health autoRepair metadata in full report mode. Capture the evidence needed to prove unconfirmed autoRepair requests return a confirmation-only payload, confirmed repairs return structured repair actions, and mixed outcomes set repaired and partialSuccess exactly as documented. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts` 2) inspect assertions covering confirmation-only responses for `autoRepair:true` without `confirmed:true` 3) inspect assertions covering FTS rebuild, orphan cleanup, and partial-success repair metadata | The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds | Test transcript + highlighted assertion names or output snippets for confirmation-only and partial-success cases | PASS if the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics | Inspect `handlers/memory-crud-health.ts`, `handlers/memory-crud-types.ts`, and response-envelope shaping for `repair` payload regressions |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/02-memory-health-autorepair-metadata.md](../../feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 210
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/210-memory-health-autorepair-metadata.md`
- Feature catalog back-ref: `18--ux-hooks/02-memory-health-autorepair-metadata.md`
