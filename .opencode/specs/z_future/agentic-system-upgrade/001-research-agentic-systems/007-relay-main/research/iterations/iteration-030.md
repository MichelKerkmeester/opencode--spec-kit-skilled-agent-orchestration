# Iteration 030 — Merge the Per-Command YAML Asset Layer

Date: 2026-04-10

## Research question
Is the current pattern of one markdown command plus mode-specific YAML assets per command the right abstraction, or should `system-spec-kit` move toward a smaller shared lifecycle engine?

## Hypothesis
Public's per-command YAML asset pattern captures behavior cleanly, but it duplicates lifecycle machinery and inflates the command-maintenance surface compared with Relay's shared workflow engine.

## Method
Compared Public's command docs and YAML loading pattern with Relay's single workflow runner, multi-format workflow authoring, and builder/coordinator lifecycle features.

## Evidence
- Public says each `spec_kit` command loads a YAML workflow from `assets/` and executes it step by step. [SOURCE: .opencode/command/spec_kit/README.txt:43-45]
- The command group currently lists separate YAML assets per command/mode, including `spec_kit_complete_*`, `spec_kit_debug_*`, `spec_kit_deep-research_*`, `spec_kit_deep-review_*`, `spec_kit_implement_*`, `spec_kit_plan_*`, `spec_kit_resume_*`, and `spec_kit_handover_full.yaml`. [SOURCE: .opencode/command/spec_kit/README.txt:83-111]
- `plan`, `implement`, and `complete` each tell the runner to load a different YAML prompt after setup passes. [SOURCE: .opencode/command/spec_kit/plan.md:204-211] [SOURCE: .opencode/command/spec_kit/implement.md:209-216] [SOURCE: .opencode/command/spec_kit/complete.md:331-337]
- Relay uses one workflow runner that can execute YAML, TypeScript, or Python workflows from the same entrypoint. [SOURCE: external/packages/sdk/src/workflows/README.md:1-27]
- Relay also exposes a zero-config `runWorkflow()` helper plus one fluent `workflow()` builder rather than separate per-command shells. [SOURCE: external/packages/sdk/src/workflows/README.md:539-551] [SOURCE: external/packages/sdk/src/workflows/builder.ts:134-239]
- The builder and runner share lifecycle features such as channel selection, idle nudging, shared state, `startFrom`, and `previousRunId`. [SOURCE: external/packages/sdk/src/workflows/README.md:553-746] [SOURCE: external/packages/sdk/src/workflows/builder.ts:193-239]

## Analysis
Public's command-specific YAML files improved discipline, but they now behave like duplicated lifecycle products. Relay suggests a better split: one shared execution engine with reusable lifecycle features, then thin entrypoints or examples layered on top. Public can keep YAML where it helps, but the engine should probably become more central than the individual command asset files.

## Conclusion
confidence: high
finding: Public should merge the per-command YAML asset pattern into a shared lifecycle engine, keeping thin command shells for user ergonomics while reducing duplicated setup, mode, save-context, and completion logic.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/`, deep-loop command shells, lifecycle/reducer infrastructure
- **Change type:** workflow-engine merger
- **Blast radius:** very high
- **Prerequisites:** identify the common lifecycle primitives and define which command-specific behaviors remain thin wrappers
- **Priority:** should-have (prototype later)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Many command docs each hand off to a dedicated YAML asset, so the operator surface and maintenance surface both expand together.
- **External repo's equivalent surface:** Relay has one runner and one builder that can execute several workflow authoring formats while sharing the same lifecycle features.
- **Friction comparison:** Public's pattern is more explicit but causes more duplication and more places for behavior drift. Relay's shared engine lowers maintenance friction and gives users a more coherent underlying model.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for a separate YAML asset family for every top-level command and mode combination.
- **What system-spec-kit should ADD for better UX:** Add a shared lifecycle engine with reusable primitives like resume/start-from, shared state, and completion policies, then keep thin human-facing wrappers on top.
- **Net recommendation:** MERGE

## Counter-evidence sought
Looked for signs that Public already shares one lifecycle core beneath the command assets; the docs still emphasize per-command YAML files as the main execution units.

## Follow-up questions for next iteration
- Which parts of the current command YAML files are genuinely command-specific?
- Could the shared engine power both deep loops and ordinary plan/implement flows?
- How should a thinner command layer expose advanced lifecycle options without recreating current sprawl?
