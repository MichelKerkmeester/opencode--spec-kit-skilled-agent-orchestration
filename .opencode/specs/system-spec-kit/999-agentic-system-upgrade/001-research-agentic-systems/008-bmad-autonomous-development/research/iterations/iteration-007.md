# Iteration 007 — PR, CI, And Repair Loop

## Research question
How does BAD manage PR creation, CI monitoring, failure repair, and review-comment resolution, and what does that add beyond the current local git finish workflow?

## Hypothesis
BAD extends ordinary PR creation into a sustained watch-and-repair loop, which is more autonomous than the local git skill but too invasive to merge into the default finish workflow unchanged.

## Method
Read BAD Step 4 plus the auto-merge reference's CI recheck behavior, then compared those steps to the current `sk-git` finish workflow.

## Evidence
- BAD Step 4 commits, verifies branch safety, opens a PR, monitors CI, falls back to local CI if GitHub is billing-limited, fixes failures, and loops until checks are green. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:270-311]
- After CI passes, BAD spawns another review agent that reads the PR diff, fixes every finding, pushes, and re-runs review until clean. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:312-336]
- BAD's auto-merge instructions re-check CI even after earlier green status because rebases or later commits may have restarted checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase4-auto-merge.md:36-49]
- Local git finish is intentionally shorter: verify tests, present one of four user choices, optionally create a PR, and ask whether to keep the worktree. It does not own an ongoing CI watch or repair loop. [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:25-39]
- Local PR creation ends at `gh pr create` plus optional worktree retention, not continuous remediation. [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:172-227]

## Analysis
BAD treats PR creation as part of execution, not as the handoff boundary. That is powerful for unattended automation because it closes the loop on common post-push failures. The local git finish workflow deliberately stops earlier and returns control to the user. That distinction is healthy: `sk-git` is a general-purpose git skill, while BAD is a sprint runner. The takeaway for `system-spec-kit` is to add an opt-in PR-watch mode somewhere else, not to silently extend the default git finish behavior.

## Conclusion
confidence: high

finding: BAD adds a meaningful automation layer after PR creation: CI watch, local fallback, repair, and re-review until clean. `system-spec-kit` should learn from that loop, but it should package it as an explicit opt-in automation path rather than expanding `sk-git`'s default completion workflow.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-git/references/finish_workflows.md`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** define whether the watch-and-repair loop belongs in `sk-git` or in a future sprint-automation skill layered above it
- **Priority:** should-have

## Counter-evidence sought
I looked for existing local docs that already describe CI watch, failure repair, or review-comment retry after PR creation; the current finish workflow ends after PR creation plus optional worktree retention.

## Follow-up questions for next iteration
Why does BAD insist on sequential merge order after all this PR automation?
Does the auto-merge cleanup change the recommendation for local git workflows?
What prevents BAD's claimed coordinator guard from being just a narrative rule?
