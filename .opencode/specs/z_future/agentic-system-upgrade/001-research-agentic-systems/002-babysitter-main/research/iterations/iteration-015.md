# Iteration 015 — Shrink Universal Validation Into Workflow-Owned Checks

Date: 2026-04-10

## Research question
Is `system-spec-kit`'s validation pipeline too complex and too brittle, or is that complexity justified?

## Hypothesis
Babysitter will suggest that validation should be owned by the workflow itself, with only a thin global structural validator left outside the runtime.

## Method
I compared Babysitter's process-local checklist validation and state-machine guards with `system-spec-kit`'s global `validate.sh` and the breadth of `create.sh`/level rules they support.

## Evidence
- Babysitter's Spec Kit methodology defines checklist validation as an explicit task, not as a universal repo-wide validator detached from workflow semantics. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:98-108]
- The same process uses breakpoints after constitution, specification, and analysis to gate progression at semantically meaningful phases. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:165-170] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:198-200] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:246-250]
- Babysitter's generic state machine enforces exit guards based on actual state readiness, such as not leaving `PLANNING` without a plan or not completing before validation passes. [SOURCE: external/library/methodologies/state-machine-orchestration.js:134-156] [SOURCE: external/library/methodologies/state-machine-orchestration.js:219-235]
- `system-spec-kit`'s validator covers a broad cross-cut of concerns including file existence, placeholders, anchors, phase links, spec-doc integrity, template headers, and level matching. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:236-276] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:317-376] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:565-593]
- `create.sh` already carries substantial logic to materialize the level/phase model that `validate.sh` later enforces, which means the system is maintaining both a composition engine and a broad validation engine for the same taxonomy. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:200-244] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:590-607] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:668-680]

## Analysis
`system-spec-kit` absolutely needs validation. The question is where it should live. Babysitter's answer is compelling: let the workflow own semantically rich checks, and keep the generic runtime responsible for structural invariants and execution safety. `system-spec-kit` currently pushes a lot of semantic expectation into one universal validator, which increases brittleness and makes the validator responsible for workflow meaning it cannot fully know. [SOURCE: external/library/methodologies/state-machine-orchestration.js:134-156] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96]

The better split is likely: structural validation remains global, while workflow-specific gates such as checklist completeness, research packet expectations, release readiness, and phase handoff quality live inside the relevant command/runtime. That would align better with the Babysitter model and reduce the amount of one-size-fits-all logic in `validate.sh`. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:98-108] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:565-593]

## Conclusion
confidence: high

finding: Babysitter suggests `system-spec-kit` should simplify its validation architecture by reserving the global validator for structural integrity and pushing workflow-specific quality rules into command-owned gate logic. The current universal validator solves too many domain-specific problems in one place.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** A universal validator and the level/phase composition system jointly define what counts as a valid spec packet. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:200-244]
- **External repo's approach:** Process tasks and state-machine guards express validation at the phase where the workflow actually knows what "ready" means. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:98-108] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235]
- **Why the external approach might be better:** It reduces false rigidity, keeps semantic validation close to the workflow, and makes progression criteria auditable in runtime state.
- **Why system-spec-kit's approach might still be correct:** A single validator gives operators one command to trust and catches whole-packet regressions even when command-specific logic is absent.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Reduce `validate.sh` to structural/document integrity, then let deep-research, deep-review, completion, and phase workflows declare and enforce their own semantic gates.
- **Blast radius of the change:** large
- **Migration path:** Start by tagging existing validation rules as `structural` or `workflow-specific`, move one workflow at a time to command-owned checks, and keep `validate.sh --strict` as a compatibility umbrella until coverage is proven.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/command/spec_kit/assets/`
- **Change type:** architectural simplification
- **Blast radius:** large
- **Prerequisites:** classify existing rules by scope and define a workflow-gate interface
- **Priority:** should-have

## Counter-evidence sought
I looked for a current separation between structural and workflow-specific validation in `system-spec-kit` and found one validator carrying both kinds of responsibility, plus workflow YAMLs that still rely on that shared validator rather than replacing pieces of it. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:200-244]

## Follow-up questions for next iteration
- Which parts of the current agent architecture are genuinely necessary specializations, and which are mirror-management overhead?
- If specialist agents remain, can runtime mirrors and wrappers be reduced without losing the useful role boundaries?
- Should `system-spec-kit` invest next in error quality or in deterministic workflow tests?
