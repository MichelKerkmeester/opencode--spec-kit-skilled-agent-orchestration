---
title: "202 -- Canonical continuity save substrate"
description: "This scenario validates canonical continuity save substrate for `202`. It focuses on 8-category routing, anchor merge, atomic save promotion, and the thin `_memory.continuity` block."
audited_post_018: true
---

# 202 -- Canonical continuity save substrate

## 1. OVERVIEW

This scenario validates canonical continuity save substrate for `202`. It focuses on 8-category routing, anchor merge, atomic save promotion, and the thin `_memory.continuity` block.

## 2. SCENARIO CONTRACT


- Objective: Verify 8-category canonical routing, route overrides, anchor-aware merge, atomic promotion, continuity persistence, graph-metadata refresh on every save, and continuity freshness alignment.
- Real user request: `` Please validate Canonical continuity save substrate against contentRouter and tell me whether the expected signals are present: contentRouter chooses the correct category and tier; routeAs can override safely; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; `_memory.continuity` stays thin and readable; every successful save refreshes packet metadata; continuity-freshness stays aligned. ``
- RCAF Prompt: `As a spec-doc record-quality validation operator, validate Canonical continuity save substrate against contentRouter. Verify the live 8-category router chooses the correct category and target; Tier 3 participates by default; routeAs preserves the natural decision for audit; delivery versus progress and handover versus drop stay on the intended side of the boundary; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result; _memory.continuity stays thin and readable; every successful canonical save refreshes packet metadata; and graph-metadata.json plus continuity-freshness output confirm the continuity timestamp is not lagging the metadata write. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: contentRouter chooses the correct category and tier; routeAs can override safely; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; `_memory.continuity` stays thin and readable; every successful save refreshes packet metadata; continuity-freshness stays aligned
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the routed save lands in the correct anchor or safely refuses, the continuity block is preserved, the override/audit path is intact, refreshed graph metadata matches the parser contract, and continuity freshness stays aligned; FAIL if the route is wrong, the merge mode is wrong, the drop boundary is unsafe, the continuity block is missing/bloated, metadata refresh is skipped, or continuity freshness lags

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, verify 8-category routed canonical saves, route overrides, anchor-aware merge, atomic promotion, continuity persistence, metadata refresh on every successful save, and continuity freshness alignment against contentRouter. Verify contentRouter chooses the correct category and tier; Tier 3 participates by default; routeAs preserves the natural decision for audit; delivery versus progress and handover versus drop stay on the intended side of the boundary; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; _memory.continuity stays thin and readable; every successful canonical save refreshes packet metadata; and graph-metadata.json plus continuity-freshness output confirm the continuity timestamp is not lagging the metadata write. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save a progress, delivery, handover, metadata, and drop-like chunk through the canonical writer
2. Confirm `contentRouter` picks the intended category and destination for the merged cases
3. Re-run an ambiguous chunk and confirm the live Tier 3 path participates automatically when the LLM endpoint is available
4. Force a `routeAs` override and confirm the returned decision preserves the natural route for audit
5. Confirm `anchorMergeOperation` uses the correct merge mode and preserves the target anchor
6. Confirm `atomicIndexMemory` writes the canonical output or safely refuses the drop case
7. Read the saved file and confirm `_memory.continuity` is present and thin
8. Read `description.json` and `graph-metadata.json` and confirm both were refreshed by the save
9. Read `graph-metadata.json` and confirm lowercase checklist-aware `status`, sanitized `key_files`, deduplicated entities, and a 12-item trigger cap
10. Run the continuity-freshness validator or fixture and confirm it does not flag the freshly saved packet
11. Confirm the resume ladder can read the saved continuity state

### Expected

contentRouter chooses the correct category and tier; routeAs preserves the natural decision for audit; anchorMergeOperation uses the right mode; atomicIndexMemory writes the canonical result or safe refusal; `_memory.continuity` stays thin and readable; packet metadata refreshes on the save; continuity-freshness stays aligned

### Evidence

Save output, override audit fields, saved doc contents, refusal output for drop, `description.json` plus `graph-metadata.json` contents, continuity-freshness output, and the continuity block readback

### Pass / Fail

- **Pass**: the routed save lands in the correct anchor or safe refusal target, the continuity block is preserved, the override audit fields stay intact, refreshed graph metadata matches the current parser contract, and continuity freshness stays aligned
- **Fail**: the route is wrong, the merge mode is wrong, the override loses the natural decision, the continuity block is missing or bloated, metadata refresh is skipped, or continuity freshness still lags

### Failure Triage

Inspect `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts`, `mcp_server/handlers/save/atomic-index-memory.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, `mcp_server/lib/graph/graph-metadata-parser.ts`, `scripts/core/workflow.ts`, and `scripts/validation/continuity-freshness.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md](../../feature_catalog/13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md)
- Source files: `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts`, `mcp_server/handlers/save/atomic-index-memory.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, `mcp_server/lib/resume/resume-ladder.ts`, `mcp_server/lib/graph/graph-metadata-parser.ts`

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 202
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md`
