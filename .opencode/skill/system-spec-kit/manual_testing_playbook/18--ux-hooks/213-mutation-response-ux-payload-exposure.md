---
title: "213 -- Mutation response UX payload exposure"
description: "This scenario validates Mutation response UX payload exposure for `213`. It focuses on Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata."
---

# 213 -- Mutation response UX payload exposure

## 1. OVERVIEW

This scenario validates Mutation response UX payload exposure for `213`. It focuses on Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `213` and confirm the expected signals without contradicting evidence.

- Objective: Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata
- Prompt: `Validate mutation response UX payload exposure on successful save paths. Capture the evidence needed to prove standard and atomic save success responses expose typed postMutationHooks fields, while duplicate or unchanged no-op paths omit false hook metadata and report caches-left-unchanged guidance instead. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance
- Pass/fail: PASS if the save-path suite passes and the assertions prove success responses expose the UX payload contract while no-op responses suppress false hook metadata

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 213 | Mutation response UX payload exposure | Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata | `Validate mutation response UX payload exposure on successful save paths. Capture the evidence needed to prove standard and atomic save success responses expose typed postMutationHooks fields, while duplicate or unchanged no-op paths omit false hook metadata and report caches-left-unchanged guidance instead. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts` 2) inspect assertions covering successful `memory_save` and `atomicSaveMemory` responses with typed `postMutationHooks` fields 3) inspect assertions covering duplicate-content and unchanged/no-op suppression of false UX payloads | Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance | Test transcript + highlighted assertion names or output snippets showing success-payload and no-op suppression coverage | PASS if the save-path suite passes and the assertions prove success responses expose the UX payload contract while no-op responses suppress false hook metadata | Inspect `handlers/save/response-builder.ts`, `hooks/mutation-feedback.ts`, and response-envelope formatting if payload fields drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/07-mutation-response-ux-payload-exposure.md](../../feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 213
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/213-mutation-response-ux-payload-exposure.md`
- Feature catalog back-ref: `18--ux-hooks/07-mutation-response-ux-payload-exposure.md`
