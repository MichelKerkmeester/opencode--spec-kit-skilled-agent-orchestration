---
title: "Tasks: Manual Testing Playbook Coverage and Run (011) [template:level_2/tasks.md]"
description: "Per-scenario task breakdown for the 011 coverage sync + runner pass."
trigger_phrases:
  - "011 tasks"
  - "phase 011 task list"
  - "playbook coverage tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-manual-testing-playbook-coverage-and-run"
    last_updated_at: "2026-04-25T19:12:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator"
    recent_action: "Tasks file written. 12 task IDs across coverage + runner + scorecard."
    next_safe_action: "Write checklist.md, then start scenario edits."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-init"
      parent_session_id: null
    completion_pct: 12
    open_questions: []
    answered_questions: []
---
# Tasks: Manual Testing Playbook Coverage and Run (011)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Coverage Sync

| Task ID | File | Description | Owner | Status |
|---------|------|-------------|-------|--------|
| T011-1 | `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` | Append "Adversarial path traversal" step (R-007-3) | orchestrator | pending |
| T011-2 | `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` | Append "Multi-file diff boundary" step (R-007-4) | orchestrator | pending |
| T011-3 | `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Append `minConfidence` filter step (R-007-6) | orchestrator | pending |
| T011-4 | `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Append exact-limit overflow detection step (R-007-P2-4) | orchestrator | pending |
| T011-5 | `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Append multi-subject seed preservation step (R-007-P2-5) | orchestrator | pending |
| T011-6 | `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Append `failureFallback.code` enumeration step (R-007-P2-6) | orchestrator | pending |
| T011-7 | `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Append edge `reason`/`step` control-char sanitization step (R-007-P2-3) | orchestrator | pending |
| T011-8 | `manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md` | Append cache-invalidation-on-causal-edge-mutation step (R-007-12) | orchestrator | pending |
| T011-9 | `manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Confirm debug-counters coverage; extend only if missing (R-007-P2-9) | orchestrator | pending |

## Runner + Scorecard

| Task ID | Description | Status |
|---------|-------------|--------|
| T011-10 | Build mcp_server (`tsc`, not `--noEmit`) and run `manual-playbook-runner.ts` 4× with per-scenario filters | pending |
| T011-11 | Aggregate runner JSON outputs into scorecard table in `implementation-summary.md`; classify any FAIL by root cause | pending |
| T011-12 | Regression gate (tsc + vitest + pytest baselines unchanged) + `generate-context.js` canonical save | pending |

---

## Dependencies

- T011-1..T011-9 are independent (different files or different scenario sub-blocks; can be parallelized).
- T011-10 depends on T011-1..T011-9 complete.
- T011-11 depends on T011-10 complete.
- T011-12 depends on T011-11 complete.

---

## Acceptance

- All 12 tasks closed with evidence (file paths + line numbers OR runner output JSON path).
- Scorecard mapped to `spec.md §4 REQ-001..REQ-008` and `§5 SC-001..SC-004`.
