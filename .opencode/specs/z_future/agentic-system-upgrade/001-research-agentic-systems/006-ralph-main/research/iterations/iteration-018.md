# Iteration 018 — Runtime-Aware Task Sizing Beats Dogma

## Research question
Does Ralph actually prove that all autonomous work must fit one strict context window, or does the repo's Amp auto-handoff guidance point to a more runtime-aware sizing rule?

## Hypothesis
The durable lesson is "one independently verifiable unit per run," not a literal universal context-window cap across every tool/runtime.

## Method
Compared Ralph's hard story-sizing language in the skills with the README's Amp auto-handoff recommendation, then mapped that tension onto `system-spec-kit`'s current broad task guidance.

## Evidence
- Ralph's converter skill says every story must be completable in one iteration and warns that oversized stories produce broken code. [SOURCE: external/skills/ralph/SKILL.md:46-64]
- The PRD skill similarly asks for stories small enough to implement in one focused session. [SOURCE: external/skills/prd/SKILL.md:69-92]
- But the README also recommends enabling Amp auto-handoff so Ralph can handle large stories that exceed a single context window. [SOURCE: external/README.md:76-86]
- `system-spec-kit`'s current task guidance still stops at task breakdown, dependencies, and effort estimates, which leaves execution-size rules under-specified. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:117-123] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:35-71]

## Analysis
This is a useful correction to Phase 1. Ralph's repo messaging is slightly self-contradictory: the skills insist on one-window sizing, yet the README offers runtime-level handoff support as an escape hatch. The underlying principle is still valid, but it is narrower than Phase 1 first suggested. The stable rule is not "always one context window." It is "one independently verifiable unit, with sizing chosen for the weakest runtime or explicit handoff behavior available."

## Conclusion
confidence: high

finding: `system-spec-kit` should adopt runtime-aware task sizing language: every autonomous run should complete one independently verifiable unit, and task granularity should be chosen based on the weakest runtime's safe handoff behavior rather than a dogmatic universal context-window rule.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** align `/spec_kit:implement` and task templates with the refined rule
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Task guidance is broad and does not yet state a runtime-aware execution grain rule. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:117-123]
- **External repo's approach:** Ralph strongly prefers one-iteration stories, but its README acknowledges runtime-level auto-handoff as a practical exception. [SOURCE: external/skills/ralph/SKILL.md:46-64] [SOURCE: external/README.md:76-86]
- **Why the external approach might be better:** It keeps the focus on independently verifiable units rather than abstract effort estimates. [SOURCE: external/prd.json.example:5-17]
- **Why system-spec-kit's approach might still be correct:** A broader workflow system may need flexibility across runtimes and task shapes that Ralph does not document deeply. [SOURCE: .opencode/command/spec_kit/implement.md:171-187]
- **Verdict:** KEEP
- **Blast radius of the change:** medium
- **Migration path:** Replace "one context window" wording with "one independently verifiable unit per autonomous run, sized for the weakest supported runtime."

## Counter-evidence sought
I looked for a cleaner, fully consistent rule in the Ralph repo and found the opposite: the skills and README pull in slightly different directions, which makes the deeper principle more useful than the literal wording. [SOURCE: external/skills/ralph/SKILL.md:46-64] [SOURCE: external/README.md:76-86]

## Follow-up questions for next iteration
- If the loop rules need clearer explanation, does the Ralph flowchart point to a documentation UX improvement that `system-spec-kit` lacks?
- Could a two-lane architecture make runtime-specific expectations easier to explain?
- Which final recommendation best captures the difference between lightweight loops and the full governed stack?
