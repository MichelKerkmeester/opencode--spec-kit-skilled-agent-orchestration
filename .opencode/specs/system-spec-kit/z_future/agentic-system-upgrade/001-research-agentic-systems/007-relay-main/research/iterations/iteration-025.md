# Iteration 025 — Keep the LEAF Deep-Loop Model

Date: 2026-04-10

## Research question
Should `system-spec-kit` abandon its LEAF deep-research/deep-review pattern with externalized JSONL state in favor of a lighter, less explicit workflow model?

## Hypothesis
Relay's workflows are cleaner at the operator surface, but Public's single-iteration LEAF agents with externalized state still solve a real problem that should not be discarded.

## Method
Compared Public's `@deep-research` and `@deep-review` contracts with Relay's workflow runner, builder resume features, and workflow lifecycle controls.

## Evidence
- `@deep-research` executes one iteration at a time, reads JSONL and strategy files, writes `iteration-NNN.md`, appends JSONL, and progressively updates `research/research.md`. [SOURCE: .opencode/agent/deep-research.md:22-60] [SOURCE: .opencode/agent/deep-research.md:121-213]
- `@deep-review` mirrors that structure for review work, including state files, one-dimension focus, and append-only iteration logging. [SOURCE: .opencode/agent/deep-review.md:21-57] [SOURCE: .opencode/agent/deep-review.md:61-144]
- Relay also keeps durable run state and explicit recovery hooks rather than relying on pure in-memory continuity: the workflow runner supports `pause`, `unpause`, `abort`, and `resume`, while the builder exposes `startFrom()` and `previousRunId()`. [SOURCE: external/packages/sdk/src/workflows/README.md:524-551] [SOURCE: external/packages/sdk/src/workflows/builder.ts:224-239]
- Relay's coordinator persists workflow lifecycle state and step records in a workflow run store. [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:1-7] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:33-43]

## Analysis
Relay is simpler on the surface because it treats workflow state as part of a reusable runner instead of exposing iteration artifacts to the user. But that does not invalidate Public's core design choice. Fresh-context LEAF agents plus explicit externalized state remain a strong answer to long-loop context decay, auditability, and resumability. The problem is visibility and duplication, not the underlying pattern.

## Conclusion
confidence: high
finding: Public should keep the LEAF deep-loop model with externalized state. The right move is to reduce duplication and operator-facing artifact sprawl, not to replace the model with hidden in-memory continuity.

## Adoption recommendation for system-spec-kit
- **Target file or module:** deep-loop architecture and reducer ownership boundaries
- **Change type:** rejected replacement
- **Blast radius:** high
- **Prerequisites:** none; this is primarily a boundary decision
- **Priority:** rejected

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep research and deep review expose explicit iteration files, JSONL logs, strategy files, and progressive synthesis artifacts.
- **External repo's equivalent surface:** Relay also preserves run state, but hides more of it behind a workflow runner and builder API.
- **Friction comparison:** Relay is lighter for casual operators, but Public's explicit artifacts give stronger auditability and recovery for long-running research/review loops. The friction is justified when the loop itself is the product.
- **What system-spec-kit could DELETE to improve UX:** Delete redundant explanations of reducer-owned artifacts from front-door docs, not the artifacts themselves.
- **What system-spec-kit should ADD for better UX:** Add better summarization and hiding of reducer mechanics so most users see the outcome, not every state file.
- **Net recommendation:** KEEP

## Counter-evidence sought
Looked for proof that Relay achieves the same recovery and audit guarantees without durable run state; instead, Relay also stores workflow run and step lifecycle information.

## Follow-up questions for next iteration
- Which deep-loop artifacts should stay visible to operators versus reducer-owned only?
- Can the shared lifecycle engine reduce duplication without flattening domain-specific outputs?
- What is the minimum state packet needed for good recovery while keeping audits intact?
