# Iteration 024 — Template Levels And Strict Validation UX

Date: 2026-04-10

## Research question
Are the Level 1/2/3+ model, CORE + ADDENDUM template architecture, and strict validation rules intuitive enough for operators, or do they create avoidable UX friction compared to the external repo's documentation model?

## Hypothesis
The internal structure is probably sound, but it is exposed too literally. The external repo suggests readers benefit from audience-oriented docs and example-centric guidance, while Public makes users think in authoring and validation mechanics too early.

## Method
I compared Public's template-level model and structural validation contracts with Agent Lightning's docs and example packaging.

## Evidence
- Public frames spec work through a progressive-enhancement ladder: Level 1 baseline, Level 2 verification, Level 3 full, Level 3+ governance. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-24] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-57]
- Those levels expand the required file set from baseline docs to checklist, decision record, and extended governance artifacts. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:183-189] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:300-307] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-392]
- Template compliance is enforced structurally, with exact heading/anchor contracts and immediate `validate.sh --strict` runs after writing spec docs. [SOURCE: .opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md:15-39]
- Validation rules mix hard errors, warnings, and strict-mode escalation across file existence, placeholders, section counts, AI protocol content, and level matching. [SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:24-54] [SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:985-995]
- Agent Lightning's docs lead with reader-friendly navigation: installation, how-to recipes, algorithm zoo, deep dive, and API references. [SOURCE: external/docs/index.md:14-19]
- The external contributor contract also requires example READMEs with smoke-test guidance and Included Files sections rather than a full spec-packet model. [SOURCE: external/AGENTS.md:34-36]

## Analysis
Public's level model is internally coherent. It gives authors and validators a common language, and that is valuable. The friction appears when that internal authoring structure becomes the operator's first mental model. Users who just want to start work or understand a packet do not benefit from immediately reasoning about addendums, structural anchors, and level-specific numbering.

The external repo shows a softer pattern: organize for readers first, keep authoring mechanics behind the scenes, and make examples do more of the teaching. Public should keep its levels internally while presenting simpler labels, shorter validation summaries, and audience-focused entrypoints for people who are not authoring the templates themselves.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep its level and validation architecture internally, but simplify how that model is introduced to operators and how validation failures are explained.

## Adoption recommendation for system-spec-kit
- **Target file or module:** template/publishing and validator UX layer
- **Change type:** UX simplification
- **Blast radius:** medium
- **Prerequisites:** define operator-facing labels for documentation modes and group validator output by user action instead of by internal rule taxonomy
- **Priority:** nice-to-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators are introduced quickly to Level 1/2/3+, template composition, and strict structural validation rules.
- **External repo's equivalent surface:** Operators enter through installation, recipes, and examples; authoring constraints are secondary and contribution-oriented.
- **Friction comparison:** Public has stronger auditability, but higher cognitive load because internal authoring machinery leaks into first-contact UX. Agent Lightning is easier to read, though less governed.
- **What system-spec-kit could DELETE to improve UX:** Delete early operator dependence on level jargon and raw validator rule names where simpler labels would work.
- **What system-spec-kit should ADD for better UX:** Add reader-facing documentation modes and validator summaries phrased as "what to do next" rather than "which structural contract failed."
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for evidence that exposing the full level contract up front is necessary for safe work, but most safety comes from the validator and templates themselves, not from forcing every operator to internalize the whole taxonomy at the start.

## Follow-up questions for next iteration
- Should Public present "simple / verified / architectural / governed" labels instead of Level 1/2/3/3+ in operator docs?
- Can strict validation stay fully intact while the output language becomes much friendlier?
- How much of the template contract should remain visible outside `@speckit` and validator internals?
