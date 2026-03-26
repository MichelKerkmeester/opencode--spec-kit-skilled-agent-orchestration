---
title: "211 -- Schema and type contract synchronization"
description: "This scenario validates Schema and type contract synchronization for `211`. It focuses on Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries."
---

# 211 -- Schema and type contract synchronization

## 1. OVERVIEW

This scenario validates Schema and type contract synchronization for `211`. It focuses on Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `211` and confirm the expected signals without contradicting evidence.

- Objective: Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries
- Prompt: `Validate schema and type contract synchronization for checkpoint deletion and mutation-hook responses. Capture the evidence needed to prove confirmName remains required across schema, handler, and tool-boundary validation, and that shared post-mutation hook result fields stay synchronized with save-path response payloads. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Checkpoint-delete tests reject missing or mismatched `confirmName`, tool-schema validation accepts matching payloads, and mutation-hook/save-path suites confirm the shared result contract remains synchronized
- Pass/fail: PASS if the contract suites pass and the assertions confirm `confirmName` is required everywhere while mutation-hook result fields stay aligned across runtime and response boundaries

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 211 | Schema and type contract synchronization | Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries | `Validate schema and type contract synchronization for checkpoint deletion and mutation-hook responses. Capture the evidence needed to prove confirmName remains required across schema, handler, and tool-boundary validation, and that shared post-mutation hook result fields stay synchronized with save-path response payloads. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/memory-save-ux-regressions.vitest.ts` 2) inspect assertions covering missing, mismatched, and matching `confirmName` payloads 3) inspect assertions covering shared mutation-hook result fields in hook wiring and save responses | Checkpoint-delete tests reject missing or mismatched `confirmName`, tool-schema validation accepts matching payloads, and mutation-hook/save-path suites confirm the shared result contract remains synchronized | Test transcript + key assertion output for schema validation and shared result-contract coverage | PASS if the contract suites pass and the assertions confirm `confirmName` is required everywhere while mutation-hook result fields stay aligned across runtime and response boundaries | Inspect `handlers/checkpoints.ts`, `schemas/tool-input-schemas.ts`, `tool-schemas.ts`, `tools/types.ts`, and hook result type definitions if any contract diverges |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/04-schema-and-type-contract-synchronization.md](../../feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 211
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/211-schema-and-type-contract-synchronization.md`
- Feature catalog back-ref: `18--ux-hooks/04-schema-and-type-contract-synchronization.md`
