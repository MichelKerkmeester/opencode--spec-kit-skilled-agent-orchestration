# Iteration 027 — Make Skill Routing Implicit And Demote Niche Skills To Opt-In

Date: 2026-04-10

## Research question
Is Gate 2 skill routing, especially via `skill_advisor.py`, too ceremonial for common work, and are niche skills like `sk-improve-prompt` and `sk-improve-agent` too visible by default?

## Hypothesis
Mostly yes. The routing engine is valuable, but it should feel implicit. The niche specialist skills are legitimate capabilities, yet they should behave like advanced opt-in tools rather than part of the core everyday mental model.

## Method
I compared the local gate-and-routing language with the external repo's lighter public capability packaging, then examined whether niche skills appear central or peripheral in practice.

## Evidence
- `[SOURCE: AGENTS.md:159-177]` Gate 1 and Gate 2 are both positioned as mandatory pre-execution gates, adding visible setup ceremony before substantive work.
- `[SOURCE: AGENTS.md:169-176]` Gate 2 requires running `skill_advisor.py` for non-trivial tasks and explicitly reporting the routing result.
- `[SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16]` The advisor is a dedicated routing engine with thresholding, filtering, and diagnostic modes.
- `[SOURCE: .opencode/skill/scripts/skill_advisor.py:83-104]` The advisor maintains a broad synonym-expansion layer to map user phrasing into skill concepts.
- `[SOURCE: .opencode/skill/scripts/skill_advisor.py:211-259]` It also maintains intent boosters and direct skill mappings, which confirms substantial routing machinery behind a simple operator action.
- `[SOURCE: .opencode/skill/sk-improve-prompt/SKILL.md:12-15]` `sk-improve-prompt` is a specialized prompt-enhancement capability, not a daily-core execution workflow.
- `[SOURCE: .opencode/skill/sk-improve-agent/SKILL.md:17-20]` `sk-improve-agent` is a bounded evaluator-first workflow for targeted agent improvement, clearly a specialist mode.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:140-146]` The external repo inherits standards and patterns behind the scenes instead of exposing a similarly explicit routing ceremony at the operator boundary.

## Analysis
The advisor is not the problem. The public ritual around the advisor is the problem. Routing logic belongs in the control plane; it does not need to feel like a user-facing checkpoint every time meaningful work begins. The external repo is lighter partly because more capability selection is embedded rather than announced.

The same principle applies to niche skills. `sk-improve-prompt` and `sk-improve-agent` are real capabilities, but they are specialized enough that they should not shape the default mental model of how normal implementation work begins. They belong in an advanced catalog or explicit opt-in path.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep skill routing and niche skills, but make routing implicit and move specialist skills to an advanced opt-in layer instead of presenting them as part of the default everyday surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/skill/scripts/skill_advisor.py`, `.opencode/skill/sk-improve-prompt/SKILL.md`, `.opencode/skill/sk-improve-agent/SKILL.md`
- **Change type:** nice-to-have
- **Blast radius:** operator-surface
- **Prerequisites:** define the default skill set versus advanced skill catalog
- **Priority:** nice-to-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Skill routing is treated as an explicit visible gate, and specialist skills live in the same broad conceptual universe as core workflows.
- **External repo's equivalent surface:** Capability selection is more implicit and less ceremonial at the operator layer.
- **Friction comparison:** The local system has stronger routing accountability, but higher ceremony. The external repo sacrifices some explicitness for a lighter start-up experience.
- **What system-spec-kit could DELETE to improve UX:** Delete the requirement that normal operator interactions must conceptually care about the routing engine.
- **What system-spec-kit should ADD for better UX:** Add an advanced-skill catalog framing so niche skills feel discoverable without polluting the default path.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for evidence that operators need routine visibility into the routing engine and niche skill inventory to trust the system. I did not find that in the external repo's surface design.

## Follow-up questions for next iteration
- Which skills belong in the always-visible core set?
- Can routing remain fully auditable for maintainers while disappearing from normal command prose?
- Should specialist skills move into explicit "advanced workflows" documentation?
