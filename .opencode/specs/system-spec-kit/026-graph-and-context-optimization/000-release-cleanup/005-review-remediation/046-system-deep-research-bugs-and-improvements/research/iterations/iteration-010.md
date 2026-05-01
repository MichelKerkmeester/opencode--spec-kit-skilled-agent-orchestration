# Iteration 010 — B5: Workflow command auto-routing

## Focus
Audited the `/spec_kit` command entrypoints and YAML workflow assets for auto-routing and state-machine failure modes. The pass focused on missing prerequisites, halted branches, malformed fallback state, and flags that are parsed in Markdown setup but lost when execution enters YAML.

## Actions Taken
- Enumerated `.opencode/command/spec_kit/` entrypoints and all YAML assets with `rg --files` and `wc -l`.
- Read command setup blocks for `complete.md`, `plan.md`, `implement.md`, `deep-research.md`, `deep-review.md`, and `resume.md`.
- Traced deep-research auto/confirm lifecycle paths around `step_acquire_lock`, `step_classify_session`, `step_evaluate_results`, `step_release_lock`, and resource-map emission.
- Traced deep-review auto/confirm lifecycle paths around `step_classify_session`, `post_dispatch_validate`, `step_evaluate_results`, and `step_emit_resource_map`.
- Checked executor audit helpers `writeFirstRecordExecutor`, `runAuditedExecutorCommand`, and `validateIterationOutputs` to confirm why fallback iteration records are schema-sensitive.
- Reviewed plan, implement, complete, and resume YAML slices for prerequisite gates, skip semantics, phase handoff, and recovery behavior.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-010-B5-01 | P1 | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-182` | `step_acquire_lock` takes the advisory research lock before `step_classify_session`, but `on_completed_session` and `on_invalid_state` halt at lines 215-221 while `step_release_lock` only runs in `phase_save` at lines 1011-1014. A completed or partial packet can therefore leave `.deep-research.lock` held and make the next run fail closed on contention. Confirm mode has the same shape: acquire at `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:152-155`, halt/cancel at lines 188-198, release only at lines 972-975. | Add a cleanup/finally release branch for every halt/cancel path after lock acquisition, or move lock acquisition after completed/invalid-state classification when no mutation will occur. |
| F-010-B5-02 | P1 | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:851-853` | `step_evaluate_results` says missing outputs should be marked as an error and continued, but its fallback appends `{"type":"iteration","run":...}` without the required `iteration` field. This contradicts `post_dispatch_validate` at lines 776-783, which requires `type`, `iteration`, `newInfoRatio`, `status`, `focus`, and it interacts badly with `step_read_state` at lines 364-365 because the loop counts any `type === "iteration"` line. A failed dispatch can consume an iteration slot while still being schema-invalid to the reducer/validator. | Emit a canonical error iteration record with `iteration`, not `run`, and include the same fields required by `post_dispatch_validate`; alternatively append an `event=dispatch_failure` and do not increment `iteration_count`. |
| F-010-B5-03 | P1 | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:812-814` | `step_evaluate_results` in deep-review auto has the same malformed fallback path. The fallback record uses `run` and omits required fields such as `iteration`, `sessionId`, `generation`, `lineageMode`, and `durationMs`, even though `post_dispatch_validate` requires them at lines 764-771. `step_read_state` counts `type === "iteration"` at lines 375-376, so an invalid recovery record can advance the loop and pollute convergence metrics. | Align the fallback record with the review iteration schema, including `iteration`, lineage fields, and duration, or use a non-iteration failure event that the loop does not count as completed work. |
| F-010-B5-04 | P2 | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:235-249` | The Markdown entrypoint parses `--no-resource-map` into `config.resource_map.emit = false` (`.opencode/command/spec_kit/deep-research.md:73`), but YAML `step_create_config` hard-codes `resource_map.emit: true` and writes `{"resource_map":{"emit":true}}`. `step_emit_resource_map` then relies on `config.resource_map.emit == false` to skip emission at lines 909-917, so the skip flag is ignored once execution enters YAML. Deep-review has the same bug: parse at `.opencode/command/spec_kit/deep-review.md:71`, hard-code at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:301-322`, emit gate at lines 1002-1010. | Add a setup-bound `resource_map_emit` value to YAML inputs and populate config/state-log from it in both auto and confirm assets; test `--no-resource-map` end to end for research and review. |

## Questions Answered
- Do the YAML workflows handle missing prerequisites and partial state? Partially: they often detect missing artifacts, but deep-research lock cleanup and fallback iteration records are unsafe on halted or failed paths.
- Can a workflow get stuck? Yes. Deep-research can leave the advisory lock active when classification halts after acquisition.
- Can a workflow skip or ignore required routing state? Yes. `--no-resource-map` is accepted by command setup but overwritten by YAML config creation.
- Are fallback state records schema-compatible? No for deep-research auto and deep-review auto; both append records that validators/reducers can reject while the loop counter still treats them as iterations.

## Questions Remaining
- Whether confirm-mode fallback handling should append a canonical failure record or stop immediately; current confirm YAML says "Mark iteration as error" but does not define the write.
- Whether non-native deep-review executor branches should use the same audited command wrapper as deep-research for dispatch failure normalization; the current YAML metadata references executor audit, but the raw command branches deserve a separate executor-focused pass.
- Whether plan/complete auto-mode P1 deferral language should be made non-interactive or hard-blocking; this pass saw tension there but did not classify it as a concrete bug.

## Next Focus
Follow up on executor-specific dispatch behavior across `cli-codex`, `cli-copilot`, `cli-gemini`, and `cli-claude-code`, especially audit provenance and dispatch-failure normalization in deep-review versus deep-research.
