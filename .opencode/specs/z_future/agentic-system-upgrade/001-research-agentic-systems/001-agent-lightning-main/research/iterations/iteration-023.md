# Iteration 023 — Parallel Memory Surface Versus Lifecycle Integration

Date: 2026-04-10

## Research question
Is the `/memory:*` surface too parallel to the `/spec_kit:*` surface, compared to the external repo's more integrated operator workflow?

## Hypothesis
Yes. Public's memory layer is powerful, but too much of it is exposed as an operator decision. Most users should encounter memory behavior through resume, completion, and handover flows rather than through a separate family of commands.

## Method
I compared Public's four primary memory entrypoints with `resume`/`complete` lifecycle integration, then contrasted that with Agent Lightning's integrated store-and-trainer usage in docs and examples.

## Evidence
- Public exposes separate commands for memory save, search, manage, and constitutional learn flows. [SOURCE: .opencode/command/memory/save.md:2-4] [SOURCE: .opencode/command/memory/search.md:2-4] [SOURCE: .opencode/command/memory/manage.md:2-4] [SOURCE: .opencode/command/memory/learn.md:2-4]
- `memory:search` is not a small read helper; it is a unified knowledge retrieval and analysis surface with epistemic, causal, and evaluation subcommands. [SOURCE: .opencode/command/memory/search.md:53-106]
- `memory:manage` is likewise an administration surface spanning stats, scan, cleanup, bulk delete, checkpoints, ingest, and shared memory operations. [SOURCE: .opencode/command/memory/manage.md:33-65]
- `resume` already depends on handover, `session_bootstrap()`, `memory_context()`, `tasks.md`, and `implementation-summary.md` to recover the next safe action. [SOURCE: .opencode/command/spec_kit/resume.md:258-304] [SOURCE: .opencode/command/spec_kit/resume.md:359-407]
- `complete` already links to `memory:save`, `handover`, and `resume` as adjacent lifecycle actions. [SOURCE: .opencode/command/spec_kit/complete.md:487-491]
- In Agent Lightning, the store is presented as part of the same operating story as the CLI, trainer, and examples, rather than as a separate operator-facing product family. [SOURCE: external/docs/reference/cli.md:59-98] [SOURCE: external/docs/how-to/train-first-agent.md:149-187]

## Analysis
Public's memory architecture is one of its differentiators, so this is not a call to shrink capability. It is a call to shrink exposure. Right now an operator can feel like they must choose between a workflow system and a memory system, when in practice those should be different depths of the same product.

The external repo keeps its persistence and runtime coordination surfaces in the background for most tutorials. Public should do the same: routine memory behavior should surface as part of resume, handover, completion, and research flows, while admin-grade memory commands remain available for explicit power use.

## Conclusion
confidence: high

finding: `system-spec-kit` should merge its everyday memory UX into the main lifecycle commands and reserve `/memory:*` entrypoints for advanced retrieval, administration, and governance work.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `/memory:*` versus `/spec_kit:*` operator surface
- **Change type:** UX merge
- **Blast radius:** medium
- **Prerequisites:** define primary lifecycle-owned memory actions versus advanced memory admin actions
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Memory appears as a parallel command family that users must understand separately from planning, implementation, completion, and resume.
- **External repo's equivalent surface:** Persistence and coordination concepts are folded into examples, trainer usage, and CLI docs rather than marketed as a separate operator subsystem.
- **Friction comparison:** Public adds more branching decisions. Agent Lightning keeps the core task flow primary and lets store mechanics appear only when needed.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that ordinary operators should start with `memory:manage` or `memory:learn` to complete common work.
- **What system-spec-kit should ADD for better UX:** Add lifecycle-owned memory affordances such as "save context now," "show prior decisions," and "resume latest" directly inside the primary workflow surfaces.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that parallel memory commands are essential for day-one UX, but the strongest value appears in expert recovery, analysis, and governance tasks rather than routine feature work.

## Follow-up questions for next iteration
- Which `/memory:*` actions should remain first-class because they are genuinely expert-only?
- Can `resume` and `complete` absorb more default memory behavior without hiding important controls?
- Should constitutional memory stay explicit while ordinary session memory becomes mostly implicit?
