# Iteration 027 — Gate 2 Skill Routing Ceremony

## Research question
Is the current Gate 2 pattern of explicit `skill_advisor.py` routing plus mandatory skill invocation too ceremonial compared with BAD's simpler capability activation model?

## Hypothesis
Yes. The routing machinery is useful internally, but it is too exposed as a formal step. BAD suggests capability routing should feel automatic and mostly invisible unless the user explicitly asks for a specialist.

## Method
Compared BAD's one-skill activation flow to the local Gate 2 requirements, skill loading sequence, and niche-skill inventory.

## Evidence
- BAD effectively activates one skill for one domain and moves quickly into execution. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:10-25]
- Local Gate 2 requires skill routing for non-trivial tasks and treats a high-confidence recommendation as mandatory invocation. [SOURCE: AGENTS.md:165-177] [SOURCE: CLAUDE.md:107-123]
- The local skill system documents a formal loading sequence from request, to `skill_advisor.py`, to `SKILL.md`, to referenced resources, across 20 skill folders. [SOURCE: .opencode/skill/README.md:42-46] [SOURCE: .opencode/skill/README.md:80-109]
- Some local skills are narrow expert tools rather than default workflow surfaces, such as `sk-improve-prompt` and `sk-improve-agent`. [SOURCE: .opencode/skill/sk-improve-prompt/SKILL.md:23-46] [SOURCE: .opencode/skill/sk-improve-agent/SKILL.md:28-55]

## Analysis
This is where the local system risks feeling self-conscious instead of helpful. Skill routing is good infrastructure, but the user should mostly experience "the system knew what to do," not "the system performed a ceremony before doing it." BAD's simpler flow is not enough for local breadth, yet it does show the right UX principle: keep routing implicit by default and reserve explicit specialist language for power use.

## UX / System Design Analysis

- **Current system-spec-kit surface:** The framework explicitly foregrounds Gate 2, `skill_advisor.py`, confidence thresholds, and mandatory invocation rules.
- **External repo's equivalent surface:** BAD activates one workflow skill without exposing a separate routing ritual.
- **Friction comparison:** Local UX adds another formal checkpoint before work starts, especially for users who do not care which skill name gets chosen. BAD removes that decision and moves straight into execution.
- **What system-spec-kit could DELETE to improve UX:** Delete most operator-facing emphasis on Gate 2 as a named step for routine tasks.
- **What system-spec-kit should ADD for better UX:** Add implicit skill routing with a compact explanation only when a specialist materially changes behavior or when the user asks.
- **Net recommendation:** SIMPLIFY

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit routing gate plus large visible skill taxonomy.
- **External repo's approach:** direct capability activation with minimal routing exposure.
- **Why the external approach might be better:** it lowers ceremony and makes the system feel more natural.
- **Why system-spec-kit's approach might still be correct:** explicit routing can improve consistency and auditability for a broad framework.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep `skill_advisor.py` as an internal implementation detail, demote Gate 2 from operator-facing ceremony, and push niche skills into opt-in expert surfaces rather than routine routing.
- **Blast radius of the change:** high
- **Migration path:** first update docs and wrapper behavior so routing becomes implicit, then decide whether the formal gate language should remain only in internal constitutional material.

## Conclusion
confidence: high

finding: Gate 2 is valuable infrastructure but poor primary UX. `system-spec-kit` should hide most skill-routing ceremony from operators and make specialist routing feel automatic unless the user explicitly wants that visibility.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`
- **Change type:** UX simplification
- **Blast radius:** high
- **Prerequisites:** decide which routing disclosures remain mandatory for auditability and which can move to internal implementation detail
- **Priority:** must-have

## Counter-evidence sought
I looked for evidence that routine operators benefit from explicitly seeing the Gate 2 ritual every time. The current docs enforce it strongly, but they do not show that the ceremony itself improves outcomes enough to justify the friction.

## Follow-up questions for next iteration
If Gate 2 should become quieter, does the same apply to the full Gate 1 -> 2 -> 3 and constitutional/hook system?
