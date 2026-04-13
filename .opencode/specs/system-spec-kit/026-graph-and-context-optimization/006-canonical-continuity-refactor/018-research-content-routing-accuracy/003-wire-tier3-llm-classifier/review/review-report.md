---
title: "Phase Review Report: 003-wire-tier3-llm-classifier"
description: "10-iteration deep review of 003-wire-tier3-llm-classifier. Verdict CONDITIONAL with 0 P0 / 2 P1 / 1 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 003-wire-tier3-llm-classifier

## 1. Overview

Ten iterations covered the Tier3 transport hook-up in `memory-save.ts`, the prompt contract in `content-router.ts`, the refusal and fail-open behavior, and the focused `handler-memory-save.vitest.ts` suite. Verdict `CONDITIONAL`: the handler now reaches Tier3, but two prompt-context fields are still inaccurate in the live save path, and the focused tests do not currently guard those fields.

## 2. Findings

### P1

1. The save handler labels any slash-containing `specFolder` as `packet_kind: "phase"`, so root research/remediation packets lose their real kind before `PACKET_KIND` is sent to Tier3. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1165] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1222] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:5]

    {"type":"claim-adjudication","findingId":"F001","claim":"The Tier3 save-handler wiring mislabels non-phase packets as phase before sending PACKET_KIND to the model.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1165",".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1222",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:5"],"counterevidenceSought":"I checked the router implementation itself for any local use of packet_kind and found it is only forwarded into the Tier3 prompt, so the defect is limited to LLM-routed paths rather than Tier1 or Tier2.","alternativeExplanation":"If the model completely ignores PACKET_KIND, the practical impact would be smaller, but the prompt still supplies a systematically wrong context field for research and remediation packets.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if packet_kind is intentionally phase-only metadata for canonical save prompts and the prompt contract is updated to say so."}

2. Natural Tier3 classification still advertises `SAVE_MODE: route-as` even when the save path is inferring a route without any explicit override. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1246]

    {"type":"claim-adjudication","findingId":"F002","claim":"Natural Tier3 save classification is sent to the model as SAVE_MODE=route-as even when no operator override exists.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166",".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1246",".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1223"],"counterevidenceSought":"I re-read the natural-routing tests and the handler path to see whether another field corrected the prompt, but the natural Tier3 test only proves fetch was called and the write succeeded.","alternativeExplanation":"The model may still infer natural routing from the rest of the prompt, but the explicit save_mode field is still false and can bias ambiguous classifications.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if SAVE_MODE=route-as is documented as a generic canonical-routing label rather than an explicit override signal."}

### P2

1. The focused Tier3 handler tests only assert that `fetch()` was called and the routed write succeeded, so prompt-body regressions like the two context defects above can pass green. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1246] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1282]

## 3. Traceability

This is not a “Tier3 is unwired” failure. The live save path does reach Tier3, the focused tests prove transport reachability and fail-open fallback, and the rejection path still protects canonical docs. The contradiction is subtler and more important for a routing-accuracy packet: the handler feeds Tier3 incorrect packet metadata and does not test those fields directly.

## 4. Recommended Remediation

- Derive `packet_kind` from real packet metadata or folder shape rather than `specFolder.includes("/")`, so research and remediation packets are not mislabeled as `phase`.
- Set `save_mode` truthfully for natural Tier3 routing instead of hardcoding `route-as` for every canonical-routing call.
- Extend the focused Tier3 handler tests to decode the outgoing request body and assert `PACKET_KIND` plus `SAVE_MODE` for both natural-routing and fallback scenarios.

## 5. Cross-References

- Focused handler verification remained green: `npm exec vitest run tests/handler-memory-save.vitest.ts`.
- The Tier3 prompt consumes `PACKET_KIND` and `SAVE_MODE` at `mcp_server/lib/routing/content-router.ts:1222-1224`.
- The natural-routing handler test at `mcp_server/tests/handler-memory-save.vitest.ts:1246-1257` proves fetch reachability but does not inspect the request payload.
