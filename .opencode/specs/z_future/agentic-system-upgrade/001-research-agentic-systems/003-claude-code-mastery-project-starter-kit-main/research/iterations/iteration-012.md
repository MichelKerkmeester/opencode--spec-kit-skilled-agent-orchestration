# Iteration 012 — Documentation Lifecycle And Working-Brief Mode

## Research question
Is the current Level 1/2/3(+phase) spec-folder lifecycle the right entry model, or does the external repo suggest `system-spec-kit` should start with a much lighter working brief before escalating into full packet structure?

## Hypothesis
The external repo's MDD flow will show that a single structured working brief is better for session ergonomics, but it will not be robust enough to replace `system-spec-kit`'s packet lifecycle for governed implementation work.

## Method
Compared the external `/mdd` workflow and real `.mdd` artifact shape to the local progressive-enhancement template stack, phase overlay, and spec-folder creation model.

## Evidence
- The external MDD workflow starts by gathering context, asking one consolidated question round, then writing a single `.mdd/docs/<NN>-feature.md` file that becomes the source of truth for tests and implementation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:42-131]
- The real external `.mdd` artifact is compact: frontmatter plus short sections for purpose, architecture, methods, and known issues. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-30] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:82-105]
- The local template guide describes a progressive stack where all features start at Level 1, Level 2 adds checklist gates, Level 3 adds decision records, and Level 3+ adds governance content. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-25] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:77-127] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:168-237]
- The local phase system adds a second axis on top of levels, with complexity scoring, parent-child maps, back-references, and recursive validation for large workstreams. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:17-27] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:51-68] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:82-141]
- The spec creation script operationalizes that model with levels, phases, subfolders, sharded sections, and template composition concerns. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:5-20] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:33-44] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:203-244]

## Analysis
The external repo's biggest UX advantage is that it gives Claude and the operator one small artifact to rally around before implementation starts. `system-spec-kit` asks the user to commit to a richer documentation taxonomy earlier. That richness is valuable once the work is real, risky, or multi-session, but it is heavier than necessary for initial problem framing. The right lesson is not to abandon levels or phases. It is to insert a sanctioned "working brief" stage before the full packet depth kicks in, so the first artifact is easier to produce and easier to scan.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Every file-modifying task enters the levelled spec-folder lifecycle immediately, with optional phase decomposition for complex work.
- **External repo's approach:** Start with one concise MDD brief, then derive tests and implementation from that document.
- **Why the external approach might be better:** It reduces startup friction and creates a highly legible session anchor before the workflow becomes multi-document.
- **Why system-spec-kit's approach might still be correct:** The richer packet structure is materially better for governed, audited, or long-running work; a single brief is too thin for the repo's actual responsibilities.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Add a first-class working-brief artifact or "brief mode" that can be upgraded into Level 1/2/3 documentation rather than asking operators to fully classify work up front.
- **Blast radius of the change:** medium
- **Migration path:** Make the working brief optional and non-authoritative at first; later allow `plan` or `complete` to auto-promote a mature brief into Level 1 docs when implementation begins.

## Conclusion
confidence: high

finding: The external repo does not justify replacing the Level 1/2/3 model, but it does justify simplifying the earliest part of the lifecycle with a sanctioned working-brief stage.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/templates/`, `.opencode/command/spec_kit/README.txt`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** decide when a brief is sufficient and when automatic promotion to a full levelled packet becomes mandatory
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the external repo handles multi-session governance, recursive validation, or phase coordination at the same depth as `system-spec-kit`; the reviewed sources did not show an equivalent mechanism. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:151-218]

## Follow-up questions for next iteration
If the lifecycle starts lighter, should the memory system also have a lighter pre-index note format?
Would a lighter working brief let the gate system shrink, or would the current rulebook still force the same cognitive overhead?
