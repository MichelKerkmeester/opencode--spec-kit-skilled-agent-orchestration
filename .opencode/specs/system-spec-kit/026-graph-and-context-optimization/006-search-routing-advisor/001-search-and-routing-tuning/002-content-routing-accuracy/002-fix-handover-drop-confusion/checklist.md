---
title: "Fix Handover vs Drop Routing Confusion - Checklist"
status: complete
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/routing/content-router.ts:409-411` clearly distinguishes hard drop wrappers from soft operational commands. Evidence: `drop` now uses only hard wrapper cues, while handover scoring separately inspects soft operational signals.
- [x] `mcp_server/lib/routing/content-router.ts:1001-1014` preserves or raises `handover_state` when strong stop-state language coexists with soft command mentions. Evidence: `content-router.ts` boosts `handover_state` to `0.88/0.84` when strong handover language is present.
- [x] Router regression tests prove handover notes are no longer refused as drop content when the mixed signals are limited to operational commands. Evidence: `content-router.vitest.ts` keeps mixed stop-state plus command text in `handover_state`.
## P1 (Should Fix)
- [x] `extractHardNegativeFlags()` remains focused on transcript and boilerplate wrappers only. Evidence: it only flags transcript-like, boilerplate, and metadata-like wrapper signals.
- [x] Handover prototypes lead with state, blockers, and next safe action instead of command lists. Evidence: the refreshed `HS-01` and `HS-04` prototype cases emphasize stop-state and resume order, and the boundary test keeps them on the handover side.
- [ ] Verification evidence cites `../../../../research/010-search-and-routing-tuning-pt-02/research.md:40-53` rather than broadening the fix beyond the researched seam.
## P2 (Advisory)
- [ ] Before/after corpus results are captured for the `handover_state -> drop` confusion pair.
- [ ] Any future drop-rule cleanup is tracked separately from this boundary-fix phase.
