---
title: "Plan [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/014-bm25-field-weight-evaluation/plan]"
description: "1. Map Modus's weighted fields to actual Public lexical fields."
trigger_phrases:
  - "plan"
  - "014"
  - "bm25"
importance_tier: "important"
contextType: "planning"
---
# Plan: 014-bm25-field-weight-evaluation

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts`

## Investigation Order
1. Map Modus's weighted fields to actual Public lexical fields.
2. Baseline current lexical performance and fallback behavior.
3. Define weight-variant experiments and regression checks.
4. Decide whether any tuning belongs in a future packet.

## Experiments
- Create a lexical-only query set where path/title/tag cues matter more than semantic similarity.
- Compare current BM25 behavior against candidate weight tables without altering primary hybrid ranking.
- Measure latency, false positives, and downstream RRF interactions for each candidate.

## Decision Criteria
- Advance only if a candidate improves lexical precision or recovery for specific query classes with no meaningful hybrid regression.
- Reject if the gains are marginal, query-class specific without actionable routing, or too complex to expose safely.

## Exit Condition
Decide whether to preserve current lexical behavior, prototype internal field-weight tuning, or reject BM25 field-weight work for Public.
