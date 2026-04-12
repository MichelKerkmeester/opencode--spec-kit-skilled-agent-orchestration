# Iteration 021 — Merge Lifecycle Entry Commands

Date: 2026-04-10

## Research question
Is the `/spec_kit:plan` -> `/spec_kit:implement` -> `/spec_kit:complete` split the right user-facing lifecycle, or has the command surface become more fragmented than the workflow actually requires?

## Hypothesis
Babysitter will show that a smaller set of entry points can still preserve planning versus execution intent, because the real lifecycle authority lives in the runtime and generated instructions rather than in separate top-level commands.

## Method
I compared the current Spec Kit command trio and their setup phases with Babysitter's command wrappers, quick-start UX, and shared harness lifecycle.

## Evidence
- `/spec_kit:plan` is a standalone 7-step planning workflow with its own setup phase, single consolidated prompt, spec-folder selection, mode selection, dispatch choice, memory choice, and optional phase decomposition. [SOURCE: .opencode/command/spec_kit/plan.md:2-4] [SOURCE: .opencode/command/spec_kit/plan.md:31-45] [SOURCE: .opencode/command/spec_kit/plan.md:80-145] [SOURCE: .opencode/command/spec_kit/plan.md:151-173]
- `/spec_kit:implement` repeats much of that setup and then runs a separate 9-step implementation workflow. [SOURCE: .opencode/command/spec_kit/implement.md:2-4] [SOURCE: .opencode/command/spec_kit/implement.md:29-39] [SOURCE: .opencode/command/spec_kit/implement.md:77-125] [SOURCE: .opencode/command/spec_kit/implement.md:129-185]
- `/spec_kit:complete` adds a third front door with a 14-step lifecycle, more flags, and another setup phase that re-asks similar questions. [SOURCE: .opencode/command/spec_kit/complete.md:2-4] [SOURCE: .opencode/command/spec_kit/complete.md:32-45] [SOURCE: .opencode/command/spec_kit/complete.md:81-150] [SOURCE: .opencode/command/spec_kit/complete.md:156-229]
- The YAML assets mirror that split again, with distinct plan, implement, and complete auto workflows carrying overlapping documentation-level, template, and dispatch configuration. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:22-62] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:109-166] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:20-33] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:30-108]
- Babysitter's OpenCode command wrappers are thinner: `/babysitter:call`, `/babysitter:plan`, and `/babysitter:yolo` all forward into the same babysit skill rather than each redefining a separate lifecycle. [SOURCE: external/plugins/babysitter-opencode/commands/call.md:1-7] [SOURCE: external/plugins/babysitter-opencode/commands/plan.md:1-7] [SOURCE: external/plugins/babysitter-opencode/commands/yolo.md:1-7]
- Babysitter's shared harness entry point runs one two-phase lifecycle: process definition first, orchestration second, with plan-only simply stopping after Phase 1. [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:2-14] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:43-56] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:93-141]
- Babysitter's quick start teaches a compact surface: `/babysitter:call`, `/babysitter:yolo`, `/babysitter:plan`, plus a few utility commands like `doctor`, `observe`, and `resume`. [SOURCE: external/README.md:188-234]

## Analysis
Spec Kit currently exposes lifecycle phase boundaries as separate commands, but it also duplicates the same operator ceremony at each boundary: choose a mode, choose dispatch, choose memory behavior, resolve the spec folder, then hand execution to another workflow definition. That is clean from an implementation-separation perspective, but it is heavy from an operator perspective because the user keeps paying setup costs for what is essentially one continuous unit of work. [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:35-125] [SOURCE: .opencode/command/spec_kit/complete.md:38-150]

Babysitter keeps plan versus execution semantics, but it does not force the user to understand three different orchestration surfaces to get there. The wrappers are thin, the real lifecycle lives in the harness runtime, and "plan only" is a phase stop, not an entirely separate front door. [SOURCE: external/plugins/babysitter-opencode/commands/plan.md:1-7] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:113-141]

That makes the most transferable UX lesson clear: Spec Kit should keep phase boundaries internally, but it should stop requiring the user to navigate them as separate products.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Users choose among `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete`, then answer another setup prompt and trigger another YAML workflow each time a lifecycle boundary changes. [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:35-125] [SOURCE: .opencode/command/spec_kit/complete.md:38-150]
- **External repo's equivalent surface:** Babysitter exposes a smaller wrapper set around one orchestration model, with `call`, `plan`, and `yolo` all delegating to the same babysit skill and harness lifecycle. [SOURCE: external/plugins/babysitter-opencode/commands/call.md:1-7] [SOURCE: external/plugins/babysitter-opencode/commands/plan.md:1-7] [SOURCE: external/plugins/babysitter-opencode/commands/yolo.md:1-7] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:43-141]
- **Friction comparison:** Spec Kit asks the operator to choose among three lifecycle commands before work starts, while Babysitter mostly asks for intent and mode once, then uses phase control inside the runtime. That is lower cognitive load and fewer repeated questions.
- **What system-spec-kit could DELETE to improve UX:** Delete `/spec_kit:implement` and `/spec_kit:complete` as separate public lifecycle entry points, or demote them to compatibility aliases behind one canonical lifecycle command.
- **What system-spec-kit should ADD for better UX:** Add one canonical lifecycle command with explicit flags such as `--phase=plan|implement|full` or `--stop-after=plan`, so phase control is still available without fragmenting the top-level surface.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge its top-level planning, implementation, and full-lifecycle entry points into one canonical lifecycle surface, while preserving phase boundaries internally. The current three-command split creates more operator friction than lifecycle clarity. 

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Separate public commands for planning, implementation, and full lifecycle, each with its own setup prompt and YAML asset stack. [SOURCE: .opencode/command/spec_kit/plan.md:151-173] [SOURCE: .opencode/command/spec_kit/implement.md:131-185] [SOURCE: .opencode/command/spec_kit/complete.md:156-229]
- **External repo's approach:** Thin wrappers over a shared orchestration skill and a shared two-phase harness lifecycle. [SOURCE: external/plugins/babysitter-opencode/commands/call.md:1-7] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:2-14]
- **Why the external approach might be better:** It reduces command-fragmentation and repeats less setup while still keeping plan-only and autonomous modes available.
- **Why system-spec-kit's approach might still be correct:** Hard public phase boundaries do prevent accidental implementation during planning.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce one canonical command such as `/spec_kit:run` or `/spec_kit:work`, keep `/plan`, `/implement`, and `/complete` as compatibility aliases initially, and move phase stopping/continuation into runtime flags rather than separate operator mental models.
- **Blast radius of the change:** large
- **Migration path:** add the new canonical surface first, route existing commands through it, then deprecate the split surfaces after telemetry and wrapper parity updates.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/complete.md`, `.opencode/command/spec_kit/assets/`
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** agree on the canonical lifecycle command name and stop/continue flag design
- **Priority:** must-have

## Counter-evidence sought
I looked for proof that the three-command split meaningfully reduces ambiguity for operators, but most of the distinction currently lives in repeated setup prose and mirrored YAML, not in a fundamentally different control model. [SOURCE: .opencode/command/spec_kit/plan.md:204-211] [SOURCE: .opencode/command/spec_kit/implement.md:209-216] [SOURCE: .opencode/command/spec_kit/complete.md:219-229]

## Follow-up questions for next iteration
- Should `/memory:*` remain a parallel public surface, or should ordinary memory behavior disappear into the lifecycle command?
- If lifecycle entry points merge, which current setup questions can become project defaults instead of per-run prompts?
- Does the YAML asset pattern still earn its complexity once the lifecycle surface is collapsed?
