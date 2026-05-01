# Iteration 027 - Remove Mandatory Skill-Routing Ceremony

## Research question
Is mandatory Gate 2 skill routing via `skill_advisor.py` the right operator experience, or is that ceremony too expensive compared with the external repo's more implicit capability activation?

## Hypothesis
The local repo will still benefit from skill routing internally, but the explicit mandatory ceremony will prove heavier than necessary for many real workflows.

## Method
Compared Gate 2 enforcement and `skill_advisor.py` behavior to the external repo's flatter command and instruction model.

## Evidence
- The root behavioral spec makes Gate 2 a required routing step for non-trivial work and treats a high-confidence recommendation as mandatory. [SOURCE: CLAUDE.md:47-70] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-47]
- `skill_advisor.py` maps user requests to a broad skill catalog with embeddings and confidence thresholds, which is useful for internal routing but adds a visible extra step. [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-83] [SOURCE: .opencode/skill/scripts/skill_advisor.py:83-209] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-260]
- The local system already has many other gates and rule checks around understanding, spec binding, and memory handling. [SOURCE: CLAUDE.md:107-165] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:74-102]
- The external repo relies more on command design, layered instructions, and hooks than on an explicit "run the skill router first" operator ceremony. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:76-108] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-49]

## Analysis
This ceremony currently solves a real maintainability problem, but it is showing up too visibly in the user-facing workflow. The cost is cumulative: before work starts, the system may do memory trigger checks, skill routing, spec-folder checks, and then additional validation. The external repo demonstrates that more of this can be implicit. `skill_advisor.py` does not need to disappear, but it should become a hidden implementation detail or a fallback, not a user-visible mandatory ritual on most substantive turns.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Run explicit skill routing as a mandatory gate for non-trivial work.
- **External repo's approach:** Let commands, docs, and hook behavior carry more of the capability selection burden.
- **Why the external approach might be better:** It reduces startup ceremony and keeps the user closer to the work they actually asked for.
- **Why system-spec-kit's approach might still be correct:** Hidden routing still needs the same knowledge somewhere, and explicit routing is easier to debug.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Keep skill routing internally, but make it implicit by default and reserve explicit `skill_advisor.py` runs for ambiguous, maintenance, or debugging scenarios.
- **Blast radius of the change:** medium
- **Migration path:** First relax the "must announce and cite" behavior, then narrow explicit routing to high-ambiguity cases.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators and agents visibly perform a routing ceremony before real work begins.
- **External repo's equivalent surface:** Capability selection is mostly hidden inside command design and repo instruction layering.
- **Friction comparison:** The local ceremony improves traceability, but it adds delay and cognitive overhead to nearly every substantial task. The external repo is lighter because the routing mostly disappears into the system.
- **What system-spec-kit could DELETE to improve UX:** Delete the requirement that explicit skill routing must be a visible step on most non-trivial turns.
- **What system-spec-kit should ADD for better UX:** Add implicit routing and a quiet fallback path that only surfaces when confidence is low or routing is contested.
- **Net recommendation:** SIMPLIFY

## Conclusion
confidence: high

finding: `system-spec-kit` should keep skill routing as infrastructure, but stop treating explicit Gate 2 ceremony as a mandatory visible step on most non-trivial tasks.

## Adoption recommendation for system-spec-kit
- **Target file or module:** Gate 2 policy, `skill_advisor.py` invocation rules, skill-routing docs
- **Change type:** UX simplification
- **Blast radius:** medium
- **Prerequisites:** decide which scenarios still require explicit routing visibility
- **Priority:** must-have

## Counter-evidence sought
I looked for strong evidence that explicit routing itself is a user benefit rather than mostly a maintainer benefit, but the current rules emphasize compliance and traceability more than operator ergonomics. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69]

## Follow-up questions for next iteration
If Gate 2 becomes quieter, does the larger Gate 1 to Gate 3 ceremony also need a deeper redesign rather than another round of simplification?
