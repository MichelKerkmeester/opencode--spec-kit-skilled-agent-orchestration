# Iteration 025 — Sub-Agent Granularity and Role Overlap

## Research question
Is `system-spec-kit`'s 10+ agent roster the right granularity for operators, or does Ralph suggest that several responsibilities should be merged or hidden?

## Hypothesis
The deepest issue is not whether the internal role boundaries are valid, but whether too many of them are visible or conceptually distinct in the default workflow.

## Method
Compared Ralph's single-loop runtime and two-skill plugin packaging against the `system-spec-kit` agent roster, with special focus on overlap between `context`, `context-prime`, `handover`, and orchestrator-managed delegation.

## Evidence
- Ralph handles execution with one loop contract and a tiny skill surface; it does not ask operators to think in terms of a large role taxonomy. [SOURCE: external/.claude-plugin/plugin.json:2-9] [SOURCE: external/ralph.sh:84-113]
- `system-spec-kit`'s orchestrator references a broad role map and requires explicit delegation rules, including `@context` as the exploration gateway and several specialized execution roles. [SOURCE: .opencode/agent/orchestrate.md:95-107] [SOURCE: .opencode/agent/orchestrate.md:171-183]
- `context-prime` handles bootstrap and `handover` handles continuation packaging, but both sit close to `context`, `/spec_kit:resume`, and automatic session hooks in purpose. [SOURCE: .opencode/agent/context-prime.md:22-45] [SOURCE: .opencode/agent/handover.md:176-224] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:21-30]

## Analysis
For deep or parallel workflows, specialization is useful. The UX problem appears when bootstrap, retrieval, and continuation are presented as separate conceptual units instead of one continuity capability. Ralph's minimalism highlights that users rarely need to understand those distinctions. A smaller default role model would reduce cognitive load without preventing specialized internal dispatch when complexity demands it.

## Conclusion
confidence: medium

finding: `system-spec-kit` should merge bootstrap, retrieval, and continuation into a smaller default continuity surface, keeping deeper role specialization mostly internal.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define which current agent distinctions stay internal versus operator-visible
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators and maintainers can encounter separate concepts for orchestration, context loading, bootstrap, handover, review, writing, debugging, and deep loops.
- **External repo's equivalent surface:** Ralph hides almost all role boundaries behind one loop contract and a tiny skill package.
- **Friction comparison:** `system-spec-kit` has higher cognitive load because several agent boundaries describe lifecycle plumbing rather than operator intent.
- **What system-spec-kit could DELETE to improve UX:** Delete `context-prime` as a separately taught operator-facing concept, and stop treating handover as a standalone mental model for most sessions.
- **What system-spec-kit should ADD for better UX:** Add one continuity concept that covers bootstrap, recovery, and session carry-forward, with specialized roles invoked internally only when needed.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for proof that the current roster is already mostly internal and invisible, but agent docs, command workflows, and recovery instructions still surface several overlapping role concepts. [SOURCE: .opencode/agent/context.md:25-53] [SOURCE: .opencode/agent/context-prime.md:22-45] [SOURCE: .opencode/command/spec_kit/handover.md:176-224]

## Follow-up questions for next iteration
- If agent specialization is partly over-exposed, does the same problem exist in deep-loop architecture itself, or is the LEAF model one of the places where complexity is actually justified?
