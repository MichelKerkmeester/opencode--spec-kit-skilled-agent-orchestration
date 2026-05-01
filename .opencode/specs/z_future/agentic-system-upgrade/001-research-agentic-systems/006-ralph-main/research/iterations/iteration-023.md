# Iteration 023 — Memory UX as a Parallel Surface

## Research question
Is the `/memory:*` command family well-integrated with the `/spec_kit:*` lifecycle, or does it create an awkward second operator surface that Ralph largely avoids?

## Hypothesis
`system-spec-kit`'s memory capabilities are powerful, but the current UX exposes them as a peer surface when most operators need them as background support for spec workflows rather than as a separate command family.

## Method
Compared Ralph's tightly integrated continuity model (`prd.json`, `progress.txt`, git history) with the visible responsibilities and setup burden of `memory:save`, `memory:search`, `memory:manage`, and `memory:learn`.

## Evidence
- Ralph keeps continuity inside the core workflow: the same README that explains execution also explains the only persisted state bundle. There is no parallel "memory management" UX for normal operators. [SOURCE: external/README.md:132-145] [SOURCE: external/README.md:163-168]
- `system-spec-kit` exposes four separate memory commands, including large management and analysis surfaces that branch far beyond normal lifecycle usage. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-130] [SOURCE: .opencode/command/memory/manage.md:72-140] [SOURCE: .opencode/command/memory/learn.md:87-95]
- Even simple save/search flows require dedicated routing, validation, and intent handling, which makes memory feel like a separate product. [SOURCE: .opencode/command/memory/save.md:7-47] [SOURCE: .opencode/command/memory/search.md:53-91] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-617]

## Analysis
The issue is not that memory is too capable. The issue is that routine operators are asked to reason about that capability explicitly. Ralph demonstrates the opposite pattern: continuity is part of the loop, while only unusual maintenance work feels "manual." `system-spec-kit` would be easier to use if save/search behavior were pulled under the spec lifecycle by default, leaving `manage` and `learn` as advanced surfaces for explicit maintenance.

## Conclusion
confidence: high

finding: `system-spec-kit` should merge routine memory actions into the default spec workflow and reserve `/memory:manage` and `/memory:learn` for advanced or administrative use.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define which save/search behaviors become automatic or embedded inside spec commands
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Memory is a parallel command family with its own lifecycle, setup prompts, and expert vocabulary.
- **External repo's equivalent surface:** Ralph's continuity tools are embedded in the main execution model and mostly invisible as a separate subsystem.
- **Friction comparison:** `system-spec-kit` creates dual mental models: "spec workflow" and "memory workflow." Ralph keeps one mental model: the task loop itself.
- **What system-spec-kit could DELETE to improve UX:** Delete `/memory:save` and `/memory:search` from the default operator-facing command map.
- **What system-spec-kit should ADD for better UX:** Add inline "save context" and "recover context" behavior inside the main spec workflow so memory supports the lifecycle instead of competing with it.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for proof that the memory surface is already mostly hidden behind `/spec_kit:resume` or automatic hooks, but the quick-reference and command docs still present the memory family as a first-class parallel surface. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-187] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-589]

## Follow-up questions for next iteration
- If lifecycle and memory UX both simplify, does the current spec-folder template and validation model still feel proportionate, or is that another major friction source?
