# Iteration 010 — Do Not Replace Task Orchestration

Date: 2026-04-09

## Research question
Should Public replace its current Task-tool orchestration model with a full Relay-style broker and messaging fabric right now?

## Hypothesis
No. Relay's transport fabric is valuable, but copying it wholesale would collapse phase boundaries and duplicate existing orchestration authority.

## Method
Compared Relay's own transport-focused framing with the phase brief's overlap boundaries and Public's current orchestrator contract.

## Evidence
- The phase brief explicitly says phase 007 owns transport and messaging ergonomics while phase 002 owns deterministic orchestration, replay, and enforcement. [SOURCE: phase-research-prompt.md:21-33]
- The phase brief also says Relay's coordinator surfaces are lightweight and communication-oriented and should not be mistaken for a fully privileged orchestrator. [SOURCE: phase-research-prompt.md:41-51]
- Relay's plugin and architecture focus on channels, DMs, threads, readiness, and transport-facing tools rather than repo-aware governance. [SOURCE: external/docs/plugin-claude-code.md:65-87] [SOURCE: external/ARCHITECTURE.md:274-309]
- Public's orchestrator is already the single point of accountability and centers on decomposition, dispatch, evaluation, and synthesis. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:51-60]
- Public enforces explicit nesting and leaf constraints around Task-tool dispatch. [SOURCE: .opencode/agent/orchestrate.md:95-106] [SOURCE: .opencode/agent/orchestrate.md:152-156]

## Analysis
Relay solves a different problem than Public's current orchestrator. It gives concurrently running agents a transport plane. Public already has a strong control plane. Replacing the control plane with a broker would not just be expensive; it would blur phase ownership and risk duplicating the very orchestration and safety layers that Public already does better.

## Conclusion
confidence: high
finding: Public should reject any proposal to swap Task-tool orchestration for a full Relay-style broker in the near term. The right move is selective borrowing of transport concepts, not replacement of the existing orchestrator and phase-governance model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md` (boundary note only)
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
Looked for evidence that Relay already includes the repo-aware governance, spec authority, or deterministic workflow enforcement Public relies on; none was found in the reviewed docs and code.

## Follow-up questions for next iteration
- Which borrowed Relay concepts remain valuable once full replacement is rejected?
- Should Public codify this non-goal in a decision record when implementation work begins?
- Which phase should own any future broker experiment if one is ever attempted?
