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

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-001` and confirm the expected signals without contradicting evidence.

- Objective: Intent-aware context pull through the canonical `/spec_kit:resume` recovery surface, with `handover.md` first, then `_memory.continuity`, then supporting spec docs
- Prompt: `Use /spec_kit:resume for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response; helper resume-mode context only fills gaps when the packet is thin. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Relevant bounded context returned; no empty response
- Pass/fail: PASS if relevant context returned in both calls

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-001 | Unified context retrieval (memory_context) | Intent-aware context pull | `Use /spec_kit:resume for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response; helper resume-mode context only fills gaps when the packet is thin. Return a concise user-facing pass/fail verdict with the main reason.` | `/spec_kit:resume specs/<target-spec>` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })` | Relevant bounded context returned; no empty response | Tool outputs + mode selection | PASS if relevant context returned in both calls | Check specFolder/intent mismatch, retry with explicit intent |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/001-unified-context-retrieval-memory-context.md`
