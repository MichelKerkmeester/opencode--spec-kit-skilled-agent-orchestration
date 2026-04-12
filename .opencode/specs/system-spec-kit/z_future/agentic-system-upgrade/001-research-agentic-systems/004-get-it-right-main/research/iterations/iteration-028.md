# Iteration 028 — Keep Narrow Improvement Skills, But Stop Letting Their Existence Justify More Default Ceremony

Date: 2026-04-10

## Research question
Are narrow skills like `sk-improve-prompt` and `sk-improve-agent` dead weight that should be removed, or are they valid specialist islands that only become a UX problem when the whole system routes too ceremonially by default?

## Hypothesis
They should stay. The real UX problem is not that these specialist skills exist, but that the broader routing and command ceremony makes every skill feel equally central.

## Method
I compared the specialist skill contracts and their dedicated command wrappers against the broader skill-routing system to separate "niche but justified" from "unnecessarily exposed."

## Evidence
- [SOURCE: .opencode/skill/sk-improve-prompt/SKILL.md:19-47] `sk-improve-prompt` has a narrow, legitimate domain: structured prompt enhancement using explicit frameworks and scoring.
- [SOURCE: .opencode/skill/sk-improve-agent/SKILL.md:24-56] `sk-improve-agent` also has a narrow but real use case: bounded agent improvement with evidence gates and rollback discipline.
- [SOURCE: .opencode/command/improve/prompt.md:61-149] The prompt improver already sits behind a dedicated command surface with its own setup flow.
- [SOURCE: .opencode/command/improve/agent.md:61-151] The agent improver likewise lives behind a dedicated command and narrow setup contract.
- [SOURCE: .opencode/skill/README.md:42-46] The broader skills system presents all skills as discoverable on-demand capabilities.
- [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16] Gate 2 routes non-trivial requests through a confidence-thresholded advisor.
- [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-217] The advisor has a generalized confidence model intended to apply broadly.
- [SOURCE: .opencode/skill/scripts/skill_advisor.py:259-283] It also contains strong direct boosters for deep-research, deep-review, agent-improvement, and related specialist loops.

## Analysis
The presence of specialist skills is not, by itself, a UX smell. `sk-improve-prompt` and `sk-improve-agent` correspond to real, bounded operator intents and already live behind dedicated commands. Deleting them would sacrifice valuable niche workflows for little gain. The real issue is that the system's default routing and documentation posture can make specialist islands feel like part of the everyday baseline. The external repo's lesson is to keep specialized mechanisms available without making them part of the default mental model. In other words: keep the skills, shrink their ambient prominence.

## Conclusion
confidence: medium
finding: do not delete narrow improvement skills; keep them as explicit opt-in specialist workflows and reduce how much the default system posture implies they matter for ordinary work.

## Adoption recommendation for system-spec-kit
- **Target file or module:** skill catalog wording, Gate 2 policy, and improve-command docs
- **Change type:** rejected deletion proposal
- **Blast radius:** low
- **Prerequisites:** none beyond clearer public positioning
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** niche skills exist beside broader foundational skills and appear in the same overall skills inventory.
- **External repo's approach:** specialized behavior is present only when the workflow calls for it; it does not crowd the default operator story.
- **Why the external approach might be better:** it keeps niche power available without making the system feel overbuilt for normal tasks.
- **Why system-spec-kit's approach might still be correct:** some operators genuinely need these bounded improvement loops, and their dedicated commands already provide natural containment.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep the skills, but frame them as specialist command-led islands rather than core default surfaces.
- **Blast radius of the change:** docs, onboarding language, and perhaps advisor explanation text.
- **Migration path:** no architectural deletion; just reposition the skills in docs and default routing rhetoric.

## UX / System Design Analysis

- **Current system-spec-kit surface:** niche skills appear in the same large skill universe as foundational capabilities, which can make the system feel more fragmented than everyday use actually is.
- **External repo's equivalent surface:** specialized logic exists only in service of the main workflow and is not foregrounded as a broad menu.
- **Friction comparison:** the existence of niche skills adds little direct friction, but their equal visibility contributes to an "everything is a subsystem" feeling.
- **What system-spec-kit could DELETE to improve UX:** the instinct to treat these niche skills as part of the default operator journey.
- **What system-spec-kit should ADD for better UX:** clearer "advanced workflow" grouping so specialist skills read as optional expert tools.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for evidence that these skills are accidental duplicates of other flows. Their SKILL files and dedicated commands suggest the opposite: they are bounded specialist workflows with their own legitimate use cases.

## Follow-up questions for next iteration
- Should Gate 2 distinguish foundational versus specialist skills in its user-facing explanations?
- Would a grouped skills catalog reduce the sense of fragmentation without deleting capabilities?
- Which docs currently over-promote niche skills in everyday workflows?
