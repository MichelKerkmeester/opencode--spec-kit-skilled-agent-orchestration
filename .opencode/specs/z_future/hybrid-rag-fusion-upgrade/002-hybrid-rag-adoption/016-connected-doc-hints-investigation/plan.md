---
title: "...ystem-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/016-connected-doc-hints-investigation/plan]"
description: "1. Baseline current result presentation, graph neighbors, and causal context."
trigger_phrases:
  - "ystem"
  - "spec"
  - "kit"
  - "future"
  - "hybrid"
  - "plan"
  - "016"
  - "connected"
importance_tier: "important"
contextType: "planning"
---
# Plan: 016-connected-doc-hints-investigation

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts`

## Investigation Order
1. Baseline current result presentation, graph neighbors, and causal context.
2. Define appendix-only hint candidates and trigger conditions.
3. Measure judged usefulness, duplication rate, and latency for each candidate.
4. Decide whether a flag-only appendix is worth a future prototype.

## Experiments
- Compare current result presentation versus appendix-only hint variants on weak-result and debug-oriented queries.
- Measure duplication against graph/causal surfaces and classify contradictory hint cases.
- Record operator trust signals based on explicit low-authority labeling.

## Decision Criteria
- Advance only if hint appendices improve follow-up navigation or trust without confusing ranked results or duplicating stronger semantic surfaces.
- Reject if the idea mainly recreates existing graph or causal outputs with weaker semantics.

## Exit Condition
Decide whether to prototype a flag-only connected-doc appendix, keep the idea deferred, or reject it for Public.
