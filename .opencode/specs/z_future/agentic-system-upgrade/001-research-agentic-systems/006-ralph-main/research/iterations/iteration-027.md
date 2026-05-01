# Iteration 027 — Skills System Fragmentation and Routing Overhead

## Research question
Is `system-spec-kit`'s skill system too fragmented, and is Gate 2 plus `skill_advisor.py` adding too much ceremony compared with Ralph's much smaller packaging model?

## Hypothesis
The repo has legitimate specialized knowledge, but too much of that specialization is surfaced as mandatory routing ceremony instead of internal packaging.

## Method
Compared Ralph's two-skill plugin surface with `system-spec-kit`'s broader skill inventory and the mandatory Gate 2 routing contract, including `skill_advisor.py` and skill-loading expectations.

## Evidence
- Ralph's plugin packages only the two key capabilities the operator needs to understand: PRD creation and the Ralph execution loop. [SOURCE: external/.claude-plugin/plugin.json:2-9] [SOURCE: external/skills/prd/SKILL.md:15-20] [SOURCE: external/skills/ralph/SKILL.md:46-64]
- `system-spec-kit` exposes a much larger skill catalog, including system-spec-kit, deep research, deep review, multiple code skills, documentation, git, prompt improvement, agent improvement, and MCP helpers. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-617]
- Gate 2 is formalized through `skill_advisor.py`, which relies on synonym matching, intent boosters, and explicit invocation thresholds before non-trivial work. [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16] [SOURCE: .opencode/skill/scripts/skill_advisor.py:83-260]

## Analysis
The skill system is doing two different jobs: packaging reusable expertise and forcing operator-visible routing decisions. Ralph shows that these do not have to be the same thing. The repo can keep specialized knowledge bundles while collapsing the front-door UX into a smaller capability map. Mandatory, explicit skill routing for most non-trivial work feels ceremonial when the primary user need is simply "help me code," "help me review," or "help me document."

## Conclusion
confidence: medium

finding: `system-spec-kit` should simplify skill routing so capability bundles remain available, but the operator no longer pays heavy Gate 2 ceremony for common tasks.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/scripts/skill_advisor.py`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define which tasks still require explicit skill routing versus implicit default bundles
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Non-trivial work routes through a mandatory skill recommendation step, then asks the operator or agent to load one or more `SKILL.md` entrypoints.
- **External repo's equivalent surface:** Ralph keeps capability packaging very small and teaches the workflow directly through the plugin and README.
- **Friction comparison:** `system-spec-kit` adds more ceremony and terminology before action begins. Ralph keeps skills as support structure, not as a visible preflight ritual.
- **What system-spec-kit could DELETE to improve UX:** Delete mandatory operator-visible Gate 2 skill routing for common implementation, review, and documentation paths.
- **What system-spec-kit should ADD for better UX:** Add a smaller capability map that treats skills as internal bundles selected by default unless the task clearly needs a specialized mode.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for proof that the current skill surface is already experienced as mostly internal, but the governing docs still make Gate 2 a required visible step for non-trivial work. [SOURCE: CLAUDE.md:130-177] [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16]

## Follow-up questions for next iteration
- If skills become less ceremonial, should the multiple code-standard skills collapse behind one front door instead of remaining peer operator concepts?
