---
title: "Fix Delivery vs Progress Routing Confusion - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/routing/content-router.ts:345-352,853-860` contains the new delivery cue bundle and progress-floor guard described in `../research/research.md:26-34`. Evidence: `content-router.ts` now uses the expanded delivery cue bundle plus the `strongDeliveryMechanics` guard around the progress floor.
- [x] Regression tests prove delivery text with implementation verbs no longer defaults to `narrative_progress`. Evidence: `content-router.vitest.ts` routes rollout sequencing and mixed implementation-verbs text to `narrative_delivery`.
- [x] The router still uses the existing category set and tier architecture after the patch. Evidence: `content-router.ts` keeps the same category order, and `content-router.vitest.ts` still asserts the 8-category library.
## P1 (Should Fix)
- [x] `routing-prototypes.json` strengthens the researched delivery/progress boundary without rewriting the entire prototype corpus. Evidence: the refreshed `ND-03` and `ND-04` delivery prototypes are present, and the boundary test still targets only the intended prototype IDs.
- [x] Verification notes show the change fixed cue asymmetry rather than relying on threshold-only tuning. Evidence: the runtime fix is cue-based through `strongDeliveryMechanics` and the delivery cue bundle, not just a threshold tweak.
- [x] `content-router.vitest.ts` covers both the heuristic floor logic and prototype-backed mixed-signal cases. Evidence: the suite covers the mixed-signal heuristic path and the refreshed prototype boundary cases.
## P2 (Advisory)
- [ ] Before/after corpus measurements are captured for the delivery/progress confusion pair.
- [ ] Any future threshold tuning is deferred until after the cue update is measured in isolation.
