---
title: "Wire Tier3 LLM Classifier into Save Handler - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Reuse the Existing OpenAI-Compatible Env Contract for Tier3
**Context:** `../research/research.md:59-71` found there is no production Tier3 client yet, and `../research/research.md:68-71` explicitly calls out the env-contract choice as the main remaining design decision for this phase.
**Decision:** Reuse the OpenAI-compatible endpoint, timeout, and credential pattern already implemented in `mcp_server/lib/search/llm-reformulation.ts:185-274` when wiring the Tier3 classifier.
**Rationale:** Reusing the existing pattern minimizes new configuration surface, keeps failure handling consistent, and matches the repo's current approach for small LLM helper calls.
**Consequences:** Tier3 will share the same base credential and timeout behavior as the existing helper path, routing-specific overrides become an optional future enhancement, and the save handler must stay fail-open if that shared endpoint is unavailable.
