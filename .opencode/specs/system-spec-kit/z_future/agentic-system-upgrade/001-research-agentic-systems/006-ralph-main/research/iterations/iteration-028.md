# Iteration 028 — Code Standards Skill Family Overlap

## Research question
Does the external repo's smaller skill packaging suggest that `system-spec-kit` should consolidate the `sk-code-*` family into a single coding front door with internal overlays?

## Hypothesis
The current code-skill family is useful internally, but exposing `sk-code-opencode`, `sk-code-web`, and `sk-code-full-stack` as peer surfaces makes the code standards model feel more fragmented than necessary.

## Method
Compared Ralph's simple skill packaging against the code-focused `system-spec-kit` skill family, treating the problem as operator-facing packaging rather than deep implementation guidance.

## Evidence
- Ralph's plugin keeps its skill inventory tiny and task-shaped rather than domain-taxonomy-heavy. [SOURCE: external/.claude-plugin/plugin.json:2-9]
- `system-spec-kit` currently distinguishes between multiple coding skills plus review, docs, and git skills, creating several adjacent operator concepts for "help me work on code." [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-617]
- The repo already has a strong general coding authority in `sk-code-opencode`, which suggests the other code skills could become overlays or profiles rather than peer entrypoints. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:1-80]

## Analysis
This is less urgent than command and gate simplification, but the packaging signal is still clear. Most operators do not want to choose among several coding doctrine bundles. They want one coding front door that adjusts to context. Ralph's packaging style suggests that the right UX is "one coding capability, specialized internally," not "multiple equally prominent code skills."

## Conclusion
confidence: medium

finding: `system-spec-kit` should add a single coding front door that internally routes to the right standards overlay, rather than exposing multiple peer `sk-code-*` entrypoints.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-code-opencode/SKILL.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define how existing code-skill guidance is nested or referenced under a unified front door
- **Priority:** nice-to-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Coding standards are split across several peer skills with overlapping scope.
- **External repo's equivalent surface:** Ralph packages its execution and planning capabilities as one tiny, easy-to-grasp bundle.
- **Friction comparison:** `system-spec-kit` asks for more upfront taxonomy learning. Ralph gives the user one obvious place to start and hides specialization inside the package.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that operators should choose among multiple code-skill brands before writing code.
- **What system-spec-kit should ADD for better UX:** Add one `sk-code` front door that detects context and loads the relevant overlay internally.
- **Net recommendation:** ADD

## Counter-evidence sought
I looked for proof that the current code-skill split maps cleanly to operator intent, but the distinctions appear more implementation-oriented than user-oriented. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:1-80] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:1-80]

## Follow-up questions for next iteration
- Beyond commands and skills, is the full automation stack itself too heavy for the average operator, especially the gate sequence and large behavioral spec?
