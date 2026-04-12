---
title: "sk-deep-review: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review protocol, orchestration guidance, and per-scenario validation files for the sk-deep-review skill."
---

# sk-deep-review: Manual Testing Playbook

This document combines the operator-facing manual testing contract for the `sk-deep-review` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--entry-points-and-modes/`
- `02--initialization-and-state-setup/`
- `03--iteration-execution-and-state-discipline/`
- `04--convergence-and-recovery/`
- `05--pause-resume-and-fault-tolerance/`
- `06--synthesis-save-and-guardrails/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#5--sub-agent-orchestration-and-wave-planning)
- [6. ENTRY POINTS AND MODES](#6--entry-points-and-modes)
- [7. INITIALIZATION AND STATE SETUP](#7--initialization-and-state-setup)
- [8. ITERATION EXECUTION AND STATE DISCIPLINE](#8--iteration-execution-and-state-discipline)
- [9. CONVERGENCE AND RECOVERY](#9--convergence-and-recovery)
- [10. PAUSE, RESUME, AND FAULT TOLERANCE](#10--pause-resume-and-fault-tolerance)
- [11. SYNTHESIS, SAVE, AND GUARDRAILS](#11--synthesis-save-and-guardrails)
- [12. AUTOMATED TEST CROSS-REFERENCE](#12--automated-test-cross-reference)

---

## 1. OVERVIEW

This playbook provides 32 deterministic scenarios across 6 categories validating the current `sk-deep-review` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and live source anchors.

### REALISTIC TEST MODEL

1. Start from the user-facing review workflow rather than a synthetic command checklist.
2. Inspect public docs before lower-level workflow or runtime anchors when that order matters.
3. Capture enough evidence for another operator to reproduce the verdict without re-deriving the scenario.
4. Report a concise user-facing verdict, not just raw implementation notes.

---

## 2. GLOBAL PRECONDITIONS

- `sk-deep-review` skill exists at `.opencode/skill/sk-deep-review/`.
- `/spec_kit:deep-review` command exists at `.opencode/command/spec_kit/deep-review.md`.
- `@deep-review` agent definition exists at `.opencode/agent/deep-review.md` plus runtime variants.
- Review YAML workflows exist at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`.
- `review_mode_contract.yaml` exists at `.opencode/skill/sk-deep-review/assets/`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- A clear PASS/FAIL verdict with reasoning.
- Evidence captured from actual file contents instead of assumptions.
- Cross-source consistency checks across README, SKILL.md, command, YAML, and runtime agent surfaces.
- The exact prompt used for the scenario when the root summary is not enough on its own.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Use `rg` and `sed` to gather deterministic evidence.
- Execute steps in order so higher-level user-facing surfaces are checked before lower-level workflow contracts whenever that sequencing matters.
- Keep the final verdict anchored to captured evidence rather than inferred behavior.

---

## 5. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Probe capacity before parallelizing review work.
- Keep one coordinator slot free when using sub-agents.
- Group scenarios by category so resume and synthesis artifacts are not mixed across waves.
- Run pause/resume and synthesis scenarios only after the entrypoint, initialization, and iteration categories are already verified.

---

## 6. ENTRY POINTS AND MODES

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-001 | Auto mode deep-review kickoff

#### Description
Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the autonomous entrypoint for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-review:auto is documented consistently across the README, quick reference, command entrypoint, and autonomous YAML workflow. Return a concise user-facing pass/fail verdict with the expected artifact summary.

Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `review/review-report.md`.

#### Test Execution
> **Feature File:** [DRV-001](01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md)

### DRV-002 | Confirm mode checkpointed review

#### Description
Verify that `/spec_kit:deep-review:confirm` pauses at each phase for user approval before proceeding.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify entrypoint for sk-deep-review. Confirm that /spec_kit:deep-review:confirm is documented consistently across the README, quick reference, command entrypoint, and confirm YAML workflow, and that approval gates are present at each phase transition. Return a concise user-facing pass/fail verdict.

Expected signals: The confirm YAML has `approvals: multi_gate`, pause/approval steps appear in the loop, and the command entrypoint routes `:confirm` to the confirm YAML.

#### Test Execution
> **Feature File:** [DRV-002](01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md)

### DRV-003 | Parameterized invocation max-iterations and convergence

#### Description
Verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters work and are documented consistently.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the parameter contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify --max-iterations (default 7) and --convergence (default 0.10) are documented consistently across the quick reference, command entrypoint, and both YAML workflows. Return a concise user-facing pass/fail verdict.

Expected signals: Default values of 7 and 0.10 appear consistently across all sources; the YAML writes these into `deep-review-config.json` during init.

#### Test Execution
> **Feature File:** [DRV-003](01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md)


---

## 7. INITIALIZATION AND STATE SETUP

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-004 | Fresh review initialization creates canonical state files

#### Description
Verify that a fresh session creates the canonical config, JSONL, strategy, and iteration directory from the shipped assets.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the fresh-initialization contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates review/deep-review-config.json, review/deep-review-state.jsonl, review/deep-review-findings-registry.json, review/deep-review-strategy.md, and review/iterations/ from the live templates. Return a concise user-facing pass/fail verdict.

Expected signals: The review/ directory is created, config comes from the shared deep-review config template, the findings registry is created from the reducer contract, strategy comes from the sk-deep-review strategy template, and the JSONL begins with a config record.

#### Test Execution
> **Feature File:** [DRV-004](02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md)

### DRV-005 | Resume classification from valid prior review state

#### Description
Verify that resume detects existing review state and continues from the last completed iteration.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the resume classification contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the step_classify_session logic detects existing config, JSONL, and strategy files in review/ and classifies the session as "resume", skipping to phase_loop. Return a concise user-facing pass/fail verdict.

Expected signals: The classify step checks for config, JSONL, and strategy presence; classifies as "resume" when all three exist and are consistent; and skips to phase_loop.

#### Test Execution
> **Feature File:** [DRV-005](02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md)

### DRV-006 | Invalid or contradictory review state halts for repair

#### Description
Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the invalid-state detection contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_classify_session classifies partial, missing, or contradictory review state as "invalid-state" and halts with a repair message. Return a concise user-facing pass/fail verdict.

Expected signals: The classify step has an explicit "invalid-state" classification for partial or contradictory combinations; it halts with a descriptive message; the migration step also halts on canonical/legacy conflicts.

#### Test Execution
> **Feature File:** [DRV-006](02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md)

### DRV-007 | Scope discovery and dimension ordering

#### Description
Verify that scope discovery resolves target type to a file list and dimensions are ordered by risk priority (Correctness > Security > Traceability > Maintainability).

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the scope discovery and dimension ordering contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_scope_discovery resolves different target types to file lists, and step_order_dimensions orders them as Correctness > Security > Traceability > Maintainability. Return a concise user-facing pass/fail verdict.

Expected signals: The scope discovery step has resolution rules for each target type (spec-folder, skill, agent, track, files); the dimension ordering step enforces correctness > security > traceability > maintainability; the quick reference dimension table matches.

#### Test Execution
> **Feature File:** [DRV-007](02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md)


---

## 8. ITERATION EXECUTION AND STATE DISCIPLINE

This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-008 | Review iteration reads state before review

#### Description
Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the read-state-first iteration contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-review agent both require reading JSONL and strategy state before any review actions. Return a concise operator verdict.

Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.

#### Test Execution
> **Feature File:** [DRV-008](03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md)

### DRV-009 | Review iteration writes findings, JSONL, and strategy update

#### Description
Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the per-iteration write contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify each iteration writes iteration-NNN.md with P0/P1/P2 classified findings, appends a JSONL record with severity counts, and updates deep-review-strategy.md. Return a concise user-facing pass/fail verdict.

Expected signals: The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same three outputs.

#### Test Execution
> **Feature File:** [DRV-009](03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md)

### DRV-010 | Strategy next focus and dimension rotation

#### Description
Verify that the strategy rotates through dimensions and respects exhausted approaches.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the dimension rotation contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop manager rotates through dimensions based on the strategy "Next Focus" and that exhausted dimensions are skipped. Return a concise user-facing pass/fail verdict.

Expected signals: The read-state step extracts the next uncovered dimension; the dispatch step injects it as the focus; the strategy template has a "Next Focus" section; the convergence docs require all dimensions to be covered.

#### Test Execution
> **Feature File:** [DRV-010](03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md)

### DRV-011 | Cross-reference verification detects misalignment

#### Description
Verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment between documentation and implementation.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the cross-reference verification contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify traceability protocols (core: spec_code, checklist_evidence; overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability) are configured in the review config and that the traceability dimension dispatches cross-reference checks. Return a concise user-facing pass/fail verdict.

Expected signals: The config includes crossReference with core and overlay protocols; the dispatch prompt includes traceability constraints; the strategy template tracks cross-reference results; the quality guards require cross-reference checks before convergence.

#### Test Execution
> **Feature File:** [DRV-011](03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md)

### DRV-012 | Adversarial self-check runs on P0 findings

#### Description
Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them as confirmed findings.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the adversarial self-check contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify Rule 10 (adversarial self-check on P0 findings) is documented in the SKILL.md rules, enforced in the quick reference iteration checklist, and checked in the YAML post-iteration claim adjudication. Return a concise user-facing pass/fail verdict.

Expected signals: Rule 10 in SKILL.md mandates adversarial self-check for P0; the iteration checklist includes it as step 5; the YAML has a claim adjudication step that checks for P0/P1 self-check evidence; the agent definitions describe the Hunter/Skeptic/Referee roles.

#### Test Execution
> **Feature File:** [DRV-012](03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md)

### DRV-013 | Review dashboard generation after iteration

#### Description
Verify that the dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the dashboard generation contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_generate_dashboard runs after each iteration, reads from JSONL and strategy, and writes deep-review-dashboard.md with Findings Summary, Progress Table, Coverage, and Trend sections. Return a concise user-facing pass/fail verdict.

Expected signals: The step_generate_dashboard runs after step_validate_iteration; it reads JSONL and strategy; it writes to deep-review-dashboard.md; the output includes Findings Summary, Progress Table, Coverage, and Next Focus sections.

#### Test Execution
> **Feature File:** [DRV-013](03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md)

### DRV-014 | Severity classification in JSONL

#### Description
Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the severity classification JSONL contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify Rule 11 mandates findingsSummary (cumulative) and findingsNew (this iteration) fields with P0/P1/P2 counts in every JSONL iteration record, that the YAML dispatch prompt constrains this, and that the convergence algorithm uses severity weights. Return a concise user-facing pass/fail verdict.

Expected signals: Rule 11 mandates the fields; the YAML dispatch prompt constrains them; the convergence algorithm references severity_weights with P0=10.0, P1=5.0, P2=1.0; the P0 override sets newFindingsRatio >= 0.50.

#### Test Execution
> **Feature File:** [DRV-014](03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md)

### DRV-015 | Review iterations emit structured graphEvents

#### Description
verify that a running deep review iteration writes a `graphEvents` array that includes review graph nodes such as `dimension_node`, `file_node`, and `finding_node`.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the structured graphEvents contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware review convergence expects graphEvents in iteration records, and that graph replay tests show review JSONL records carrying dimension_node, file_node, and finding_node entries. Return a concise operator-facing verdict.

Expected signals: `graphEvents` referenced as iteration-record input for graph-aware review convergence; replay tests include review node-type coverage for `dimension_node`, `file_node`, and `finding_node`.

#### Test Execution
> **Feature File:** [DRV-015](03--iteration-execution-and-state-discipline/015-graph-events-review.md)


---

## 9. CONVERGENCE AND RECOVERY

This category covers 9 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-015 | Stop on max iterations

#### Description
Verify review stops at maxIterations (default 7) even if dimensions remain uncovered.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the hard iteration cap contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify maxIterations defaults to 7, that the loop exits unconditionally at that limit regardless of dimension coverage or convergence score, and that synthesis still runs after a hard stop. Return a concise operator-facing verdict.

Expected signals: `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced.

#### Test Execution
> **Feature File:** [DRV-015](04--convergence-and-recovery/015-stop-on-max-iterations.md)

### DRV-016 | Composite review convergence stop behavior

#### Description
Verify 3-signal composite convergence (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) with threshold 0.60.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the composite convergence contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the rolling average signal (weight 0.30, threshold 0.08), MAD noise floor signal (weight 0.25), and dimension coverage signal (weight 0.45, requires all 4 dimensions), their severity-weighted newFindingsRatio calculation, and the >0.60 weighted stop-score threshold. Return a concise operator-facing verdict.

Expected signals: Three named signals with weights 0.30/0.25/0.45, severity-weighted newFindingsRatio, rollingStopThreshold of 0.08, a composite stop threshold above 0.60, and dimension coverage requiring all 4 review dimensions.

#### Test Execution
> **Feature File:** [DRV-016](04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md)

### DRV-017 | P0 override blocks convergence

#### Description
Verify new P0 finding sets newFindingsRatio >= 0.50, blocking convergence.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the P0 override contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify any new P0 finding forces newFindingsRatio >= 0.50, that this value is high enough to prevent the composite stop score from reaching the 0.60 threshold, and that this behavior is documented as review-specific. Return a concise operator-facing verdict.

Expected signals: P0 finding sets `newFindingsRatio >= 0.50`, this blocks the rolling average signal from contributing to convergence, the composite score cannot reach 0.60, and review continues.

#### Test Execution
> **Feature File:** [DRV-017](04--convergence-and-recovery/017-p0-override-blocks-convergence.md)

### DRV-018 | Review quality guards block premature stop

#### Description
Verify 3 binary gates (evidence, scope, coverage) must all pass before STOP.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the quality guard contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify 3 binary gates are enforced before STOP: (1) Evidence gate -- every active finding has file:line evidence and is not inference-only, (2) Scope gate -- findings and reviewed files stay within declared review scope, (3) Coverage gate -- configured dimensions plus required traceability protocols are covered. Verify these gates are distinct from research mode guards. Return a concise operator-facing verdict.

Expected signals: Three named binary gates (evidence, scope, coverage), each must return true, enforcement happens after convergence check but before STOP transition, and gates are review-specific.

#### Test Execution
> **Feature File:** [DRV-018](04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md)

### DRV-019 | Stuck recovery widens dimension focus

#### Description
Verify stuck recovery switches to least-covered dimension.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the stuck recovery contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when stuckThreshold consecutive iterations produce newFindingsRatio below noProgressThreshold, the loop switches focus to the least-covered review dimension, that this is reflected in strategy.md "Next Focus", and that the stuck event is logged to the JSONL state. Return a concise operator-facing verdict.

Expected signals: `stuckThreshold=2` consecutive low-progress iterations trigger recovery, `noProgressThreshold=0.05` defines low progress, recovery selects the dimension with the lowest coverage count, strategy.md "Next Focus" is updated, and a stuck event is logged to JSONL.

#### Test Execution
> **Feature File:** [DRV-019](04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md)

### DRV-020 | Dimension coverage convergence signal

#### Description
Verify dimension coverage signal (weight 0.45) requires all 4 dimensions + minStabilizationPasses >= 1.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the dimension coverage convergence signal for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the signal has weight 0.45, requires all 4 review dimensions (Correctness, Security, Traceability, Maintainability) to be covered in strategy.md, requires minStabilizationPasses >= 1 (at least one iteration after full coverage where no new dimension-first findings appear), and only then contributes its weight to the composite stop score. Return a concise operator-facing verdict.

Expected signals: Weight 0.45, all 4 dimensions required, `minStabilizationPasses=1`, signal contributes 0 until conditions are met, strategy.md "Covered" list tracks dimension coverage.

#### Test Execution
> **Feature File:** [DRV-020](04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md)

### DRV-021 | Review graph convergence signals participate in legal-stop gates

#### Description
verify that when review stability signals nominate STOP but graph-backed dimension coverage remains below threshold, the legal-stop gates block premature STOP.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the graph-backed legal-stop gate contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware review convergence tracks graph dimension coverage, and that when legal-stop evaluation fails dimension coverage the review persists blocked-stop state instead of stopping. Return a concise operator-facing verdict.

Expected signals: review convergence docs describe `blockedStop` when legal-stop gates fail; graph convergence handler enforces review `dimensionCoverage`; fixture evidence shows `blocked_stop` with `blockedBy: ["dimensionCoverage", ...]`.

#### Test Execution
> **Feature File:** [DRV-021](04--convergence-and-recovery/021-graph-convergence-review.md)

### DRV-022 | Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus

#### Description
verify that a review packet with at least one `blocked_stop` event preserves the review-specific legal-stop bundle in `blockedStopHistory`, renders that blocked-stop evidence in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> on a review packet with at least one blocked_stop event preserves the review gate bundle in blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.

Expected signals: `blockedStopHistory` is non-empty; review entries preserve `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`; `BLOCKED STOPS` renders the same blocked-stop data; the strategy `next-focus` anchor contains the blocked-stop recovery strategy.

#### Test Execution
> **Feature File:** [DRV-022](04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md)

### DRV-023 | Review reducer fails closed on corruption and missing anchors

#### Description
verify that malformed JSONL blocks the reducer unless `--lenient` is passed, that missing machine-owned anchors block strategy rewrites unless `--create-missing-anchors` is passed, and that `corruptionWarnings` remains visible in reducer-owned state even when lenient recovery is used.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate fail-closed reducer behavior for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed JSONL exits with code 2 unless --lenient is passed, that missing machine-owned anchors throw Missing machine-owned anchor ... unless --create-missing-anchors is used, and that corruptionWarnings remains present after lenient recovery. Return a concise operator-facing verdict.

Expected signals: corrupt JSONL exits `2` without `--lenient`; `corruptionWarnings` is populated in the registry; missing anchors throw `Missing machine-owned anchor ...`; `--lenient` exits `0` while preserving `corruptionWarnings`; `--create-missing-anchors` appends the `next-focus` anchor and allows the reducer to proceed.

#### Test Execution
> **Feature File:** [DRV-023](04--convergence-and-recovery/023-fail-closed-reducer.md)


---

## 10. PAUSE, RESUME, AND FAULT TOLERANCE

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-021 | Pause sentinel halts between review iterations

#### Description
Verify that the `review/.deep-review-pause` sentinel halts the loop between iterations and logs a pause event.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the pause sentinel contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify {spec_folder}/review/.deep-review-pause is checked between review iterations, that a paused event is emitted to the JSONL state log, and that the loop halts without entering synthesis. Return a concise operator-facing verdict.

Expected signals: The sentinel is checked before dispatch, a paused event is logged to JSONL, the loop halts rather than flowing into synthesis, and the sentinel location is `review/.deep-review-pause`.

#### Test Execution
> **Feature File:** [DRV-021](05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md)

### DRV-022 | Resume after pause sentinel removal

#### Description
Verify removing pause sentinel lets review resume from read-state.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the resume-after-pause contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when the operator removes review/.deep-review-pause, the review loop re-reads deep-review-state.jsonl and deep-review-strategy.md, determines the correct iteration number, and resumes dispatching from the next iteration without re-running completed iterations. Return a concise operator-facing verdict.

Expected signals: Removing the sentinel triggers loop re-entry, JSONL is re-read to determine last iteration, strategy.md provides dimension coverage state, no iterations are re-run, and the resume event is logged.

#### Test Execution
> **Feature File:** [DRV-022](05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md)

### DRV-023 | Malformed JSONL lines are skipped with defaults

#### Description
Verify malformed JSONL lines are skipped gracefully in review state.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the malformed JSONL handling contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when review/deep-review-state.jsonl contains unparseable lines, those lines are skipped without halting the loop, that sensible defaults (e.g., newFindingsRatio = 1.0) are used to prevent premature convergence, and that the skip is logged or visible in the state. Return a concise operator-facing verdict.

Expected signals: Malformed lines are skipped (not crash), defaults applied (e.g., `newFindingsRatio = 1.0` to force continuation), iteration count still derived from valid lines, and the skip is observable.

#### Test Execution
> **Feature File:** [DRV-023](05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md)

### DRV-024 | JSONL reconstruction from review iteration files

#### Description
Verify JSONL can be reconstructed from review/iterations/ files.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the JSONL reconstruction contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify each review/iterations/iteration-NNN.md file contains sufficient metadata (iteration number, dimension, findings counts, newFindingsRatio) to reconstruct a valid JSONL state log, that the reconstruction path is documented, and that a reconstructed state log allows the review to resume. Return a concise operator-facing verdict.

Expected signals: Iteration files contain metadata matching JSONL fields, reconstruction path is documented or derivable, reconstructed JSONL allows loop resume, and iteration files are write-once (immutable after creation).

#### Test Execution
> **Feature File:** [DRV-024](05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md)


---

## 11. SYNTHESIS, SAVE, AND GUARDRAILS

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-025 | Review report synthesis has all 9 sections

#### Description
Verify review-report.md has all 9 sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the review report synthesis contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify review/review-report.md contains all 9 sections: (1) Executive Summary with verdict and severity counts, (2) Planning Trigger with routing rationale, (3) Active Finding Registry with deduped findings, (4) Remediation Workstreams with grouped action lanes, (5) Spec Seed with minimal spec delta, (6) Plan Seed with action-ready starter, (7) Traceability Status with protocol coverage, (8) Deferred Items with P2 advisories, (9) Audit Appendix with convergence evidence. Return a concise operator-facing verdict.

Expected signals: All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings with evidence, and Audit Appendix includes convergence data.

#### Test Execution
> **Feature File:** [DRV-025](06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md)

### DRV-026 | Review verdict determines post-review workflow

#### Description
Verify FAIL->plan, CONDITIONAL->plan, PASS->changelog routing with hasAdvisories metadata.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the verdict routing contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify three routing paths: (1) FAIL verdict (active P0 findings or any binary gate failure) routes to /spec_kit:plan for remediation, (2) CONDITIONAL verdict (no P0 but active P1 findings) routes to /spec_kit:plan for fixes, (3) PASS verdict (no P0/P1) routes to /create:changelog with hasAdvisories=true when P2 findings remain. Verify that the verdict and routing are documented in both the review report Executive Summary and the Planning Trigger section. Return a concise operator-facing verdict.

Expected signals: Three distinct verdicts, each with a documented next command, `hasAdvisories` flag on PASS with P2 findings, verdict appears in Executive Summary, and routing rationale appears in Planning Trigger.

#### Test Execution
> **Feature File:** [DRV-026](06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md)

### DRV-027 | Final synthesis memory save and guardrail behavior

#### Description
Verify memory save via generate-context.js after review completion.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the finalization and guardrail contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical review/review-report.md, memory save uses generate-context.js (not manual Write tool), the runtime agent remains LEAF-only (no sub-agent dispatch), and that the review agent does not modify target files under review (read-only contract). Return a concise operator-facing verdict.

Expected signals: Synthesis produces `review/review-report.md`, memory save calls `generate-context.js`, the runtime agent forbids nested delegation (LEAF-only), the agent never modifies files under review (read-only), and memory save uses the spec folder established at setup.

#### Test Execution
> **Feature File:** [DRV-027](06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md)

### DRV-028 | Finding deduplication and registry

#### Description
Verify finding deduplication uses adjudicated finalSeverity and produces clean registry.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, validate the finding deduplication contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify during synthesis, findings from all review/iterations/iteration-NNN.md files are compared for duplicates, that duplicate resolution uses adjudicated finalSeverity (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in review-report.md contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings. Return a concise operator-facing verdict.

Expected signals: Findings are compared across iterations by location and description, `finalSeverity` is the highest severity encountered, the Active Finding Registry contains unique entries only, P0 findings are never downgraded or discarded, and the registry includes file:line evidence for each finding.

#### Test Execution
> **Feature File:** [DRV-028](06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md)

---

## 12. AUTOMATED TEST CROSS-REFERENCE

No dedicated automated test suite currently exists for `sk-deep-review`. This playbook anchors directly to the live `sk-deep-review` docs plus the active command and runtime definitions.

- `SKILL.md`: `.opencode/skill/sk-deep-review/SKILL.md`
- `README.md`: `.opencode/skill/sk-deep-review/README.md`
- `Command`: `.opencode/command/spec_kit/deep-review.md`
- `Auto YAML`: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `Confirm YAML`: `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `Agent (OpenCode)`: `.opencode/agent/deep-review.md`
- `Agent (Claude)`: `.claude/agents/deep-review.md`
- `Review Contract`: `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
- `Loop Protocol`: `.opencode/skill/sk-deep-review/references/loop_protocol.md`
- `Convergence`: `.opencode/skill/sk-deep-review/references/convergence.md`
- `State Format`: `.opencode/skill/sk-deep-review/references/state_format.md`
- `Quick Reference`: `.opencode/skill/sk-deep-review/references/quick_reference.md`
