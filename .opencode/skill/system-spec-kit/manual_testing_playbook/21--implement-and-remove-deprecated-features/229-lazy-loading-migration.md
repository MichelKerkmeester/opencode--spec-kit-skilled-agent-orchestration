---
title: "229 -- Lazy-loading migration and warmup compatibility"
description: "This scenario validates Lazy-loading migration and warmup compatibility for `229`. It focuses on confirming lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces."
---

# 229 -- Lazy-loading migration and warmup compatibility

## 1. OVERVIEW

This scenario validates Lazy-loading migration and warmup compatibility for `229`. It focuses on confirming lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `229` and confirm the expected signals without contradicting evidence.

- Objective: Confirm lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces
- Prompt: `Validate that embedding startup now stays on lazy initialization and that the legacy warmup flags only remain as deprecated compatibility surfaces. Run the targeted checks, capture the evidence that proves lazy startup is the shipped behavior, and return a concise pass/fail verdict with the main reason.`
- Expected signals: The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging
- Pass/fail: PASS if the targeted checks confirm startup always follows the lazy path and the legacy warmup flags do not restore eager initialization behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 229 | Lazy-loading migration and warmup compatibility | Confirm lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces | `Validate that embedding startup now stays on lazy initialization and that the legacy warmup flags only remain as deprecated compatibility surfaces. Run the targeted checks, capture the evidence that proves lazy startup is the shipped behavior, and return a concise pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npx vitest run tests/lazy-loading.vitest.ts tests/context-server.vitest.ts` 3) `sed -n '840,890p' context-server.ts` 4) `rg -n "shouldEagerWarmup|getLazyLoadingStats|preWarmModel|SPECKIT_EAGER_WARMUP|SPECKIT_LAZY_LOADING" lib/providers/embeddings.ts ../shared/embeddings.ts context-server.ts tests/lazy-loading.vitest.ts` | The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging | Vitest transcript plus the source excerpts showing the lazy startup branch and deprecated-flag references | PASS if the targeted checks confirm startup always follows the lazy path and the legacy warmup flags do not restore eager initialization behavior | Inspect `context-server.ts`, `lib/providers/embeddings.ts`, and `../shared/embeddings.ts`; confirm no test setup or shell environment is forcing legacy warmup behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md](../../feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 229
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md`
