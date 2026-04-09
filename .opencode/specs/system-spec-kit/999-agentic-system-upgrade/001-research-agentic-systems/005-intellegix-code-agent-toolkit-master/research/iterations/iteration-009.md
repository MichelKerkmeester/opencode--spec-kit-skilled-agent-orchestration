# Iteration 009 — Portfolio Governance And Anti-Overbuilding Rules

Date: 2026-04-09

## Research question
Can the external repo's portfolio-tier anti-overbuilding rules be adapted into `system-spec-kit` validation or planning guidance without distorting the spec-folder model?

## Hypothesis
Partially. The external portfolio model is too product-portfolio-specific to import directly, but its anti-overbuilding heuristics may help as optional planning guidance.

## Method
I compared the external portfolio registry and decision framework with `system-spec-kit`'s phase and validation references, looking for transferable governance ideas.

## Evidence
- `[SOURCE: external/portfolio/PORTFOLIO.md.example:4-10]` The external repo opens with velocity constraints such as branch limits, simple-solution bias, and breaking down work estimated over four hours.
- `[SOURCE: external/portfolio/PORTFOLIO.md.example:29-37]` Each project phase has explicit allowed and forbidden work, including hard bans on infrastructure or new features in certain phases.
- `[SOURCE: external/portfolio/PORTFOLIO.md.example:39-50]` Anti-patterns are concrete and operational: no Sentry, rate limiting, audit logs, or CI for very small or prototype projects.
- `[SOURCE: external/portfolio/DECISIONS.md:16-33]` Phase transitions are gated by clear readiness checks such as user count, coverage, feature freeze, and stability windows.
- `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:8-19]` `system-spec-kit` phases are a decomposition overlay, not a product-maturity tier.
- `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:37-68]` Phase detection is driven by complexity score and documentation level, not user count or business criticality.
- `[SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:17-27]` Validation is centered on documentation completeness and quality, not product portfolio governance.

## Analysis
The external portfolio layer is aimed at product investment discipline across many projects. `system-spec-kit` phases mean something else: they organize documentation and implementation streams inside one specification. Because the abstractions differ, importing T1/T2/T3/T4 directly would confuse the local model. Still, the external anti-overbuilding rules are useful as operator prompts: they convert vague "keep it simple" advice into concrete heuristics. The best transfer is therefore not a new validation rule, but optional planning or decision-record guidance that helps users avoid mismatched solution complexity.

## Conclusion
confidence: medium

finding: `system-spec-kit` should not adopt the external portfolio-tier system as a formal spec concept, but it should consider an optional anti-overbuilding checklist or reference note for planning and decision records.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`, `.opencode/skill/system-spec-kit/templates/decision-record.md`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** clarify that this is advisory guidance, not a new level or phase taxonomy
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for an existing local maturity-tier model that would make the portfolio system a natural fit. The local phase docs explicitly define phases differently.

## Follow-up questions for next iteration
- Which external loop guarantees should be codified in local tests first?
- Could anti-overbuilding checks live in documentation templates rather than validators?
- Does the final research report need a "rejected because wrong abstraction" pattern section?
