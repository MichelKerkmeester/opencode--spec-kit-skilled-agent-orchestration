# Iteration 017 — Validation Philosophy And Drift Control

## Research question
Does BAD's lighter-weight bundle suggest `system-spec-kit` should radically simplify its validation and quality-gate machinery?

## Hypothesis
BAD actually argues for keeping strong validation around automation bundles, because even a small module drifted on its config contract without stronger parity checks.

## Method
Compared BAD's documentation/setup drift against the local documentation levels, validation expectations, and memory/quality-gate surfaces.

## Evidence
- BAD's public docs say config lives in `_bmad/bad/config.yaml`, while setup and activation logic work against `_bmad/config.yaml`, leaving a real contract mismatch inside a small bundle. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:10-14] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:10-14]
- Local level definitions intentionally add verification and architecture artifacts as complexity rises, rather than treating all work as equally light-weight. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:183-206] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:300-324] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403]
- The local runtime also keeps explicit save-quality and indexing safeguards behind documented flags and quality gates. [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:256-264] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:297-310]

## Analysis
BAD's repo is useful precisely because it is small enough to reveal what happens when documentation and setup contracts are not kept in lockstep: users get contradictory truth. That is not an argument to delete local validation. It is an argument to keep safeguards focused on bundle boundaries, where multi-file drift is most likely. The real simplification opportunity is in how validation is presented to operators, not in whether it exists.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** layered documentation requirements plus explicit quality-gate and validation surfaces.
- **External repo's approach:** minimal module bundle with comparatively light visible validation, which allowed a contract mismatch to survive.
- **Why the external approach might be better:** lighter process is easier to ship when the module is genuinely small and low-risk.
- **Why system-spec-kit's approach might still be correct:** local workflows span far more surfaces and would drift quickly without stronger contract checks.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A
- **Blast radius of the change:** none
- **Migration path:** N/A

## Conclusion
confidence: high

finding: BAD is not evidence that `system-spec-kit`'s validation philosophy is overbuilt. It is evidence that small automation bundles still need strong parity checks. The local system should keep validation complexity where it prevents drift.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type:** rejected
- **Blast radius:** medium
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for a stronger BAD test or validation layer that would have caught the config-path mismatch. None is present in this snapshot.

## Follow-up questions for next iteration
If validation stays, what is the best place to simplify the operator experience: command count, command aliases, or some other surface entirely?
