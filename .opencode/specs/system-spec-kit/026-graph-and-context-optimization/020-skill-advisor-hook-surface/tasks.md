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

### Implementation Cluster Spawning

- [ ] T007 Scaffold 020/002-advisor-brief-producer (P0)
- [ ] T008 Scaffold 020/003-claude-hook-wiring (P0)
- [ ] T009 Scaffold 020/004-gemini-hook-wiring (P0)
- [ ] T010 Scaffold 020/005-copilot-hook-wiring (P0)
- [ ] T011 Scaffold 020/006-codex-integration (P1 — depends on research finding Q1)
- [ ] T012 Scaffold 020/007-freshness-signal (P0)
- [ ] T013 Scaffold 020/008-documentation (P1)

Exact numbering + count refined by research convergence.

### Implementation Execution

- [ ] T014 Implement each child via `/spec_kit:implement :auto` per the autonomous-completion directive
- [ ] T015 Commit+push after each child completes
- [ ] T016 Mark each child spec doc complete + verified post-implementation
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 019/004 200-prompt corpus: hook top-1 matches direct-CLI top-1 on 100% of prompts (P0)
- [ ] T018 Cross-runtime snapshot tests: identical brief format (P0)
- [ ] T019 Performance: p95 ≤ 50ms, ≤ 80 tokens (P0)
- [ ] T020 Full mcp_server test suite green (P0)
- [ ] T021 Update checklist.md with evidence (P0)
- [ ] T022 Update implementation-summary.md with Dispatch Log + Findings Registry (P0)
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
- Source corpus: `../research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
- Plan dispatch command: `plan.md §4.1`
<!-- /ANCHOR:cross-refs -->
