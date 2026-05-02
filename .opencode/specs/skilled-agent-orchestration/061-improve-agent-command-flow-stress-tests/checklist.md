<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
---
title: "Checklist: 061"
description: "Level 3 checklist."
trigger_phrases: ["061 checklist"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T15:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored checklist"
    next_safe_action: "Begin Stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Checklist: 061

<!-- SPECKIT_LEVEL: 3 -->

## Stage 1
- [ ] T-001 spec scaffolded (8 md + 2 JSON)
- [ ] T-002 sandbox-setup.sh authored + sandbox creates without error
- [ ] T-003 Strict-validate exits 0 (or template-shape errors only)

## Stage 2
- [ ] T-004 CP-040 command-flow
- [ ] T-005 CP-043 command-flow
- [ ] T-006 CP-044 command-flow
- [ ] T-007 CP-045 command-flow

## Stage 3
- [ ] T-008 CP-041 inputs materialized
- [ ] T-009 CP-042 inputs materialized

## Stage 4
- [ ] T-010 R1 6/6 scenarios executed
- [ ] T-011 Triage doc
- [ ] T-012 R2 (if needed)
- [ ] T-013 R3 (if needed)

## Stage 5
- [ ] T-014 test-report.md (11 ANCHOR pairs)
- [ ] T-015 implementation-summary updated
- [ ] T-016 handover updated
- [ ] T-017 memory save (optional)
- [ ] T-018 commit + push
