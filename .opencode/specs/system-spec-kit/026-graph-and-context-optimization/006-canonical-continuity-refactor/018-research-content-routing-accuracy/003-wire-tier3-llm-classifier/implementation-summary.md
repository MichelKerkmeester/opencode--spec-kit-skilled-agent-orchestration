<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
---
title: "Implementation Summary: Wire Tier3 LLM Classifier into Save Handler"
description: "This phase turned the frozen Tier 3 contract into a live, env-gated save-path dependency with a real cache, fail-open transport, and natural-routing handler coverage."
trigger_phrases:
  - "phase 003 implementation summary"
  - "tier3 save handler summary"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/003-wire-tier3-llm-classifier"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Wired the env-gated Tier 3 classifier into memory-save, added a concrete router cache, and proved natural-routing fallback behavior"
    next_safe_action: "Observe live Tier 3 latency under real traffic if the packet wants rollout metrics beyond the bounded contract and test-time timeout coverage"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts"
    session_dedup:
      fingerprint: "sha256:018-phase-003-tier3-wiring"
      session_id: "018-phase-003-tier3-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should natural canonical routing stay disabled unless the Tier 3 rollout flag is explicitly enabled"
---
# Implementation Summary: Wire Tier3 LLM Classifier into Save Handler

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-wire-tier3-llm-classifier |
| **Completed** | `2026-04-13` |
| **Level** | `2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase turned the Tier 3 contract from a dormant interface into a real save-path dependency. `memory-save.ts` now reuses the frozen prompt contract from `content-router.ts`, calls an OpenAI-compatible endpoint when `SPECKIT_TIER3_ROUTING=true`, and injects both the classifier and a concrete in-memory router cache into `createContentRouter()`.

### Env-gated classifier and cache wiring

The save handler now builds a Tier 3 request with the contract values already frozen in the router (`gpt-5.4`, low reasoning effort, temperature `0`, max tokens `200`, timeout `2000ms`) and reuses the existing `LLM_REFORMULATION_ENDPOINT` and `LLM_REFORMULATION_API_KEY` transport pattern. `content-router.ts` now exports `InMemoryRouterCache`, and the save handler keeps one shared instance so identical ambiguous chunks can reuse session and spec-folder cache hits.

### Natural routing and fail-open behavior

The canonical save gate now respects the Tier 3 rollout flag even when the caller does not pass an explicit `routeAs`, so natural saves can actually reach the router. Classifier errors, timeout-like throws, null responses, and invalid payloads all fail open back to Tier 2 instead of rejecting the save operation.

### Post-review prompt-context remediation

The post-review follow-up tightened the prompt metadata that accompanies Tier 3 requests. `memory-save.ts` now derives `packet_kind` from the actual spec packet metadata and structure instead of a slash heuristic, while the prompt body distinguishes natural saves from explicit overrides with `save_mode="natural"` versus `save_mode="route-as"`. Handler tests now assert those prompt-body fields directly for root feature, root research, and nested phase packets.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Added the env-gated Tier 3 transport, natural-routing gate, and router dependency injection |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modified | Exported a concrete in-memory router cache and hardened Tier 3 fail-open behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | Modified | Added natural-routing and fail-open save-handler coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modified | Added timeout/fail-open and prototype-backed Tier 3 routing regressions |
| `tasks.md` | Modified | Recorded the completed phase tasks and verification |
| `implementation-summary.md` | Created | Published the phase outcome and evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the router contract instead of inventing a second one. The save handler first gained a small OpenAI-compatible adapter, then a shared in-memory cache was injected at the existing router seam, and finally the canonical save gate was widened so natural saves can reach the router when the rollout flag is on. After that, router-level and handler-level tests locked the cache, timeout, null-response, and natural-routing behavior.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate the live Tier 3 path behind `SPECKIT_TIER3_ROUTING=true` | The new behavior needed an explicit rollout switch so natural canonical routing can be enabled deliberately |
| Reuse `LLM_REFORMULATION_ENDPOINT` and `LLM_REFORMULATION_API_KEY` | The repo already had an OpenAI-compatible transport pattern, so reusing it avoided unnecessary config drift |
| Keep the cache in memory at the save-handler module boundary | Repeated ambiguous chunks should reuse the existing router cache contract without adding storage churn to the save path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-save.vitest.ts` | PASS |
| Natural-routing and fail-open handler coverage | PASS: env-gated natural saves reached Tier 3, and simulated transport failure fell back to Tier 2 without rejecting the save |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This phase proves the bounded transport contract and timeout path, not live production latency.** If rollout tuning needs real latency data, that should come from a follow-on observation pass with the flag enabled in an integration environment.
<!-- /ANCHOR:limitations -->
