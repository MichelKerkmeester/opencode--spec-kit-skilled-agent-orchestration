# Iteration 028 — Gate 2 Skill Routing Ceremony Versus Automatic Routing

Date: 2026-04-10

## Research question
Is the explicit Gate 2 `skill_advisor.py` ritual the right operator experience, or should skill routing become mostly automatic and hidden?

## Hypothesis
It should become mostly automatic. Gate 2 is important as a routing policy, but exposing it as a visible ceremony makes users and agents think about internals that could be enforced silently.

## Method
I compared Gate 2's written contract, the advisor script's stated role, and skill-loading mechanics with the external repo's contributor flow.

## Evidence
- AGENTS requires Gate 2 on non-trivial tasks and explicitly says to run `python3 .opencode/skill/scripts/skill_advisor.py "[request]" --threshold 0.8`. [SOURCE: AGENTS.md:175-179]
- `CLAUDE.md` repeats the same Gate 2 requirement and threshold. [SOURCE: CLAUDE.md:123-130]
- The skill advisor script identifies itself as the mechanism used by Gate 2 for skill routing. [SOURCE: .opencode/skill/scripts/skill_advisor.py:8-10]
- The script also codifies a stricter routing threshold than Gate 1 readiness. [SOURCE: .opencode/skill/scripts/skill_advisor.py:1252-1253]
- Public's skill model expects explicit activation and resource-loading behavior after routing. [SOURCE: AGENTS.md:328-341]
- Agent Lightning's contributor guidance does not expose a comparable routing ceremony before ordinary work; contributors read the repo rules and proceed with normal commands, docs, and examples. [SOURCE: external/AGENTS.md:3-16]

## Analysis
Gate 2 solves a real problem: making sure specialized guidance is loaded when it matters. But nothing about that requires it to feel like a ritual. The current surface forces internal routing machinery into the operator and agent narrative. That adds ceremony, duplicates explanation across governing docs, and makes simple tasks feel more process-heavy than they need to.

The better model is automatic routing with an inspectable trace. If the system silently loads the right skill pack and only surfaces a message when routing is ambiguous, conflicting, or user-overridden, then the benefit survives while the ceremony disappears.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep skill routing as policy but make it mostly implicit, surfacing Gate 2 details only for ambiguity, conflict resolution, or audit/debug views.

## Adoption recommendation for system-spec-kit
- **Target file or module:** Gate 2 and skill-routing UX
- **Change type:** UX simplification
- **Blast radius:** large
- **Prerequisites:** define silent-routing audit output, conflict escalation conditions, and user override syntax
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Non-trivial work carries an explicit Gate 2 ritual: run the advisor, cite the result, load the skill, and continue.
- **External repo's equivalent surface:** Operators are not asked to perform a routing ceremony; docs and examples implicitly guide them to the right workflow.
- **Friction comparison:** Public's explicit routing contract increases startup overhead and process anxiety. Agent Lightning keeps internal workflow selection largely out of the user's way.
- **What system-spec-kit could DELETE to improve UX:** Delete the default requirement to visibly announce or reenact Gate 2 on routine work.
- **What system-spec-kit should ADD for better UX:** Add a hidden routing trace or "why this skill loaded" debug view that is available on demand instead of always surfaced.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for evidence that explicit Gate 2 visibility is itself a user-facing feature, but the stronger need is auditability and correctness, not ceremony. Those are better served by optional transparency than by mandatory ritual.

## Follow-up questions for next iteration
- What is the smallest visible form of Gate 2 that still preserves debuggability?
- Should explicit skill naming always override automatic routing?
- How can Public keep routing trustworthy without making users learn the router?
