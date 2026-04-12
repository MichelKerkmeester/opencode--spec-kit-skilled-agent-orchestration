# Iteration 024 — Sub-Agent Granularity And Public Surface

## Research question
Is the current 10+ agent roster the right granularity, or does BAD suggest a thinner role model with more responsibilities hidden inside domain coordinators?

## Hypothesis
Local specialist agents are useful internally, but too much of that topology leaks into the public design surface. BAD shows that domain-shaped packaging is easier to understand than exposing many role names.

## Method
Compared BAD's single-skill coordinator packaging to the local orchestrator roster, command-to-agent mapping, and specialized agent definitions.

## Evidence
- BAD packages its automation as one skill module with one main coordinator surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:22-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-21]
- Local orchestration docs expose a 10-agent priority roster and a file map that explains which named agent owns which slice. [SOURCE: .opencode/agent/orchestrate.md:95-127] [SOURCE: .opencode/agent/orchestrate.md:169-183]
- Local command docs also map primary commands to specific internal agents. [SOURCE: .opencode/command/spec_kit/README.txt:149-159]

## Analysis
This is a packaging problem more than a capability problem. The local roster likely exists for good internal reasons, but operators do not benefit from carrying all of that topology in their head. BAD shows the value of a domain entrypoint that hides internal decomposition. `system-spec-kit` should keep specialists where they help execution, but merge the public surface toward domain-shaped responsibilities rather than named internal roles.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operator docs and agent docs expose a rich internal taxonomy of specialists such as `context`, `context-prime`, `speckit`, `write`, `review`, `debug`, and `ultra-think`.
- **External repo's equivalent surface:** BAD presents one domain coordinator and lets internal phases handle the real decomposition.
- **Friction comparison:** Local UX asks the operator to learn more internal architecture than BAD does. BAD minimizes cognitive load by packaging roles around the workflow instead of around internal mechanics.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for most operators to reason directly about the full agent roster and its dispatch rules.
- **What system-spec-kit should ADD for better UX:** Add domain-level public facades that hide internal agent composition, for example research, review, build, docs, and recovery.
- **Net recommendation:** MERGE

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** many named specialists with command-layer visibility.
- **External repo's approach:** one branded coordinator surface with internal phase logic.
- **Why the external approach might be better:** it reduces onboarding cost and keeps architectural detail where it belongs.
- **Why system-spec-kit's approach might still be correct:** the local system is broader, and internal specialists can still be the right execution units.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep internal specialists, but present a smaller domain-facing agent surface in operator docs and wrappers, with the roster treated as implementation detail.
- **Blast radius of the change:** medium
- **Migration path:** start by changing docs and command surfaces, not the execution engine; only merge agent definitions if real overlap remains after the public surface is simplified.

## Conclusion
confidence: high

finding: The local agent roster is probably too granular as an operator-facing surface. `system-spec-kit` should merge public agent UX toward domain facades while keeping specialist roles internal where they add execution value.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** UX and packaging merge
- **Blast radius:** medium
- **Prerequisites:** define a smaller public role vocabulary and decide which current agent names remain purely internal
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that operators must understand the full roster to use local workflows safely. The current docs explain the mapping well, but they do not show that exposing the whole roster is itself necessary.

## Follow-up questions for next iteration
Even if the public roster should shrink, is the LEAF iteration pattern itself still the right architecture for deep research and deep review?
