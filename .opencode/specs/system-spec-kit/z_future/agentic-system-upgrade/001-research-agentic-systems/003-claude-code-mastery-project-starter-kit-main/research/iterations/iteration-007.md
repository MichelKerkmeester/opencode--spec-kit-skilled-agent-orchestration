# Iteration 007 — Branch, Port, And E2E Portability

## Research question
Should the starter kit's branch-protection, port-conflict, and E2E gate hooks be transplanted into this repo's Claude workflow?

## Hypothesis
These hooks will be more project-template-specific than the secret hooks and will not port cleanly into `system-spec-kit` as-is.

## Method
Read the branch, E2E, and port hooks from the starter kit, then compared them to the local git/governance expectations and current Claude hook layout.

## Evidence
- The branch hook blocks `git commit` on `main` or `master` when `auto_branch` is enabled and explicitly points users to feature branches or `/worktree`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-branch.sh:22-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-branch.sh:56-76]
- The E2E hook only checks pushes to `main` or `master` and warns if no real `tests/e2e` files exist. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-e2e.sh:15-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-e2e.sh:46-69]
- The port hook infers ports from flags, `PORT=`, or known `pnpm` scripts and blocks when a port is already in use. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-ports.sh:17-37] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-ports.sh:49-57]
- The local repo already defines a separate git workflow skill and stricter spec-folder/gate model at the instruction layer, while its Claude hooks remain recovery-oriented. [SOURCE: CLAUDE.md:42-45] [SOURCE: CLAUDE.md:129-175] [SOURCE: .claude/settings.local.json:7-42]

## Analysis
These hooks embed assumptions about starter-kit app repos: branch protection tied to `main`, local E2E directories, and a known port map for dev/test services. `system-spec-kit` is not a generated app repo; it is the workflow engine itself, with multiple runtimes and repo-level rules already governing how work should proceed. The port hook is the most portable idea, but even that depends on repo-specific command naming. The branch and E2E hooks would likely duplicate or conflict with existing guidance rather than strengthen it.

## Conclusion
confidence: medium

finding: These hooks are good examples of project-template enforcement, but they are poor direct imports into `system-spec-kit`. Only the port-conflict idea might merit an optional future variant, and even that should be repo-specific rather than copied wholesale.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.claude/settings.local.json`
- **Change type:** rejected
- **Blast radius:** medium
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for clear local equivalents like a standardized `tests/e2e` contract or a fixed development-port map that would make these hooks directly portable. I did not find that evidence in the reviewed local workflow files.

## Follow-up questions for next iteration
Can the starter kit's command scoping model translate better than its branch/E2E hooks?
Would dynamic command metadata help local discoverability more than more hook logic?
How much of the external ergonomics comes from `/help` rather than the hooks?
