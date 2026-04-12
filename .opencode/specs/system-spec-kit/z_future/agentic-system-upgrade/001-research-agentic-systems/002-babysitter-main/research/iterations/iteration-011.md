# Iteration 011 — Workflow Profiles Over Level Tiers

Date: 2026-04-10

## Research question
Is `system-spec-kit`'s current Level 1/2/3/3+ classification the right control model, or does Babysitter suggest a different documentation lifecycle entirely?

## Hypothesis
Babysitter will suggest that required artifacts should be driven by workflow phase and gate intent, not by a mostly size-shaped level taxonomy.

## Method
I compared Babysitter's executable `spec-kit-orchestrator` and generic state-machine methodology with `system-spec-kit`'s level guides, phase overlay rules, and spec-folder creation flow.

## Evidence
- Babysitter's Spec Kit methodology defines the lifecycle as executable phases and review breakpoints: constitution, specification, clarification, planning, decomposition, analysis, implementation, and checklist validation. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:3-5] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:233-250]
- Babysitter's generic state-machine methodology uses explicit states, transitions, guards, and completion rules instead of a documentation-size classification. [SOURCE: external/library/methodologies/state-machine-orchestration.js:13-21] [SOURCE: external/library/methodologies/state-machine-orchestration.js:37-60] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235]
- `system-spec-kit` currently centers the lifecycle on Level 1/2/3/3+ tiers, each adding required files and increasingly heavy obligations. [SOURCE: AGENTS.md:237-250] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-122] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:173-206] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:289-317] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:374-405]
- The phase overlay does not replace the level model; it stacks on top of it, which compounds document requirements in multi-phase work. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-804]
- `create.sh` exposes a broad flag matrix for levels, phasing, subfolders, sharded specs, and addendum composition, which is a sign that the taxonomy has become a runtime concern rather than just a documentation hint. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:200-244] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:590-607] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:850-866]

## Analysis
Babysitter's strongest signal here is not "documents are unnecessary." It is that workflow authority comes from an executable process that knows which artifacts and approvals matter at each phase. In contrast, `system-spec-kit` makes operators first choose a level, then layers phase rules on top, then derives file obligations from that classification. That means the classification itself becomes a coordination burden. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:144-170] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-804]

The external repo suggests a cleaner direction: treat artifact requirements as workflow profiles attached to a process or command mode, not as a user-facing size tier. A "verified implementation" profile, an "architecture change" profile, and a "governed multi-phase" profile are easier to reason about than numeric levels that still require learning addendums, overlays, and escalation rules. [SOURCE: external/library/methodologies/state-machine-orchestration.js:13-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:200-244]

## Conclusion
confidence: high

finding: Babysitter suggests that `system-spec-kit` should pivot from a level-first documentation lifecycle toward workflow profiles that directly encode which artifacts, checks, and approvals a run requires. Keep the templates, but demote Level 1/2/3/3+ from the primary operator-facing abstraction.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Operators reason about Level 1/2/3/3+, then optionally add a phase overlay, then satisfy the file set that falls out of that combined classification. [SOURCE: AGENTS.md:237-250] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-804]
- **External repo's approach:** Babysitter expresses lifecycle requirements as executable process phases and state-machine guards, with artifact checks living inside the process flow. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235]
- **Why the external approach might be better:** It removes an extra classification decision, aligns artifacts to workflow intent, and makes required checks phase-aware by default.
- **Why system-spec-kit's approach might still be correct:** Documentation levels are human-readable, stable across runtimes, and easier to explain than executable process metadata.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce workflow profiles such as `baseline`, `verified`, `architectural`, and `governed`; map current templates into those profiles; keep legacy levels as compatibility labels during migration.
- **Blast radius of the change:** architectural
- **Migration path:** Start by teaching `create.sh`, `validate.sh`, and command assets to accept profile IDs while still emitting the current level markers; once profile mode is stable, relegate levels to derived metadata rather than front-door inputs.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- **Change type:** architectural shift
- **Blast radius:** architectural
- **Prerequisites:** define a machine-readable workflow-profile schema and compatibility mapping to current level markers
- **Priority:** should-have

## Counter-evidence sought
I looked for a comparable workflow-profile abstraction already present in `system-spec-kit` and found only level tiers plus a phase overlay, which means the current operator surface still begins from documentation classification rather than workflow intent. [SOURCE: AGENTS.md:237-250] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-804]

## Follow-up questions for next iteration
- If levels become derived metadata, what should replace Gate 3's current level-heavy operator experience?
- Which current validation rules are really structural, and which belong inside workflow-specific quality gates?
- How much of the current spec-folder sprawl comes from the memory pipeline versus the level model itself?
