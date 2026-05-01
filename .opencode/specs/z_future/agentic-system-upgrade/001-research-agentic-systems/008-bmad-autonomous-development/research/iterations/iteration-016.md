# Iteration 016 — Agent Topology And Domain Coordinators

## Research question
Does BAD suggest that `system-spec-kit` should pivot away from exposing a broad generic agent roster and toward tighter domain coordinators?

## Hypothesis
BAD's operator surface is cleaner because users engage with a domain pipeline, not an agent taxonomy. Local commands already move in that direction, but the internal roster is still too prominent.

## Method
Compared BAD's documented coordinator model with the local orchestrator, agent roster, and session-bootstrap helper.

## Evidence
- BAD presents one domain coordinator that owns selection, waiting, and summaries while delegating execution to step-specific subagents with fresh context. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-20] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:25-25]
- Local orchestration exposes a richer fixed roster and makes agent selection a visible architectural concept: `@context-prime`, `@context`, `@deep-research`, `@ultra-think`, `@speckit`, `@review`, `@write`, `@general`, `@debug`, and `@handover`. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:93-126]
- `@context-prime` exists specifically to bootstrap session context before work starts, which is useful, but also shows how much of the current architecture is organized around internal agent roles rather than domain workflows. [SOURCE: .opencode/agent/context-prime.md:24-39] [SOURCE: .opencode/agent/context-prime.md:61-65]
- The command layer already partially hides this by mapping commands to specialist agents behind the scenes. [SOURCE: .opencode/command/spec_kit/README.txt:147-159]

## Analysis
`system-spec-kit` does not need fewer capabilities; it needs a clearer operator abstraction. BAD's lesson is that a domain module should front a workflow, not a roster diagram. The current command layer already helps, but the internal architecture keeps growing in agent-centric terms. That increases maintenance overhead and makes new domain workflows feel like they require new named agents instead of new composed modules.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** broad reusable agent roster plus commands that delegate into that roster.
- **External repo's approach:** domain coordinator first, fixed internal step agents second.
- **Why the external approach might be better:** users reason about the pipeline they want, not the internal agent graph.
- **Why system-spec-kit's approach might still be correct:** the local repo serves many workflow types, so shared specialist agents reduce duplicated behavior.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep the internal specialists, but stop expanding them as the primary user-facing abstraction. Future automation surfaces should be shipped as domain coordinators or command packs with fixed internal routing.
- **Blast radius of the change:** large
- **Migration path:** start with new workflow modules only; avoid retrofitting existing commands until the domain-coordinator pattern proves clearer and cheaper.

## Conclusion
confidence: high

finding: BAD argues for a different packaging direction more than a different capability set. `system-spec-kit` should pivot toward domain-first coordinator modules for new automation instead of continuing to expose more of its generic agent topology as a primary design surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define which future workflows deserve domain coordinator modules instead of generic orchestrator composition
- **Priority:** should-have

## Counter-evidence sought
I checked whether the current command layer already fully hides the agent roster; it helps, but the internal docs and routing still frame the system heavily in named-agent terms.

## Follow-up questions for next iteration
If the operator abstraction should simplify, does BAD's sparse testing and config drift imply local validation is actually correctly complex, or are there pieces of the validation stack that remain overbuilt?
