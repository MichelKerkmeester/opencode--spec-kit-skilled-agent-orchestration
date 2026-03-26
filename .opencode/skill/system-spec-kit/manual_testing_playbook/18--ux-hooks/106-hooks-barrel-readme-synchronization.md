---
title: "106 -- Hooks barrel + README synchronization"
description: "This scenario validates Hooks barrel + README synchronization for `106`. It focuses on Confirm hooks index exports and docs cover the finalized modules and contract fields."
---

# 106 -- Hooks barrel + README synchronization

## 1. OVERVIEW

This scenario validates Hooks barrel + README synchronization for `106`. It focuses on Confirm hooks index exports and docs cover the finalized modules and contract fields.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `106` and confirm the expected signals without contradicting evidence.

- Objective: Confirm hooks index exports and docs cover the finalized modules and contract fields
- Prompt: `Validate hook barrel and README coverage for the finalized UX-hook surface. Capture the evidence needed to prove Both barrel and README reference mutation-feedback, response-hints, MutationHookResult, and postMutationHooks. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Both barrel (`hooks/index.ts`) and README (`hooks/README.md`) reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`
- Pass/fail: PASS if both files reference the new modules and contract fields

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 106 | Hooks barrel + README synchronization | Confirm hooks index exports and docs cover the finalized modules and contract fields | `Validate hook barrel and README coverage for the finalized UX-hook surface. Capture the evidence needed to prove Both barrel and README reference mutation-feedback, response-hints, MutationHookResult, and postMutationHooks. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `rg "mutation-feedback" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` 2) `rg "response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` 3) `rg "mutation-feedback\|response-hints\|MutationHookResult\|postMutationHooks" .opencode/skill/system-spec-kit/mcp_server/hooks/README.md` | Both barrel and README reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks` | ripgrep output snippets | PASS if both files reference the new modules and contract fields | Inspect hooks/index.ts exports and hooks/README.md for missing entries |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/12-hooks-readme-and-export-alignment.md](../../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 106
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/106-hooks-barrel-readme-synchronization.md`
