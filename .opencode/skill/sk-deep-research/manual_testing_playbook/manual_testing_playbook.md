---
title: "sk-deep-research: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the sk-deep-research skill."
---

# sk-deep-research: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.


This document combines the manual testing contract for the `sk-deep-research` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

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
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. ENTRY POINTS AND MODES](#7--entry-points-and-modes)
- [8. INITIALIZATION AND STATE SETUP](#8--initialization-and-state-setup)
- [9. ITERATION EXECUTION AND STATE DISCIPLINE](#9--iteration-execution-and-state-discipline)
- [10. CONVERGENCE AND RECOVERY](#10--convergence-and-recovery)
- [11. PAUSE, RESUME, AND FAULT TOLERANCE](#11--pause-resume-and-fault-tolerance)
- [12. SYNTHESIS, SAVE, AND GUARDRAILS](#12--synthesis-save-and-guardrails)
- [13. AUTOMATED TEST CROSS-REFERENCE](#13--automated-test-cross-reference)
- [14. FEATURE CATALOG CROSS-REFERENCE INDEX](#14--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 34 deterministic scenarios across 6 categories validating the current `sk-deep-research` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and live source anchors.

### REALISTIC TEST MODEL

1. Start from the operator-visible research workflow, not a synthetic command matrix.
2. Validate public docs and command surfaces before deeper YAML or reducer contracts when that order matters.
3. Capture enough evidence that another operator can reproduce the verdict without re-deriving the scenario.
4. Report a concise user-facing verdict rather than raw implementation notes.

---

## 2. GLOBAL PRECONDITIONS

- `sk-deep-research` skill exists at `.opencode/skill/sk-deep-research/`.
- `/spec_kit:deep-research` command exists at `.opencode/command/spec_kit/deep-research.md`.
- `@deep-research` agent definition exists at `.opencode/agent/deep-research.md` plus runtime variants.
- Deep-research YAML workflows and reducer/runtime assets are available in the repository.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- A PASS, PARTIAL, or FAIL verdict with reasoning.
- Evidence captured from live file contents or generated artifacts.
- Cross-source consistency checks across README, quick reference, command, YAML, and reducer/state assets.
- The exact prompt used when orchestration behavior is part of the scenario.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Use `rg`, `sed`, and direct artifact inspection to gather deterministic evidence.
- Follow the prescribed order so user-facing documentation is checked before lower-level workflow contracts when sequencing matters.
- Keep the final verdict tied to captured evidence instead of inferred runtime behavior.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when the expected artifacts, prompts, workflow routing, and evidence all align.
- The feature files remain the source of execution truth when the root summary is intentionally terse.
- Release readiness depends on complete scenario coverage and no unresolved blocking contradictions.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1 covers entrypoint and initialization checks.
- Wave 2 covers iteration-state discipline and reducer/dashboard updates.
- Wave 3 covers convergence, quality guards, and stuck recovery.
- Wave 4 covers pause/resume, reconstruction, synthesis, memory save, and later-loop hardening.

---

## 7. ENTRY POINTS AND MODES

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-001 | Auto mode deep-research kickoff

#### Description
Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the autonomous entrypoint for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-research:auto is documented consistently across the README, quick reference, command entrypoint, and autonomous YAML workflow. Return a concise user-facing pass/fail verdict with the expected artifact summary.

Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `research/research.md`.

#### Test Execution
> **Feature File:** [DR-001](01--entry-points-and-modes/001-auto-mode-deep-research-kickoff.md)

### DR-002 | Confirm mode checkpointed execution

#### Description
Verify that confirm mode adds approval checkpoints without changing the core loop phases or artifact contract.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the confirm-mode contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-research:confirm is documented as interactive, approval-gated, and still uses the same core loop and output artifacts as auto mode. Return a concise operator-facing verdict.

Expected signals: Confirm mode is interactive, approval-gated, and still routes through initialization, loop, synthesis, and save rather than a separate workflow.

#### Test Execution
> **Feature File:** [DR-002](01--entry-points-and-modes/002-confirm-mode-checkpointed-execution.md)

### DR-003 | Parameterized invocation with --max-iterations and --convergence

#### Description
Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the setup-binding contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the command entrypoint gathers required values before loading YAML and that the YAML preflight rejects missing bindings or invalid spec-folder scope. Return a concise pass/fail verdict.

Expected signals: The command explicitly names topic, spec folder, execution mode, max iterations, and convergence threshold; YAML preflight verifies them before file writes.

#### Test Execution
> **Feature File:** [DR-003](01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md)


---

## 8. INITIALIZATION AND STATE SETUP

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-004 | Fresh initialization creates canonical state files

#### Description
Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the fresh-initialization contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates deep-research-config.json, deep-research-state.jsonl, and deep-research-strategy.md from the live templates. Return a concise user-facing pass/fail verdict.

Expected signals: The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record.

#### Test Execution
> **Feature File:** [DR-004](02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md)

### DR-005 | Resume classification from valid prior state

#### Description
Verify that the workflow classifies an existing valid scratch state as resumable before writing new files.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the resume-classification contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify config, JSONL, and strategy are inspected before new files are written and that a valid prior state skips re-initialization. Return a concise pass/fail verdict.

Expected signals: A four-state classification model exists, resume skips init writes, and completed sessions route differently from active resumes.

#### Test Execution
> **Feature File:** [DR-005](02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md)

### DR-006 | Invalid or contradictory state halts for repair

#### Description
Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the invalid-state halt contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify contradictory or partial deep-research artifacts stop the workflow for repair instead of guessing through initialization. Return a concise user-facing pass/fail verdict.

Expected signals: Invalid-state is a named class, both YAML files halt with a repair message, and the docs do not promise silent guessing for contradictory state.

#### Test Execution
> **Feature File:** [DR-006](02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md)

### DR-027 | Research charter validated at init

#### Description
Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the research charter validation contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization Step 5a verifies the presence of "Non-Goals" and "Stop Conditions" sections in strategy.md, appends empty placeholders if missing, and presents the charter for user review in confirm mode. Return a concise operator-facing verdict.

Expected signals: strategy.md has a "## 4. Non-Goals" section (may be empty but must exist); strategy.md has a "## 5. Stop Conditions" section (may be empty but must exist); if either section is missing, it is appended as an empty placeholder; in confirm mode, the charter (topic, key questions, non-goals, stop conditions) is presented for user review before proceeding.

#### Test Execution
> **Feature File:** [DR-027](02--initialization-and-state-setup/027-research-charter-validation.md)


---

## 9. ITERATION EXECUTION AND STATE DISCIPLINE

This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-007 | Iteration reads state before research

#### Description
Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the read-state-first iteration contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-research agent both require reading JSONL and strategy state before any research actions. Return a concise operator verdict.

Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.

#### Test Execution
> **Feature File:** [DR-007](03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md)

### DR-008 | Iteration writes iteration-NNN.md, JSONL record, and reducer refresh

#### Description
Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the iteration write-back contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md. Return a concise operator-facing verdict.

Expected signals: Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects.

#### Test Execution
> **Feature File:** [DR-008](03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md)

### DR-009 | Strategy “Next Focus” and exhausted-approach discipline

#### Description
Verify that the loop honors the strategy file’s Next Focus and avoids approaches marked exhausted or blocked.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the strategy-discipline contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify iteration focus comes from Next Focus and that exhausted or blocked approaches are not retried. Return a concise user-facing verdict.

Expected signals: Next Focus is read explicitly, exhausted approaches are treated as do-not-retry, and recovery mode consults deferred ideas instead of repeating blocked tactics.

#### Test Execution
> **Feature File:** [DR-009](03--iteration-execution-and-state-discipline/009-strategy-next-focus-and-exhausted-approach-discipline.md)

### DR-010 | Progressive synthesis behavior for research/research.md

#### Description
Verify that `research/research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the progressive-synthesis contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify research/research.md is workflow-owned canonical output, that incremental updates are allowed when progressiveSynthesis is true, and that synthesis still finalizes the document. Return a concise verdict.

Expected signals: The docs describe `research/research.md` as workflow-owned, `progressiveSynthesis` defaults to true, and the final synthesis phase still runs.

#### Test Execution
> **Feature File:** [DR-010](03--iteration-execution-and-state-discipline/010-progressive-synthesis-behavior-for-research-md.md)

### DR-024 | Dashboard generation after iteration

#### Description
Verify dashboard.md is auto-generated after iteration evaluation with correct content.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the dashboard generation contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict.

Expected signals: `research/deep-research-dashboard.md` exists after at least one iteration completes, contains an iteration table, question status with X/Y answered, trend with last 3 newInfoRatio values, dead ends consolidated from ruledOut data, next focus from strategy.md, and active risks.

#### Test Execution
> **Feature File:** [DR-024](03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md)

### DR-025 | Novelty justification present in JSONL

#### Description
Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the novelty justification contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL iteration record schema requires both newInfoRatio and noveltyJustification, that the justification is a human-readable sentence, and that ALWAYS rule 11 and the agent Step 6 mandate their inclusion. Return a concise operator-facing verdict.

Expected signals: JSONL iteration records contain both `newInfoRatio` (number, 0.0-1.0) and `noveltyJustification` (string, human-readable sentence); the justification field is listed as required in v1.1.0 agent instructions; ALWAYS rule 11 mandates both fields.

#### Test Execution
> **Feature File:** [DR-025](03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md)

### DR-028 | Focus track labels in dashboard

#### Description
Verify optional focusTrack labels appear in JSONL and dashboard iteration table.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the focusTrack label contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL state format defines focusTrack as an optional field on iteration records, and that the dashboard Progress table surfaces a Track column. Return a concise operator-facing verdict.

Expected signals: JSONL iteration records with an optional focusTrack field, dashboard Progress table with a Track column.

#### Test Execution
> **Feature File:** [DR-028](03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md)

### DR-029 | Research iterations emit flat graphEvents

#### Description
verify that a running deep research iteration writes a `graphEvents` array that uses the shipped flat `type` schema (`question`, `finding`, `source`, `edge`) rather than the older nested `kind/nodeType` form.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the flat graphEvents contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware research convergence expects graphEvents in iteration records, and that the shipped state-format contract plus active graph tests use flat event types such as question, finding, source, and edge rather than question_node/finding_node wrappers. Return a concise operator-facing verdict.

Expected signals: `graphEvents` documented as iteration-record input for graph-aware convergence; the state-format example uses flat `type` values; active graph tests use `question`, `finding`, and `source` node types rather than `question_node` / `finding_node` wrappers.

#### Test Execution
> **Feature File:** [DR-029](03--iteration-execution-and-state-discipline/029-graph-events-emission.md)


---

## 10. CONVERGENCE AND RECOVERY

This category covers 13 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-011 | Stop on max iterations

#### Description
Verify that max iterations is a hard stop checked before softer convergence signals.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the max-iterations stop contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the hard cap is checked before softer convergence logic and that the stop reason is surfaced as max_iterations_reached. Return a concise operator verdict.

Expected signals: Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs.

#### Test Execution
> **Feature File:** [DR-011](04--convergence-and-recovery/011-stop-on-max-iterations.md)

### DR-012 | Stop when all key questions are answered

#### Description
Verify that the loop stops when the tracked key questions are fully answered.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the all-questions-answered stop contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop stops when the tracked key questions are answered and that this condition is checked before softer convergence logic. Return a concise verdict.

Expected signals: Question completion is a named hard stop and is reflected in the convergence and usage docs.

#### Test Execution
> **Feature File:** [DR-012](04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md)

### DR-013 | Composite convergence stop behavior

#### Description
Verify the three-signal weighted stop model and its graceful degradation rules.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the composite-convergence contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the rolling average, MAD noise floor, and question-entropy signals, their weights, and the >0.60 weighted stop-score threshold. Return a concise operator-facing verdict.

Expected signals: Three named signals, weights of 0.30/0.35/0.35, graceful degradation with fewer iterations, and a stop threshold above 0.60.

#### Test Execution
> **Feature File:** [DR-013](04--convergence-and-recovery/013-composite-convergence-stop-behavior.md)

### DR-014 | Stuck recovery widens focus and continues

#### Description
Verify that stuck detection triggers a recovery path that widens focus before giving up.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the stuck-recovery contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify consecutive no-progress iterations trigger recovery, widen focus to a less-explored question, consult deferred ideas, and continue before final synthesis. Return a concise verdict.

Expected signals: Stuck threshold is enforced, recovery resets the counter, the next focus widens scope, and the ideas backlog can be consulted during recovery.

#### Test Execution
> **Feature File:** [DR-014](04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md)

### DR-020 | Quality Guard — Source Diversity

#### Description
Verify that convergence STOP is blocked when an answered question cites <2 independent sources.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the source diversity quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question for >= 2 independent sources, and that a violation emits a guard_violation event and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: guard_violation event logged with guard="source_diversity", STOP decision overridden to CONTINUE, violated question targeted in next iteration focus.

#### Test Execution
> **Feature File:** [DR-020](04--convergence-and-recovery/020-quality-guard-source-diversity.md)

### DR-021 | Quality Guard — Focus Alignment

#### Description
Verify that convergence STOP is blocked when answered questions don't map to original key questions.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the focus alignment quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard compares answered questions against the original key questions from initialization, and that a mismatch emits a guard_violation event with guard="focus_alignment" and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: guard_violation event logged with guard="focus_alignment", STOP decision overridden to CONTINUE, misaligned question flagged in violation detail.

#### Test Execution
> **Feature File:** [DR-021](04--convergence-and-recovery/021-quality-guard-focus-alignment.md)

### DR-022 | Quality Guard — No Single-Weak-Source

#### Description
Verify that convergence STOP is blocked when an answered question relies solely on a tentative source.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the no-single-weak-source quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question backed by exactly one source for sourceStrength == "tentative", and that a violation emits a guard_violation event with guard="single_weak_source" and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: guard_violation event logged with guard="single_weak_source", STOP decision overridden to CONTINUE, violated question targeted for stronger sourcing in next iteration.

#### Test Execution
> **Feature File:** [DR-022](04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md)

### DR-023 | Composite Convergence Passes but Guard Fails → CONTINUE

#### Description
Verify the full override path: composite score >0.60 triggers STOP, quality guards check fires, guard fails, decision overridden to CONTINUE.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the convergence-guard override path for sk-deep-research. Trace the full sequence: composite convergence votes STOP (score >0.60), then checkQualityGuards runs, then a guard violation is detected, then the STOP is overridden to CONTINUE and the loop resumes against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify this flow exists in convergence.md Decision Priority step 4.5, the YAML algorithm, and loop_protocol.md Step 2c. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: convergence_check with decision STOP and score >0.60, followed by guard_violation event, followed by decision override to CONTINUE and loop resumption.

#### Test Execution
> **Feature File:** [DR-023](04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md)

### DR-029 | Insight status prevents false stuck detection

#### Description
Verify that an iteration with status "insight" and low newInfoRatio does NOT increment stuck count.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the insight-status contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify state_format.md defines "insight" as a valid iteration status, that convergence.md documents how stuckCount is computed, and that insight iterations are excluded from stuck counting. Return a concise operator-facing verdict.

Expected signals: Iteration with status="insight" and low newInfoRatio, stuck_count NOT incremented.

#### Test Execution
> **Feature File:** [DR-029](04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md)

### DR-030 | Thought status handling in convergence

#### Description
Verify that "thought" iterations are handled correctly in convergence.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the thought-status convergence contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify state_format.md defines "thought" as a valid iteration status marking analytical-only iterations, that convergence.md documents how thought iterations are excluded from stuck counting and the rolling average, and that SKILL.md lists it in the status taxonomy. Return a concise operator-facing verdict.

Expected signals: Iteration with status="thought", convergence treats it appropriately (does not count as stuck, does not count toward rolling average).

#### Test Execution
> **Feature File:** [DR-030](04--convergence-and-recovery/030-thought-status-convergence-handling.md)

### DR-031 | Graph convergence signals act as STOP-blocking guards

#### Description
verify that when deep research convergence math votes STOP but `sourceDiversity` remains below the `0.4` guard threshold, STOP is blocked and blocked-stop evidence is recorded.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the graph stop-blocking guard contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify SOURCE_DIVERSITY_THRESHOLD = 0.4 blocks STOP when unmet, and that the research convergence reference records blocked-stop persistence with stopReason: "blockedStop" when legal-stop gates fail. Return a concise operator-facing verdict.

Expected signals: `SOURCE_DIVERSITY_THRESHOLD = 0.4`; `evaluateGraphGates()` fails `sourceDiversity` when below threshold; research convergence docs map failed legal-stop gates to `stopReason: "blockedStop"` and `blocked_stop` persistence.

#### Test Execution
> **Feature File:** [DR-031](04--convergence-and-recovery/031-graph-convergence-signals.md)

### DR-032 | Research reducer surfaces blocked-stop history across registry, dashboard, and next-focus

#### Description
verify that a research packet with at least one `blocked_stop` event surfaces that event into reducer-owned `blockedStopHistory`, the `BLOCKED STOPS` dashboard section, and the strategy `next-focus` anchor.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> on a research packet with at least one blocked_stop event populates blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.

Expected signals: `blockedStopHistory` is non-empty; each entry exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp`; `BLOCKED STOPS` renders the same blocked-stop data; the strategy `next-focus` anchor includes the recovery hint from the latest blocked-stop event.

#### Test Execution
> **Feature File:** [DR-032](04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md)

### DR-033 | Research graph-aware stop gate surfaces convergence verdict and workflow hooks

#### Description
verify that `graph_convergence` events become reducer-owned `graphConvergenceScore`, `graphDecision`, and `graphBlockers`, that the dashboard renders those graph signals, and that the live auto workflow invokes the graph tools before the inline 3-signal vote.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate graph-aware stop-gate integration for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph_convergence reducer output populates graphConvergenceScore, graphDecision, and graphBlockers, that the dashboard renders GRAPH CONVERGENCE, and that the research auto workflow calls deep_loop_graph_upsert plus deep_loop_graph_convergence before the inline 3-signal vote. Return a concise operator-facing verdict.

Expected signals: `graphConvergenceScore`, `graphDecision`, and `graphBlockers` appear in the registry; `GRAPH CONVERGENCE` appears in the dashboard; YAML includes `deep_loop_graph_upsert` and `deep_loop_graph_convergence` before the inline 3-signal vote.

#### Test Execution
> **Feature File:** [DR-033](04--convergence-and-recovery/033-graph-aware-stop-gate.md)


---

## 11. PAUSE, RESUME, AND FAULT TOLERANCE

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-015 | Pause sentinel halts between iterations

#### Description
Verify that the pause sentinel halts the loop between iterations and logs a pause event.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the pause-sentinel contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify research/.deep-research-pause is checked between research iterations, {spec_folder}/review/.deep-research-pause is checked between review iterations, both emit a paused event, and both halt the loop without entering synthesis. Return a concise operator-facing verdict.

Expected signals: The sentinel is checked before dispatch, a paused event is logged, and the loop halts rather than flowing into synthesis.

#### Test Execution
> **Feature File:** [DR-015](05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md)

### DR-016 | Resume after pause sentinel removal

#### Description
Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the pause-resume contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify removing research/.deep-research-pause lets the research loop log a resumed event and continue from the read-state step, and removing {spec_folder}/review/.deep-research-pause lets the review loop do the same, instead of either mode starting from scratch. Return a concise verdict.

Expected signals: The loop logs `resumed`, continues from state read, and does not recreate config/strategy files during a valid resume.

#### Test Execution
> **Feature File:** [DR-016](05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md)

### DR-017 | Malformed JSONL lines are skipped with defaults

#### Description
Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the JSONL fault-tolerance contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed lines are skipped, missing fields are defaulted, and a warning is emitted instead of crashing the loop. Return a concise operator-facing verdict.

Expected signals: Per-line parse protection exists, defaults are specified, skipped-line warnings are documented, and convergence operates on valid entries only.

#### Test Execution
> **Feature File:** [DR-017](05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md)

### DR-018 | JSONL reconstruction from iteration files

#### Description
Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the state-reconstruction contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the workflow can scan iteration-NNN.md files, reconstruct JSONL iteration records, and log a state_reconstructed event. Return a concise operator-facing verdict.

Expected signals: The reconstruction algorithm scans iteration files, extracts assessment data, writes reconstructed records, and logs a `state_reconstructed` event.

#### Test Execution
> **Feature File:** [DR-018](05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md)


---

## 12. SYNTHESIS, SAVE, AND GUARDRAILS

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-019 | Final synthesis plus memory save and guardrail behavior

#### Description
Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the finalization and guardrail contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical research/research.md, memory save uses generate-context.js, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, :restart segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees. Return a concise operator verdict.

Expected signals: Synthesis produces canonical `research/research.md`, memory save calls `generate-context.js`, the Codex runtime agent forbids nested delegation, and wave orchestration, checkpoint commits, segment transitions, and alternate CLI dispatch remain reference-only.

#### Test Execution
> **Feature File:** [DR-019](06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md)

### DR-026 | Ruled-out directions synthesized

#### Description
Verify that iteration ruledOut data is consolidated into "Eliminated Alternatives" in research/research.md.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the ruled-out directions synthesis contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the synthesis phase consolidates ruledOut entries from JSONL records and ## Dead Ends sections from iteration files into a mandatory "Eliminated Alternatives" section in research/research.md. Verify that strategy.md also tracks ruled-out directions per iteration. Return a concise operator-facing verdict.

Expected signals: research/research.md has a mandatory "Eliminated Alternatives" section formatted as a table (`| Approach | Reason Eliminated | Evidence | Iteration(s) |`); iteration files have `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured; strategy.md has a `## 10. Ruled Out Directions` section updated per iteration; ALWAYS rule 10 mandates documenting ruled-out directions.

#### Test Execution
> **Feature File:** [DR-026](06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`: runtime mirror alignment, capability matrix coverage, and artifact naming.
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`: reducer idempotency, question resolution, finding counts, convergence score, and dashboard content.

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

No dedicated `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/`. Use the live source anchors inside each per-feature file as the canonical implementation cross-reference surface.
