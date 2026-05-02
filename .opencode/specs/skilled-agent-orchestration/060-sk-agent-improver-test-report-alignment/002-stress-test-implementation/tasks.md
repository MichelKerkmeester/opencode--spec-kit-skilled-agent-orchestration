<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: 060/002 — Stress-Test Implementation"
description: "T-001..T-022 across 5 stages."
trigger_phrases:
  - "060/002 tasks"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T11:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored tasks"
    next_safe_action: "Begin T-001"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Tasks: 060/002 — Stress-Test Implementation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:stage-1 -->
## Stage 1 — Scaffold + Fixture Design

- **T-001** Author 8 markdown files at packet root (in progress this turn) — [in-progress]
- **T-002** Bootstrap `description.json` + `graph-metadata.json` via `generate-context.js` — [pending]
- **T-003** Strict-validate spec folder — [pending]
- **T-004** Read `001/research/research.md` §6 fully; extract fixture-target requirements — [pending]
- **T-005** Author fixture-target spec at `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/README.md` (or chosen path) — [pending]
<!-- /ANCHOR:stage-1 -->

---

<!-- ANCHOR:stage-2 -->
## Stage 2 — Author 6 CP-XXX Scenarios

- **T-006** Compose cli-codex prompt for authoring CP-040..CP-045 (pre-answer Gate 3: Option D — skip) — [pending]
- **T-007** Dispatch cli-codex (gpt-5.5 high fast) to author 6 playbook files — [pending]
- **T-008** Verify 6 files exist with CP-027-format compliance — [pending]
- **T-009** Update `manual_testing_playbook.md` §10 routing-table descriptions — [pending]
- **T-010** Update `manual_testing_playbook.md` §16 cross-reference index — [pending]
<!-- /ANCHOR:stage-2 -->

---

<!-- ANCHOR:stage-3 -->
## Stage 3 — Apply Diff Sketches

- **T-011** Apply P1 diff: fix `.gemini/agents` constant in `scan-integration.cjs` — [pending]
- **T-012** Apply P0 diff: enable `--baseline` consumption + emit `delta` in `score-candidate.cjs` — [pending]
- **T-013** Apply P0 diff: emit `legal_stop_evaluated` 5-gate bundle in auto YAML — [pending]
- **T-014** Apply same emission in confirm YAML — [pending]
- **T-015** Apply P0 diff: add §6.5 CRITIC PASS bullets to `improve-agent.md` — [pending]
- **T-016** Mirror agent edits across 4 runtimes (.claude/.gemini/.codex) — [pending]
- **T-017** Apply P0 diff: add "skill load ≠ protocol execution" clarification to `SKILL.md` — [pending]
<!-- /ANCHOR:stage-3 -->

---

<!-- ANCHOR:stage-4 -->
## Stage 4 — Multi-Round Stress Runs

- **T-018** R0 baseline: run CP-040 across cli-copilot under gpt-5.5 + opus-4.7 (+ sonnet-4.6 if available) — [pending]
- **T-019** R1 stress: run CP-040..CP-045 sequentially via cli-copilot gpt-5.5 — [pending]
- **T-020** Triage R1 results; if PARTIAL/FAIL: dispatch R2 with targeted edits — [pending]
- **T-021** R3 if R2 didn't reach target — [pending]
<!-- /ANCHOR:stage-4 -->

---

<!-- ANCHOR:stage-5 -->
## Stage 5 — Test-Report + Close-out

- **T-022** Author `test-report.md` mirroring 059's structure (11 ANCHOR pairs, lessons-learned) — [pending]
- **T-023** Update `implementation-summary.md` with final score + outcomes — [pending]
- **T-024** Update `handover.md` with close-out + follow-on packet hand-off — [pending]
- **T-025** `/memory:save` to refresh continuity — [pending]
- **T-026** Optional: commit + push to main — [pending]
<!-- /ANCHOR:stage-5 -->

---

<!-- ANCHOR:dependencies -->
## Task Dependencies

- T-001 → T-002 → T-003 (Stage 1 sequence)
- T-004 → T-005 (Stage 1 fixture design)
- T-006 → T-007 → T-008 → T-009 → T-010 (Stage 2 sequence)
- T-005 must complete before T-007 (scenarios reference fixture)
- T-011 → T-012 → T-013 → T-014 → T-015 → T-016 → T-017 (Stage 3 dependency order: integration → baseline/delta → events → critic → docs)
- T-008 + T-017 must complete before T-018 (scenarios + edits before stress runs)
- T-018 → T-019 → T-020 → T-021 (Stage 4 sequence)
- T-021 → T-022 → T-023 → T-024 → T-025 (Stage 5 sequence)
<!-- /ANCHOR:dependencies -->
