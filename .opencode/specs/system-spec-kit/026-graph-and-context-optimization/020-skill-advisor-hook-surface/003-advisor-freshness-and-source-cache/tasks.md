---
title: "Tasks: Advisor Freshness + Source Cache"
description: "Task list for 020/003 — three new lib files + tests + gitignore."
trigger_phrases:
  - "020 003 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 002 converges"
    blockers: ["002-shared-payload-advisor-contract"]
    key_files: []

---
# Tasks: Advisor Freshness + Source Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity | [B] blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Verify predecessor 002 merged (shared-payload advisor contract)
- [ ] T002 [P0] Read `lib/code-graph/freshness.ts` for pattern reference
- [ ] T003 [P0] Read research.md §Pattern Parallel Map + research-extended.md §X7 + §X8
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P0] Create `mcp_server/lib/skill-advisor/` directory
- [ ] T005 [P0] Define `AdvisorFreshnessResult` type in `freshness.ts`
- [ ] T006 [P0] Implement source walk over authority list in `freshness.ts`
- [ ] T007 [P0] Implement state mapping (live/stale/absent/unavailable) in `freshness.ts`
- [ ] T008 [P0] Implement per-skill fingerprint map (SKILL.md mtime+size + graph-metadata.json mtime)
- [ ] T009 [P0] Implement 15-min LRU in `source-cache.ts`
- [ ] T010 [P0] Implement generation counter with temp+rename atomic write in `generation.ts`
- [ ] T011 [P0] Wire cache + generation into `getAdvisorFreshness()` entry point
- [ ] T012 [P0] Add `.opencode/skill/.advisor-state/` to `.gitignore`
- [ ] T013 [P1] Populate `diagnostics.reason` for every non-`live` state
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 [P0] Write 8 acceptance scenarios in `advisor-freshness.vitest.ts`
- [ ] T015 [P0] Run `vitest run advisor-freshness` green
- [ ] T016 [P0] Run existing `code-graph-freshness*.vitest.ts` suite (no regression)
- [ ] T017 [P0] Run `tsc --noEmit` clean
- [ ] T018 [P0] Bench cold vs warm probe; record p50/p95/p99 in implementation-summary.md
- [ ] T019 [P0] Mark all P0 checklist items `[x]` with evidence
- [ ] T020 [P0] Update implementation-summary.md with Files Changed + Verification
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks marked `[x]` with evidence
- 8 acceptance scenarios green
- Latency benchmarks recorded
- Child 004 can now depend on freshness API
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessor: `../002-shared-payload-advisor-contract/`
- Pattern: `../../../../../skill/system-spec-kit/mcp_server/lib/code-graph/freshness.ts`
<!-- /ANCHOR:cross-refs -->
