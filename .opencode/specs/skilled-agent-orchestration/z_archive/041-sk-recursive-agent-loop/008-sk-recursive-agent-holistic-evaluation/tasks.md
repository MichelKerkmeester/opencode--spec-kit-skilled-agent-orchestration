---
title: "Tasks: Phase [skilled-agent-orchestration/041-sk-recursive-agent-loop/008-sk-recursive-agent-holistic-evaluation/tasks]"
description: "tasks document for 008-sk-recursive-agent-holistic-evaluation."
trigger_phrases:
  - "tasks"
  - "phase"
  - "008"
  - "recursive"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/008-sk-recursive-agent-holistic-evaluation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Phase 008 — Holistic Agent Evaluation

## Foundation Scripts

- [x] T001: Create `scan-integration.cjs` — integration surface scanner
- [x] T002: Create `generate-profile.cjs` — dynamic target profile generator
- [x] T003: Test scan-integration against handover, context-prime, debug agents
- [x] T004: Test generate-profile against handover, debug, review agents

## Script Refactoring

- [x] T005: Refactor `score-candidate.cjs` — add 5-dimension framework + --dynamic flag
- [x] T006: Refactor `run-benchmark.cjs` — add integration consistency checks
- [x] T007: Refactor `reduce-state.cjs` — add per-dimension tracking + dashboard
- [x] T008: Align all 8 .cjs scripts with sk-code-opencode (box headers, section separators)

## Documentation Updates

- [x] T009: Update SKILL.md — 5-dimension framework, new references, updated routing, RULES emoji markers
- [x] T010: Update `agent-improver.md` agent — title, CRITICAL/IMPORTANT callouts, dividers, ASCII summary box
- [x] T011: Update `agent.md` command — full rewrite matching prompt.md quality (Phase 0, Setup, violations)
- [x] T012: Rewrite YAML workflows — spec_kit gold standard (user_inputs, field_handling, context_loading, gates)
- [x] T013: Expand README.md — 416 lines, 12 sections, HVR compliant

## Reference & Asset Updates

- [x] T014: Rewrite `evaluator_contract.md` — 5-dimension scoring rubric + dynamic mode output
- [x] T015: Update `loop_protocol.md` — integration scan step, dimensional scoring, dynamic profile
- [x] T016: Create `integration_scanning.md` — scanner documentation with example output
- [x] T017: Update `quick_reference.md` — new commands, dimension weights, standalone scripts
- [x] T018: Update all 11 references with Phase 008 content
- [x] T019: Update `improvement_config.json` — dimension weights, dynamic profile flag, plateau stop
- [x] T020: Update `target_manifest.jsonc` — dynamic profile support, expanded JSONC comments
- [x] T021: Update `improvement_charter.md` — integration-aware mission, 5-dimension principle
- [x] T022: Update `improvement_strategy.md` — integration dimensions, dimensional scores table
- [x] T023: Create `improvement_config_reference.md` — field-level config documentation

## Manual Testing Playbook

- [x] T024: Create playbook directory structure (6 categories)
- [x] T025: Write root MANUAL_TESTING_PLAYBOOK.md (test matrix, review protocol)
- [x] T026: Write 21 per-feature test files with global sequential numbering
- [x] T027: Fix playbook prompts — correct dimension names, exact script flags, verification commands

## Runtime Mirrors

- [x] T028: Sync `.claude/agents/agent-improver.md`
- [x] T029: Sync `.codex/agents/agent-improver.toml`
- [x] T030: Sync `.agents/agents/agent-improver.md`
- [x] T031: Sync `.agents/commands/improve/agent-improver.toml`
- [x] T032: Sync `.gemini/agents/agent-improver.md`
- [x] T033: Fix stale "Recursive Agent" headings in .agents and .gemini command mirrors

## Repo-Wide Rename

- [x] T034: Filesystem moves (9 operations: skill dir, 4 agents, command, .agents command, 2 YAMLs)
- [x] T035: Bulk content replacement (5 ordered sed passes across 187+ files)
- [x] T036: Verify zero remaining old references (fresh sub-agent audit: 25/25 checks pass)

## YAML Alignment

- [x] T037: Align all 12 create command YAMLs with spec_kit gold standard
- [x] T038: Create improve/ README.txt in all 4 runtimes

## Spec Folder Updates

- [x] T039: Update root 041 spec.md — add Phase 8 to phase map, scope, requirements, success criteria
- [x] T040: Update root 041 implementation-summary.md — add Phase 8 section, update counts
- [x] T041: Write Phase 008 implementation-summary.md with full session coverage

## Verification

- [x] T042: Run `package_skill.py --check` — PASS
- [x] T043: Run backward-compatibility test (existing handover profile scores)
- [x] T044: Run end-to-end flow verification (scanner + profiler + scorer + all parse)
- [x] T045: Runtime mirror audit (all 5 runtimes, 25 checks, 0 failures)
