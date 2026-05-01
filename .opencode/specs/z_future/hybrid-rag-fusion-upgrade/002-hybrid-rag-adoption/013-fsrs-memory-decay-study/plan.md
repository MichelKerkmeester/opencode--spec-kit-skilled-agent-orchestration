---
title: "Plan: 013 [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/013-fsrs-memory-decay-study/plan]"
description: "1. Baseline current scheduler constants, multiplier tables, and search-time decay behavior."
trigger_phrases:
  - "plan"
  - "013"
  - "fsrs"
importance_tier: "important"
contextType: "planning"
---
# Plan: 013-fsrs-memory-decay-study

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`

## Investigation Order
1. Baseline current scheduler constants, multiplier tables, and search-time decay behavior.
2. Define candidate study variants without changing runtime defaults.
3. Use review-oriented and judged-retrieval fixtures to compare candidate variants.
4. Decide whether any default change deserves a follow-on implementation packet.

## Experiments
- Run offline comparisons of current multipliers versus candidate variants across representative memory tiers and context types.
- Measure retrieval quality, review burden, and due-state drift risk under each candidate.
- Compare persisted-versus-derived due-state assumptions without introducing a live queue.

## Decision Criteria
- Advance only if a candidate improves judged retrieval or review quality without creating queue drift, surprise archival behavior, or write-on-read side effects.
- Keep current defaults if evidence is mixed or depends on a not-yet-shipped `memory_review` workflow.

## Exit Condition
Decide whether to preserve current FSRS defaults, open a tightly-scoped tuning packet, or reject decay-default changes for now.
