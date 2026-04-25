# Iteration 3 - Correctness: Confirm YAML Approval Gates + Per-Skill Loop

## Summary

The confirm workflow has all four required approval gates, each gate includes `trigger`, `prompt`, and `accepted_responses`, the post-verify gate includes a `/memory:save` option, `rules.ALWAYS` includes `wait_for_user_approval_at_each_gate`, and shared `mutation_boundaries` / `scoring_sources` are in parity with the auto workflow. However, parity also carries forward the auto workflow's graph-metadata field mismatch from F-CORR-005, and confirm-mode-specific approval semantics are under-specified around per-lane filtering, post-verify rollback execution, build-failure gating, and per-skill edit handling.

## Findings

### P0 (Blockers)

- None.

### P1 (Required)

- F-CORR-010: Confirm mode inherits the graph-metadata scoring-source field mismatch already proven for auto mode.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:138-140`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:73-75`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md:17-20`
  - Impact: Confirm mode is in parity with auto mode, but the shared `scoring_sources.graph_metadata_per_skill.fields` contract still names `derived.triggers` and `derived.keywords`. Iteration 2 established those names do not match the real graph metadata/projection contract, so confirm-mode Phase 1/2/3 can produce no-op or schema-drifting metadata edits.
  - Remediation: Apply the F-CORR-005 remediation to both YAMLs: replace `derived.triggers` / `derived.keywords` with the actual graph-metadata fields, and document any read-only enrichment sources consistently.

- F-CORR-011: Confirm mode's per-lane approval option can still lead to unconditional Phase 3 lane edits.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:85-91`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:201-206`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:243-247`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md:39-42`
  - Impact: The pre-Phase 3 gate lets the user choose `C <lane>` and Phase 3 says to filter to the selected lane, but the next activities still instruct edits to explicit, lexical, and derived metadata. This is the confirm-mode approval equivalent of F-CORR-009: a user approving one lane may see all lanes applied.
  - Remediation: Rewrite Phase 3 apply activities as conditional scoped operations: only edit `explicit.ts` when the approved scoped diff contains explicit changes, only edit `lexical.ts` for lexical changes, and only edit graph metadata for derived changes. Validate `C` against `explicit|derived|lexical` before applying.

- F-CORR-012: The post-Phase 4 rollback choice has no rollback action or command attached.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:111`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:120-123`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:216`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:255`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:281`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:165-166`
  - Impact: `pre_phase_4` has a concrete `rollback_action`, and Phase 3 has `rollback_hint`, but `post_phase_4` only says `B) Rollback (tests failed)`. The hard post-verify gate says failure should trigger the post-Phase 4 rollback gate, yet that gate does not specify the rollback path to run. Operators get a visible rollback option without an executable contract.
  - Remediation: Add `rollback_action` to `post_phase_4`, matching the Phase 3 rollback hint, or make `post_phase_4.B` explicitly reference the existing rollback action.

- F-CORR-013: The pre-Phase 4 gate allows verification or verification skip even when the build failed.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:104-110`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:252-255`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:280`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:146-149`
  - Impact: The prompt displays `Build status: [success|failure]` but still offers A/B/C continuation choices, including `Skip verification`, when the build failed. Auto mode treats build failure as fail-fast and suggests rollback, while confirm mode merely offers rollback as option D. That can let an operator proceed past a failed apply/build boundary into a known-invalid verification state.
  - Remediation: Split pre-Phase 4 behavior by build status: if `build_status=failure`, only allow rollback or abort/report; if `build_status=success`, offer verification choices A/B/C.

### P2 (Suggestions)

- F-CORR-014: The per-skill loop's edit branch is user-visible but not machine-specified.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:91-99`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:211-214`
  - Impact: The per-skill prompt has clear A/B/C/D labels, but `C) Edit (provide replacement)` does not define replacement format, whether the replacement is the full skill diff or one lane, whether collision checks re-run, or how edited/skipped counts are represented. Phase 3 outputs track only applied and rejected proposal counts, so edited and skipped branches are ambiguous in the audit trail.
  - Remediation: Add a `per_skill_loop.accepted_responses` schema and handling contract, for example `A`, `B`, `C <replacement-diff>`, `D`, then add `edited_proposal_count` and `skipped_proposal_count` to Phase 3 outputs.

## Cross-References to Iterations 1 and 2

- Iteration 1's F-CORR-003 already covers the broader dry-run contract mismatch involving the YAML dry-run branch; this iteration did not duplicate it, but confirm mode repeats the same "write diff to scratch, skip writes, jump to phase_4" shape at `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:201`.
- Iteration 1's F-CORR-004 covered command-markdown rollback wording drift. This iteration adds confirm-YAML rollback execution issues at F-CORR-012 and F-CORR-013 rather than re-opening the markdown wording issue.
- Iteration 2's F-CORR-005 applies directly to confirm mode because confirm `scoring_sources` is intentionally in parity with auto `scoring_sources`; F-CORR-010 records that confirm-specific extension.
- Iteration 2's F-CORR-009 identified unconditional Phase 3 lane edits in auto mode. F-CORR-011 records the same correctness problem under confirm mode's user-approved `C <lane>` path, where it is more likely to violate explicit operator intent.

## Non-Findings / Confirmed Correct

- All four approval gates are present and each has `trigger`, `prompt`, and `accepted_responses`: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:64-77`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:78-91`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:99-111`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:112-123`.
- `post_phase_4` includes the required save-context option: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:119-123`.
- `pre_phase_4.rollback_action` matches the auto workflow rollback hint path: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:111`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:149`.
- `mutation_boundaries` are in parity between confirm and auto: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:49-58`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:49-58`.
- `scoring_sources` are in parity between confirm and auto: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:128-140`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:63-75`. This is structural parity, not semantic correctness; see F-CORR-010.
- `rules.ALWAYS` includes user approval discipline: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:290-295`.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-strategy.md:1-103`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-001.md:1-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md:1-77`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deltas/iteration-001.json:1-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deltas/iteration-002.json:1-59`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-state.jsonl:1-4`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/prompts/iteration-003.md:1-33`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:1-309`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:1-259`

## Convergence Signals
