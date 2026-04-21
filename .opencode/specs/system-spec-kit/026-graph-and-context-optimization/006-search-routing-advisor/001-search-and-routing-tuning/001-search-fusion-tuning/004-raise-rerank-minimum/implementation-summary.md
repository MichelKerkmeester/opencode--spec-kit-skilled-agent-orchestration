---
title: "Implementation Summary: Raise Minimum Rerank Candidate Threshold"
description: "Raises the Stage 3 rerank gate from 2 results to 4 results and updates the threshold-sensitive regression coverage."
trigger_phrases:
  - "raise rerank minimum"
  - "MIN_RESULTS_FOR_RERANK"
  - "stage3 rerank threshold"
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: 2958485d9f
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Raised the Stage 3 rerank threshold and locked in the 3-row/4-row boundary tests"
    next_safe_action: "Watch continuity-query telemetry to confirm the 4-result cutoff is the right operating point before considering 5"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts"
---
# Implementation Summary: Raise Minimum Rerank Candidate Threshold

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `004-raise-rerank-minimum` |
| Completed | `2026-04-13` |
| Level | `2` |

## What Was Built

This phase raised `MIN_RESULTS_FOR_RERANK` from `2` to `4` in Stage 3 and documented the rationale inline: reranking 2-3 documents spends API and local-model work for very little ordering gain. The update stays scoped to the Stage 3 policy gate rather than the provider-specific reranker implementation.

The regression suite now uses 4-row fixtures for the threshold-sensitive cases and adds explicit boundary assertions proving that 3-row candidate sets skip reranking while 4-row candidate sets still apply it. The same boundary is proven for the local GGUF path as well.

## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts` | PASS (`2` files, `22` tests) |

## Notes

- This threshold change affects both cloud reranking and the local GGUF path, because the Stage 3 minimum gate runs before provider selection.
- Direct cross-encoder module tests stayed outside this policy change.
