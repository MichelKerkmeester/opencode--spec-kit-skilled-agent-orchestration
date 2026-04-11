# Iteration 027 — Skill Family Sprawl Versus Capability Packs

Date: 2026-04-10

## Research question
Is the skill system too fragmented, and should `system-spec-kit` consolidate several first-class skills into broader capability packs?

## Hypothesis
Yes. Public likely has too many routeable skills for the default surface, especially across overlapping coding and meta-improvement domains. The external repo suggests capability packaging can stay rich without exposing every specialization as a first-class routing unit.

## Method
I compared the current skill family descriptions and routing expectations with Agent Lightning's docs/examples packaging model.

## Evidence
- `system-spec-kit` is itself a large umbrella skill covering spec folders, validation, and memory preservation. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:16-16] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:389-408]
- `sk-code-opencode` provides OpenCode-specific standards for JS, TS, Python, Shell, and config files. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:2-3] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:15-40]
- `sk-code-web` separately orchestrates frontend implementation, debugging, and verification phases. [SOURCE: .opencode/skill/sk-code-web/SKILL.md:2-3] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:15-43]
- `sk-code-full-stack` adds another stack-agnostic implementation/testing/verification orchestrator. [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:2-3] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:15-40]
- Long-tail specialist skills such as `sk-improve-prompt` and `sk-improve-agent` add more routeable surfaces for prompt engineering and bounded agent mutation loops. [SOURCE: .opencode/skill/sk-improve-prompt/SKILL.md:2-3] [SOURCE: .opencode/skill/sk-improve-agent/SKILL.md:2-3]
- Agent Lightning instead packages operator choice mostly through docs categories, example families, and algorithm references rather than a large set of routeable skill identities. [SOURCE: external/docs/index.md:14-19] [SOURCE: external/examples/README.md:1-18]

## Analysis
Public's skill system has grown in a way that mirrors its internal expertise map rather than the operator's actual decisions. The result is a routing surface where multiple skills feel like near-neighbors, especially in coding workflows. That makes Gate 2 heavier because the router must discriminate among more first-class packages than most users would ever choose intentionally.

The cleaner model is capability packs. Keep the expertise, but merge the visible packaging. Coding can be one primary family with overlays. Meta-improvement tools like prompt improver and agent improver should be explicit opt-ins, not default candidates in everyday routing.

## Conclusion
confidence: high

finding: `system-spec-kit` should consolidate overlapping skill families into a smaller set of default capability packs, while moving niche or experimental skills into explicit opt-in territory.

## Adoption recommendation for system-spec-kit
- **Target file or module:** skill packaging and routing surface
- **Change type:** capability merge
- **Blast radius:** large
- **Prerequisites:** define default skill packs, migrate overlays, and mark advanced skills as explicit or optional
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Multiple first-class skills cover overlapping domains such as OpenCode coding, web coding, full-stack coding, documentation, prompt improvement, and agent improvement.
- **External repo's equivalent surface:** Capability choice is expressed through tutorials, algorithm references, and example families rather than through many routeable specialization packages.
- **Friction comparison:** Public asks routing machinery and power users to distinguish among more top-level abstractions. Agent Lightning keeps the packaging simpler and pushes nuance into docs/examples.
- **What system-spec-kit could DELETE to improve UX:** Delete default exposure of overlapping or rarely needed specialist skills from everyday routing.
- **What system-spec-kit should ADD for better UX:** Add a small set of default capability packs with optional advanced add-ons for prompt or agent improvement work.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that each current skill is distinct enough to justify default top-level routing, but the coding family in particular has too much overlap to feel clean at the package level.

## Follow-up questions for next iteration
- Should the three coding skills collapse into one primary coding pack with environment overlays?
- Which advanced skills should require explicit naming to activate?
- How should documentation explain optional packs without recreating the same surface sprawl?
