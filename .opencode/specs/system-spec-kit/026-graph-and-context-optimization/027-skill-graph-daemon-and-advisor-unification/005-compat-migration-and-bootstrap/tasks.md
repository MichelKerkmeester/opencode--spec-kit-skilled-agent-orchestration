---
title: "027/005 — Tasks"
description: "Task breakdown for compat migration + bootstrap."
importance_tier: "high"
contextType: "implementation"
---
# 027/005 Tasks

## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessor
- [ ] research.md §7 D4/D7/D8 + §13.3 F2/F4/F5
- [ ] 027/004 implementation-summary
- [ ] Inventory callers of skill_advisor.py + plugin bridge

## T003 — Daemon probe (P0)
- [ ] `lib/compat/daemon-probe.ts`
- [ ] Unit tests (present/absent/timeout)

## T004 — Python shim rewrite (P0)
- [ ] `skill_advisor.py`: probe → route-native-or-fallback
- [ ] Preserve `--stdin` mode
- [ ] Preserve disable flag behavior
- [ ] Add `--force-local` / `--force-native` flags

## T005 — Plugin bridge rewire (P0)
- [ ] `.opencode/plugins/spec-kit-skill-advisor.js` delegates to MCP when daemon present
- [ ] `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` delegation logic
- [ ] Preserve Phase 026 SIGKILL + workspace cache key + disable flag fixes

## T006 — Redirect metadata (P0)
- [ ] `lib/compat/redirect-metadata.ts`
- [ ] 4 states: supersession/archive/future/rollback

## T007 — Install guide updates (P0)
- [ ] Daemon bootstrap section
- [ ] Native MCP registration verification
- [ ] Rollback docs (force Python path)

## T008 — Playbook updates (P0)
- [ ] Native path scenarios added
- [ ] Python-shim scenarios preserved
- [ ] Redirect lifecycle scenarios added

## T009 — Integration tests (P1)
- [ ] Shim corpus test (daemon-on)
- [ ] Shim corpus test (daemon-off)
- [ ] Plugin bridge corpus test (daemon-on)
- [ ] Plugin bridge corpus test (daemon-off)

## T010 — Verify
- [ ] Full suite green
- [ ] TS build clean
- [ ] Install-guide walkthrough succeeds (manual)
- [ ] Mark checklist.md [x]

## T011 — Commit + push
