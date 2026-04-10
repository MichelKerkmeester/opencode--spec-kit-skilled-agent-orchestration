# Iteration 029 — Automation, Gates, Hooks, and Behavioral Surface

## Research question
Does Ralph achieve acceptable autonomous behavior with meaningfully less gate and rule machinery, and does that mean `system-spec-kit` should redesign its operator-facing automation contract?

## Hypothesis
The biggest remaining UX burden is not any single command or skill, but the amount of visible machinery around Gate 1 -> Gate 2 -> Gate 3, hooks, constitutional files, and the size of the master behavioral specification.

## Method
Compared Ralph's behavioral surface area with `system-spec-kit`'s gate docs, hook docs, startup/stop hooks, and the operational span inside the main system skill.

## Evidence
- Ralph's operator contract is short and tightly coupled to one workflow loop. Its README, prompt, and AGENTS guidance stay focused on a small set of runtime rules. [SOURCE: external/README.md:88-145] [SOURCE: external/prompt.md:7-17] [SOURCE: external/AGENTS.md:42-47]
- `system-spec-kit` formalizes three gates, multiple constitutional files, hook fallback rules, a large feature-flag table, and a wide set of mandatory or "always/never" behaviors. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-87] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:35-55] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:650-710] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:812-842]
- Session hooks add real value for continuity, but they also show that much of the gate-and-recovery machinery can already run implicitly. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:5-30] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js:83-168] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:154-234]

## Analysis
Ralph demonstrates that autonomous behavior can feel coherent with a much smaller visible rule surface when the workflow class is narrow. `system-spec-kit` needs more safeguards because it serves a broader class of work, but that does not require every safeguard to remain operator-visible. The UX redesign opportunity is to keep the machinery while hiding more of it behind defaults. Gate 3 remains a legitimate hard ask for file modifications; Gate 1 and much of Gate 2 should behave more like internal heuristics or escalation paths, not like ceremony every operator has to reason about.

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign its operator-facing automation contract around one hard ask and one fast default path, instead of foregrounding the full Gate 1 -> Gate 2 -> Gate 3 ceremony.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define which gates stay explicit, which become internal heuristics, and how escalation still works when uncertainty rises
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators face a layered system of gates, constitutional rules, fallback flows, hooks, validation rules, and large behavioral docs.
- **External repo's equivalent surface:** Ralph keeps a short operational contract and relies on a small loop plus project-native verification.
- **Friction comparison:** `system-spec-kit` creates more trust and governance, but the visible ceremony is much heavier. Ralph's surface is easier to learn because it presents fewer explicit abstractions.
- **What system-spec-kit could DELETE to improve UX:** Delete operator-visible Gate 1 and default Gate 2 ceremony from the common path while preserving their logic internally.
- **What system-spec-kit should ADD for better UX:** Add a fast-default operator contract that only interrupts with explicit questions when scope, risk, or uncertainty actually demand it.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for proof that the full gate sequence must remain explicitly user-visible to preserve correctness, but the hook system already shows that some of this machinery can execute implicitly without operator burden. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:5-30] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js:83-168]

## Follow-up questions for next iteration
- What does the total end-to-end operator friction look like if we compare a common feature workflow in both systems step by step?
