---
title: "NEW-055 -- Dual-scope memory auto-surface (TM-05)"
description: "This scenario validates Dual-scope memory auto-surface (TM-05) for `NEW-055`. It focuses on Confirm auto-surface hooks."
---

# NEW-055 -- Dual-scope memory auto-surface (TM-05)

## 1. OVERVIEW

This scenario validates Dual-scope memory auto-surface (TM-05) for `NEW-055`. It focuses on Confirm auto-surface hooks.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-055` and confirm the expected signals without contradicting evidence.

- Objective: Confirm auto-surface hooks
- Prompt: `Validate dual-scope auto-surface (TM-05).`
- Expected signals: Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context
- Pass/fail: PASS: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories; FAIL: Hook does not fire or surfaced memories irrelevant

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-055 | Dual-scope memory auto-surface (TM-05) | Confirm auto-surface hooks | `Validate dual-scope auto-surface (TM-05).` | 1) invoke non-memory-aware tool path 2) trigger compaction 3) verify surfaced memories | Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context | Auto-surface hook trace + surfaced memory list + context relevance assessment | PASS: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories; FAIL: Hook does not fire or surfaced memories irrelevant | Verify auto-surface hook registration → Check compaction trigger logic → Inspect context matching for surfaced memories |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md](../../feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: NEW-055
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md`
