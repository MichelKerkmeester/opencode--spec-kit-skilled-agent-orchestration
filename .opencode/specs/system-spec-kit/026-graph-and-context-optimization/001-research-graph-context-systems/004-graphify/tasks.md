---
title: "Tasks: 004-graphify Research Phase"
description: "Task tracking for the 20-iteration two-wave deep-research loop on graphify plus Public-internal rollout translation, synthesis, memory save, and verification."
trigger_phrases:
  - "graphify research tasks"
  - "004-graphify task list"
  - "graphify deep-research tasks"
importance_tier: critical
contextType: tasks
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author phase research prompt with RICCE structure (`scratch/phase-research-prompt.md`)
- [x] T002 Verify cli-codex CLI installed and reachable (`which codex`)
- [x] T003 [P] Load cross-phase awareness for 002 codesight and 003 contextador into strategy.md `Known Context` section
- [x] T004 Initialize deep-research state files via `phase_init`: `deep-research-config.json`, `deep-research-state.jsonl`, `research/deep-research-strategy.md`, `findings-registry.json`
- [x] T005 Create `research/iterations/` and `research/archive/` directories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Baseline iterations (1-7)

- [x] T006 Iteration 1 - Pipeline architecture lock via `cli-codex gpt-5.4 high` (`research/iterations/iteration-001.md`, 8 findings, 106K tokens)
- [x] T007 Iteration 2 - AST extraction internals via `claude-opus-direct` after iter 2 codex starvation engine_switch (`research/iterations/iteration-002.md`, 10 findings)
- [x] T008 Iteration 3 - Semantic merge cache promotion via `claude-opus-direct` (`research/iterations/iteration-003.md`, 12 findings)
- [x] T009 Iteration 4 - Clustering analyze report via `claude-opus-direct` (`research/iterations/iteration-004.md`, 13 findings)
- [x] T010 Iteration 5 - Hooks cache rebuild via `claude-opus-direct` (`research/iterations/iteration-005.md`, 12 findings)
- [x] T011 Iteration 6 - Multimodal pipeline via `claude-opus-direct` (`research/iterations/iteration-006.md`, 11 findings)
- [x] T012 Iteration 7 - Benchmark credibility via `claude-opus-direct` (`research/iterations/iteration-007.md`, 12 findings; composite_converged at coverage 91.7%)

### cli-codex extension iterations (8-10)

- [x] T013 Continuation event logged in JSONL after user override of iter 7 composite_converged stop
- [x] T014 Iteration 8 - Export plus wiki plus MCP serve surface via `cli-codex gpt-5.4 high` (`research/iterations/iteration-008.md`, 10 findings K13 to K21, 94K tokens)
- [x] T015 Iteration 9 - Build orchestration plus mixed-corpus cross-validation via `cli-codex gpt-5.4 high` (`research/iterations/iteration-009.md`, 10 findings K22 to K27, 86K tokens)
- [x] T016 Iteration 10 - Per-language extractor inventory plus final Q12 grounding via `cli-codex gpt-5.4 high` (`research/iterations/iteration-010.md`, 12 findings K28 to K32 plus Adopt/Adapt/Reject table, 89K tokens)

### Reducer pass after each iteration

- [x] T017 Run `reduce-state.cjs` after iter 1 (registry, dashboard, strategy refresh)
- [x] T018 Run `reduce-state.cjs` after iter 2
- [x] T019 Run `reduce-state.cjs` after iter 3
- [x] T020 Run `reduce-state.cjs` after iter 4
- [x] T021 Run `reduce-state.cjs` after iter 5
- [x] T022 Run `reduce-state.cjs` after iter 6
- [x] T023 Run `reduce-state.cjs` after iter 7
- [x] T024 Run `reduce-state.cjs` after iter 8
- [x] T025 Run `reduce-state.cjs` after iter 9
- [x] T026 Run `reduce-state.cjs` after iter 10

### completed-continue wave iterations (11-20)

- [x] T041 Snapshot prior synthesis into `research/synthesis-v1.md` before reopening the packet
- [x] T042 Reopen the completed run in generation 2 (`completed-continue`) and raise `maxIterations` from 10 to 20
- [x] T043 Iteration 11 - map provenance and confidence payload contracts in Public (`research/iterations/iteration-011.md`)
- [x] T044 Iteration 12 - locate graph-first runtime nudge surfaces (`research/iterations/iteration-012.md`)
- [x] T045 Iteration 13 - compare Public incremental indexing and invalidation paths (`research/iterations/iteration-013.md`)
- [x] T046 Iteration 14 - define the narrow multimodal adoption slice (`research/iterations/iteration-014.md`)
- [x] T047 Iteration 15 - map the lightest community-detection path into current graph/search surfaces (`research/iterations/iteration-015.md`)
- [x] T048 Iteration 16 - identify existing validation and playbook extensions (`research/iterations/iteration-016.md`)
- [x] T049 Iteration 17 - define architecture-native evaluation metrics (`research/iterations/iteration-017.md`)
- [x] T050 Iteration 18 - map security and trust-boundary constraints (`research/iterations/iteration-018.md`)
- [x] T051 Iteration 19 - map existing bridge surfaces that can absorb graph signals (`research/iterations/iteration-019.md`)
- [x] T052 Iteration 20 - finalize the phased rollout plan for Public (`research/iterations/iteration-020.md`)
- [x] T053 Run `reduce-state.cjs` after iter 11-20 wave completion
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Synthesis - update `research/research.md` to include section 13.A (K13-K32) and section 13.B (K33-K42)
- [x] T028 Append `synthesis_complete` event to `deep-research-state.jsonl`
- [x] T029 Flip `config.status` from `initialized` to `complete` in `deep-research-config.json`
- [x] T030 Final reducer pass to ensure dashboard and registry reflect 20 iterations
- [x] T031 Memory save via `generate-context.js` with structured JSON contract
- [x] T032 Manual patch HIGH severity quality issues (trigger_phrases path fragments) in memory file
- [x] T033 Rewrite `spec.md` to Level 3 template (EXECUTIVE SUMMARY, METADATA, PROBLEM, SCOPE, REQUIREMENTS, SUCCESS CRITERIA, RISKS, NFR, EDGE CASES, COMPLEXITY, RISK MATRIX, USER STORIES, OPEN QUESTIONS, RELATED DOCUMENTS)
- [x] T034 Rewrite `plan.md` to Level 3 template (SUMMARY, QUALITY GATES, ARCHITECTURE, IMPLEMENTATION PHASES, TESTING STRATEGY, DEPENDENCIES, ROLLBACK PLAN plus L2 and L3 addendums)
- [x] T035 Rewrite `tasks.md` to Level 3 template (Task Notation, Phase 1 Setup, Phase 2 Implementation, Phase 3 Verification, Completion Criteria, Cross-References)
- [x] T036 Rewrite `implementation-summary.md` to template (Metadata, What Was Built, How It Was Delivered, Key Decisions, Verification, Known Limitations) and reflect 20 iterations
- [x] T037 Create `decision-record.md` with 4 ADRs covering engine choice, engine switch, iter 7 override, section 13.A append strategy
- [x] T038 Resolve broken markdown file references (skill.md, phase-research-prompt.md, iteration-NNN.md, GRAPH_REPORT.md, iteration-007.md)
- [x] T039 Run `validate.sh --strict` and confirm RESULT: PASSED
- [x] T040 Verify `checklist.md` items all marked `[x]` with evidence
- [x] T054 Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to 20 iterations / 22 questions / K1-K42 findings
- [x] T055 Save refreshed wave-2 memory context after validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every K1 to K42 finding has a verifiable file:line citation
- [x] `validate.sh --strict` returns RESULT: PASSED
- [x] Memory artifact saved with critical importance tier and clean trigger phrases (no path fragments)
- [x] Cross-phase deduplication note in research.md section 11
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Verification Checklist**: See `checklist.md`
- **Canonical research output**: See `research/research.md`
- **Iteration evidence**: See `research/iterations/iteration-001.md` through `research/iterations/iteration-020.md`
- **Phase prompt**: `scratch/phase-research-prompt.md`
- **Memory artifact**: `memory/*.md` (latest save reflects the 20-iteration completed-continue wave)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE
- 3 phases: Setup, Implementation, Verification
- 40 tasks tracking the full deep-research loop and post-loop spec doc compliance
-->
