# Iteration 015 — Level Taxonomy Versus Audience-Based Documentation

Date: 2026-04-10

## Research question
Does Agent Lightning suggest that `system-spec-kit` should replace its Level 1/2/3+ documentation lifecycle with a more audience-based docs model?

## Hypothesis
The external repo likely shows a better publication and onboarding UX, but not a better internal coordination model. If so, the right answer is to keep Public's level taxonomy for authoring while separating it from the docs experience users actually read.

## Method
I compared Agent Lightning's docs navigation and index structure against `system-spec-kit`'s level specifications, phase overlay, and progressive template architecture.

## Evidence
- Agent Lightning's docs explicitly tell readers how to navigate the system: Installation, How-To Recipes, Learning More, Algorithm Zoo, Deep Dive, and API References. [SOURCE: external/docs/index.md:14-23]
- The external MkDocs nav implements that audience-and-task structure directly. [SOURCE: external/mkdocs.yml:98-138]
- `system-spec-kit`'s level architecture is authoring-oriented: CORE + ADDENDUM composition, progressive enhancement, and level escalation by verification, architecture, and governance needs. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73]
- Level 3 and Level 3+ introduce heavier authoring requirements, including decision records, AI execution protocols, and extended checklists. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:300-354] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-416]
- Phases are an overlay on top of levels, not a separate publication taxonomy. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:780-800]

## Analysis
Agent Lightning demonstrates a cleaner reading experience because its docs are arranged around what the reader wants to do, not how the repo internally governs work. That is a real UX strength. But that does not mean Public should delete its level taxonomy. The level system exists to structure AI-assisted work, scope, verification, and coordination. That is an authoring and governance problem, not a public docs information architecture problem.

So the external repo suggests a separation, not a replacement. Public's current internal level model can stay, but it should stop leaking into the user-facing reading experience wherever publishable or onboarding docs exist.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep its Level 1/2/3+ authoring lifecycle, but create a clearer audience-based documentation layer on top of it. Agent Lightning is better at telling readers where to go next; Public is better at coordinating complex AI-assisted work. Those strengths should be combined rather than exchanged.

## Adoption recommendation for system-spec-kit
- **Target file or module:** template architecture and published guidance
- **Change type:** docs-UX refinement
- **Blast radius:** medium
- **Prerequisites:** define which docs are internal authoring artifacts versus operator-facing reference surfaces
- **Priority:** nice-to-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Internal documentation levels drive both authoring structure and much of the conceptual framing around work.
- **External repo's approach:** Documentation is organized by audience intent and task shape, not by internal lifecycle maturity.
- **Why the external approach might be better:** It is easier to learn, easier to scan, and better for onboarding.
- **Why system-spec-kit's approach might still be correct:** Public needs level-aware documentation because it coordinates AI work and validation, not just code consumption.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** n/a
- **Blast radius of the change:** n/a
- **Migration path:** n/a

## Counter-evidence sought
I looked for signs that the external repo also uses an internal level or lifecycle taxonomy hidden behind the docs layer and did not find one. I also checked whether Public's level taxonomy is obviously the wrong model for internal work; the existing templates still line up with real coordination needs.

## Follow-up questions for next iteration
- If Public keeps levels internally, where should audience-based docs live so operators do not need to understand template composition first?
- Which current docs should be reframed as quickstart/how-to/reference instead of packet-oriented material?
- How much of the current documentation burden can be hidden behind better publishing rather than reduced at the source?
