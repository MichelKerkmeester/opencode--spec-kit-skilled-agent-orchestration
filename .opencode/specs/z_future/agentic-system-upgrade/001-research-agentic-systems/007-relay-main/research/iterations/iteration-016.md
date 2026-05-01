# Iteration 016 — Single-Source Provider Registry

Date: 2026-04-10

## Research question
Should `system-spec-kit` replace its hand-maintained cross-provider narratives with a single-source provider registry and generated parity surfaces?

## Hypothesis
Relay's consolidated CLI registry and codegen hooks show a simpler maintenance pattern than Public's current repeated provider documentation.

## Method
Read Relay's CLI registry, package scripts, and generated-model triggers; then compared them with Public's three provider delegation references.

## Evidence
- Relay keeps supported CLI metadata in one consolidated registry covering binaries, non-interactive arguments, bypass flags, aliases, search paths, and exit-code quirks. [SOURCE: external/packages/sdk/src/cli-registry.ts:1-12] [SOURCE: external/packages/sdk/src/cli-registry.ts:18-31] [SOURCE: external/packages/sdk/src/cli-registry.ts:41-49] [SOURCE: external/packages/sdk/src/cli-registry.ts:53-160]
- Relay's package scripts include explicit codegen hooks, and `lint-staged` regenerates dependent artifacts when the shared CLI registry YAML changes. [SOURCE: external/package.json:88-145] [SOURCE: external/package.json:147-157]
- Public's Codex reference documents profile routing, sandbox modes, and stateless execution in its own schema. [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:62-132]
- Public's Gemini reference documents `@agent` invocation, tool access, and model/tool tables in a different schema. [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60-88] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:96-111]
- Public's Copilot reference documents `@Explore`, `@Task`, cloud delegation, and custom profiles using yet another schema. [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:12-29] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:57-90] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:98-155]

## Analysis
Phase 1 already identified the need for a shared provider-capability matrix. Phase 2 sharpens the implementation path: do not just hand-author one more summary table. Create a registry that can generate the repeated parity surfaces. Relay's registry is not perfect, but it shows the maintenance advantage of one machine-readable source feeding multiple consumers.

## Conclusion
confidence: high
finding: Public should move from manually synchronized provider docs toward a single-source provider registry that can generate shared capability tables, reference snippets, and wrapper metadata across Codex, Gemini, and Copilot surfaces.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`, shared docs/config generation tooling
- **Change type:** documentation/process simplification
- **Blast radius:** medium
- **Prerequisites:** define a canonical provider schema covering execution mode, write scope, context persistence, research/web capability, and delegation ergonomics
- **Priority:** must-have (adopt now)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Three provider references restate overlapping concepts in manually maintained, provider-specific prose.
- **External repo's approach:** One registry captures provider metadata, and supporting codegen/scripts keep dependent artifacts aligned.
- **Why the external approach might be better:** It reduces drift, makes parity explicit, and creates a reusable substrate for both docs and runtime wrappers.
- **Why system-spec-kit's approach might still be correct:** Public's providers truly differ in important ways, and over-normalizing could erase helpful nuance.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Build a canonical provider-definition file, generate shared capability tables/snippets from it, and let provider-specific docs focus only on the parts that genuinely differ.
- **Blast radius of the change:** medium
- **Migration path:** Start with generated shared tables embedded in current docs, then move more repeated sections behind generation as the schema stabilizes.

## Counter-evidence sought
Looked for a current Public source-of-truth registry already driving the three provider docs; the reviewed references appear independently authored.

## Follow-up questions for next iteration
- Which provider differences must stay hand-authored?
- Should the registry drive only docs, or also wrappers and tests?
- Can the parity rubric from iteration 009 become registry schema fields?
