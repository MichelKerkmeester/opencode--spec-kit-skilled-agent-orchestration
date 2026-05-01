# Iteration 026 — Merge the Visible Code-Skill Family

Date: 2026-04-10

## Research question
Is the current skill system too fragmented, especially around coding workflows, and should `system-spec-kit` merge multiple visible skills into a smaller operator-facing capability family?

## Hypothesis
Public's skill system has grown powerful but exposes too many adjacent entrypoints, especially the overlapping `sk-code-*` family and the mandatory handoffs between `system-spec-kit`, `sk-code-opencode`, `sk-doc`, and `sk-code-review`.

## Method
Compared the main `system-spec-kit` routing rules with the `sk-code-opencode`, `sk-code-web`, `sk-code-full-stack`, and `sk-code-review` contracts, then contrasted them with Relay's lighter capability packaging.

## Evidence
- `system-spec-kit` declares itself mandatory for all file modifications and also requires routing code updates through `sk-code-opencode` and documentation updates through `sk-doc`. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-12] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:808-830]
- `sk-code-opencode` owns OpenCode system-code standards only and explicitly excludes web/frontend and broader lifecycle work. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:10-18] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-48]
- `sk-code-web` owns frontend implementation patterns but still delegates formal review output to `sk-code-review`. [SOURCE: .opencode/skill/sk-code-web/SKILL.md:61-68] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:495-505]
- `sk-code-full-stack` is another stack-agnostic development orchestrator that likewise depends on `sk-code-review` as the baseline. [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:10-15] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:41-60]
- `sk-code-review` itself defines a baseline+overlay model where exactly one `sk-code-*` overlay is paired with the review baseline. [SOURCE: .opencode/skill/sk-code-review/SKILL.md:10-12] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:47-68]
- Public also maintains longer-tail specialist skills such as `sk-improve-prompt`, `sk-improve-agent`, and `mcp-coco-index`. [SOURCE: .opencode/skill/sk-improve-prompt/SKILL.md:10-38] [SOURCE: .opencode/skill/sk-improve-agent/SKILL.md:17-47] [SOURCE: .opencode/skill/mcp-coco-index/SKILL.md:10-32]
- Relay's user-facing coordination surface does not ask the operator to reason about many named capability packages; the workflow builder and plugin modes stay primary, and optional skills appear as agent configuration rather than a front-door taxonomy. [SOURCE: external/packages/sdk/README.md:13-31] [SOURCE: external/packages/sdk/src/workflows/builder.ts:193-226] [SOURCE: external/docs/plugin-claude-code.md:27-63]

## Analysis
Public's modularity helps maintainers keep domain rules precise, but the operator-facing effect is a skill lattice: one root workflow skill, multiple code overlays, a review baseline, and several specialist improvement/search skills. Relay suggests a cleaner presentation model: capability composition still exists, but it is mostly implicit. Public should preserve the modular internals while presenting a smaller "coding workflow" front door.

## Conclusion
confidence: high
finding: Public should merge the visible code-skill family into a smaller operator-facing capability surface, keeping the current overlays internally but no longer asking users or general workflows to navigate the full `sk-code-*` taxonomy directly.

## Adoption recommendation for system-spec-kit
- **Target file or module:** skill onboarding docs, Gate 2 routing outputs, top-level workflow guidance
- **Change type:** skill-surface merger
- **Blast radius:** high
- **Prerequisites:** define the new front-door capability names and how overlay routing remains visible only when needed
- **Priority:** must-have (prototype later)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can encounter `system-spec-kit`, `sk-code-opencode`, `sk-code-web`, `sk-code-full-stack`, `sk-code-review`, and other specialist skills as separate concepts.
- **External repo's equivalent surface:** Relay mostly exposes workflow and coordination modes, while optional capabilities are tucked into workflow config or agent setup.
- **Friction comparison:** Public's skill granularity helps specialists, but it creates more routing ceremony and vocabulary for normal work. Relay keeps the front door lighter by composing capabilities beneath the surface.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that users need to understand the full `sk-code-*` family and baseline+overlay architecture before starting work.
- **What system-spec-kit should ADD for better UX:** Add one visible "coding workflow" front door that internally selects the right overlay and review baseline.
- **Net recommendation:** MERGE

## Counter-evidence sought
Looked for proof that the many visible skills are already hidden behind a single front door; the current skill docs and Gate 2 contracts still surface them directly.

## Follow-up questions for next iteration
- Which skill names still need to remain operator-visible for power users?
- Could review overlays be attached automatically without separate skill education?
- Is there a clean distinction between operator-facing skills and maintainer-facing skills?
