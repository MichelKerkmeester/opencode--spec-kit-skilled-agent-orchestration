# Iteration 006 — Orchestrator Guardrails And Sentinel Enforcement

Date: 2026-04-09

## Research question
Would the external repo's orchestrator guard and sentinel-enforced role boundaries strengthen `system-spec-kit`'s orchestration safety?

## Hypothesis
Yes. The external repo appears to enforce orchestrator boundaries at runtime, while `system-spec-kit` mostly states them as agent instructions.

## Method
I compared the external orchestrator command and pre-tool-use guard with `system-spec-kit`'s orchestrator agent definition and constitutional tool-routing policy.

## Evidence
- `[SOURCE: external/commands/orchestrator.md:1-23]` The external orchestrator is forbidden from reading source, tests, or builds; it may only write instructions and configuration for workers.
- `[SOURCE: external/commands/orchestrator.md:83-95]` The command defines a sentinel object that the guard can inspect to decide what paths and actions are allowed.
- `[SOURCE: external/hooks/orchestrator-guard.py:1-10]` A dedicated pre-tool-use hook exists specifically to police orchestrator behavior.
- `[SOURCE: external/hooks/orchestrator-guard.py:130-175]` Paths are classified into allowed, denied, and managed-worktree cases before a tool action is permitted.
- `[SOURCE: external/hooks/orchestrator-guard.py:178-250]` Disallowed bash and file operations are blocked with explicit reasons rather than relying on prompt discipline.
- `[SOURCE: .opencode/agent/orchestrate.md:36-37]` `system-spec-kit` says the orchestrator must not perform implementation or codebase exploration directly.
- `[SOURCE: .opencode/agent/orchestrate.md:160-167]` The orchestrator must read agent definitions before dispatch, but the rule is procedural rather than runtime-enforced.
- `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-40]` Constitutional routing currently focuses on retrieval-tool choice, not role-specific enforcement for orchestration actors.

## Analysis
The external repo has a stronger safety posture here because it treats orchestration boundaries as enforceable policy, not just behavioral guidance. `system-spec-kit`'s orchestration docs are thoughtful, but if an orchestrator drifts into exploration or implementation, the current system relies on the model following instructions. The external sentinel pattern is a better fit than its lock-heavy worker runtime because it strengthens an existing local concept without forcing parallelism. A lightweight, runtime-agnostic sentinel schema could let `system-spec-kit` encode "allowed reads," "forbidden writes," and "task ownership" for orchestrator-led workflows.

## Conclusion
confidence: high

finding: `system-spec-kit` should adopt an optional sentinel-and-guard pattern for orchestrated workflows. This is a better transfer candidate than the external repo's full multi-agent substrate because it reinforces boundaries the local system already wants.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** define a sentinel schema that works across runtimes without assuming one specific hook system
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing runtime guard that enforces orchestrator path/tool restrictions. I found policy text, but no comparable sentinel-driven enforcement layer.

## Follow-up questions for next iteration
- Should the sentinel live in spec folders, scratch space, or generated runtime temp files?
- Which orchestrated workflows besides deep research would benefit first?
- Is a runtime capability flag sufficient, or does this need constitutional fallback behavior?
