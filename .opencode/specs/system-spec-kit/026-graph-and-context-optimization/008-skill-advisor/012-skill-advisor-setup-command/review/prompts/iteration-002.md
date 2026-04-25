You are running iteration 2 of 7 in a deep-review loop.

# Iteration 2 — Correctness: Auto YAML Workflow + Mutation Boundaries

## Focus
Audit `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml` for correctness:
- 5-phase workflow structure (Discovery → Analysis → Proposal → Apply → Verify)
- mutation_boundaries section (allowed_targets, forbidden_targets, enforcement)
- scoring_sources paths (must match real source file locations)
- quality_gates (pre_phase_3, post_phase_4)
- error_recovery completeness
- Internal consistency between scope flag, phase activities, and rules

## Required reads
1. `.opencode/specs/.../012-skill-advisor-setup-command/review/deep-review-strategy.md`
2. `.opencode/specs/.../012-skill-advisor-setup-command/review/iterations/iteration-001.md` (prior findings)
3. `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml`
4. `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` (verify path)
5. `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` (verify path)
6. `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts` (verify path)
7. Sample existing graph-metadata.json under `.opencode/skill/<any>/graph-metadata.json`

## What to look for
- mutation_boundaries.allowed_targets paths actually exist
- mutation_boundaries.forbidden_targets covers all sensitive surfaces
- Phase 3 enforcement language is unambiguous
- dry_run path skips Phase 3 entirely (no partial writes)
- skip_tests is opt-in only (default FALSE)
- Quality gates have concrete fail criteria
- Confidence framework thresholds and weights are coherent
- Rules ALWAYS / NEVER list is exhaustive vs phase activities

## Outputs (MANDATORY)
Same three artifacts as iteration 1, with paths swapped to `iteration-002`:
- `review/iterations/iteration-002.md`
- `review/deltas/iteration-002.json`
- Append to `review/deep-review-state.jsonl`

Use finding ID prefix `F-CORR-` for this dimension. Number continues from iteration 1's last ID.

## Constraints
- Read-only.
- Cite file:line for every finding.
- Cross-reference iteration 1's findings — do not duplicate.
- newFindingsRatio = (new findings this iteration) / (total findings to date).
