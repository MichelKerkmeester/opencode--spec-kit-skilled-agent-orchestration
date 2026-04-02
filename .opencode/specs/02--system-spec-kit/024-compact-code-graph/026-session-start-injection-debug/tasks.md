---
title: "Tasks: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff"
description: "Implementation tasks for phase 026 — hook-runtime startup injection plus explicit handoff to Phase 027."
trigger_phrases:
  - "026 tasks"
  - "startup injection tasks"
importance_tier: "critical"
contextType: "tracking"
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

- [ ] T001 Add `loadMostRecentState()` to `hook-state.ts` — scan state dir, return newest HookState <24h
- [ ] T002 Add startup-highlight query/helper to `code-graph-db.ts` using the existing schema, not assumed `parent_id` relationships
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `lib/code-graph/startup-brief.ts` with `buildStartupBrief()` — reads graph DB + hook state, returns structured brief
- [ ] T004 Unit verify: `buildStartupBrief()` returns null sections gracefully when DB/state missing
- [ ] T005 Wire `buildStartupBrief()` into Claude `session-prime.ts:handleStartup()`
- [ ] T006 Wire `buildStartupBrief()` into Gemini `gemini/session-prime.ts:handleStartup()`
- [ ] T007 Remove `026` ownership claims over `PrimePackage` / `session_bootstrap` payload changes and point those to `027-opencode-structural-priming`
- [ ] T008 Update packet references so `026-session-start-injection-debug` and `027-opencode-structural-priming` are clearly distinguished
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Claude fresh startup with graph DB → outline + continuity appear
- [ ] T010 Gemini fresh startup → outline appears
- [ ] T011 No graph DB / no prior state → graceful fallback
- [ ] T012 Compaction/resume/clear paths unchanged
- [ ] T013 Packet boundary with `027-opencode-structural-priming` remains explicit after edits
- [ ] T014 Hook timing <500ms via stderr logs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Hook-runtime startup brief documented and verified
- [ ] No regressions on existing hook paths
- [ ] Hookless bootstrap contract ownership handed off to `027-opencode-structural-priming`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
