# Iteration 011 — Levels vs Execution Grain

## Research question
Should `system-spec-kit` pivot away from its Level 1/2/3+ spec-folder classification toward Ralph's much smaller PRD -> `prd.json` execution lifecycle?

## Hypothesis
Ralph suggests that execution grain and documentation depth are separate concerns; it does not prove that `system-spec-kit`'s level model is wrong, only that level should not be used as a proxy for autonomous run size.

## Method
Re-read Ralph's operator workflow and task-sizing rules in `external/README.md`, `external/skills/prd/SKILL.md`, and `external/skills/ralph/SKILL.md`, then compared them with `system-spec-kit`'s level model and command map in `quick_reference.md` and `level_specifications.md`.

## Evidence
- Ralph's documented lifecycle is linear and shallow: create a PRD, convert it to `prd.json`, run `ralph.sh`, and repeat until every story passes. [SOURCE: external/README.md:90-130]
- Ralph's planning discipline is about story size and verifiability, not documentation tiering: stories must fit one iteration and acceptance criteria must be checkable. [SOURCE: external/skills/ralph/SKILL.md:46-64] [SOURCE: external/skills/ralph/SKILL.md:83-116] [SOURCE: external/skills/prd/SKILL.md:69-92]
- `system-spec-kit` explicitly treats documentation level as progressive enhancement: Level 1 adds baseline docs, Level 2 adds verification, Level 3 adds architecture, and Level 3+ adds governance. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:19-26] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:60-73]
- The current level model is also phase-aware: child phases inherit the same level requirements as the parent lane rather than shrinking into a lighter execution packet. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:793-800]

## Analysis
Ralph succeeds by aggressively narrowing the execution contract, but it is solving a narrower problem than `system-spec-kit`. The external repo does not need architectural traceability, multi-session memory, or governance-heavy packets, so it never had reason to invent a level model. That is not evidence that `system-spec-kit` should throw its levels away. The stronger signal is that execution sizing should be orthogonal to documentation depth. Right now Level 1/2/3 guidance can be misread as a proxy for how much work one autonomous run should attempt, even though Ralph shows those are different decisions.

## Conclusion
confidence: medium

finding: `system-spec-kit` should KEEP the Level 1/2/3+ documentation model for governance depth, but it should stop treating level as a hidden proxy for execution grain. Ralph shows that "how much proof and architecture you need" and "how much one agent run should do" are separate axes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** align wording in `quick_reference.md`, `tasks.md`, and `/spec_kit:implement`
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Documentation level bundles scope guidance, required files, and verification expectations into one progressive hierarchy. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:60-73] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:37-50]
- **External repo's approach:** Ralph has no level hierarchy at all; it relies on one PRD workflow plus strict story sizing and verifiable criteria before execution. [SOURCE: external/README.md:90-130] [SOURCE: external/skills/prd/SKILL.md:69-92]
- **Why the external approach might be better:** It avoids conflating documentation ceremony with execution sizing, so the operator knows exactly what matters for the next loop: one small story, one set of checks, one append to progress. [SOURCE: external/skills/ralph/SKILL.md:46-64] [SOURCE: external/prompt.md:7-16]
- **Why system-spec-kit's approach might still be correct:** `system-spec-kit` has to support architectural and governance-heavy work that Ralph intentionally does not address, so a richer documentation-depth ladder still provides value. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:60-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403]
- **Verdict:** KEEP
- **Blast radius of the change:** medium
- **Migration path:** Clarify in level docs and command docs that level chooses documentation depth, while task sizing rules choose autonomous execution grain.

## Counter-evidence sought
I looked for evidence that Ralph needs level-like document escalation for complex loops and did not find it; instead, the repo keeps complexity under control by splitting stories earlier. [SOURCE: external/skills/ralph/SKILL.md:130-145]

## Follow-up questions for next iteration
- If levels stay, which subsystem should absorb the "execution bridge" responsibility that Ralph gives to `progress.txt`?
- Does `system-spec-kit` currently overload memory and handover surfaces with information that only the next iteration needs?
- Which parts of the current architecture are genuinely broader-value, and which parts are just accumulated ceremony?
