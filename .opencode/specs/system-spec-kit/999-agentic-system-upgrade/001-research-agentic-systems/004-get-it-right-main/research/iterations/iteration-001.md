# Iteration 001 — Control Loop As Missing Control Plane

Date: 2026-04-09

## Research question
Does Get It Right's explicit `implement -> checks -> review -> refactor` loop fill a control-plane gap that `system-spec-kit`'s current implementation workflow does not yet cover?

## Hypothesis
`system-spec-kit` has strong completion validation, but it does not yet have a bounded retry controller for a single coding task.

## Method
I compared the external workflow definition and loop explanation against `system-spec-kit`'s current implementation workflow YAML and review rubric to see whether an equivalent per-task retry controller already exists.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-18] The workflow defines a four-stage loop and states that only review feedback crosses attempts while implementation and check detail are intentionally discarded.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:111-134] The loop continues when review says anything other than `pass` or when lint/test/build fail, which makes retry behavior an explicit first-class control decision.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:295-323] The edges show that checks, review, and conditional refactor are wired into one deterministic retry circuit rather than being left to ad hoc operator judgment.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:147-159] The design is positioned as different from blind retry because it couples automated verification, structured feedback, clean context, and conditional cleanup.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-433] `system-spec-kit`'s implementation workflow is rich in task execution and checkpoints, but it is still a forward-moving development phase rather than an attempt-scoped retry controller.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:445-472] Completion validation happens near the end of the implementation phase, after work is already done, not as a loop control surface between bounded attempts.

## Analysis
Get It Right treats retries as architecture, not as operator improvisation. Its loop condition, edge routing, and fallback strategy are encoded directly into the workflow, which makes it possible to distinguish "try again," "stop," and "undo then retry" without human glue code. By contrast, `system-spec-kit` already enforces planning, checklist usage, and final validation, but those controls are linear and phase-oriented. I found no equivalent attempt-level controller in the current implementation YAML. That means the repo has strong governance at the packet level but no reusable retry mechanism for a single hard implementation task.

## Conclusion
confidence: high
finding: Get It Right exposes a real gap in `system-spec-kit`: there is no first-class implementation retry controller that sits between initial execution and final completion gates. The closest internal behavior is rich phase orchestration, but it does not decide whether a failed or flawed attempt should continue, be re-tried with guidance, or be actively unwound before the next attempt.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define an attempt-scoped state model and structured retry outcome contract before editing the main implement workflow
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing attempt-level retry controller in `spec_kit_implement_auto.yaml` and found sequential development, checkpointing, and completion validation, but no comparable retry loop or conditional refactor path.

## Follow-up questions for next iteration
- Should the retry loop live inside `/spec_kit:implement`, or should it be a separate opt-in command?
- If only one artifact crosses attempts, what should that artifact be inside `system-spec-kit`?
- Which existing internal agent is closest to Get It Right's reviewer-as-controller role?
