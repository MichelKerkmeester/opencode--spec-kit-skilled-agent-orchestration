# Iteration 006 — Secret And Env Guardrails

## Research question
Are secret-blocking and env-sync hooks strong low-risk adoption candidates for this repo's Claude hook layer?

## Hypothesis
Sensitive-file blocking and staged-secret verification will be good adopt-now candidates; env sync will be useful but slightly more contextual.

## Method
Read the starter kit's sensitive-file, staged-secret, and env-sync hooks and compared them to the local Claude hook configuration.

## Evidence
- The external pre-tool hook blocks reads/edits to `.env`, SSH keys, credentials files, and other sensitive paths, while allowing writes to new `.env` files for scaffolding. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:13-29] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:49-64]
- The external stop hook scans staged basenames and file contents for secrets including API keys, GitHub tokens, Slack tokens, Stripe keys, and PEM private keys, then blocks on violations. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/verify-no-secrets.sh:19-28] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/verify-no-secrets.sh:42-77]
- The external env-sync hook only reads key names and warns when `.env` contains variables missing from `.env.example`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-env-sync.sh:13-38]
- The local Claude config currently has no equivalent pre-tool sensitive-file hook or stop-time secret scan in its hook list. [SOURCE: .claude/settings.local.json:7-42]

## Analysis
These external hooks are narrow, deterministic, and mostly orthogonal to the local recovery system. Sensitive-file blocking is especially attractive because it prevents accidental prompt-time exposure, which prose rules alone cannot guarantee. The stop-time staged scan is also a strong fit because it catches commit-risk cases without changing the existing research/memory model. The env-sync warning is useful, but it depends more on project conventions and is less universally applicable in this repo.

## Conclusion
confidence: high

finding: The strongest adopt-now lesson from the starter kit is the pair of secret-focused hooks: one before tool use, one at stop/commit time. Env-sync is promising, but it is a second-wave candidate.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.claude/settings.local.json`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** add or reference compatible hook scripts under `.claude/hooks/` and confirm they do not interfere with existing session-stop autosave
- **Priority:** must-have

## Counter-evidence sought
I looked for existing local hook wiring that already enforced secret blocking at tool time or stop time. None appeared in the local Claude hook configuration reviewed here.

## Follow-up questions for next iteration
Should env-sync stay a warning-only hook here?
Would branch, port, and E2E hooks fit this repo as cleanly as secret hooks?
Should enforcement scripts live in repo-local `.claude/hooks/` or in system-spec-kit hook modules?
