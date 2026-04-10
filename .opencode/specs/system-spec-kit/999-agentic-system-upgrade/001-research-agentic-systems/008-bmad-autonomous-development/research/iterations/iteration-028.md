# Iteration 028 — Gates, Hooks, And Constitutional Surface UX

## Research question
Does the overall Gate 1 -> Gate 2 -> Gate 3 plus hook/constitutional system create too much operator-visible machinery compared with BAD's thinner automation model?

## Hypothesis
The underlying safeguards are largely justified, but too much of the governance system is exposed as primary operator UX. BAD suggests the next move is redesigning the surface, not deleting the safeguards.

## Method
Compared BAD's minimal visible workflow contract to the current AGENTS/CLAUDE gate model, quick-reference tables, and session bootstrap/recovery guidance.

## Evidence
- Local framework docs expose a large pre-execution ceremony: Gate 1 understanding/context, Gate 2 skill routing, Gate 3 spec-folder binding, then post-execution memory and completion rules. [SOURCE: AGENTS.md:165-218] [SOURCE: CLAUDE.md:107-176]
- The same docs also carry long quick-reference matrices and workflow tables to help navigate that machinery. [SOURCE: AGENTS.md:134-155] [SOURCE: CLAUDE.md:47-70]
- Session recovery has a thoughtful `session_bootstrap` fallback, but it is another visible subsystem layered on top of the already large behavioral spec. [SOURCE: AGENTS.md:88-96]
- BAD presents a thinner visible operator contract and concentrates more logic inside its skill flow and setup assets. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:35-78] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:72-99]

## Analysis
This is the strongest UX friction signal in Phase 3. The local system has become a robust governance framework, but it increasingly reads like a framework the operator must operate manually instead of a framework that quietly protects them. BAD is not a direct replacement because it is much narrower, yet it demonstrates a healthier UX split: thin visible contract, thick hidden orchestration. `system-spec-kit` should keep the safeguards and redesign the public surface around them.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators are exposed to multiple named gates, constitutional docs, hook behavior, recovery paths, and rule tables before they even reach the actual task flow.
- **External repo's equivalent surface:** BAD shows a shorter visible contract that asks less procedural literacy from the operator.
- **Friction comparison:** Local UX is safer and richer, but it demands too much framework knowledge. BAD sacrifices breadth, yet clearly wins on immediate usability.
- **What system-spec-kit could DELETE to improve UX:** Delete most operator-facing presentation of the gate machinery as named ceremony for normal flows.
- **What system-spec-kit should ADD for better UX:** Add a short operator quickstart surface that hides gate/hook complexity behind automatic defaults and escalates only when a real boundary or risk needs user input.
- **Net recommendation:** REDESIGN

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** operator-visible governance, rules, and fallback systems.
- **External repo's approach:** thinner visible contract with behavior concentrated inside the coordinator flow.
- **Why the external approach might be better:** it reduces framework literacy requirements and makes the system feel more autonomous.
- **Why system-spec-kit's approach might still be correct:** local scope includes planning, governance, and memory responsibilities that BAD does not attempt.
- **Verdict:** REDESIGN
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** split the framework into a short operator-facing UX contract and a deeper internal constitutional layer; let wrappers and automation enforce most gates without requiring the operator to absorb the ceremony.
- **Blast radius of the change:** high
- **Migration path:** begin with documentation and wrapper behavior, then selectively move rule-heavy content out of the primary operator surfaces.

## Conclusion
confidence: high

finding: The gate and constitutional system should not be removed, but its operator UX needs redesign. `system-spec-kit` should become more automatic on the surface and reserve visible procedural detail for true exception paths.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`
- **Change type:** UX redesign
- **Blast radius:** high
- **Prerequisites:** separate operator-facing guidance from internal governance material without weakening enforcement
- **Priority:** must-have

## Counter-evidence sought
I looked for signs that the current visible gate structure is already lightweight enough for routine work. The quick-reference material helps, but it mainly compensates for how much procedural surface is already exposed.

## Follow-up questions for next iteration
What does the total friction look like when walking a normal feature workflow end to end against BAD's thinner operator path?
