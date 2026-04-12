# Iteration 018 — Pivot Retry Validation Toward Outcome-Centric Gates

Date: 2026-04-10

## Research question
Does Get It Right suggest that `system-spec-kit`'s validation philosophy is too document-centric for implementation retries?

## Hypothesis
Yes for retry workflows. Attempt control should gate first on objective code outcomes, while document validation remains a completion concern.

## Method
I compared Get It Right's check gate with `system-spec-kit`'s validator and implementation completion rules to see which signals are actually useful between attempts.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-75] The external loop skips review entirely when lint, test, or build fails.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:147-159] The value proposition is objective verification plus targeted feedback, not document-structure compliance.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:110-131] Check commands are configurable per project and treated as the core objective gate.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:94-99] The internal spec validator is oriented around rules such as `FILE_EXISTS`, `ANCHORS_VALID`, `PHASE_LINKS`, and `SPEC_DOC_INTEGRITY`.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:315-319] Several of those validator rules are explicitly classified as doc-structure errors or warnings.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:531-616] Validation can recurse through child phases and aggregate phase results, which is valuable for packet health but orthogonal to whether one code attempt is correct.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:447-477] Internal completion already uses validation as an end-of-workflow requirement alongside `implementation-summary.md` and checklist evidence.

## Analysis
The current validator is useful, but it validates documentation contracts, template integrity, and packet structure. Those are not the main questions a retry controller needs to answer between attempts. Between attempts, the highest-value signals are objective code outcomes: did the change compile, pass tests, and satisfy stack-specific checks? The external repo is much stricter about that separation than `system-spec-kit` currently is. The result is a cleaner loop: attempt control reacts to code truth, while packet validation remains a durable completion concern.

## Conclusion
confidence: high
finding: retry-mode in `system-spec-kit` should pivot toward objective outcome gates first and treat spec-doc validation as a secondary completion gate rather than the primary attempt controller.

## Adoption recommendation for system-spec-kit
- **Target file or module:** retry workflow and implementation completion contracts
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define a configurable attempt-check matrix distinct from packet completion validation
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** completion validation blends spec-doc integrity, checklist verification, and implementation summary requirements with implementation completion.
- **External repo's approach:** attempt gating is anchored in objective repo checks; review only runs after those checks pass.
- **Why the external approach might be better:** it lets the retry controller react to the most actionable failures first and avoids spending reviewer cycles on document-structure concerns during code iteration.
- **Why system-spec-kit's approach might still be correct:** packet-level documentation integrity matters before claiming completion or preserving context.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** split `attempt_checks` from `completion_validation`; let retry-mode run repo-native lint/test/build plus selected packet checks, and reserve full `validate.sh --strict` for completion or for doc-changing attempts.
- **Blast radius of the change:** large
- **Migration path:** add an objective attempt-check layer without changing existing completion rules, then gradually document which validator subsets are appropriate during retries.

## Counter-evidence sought
I looked for evidence that doc-template compliance should decide whether the next coding attempt is allowed to run. The current sources instead place those checks near completion.

## Follow-up questions for next iteration
- Which packet checks belong in the attempt matrix, if any?
- How should failed check output be summarized for the next attempt?
- Should retry-mode ever run full `validate.sh --strict`, or only targeted validators?
