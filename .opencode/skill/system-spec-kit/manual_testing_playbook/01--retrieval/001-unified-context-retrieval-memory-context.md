---
title: "EX-001 -- Unified context retrieval (memory_context)"
description: "This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull."
audited_post_018: true
phase_018_change: Re-centered the resume path on `/spec_kit:resume`, `handover.md`, `_memory.continuity`, and supporting spec docs instead of legacy CONTINUE_SESSION wording.
---

# EX-001 -- Unified context retrieval (memory_context)

## 1. OVERVIEW

This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-001` and confirm the expected signals without contradicting evidence.

- Objective: Intent-aware context pull through the canonical `/spec_kit:resume` recovery surface, with `handover.md` first, then `_memory.continuity`, then supporting spec docs
- Prompt: `As a retrieval validation operator, validate Unified context retrieval (memory_context) against /spec_kit:resume specs/<target-spec>. Verify intent-aware context pull through the canonical /spec_kit:resume recovery surface, with handover.md first, then _memory.continuity, then supporting spec docs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Relevant bounded context returned; no empty response
- Pass/fail: PASS if relevant context returned in both calls

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, validate Intent-aware context pull against /spec_kit:resume specs/<target-spec>. Verify relevant bounded context returned; no empty response. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. /spec_kit:resume specs/<target-spec>
2. memory_context({ input: "fix flaky index scan retry logic", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })
3. memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })

### Expected

Relevant bounded context returned; no empty response

### Evidence

Tool outputs + mode selection

### Pass / Fail

- **Pass**: relevant context returned in both calls
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check specFolder/intent mismatch, retry with explicit intent

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/001-unified-context-retrieval-memory-context.md`
