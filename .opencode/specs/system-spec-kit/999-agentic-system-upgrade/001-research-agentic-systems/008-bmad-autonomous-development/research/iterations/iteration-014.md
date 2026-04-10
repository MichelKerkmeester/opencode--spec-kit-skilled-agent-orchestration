# Iteration 014 — Spec Lifecycle Levels Versus Thin Planning Assumptions

## Research question
Does BAD imply that `system-spec-kit` should pivot away from its Level 1/2/3+ plus phase-overlay documentation lifecycle?

## Hypothesis
BAD's thin documentation footprint reflects a narrower system boundary, not proof that the local documentation lifecycle is fundamentally wrong.

## Method
Compared BAD's planning assumptions and module scope with the local level and phase-definition architecture.

## Evidence
- BAD assumes BMad Method planning artifacts, sprint backlog structure, and `sprint-status.yaml` already exist. It automates execution on top of that substrate rather than defining a multi-level documentation lifecycle of its own. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:25-32] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/docs/index.md:13-18]
- `system-spec-kit` explicitly separates documentation depth from work decomposition: Level 1-3+ controls required artifacts, while phases are a behavioral overlay for decomposition. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-27] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:51-57] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:15-23] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:53-56]
- The local model encodes why those levels exist: Level 2 adds verification, Level 3 adds architectural decisions, and Level 3+ adds governance, rather than simply adding length. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:183-206] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:300-324] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403]

## Analysis
BAD does not disprove the local level system because BAD is not solving the same class of problem. It presumes planning and documentation were already done elsewhere. `system-spec-kit` is the planning/documentation framework. If anything, BAD shows how much lighter an execution module can be when another layer already owns the documentation burden. That supports the current local boundary more than it undermines it.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit documentation depth levels plus separate phase decomposition rules.
- **External repo's approach:** execution module that assumes an upstream planning/documentation substrate already exists.
- **Why the external approach might be better:** it keeps execution modules lighter because they do not re-solve planning and governance.
- **Why system-spec-kit's approach might still be correct:** this repo is the planning/governance substrate, so collapsing levels would erase one of its core jobs.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A
- **Blast radius of the change:** none
- **Migration path:** N/A

## Conclusion
confidence: high

finding: BAD is not evidence that Level 1/2/3+ is the wrong model. It is evidence that specialized execution modules can stay thin when a separate framework already owns planning and documentation. `system-spec-kit` should keep its level/phase architecture.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type:** rejected
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for any BAD artifact that defined an alternative documentation-depth taxonomy or lifecycle. The repo snapshot does not provide one; it depends on upstream BMad planning instead.

## Follow-up questions for next iteration
If the level system stays, does BAD still challenge the local memory architecture, or does it only argue for tighter boundaries between global memory and packet-local execution state?
