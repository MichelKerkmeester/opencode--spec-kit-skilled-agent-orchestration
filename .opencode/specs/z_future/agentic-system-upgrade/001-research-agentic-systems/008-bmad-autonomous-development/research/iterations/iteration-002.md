# Iteration 002 — Dependency Truth Sources

## Research question
How does BAD build and maintain its dependency graph, and what source of truth wins when backlog files disagree with live GitHub PR state?

## Hypothesis
BAD uses planning artifacts to derive dependency structure, but it treats GitHub merge state as authoritative for completion and readiness.

## Method
Read BAD's Phase 0 instructions and dependency-graph reference, then compared them to the local phase system documentation that currently models dependencies as static spec relationships.

## Evidence
- BAD Phase 0 reads `sprint-status.yaml`, only revisits epic planning docs for new stories, reconciles every story against GitHub PR state, and rewrites `dependency-graph.md` from that merged view. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:103-166]
- BAD explicitly states that GitHub PR merge status is the authoritative truth for whether a story is `done`, and any conflicting `sprint-status.yaml` value must be repaired to match GitHub. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:7-33]
- BAD's readiness rules require both dependency merges and lower-epic completion before a story becomes "Ready to Work". [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:37-73]
- Local phase definitions document cross-phase dependencies and recursive validation, but those checks are about spec-folder links and declared phase order, not about live repo or PR state. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:147-233]

## Analysis
BAD separates two concerns cleanly: planning artifacts define the dependency graph, while GitHub decides whether dependencies are actually satisfied in the codebase. That avoids a common failure mode where a backlog file says a unit is complete even though the merge has not happened. `system-spec-kit`'s current phase system models relationships well for documentation and validation, but it has no live readiness layer to bridge "documented dependency" and "merged reality."

## Conclusion
confidence: high

finding: BAD's dual-source approach is stronger than a spec-only phase map for long-running, multi-PR execution. The useful pattern for `system-spec-kit` is not the exact BAD files; it is the idea of a lightweight readiness ledger that can reconcile planned dependencies with live merge state before autonomous continuation.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define a canonical runtime signal for "phase merged" or "phase ready" before extending docs or validators
- **Priority:** should-have

## Counter-evidence sought
I looked for any existing local phase rule that already consumes PR or branch state during validation; the current phase definition file only documents folder-level lifecycle and link checks.

## Follow-up questions for next iteration
How does BAD convert this dependency graph into an execution schedule?
Does BAD's ready-story selector add anything beyond dependency resolution and epic ordering?
Which local command surface would own a future readiness ledger: planning, implementation, or a new sprint runner?
