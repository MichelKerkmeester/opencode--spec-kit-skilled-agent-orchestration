<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: 062 — Executable Wiring"
description: "T-001..T-024 across 6 stages."
trigger_phrases: ["062 tasks"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring"
    last_updated_at: "2026-05-02T14:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Stages 2-6 implemented"
    next_safe_action: "Run 061 command-flow stress tests"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 062 — Executable Wiring

<!-- SPECKIT_LEVEL: 3 -->

## Stage 1 — Scaffold
- T-001 Author 8 markdown files — done in Stage 1
- T-002 Bootstrap description.json + graph-metadata.json — done in Stage 1
- T-003 Strict-validate — exit 2 at wrap with template header/anchor errors only

## Stage 2 — Static Assets + Materializer
- T-004 Create benchmark-profiles/default.json — done
- T-005 Create 2-3 benchmark-fixtures/*.json — done
- T-006 Author materialize-benchmark-fixtures.cjs — done

## Stage 3 — Run-Benchmark + YAML Lockstep
- T-007 Modify run-benchmark.cjs to consume materialized fixtures + emit report.json — done
- T-008 Patch auto YAML benchmark step — done
- T-009 Patch confirm YAML benchmark step (lockstep) — done
- T-010 Add benchmark_run state-log row — done

## Stage 4 — Legal-Stop + Reducer + Stop-Reason
- T-011 Patch both YAMLs for nested legal_stop_evaluated.details.gateResults — done
- T-012 Update reduce-state.cjs to consume nested shape — done
- T-013 Update improvement-journal.cjs validation — done
- T-014 Reconcile stop-reason enum (SKILL canonical) — done, Option A
- T-015 Update existing tests for new shapes — done

## Stage 5 — Native RT + SKILL Docs
- T-016 Audit + reconcile RT-028 / RT-032 scenarios — done
- T-017 Run RT-028 + RT-032 end-to-end (confirm GREEN) — helper/static checks green; full command-flow run deferred to 061
- T-018 Update SKILL.md docs — done

## Stage 6 — Playbook + Wrap
- T-019 Update CP-040..045 expected-signal shapes — done
- T-020 Run test suite (no regressions) — done
- T-021 Update implementation-summary.md — done
- T-022 Update handover.md (061 ready-state pointer) — done
- T-023 Optional GREEN cli-copilot single-scenario check (REQ-201) — deferred to 061
- T-024 Commit + push — skipped; no publication requested
