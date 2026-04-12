# Iteration 029 — Add A Fast Path For Bound Continuation And Small Changes

Date: 2026-04-10

## Research question
How much end-to-end workflow friction does `system-spec-kit` impose for a normal feature or continuation flow compared with the external repo, and what is the highest-leverage UX addition?

## Hypothesis
The local workflow imposes too many operator-visible steps for bound continuation and small scoped work. It needs a fast path that preserves safety while dramatically reducing setup questions and artifact overhead for already-bounded work.

## Method
I walked the documented local lifecycle for new work and continuation, then compared it with the external repo's orchestration paths. I focused on operator-visible questions, files, and transitions.

## Evidence
- `[SOURCE: AGENTS.md:132-155]` The local quick-reference workflow spans explicit steps for spec foldering, planning, implementation, completion verification, memory save, and handover.
- `[SOURCE: .opencode/command/spec_kit/plan.md:37-45]` `/spec_kit:plan` begins with a blocked unified setup phase before any planning work happens.
- `[SOURCE: .opencode/command/spec_kit/implement.md:35-45]` `/spec_kit:implement` starts with its own blocked unified setup phase and confirmation logic.
- `[SOURCE: .opencode/command/spec_kit/complete.md:38-45]` `/spec_kit:complete` does the same for the full lifecycle path.
- `[SOURCE: .opencode/command/spec_kit/implement.md:171-185]` Even once implementation begins, the lifecycle still includes preflight, postflight, save-context, and handover stages.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator.md:47-55]` The external repo routes a task through one argument pattern that activates a persistent mode or status/off behavior.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator-new.md:25-41]` The external greenfield path asks for only one clarifying question when the prompt is too vague.

## Analysis
For full governance work, the local workflow cost is defensible. For bound continuation and small scoped changes, it is not. The system already knows a lot after Gate 3 is answered and a spec folder is bound, yet the command surface still keeps rediscovering state through separate setup phases. That is friction without equivalent safety gain.

The highest-leverage fix is not deleting rigor from high-risk workflows. It is adding a fast path for already-bounded work. Once a spec folder is active and the task is clearly continuation or a small delta, the operator should be able to say effectively "continue in bound mode" and skip most of the setup choreography.

## Conclusion
confidence: high

finding: `system-spec-kit` should add a dedicated fast-path workflow profile for bound continuation and small scoped changes, reducing repeated setup and artifact expectations while preserving safety-critical checks.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/resume.md`
- **Change type:** should-have
- **Blast radius:** operator-surface
- **Prerequisites:** define eligibility rules for the fast path so it cannot silently under-document high-risk work
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Bound continuation still pays for repeated setup phases and multiple lifecycle transitions.
- **External repo's equivalent surface:** The external repo keeps continuation closer to a single orchestration mode with fewer public re-entry questions.
- **Friction comparison:** The local system creates more files and asks more lifecycle questions. The external repo loses some traceability, but wins heavily on momentum.
- **What system-spec-kit could DELETE to improve UX:** Delete repeated setup questions for already-bound continuation work.
- **What system-spec-kit should ADD for better UX:** Add an explicit fast path for continuation and small deltas with reduced questioning and lighter artifact expectations.
- **Net recommendation:** ADD

## Counter-evidence sought
I looked for evidence that bound continuation work benefits from paying the full setup tax every time. I did not find clear support for that in either the local docs or the external surface.

## Follow-up questions for next iteration
- What is the minimum state needed to safely enter fast-path mode?
- Should fast-path work still create every artifact, or should some become optional/generated?
- Can `/spec_kit:resume` become the natural on-ramp for this mode?
