---
title: "Tasks: Advisor Brief Producer + Cache Policy"
description: "Task list for 020/004 — 4 new lib files + 4 test files + integration."
trigger_phrases:
  - "020 004 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 003 converges"
    blockers: ["002-shared-payload-advisor-contract", "003-advisor-freshness-and-source-cache"]
    key_files: []

---
# Tasks: Advisor Brief Producer + Cache Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Verify predecessors 002 + 003 merged — `git cat-file -t 47b805f7b && git cat-file -t be32b1fe5`
- [x] T002 [P0] Read research.md §Failure Modes + §Cross-Runtime Testing + Privacy
- [x] T003 [P0] Read research-extended.md §X1 §X5 §X7 (prompt poisoning, migration)
- [x] T004 [P0] Read `lib/code-graph/startup-brief.ts` for orchestration shape
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Policy + Cache + Subprocess

- [x] T005 [P0] Create `mcp_server/lib/skill-advisor/prompt-policy.ts` with `shouldFireAdvisor()`
- [x] T006 [P0] Wire NFKC canonical fold from `shared/unicode-normalization.ts`
- [x] T007 [P0] Write `advisor-prompt-policy.vitest.ts` with 6 prompt-class tests — PASS 6/6
- [x] T008 [P0] Create `mcp_server/lib/skill-advisor/prompt-cache.ts` with HMAC LRU
- [x] T009 [P0] Derive session-secret from PID + launch time
- [x] T010 [P0] Write `advisor-prompt-cache.vitest.ts` (TTL, signature invalidation, HMAC opacity) — PASS 3/3
- [x] T011 [P0] Create `mcp_server/lib/skill-advisor/subprocess.ts` with `runAdvisorSubprocess()`
- [x] T012 [P0] Implement 1000ms timeout + SIGKILL + strict JSON parse
- [x] T013 [P0] Implement SQLite-busy single retry (75-125ms, ≥500ms budget)
- [x] T014 [P0] Write `advisor-subprocess.vitest.ts` (timeout, parse fail, retry) — PASS 5/5
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### Producer Orchestration

- [x] T015 [P0] Create `mcp_server/lib/skill-advisor/skill-advisor-brief.ts` with `buildSkillAdvisorBrief()`
- [x] T016 [P0] Define `AdvisorHookResult`, `AdvisorHookDiagnostics`, `AdvisorHookMetrics` types
- [x] T017 [P0] Wire envelope from 002 (`createSharedPayloadEnvelope({ producer: 'advisor' })`)
- [x] T018 [P0] Enforce token caps (80 default / 120 hard cap; no 60-token floor)
- [x] T019 [P0] Implement deleted-skill suppression (check fingerprint map before rendering cached)
- [x] T020 [P1] Implement metalinguistic skill-name diagnostic (log `sk-*` mentions)
- [x] T021 [P0] Write `advisor-brief-producer.vitest.ts` with 10 acceptance scenarios — PASS 12/12
<!-- /ANCHOR:phase-3 -->

## Phase 3: Verification

- [x] T022 [P0] Run all 4 advisor-*.vitest.ts suites green — PASS 26/26
- [x] T023 [P0] Run `tsc --noEmit` clean — PASS
- [x] T024 [P0] Bench warm-cache producer p95 ≤ 10 ms — PASS, p95 0.452 ms
- [x] T025 [P0] Bench cold (subprocess) producer p95 ≤ 1100 ms — PASS, p95 58.373 ms
- [x] T026 [P0] Privacy audit: `grep` tests for raw prompt string leakage — PASS, none found
- [x] T027 [P0] Mark all P0 checklist items `[x]` with evidence
- [x] T028 [P0] Update implementation-summary.md with Files Changed + bench results
<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks marked `[x]`
- 10 acceptance scenarios in producer suite green
- No raw-prompt string found in persisted test state
- Child 005 can now depend on `buildSkillAdvisorBrief()` for renderer input
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessors: `../002-shared-payload-advisor-contract/`, `../003-advisor-freshness-and-source-cache/`
- Pattern: `../../../../../skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- NFKC: `../../../../../skill/system-spec-kit/shared/unicode-normalization.ts`
- Advisor: `../../../../../skill/skill-advisor/scripts/skill_advisor.py`
<!-- /ANCHOR:cross-refs -->
