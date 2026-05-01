# Iteration 024 — Template and Spec Folder UX

## Research question
Does Ralph's far lighter documentation model imply that `system-spec-kit` should replace spec folders and Level 1/2/3+ templates with a much smaller PRD-style artifact set?

## Hypothesis
The friction is real, but the strongest evidence points toward simplifying how spec folders are introduced and validated, not deleting the spec-folder model entirely.

## Method
Compared Ralph's PRD and story structure with `system-spec-kit`'s CORE + ADDENDUM templates, level system, and strict validation flow to separate "too much operator ceremony" from "necessary documentation depth."

## Evidence
- Ralph uses a minimal state model: project metadata plus user stories with priority, acceptance criteria, and a pass flag. [SOURCE: external/prd.json.example:2-17] [SOURCE: external/skills/prd/SKILL.md:59-119]
- `system-spec-kit` intentionally uses progressive enhancement: Level 1 through Level 3+ add artifacts based on complexity and governance needs rather than one fixed template. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-35] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:21-45]
- The operator-facing friction comes from setup and validation ceremony: template copy steps, level-choice explanation, and strict gate language make the system feel heavier than its value model actually is. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:56-104] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-120]

## Analysis
Ralph proves that lightweight planning artifacts are enough for narrow loops, but it does not prove that `system-spec-kit`'s documentation depth is wrong for governed, multi-phase work. The real mismatch is in onboarding and tone: users encounter the full template stack and strict validator framing before they have experienced the value. That encourages a false binary between "keep the whole spec-folder system" and "delete it all." The evidence supports keeping the model while softening the path into it.

## Conclusion
confidence: medium

finding: `system-spec-kit` should NOT replace spec folders or the Level 1/2/3+ model with Ralph's minimal PRD artifact set.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type:** no change recommended
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators choose a documentation level, copy or generate multiple templates, then face strict validation rules and checklist language.
- **External repo's equivalent surface:** Ralph asks a few clarifying questions, generates a compact PRD/story structure, and proceeds.
- **Friction comparison:** Ralph has far less upfront ceremony, but it also supports a narrower workflow class. `system-spec-kit`'s deeper artifacts still fit higher-governance work; the friction comes from how the model is presented, not from the existence of the model itself.
- **What system-spec-kit could DELETE to improve UX:** Delete the operator expectation that users must internalize the full template architecture before work starts.
- **What system-spec-kit should ADD for better UX:** Add a lighter spec bootstrap preview that shows only the minimum files for the chosen lane and delays strict validation language until implementation is underway.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for evidence that Ralph already solves multi-phase, review-heavy, governed workflows with the same artifact simplicity and did not find it. Its artifact model is intentionally scoped to small, execution-ready stories. [SOURCE: external/README.md:170-188] [SOURCE: external/skills/prd/SKILL.md:75-92]

## Follow-up questions for next iteration
- If the documentation model stays, which parts of the agent roster are actually carrying useful specialization and which are just compensating for front-door complexity?
