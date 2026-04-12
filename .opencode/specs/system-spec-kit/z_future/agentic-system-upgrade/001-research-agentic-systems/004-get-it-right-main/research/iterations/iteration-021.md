# Iteration 021 — Merge The Plan / Implement / Complete Lifecycle Into One Primary Operator Surface

Date: 2026-04-10

## Research question
Does the external repo's single entry workflow suggest that `system-spec-kit`'s `plan` / `implement` / `complete` split is too fragmented for everyday operator use?

## Hypothesis
Yes. The internal lifecycle is powerful, but the current three-command split exposes too much internal phase machinery at the operator surface.

## Method
I compared the external repo's single workflow entry and compact input surface against `system-spec-kit`'s three lifecycle commands, focusing on duplicated setup blocks, repeated command contracts, and how much lifecycle state the operator must choose manually.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-49] Get It Right presents one visible workflow: implement, checks, review, optional refactor.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105] The external operator surface is mostly a small knob set: retries, yield, mode, checks, and optional UX review inputs.
- [SOURCE: .opencode/command/spec_kit/plan.md:31-145] `/spec_kit:plan` carries a large unified setup prompt with spec choice, execution mode, dispatch mode, memory choice, research intent, and optional phase decomposition.
- [SOURCE: .opencode/command/spec_kit/plan.md:149-181] `/spec_kit:plan` also exposes its own standalone 7-step lifecycle and output contract.
- [SOURCE: .opencode/command/spec_kit/implement.md:29-125] `/spec_kit:implement` repeats a second large setup prompt with folder confirmation, execution mode, dispatch mode, incomplete-session handling, and memory loading.
- [SOURCE: .opencode/command/spec_kit/implement.md:151-205] `/spec_kit:implement` then introduces a separate 9-step contract with its own save-context and handover path.
- [SOURCE: .opencode/command/spec_kit/complete.md:32-150] `/spec_kit:complete` duplicates another large setup block and adds feature-flag choices for research, phases, and auto-debug.
- [SOURCE: .opencode/command/spec_kit/complete.md:198-229] `/spec_kit:complete` further exposes a 14-step lifecycle that overlaps heavily with the other two commands.

## Analysis
The current split mirrors internal phase boundaries more than operator intent. An experienced maintainer can navigate `plan`, `implement`, and `complete`, but the operator has to know which command owns which boundary, which gates re-run, and when answers carry over. The external repo instead presents one primary entry surface and lets the workflow own the lifecycle internally. That does not mean `system-spec-kit` should become single-file or phase-less; it means the visible command surface should stop forcing users to pre-model the workflow graph in their heads before they can start.

## Conclusion
confidence: high
finding: `system-spec-kit` should keep distinct internal lifecycle phases, but merge them behind one primary operator-facing entry surface with phase-aware continuation rather than three equally primary commands.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `spec_kit` lifecycle command architecture
- **Change type:** operator-surface merge
- **Blast radius:** large
- **Prerequisites:** define one canonical feature workflow entry point and one canonical resume surface
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** operators choose among three top-level lifecycle commands that each restate setup, execution mode, dispatch, and memory rules.
- **External repo's approach:** one workflow surface owns the loop while inputs stay narrow and workflow decisions stay internal.
- **Why the external approach might be better:** it lowers decision load and makes the tool feel like a product rather than a menu of internal pipeline stages.
- **Why system-spec-kit's approach might still be correct:** explicit phase control is useful for advanced users and for audit-heavy work.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep phase-aware internals, but make one primary `/spec_kit` lifecycle entry that decides whether the user is planning, implementing, resuming, or completing based on artifacts and explicit flags.
- **Blast radius of the change:** command surface, docs, wrappers, and onboarding guidance.
- **Migration path:** retain `plan` / `implement` / `complete` as compatibility aliases first, then gradually demote them in docs once the primary entry surface is stable.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators must choose between `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete`, each with its own setup ritual and lifecycle vocabulary.
- **External repo's equivalent surface:** one visible workflow with a few explicit knobs, while lifecycle transitions stay inside the workflow definition.
- **Friction comparison:** `system-spec-kit` has more power, but higher cognitive load because the user must pre-classify the work before execution; the external repo needs fewer decisions and fewer repeated prompts.
- **What system-spec-kit could DELETE to improve UX:** the idea that three lifecycle commands should all be first-class operator entry points.
- **What system-spec-kit should ADD for better UX:** a single canonical feature-workflow entry that infers current phase from packet state and asks only for missing information.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that the command split creates materially different operator value rather than internal implementation convenience. The docs show different step counts, but most of the visible setup and lifecycle language is repeated.

## Follow-up questions for next iteration
- Which lifecycle choices truly need to remain explicit at the command line?
- Should advanced phase control move to flags rather than top-level commands?
- How much alias compatibility is needed to avoid breaking current operators?
