---
title: "Wire Tier3 LLM Classifier into Save Handler - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] The save handler injects a real Tier3 classifier and cache at `mcp_server/handlers/memory-save.ts:1008`.
- [ ] Tier3 calls are fail-open: timeout, null, or invalid responses fall back to Tier2 instead of failing the save path.
- [ ] Natural-routing tests prove Tier3 can run without an explicit `routeAs` override.
## P1 (Should Fix)
- [ ] The adapter reuses the OpenAI-compatible env and timeout pattern from `mcp_server/lib/search/llm-reformulation.ts:185-274`.
- [ ] Router tests cover cache reuse, timeout handling, and null-response behavior for the injected classifier path.
- [ ] The implementation size stays within the rough `90-130` LOC runtime and `70-100` LOC test budget from `../research/research.md:68-71`.
## P2 (Advisory)
- [ ] Tier3 latency observations are captured so future tuning can decide whether extra routing-specific overrides are needed.
- [ ] Any audit or telemetry exposure beyond the core router/save path is tracked as a follow-on rather than folded into this phase.
