# Iteration 005 — Pending Action Queues

Date: 2026-04-09

## Research question
Can Babysitter's pending-action batching model improve resumability for blocked or partially parallel research loops?

## Hypothesis
Babysitter's explicit `nextActions` model will be more reusable than `system-spec-kit`'s current "next focus" text because it preserves resumable work items instead of just summarizing what to think about next.

## Method
I examined Babysitter's parallel intrinsic, pending-action batching, and waiting results, then compared them with `system-spec-kit`'s deep-research convergence and iteration-state model.

## Evidence
- `parallel.all()` collects pending effect actions rather than failing the whole orchestration, then raises a `ParallelPendingError` containing the batch. [SOURCE: external/packages/sdk/src/runtime/intrinsics/parallel.ts:19-38]
- Parallel batches deduplicate effect actions, create portable summaries, and assign a stable `parallelGroupId` hint for the grouped work. [SOURCE: external/packages/sdk/src/tasks/batching.ts:31-47] [SOURCE: external/packages/sdk/src/tasks/batching.ts:72-85]
- `orchestrateIteration` converts unresolved effects into `waiting` results with explicit `nextActions`. [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:217-224]
- The current deep-research loop decides `STOP`, `STUCK_RECOVERY`, or `CONTINUE`, then derives only a textual `next_focus`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-293]
- The current deep-research agent state record has no dedicated field for resumable pending actions or blocked sub-work beyond freeform narrative. [SOURCE: .opencode/agent/deep-research.md:167-199]

## Analysis
Babysitter models unresolved work as a concrete queue, not just as prose. That is a better fit for resumability because a recovery step can inspect pending actions, group them, and decide what is still outstanding without rereading the full narrative history. [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114] [SOURCE: external/packages/sdk/src/tasks/batching.ts:31-47]

`system-spec-kit`'s current deep-research loop is good at choosing the next investigative direction, but it is weak at preserving partially completed action sets. When a research run stalls mid-collection, the next session gets a summary, not a task queue. Babysitter's pending-action approach would make blocked research runs more resumable and less interpretive. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-293] [SOURCE: .opencode/agent/deep-research.md:167-199]

## Conclusion
confidence: high

finding: `system-spec-kit` should add a lightweight pending-action queue for research and review workflows. The queue does not need Babysitter's full effect system, but it should preserve grouped, resumable work items so stalled sessions can resume from concrete outstanding actions rather than from a narrative-only next focus.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, and `.opencode/agent/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a stable pending-action schema and decide which workflow phases may enqueue resumable actions
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing pending-action file or structured queue in the current deep-research workflow and found convergence decisions plus narrative next-focus fields, but no queue contract. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-293] [SOURCE: .opencode/agent/deep-research.md:167-199]

## Follow-up questions for next iteration
- Would executable methodology modules make it easier to generate pending-action queues automatically?
- Which Spec Kit workflows besides deep research should use pending-action queues?
- How much of Babysitter's reuse story comes from methodology packaging rather than runtime primitives?
