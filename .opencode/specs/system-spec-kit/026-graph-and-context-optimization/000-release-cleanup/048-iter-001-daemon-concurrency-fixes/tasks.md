---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: Iteration-001 Daemon Concurrency Fixes [template:level_2/tasks.md]"
description: "Task tracking for the four daemon concurrency fixes (F-001-A1-01..04) plus two new stress test describe blocks."
trigger_phrases:
  - "tasks"
  - "daemon concurrency tasks"
  - "F-001-A1"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/048-iter-001-daemon-concurrency-fixes"
    last_updated_at: "2026-05-01T04:15:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "All tasks complete"
    next_safe_action: "Validate strict + commit"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "iter-001-daemon-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Iteration-001 Daemon Concurrency Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read packet 046 iteration-001 findings table (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/iterations/iteration-001.md`)
- [x] T002 [P] Read product files: `watcher.ts`, `lifecycle.ts`, `generation.ts`, `cache-invalidation.ts`
- [x] T003 [P] Read existing test files: `daemon-freshness-foundation.vitest.ts`, `daemon-lifecycle-stress.vitest.ts`, `chokidar-narrow-scope-stress.vitest.ts`, `generation-cache-invalidation-stress.vitest.ts`
- [x] T004 Scaffold packet 048 via `create.sh --subfolder ... --topic iter-001-daemon-concurrency-fixes --level 2 --skip-branch`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 F-001-A1-01: add `flushPromise` + `drainPending()` while-loop to watcher.ts; expose `flush()` and `suppressGenerationPublication()` on `SkillGraphWatcher` interface (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`)
- [x] T006 F-001-A1-01: gate `processSkill()`'s call to `publishSkillGraphGeneration` behind the new `suppressGenerationPublication` flag (`watcher.ts`)
- [x] T007 F-001-A1-02: reverse shutdown ordering — suppress + flush + close watcher BEFORE final `unavailable` publish (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`)
- [x] T008 F-001-A1-03: token-tagged generation lock with owner-checked release and CAS stale reclamation; export `__testables` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts`)
- [x] T009 F-001-A1-04: monotonic guard in `invalidateSkillGraphCaches()` — drop events whose generation < lastInvalidation.generation (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts`)
- [x] T010 [P] Add `sa-003b` describe block (2 tests: serialized timer drain + close-awaits-flush) to `daemon-lifecycle-stress.vitest.ts`
- [x] T011 [P] Add `sa-007b` describe block (2 tests: A's release no-ops on B's lock + concurrent ownership invariant) to `generation-cache-invalidation-stress.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `npm run build` exits 0 (no TypeScript errors)
- [x] T013 `npx vitest run skill_advisor/tests/daemon-freshness-foundation.vitest.ts` → 20/20 pass
- [x] T014 Targeted stress (4 files) → 13/13 pass (was 9 baseline + 4 new)
- [x] T015 `npm run stress` → exit 0, 56 files / 163 tests
- [x] T016 `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → exit 0
- [x] T017 Stage product files + new packet folder + new tests; commit with all 4 finding IDs in message
- [x] T018 `git push origin main`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exits 0
- [x] `npm run stress` exits 0
- [x] Commit pushed to `origin main`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source findings**: `../046-system-deep-research-bugs-and-improvements/research/iterations/iteration-001.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
