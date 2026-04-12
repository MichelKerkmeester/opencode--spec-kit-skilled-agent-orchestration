# Iteration 004 — Auto-Approval Audit Events

Date: 2026-04-09

## Research question
Should `system-spec-kit` encode explicit auto-approval audit records for non-interactive gate bypasses, instead of treating auto mode as approval-free?

## Hypothesis
Babysitter will show that non-interactive mode still needs an audit artifact, because removing human interaction is not the same thing as removing the need to document why the gate was skipped.

## Method
I focused on Babysitter's breakpoint intrinsic and compared its non-interactive behavior with `system-spec-kit`'s autonomous versus confirm deep-research modes.

## Evidence
- Babysitter's breakpoint intrinsic routes normal approvals through a breakpoint task, but in non-interactive mode it auto-approves and still appends a `PROCESS_LOG` entry that records the skip. [SOURCE: external/packages/sdk/src/runtime/intrinsics/breakpoint.ts:36-55]
- Breakpoint types support richer routing strategies such as `single`, `first-response-wins`, `collect-all`, and `quorum`, which means approvals are modeled explicitly, not just implied by control flow. [SOURCE: external/packages/sdk/src/runtime/types.ts:11-27]
- `spec_kit:deep-research` exposes `:auto` and `:confirm` modes, with confirm mode inserting approval gates and auto mode declaring `approvals: none`. [SOURCE: .opencode/command/spec_kit/deep-research.md:156-162] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:9-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:9-15]
- Confirm mode shows explicit approval gates after initialization, while auto mode has no corresponding audit structure for "this gate existed but was intentionally skipped." [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:204-227]

## Analysis
Babysitter separates two ideas that `system-spec-kit` currently conflates: "no human approval is required" and "no approval record is needed." The breakpoint intrinsic proves those are different. Even when the system auto-approves, it still records that a gate was encountered and intentionally bypassed because the run is non-interactive. [SOURCE: external/packages/sdk/src/runtime/intrinsics/breakpoint.ts:43-55]

For overnight research and CI-like runs, `system-spec-kit` needs the same distinction. Otherwise auto mode can look as though no gate existed, when the more accurate story is that the gate existed but policy said to auto-pass it. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:9-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:204-227]

## Conclusion
confidence: high

finding: `system-spec-kit` should preserve approval semantics in autonomous workflows by recording gate bypass events instead of silently omitting them. That change would make auto mode more auditable without making it interactive.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, and the `research/deep-research-state.jsonl` event schema
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** define canonical event names for `approval_required`, `approval_auto_passed`, and `approval_user_confirmed`
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing autonomous deep-research audit event that records skipped approvals and found mode declarations plus confirm-only approval gates, but no explicit auto-pass event. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:9-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:204-227]

## Follow-up questions for next iteration
- How should auto-pass gate events integrate with convergence and stuck-recovery state?
- Could skipped-approval records become part of `session_resume` continuity summaries?
- Does Babysitter also offer a better model for pending work than `system-spec-kit`'s current loop state?
