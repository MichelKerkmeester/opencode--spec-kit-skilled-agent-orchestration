# Iteration 026 - Consolidate The Visible Skill Taxonomy

## Research question
Is the current skill system too fragmented at the operator surface, especially the visible `sk-code-*` family and adjacent specialist skills, compared with the external repo's flatter capability packaging?

## Hypothesis
The local skill substrate will remain useful, but the external repo will show that the public-facing skill taxonomy can be simplified without removing the underlying expertise.

## Method
Compared the local skill roster, with special attention to the code-family skills and `system-spec-kit`, to the external repo's flatter command-plus-instruction packaging.

## Evidence
- `system-spec-kit` is already a wide umbrella skill covering spec folders, memory, validation, and lifecycle rules. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:18-60]
- The local repo also exposes multiple adjacent code skills: `sk-code-opencode`, `sk-code-web`, `sk-code-full-stack`, and `sk-code-review`, each with overlapping workflow framing and stack-specific overlays. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-29] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-37] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-32] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:19-39]
- Additional specialist skills such as `sk-doc`, `sk-git`, `sk-deep-research`, `sk-deep-review`, `sk-prompt-improver`, and `sk-agent-improver` create a broad catalog that maintainers can understand, but everyday operators may not need to name directly. [SOURCE: .opencode/skill/sk-doc/SKILL.md:24-63] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137-221] [SOURCE: .opencode/skill/sk-agent-improver/SKILL.md:28-55]
- The external repo packages equivalent help more implicitly through commands, repo instructions, and a smaller set of role surfaces rather than a large user-visible skill catalog. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-72] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107]

## Analysis
This is mostly a naming and packaging problem. The local skill architecture is powerful, but too much of the internal decomposition leaks into the visible taxonomy. In particular, the `sk-code-*` family reads like multiple primary entry points when it is really one domain with overlays. The external repo suggests a better public model: expose fewer named capability buckets, then let internal routing and repo instructions choose the right depth. `system-spec-kit` can keep the existing skill files, but it should present a smaller public capability map.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Expose many explicitly named skills, including overlapping code and workflow families.
- **External repo's approach:** Keep most capability packaging implicit in commands, docs, and a smaller role surface.
- **Why the external approach might be better:** Users need to remember fewer capability names and can trust the system to pick the right overlay.
- **Why system-spec-kit's approach might still be correct:** Internal modularity and specialized instructions remain useful for maintenance and precise routing.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Present a smaller public taxonomy such as one code skill plus optional hidden overlays, while retaining the current underlying files where they still serve maintainers.
- **Blast radius of the change:** medium
- **Migration path:** Start with documentation and routing aliases, then consolidate visible naming once telemetry or usage patterns are clearer.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can encounter a large, specialized skill roster and may need to infer which skill family applies before work begins.
- **External repo's equivalent surface:** Operators mostly experience capabilities through commands and instruction layers, not through many named skill choices.
- **Friction comparison:** The local system offers finer distinctions, but the external repo has less naming overhead and therefore lower entry friction.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that users should care about multiple public `sk-code-*` entry points.
- **What system-spec-kit should ADD for better UX:** Add a simpler public capability map with hidden overlays or internal routing behind it.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge its visible skill taxonomy into fewer public capability surfaces, especially across the overlapping `sk-code-*` family.

## Adoption recommendation for system-spec-kit
- **Target file or module:** skill discovery docs, skill routing surfaces, `sk-code-*` family presentation
- **Change type:** taxonomy consolidation
- **Blast radius:** medium
- **Prerequisites:** choose which skill distinctions remain public versus internal
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that users truly benefit from naming each code-family skill separately, but the skills mostly read like layered overlays within one broader coding capability. [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:41-60]

## Follow-up questions for next iteration
If the visible skill taxonomy shrinks, is the mandatory Gate 2 skill-routing ceremony still worth its current operator cost?
