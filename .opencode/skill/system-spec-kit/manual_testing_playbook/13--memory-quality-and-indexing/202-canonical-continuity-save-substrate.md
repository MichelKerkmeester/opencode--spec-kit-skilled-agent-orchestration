---
title: "202 -- Canonical continuity save substrate"
description: "This scenario validates canonical continuity save substrate for `202`. It focuses on 8-category routing, anchor merge, atomic save promotion, and the thin `_memory.continuity` block."
audited_post_018: true
---

# 202 -- Canonical continuity save substrate

## 1. OVERVIEW

This scenario validates canonical continuity save substrate for `202`. It focuses on 8-category routing, anchor merge, atomic save promotion, and the thin `_memory.continuity` block.

## 2. CURRENT REALITY

Operators drive a canonical save through the phase-018 writer substrate and confirm the routed content lands in the correct spec-doc anchor with a compact continuity block. The same run should also refresh `graph-metadata.json` with checklist-aware lowercase status, sanitized `key_files`, deduplicated entities, and no more than 12 derived trigger phrases. This scenario now covers the live 8-category router, the env-gated Tier 3 classifier path, delivery-versus-progress cues, and the hard-drop versus soft-handover boundary.

- Objective: Verify 8-category canonical routing, route overrides, anchor-aware merge, atomic promotion, continuity persistence, and graph-metadata refresh
- Prompt: `As a memory-quality validation operator, validate Canonical continuity save substrate against contentRouter. Verify the live 8-category router chooses the correct category and target; Tier 3 participates by default; routeAs preserves the natural decision for audit; delivery versus progress and handover versus drop stay on the intended side of the boundary; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result; _memory.continuity stays thin and readable; and graph-metadata.json shows lowercase checklist-aware status, sanitized key_files, deduplicated entities, and no more than 12 trigger phrases. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: contentRouter chooses the correct category and tier; routeAs can override safely; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; `_memory.continuity` stays thin and readable; `graph-metadata.json` shows lowercase checklist-aware status, sanitized `key_files`, deduplicated entities, and at most 12 trigger phrases
- Pass/fail: PASS if the routed save lands in the correct anchor or safely refuses, the continuity block is preserved, the override/audit path is intact, and refreshed graph metadata matches the parser contract; FAIL if the route is wrong, the merge mode is wrong, the drop boundary is unsafe, the continuity block is missing/bloated, or graph metadata keeps stale/unsanitized values

## 3. TEST EXECUTION

### Prompt

```
As a memory-quality validation operator, verify 8-category routed canonical saves, route overrides, anchor-aware merge, atomic promotion, continuity persistence, and refreshed graph metadata against contentRouter. Verify contentRouter chooses the correct category and tier; Tier 3 participates by default; routeAs preserves the natural decision for audit; delivery versus progress and handover versus drop stay on the intended side of the boundary; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; _memory.continuity stays thin and readable; and graph-metadata.json shows lowercase checklist-aware status, sanitized key_files, deduplicated entities, and no more than 12 trigger phrases. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save a progress, delivery, handover, metadata, and drop-like chunk through the canonical writer
2. Confirm `contentRouter` picks the intended category and destination for the merged cases
3. Re-run an ambiguous chunk with `SPECKIT_TIER3_ROUTING=true` to confirm the live Tier 3 path participates when configured
4. Force a `routeAs` override and confirm the returned decision preserves the natural route for audit
5. Confirm `anchorMergeOperation` uses the correct merge mode and preserves the target anchor
6. Confirm `atomicIndexMemory` writes the canonical output or safely refuses the drop case
7. Read the saved file and confirm `_memory.continuity` is present and thin
8. Read `graph-metadata.json` and confirm lowercase checklist-aware `status`, sanitized `key_files`, deduplicated entities, and a 12-item trigger cap
9. Confirm the resume ladder can read the saved continuity state

### Expected

contentRouter chooses the correct category and tier; routeAs preserves the natural decision for audit; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; `_memory.continuity` stays thin and readable; `graph-metadata.json` matches the current parser contract

### Evidence

Save output, override audit fields, saved doc contents, refusal output for drop, `graph-metadata.json` contents, and the continuity block readback

### Pass / Fail

- **Pass**: the routed save lands in the correct anchor or safe refusal target, the continuity block is preserved, the override audit fields stay intact, and refreshed graph metadata matches the current parser contract
- **Fail**: the route is wrong, the merge mode is wrong, the override loses the natural decision, the continuity block is missing/bloated, or graph metadata still contains stale/unsanitized values

### Failure Triage

Inspect `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts`, `mcp_server/handlers/save/atomic-index-memory.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, and `mcp_server/lib/graph/graph-metadata-parser.ts`

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md](../../feature_catalog/13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md)
- Source files: `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts`, `mcp_server/handlers/save/atomic-index-memory.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, `mcp_server/lib/resume/resume-ladder.ts`, `mcp_server/lib/graph/graph-metadata-parser.ts`

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 202
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md`
