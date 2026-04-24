---
title: "Tasks: Startup Context Injection [system-spec-kit/024-compact-code-graph/026-session-start-injection-debug/tasks]"
description: "Implementation tasks for phase 026 — hook-runtime startup injection plus explicit handoff to Phase 027."
trigger_phrases:
  - "026 tasks"
  - "startup injection tasks"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/026-session-start-injection-debug"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add `loadMostRecentState()` to `hook-state.ts` — scan state dir, return newest HookState <24h
- [x] T002 Add startup-highlight query/helper to `code-graph-db.ts` using the existing schema, not assumed `parent_id` relationships
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create `lib/code-graph/startup-brief.ts` with `buildStartupBrief()` — reads graph DB + hook state, returns structured brief
- [x] T004 Unit verify: `buildStartupBrief()` returns null sections gracefully when DB/state missing
- [x] T005 Wire `buildStartupBrief()` into Claude `session-prime.ts:handleStartup()`
- [x] T006 Wire `buildStartupBrief()` into Gemini `gemini/session-prime.ts:handleStartup()`
- [x] T007 Remove `026` ownership claims over `PrimePackage` / `session_bootstrap` payload changes and point those to `027-opencode-structural-priming`
- [x] T008 Update packet references so `026-session-start-injection-debug` and `027-opencode-structural-priming` are clearly distinguished
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Claude fresh startup with graph DB → outline + continuity appear [SOURCE: tests/startup-brief.vitest.ts:49-91, hooks/claude/session-prime.ts:handleStartup()]
- [x] T010 Gemini fresh startup → outline appears [SOURCE: tests/startup-brief.vitest.ts:49-91, hooks/gemini/session-prime.ts:handleStartup()]
- [x] T011 No graph DB / no prior state → graceful fallback
- [x] T012 Compaction/resume/clear paths unchanged
- [x] T013 Packet boundary with `027-opencode-structural-priming` remains explicit after edits
- [x] T014 Hook timing bounded by HOOK_TIMEOUT_MS=1800ms [SOURCE: hooks/claude/shared.ts:HOOK_TIMEOUT_MS]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Hook-runtime startup brief documented and verified
- [x] No regressions on existing hook paths
- [x] Hookless bootstrap contract ownership handed off to `027-opencode-structural-priming`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
