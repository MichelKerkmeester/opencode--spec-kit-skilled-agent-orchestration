# Iteration 009 — One Task Per Implementation Run

## Research question
How much of Ralph's one-story-per-iteration discipline comes from prompt wording versus PRD structure, and where should `system-spec-kit` enforce equivalent focus during implementation?

## Hypothesis
The discipline comes from both layers: the PRD restricts scope structurally, and the prompt restates the rule operationally.

## Method
Compared Ralph's execution prompt and PRD-converter rules to `system-spec-kit`'s implementation workflow and tasks template.

## Evidence
- Ralph's execution prompt is explicit: pick the highest-priority story where `passes: false`, implement that single story, run checks, commit, mark it passed, append progress, and only emit `<promise>COMPLETE</promise>` when all stories pass. [SOURCE: external/prompt.md:10-17] [SOURCE: external/prompt.md:94-108]
- Ralph's converter skill encodes the same operational constraint upstream: every story must fit in one iteration, and oversized stories must be split. [SOURCE: external/skills/ralph/SKILL.md:46-63]
- `system-spec-kit`'s implementation workflow is strong on phase ordering and completion artifacts, but Step 6 "Development" remains open-ended; it does not state a one-task-per-run execution discipline. [SOURCE: .opencode/command/spec_kit/implement.md:171-201]
- The Level 3 tasks template still groups work into broad setup, implementation, and verification phases, which makes it easy for one checklist item to mask several context windows of work. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:34-71]

## Analysis
Ralph's single-story execution rule is durable because it is duplicated on both sides of the boundary: plan format and runtime prompt. `system-spec-kit` currently has neither a hard task-size rule nor a runtime rule that says "take exactly one verified task off the board before ending this autonomous run." Without both, task lists can stay broad and implementation sessions can drift.

## Conclusion
confidence: high

finding: `system-spec-kit` should enforce single-task focus in the implementation workflow itself, not just in planning guidance. Ralph shows that structural decomposition is necessary but insufficient; the runtime must restate the rule so autonomous execution does not silently expand scope.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/implement.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** align command wording with updated task templates and checklist expectations
- **Priority:** must-have

## Counter-evidence sought
I looked for a sentence in the implementation command that limited development to one concrete task or one user story per run and did not find it. [SOURCE: .opencode/command/spec_kit/implement.md:151-207]

## Follow-up questions for next iteration
- Which Ralph patterns remain complementary rather than competitive with `system-spec-kit`'s richer workflows?
- What should the final adopt/prototype/reject split be?
- How should the final recommendations avoid overlap with the sibling deterministic-runtime research track?
