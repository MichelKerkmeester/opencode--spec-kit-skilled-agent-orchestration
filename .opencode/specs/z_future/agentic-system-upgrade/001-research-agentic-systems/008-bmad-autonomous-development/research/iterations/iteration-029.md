# Iteration 029 — End-To-End Workflow Friction

## Research question
How much operator-visible friction does a common "add a new feature" workflow carry in `system-spec-kit` versus BAD's equivalent run loop?

## Hypothesis
`system-spec-kit` delivers more rigor, but it makes the operator cross too many visible boundaries to reach the default path. BAD suggests the local system needs a bundled end-to-end entrypoint.

## Method
Walked the local feature workflow from spec binding through implementation, completion, memory save, and handover, then compared it with BAD's setup and run loop.

## Evidence
- The local system front-loads Gate 3 binding for file modification, then routes through planning/implementation/completion workflows and post-execution save/verification rules. [SOURCE: AGENTS.md:165-218] [SOURCE: CLAUDE.md:107-176]
- The local template system requires at least a Level 1 spec folder with `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`, with more files for higher levels. [SOURCE: CLAUDE.md:181-197] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:90-238]
- BAD's operator journey is thinner: configure once, then run the coordinator, which internally handles stage progression, wait/continue logic, and cleanup. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:35-59] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:212-391]

## Analysis
The local workflow is probably correct for a governance-heavy framework, but the step count is still a real cost. A typical feature path involves at least one explicit boundary question, several spec artifacts, command selection across lifecycle stages, completion verification, and optionally memory/handover follow-through. BAD shows that a thinner visible journey feels materially smoother even when the internal work is still complex. The right local response is not to delete rigor; it is to bundle the common path.

## UX / System Design Analysis

- **Current system-spec-kit surface:** A normal feature flow spans gates, spec scaffolding, lifecycle commands, validation, memory save, and optional handover, with several visible transitions.
- **External repo's equivalent surface:** BAD compresses the visible journey into setup plus a run loop that owns the rest.
- **Friction comparison:** Local flow creates more files, more questions, and more explicit tool transitions. BAD has lower step count and lower cognitive load for the operator.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for operators to manually stitch together the standard feature path from multiple named steps.
- **What system-spec-kit should ADD for better UX:** Add a single end-to-end "start or run this work" entrypoint that binds the spec path, scaffolds the right level, and drives the common lifecycle with sensible defaults.
- **Net recommendation:** ADD

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** composable lifecycle with many explicit user-visible transitions.
- **External repo's approach:** one visible coordinator run path.
- **Why the external approach might be better:** it better matches what most operators actually want, which is progress on the task rather than mastery of framework boundaries.
- **Why system-spec-kit's approach might still be correct:** explicit transitions improve auditability and can help expert operators intervene precisely.
- **Verdict:** ADD
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a top-level bundled entrypoint that drives the standard feature workflow while preserving the current explicit commands for advanced use.
- **Blast radius of the change:** high
- **Migration path:** prototype the bundled entrypoint as a wrapper around current commands and templates before changing the underlying architecture.

## Conclusion
confidence: high

finding: The standard local feature workflow has too many visible boundaries. `system-spec-kit` should add a bundled end-to-end entrypoint for the common path instead of requiring operators to compose it manually from gates, templates, and separate lifecycle commands.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** added capability
- **Blast radius:** high
- **Prerequisites:** define the default lifecycle contract and identify where advanced users can still break out into manual control
- **Priority:** should-have

## Counter-evidence sought
I looked for an already-documented local flow that materially compresses the standard feature path. The current quick references are helpful, but they still describe composition rather than providing one dominant bundled entrypoint.

## Follow-up questions for next iteration
If more lifecycle and memory behavior becomes bundled, which dedicated memory surfaces should remain distinct instead of collapsing into `spec_kit`?
