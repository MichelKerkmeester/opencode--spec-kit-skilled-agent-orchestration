---
title: "210 -- Memory health autoRepair metadata"
description: "This scenario validates Memory health autoRepair metadata for `210`. It focuses on Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting."
---

# 210 -- Memory health autoRepair metadata

## 1. OVERVIEW

This scenario validates Memory health autoRepair metadata for `210`. It focuses on Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `210` and confirm the expected signals without contradicting evidence.

- Objective: Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting
- Prompt: `As a runtime-hook validation operator, validate Memory health autoRepair metadata against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts. Verify confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds
- Pass/fail: PASS if the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts. Verify the health suites pass, unconfirmed autoRepair:true requests return confirmation-only guidance, confirmed repairs emit structured repair.actions, and mixed outcomes report repair.repaired: false with repair.partialSuccess: true when only part of the repair succeeds. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts`
2. inspect assertions covering confirmation-only responses for `autoRepair:true` without `confirmed:true`
3. inspect assertions covering FTS rebuild, orphan cleanup, and partial-success repair metadata

### Expected

The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds

### Evidence

Test transcript + highlighted assertion names or output snippets for confirmation-only and partial-success cases

### Pass / Fail

- **Pass**: the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/memory-crud-health.ts`, `handlers/memory-crud-types.ts`, and response-envelope shaping for `repair` payload regressions

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/02-memory-health-autorepair-metadata.md](../../feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 210
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/210-memory-health-autorepair-metadata.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/02-memory-health-autorepair-metadata.md`
