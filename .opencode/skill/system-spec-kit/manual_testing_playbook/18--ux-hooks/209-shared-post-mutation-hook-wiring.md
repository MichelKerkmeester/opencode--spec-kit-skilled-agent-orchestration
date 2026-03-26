---
title: "209 -- Shared post-mutation hook wiring"
description: "This scenario validates Shared post-mutation hook wiring for `209`. It focuses on Confirm save, update, delete, bulk-delete, and atomic-save flows share one post-mutation hook contract and surface hook failures through `errors`."
---

# 209 -- Shared post-mutation hook wiring

## 1. OVERVIEW

This scenario validates Shared post-mutation hook wiring for `209`. It focuses on Confirm save, update, delete, bulk-delete, and atomic-save flows share one post-mutation hook contract and surface hook failures through `errors`.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `209` and confirm the expected signals without contradicting evidence.

- Objective: Confirm save, update, delete, bulk-delete, and atomic-save flows share one post-mutation hook contract and surface hook failures through `errors`
- Prompt: `Validate shared post-mutation hook wiring across save, update, delete, bulk-delete, and atomic-save flows. Capture the evidence needed to prove the hook suites pass, every operation returns the same MutationHookResult fields, and thrown hook failures are collected into the errors array instead of being silently swallowed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Hook suites pass, all five mutation operations return `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors: string[]`, and thrown hook failures are surfaced in `errors`
- Pass/fail: PASS if the shared hook-wiring suites pass and the assertions confirm all five mutation operations share one result contract while preserving real error details in `errors`

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 209 | Shared post-mutation hook wiring | Confirm save, update, delete, bulk-delete, and atomic-save flows share one post-mutation hook contract and surface hook failures through `errors` | `Validate shared post-mutation hook wiring across save, update, delete, bulk-delete, and atomic-save flows. Capture the evidence needed to prove the hook suites pass, every operation returns the same MutationHookResult fields, and thrown hook failures are collected into the errors array instead of being silently swallowed. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hooks-mutation-wiring.vitest.ts tests/mutation-hooks.vitest.ts` 2) inspect assertions covering `save`, `update`, `delete`, `bulk-delete`, and `atomic-save` 3) inspect assertions proving thrown hook failures populate `errors` and emit warning telemetry | Hook suites pass, all five mutation operations return `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors: string[]`, and thrown hook failures are surfaced in `errors` | Test transcript + highlighted assertion names or output snippets for result-shape and error-capture coverage | PASS if the shared hook-wiring suites pass and the assertions confirm all five mutation operations share one result contract while preserving real error details in `errors` | Inspect `handlers/mutation-hooks.ts`, `hooks/mutation-feedback.ts`, and the failing hook mock path if any assertion breaks |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/01-shared-post-mutation-hook-wiring.md](../../feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 209
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/209-shared-post-mutation-hook-wiring.md`
- Feature catalog back-ref: `18--ux-hooks/01-shared-post-mutation-hook-wiring.md`
