---
title: "Fix Delivery vs Progress Routing Confusion - Tasks"
status: complete
---
# Tasks
- [x] T-01: Expand `RULE_CUES.narrative_delivery` in `mcp_server/lib/routing/content-router.ts:345-352` with the sequencing and verification-order terms from `../research/research.md:22-34`.
- [x] T-02: Add a shared `strongDeliveryMechanics` regex and use it to gate the progress floor in `mcp_server/lib/routing/content-router.ts:853-857` while boosting delivery in `mcp_server/lib/routing/content-router.ts:859-860`.
- [x] T-03: Refresh the ambiguous delivery/progress prototypes in `mcp_server/lib/routing/routing-prototypes.json:37-85`, especially the examples identified in `../research/research.md:26-30`.
- [x] T-04: Add regression tests in `mcp_server/tests/content-router.vitest.ts:65-125` for delivery chunks that still contain implementation verbs.
- [x] T-05: Re-run the affected prototype corpus after the heuristic change and record whether the old `narrative_delivery -> narrative_progress` confusion pair is closed.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`
