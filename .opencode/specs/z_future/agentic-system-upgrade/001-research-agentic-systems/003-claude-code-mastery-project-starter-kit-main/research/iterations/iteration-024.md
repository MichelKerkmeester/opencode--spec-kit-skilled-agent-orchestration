# Iteration 024 - Collapse Session Continuity Agent Surfaces

## Research question
Is the current split between `context`, `context-prime`, and `handover` the right granularity for session continuity, or is that an implementation detail leaking into the operator and maintainer mental model?

## Hypothesis
The external repo's flatter role structure will show that `system-spec-kit` can keep its stronger continuity behavior while exposing fewer separately named continuity roles.

## Method
Compared the local continuity-oriented agents and their contracts to the external repo's much smaller role surface and its document-driven continuity patterns.

## Evidence
- `context` is a retrieval-first agent focused on loading memory, code evidence, and working context before implementation. [SOURCE: .opencode/agent/context.md:45-53] [SOURCE: .opencode/agent/context.md:61-75]
- `context-prime` is a lighter bootstrap specialist that loads session health, code graph, CocoIndex status, and next-step guidance. [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context-prime.md:92-107] [SOURCE: .opencode/agent/context-prime.md:118-140]
- `handover` is dedicated to continuation artifacts and transition packages when the session ends or shifts. [SOURCE: .opencode/agent/handover.md:22-32] [SOURCE: .opencode/agent/handover.md:40-58]
- The local repo therefore splits continuity across at least three adjacent concepts before counting memory hooks and resume commands. [SOURCE: .opencode/command/spec_kit/README.txt:168-178]
- The external repo handles similar concerns with a much flatter role system plus working docs and progress commands; its named agents are narrow and few. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:1-39] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/test-writer.md:1-60] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]

## Analysis
This looks like role fragmentation at the UX boundary. Internally, the distinction between bootstrap, retrieval, and handover is defensible. But the system exposes too many continuity nouns for one basic human need: "help me pick up where I left off." The external repo handles that need with fewer named concepts because progress docs and commands carry more of the burden. `system-spec-kit` should keep the underlying specialization if it helps implementation, but it should merge or hide those roles behind one continuity surface for operators.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Separate continuity roles for bootstrap, richer context retrieval, and end-of-session handover.
- **External repo's approach:** Keep role count small and use docs plus progress summaries for continuity.
- **Why the external approach might be better:** It reduces conceptual overhead and makes continuity feel like a single capability rather than a cluster of adjacent subsystems.
- **Why system-spec-kit's approach might still be correct:** The local environment genuinely has more subsystems to coordinate, especially memory and code-graph state.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Preserve the internal continuity primitives, but expose them through one continuity entry point and one operator-facing concept.
- **Blast radius of the change:** medium
- **Migration path:** Merge docs and routing first, then decide whether the agent roster itself also needs consolidation.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Continuity spans resume commands, session bootstrap, context loading, handover artifacts, and multiple named agents.
- **External repo's equivalent surface:** Continuity is mostly "look at the working doc or progress output and continue."
- **Friction comparison:** The local system is stronger for long-lived agentic work, but it imposes more naming and routing overhead on maintainers and power users than the external repo does.
- **What system-spec-kit could DELETE to improve UX:** Delete separate operator-facing continuity concepts for prime, context, and handover.
- **What system-spec-kit should ADD for better UX:** Add one continuity surface that chooses bootstrap, retrieval depth, and handover behavior automatically.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge its visible session-continuity surface so operators see one continuity capability rather than separate `context`, `context-prime`, and `handover` concepts.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/context.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/handover.md`, resume docs
- **Change type:** role and UX consolidation
- **Blast radius:** medium
- **Prerequisites:** decide whether the consolidation is documentation-only, routing-level, or also a roster change
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that users actively benefit from seeing all three continuity roles as distinct first-class concepts, but the benefits appear implementation-facing more than operator-facing. [SOURCE: .opencode/agent/context-prime.md:57-65]

## Follow-up questions for next iteration
Would the same logic apply to the deep-research and deep-review LEAF patterns, or are those loops earning their complexity in a way continuity roles do not?
