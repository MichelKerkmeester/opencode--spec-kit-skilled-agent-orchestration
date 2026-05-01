# Iteration 023 — Keep The Spec Folder Model, But Add A Guided Level Chooser

Date: 2026-04-10

## Research question
Is the Level 1/2/3+ and CORE+ADDENDUM template model intuitive enough, or is the spec-folder UX carrying too much up-front cognitive load?

## Hypothesis
The architecture is sound, but the entry experience is too conceptual. Users need a guided chooser and preview rather than more template theory.

## Method
I reviewed the template architecture, the `@speckit` agent contract, and the validator framing, then compared that with Xethryon's lighter documentation posture.

## Evidence
- The template system explicitly layers CORE plus ADDENDUM files and asks users to think in terms of multiple levels and optional phase composition. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-35] [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:66-73] [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:80-100]
- The `@speckit` agent reinforces that mental model by making level selection and template filling a formal part of the workflow. [SOURCE: .opencode/agent/speckit.md:68-101] [SOURCE: .opencode/agent/speckit.md:147-156]
- `validate.sh --strict` is strong and useful, but its rule/flag surface is dense for first-time operators. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:138-159]
- Xethryon shows the opposite extreme: lighter docs, fewer artifact types, and less obvious structure for proving provenance or completion. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:10-180]

## Analysis
Phase 2 already rejected replacing spec folders with generic lightweight docs. Phase 3 sharpens the UX lesson: the documentation model is not the problem, the entry point is. `system-spec-kit` currently teaches the taxonomy before it helps the user pick the right shape. Xethryon is simpler because it asks for less structure, but that comes with weaker traceability.

The right import is not architectural simplification. It is a guided chooser that asks a few concrete questions and outputs: selected level, required files, optional files, and the exact reason for the choice.

## UX / System Design Analysis

- **Current system-spec-kit surface:** users must understand levels, CORE vs ADDENDUM, and validation posture early in the workflow.
- **External repo's equivalent surface:** much less structured documentation, so the operator has less up-front theory to absorb.
- **Friction comparison:** Xethryon is lighter to start, but `system-spec-kit` pays that extra setup cost for real governance benefits. The avoidable friction is the abstract explanation burden before the user gets a concrete recommendation.
- **What system-spec-kit could DELETE to improve UX:** the expectation that a user should internalize the level system from prose alone before creation starts.
- **What system-spec-kit should ADD for better UX:** a guided level chooser with a preview of files to be created, what is optional, and what `--strict` will expect later.
- **Net recommendation:** ADD

## Conclusion
confidence: high

finding: keep the Level 1/2/3+ spec-folder model, but add a guided chooser and file-preview step so operators do not need to reverse-engineer the template architecture from documentation.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit taxonomy and strong validation, but high conceptual load at entry time.
- **External repo's approach:** low-friction documentation posture with weaker provenance controls.
- **Why the external approach might be better:** lower startup cost for small tasks.
- **Why system-spec-kit's approach might still be correct:** the stronger artifact model solves real quality and continuity problems.
- **Verdict:** ADD
- **If ADD — concrete proposal:** add a "level recommender" output to spec creation that shows selected level, required files, optional files, and validator expectations before scaffolding.
- **Blast radius of the change:** medium
- **Migration path:** additive UX layer only; keep current templates and validator unchanged.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/speckit.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a compact chooser schema and stable language for recommended vs optional files
- **Priority:** should-have

## Counter-evidence sought
I looked for proof that the current docs already provide an easy level-picking experience. They explain the system well, but explanation is not the same thing as guidance.

## Follow-up questions for next iteration
- Which agents are truly visible responsibilities, and which ones are implementation details leaking into the operator-facing model?
