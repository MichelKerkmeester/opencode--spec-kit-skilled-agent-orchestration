# Iteration 006 — Undo-Only Refactor Path

Date: 2026-04-09

## Research question
What problem does Get It Right's undo-only refactorer solve, and should `system-spec-kit` adopt that path or reject it for normal use?

## Hypothesis
The refactorer is valuable only when workspace isolation is strong; otherwise it is too risky as a default.

## Method
I traced the external refactor path through the workflow and agent prompt, then compared it against `system-spec-kit`'s current failure handling and the repo's broader preference for non-destructive behavior in shared workspaces.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:262-293] The refactor node is only reached on `strategy == 'refactor'` and its inject message repeatedly says to undo the problematic work, not reimplement it.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/refactorer.md:17-30] The refactorer must inspect `git diff` and `git status`, preserve unrelated changes, and avoid writing new implementation code.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/refactorer.md:40-50] The external rationale is that patching fundamentally wrong code often deepens the mistake; a clean workspace is better than incremental repair.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:130-145] The refactorer gets reviewer feedback plus explicit instructions to undo, not fix.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:414-417] Internal failure handling currently stops after repeated errors and suggests `/spec_kit:debug`; it does not auto-revert workspace state.
- [SOURCE: .opencode/agent/review.md:255-258] The internal reviewer escalates repeated low scores toward circuit-breaker or reassignment logic rather than workspace cleanup.

## Analysis
The external refactorer solves a real problem: once a bad approach lands in the workspace, the next attempt is tempted to build on rubble. But the cost is high in a shared or dirty worktree, which is a common `system-spec-kit` reality. The external repo mitigates that with `git diff`/`git status`, but that is still not enough for a default-on cleanup path in this ecosystem. The safer internal adaptation is to treat undo-only refactor as an opt-in mode for isolated worktrees, not the default retry behavior.

## Conclusion
confidence: medium
finding: The undo-only refactorer is a good pattern in principle, but it should not be adopted as a default `system-spec-kit` behavior in normal shared workspaces. It is better treated as an isolated-worktree extension or later prototype than as a baseline retry step.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** if revisited later, require dedicated worktree isolation and a narrowly-scoped cleanup agent
- **Priority:** rejected

## Counter-evidence sought
I looked for internal workflow evidence that automatic cleanup/revert behavior is already accepted in shared implementation flows. I found escalation and debugging hooks instead, which push in the opposite safety direction.

## Follow-up questions for next iteration
- Can the benefits of refactor be captured by worktree rotation instead of in-place revert?
- Would a "discard attempt workspace and restart" model be safer than surgical revert?
- Which parts of the external loop are portable even if refactor stays rejected?
