---
title: "sk-deep-research: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review protocol, orchestration guidance, and per-scenario validation files for the sk-deep-research skill."
---

# sk-deep-research: Manual Testing Playbook

This document combines the operator-facing manual testing contract for the `sk-deep-research` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide, while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `MANUAL_TESTING_PLAYBOOK.md`
- `01--entry-points-and-modes/`
- `02--initialization-and-state-setup/`
- `03--iteration-execution-and-state-discipline/`
- `04--convergence-and-recovery/`
- `05--pause-resume-and-fault-tolerance/`
- `06--synthesis-save-and-guardrails/`
- `07--review-mode/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. ENTRY POINTS AND MODES](#7--entry-points-and-modes)
- [8. INITIALIZATION AND STATE SETUP](#8--initialization-and-state-setup)
- [9. ITERATION EXECUTION AND STATE DISCIPLINE](#9--iteration-execution-and-state-discipline)
- [10. CONVERGENCE AND RECOVERY](#10--convergence-and-recovery)
- [11. PAUSE, RESUME, AND FAULT TOLERANCE](#11--pause-resume-and-fault-tolerance)
- [12. SYNTHESIS, SAVE, AND GUARDRAILS](#12--synthesis-save-and-guardrails)
- [13. REVIEW MODE](#13--review-mode)
- [14. AUTOMATED TEST CROSS-REFERENCE](#14--automated-test-cross-reference)
- [15. FEATURE CATALOG CROSS-REFERENCE INDEX](#15--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 41 deterministic scenarios across 8 categories validating the current `sk-deep-research` skill surface (including review mode). Each scenario maps to a dedicated feature file with a realistic user request, orchestrator prompt, expected process, desired user-facing outcome, one primary 9-column execution row, and source anchors into the live skill, command, YAML, and runtime docs.

Coverage note for 2026-03-24: no `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/`, and no dedicated automated test suite was found under the skill folder. This playbook therefore anchors directly to the live `sk-deep-research` docs plus the active command and runtime definitions.

### REALISTIC TEST MODEL

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to inspect public docs, workflow definitions, runtime agent rules, or state schemas.
3. The operator captures both the expected execution process and the user-visible outcome.
4. The scenario passes only when the documented contract is internally consistent and would guide a real operator without contradiction.

---

## 2. GLOBAL PRECONDITIONS

1. The operator can read `.opencode/skill/sk-deep-research/`, `.opencode/command/spec_kit/`, and `.codex/agents/` from the repository root.
2. Manual checks are performed against the live repository state on or after 2026-03-19, with no assumption that missing docs or tests exist elsewhere.
3. Any live execution uses a safe disposable spec folder because pause sentinels, scratch files, and memory-save behavior target spec artifacts.
4. Runtime-specific checks use `.codex/agents/deep-research.toml` as the canonical runtime anchor for this playbook.
5. The feature-catalog cross-reference section remains intentionally empty of links because no dedicated catalog exists yet for this skill.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

1. Capture the exact user request used to frame the scenario.
2. Capture the exact orchestrator prompt used during execution.
3. Capture source excerpts or command output showing the contract under test.
4. Record the final user-facing explanation, not just raw implementation notes.
5. Note any runtime-specific behavior or guardrail that influenced the verdict.
6. Record an honest scenario verdict with a one-line rationale.
7. Note that `validate_document.py` validates the root playbook only; per-feature files still require manual link and prompt-sync checks.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Slash-command invocations are shown as `/spec_kit:deep-research[:mode] "topic" [flags]`.
- File inspection steps are shown as `bash: rg -n ...` or `bash: sed -n ...`.
- Agent-facing checks are described as realistic orchestrator prompts, not as raw implementation directives.
- `->` separates sequential steps inside the single-row execution contract.
- Paths are relative to the repository root unless otherwise noted.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### INPUTS REQUIRED

1. `MANUAL_TESTING_PLAYBOOK.md`
2. All 41 referenced per-feature files in the numbered category folders
3. Command transcripts or inspection output for each executed scenario
4. Notes for any scenario that required interpretation because behavior is documentation-defined rather than fully executable
5. Triage notes for every non-pass outcome

### SCENARIO ACCEPTANCE RULES

For each executed scenario, verify:
1. Preconditions were satisfied.
2. Prompt and command sequence were followed as written.
3. Expected signals are present and non-contradictory.
4. Evidence is complete and reusable by another operator.
5. The desired user-facing outcome matches the documented contract.

Scenario verdicts:
- `PASS`: all acceptance checks true
- `PARTIAL`: core contract is intact but evidence or one secondary anchor is incomplete
- `FAIL`: expected behavior missing, contradictory output present, or a critical anchor disagrees

### RELEASE READINESS RULE

Release is `READY` only when:
1. No scenario verdict is `FAIL`.
2. All critical-path scenarios in entrypoint, state, convergence, recovery, and finalization coverage are `PASS`.
3. Every scenario listed in the root index maps to exactly one per-feature file.
4. No unresolved contradiction remains between the skill docs, command/YAML docs, and runtime guardrails.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

This section documents how manual test execution should mimic a real orchestrator-led review. It does not change the runtime contract of `sk-deep-research` itself.

### WAVE PLANNING

| Wave | Scenarios | Worker Count | Notes |
|---|---|---|---|
| Wave 1 | DR-001..DR-006 | 1-3 | Entry-point and initialization checks are parallel-safe because they are document and workflow inspections |
| Wave 2 | DR-007..DR-014 | 1-2 | Prefer tighter coordination because these scenarios reuse the same state-discipline and convergence anchors |
| Wave 3 | DR-015..DR-019 | 1 | Run serially because pause, recovery, synthesis, and guardrail scenarios are easy to blur together |
| Wave 4 | DR-031..DR-041 | 1-3 | Review mode scenarios are parallel-safe (document and workflow inspections) but share review YAML anchors |

### OPERATIONAL RULES

1. Keep one coordinator responsible for prompt wording and verdict consistency.
2. Reuse the root category summaries to assign scenario ownership before execution starts.
3. Do not fabricate a feature catalog or automated suite that does not exist.
4. When a scenario touches runtime behavior, record that the canonical runtime anchor is `.codex/agents/deep-research.toml`.
5. Treat wave orchestration inside the skill docs as a reference-only product concept unless the scenario explicitly tests that boundary.

---

## 7. ENTRY POINTS AND MODES

These scenarios validate how `/spec_kit:deep-research` exposes autonomous and confirm execution, binds required setup inputs, and communicates the loop contract before the YAML workflow runs.

### DR-001 | Auto mode deep-research kickoff

Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow.

Feature file: [DR-001](01--entry-points-and-modes/001-auto-mode-deep-research-kickoff.md)

### DR-002 | Confirm mode checkpointed execution

Verify that confirm mode adds approval checkpoints without changing the core loop phases or artifact contract.

Feature file: [DR-002](01--entry-points-and-modes/002-confirm-mode-checkpointed-execution.md)

### DR-003 | Parameterized invocation with --max-iterations and --convergence

Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.

Feature file: [DR-003](01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md)

---

## 8. INITIALIZATION AND STATE SETUP

These scenarios validate fresh initialization, resume classification, and invalid-state protection so the loop never starts from ambiguous or contradictory scratch artifacts.

### DR-004 | Fresh initialization creates canonical state files

Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.

Feature file: [DR-004](02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md)

### DR-005 | Resume classification from valid prior state

Verify that the workflow classifies an existing valid scratch state as resumable before writing new files.

Feature file: [DR-005](02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md)

### DR-006 | Invalid or contradictory state halts for repair

Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.

Feature file: [DR-006](02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md)

### DR-027 | Research charter validated at init

Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization.

Feature file: [DR-027](02--initialization-and-state-setup/027-research-charter-validation.md)

---

## 9. ITERATION EXECUTION AND STATE DISCIPLINE

These scenarios validate the single-iteration contract: read state first, execute one focus, update the strategy file, append JSONL, and preserve progressive synthesis behavior.

### DR-007 | Iteration reads state before research

Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.

Feature file: [DR-007](03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md)

### DR-008 | Iteration writes iteration-NNN.md, JSONL record, and strategy update

Verify that each completed iteration writes the detailed iteration file, appends JSONL, and updates strategy state.

Feature file: [DR-008](03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md)

### DR-009 | Strategy “Next Focus” and exhausted-approach discipline

Verify that the loop honors the strategy file’s Next Focus and avoids approaches marked exhausted or blocked.

Feature file: [DR-009](03--iteration-execution-and-state-discipline/009-strategy-next-focus-and-exhausted-approach-discipline.md)

### DR-010 | Progressive synthesis behavior for research.md

Verify that `research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled.

Feature file: [DR-010](03--iteration-execution-and-state-discipline/010-progressive-synthesis-behavior-for-research-md.md)

### DR-024 | Dashboard generation after iteration

Verify dashboard.md is auto-generated after iteration evaluation with correct content.

Feature file: [DR-024](03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md)

### DR-025 | Novelty justification present in JSONL

Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio.

Feature file: [DR-025](03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md)

### DR-028 | Focus track labels in dashboard

Verify optional focusTrack labels appear in JSONL and dashboard iteration table.

Feature file: [DR-028](03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md)

---

## 10. CONVERGENCE AND RECOVERY

These scenarios validate the stop conditions, stuck recovery ladder, and composite convergence logic that determine whether the loop continues, pivots, or exits to synthesis.

### DR-011 | Stop on max iterations

Verify that max iterations is a hard stop checked before softer convergence signals.

Feature file: [DR-011](04--convergence-and-recovery/011-stop-on-max-iterations.md)

### DR-012 | Stop when all key questions are answered

Verify that the loop stops when the tracked key questions are fully answered.

Feature file: [DR-012](04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md)

### DR-013 | Composite convergence stop behavior

Verify the three-signal weighted stop model and its graceful degradation rules.

Feature file: [DR-013](04--convergence-and-recovery/013-composite-convergence-stop-behavior.md)

### DR-014 | Stuck recovery widens focus and continues

Verify that stuck detection triggers a recovery path that widens focus before giving up.

Feature file: [DR-014](04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md)

### DR-020 | Quality Guard -- Source Diversity

Verify that convergence STOP is blocked when an answered question cites fewer than 2 independent sources.

Feature file: [DR-020](04--convergence-and-recovery/020-quality-guard-source-diversity.md)

### DR-021 | Quality Guard -- Focus Alignment

Verify that convergence STOP is blocked when answered questions do not map to original key questions.

Feature file: [DR-021](04--convergence-and-recovery/021-quality-guard-focus-alignment.md)

### DR-022 | Quality Guard -- No Single-Weak-Source

Verify that convergence STOP is blocked when an answered question relies solely on a tentative source.

Feature file: [DR-022](04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md)

### DR-023 | Composite convergence passes but guard fails -- CONTINUE

Verify the full override path: composite score >0.60 triggers STOP, guards check runs, guard fails, override to CONTINUE.

Feature file: [DR-023](04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md)

### DR-029 | Insight status prevents false stuck detection

Verify that an iteration with status "insight" does not increment stuck count despite low newInfoRatio.

Feature file: [DR-029](04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md)

### DR-030 | Thought status handling in convergence

Verify that "thought" iterations are handled correctly in convergence and do not count as stuck or toward rolling average.

Feature file: [DR-030](04--convergence-and-recovery/030-thought-status-convergence-handling.md)

---

## 11. PAUSE, RESUME, AND FAULT TOLERANCE

These scenarios validate graceful operator pause/resume behavior plus the defensive parsing and reconstruction rules that keep the loop usable after partial corruption.

### DR-015 | Pause sentinel halts between iterations

Verify that the pause sentinel halts the loop between iterations and logs a pause event.

Feature file: [DR-015](05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md)

### DR-016 | Resume after pause sentinel removal

Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.

Feature file: [DR-016](05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md)

### DR-017 | Malformed JSONL lines are skipped with defaults

Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.

Feature file: [DR-017](05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md)

### DR-018 | JSONL reconstruction from iteration files

Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.

Feature file: [DR-018](05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md)

---

## 12. SYNTHESIS, SAVE, AND GUARDRAILS

This final scenario validates final synthesis, memory save, LEAF-only runtime discipline, and the requirement to treat future-facing ideas as reference-only rather than live guarantees.

### DR-019 | Final synthesis plus memory save and guardrail behavior

Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features.

Feature file: [DR-019](06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md)

### DR-026 | Ruled-out directions synthesized

Verify that iteration ruledOut data is consolidated into an Eliminated Alternatives section in research.md.

Feature file: [DR-026](06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md)

---

## 13. REVIEW MODE

These scenarios validate the review mode variant of sk-deep-research: how it accepts review targets, discovers scope, dispatches @deep-review agents, converges on review findings, and produces release-readiness verdicts.

### DR-031 | Review mode kickoff via :review suffix

Verify that `:review` suffix triggers review-specific setup questions (target, dimensions) and routes to review YAML.

Feature file: [DR-031](07--review-mode/031-review-mode-kickoff-via-review-suffix.md)

### DR-032 | Review scope discovery resolves target to file list

Verify review mode resolves target type (spec folder / skill / agent / track / files) to a concrete file list.

Feature file: [DR-032](07--review-mode/032-review-scope-discovery-resolves-target.md)

### DR-033 | Review dimension ordering follows risk priority

Verify inventory pass runs first, then Correctness → Security → Traceability → Maintainability.

Feature file: [DR-033](07--review-mode/033-review-dimension-ordering-follows-risk-priority.md)

### DR-034 | Review iteration produces P0/P1/P2 findings with file:line evidence

Verify @deep-review agent writes iteration file with Scorecard, Findings (P0/P1/P2), Cross-Reference Results, and Assessment.

Feature file: [DR-034](07--review-mode/034-review-iteration-produces-findings.md)

### DR-035 | Review convergence uses severity-weighted newFindingsRatio

Verify convergence uses adapted signals (rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45) with P0 override rule.

Feature file: [DR-035](07--review-mode/035-review-convergence-severity-weighted.md)

### DR-036 | Review quality guards block premature stop

Verify 3 binary gates (evidence, scope, coverage) must pass before STOP.

Feature file: [DR-036](07--review-mode/036-review-quality-guards-block-premature-stop.md)

### DR-037 | Cross-reference verification detects spec-code misalignment

Verify review iteration checks spec claims vs code, checklist [x] vs evidence, SKILL.md vs agent files.

Feature file: [DR-037](07--review-mode/037-cross-reference-detects-misalignment.md)

### DR-038 | Adversarial self-check runs on P0 findings

Verify Hunter/Skeptic/Referee runs in-iteration for P0 candidates before writing to JSONL.

Feature file: [DR-038](07--review-mode/038-adversarial-self-check-on-p0.md)

### DR-039 | Review-report.md synthesis has all 9 sections

Verify review-report.md includes Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, and Audit Appendix.

Feature file: [DR-039](07--review-mode/039-review-report-synthesis-has-all-sections.md)

### DR-040 | Review verdict determines post-review workflow

Verify FAIL / CONDITIONAL / PASS verdict is correct and next-command recommendation matches, with PASS carrying `hasAdvisories` when only P2 findings remain.

Feature file: [DR-040](07--review-mode/040-review-verdict-determines-post-review-workflow.md)

### DR-041 | Review dashboard shows findings and coverage

Verify review dashboard includes Findings Summary (P0/P1/P2), Progress Table with dimensions, Coverage (files/dimensions/traceability protocols), and Trend.

Feature file: [DR-041](07--review-mode/041-review-dashboard-shows-findings-and-coverage.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

No dedicated automated test suite was found under `.opencode/skill/sk-deep-research/` during this playbook creation pass. Operators should therefore treat the live docs, command entrypoint, YAML workflows, and runtime agent definition as the current testable contract.

If a future automated suite is added, this section should map scenario IDs to concrete test files rather than inventing retroactive coverage.

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

No dedicated `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24. This playbook intentionally does not fabricate catalog links or placeholder catalog IDs.

Until a feature catalog exists, use the live source anchors inside each per-feature file as the canonical implementation cross-reference surface.
