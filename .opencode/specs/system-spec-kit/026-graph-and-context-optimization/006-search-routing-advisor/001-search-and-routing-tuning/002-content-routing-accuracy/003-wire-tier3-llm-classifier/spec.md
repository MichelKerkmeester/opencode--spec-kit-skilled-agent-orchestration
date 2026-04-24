---
title: "...search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier/spec]"
description: 'title: "Wire Tier3 LLM Classifier into Save Handler"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "003"
  - "wire"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
created: 2026-04-12
level: 2
parent: 002-content-routing-accuracy
status: complete
type: implementation
---
# Wire Tier3 LLM Classifier into Save Handler

## Scope

Connect the existing Tier3 LLM classifier to the memory-save handler. The classifier already exists in `content-router.ts` but is never called from the save path, leaving all routing decisions to Tier1/Tier2 heuristics.

## Key Files

- `mcp_server/handlers/memory-save.ts` (integration point around line 1008)
- `mcp_server/lib/routing/content-router.ts` (Tier3 classifier around line 518)

## Out of Scope

- Modifying the Tier3 classifier logic itself.
- Adding new LLM providers or changing the model used for classification.
