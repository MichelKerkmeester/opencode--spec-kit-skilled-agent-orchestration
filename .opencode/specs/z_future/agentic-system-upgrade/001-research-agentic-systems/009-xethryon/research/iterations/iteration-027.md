# Iteration 027 — Gate 2 Should Become Silent Routing, Not A User-Facing Ceremony

Date: 2026-04-10

## Research question
Is Gate 2's explicit `skill_advisor.py` workflow the right UX for skill routing, or has it become operator-facing ceremony?

## Hypothesis
It has become ceremony. The routing decision is useful, but the explicit advisor step should be hidden unless ambiguity is high or the user asks to inspect it.

## Method
I compared the local Gate 2 contract and `skill_advisor.py` implementation with Xethryon's runtime skill exposure and autonomous invocation model.

## Evidence
- Gate 2 requires running `skill_advisor.py` and promotes confidence-threshold routing as a formal step in non-trivial tasks. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-68] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:33-55]
- `skill_advisor.py` is a substantial routing engine with stop-word filtering, synonym expansion, and intent boosters, which signals that the system is solving a real problem but through an exposed operational step. [SOURCE: .opencode/skill/scripts/skill_advisor.py:6-16] [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-81] [SOURCE: .opencode/skill/scripts/skill_advisor.py:83-107] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-259]
- Xethryon's session system simply makes skills available in the prompt, and the autonomy layer can call `invoke_skill` inside the same turn. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:66-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:28-41] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:80-90]
- Xethryon's model is too autonomous for Spec Kit, but it proves the user does not need to watch the routing machinery happen in order for routing to work. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:42-76]

## Analysis
This is the clearest Phase 3 UX finding. `system-spec-kit` is correct to route into skills. It is not correct to make the operator experience that routing as an explicit preflight ceremony in routine work. The current model turns internal control logic into user-visible process. Xethryon goes too far in the other direction by making invocation autonomous, but it demonstrates the right UX principle: routing can be mostly invisible.

The safest redesign is a silent default: route automatically, surface the chosen skill only when the user asked for it, when confidence is low, or when multiple materially different paths exist.

## UX / System Design Analysis

- **Current system-spec-kit surface:** non-trivial tasks explicitly run through a visible advisor-and-threshold step.
- **External repo's equivalent surface:** skills are part of the runtime capability environment and can be invoked without a separate visible planning ritual.
- **Friction comparison:** `system-spec-kit` imposes extra operator-visible steps before real work starts; Xethryon keeps that choice inside the runtime, though with too much autonomy.
- **What system-spec-kit could DELETE to improve UX:** the routine requirement that users experience skill routing as a visible ceremony.
- **What system-spec-kit should ADD for better UX:** silent routing by default plus an inspectable "why this skill" explanation only on ambiguity or request.
- **Net recommendation:** REDESIGN

## Conclusion
confidence: high

finding: redesign Gate 2 so skill routing is silent by default. Keep the routing engine, but stop making the operator watch it happen on normal tasks.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit advisor invocation and threshold-based routing in the visible workflow.
- **External repo's approach:** hidden skill availability and invocation inside the session/runtime surface.
- **Why the external approach might be better:** lower startup friction and fewer ceremonial steps.
- **Why system-spec-kit's approach might still be correct:** explicit routing traces are useful for debugging, safety, and ambiguous tasks.
- **Verdict:** REDESIGN
- **If REDESIGN — concrete proposal:** run advisor heuristics automatically, emit routing rationale only when confidence is low, options diverge, or the user explicitly asks.
- **Blast radius of the change:** high
- **Migration path:** start by changing defaults and output policy before replacing the underlying advisor engine.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/scripts/skill_advisor.py`
- **Change type:** modified existing
- **Blast radius:** high
- **Prerequisites:** define low-confidence thresholds, ambiguity policy, and a user-visible explanation fallback
- **Priority:** must-have

## Counter-evidence sought
I looked for a strong reason to keep visible Gate 2 as a first-class ritual. The strongest reason was auditability, but that can be preserved in logs or optional rationale output without burdening ordinary interactions.

## Follow-up questions for next iteration
- If Gate 2 becomes quieter, what else in the overall automation/gate surface should become less exposed?
