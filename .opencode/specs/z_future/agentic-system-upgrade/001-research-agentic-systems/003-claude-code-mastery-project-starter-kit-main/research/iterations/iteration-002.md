# Iteration 002 — MDD Front Door

## Research question
Does the external `/mdd` workflow offer a simpler front-door experience than the current `system-spec-kit` research-plus-plan lifecycle, without replacing Spec Kit governance?

## Hypothesis
The starter kit will package feature-building and auditing more simply than local Spec Kit commands, but local workflows will be stronger on artifact quality and continuation.

## Method
Compared the starter kit README's workflow framing and the detailed `/mdd` command to the local `spec_kit` command index and `deep-research` command contract.

## Evidence
- The starter kit explicitly centers two workflows, with MDD as a single command that handles feature building and audit modes. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:43-47] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:132-149]
- `/mdd` handles mode detection, asks consolidated upfront questions, writes a numbered doc in `.mdd/docs/`, generates test skeletons from that doc, presents a named-step build plan, and only then implements. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:71-131] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:133-176] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:178-211]
- The local `spec_kit` surface is lifecycle-oriented rather than single-command-oriented: planning, implementation, deep research, deep review, debug, handover, resume, and complete are separated into explicit commands with mode variants. [SOURCE: .opencode/command/spec_kit/README.txt:41-46] [SOURCE: .opencode/command/spec_kit/README.txt:54-77]
- The local deep-research contract is intentionally loop-driven and artifact-heavy: it initializes state, iterates with a LEAF agent, synthesizes `research/research.md`, and then preserves memory. [SOURCE: .opencode/command/spec_kit/deep-research.md:115-173]

## Analysis
The starter kit wins on workflow ergonomics for a Claude-first developer because `/mdd` is a single memorable front door. The local system wins on separation of concerns, continuation quality, and governance. These are not equivalent systems: external MDD is a guided operator workflow, while local Spec Kit is a governed packet lifecycle. The opportunity is not to replace Spec Kit, but to expose a more guided front door for "audit/build with structured docs" that routes into existing Spec Kit commands.

## Conclusion
confidence: high

finding: The starter kit's strongest idea is not `.mdd/` itself; it is the user-facing ergonomics of a single command that leads Claude through doc-first work. `system-spec-kit` could borrow that front-door experience while preserving the richer plan/research/handover machinery underneath.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** decide whether the new front door should be a new command or a documented entry mode for existing `spec_kit` commands
- **Priority:** should-have

## Counter-evidence sought
I looked for signs that `/mdd` preserves the same level of continuation, validation, and multi-session structure as Spec Kit. The external materials reviewed did not show equivalent memory, handover, or resume depth.

## Follow-up questions for next iteration
Which parts of the starter kit's compression story are real mechanisms versus presentation?
Can a local front door avoid hiding the packet structure users still need?
Where should a guided audit workflow live: `spec_kit`, `improve`, or a new surface?
