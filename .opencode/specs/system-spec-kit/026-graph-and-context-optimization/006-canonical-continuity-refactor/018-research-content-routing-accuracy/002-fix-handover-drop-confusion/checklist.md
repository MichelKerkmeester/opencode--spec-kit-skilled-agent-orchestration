---
title: "Fix Handover vs Drop Routing Confusion - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `mcp_server/lib/routing/content-router.ts:369-378` clearly distinguishes hard drop wrappers from soft operational commands.
- [ ] `mcp_server/lib/routing/content-router.ts:868-877` preserves or raises `handover_state` when strong stop-state language coexists with soft command mentions.
- [ ] Router regression tests prove handover notes are no longer refused as drop content when the mixed signals are limited to operational commands.
## P1 (Should Fix)
- [ ] `extractHardNegativeFlags()` remains focused on transcript and boilerplate wrappers only.
- [ ] Handover prototypes lead with state, blockers, and next safe action instead of command lists.
- [ ] Verification evidence cites `../research/research.md:40-53` rather than broadening the fix beyond the researched seam.
## P2 (Advisory)
- [ ] Before/after corpus results are captured for the `handover_state -> drop` confusion pair.
- [ ] Any future drop-rule cleanup is tracked separately from this boundary-fix phase.
