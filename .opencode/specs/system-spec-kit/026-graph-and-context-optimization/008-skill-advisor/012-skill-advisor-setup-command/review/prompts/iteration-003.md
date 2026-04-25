You are running iteration 3 of 7 in a deep-review loop.

# Iteration 3 — Correctness: Confirm YAML Approval Gates + Per-Skill Loop

## Focus
Audit `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml` for correctness:
- approval_gates section: pre_phase_2, pre_phase_3, pre_phase_4, post_phase_4
- Per-skill loop semantics (Phase 3 option B)
- Per-lane filter semantics (Phase 3 option C)
- Rollback gate logic at pre_phase_4 / post_phase_4
- Parity with auto.yaml on shared structures (mutation_boundaries, scoring_sources)
- User-visible prompts are clear and complete

## Required reads
1. Strategy + iterations 1 and 2 outputs
2. `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml`
3. `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml` (parity reference)

## What to look for
- Each approval_gate has trigger, prompt, accepted_responses
- Per-skill loop in pre_phase_3 has clear A/B/C/D options
- Rollback action paths match auto.yaml's rollback_hint
- post_phase_4 gate includes save-context option
- No drift between auto and confirm on mutation_boundaries
- Rules ALWAYS includes wait_for_user_approval

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-003` suffix. ID prefix `F-CORR-`.

## Constraints
- Read-only.
- Cite file:line for every finding.
- Cross-reference iterations 1 and 2.
