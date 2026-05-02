<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: 061"
description: "T-001..T-018 across 5 stages."
trigger_phrases: ["061 tasks"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T15:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored tasks"
    next_safe_action: "Begin T-001"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Tasks: 061

<!-- SPECKIT_LEVEL: 3 -->

## Stage 1
- T-001 8 markdown + 2 JSON stubs
- T-002 Author `/tmp/cp-061-sandbox-setup.sh`
- T-003 Strict-validate

## Stage 2
- T-004 Modify CP-040 (013-*.md) Call B → command-flow
- T-005 Modify CP-043 (016-*.md) Call B → command-flow
- T-006 Modify CP-044 (017-*.md) Call B → command-flow
- T-007 Modify CP-045 (018-*.md) Call B → command-flow

## Stage 3
- T-008 Modify CP-041 (014-*.md) — materialize 5 required inputs
- T-009 Modify CP-042 (015-*.md) — materialize 5 required inputs

## Stage 4
- T-010 R1 stress run all 6 scenarios via cli-copilot
- T-011 Triage R1 results; sketch R2 if needed
- T-012 R2 stress run on remaining gaps
- T-013 R3 if R2 didn't reach target

## Stage 5
- T-014 Author test-report.md (11 sections, ANCHOR pairs)
- T-015 Update implementation-summary.md
- T-016 Update handover.md
- T-017 Memory save (optional)
- T-018 Commit + push
