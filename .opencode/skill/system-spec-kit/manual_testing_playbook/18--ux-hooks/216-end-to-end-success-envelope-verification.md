---
title: "216 -- End-to-end success-envelope verification"
description: "This scenario validates End-to-end success-envelope verification for `216`. It focuses on Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together."
---

# 216 -- End-to-end success-envelope verification

## 1. OVERVIEW

This scenario validates End-to-end success-envelope verification for `216`. It focuses on Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together.
- Real user request: `` Please validate End-to-end success-envelope verification against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/hooks-ux-feedback.vitest.ts and tell me whether the expected signals are present: Context-server and hook suites pass, success envelopes append auto-surface hints, preserve `autoSurfacedContext`, and keep `meta.tokenCount` aligned with the finalized serialized payload. ``
- RCAF Prompt: `As a runtime-hook validation operator, validate End-to-end success-envelope verification against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/hooks-ux-feedback.vitest.ts. Verify finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Context-server and hook suites pass, success envelopes append auto-surface hints, preserve `autoSurfacedContext`, and keep `meta.tokenCount` aligned with the finalized serialized payload
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the assertions prove the final success envelope preserves hints, context, and token metadata end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/hooks-ux-feedback.vitest.ts. Verify context-server and hook suites pass, success envelopes append auto-surface hints, preserve autoSurfacedContext, and keep meta.tokenCount aligned with the finalized serialized payload. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/hooks-ux-feedback.vitest.ts`
2. inspect assertions covering success-path hint append
3. inspect assertions covering preserved `autoSurfacedContext`
4. inspect assertions covering final serialized-envelope token-count alignment

### Expected

Context-server and hook suites pass, success envelopes append auto-surface hints, preserve `autoSurfacedContext`, and keep `meta.tokenCount` aligned with the finalized serialized payload

### Evidence

Test transcript + key assertion output for success-envelope and token-alignment coverage

### Pass / Fail

- **Pass**: the targeted suites pass and the assertions prove the final success envelope preserves hints, context, and token metadata end to end
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `context-server.ts`, `hooks/index.ts`, and `hooks/response-hints.ts` if any success-envelope field or final token count regresses

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/13-end-to-end-success-envelope-verification.md](../../feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 216
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/216-end-to-end-success-envelope-verification.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/13-end-to-end-success-envelope-verification.md`
