---
title: "NEW-106 -- Hooks barrel + README synchronization"
description: "This scenario validates Hooks barrel + README synchronization for `NEW-106`. It focuses on Confirm hooks index exports and docs cover the finalized modules and contract fields."
---

# NEW-106 -- Hooks barrel + README synchronization

## 1. OVERVIEW

This scenario validates Hooks barrel + README synchronization for `NEW-106`. It focuses on Confirm hooks index exports and docs cover the finalized modules and contract fields.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-106` and confirm the expected signals without contradicting evidence.

- Objective: Confirm hooks index exports and docs cover the finalized modules and contract fields
- Prompt: `Validate hook barrel and README coverage for the finalized UX-hook surface. Capture the evidence needed to prove response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts 2) rg "mutation-feedback. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` 2) `rg "mutation-feedback
- Pass/fail: MutationHookResult

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-106 | Hooks barrel + README synchronization | Confirm hooks index exports and docs cover the finalized modules and contract fields | `Validate hook barrel and README coverage for the finalized UX-hook surface. Capture the evidence needed to prove response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts 2) rg "mutation-feedback. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `rg "mutation-feedback | response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` 2) `rg "mutation-feedback | response-hints | MutationHookResult | postMutationHooks" .opencode/skill/system-spec-kit/mcp_server/hooks/README.md` |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/12-hooks-readme-and-export-alignment.md](../../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: NEW-106
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/106-hooks-barrel-readme-synchronization.md`
