---
title: "...h-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier/checklist]"
description: 'title: "Wire Tier3 LLM Classifier into Save Handler - Checklist"'
trigger_phrases:
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "and"
  - "checklist"
  - "003"
  - "wire"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
status: complete
---
# Verification Checklist
## P0 (Blocking)
- [x] The save handler injects a real Tier3 classifier and cache at `mcp_server/handlers/memory-save.ts:1008`. Evidence: `memory-save.ts` builds the router with `classifyWithTier3Llm` and `tier3RoutingCache`.
- [x] Tier3 calls are fail-open: timeout, null, or invalid responses fall back to Tier2 instead of failing the save path. Evidence: `classifyWithTier3Llm()` returns `null` for missing config, bad responses, and caught errors, and `handler-memory-save.vitest.ts` covers the fail-open path.
- [x] Natural-routing tests prove Tier3 can run without an explicit `routeAs` override. Evidence: `handler-memory-save.vitest.ts` exercises natural routing to Tier 3 with no `routeAs` and inspects the outbound prompt body.
## P1 (Should Fix)
- [x] The adapter reuses the OpenAI-compatible env and timeout pattern from `mcp_server/lib/search/llm-reformulation.ts:185-274`. Evidence: `memory-save.ts` uses `/chat/completions`, bearer auth, `AbortController`, timeout cleanup, and OpenAI-style JSON message bodies.
- [x] Router tests cover cache reuse, timeout handling, and null-response behavior for the injected classifier path. Evidence: `content-router.vitest.ts` covers cache reuse, timeout fallback, and null-response handling for Tier 3 injection.
- [ ] The implementation size stays within the rough `90-130` LOC runtime and `70-100` LOC test budget from `../research/research.md:68-71`.
## P2 (Advisory)
- [ ] Tier3 latency observations are captured so future tuning can decide whether extra routing-specific overrides are needed.
- [ ] Any audit or telemetry exposure beyond the core router/save path is tracked as a follow-on rather than folded into this phase.
