# Iteration 020 — Profile Presets Versus Governance Levels

## Research question
Should `system-spec-kit` pivot away from its Level 1/2/3(+phase) governance model toward starter-kit-style profiles such as `clean`, `default`, `quick`, and `enterprise`, or do those concepts solve a different problem?

## Hypothesis
The external profile system will prove useful for scaffolding project shapes, but it will not replace the local repo's complexity/governance classification because the two systems optimize for different decisions.

## Method
Compared the external starter-kit profile system and clean-mode behavior to the local levelled template architecture and phase definitions.

## Evidence
- The external repo's config file defines profiles such as `clean`, `default`, `quick`, and `enterprise`, each bundling framework, hosting, options, MCP servers, and package choices for new project scaffolds. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/claude-mastery-project.conf:53-116]
- The external `/new-project` command treats those profiles as scaffold blueprints and uses `clean` mode to explicitly skip source code, test tooling, and framework assumptions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:153-218]
- The local template guide defines Levels 1-3 around documentation and governance depth, not app archetype. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-25] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:77-127]
- The local phase system similarly classifies work by complexity, dependency structure, and management needs rather than framework stack. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:17-27] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:82-141]

## Analysis
This is another place where the external repo is useful mainly as a contrast. Starter-kit profiles answer "what kind of project do you want scaffolded?" `system-spec-kit` levels answer "how much governance and documentation does this work require?" Those are not interchangeable questions. Replacing local levels with external-style profiles would blur the repo's core decision model. The borrowable idea is narrower: profile-like presets may help with ergonomic defaults or reporting views, but they should not replace the governance hierarchy.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Use levels and phases to scale documentation and governance according to complexity and risk.
- **External repo's approach:** Use named profiles to scaffold app stacks and selectively install commands, hooks, and templates.
- **Why the external approach might be better:** It gives fast, memorable presets for common project shapes and operator preferences.
- **Why system-spec-kit's approach might still be correct:** The local system is fundamentally about governance depth and continuity, not app archetype generation.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** None at the core lifecycle level. Optional presentation presets could be explored later, but the governance model should remain level/phase based.
- **Blast radius of the change:** small
- **Migration path:** N/A

## Conclusion
confidence: high

finding: rejected

rejection: `system-spec-kit` should not replace its Level 1/2/3(+phase) model with starter-kit-style profiles. Profiles solve scaffolding ergonomics, not documentation-governance depth.

## Adoption recommendation for system-spec-kit
- **Target file or module:** none
- **Change type:** rejected
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for a way to map external profiles onto the local lifecycle without losing the "how much governance does this work need?" question. The reviewed level and phase docs suggest that mapping would distort the local model rather than clarify it. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:168-237]

## Follow-up questions for next iteration
None. Phase 2 has enough evidence to synthesize a merged report.
