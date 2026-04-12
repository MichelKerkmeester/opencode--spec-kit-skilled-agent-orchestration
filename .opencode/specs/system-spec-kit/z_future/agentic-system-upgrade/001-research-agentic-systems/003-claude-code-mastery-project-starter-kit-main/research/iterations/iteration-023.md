# Iteration 023 - Hide Governance Levels Behind Guided Defaults

## Research question
Is the Level 1/2/3(+phase) spec-folder model and its template-plus-validation UX intuitive for operators, or does the external repo suggest that the current packet mental model is too visible too early?

## Hypothesis
The local packet system will remain strategically correct, but the external repo will show that first-run UX improves when complexity tiers and validation rules stay mostly behind a guided default path.

## Method
Compared local template, level, and validation guidance to the external repo's working-doc flow and user-facing setup guidance.

## Evidence
- The local template guide asks operators to understand levels, required files, addendums, and phased template selection before or during packet setup. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-33] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:77-127] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:168-239]
- The level specifications deepen that model with different required artifacts, escalation rules, and governance expectations. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-47] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-122]
- The validator reinforces a broad rule surface and emits a substantial checklist of quality gates. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:138-159]
- The external repo uses a much lighter working-doc pattern. Users are guided into a practical doc and incremental workflow without first learning a formal packet taxonomy. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-30] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/USER_GUIDE.md:112-159]

## Analysis
This is not an argument to delete packet governance. It is an argument to stop making the governance taxonomy the user's first problem. The current system exposes levels, addendums, and validation semantics very early, which means new users must think like framework maintainers before they can simply get started. The external repo's flow is thinner and therefore easier to adopt. `system-spec-kit` should preserve its stronger governance model while hiding more of it behind guided defaults and promotions.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Ask users to reason about levels, file sets, and validation obligations relatively early.
- **External repo's approach:** Start with one working document and a guided action loop, then layer detail through use.
- **Why the external approach might be better:** It minimizes the up-front conceptual load and lets complexity appear only when needed.
- **Why system-spec-kit's approach might still be correct:** High-integrity work still needs the stronger artifact model and quality gates.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Keep levels internally, but default users into a guided brief or starter packet that can be promoted automatically when risk or scope increases.
- **Blast radius of the change:** medium
- **Migration path:** Start by hiding level selection behind a wizard or interview, with optional advanced override for expert users.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Users must learn a visible governance model, multiple template layers, and a strict validator vocabulary to feel confident using the system.
- **External repo's equivalent surface:** Users start by filling a practical working doc and follow a simpler narrative flow.
- **Friction comparison:** The local system creates more durable artifacts, but the external repo wins the first five minutes because it does not force early taxonomy learning.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that first-run users should pick or deeply understand Level 1 versus 2 versus 3 before starting.
- **What system-spec-kit should ADD for better UX:** Add guided defaults that choose packet depth automatically and explain promotion only when it becomes necessary.
- **Net recommendation:** SIMPLIFY

## Conclusion
confidence: high

finding: `system-spec-kit` should keep its packet governance model, but hide the visible level taxonomy behind guided defaults and later promotion so operators do not have to learn the whole framework up front.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/templates/`, template-selection workflow, validator messaging
- **Change type:** UX simplification
- **Blast radius:** medium
- **Prerequisites:** define a default starter packet shape and promotion triggers
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the current level taxonomy is already easy to ignore, but the template and validation docs still foreground it as a user-facing concept rather than a mostly internal control system. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:49-71]

## Follow-up questions for next iteration
If packet depth becomes less visible, can the session-continuity agent roster also become less fragmented without losing capability?
