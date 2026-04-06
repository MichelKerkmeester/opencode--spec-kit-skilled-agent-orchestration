---
title: "Tasks: Phase 001 - Claude Optimization Settings (Reddit field-report audit)"
description: "Backfilled task list for the 8-iteration deep-research run plus spec doc creation, validation, and memory save."
trigger_phrases:
  - "claude optimization tasks"
  - "deep research task list"
  - "iteration tasks"
importance_tier: "normal"
contextType: "research"
---
# Tasks: Phase 001 - Claude Optimization Settings (Reddit field-report audit)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:ai-exec -->
## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged (research-only; no config or hook implementation)
2. [ ] Phase 005-claudest boundary confirmed (no implementation content in this phase)
3. [ ] Source discrepancies preserved (926-vs-858; 18,903-vs-11,357)
4. [ ] research/research.md is the canonical output target

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order (init -> iterations -> synthesis -> spec docs) |
| TASK-SCOPE | Stay within research-only scope; do not modify settings or implement hooks |
| TASK-VERIFY | Verify each finding cites a specific external/reddit_post.md passage |
| TASK-DOC | Update task status immediately after completion |

### Status Reporting Format
- In-progress: add `[in-progress]` note inline
- Blocked: use `[B]` prefix and state blocker explicitly
- Complete: mark `[x]` with evidence reference

### Blocked Task Protocol
If a task is BLOCKED:
1. Mark it `[B]` in the task list
2. State the specific blocker (e.g., "blocked on phase 005 shipping")
3. Note whether the phase can complete without it
4. Escalate if it is a P0 blocker for this phase's completion bar

<!-- /ANCHOR:ai-exec -->

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

- [x] T001 Create `deep-research-config.json` with iteration cap (10), convergence threshold (0.05), runner config (cli-copilot gpt-5.4, reasoning_effort=high) (`research/deep-research-config.json`)
- [x] T002 Create `deep-research-state.jsonl` with init record (`research/deep-research-state.jsonl`)
- [x] T003 Create deep-research-strategy.md with topic, 5 key questions, non-goals, stop conditions, known-context cross-checks against .claude/settings.local.json and CLAUDE.md (output: research/deep-research-strategy.md)
- [x] T004 Create findings-registry.json for cross-iteration finding deduplication (output: research/findings-registry.json)
- [x] T005 Create deep-research-dashboard.md reducer scaffold (output: research/deep-research-dashboard.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Iteration 001 -- Initial evidence sweep: read external/reddit_post.md end-to-end, produce source map, cross-check against .claude/settings.local.json and CLAUDE.md, answer Q1/Q2/Q3; 8 findings, newInfoRatio=0.93 (output: research/iterations/iteration-001)
- [x] T007 Iteration 002 -- Cache-warning hooks vs existing hook surface: analyze Stop/UserPromptSubmit/SessionStart designs against existing session-stop.js, session-prime.js, compact-inject.js; produce conflict matrix; 5 findings, newInfoRatio=0.68 (output: research/iterations/iteration-002)
- [x] T008 Iteration 003 -- Bash-vs-native + redundant reads + edit retries + routing (RTK): cross-check 662 bash-call finding against Code Search Decision Tree mandate, redundant-read cache-amplification framing, edit-retry chain isolation; 6 findings, newInfoRatio=0.57 (output: research/iterations/iteration-003)
- [x] T009 Iteration 004 -- Audit methodology + portability + JSONL fragility + discrepancy preservation: produce six-layer architecture decomposition, multi-runtime portability matrix, explicit discrepancy preservation rule; 5 findings, newInfoRatio=0.48 (output: research/iterations/iteration-004)
- [x] T010 Iteration 005 -- Q7 latency risks + Q8 edit retries + config checklist draft: deferred-loading tradeoff scoping, edit-chain root-cause analysis limits, draft .claude/settings.local.json checklist with alreadyInRepo/recommendedAdditions/outOfScope buckets; 4 findings, newInfoRatio=0.41 (output: research/iterations/iteration-005)
- [x] T011 Iteration 006 -- Phase-005 boundary + prioritization tier table + gap matrix: confirm ownership split between phase 001 (decision layer) and phase 005 (implementation layer); produce ranked tier table across all iterations; 4 findings, newInfoRatio=0.38 (output: research/iterations/iteration-006)
- [x] T012 Iteration 007 -- Gap closure + contradiction sweep + confidence scoring: resolve cross-iteration label drift (adopt-now wording vs prototype-later enforcement), assign confidence scores (avg ~4.5/5); mark Q2 and Q8 as exhausted-without-closure; 2 findings, newInfoRatio=0.24 (output: research/iterations/iteration-007)

## Phase 2b: Convergence and Synthesis (continuation of Implementation)

- [x] T013 Iteration 008 -- Synthesis dry-run blueprint: consolidation pass only, no new evidence; produce final F1-F17 ledger, section blueprint for research.md, self-check against §12 evaluation criteria; status=thought, newInfoRatio=0.12, findingsCount=0 (output: research/iterations/iteration-008)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Writer pass: compose research/research.md from consolidated F1-F17 ledger and iteration-008 blueprint; produce all 12 sections (Executive Summary, Source and Discrepancies, Cross-Check, Findings F1-F17, Config Checklist, Hook Design Recs, Behavioral Recs, Audit Methodology, Phase-005 Boundary, Risks, Open Questions, Convergence Report); 466 lines total
- [x] T015 Create `spec.md` from Level 3 template; populate with research scope, requirements, acceptance criteria, risk matrix, user stories; include discrepancy preservation in NFR-D01 (`spec.md`)
- [x] T016 Create `plan.md` from Level 3 template; document actual research methodology, convergence trajectory (0.93->0.68->0.57->0.48->0.41->0.38->0.24->0.12), milestone table, dependency graph (`plan.md`)
- [x] T017 Create `tasks.md` from Level 3 template; backfill executed tasks T001-T013 with actual iteration focus and finding counts; leave T018-T020 pending (`tasks.md`)
- [x] T018 Create `checklist.md` from Level 3 template; populate P0/P1/P2 items with evidence references to research.md sections and finding IDs (`checklist.md`)
- [x] T019 Create `decision-record.md` from Level 3 template; document ADR-001 through ADR-004 with context, options, decision, consequences, and iteration first-stated (`decision-record.md`)
- [x] T020 Create `implementation-summary.md` from Level 3 template; document delivered artifacts, stats (8 iterations, 30 raw -> 17 deduplicated findings, avg confidence ~4.5/5, recommendation split 8/7/2), convergence stop signal, and phase 005 next-ownership boundary (`implementation-summary.md`)
- [ ] T021 Run `validate.sh --strict` on phase folder and verify exit code 0 or 1 (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [PHASE_FOLDER] --strict`)
- [ ] T022 Save packet memory with `generate-context.js` (`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [PHASE_FOLDER]`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All research iteration tasks (T006-T013) marked complete
- [x] `research/research.md` exists with >=5 findings, all with source anchors (17 produced)
- [x] Level 3 spec documents created (T015-T020)
- [ ] T021 validate.sh --strict passed (exit code 0 or 1)
- [ ] T022 memory save completed successfully
- [ ] Phase 005-claudest boundary referenced but not duplicated in any document
- [ ] Source discrepancies (926-vs-858; 18,903-vs-11,357) preserved in spec.md, research.md, and decision-record.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (scope, requirements, acceptance criteria)
- **Plan**: See `plan.md` (methodology, convergence trajectory, milestones)
- **Research Output**: See `research/research.md` (F1-F17, 12 sections)
- **Decision Records**: See `decision-record.md` (ADR-001 through ADR-004)
- **Delivery Summary**: See `implementation-summary.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
