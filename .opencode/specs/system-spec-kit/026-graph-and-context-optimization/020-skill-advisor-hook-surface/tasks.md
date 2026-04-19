---
title: "Tasks: Skill-Advisor Hook Surface"
description: "Task list for 020 umbrella — research wave + implementation cluster spawning."
trigger_phrases:
  - "020 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T06:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"

---
# Tasks: Skill-Advisor Hook Surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete with evidence | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Scaffold 020/001-initial-research Level 2 sub-packet (spec/plan/tasks/checklist/implementation-summary) (P0)
- [ ] T002 Run generate-context.js on 020/ and 020/001/ (P0)
- [ ] T003 Record 019/004 research.md + corpus paths in 020/001 as inputs (P0)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Research Dispatch

- [ ] T004 Dispatch `/spec_kit:deep-research :auto` on hook architecture (P0) — command in plan.md §4.1
- [ ] T005 Monitor convergence; stop vote + graph-convergence signals both allow STOP (P0)
- [ ] T006 Synthesize findings → ranked proposals → cluster-to-child mapping (P0)

### Implementation Cluster Scaffolding (post-convergence, finalized)

- [x] T007 Scaffold 020/002-shared-payload-advisor-contract (P0)
- [x] T008 Scaffold 020/003-advisor-freshness-and-source-cache (P0)
- [x] T009 Scaffold 020/004-advisor-brief-producer-cache-policy (P0)
- [x] T010 Scaffold 020/005-advisor-renderer-and-regression-harness (P0) — HARD GATE
- [x] T011 Scaffold 020/006-claude-hook-wiring (P0)
- [x] T012 Scaffold 020/007-gemini-copilot-hook-wiring (P1)
- [x] T013 Scaffold 020/008-codex-integration-and-hook-policy (P1)
- [x] T013a Scaffold 020/009-documentation-and-release-contract (P1)
- [x] T013b Run `generate-context.js` for each new child + 020 root (P0)

### Implementation Execution (blocked until user triggers each child)

- [ ] T014 Implement 002 via `/spec_kit:implement :auto` (P0)
- [ ] T015 Implement 003 via `/spec_kit:implement :auto` after 002 merges (P0)
- [ ] T016 Implement 004 via `/spec_kit:implement :auto` after 003 merges (P0)
- [ ] T017 Implement 005 via `/spec_kit:implement :auto` after 004 merges (P0) — HARD GATE; must green before T018-T020
- [ ] T018 Implement 006 via `/spec_kit:implement :auto` after 005 gate lifts (P0)
- [ ] T019 Implement 007 via `/spec_kit:implement :auto` after 006 merges (P1) — parallel with T020 allowed
- [ ] T020 Implement 008 via `/spec_kit:implement :auto` after 005 gate lifts (P1) — parallel with T019 allowed
- [ ] T021 Implement 009 via `/spec_kit:implement :auto` after 006/007/008 converge (P1)
- [ ] T022 Commit+push after each child completes
- [ ] T023 Update each child's implementation-summary.md with Files Changed + Verification
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 019/004 200-prompt corpus: hook top-1 matches direct-CLI top-1 on 100% of prompts (P0 — owned by 005)
- [ ] T031 Cross-runtime parity: 4 runtimes produce identical additionalContext per fixture (P0 — owned by 007/008)
- [ ] T032 Performance: p95 cache hit ≤ 50ms, ≤ 80 tokens (P0 — owned by 005)
- [ ] T033 Full mcp_server test suite green (P0)
- [ ] T034 Update checklist.md with evidence (P0)
- [ ] T035 Update implementation-summary.md with Children Convergence Log + release checklist (P0)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks marked `[x]` with evidence
- All proposed children from research convergence implemented
- Regression corpus 100% match; performance budgets honored
- Checklist.md green across all P0 items
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md` (026-graph-and-context-optimization)
- Pattern reference: `../../../../skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- Source corpus: `../research/019-pt-03/corpus/labeled-prompts.jsonl`
- Plan dispatch command: `plan.md §4.1`
<!-- /ANCHOR:cross-refs -->
