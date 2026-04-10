# Iteration 028 — Demote Gate 2 To Fallback Routing

Date: 2026-04-10

## Research question
Is mandatory `skill_advisor.py` execution on every non-trivial task the right UX, or is it overhead once the user's path is already obvious?

## Hypothesis
Babysitter will suggest that explicit mode/command selection can carry most of the routing burden, making heavyweight skill advising necessary only when intent is ambiguous or the agent is operating without a clear surface.

## Method
I compared Spec Kit's Gate 2 contract and `skill_advisor.py` routing complexity with Babysitter's direct command-to-skill flow.

## Evidence
- AGENTS currently makes Gate 2 mandatory for non-trivial tasks: run `skill_advisor.py`, apply the confidence threshold, and treat confidence >= 0.8 as a must-invoke route. [SOURCE: AGENTS.md:174-179]
- `skill_advisor.py` is a substantial routing system with stop words, synonym expansion, intent boosters, and threshold logic for choosing skills. [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-90] [SOURCE: .opencode/skill/scripts/skill_advisor.py:104-115] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-260]
- Babysitter's repo guidance is simpler: user requests should use the `babysit` skill. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4]
- The OpenCode `/babysitter:call` and `/babysitter:resume` commands directly invoke the babysit skill instead of invoking a routing advisor first. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/call.md:2-7] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8]
- Babysitter's slash-command UX makes the user's intent explicit through mode names such as `call`, `yolo`, `forever`, and `plan`, so routing is mostly decided before execution begins. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:11-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:41-62] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:66-88] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:127-150]

## Analysis
Gate 2 makes sense as a safety mechanism when the system has too many possible routes and the user's request is ambiguous. But once the user is already entering through a specific command surface or a clearly named workflow, mandatory advisor execution becomes ceremony rather than clarification. [SOURCE: AGENTS.md:174-179] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-260]

Babysitter shows the simpler pattern: when the surface already expresses the mode, route directly. Use discovery only when you truly need it. That lowers latency, reduces explanation overhead, and avoids making the operator watch the framework rediscover something they already told it. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/call.md:2-7] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:11-20]

So the problem is not `skill_advisor.py` itself. The problem is treating it as mandatory every time.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Every non-trivial task pays a Gate 2 routing tax, even when the command or request already makes the intended route obvious.
- **External repo's equivalent surface:** Commands directly imply the mode and skill path; discovery exists but does not interrupt ordinary flows.
- **Friction comparison:** Spec Kit adds an extra routing ceremony before work begins, while Babysitter usually lets the chosen command carry intent.
- **What system-spec-kit could DELETE to improve UX:** Delete mandatory Gate 2 execution for obvious routes such as named commands and clearly scoped lifecycle tasks.
- **What system-spec-kit should ADD for better UX:** Add a lighter decision rule: direct route when intent is explicit, `skill_advisor.py` only when intent is ambiguous or multiple routes truly compete.
- **Net recommendation:** SIMPLIFY

## Conclusion
confidence: high

finding: `system-spec-kit` should keep `skill_advisor.py`, but demote it from a mandatory operator-visible gate to a fallback router for ambiguous requests.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Mandatory up-front skill routing for non-trivial work. [SOURCE: AGENTS.md:174-179]
- **External repo's approach:** Commands and top-level repo guidance route directly to the main orchestration skill. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/call.md:2-7]
- **Why the external approach might be better:** It keeps routing invisible when user intent is already explicit.
- **Why system-spec-kit's approach might still be correct:** Ambiguous free-form requests still benefit from advisor-based routing.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Treat Gate 2 as conditional. Skip advisor runs for explicit command invocations and high-confidence direct mappings; retain it for ambiguous natural-language requests.
- **Blast radius of the change:** medium
- **Migration path:** change AGENTS/Gate 2 first, then reframe `skill_advisor.py` as advisory infrastructure rather than a mandatory ceremony.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/skill/scripts/skill_advisor.py`, command wrappers that currently restate Gate 2
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define which command surfaces count as explicit routing
- **Priority:** must-have

## Counter-evidence sought
I looked for places where Babysitter runs a separate skill-disambiguation stage before ordinary commands, but its public flow mostly lets the selected command or top-level repo rule decide the path. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/call.md:2-7] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8]

## Follow-up questions for next iteration
- If Gate 2 becomes conditional, what should become the real system authority for operator policy?
- Can AGENTS and constitutional docs be partially generated from a machine-readable policy source?
- What should a "fast path" execution profile skip by default once routing overhead is reduced?
