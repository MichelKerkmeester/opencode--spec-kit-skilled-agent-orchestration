# Iteration 004 — Per-Story Worktree Lifecycle

## Research question
How do BAD's per-story worktrees differ from the local `sk-git` worktree model, and should that behavior be adopted into the existing git skill?

## Hypothesis
BAD adds stronger story-specific reuse and cleanup, but its automatic worktree creation conflicts with the local explicit-choice rule.

## Method
Read BAD's Step 1 worktree setup, merged-worktree cleanup, and post-merge cleanup instructions. Compared them to the top-level git skill and detailed worktree workflow reference.

## Evidence
- BAD creates or reuses a worktree per story branch, merges `main` into an existing worktree before continuing, and updates shared sprint state at repo root. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:212-236]
- BAD also removes merged worktrees and deletes their remote branches during Phase 0 cleanup, then performs another root cleanup after auto-merge. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:144-156]
- BAD's auto-merge cleanup resets the repo root back to `main`, removes blocking worktrees if needed, and fast-forwards the root checkout. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:368-390]
- Local `sk-git` explicitly forbids the AI from choosing worktree vs current branch on its own and requires the user to make that choice first. [SOURCE: .opencode/skill/sk-git/SKILL.md:202-215]
- Local worktree workflow doubles down on that rule: ask first, wait for A/B, then create a worktree with a chosen strategy. [SOURCE: .opencode/skill/sk-git/references/worktree_workflows.md:23-39]

## Analysis
BAD's worktree handling is optimized for a fully autonomous sprint runner. It assumes the system may create, reuse, clean, and even remove worktrees without another user decision. That is coherent inside BAD's own automation model, but it directly violates a core local safety rule: worktree choice is user-owned. BAD's extra worktree hygiene is useful, yet the place to use it would be a separate opt-in automation surface, not `sk-git`'s default contract.

## Conclusion
confidence: high

finding: BAD proves that per-unit worktrees scale well for batched automation, but that does not mean the current local git skill should become autonomous about workspace creation. For `system-spec-kit`, the correct move is to keep `sk-git` conservative and treat automatic per-phase worktrees as a future sprint-runner capability only.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-git/SKILL.md`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for any existing local clause that would allow autonomous worktree creation after a one-time session preference; the git skill still requires explicit user choice before worktree setup.

## Follow-up questions for next iteration
What are BAD's strongest safety gates inside its create → dev → review → PR loop?
Does BAD's stage-by-stage status model map onto local implementation checkpoints?
Where would a future opt-in sprint runner sit relative to `sk-git` and `spec_kit:implement`?
