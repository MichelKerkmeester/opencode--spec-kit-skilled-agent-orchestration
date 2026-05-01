# Iteration 004 — Append-only Learning Log

## Research question
How does Ralph's append-only `progress.txt` improve iteration continuity, and what analogous artifact could `system-spec-kit` add?

## Hypothesis
The progress log is the smallest useful bridge artifact in Ralph and could improve `system-spec-kit` continuation quality if added as a compact, append-only layer rather than as a replacement for memory files.

## Method
Read the progress log instructions in `external/prompt.md` and `external/README.md`, then compared them with `system-spec-kit`'s handover workflow and template surfaces.

## Evidence
- Ralph requires every iteration to append implementation notes, changed files, and "Learnings for future iterations" to `progress.txt`. [SOURCE: external/prompt.md:18-35]
- Ralph also requires a reusable `## Codebase Patterns` section at the top of `progress.txt` for durable, non-story-specific learnings. [SOURCE: external/prompt.md:37-48]
- The README names `progress.txt` as a key file, describes it as append-only learnings for future iterations, and ties it directly to the fresh-context model. [SOURCE: external/README.md:129-141] [SOURCE: external/README.md:165-168]
- `system-spec-kit` handover output is rich but episodic: it captures session summary, current state, decisions, blockers, and continuation instructions for a single handoff event. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_handover_full.yaml:41-53] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_handover_full.yaml:149-166]
- The handover template similarly preserves cross-session context, but it is not append-only and does not maintain a continuously updated "patterns discovered" digest. [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:42-77]

## Analysis
Ralph's progress log fills a niche that neither git nor a formal handover covers: it is cheap to update, optimized for the next iteration, and intentionally cumulative. `system-spec-kit` has stronger formal artifacts, but those artifacts are heavier and often final-form. A thin append-only progress surface would reduce the cost of resuming long autonomous loops, especially when the next step only needs distilled recent learnings and the current file focus.

## Conclusion
confidence: high

finding: Ralph's `progress.txt` is the most transplantable artifact in the repo. `system-spec-kit` would benefit from a lightweight, append-only progress document that sits between rich memory saves and heavyweight handover docs, especially for long-running autonomous implementation or research sessions.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/templates/progress-log.md`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** add a short command/reference contract so other workflows know when to append versus replace
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing append-only progress artifact in the current handover and memory guidance and did not find one; current continuity surfaces are either episodic summaries or indexed memory saves. [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:20-29] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:13-18]

## Follow-up questions for next iteration
- How does Ralph's `prd.json` keep the progress log from becoming vague or overly broad?
- Should a `system-spec-kit` progress log be keyed to tasks, phases, or individual execution runs?
- Where should story-sizing rules live so a progress log stays compact and useful?
