# Iteration 019 — Reflective CLI Config As A Cautionary Tale

Date: 2026-04-10

## Research question
Should `system-spec-kit` adopt an auto-reflective CLI configuration model similar to Agent Lightning's generic constructor-to-CLI layer?

## Hypothesis
The external config helper is probably powerful, but its own caveats will show why Public should prefer explicit command contracts for user-facing workflows.

## Method
I read Agent Lightning's reflective config utility and its tests, then compared that approach against Public's explicit command setup contracts and gate-guided workflows.

## Evidence
- Agent Lightning's `config.py` begins with a warning that the file is not carefully reviewed and may contain unintentional bugs. [SOURCE: external/agentlightning/config.py:3-7]
- The helper infers CLI argument types by reflecting over constructor annotations and building argparse options dynamically. [SOURCE: external/agentlightning/config.py:85-176] [SOURCE: external/agentlightning/config.py:179-216]
- The associated test file repeats the caveat that it ensures only "somewhat correctness" and should not be used as a reference for expected behavior. [SOURCE: external/tests/test_config.py:5-10]
- `system-spec-kit`'s deep-research command intentionally defines a very explicit setup contract, with resolved inputs, allowed suffixes, and YAML handoff rules spelled out directly. [SOURCE: .opencode/command/spec_kit/deep-research.md:7-21] [SOURCE: .opencode/command/spec_kit/deep-research.md:39-63]
- Public's AGENTS contract also makes explicit routing and gate behavior part of the command surface rather than auto-derived behavior. [SOURCE: AGENTS.md:165-186]

## Analysis
Agent Lightning's reflective config helper is useful as an internal convenience, but the repo itself signals that it is not a hardened public-contract surface. That is an important warning for Public. `system-spec-kit` is a command- and workflow-heavy environment where ambiguity around argument meaning can create operator friction, not reduce it.

This is therefore a negative signal rather than an adoption opportunity. Public should continue to favor explicit, documented command contracts for its operator-facing workflows. Reflection may still help internal utilities, but it should not become the basis for primary command surfaces.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject reflective CLI config generation for its core operator workflows. Agent Lightning's own caveats make clear that this pattern is too brittle for high-governance, user-facing command contracts.

## Adoption recommendation for system-spec-kit
- **Target file or module:** command-surface design
- **Change type:** rejected adoption
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Important commands use explicit, hand-authored contracts and setup rules.
- **External repo's approach:** A reflective helper can infer CLI arguments from constructor signatures, but it is caveated as not carefully reviewed.
- **Why the external approach might be better:** It reduces boilerplate for internal utilities and fast experiments.
- **Why system-spec-kit's approach might still be correct:** Public needs stable, predictable, user-facing command semantics more than it needs DRY config generation.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** n/a
- **Blast radius of the change:** n/a
- **Migration path:** n/a

## Counter-evidence sought
I looked for evidence that the reflective config layer is treated as a production-grade public API in the external repo, but both the module and its test file explicitly warn against that interpretation. I also checked whether Public's explicit command contracts are clearly causing more problems than they solve, and the stronger friction signals are around surface area and ceremony, not the existence of explicit arguments.

## Follow-up questions for next iteration
- If explicit command contracts stay, where can Public still safely remove boilerplate?
- Which current command surfaces are verbose because of governance rather than because of explicitness itself?
- What should remain intentionally hand-authored even after broader simplification work?
