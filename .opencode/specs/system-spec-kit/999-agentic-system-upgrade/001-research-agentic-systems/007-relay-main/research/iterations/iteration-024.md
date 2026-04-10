# Iteration 024 — Merge Bootstrap, Retrieval, and Continuation Roles

Date: 2026-04-10

## Research question
Is the current sub-agent roster too granular around session state, with `context-prime`, `context`, and `handover` splitting responsibilities that could be merged at the operator surface?

## Hypothesis
Public's role separation is precise for implementation, but operators likely do not need three distinct concepts for bootstrap, exploration, and continuation.

## Method
Compared the orchestrator's agent roster and single-hop model with the dedicated contracts for `context-prime`, `context`, and `handover`, then contrasted them with Relay's smaller point-person and workflow patterns.

## Evidence
- The orchestrator roster explicitly calls out separate `@context-prime`, `@context`, and `@handover` agents. [SOURCE: .opencode/agent/orchestrate.md:169-183]
- The same orchestrator contract splits work into `UNDERSTANDING` via `@context`, then `ACTION` via implementation agents including `@handover`. [SOURCE: .opencode/agent/orchestrate.md:408-417]
- `context-prime` is a dedicated session bootstrap specialist centered on `session_bootstrap()` and optional `session_health()`. [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context-prime.md:57-66]
- `context` is the exclusive exploration agent for all retrieval tasks, with a 3-layer memory/codebase/deep-memory process and a structured Context Package. [SOURCE: .opencode/agent/context.md:25-32] [SOURCE: .opencode/agent/context.md:43-53] [SOURCE: .opencode/agent/context.md:127-168]
- `handover` is yet another dedicated continuation agent that rereads spec files, memory files, and summaries to generate `handover.md`. [SOURCE: .opencode/agent/handover.md:22-47] [SOURCE: .opencode/agent/handover.md:49-82]
- Relay's operator surface instead centers one active lead or workflow runner, with a point-person pattern for escalation and only a few visible coordination modes. [SOURCE: external/packages/sdk/src/workflows/README.md:70-121] [SOURCE: external/docs/plugin-claude-code.md:27-63]

## Analysis
Public's separate agents make sense internally because bootstrap, exploration, and handover have different permissions and outputs. The UX problem is that the system teaches those internals directly. Relay keeps internal specialization but lets the user experience "lead coordinates, specialists do work" instead of a long role list. Public could preserve the permission model while merging the operator-facing story around one context/continuation surface.

## Conclusion
confidence: high
finding: Public should merge bootstrap, retrieval, and continuation into a smaller operator-facing context surface, even if the implementation still keeps separate internal permissions for bootstrap-only, retrieval-only, and handover-write tasks.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/context.md`, `.opencode/agent/handover.md`, `/spec_kit:resume`
- **Change type:** agent surface merger
- **Blast radius:** high
- **Prerequisites:** define which responsibilities stay separate internally and which names disappear from operator-facing docs
- **Priority:** should-have (prototype later)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators and maintainers see separate concepts for bootstrap, exploration, and handover, each with its own contract and output rules.
- **External repo's equivalent surface:** Relay mostly presents a lead agent or workflow runner that coordinates work, while internal mechanics stay secondary.
- **Friction comparison:** Public's granularity improves implementation discipline but raises naming and routing overhead. Relay produces less friction because the user can reason about one active coordinator instead of several adjacent support roles.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for most operators to distinguish `context-prime` from `context`, or to think of `handover` as a separate agent role rather than a continuation capability.
- **What system-spec-kit should ADD for better UX:** Add one context/continuation story that covers bootstrap, retrieval, resume, and session closeout in a unified way.
- **Net recommendation:** MERGE

## Counter-evidence sought
Looked for a current Public surface already hiding these role distinctions behind a single context capability; the orchestrator and agent docs still present them as separate named specialists.

## Follow-up questions for next iteration
- Which permission boundaries truly require separate internal agents?
- Could `resume` and `handover` own more of this story so the agent roster shrinks from the user's perspective?
- Where would the debug and review agents still need to stay visibly separate?
