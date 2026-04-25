# Iteration 1 - Correctness: Command Markdown + Setup Phase

## Summary

The command markdown has the required frontmatter, Gate 3 exemption table, `$ARGUMENTS` block, key behavior subsections, 5-phase workflow table, and sequential Sections 1-13. The main correctness issues are internal contradictions around setup ownership, default no-suffix mode, and dry-run execution/output contracts.

## Findings

### P0 (Blockers)

- None.

### P1 (Required)

- F-CORR-001: The no-suffix execution mode contract is contradictory: the command says mode defaults to interactive unless `:auto` is used, but the setup parser sets no suffix to `ASK` and includes Q0.
  - Evidence: `.opencode/command/spec_kit/skill-advisor.md:43`, `.opencode/command/spec_kit/skill-advisor.md:56`
  - Remediation: Pick one no-suffix behavior and make the top-level description and setup parser match. If the intended behavior is the consolidated prompt, change the default-mode sentence to "No suffix prompts for execution mode."

- F-CORR-002: The execution protocol tells runners to load YAML as the first action, but the same file later says YAML loads only after setup passes. This can bypass the Markdown-owned setup phase that binds `execution_mode`, `scope`, `skip_tests`, and `dry_run`.
  - Evidence: `.opencode/command/spec_kit/skill-advisor.md:11`, `.opencode/command/spec_kit/skill-advisor.md:193`
  - Remediation: Align the entrypoint with the Mode-Based/deep-review pattern: state that Markdown owns setup first, then load `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_{auto,confirm}.yaml` only after all setup outputs are resolved.

- F-CORR-003: Dry-run behavior is internally inconsistent with the referenced YAML workflow. The command says dry-run skips Phase 3 and Phase 4, while the YAML dry-run branch jumps from Phase 3 to Phase 4 verification; the command also alternates between `/tmp/skill-advisor-proposal-{timestamp}.md` and `scratch/skill-advisor-proposal.md` for the proposal path.
  - Evidence: `.opencode/command/spec_kit/skill-advisor.md:185`, `.opencode/command/spec_kit/skill-advisor.md:187`, `.opencode/command/spec_kit/skill-advisor.md:225`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:135`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:151`
  - Remediation: Define one dry-run contract. Either skip verification everywhere, or run a read-only Phase 4 everywhere; also standardize the proposal path across key behaviors, output formats, examples, next steps, and YAML.

### P2 (Suggestions)

- F-CORR-004: Rollback wording is inconsistent between the Gate 3 exemption and Next Steps sections: one names `git checkout HEAD --`, while the other says `git revert`.
  - Evidence: `.opencode/command/spec_kit/skill-advisor.md:37`, `.opencode/command/spec_kit/skill-advisor.md:314`
  - Remediation: Use one rollback instruction or explicitly distinguish "discard local changes" from "revert a committed change" so operators do not run the wrong Git recovery path.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-strategy.md:1-103`
- `.opencode/command/spec_kit/skill-advisor.md:1-320`
- `.opencode/command/spec_kit/resume.md:1-435`
- `.opencode/command/spec_kit/plan.md:1-490`
- `.opencode/command/spec_kit/deep-review.md:1-389`
- `.opencode/skill/sk-doc/assets/agents/command_template.md:720-829`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:130-169`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:194-235`

## Convergence Signals

- newFindingsRatio: 1.0
- dimensionsCovered: ["correctness"]
