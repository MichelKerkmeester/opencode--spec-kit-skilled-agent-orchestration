# Iteration 022 — Merge Memory Workflows Into The Main SpecKit Journey Instead Of Keeping A Parallel Operator Surface

Date: 2026-04-10

## Research question
Is the `/memory:*` command family too parallel to `/spec_kit:*`, creating a second operator surface that ordinary lifecycle work should not have to model directly?

## Hypothesis
Yes. The memory system is powerful, but too much of it is surfaced as a separate product instead of quietly supporting the main spec-kit lifecycle.

## Method
I compared the external repo's lean context boundary model with the internal `memory:save`, `memory:search`, `memory:manage`, and `memory:learn` surfaces to see whether the current integration feels operator-centered or infrastructure-centered.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:59-76] The external repo treats cross-iteration context as one narrow bridge: only reviewer feedback is saved across attempts.
- [SOURCE: .opencode/README.md:161-177] `system-spec-kit` exposes four `/memory:*` commands as a top-level peer surface to the eight `/spec_kit:*` commands.
- [SOURCE: .opencode/command/memory/search.md:53-92] `/memory:search` combines retrieval with epistemic baselines, causal graph operations, ablation, dashboards, and learning history.
- [SOURCE: .opencode/command/memory/manage.md:33-62] `/memory:manage` is a second large management product covering scan, cleanup, tier changes, delete flows, checkpoints, ingest jobs, and shared-memory rollout.
- [SOURCE: .opencode/command/memory/save.md:51-76] `/memory:save` has its own folder-resolution contract, script protocol, and validation rules.
- [SOURCE: .opencode/command/memory/learn.md:43-65] `/memory:learn` is a dedicated constitutional-memory manager with separate lifecycle rules.
- [SOURCE: .opencode/command/spec_kit/implement.md:195-205] Implementation already treats context save as a built-in step of the lifecycle.
- [SOURCE: .opencode/command/spec_kit/complete.md:215-217] Completion also owns "Save Context" as an in-band lifecycle step.

## Analysis
The memory platform is real infrastructure and deserves administrative tooling, but the operator experience is split between "do the work" and "manually understand the memory product." For normal feature work, save, resume, and lightweight search should feel like built-in affordances of the spec-kit lifecycle, not a separate command family the operator must consciously switch into. The external repo shows the opposite design instinct: context transfer is a workflow detail, not a top-level mode system. `system-spec-kit` can preserve its deep memory capabilities while demoting most of them from everyday operator consciousness.

## Conclusion
confidence: high
finding: `system-spec-kit` should merge routine memory actions into the primary spec-kit journey and reserve explicit `/memory:*` commands for power-user analysis and administration.

## Adoption recommendation for system-spec-kit
- **Target file or module:** memory command architecture plus `/spec_kit:*` lifecycle integration
- **Change type:** operator-surface merge
- **Blast radius:** large
- **Prerequisites:** separate everyday memory actions from advanced diagnostics and admin workflows
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** memory is both a support subsystem and a separate operator product.
- **External repo's approach:** context carry-over is embedded in the workflow rather than exposed as a parallel surface.
- **Why the external approach might be better:** it lowers mode switching and makes context preservation feel automatic instead of ceremonial.
- **Why system-spec-kit's approach might still be correct:** advanced retrieval, causal analysis, and shared-memory management do need explicit tooling.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** fold save/resume/basic-search into `/spec_kit` lifecycle commands and leave `/memory:manage` plus advanced analysis subcommands as expert tools.
- **Blast radius of the change:** command docs, onboarding, wrappers, and memory UX guidance.
- **Migration path:** keep `/memory:*` intact, but update docs and command wrappers so ordinary flows route through `/spec_kit:resume`, in-band save steps, and packet-aware context loading by default.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators see a full memory product beside the spec-kit product, even when they only need save, resume, or lightweight recall.
- **External repo's equivalent surface:** iteration state transfer is invisible except where it directly affects the loop.
- **Friction comparison:** the internal system gives much more power, but asks the operator to learn two overlapping mental models; the external repo keeps context flow narrower and easier to reason about.
- **What system-spec-kit could DELETE to improve UX:** the expectation that ordinary feature work should explicitly traverse `/memory:*` commands.
- **What system-spec-kit should ADD for better UX:** packet-aware inline memory actions inside planning, implementation, completion, and resume flows.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that normal lifecycle commands cannot reasonably own memory save/load behavior. Instead, both `implement` and `complete` already embed save-context steps, which suggests the separation is more historical than essential.

## Follow-up questions for next iteration
- Which `/memory:*` actions are truly admin-only?
- Should `/memory:search` split into "recall" versus "analysis" surfaces?
- How should `/spec_kit:resume` absorb the most common memory workflows?
