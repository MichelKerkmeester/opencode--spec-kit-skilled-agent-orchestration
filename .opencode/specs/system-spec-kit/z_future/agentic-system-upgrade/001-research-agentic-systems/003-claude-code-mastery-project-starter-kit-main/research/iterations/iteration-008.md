# Iteration 008 — Command Scope And Discoverability

## Research question
What lessons from the starter kit's `scope:` command metadata and dynamic help behavior should be applied to `.opencode/command/`?

## Hypothesis
The external repo will show a lightweight distribution model that local commands could borrow without abandoning the current grouped directory structure.

## Method
Read the external help command, checked command `scope:` metadata, inspected starter-kit-only command behavior, and compared that to local command indexes and execution-mode docs.

## Evidence
- The external help command detects whether it is running in the starter kit or a scaffolded project, reads command frontmatter dynamically, and groups output differently depending on `scope: project` versus `scope: starter-kit`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-45] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:76-107]
- Starter-kit-only commands declare `scope: starter-kit`, and the update workflow explicitly copies only `scope: project` commands into target projects. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:1-5] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/update-project.md:90-98]
- The external README's command inventory is partly static and already drifts from the per-command metadata, which makes the frontmatter-driven help flow more trustworthy than the prose count. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:96-104]
- The local repo organizes commands by group and documents execution modes and ownership statically in `README.txt` files; it does not expose equivalent audience/distribution metadata in the command surface itself. [SOURCE: .opencode/command/README.txt:38-49] [SOURCE: .opencode/command/README.txt:58-60] [SOURCE: .opencode/command/README.txt:164-169] [SOURCE: .opencode/command/README.txt:216-233] [SOURCE: .opencode/command/spec_kit/README.txt:41-46] [SOURCE: .opencode/command/spec_kit/README.txt:54-63]

## Analysis
The external insight is not "put all commands in one folder." It is "encode audience and distribution intent in command metadata, then let help/update behavior consume that metadata." The local command tree is already better structured for a large multi-runtime repo, but it relies on static documentation instead of metadata-driven discoverability. That creates a plausible path for drift and makes it harder to reason about which commands are core, runtime-specific, or distribution-only.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep its grouped command hierarchy but adopt explicit metadata for command audience and distribution semantics. This is the external command-system idea most worth borrowing.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/README.txt`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define a minimal metadata vocabulary that command docs and help surfaces can share
- **Priority:** should-have

## Counter-evidence sought
I looked for existing local command metadata that already captures runtime audience or distribution semantics beyond description and execution mode. The reviewed command docs did not show an equivalent mechanism.

## Follow-up questions for next iteration
Would operator-facing monitoring be more valuable than better help metadata?
Should command metadata work across Claude, Codex, and OpenCode equally?
What overlap should be tagged for the broader command-system packet?
