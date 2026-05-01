# Iteration 022 — Lifecycle Split: Plan vs Implement vs Complete

## Research question
Does Ralph's compact "prepare once, run the loop" model suggest that `system-spec-kit`'s `plan` / `implement` / `complete` split is too ceremonial for the default UX?

## Hypothesis
The three-command lifecycle is structurally reasonable, but it is over-exposed as three separate operator decisions when many users really want one guided path through those stages.

## Method
Compared Ralph's Create PRD -> Convert -> Run flow with the setup prompts and step counts in `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete`, focusing on how many branching decisions the operator must make.

## Evidence
- Ralph's README reduces the lifecycle to three simple actions with one main runtime step: create scope, convert to ordered stories, run the loop. [SOURCE: external/README.md:88-130]
- `/spec_kit:plan` opens with a large consolidated setup prompt, multiple workflow modes, and explicit handoff to `/spec_kit:implement`. [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/plan.md:151-153]
- `/spec_kit:implement` and `/spec_kit:complete` each repeat setup, mode, and validation logic instead of feeling like one continuous guided flow. [SOURCE: .opencode/command/spec_kit/implement.md:35-120] [SOURCE: .opencode/command/spec_kit/implement.md:171-205] [SOURCE: .opencode/command/spec_kit/complete.md:1-4]

## Analysis
Ralph's lifecycle is not "simpler because it does less work"; it is simpler because the user does not have to manually choose between sibling lifecycle commands as often. In `system-spec-kit`, the conceptual separation between planning, implementing, and completing is valuable for power users and packet governance, but forcing that split into the front door increases ceremony. A guided wrapper could preserve the stages without making them separate UX burdens.

## Conclusion
confidence: medium

finding: `system-spec-kit` should merge the visible lifecycle UX behind one guided front door while preserving `plan`, `implement`, and `complete` as expert-access subflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/plan.md`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define how a guided front door decides whether to stop after planning or continue into implementation/completion
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators must decide which lifecycle command they need, then answer another layer of mode and continuation questions inside that command.
- **External repo's equivalent surface:** Ralph collapses lifecycle choice into one narrative flow, with the runner doing the repetitive work.
- **Friction comparison:** `system-spec-kit` creates more decision points and duplicated setup prompts. Ralph reduces user effort by treating lifecycle stages as internal transitions, not separate front-door concepts.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that most users should explicitly choose among three sibling lifecycle commands at the start.
- **What system-spec-kit should ADD for better UX:** Add a guided lifecycle entrypoint that can plan only, plan-then-implement, or complete existing work based on detected state.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that the current split already feels like one guided flow through wrappers or quick-reference defaults, but the docs still present these as separate primary choices. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-130] [SOURCE: .opencode/command/spec_kit/plan.md:31-145]

## Follow-up questions for next iteration
- If lifecycle stages become more guided, should memory actions also become subordinate to the same path rather than remain a parallel command family?
