# Iteration 1: First-touch command discovery surfaces

## Focus
Investigate the actual first-touch surfaces Codex receives when `system-spec-kit` is selected, then compare that surface with the concrete `spec_kit` and `memory` command docs to see whether the discoverability gap is missing docs, wrong docs, too much noise, or bad placement.

## Findings
1. The always-loaded first-touch surface is `references/workflows/quick_reference.md`, because `system-spec-kit` sets it as `DEFAULT_RESOURCE`, includes it in `LOADING_LEVELS["ALWAYS"]`, and loads ALWAYS resources before any intent-specific docs. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135`, `.opencode/skill/system-spec-kit/SKILL.md:226-233`, `.opencode/skill/system-spec-kit/SKILL.md:306-323`]
2. The current quick reference does not behave like a compact command index for the highest-value entrypoints. In its command-oriented sections it prominently exposes manual memory save, handover, and phased planning, but not the baseline commands a Codex user most likely needs first such as `/spec_kit:resume`, `/spec_kit:plan`, `/memory:search`, `/memory:manage`, or `/memory:learn`. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]
3. The high-value command docs already exist and are strongly action-oriented: `/spec_kit:resume` is the session recovery entrypoint, `/spec_kit:plan` is the planning entrypoint, and `/memory:save` documents the canonical save workflow. This means the repo does not primarily have a missing-docs problem. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`]
4. The current gap is mostly bad placement plus noise: the always-loaded quick reference spends its early, most visible space on spec levels, template copy commands, naming, and manual script usage, while the actual command entrypoints live elsewhere in detailed command docs. The smallest likely fix is therefore a small, front-loaded command shortlist in the quick reference rather than a new registry or major routing redesign. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:13-188`, `.opencode/command/spec_kit:directory`, `.opencode/command/memory:directory`] [INFERENCE: based on the always-loaded quick reference being first-touch and the command docs already existing]

## Ruled Out
- Treating the current quick reference as already sufficient command discovery: it exposes too few of the actual high-value entrypoints. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]
- Solving this by creating brand-new command docs: the relevant `spec_kit` and `memory` docs already exist. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`]

## Dead Ends
- Directory listing alone was not enough to determine what Codex would see first; it only confirmed doc existence, not discovery priority. [SOURCE: `.opencode/command/spec_kit:directory`, `.opencode/command/memory:directory`]

## Sources Consulted
- `.opencode/skill/system-spec-kit/SKILL.md:135`
- `.opencode/skill/system-spec-kit/SKILL.md:226-233`
- `.opencode/skill/system-spec-kit/SKILL.md:306-323`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`
- `.opencode/command/spec_kit/resume.md:1-33`
- `.opencode/command/spec_kit/plan.md:1-40`
- `.opencode/command/memory/save.md:1-76`

## Assessment
- New information ratio: 0.75
- Questions addressed: [Q1, Q2, Q3, Q4]
- Questions answered: [Q1, Q2]

## Reflection
- What worked and why: Reading the skill router plus the default quick reference worked because it showed the real first-touch loading order, not just the existence of command docs.
- What did not work and why: Looking only at command directories did not answer discoverability because existence and visibility are different problems.
- What I would do differently: Next, compare the smallest viable command shortlist against the highest-value command docs to name the exact 4-6 commands that belong in the quick reference.

## Recommended Next Focus
Define the minimal command shortlist Codex should see first in the quick reference, with exact candidate commands, target insertion point, and validation criteria for keeping the change concise and low-drift.
