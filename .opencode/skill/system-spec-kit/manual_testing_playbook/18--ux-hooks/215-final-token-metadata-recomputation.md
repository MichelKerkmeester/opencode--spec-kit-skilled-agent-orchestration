---
title: "215 -- Final token metadata recomputation"
description: "This scenario validates Final token metadata recomputation for `215`. It focuses on Confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement."
---

# 215 -- Final token metadata recomputation

## 1. OVERVIEW

This scenario validates Final token metadata recomputation for `215`. It focuses on Confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `215` and confirm the expected signals without contradicting evidence.

- Objective: Confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement
- Prompt: `As a runtime-hook validation operator, validate Final token metadata recomputation against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts. Verify token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Hook and context-server suites pass, `appendAutoSurfaceHints` recomputes `meta.tokenCount` from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload
- Pass/fail: PASS if the suites pass and the assertions prove final token-count recomputation happens after hint append and before budget enforcement

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts. Verify hook and context-server suites pass, appendAutoSurfaceHints recomputes meta.tokenCount from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts`
2. inspect assertions covering final serialized-envelope token-count recomputation in `appendAutoSurfaceHints`
3. inspect assertions covering final token-count correctness after success-path hint append and token-budget injection

### Expected

Hook and context-server suites pass, `appendAutoSurfaceHints` recomputes `meta.tokenCount` from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload

### Evidence

Test transcript + highlighted assertion names or output snippets for hook-level and end-to-end token-count verification

### Pass / Fail

- **Pass**: the suites pass and the assertions prove final token-count recomputation happens after hint append and before budget enforcement
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `hooks/response-hints.ts`, `context-server.ts`, and token-estimation helpers if token metadata diverges from the serialized payload

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/11-final-token-metadata-recomputation.md](../../feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 215
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/215-final-token-metadata-recomputation.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/11-final-token-metadata-recomputation.md`
