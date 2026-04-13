---
title: "Fix Delivery vs Progress Routing Confusion - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `mcp_server/lib/routing/content-router.ts:345-352,853-860` contains the new delivery cue bundle and progress-floor guard described in `../research/research.md:26-34`.
- [ ] Regression tests prove delivery text with implementation verbs no longer defaults to `narrative_progress`.
- [ ] The router still uses the existing category set and tier architecture after the patch.
## P1 (Should Fix)
- [ ] `routing-prototypes.json` strengthens the researched delivery/progress boundary without rewriting the entire prototype corpus.
- [ ] Verification notes show the change fixed cue asymmetry rather than relying on threshold-only tuning.
- [ ] `content-router.vitest.ts` covers both the heuristic floor logic and prototype-backed mixed-signal cases.
## P2 (Advisory)
- [ ] Before/after corpus measurements are captured for the delivery/progress confusion pair.
- [ ] Any future threshold tuning is deferred until after the cue update is measured in isolation.
