# Iteration 027 — Demote Mandatory Gate 2 Ceremony

Date: 2026-04-10

## Research question
Is mandatory Gate 2 skill routing via `skill_advisor.py` adding too much ceremony to normal work, and should it become an internal heuristic rather than a user-visible ritual?

## Hypothesis
The skill advisor is useful as internal routing infrastructure, but requiring it as an explicit front-door step slows simple and medium-complexity work more than it helps operators.

## Method
Reviewed the Gate 2 contracts in `AGENTS.md` and `CLAUDE.md`, the skill advisor's threshold design, and representative specialist skill surfaces, then compared them with Relay's natural-language and command-first routing.

## Evidence
- Both `AGENTS.md` and `CLAUDE.md` require Gate 2 for non-trivial tasks, explicitly instructing the agent to run `python3 .opencode/skill/scripts/skill_advisor.py ... --threshold 0.8`. [SOURCE: AGENTS.md:174-179] [SOURCE: CLAUDE.md:122-127]
- The skill advisor is itself a substantial routing system, with synonym expansion, intent boosters, and threshold logic designed around confidence scoring. [SOURCE: .opencode/skill/scripts/skill_advisor.py:6-17] [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-80] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-219]
- Public also carries specialist skills whose value is real but long-tail, including prompt improvement and bounded agent-improvement loops. [SOURCE: .opencode/skill/sk-prompt-improver/SKILL.md:10-38] [SOURCE: .opencode/skill/sk-agent-improver/SKILL.md:17-47]
- Relay's plugin instead lets the operator use three commands or natural language and routes the rest internally to skills, agent definitions, and MCP tools. [SOURCE: external/docs/plugin-claude-code.md:27-87]
- Relay's workflow surfaces likewise begin with one workflow runner or builder instead of a mandatory pre-routing ritual. [SOURCE: external/packages/sdk/src/workflows/README.md:1-27] [SOURCE: external/packages/sdk/README.md:13-31]

## Analysis
Public's Gate 2 discipline is defensible for consistency and tool selection, especially in a repo with many local skills. The UX downside is that routing becomes part of the visible product. Relay demonstrates a gentler pattern: let routing happen, but keep the user focused on outcome and mode, not on the router. Public should retain advisor logic but stop foregrounding it as a required ceremony except in ambiguous or advanced cases.

## Conclusion
confidence: high
finding: Public should demote mandatory Gate 2 skill routing from the operator-facing flow and treat `skill_advisor.py` as internal infrastructure or an ambiguity-resolution fallback.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `CLAUDE.md`, skill onboarding docs, routing prompts
- **Change type:** gate UX simplification
- **Blast radius:** high
- **Prerequisites:** define when the advisor still surfaces explicitly, such as low-confidence routing or power-user inspection
- **Priority:** must-have (adopt now)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Gate 2 is a mandatory named step, and the operator can feel the router before the work even starts.
- **External repo's equivalent surface:** Relay lets users speak in tasks and modes while routing stays mostly invisible.
- **Friction comparison:** Public adds more setup ceremony and vocabulary. Relay reduces friction by making intent the front door and keeping routing as implementation detail.
- **What system-spec-kit could DELETE to improve UX:** Delete the requirement to present Gate 2 and explicit skill-routing compliance as a front-door ritual for ordinary work.
- **What system-spec-kit should ADD for better UX:** Add quieter automatic routing with explicit surfacing only on ambiguity, conflict, or expert inspection requests.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
Looked for cases where Relay forces an explicit routing confirmation before coordination begins; the plugin and SDK docs instead emphasize direct intent and mode selection.

## Follow-up questions for next iteration
- Which classes of tasks genuinely benefit from explicit advisor surfacing?
- Can routing confidence be logged without being taught as a user-facing gate?
- Should specialist skills be grouped into "automatic", "power-user", and "internal" tiers?
