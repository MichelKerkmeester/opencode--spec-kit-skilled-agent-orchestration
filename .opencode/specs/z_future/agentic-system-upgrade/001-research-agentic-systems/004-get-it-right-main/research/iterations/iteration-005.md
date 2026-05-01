# Iteration 005 — Reviewer As Strategy Selector

Date: 2026-04-09

## Research question
How different is Get It Right's reviewer from `system-spec-kit`'s current review agent, and should `system-spec-kit` add the external `pass | continue | refactor` strategy contract?

## Hypothesis
The existing review agent is strong as a scorer and issue finder, but it is not yet acting as a workflow controller in the same explicit way.

## Method
I compared the external reviewer prompt and schema with the internal review agent's quality-gate contract and scoring bands.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:191-223] The external reviewer is forced to emit three structured fields: `grade`, `strategy`, and `feedback`, where `strategy` is the loop-control variable.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:239-255] The reviewer's inject prompt frames the job as selecting `pass`, `continue`, or `refactor`, not merely enumerating defects.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/reviewer.md:3-12] The reviewer is described as the control mechanism for the retry loop and the sole bridge between iterations.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/reviewer.md:33-40] `refactor` is explicitly reserved for fundamentally wrong approaches, while `continue` is for sound but incomplete work.
- [SOURCE: .opencode/agent/review.md:124-131] The internal review agent returns PASS/FAIL bands with auto-retry guidance based on score, but not an explicit branch decision for the surrounding workflow.
- [SOURCE: .opencode/agent/review.md:237-257] The internal quality-gate output includes `pass`, score breakdown, blockers, required changes, suggestions, and revision guidance, which is rich review data but not a control-plane strategy enum.

## Analysis
The internal agent is already close in spirit: it scores, classifies severity, and can recommend retry behavior. What is missing is a workflow-ready strategy field that lets the orchestrator distinguish between "minor revision on same approach" and "fundamentally wrong, clean up first." That distinction is central to Get It Right. Adding it would not replace the existing rubric; it would wrap the rubric in a clearer control decision that a retry controller can consume.

## Conclusion
confidence: high
finding: `system-spec-kit` should extend its review contract with a strategy selector rather than replacing the current review rubric. The existing scoring model is valuable, but a retry controller needs an explicit branch choice similar to `pass | continue | refactor`.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/review.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define which workflow invocations require the new strategy field so existing read-only review use cases are not broken
- **Priority:** should-have

## Counter-evidence sought
I looked for an internal review output that already includes an equivalent branch field. The current agent discusses retry and escalation, but its explicit contract remains score-oriented rather than branch-oriented.

## Follow-up questions for next iteration
- Should `refactor` be a universal review outcome or only available in isolated retry workflows?
- Can the current review rubric map cleanly to `pass`, `continue`, and `refactor` without ambiguity?
- What cleanup mechanism would a `refactor` recommendation trigger inside `system-spec-kit`?
