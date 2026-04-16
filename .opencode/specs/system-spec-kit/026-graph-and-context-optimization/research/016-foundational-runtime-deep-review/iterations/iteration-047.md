# Iteration 47 — Domain 4: Stringly Typed Governance (7/10)

## Investigation Thread
I followed the open seam left by iteration 46: concrete false-positive prompt collisions in the `AGENTS.md` Gate 3 trigger list, then the split `folder_state` / `start_state` vocabulary inside `/spec_kit:plan` and how later system-spec-kit docs re-collapse that split into one generic state name.

## Findings

### Finding R47-001
- **File:** `AGENTS.md`; `.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md`; `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md`
- **Lines:** `AGENTS.md:182-185`; `002-confirm-mode-checkpointed-review.md:26-32,44-45`; `026-ruled-out-directions-in-synthesis.md:26-32,44-45`
- **Severity:** P2
- **Description:** Gate 3's file-modification trigger list is broad enough to collide with the repository's own non-mutating research/review prompts. The hard trigger word `phase` appears in `AGENTS.md`, but current manual-testing prompts use phrases like `phase transition` and `synthesis phase` for pure validation work that inspects docs and YAML rather than editing files.
- **Evidence:** `AGENTS.md` says Gate 3 fires on the literal trigger list `... analyze, decompose, phase ...` (`AGENTS.md:182-185`). Meanwhile the deep-review confirm-mode scenario asks the operator to "Confirm that ... approval gates are present at each phase transition" (`002-confirm-mode-checkpointed-review.md:26-32,44-45`), and the deep-research synthesis scenario asks the operator to "Verify the synthesis phase consolidates ruledOut entries ..." (`026-ruled-out-directions-in-synthesis.md:26-32,44-45`). Those are documentation-validation prompts, not file mutations, yet they reuse a Gate 3 trigger token verbatim.
- **Downstream Impact:** Agents that implement Gate 3 literally can interrupt or re-route repository-approved analysis prompts as if they were edit requests, forcing unnecessary spec-folder setup before read-only validation work. Because the trigger contract is only prose, this false-positive behavior can vary by runtime or prompt pack with no failing test to expose the drift.

### Finding R47-002
- **File:** `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`; `.opencode/skill/system-spec-kit/references/intake-contract.md`; `.opencode/skill/system-spec-kit/SKILL.md`; `.opencode/skill/system-spec-kit/README.md`
- **Lines:** `spec_kit_plan_auto.yaml:337-373`; `spec_kit_plan_confirm.yaml:360-398`; `intake-contract.md:39-49,56-76`; `SKILL.md:563-563,931-931`; `README.md:624-626`
- **Severity:** P2
- **Description:** `/spec_kit:plan` now carries two different state vocabularies for the same intake decision, but the public system-spec-kit docs collapse them back into a single generic `folder_state`. The YAML assets branch on local `folder_state` values (`no-spec | ... | populated`), map them to canonical `start_state` values (`empty-folder | ... | populated-folder`), and emit both in intake events, while the intake contract itself exposes only `start_state` as the returned classification.
- **Evidence:** The auto and confirm assets classify `folder_state`, map it to `start_state`, and emit both `folderState` and `startState` in `intake_triggered` / `intake_completed` payloads (`spec_kit_plan_auto.yaml:337-373`; `spec_kit_plan_confirm.yaml:360-398`). But the shared intake contract's formal output surface lists `start_state` as the classified state and defines the canonical enum in that vocabulary (`intake-contract.md:39-49,56-76`). Despite that split, the public system-spec-kit docs tell operators that `/spec_kit:plan` and `/spec_kit:complete` reuse intake "when packet `folder_state` requires repair or creation" (`SKILL.md:563-563`) and "without reopening intake unless `folder_state` still requires repair" (`SKILL.md:931-931`; `README.md:624-626`). A repo search on 2026-04-16 found no `folderState` / `startState` assertions under `.opencode/skill/system-spec-kit/mcp_server/tests` or `.opencode/skill/skill-advisor/tests`.
- **Downstream Impact:** Humans and agents can treat `folder_state` as the canonical intake enum even though the reusable contract boundary is `start_state`. That weakens telemetry, docs, and follow-up automation: a rename or prompt edit can desynchronize the event payload vocabulary from the intake contract without any schema or regression test failing.

## Novel Insights
- The remaining Domain 4 gap is now less about "docs vs code" and more about **scope bleed in governance words**: the same English token (`phase`) is reused for edit setup, lifecycle narration, and validation prompts, so a prose classifier cannot cleanly separate them.
- `/spec_kit:plan` exposes a genuine two-layer state machine - a local workflow classifier (`folder_state`) and a canonical intake classifier (`start_state`) - but top-level docs flatten that distinction back into one string. That makes the system look simpler than it is while removing the only clue about which enum is safe to reuse downstream.

## Next Investigation Angle
Trace the remaining open side of the Gate 3 seam: find false negatives where real file-modifying work avoids the trigger-word list, then follow `intake_triggered` / `intake_completed` to see whether any reducer, dashboard, or reporting surface consumes `folderState` as if it were the same normalized enum as `start_state`.
