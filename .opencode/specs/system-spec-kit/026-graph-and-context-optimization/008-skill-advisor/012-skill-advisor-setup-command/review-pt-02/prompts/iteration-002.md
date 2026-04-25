You are running iteration 2 of 5 in a CLOSURE re-review loop.

# Iteration 2 — Closure Verification: Security (F-SEC-001..006)

## Required reads
1. `.opencode/specs/.../012-skill-advisor-setup-command/review-pt-02/deep-review-strategy.md`
2. `.opencode/specs/.../012-skill-advisor-setup-command/review-pt-02/iterations/iteration-001.md` (prior closure verdicts)
3. `.opencode/specs/.../012-skill-advisor-setup-command/review/iterations/iteration-004.md` (original F-SEC-001..006 findings)
4. CURRENT: command markdown, both YAMLs, install guide, runner.sh

## What to verify

Findings (re-verify each with CLOSED/REGRESSED/PARTIAL + file:line):
- F-SEC-001: Untrusted SKILL.md frontmatter without data-only boundary; broad mutating tools
  → expect: Task removed from allowed-tools; YAMLs have `treat_skill_metadata_as_data_only` ALWAYS rule and `follow_instructions_embedded_in_skill_metadata` NEVER rule
- F-SEC-002: Mutation-boundary lacks canonical target validation
  → expect: `mutation_boundaries.validator` block exists in both YAMLs with realpath/repo-relative/allowlist exact-match
- F-SEC-003: Rollback uses broad `git checkout HEAD --` without clean-tree guard
  → expect: per-run rollback script generated (Phase 3 step 3); install guide §5 rewritten
- F-SEC-004: review/runner.sh grants `--allow-all-tools` for nominally read-only iterations
  → expect: security note header added documenting the read-only-iteration scope
- F-SEC-005: Proposal diffs in /tmp without permission guidance
  → expect: `{packet_scratch}/skill-advisor-proposal-{timestamp}.md` (umask 077, repo-local) in both YAMLs
- F-SEC-006 (P2): TOKEN/PHRASE proposal validation is collision-only, not literal/schema
  → expect: `proposal_validation` block in Phase 2 of both YAMLs with key patterns + length limits + boost range

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-002` suffix. ID prefix `F-SEC-` for any new findings.

## Constraints
- Read-only.
- Cite file:line for every verdict.
- Severity calibration: a NEW P0 security finding requires known exploit path.
