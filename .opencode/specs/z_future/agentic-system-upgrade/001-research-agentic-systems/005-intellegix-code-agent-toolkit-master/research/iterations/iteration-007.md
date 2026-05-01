# Iteration 007 — Council Synthesis As An Optional Research Mode

Date: 2026-04-09

## Research question
Is the external repo's council-style multi-model synthesis worth formalizing as an optional `system-spec-kit` research mode?

## Hypothesis
Maybe. The external council pattern looks useful for hard research questions, but it may be too dependency-heavy for the default path.

## Method
I examined the external council query stack, its synthesis prompt, and semaphore tests, then compared that design with `system-spec-kit`'s current research loop and existing multi-model access guidance.

## Evidence
- `[SOURCE: external/council-automation/council_query.py:1-18]` The council engine queries multiple frontier models, then optionally synthesizes them with a stronger model.
- `[SOURCE: external/council-automation/council_query.py:72-88]` Model calls are capability-aware: web search is included only when both the model and the global toggle allow it.
- `[SOURCE: external/council-automation/council_query.py:250-258]` The default happy path is explicitly "parallel multi-model, fallback later."
- `[SOURCE: external/council-automation/council_config.py:18-28]` The council is configured around three analysis models plus a fallback, showing that model diversity is a first-class design choice.
- `[SOURCE: external/council-automation/synthesis_prompt.md:12-21]` Final synthesis is constrained to a structured JSON object with agreements, disagreements, unique insights, actions, confidence, risks, and narrative.
- `[SOURCE: external/council-automation/test_session_semaphore.py:29-39]` The browser session pool is tested as a shared resource rather than an ad hoc side effect.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:136-143]` `system-spec-kit` today frames deep research as an iterative single-agent loop that produces `research/research.md`.
- `[SOURCE: .opencode/skill/cli-copilot/SKILL.md:189-220]` The broader codebase already documents multi-model access and per-model reasoning characteristics, but as operator guidance rather than a deep-research mode.

## Analysis
The external council pattern's strongest idea is not "always use three models." It is that disagreement can be treated as a structured input to synthesis instead of a nuisance. That could make `system-spec-kit`'s research output stronger on ambiguous topics, especially architecture or standards research. The downside is operational complexity: extra providers, extra cost, and extra failure modes. Because `system-spec-kit` already supports multiple runtimes and model families indirectly, the right transfer is an optional council mode or synthesis profile, not a replacement for the default loop.

## Conclusion
confidence: medium

finding: The council pattern is worth adopting only as an optional advanced research mode. The best borrowable piece is the structured "agreements / disagreements / unique insights / recommended actions" synthesis shape, not the full dependency stack.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`, `.opencode/skill/system-spec-kit/templates/research.md`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** runtime-capability matrix must expose whether a council-style multi-model round is available
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that `system-spec-kit` already performs structured cross-model synthesis. I found model-selection guidance, but not a council mode built into the research workflow.

## Follow-up questions for next iteration
- Could the synthesis schema be adopted even when only one model is available?
- Should disagreement tracking live in iteration files, the final report, or reducer state?
- Where does browser-backed evidence gathering fit relative to council mode?
