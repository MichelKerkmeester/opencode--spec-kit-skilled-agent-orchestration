---
title: "Fix Delivery vs Progress Routing Confusion - Execution Plan"
status: planned
parent_spec: 001-fix-delivery-progress-confusion/spec.md
---
# Execution Plan
## Approach
This phase sharpens the delivery/progress boundary inside the existing three-tier router instead of changing thresholds or adding new categories. The research showed the problem is cue asymmetry: `narrative_progress` has stronger implementation verbs and floor logic than `narrative_delivery`, so delivery mechanics must be strengthened where the router actually scores text.

The work should stay surgical. Update the delivery cue bundle, suppress the progress floor when strong delivery mechanics are present, refresh only the most ambiguous prototypes, and add targeted regression coverage for mixed delivery/progress chunks.

## Steps
1. Expand `RULE_CUES.narrative_delivery` in `mcp_server/lib/routing/content-router.ts:345-352` with the sequencing, gating, same-pass, and verification-order phrases called out in `../research/research.md:18-34,119-125`.
2. Add a shared `strongDeliveryMechanics` guard around the progress and delivery floors in `mcp_server/lib/routing/content-router.ts:853-860`, following the exact regex guidance in `../research/research.md:26-34`.
3. Refresh the most ambiguous delivery/progress prototypes in `mcp_server/lib/routing/routing-prototypes.json:37-85`, especially the `ND-03`, `ND-04`, and `NP-05` overlaps named in `../research/research.md:26-30`.
4. Add regression cases in `mcp_server/tests/content-router.vitest.ts:65-125` for delivery text that still contains implementation verbs, as required by `../research/research.md:93-107,119-125`.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`.
- Re-run the packet's delivery/progress prototype examples and confirm delivery wins when sequencing and verification-order cues are explicit.

## Risks
- Adding too many delivery phrases could blur the boundary with task updates or handover notes if the new cues are not limited to the researched bundle.
- Changing thresholds instead of the cue asymmetry would miss the actual root cause documented in `../research/research.md:18-34`.
- Prototype edits without regression tests would make it hard to prove the heuristic change is responsible for any accuracy lift.
