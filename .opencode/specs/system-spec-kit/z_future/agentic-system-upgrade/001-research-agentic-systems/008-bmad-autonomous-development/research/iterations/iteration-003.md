# Iteration 003 — Scheduling And Epic Ordering

## Research question
What concrete scheduling rules govern BAD's parallel story execution, and is any part of that scheduler a good fit for local phase-based implementation workflows?

## Hypothesis
BAD's scheduler is stricter than the local implementation workflow because it chooses from a dependency-ready queue rather than merely deciding whether to parallelize work.

## Method
Read BAD's configuration and Phase 1 scheduling rules, then compared them to the local autonomous implement YAML's parallel-dispatch logic.

## Evidence
- BAD exposes `MAX_PARALLEL_STORIES` as an explicit scheduler control and pairs it with model/timer settings at startup. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:47-68]
- BAD's coordinator selects at most `MAX_PARALLEL_STORIES` from Phase 0's `ready_stories`, and it refuses to schedule later-epic stories while earlier epics remain incomplete. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-185]
- BAD's ready-state calculation also blocks stories whose dependency PRs are not merged. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:66-73]
- Local autonomous implementation checks whether to parallelize `code` and `testing`, but it does not maintain a backlog-wide ready queue or predecessor-aware batch selector. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-405]
- Local phase documentation tracks dependencies between phases, but it stops at documentation and validation rather than automated queue selection. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:186-233]

## Analysis
BAD's scheduler is not just "parallel by default." It is a queue manager that constrains concurrency using readiness, epic ordering, and a hard batch cap. The local implementation workflow already knows how to parallelize within one active phase, but it does not decide which phase or child packet should run next when multiple candidates exist. That means BAD's scheduler pattern is interesting for a future execution layer, but it is not a drop-in improvement for current `spec_kit:implement`.

## Conclusion
confidence: high

finding: The portable insight is the ready-queue abstraction, not the exact BAD backlog format. `system-spec-kit` could eventually benefit from a scheduler that selects phase children based on predecessor completion and explicit concurrency caps, but that belongs in a new orchestration layer rather than in the current implementation step alone.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** added option
- **Blast radius:** large
- **Prerequisites:** define a machine-readable phase readiness source before adding any queue-based dispatch
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for an existing local queue or backlog selector in the autonomous implement YAML; the current logic only decides whether to split current-phase work across code/testing agents.

## Follow-up questions for next iteration
How much of BAD's value comes from worktree isolation rather than the scheduler itself?
Would automatic worktree management violate the local git workflow rules?
Where are BAD's strongest quality gates inside the four-step pipeline?
