---
title: "055 -- Dual-scope memory auto-surface (TM-05)"
description: "This scenario validates Dual-scope memory auto-surface (TM-05) for `055`. It focuses on Confirm auto-surface hooks."
audited_post_018: true
---

# 055 -- Dual-scope memory auto-surface (TM-05)

## 1. OVERVIEW

This scenario validates Dual-scope memory auto-surface (TM-05) for `055`. It focuses on Confirm auto-surface hooks.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm auto-surface hooks.
- Real user request: `Please validate Dual-scope memory auto-surface (TM-05) against the documented validation surface and tell me whether the expected signals are present: Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Dual-scope memory auto-surface (TM-05) against the documented validation surface. Verify non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories; FAIL: Hook does not fire or surfaced memories irrelevant

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, confirm auto-surface hooks against the documented validation surface. Verify non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. invoke non-memory-aware tool path
2. trigger compaction
3. verify surfaced memories

### Expected

Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context

### Evidence

Auto-surface hook trace + surfaced memory list + context relevance assessment

### Pass / Fail

- **Pass**: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories
- **Fail**: Hook does not fire or surfaced memories irrelevant

### Failure Triage

Verify auto-surface hook registration → Check compaction trigger logic → Inspect context matching for surfaced memories

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md](../../feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 055
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md`
