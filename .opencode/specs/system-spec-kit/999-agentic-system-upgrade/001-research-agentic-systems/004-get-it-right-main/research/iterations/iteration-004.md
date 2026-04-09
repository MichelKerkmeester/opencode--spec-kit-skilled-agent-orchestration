# Iteration 004 — Check Gate Before Review

Date: 2026-04-09

## Research question
What are the practical benefits and costs of Get It Right's rule that review is skipped whenever lint, test, or build fails, and should `system-spec-kit` adopt the same gate?

## Hypothesis
The check gate is worth adopting because it prevents expensive review on obviously invalid attempts, even if it slightly delays nuanced reviewer analysis.

## Method
I followed the external check gate from the workflow edges into the explanatory docs, then compared that with `system-spec-kit`'s current validation timing in the implementation workflow and spec validator.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:125-132] When review does not run, failed checks force `eval_strategy` to default to `continue`, so the loop still has a legal control outcome.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:310-317] The edge from `join_checks` routes to no next node when any check exits non-zero, which skips both review and refactor for that attempt.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-44] The documentation states plainly that there is no point reviewing code that does not compile or pass tests.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:126-145] The fallback strategy is explicit, which prevents "review skipped" from becoming an undefined branch.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:449-472] `system-spec-kit` currently runs strict validation and checklist verification as part of completion, after implementation is largely done, not as an early branch that decides whether human-style review is worth spending.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] The validator already provides deterministic exit codes and a strict mode, which makes it usable as a retry-loop gate rather than just an end-of-phase report.

## Analysis
The cost of the external rule is reduced reviewer nuance on broken attempts; a reviewer might have noticed a deeper architectural problem even while tests were failing. But the external design chooses a better default for automation: first clear objective breakage, then spend reviewer cycles on semantic quality. `system-spec-kit` already has reliable validators and test expectations, so adding a pre-review check gate would reuse existing signals rather than inventing new ones. The biggest win would be cost control and faster loop cadence on obviously broken attempts.

## Conclusion
confidence: high
finding: `system-spec-kit` should adopt a pre-review validation gate in any future retry workflow. The repo already has the deterministic validators needed to make that gate practical, and the external workflow shows how to keep the control flow defined even when review is skipped.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** standardize which commands count as the attempt gate, likely `validate.sh --strict` plus optional repo lint/test/build hooks
- **Priority:** must-have

## Counter-evidence sought
I looked for an internal requirement that every failed attempt must still receive a full review. I found strong end-of-phase review and quality gates, but no rule that would prevent a pre-review validation short-circuit.

## Follow-up questions for next iteration
- Should failed-attempt feedback include only check summaries, or should a lightweight reviewer still annotate certain failure classes?
- Which internal validation commands are cheap enough to run every attempt?
- Can the existing review agent cleanly support "skipped because failed checks" as a first-class state?
