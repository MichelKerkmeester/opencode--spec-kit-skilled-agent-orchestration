# Iteration 017 — Command Architecture And Profile-Driven Distribution

## Research question
Should `system-spec-kit` merely add a little more metadata to its command docs, or does the external repo suggest a deeper pivot toward a manifest-driven command architecture with runtime/profile overlays?

## Hypothesis
Phase 1 already showed a metadata opportunity. Phase 2 will likely show that the stronger lesson is architectural: command visibility, help output, and install/update behavior should all be derived from one machine-readable source of truth.

## Method
Compared the external repo's dynamic help behavior, project profile system, and clean-mode selective command distribution to the local command README surfaces and Spec Kit command taxonomy.

## Evidence
- The external `help` command dynamically enumerates `.claude/commands/*.md`, extracts YAML frontmatter, and changes its display based on whether it is running inside the starter kit or a scaffolded project. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:84-109]
- The external starter kit treats profiles as first-class distribution controls: `claude-mastery-project.conf` defines `clean`, `default`, `quick`, `enterprise`, and language/framework profiles, while `/new-project` uses those profiles to decide what gets scaffolded and how it is presented. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/claude-mastery-project.conf:47-116] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:16-24] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:63-103]
- The external `clean` mode demonstrates selective distribution concretely: commands, hooks, agents, docs, and templates are installed based on one profile decision. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:153-218]
- The local command surfaces are readable but mostly static: the root command README and the Spec Kit command README describe families and usage in hand-maintained prose rather than deriving availability and routing from a manifest shared by docs, wrappers, and runtime help. [SOURCE: .opencode/command/README.txt:36-60] [SOURCE: .opencode/command/README.txt:106-168] [SOURCE: .opencode/command/spec_kit/README.txt:41-76] [SOURCE: .opencode/command/spec_kit/README.txt:147-159]

## Analysis
Phase 1's "add metadata" conclusion was correct, but incomplete. The deeper external lesson is that once command metadata becomes trustworthy, it can drive installation, help output, and environment-specific visibility. `system-spec-kit` still has a richer cross-runtime command world than the external repo, so the exact profile model should not be copied. But the architecture should probably pivot from README-first taxonomy to manifest-first capability declaration. That would reduce drift and make command routing more adaptable across Claude, OpenCode, Codex, and future runtimes.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Command families are documented clearly, but the docs remain a primary source of truth for what exists and how it is grouped.
- **External repo's approach:** Use frontmatter and profiles to let runtime help and project scaffolding discover commands dynamically.
- **Why the external approach might be better:** One metadata source can drive help, install/update decisions, runtime filtering, and docs generation.
- **Why system-spec-kit's approach might still be correct:** The local command ecosystem is broader and governed; a rushed registry pivot could add machinery before the canonical schema is clear.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce a machine-readable command manifest schema that defines audience, runtime, phase/category, installability, and visibility rules. Use that manifest to generate README inventories, runtime help, and wrapper exposure rather than hand-curating all three separately.
- **Blast radius of the change:** architectural
- **Migration path:** Start by backfilling metadata for existing commands and using it to generate a non-authoritative inventory, then promote the manifest into the source of truth once docs and runtime views reach parity.

## Conclusion
confidence: high

finding: The external repo suggests `system-spec-kit` should move beyond "a bit more metadata" and pivot toward a manifest-driven command architecture that can power help, routing, and packaging from one source of truth.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`, command wrapper metadata, follow-on phase `005`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define the canonical command manifest schema and decide which runtime-specific views should be generated from it
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the local repo already has an equivalent command manifest that docs and help are generated from. The reviewed command readmes did not reveal one. [SOURCE: .opencode/command/README.txt:36-60]

## Follow-up questions for next iteration
Does the external repo's runtime scaffolding imply a broader architecture lesson for `system-spec-kit`, or is that mostly a starter-kit concern?
Where should this research draw the line between useful command-architecture borrowing and invalid application-template copying?
