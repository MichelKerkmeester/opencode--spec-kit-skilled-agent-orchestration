---
title: "Tasks: Phase [skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/tasks]"
description: "tasks document for 011-sk-agent-improver-advisor-readme-sync."
trigger_phrases:
  - "tasks"
  - "phase"
  - "011"
  - "agent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Phase 011 — Skill Advisor Routing + README Sync

## Skill README (D1)

- [x] T001: Update sk-improve-agent version from 0.1.0.0 to 1.0.0.0 in skill table
- [x] T002: Update sk-improve-agent description to mention 5D scoring, integration scanning, dynamic profiling
- [x] T003: Verify skill counts are correct

## Skill Advisor — Public (D2)

- [x] T004: Add INTENT_BOOSTERS for 5-dimension, integration scan, dynamic profile, evaluate/score agent
- [x] T005: Add PHRASE_INTENT_BOOSTERS for Phase 008+ capabilities and /improve:agent command
- [x] T006: Add COMMAND_BRIDGES for /improve:agent, /improve:prompt, /create:* commands

## Skill Advisor — Barter (D3)

- [x] T007: Add COMMAND_BRIDGES to Barter advisor (all except /improve:agent)
- [x] T008: Add PHRASE_INTENT_BOOSTERS for /improve:prompt and /create:* to Barter advisor

## Verification (D4)

- [x] T009: Test "evaluate agent with 5 dimensions" → sk-improve-agent >= 0.8
- [x] T010: Test "/improve:agent" → sk-improve-agent >= 0.8
- [x] T011: Test "/improve:prompt" → sk-improve-prompt >= 0.8
- [x] T012: Test "/create:agent" → sk-doc >= 0.8
- [x] T013: Verify README shows 1.0.0.0
- [x] T014: Update parent 041 spec.md with Phase 11

## Finalization

- [x] T015: Mark spec.md and plan.md status Complete
- [x] T016: Write implementation-summary.md
