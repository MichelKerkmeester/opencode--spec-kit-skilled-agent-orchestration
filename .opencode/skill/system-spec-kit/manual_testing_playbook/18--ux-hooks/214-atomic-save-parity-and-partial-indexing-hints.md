---
title: "214 -- Atomic-save parity and partial-indexing hints"
description: "This scenario validates Atomic-save parity and partial-indexing hints for `214`. It focuses on Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots."
---

# 214 -- Atomic-save parity and partial-indexing hints

## 1. OVERVIEW

This scenario validates Atomic-save parity and partial-indexing hints for `214`. It focuses on Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `214` and confirm the expected signals without contradicting evidence.

- Objective: Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots
- Prompt: `As a runtime-hook validation operator, validate Atomic-save parity and partial-indexing hints against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts. Verify atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation
- Pass/fail: PASS if the targeted suites pass and the assertions confirm atomic-save parity, partial-indexing guidance, no-op suppression, and callback snapshot protection

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts. Verify save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts`
2. inspect assertions covering successful atomic-save `postMutationHooks` contract parity
3. inspect assertions covering partial-indexing hints and duplicate or unchanged hook suppression
4. inspect assertions covering `structuredClone` snapshot isolation for after-tool callbacks

### Expected

Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation

### Evidence

Test transcript + key assertion output for parity, partial-indexing, and callback snapshot coverage

### Pass / Fail

- **Pass**: the targeted suites pass and the assertions confirm atomic-save parity, partial-indexing guidance, no-op suppression, and callback snapshot protection
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/memory-save.ts`, `handlers/save/response-builder.ts`, `handlers/save/post-insert.ts`, and `context-server.ts` if parity or snapshot behavior regresses

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md](../../feature_catalog/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 214
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/214-atomic-save-parity-and-partial-indexing-hints.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md`
