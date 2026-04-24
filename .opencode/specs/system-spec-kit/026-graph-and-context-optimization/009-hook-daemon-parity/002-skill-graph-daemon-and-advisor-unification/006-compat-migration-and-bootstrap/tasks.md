---
title: "...ation/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap/tasks]"
description: "Task breakdown for compat migration + bootstrap."
trigger_phrases:
  - "027/005 tasks"
  - "compat migration tasks"
  - "advisor bootstrap tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level_2/tasks.md | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap"
    last_updated_at: "2026-04-20T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed tasks"
    next_safe_action: "Commit without pushing"
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/plugins/spec-kit-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:027005tasks000000000000000000000000000000000000000000000000000"
      session_id: "027-005-compat-migration-r01"
      parent_session_id: "027-005-scaffold-r01"
    completion_pct: 100
    open_questions: []
    answered_questions: []
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
---
# Tasks: 027/005

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/tasks.md | v2.2 -->

<!-- ANCHOR:task-notation -->
## Task Notation

- `[x]` complete with evidence in checklist or implementation summary.
- `[ ]` deferred or pending.
<!-- /ANCHOR:task-notation -->

<!-- ANCHOR:scaffold -->
## T001 — Scaffold
- [x] Packet files written
<!-- /ANCHOR:scaffold -->

<!-- ANCHOR:research-predecessor -->
## T002 — Read research + predecessor
- [x] Research §7 D4/D7/D8 + §13.3 F2/F4/F5 — confirmed native TS primary, Python compat, plugin adapter, redirect/status, rollback, archive/future, and H5 operator requirements
- [x] 027/004 implementation-summary — confirmed `advisor_recommend` / `advisor_status` / `advisor_validate` tool surfaces
- [x] Inventory callers of skill_advisor.py + plugin bridge — reviewed Python shim, runtime, graph compiler, OpenCode plugin host, and bridge process
<!-- /ANCHOR:research-predecessor -->

<!-- ANCHOR:daemon-probe -->
## T003 — Daemon probe (P0)
- [x] `lib/compat/daemon-probe.ts`
- [x] Unit tests (present/absent/disabled) — `daemon-probe.vitest.ts`
<!-- /ANCHOR:daemon-probe -->

<!-- ANCHOR:python-shim -->
## T004 — Python shim rewrite (P0)
- [x] `skill_advisor.py`: probe -> route-native-or-fallback
- [x] Preserve `--stdin` mode — smoke tested with native route
- [x] Preserve disable flag behavior — `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` returns `[]`
- [x] Add `--force-local` / `--force-native` flags — smoke tested both paths
<!-- /ANCHOR:python-shim -->

<!-- ANCHOR:plugin-bridge -->
## T005 — Plugin bridge rewire (P0)
- [x] `.opencode/plugins/spec-kit-skill-advisor.js` delegates to MCP when daemon present through bridge native route
- [x] `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` delegation logic
- [x] Preserve Phase 026 SIGKILL + workspace cache key + disable flag fixes — host retained escalation/cache wiring and bridge honors shared disable flag
<!-- /ANCHOR:plugin-bridge -->

<!-- ANCHOR:redirect-metadata -->
## T006 — Redirect metadata (P0)
- [x] `lib/compat/redirect-metadata.ts`
- [x] 4 states: supersession/archive/future/rollback — `redirect-metadata.vitest.ts`
<!-- /ANCHOR:redirect-metadata -->

<!-- ANCHOR:install-guide -->
## T007 — Install guide updates (P0)
- [x] Daemon bootstrap section — native bootstrap guide
- [x] Native MCP registration verification — `advisor_status` / `advisor_recommend` / `advisor_validate` checks documented
- [x] Rollback docs (force Python path) — `--force-local` and disable flag documented
<!-- /ANCHOR:install-guide -->

<!-- ANCHOR:playbook -->
## T008 — Playbook updates (P0)
- [x] Native path scenarios added — NC-001 / NC-004
- [x] Python-shim scenarios preserved — NC-002 / NC-003
- [x] Redirect lifecycle scenarios added — NC-005 plus H5 operator states
<!-- /ANCHOR:playbook -->

<!-- ANCHOR:integration-tests -->
## T009 — Integration tests (P1)
- [x] Shim corpus test (daemon-on) — `shim.vitest.ts` native route
- [x] Shim corpus test (daemon-off) — `shim.vitest.ts` force-local route
- [x] Plugin bridge corpus test (daemon-on) — `plugin-bridge.vitest.ts` native route
- [x] Plugin bridge corpus test (daemon-off) — `plugin-bridge.vitest.ts` force-local route
<!-- /ANCHOR:integration-tests -->

<!-- ANCHOR:verification -->
## T010 — Verify
- [x] Full suite green — targeted advisor vitest: 13 files / 96 tests passed
- [x] TS build clean — `npm run typecheck` and `npm run build` passed
- [x] Install-guide walkthrough succeeds (manual) — documented commands smoke-tested via CLI matrix
- [x] Mark checklist.md [x]
<!-- /ANCHOR:verification -->

<!-- ANCHOR:commit -->
## T011 — Commit + push
- [x] Commit prepared; push intentionally skipped per user instruction
<!-- /ANCHOR:commit -->
