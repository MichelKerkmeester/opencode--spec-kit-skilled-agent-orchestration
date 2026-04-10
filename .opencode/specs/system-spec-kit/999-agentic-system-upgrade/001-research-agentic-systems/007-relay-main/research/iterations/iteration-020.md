# Iteration 020 — Single-Source Machine-Readable Docs

Date: 2026-04-10

## Research question
Should `system-spec-kit` simplify its documentation architecture by generating machine-readable mirrors from one canonical source instead of maintaining many parallel markdown explanations by hand?

## Hypothesis
Relay's explicit markdown-mirror strategy suggests a cleaner documentation pipeline than Public's current repeated command/skill/reference explanations.

## Method
Read Relay's docs introduction and code/data surfaces related to markdown delivery, then compared them with Public's repeated deep-loop and provider reference docs.

## Evidence
- Relay explicitly advertises that every page is also available as plain Markdown for LLMs, CLI tools, and programmatic access, separate from the richer web-doc surface. [SOURCE: external/docs/introduction.md:91-97]
- The repo also treats command/catalog shape as something that can be asserted programmatically rather than only described prose-first. [SOURCE: external/src/cli/bootstrap.test.ts:6-48] [SOURCE: external/src/cli/bootstrap.test.ts:68-125]
- Public's `deep-research` and `deep-review` commands each restate setup, lifecycle, outputs, memory integration, and examples in separate long-form markdown entrypoints. [SOURCE: .opencode/command/spec_kit/deep-research.md:7-31] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-247] [SOURCE: .opencode/command/spec_kit/deep-review.md:7-33] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-286]
- Public's provider delegation references likewise repeat conductor/executor framing, routing rules, and capability explanations across three provider-specific markdown files. [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:12-29]

## Analysis
Public's documentation sprawl is partly intentional because different surfaces have different consumers. The simplification opportunity is not "one doc for everything." It is "one authoritative structured source that can emit the human-facing and machine-facing variants." Relay's markdown-mirror stance is useful because it treats agent-readable docs as a first-class product of the same source, not as a second manual writing project.

## Conclusion
confidence: medium
finding: Public should introduce a documentation pipeline that can emit machine-readable markdown mirrors from one canonical source for command and provider surfaces. This would reduce drift without flattening important surface-specific nuance.

## Adoption recommendation for system-spec-kit
- **Target file or module:** command docs, provider delegation references, and the documentation-generation/tooling contract
- **Change type:** documentation architecture simplification
- **Blast radius:** medium
- **Prerequisites:** choose the canonical source format and the minimum generated outputs worth maintaining
- **Priority:** should-have (adopt now)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Multiple command and provider markdown surfaces are synchronized manually.
- **External repo's approach:** Human-facing docs and plain-markdown machine-readable mirrors are treated as aligned outputs of the same documentation system.
- **Why the external approach might be better:** It reduces copy drift, makes agent-readable documentation intentional, and creates a clean path for programmatic doc consumers.
- **Why system-spec-kit's approach might still be correct:** Public's docs often include runtime-specific nuance that may resist total generation from a single rigid schema.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Start with a canonical metadata/source layer for command and provider docs, then generate shared machine-readable markdown mirrors plus reused capability sections into surface-specific docs.
- **Blast radius of the change:** medium
- **Migration path:** Pilot on one doc family first, such as provider delegation references or deep-loop commands, then expand once the generation model proves it preserves nuance.

## Counter-evidence sought
Looked for a current Public documentation system already emitting machine-readable mirrors from one source; the reviewed command and provider docs appear hand-maintained.

## Follow-up questions for next iteration
- Which doc family is the best pilot for generated mirrors?
- How much structure is needed before generation becomes worthwhile?
- Should generated mirrors also feed tests that detect documentation drift?
