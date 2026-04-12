# Iteration 028 - Redesign Gate Ceremony Around Runtime Enforcement

## Research question
Does the full Gate 1 -> Gate 2 -> Gate 3 workflow plus large constitutional instruction surface still represent the right balance of safety and autonomy, or has the operator experience become over-ceremonial compared with the external repo?

## Hypothesis
The local repo will still need stronger governance than the external starter kit, but the external repo will show that more deterministic policy should move into runtime and hook layers so the operator brief can become much shorter.

## Method
Compared the local root instruction stack, constitutional gate files, and hook settings to the external repo's CLAUDE-plus-hooks model.

## Evidence
- The local root behavioral spec is extensive and includes gate logic, routing rules, completion rules, memory rules, and operational anti-pattern detection. [SOURCE: CLAUDE.md:7-19] [SOURCE: CLAUDE.md:107-165] [SOURCE: CLAUDE.md:181-196]
- Constitutional files further spell out gate routing and enforcement semantics, including mandatory steps and violation recovery. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-47] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:74-102]
- The local Claude settings already use hooks for session-prime and session-stop, which means part of the behavioral contract has executable runtime support. [SOURCE: .claude/settings.local.json:1-52]
- The external repo pushes more deterministic behavior into settings and hooks while keeping CLAUDE instructions comparatively lighter and more task-oriented. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/settings.json:1-39] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-72]

## Analysis
This is the strongest Phase 3 signal. The local system asks the operator and agent to carry too much policy in prose and ceremony. Gates exist for good reasons, but their current form makes safe behavior feel like a long preamble instead of a natural part of execution. The external repo shows a cleaner split: keep the written instructions focused on durable principles, and move deterministic, testable behavior into hooks, settings, manifests, and runtime logic. This is bigger than simplification. It is a UX redesign.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Express a large amount of runtime behavior as explicit gate prose plus enforcement guidance.
- **External repo's approach:** Keep a lighter operator brief and push more deterministic policy into executable settings and hooks.
- **Why the external approach might be better:** It lowers operator cognitive load while improving consistency because more rules are enforced mechanically.
- **Why system-spec-kit's approach might still be correct:** Some cross-runtime behaviors and high-context exceptions still need a written constitutional layer.
- **Verdict:** REDESIGN
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Shrink the root operator surface to principles, escalation rules, and exceptions; move the rest into executable policy layers and generated guidance.
- **Blast radius of the change:** large
- **Migration path:** First inventory which gates are deterministic, then migrate those into hooks or runtime policy before rewriting the root instruction surface.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators encounter a long master spec, multiple gate concepts, enforcement files, and visible ceremony before work starts.
- **External repo's equivalent surface:** Operators get a shorter working brief supported by hooks and settings that quietly enforce routine behavior.
- **Friction comparison:** The local system currently asks more reading, more ceremony, and more conceptual bookkeeping. The external repo is materially lighter because it trusts automation to carry more of the policy load.
- **What system-spec-kit could DELETE to improve UX:** Delete deterministic gate steps from the operator-facing ceremony wherever runtime enforcement can guarantee the same outcome.
- **What system-spec-kit should ADD for better UX:** Add more executable policy, generated guidance, and runtime-native enforcement so the written brief can stay short.
- **Net recommendation:** REDESIGN

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign its operator experience by moving deterministic gate behavior out of visible ceremony and into runtime enforcement, leaving the root brief focused on principles and exceptions.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`, constitutional gate files, hook/config policy layers
- **Change type:** architecture and UX redesign
- **Blast radius:** large
- **Prerequisites:** classify which policies are deterministic, which are advisory, and which truly require human-visible escalation
- **Priority:** must-have

## Counter-evidence sought
I looked for evidence that the current ceremony is necessary to achieve the local safety bar, but the existing hook support already shows that some of the burden can move into runtime. [SOURCE: .claude/settings.local.json:1-52]

## Follow-up questions for next iteration
If gate ceremony is redesigned, what should the new single guided entry point look like for everyday feature work?
