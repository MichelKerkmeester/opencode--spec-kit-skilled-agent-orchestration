# Iteration 001 — Checksummed Research Journal

Date: 2026-04-09

## Research question
Can Babysitter's append-only journal model materially improve `system-spec-kit` deep-research auditability over the current JSONL-only state log?

## Hypothesis
Babysitter's one-event-per-file journal will provide stronger replay, corruption detection, and post-failure forensics than the current deep-research JSONL state log alone.

## Method
I traced Babysitter run creation and journal persistence from run initialization through replay validation, then compared that with the current `spec_kit:deep-research` command and `@deep-research` agent state contract.

## Evidence
- `createRun` creates the run directory, generates completion proof metadata, acquires a run lock, and records `RUN_CREATED` before hooks fire. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:12-26] [SOURCE: external/packages/sdk/src/runtime/createRun.ts:41-94]
- `appendEvent` writes every journal record as `000001.<ulid>.json`, stamps `recordedAt`, computes a SHA-256 checksum, and commits with atomic write semantics. [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49]
- Replay validation rejects sequence gaps, regressions, and ULID ordering mistakes before effect replay proceeds. [SOURCE: external/packages/sdk/src/runtime/replay/effectIndex.ts:107-147]
- The current autonomous deep-research workflow initializes a config file and a single JSONL state record as the durable session log. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180]
- The current deep-research agent contract appends one JSONL line per iteration rather than emitting a richer event stream with typed phases. [SOURCE: .opencode/agent/deep-research.md:167-172]

## Analysis
Babysitter's journal model is materially stronger than the current deep-research state log because it separates each state transition into an individually checksummed record and then validates monotonic ordering during replay. That gives operators a trustworthy answer to "what happened before the run stalled?" and "which record is corrupt?" instead of only "which iteration finished?" [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49] [SOURCE: external/packages/sdk/src/runtime/replay/effectIndex.ts:107-147]

`system-spec-kit` already has useful coarse-grained lineage via `deep-research-state.jsonl`, but the current contract is iteration-summary oriented, not execution-forensic oriented. A journal would not replace JSONL summaries; it would add an immutable event spine for init, dispatch, approval, convergence, synthesis, and save operations. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180] [SOURCE: .opencode/agent/deep-research.md:167-172]

## Conclusion
confidence: high

finding: Babysitter demonstrates that deterministic research workflows benefit from an append-only event journal in addition to human-readable summaries. `system-spec-kit` should keep its JSONL summaries, but add a checksummed event journal for high-value workflows like deep research and deep review so crashes, resumptions, and disputed state transitions become auditable instead of inferential.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, and a new journal helper under `.opencode/skill/system-spec-kit/scripts/core/`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** define a canonical event schema for `init`, `dispatch`, `waiting`, `approval`, `converged`, `synthesized`, and `memory_saved`
- **Priority:** should-have

## Counter-evidence sought
I looked for existing per-step checksummed journaling in the deep-research command and agent contract and found only config/state JSON plus iteration markdown summaries. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180] [SOURCE: .opencode/agent/deep-research.md:167-172]

## Follow-up questions for next iteration
- Could `session_resume` reuse a journal head the same way Babysitter reuses replay state?
- Which current Spec Kit workflows would benefit most from event-level replay: deep research, deep review, or resume?
- How much of Babysitter's journal value depends on its effect index rather than the raw files themselves?
