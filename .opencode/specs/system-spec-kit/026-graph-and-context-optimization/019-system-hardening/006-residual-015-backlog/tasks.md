---
title: "Tasks: 015 Residuals Restart"
description: "Task list for 19 residuals across 6 clusters."
trigger_phrases: ["015 residuals tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-015-residuals-restart"
    last_updated_at: "2026-04-18T23:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
---
# Tasks: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Phase 1: Setup
- [ ] T001 Read delta review report: ../001-initial-research/002-delta-review-015/review-report.md (P0)

## Phase 2: W0+A — C1 DB boundary + C3 resume minimal

- [ ] T002 Fix realpath escape enforcement in `mcp_server/core/config.ts:55-62` (P1)
- [ ] T003 Fix late-env-override drift at `mcp_server/core/config.ts:83-86` (P1)
- [ ] T004 Fix `session_resume(minimal)` payload contract at `handlers/session-resume.ts:547-640` (P1)
- [ ] T005 Regression tests for T002-T004 (P0)
- [ ] T006 Commit+push W0+A (P0)

## Phase 3: W0+B — C4 review-graph

- [ ] T007 Fix `coverage_gaps` review-graph semantics at `coverage-graph/query.ts:67-68` (P1)
- [ ] T008 Fix `coverage_gaps`/`uncovered_questions` collapse at same location (P1)
- [ ] T009 Fix `status.ts:55-65` fail-open behavior (P2)
- [ ] T010 Regression tests for T007-T009 (P0)
- [ ] T011 Commit+push W0+B (P0)

## Phase 4: W0+C — C2 advisor degraded-state

- [ ] T012 Fix corrupt source-metadata fail-open at `skill_advisor.py:149-170` (P1)
- [ ] T013 Fix continuation-record degraded visibility at `skill_advisor.py:185-216` (P1)
- [ ] T014 Fix cache-health false-green at `skill_advisor_runtime.py:230-303` + `skill_advisor.py:2442-2488` (P1)
- [ ] T015 Regression tests (P0)
- [ ] T016 Commit+push W0+C (P0)

## Phase 5: W0+D — C5 docs + C6 hygiene

- [ ] T017 Update mcp-code-mode README inventory at `README.md:42-44, 257-267, 395-397` (P1+P2)
- [ ] T018 Update folder_routing.md retired memory contract at `:244-250` (P1)
- [ ] T019 Fix folder_routing.md moderate-alignment example at `:398-404` (P2)
- [ ] T020 Update troubleshooting.md at `:51-54` (P2)
- [ ] T021 Document AUTO_SAVE_MODE at `environment_variables.md:106-110` (P2)
- [ ] T022 Fix sk-code-full-stack path at `SKILL.md:57-59` (P2)
- [ ] T023 Fix cli-copilot duplicate merge tail at `integration_patterns.md:310-346` (P2)
- [ ] T024 Fix save-quality-gate whitespace triggers at `:493-497` (P2)
- [ ] T025 Fix session-prime startup-brief hiding at `:34-40` (P2)
- [ ] T026 Run validate.sh --strict to verify doc updates (P0)
- [ ] T027 Commit+push W0+D (P0)

## Phase 6: Verification

- [ ] T028 Full test suite green (P0)
- [ ] T029 Update checklist.md (P0)
- [ ] T030 Update implementation-summary.md (P0)

## Cross-References

- Parent: `../spec.md`
- Source: `../001-initial-research/002-delta-review-015/review-report.md`
