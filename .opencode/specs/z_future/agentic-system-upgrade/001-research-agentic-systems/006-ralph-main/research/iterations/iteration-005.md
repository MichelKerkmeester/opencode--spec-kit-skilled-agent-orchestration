# Iteration 005 — One-Window Story Sizing

## Research question
How does Ralph's PRD-to-JSON decomposition enforce one-context-window task sizing, and where should `system-spec-kit` codify equivalent rules?

## Hypothesis
Ralph succeeds because its PRD format encodes small, dependency-ordered, verifiable stories before the loop ever starts.

## Method
Read `external/skills/ralph/SKILL.md`, `external/skills/prd/SKILL.md`, and `external/prd.json.example`, then compared those rules to `system-spec-kit`'s level guidance, tasks template, and implementation workflow.

## Evidence
- Ralph's converter skill says each story must be completable in one iteration, gives concrete examples of right-sized versus oversized work, and makes dependency-first ordering explicit. [SOURCE: external/skills/ralph/SKILL.md:46-76]
- Ralph requires verifiable acceptance criteria and mandates `"Typecheck passes"` for every story plus browser verification for UI work. [SOURCE: external/skills/ralph/SKILL.md:83-116] [SOURCE: external/skills/ralph/SKILL.md:119-126]
- The PRD generator reinforces the same pattern: user stories must be small enough for one focused session and must use concrete, testable acceptance criteria. [SOURCE: external/skills/prd/SKILL.md:69-92]
- The example `prd.json` shows the resulting state machine clearly: priority-ordered stories, each with explicit acceptance criteria and a `passes` boolean. [SOURCE: external/prd.json.example:1-17] [SOURCE: external/prd.json.example:19-31]
- `system-spec-kit`'s current level guidance requires tasks and estimated effort, but it does not explicitly say "one context window" or "one autonomous execution unit." [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:91-123]
- The Level 3 `tasks.md` template is phase-oriented and generic; it lacks story-sizing heuristics and concrete verification clauses per task. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:20-30] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:34-71]
- The implementation workflow assumes an existing plan and tasks breakdown, but its step list does not enforce Ralph-style single-unit sizing before development begins. [SOURCE: .opencode/command/spec_kit/implement.md:171-201]

## Analysis
Ralph keeps the loop simple because the planning layer does the hard work up front: story size, ordering, and verifiability are all encoded into `prd.json`. `system-spec-kit` has stronger documentation machinery, but its task guidance is still broad enough that one task can secretly hide several context windows of work. That makes autonomous execution harder to recover, harder to validate, and harder to parallelize safely.

## Conclusion
confidence: high

finding: The highest-value Ralph pattern is not the shell loop; it is the planning discipline that turns broad work into one-window, dependency-safe, verifiable units. `system-spec-kit` should encode that rule directly into its level guidance and task templates so implementation packets become execution-ready rather than merely documented.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** align the wording with `tasks.md` templates and `/spec_kit:implement`
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing "one focused session" or "one execution unit" rule in the current task guidance and did not find one; the present requirements stop at task breakdown and effort estimation. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:117-123]

## Follow-up questions for next iteration
- If task sizing is fixed, does `system-spec-kit` still need a minimal orchestration wrapper like Ralph's Bash loop?
- Which parts of Ralph's runtime are worth copying after the planning discipline is in place?
- Should single-task focus be enforced in the implementation command as well as the templates?
