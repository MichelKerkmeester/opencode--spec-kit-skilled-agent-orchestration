# Iteration 022 — Lifecycle Split And YAML Workflow Indirection

Date: 2026-04-10

## Research question
Is the `plan` -> `implement` -> `complete` lifecycle, plus hidden YAML workflow assets behind each command, too indirect compared to the external repo's operator flow?

## Hypothesis
Yes. Public likely over-encodes workflow state in command boundaries and setup scaffolds. The external repo suggests operators benefit more from one obvious path with optional advanced modes than from multiple lifecycle entrypoints that all begin by loading separate YAML engines.

## Method
I compared Public's command setup contracts and YAML-backed workflow ownership model with Agent Lightning's tutorial flow and example execution modes.

## Evidence
- `plan`, `implement`, and `complete` each begin with "YOUR FIRST ACTION" instructions to load a corresponding YAML workflow file. [SOURCE: .opencode/command/spec_kit/plan.md:13-17] [SOURCE: .opencode/command/spec_kit/implement.md:11-14] [SOURCE: .opencode/command/spec_kit/complete.md:13-17]
- Each of those commands also imposes its own first-message protocol and consolidated prompt block before normal execution starts. [SOURCE: .opencode/command/spec_kit/plan.md:31-44] [SOURCE: .opencode/command/spec_kit/implement.md:29-42] [SOURCE: .opencode/command/spec_kit/complete.md:32-45]
- Deep research follows the same pattern: the markdown command is a setup layer whose first action is to load auto or confirm YAML assets. [SOURCE: .opencode/command/spec_kit/deep-research.md:11-20]
- The deep-research auto asset owns a sizable state machine with dedicated config, strategy, registry, dashboard, iteration, and synthesis files. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89]
- Agent Lightning's first-agent tutorial presents the operator loop more directly: configure `Trainer`, provide the algorithm and initial prompt, then call `trainer.fit()`. [SOURCE: external/docs/how-to/train-first-agent.md:181-187]
- The `tinker` example offers either a single integrated `oneclick` run or a clearly separated distributed workflow across three terminals. [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]

## Analysis
Public's lifecycle split solves a real internal workflow problem, but the operator pays for that internal clarity several times. They must know which lifecycle phase they are in, understand that markdown is only setup, and trust that YAML is the real executor. That separation is architecturally neat, yet it raises the cognitive load for everyday usage.

Agent Lightning shows a lighter pattern: one primary path, one advanced path, and tutorials that make the difference legible. Public can preserve its underlying phased behavior while collapsing the operator-facing mental model into a smaller number of workflow presets.

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign its lifecycle front door so one primary command handles the common case, while `plan` and `implement` become advanced or explicit-state variants rather than the default mental model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/{plan,implement,complete}.md` plus YAML asset strategy
- **Change type:** UX redesign
- **Blast radius:** large
- **Prerequisites:** define canonical default flow, preserve advanced phase-specific entrypoints, and hide YAML ownership details from most operators
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** The user must choose among multiple workflow verbs, each with separate setup logic and YAML ownership.
- **External repo's equivalent surface:** The user chooses a tutorial or example path, then either runs a oneclick flow or a clearly named distributed flow.
- **Friction comparison:** Public creates more questions up front and more invisible machinery beneath the command text. Agent Lightning exposes fewer phase choices and makes advanced paths opt-in.
- **What system-spec-kit could DELETE to improve UX:** Delete the assumption that most users should reason explicitly about `plan` versus `implement` versus `complete` before work starts.
- **What system-spec-kit should ADD for better UX:** Add one default "guided complete" preset with sensible defaults and clear escape hatches for explicit planning-only or implementation-only work.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for evidence that the YAML split is itself a strong operator feature, but most benefits appear internal: reuse, dispatch control, and workflow maintainability. Those are important, yet they do not need to stay user-visible.

## Follow-up questions for next iteration
- Should `/spec_kit:complete` become the only recommended workflow for most operators?
- Which current lifecycle questions can be inferred safely from context or defaults?
- Can YAML assets stay internal while the public command docs shrink dramatically?
