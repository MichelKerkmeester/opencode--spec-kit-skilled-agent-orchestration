---
title: "Wire Tier3 LLM Classifier into Save Handler"
status: complete
level: 2
type: implementation
parent: 002-content-routing-accuracy
created: 2026-04-12
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
