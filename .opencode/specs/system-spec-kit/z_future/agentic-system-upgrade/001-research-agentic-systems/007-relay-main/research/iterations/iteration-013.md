# Iteration 013 — Resume and Partial Restart Semantics

Date: 2026-04-10

## Research question
Should `system-spec-kit` expose explicit `resume`, `start-from`, and prior-run reuse controls for deep loops instead of relying on more implicit packet continuation behavior?

## Hypothesis
Relay's workflow restart surface is clearer than Public's current deep-loop command contract and would improve recovery without changing Public's governance model.

## Method
Read Relay's workflow runner, builder, CLI resume flow, and workflow docs; then compared them with Public's `deep-research` and `deep-review` command surfaces plus the deeper lifecycle language in `sk-deep-review`.

## Evidence
- Relay exposes `resume`, `startFrom`, and `previousRunId` as first-class workflow options in its convenience API. [SOURCE: external/packages/sdk/src/workflows/run.ts:10-30] [SOURCE: external/packages/sdk/src/workflows/run.ts:82-92]
- The builder also encodes `startFrom` and `previousRunId`, so restart behavior exists in the shared model, not as a one-off CLI hack. [SOURCE: external/packages/sdk/src/workflows/builder.ts:94-129] [SOURCE: external/packages/sdk/src/workflows/builder.ts:230-239]
- The workflow docs make pause/resume/abort and failed-run resume part of the normal operational surface. [SOURCE: external/packages/sdk/src/workflows/README.md:530-537]
- Relay's CLI persists run state to a file-backed JSONL store specifically so `--resume` can survive process restarts, and it also offers `--start-from` plus `--previous-run-id` as recovery guidance when full run state is missing. [SOURCE: external/packages/sdk/src/workflows/cli.ts:327-344] [SOURCE: external/packages/sdk/src/workflows/cli.ts:348-407] [SOURCE: external/packages/sdk/src/workflows/cli.ts:427-465]
- Public's `deep-research` command documents loop phases and outputs but does not expose equivalent resume/start-from controls at the command surface. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-186] [SOURCE: .opencode/command/spec_kit/deep-research.md:252-259]
- Public's `deep-review` command similarly defines lifecycle and failure handling without first-class recovery flags. [SOURCE: .opencode/command/spec_kit/deep-review.md:162-228] [SOURCE: .opencode/command/spec_kit/deep-review.md:290-297]
- Ironically, `sk-deep-review` already has richer lineage language (`resume`, `restart`, `fork`, `completed-continue`) than the public command contract exposes. [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:257-285]

## Analysis
This is a narrower refactor than iteration 011. Even if Public keeps separate research and review loops, operators should not need folklore to recover a run after interruption. Relay's recovery surface is operationally legible: resume the run, or start from a specific step using cached prior outputs. Public already externalizes state; it should let users address that state explicitly.

## Conclusion
confidence: high
finding: Public should add explicit resume and partial-restart semantics to deep-loop commands. The state model already exists; the user-facing recovery surface is what is missing.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, deep-loop reducer/runner implementation
- **Change type:** modified existing + workflow refactor
- **Blast radius:** medium
- **Prerequisites:** standardize run identifiers, persisted loop metadata, and step/iteration naming across deep loops
- **Priority:** should-have (adopt now)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Packet continuation is mostly inferred from existing files and operator judgment rather than explicit resume/start-from controls.
- **External repo's approach:** Recovery is explicit: resume a run by ID, or restart from a known step with cached outputs from a previous run.
- **Why the external approach might be better:** It removes ambiguity, lowers operator anxiety during interruptions, and turns recovery from a social convention into a product surface.
- **Why system-spec-kit's approach might still be correct:** Public's packets are human-readable and phase-aware, so some recovery flexibility comes "for free" from file-system state.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Add `--resume`, `--start-from`, and `--previous-run-id` to deep-loop commands, plus clear dashboard/state fields showing the current lineage and resumable checkpoints.
- **Blast radius of the change:** medium
- **Migration path:** Start with command-level flags and dashboard metadata, then backfill generic kernel support so the feature works consistently across research and review.

## Counter-evidence sought
Looked for an already-documented deep-research resume surface equivalent to Relay's workflow CLI; none was present in the command contract reviewed.

## Follow-up questions for next iteration
- Should recovery target iterations, phases, or reducer states?
- Which recovery semantics belong in commands versus reducer internals?
- Can the deep-review lineage model become the shared baseline for deep-research?
