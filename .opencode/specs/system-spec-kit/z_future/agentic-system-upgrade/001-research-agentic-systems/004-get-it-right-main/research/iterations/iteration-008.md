# Iteration 008 — Keep Retry Feedback Out Of Durable Memory

Date: 2026-04-09

## Research question
Should Get It Right-style retry feedback be persisted into `system-spec-kit`'s durable memory system, or should it remain packet-local and disposable?

## Hypothesis
Retry feedback should stay task-local; durable memory is the wrong substrate for unstable attempt guidance.

## Method
I compared the external thread-boundary model with `system-spec-kit`'s current memory quality loop, memory-save boundary, and reducer-owned research artifacts.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-15] The external model keeps implementation work, checks, and refactoring ephemeral while only the reviewer bridge survives across attempts.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:160-170] The design goal is compression for the next attempt, not durable archival of every iteration's raw narrative.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:501-518] Internal durable memory creation is an end-of-session action with a hard boundary around `generate-context.js`, which implies a curated preservation step rather than per-attempt chatter.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:86-115] The internal quality loop already scores whether memory metadata is retrieval-worthy, which reinforces that not every transient artifact belongs in the durable memory system.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:118-136] Anchor and content quality checks assume a coherent, reusable artifact, not a volatile retry note meant to expire after the next attempt.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:361-369] `system-spec-kit` already maintains human-readable reducer outputs inside the packet itself, showing that packet-local observability is an accepted pattern distinct from memory persistence.

## Analysis
Retry feedback is valuable precisely because it is short-lived and specific to the next attempt. That makes it a poor durable memory artifact. Durable memory in this repo is curated, scored, indexed, and meant to help future sessions; retry feedback is more like attempt-local steering. The cleanest design is to store it in the packet as transient state and let only final synthesized findings reach durable memory.

## Conclusion
confidence: high
finding: `system-spec-kit` should explicitly keep retry feedback out of durable memory. The right home is packet-local state, likely reducer-owned or attempt-local files, with only final session summaries graduating into indexed memory.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** define the retry packet layout so the documentation can point to a concrete non-memory storage location
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the memory subsystem is intended to ingest volatile attempt guidance. The existing save boundary and quality scoring both imply the opposite: memory is for stable, retrievable artifacts.

## Follow-up questions for next iteration
- Should retry artifacts live under `scratch/`, a new `retry/` folder, or piggyback on `research/` conventions?
- What retention policy should packet-local retry state use?
- Do any existing internal reducers already support ephemeral state well enough to avoid a new storage model?
