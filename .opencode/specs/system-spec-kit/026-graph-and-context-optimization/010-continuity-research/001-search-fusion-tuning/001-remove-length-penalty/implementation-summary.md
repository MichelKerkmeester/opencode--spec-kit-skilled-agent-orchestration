---
title: "Implementation Summary: Remove Cross-Encoder Length Penalty"
description: "Neutralizes the cross-encoder length penalty while preserving the request and helper compatibility surfaces."
trigger_phrases:
  - "remove length penalty"
  - "applyLengthPenalty no-op"
  - "cross-encoder length penalty compatibility"
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: 2958485d9f
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-continuity-research/001-search-fusion-tuning/001-remove-length-penalty"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Removed live length-penalty effects while preserving compat"
    next_safe_action: "Retire the applyLengthPenalty flag and cache-key option bit in a dedicated cleanup phase if desired"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
---
# Implementation Summary: Remove Cross-Encoder Length Penalty

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `001-remove-length-penalty` |
| Completed | `2026-04-13` |
| Level | `2` |

## What Was Built

This phase removed the live scoring effect of the cross-encoder length penalty in `mcp_server/lib/search/cross-encoder.ts`. `calculateLengthPenalty()` now returns `1.0`, `applyLengthPenalty()` is a compatibility-preserving no-op, and the Stage 3 call path still accepts `applyLengthPenalty` without changing the public request surface.

The compatibility contract stayed intact on purpose. Tool schemas, handler defaults, and the reranker option path still accept `applyLengthPenalty`, but document length no longer changes reranker output.

## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts` | PASS (`4` files, `126` tests) |

## Notes

- Post-review remediation removed the retired `lp` cache-key discriminator, so compatibility-mode callers now reuse the same reranker cache entry instead of splitting hit-rate across duplicate buckets.
- The helper exports remain available for downstream callers and tests.
