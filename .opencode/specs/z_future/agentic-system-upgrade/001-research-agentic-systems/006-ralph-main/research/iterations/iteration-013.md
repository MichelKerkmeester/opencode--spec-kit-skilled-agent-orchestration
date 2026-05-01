# Iteration 013 — Agent Role Sprawl vs Workflow-Local Contracts

## Research question
Is `system-spec-kit`'s agent architecture well-factored, or does Ralph suggest that more of the behavior should live in workflow contracts instead of long-lived specialized roles?

## Hypothesis
Ralph's minimal loop implies that some `system-spec-kit` role specialization may be compensating for workflow complexity that could live in command assets and local protocol files instead.

## Method
Compared Ralph's runtime composition (`ralph.sh`, tool-specific prompt files, and the small plugin manifest) with `system-spec-kit`'s orchestrator routing table and the deep-research command/agent split.

## Evidence
- Ralph's runtime is built from a tiny control plane plus tool-specific prompt contracts: one shell loop, one Amp prompt, one Claude prompt, and a plugin manifest that only exposes two skills. [SOURCE: external/ralph.sh:7-35] [SOURCE: external/prompt.md:7-16] [SOURCE: external/CLAUDE.md:7-16] [SOURCE: external/.claude-plugin/plugin.json:2-9]
- `system-spec-kit`'s orchestrator routes across a broad set of named roles such as `@context-prime`, `@context`, `@deep-research`, `@ultra-think`, `@speckit`, `@review`, `@write`, `@debug`, and `@handover`, and requires explicit agent-definition loading for dispatch. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:95-107] [SOURCE: .opencode/agent/orchestrate.md:160-177]
- Deep research already splits protocol across multiple layers: the command owns setup and YAML dispatch, while the agent owns a single-iteration contract. [SOURCE: .opencode/command/spec_kit/deep-research.md:7-24] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174] [SOURCE: .opencode/agent/deep-research.md:24-29] [SOURCE: .opencode/agent/deep-research.md:50-60]

## Analysis
The current architecture clearly buys isolation, explicit permissions, and better guardrails. But Ralph shows that a lot of autonomy discipline can live in a thin local contract rather than in a growing taxonomy of named personas. The deepest tension is between durability and indirection: `system-spec-kit` gains predictability from role specialization, yet each new role adds another behavior surface that must stay synchronized with commands, YAML assets, and constitutional rules. For narrow workflows, that is probably over-factoring.

## Conclusion
confidence: medium

finding: `system-spec-kit` should SIMPLIFY its agent model for narrow autonomous workflows by moving more loop-specific behavior into command/YAML contracts and reserving durable role specialization for genuinely different capability boundaries.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** identify which roles differ by capability versus which differ mainly by workflow instructions
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** A broad agent taxonomy distributes workflow responsibilities across many role-specific documents, with the orchestrator acting as router and policy enforcer. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:95-107]
- **External repo's approach:** Ralph uses one tiny runtime and tool-local prompt contracts; most behavior differences are captured in prompt text and story-state rules, not in a large persistent role graph. [SOURCE: external/ralph.sh:7-35] [SOURCE: external/prompt.md:7-16] [SOURCE: external/CLAUDE.md:47-71]
- **Why the external approach might be better:** It lowers synchronization cost because there are fewer long-lived instruction surfaces that can drift from one another. [SOURCE: external/README.md:132-145]
- **Why system-spec-kit's approach might still be correct:** Strong capability isolation matters in a repo that mixes documentation authority, research loops, review roles, and safety-critical gates. [SOURCE: .opencode/agent/orchestrate.md:160-177] [SOURCE: .opencode/agent/deep-research.md:36-43]
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Freeze expansion of the role taxonomy, then prototype a smaller "core roles" model: context loader, executor/researcher, reviewer, and spec-writer. Move workflow-local sequencing and status rules into command/YAML assets or packet-local prompts instead of new durable agent identities.
- **Blast radius of the change:** large
- **Migration path:** Start with one workflow family, compare drift and maintenance cost, then consolidate overlapping roles only after parity checks pass.

## Counter-evidence sought
I looked for proof that every current role boundary reflects a distinct capability boundary and found several places where behavior is already split between agent docs and command/YAML workflow assets, which suggests overlap. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174] [SOURCE: .opencode/agent/deep-research.md:24-29]

## Follow-up questions for next iteration
- If roles simplify, which validation machinery is still essential and which is mostly compensating for sprawl elsewhere?
- Does Ralph's acceptance-criteria discipline suggest a simpler validation spine than the current checklist-heavy model?
- Where is `system-spec-kit` protecting real risk versus merely documenting its own process?
