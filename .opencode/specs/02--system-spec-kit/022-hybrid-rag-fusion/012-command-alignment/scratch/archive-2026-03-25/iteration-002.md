# Review Findings: Wave 1, Agent B1

## Metadata
- Dimension: correctness
- Files Reviewed: 15
- Model: gpt-5.4
- Effort: high
- Wave: 1 of 5

## Findings

### [F-007] [P1] `:with-research` is wired to nonexistent workflow filenames
- **File**: `.opencode/command/spec_kit/complete.md:98`
- **Evidence**: `complete.md` advertises `:with-research` as a supported path, while the backing YAMLs reference `spec_kit_research_auto.yaml` and `spec_kit_research_confirm.yaml` (`assets/spec_kit_complete_auto.yaml:37-38,472-473`, `assets/spec_kit_complete_confirm.yaml:36-37,523-525`). The documented asset roster contains no such files.
- **Impact**: The advertised `:with-research` path has no resolvable YAML target, so the research branch of `/spec_kit:complete` can fail at workflow dispatch time.
- **Fix**: Rename the references to the existing `spec_kit_deep-research_{auto,confirm}.yaml` assets or add the missing `spec_kit_research_{auto,confirm}.yaml` files, then align `complete.md` and `README.txt`.
- **Claim Adjudication**:
  - Claim: `/spec_kit:complete :with-research` currently points at missing YAML assets.
  - Evidence Refs: `.opencode/command/spec_kit/complete.md:98-100`; `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:37-38,472-473`; `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:36-37,523-525`; `.opencode/command/spec_kit/README.txt:91-105`
  - Counterevidence Sought: Searched `assets/` for `spec_kit_research_*.yaml`; none exist.
  - Alternative Explanation: A hidden resolver could alias `spec_kit_research_*` to `spec_kit_deep-research_*`.
  - Confidence: 0.96
  - Downgrade Trigger: Evidence of a runtime alias/indirection that maps `spec_kit_research_*` to an existing workflow.

---

### [F-008] [P1] The documented `/spec_kit:plan` -> `/spec_kit:implement` handoff contradicts the actual `tasks.md` prerequisite
- **File**: `.opencode/command/spec_kit/plan.md:160`
- **Evidence**: `plan.md` explicitly says `/spec_kit:plan` creates `spec.md` and `plan.md` but not `tasks.md`, yet `implement.md` says `tasks.md` is "created if missing". The actual implement workflows hard-require `tasks.md` before proceeding.
- **Impact**: A user following the documented chain can land in an impossible state: plan says no `tasks.md`, implement docs imply recovery, but the YAML gate requires `tasks.md` to already exist.
- **Fix**: Choose one contract and enforce it everywhere: either make `/spec_kit:plan` generate `tasks.md`, or make `/spec_kit:implement` genuinely create it before prerequisite validation.
- **Claim Adjudication**:
  - Claim: The plan-to-implement workflow is internally contradictory around `tasks.md`.
  - Evidence Refs: `.opencode/command/spec_kit/plan.md:158-160,199`; `.opencode/command/spec_kit/implement.md:162-165`; `spec_kit_implement_auto.yaml:97-101,316`; `spec_kit_implement_confirm.yaml:97-101,335`
  - Counterevidence Sought: Checked whether implement later creates `tasks.md`; it does, but only after the initial `--require-tasks` prerequisite check.
  - Alternative Explanation: `check-prerequisites.sh --require-tasks` could synthesize `tasks.md` as a side effect.
  - Confidence: 0.95
  - Downgrade Trigger: Evidence that the prerequisite script auto-generates `tasks.md` before validation fails.

---

### [F-009] [P2] `implement.md` documents the wrong PREFLIGHT/POSTFLIGHT contract
- **File**: `.opencode/command/spec_kit/implement.md:287`
- **Evidence**: `implement.md` says Step 5.5/7.5 call `task_preflight()`/`task_postflight()` with `knowledgeScore`, `uncertaintyScore`, and `contextScore` on a `0-100` scale. The actual YAMLs capture inline `0-10` values instead and compute `learning_index_calculation: "Knowledge Delta + Uncertainty Reduction + Context Improvement / 3"`.
- **Impact**: Anyone using `implement.md` as the reference contract will record incompatible scores and wrong learning-index semantics.
- **Fix**: Update `implement.md` to reflect the current YAML behavior, or change both implement YAMLs to invoke the documented contract.

---

### [F-010] [P2] `complete.md` places the research subworkflow at the wrong step
- **File**: `.opencode/command/spec_kit/complete.md:98`
- **Evidence**: The execution-mode table says `:with-research` will "Insert 9-step research phase at Step 6". The YAML instead inserts research `after_phase_2` and executes `phase_3_research` before `step_3_specification`.
- **Impact**: The markdown describes the wrong lifecycle order, so reviewers and operators get the wrong mental model.
- **Fix**: Update `complete.md` to say research runs after Step 2/before specification, or move the YAML insertion point.

## Summary
- Total findings: 4
- Severity counts: P0=0, P1=2, P2=2
- Files reviewed: plan.md, implement.md, complete.md, deep-research.md, README.txt, 10 YAML assets
- newFindingsRatio: 1.0
