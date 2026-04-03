# Iteration 2: Minimal first-touch command shortlist for Codex

## Focus
Determine the smallest high-signal `spec_kit`/`memory` command shortlist Codex should see first when `system-spec-kit` is loaded, and decide whether that fix belongs only in `quick_reference.md` or also needs a tiny `SKILL.md` pointer. [SOURCE: `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/research/deep-research-strategy.md:93-95`]

## Findings
1. The must-show first-touch shortlist is best kept to four commands: `/spec_kit:resume` (resume/recover existing work), `/spec_kit:plan` (start planning/new spec workflow), `/memory:search` (retrieve prior context/analysis), and `/memory:save` (preserve session context). This is the smallest set that covers the primary user branches exposed by the existing command docs without requiring UI command discovery. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/search.md:1-80`, `.opencode/command/memory/save.md:1-76`]
2. `quick_reference.md` is the correct primary insertion surface because `system-spec-kit` always loads it as `DEFAULT_RESOURCE`, and its current early “ESSENTIAL COMMANDS” section still spends prime space on shell snippets and manual save mechanics instead of a compact command shortlist. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`]
3. A tiny `SKILL.md` pointer is useful, but only as a non-duplicating signpost to the quick reference shortlist; duplicating the shortlist in both places would recreate the command-drift risk already observed in prior repo history. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:373`, `.opencode/skill/system-spec-kit/SKILL.md:561-561`, `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`]
4. Lower-priority commands should stay out of the first shortlist: `/spec_kit:handover` is end-of-session rather than first-touch, phase shortcuts are specialized workflow modifiers, and the broader memory surface (`/memory:manage`, `/memory:learn`, `/memory:manage shared`) is better kept secondary to avoid noise. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`, `.opencode/skill/system-spec-kit/SKILL.md:561-612`, `.opencode/command/spec_kit/plan.md:1-40`]

## Ruled Out
- A generated command index is not the smallest-correct fix; the always-loaded quick reference already exists and can carry the shortlist with less maintenance surface. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`]
- Expanding the first-touch shortlist to every `memory` or `spec_kit` command would add noise and increase drift risk relative to a four-command entry set plus deeper links. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:561-561`, `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`]

## Dead Ends
- Treating `/spec_kit:handover` as a first-touch command is a dead end for this problem because the quick reference itself frames it as a session-ending continuation tool, not an initial navigation command. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:499-513`]

## Sources Consulted
- `.opencode/skill/system-spec-kit/SKILL.md:135-180`
- `.opencode/skill/system-spec-kit/SKILL.md:373`
- `.opencode/skill/system-spec-kit/SKILL.md:561-612`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`
- `.opencode/command/spec_kit/resume.md:1-33`
- `.opencode/command/spec_kit/plan.md:1-40`
- `.opencode/command/memory/search.md:1-80`
- `.opencode/command/memory/save.md:1-76`
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`

## Assessment
- New information ratio: 0.88
- Questions addressed: [Q3, Q4, Q5]
- Questions answered: [Q3, Q4, Q5]

## Reflection
- What worked and why: Reading the always-loaded quick reference beside the command docs made it possible to separate the “first-touch shortlist” problem from the deeper command-documentation problem. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/command/spec_kit/resume.md:1-33`]
- What did not work and why: Using the existing visible commands in the quick reference as the presumed shortlist failed because that surface currently over-represents save/handover mechanics and under-represents plan/resume/search entrypoints. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]
- What I would do differently: If another iteration is needed, validate the exact copy/insertion point against implementation ergonomics rather than spending more time rediscovering which commands matter. [INFERENCE: based on `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166` and `.opencode/skill/system-spec-kit/SKILL.md:373`]

## Recommended Next Focus
Implementation-ready validation only: add a four-command “Start Here” shortlist immediately under `## 4. ESSENTIAL COMMANDS` in `quick_reference.md`, add a one-line pointer from `SKILL.md` to that shortlist, and verify no duplicate command matrix is introduced elsewhere.
