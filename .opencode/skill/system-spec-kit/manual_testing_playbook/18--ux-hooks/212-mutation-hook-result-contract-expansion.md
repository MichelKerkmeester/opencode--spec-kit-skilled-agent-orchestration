---
title: "212 -- Mutation hook result contract expansion"
description: "This scenario validates Mutation hook result contract expansion for `212`. It focuses on Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details."
---

# 212 -- Mutation hook result contract expansion

## 1. OVERVIEW

This scenario validates Mutation hook result contract expansion for `212`. It focuses on Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `212` and confirm the expected signals without contradicting evidence.

- Objective: Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details
- Prompt: `As a runtime-hook validation operator, validate Mutation hook result contract expansion against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts. Verify post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Hook and UX feedback suites pass, hook results include `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`, and UX feedback assertions reflect those values in response hints
- Pass/fail: PASS if the suites pass and the assertions prove the expanded hook-result contract is present and consumable end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts. Verify hook and UX feedback suites pass, hook results include latencyMs, cache-clear booleans, toolCacheInvalidated, and errors, and UX feedback assertions reflect those values in response hints. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts`
2. inspect assertions covering `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`
3. inspect assertions proving UX feedback/hint builders surface the contract fields without dropping error context

### Expected

Hook and UX feedback suites pass, hook results include `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`, and UX feedback assertions reflect those values in response hints

### Evidence

Test transcript + highlighted assertion names or output snippets showing contract-field and hint coverage

### Pass / Fail

- **Pass**: the suites pass and the assertions prove the expanded hook-result contract is present and consumable end to end
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/memory-crud-types.ts`, `handlers/mutation-hooks.ts`, and `hooks/mutation-feedback.ts` if any field disappears or changes type

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/06-mutation-hook-result-contract-expansion.md](../../feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 212
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/212-mutation-hook-result-contract-expansion.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/06-mutation-hook-result-contract-expansion.md`
