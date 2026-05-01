# Iteration 014 — Durable Memory Must Leave The Loop-Critical Path

Date: 2026-04-10

## Research question
Does Get It Right imply that `system-spec-kit`'s current memory architecture is the wrong shape for retry and loop-critical state?

## Hypothesis
Yes. The durable memory pipeline is appropriate for curated session preservation, but it is too heavy to sit on the hot path of attempt-to-attempt steering.

## Method
I compared the external repo's narrow cross-iteration bridge with `system-spec-kit`'s `generate-context.js` save boundary, post-save review, memory quality gates, and metadata pipeline.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-28] Get It Right lets only review feedback survive between attempts and keeps the rest of the work ephemeral.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] The external design treats feedback as compression for the next attempt, not as durable archival.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93] `generate-context.js` expects structured JSON, authoritative spec-folder routing, and a durable `memory/` output contract.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:591-611] Post-save review is only defined for JSON-mode saves and turns the save into a reviewer contract rather than a dumb file write.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:653-717] The post-save reviewer checks title fidelity, trigger phrases, tiers, decisions, and context propagation against the payload.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:797-827] The same reviewer also checks metadata/frontmatter drift and anchor scaffolding consistency.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1080-1133] High-severity post-save issues can force manual patching or rejection.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-gates.ts:17-67] Indexing decisions are further gated by template validity, sufficiency, quality score, and validation disposition.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:76-176] The memory pipeline also infers classification, half-life, decay, and importance metadata.

## Analysis
This is not a bad pipeline. It is a pipeline solving a different problem. `system-spec-kit` memory artifacts are durable, indexed, scored, and designed for future retrieval. Get It Right's inter-attempt bridge is intentionally not that. It is a small working-state artifact meant to help only the next attempt. If retry-mode state is forced through the durable memory stack, the controller inherits payload curation, metadata drift checks, semantic sufficiency scoring, and post-save reviewer behavior that are unrelated to short-lived attempt steering. The external repo suggests a clearer split: durable memory at synthesis/handover boundaries, working-state artifacts inside the loop.

## Conclusion
confidence: high
finding: `system-spec-kit` should harden a two-lane architecture: packet-local working state for loop continuity, durable memory only for curated end-of-session or end-of-synthesis outputs.

## Adoption recommendation for system-spec-kit
- **Target file or module:** memory save architecture (`generate-context.js`, post-save review, and loop command contracts)
- **Change type:** architectural shift
- **Blast radius:** architectural
- **Prerequisites:** define an explicit non-memory working-state contract for retry and deep loops
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** durable memory is a rich JSON-primary workflow with validation, metadata inference, quality gates, and post-save review.
- **External repo's approach:** the only persistent loop-state artifact is a compact feedback bridge for the next attempt.
- **Why the external approach might be better:** it keeps the retry hot path lean and prevents volatile attempt data from inheriting durability, indexing, and metadata burdens.
- **Why system-spec-kit's approach might still be correct:** the current memory system is valuable for cross-session recall, auditability, and curated context preservation.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** formalize two lanes: `working state` (JSONL/Markdown under the packet, never indexed by default) and `durable memory` (generated only from synthesized outputs or explicit saves).
- **Blast radius of the change:** architectural
- **Migration path:** remove `generate-context.js` from any retry hot path first, then update deep-loop docs so only synthesis and handover paths touch durable memory.

## Counter-evidence sought
I looked for evidence that volatile attempt guidance is supposed to be indexed and retrieval-worthy. The pipeline instead treats memory saves as curated artifacts with explicit quality and provenance checks.

## Follow-up questions for next iteration
- Should retry and deep-loop working state share one schema family?
- Which loop artifacts are promotable into durable memory at synthesis time?
- Where should packet-local working-state retention rules live?
