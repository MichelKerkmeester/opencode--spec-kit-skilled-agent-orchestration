# Iteration 002 — Feedback-Only Bridge

Date: 2026-04-09

## Research question
Why does Get It Right pass only reviewer feedback between attempts, and should `system-spec-kit` copy that compressed feedback bridge instead of carrying full attempt history?

## Hypothesis
The feedback-only bridge is the core anti-context-rot mechanism and is more portable than the surrounding Reliant YAML.

## Method
I traced where cross-attempt state is saved in the external workflow and compared that with `system-spec-kit`'s current research-state reducer and memory-save boundaries.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:14-24] The workflow description explicitly says only review feedback is saved to the parent thread and that implementation narratives, diffs, and check details are excluded to avoid context pollution.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:256-260] `save_message` writes only the review strategy and feedback back to the parent thread.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/reviewer.md:41-53] The reviewer prompt treats `feedback` as the essential bridge artifact and requires it to encode what failed, what should be preserved, and what approach should change.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-29] The main thread is deliberately lean: original request plus saved review messages, with implementation and refactor narratives left in throwaway forks.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-343] `system-spec-kit` already uses a reducer model in deep research where iteration files feed synchronized state artifacts, showing the repo is comfortable with compressed, workflow-owned state rather than raw chat accumulation.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:501-518] Durable memory is reserved for post-work session preservation through `generate-context.js`, not for noisy per-attempt telemetry.

## Analysis
The external design is not merely "small context is better." It is a deliberate split between ephemeral attempt detail and durable inter-attempt guidance. That maps cleanly onto `system-spec-kit`'s existing distinction between packet artifacts and memory saves. The important portability lesson is not to persist every attempt transcript, but to define one concise reviewer-authored artifact that the next attempt can trust. This also avoids contaminating the durable memory system with half-right implementation detours.

## Conclusion
confidence: high
finding: `system-spec-kit` should adopt the compression pattern, not the raw conversation carry-over. A reviewer-authored attempt summary is the right state boundary for retries; full attempt logs should remain disposable or packet-local.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** define a task-local storage convention, ideally under a retry subfolder in `scratch/` or `research/`, and explicitly exclude it from durable memory save flows
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that full attempt history is intentionally preserved between internal iterations. The closest internal analogue is reducer-owned research state, which still prefers synthesized artifacts over raw transcript accumulation.

## Follow-up questions for next iteration
- What exactly should a `system-spec-kit` retry feedback artifact contain to be sufficient but not bloated?
- Should attempt feedback be stored under `scratch/`, `research/`, or a new dedicated retry packet?
- Can the current review agent emit a controller-grade feedback object without large prompt changes?
