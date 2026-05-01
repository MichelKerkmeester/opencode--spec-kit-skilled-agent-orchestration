# Iteration 018 — Architecture Signal From What The External Repo Does Not Have

## Research question
Does the external repo's overall architecture suggest that `system-spec-kit` should throw away parts of its MCP/runtime stack and rebuild itself more like the starter kit, or is the repo too scaffold-oriented to support that conclusion?

## Hypothesis
The external repo will turn out to be a strong operator-surface starter kit but a weak reference for runtime architecture, because much of its "project architecture" is template expectation rather than implemented system substrate.

## Method
Compared the external repo's package/runtime declarations and verification expectations to the actual files present under `src/`, then contrasted that with the kinds of subsystems `system-spec-kit` actually maintains.

## Evidence
- The external package expects a runnable TypeScript app surface: development scripts target `src/index.ts`, production starts `dist/index.js`, and the package advertises a conventional build/test stack. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/package.json:7-40]
- The verification guide likewise assumes a full scaffolded application shape, including `project-docs`, `tests/e2e`, scripts, config files, and package scripts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/STARTER-KIT-VERIFICATION.md:148-187] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/STARTER-KIT-VERIFICATION.md:190-259]
- But the actual `external/src/` tree in this packet contains only placeholder `.gitkeep` files in `adapters/`, `handlers/`, and `types/`; there is no `src/index.ts` implementation in the captured repo. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/src/adapters/.gitkeep:1-1] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/src/handlers/.gitkeep:1-1] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/src/types/.gitkeep:1-1]
- The strongest signals in the external repo consistently come from commands, hooks, config, docs, and testing ergonomics, not from a comparable long-lived runtime substrate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-49]

## Analysis
This is the most important anti-overreach signal in Phase 2. The external repo is credible as a Claude workflow starter kit, but not as a proof point that `system-spec-kit` should copy its runtime architecture. Much of what looks like "architecture" in the repo is really scaffolding intent. `system-spec-kit` is a live documentation, memory, and MCP system with stronger continuity and governance responsibilities. If it copies the external repo's app-template assumptions too eagerly, it will learn the wrong lesson from a repo that is mostly an operator-product shell.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Maintain a real multi-surface runtime: commands, hooks, MCP server pieces, memory infrastructure, validators, and governed packet workflows.
- **External repo's approach:** Prioritize starter-kit scaffolding and operator ergonomics; much of the app/runtime substrate is implied rather than implemented in the captured repo.
- **Why the external approach might be better:** It is lighter and easier to adopt for new projects because it ships a strong operator shell with fewer deeply coupled subsystems.
- **Why system-spec-kit's approach might still be correct:** The local repo is solving a materially different problem that actually requires durable runtime subsystems.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** None. Treat this repo as an operator-UX and workflow reference, not a runtime-architecture template.
- **Blast radius of the change:** small
- **Migration path:** N/A

## Conclusion
confidence: high

finding: rejected

rejection: The external repo does not provide enough implemented runtime substance to justify rebuilding `system-spec-kit` around its application architecture patterns. Its value is mostly in operator surface design, not substrate design.

## Adoption recommendation for system-spec-kit
- **Target file or module:** none
- **Change type:** rejected
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for the runnable `src/index.ts` and related implementation depth promised by `package.json` and the verification guide. The packetized external repo did not include that runtime surface, which materially weakens any architecture-copying argument. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/package.json:8-18]

## Follow-up questions for next iteration
If runtime copying is off the table, what operator-facing UX surface is still worth borrowing?
Would a human-readable readiness surface improve `system-spec-kit` without importing any of the external repo's scaffold assumptions?
