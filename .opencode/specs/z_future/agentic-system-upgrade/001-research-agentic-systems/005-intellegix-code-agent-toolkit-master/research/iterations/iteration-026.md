# Iteration 026 — Merge The Skill Family Into A Smaller Operator Entry Surface

Date: 2026-04-10

## Research question
Is the current skill system too fragmented for operators, especially across `system-spec-kit`, `sk-code-*`, `sk-doc`, and related workflow skills?

## Hypothesis
Yes. The local skill ecosystem contains strong capability packaging, but too many skills read like top-level products rather than implementation details behind a smaller entry surface.

## Method
I compared the local skill family definitions and their routing models against the external repo's looser capability packaging, where a few skills sit behind agent roles instead of exposing a large skill taxonomy to the operator.

## Evidence
- `[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13]` `system-spec-kit` is already a large umbrella skill covering spec folders, validation, and memory.
- `[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:88-119]` Its smart-routing section points to many references, scripts, and workflow domains inside one skill boundary.
- `[SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-29]` `sk-code-opencode` is a language-standards skill for OpenCode system code.
- `[SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-32]` `sk-code-web` is a frontend workflow orchestrator with its own phased model.
- `[SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-27]` `sk-code-full-stack` is another implementation workflow orchestrator for general stacks.
- `[SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-56]` The review system already uses a baseline-plus-overlay model, where one core review skill pairs with one `sk-code-*` overlay.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:7-10]` The external orchestrator exposes only a small skill list behind the role.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/research.md:7-9]` The external research role similarly keeps capability packaging flatter at the surface.

## Analysis
The local skill system is strongest when it behaves like the review stack: one clear baseline with hidden overlays. It is weakest when the operator is expected to understand why something is `sk-code-web` versus `sk-code-full-stack` versus `sk-code-opencode` before the system even starts. Those distinctions matter operationally, but not always conceptually.

This suggests a unification move, not a deletion move. Keep the specialized content and routing rules, but present a smaller operator entry surface such as `sk-code` with auto-selected overlays, and keep `system-spec-kit` as the documentation/context umbrella rather than one more peer in a long public list.

## Conclusion
confidence: high

finding: `system-spec-kit` should merge the skill family into a smaller operator-facing entry surface, using overlays and internal routing instead of exposing many sibling workflow skills directly.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-code-opencode/SKILL.md`, `.opencode/skill/sk-code-web/SKILL.md`, `.opencode/skill/sk-code-full-stack/SKILL.md`, `.opencode/skill/sk-code-review/SKILL.md`
- **Change type:** should-have
- **Blast radius:** operator-surface
- **Prerequisites:** define the baseline-plus-overlay operator model outside review workflows
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators face many peer skills, including multiple code-workflow variants that overlap conceptually.
- **External repo's equivalent surface:** Capability packaging is flatter and usually sits behind role prompts rather than as a broad visible skill taxonomy.
- **Friction comparison:** The local system is more explicit, but the operator must know too much about implementation categories. The external repo is easier to explain and onboard into.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for operators to manually reason about which `sk-code-*` family member applies.
- **What system-spec-kit should ADD for better UX:** Add one operator-facing code skill entrypoint with automatic overlay selection.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that most operators benefit from directly choosing among several sibling code-workflow skills instead of relying on internal routing. I did not find strong support for that.

## Follow-up questions for next iteration
- Can the review baseline-plus-overlay pattern become the universal skill packaging pattern?
- Which non-code skills still deserve direct operator visibility after consolidation?
- Should `system-spec-kit` become the one documented "platform skill" while others become mostly internal overlays?
