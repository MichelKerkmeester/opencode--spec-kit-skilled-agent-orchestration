---
title: "202 -- Canonical continuity save substrate"
description: "This scenario validates canonical continuity save substrate for `202`. It focuses on routing, anchor merge, atomic save promotion, and the thin `_memory.continuity` block."
audited_post_018: true
---

# 202 -- Canonical continuity save substrate

## 1. OVERVIEW

This scenario validates canonical continuity save substrate for `202`. It focuses on routing, anchor merge, atomic save promotion, and the thin `_memory.continuity` block.

## 2. CURRENT REALITY

Operators drive a canonical save through the phase-018 writer substrate and confirm the routed content lands in the correct spec-doc anchor with a compact continuity block.

- Objective: Verify routed canonical saves, anchor-aware merge, atomic promotion, and continuity persistence
- Prompt: `As a memory-quality validation operator, validate Canonical continuity save substrate against contentRouter. Verify routed canonical saves, anchor-aware merge, atomic promotion, and continuity persistence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: contentRouter chooses the right tier; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result; `_memory.continuity` stays thin and readable
- Pass/fail: PASS if the routed save lands in the correct anchor and the continuity block is preserved; FAIL if the route is wrong, the merge mode is wrong, or the continuity block is missing/bloated

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 202 | Canonical continuity save substrate | Verify routed canonical saves, anchor-aware merge, atomic promotion, and continuity persistence | `As a memory-quality validation operator, verify routed canonical saves, anchor-aware merge, atomic promotion, and continuity persistence against contentRouter. Verify contentRouter chooses the right tier; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result; _memory.continuity stays thin and readable. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Save a routed session chunk that has both target and non-target content 2) Confirm `contentRouter` picks the intended destination 3) Confirm `anchorMergeOperation` uses the correct merge mode and preserves the target anchor 4) Confirm `atomicIndexMemory` writes the canonical output 5) Read the saved file and confirm `_memory.continuity` is present and thin 6) Confirm the resume ladder can read the saved continuity state | contentRouter chooses the right tier; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result; `_memory.continuity` stays thin and readable | Save output, saved doc contents, and the continuity block readback | PASS if the routed save lands in the correct anchor and the continuity block is preserved; FAIL if the route is wrong, the merge mode is wrong, or the continuity block is missing/bloated | Inspect `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts`, `mcp_server/handlers/save/atomic-index-memory.ts`, and `mcp_server/lib/continuity/thin-continuity-record.ts` |

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md](../../feature_catalog/13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md)
- Source files: `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts`, `mcp_server/handlers/save/atomic-index-memory.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, `mcp_server/lib/resume/resume-ladder.ts`

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 202
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md`
