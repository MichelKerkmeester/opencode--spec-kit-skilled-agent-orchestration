---
title: "Tasks [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/tasks]"
description: "Task list for 020 umbrella — research wave + implementation cluster spawning."
trigger_phrases:
  - "026/009/001 tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
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

- [x] T001 Scaffold 020/001-initial-research Level 2 sub-packet (spec/plan/tasks/checklist/implementation-summary) (P0) [Evidence: sub-phase summaries merged into `implementation-summary.md` §Sub-phase summaries §001-initial-research.]
- [x] T002 Run generate-context.js on 020/ and 020/001/ (P0) [Evidence: child metadata and graph files present in 020/001.]
- [x] T003 Record 019/004 research.md + corpus paths in 020/001 as inputs (P0) [Evidence: parent spec and 005 parity summary cite the 019/004 200-prompt corpus.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Research Dispatch

- [x] T004 Dispatch `/spec_kit:deep-research :auto` on hook architecture (P0) — command in plan.md §4.1 [Evidence: 020/001 wave-1, wave-2 and wave-3 summaries in parent implementation-summary dispatch log.]
- [x] T005 Monitor convergence; stop vote + graph-convergence signals both allow STOP (P0) [Evidence: 020/001 wave-3 converged early at 2026-04-19T10:53:06Z.]
- [x] T006 Synthesize findings → ranked proposals → cluster-to-child mapping (P0) [Evidence: children 002-009 scaffolded and implemented.]

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

- [x] T014 Implement 002 via `/spec_kit:implement :auto` (P0) [Evidence: `implementation-summary.md` §Sub-phase summaries §002-shared-payload-advisor-contract, commit `9c5fa135b4`.]
- [x] T015 Implement 003 via `/spec_kit:implement :auto` after 002 merges (P0) [Evidence: `implementation-summary.md` §Sub-phase summaries §003-advisor-freshness-and-source-cache, commit `5f081f71e9`.]
- [x] T016 Implement 004 via `/spec_kit:implement :auto` after 003 merges (P0) [Evidence: `implementation-summary.md` §Sub-phase summaries §004-advisor-brief-producer-cache-policy, commit `25c8976e98`.]
- [x] T017 Implement 005 via `/spec_kit:implement :auto` after 004 merges (P0) — HARD GATE; must green before T018-T020 [Evidence: `implementation-summary.md` §Sub-phase summaries §005-advisor-renderer-and-regression-harness, commit `e19bf2e213`.]
- [x] T018 Implement 006 via `/spec_kit:implement :auto` after 005 gate lifts (P0) [Evidence: `implementation-summary.md` §Sub-phase summaries §006-claude-hook-wiring, commit `6d4b41a9f6`.]
- [x] T019 Implement 007 via `/spec_kit:implement :auto` after 006 merges (P1) — parallel with T020 allowed [Evidence: `implementation-summary.md` §Sub-phase summaries §007-gemini-copilot-hook-wiring, commit `11ad3e8a5f`.]
- [x] T020 Implement 008 via `/spec_kit:implement :auto` after 005 gate lifts (P1) — parallel with T019 allowed [Evidence: `implementation-summary.md` §Sub-phase summaries §008-codex-integration-and-hook-policy, commit `8dc1bd065b`.]
- [x] T021 Implement 009 via `/spec_kit:implement :auto` after 006/007/008 converge (P1) [Evidence: `implementation-summary.md` §Sub-phase summaries §009-documentation-and-release-contract.]
- [x] T022 Commit+push after each child completes [Evidence: commits for 002-008 are on `main`; 009 intentionally uncommitted per user instruction.]
- [x] T023 Update each child's implementation-summary.md with Files Changed + Verification [Evidence: 002-008 summaries populated; 009 summary updated in this workspace.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 019/004 200-prompt corpus: hook top-1 matches direct-CLI top-1 on 100% of prompts (P0 — owned by 005) [Evidence: `advisor-corpus-parity.vitest.ts` 200/200 in 005 summary.]
- [x] T031 Cross-runtime parity: 4 runtimes produce identical additionalContext per fixture (P0 — owned by 007/008) [Evidence: `advisor-runtime-parity.vitest.ts` covers Claude, Gemini, Copilot and Codex.]
- [x] T032 Performance: p95 cache hit ≤ 50ms, ≤ 80 tokens (P0 — owned by 005) [Evidence: cache-hit p95 `0.016 ms`, default brief cap `80` in 005 and reference doc.]
- [ ] T033 Full mcp_server test suite green (P0) [Evidence pending T9 integration gauntlet.]
- [x] T034 Update checklist.md with evidence (P0) [Evidence: 009 checklist updated in this workspace.]
- [x] T035 Update implementation-summary.md with Children Convergence Log + release checklist (P0) [Evidence: parent implementation-summary release prep complete.]

### Battle Plan Dispatch Log

| Battle Plan Task | Status | Completion Timestamp (UTC) | Evidence |
|------------------|--------|----------------------------|----------|
| T1 — 020/002 contract | Complete | 2026-04-19T13:05:00Z | `implementation-summary.md` §Sub-phase summaries §002-shared-payload-advisor-contract |
| T2 — 020/003 freshness | Complete | 2026-04-19T09:30:00Z | `implementation-summary.md` §Sub-phase summaries §003-advisor-freshness-and-source-cache |
| T3 — 020/004 producer | Complete | 2026-04-19T15:33:00Z | `implementation-summary.md` §Sub-phase summaries §004-advisor-brief-producer-cache-policy |
| T4 — 020/005 hard gate | Complete | 2026-04-19T15:51:00Z | `implementation-summary.md` §Sub-phase summaries §005-advisor-renderer-and-regression-harness |
| T5 — 020/006 Claude | Complete | 2026-04-19T14:04:00Z | `implementation-summary.md` §Sub-phase summaries §006-claude-hook-wiring |
| T6 — 020/007 Gemini and Copilot | Complete | 2026-04-19T14:25:00Z | `implementation-summary.md` §Sub-phase summaries §007-gemini-copilot-hook-wiring |
| T7 — 020/008 Codex | Complete | 2026-04-19T16:40:00Z | `implementation-summary.md` §Sub-phase summaries §008-codex-integration-and-hook-policy |
| T8 — 020/009 docs and release | Complete | 2026-04-19T14:51:54Z | `implementation-summary.md` §Sub-phase summaries §009-documentation-and-release-contract |
| T9 — integration gauntlet | Pending | TBD | Next dispatch |
| T10 — release sign-off | Pending | TBD | After T9 |
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
- Source corpus: `../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- Plan dispatch command: `plan.md §4.1`
<!-- /ANCHOR:cross-refs -->
