# Iteration 003 — Fresh Context Per Attempt

Date: 2026-04-09

## Research question
Are Get It Right's `memo: false` fresh forks a portable pattern that `system-spec-kit` should reuse for any future implementation retry loop?

## Hypothesis
Yes. `system-spec-kit` already trusts fresh-context looping in deep research, so the same idea should carry over to implementation retries.

## Method
I mapped the external fork semantics against `system-spec-kit`'s deep-research loop, which already uses fresh context, externalized state, and leaf-agent constraints.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:147-150] The implementer runs in a forked thread with `memo: false`.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:224-226] The reviewer also runs with `memo: false`, so evaluation happens without extra carry-over beyond the parent thread.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:270-272] The refactorer follows the same rule, which makes the whole control loop fresh-fork by design.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/implementer.md:13-20] The implementer documentation says stale context is deliberately excluded because reviewer feedback is the distilled signal.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:152-170] The thread model is justified on context efficiency, clean-slate behavior, and signal-over-noise grounds.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23] `system-spec-kit` already encodes the same principle for research: fresh context per iteration plus externalized state is treated as the core operating model.
- [SOURCE: .opencode/agent/deep-research.md:24-28] The internal deep-research agent is explicitly single-iteration and depends on the outer workflow for continuity, which mirrors the same control-plane separation.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:320-325] The internal dispatcher already enforces leaf-only behavior, limited tool budgets, and file-owned state rather than long-lived conversational carry-over.

## Analysis
This is the strongest portability signal so far because `system-spec-kit` already uses it successfully. The external repo proves the pattern works for implementation retries; the internal repo proves the team already accepts it for research loops. That means a future retry controller does not need a conceptual migration on fresh-context semantics. It can reuse existing loop-manager assumptions and simply change the per-iteration artifact and agent roles.

## Conclusion
confidence: high
finding: Fresh context per attempt is portable and already culturally compatible with `system-spec-kit`. The repo does not need to invent a new memory model for retries; it can extend the existing fresh-context plus externalized-state pattern from deep research into implementation retry flows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define attempt-state files and a leaf-agent dispatch contract for implementation retries
- **Priority:** must-have

## Counter-evidence sought
I looked for evidence that internal long-running workflows prefer cumulative thread memory. The dominant internal deep-research contract points the other way: fresh dispatches with externalized state are already the standard for iterative work.

## Follow-up questions for next iteration
- If fresh forks are reused, what should be the exact minimal parent-thread state for implementation retries?
- Which existing internal reducers can be reused instead of inventing new orchestration plumbing?
- Does a fresh-fork implementation loop need the same dashboard and registry surfaces that deep research has?
