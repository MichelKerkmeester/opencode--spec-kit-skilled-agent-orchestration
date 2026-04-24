---
title: "Pla [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/018-wake-up-context-layering-study/plan]"
description: "1. Baseline today's bootstrap, resume, and compaction-recovery outputs."
trigger_phrases:
  - "pla"
  - "plan"
  - "018"
  - "wake"
importance_tier: "important"
contextType: "planning"
---
# Plan: 018-wake-up-context-layering-study

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts`

## Investigation Order
1. Baseline today's bootstrap, resume, and compaction-recovery outputs.
2. Define one or two formatter candidates that stay inside current recovery surfaces.
3. Measure recovery quality, token cost, and duplication risk versus the baseline.
4. Decide whether a bounded formatter deserves a future prototype.

## Experiments
- Compare current `session_bootstrap` output against a token-capped wake-up formatter for resume and post-compaction recovery tasks.
- Measure time to first successful follow-up tool use after resume under each candidate.
- Record duplication and contradiction against existing bootstrap hints and retrieved memory blocks.

## Decision Criteria
- Advance only if a formatter improves recovery quality or operator comprehension without meaningfully increasing startup tokens or duplicating current output.
- Reject if the improvement is cosmetic, too expensive in tokens, or pushes toward a second bootstrap authority.

## Exit Condition
Decide whether to prototype a bounded wake-up formatter, defer the idea, or reject it for Public.
