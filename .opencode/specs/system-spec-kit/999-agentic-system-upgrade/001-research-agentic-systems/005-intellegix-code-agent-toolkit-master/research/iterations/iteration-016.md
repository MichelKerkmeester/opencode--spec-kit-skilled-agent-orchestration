# Iteration 016 — Behavior-First Validation For Automation Packets

Date: 2026-04-10

## Research question
Does the external repo's testing posture suggest that `system-spec-kit`'s validation pipeline is aimed at the wrong source of truth for automation-heavy subsystems such as deep-research, deep-review, and orchestration?

## Hypothesis
Yes. Documentation validation is still valuable, but runtime automation features should be governed primarily by executable behavioral tests rather than an ever-expanding set of validator rules and documentation requirements.

## Method
I compared the external repo's CI and loop-driver tests with the local spec validation script and documentation quality rules. I focused on which system treats runtime behavior as the authoritative contract for automation features.

## Evidence
- `[SOURCE: external/.github/workflows/ci.yml:13-40]` The external CI gate is centered on running the loop's Python tests under multiple Python versions with coverage requirements.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2272]` Completion-gate acceptance and rejection are asserted behaviorally in tests rather than trusted as documentation intent.
- `[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:81-99]` The local validator exposes a growing rule set covering file existence, placeholders, sections, priority tags, evidence, anchors, ToC policy, phase links, and spec-document integrity.
- `[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:528-634]` Recursive phase validation compounds those documentation checks across parent and child folders and can auto-enable on phase detection.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:716-729]` The local documentation rules also require template copying, structure preservation, level upgrades, history handling, and validation before coding.

## Analysis
The local validation system is not wrong; it is optimized for documentation integrity and packet hygiene. The issue is scope creep. Automation-heavy features now depend on runtime behavior that documentation validators cannot actually prove. Phase 1 already identified this as a testing opportunity. Phase 2 pushes the conclusion further: for automation subsystems, the primary source of truth should be behavior under test, with documentation validation serving as a secondary guardrail.

The external repo's CI is simpler because it trusts executable tests to define runtime truth. That is the right instinct for stop reasons, fallback behavior, state writes, resume semantics, and guard enforcement. `system-spec-kit` should keep doc validators for spec quality, but it should stop using validator growth as the main way to increase confidence in automation workflows.

## Conclusion
confidence: high

finding: `system-spec-kit` should pivot to a behavior-first validation model for automation packets. Runtime semantics should be gated by executable contract tests first, with documentation validators constrained to packet integrity and operator clarity.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`, future orchestration/runtime test suites
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** define which automation contracts are test-owned versus doc-owned
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Documentation quality rules and spec validation are highly developed, while runtime-heavy workflows still rely on doc and parity surfaces for too much of their authority.
- **External repo's approach:** Loop runtime behavior is primarily specified and enforced through CI-backed tests.
- **Why the external approach might be better:** It keeps behavioral truth executable and prevents documentation confidence from outrunning runtime reality.
- **Why system-spec-kit's approach might still be correct:** Strong documentation validation catches a different class of failures that tests often miss, especially around packet completeness.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Freeze validator expansion for automation semantics until equivalent contract tests exist; treat validators as packet-integrity tools, not runtime-spec surrogates.
- **Blast radius of the change:** large
- **Migration path:** Add contract tests for one workflow family at a time, beginning with deep-research/deep-review stop semantics, then remove or downgrade validator rules that duplicate runtime behavior claims.

## Counter-evidence sought
I looked for local evidence that automation behavior is already primarily test-governed. I found parity and reducer tests, but the surrounding validation culture still leans heavily on documentation integrity.

## Follow-up questions for next iteration
- Which existing validator rules duplicate behavior that should really live in tests?
- Should automation packets report "contract tests passed" as a first-class closeout gate?
- How much of the current packet checklist can be reduced once runtime tests become the primary safety net?
